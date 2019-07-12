import { LitElement, html, css } from 'lit-element';

export class AppSidebar extends LitElement {
  static get properties() {
    return {
      title: {
        type: String
      }
    };
  }

  constructor() {
    super();
  }

  static get styles() {
    return css`
      :host {
        padding: 0 var(--border-radius);
      }
    `;
  }

  switchTab(choice) {
    this.shadowRoot.querySelectorAll('slot').forEach((el) => {
      if ((choice === 'default' && !el.getAttribute('name')) || (el.getAttribute('name') === choice)) {
        el.hidden = false;
      } else {
        el.hidden = true;
      }
    });
  }

  handleChoiceChange(e) {
    this.switchTab(e.detail.choice);
  }

  render() {
    return html`
      <style>
        @import url("./css/typography.css");
      </style>

      ${(!this.title)?'':html`<h1 class="header">${this.title}</h1>`}
      <slot></slot>
      <slot name="details" hidden></slot>
    `;
  }
}

customElements.define('app-sidebar', AppSidebar);