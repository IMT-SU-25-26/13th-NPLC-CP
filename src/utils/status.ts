export const getStatusColor = (status: string) => {
  switch (status) {
    case "ACCEPTED":
      return "text-green-500";
    case "WRONG_ANSWER":
      return "text-red-500";
    case "TIME_LIMIT_EXCEEDED":
      return "text-yellow-500";
    case "COMPILATION_ERROR":
      return "text-orange-500";
    default:
      return "";
  }
};

export const formatStatus = (status: string) => {
  return status
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};