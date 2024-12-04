"use client";
import { nullishDl } from "../../src/lib/global/declarations/types";
import { useRef } from "react";
import { useDataFetch } from "../../src/lib/hooks/useDataFetch";
export default function ListTelPacCons(): JSX.Element {
  const dlRef = useRef<nullishDl>(null),
    { data: pacsData } = useDataFetch("patients", dlRef, (pac, i) => (
      <option
        value={/\s/g.test(pac.tel.trim()) ? pac.tel.trim().slice(pac.tel.lastIndexOf(" ") + 1) : pac.tel.trim()}
        key={`tel-pac__${i}`}>
        {pac.name}
      </option>
    ));
  return (
    <datalist id='listTelPacCons' ref={dlRef}>
      {pacsData}
    </datalist>
  );
}
