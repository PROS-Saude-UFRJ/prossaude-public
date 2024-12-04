"use client";
import { nullishDl } from "../../src/lib/global/declarations/types";
import { useDataFetch } from "../../src/lib/hooks/useDataFetch";
import { useRef } from "react";
export default function ListEmailPacCons(): JSX.Element {
  const dlRef = useRef<nullishDl>(null),
    { data: pacsData } = useDataFetch("patients", dlRef, (pac, i) => (
      <option value={pac.email} key={`email-pac__${i}`}>
        {pac.name}
      </option>
    ));
  return (
    <datalist id='listEmailPacCons' ref={dlRef}>
      {pacsData}
    </datalist>
  );
}
