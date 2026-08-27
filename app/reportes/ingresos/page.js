"use client";

import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Button,
  DatePicker,
  Modal,
  Select,
  Table,
} from "antd";

import Swal from "sweetalert2";

import {
  formatPrecio,
  formatDate,
} from "@/helpers/formatters";

import pagosService from "@/services/pagosService";
import terrenosService from "@/services/terrenosService";

import {
  LoadingContext,
} from "@/contexts/loading";


const {
  Option,
} = Select;


/* ============================================================
   COMPONENTE
   ============================================================ */

export default function ReporteIngresos() {

  const loadingContext =
    useContext(
      LoadingContext
    );


  if (!loadingContext) {
    throw new Error(
      "ReporteIngresos debe estar dentro de LoadingProvider"
    );
  }


  const {
    setIsLoading,
  } =
    loadingContext;


  /* ==========================================================
     FILTROS
     ========================================================== */

  const [
    proyectos,
    setProyectos,
  ] =
    useState([]);


  const [
    fechaInicial,
    setFechaInicial,
  ] =
    useState(null);


  const [
    fechaFinal,
    setFechaFinal,
  ] =
    useState(null);


  const [
    fechaInicialValue,
    setFechaInicialValue,
  ] =
    useState(null);


  const [
    fechaFinalValue,
    setFechaFinalValue,
  ] =
    useState(null);


  const [
    terrenoId,
    setTerrenoId,
  ] =
    useState(0);


  /* ==========================================================
     REPORTE
     ========================================================== */

  const [
    response,
    setResponse,
  ] =
    useState(null);


  const [
    busquedaRealizada,
    setBusquedaRealizada,
  ] =
    useState(false);


  /* ==========================================================
     MODAL DETALLE
     ========================================================== */

  const [
    show,
    setShow,
  ] =
    useState(false);


  const [
    detalles,
    setDetalles,
  ] =
    useState([]);


  const [
    detalleTitulo,
    setDetalleTitulo,
  ] =
    useState("");


  // cobranza | anticipo
  const [
    tipoDetalle,
    setTipoDetalle,
  ] =
    useState(null);


  /* ==========================================================
     CARGAR PROYECTOS
     ========================================================== */

  useEffect(
    function () {

      terrenosService.getTerrenosAll(
        onTerreno
      );

    },
    []
  );


  function onTerreno(
    terrenos
  ) {

    setProyectos(
      Array.isArray(
        terrenos
      )
        ? terrenos
        : []
    );

  }


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
      "ReporteIngresos:",
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
          : "No fue posible generar el reporte de ingresos.",

      confirmButtonText:
        "Aceptar",
    });

  }


  /* ==========================================================
     BUSCAR
     ========================================================== */

  function handleSearchButton() {

    if (
      fechaInicialValue &&
      fechaFinalValue &&
      typeof fechaInicialValue.isAfter ===
        "function" &&
      fechaInicialValue.isAfter(
        fechaFinalValue
      )
    ) {

      Swal.fire({
        title:
          "Rango de fechas inválido",

        icon:
          "warning",

        text:
          "La fecha inicial no puede ser posterior a la fecha final.",

        confirmButtonText:
          "Aceptar",
      });


      return;

    }


    const params = {

      fecha_inicial:
        fechaInicial,

      fecha_final:
        fechaFinal,

      terreno_id:
        Number(
          terrenoId ||
          0
        ),

    };


    setIsLoading(
      true
    );


    setShow(
      false
    );


    setDetalles(
      []
    );


    setTipoDetalle(
      null
    );


    setDetalleTitulo(
      ""
    );


    pagosService.getReporteIngresos(
      params,
      onReporte,
      onError
    );

  }


  /* ==========================================================
     RESPUESTA
     ========================================================== */

  function onReporte(
    data
  ) {

    setIsLoading(
      false
    );


    setBusquedaRealizada(
      true
    );


    if (
      data &&
      data.success
    ) {

      setResponse(
        data
      );


      setDetalles(
        []
      );


      setShow(
        false
      );


      setTipoDetalle(
        null
      );


      setDetalleTitulo(
        ""
      );


      return;

    }


    setResponse(
      null
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
          : "No se encontraron registros.",

      confirmButtonText:
        "Aceptar",
    });

  }


  /* ==========================================================
     NORMALIZAR SISTEMA DE PAGO
     ========================================================== */

  function normalizarSistemaPagoId(
    id
  ) {

    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {

      return null;

    }


    return Number(
      id
    );

  }


  /* ==========================================================
     DETALLE COBRANZA
     ========================================================== */

  function abrirDetallesCobranza(
    reporte,
    sistema
  ) {

    if (
      !reporte ||
      !sistema
    ) {

      return;

    }


    const detalleReporte =
      Array.isArray(
        reporte.detalle
      )
        ? reporte.detalle
        : [];


    const sistemaPagoId =
      normalizarSistemaPagoId(
        sistema.sistema_pago_id
      );


    const detallesFiltrados =
      detalleReporte.filter(
        function (
          item
        ) {

          return (
            normalizarSistemaPagoId(
              item.sistema_pago_id
            ) ===
            sistemaPagoId
          );

        }
      );


    setDetalles(
      detallesFiltrados
    );


    setDetalleTitulo(
      "Cobranza - " +
      (
        sistema.sistema_pago ||
        "Sin especificar"
      )
    );


    setTipoDetalle(
      "cobranza"
    );


    setShow(
      true
    );

  }


  /* ==========================================================
     DETALLE ANTICIPOS
     ========================================================== */

  function abrirDetallesAnticipos() {

    if (
      !response ||
      !response.reporte_ingresos_anticipos
    ) {

      return;

    }


    const reporte =
      response.reporte_ingresos_anticipos;


    const detallesReporte =
      Array.isArray(
        reporte.detalle
      )
        ? reporte.detalle
        : [];


    setDetalles(
      detallesReporte
    );


    setDetalleTitulo(
      "Anticipos"
    );


    setTipoDetalle(
      "anticipo"
    );


    setShow(
      true
    );

  }


  /* ==========================================================
     CERRAR MODAL
     ========================================================== */

  function cerrarDetalles() {

    setShow(
      false
    );


    setDetalles(
      []
    );


    setDetalleTitulo(
      ""
    );


    setTipoDetalle(
      null
    );

  }


  /* ==========================================================
     RESÚMENES
     ========================================================== */

  const cobranza =
    response &&
    response.reporte_ingresos_cobranza
      ? response.reporte_ingresos_cobranza
      : {};


  const anticipos =
    response &&
    response.reporte_ingresos_anticipos
      ? response.reporte_ingresos_anticipos
      : {};


  const totales =
    response &&
    response.totales
      ? response.totales
      : {};


  /* ==========================================================
     KPIS
     ========================================================== */

  const kpis =
    useMemo(
      function () {

        return [

          {
            label:
              "Pagos de cobranza",

            value:
              entero(
                cobranza.num_pagos_total
              ),
          },


          {
            label:
              "Cobranza",

            value:
              moneda(
                cobranza.importes_total
              ),
          },


          {
            label:
              "Anticipos",

            value:
              moneda(
                anticipos.importes_total
              ),
          },


          {
            label:
              "Ingresos totales",

            value:
              moneda(
                totales.importes_total
              ),

            featured:
              true,
          },


          {
            label:
              "Movimientos totales",

            value:
              entero(
                totales.num_pagos_total
              ),
          },

        ];

      },
      [
        cobranza.num_pagos_total,
        cobranza.importes_total,
        anticipos.importes_total,
        totales.importes_total,
        totales.num_pagos_total,
      ]
    );


  /* ==========================================================
     SISTEMAS DE PAGO
     ========================================================== */

  const sistemasCobranza =
    useMemo(
      function () {

        const sistemas =
          Array.isArray(
            cobranza.sistemas_pago
          )
            ? cobranza.sistemas_pago
            : [];


        return sistemas.map(
          function (
            sistema,
            index
          ) {

            return {
              ...sistema,

              key:
                "cobranza-" +
                (
                  sistema.sistema_pago_id !==
                    null &&
                  sistema.sistema_pago_id !==
                    undefined
                    ? sistema.sistema_pago_id
                    : "sin"
                ) +
                "-" +
                index,
            };

          }
        );

      },
      [
        cobranza.sistemas_pago,
      ]
    );


  /* ==========================================================
     COLUMNAS COBRANZA
     ========================================================== */

  const columnasCobranza = [

    {
      title:
        "Sistema de pago",

      dataIndex:
        "sistema_pago",

      key:
        "sistema_pago",

      render:
        function (
          value
        ) {

          return (

            <strong className="report-income-payment-system">

              {
                value ||
                "Sin especificar"
              }

            </strong>

          );

        },
    },


    {
      title:
        "Movimientos",

      dataIndex:
        "num_pagos",

      key:
        "num_pagos",

      align:
        "center",

      width:
        120,

      render:
        function (
          value
        ) {

          return (

            <span
              className={
                numeroSeguro(
                  value
                ) >
                0
                  ? "report-income-count report-income-count--active"
                  : "report-income-count"
              }
            >

              {
                entero(
                  value
                )
              }

            </span>

          );

        },
    },


    {
      title:
        "Importe",

      dataIndex:
        "importe",

      key:
        "importe",

      align:
        "right",

      width:
        180,

      render:
        function (
          value
        ) {

          return (

            <strong className="report-income-money">

              {
                moneda(
                  value
                )
              }

            </strong>

          );

        },
    },

  ];


  /* ==========================================================
     ANTICIPOS DATASOURCE
     ========================================================== */

  const dataAnticipos =
    response
      ? [
          {
            key:
              "anticipos",

            tipo:
              "Anticipos",

            numero:
              numeroSeguro(
                anticipos.num_pagos_total
              ),

            importe:
              numeroSeguro(
                anticipos.importes_total
              ),
          },
        ]
      : [];


  const columnasAnticipos = [

    {
      title:
        "Concepto",

      dataIndex:
        "tipo",

      key:
        "tipo",

      render:
        function (
          value
        ) {

          return (

            <strong className="report-income-payment-system">

              {value}

            </strong>

          );

        },
    },


    {
      title:
        "Movimientos",

      dataIndex:
        "numero",

      key:
        "numero",

      align:
        "center",

      width:
        120,

      render:
        function (
          value
        ) {

          return (

            <span
              className={
                numeroSeguro(
                  value
                ) >
                0
                  ? "report-income-count report-income-count--active"
                  : "report-income-count"
              }
            >

              {
                entero(
                  value
                )
              }

            </span>

          );

        },
    },


    {
      title:
        "Importe",

      dataIndex:
        "importe",

      key:
        "importe",

      align:
        "right",

      width:
        180,

      render:
        function (
          value
        ) {

          return (

            <strong className="report-income-money">

              {
                moneda(
                  value
                )
              }

            </strong>

          );

        },
    },

  ];


  /* ==========================================================
     MODAL - COLUMNAS
     ========================================================== */

  const columnasDetalle = [

    {
      title:
        "#",

      key:
        "numero",

      width:
        55,

      render:
        function (
          value,
          item,
          index
        ) {

          return (
            index +
            1
          );

        },
    },


    {
      title:
        "Folio",

      key:
        "folio",

      width:
        110,

      render:
        function (
          value,
          item
        ) {

          return obtenerFolioDetalle(
            item
          );

        },
    },


    {
      title:
        "Fecha",

      key:
        "fecha",

      width:
        125,

      render:
        function (
          value,
          item
        ) {

          return obtenerFechaDetalle(
            item
          );

        },
    },


    ...(tipoDetalle ===
    "cobranza"
      ? [
          {
            title:
              "Sistema de pago",

            dataIndex:
              "sistema_pago",

            key:
              "sistema_pago",

            width:
              180,

            render:
              function (
                value
              ) {

                return (
                  value ||
                  "Sin especificar"
                );

              },
          },
        ]
      : []),


    {
      title:
        "Importe",

      key:
        "importe",

      align:
        "right",

      width:
        150,

      render:
        function (
          value,
          item
        ) {

          return (

            <strong className="report-income-money">

              {
                moneda(
                  obtenerImporteDetalle(
                    item
                  )
                )
              }

            </strong>

          );

        },
    },

  ];


  /* ==========================================================
     RENDER
     ========================================================== */

  return (

    <div className="report-income-page">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="report-income-header">

        <div>

          <span className="report-income-header__eyebrow">

            FLUJO DE INGRESOS

          </span>


          <h2 className="report-income-header__title">

            Reporte de ingresos

          </h2>


          <p className="report-income-header__description">

            Consulta los ingresos recibidos por cobranza,
            anticipos, sistema de pago, proyecto y periodo.

          </p>

        </div>

      </div>


      {/* =====================================================
          FILTROS
          ===================================================== */}

      <section className="report-income-filter-card">

        <div className="report-income-card-header">

          <span>

            FILTROS

          </span>


          <h3>

            Periodo de consulta

          </h3>


          <p>

            Selecciona un rango de fechas y un proyecto.
            Puedes dejar los campos vacíos para consultar
            toda la información.

          </p>

        </div>


        <div className="report-income-filter-grid">


          {/* FECHA INICIAL */}

          <div className="report-income-filter-item">

            <label>

              Fecha inicial

            </label>


            <DatePicker
              allowClear
              size="large"
              style={{
                width:
                  "100%",
              }}
              placeholder="Fecha inicial"
              value={
                fechaInicialValue
              }
              onChange={
                function (
                  value
                ) {

                  setFechaInicialValue(
                    value
                  );


                  setFechaInicial(
                    value
                      ? formatDate(
                          value
                        )
                      : null
                  );

                }
              }
            />

          </div>


          {/* FECHA FINAL */}

          <div className="report-income-filter-item">

            <label>

              Fecha final

            </label>


            <DatePicker
              allowClear
              size="large"
              style={{
                width:
                  "100%",
              }}
              placeholder="Fecha final"
              value={
                fechaFinalValue
              }
              onChange={
                function (
                  value
                ) {

                  setFechaFinalValue(
                    value
                  );


                  setFechaFinal(
                    value
                      ? formatDate(
                          value
                        )
                      : null
                  );

                }
              }
            />

          </div>


          {/* PROYECTO */}

          <div className="report-income-filter-item">

            <label>

              Proyecto

            </label>


            <Select
              showSearch
              size="large"
              value={
                terrenoId
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

                  setTerrenoId(
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


              {proyectos.map(
                function (
                  proyecto
                ) {

                  return (

                    <Option
                      key={
                        proyecto.id
                      }
                      value={
                        proyecto.id
                      }
                      label={
                        proyecto.nombre
                      }
                    >

                      {
                        proyecto.nombre
                      }

                    </Option>

                  );

                }
              )}

            </Select>

          </div>


          {/* BUSCAR */}

          <div className="report-income-filter-action">

            <Button
              type="primary"
              size="large"
              className="report-income-search-button"
              onClick={
                handleSearchButton
              }
            >

              Buscar reporte

            </Button>

          </div>

        </div>

      </section>


      {/* =====================================================
          RESULTADO
          ===================================================== */}

      {response && (

        <>


          {/* =================================================
              KPIS
              ================================================= */}

          <div className="report-income-kpis">

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
                        ? "report-income-kpi report-income-kpi--featured"
                        : "report-income-kpi"
                    }
                  >

                    <span className="report-income-kpi__label">

                      {
                        item.label
                      }

                    </span>


                    <strong className="report-income-kpi__value">

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
              COBRANZA
              ================================================= */}

          <section className="report-income-table-card">

            <div className="report-income-table-card__header">

              <div>

                <span>

                  COBRANZA

                </span>


                <h3>

                  Ingresos por sistema de pago

                </h3>


                <p>

                  Haz clic sobre un sistema con movimientos
                  para consultar el detalle.

                </p>

              </div>


              <div className="report-income-table-summary">

                <small>

                  Total cobranza

                </small>


                <strong>

                  {
                    moneda(
                      cobranza.importes_total
                    )
                  }

                </strong>

              </div>

            </div>


            <Table
              rowKey="key"
              columns={
                columnasCobranza
              }
              dataSource={
                sistemasCobranza
              }
              size="small"
              pagination={
                false
              }
              onRow={
                function (
                  sistema
                ) {

                  const tienePagos =
                    numeroSeguro(
                      sistema.num_pagos
                    ) >
                    0;


                  return {

                    className:
                      tienePagos
                        ? "report-income-row report-income-row--clickable"
                        : "report-income-row",

                    onClick:
                      function () {

                        if (
                          tienePagos
                        ) {

                          abrirDetallesCobranza(
                            cobranza,
                            sistema
                          );

                        }

                      },

                  };

                }
              }
              locale={{
                emptyText:
                  "No hay movimientos de cobranza.",
              }}
              className="report-income-table"
            />


            <div className="report-income-table-total">

              <span>

                Total cobranza

              </span>


              <strong>

                {
                  entero(
                    cobranza.num_pagos_total
                  )
                }

                {" "}movimientos

              </strong>


              <strong>

                {
                  moneda(
                    cobranza.importes_total
                  )
                }

              </strong>

            </div>

          </section>


          {/* =================================================
              ANTICIPOS
              ================================================= */}

          <section className="report-income-table-card">

            <div className="report-income-table-card__header">

              <div>

                <span>

                  ANTICIPOS

                </span>


                <h3>

                  Ingresos por anticipos

                </h3>


                <p>

                  Consulta los anticipos recibidos
                  durante el periodo seleccionado.

                </p>

              </div>


              <div className="report-income-table-summary">

                <small>

                  Total anticipos

                </small>


                <strong>

                  {
                    moneda(
                      anticipos.importes_total
                    )
                  }

                </strong>

              </div>

            </div>


            <Table
              rowKey="key"
              columns={
                columnasAnticipos
              }
              dataSource={
                dataAnticipos
              }
              size="small"
              pagination={
                false
              }
              onRow={
                function (
                  item
                ) {

                  const tienePagos =
                    numeroSeguro(
                      item.numero
                    ) >
                    0;


                  return {

                    className:
                      tienePagos
                        ? "report-income-row report-income-row--clickable"
                        : "report-income-row",

                    onClick:
                      function () {

                        if (
                          tienePagos
                        ) {

                          abrirDetallesAnticipos();

                        }

                      },

                  };

                }
              }
              className="report-income-table"
            />

          </section>


          {/* =================================================
              TOTAL GENERAL
              ================================================= */}

          <section className="report-income-total-card">

            <div>

              <span>

                RESUMEN GENERAL

              </span>


              <h3>

                Ingresos del periodo

              </h3>


              <p>

                Cobranza y anticipos recibidos
                durante la consulta.

              </p>

            </div>


            <div className="report-income-total-card__stats">

              <div>

                <span>

                  Movimientos

                </span>


                <strong>

                  {
                    entero(
                      totales.num_pagos_total
                    )
                  }

                </strong>

              </div>


              <div>

                <span>

                  Ingresos totales

                </span>


                <strong>

                  {
                    moneda(
                      totales.importes_total
                    )
                  }

                </strong>

              </div>

            </div>

          </section>

        </>

      )}


      {/* =====================================================
          VACÍO INICIAL
          ===================================================== */}

      {!response &&
        !busquedaRealizada && (

        <div className="report-income-empty">

          <strong>

            Consulta los ingresos

          </strong>


          <span>

            Selecciona los filtros y presiona
            “Buscar reporte” para generar la información.

          </span>

        </div>

      )}


      {/* =====================================================
          MODAL DETALLE
          ===================================================== */}

      <Modal
        visible={
          show
        }
        footer={
          null
        }
        width={
          850
        }
        destroyOnClose
        title={
          detalleTitulo ||
          "Detalles"
        }
        onCancel={
          cerrarDetalles
        }
      >

        <div className="report-income-modal">

          <div className="report-income-modal__summary">

            <span>

              {
                detalles.length
              }

              {" "}movimientos

            </span>


            <strong>

              {
                moneda(
                  sumarDetalles(
                    detalles
                  )
                )
              }

            </strong>

          </div>


          <Table
            rowKey={
              function (
                item,
                index
              ) {

                return (
                  item.pago_id ||
                  item.solicitud_id ||
                  (
                    "detalle-" +
                    index
                  )
                );

              }
            }
            columns={
              columnasDetalle
            }
            dataSource={
              detalles
            }
            size="small"
            scroll={{
              x:
                tipoDetalle ===
                "cobranza"
                  ? 700
                  : 550,
            }}
            pagination={{
              pageSize:
                10,

              showSizeChanger:
                true,

              pageSizeOptions: [
                "5",
                "10",
                "25",
              ],

              showTotal:
                function (
                  total
                ) {

                  return (
                    total +
                    " movimientos"
                  );

                },
            }}
            locale={{
              emptyText:
                "No hay detalles disponibles.",
            }}
            className="report-income-table"
          />

        </div>

      </Modal>

    </div>

  );

}


/* ============================================================
   FECHA DETALLE
   ============================================================ */

function obtenerFechaDetalle(
  item
) {

  if (!item) {

    return "-";

  }


  if (
    item.fecha_operacion
  ) {

    return item.fecha_operacion;

  }


  if (
    item.fecha
  ) {

    return item.fecha;

  }


  return "-";

}


/* ============================================================
   FOLIO
   ============================================================ */

function obtenerFolioDetalle(
  item
) {

  if (!item) {

    return "-";

  }


  if (
    item.folio !== null &&
    item.folio !== undefined
  ) {

    return item.folio;

  }


  if (
    item.solicitud_id !== null &&
    item.solicitud_id !== undefined
  ) {

    return item.solicitud_id;

  }


  if (
    item.pago_id !== null &&
    item.pago_id !== undefined
  ) {

    return item.pago_id;

  }


  return "-";

}


/* ============================================================
   IMPORTE DETALLE
   ============================================================ */

function obtenerImporteDetalle(
  item
) {

  if (!item) {

    return 0;

  }


  if (
    item.importe !== null &&
    item.importe !== undefined
  ) {

    return item.importe;

  }


  if (
    item.monto !== null &&
    item.monto !== undefined
  ) {

    return item.monto;

  }


  return 0;

}


/* ============================================================
   SUMAR DETALLES
   ============================================================ */

function sumarDetalles(
  detalles
) {

  if (
    !Array.isArray(
      detalles
    )
  ) {

    return 0;

  }


  return detalles.reduce(
    function (
      total,
      item
    ) {

      return (
        total +
        numeroSeguro(
          obtenerImporteDetalle(
            item
          )
        )
      );

    },
    0
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