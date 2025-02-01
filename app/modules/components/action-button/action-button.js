import styles from '../../lib/styles.js';
import config from '../../lib/config.js';
import template from '../../lib/template.js';

class ActionButton extends HTMLElement {
  static observedAttributes = ['event'];

  shadow;
  event;

  constructor() {
    super();
    this.event = this.getAttribute('event');
    this.shadow = this.attachShadow({
      mode: "open",
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'event') {
      this.event = newValue;
      this.render();
    }
  }

  async view() {
    const styleSheet = await styles(`${config.componentsBasePath}/action-button/action-button.css`);
    const html = await template(`${config.componentsBasePath}/action-button/action-button.html`, {
      styleSheet,
    });
    return html;
  }

  async render() {
    const html = await this.view();
    console.log(html);
    this.shadow.append(document.createRange().createContextualFragment(html));
  }

  async toString() {
    return this.view();
  }
}

customElements.define('markee-action-button', ActionButton);

export { ActionButton };
