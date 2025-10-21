export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "EASY":
      return "text-green-600 bg-green-100";
    case "MEDIUM":
      return "text-yellow-600 bg-yellow-100";
    case "HARD":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getDifficultyBorderColor = (difficulty: string): string => {
  switch (difficulty) {
    case "EASY":
      return "text-green-600 border-1 border-green-500";
    case "MEDIUM":
      return "text-yellow-600 border-1 border-yellow-500";
    case "HARD":
      return "text-red-600 border-1 border-red-500";
    default:
      return "text-gray-600 border-1 border-gray-500";
  }
};
