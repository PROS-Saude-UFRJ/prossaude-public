"use client";
import { nullishDl } from "../../src/lib/global/declarations/types";
import { useDataFetch } from "../../src/lib/hooks/useDataFetch";
import { useRef } from "react";
export default function ListFirstNameCons({ first = false }: { first?: boolean }): JSX.Element {
  const dlRef = useRef<nullishDl>(null),
    { data: pacsData } = useDataFetch("patients", dlRef, (pac, i) => (
      <option
        value={first ? pac.name.slice(0, pac.name.indexOf(" ")) : pac.name.slice(pac.name.indexOf(" ") + 1)}
        key={`${first ? "first" : "family"}-name-pac__${i}`}></option>
    ));
  return (
    <datalist id={first ? "listFirstNameCons" : "listFamilyNameCons"} ref={dlRef}>
      {pacsData}
    </datalist>
  );
}
