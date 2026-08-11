import { useEffect } from "react";

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  jsonLd?: object | object[];
  canonical?: string;
}

const DEFAULT_TITLE = "LexVanguard Advocates LLP | Premier Student Law Firm & Mooting Powerhouse";
const DEFAULT_DESCRIPTION = "LexVanguard Advocates LLP is the premier student law firm founded at Mount Kenya University Parklands Law Campus (MKUPLC). Empowering youth in law, moot court championship advocacy, and innovative legal research.";
const DEFAULT_KEYWORDS = [
  "LexVanguard Advocates LLP",
  "Mooting",
  "Student law firms",
  "Law firms",
  "Mount Kenya University",
  "Mount Kenya University Parklands Law Campus",
  "MKUPLC",
  "Student organizations",
  "Youth in law",
  "Prince Micah",
  "Kelvin Musya",
  "Donel Aganyo",
  "Kenyan Law Students",
  "Legal Research Co-Helper",
  "Appellate Advocacy Kenya"
];
const DEFAULT_IMAGE = "https://www.lexvanguard.xyz/og-preview.png";
 
export function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  jsonLd,
  canonical
}: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | LexVanguard Advocates LLP` : DEFAULT_TITLE;
    document.title = fullTitle;

    const currentUrl = url || window.location.href;
    const canonicalUrl = canonical || currentUrl;

    // Helper function to update or create meta tag
    const setMeta = (attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentVal);
    };

    // Helper for link tags
    const setLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // Standard Meta Tags
    setMeta("name", "description", description);
    setMeta("name", "keywords", Array.isArray(keywords) ? keywords.join(", ") : keywords);
    setMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMeta("name", "author", "LexVanguard Advocates LLP - Founding Partners: Prince Micah, Kelvin Musya, Donel Aganyo");

    // OpenGraph Meta Tags
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", image);
    setMeta("property", "og:url", currentUrl);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", "LexVanguard Advocates LLP");
    setMeta("property", "og:locale", "en_US");

    // Twitter Card Meta Tags
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
    setMeta("name", "twitter:site", "@LexVanguardLLP");

    // Canonical Link
    setLink("canonical", canonicalUrl);

    // JSON-LD Structured Data
    const existingScripts = document.querySelectorAll("script[data-seo-jsonld]");
    existingScripts.forEach((s) => s.remove());

    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema, idx) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-jsonld", "true");
        script.setAttribute("id", `jsonld-${idx}`);
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

  }, [title, description, keywords, image, url, type, jsonLd, canonical]);

  return null;
}

export default SEOHead;
