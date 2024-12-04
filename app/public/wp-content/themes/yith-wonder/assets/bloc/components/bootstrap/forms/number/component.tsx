import { Component, createRef } from "react";
import { fillIds, gatherFormData } from "../../../../lib/global/handlers/blockHandlers";
import { handleCondtReq } from "../../../../lib/global/handlers/gHandlers";
import { parseNotNaN } from "../../../../lib/global/gModel";
import { looseNum } from "../../../../lib/global/declarations/types";
export default class FormNumber extends Component<any, { v: string }> {
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
    this.state = {
      v: "",
    };
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
          Campo de Número Simples:
        </label>
        <input
          ref={this.r}
          value={this.state.v}
          className="form-control inpNum"
          type="number"
          inputMode="decimal"
          maxLength={536870911}
          max={Number.MAX_SAFE_INTEGER}
          autoComplete="off"
          placeholder="Digite um e-mail aqui!"
          pattern="^[0-9]*$"
          autoCapitalize="false"
          id={this.id}
          style={{
            width: "90%",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(23, 23, 23, 0.7)' width='16' height='16' fill='currentColor' class='bi bi-123' viewBox='0 0 16 16'%3E%3Cpath d='M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169.676 0 1.174.44 1.174 1.106 0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179.01.707-.55 1.216-1.421 1.21-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918 1.478 0 2.642-.839 2.62-2.144-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678-.026-1.053-.933-1.855-2.359-1.845-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944.703 0 1.206.435 1.206 1.07.005.64-.504 1.106-1.2 1.106h-.75z'/%3E%3C/svg%3E")`,
            backgroundPosition: "100%",
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "content-box",
            backgroundAttachment: "local",
          }}
          onInput={ev => {
            let v: looseNum = ev.currentTarget.value;
            if (v.length > 536870911) v = v.slice(0, 536870911);
            v = parseNotNaN(ev.currentTarget.value.replace(/[^0-9]/g, ""));
            if (v > Number.MAX_SAFE_INTEGER) this.setState({ v: v.toString() });
            handleCondtReq(ev.currentTarget, {
              min: 0,
              pattern: ["[0-9]", "g"],
            });
          }}
        ></input>
      </>
    );
  }
}