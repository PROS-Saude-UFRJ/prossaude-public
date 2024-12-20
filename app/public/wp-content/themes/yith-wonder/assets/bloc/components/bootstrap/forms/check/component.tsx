import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
export default class FormCheck extends Component {
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
        className="form-check"
        id={`form_check_box__${this.id}`}
        data-block={`block__${this.id}`}
      >
        <input
          className="form-check-input"
          type="checkbox"
          id={this.id}
          name={`check__${this.id}`}
          data-block={`block__${this.id}`}
        />
        <label
          className="form-check-label"
          htmlFor="flexCheckDefault"
          contentEditable
          id={`lab__${this.id}`}
          data-block={`block__${this.id}`}
        >
          Campo de Confirmação
        </label>
      </div>
    );
  }
}
