import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://barghouth.me";
const SITE_NAME = "barghouth.me";
const DEFAULT_IMAGE = `${SITE_URL}/hero-main.jpg`;

type SeoEntry = {
  title: string;
  description: string;
  keywords: string;
};

const ROUTE_SEO: Record<string, SeoEntry> = {
  "/": {
    title: "Saad Barghouth | GIS Team Leader & Web GIS Developer",
    description:
      "Saad Barghouth delivers GIS consulting, Web GIS apps, ArcGIS dashboards, geodatabase QA/QC, spatial automation, and React GIS interfaces.",
    keywords:
      "Saad Barghouth, Saad Elsayed Barghouth, سعد برغوث, سعد السيد برغوث, GIS consultant, Web GIS developer, ArcGIS dashboards, Enterprise GIS, React GIS apps",
  },
  "/about": {
    title: "About Saad Barghouth | GIS Team Leader",
    description:
      "Learn about Saad Barghouth, a GIS Team Leader focused on enterprise GIS, spatial data quality, ArcGIS delivery, and stakeholder-ready mapping.",
    keywords:
      "Saad Barghouth biography, GIS Team Leader, enterprise GIS specialist, spatial data consultant, سعد برغوث",
  },
  "/skills": {
    title: "GIS & Web GIS Skills | ArcGIS, PostGIS, Python, React",
    description:
      "Explore Saad Barghouth's GIS toolkit: ArcGIS Pro, ArcGIS Online, Experience Builder, Survey123, PostGIS, Python ArcPy, React, and TypeScript.",
    keywords:
      "ArcGIS Pro, ArcGIS Online, Experience Builder, Survey123, PostGIS, Python ArcPy, React TypeScript, Web GIS skills",
  },
  "/projects": {
    title: "GIS Projects | Web GIS, Dashboards, Automation",
    description:
      "GIS and Web GIS project examples by Saad Barghouth, including ArcGIS dashboards, geodatabase design, QA/QC, field apps, and React interfaces.",
    keywords:
      "GIS projects, Web GIS projects, ArcGIS dashboards, geodatabase QA/QC, spatial automation, React GIS apps",
  },
  "/gallery": {
    title: "GIS Gallery | Maps, Dashboards & Delivery Moments",
    description:
      "Visual gallery for Saad Barghouth's GIS delivery work, including project reviews, mapping outputs, dashboards, training, and field context.",
    keywords:
      "GIS gallery, ArcGIS maps, dashboard gallery, GIS training, Web GIS visuals, Saad Barghouth",
  },
  "/experience": {
    title: "GIS Experience | Saad Barghouth",
    description:
      "Professional GIS experience, certifications, and delivery background for Saad Barghouth across enterprise GIS, ArcGIS, QA/QC, and automation.",
    keywords:
      "GIS experience, GIS certifications, ArcGIS specialist, GIS Team Leader, Saad Elsayed Barghouth",
  },
  "/process": {
    title: "GIS Delivery Process | Data, QA/QC, Automation, Handover",
    description:
      "A repeatable GIS delivery process for discovery, geodatabase modeling, spatial automation, QA/QC gates, publishing, and handover.",
    keywords:
      "GIS delivery process, geodatabase modeling, QA/QC gates, spatial automation, ArcGIS handover",
  },
  "/testimonials": {
    title: "GIS Testimonials | Saad Barghouth Client Feedback",
    description:
      "Client and collaborator feedback on Saad Barghouth's GIS, Web GIS, dashboards, automation, training, and spatial data delivery.",
    keywords:
      "GIS testimonials, Web GIS feedback, ArcGIS consultant reviews, Saad Barghouth clients",
  },
  "/contact": {
    title: "Contact Saad Barghouth | Hire GIS & Web GIS Consultant",
    description:
      "Hire Saad Barghouth for GIS, Web GIS, ArcGIS dashboards, geodatabase QA/QC, spatial data automation, and React GIS applications.",
    keywords:
      "hire GIS consultant, contact Web GIS developer, ArcGIS consultant, Saad Barghouth contact, سعد برغوث",
  },
};

function absoluteUrl(pathname: string) {
  return `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
}

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value);
  }
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function buildJsonLd(pathname: string, seo: SeoEntry) {
  const url = absoluteUrl(pathname);
  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Saad Elsayed Barghouth",
      alternateName: ["Saad Barghouth", "سعد برغوث", "سعد السيد برغوث"],
      url: SITE_URL,
      image: DEFAULT_IMAGE,
      jobTitle: "GIS Team Leader",
      email: "mailto:saad@barghouth.me",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Giza",
        addressCountry: "EG",
      },
      sameAs: [
        "https://www.linkedin.com/in/saadbarghouth/",
        "https://github.com/saadbarghouth2-blip",
        "https://www.youtube.com/@Saad_Barghouth",
        "https://www.facebook.com/people/Saad-Elsayed-Barghouth/",
      ],
      knowsAbout: [
        "GIS consulting",
        "Web GIS development",
        "ArcGIS dashboards",
        "Enterprise GIS",
        "Geodatabase QA/QC",
        "Spatial data automation",
        "React GIS applications",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: "Saad Barghouth GIS & Web GIS Services",
      url: SITE_URL,
      image: DEFAULT_IMAGE,
      description:
        "GIS consulting, Web GIS development, ArcGIS dashboards, geodatabase QA/QC, spatial automation, and React GIS applications.",
      provider: { "@id": `${SITE_URL}/#person` },
      areaServed: ["Egypt", "Middle East", "Worldwide"],
      serviceType: [
        "GIS Consulting",
        "Web GIS Development",
        "ArcGIS Dashboards",
        "Geodatabase Design",
        "Spatial Automation",
        "React GIS Apps",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: ROUTE_SEO["/"].description,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: seo.title,
      url,
      description: seo.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: DEFAULT_IMAGE,
      },
    },
  ];

  if (pathname !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: seo.title.split("|")[0].trim(),
          item: url,
        },
      ],
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export default function Seo() {
  const location = useLocation();
  const pathname = location.pathname === "" ? "/" : location.pathname;
  const seo = ROUTE_SEO[pathname] ?? ROUTE_SEO["/"];

  const jsonLd = useMemo(() => buildJsonLd(pathname, seo), [pathname, seo]);

  useEffect(() => {
    const canonical = absoluteUrl(pathname);

    document.documentElement.lang = "en";
    document.title = seo.title;

    upsertMeta('meta[name="description"]', { name: "description", content: seo.description });
    upsertMeta('meta[name="keywords"]', { name: "keywords", content: seo.keywords });
    upsertMeta('meta[name="author"]', { name: "author", content: "Saad Barghouth" });
    upsertMeta('meta[name="robots"]', { name: "robots", content: "index, follow" });

    upsertLink("canonical", canonical);

    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: seo.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: seo.description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: DEFAULT_IMAGE });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: "en_US" });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: seo.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: seo.description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: DEFAULT_IMAGE });

    let script = document.head.querySelector<HTMLScriptElement>('script[data-seo-json-ld="true"]');
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoJsonLd = "true";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }, [jsonLd, pathname, seo]);

  return null;
}
