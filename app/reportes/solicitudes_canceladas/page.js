"use client";

import {
  useContext,
  useMemo,
  useState,
} from "react";

import {
  Button,
  Checkbox,
  DatePicker,
  Table,
  Tag,
} from "antd";

import Swal from "sweetalert2";

import solicitudesService from "@/services/solicitudesService";

import {
  rol_id,
} from "@/helpers/rol";

import {
  formatPrecio,
} from "@/helpers/formatters";

import {
  LoadingContext,
} from "@/contexts/loading";

import locale from "antd/lib/date-picker/locale/es_ES";


const {
  RangePicker,
} = DatePicker;


/* ============================================================
   COMPONENTE
   ============================================================ */

export default function SolicitudesCanceladas() {

  const loadingContext =
    useContext(
      LoadingContext
    );


  if (!loadingContext) {

    throw new Error(
      "SolicitudesCanceladas debe estar dentro de LoadingProvider"
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
    params,
    setParams,
  ] =
    useState({
      fecha_inicial:
        null,

      fecha_final:
        null,

      todos:
        false,
    });


  const [
    rangoFechas,
    setRangoFechas,
  ] =
    useState(null);


  /* ==========================================================
     RESULTADOS
     ========================================================== */

  const [
    solicitudes,
    setSolicitudes,
  ] =
    useState([]);


  const [
    busquedaRealizada,
    setBusquedaRealizada,
  ] =
    useState(false);


  /* ==========================================================
     ACTUALIZAR PARAMS
     ========================================================== */

  function actualizarParams(
    nuevosParams
  ) {

    setParams(
      function (
        anteriores
      ) {

        return {
          ...anteriores,
          ...nuevosParams,
        };

      }
    );

  }


  /* ==========================================================
     TODOS
     ========================================================== */

  function cambiarTodos(
    event
  ) {

    const checked =
      event.target.checked;


    actualizarParams({
      todos:
        checked,

      fecha_inicial:
        checked
          ? null
          : params.fecha_inicial,

      fecha_final:
        checked
          ? null
          : params.fecha_final,
    });


    if (
      checked
    ) {

      setRangoFechas(
        null
      );

    }

  }


  /* ==========================================================
     RANGO DE FECHAS
     ========================================================== */

  function cambiarRango(
    dates
  ) {

    setRangoFechas(
      dates
    );


    if (
      !dates ||
      dates.length !==
        2
    ) {

      actualizarParams({
        fecha_inicial:
          null,

        fecha_final:
          null,
      });


      return;

    }


    actualizarParams({
      fecha_inicial:
        dates[0],

      fecha_final:
        dates[1],
    });

  }


  /* ==========================================================
     BUSCAR
     ========================================================== */

  function handleSearch() {

    /*
     * Si no seleccionó "Todos",
     * recomendamos que exista rango completo.
     */

    if (
      !params.todos &&
      (
        !params.fecha_inicial ||
        !params.fecha_final
      )
    ) {

      Swal.fire({
        title:
          "Seleccione un periodo",

        icon:
          "warning",

        text:
          "Seleccione un rango de fechas o marque la opción Todos.",

        confirmButtonText:
          "Aceptar",
      });


      return;

    }


    setIsLoading(
      true
    );


    solicitudesService.getSolicitudesCanceladas(
      params,
      onSearch,
      onError
    );

  }


  /* ==========================================================
     RESPUESTA
     ========================================================== */

  function onSearch(
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

      setSolicitudes(
        Array.isArray(
          data.solicitudes
        )
          ? data.solicitudes
          : []
      );


      return;

    }


    setSolicitudes(
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
          : "No se encontraron solicitudes canceladas.",

      confirmButtonText:
        "Aceptar",
    });

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
      "SolicitudesCanceladas:",
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
          : "No fue posible realizar la operación.",

      confirmButtonText:
        "Aceptar",
    });

  }


  /* ==========================================================
     REGRESAR ANTICIPO
     ========================================================== */

  async function regresarAnticipo(
    id
  ) {

    const result =
      await Swal.fire({
        title:
          "¿Regresar anticipo?",

        icon:
          "question",

        text:
          "El anticipo de esta solicitud será marcado como regresado.",

        confirmButtonColor:
          "#438dcc",

        cancelButtonColor:
          "#64748b",

        showCancelButton:
          true,

        confirmButtonText:
          "Regresar anticipo",

        cancelButtonText:
          "Cancelar",

        allowOutsideClick:
          false,
      });


    if (
      !result.isConfirmed
    ) {

      return;

    }


    setIsLoading(
      true
    );


    const requestParams = {
      solicitud_id:
        id,
    };


    solicitudesService.postRegresarAnticipo(
      requestParams,
      onRegresarAnticipo,
      onError
    );

  }


  /* ==========================================================
     RESPUESTA REGRESAR ANTICIPO
     ========================================================== */

  function onRegresarAnticipo(
    data
  ) {

    setIsLoading(
      false
    );


    if (
      data &&
      data.success
    ) {

      Swal.fire({
        title:
          "Anticipo regresado",

        icon:
          "success",

        text:
          data.message ||
          "El anticipo fue regresado correctamente.",

        confirmButtonColor:
          "#438dcc",

        confirmButtonText:
          "Aceptar",
      }).then(
        function (
          result
        ) {

          if (
            result.isConfirmed
          ) {

            handleSearch();

          }

        }
      );


      return;

    }


    Swal.fire({
      title:
        "Error",

      icon:
        "error",

      text:
        data &&
        data.message
          ? data.message
          : "No fue posible regresar el anticipo.",

      confirmButtonText:
        "Aceptar",
    });

  }


  /* ==========================================================
     TOTALES
     ========================================================== */

  const resumen =
    useMemo(
      function () {

        const lista =
          Array.isArray(
            solicitudes
          )
            ? solicitudes
            : [];


        const totalAnticipos =
          lista.reduce(
            function (
              total,
              item
            ) {

              return (
                total +
                numeroSeguro(
                  item.anticipo
                )
              );

            },
            0
          );


        const totalContratos =
          lista.reduce(
            function (
              total,
              item
            ) {

              return (
                total +
                numeroSeguro(
                  item.monto_contrato
                )
              );

            },
            0
          );


        const anticiposRegresados =
          lista.filter(
            function (
              item
            ) {

              return (
                item.anticipo_regresado
              );

            }
          ).length;


        const anticiposPendientes =
          lista.length -
          anticiposRegresados;


        return {
          solicitudes:
            lista.length,

          totalAnticipos:
            totalAnticipos,

          totalContratos:
            totalContratos,

          anticiposRegresados:
            anticiposRegresados,

          anticiposPendientes:
            anticiposPendientes,
        };

      },
      [
        solicitudes,
      ]
    );


  /* ==========================================================
     KPIS
     ========================================================== */

  const kpis = [

    {
      label:
        "Solicitudes canceladas",

      value:
        entero(
          resumen.solicitudes
        ),
    },


    {
      label:
        "Anticipos",

      value:
        moneda(
          resumen.totalAnticipos
        ),
    },


    {
      label:
        "Monto contratado",

      value:
        moneda(
          resumen.totalContratos
        ),

      featured:
        true,
    },


    {
      label:
        "Anticipos regresados",

      value:
        entero(
          resumen.anticiposRegresados
        ),

      success:
        true,
    },


    {
      label:
        "Pendientes por regresar",

      value:
        entero(
          resumen.anticiposPendientes
        ),

      danger:
        resumen.anticiposPendientes >
        0,
    },

  ];


  /* ==========================================================
     COLUMNAS
     ========================================================== */

  const columnas = [

    {
      title:
        "Cliente",

      dataIndex:
        "nombre",

      key:
        "nombre",

      width:
        210,

      render:
        function (
          value
        ) {

          return (

            <strong className="report-cancelled-client">

              {
                value ||
                "Sin nombre"
              }

            </strong>

          );

        },
    },


    {
      title:
        "Teléfono",

      dataIndex:
        "telefono",

      key:
        "telefono",

      width:
        120,

      render:
        function (
          value
        ) {

          return (
            value ||
            "Sin teléfono"
          );

        },
    },


    {
      title:
        "Anticipo",

      dataIndex:
        "anticipo",

      key:
        "anticipo",

      width:
        125,

      align:
        "right",

      render:
        function (
          value
        ) {

          return (
            <strong>

              {
                moneda(
                  value
                )
              }

            </strong>
          );

        },
    },


    {
      title:
        "Monto contrato",

      dataIndex:
        "monto_contrato",

      key:
        "monto_contrato",

      width:
        145,

      align:
        "right",

      render:
        function (
          value
        ) {

          return moneda(
            value
          );

        },
    },


    {
      title:
        "Fecha contrato",

      dataIndex:
        "fecha_contrato",

      key:
        "fecha_contrato",

      width:
        125,
    },


    {
      title:
        "Fecha cancelación",

      dataIndex:
        "fecha_cancelacion",

      key:
        "fecha_cancelacion",

      width:
        145,

      sorter:
        function (
          a,
          b
        ) {

          return compararFechas(
            a.fecha_cancelacion,
            b.fecha_cancelacion
          );

        },

      render:
        function (
          value
        ) {

          if (
            !value ||
            value ===
              "Sin fecha"
          ) {

            return (

              <span className="report-cancelled-no-date">

                Sin fecha

              </span>

            );

          }


          return value;

        },
    },


    {
      title:
        "Estatus anticipo",

      key:
        "estatus_anticipo",

      width:
        145,

      align:
        "center",

      render:
        function (
          value,
          item
        ) {

          if (
            item.anticipo_regresado
          ) {

            return (

              <Tag
                className="report-cancelled-tag report-cancelled-tag--success"
              >

                Regresado

              </Tag>

            );

          }


          return (

            <Tag
              className="report-cancelled-tag report-cancelled-tag--pending"
            >

              Pendiente

            </Tag>

          );

        },
    },


    {
      title:
        "Acción",

      key:
        "accion",

      width:
        150,

      align:
        "center",

      render:
        function (
          value,
          item
        ) {

          if (
            item.anticipo_regresado
          ) {

            return (

              <Button
                size="small"
                disabled
                className="report-cancelled-action-disabled"
              >

                Anticipo regresado

              </Button>

            );

          }


          return (

            <Button
              size="small"
              className="report-cancelled-refund-button"
              disabled={
                Number(
                  rol_id
                ) >
                2
              }
              onClick={
                function () {

                  regresarAnticipo(
                    item.id
                  );

                }
              }
            >

              Regresar anticipo

            </Button>

          );

        },
    },

  ];


  /* ==========================================================
     RENDER
     ========================================================== */

  return (

    <div className="report-cancelled-page">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="report-cancelled-header">

        <div>

          <span className="report-cancelled-header__eyebrow">

            HISTÓRICO DE SOLICITUDES

          </span>


          <h2 className="report-cancelled-header__title">

            Solicitudes canceladas

          </h2>


          <p className="report-cancelled-header__description">

            Consulta las solicitudes canceladas,
            los anticipos asociados y el estatus
            de devolución al cliente.

          </p>

        </div>

      </div>


      {/* =====================================================
          FILTROS
          ===================================================== */}

      <section className="report-cancelled-filter-card">

        <div className="report-cancelled-card-header">

          <span>

            FILTROS

          </span>


          <h3>

            Periodo de cancelación

          </h3>


          <p>

            Consulta un rango específico de fechas
            o selecciona todos los registros históricos.

          </p>

        </div>


        <div className="report-cancelled-filter-grid">


          {/* =================================================
              TODOS
              ================================================= */}

          <div className="report-cancelled-all-filter">

            <span>

              Alcance

            </span>


            <div className="report-cancelled-checkbox-box">

              <Checkbox
                checked={
                  params.todos
                }
                onChange={
                  cambiarTodos
                }
              >

                Todos los registros

              </Checkbox>

            </div>

          </div>


          {/* =================================================
              FECHAS
              ================================================= */}

          <div className="report-cancelled-range-filter">

            <label>

              Rango de fechas

            </label>


            <RangePicker
              locale={
                locale
              }
              format="YYYY-MM-DD"
              size="large"
              value={
                rangoFechas
              }
              disabled={
                params.todos
              }
              style={{
                width:
                  "100%",
              }}
              placeholder={[
                "Fecha inicial",
                "Fecha final",
              ]}
              onChange={
                cambiarRango
              }
            />

          </div>


          {/* =================================================
              BUSCAR
              ================================================= */}

          <div className="report-cancelled-filter-action">

            <Button
              type="primary"
              size="large"
              className="report-cancelled-search-button"
              onClick={
                handleSearch
              }
            >

              Buscar solicitudes

            </Button>

          </div>

        </div>

      </section>


      {/* =====================================================
          RESULTADOS
          ===================================================== */}

      {busquedaRealizada && (

        <>


          {/* =================================================
              KPI
              ================================================= */}

          <div className="report-cancelled-kpis">

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
                      [
                        "report-cancelled-kpi",

                        item.featured
                          ? "report-cancelled-kpi--featured"
                          : "",

                        item.success
                          ? "report-cancelled-kpi--success"
                          : "",

                        item.danger
                          ? "report-cancelled-kpi--danger"
                          : "",

                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          " "
                        )
                    }
                  >

                    <span className="report-cancelled-kpi__label">

                      {
                        item.label
                      }

                    </span>


                    <strong className="report-cancelled-kpi__value">

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
              TABLA
              ================================================= */}

          <section className="report-cancelled-table-card">

            <div className="report-cancelled-table-card__header">

              <div>

                <span>

                  CANCELACIONES

                </span>


                <h3>

                  Detalle de solicitudes

                </h3>


                <p>

                  Consulta información del contrato,
                  fechas y devolución de anticipos.

                </p>

              </div>


              <strong>

                {
                  solicitudes.length
                }

                {" "}solicitudes

              </strong>

            </div>


            <Table
              rowKey={
                function (
                  item,
                  index
                ) {

                  return (
                    item.id ||
                    (
                      "cancelada-" +
                      index
                    )
                  );

                }
              }
              columns={
                columnas
              }
              dataSource={
                solicitudes
              }
              size="small"
              scroll={{
                x:
                  1250,
              }}
              pagination={{
                defaultPageSize:
                  10,

                showSizeChanger:
                  true,

                pageSizeOptions: [
                  "5",
                  "10",
                  "25",
                  "50",
                ],

                showTotal:
                  function (
                    total
                  ) {

                    return (
                      total +
                      " solicitudes"
                    );

                  },
              }}
              locale={{
                emptyText:
                  "No hay solicitudes canceladas para el periodo seleccionado.",
              }}
              className="report-cancelled-table"
            />

          </section>

        </>

      )}


      {/* =====================================================
          ESTADO INICIAL
          ===================================================== */}

      {!busquedaRealizada && (

        <div className="report-cancelled-empty">

          <strong>

            Consulta solicitudes canceladas

          </strong>


          <span>

            Selecciona un rango de fechas
            o marca Todos los registros
            para comenzar la consulta.

          </span>

        </div>

      )}

    </div>

  );

}


/* ============================================================
   COMPARAR FECHAS
   ============================================================ */

function compararFechas(
  fechaA,
  fechaB
) {

  const a =
    parseFecha(
      fechaA
    );


  const b =
    parseFecha(
      fechaB
    );


  if (
    a === null &&
    b === null
  ) {

    return 0;

  }


  if (
    a === null
  ) {

    return 1;

  }


  if (
    b === null
  ) {

    return -1;

  }


  return (
    a -
    b
  );

}


/* ============================================================
   PARSE FECHA
   ============================================================ */

function parseFecha(
  value
) {

  if (
    !value ||
    value ===
      "Sin fecha"
  ) {

    return null;

  }


  const fecha =
    new Date(
      value
    );


  const timestamp =
    fecha.getTime();


  if (
    isNaN(
      timestamp
    )
  ) {

    return null;

  }


  return timestamp;

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