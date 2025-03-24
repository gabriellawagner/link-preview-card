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
const awaitTimeout = (delay, reason) =>
  new Promise((resolve, reject) =>
    setTimeout(() => (reason === undefined ? resolve() : reject(reason)), delay)
  );

const wrapPromise = (promise, delay, reason) =>
  Promise.race([promise, awaitTimeout(delay, reason)]);


export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.link="";
    this.image="";
    this.description="";
    this.loadingState=false;
    this.href = "";
    this.themeColor = "";
 
  
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
      link: { type: String },
      image: { type: String },
      description: { type: String },
      loadingState: {type: Boolean, reflect: true },
      href: {type: String },
      themeColor: { type: String },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: inline-block;
        color: var(--themeColor);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
        border-radius: var(--ddd-radius-sm);
        max-width: 500px;
        padding: var(--ddd-spacing-3);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--link-preview-card-label-font-size, var(--ddd-font-size-s));
      }
      .link-preview-card {
  width: 400px;
  height: 450px;
  background: white;
  position: relative;
  overflow: hidden;
  padding: var(--ddd-spacing-4);
  margin: var(--ddd-spacing-2);
  
  
}

.preview-image {
  width: 160px;
  height:auto;
  object-fit: cover; 
  border-radius: var(--ddd-radius-sm);
  border: var(--ddd-border-sm) solid var(--themeColor);
}

.preview-content {
  position: relative;
  max-width: 410px;
  box-sizing: border-box;
  width: 100%;
  padding: var(--ddd-spacing-2);
  margin: var(--ddd-spacing-2);
  background-color: var(--ddd-theme-default-white);
  border-radius: var(--ddd-radius-sm);
  border: var(--ddd-border-sm) solid var(--themeColor);
}

.preview-title {
  font-size: var(--ddd-font-size-m);
  font-weight: var(--ddd-weight-bold);
  color: var(--themeColor);
  margin: var(--ddd-spacing-2);
  
}

.preview-url {
  text-decoration: none;
  color: var(--ddd-theme-default-limestoneGray);
  padding: var(--ddd-spacing-2);
  display: inline-block;

}

.preview-url:hover {
  background-color: var(--themeColor);
  color: var(--ddd-theme-default-white);
}

.preview-description {
  color: black;
  font-size: var(--ddd-font-size-s);
  margin: var(--ddd-spacing-2);
  
}



.loader {
  width: 70px;
  height:70px;
  --b: 8px; 
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 1px;
  background: conic-gradient(#0000 10%,#434a6d) content-box;
  -webkit-mask:
    repeating-conic-gradient(#0000 0deg,#000 1deg 20deg,#0000 21deg 36deg),
    radial-gradient(farthest-side,#0000 calc(100% - var(--b) - 1px),#000 calc(100% - var(--b)));
  -webkit-mask-composite: destination-in;
          mask-composite: intersect;
  animation:l4 1s infinite steps(10);
}
@keyframes l4 {to{transform: rotate(1turn)}}


@media (max-width: 480px) {
  .link-preview-card {
   width: 100%;
   max-width: 360px;
   height: auto;
   display: flex;
   padding: var(--ddd-spacing-2);

  }

  .preview-image {
    width: 100%;
    height: auto;

  }

  .preview-content {
    padding: var(--ddd-spacing-1);
    margin: 0;
    text-align: left;
    background-color: var(--ddd-theme-default-white);
    border-radius: var(--ddd-radius-sm);
  }

  .preview-title {
    font-size: var(--ddd-font-size-xs);
    font-weight: var(--ddd-font-weight-bold);
    color: var(--themeColor);
  }

  .preview-url {
    font-size: var(--ddd-font-size-2xs);
    color: var(--themeColor);
  }

  .preview-description {
    font-size: var(--ddd-font-size-3xs);
    color: black;
  }

  .loader {
    width: 50px;
    height: 50px;
    margin: var(--ddd-spacing-3) auto;
  }

}



    `];
  }

  updated(changedProperties){
    if (changedProperties.has("href") && this.href) {
      this.getData(this.href);
      
    }
  }

  
  async getData(link) {
    this.loadingState = true;
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    const timeoutDuration = 5000;

    try {
      const response = await wrapPromise(fetch(url), timeoutDuration, { reason: 'No Preview'});
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      
      this.title = json.data["og:title"] || json.data["title"] || "No Title Available";
      this.link=json.data["url"]|| link;
      this.image = json.data["image"] || json.data["logo"] || json.data["og:image"] || "";
      this.description= json.data["description"] || json.data["og:description"] || "No Description Available";
      this.themeColor = json.data["theme-color"] || this.defaultTheme();
      
      if (json.data["theme-color"]) {
        this.themeColor = json.data["theme-color"];
      }
      else {
        this.themeColor = this.defaultTheme();
      }

    } catch (error) {
      console.error("Error fetching Metadata:", error);
      this.title = "No Preview Available";
      this.description = "";
      this.image = "";
      this.link = "";
      this.themeColor = this.defaultTheme();
    } finally {
      this.loadingState = false;
    }
  }


  defaultTheme() {
    if(this.href.includes("psu.edu")) {
      return "var(--ddd-primary-2)";
    }
    else {
      return "var(--ddd-primary-13)";
    }
  }

  


  // Lit render the HTML
  render() {
    this.style.setProperty('--themeColor', this.themeColor);

    return html`
<div class="link-preview-card" style="--themeColor: ${this.themeColor}" part="preview"> ${this.loadingState
 ? html`<div class="loader" part="loader"></div>`
    : html` 
    <div class="image-content">
      ${this.image ? html` 
      <a class="preview-link" href=${this.link} target="_blank">
    <img class="preview-image" src=${this.image} alt="No Image Available"  part="image">
</a>
`:''
      
  }
    <div class="preview-content">
        <a class="preview-title" href=${this.link} target="_blank" part="title">${this.title}</a>
        <p class="preview-description" part="description">${this.description}</p>
        <a class="preview-url" href=${this.link} target="_blank" part="url" >${this.link}</a>
    </div>
</div>
  
  `}
  </div>
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