import type { ApiUser } from '@/api/types';

export const MINIMUM_DATING_AGE = 18;

export const parseDateOfBirth = (
  dateOfBirth?: string | null,
): Date | null => {
  if (!dateOfBirth) {
    return null;
  }

  const directDate = new Date(dateOfBirth);
  if (!Number.isNaN(directDate.getTime())) {
    return directDate;
  }

  const normalizedDob = dateOfBirth.replace(/\./g, '-').replace(/\//g, '-');
  const parts = normalizedDob.split('-').map(part => part.trim());

  if (parts.length === 3) {
    const [first, second, third] = parts;

    const isDayFirst = Number(first) <= 31 && Number(second) <= 12;
    const day = Number(isDayFirst ? first : second);
    const month = Number(isDayFirst ? second : first);
    const year = Number(third.length === 4 ? third : third.padStart(4, '20'));

    if (
      Number.isFinite(day) &&
      Number.isFinite(month) &&
      Number.isFinite(year)
    ) {
      const candidate = new Date(year, month - 1, day);
      if (!Number.isNaN(candidate.getTime())) {
        return candidate;
      }
    }
  }

  return null;
};

export const calculateAge = (date: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < date.getDate())
  ) {
    age -= 1;
  }

  return age;
};

export const getAgeFromDateOfBirth = (
  dateOfBirth?: string | null,
): number | null => {
  const parsed = parseDateOfBirth(dateOfBirth);
  if (!parsed) {
    return null;
  }
  return calculateAge(parsed);
};

export const getAgeFromProfile = (
  profile?: ApiUser['profile'] | null,
): number | null => {
  if (!profile) {
    return null;
  }
  return getAgeFromDateOfBirth(profile.dateOfBirth ?? null);
};

export const isUnderMinimumAge = (
  age: number | null,
  minimumAge: number = MINIMUM_DATING_AGE,
): boolean => {
  if (age === null) {
    return false;
  }
  return age < minimumAge;
};

export const isProfileUnderMinimumAge = (
  profile?: ApiUser['profile'] | null,
  minimumAge: number = MINIMUM_DATING_AGE,
): boolean => {
  return isUnderMinimumAge(getAgeFromProfile(profile), minimumAge);
};


