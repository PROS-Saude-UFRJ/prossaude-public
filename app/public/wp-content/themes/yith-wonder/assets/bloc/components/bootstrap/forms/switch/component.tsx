import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
export default class FormSwitch extends Component {
  r = createRef<HTMLInputElement>();
  l = createRef<HTMLLabelElement>();
  id: string;
  constructor(props: any) {
    super(props);
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
      console.error(`Error executing procedure to locate closest form:\n${(e as Error).message}`);
    }
  }
  public render(): JSX.Element {
    return (
      <div
        className="form-check form-switch"
        id={`form_toggle_box__${this.id}`}
        data-block={`block__${this.id}`}
      >
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={this.id}
          name={`switch__${this.id}`}
          data-block={`block__${this.id}`}
        />
        <label
          className="form-check-label"
          htmlFor={this.id}
          contentEditable
          id={`lab__${this.id}`}
          data-block={`block__${this.id}`}
        >
          Escreva aqui um rótulo.
        </label>
      </div>
    );
  }
}
