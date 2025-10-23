export const getLanguageName = (languageId: number) => {
  const languageMap: Record<number, string> = {
    54: "C++ (GCC 9.2.0)",
    71: "Python (3.8.1)",
    62: "Java (OpenJDK 13.0.1)",
  };
  return languageMap[languageId] || `Language ID: ${languageId}`;
};
