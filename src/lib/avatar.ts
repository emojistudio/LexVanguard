import { resolveProfileImage, DEFAULT_FALLBACK_AVATAR } from "./profile-images";

export const DEFAULT_AVATAR_URL = DEFAULT_FALLBACK_AVATAR;

export function detectGender(_name: string): 'male' | 'female' {
  return 'male';
}

export function makeAvatarSvg(name?: string, _genderPreference?: 'male' | 'female' | 'auto'): string {
  return resolveProfileImage(name);
}



