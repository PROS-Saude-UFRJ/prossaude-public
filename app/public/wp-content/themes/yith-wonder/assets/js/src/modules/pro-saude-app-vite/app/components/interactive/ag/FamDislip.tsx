import { handleDivAddShow } from "../../../src/lib/locals/aGPage/aGHandlers";
export default function FamDislip(): JSX.Element {
  return (
    <input
      type='checkbox'
      name='fam_dislip'
      id='antFamDislipId'
      className='cbFam'
      data-title='Antecedentes Familiares — Dislipidemia'
      onClick={ev => handleDivAddShow(ev.currentTarget)}
    />
  );
}
