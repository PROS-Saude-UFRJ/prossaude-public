"use client";
import { HrRowProps } from "../../../src/lib/global/declarations/interfacesCons";
import TdBSchedTab from "./TdBSchedTab";
import { useSelector } from "react-redux";
import { SchedColsSliceProps } from "../../../src/lib/global/declarations/interfacesRedux";
import { validSchedCols } from "../../../src/lib/global/declarations/types";
export default function TrBSchedTab({ mainRoot, nHr, nRow }: HrRowProps): JSX.Element {
  let cols = useSelector<SchedColsSliceProps, validSchedCols[]>(
    (s: SchedColsSliceProps): validSchedCols[] => s.schedColsSlice.cols,
  );
  if (!cols || cols.length === 0) {
    console.warn(`Failed to useSelector`);
    cols = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }
  return (
    <tr id={`tr${nHr}`} data-row={nRow}>
      <td className='tabCel' data-col='0' data-row={nRow}>
        <span role='textbox'>
          <strong className='hour' data-hour={`${nHr}:00`}>{`${nHr}:00`}</strong>
        </span>
      </td>
      {cols.map((nCol, _, arr) =>
        nCol === arr.slice(-1)[0] ? (
          <TdBSchedTab
            nCol={nCol}
            nRow={nRow}
            nHr={nHr}
            mainRoot={mainRoot}
            last={true}
            key={`td_schedule__${nRow}-${nCol}-${nHr}`}
          />
        ) : (
          <TdBSchedTab
            nCol={nCol}
            nRow={nRow}
            nHr={nHr}
            mainRoot={mainRoot}
            key={`td_schedule__${nRow}-${nCol}-${nHr}`}
          />
        ),
      )}
    </tr>
  );
}
