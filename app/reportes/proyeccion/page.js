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
  Table,
} from "antd";

import Swal from "sweetalert2";

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
   RANGOS
   ============================================================ */

const MESES = [
  {
    value: 1,
    label: "1 mes",
  },
  {
    value: 2,
    label: "2 meses",
  },
  {
    value: 3,
    label: "3 meses",
  },
  {
    value: 4,
    label: "4 meses",
  },
  {
    value: 5,
    label: "5 meses",
  },
  {
    value: 6,
    label: "6 meses",
  },
  {
    value: 7,
    label: "7 meses",
  },
  {
    value: 8,
    label: "8 meses",
  },
  {
    value: 9,
    label: "9 meses",
  },
  {
    value: 10,
    label: "10 meses",
  },
  {
    value: 11,
    label: "11 meses",
  },
  {
    value: 12,
    label: "12 meses",
  },
];


/* ============================================================
   COMPONENTE
   ============================================================ */

export default function ReporteProyeccion() {

  const loadingContext =
    useContext(
      LoadingContext
    );


  if (!loadingContext) {

    throw new Error(
      "ReporteProyeccion debe estar dentro de LoadingProvider"
    );

  }


  const {
    setIsLoading,
  } =
    loadingContext;


  /* ==========================================================
     RESULTADO
     ========================================================== */

  const [
    general,
    setGeneral,
  ] =
    useState(null);


  const [
    mensual,
    setMensual,
  ] =
    useState([]);


  const [
    busquedaRealizada,
    setBusquedaRealizada,
  ] =
    useState(false);


  /* ==========================================================
     CATÁLOGOS
     ========================================================== */

  const [
    terrenos,
    setTerrenos,
  ] =
    useState([]);


  const [
    tiposFinanciamiento,
    setTiposFinanciamiento,
  ] =
    useState([]);


  const [
    tiposSistemaPago,
    setTiposSistemaPago,
  ] =
    useState([]);


  /* ==========================================================
     FILTROS
     ========================================================== */

  const [
    selectedMonth,
    setSelectedMonth,
  ] =
    useState(1);


  const [
    terrenoSelected,
    setTerrenoSelected,
  ] =
    useState(0);


  const [
    financiamientoSeleccionado,
    setFinanciamientoSeleccionado,
  ] =
    useState(0);


  const [
    sistemaPagoSeleccionado,
    setSistemaPagoSeleccionado,
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

          setTiposFinanciamiento(
            Array.isArray(data)
              ? data
              : []
          );

        },
        onError
      );


      pagosService.getSistemasPago(
        function (data) {

          setTiposSistemaPago(
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
      "ReporteProyeccion:",
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
          : "No fue posible consultar la proyección.",

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
          terrenoSelected ||
          0
        ),

      meses:
        Number(
          selectedMonth ||
          1
        ),

      financiamiento_id:
        Number(
          financiamientoSeleccionado ||
          0
        ),

      sistema_pago_id:
        Number(
          sistemaPagoSeleccionado ||
          0
        ),

    };


    pagosService.getResumenProyeccion(
      params,
      onResumen,
      onError
    );

  }


  /* ==========================================================
     RESPUESTA
     ========================================================== */

  function onResumen(
    data
  ) {

    setIsLoading(
      false
    );


    if (
      data &&
      data.success
    ) {

      setGeneral(
        data.resumen_general ||
        null
      );


      setMensual(
        Array.isArray(
          data.resumenes_mensuales
        )
          ? data.resumenes_mensuales
          : []
      );


      return;

    }


    setGeneral(
      null
    );


    setMensual(
      []
    );


    Swal.fire({
      title:
        "Sin resultados",

      icon:
        "info",

      text:
        data &&
        data.message
          ? data.message
          : "No se encontraron registros para la proyección.",

      confirmButtonText:
        "Aceptar",
    });

  }


  /* ==========================================================
     NOMBRE DEL PERIODO
     ========================================================== */

  const nombrePeriodo =
    useMemo(
      function () {

        const periodo =
          MESES.find(
            function (
              item
            ) {

              return (
                Number(
                  item.value
                ) ===
                Number(
                  selectedMonth
                )
              );

            }
          );


        if (!periodo) {

          return "Proyección";

        }


        return periodo.label;

      },
      [
        selectedMonth,
      ]
    );


  /* ==========================================================
     KPIS
     ========================================================== */

  const kpis =
    general
      ? [

          {
            label:
              "Total clientes",

            value:
              entero(
                general.total_clientes
              ),
          },


          {
            label:
              "Clientes mensuales",

            value:
              entero(
                general.total_clientes_mensuales
              ),
          },


          {
            label:
              "Clientes quincenales",

            value:
              entero(
                general.total_clientes_quincenales
              ),
          },


          {
            label:
              "Clientes semanales",

            value:
              entero(
                general.total_clientes_semanales
              ),
          },


          {
            label:
              "Monto proyectado",

            value:
              moneda(
                general.total_importes
              ),

            featured:
              true,
          },

        ]
      : [];


  /* ==========================================================
     TABLA
     ========================================================== */

  const columnas = [

    {
      title:
        "Mes",

      dataIndex:
        "nombre_mes",

      key:
        "nombre_mes",

      fixed:
        "left",

      width:
        120,

      render:
        function (
          value
        ) {

          return (

            <strong className="report-projection-month">

              {
                value ||
                "-"
              }

            </strong>

          );

        },
    },


    /* ========================================================
       FINANCIAMIENTO
       ======================================================== */

    {
      title:
        "Financiamiento",

      children: [

        {
          title:
            "Mensuales",

          dataIndex:
            "numero_solicitudes_mensuales",

          key:
            "numero_solicitudes_mensuales",

          align:
            "center",

          width:
            100,

          render:
            entero,
        },


        {
          title:
            "Quincenales",

          dataIndex:
            "numero_solicitudes_quincenales",

          key:
            "numero_solicitudes_quincenales",

          align:
            "center",

          width:
            105,

          render:
            entero,
        },


        {
          title:
            "Semanales",

          dataIndex:
            "numero_solicitudes_semanales",

          key:
            "numero_solicitudes_semanales",

          align:
            "center",

          width:
            100,

          render:
            entero,
        },


        {
          title:
            "Total clientes",

          dataIndex:
            "total_solicitudes",

          key:
            "total_solicitudes",

          align:
            "center",

          width:
            115,

          render:
            function (
              value
            ) {

              return (

                <strong>

                  {
                    entero(
                      value
                    )
                  }

                </strong>

              );

            },
        },

      ],
    },


    /* ========================================================
       MONTOS
       ======================================================== */

    {
      title:
        "Monto proyectado",

      children: [

        {
          title:
            "Mensuales",

          dataIndex:
            "monto_solicitudes_mensuales",

          key:
            "monto_solicitudes_mensuales",

          align:
            "right",

          width:
            135,

          render:
            moneda,
        },


        {
          title:
            "Quincenales",

          dataIndex:
            "monto_solicitudes_quincenales",

          key:
            "monto_solicitudes_quincenales",

          align:
            "right",

          width:
            135,

          render:
            moneda,
        },


        {
          title:
            "Semanales",

          dataIndex:
            "monto_solicitudes_semanales",

          key:
            "monto_solicitudes_semanales",

          align:
            "right",

          width:
            135,

          render:
            moneda,
        },


        {
          title:
            "Total",

          dataIndex:
            "total_montos",

          key:
            "total_montos",

          align:
            "right",

          width:
            145,

          render:
            function (
              value
            ) {

              return (

                <strong className="report-projection-total-money">

                  {
                    moneda(
                      value
                    )
                  }

                </strong>

              );

            },
        },

      ],
    },

  ];


  /* ==========================================================
     DATA TABLE
     ========================================================== */

  const tablaData =
    Array.isArray(
      mensual
    )
      ? mensual.map(
          function (
            item,
            index
          ) {

            return {
              ...item,

              key:
                "proyeccion-" +
                index,
            };

          }
        )
      : [];


  /* ==========================================================
     RENDER
     ========================================================== */

  return (

    <div className="report-projection-page">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="report-projection-header">

        <div>

          <span className="report-projection-header__eyebrow">

            PLANEACIÓN FINANCIERA

          </span>


          <h2 className="report-projection-header__title">

            Proyección de cobranza

          </h2>


          <p className="report-projection-header__description">

            Estima la cobranza futura por proyecto,
            tipo de financiamiento y sistema de pago
            durante los próximos meses.

          </p>

        </div>


        <span className="report-projection-period-badge">

          {
            nombrePeriodo
          }

        </span>

      </div>


      {/* =====================================================
          FILTROS
          ===================================================== */}

      <section className="report-projection-filter-card">

        <div className="report-projection-card-header">

          <span>

            FILTROS

          </span>


          <h3>

            Configuración de la proyección

          </h3>


          <p>

            Selecciona los criterios que deseas
            considerar para calcular los ingresos proyectados.

          </p>

        </div>


        <div className="report-projection-filter-grid">


          {/* PROYECTO */}

          <div className="report-projection-filter-item">

            <label>

              Proyecto

            </label>


            <Select
              showSearch
              size="large"
              value={
                terrenoSelected
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

                  setTerrenoSelected(
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


          {/* RANGO */}

          <div className="report-projection-filter-item">

            <label>

              Rango de proyección

            </label>


            <Select
              size="large"
              value={
                selectedMonth
              }
              style={{
                width:
                  "100%",
              }}
              options={
                MESES
              }
              onChange={
                function (
                  value
                ) {

                  setSelectedMonth(
                    Number(
                      value
                    )
                  );

                }
              }
            />

          </div>


          {/* FINANCIAMIENTO */}

          <div className="report-projection-filter-item">

            <label>

              Financiamiento

            </label>


            <Select
              showSearch
              size="large"
              value={
                financiamientoSeleccionado
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

                  setFinanciamientoSeleccionado(
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


              {tiposFinanciamiento.map(
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


          {/* SISTEMA PAGO */}

          <div className="report-projection-filter-item">

            <label>

              Sistema de pago

            </label>


            <Select
              showSearch
              size="large"
              value={
                sistemaPagoSeleccionado
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

                  setSistemaPagoSeleccionado(
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


              {tiposSistemaPago.map(
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


          {/* BUSCAR */}

          <div className="report-projection-filter-action">

            <Button
              type="primary"
              size="large"
              className="report-projection-search-button"
              onClick={
                handleSearch
              }
            >

              Generar proyección

            </Button>

          </div>

        </div>

      </section>


      {/* =====================================================
          RESULTADO
          ===================================================== */}

      {general &&
        mensual && (

        <>


          {/* =================================================
              KPIS
              ================================================= */}

          <div className="report-projection-kpis">

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
                        ? "report-projection-kpi report-projection-kpi--featured"
                        : "report-projection-kpi"
                    }
                  >

                    <span className="report-projection-kpi__label">

                      {
                        item.label
                      }

                    </span>


                    <strong className="report-projection-kpi__value">

                      {
                        item.value
                      }

                    </strong>

                  </div>

                );

              }
            )}

          </div>


          {/* =================================================
              DISTRIBUCIÓN DE MONTOS
              ================================================= */}

          <section className="report-projection-distribution">

            <div className="report-projection-distribution__header">

              <div>

                <span>

                  DISTRIBUCIÓN

                </span>


                <h3>

                  Proyección por periodicidad

                </h3>

              </div>


              <strong>

                {
                  moneda(
                    general.total_importes
                  )
                }

              </strong>

            </div>


            <div className="report-projection-distribution__items">


              <DistributionItem
                label="Mensual"
                value={
                  general.total_importes_mensuales
                }
                total={
                  general.total_importes
                }
              />


              <DistributionItem
                label="Quincenal"
                value={
                  general.total_importes_quincenales
                }
                total={
                  general.total_importes
                }
              />


              <DistributionItem
                label="Semanal"
                value={
                  general.total_importes_semanales
                }
                total={
                  general.total_importes
                }
              />

            </div>

          </section>


          {/* =================================================
              TABLA
              ================================================= */}

          <section className="report-projection-table-card">

            <div className="report-projection-table-card__header">

              <div>

                <span>

                  PROYECCIÓN

                </span>


                <h3>

                  Cobranza mensual proyectada

                </h3>


                <p>

                  Detalle de clientes e importes
                  esperados durante {nombrePeriodo}.

                </p>

              </div>


              <div className="report-projection-table-summary">

                <small>

                  Total proyectado

                </small>


                <strong>

                  {
                    moneda(
                      general.total_importes
                    )
                  }

                </strong>

              </div>

            </div>


            <Table
              rowKey="key"
              columns={
                columnas
              }
              dataSource={
                tablaData
              }
              size="small"
              scroll={{
                x:
                  1200,
              }}
              pagination={
                false
              }
              summary={
                function () {

                  return (

                    <Table.Summary>

                      <Table.Summary.Row className="report-projection-summary-row">

                        <Table.Summary.Cell
                          index={
                            0
                          }
                        >

                          <strong>

                            Totales

                          </strong>

                        </Table.Summary.Cell>


                        <Table.Summary.Cell
                          index={
                            1
                          }
                          align="center"
                        >

                          <strong>

                            {
                              entero(
                                general.total_clientes_mensuales
                              )
                            }

                          </strong>

                        </Table.Summary.Cell>


                        <Table.Summary.Cell
                          index={
                            2
                          }
                          align="center"
                        >

                          <strong>

                            {
                              entero(
                                general.total_clientes_quincenales
                              )
                            }

                          </strong>

                        </Table.Summary.Cell>


                        <Table.Summary.Cell
                          index={
                            3
                          }
                          align="center"
                        >

                          <strong>

                            {
                              entero(
                                general.total_clientes_semanales
                              )
                            }

                          </strong>

                        </Table.Summary.Cell>


                        <Table.Summary.Cell
                          index={
                            4
                          }
                          align="center"
                        >

                          <strong>

                            {
                              entero(
                                general.total_clientes
                              )
                            }

                          </strong>

                        </Table.Summary.Cell>


                        <Table.Summary.Cell
                          index={
                            5
                          }
                          align="right"
                        >

                          <strong>

                            {
                              moneda(
                                general.total_importes_mensuales
                              )
                            }

                          </strong>

                        </Table.Summary.Cell>


                        <Table.Summary.Cell
                          index={
                            6
                          }
                          align="right"
                        >

                          <strong>

                            {
                              moneda(
                                general.total_importes_quincenales
                              )
                            }

                          </strong>

                        </Table.Summary.Cell>


                        <Table.Summary.Cell
                          index={
                            7
                          }
                          align="right"
                        >

                          <strong>

                            {
                              moneda(
                                general.total_importes_semanales
                              )
                            }

                          </strong>

                        </Table.Summary.Cell>


                        <Table.Summary.Cell
                          index={
                            8
                          }
                          align="right"
                        >

                          <strong className="report-projection-total-money">

                            {
                              moneda(
                                general.total_importes
                              )
                            }

                          </strong>

                        </Table.Summary.Cell>

                      </Table.Summary.Row>

                    </Table.Summary>

                  );

                }
              }
              locale={{
                emptyText:
                  "No hay información para la proyección seleccionada.",
              }}
              className="report-projection-table"
            />

          </section>

        </>

      )}


      {/* =====================================================
          ESTADO INICIAL
          ===================================================== */}

      {!general &&
        !busquedaRealizada && (

        <div className="report-projection-empty">

          <strong>

            Genera una proyección

          </strong>


          <span>

            Selecciona los filtros superiores
            para estimar los ingresos de los próximos meses.

          </span>

        </div>

      )}

    </div>

  );

}


/* ============================================================
   DISTRIBUCIÓN
   ============================================================ */

function DistributionItem({
  label,
  value,
  total,
}) {

  const cantidad =
    numeroSeguro(
      value
    );


  const totalSeguro =
    numeroSeguro(
      total
    );


  const porcentaje =
    totalSeguro >
    0
      ? (
          cantidad /
          totalSeguro
        ) *
        100
      : 0;


  return (

    <div className="report-projection-distribution-item">

      <div className="report-projection-distribution-item__top">

        <span>

          {label}

        </span>


        <strong>

          {
            moneda(
              cantidad
            )
          }

        </strong>

      </div>


      <div className="report-projection-distribution-item__track">

        <span
          style={{
            width:
              Math.min(
                100,
                Math.max(
                  0,
                  porcentaje
                )
              ) +
              "%",
          }}
        />

      </div>


      <small>

        {
          porcentaje.toFixed(
            2
          )
        }

        % del total

      </small>

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