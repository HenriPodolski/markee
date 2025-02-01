import styles from '../lib/styles.js';
import config from '../lib/config.js';
import template from '../lib/template.js';

const App = async () => {
  const styleSheet = await styles(`${config.appModuleBasePath}/App.css`);
  const html = await template(`${config.appModuleBasePath}/App.html`, {
    styleSheet,
    config
  })

  return document.createRange().createContextualFragment(html);
};


document.onreadystatechange = async () => {
  if (document.readyState === 'complete') {
    document.getElementById('app').replaceWith(await App());
  }
};
