import { Component, createRef } from "react";
import {
  fillIds,
  gatherFormData,
} from "../../../../lib/global/handlers/blockHandlers";
export default class FormSelect extends Component {
  r = createRef<HTMLSelectElement>();
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
        <label className="form-label" htmlFor={this.id} contentEditable id={`lab__${this.id}`} data-block={`block__${this.id}`}>
          Campo de Selação
        </label>
        <select className="form-select" type="select-one" id={this.id} name={`select_one__${this.id}`} data-block={`block__${this.id}`}>
        <div className="form-text" id={`tip__${`tip__${this.id}`}`} contentEditable data-block={`block__${this.id}`}>Escreva uma dica aqui ou remova o texto.</div>
      </>
    );
  }
}
