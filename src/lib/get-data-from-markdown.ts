import { Document, parseDocument } from 'yaml';
export const getDataFromFrontmatter = (markdown: string, key: string) => {
  const frontmatter = /(---[\r\n]+)(.*?)([\r\n]+---)/gms.exec(markdown);
  let fmData: any;
  if (frontmatter && frontmatter[2]) {
    const data: Document.Parsed = parseDocument(frontmatter[2]);

    fmData = data.get(key);
  }

  return fmData;
};
