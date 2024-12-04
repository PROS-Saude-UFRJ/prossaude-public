"use client";
import { RootCtx } from "../../../../src/App";
import { RootCtxType } from "../../../../src/lib/global/declarations/interfaces";
import { DataProvider } from "../../../../src/lib/global/declarations/classesCons";
import { ErrorBoundary } from "react-error-boundary";
import { MainPanelProps } from "../../../../src/lib/global/declarations/interfacesCons";
import { navigatorVars, providers } from "../../../../src/vars";
import { camelToKebab } from "../../../../src/lib/global/gModel";
import { handleLinkChanges } from "../../../../src/lib/global/handlers/gRoutingHandlers";
import { nlDiv, panelOpts } from "../../../../src/lib/global/declarations/types";
import { registerRoot, syncAriaStates } from "../../../../src/lib/global/handlers/gHandlers";
import { useState, useRef, useEffect, useContext } from "react";
import DefaultForm from "../DefaultForm";
import ErrorMainDiv from "../../../error/ErrorMainDiv";
import GenericErrorComponent from "../../../error/GenericErrorComponent";
import PacTabForm from "../../pacs/PacTabForm";
import ProfForm from "../../profs/ProfForm";
import TableProfForm from "../../profs/TabProfForm";
import TabStudForm from "../../studs/TabStudForm";
import StudentForm from "../../studs/StudentForm";
import Unauthorized from "../Unauthorized";
import { elementNotFound, extLine } from "../../../../src/lib/global/handlers/errorHandler";
import { defUser } from "../../../../src/redux/slices/userSlice";
import ScheduleLoader from "../../schedule/ScheduleLoader";
import { PanelCtx } from "./SelectLoader";
import { panelRoots } from "../../../../src/vars";
import Spinner from "../../../icons/Spinner";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import DashBoard from "../../dashboard/Dashboard";
export default function SelectPanel({ defOp = "agenda" }: MainPanelProps): JSX.Element {
  const { userClass, setUserClass: setPrivilege } = useContext(PanelCtx),
    [rendered, setRender] = useState<JSX.Element>(<ScheduleLoader />),
    [selectedOption, setSelectedOption] = useState<panelOpts>(defOp),
    [mounted, setMounted] = useState<boolean>(false),
    formRootRef = useRef<nlDiv>(null),
    context = useContext<RootCtxType>(RootCtx),
    navigate = useNavigate(),
    location = useLocation(),
    [searchParams, setSearchParams] = useSearchParams(),
    panelComponents: Record<panelOpts | "default", JSX.Element> = {
      registStud: userClass === "coordenador" || userClass === "supervisor" ? <StudentForm /> : <Unauthorized />,
      registProf: userClass === "coordenador" ? <ProfForm /> : <Unauthorized />,
      removeStud: userClass === "coordenador" || userClass === "supervisor" ? <TabStudForm /> : <Unauthorized />,
      removeProf: userClass === "coordenador" || userClass === "supervisor" ? <TableProfForm /> : <Unauthorized />,
      pacList: <PacTabForm />,
      agenda: <ScheduleLoader />,
      dashboard: <DashBoard />,
      default: <DefaultForm />,
    },
    handlePanelPath = (change: React.ChangeEvent<HTMLSelectElement> | string): void => {
      searchParams.set("panel", camelToKebab(typeof change === "string" ? change : change.target.value));
      setSearchParams(searchParams, { replace: true });
      navigate(
        `${location.pathname.endsWith("/") ? location.pathname.slice(0, -1) : location.pathname}?${searchParams}`,
      );
    };
  useEffect(() => {
    const privilege = localStorage.getItem("activeUser")
      ? JSON.parse(localStorage.getItem("activeUser")!).loadedData?.privilege
      : defUser.loadedData.privilege;
    let translatedPrivilege = "estudante";
    if (privilege === "coordinator") translatedPrivilege = "coordenador";
    else translatedPrivilege = privilege;
    setPrivilege(translatedPrivilege);
    setMounted(true);
  }, [setPrivilege]);
  useEffect(() => {
    providers.globalDataProvider = new DataProvider(sessionStorage);
    handleLinkChanges("panel", "Panel Page Style");
    handlePanelPath(defOp);
  }, [userClass, defOp]);
  useEffect(() => {
    navigate(
      `${location.pathname.endsWith("/") ? location.pathname.slice(0, -1) : location.pathname}?panel=${camelToKebab(
        defOp,
      )}`,
      { replace: true },
    );
  }, []);
  //validating DOM structure using Main Select and parent for reference
  useEffect(() => {
    setTimeout(() => {
      const selDiv = document.getElementById("formSelDiv");
      if (mounted && selDiv instanceof HTMLElement && !document.querySelector("select")) {
        selDiv.innerHTML = ``;
        context.roots.rootSel = registerRoot(context.roots.rootSel, `#formSelDiv`, undefined, true);
        if (!context.roots.rootSel) throw new Error(`Failed to validate Select root`);
        context.roots.rootSel.render(<ErrorMainDiv />);
      } else
        setTimeout(() => {
          const selDiv = document.getElementById("formSelDiv");
          if (!document.getElementById("formSelDiv")?.querySelector("select")) {
            elementNotFound(selDiv, "selDiv during DOM initialization", extLine(new Error()));
            if (selDiv instanceof HTMLElement) {
              selDiv.innerHTML = ``;
              context.roots.rootSel = registerRoot(context.roots.rootSel, `#formSelDiv`, undefined, true);
              if (!context.roots.rootSel) throw new Error(`Failed to validate Select root`);
              context.roots.rootSel.render(<ErrorMainDiv />);
            }
          }
        }, 2000);
    }, 3000);
  }, [mounted, context.roots, setPrivilege]);
  useEffect(() => {
    if (formRootRef.current instanceof HTMLElement) {
      syncAriaStates([
        ...((document.getElementById("formPanelDiv") ?? document)?.querySelectorAll("*") ?? null),
        document.getElementById("formPanelDiv")!,
      ]);
      panelRoots.mainRoot = registerRoot(panelRoots.mainRoot, `#${formRootRef.current.id}`, formRootRef);
    }
  }, [mounted]);
  useEffect(() => {
    handlePanelPath(selectedOption);
    const formRoot = formRootRef.current ?? document.getElementById("formRoot");
    if (!formRoot) return;
    formRoot.style.opacity = "1";
  }, [rendered]);
  //Snippet para repassar para CSR totalmente (erro ainda não investigado)
  return !mounted ? (
    <Spinner spinnerClass='spinner-grow' />
  ) : (
    <ErrorBoundary
      FallbackComponent={() => <GenericErrorComponent message='Error loading Selector for Working Panel' />}>
      <div role='group' className='flexWR mg-3b pdL1v900Q pdR1v900Q pdL2v460Q pdR2v460Q noInvert'>
        <strong id='titlePanelSelect' title='Selecione aqui o painel em tela'>
          Escolha o Painel de Trabalho
        </strong>
        <select
          className='form-select'
          id='coordPanelSelect'
          name='actv_panel'
          data-title='Opção de Painel Ativa'
          value={selectedOption}
          onChange={change => {
            setSelectedOption(change.target.value as panelOpts);
            setRender(panelComponents[change.target.value as panelOpts]);
            const formRoot = formRootRef.current ?? document.getElementById("formRoot");
            if (!formRoot) return;
            formRoot.style.opacity = "0";
          }}
          autoFocus
          required>
          <optgroup id='grpRegst' label={navigatorVars.pt ? `Registro` : `Registering`}>
            {(userClass === "coordenador" || userClass === "supervisor") && (
              <option value='registStud'>{navigatorVars.pt ? `Registrar Estudante` : `Register Student`}</option>
            )}
            {userClass === "coordenador" && (
              <option value='registProf'>
                {navigatorVars.pt ? `Registrar Profissional` : `Register Professional`}
              </option>
            )}
            {(userClass === "coordenador" || userClass === "supervisor") && (
              <option value='removeStud'>{navigatorVars.pt ? `Lista de Estudantes` : `List of Students`}</option>
            )}
            {(userClass === "coordenador" || userClass === "supervisor") && (
              <option value='removeProf'>
                {navigatorVars.pt ? `Lista de Profissionais` : `List of Professionals`}
              </option>
            )}
            <option value='pacList'>{navigatorVars.pt ? `Lista de Pacientes` : `List of Patients`}</option>
          </optgroup>
          <optgroup id='grpDates' label={navigatorVars.pt ? `Panels` : `Painéis`}>
            <option value='agenda'>{navigatorVars.pt ? `Agendamento` : `Calendar`}</option>
            <option value='dashboard'>{navigatorVars.pt ? `Estátisticas` : "Statistics"}</option>
          </optgroup>
        </select>
      </div>
      <hr />
      <div role='group' ref={formRootRef} id='formRoot'>
        <ErrorBoundary
          FallbackComponent={() => <GenericErrorComponent message='Error rendering Selected Form for Panel' />}>
          {rendered}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}
