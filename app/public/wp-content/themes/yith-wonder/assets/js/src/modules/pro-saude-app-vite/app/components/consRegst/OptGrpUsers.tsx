"use client";
import { formCases, nullishOptGrp, validAreas } from "../../src/lib/global/declarations/types";
import { useRef } from "react";
import { textTransformPascal } from "../../src/lib/global/gModel";
import { useDataFetch } from "../../src/lib/hooks/useDataFetch";
export default function OptGrpUsers({ grp, area }: { grp: formCases; area: validAreas }): JSX.Element {
  const optGrpRef = useRef<nullishOptGrp>(null),
    { data } = useDataFetch(grp, optGrpRef, (pac, i) => (
      <option
        value={/\s/g.test(pac.tel.trim()) ? pac.tel.trim().slice(pac.tel.lastIndexOf(" ") + 1) : pac.tel.trim()}
        key={`tel-${grp.slice(0, 4)}__${i}`}>
        {pac.name}
      </option>
    ));
  return (
    <optgroup id={`OptGrp${textTransformPascal(grp)}${area}`} label={area} ref={optGrpRef}>
      {data}
    </optgroup>
  );
}
