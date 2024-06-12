import React from "react";
import { createRoot } from "react-dom/client";

import { MyMap } from "./map";
import { MyTable, MyWidget } from "./widget";

async function onLoad() {
  const rootElement = document.querySelector("#root");
  if (!rootElement) {
    return;
  }

  const root = createRoot(rootElement);
  root.render(<div><MyMap></MyMap><MyWidget></MyWidget><MyTable></MyTable></div>);
}

window.onload = onLoad;
