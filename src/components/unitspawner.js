// Author: Eric Delmonico
//
// unitspawner.js contains the webcomponent used to spawn units and keep track of their base stats

const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<div class="container is-flex is-justify-content-left mb-5">
    <button id="spawnTroops" class="button" style="height: 150px; width: 100px;"><img id="thumbnail" style="max-width: 100%; max-height: 100%;"></button>
    <div class="ml-3">
        <p id="dmg" class="has-text-danger">Damage: </p>
        <p id="hp" class="has-text-success">Health: </p>
        <p id="cost" class="has-text-link">Cost: </p>
        <p id="ranged">Ranged?</p>
    </div>
</div>
`;

class UnitSpawner extends HTMLElement {
    constructor() {
            super();

            // Attach a shadow DOM tree to this instance -- this creates `.shadowRoot` for us
            this.attachShadow({ mode: "open" });

            // clone `template` and append it
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            // Base stats for friendly troops
            this.baseDamage = this.dataset.dmg;
            this.baseHP = this.dataset.hp;
            this.baseCost = 10;
            this.ranged = this.dataset.ranged > 0;

            this.dmgMarkup = this.shadowRoot.querySelector("#dmg");
            this.hpMarkup = this.shadowRoot.querySelector("#hp");
            this.costMarkup = this.shadowRoot.querySelector("#cost");
            this.rangedMarkup = this.shadowRoot.querySelector("#ranged");

            this.thumbnail = this.shadowRoot.querySelector("#thumbnail");
            this.thumbnail.src = `assets/${this.dataset.image}.png`;

            // Propogate a request for troops whenever the spawn button is pressed
            let e = this.ranged ? new Event("rangedtrooprequested") : new Event("trooprequested");
            this.shadowRoot.querySelector("#spawnTroops").onclick = () => document.dispatchEvent(e);
        } // end constructor

    // called when the component is added to the page
    connectedCallback() {
        this.dmgMarkup.textContent = "Damage: " + this.baseDamage;
        this.hpMarkup.textContent = "Health: " + this.baseHP;
        this.costMarkup.textContent = "Cost: " + this.baseCost;
        this.rangedMarkup.textContent = "Ranged: " + (this.ranged ? "Yes." : "No.");
    }
} // end class

customElements.define('unit-spawner', UnitSpawner);