export const services = [
  { title: "Website Design & Development", text: "Fast modern websites built with responsive designs that look great and work smoothly across all devices." },
  { title: "Web Application Development", text: "Custom web apps, dashboards and portals built around how your business actually works." },
  { title: "Mobile Application Development", text: "Android and iOS apps from first idea to app-store launch." },
  { title: "Logo Design & Brand Identity", text: "Logos, colours and brand guidelines that make you instantly recognisable." },
  { title: "Animation & Promotional Videos", text: "Motion graphics and promo videos that explain your product and grab attention." },
  { title: "Cloud Services & Solutions", text: "Hosting, deployment and cloud solutions that keeps your product fast, secure and online." },
];

export const reasons = [
  { title: "One team, end to end", text: "Brand, design, development, video and cloud from the same people. You brief once and never manage four vendors." },
  { title: "Design and engineering, both in-house", text: "We are not a design shop that outsources code or a dev shop that outsources design. Both disciplines sit at the same table from day one." },
  { title: "Built for India, the Gulf and beyond", text: "We work across India, the UAE and the GCC, and with clients in the US, Canada and the UK. We understand different markets, time zones and expectations." },
  { title: "A year of support, included", text: "Every project comes with one year of support for bug fixes and small content changes. New features are scoped and quoted separately, so there are no surprises." },
];

export const process = [
  { step: "Discover", text: "We learn your business and agree the scope.", items: ["A written scope", "A project plan", "A quote"] },
  { step: "Design", text: "You see it before we build it.", items: ["Visual designs", "A clickable prototype where useful"] },
  { step: "Build", text: "Development in the open, with regular check-ins.", items: ["Working previews", "Device testing", "Progress updates"] },
  { step: "Launch", text: "We deploy, hand over and document everything.", items: ["Deployment", "Full ownership", "Documentation"] },
  { step: "Support", text: "One year of included support.", items: ["Bug fixes for 12 months", "Small content changes", "Clear quotes for anything new"] },
];

export type Project = {
  title: string; slug?: string; type: string; text: string; images: string[]; device: "web" | "mobile";
  coverImage?: string; icon?: string; clientSuggestions?: string; contribution?: string; technologies?: string[];
  approach?: string; siteUrl?: string;
  showcaseVideo?: string;
  industry?: string; platform?: string; location?: string; overview?: string;
  clientGoals?: string[]; strategyPoints?: string[]; designUx?: string; designPoints?: string[];
};

export function projectSlug(project: Pick<Project, "title" | "slug">) {
  return project.slug ?? project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function findProject(slug: string) {
  return projects.find((project) => projectSlug(project) === slug);
}

const responsiveImagePattern = /^\/(ridoz|easybucket|noor|planazo)\/([^/]+\.webp)$/;

export function projectImageVariant(source: string | undefined, width: 480 | 960 | 1440) {
  if (!source) return undefined;
  const match = source.match(responsiveImagePattern);
  return match ? `/${match[1]}/${width}/${match[2]}` : source;
}

export function projectImageSrcSet(source: string | undefined) {
  if (!source || !responsiveImagePattern.test(source)) return undefined;
  return `${projectImageVariant(source, 480)} 480w, ${projectImageVariant(source, 960)} 960w, ${projectImageVariant(source, 1440)} 1440w`;
}

const sharedTechnologies = ["React", "TypeScript", "Tailwind CSS", "Vite", "Framer Motion", "TanStack Router"];

export const projects: Project[] = [
  { title: "Ridoz Style", type: "Web Application", text: "A website for an innerwear brand that sells to both retail customers and wholesale buyers.", images: ["/ridoz/1.webp", "/ridoz/2.webp", "/ridoz/3.webp", "/ridoz/4.webp", "/ridoz/5.webp", "/ridoz/6.webp"], coverImage: "/ridoz-cover.webp", showcaseVideo: "/ridoz/ridoz-video.webm", device: "web", siteUrl: "https://ridozstyle.com/", technologies: sharedTechnologies, clientGoals: ["Establish A Professional And Trustworthy Online Presence", "Improve User Experience Across All Devices", "Simplify Navigation And Information Structure", "Encourage Appointment Inquiries Through Clear CTAs", "Improve Overall Site Performance And Loading Speed"], approach: "We followed a structured, user-focused approach to ensure the redesign aligned with both business objectives and user expectations.", strategyPoints: ["Conducted A Detailed Website Audit And Competitor Analysis", "Restructured Content For Better Clarity And Flow", "Designed A Clean, Modern UI Focused On Trust And Accessibility", "Implemented Responsive Layouts For Mobile And Tablet Users", "Optimized Performance And Page Loading Speed"], designUx: "The design emphasizes a calm, professional aesthetic suitable for the healthcare industry. Clean typography, balanced spacing, and a consistent color palette enhance readability and trust.", designPoints: ["Simplified Navigation Menus", "Clear Visual Hierarchy", "Accessible Design For All Age Groups", "Prominent Call-To-Action Placements"] },
  {
    title: "Easy Basket",
    slug: "easybasket",
    type: "Mobile App",
    text: "A bilingual shopping-list app to browse groceries by category, build your list and share it in a tap.",
    images: [
      "/easybucket/1.webp",
      "/easybucket/2.webp",
      "/easybucket/3.webp",
      "/easybucket/4.webp",
      "/easybucket/5.webp",
      "/easybucket/6.webp",
      "/easybucket/7.webp",
      "/easybucket/8.webp",
    ],
    coverImage: "/EasyBasket.webp",
    device: "mobile",
    icon: "/EasyBasket.webp",
    siteUrl: "https://play.google.com/store/apps/details?id=com.kerala.shoppinglist",
    technologies: sharedTechnologies,
    overview: "Make grocery shopping simpler with EasyBasket – My Shopping List, your convenient companion for organising everyday shopping.\n\nCreate and manage your shopping list, browse grocery products, choose quantities and keep your shopping organised in one place.",
    clientGoals: [
      "Make Everyday Grocery Planning Fast And Effortless",
      "Streamline Category Browsing And List Building",
      "Deliver Smooth Bilingual Support Across Languages",
      "Enable Instant One-Tap List Sharing With Family Or Roommates",
      "Keep The App Fast, Lightweight, And Reliable On Mobile",
    ],
    approach: "We took a practical, user-first approach to make grocery prep quicker in real-world shopping moments—from kitchen counters to crowded aisles.",
    strategyPoints: [
      "Researched Everyday Grocery Habits And Bilingual Shopping Needs",
      "Organized Categories For Faster Scanning And List Creation",
      "Designed A Clean, Distraction-Free Mobile Interface",
      "Built Smooth Language Switching Without Breaking Layout Flow",
      "Tuned Performance For Instant Taps And Quick Load Times",
    ],
    designUx: "The design emphasizes a calm, professional aesthetic suitable for the healthcare industry. Clean typography, balanced spacing, and a consistent color palette enhance readability and trust.",
    designPoints: [
      "Simplified Navigation Menus",
      "Clear Visual Hierarchy",
      "Accessible Design For All Age Groups",
      "Prominent Call-To-Action Placements",
    ],
  },
  {
    title: "Noor Al Rida",
    type: "Web Application",
    text: "A website for a custom joinery and furniture manufacturer in Ras Al Khaimah, UAE.",
    images: ["/noor/1.webp", "/noor/2.webp", "/noor/3.webp", "/noor/4.webp", "/noor/5.webp"],
    coverImage: "/noor.webp",
    showcaseVideo: "/noor/noor-video.webm",
    device: "web",
    icon: "/noor.webp",
    siteUrl: "https://www.nooralrida.ae/",
    industry: "Custom Joinery & Furniture",
    platform: "Website",
    location: "Ras Al Khaimah, UAE",
    technologies: sharedTechnologies,
    clientGoals: [
      "Showcase Bespoke Craftsmanship And Custom Joinery Capabilities",
      "Establish A Refined, Credible Digital Presence In The UAE",
      "Organize Residential, Commercial, And Fit-Out Services Clearly",
      "Drive Custom Quote Requests And Project Consultations",
      "Deliver A Fast, Seamless Browsing Experience Across All Devices",
    ],
    approach: "We followed a structured, brand-led approach to position Noor Al Rida as a trusted partner for custom woodwork, interiors, and bespoke furniture across Ras Al Khaimah and the wider UAE.",
    strategyPoints: [
      "Analyzed Regional Joinery Competitors And Client Expectations",
      "Structured Service Categories For Easy Project Discovery",
      "Designed A Modern, Refined Interface Highlighting Craftsmanship",
      "Built Responsive Layouts For Mobile, Tablet, And Desktop Viewing",
      "Optimized High-Resolution Galleries For Fast Page Loading",
    ],
    designUx: "The design balances architectural elegance with effortless navigation. Clean typography, generous spacing, and warm, material-inspired tones let custom woodwork and finished interiors take center stage.",
    designPoints: [
      "Streamlined Service & Portfolio Navigation",
      "Visual-First Layout Showcasing Custom Finishes",
      "Intuitive Browsing For Contractors, Designers, And Homeowners",
      "Prominent Quote & Consultation Call-To-Action Placements",
    ],
  },
  {
    title: "Planazo Events",
    type: "Web Application",
    text: "A digital invitation platform for designing, personalizing and sharing invitations for life's celebrations.",
    images: ["/planazo/1.webp", "/planazo/2.webp", "/planazo/3.webp", "/planazo/4.webp", "/planazo/5.webp", "/planazo/6.webp"],
    coverImage: "/planazo-events-logo.webp",
    showcaseVideo: "/planazo/planazo-video.webm",
    device: "web",
    icon: "/planazo-events-logo.webp",
    siteUrl: "https://planazo.in/",
    industry: "Digital Invitations & Events",
    platform: "Website",
    technologies: ["React", "Vite", "React Router", "Tailwind CSS", "Framer Motion", "REST API"],
    overview: "Planazo Events is a digital invitation platform that lets hosts design, personalize and share invitations for life's celebrations. We designed occasion-specific theme collections for Baptisms and Birthdays, each with its own palette, typography and event card styles. We also restructured the host dashboard into clear, editable invitation sections, so creating an invite feels simple and quick on desktop and mobile.",
    clientGoals: [
      "Let hosts create beautiful digital invitations in minutes",
      "Offer themed designs for every occasion, including Baptisms and Birthdays",
      "Give hosts one clear dashboard to manage every part of an invitation",
      "Make invitations look great on every phone and screen",
      "Keep the editing experience simple for non-technical users",
    ],
    approach: "We focused on how hosts actually plan events. They want to pick a look, add their details and share quickly, without fighting a complicated editor.",
    strategyPoints: [
      "Mapped the host journey from choosing a theme to sharing the invite",
      "Split the dashboard into clear invitation sections that are easy to edit",
      "Built reusable theme systems so new occasions can launch quickly",
      "Defined consistent event card styles across all themes",
      "Built responsive views for desktop and mobile",
    ],
    designUx: "The experience prioritizes warmth, clarity and celebration. Every theme feels made for its occasion, and the dashboard keeps each step focused so hosts never get lost.",
    designPoints: [
      "Occasion-specific themes with distinct palettes and typography",
      "Section-based dashboard with a clear visual hierarchy",
      "Consistent, elegant event cards for key details like date, venue and RSVP",
      "Mobile-first layouts that are tested on desktop and mobile",
    ],
  },
  {
    title: "Restaurant Menu",
    slug: "restaurantmenu",
    type: "Mobile App",
    text: "A mobile app that lets diners scan a QR code and browse the restaurant's menu.",
    images: [],
    coverImage: "/RestaurantMenu.webp",
    device: "mobile",
    technologies: sharedTechnologies,
    clientGoals: [
      "Enable Instant QR Scan Access Without Heavy App Downloads",
      "Make Dish Discovery And Menu Browsing Fast At The Table",
      "Highlight Signature Dishes, Pricing, And Dietary Tags Clearly",
      "Reduce Friction For Diners Ordering In Busy Dining Rooms",
      "Deliver Fast, Reliable Performance Even On Patchy Restaurant Wi-Fi",
    ],
    approach: "We focused on real dining-room behavior—where diners want quick answers on ingredients, portions, and specials right after sitting down.",
    strategyPoints: [
      "Mapped Table-Side Scanning Flows And Diner Decision Moments",
      "Structured Menu Sections For Rapid Dish Scanning And Filtering",
      "Designed A Clean, Appetizing Mobile Interface With Clear Hierarchy",
      "Built Responsive Views For Any Smartphone Screen Size",
      "Optimized Images And Assets For Near-Instant Load Times",
    ],
    designUx: "The experience prioritizes legibility, scannability, and zero-clutter browsing in dim or bright restaurant lighting. Clear dish titles, prices, and quick category jumps help guests decide without endless scrolling.",
    designPoints: [
      "Fast Category Jump & Dish Search Controls",
      "Clear Visual Hierarchy For Dishes, Prices, And Add-Ons",
      "High-Contrast Readability Across Lighting Conditions",
      "Prominent Actions For Specials, Combos, Or Staff Assistance",
    ],
  },
];

export const contact = {
  email: "info.quadtricks@gmail.com",
  whatsapp: ["+91 85905 53179", "+91 95627 70735"],
  location: "Kochi, India",
  serving: "Serving India, Middle East and Worldwide.",
};
