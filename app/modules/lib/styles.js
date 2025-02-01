const styles = async (path) => {
  return fetch(path)
    .then(res => res.text())
    .then(styleText => `<style>${styleText}</style>`)
    .catch(error => console.log(error));
}

export default styles;
