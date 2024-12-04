"use client";
import { AvStudListDlgProps } from "../../src/lib/global/declarations/interfacesCons";
import { ErrorBoundary } from "react-error-boundary";
import { isClickOutside } from "../../src/lib/global/gStyleScript";
import { useRef } from "react";
import ErrorFallbackDlg from "../error/ErrorFallbackDlg";
import StudList from "./StudList";
import useDialog from "../../src/lib/hooks/useDialog";
export default function AvStudListDlg({ forwardedRef, dispatch, state = false }: AvStudListDlgProps): JSX.Element {
  const sectTabRef = useRef<HTMLElement | null>(null),
    { mainRef } = useDialog({ state, dispatch, param: "av-stud" });
  return (
    <>
      {state && (
        <dialog
          className='modal-content-stk2'
          id='avStudListDlg'
          ref={mainRef}
          onClick={ev => {
            isClickOutside(ev, ev.currentTarget).some(coord => coord === true) && dispatch(!state);
          }}>
          <ErrorBoundary
            FallbackComponent={() => (
              <ErrorFallbackDlg
                renderError={new Error(`Erro carregando a janela modal!`)}
                onClick={() => dispatch(!state)}
              />
            )}>
            <section className='flexRNoWBetCt' id='headStudList'>
              <h2 className='mg-1b noInvert'>
                <strong>Estudantes Cadastrados</strong>
              </h2>
              <button className='btn btn-close forceInvert' onClick={() => dispatch(!state)}></button>
            </section>
            <section className='form-padded' id='sectStudsTab' ref={sectTabRef}>
              <StudList mainDlgRef={forwardedRef} state={state} dispatch={dispatch} />
            </section>
          </ErrorBoundary>
        </dialog>
      )}
    </>
  );
}
