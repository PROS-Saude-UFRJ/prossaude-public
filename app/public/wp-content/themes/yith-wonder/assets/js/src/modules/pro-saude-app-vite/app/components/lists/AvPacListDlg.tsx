"use client";
import { AvPacListDlgProps } from "../../src/lib/global/declarations/interfacesCons";
import { ErrorBoundary } from "react-error-boundary";
import { isClickOutside } from "../../src/lib/global/gStyleScript";
import { useState } from "react";
import ErrorFallbackDlg from "../error/ErrorFallbackDlg";
import PacList from "./PacList";
import useDialog from "../../src/lib/hooks/useDialog";
export default function AvPacListDlg({ dispatch, state, shouldShowAlocBtn }: AvPacListDlgProps): JSX.Element {
  const [shouldDisplayRowData, setDisplayRowData] = useState<boolean>(false),
    { mainRef } = useDialog({ dispatch, state, param: "av-pac" });
  return (
    <>
      {state && (
        <dialog
          className='modal-content-stk2'
          id='avPacListDlg'
          ref={mainRef}
          onClick={ev => {
            isClickOutside(ev, ev.currentTarget).some(coord => coord === true) && dispatch(!state);
          }}>
          <ErrorBoundary
            FallbackComponent={() => (
              <ErrorFallbackDlg
                renderError={new Error(`Erro carregando a janela modal!`)}
                onClick={() => dispatch(state)}
              />
            )}>
            <section className='flexRNoWBetCt widFull' id='headPacList'>
              <h2 className='mg-1b noInvert'>
                <strong>Pacientes Cadastrados</strong>
              </h2>
              <button className='btn btn-close forceInvert' onClick={() => dispatch(!state)}></button>
            </section>
            <PacList
              setDisplayRowData={setDisplayRowData}
              shouldDisplayRowData={shouldDisplayRowData}
              shouldShowAlocBtn={shouldShowAlocBtn}
              dispatch={dispatch}
              state={state}
            />
          </ErrorBoundary>
        </dialog>
      )}
    </>
  );
}
