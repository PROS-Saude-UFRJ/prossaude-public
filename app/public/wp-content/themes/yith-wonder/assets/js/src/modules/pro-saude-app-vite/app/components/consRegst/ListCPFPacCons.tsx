"use client";
import { nullishDl } from "../../src/lib/global/declarations/types";
import { useRef } from "react";
import { useDataFetch } from "../../src/lib/hooks/useDataFetch";
export default function ListCPFPacCons(): JSX.Element {
  const dlRef = useRef<nullishDl>(null),
    { data: pacsData } = useDataFetch("patients", dlRef, (pac, i) => (
      <option value={"idf" in pac ? pac.idf : i + 1} key={`cpf-pac__${i}`}>
        {pac.name}
      </option>
    ));
  return (
    <datalist id='listCPFPacCons' ref={dlRef}>
      {pacsData}
    </datalist>
  );
}
