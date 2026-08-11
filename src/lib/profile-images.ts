export const DEFAULT_FALLBACK_AVATAR = "/default.png";

export const NAME_TO_PROFILE_IMAGE: Record<string, string> = {
  "prince": "/images/profiles/prince.jpeg",
  "prince micah": "/images/profiles/prince.jpeg",
  "kelvin": "/images/profiles/kelvin.jpeg",
  "kelvin musya": "/images/profiles/kelvin.jpeg",
  "don": "/images/profiles/don.jpeg",
  "donel": "/images/profiles/don.jpeg",
  "donel aganyo": "/images/profiles/don.jpeg",
  "linet": "/images/profiles/linet.jpeg",
  "linet njeri": "/images/profiles/linet.jpeg",
  "sharon mwariri": "/images/profiles/sharon-mwariri.jpeg",
  "sharon kioko": "/images/profiles/sharon-kioko.png",
  "samuel": "/images/profiles/samuel.jpeg",
  "sherifa": "/images/profiles/sherifa.jpeg",
  "sherifa abdilatif": "/images/profiles/sherifa.jpeg",
  "kirui": "/images/profiles/kirui.jpeg",
  "kimathi winner": "/images/profiles/kirui.jpeg",
  "kimathi": "/images/profiles/kirui.jpeg",
  "evaton": "/images/profiles/evaton.jpeg",
  "esther": "/images/profiles/esther-karira.jpeg",
  "esther karira": "/images/profiles/esther-karira.jpeg",
  "estelle": "/images/profiles/estelle.jpeg",
};

/**
 * Resolves a user's profile image based on their name and current image string.
 * Uses user-uploaded photos (e.g. ImgBB) or local profile photos in /images/profiles/.
 * If none, defaults to /default.png (Strictly no Dicebear).
 */
export function resolveProfileImage(name?: string, currentImg?: string): string {
  if (currentImg && typeof currentImg === "string" && currentImg.trim() !== "") {
    const trimmed = currentImg.trim();
    const isDicebear = trimmed.includes("dicebear");
    const isUnsplashFake = trimmed.includes("unsplash.com");
    const is37Signals = trimmed.includes("37signals.com");
    const isGenericPlaceholder = trimmed.includes("placeholder");

    if (!isDicebear && !isUnsplashFake && !is37Signals && !isGenericPlaceholder) {
      return trimmed;
    }
  }

  if (!name) return DEFAULT_FALLBACK_AVATAR;

  const cleanName = name.toLowerCase().trim();

  // 1. Direct key match
  if (NAME_TO_PROFILE_IMAGE[cleanName]) {
    return NAME_TO_PROFILE_IMAGE[cleanName];
  }

  // 2. Substring matching
  if (cleanName.includes("prince")) return "/images/profiles/prince.jpeg";
  if (cleanName.includes("kelvin")) return "/images/profiles/kelvin.jpeg";
  if (cleanName.includes("donel") || cleanName.includes("don ")) return "/images/profiles/don.jpeg";
  if (cleanName.includes("linet")) return "/images/profiles/linet.jpeg";
  if (cleanName.includes("sharon mwariri")) return "/images/profiles/sharon-mwariri.jpeg";
  if (cleanName.includes("sharon kioko") || cleanName.includes("kioko")) return "/images/profiles/sharon-kioko.png";
  if (cleanName.includes("sharon")) return "/images/profiles/sharon-mwariri.jpeg";
  if (cleanName.includes("samuel")) return "/images/profiles/samuel.jpeg";
  if (cleanName.includes("sherifa")) return "/images/profiles/sherifa.jpeg";
  if (cleanName.includes("kirui") || cleanName.includes("kimathi")) return "/images/profiles/kirui.jpeg";
  if (cleanName.includes("evaton")) return "/images/profiles/evaton.jpeg";
  if (cleanName.includes("esther")) return "/images/profiles/esther-karira.jpeg";
  if (cleanName.includes("estelle")) return "/images/profiles/estelle.jpeg";

  return DEFAULT_FALLBACK_AVATAR;
}
