"use client";

import { useEffect, useState } from "react";
import { Tooltip } from "antd";

import {
  FaArrowUpRightFromSquare,
  FaPlus,
} from "react-icons/fa6";

import { TbReportAnalytics } from "react-icons/tb";
import { BiBuildings } from "react-icons/bi";

import TerrenoForm from "@/components/TerrenoForm";
import TerrenoInfoForm from "@/components/TerrenoInfoForm";
import ReporteProyectoForm from "@/components/ReporteProyectoForm";

import terrenosService from "@/services/terrenosService";
import { formatPrecio } from "@/helpers/formatters";
import { getCookiePermisos } from "@/helpers/valorPermisos";

export default function TerrenosCrear() {
  const [vista, setVista] = useState("lista");

  const [terrenos, setTerrenos] = useState([]);
  const [terrenoSeleccionado, setTerrenoSeleccionado] = useState(null);

  const [actualizar, setActualizar] = useState(0);

  const [cookiePermisos, setCookiePermisos] = useState(0);

  useEffect(() => {
    cargarTerrenos();

    getCookiePermisos(
      "lista de terrenos",
      setCookiePermisos
    );
  }, [actualizar]);

  const cargarTerrenos = () => {
    terrenosService.getTerrenos(
      (data) => {
        setTerrenos(
          Array.isArray(data)
            ? data
            : []
        );
      },
      (error) => {
        console.error(
          "Error al cargar terrenos:",
          error
        );

        setTerrenos([]);
      }
    );
  };

  const abrirTerreno = (terreno) => {
    setTerrenoSeleccionado(terreno);
    setVista("detalle");
  };

  const regresarLista = () => {
    setVista("lista");
  };

  const refrescarLista = () => {
    setActualizar((valor) => valor + 1);
  };

  if (vista === "nuevo") {
    return (
      <div className="page-container">
        <TerrenoForm
          setTerrenoNuevo={() => regresarLista()}
          setWatch={refrescarLista}
          watch={actualizar}
        />
      </div>
    );
  }

  if (
    vista === "detalle" &&
    terrenoSeleccionado
  ) {
    return (
      <div className="page-container">

        <button
          type="button"
          className="btn btn-secondary terrain-back-button"
          onClick={regresarLista}
        >
          ← Volver a terrenos
        </button>

        <TerrenoInfoForm
          terrenoSeleccionado={
            terrenoSeleccionado
          }
          setTerrenoNuevo={regresarLista}
          setWatch={refrescarLista}
          watch={actualizar}
        />

      </div>
    );
  }

  if (vista === "reporte") {
    return (
      <div className="page-container">

        <button
          type="button"
          className="btn btn-secondary terrain-back-button"
          onClick={regresarLista}
        >
          ← Volver a terrenos
        </button>

        <ReporteProyectoForm
          setReporteNuevo={regresarLista}
          setWatch={refrescarLista}
          watch={actualizar}
        />

      </div>
    );
  }

  return (
    <main className="page">
      <div className="page-container">

        <div className="page-header">

          <div className="page-header__content">

            <div className="page-header__eyebrow">
              <BiBuildings />

              INVENTARIO INMOBILIARIO
            </div>

            <h1 className="page-title">
              Terrenos
            </h1>

            <p className="page-description">
              Administra proyectos, superficies,
              lotes y configuración comercial.
            </p>

          </div>

          <div className="page-header__actions">

            <button
              type="button"
              className="btn btn-secondary"
              disabled={cookiePermisos < 1}
              onClick={() => setVista("reporte")}
            >
              <TbReportAnalytics />

              Reporte general
            </button>

            <button
              type="button"
              className="btn btn-primary"
              disabled={cookiePermisos < 2}
              onClick={() => setVista("nuevo")}
            >
              <FaPlus />

              Nuevo terreno
            </button>

          </div>

        </div>


        <div className="terrain-summary">

          <div className="kpi-card">

            <div className="kpi-card__label">
              Proyectos registrados
            </div>

            <div className="kpi-card__value">
              {terrenos.length}
            </div>

            <div className="kpi-card__description">
              Total de terrenos disponibles
              en el sistema.
            </div>

          </div>

        </div>


        <section className="card terrain-list-card">

          <div className="card__header">

            <div>

              <h2 className="card__title">
                Lista de terrenos
              </h2>

              <p className="terrain-list-card__description">
                Consulta la información general
                de cada proyecto.
              </p>

            </div>

            <span className="badge badge-primary">
              {terrenos.length} proyectos
            </span>

          </div>


          <div className="terrain-table-wrapper">

            {terrenos.length > 0 ? (

              <table className="table terrain-table">

                <thead>
                  <tr>
                    <th>Proyecto</th>
                    <th>Propietario</th>
                    <th>Ubicación</th>
                    <th>Superficie</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>

                  {terrenos.map((terreno) => (

                    <tr key={terreno.id}>

                      <td>

                        <div className="terrain-project">

                          <div className="terrain-project__icon">
                            <BiBuildings />
                          </div>

                          <div>

                            <strong>
                              {terreno.nombre || "Sin nombre"}
                            </strong>

                            <span>
                              Proyecto inmobiliario
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>
                        {terreno.propietario || "—"}
                      </td>

                      <td>

                        <div className="terrain-location">

                          <strong>
                            {terreno.ciudad || "—"}
                          </strong>

                          <span>
                            {[
                              terreno.colonia,
                              terreno.domicilio,
                            ]
                              .filter(Boolean)
                              .join(" · ") || "Sin dirección"}
                          </span>

                        </div>

                      </td>

                      <td>

                        <strong className="terrain-area">
                          {formatPrecio(
                            terreno.superficie_total
                          )}
                        </strong>

                        <span className="terrain-area__unit">
                          m²
                        </span>

                      </td>

                      <td className="terrain-actions">

                        <Tooltip title="Ver detalles">

                          <button
                            type="button"
                            className="btn btn-icon btn-secondary"
                            onClick={() =>
                              abrirTerreno(terreno)
                            }
                          >
                            <FaArrowUpRightFromSquare />
                          </button>

                        </Tooltip>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            ) : (

              <div className="empty-state">

                <BiBuildings size={34} />

                <strong>
                  Aún no hay terrenos registrados
                </strong>

                <span>
                  Crea un terreno para comenzar
                  a administrar tus proyectos.
                </span>

              </div>

            )}

          </div>

        </section>

      </div>
    </main>
  );
}