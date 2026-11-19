import ridoz1 from "@/assets/work/ridoz-1.png.asset.json";
import ridoz2 from "@/assets/work/ridoz-2.png.asset.json";
import ridoz3 from "@/assets/work/ridoz-3.png.asset.json";
import ridoz4 from "@/assets/work/ridoz-4.png.asset.json";
import ridoz5 from "@/assets/work/ridoz-5.png.asset.json";
import ridoz6 from "@/assets/work/ridoz-6.png.asset.json";
import ridoz7 from "@/assets/work/ridoz-7.png.asset.json";
import ebIcon from "@/assets/work/easybasket-icon-new.png.asset.json";
import ebList from "@/assets/work/easybasket-list.png.asset.json";
import ebListNew from "@/assets/work/easybasket-list-new.png.asset.json";
import ebVeg from "@/assets/work/easybasket-veg.png.asset.json";
import noor1 from "@/assets/work/noor-1.png.asset.json";
import noor2 from "@/assets/work/noor-2.png.asset.json";
import noor3 from "@/assets/work/noor-3.png.asset.json";
import noor4 from "@/assets/work/noor-4.png.asset.json";
import noor5 from "@/assets/work/noor-5.png.asset.json";
import noorLogo from "@/assets/work/noor-logo.png.asset.json";

export const services = [
  { n: "01", title: "Website Design & Development", text: "Fast, modern websites that look sharp on every screen and are easy for you to update." },
  { n: "02", title: "Web Application Development", text: "Custom web apps, dashboards and portals built around how your business actually works." },
  { n: "03", title: "Mobile Application Development", text: "iOS and Android apps from first idea to app-store launch." },
  { n: "04", title: "Logo Design & Brand Identity", text: "Logos, colours and brand guidelines that make you instantly recognisable." },
  { n: "05", title: "Animation & Promotional Videos", text: "Motion graphics and promo videos that explain your product and grab attention." },
  { n: "06", title: "Cloud Services & Solutions", text: "Hosting, deployment and cloud setup that keeps your product fast, secure and online." },
];

export const reasons = [
  { title: "One team, end to end", text: "Brand, design, development, video and cloud from the same people. You brief once and never manage four vendors." },
  { title: "Design and engineering, both in-house", text: "We are not a design shop that outsources code or a dev shop that outsources design. Both disciplines sit at the same table from day one." },
  { title: "Built for India, the Gulf and beyond", text: "We work across India, the UAE and the GCC, and with clients in the US, Canada and the UK. We understand different markets, time zones and expectations." },
  { title: "A year of support, included", text: "Every project comes with one year of support for bug fixes and small content changes. New features are scoped and quoted separately, so there are no surprises." },
];

export const process = [
  { step: "Discover", text: "We learn your business and agree the scope.", items: ["A written scope", "A project plan", "A quote"] },
  { step: "Design", text: "You see it before we build it.", items: ["Wireframes", "Visual designs", "A clickable prototype where useful"] },
  { step: "Build", text: "Development in the open, with regular check-ins.", items: ["Working previews", "Device testing", "Progress updates"] },
  { step: "Launch", text: "We deploy, hand over and document everything.", items: ["Deployment", "Full ownership", "Documentation"] },
  { step: "Support", text: "One year of included support.", items: ["Bug fixes for 12 months", "Small content changes", "Clear quotes for anything new"] },
];

export type Project = {
  title: string; type: string; text: string; images: string[]; device: "web" | "mobile";
  coverImage?: string; icon?: string; clientSuggestions?: string; contribution?: string; technologies?: string[];
  approach?: string; siteUrl?: string;
  industry?: string; platform?: string; location?: string; overview?: string;
  clientGoals?: string[]; strategyPoints?: string[]; designUx?: string; designPoints?: string[];
};

export function projectSlug(project: Pick<Project, "title">) {
  return project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function findProject(slug: string) {
  return projects.find((project) => projectSlug(project) === slug);
}

export const projects: Project[] = [
  { title: "Ridoz Style", type: "Web Application", text: "A website for an innerwear brand that sells to both retail customers and wholesale buyers.", images: [ridoz1.url, ridoz4.url, ridoz5.url, ridoz6.url, ridoz7.url, ridoz2.url, ridoz3.url], coverImage: "/ridoz-cover.png", device: "web", siteUrl: "https://ridoz.vercel.app/" },
  { title: "EasyBasket", type: "Mobile App", text: "A bilingual shopping-list app to browse groceries by category, build your list and share it in a tap.", images: [ebListNew.url, ebList.url, ebVeg.url], coverImage: "/EasyBasket.png", device: "mobile", icon: ebIcon.url, siteUrl: "https://play.google.com/store/apps/details?id=com.kerala.shoppinglist" },
  { title: "Noor Al Rida", type: "Web Application", text: "A website for a custom joinery and furniture manufacturer in Ras Al Khaimah, UAE.", images: [noor3.url, noor4.url, noor5.url, noor1.url, noor2.url], coverImage: "/noor.png", device: "web", icon: noorLogo.url, siteUrl: "https://www.nooralrida.ae/", industry: "Custom Joinery & Furniture", platform: "Website", location: "Ras Al Khaimah, UAE" },
  { title: "RestaurantMenu", type: "Mobile App", text: "A mobile app that lets diners scan a QR code and browse the restaurant's menu.", images: [], coverImage: "/RestaurantMenu.png", device: "mobile" },
];

export const contact = {
  email: "info.quadtricks@gmail.com",
  whatsapp: ["+91 85905 53179", "+91 95627 70735"],
  location: "Kochi, India",
  serving: "Serving India, UAE, GCC and clients worldwide.",
};
