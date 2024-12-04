import { RootCtx } from "../../../src/App";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect, useContext, useRef } from "react";
import GenericErrorComponent from "../../error/GenericErrorComponent";
import { RootCtxType } from "../../../src/lib/global/declarations/interfaces";
import { registerRoot } from "../../../src/lib/global/handlers/gHandlers";
import EnhancedUserProfilePanel from "../../user/EnhancedUserProfilePanel";
export default function UserProfilePanelWrapper(): JSX.Element {
  const context = useContext<RootCtxType>(RootCtx),
    hasInitializedRoot = useRef<boolean>(false);
  useEffect(() => {
    const profileSpan = document.getElementById("rootUserInfo");
    if (profileSpan instanceof HTMLElement) {
      if (!hasInitializedRoot.current) {
        context.roots.userRoot = registerRoot(context.roots.userRoot, `#${profileSpan.id}`);
        hasInitializedRoot.current = true;
      }
      if (!profileSpan.hasChildNodes()) context.roots.userRoot?.render(<EnhancedUserProfilePanel />);
      const timeoutId = setTimeout(() => {
        if (!profileSpan.querySelector("img"))
          context.roots.userRoot?.render(<GenericErrorComponent message='Erro renderizando painel de usuário' />);
      }, 2000);
      return (): void => clearTimeout(timeoutId);
    }
  }, [context.roots]);
  return (
    <ErrorBoundary FallbackComponent={() => <GenericErrorComponent message='Error loading User Panel' />}>
      <EnhancedUserProfilePanel />
    </ErrorBoundary>
  );
}
