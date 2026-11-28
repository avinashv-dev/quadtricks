import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(160),
  service: z.string().trim().max(160),
  message: z.string().trim().min(1).max(5000),
});

type MailEnvironment = { RESEND_API_KEY?: string; ENQUIRY_FROM_EMAIL?: string };

export async function handleEnquiry(request: Request, env: MailEnvironment = {}) {
  const respond = (status: number) => Response.json({ ok: status === 200 }, { status, headers: { "Cache-Control": "no-store" } });
  if (request.method !== "POST") return respond(405);
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return respond(403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return respond(415);
  if (Number(request.headers.get("content-length") || 0) > 16384) return respond(413);

  let data: z.infer<typeof enquirySchema>;
  try {
    const body = await request.text();
    if (body.length > 16384) return respond(413);
    const parsed = enquirySchema.safeParse(JSON.parse(body));
    if (!parsed.success) return respond(400);
    data = parsed.data;
  } catch {
    return respond(400);
  }

  const localEnv = typeof process === "undefined" ? undefined : process.env;
  const apiKey = env.RESEND_API_KEY ?? localEnv?.RESEND_API_KEY;
  const from = env.ENQUIRY_FROM_EMAIL ?? localEnv?.ENQUIRY_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Enquiry mail service is not configured.");
    return respond(503);
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: ["info.quadtricks@gmail.com"],
        reply_to: data.email,
        subject: "New Quadtricks project enquiry",
        text: `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || "Not provided"}\nService: ${data.service || "Not provided"}\n\nProject details:\n${data.message}`,
      }),
    });
    if (!response.ok) {
      console.error(`Enquiry mail provider returned ${response.status}.`);
      return respond(502);
    }
    return respond(200);
  } catch (error) {
    console.error("Enquiry mail request failed", error);
    return respond(502);
  }
}
