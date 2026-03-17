import { calculateAge } from "./calculateAge";

export const checkProfileCompletion = (user: any): boolean => {
  if (!user.firstName) return false;
  if (!user.lastName) return false;
  if (!user.gender) return false;
  if (!user.birthdate) return false;

  const age = calculateAge(user.birthdate);
  if (age < 18) return false;
  
  // At least 1 photo required
  if (!user.photos || user.photos.length === 0) return false;

  return true;
};