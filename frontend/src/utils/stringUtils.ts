export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const formatLanguage = (language: string) => {
  if (language.toLowerCase() === 'javascript') {
    return 'JavaScript';
  } else if (language.toLowerCase() === 'typescript') {
    return 'TypeScript';
  }
  throw Error('Unsupported language');
};
