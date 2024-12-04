import mainStore from "../../../../src/redux/store";
import { validSchedCols } from "./types";
import { validSchedHours } from "./types";
import panelStore from "../../../../src/redux/panelStore";
export type StoreDispatch = typeof mainStore.dispatch;
export type PanelDispatch = typeof panelStore.dispatch;
export interface SchedHoursSliceProps {
  schedHoursSlice: { hours: validSchedHours[] };
}
export interface SchedColsSliceProps {
  schedColsSlice: { cols: validSchedCols[] };
}
