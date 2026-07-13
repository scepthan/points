export const cardinalNumber = (n: number) => {
  n %= 100;
  if (n >= 11 && n <= 20) return n + "th";
  if (n % 10 === 1) return n + "st";
  if (n % 10 === 2) return n + "nd";
  if (n % 10 === 3) return n + "rd";
  return n + "th";
};
