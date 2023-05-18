export const getDataFromFrontmatter = (markdown: string, key: string) => {
  const frontmatter = /---[\r\n](.*?)[\r\n]---/gms.exec(markdown);
  let fmData: any;
  if (frontmatter && frontmatter[1]) {
    const data = frontmatter[1].split(/[\r\n]/).reduce((prev, next) => {
      const [key, val] = next.split(':');

      if (key && val) {
        prev[key.trim()] = val.trim();
      }

      return prev;
    }, {} as { [key: string]: any });

    fmData = data?.[key];
  }

  return fmData;
};
