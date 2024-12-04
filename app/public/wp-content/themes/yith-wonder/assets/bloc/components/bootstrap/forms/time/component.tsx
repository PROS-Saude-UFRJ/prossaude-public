import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
export default class FormTime extends Component {
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
      <>
        <label
          ref={this.l}
          id={`lab__${this.id}`}
          className="form-label"
          htmlFor={this.id}
          contentEditable
        >
          Campo de Horário Simples:
        </label>
        <input
          ref={this.r}
          className="form-control"
          type="time"
          placeholder="Digite um horário aqui!"
          id={this.id}
          name={`time__${this.id}`}
          style={{
            width: "90%",
          }}
        ></input>
      </>
    );
  }
}
