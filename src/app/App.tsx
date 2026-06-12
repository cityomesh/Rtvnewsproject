import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { I18nProvider } from "../_metronic/i18n/i18nProvider";
import { LayoutProvider, LayoutSplashScreen } from "../_metronic/layout/core";
import { MasterInit } from "../_metronic/layout/MasterInit";
import { AuthInit } from "./modules/auth";
import { ThemeModeProvider } from "../_metronic/partials/layout/theme-mode/ThemeModeProvider";
import useIdleTimeout from "./hooks/useIdleTimeout";
import { SnackbarProvider } from "notistack";

const App = () => {
  useIdleTimeout(10);   // ✅ 10 నిమిషాల timeout

  return (
    <SnackbarProvider autoHideDuration={1000}>
      <Suspense fallback={<LayoutSplashScreen />}>
        <I18nProvider>
          <LayoutProvider>
            <ThemeModeProvider>
              <AuthInit>
                <Outlet />
                <MasterInit />
              </AuthInit>
            </ThemeModeProvider>
          </LayoutProvider>
        </I18nProvider>
      </Suspense>
    </SnackbarProvider>
  );
};

export { App };
