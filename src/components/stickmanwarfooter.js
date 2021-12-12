const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<div class="section container">
    <hr>
    <span></span>
</div>
`;

class StickmanWarFooter extends HTMLElement {
    constructor() {
        super();

        // Attach a shadow DOM tree to this instance -- this creates `.shadowRoot` for us
        this.attachShadow({ mode: "open" });

        // clone `template` and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    } // end constructor

    // called when the component is added to the page
    connectedCallback() {
        const year = this.getAttribute('data-year') ? this.getAttribute('data-year') : "2021";
        const name = this.getAttribute('data-name') ? this.getAttribute('data-text') : "Eric Delmonico";
        
        this.shadowRoot.querySelector("span").innerHTML = `&copy; Copyright ${year}, ${name}`;
    }
} // end class

customElements.define('stickman-war-footer', StickmanWarFooter);