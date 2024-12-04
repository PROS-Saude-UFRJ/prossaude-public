import { Component, createRef } from "react";
import {
  fillIds,
  gatherFormData,
} from "../../../../lib/global/handlers/blockHandlers";
export default class FormColor extends Component {
  r = createRef<HTMLInputElement>();
  l = createRef<HTMLLabelElement>();
  id: string;
  constructor() {
    super({});
    this.id = ((): string => {
      if (!this.r.current)
        return `${new Date().getUTCMilliseconds()}-${new Date().getUTCMinutes()}-${new Date().getUTCHours()}-${new Date().getUTCDay()}-${new Date().getUTCMonth()}-${new Date().getUTCFullYear()}`;
      return fillIds(this.r.current);
    })();
  }
  public componentDidMount() {
    try {
      if (!this.r.current) return;
      gatherFormData(this.r.current, this.l.current);
    } catch (e) {
      console.error(
        `Error executing procedure to locate closest form:\n${
          (e as Error).message
        }`
      );
    }
  }
  public render(): JSX.Element {
    return (
      <>
        <label
          ref={this.l}
          id={`lab__${this.id}`}
          className="form-label"
          htmlFor={this.id}
          contentEditable
        >
          Campo de Cor:
        </label>
        <input
          ref={this.r}
          type="color"
          className="form-control form-control-color"
          title="Escolha a sua cor"
          id={this.id}
          style={{
            width: "90%",
          }}
        ></input>
        <div className="form-text form-tip" id={`tip__${this.id}`} contentEditable>Insira aqui a dica para a cor ou remova o texto.</div>
      </>
    );
  }
}
