export const getBirthdateRange = (minAge: number, maxAge: number) => {
  const today = new Date();

  const minDate = new Date(
    today.getFullYear() - maxAge,
    today.getMonth(),
    today.getDate()
  );

  const maxDate = new Date(
    today.getFullYear() - minAge,
    today.getMonth(),
    today.getDate()
  );

  return { minDate, maxDate };
};