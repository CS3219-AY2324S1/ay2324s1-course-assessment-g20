export const DEFAULT_LANGUAGE = 'JavaScript';

export const formatLanguage = (language: string) => {
  if (language.toLowerCase() === 'javascript') {
    return 'JavaScript';
  } else if (language.toLowerCase() === 'typescript') {
    return 'TypeScript';
  }
  throw Error('Unsupported language');
};
