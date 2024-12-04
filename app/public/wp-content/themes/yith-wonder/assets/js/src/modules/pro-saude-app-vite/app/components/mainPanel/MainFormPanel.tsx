"use client";
import { ErrorBoundary } from "react-error-boundary";
import GenericErrorComponent from "../error/GenericErrorComponent";
import SelectPanelLoader from "../panelForms/defs/client/SelectLoader";
import { Provider } from "react-redux";
import panelStore from "../../src/redux/panelStore";
export default function MainFormPanel(): JSX.Element {
  return (
    <Provider store={panelStore}>
      <ErrorBoundary FallbackComponent={() => <GenericErrorComponent message='Error rendering shell for Panel' />}>
        <div role='group' id='formSelDiv' className='form-padded--nosb'>
          <div role='group' id='formPanelDiv'>
            <SelectPanelLoader />
          </div>
        </div>
      </ErrorBoundary>
    </Provider>
  );
}
