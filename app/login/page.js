"use client";

import {
  useContext,
  useEffect,
} from "react";

import {
  Button,
  Form,
} from "antd";

import Image from "next/image";

import {
  useRouter,
} from "next/navigation";

import {
  BiBuildings,
  BiLogIn,
  BiShieldQuarter,
} from "react-icons/bi";

import Swal from "sweetalert2";

import usuariosService from "@/services/usuariosService";

import InputIn from "@/components/Input";

import {
  LoadingContext,
} from "@/contexts/loading";

import {
  assignCookie,
} from "./Cookie";


export default function LoginPage() {

  const router =
    useRouter();


  const loadingContext =
    useContext(
      LoadingContext
    );


  if (!loadingContext) {

    throw new Error(
      "LoginPage debe estar dentro de LoadingProvider"
    );

  }


  const {
    setIsLoading,
  } = loadingContext;


  /* =========================================================
     VERIFICAR SI YA EXISTE SESIÓN
     ========================================================= */

  useEffect(() => {

    if (
      typeof window === "undefined"
    ) {
      return;
    }


    try {

      const storedUsuario =
        window.localStorage.getItem(
          "usuario"
        );


      if (!storedUsuario) {
        return;
      }


      const usuario =
        JSON.parse(
          storedUsuario
        );


      if (
        usuario &&
        usuario.id
      ) {

        router.replace(
          "/"
        );

      }

    } catch (error) {

      console.error(
        "Error al verificar la sesión:",
        error
      );


      /*
       * Si localStorage quedó corrupto,
       * lo eliminamos para permitir entrar.
       */

      window.localStorage.removeItem(
        "usuario"
      );

    }

  }, [
    router,
  ]);


  /* =========================================================
     LOGIN
     ========================================================= */

  const onLoginUsuario =
    function (credenciales) {

      setIsLoading(
        true
      );


      usuariosService.authUser(
        credenciales,
        onUsuarioLoaded,
        onError
      );

    };


  /* =========================================================
     LOGIN CORRECTO
     ========================================================= */

  const onUsuarioLoaded =
    async function (data) {

      setIsLoading(
        false
      );


      if (
        !data ||
        !data.success
      ) {

        Swal.fire({

          title:
            "No fue posible iniciar sesión",

          icon:
            "error",

          text:
            data && data.message
              ? data.message
              : "Verifique su usuario y contraseña.",

          confirmButtonText:
            "Aceptar",

          buttonsStyling:
            false,

          customClass: {

            popup:
              "swal-geanova",

            confirmButton:
              "swal-geanova-confirm",

          },

        });


        return;

      }


      try {

        /* =====================================================
           COOKIES
           ===================================================== */

        await assignCookie(
          "permisos",
          JSON.stringify(
            data.permisos || []
          )
        );


        await assignCookie(
          "menu",
          JSON.stringify(
            data.menu || []
          )
        );


        /*
         * Conservo tu comportamiento actual:
         * esta cookie funciona como indicador
         * de que existe una sesión.
         */

        await assignCookie(
          "usuario",
          JSON.stringify(
            data.success
          )
        );


        /* =====================================================
           USUARIO LOCAL
           ===================================================== */

        window.localStorage.setItem(
          "usuario",
          JSON.stringify(
            data.user
          )
        );


        /* =====================================================
           ENTRAR AL SISTEMA
           ===================================================== */

        router.replace(
          "/"
        );


        router.refresh();

      } catch (error) {

        console.error(
          "Error guardando la sesión:",
          error
        );


        Swal.fire({

          title:
            "Error de sesión",

          icon:
            "error",

          text:
            "El usuario fue validado, pero no fue posible guardar la sesión.",

          confirmButtonText:
            "Aceptar",

          buttonsStyling:
            false,

          customClass: {

            popup:
              "swal-geanova",

            confirmButton:
              "swal-geanova-confirm",

          },

        });

      }

    };


  /* =========================================================
     ERROR DE SERVICIO
     ========================================================= */

  const onError =
    function (error) {

      setIsLoading(
        false
      );


      console.error(
        "LoginPage:",
        error
      );


      Swal.fire({

        title:
          "Error",

        icon:
          "error",

        text:
          "No fue posible comunicarse con el servidor. Intente nuevamente.",

        confirmButtonText:
          "Aceptar",

        buttonsStyling:
          false,

        customClass: {

          popup:
            "swal-geanova",

          confirmButton:
            "swal-geanova-confirm",

        },

      });

    };


  /* =========================================================
     RENDER
     ========================================================= */

  return (

    <div className="login-page">

      <div className="login-background-decoration login-background-decoration--1" />

      <div className="login-background-decoration login-background-decoration--2" />


      <div className="login-container">


        {/* ===================================================
            PRESENTACIÓN
            =================================================== */}

        <section className="login-brand-panel">

          <div className="login-brand-panel__content">

            <div className="login-brand-logo">

              <Image
                src="/geanova.svg"
                alt="Geanova Inmobiliaria"
                width={190}
                height={80}
                priority
              />

            </div>


            <span className="login-brand-eyebrow">

              <BiBuildings />

              SISTEMA INMOBILIARIO

            </span>


            <h1 className="login-brand-title">

              Administración inmobiliaria
              en un solo lugar.

            </h1>


            <p className="login-brand-description">

              Gestiona terrenos, ventas,
              clientes, cobranza y reportes
              desde la plataforma de Geanova.

            </p>


            <div className="login-brand-security">

              <div className="login-brand-security__icon">

                <BiShieldQuarter />

              </div>


              <div>

                <strong>
                  Acceso seguro
                </strong>

                <span>
                  Utiliza tus credenciales autorizadas
                  para ingresar al sistema.
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            LOGIN
            =================================================== */}

        <section className="login-form-panel">

          <div className="login-card">


            {/* ===============================================
                LOGO MÓVIL
                =============================================== */}

            <div className="login-card__mobile-logo">

              <Image
                src="/geanova.svg"
                alt="Geanova Inmobiliaria"
                width={155}
                height={65}
                priority
              />

            </div>


            {/* ===============================================
                HEADER FORM
                =============================================== */}

            <div className="login-card__header">

              <span className="login-card__eyebrow">

                ACCESO AL SISTEMA

              </span>


              <h2>

                Iniciar sesión

              </h2>


              <p>

                Ingresa tus credenciales para
                continuar a Geanova.

              </p>

            </div>


            {/* ===============================================
                FORM
                =============================================== */}

            <Form

              name="login"

              onFinish={
                onLoginUsuario
              }

              autoComplete="off"

              layout="vertical"

              className="login-form"

              requiredMark={
                false
              }

            >

              <InputIn

                placeholder=
                  "Ingrese su nombre de usuario"

                name=
                  "nickname"

                label=
                  "Usuario"

                rules={[
                  {
                    required:
                      true,

                    message:
                      "Ingrese su usuario",
                  },
                ]}

              />


              <InputIn

                placeholder=
                  "Ingrese su contraseña"

                name=
                  "password"

                label=
                  "Contraseña"

                type=
                  "password"

                rules={[
                  {
                    required:
                      true,

                    message:
                      "Ingrese su contraseña",
                  },
                ]}

              />


              <Button

                htmlType="submit"

                size="large"

                className="login-submit"

              >

                <BiLogIn />

                Iniciar sesión

              </Button>

            </Form>


            {/* ===============================================
                FOOTER
                =============================================== */}

            <div className="login-card__footer">

              <span>
                Geanova Inmobiliaria
              </span>

              <small>
                Sistema administrativo
              </small>

            </div>

          </div>

        </section>

      </div>

    </div>

  );

}