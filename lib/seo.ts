export const SITE_URL = "https://www.intentional.studio";
export const SITE_NAME = "Intentional Studio";
export const LEGAL_NAME = "Intentional Studio AI, LLC";
export const FOUNDER_NAME = "Mei Liu";
export const CONTACT_EMAIL = "mei@intentional.studio";
export const GITHUB_URL = "https://github.com/cmeiliu/";
export const LINKEDIN_URL = "https://www.linkedin.com/in/mei-liu-512";
export const COMPANY_LINKEDIN_URL =
  "https://www.linkedin.com/company/intentional-studio";
export const WOMEN_WE_ADMIRE_URL = "https://thewomenweadmire.com/leaders/mei-liu/";

export const organizationId = `${SITE_URL}/#organization`;
export const personId = `${SITE_URL}/#mei-liu`;
export const websiteId = `${SITE_URL}/#website`;
export const organizationSameAs = [COMPANY_LINKEDIN_URL];
export const personSameAs = [GITHUB_URL, LINKEDIN_URL, WOMEN_WE_ADMIRE_URL];

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function serializeJsonLd(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
