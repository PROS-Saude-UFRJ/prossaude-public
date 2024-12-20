import { formatTel } from "../../../src/lib/global/gModel";
import { handleCondtReq } from "../../../src/lib/global/handlers/gHandlers";
export default function TelSec(): JSX.Element {
  return (
    <input
      type='tel'
      name='tel_sec'
      id='tel2Id'
      className='form-control inpIdentif noInvert inpTel'
      inputMode='tel'
      data-xls='Telefone Secundário'
      data-title='tel_sec'
      onInput={ev => {
        formatTel(ev.currentTarget, false);
        handleCondtReq(ev.currentTarget, {
          min: 3,
          max: 10,
          pattern: ["9?d{4}-d{4}", "g"],
        });
      }}
    />
  );
}
