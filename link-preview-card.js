/**
 * Copyright 2025 gabriellawagner
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `link-preview-card`
 * 
 * @demo index.html
 * @element link-preview-card
 */
export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.jsonTitle="";
    this.link="";
    this.image="";
    this.description="";
    

    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/link-preview-card.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      jsonTitle: { type: String },
      link: { type: String },
      image: { type: String },
      description: { type: String },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--link-preview-card-label-font-size, var(--ddd-font-size-s));
      }
      .link-preview-card {
  width: 600px;
  height: 150px;
  background: navy;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  padding: 15px;
  border: 5px solid black;
  margin: 5px;
  
}

.preview-image {
  width: 160px;
  height:100%;
  object-fit: cover;
  position: absolute;
  left: 0;
  border-radius: inherit;
  
}

.preview-content {
  position: relative;
  margin-left:170px;
  top: 10%;
  max-width: 410px;
  height:120px;
  background-color: white;
  border: 2px solid black;
  box-sizing: border-box;
  width: 100%;
  padding: 5px;
}

.preview-title {
  font-size: large;
  text-decoration: none;
  color: black;
}

.preview-url {
  text-decoration: none;
  color: grey;
}

.preview-description {
  color: black;
}


    `];
  }

  async getData(link) {
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json.data);
      // document.querySelector('#here').innerHTML = JSON.stringify(json.data, null, 2);
      //  document.querySelector('#there').innerHTML = json.data["og:site_name"];
      this.jsonTitle= json.data["title"];
      console.log(json.data.url);
      console.log(this.jsonTitle);
      if (json.data['twitter:card']) {
        
      }
      console.log(json.data['url']);
    } catch (error) {
      console.error(error.message);
    }
  }
  

  // Lit render the HTML
  render() {
    return html`
<div class="link-preview-card">
    <a class="preview-link" href=${this.link} target="_blank">
    <img class="preview-image" src=${this.image} alt="Preview Image">
</a>
    <div class="preview-content">
        <a class="preview-title" href=${this.link} target="_blank">${this.title}</a>
        <p class="preview-description">${this.description}</p>
        <a class="preview-url" href=${this.link} target="_blank" >${this.link}</a>
    </div>
</div>
    ${this.getData(this.link)}
     `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);