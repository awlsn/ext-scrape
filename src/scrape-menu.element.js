import "./selector-from-input.element";

// TODO:
//        - handle escape key - maybe at a high level, escape just resets?
//        - update on type selector?
//        - get selector from click
//        - write fetch or whatever

// refactor to class?
const SelectorFromPage = {
  target: {},

  handleHover: (e) => {
    // ignore the extension menu
    if (e.target.nodeName === "SCRAPE-MENU") {
      return;
    }
    const thisTarget = SelectorFromPage.target;
    //reset previous target
    if (thisTarget.el) {
      thisTarget.el.setAttribute("data-focus", false);
    }
    //add a border to the target
    thisTarget.el = e.target;
    thisTarget.el.setAttribute("data-focus", true);
  },

  handleClick: (e) => {
    if (e.target.nodeName === "SCRAPE-MENU") {
      return;
    }
    console.log(e.target.nodeName);
    SelectorFromPage.unload();
  },

  load: function () {
    document.body.addEventListener("mousemove", this.handleHover);
    document.body.addEventListener("click", this.handleClick);
  },

  unload: function () {
    document.body.removeEventListener("mousemove", this.handleHover);
    document.body.removeEventListener("click", this.handleClick);
    document.querySelectorAll("[data-focus]").forEach((el) => {
      el.removeAttribute("data-focus");
      el.style.outline = "none";
    });
  }
};

class ScrapeMenu extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
    this.$shadow = this.attachShadow({ mode: "open" });
    this.target = {};
  }

  connectedCallback() {
    this.setup();
  }

  disconnectedCallback() {
    console.log("take it away");
    this.cleanup();
  }

  cleanup() {
    document
      .querySelectorAll("[data-focus]")
      .forEach((el) => el.removeAttribute("data-focus"));
  }

  loadSelectorFromInput() {
    this.unloadSelectorFromPage();
    this.$shadow.querySelector(".input").classList.add("expand");
  }

  unloadSelectorFromInput() {
    this.$shadow.querySelector(".input").classList.remove("expand");
  }

  loadSelectorFromPage() {
    this.$shadow.querySelector(".page").classList.add("expand");
    SelectorFromPage.load(this.$shadow);
  }

  unloadSelectorFromPage() {
    this.$shadow.querySelector(".page").classList.remove("expand");
    SelectorFromPage.unload(this.$shadow);
  }

  setup() {
    this.$shadow.innerHTML = this.render();

    //document.body.addEventListener("click", this.add);
    this.$shadow.getElementById("bolt").addEventListener("click", (e) => {
      this.loadSelectorFromPage();
      this.unloadSelectorFromInput();
    });

    this.$shadow.getElementById("manual").addEventListener("click", (e) => {
      this.loadSelectorFromInput();
      this.unloadSelectorFromPage();
    });
  }

  render() {
    return `
      <style>
      :host {
        position: fixed;
        right: 10px;
        top: 10px;
        opacity: 0;
        animation: present-yourself .3s ease forwards;
        z-index: 2147483647;
      }

      @keyframes present-yourself {
        to {
          opacity: 1;
          transform: translate3d(0,0,0);
        }
      }

      #box {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        line-height: 14px;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
      }

      nav {
        display: flex;
      }

      button {
        padding: 5px;
      }

      button svg {
        vertical-align: middle;
        margin-top: -2px;
      }


      .tray {
        max-height: 0;
        transition: max-height 0.15s ease-out;
        overflow: hidden;
      }

      .tray.expand {
        max-height: 500px;
        transition: max-height 0.25s ease-in;
        position: relative;
        overflow: hidden;
      }

      .input {
        background-color: rgba(0, 0, 0, 0.5);
      }

      label, input {
        display: block;
        margin: 10px 0;
      }
      
      #tray-contents {
        padding: 20px;
        
      }
      
      @keyframes bring-forth-the-tray {
        to {
          left: 0;
        }
      }

      </style>
      <div id="box">
      <nav>
        <!--<button>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M12.496 17.414c-.394-1.096-1.805-4.775-2.39-6.297-1.103.737-2.334 1.435-3.512 1.928-.366 1.28-1.094 3.709-1.446 4.033-.604.557-.832.485-.925-.279s-.485-3.236-.485-3.236-2.162-1.219-2.84-1.568-.667-.591.057-.974c.422-.223 2.927-.085 4.242.005.861-.951 1.931-1.882 2.993-2.679-1.215-1.076-4.15-3.675-5.034-4.424-.776-.658.079-.797.079-.797.39-.07 1.222-.132 1.628-.009 2.524.763 6.442 2.068 7.363 2.376l1.162-.821c4.702-3.33 5.887-2.593 6.111-2.27s.503 1.701-4.199 5.032l-1.16.823c-.029.98-.157 5.151-.311 7.811-.025.428-.367 1.198-.565 1.544-.001 0-.423.765-.768-.198z"/></svg>
          Set endpoint
        </button>-->

        <button id="manual">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M18.6 4H1.4C.629 4 0 4.629 0 5.4v9.2c0 .769.629 1.4 1.399 1.4h17.2c.77 0 1.4-.631 1.4-1.4V5.4C20 4.629 19.369 4 18.6 4zM11 6h2v2h-2V6zm3 3v2h-2V9h2zM8 6h2v2H8V6zm3 3v2H9V9h2zM5 6h2v2H5V6zm3 3v2H6V9h2zM2 6h2v2H2V6zm3 3v2H3V9h2zm-1 5H2v-2h2v2zm11 0H5v-2h10v2zm3 0h-2v-2h2v2zm-3-3V9h2v2h-2zm3-3h-4V6h4v2z"/></svg>
          Manually enter Selector
        </button>  

        <button id="bolt">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M6.803 18.998c-.194-.127 3.153-7.16 3.038-7.469S6.176 10.093 6.003 9.55c-.174-.543 7.007-8.707 7.196-8.549S10.07 8.239 10.16 8.47c.091.23 3.728 1.404 3.838 1.979s-7.002 8.676-7.195 8.549z"/></svg>
          Get Selector from page
          </button>
          </nav>

          <div class="page tray">
            <div id="tray-contents">
            <label for="selector">
                Selector:
                <input type="text" placeholder="selector" name="selector" id="selector" />
              </label>
              <label for="endpoint">
                Endpoint:
                <input type="text" placeholder="http://" name="endpoint" id="endpoint" />
              </label>
              <button>Send</button>
            </div>
          </div>

          <div class="input tray">
            <div id="tray-contents">
              <label for="selector">
                Selector:
                <input type="text" placeholder="selector" name="selector" id="selector" />
              </label>
              <label for="endpoint">
                Endpoint:
                <input type="text" placeholder="http://" name="endpoint" id="endpoint" />
              </label>
              <button>Send</button>
            </div>
          </div>
      </div>
    `;
  }
}

customElements.define("scrape-menu", ScrapeMenu);
