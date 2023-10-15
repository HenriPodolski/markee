import { Document, parseDocument } from 'yaml';
export const getDataFromFrontmatter = (markdown: string, key: string) => {
  // normalize markdown, ready to be used with frontmatter parser
  const frontmatter = markdown.replace(
    /^\s+?---[\r\n]+?(.+)[\r\n]+?---.*$/gms,
    '---\r\n$1\r\n---'
  );
  let fmData: any;
  console.groupCollapsed('frontmatter ' + key);
  console.log(frontmatter);
  console.groupEnd();
  if (frontmatter) {
    const data: Document.Parsed = parseDocument(frontmatter);
    fmData = data.get(key);
  }

  return fmData;
};
