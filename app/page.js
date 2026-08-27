"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  BiBuildings,
  BiCart,
  BiMoneyWithdraw,
  BiUser,
  BiCog,
  BiMapAlt,
} from "react-icons/bi";

import { TbReport } from "react-icons/tb";

import { getCookie } from "@/helpers/Cookies";

const MODULOS = [
  {
    descripcion: "Terreno",
    titulo: "Terrenos",
    descripcionCorta: "Administración de proyectos, etapas y lotes.",
    href: "/terrenos/crear",
    icono: BiBuildings,
  },
  {
    descripcion: "Ventas",
    titulo: "Ventas",
    descripcionCorta: "Solicitudes, contratos y seguimiento comercial.",
    href: "/ventas",
    icono: BiCart,
  },
  {
    descripcion: "Clientes",
    titulo: "Clientes",
    descripcionCorta: "Consulta y administración de clientes.",
    href: "/cliente",
    icono: BiUser,
  },
  {
    descripcion: "Recursos",
    titulo: "Recursos",
    descripcionCorta: "Control financiero y recursos de la inmobiliaria.",
    href: "/recursos",
    icono: BiMoneyWithdraw,
  },
  {
    descripcion: "Reportes",
    titulo: "Reportes",
    descripcionCorta: "Indicadores, estadísticas y reportes operativos.",
    href: "/reportes",
    icono: TbReport,
  },
  {
    descripcion: "Configuracion",
    titulo: "Configuración",
    descripcionCorta: "Configuración general y catálogos del sistema.",
    href: "/configuracion",
    icono: BiCog,
  },
];

export default function Home() {
  const [cookieMenu, setCookieMenu] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarMenu();
  }, []);

  const cargarMenu = async () => {
    try {
      const cookie = await getCookie("menu");

      if (!cookie || !cookie.value) {
        setCookieMenu([]);
        return;
      }

      const menu = JSON.parse(cookie.value);

      setCookieMenu(
        Array.isArray(menu)
          ? menu
          : []
      );
    } catch (error) {
      console.error(
        "Error al obtener el menú:",
        error
      );

      setCookieMenu([]);
    } finally {
      setCargando(false);
    }
  };

  const permisos = useMemo(() => {
    return cookieMenu.reduce(
      (resultado, item) => {
        if (item && item.descripcion) {
          resultado[item.descripcion] = true;
        }

        return resultado;
      },
      {}
    );
  }, [cookieMenu]);

  const modulosDisponibles = useMemo(() => {
    return MODULOS.filter(
      (modulo) =>
        permisos[modulo.descripcion]
    );
  }, [permisos]);

  return (
    <main className="geanova-home">
      <div className="geanova-home__container">

      <header className="geanova-home__header">

        <div className="geanova-home__hero">

          <div className="geanova-home__brand">

            <Image
              src="/geanova.svg"
              width={230}
              height={140}
              priority
              alt="Geanova Inmobiliaria"
            />

          </div>


          <div className="geanova-home__welcome">

            <span className="geanova-home__eyebrow">
              SISTEMA ADMINISTRATIVO
            </span>

            <h1 className="geanova-home__title">
              Bienvenido
            </h1>
           
          </div>

        </div>

      </header>

        <section className="geanova-home__section">

          <div className="geanova-home__section-header">

            <div>
              <h2 className="geanova-home__section-title">
                Módulos
              </h2>

              <p className="geanova-home__section-description">
                Accede a las herramientas disponibles
                de acuerdo con tu perfil.
              </p>
            </div>

          </div>

          {cargando ? (

            <div className="geanova-modules-loading">
              <div className="geanova-module-skeleton" />
              <div className="geanova-module-skeleton" />
              <div className="geanova-module-skeleton" />
              <div className="geanova-module-skeleton" />
              <div className="geanova-module-skeleton" />
              <div className="geanova-module-skeleton" />
            </div>

          ) : modulosDisponibles.length > 0 ? (

            <div className="geanova-modules-grid">

              {modulosDisponibles.map((modulo) => {
                const Icono = modulo.icono;

                return (
                  <Link
                    key={modulo.descripcion}
                    href={modulo.href}
                    className="geanova-module-card"
                  >

                    <div className="geanova-module-card__icon">
                      <Icono />
                    </div>

                    <div className="geanova-module-card__content">

                      <h3 className="geanova-module-card__title">
                        {modulo.titulo}
                      </h3>

                      <p className="geanova-module-card__description">
                        {modulo.descripcionCorta}
                      </p>

                    </div>

                    <div className="geanova-module-card__arrow">
                      →
                    </div>

                  </Link>
                );
              })}

            </div>

          ) : (

            <div className="empty-state">

              <BiMapAlt size={36} />

              <strong>
                No hay módulos disponibles
              </strong>

              <span>
                Tu usuario no tiene módulos
                asignados actualmente.
              </span>

            </div>

          )}

        </section>

      </div>
    </main>
  );
}