"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  Dropdown,
} from "antd";

import {
  BiBuildings,
  BiCart,
  BiUser,
  BiMoneyWithdraw,
  BiCog,
  BiHomeAlt2,
  BiMenu,
  BiX,
  BiSun,
  BiMoon,
  BiChevronRight,
  BiChevronDown,
  BiLogOut,
} from "react-icons/bi";

import { TbReport } from "react-icons/tb";

import { getCookie } from "@/helpers/Cookies";

import {
  useGeanovaTheme,
} from "@/components/providers/GeanovaThemeProvider";


/* =========================================================
   MENÚ PRINCIPAL
   ========================================================= */

const MENU = [
  {
    descripcion: null,
    titulo: "Inicio",
    href: "/",
    icono: BiHomeAlt2,
    siempreVisible: true,
  },
  {
    descripcion: "Terreno",
    titulo: "Terrenos",
    href: "/terrenos/crear",
    icono: BiBuildings,
  },
  {
    descripcion: "Ventas",
    titulo: "Ventas",
    href: "/ventas",
    icono: BiCart,
  },
  {
    descripcion: "Clientes",
    titulo: "Clientes",
    href: "/cliente",
    icono: BiUser,
  },
  {
    descripcion: "Recursos",
    titulo: "Recursos",
    href: "/recursos",
    icono: BiMoneyWithdraw,
  },
  {
    descripcion: "Reportes",
    titulo: "Reportes",
    href: "/reportes",
    icono: TbReport,
  },
  {
    descripcion: "Configuracion",
    titulo: "Configuración",
    href: "/configuracion",
    icono: BiCog,
  },
];


/* =========================================================
   TÍTULOS POR RUTA
   ========================================================= */

const TITULOS_RUTA = {
  "/": "Inicio",
  "/terrenos": "Terrenos",
  "/ventas": "Ventas",
  "/cliente": "Clientes",
  "/recursos": "Recursos",
  "/reportes": "Reportes",
  "/configuracion": "Configuración",
};


export default function AppShell({
  children,
}) {

  const pathname =
    usePathname();

  const router =
    useRouter();


  /* =========================================================
     HOME
     ========================================================= */

const esInicio =
  pathname === "/";

const esLogin =
  pathname === "/login";

  /* =========================================================
     TEMA GLOBAL
     ========================================================= */

  const {
    tema,
    cambiarTema,
  } = useGeanovaTheme();


  /* =========================================================
     ESTADOS DEL LAYOUT
     ========================================================= */

  const [
    menuAbierto,
    setMenuAbierto,
  ] = useState(false);


  const [
    sidebarReducido,
    setSidebarReducido,
  ] = useState(false);


  const [
    cookieMenu,
    setCookieMenu,
  ] = useState([]);


  /* =========================================================
     USUARIO
     ========================================================= */

  const [
    usuarioInfo,
    setUsuarioInfo,
  ] = useState(null);


  /* =========================================================
     CARGA INICIAL
     ========================================================= */

  useEffect(() => {

    cargarMenu();
    cargarUsuario();

  }, []);


  /* =========================================================
     CARGAR USUARIO
     ========================================================= */

  const cargarUsuario = () => {

    if (
      typeof window === "undefined"
    ) {
      return;
    }


    try {

      const usuarioGuardado =
        localStorage.getItem(
          "usuario"
        );


      if (
        !usuarioGuardado
      ) {

        setUsuarioInfo(
          null
        );

        return;
      }


      const usuario =
        JSON.parse(
          usuarioGuardado
        );


      setUsuarioInfo(
        usuario
      );

    } catch (error) {

      console.error(
        "Error al cargar usuario:",
        error
      );


      setUsuarioInfo(
        null
      );

    }

  };


  /* =========================================================
     CARGAR MENÚ / PERMISOS
     ========================================================= */

  const cargarMenu =
    async () => {

      try {

        const cookie =
          await getCookie(
            "menu"
          );


        if (
          !cookie?.value
        ) {

          setCookieMenu(
            []
          );

          return;

        }


        const menu =
          JSON.parse(
            cookie.value
          );


        setCookieMenu(
          Array.isArray(menu)
            ? menu
            : []
        );

      } catch (error) {

        console.error(
          "Error al cargar el menú:",
          error
        );


        setCookieMenu(
          []
        );

      }

    };


  /* =========================================================
     CERRAR SESIÓN
     ========================================================= */

  const cerrarSesion = () => {

    if (
      typeof window === "undefined"
    ) {
      return;
    }


    /* -------------------------------------------------------
       LOCAL STORAGE
       ------------------------------------------------------- */

    localStorage.removeItem(
      "usuario"
    );


    /*
     * Si guardas otros datos del usuario
     * puedes eliminarlos también.
     */

    localStorage.removeItem(
      "menu"
    );


    /* -------------------------------------------------------
       COOKIES

       Borramos las cookies accesibles desde el navegador.
       ------------------------------------------------------- */

    eliminarCookie(
      "usuario"
    );

    eliminarCookie(
      "menu"
    );

    eliminarCookie(
      "permisos"
    );


    /* -------------------------------------------------------
       LIMPIAR ESTADO
       ------------------------------------------------------- */

    setUsuarioInfo(
      null
    );


    setCookieMenu(
      []
    );


    /* -------------------------------------------------------
       LOGIN

       Si tu login utiliza otra ruta,
       cambia "/login".
       ------------------------------------------------------- */

    router.replace(
      "/login"
    );


    router.refresh();

  };


  /* =========================================================
     CERRAR MENÚ MÓVIL AL CAMBIAR RUTA
     ========================================================= */

  useEffect(() => {

    setMenuAbierto(
      false
    );

  }, [pathname]);


  /* =========================================================
     PERMISOS
     ========================================================= */

  const permisos =
    useMemo(() => {

      return cookieMenu.reduce(
        (
          resultado,
          item
        ) => {

          if (
            item?.descripcion
          ) {

            resultado[
              item.descripcion
            ] = true;

          }


          return resultado;

        },
        {}
      );

    }, [cookieMenu]);


  /* =========================================================
     OPCIONES DISPONIBLES
     ========================================================= */

  const opcionesMenu =
    useMemo(() => {

      return MENU.filter(
        (opcion) =>
          opcion.siempreVisible ||
          permisos[
            opcion.descripcion
          ]
      );

    }, [permisos]);


  /* =========================================================
     TÍTULO ACTUAL
     ========================================================= */

  const tituloActual =
    obtenerTitulo(
      pathname
    );


  /* =========================================================
     NOMBRE USUARIO
     ========================================================= */

  const nombreUsuario =
    obtenerNombreUsuario(
      usuarioInfo
    );


  /* =========================================================
     INICIAL USUARIO
     ========================================================= */

  const inicialUsuario =
    nombreUsuario
      ? nombreUsuario
          .charAt(0)
          .toUpperCase()
      : "G";


  /* =========================================================
     MENÚ USUARIO
     ========================================================= */

  const menuUsuario = {

    items: [

      {
        key:
          "informacion",

        disabled:
          true,

        label: (

          <div className="app-user-dropdown__profile">

            <div className="app-user-dropdown__avatar">

              {inicialUsuario}

            </div>


            <div>

              <strong>
                {nombreUsuario}
              </strong>

              <span>
                Geanova
              </span>

            </div>

          </div>

        ),
      },


      {
        type:
          "divider",
      },


      {
        key:
          "logout",

        danger:
          true,

        icon:
          <BiLogOut size={18} />,

        label:
          "Cerrar sesión",

        onClick:
          cerrarSesion,
      },

    ],

  };


  /* =========================================================
     CLASE GENERAL
     ========================================================= */

  const appShellClassName = [

    "app-shell",

    esInicio
      ? "app-shell--home"
      : "",

    !esInicio &&
    sidebarReducido
      ? "app-shell--collapsed"
      : "",

  ]
    .filter(Boolean)
    .join(" ");

if (esLogin) {
  return (
    <main className="app-login">
      {children}
    </main>
  );
}
  return (

    <div
      className={
        appShellClassName
      }
    >
      

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      {!esInicio && (

        <>

          <aside
            className={
              menuAbierto
                ? "app-sidebar app-sidebar--open"
                : "app-sidebar"
            }
          >

            {/* ===============================================
                LOGO
                =============================================== */}

            <div className="app-sidebar__header">

              <Link
                href="/"
                className="app-sidebar__brand"
                aria-label="Ir al inicio"
              >

                <div className="app-sidebar__logo-full">

                  <Image
                    src="/geanova.svg"
                    width={130}
                    height={54}
                    priority
                    alt="Geanova Inmobiliaria"
                  />

                </div>


                <div className="app-sidebar__logo-small">

                  G

                </div>

              </Link>


              <button
                type="button"
                className="app-sidebar__mobile-close"
                onClick={() =>
                  setMenuAbierto(
                    false
                  )
                }
                aria-label="Cerrar menú"
              >

                <BiX />

              </button>

            </div>


            {/* ===============================================
                MENÚ
                =============================================== */}

            <div className="app-sidebar__section">

              <span className="app-sidebar__section-title">

                MENÚ PRINCIPAL

              </span>


              <nav
                className="app-sidebar__nav"
                aria-label="Menú principal"
              >

                {opcionesMenu.map(
                  (opcion) => {

                    const Icono =
                      opcion.icono;


                    const activo =
                      rutaActiva(
                        pathname,
                        opcion.href
                      );


                    return (

                      <Link
                        key={
                          opcion.href
                        }
                        href={
                          opcion.href
                        }
                        className={
                          activo
                            ? "app-sidebar__item app-sidebar__item--active"
                            : "app-sidebar__item"
                        }
                        title={
                          sidebarReducido
                            ? opcion.titulo
                            : undefined
                        }
                      >

                        <span className="app-sidebar__item-icon">

                          <Icono />

                        </span>


                        <span className="app-sidebar__item-label">

                          {
                            opcion.titulo
                          }

                        </span>


                        <BiChevronRight
                          className="app-sidebar__item-arrow"
                        />

                      </Link>

                    );

                  }
                )}

              </nav>

            </div>


            {/* ===============================================
                FOOTER
                =============================================== */}

            <div className="app-sidebar__footer">

              <div className="app-sidebar__footer-text">

                <span>
                  Geanova
                </span>

                <small>
                  Sistema inmobiliario
                </small>

              </div>

            </div>

          </aside>


          {/* ===============================================
              OVERLAY MÓVIL
              =============================================== */}

          {menuAbierto && (

            <button
              type="button"
              className="app-sidebar-overlay"
              aria-label="Cerrar menú"
              onClick={() =>
                setMenuAbierto(
                  false
                )
              }
            />

          )}

        </>

      )}


      {/* =====================================================
          CONTENIDO PRINCIPAL
          ===================================================== */}

      <div className="app-main">


        {/* ===================================================
            HEADER
            =================================================== */}

        <header
          className={
            esInicio
              ? "app-header app-header--home"
              : "app-header"
          }
        >

          {/* ===============================================
              IZQUIERDA
              =============================================== */}

          {!esInicio && (

            <div className="app-header__left">


              {/* MENÚ MÓVIL */}

              <button
                type="button"
                className="app-header__mobile-menu"
                onClick={() =>
                  setMenuAbierto(
                    true
                  )
                }
                aria-label="Abrir menú"
                aria-expanded={
                  menuAbierto
                }
              >

                <BiMenu />

              </button>


              {/* CONTRAER SIDEBAR */}

              <button
                type="button"
                className="app-header__collapse"
                onClick={() =>
                  setSidebarReducido(
                    (actual) =>
                      !actual
                  )
                }
                aria-label={
                  sidebarReducido
                    ? "Expandir menú"
                    : "Contraer menú"
                }
              >

                <BiMenu />

              </button>


              {/* BREADCRUMB */}

              <div className="app-header__title">

                <span>
                  Geanova
                </span>

                <BiChevronRight />

                <strong>
                  {tituloActual}
                </strong>

              </div>

            </div>

          )}


          {/* ===============================================
              DERECHA
              =============================================== */}

          <div className="app-header__right">


            {/* MODO OSCURO */}

            <button
              type="button"
              className="app-header__theme"
              onClick={
                cambiarTema
              }
              title={
                tema === "dark"
                  ? "Cambiar a modo claro"
                  : "Cambiar a modo oscuro"
              }
              aria-label={
                tema === "dark"
                  ? "Cambiar a modo claro"
                  : "Cambiar a modo oscuro"
              }
            >

              {tema === "dark" ? (
                <BiSun />
              ) : (
                <BiMoon />
              )}

            </button>


            <div className="app-header__divider" />


            {/* ===============================================
                USUARIO + CERRAR SESIÓN
                =============================================== */}

            <Dropdown
              menu={
                menuUsuario
              }
              trigger={[
                "click",
              ]}
              placement="bottomRight"
            >

              <button
                type="button"
                className="app-header__user app-header__user--button"
                aria-label="Abrir menú de usuario"
              >

                <div className="app-header__avatar">

                  {inicialUsuario}

                </div>


                <div className="app-header__user-info">

                  <strong>
                    {nombreUsuario}
                  </strong>

                  <span>
                    Geanova
                  </span>

                </div>


                <BiChevronDown
                  className="app-header__user-chevron"
                />

              </button>

            </Dropdown>

          </div>

        </header>


        {/* ===================================================
            PÁGINA
            =================================================== */}

        <main className="app-content">

          {children}

        </main>

      </div>

    </div>

  );

}


/* =========================================================
   BORRAR COOKIE
   ========================================================= */

function eliminarCookie(
  nombre
) {

  if (
    typeof document === "undefined"
  ) {
    return;
  }


  document.cookie =
    nombre +
    "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";


  /*
   * También intentamos sin path específico
   * por compatibilidad con cookies antiguas.
   */

  document.cookie =
    nombre +
    "=; Max-Age=0; path=/;";

}


/* =========================================================
   NOMBRE USUARIO
   ========================================================= */

function obtenerNombreUsuario(
  usuario
) {

  if (!usuario) {
    return "Usuario";
  }


  if (
    usuario.nombre_completo
  ) {

    return usuario.nombre_completo;

  }


  if (
    usuario.nombre
  ) {

    return usuario.nombre;

  }


  if (
    usuario.primer_nombre
  ) {

    return usuario.primer_nombre;

  }


  if (
    usuario.usuario
  ) {

    return usuario.usuario;

  }


  return "Usuario";

}


/* =========================================================
   RUTA ACTIVA
   ========================================================= */

function rutaActiva(
  pathname,
  href
) {

  if (!pathname) {
    return false;
  }


  if (href === "/") {
    return pathname === "/";
  }


  const base =
    href
      .split("/")
      .slice(0, 2)
      .join("/");


  return pathname.startsWith(
    base
  );

}


/* =========================================================
   OBTENER TÍTULO
   ========================================================= */

function obtenerTitulo(
  pathname
) {

  if (!pathname) {
    return "Inicio";
  }


  if (
    pathname === "/"
  ) {
    return "Inicio";
  }


  const coincidencia =
    Object.entries(
      TITULOS_RUTA
    ).find(
      ([ruta]) =>
        ruta !== "/" &&
        pathname.startsWith(
          ruta
        )
    );


  if (
    coincidencia
  ) {

    return coincidencia[1];

  }


  return "Geanova";

}