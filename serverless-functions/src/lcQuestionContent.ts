export const getLcQuestionContentQueryFor = (titleSlug: string) =>
  JSON.stringify({
    query: `query questionContent($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    content
  }
}`,
    variables: { titleSlug: titleSlug },
  });

export type LcQuestionContent = {
  content: string;
};
