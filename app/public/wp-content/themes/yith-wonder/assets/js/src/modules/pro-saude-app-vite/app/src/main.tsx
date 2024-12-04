import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ReactSpinner from "../components/icons/ReactSpinner";
export default function initReact(): void {
  addEventListener("DOMContentLoaded", () => {
    alert("React loaded and starting");
    const wrapper = document.getElementById("wrapper");
    if (wrapper) wrapper.innerHTML = `<div id="root"></div>`;
    const root = document.getElementById("root");
    if (!root) {
      console.error(`No root was found in the DOM. React could not render.`);
      if (!document.body) {
        console.error(`No body element was found by React. Could not render anything.`);
        ReactDOM.render(
          <StrictMode>
            <main style={{ marginInline: "5%", marginBlock: "0", padding: "5%" }}>
              <h1>Erro crítico! 😨</h1>
              <h2>O Script não pôde renderizar a aplicação.</h2>
              <br />
              <h3>Recarregue ou contate o suporte!</h3>
              <ReactSpinner scale={0.8} />
            </main>
          </StrictMode>,
          document.body,
        );
      }
      return;
    }
    ReactDOM.render(
      <StrictMode>
        <App />
      </StrictMode>,
      root,
    );
  });
}
