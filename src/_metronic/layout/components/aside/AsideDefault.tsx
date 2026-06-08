import { Link } from "react-router-dom";
import clsx from "clsx";
import { useLayout } from "../../core";
import { toAbsoluteUrl } from "../../../helpers";
import { AsideMenu } from "./AsideMenu";
// import { AsideUserMenu } from "../../../partials";
import { useThemeMode } from "../../../partials/layout/theme-mode/ThemeModeProvider";
// import { useMediaQuery } from 'usehooks-ts'
const AsideDefault = () => {
  const { classes } = useLayout();
  const { mode } = useThemeMode();

  return (

    <div
      id="kt_aside"
      className={clsx("aside py-9", classes.aside.join(" "))}
      data-kt-drawer="true"
      data-kt-drawer-name="aside"
      data-kt-drawer-activate="{default: true, lg: false}"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction="start"
      data-kt-drawer-toggle="#kt_aside_toggle"
    >
      {/* begin::Brand */}
      <div className="aside-logo flex-column-auto px-9 mb-9" id="kt_aside_logo">
        {/* begin::Logo */}
        <Link to="/dashboard">
          {mode === "light" && (
            <div className="d-flex align-items-center">
              <img
                alt="Logo"
                className="h-35px logo theme-light-show me-2 "
                src={toAbsoluteUrl("media/logos/rtv_logo.png")}
              />
              <span>
                <h1 className="d-flex flex-column text-gray-900 fw-bolder my-0 fs-1">
                  {" "}
                   RTV
                </h1>
              </span>
            </div>
          )}

          {mode === "dark" && (
            <div className="d-flex align-items-center">
            <img
              alt="Logo"
              className="h-35px logo theme-dark-show me-2 "
              src={toAbsoluteUrl("media/logos/rtv_logo.png")}
            />
            <span>
              <h1 className="d-flex flex-column text-gray-900 fw-bolder my-0 fs-1">
                {" "}
                 RTV
              </h1>
            </span>
          </div>
          )}
        </Link>
        {/* end::Logo */}
      </div>
      {/* end::Brand */}

      {/* begin::Aside menu */}
      <div
        id="kt_aside_menu"
        className="aside-menu flex-column-fluid ps-5 pe-3 mb-9"
      >
        <AsideMenu asideMenuCSSClasses={classes.asideMenu} />
      </div>
      {/* end::Aside menu */}


    </div>
  );
};

export { AsideDefault };
