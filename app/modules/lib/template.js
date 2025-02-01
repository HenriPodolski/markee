const template = async (path, params) => {
  return fetch(path)
    .then(res => res.text())
    .then(templateText => {
      const names = Object.keys(params);
      const vals = Object.values(params);
      const interpolated = new Function(...names, `return \`${templateText}\`;`)(...vals);
      return interpolated;
    })
    .catch(error => console.log(error));
}

export default template;
