import { afterEach, describe, expect, it, vi } from "vitest";
import { handleEnquiry } from "../lib/enquiry.server";

const payload = { name: "Alex", email: "alex@example.com", company: "", service: "Web", message: "Please contact me." };
const request = (body: unknown = payload, origin = "https://example.com") => new Request("https://example.com/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(body) });
const env = { RESEND_API_KEY: "test-key", ENQUIRY_FROM_EMAIL: "hello@example.com" };

afterEach(() => vi.unstubAllGlobals());

describe("enquiry endpoint", () => {
  it("sends the enquiry to the studio and uses the visitor's reply address", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await handleEnquiry(request(), env);
    expect(response.status).toBe(200);
    const mail = JSON.parse(fetchMock.mock.calls[0]![1].body);
    expect(mail.to).toEqual(["info.quadtricks@gmail.com"]);
    expect(mail.reply_to).toBe(payload.email);
    expect(mail.text).toContain(payload.message);
  });

  it("rejects invalid and cross-origin submissions without sending", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect((await handleEnquiry(request({ ...payload, email: "invalid" }), env)).status).toBe(400);
    expect((await handleEnquiry(request({ ...payload, name: "   " }), env)).status).toBe(400);
    expect((await handleEnquiry(request({ ...payload, email: "" }), env)).status).toBe(400);
    expect((await handleEnquiry(request(payload, "https://other.example"), env)).status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not report success when the provider rejects the message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 403 })));
    expect((await handleEnquiry(request(), env)).status).toBe(502);
  });
});
