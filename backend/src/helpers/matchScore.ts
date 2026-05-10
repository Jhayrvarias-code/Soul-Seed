export const calculateMatchScore = (
  userAInterests: string[],
  userBInterests: string[],
) => {
  const common = userAInterests.filter((interest) =>
    userBInterests.includes(interest),
  );

  return {
    score: common.length,
    commonInterests: common,
  };
};
