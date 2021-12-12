// Author: Eric Delmonico
//
// navigationbar.js will contain the web component for the navigation
// bar on the top of every page on the project site.

const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<link rel="stylesheet" href="./styles/styles.css">
<nav class="navbar has-shadow is-white">
    <div class="navbar-brand">
        <a class="navbar-item" href="home.html">
            <img id="logo" src="./assets/troopThumbnail.png"></img>
        </a>
        <a class="navbar-burger" id="burger">
            <span></span>
            <span></span>
            <span></span>
        </a>
    </div>
    <div class="navbar-menu" id="nav-links">
        <div class="navbar-start">
            <a class="navbar-item is-hoverable" href="home.html">Home</a>
            <a class="navbar-item is-hoverable" href="app.html">App</a>
            <a class="navbar-item is-hoverable" href="documentation.html">Documentation</a>
        </div> <!-- end navbar-start -->
    </div>
</nav>
`;

class NavigationBar extends HTMLElement {
    constructor() {
            super();

            // Attach a shadow DOM tree to this instance -- this creates `.shadowRoot` for us
            this.attachShadow({ mode: "open" });

            // clone `template` and append it
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            const burgerItem = this.shadowRoot.querySelector("#burger");
            const navbarMenu = this.shadowRoot.querySelector("#nav-links");

            burgerItem.onclick = () => {
                navbarMenu.classList.toggle("is-active");
            };
        } // end constructor

    // called when the component is added to the page
    connectedCallback() {}
} // end class

customElements.define('navigation-bar', NavigationBar);