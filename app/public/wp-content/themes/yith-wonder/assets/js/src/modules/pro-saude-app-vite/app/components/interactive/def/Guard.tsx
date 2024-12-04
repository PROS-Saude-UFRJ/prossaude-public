"use client";
import { execLogout } from "../../../src/lib/global/auth";
import { navigatorVars } from "../../../src/vars";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
export default function Guard(): JSX.Element {
  const navigate = useNavigate(),
    toastTimer = 500,
    authorizationToasted = useRef<boolean>(false),
    errorToasted = useRef<boolean>(false),
    testToasted = useRef<boolean>(false);
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      if (!errorToasted.current) {
        setTimeout(() => {
          toast.error(
            navigatorVars.pt ? "Por favor logue no sistema antes de prosseguir." : "Please login before proceeding.",
          );
        }, toastTimer);
        errorToasted.current = true;
        setTimeout(() => (errorToasted.current = false), toastTimer * 2);
      }
      if (!testToasted.current) {
        setTimeout(() => {
          toast(
            navigator.language.startsWith("en")
              ? "For this test version, type any entry that is not empty!"
              : "Para esta versão de teste, digite qualquer login que não seja vazio!",
            { icon: "🛠" },
          );
        }, toastTimer);
        testToasted.current = true;
        setTimeout(() => (testToasted.current = false), toastTimer * 2);
      }
      execLogout(navigate);
      // timerCounter && clearInterval(timerCounter);
      return;
    }
    if (!localStorage.getItem("timer")) localStorage.setItem("timer", "6000");
    if (!localStorage.getItem("authorized") || localStorage.getItem("authorized") !== "true") {
      if (!authorizationToasted.current) {
        setTimeout(() => {
          toast.error(
            navigatorVars.pt
              ? "Usuário não autorizado. Retornando à tela de login."
              : "User unauthorized. Returning to login page.",
          );
        }, toastTimer);
        authorizationToasted.current = true;
        setTimeout(() => (authorizationToasted.current = false), toastTimer * 2);
      }
      if (!testToasted.current) {
        setTimeout(() => {
          toast(
            navigator.language.startsWith("en")
              ? "For this test version, type any entry that is not empty!"
              : "Para esta versão de teste, digite qualquer login que não seja vazio!",
            { icon: "🛠" },
          );
        }, toastTimer);
        testToasted.current = true;
        setTimeout(() => (testToasted.current = false), toastTimer * 2);
      }
      execLogout(navigate);
      // timerCounter && clearInterval(timerCounter);
    }
  }, [navigate]);
  return <></>;
}
