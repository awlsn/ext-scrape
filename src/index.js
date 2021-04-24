import "./styles.css";
import "./scrape-menu.element";
/*
build process should be to bundle extension.js and tie it to a loader
*/

document.querySelector("#load").addEventListener("click", (e) => {
  // load extension as if we clicked toolbar
  injectMenu();
});

function injectMenu() {
  if (document.querySelector("scrape-menu")) {
    console.log("eject");
    //document.querySelector("giftr-bar")?.remove();
  } else {
    console.log("inject");
    // const script = document.createElement("script");
    // script.type = "module";
    // script.src = chrome.runtime.getURL("build/bundle.js");
    // document.body.appendChild(script);
    const dataFocusStyle = new CSSStyleSheet();
    dataFocusStyle.replace(
      `[data-focus="true"] {outline: 1px dashed hsl(267, 100%, 58%)}`
    );

    const scrapemenu = document.createElement("scrape-menu");
    //giftr.style.zIndex = "9000";
    document.adoptedStyleSheets = [dataFocusStyle];
    document.body.prepend(scrapemenu);
  }
}
