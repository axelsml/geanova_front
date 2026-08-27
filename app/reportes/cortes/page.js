"use client";

import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Button,
  Select,
} from "antd";

import Swal from "sweetalert2";

import TablaInformeCortes from "./TablaInformeCortes";

import terrenosService from "@/services/terrenosService";
import pagosService from "@/services/pagosService";

import {
  formatPrecio,
} from "@/helpers/formatters";

import {
  LoadingContext,
} from "@/contexts/loading";


const {
  Option,
} = Select;


/* ============================================================
   RANGO DE MESES
   ============================================================ */

const MESES = [
  {
    id: 1,
    nombre: "1 mes",
  },
  {
    id: 2,
    nombre: "2 meses",
  },
  {
    id: 3,
    nombre: "3 meses",
  },
  {
    id: 4,
    nombre: "4 meses",
  },
  {
    id: 5,
    nombre: "5 meses",
  },
  {
    id: 6,
    nombre: "6 meses",
  },
  {
    id: 7,
    nombre: "7 meses",
  },
  {
    id: 8,
    nombre: "8 meses",
  },
  {
    id: 9,
    nombre: "9 meses",
  },
  {
    id: 10,
    nombre: "10 meses",
  },
  {
    id: 11,
    nombre: "11 meses",
  },
  {
    id: 12,
    nombre: "12 meses",
  },
];


/* ============================================================
   COMPONENTE
   ============================================================ */

export default function InformeCortes() {

  const loadingContext =
    useContext(
      LoadingContext
    );


  if (!loadingContext) {

    throw new Error(
      "InformeCortes debe estar dentro de LoadingProvider"
    );

  }


  const {
    setIsLoading,
  } =
    loadingContext;


  /* ==========================================================
     CATÁLOGOS
     ========================================================== */

  const [
    terrenos,
    setTerrenos,
  ] =
    useState([]);


  const [
    financiamientos,
    setFinanciamientos,
  ] =
    useState([]);


  const [
    sistemasPago,
    setSistemasPago,
  ] =
    useState([]);


  /* ==========================================================
     RESULTADOS
     ========================================================== */

  const [
    informe,
    setInforme,
  ] =
    useState([]);


  const [
    total,
    setTotal,
  ] =
    useState(null);


  const [
    busquedaRealizada,
    setBusquedaRealizada,
  ] =
    useState(false);


  /* ==========================================================
     FILTROS
     ========================================================== */

  const [
    terreno,
    setTerreno,
  ] =
    useState(0);


  const [
    mes,
    setMes,
  ] =
    useState(1);


  const [
    financiamiento,
    setFinanciamiento,
  ] =
    useState(0);


  const [
    sistemaPago,
    setSistemaPago,
  ] =
    useState(0);


  /* ==========================================================
     CARGA INICIAL
     ========================================================== */

  useEffect(
    function () {

      terrenosService.getTerrenos(
        function (data) {

          setTerrenos(
            Array.isArray(data)
              ? data
              : []
          );

        },
        onError
      );


      pagosService.getTiposFinanciamiento(
        function (data) {

          setFinanciamientos(
            Array.isArray(data)
              ? data
              : []
          );

        },
        onError
      );


      pagosService.getSistemasPago(
        function (data) {

          setSistemasPago(
            Array.isArray(data)
              ? data
              : []
          );

        },
        onError
      );

    },
    []
  );


  /* ==========================================================
     ERROR
     ========================================================== */

  function onError(
    error
  ) {

    setIsLoading(
      false
    );


    console.error(
      "InformeCortes:",
      error
    );


    Swal.fire({
      title:
        "Error",

      icon:
        "error",

      text:
        error &&
        error.message
          ? error.message
          : "No fue posible consultar el informe histórico.",

      confirmButtonText:
        "Aceptar",
    });

  }


  /* ==========================================================
     BUSCAR
     ========================================================== */

  function handleSearch() {

    setIsLoading(
      true
    );


    setBusquedaRealizada(
      true
    );


    const params = {

      terreno_id:
        Number(
          terreno ||
          0
        ),

      meses:
        Number(
          mes ||
          1
        ),

      financiamiento_id:
        Number(
          financiamiento ||
          0
        ),

      sistema_pago_id:
        Number(
          sistemaPago ||
          0
        ),

    };


    pagosService.getInformeCortes(
      params,
      onInforme,
      onError
    );

  }


  /* ==========================================================
     RESPUESTA
     ========================================================== */

  function onInforme(
    data
  ) {

    setIsLoading(
      false
    );


    const respuesta =
      data &&
      data.response
        ? data.response
        : null;


    if (
      respuesta &&
      respuesta.success
    ) {

      setInforme(
        Array.isArray(
          respuesta.informe
        )
          ? respuesta.informe
          : []
      );


      setTotal(
        respuesta.total ||
        null
      );


      return;

    }


    setInforme(
      []
    );


    setTotal(
      null
    );


    Swal.fire({
      title:
        "Sin resultados",

      icon:
        "info",

      text:
        respuesta &&
        respuesta.message
          ? respuesta.message
          : "No se encontró información para los filtros seleccionados.",

      confirmButtonText:
        "Aceptar",
    });

  }


  /* ==========================================================
     NOMBRE DEL RANGO
     ========================================================== */

  const nombrePeriodo =
    useMemo(
      function () {

        const item =
          MESES.find(
            function (
              periodo
            ) {

              return (
                Number(
                  periodo.id
                ) ===
                Number(
                  mes
                )
              );

            }
          );


        return item
          ? item.nombre
          : "1 mes";

      },
      [
        mes,
      ]
    );


  /* ==========================================================
     KPIS
     ========================================================== */

  const kpis =
    total
      ? [

          {
            label:
              "Importe acumulado",

            value:
              moneda(
                total.total_importe_acumulado
              ),

            featured:
              true,
          },


          {
            label:
              "Importes al día " +
              entero(
                total.numero_dia
              ),

            value:
              moneda(
                total.importes_al_dia
              ),
          },


          {
            label:
              "Promedio importe al día " +
              entero(
                total.numero_dia
              ),

            value:
              moneda(
                total.total_importe_promedio_al_dia
              ),
          },


          {
            label:
              "Recibos acumulados",

            value:
              entero(
                total.total_recibo_acumulado
              ),
          },


          {
            label:
              "Recibos al día " +
              entero(
                total.numero_dia
              ),

            value:
              entero(
                total.recibos_al_dia
              ),
          },


          {
            label:
              "Promedio recibos al día " +
              entero(
                total.numero_dia
              ),

            value:
              numero(
                total.total_recibos_promedio_al_dia
              ),
          },

        ]
      : [];


  /* ==========================================================
     RENDER
     ========================================================== */

  return (

    <div className="report-history-page">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="report-history-header">

        <div>

          <span className="report-history-header__eyebrow">

            HISTÓRICO DE COBRANZA

          </span>


          <h2 className="report-history-header__title">

            Informe histórico

          </h2>


          <p className="report-history-header__description">

            Analiza el comportamiento histórico de ingresos,
            recibos y cortes por proyecto, financiamiento
            y sistema de pago.

          </p>

        </div>


        <span className="report-history-period">

          {
            nombrePeriodo
          }

        </span>

      </div>


      {/* =====================================================
          FILTROS
          ===================================================== */}

      <section className="report-history-filter-card">

        <div className="report-history-card-header">

          <span>

            FILTROS

          </span>


          <h3>

            Configuración del histórico

          </h3>


          <p>

            Selecciona el periodo y los criterios
            que deseas utilizar para generar el informe.

          </p>

        </div>


        <div className="report-history-filter-grid">


          {/* =================================================
              PROYECTO
              ================================================= */}

          <div className="report-history-filter-item">

            <label>

              Proyecto

            </label>


            <Select
              showSearch
              size="large"
              value={
                terreno
              }
              style={{
                width:
                  "100%",
              }}
              placeholder="Todos los proyectos"
              optionFilterProp="label"
              onChange={
                function (
                  value
                ) {

                  setTerreno(
                    Number(
                      value ||
                      0
                    )
                  );

                }
              }
            >

              <Option
                value={
                  0
                }
                label="Todos"
              >

                Todos

              </Option>


              {terrenos.map(
                function (
                  item
                ) {

                  return (

                    <Option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                      label={
                        item.nombre
                      }
                    >

                      {
                        item.nombre
                      }

                    </Option>

                  );

                }
              )}

            </Select>

          </div>


          {/* =================================================
              MESES
              ================================================= */}

          <div className="report-history-filter-item">

            <label>

              Periodo histórico

            </label>


            <Select
              size="large"
              value={
                mes
              }
              style={{
                width:
                  "100%",
              }}
              onChange={
                function (
                  value
                ) {

                  setMes(
                    Number(
                      value ||
                      1
                    )
                  );

                }
              }
            >

              {MESES.map(
                function (
                  item
                ) {

                  return (

                    <Option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >

                      {
                        item.nombre
                      }

                    </Option>

                  );

                }
              )}

            </Select>

          </div>


          {/* =================================================
              FINANCIAMIENTO
              ================================================= */}

          <div className="report-history-filter-item">

            <label>

              Financiamiento

            </label>


            <Select
              showSearch
              size="large"
              value={
                financiamiento
              }
              style={{
                width:
                  "100%",
              }}
              placeholder="Todos"
              optionFilterProp="label"
              onChange={
                function (
                  value
                ) {

                  setFinanciamiento(
                    Number(
                      value ||
                      0
                    )
                  );

                }
              }
            >

              <Option
                value={
                  0
                }
                label="Todos"
              >

                Todos

              </Option>


              {financiamientos.map(
                function (
                  item
                ) {

                  return (

                    <Option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                      label={
                        item.descripcion
                      }
                    >

                      {
                        item.descripcion
                      }

                    </Option>

                  );

                }
              )}

            </Select>

          </div>


          {/* =================================================
              SISTEMA PAGO
              ================================================= */}

          <div className="report-history-filter-item">

            <label>

              Sistema de pago

            </label>


            <Select
              showSearch
              size="large"
              value={
                sistemaPago
              }
              style={{
                width:
                  "100%",
              }}
              placeholder="Todos"
              optionFilterProp="label"
              onChange={
                function (
                  value
                ) {

                  setSistemaPago(
                    Number(
                      value ||
                      0
                    )
                  );

                }
              }
            >

              <Option
                value={
                  0
                }
                label="Todos"
              >

                Todos

              </Option>


              {sistemasPago.map(
                function (
                  item
                ) {

                  return (

                    <Option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                      label={
                        item.Nombre
                      }
                    >

                      {
                        item.Nombre
                      }

                    </Option>

                  );

                }
              )}

            </Select>

          </div>


          {/* =================================================
              BUSCAR
              ================================================= */}

          <div className="report-history-filter-action">

            <Button
              type="primary"
              size="large"
              className="report-history-search-button"
              onClick={
                handleSearch
              }
            >

              Generar informe

            </Button>

          </div>

        </div>

      </section>


      {/* =====================================================
          KPIS
          ===================================================== */}

      {total && (

        <div className="report-history-kpis">

          {kpis.map(
            function (
              item,
              index
            ) {

              return (

                <div
                  key={
                    item.label +
                    "-" +
                    index
                  }
                  className={
                    item.featured
                      ? "report-history-kpi report-history-kpi--featured"
                      : "report-history-kpi"
                  }
                >

                  <span className="report-history-kpi__label">

                    {
                      item.label
                    }

                  </span>


                  <strong className="report-history-kpi__value">

                    {
                      item.value
                    }

                  </strong>

                </div>

              );

            }
          )}

        </div>

      )}


      {/* =====================================================
          INFORME
          ===================================================== */}

      {informe.length >
        0 && (

        <section className="report-history-results-card">

          <div className="report-history-results-card__header">

            <div>

              <span>

                HISTÓRICO

              </span>


              <h3>

                Cortes del periodo

              </h3>


              <p>

                Compara el comportamiento de los diferentes
                cortes dentro del periodo consultado.

              </p>

            </div>


            <strong>

              {
                informe.length
              }

              {" "}cortes

            </strong>

          </div>


          {/* ===============================================
              SCROLL HORIZONTAL
              =============================================== */}

          <div className="report-history-scroll">

            <div className="report-history-scroll__content">

              {informe.map(
                function (
                  item,
                  index
                ) {

                  return (

                    <div
                      key={
                        item.id ||
                        (
                          "corte-" +
                          index
                        )
                      }
                      className="report-history-cut"
                    >

                      <TablaInformeCortes
                        informe={
                          item
                        }
                      />

                    </div>

                  );

                }
              )}

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          ESTADO INICIAL
          ===================================================== */}

      {!busquedaRealizada &&
        !total && (

        <div className="report-history-empty">

          <strong>

            Consulta el histórico de cortes

          </strong>


          <span>

            Selecciona los filtros superiores
            y genera el informe para consultar
            los resultados históricos.

          </span>

        </div>

      )}

    </div>

  );

}


/* ============================================================
   HELPERS
   ============================================================ */

function numeroSeguro(
  value
) {

  const numero =
    Number(
      value ||
      0
    );


  if (
    isNaN(
      numero
    )
  ) {

    return 0;

  }


  return numero;

}


function moneda(
  value
) {

  return (
    "$ " +
    formatPrecio(
      numeroSeguro(
        value
      )
    )
  );

}


function entero(
  value
) {

  return numeroSeguro(
    value
  ).toLocaleString(
    "es-MX",
    {
      maximumFractionDigits:
        0,
    }
  );

}


function numero(
  value
) {

  return numeroSeguro(
    value
  ).toLocaleString(
    "es-MX",
    {
      minimumFractionDigits:
        0,

      maximumFractionDigits:
        2,
    }
  );

}