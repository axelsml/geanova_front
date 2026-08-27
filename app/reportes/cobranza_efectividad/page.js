"use client";

import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Button,
  Form,
  Modal,
  Progress,
  Select,
  Table,
} from "antd";

import Swal from "sweetalert2";

import {
  formatPrecio,
} from "@/helpers/formatters";

import cobranzaService from "@/services/cobranzaService";
import terrenosService from "@/services/terrenosService";

import {
  LoadingContext,
} from "@/contexts/loading";


const {
  Option,
} = Select;


/* ============================================================
   MESES
   ============================================================ */

const MESES = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];


/* ============================================================
   AÑOS
   ============================================================ */

const ANIOS = [];

for (
  let anio = 2017;
  anio <= 2030;
  anio++
) {

  ANIOS.push({
    value: anio,
    label: String(anio),
  });

}


/* ============================================================
   COMPONENTE
   ============================================================ */

export default function EfectividadCobranza() {

  const loadingContext =
    useContext(
      LoadingContext
    );


  if (!loadingContext) {

    throw new Error(
      "EfectividadCobranza debe estar dentro de LoadingProvider"
    );

  }


  const {
    setIsLoading,
  } =
    loadingContext;


  const [
    form,
  ] =
    Form.useForm();


  /* ==========================================================
     FILTROS
     ========================================================== */

  const [
    terrenos,
    setTerrenos,
  ] =
    useState([]);


  const [
    terrenoSelected,
    setTerrenoSelected,
  ] =
    useState(0);


  const [
    mesSelected,
    setMesSelected,
  ] =
    useState(null);


  const [
    anioSelected,
    setAnioSelected,
  ] =
    useState(null);


  /* ==========================================================
     DATOS
     ========================================================== */

  const [
    datos,
    setDatos,
  ] =
    useState([]);


  const [
    datosClientesCongelados,
    setDatosClientesCongelados,
  ] =
    useState([]);


  const [
    datosClientesAnualidad,
    setDatosClientesAnualidad,
  ] =
    useState([]);


  const [
    busquedaRealizada,
    setBusquedaRealizada,
  ] =
    useState(false);


  /* ==========================================================
     TOTALES
     ========================================================== */

  const [
    totalClientes,
    setTotalClientes,
  ] =
    useState(0);


  const [
    totalMontoEsperado,
    setTotalMontoEsperado,
  ] =
    useState(0);


  const [
    totalMontoAnticipo,
    setTotalMontoAnticipo,
  ] =
    useState(0);


  const [
    totalMontoCobrado,
    setTotalMontoCobrado,
  ] =
    useState(0);


  const [
    totalPendienteCobrar,
    setTotalPendienteCobrar,
  ] =
    useState(0);


  const [
    totalPorcentajeImporte,
    setTotalPorcentajeImporte,
  ] =
    useState(0);


  const [
    totalPorcentajeClientes,
    setTotalPorcentajeClientes,
  ] =
    useState(0);


  /* ==========================================================
     MODAL
     ========================================================== */

  const [
    detalleModal,
    setDetalleModal,
  ] =
    useState({
      open: false,
      tipo: null,
      title: "",
      data: [],
    });


  /* ==========================================================
     CARGA INICIAL
     ========================================================== */

  useEffect(
    function () {

      const hoy =
        new Date();


      const mesActual =
        hoy.getMonth() +
        1;


      const anioActual =
        hoy.getFullYear();


      setMesSelected(
        mesActual
      );


      setAnioSelected(
        anioActual
      );


      setTerrenoSelected(
        0
      );


      form.setFieldsValue({
        mes:
          mesActual,

        anio:
          anioActual,

        proyecto:
          0,
      });


      terrenosService.getTerrenos(

        function (response) {

          setTerrenos(
            Array.isArray(response)
              ? response
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
      "EfectividadCobranza:",
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
          : "No fue posible consultar la efectividad de cobranza.",

      confirmButtonText:
        "Aceptar",
    });

  }


  /* ==========================================================
     CONSULTAR
     ========================================================== */

  function cargarEfectividadCobranza() {

    if (
      !mesSelected ||
      !anioSelected
    ) {

      Swal.fire({
        title:
          "Periodo requerido",

        icon:
          "warning",

        text:
          "Seleccione un mes y un año.",

        confirmButtonText:
          "Aceptar",
      });


      return;

    }


    setIsLoading(
      true
    );


    const params = {

      mes:
        Number(
          mesSelected
        ),

      año:
        Number(
          anioSelected
        ),

      proyecto:
        Number(
          terrenoSelected ||
          0
        ),

    };


    cobranzaService.getIEfectividadCobranza(
      params,
      onEfectividadCargada,
      onError
    );

  }


  /* ==========================================================
     RESPUESTA
     ========================================================== */

  function onEfectividadCargada(
    response
  ) {

    setIsLoading(
      false
    );


    setBusquedaRealizada(
      true
    );


    setDatos(
      Array.isArray(
        response &&
        response.datos
      )
        ? response.datos
        : []
    );


    setDatosClientesCongelados(
      Array.isArray(
        response &&
        response.clientesCongelados
      )
        ? response.clientesCongelados
        : []
    );


    setDatosClientesAnualidad(
      Array.isArray(
        response &&
        response.anualidad_clientes
      )
        ? response.anualidad_clientes
        : []
    );


    setTotalClientes(
      numeroSeguro(
        response &&
        response.totalClientes
      )
    );


    setTotalMontoAnticipo(
      numeroSeguro(
        response &&
        response.totalMontoAnticipo
      )
    );


    setTotalMontoCobrado(
      numeroSeguro(
        response &&
        response.totalMontoCobrado
      )
    );


    setTotalMontoEsperado(
      numeroSeguro(
        response &&
        response.totalMontoEsperado
      )
    );


    setTotalPendienteCobrar(
      numeroSeguro(
        response &&
        response.totalPendienteCobrar
      )
    );


    setTotalPorcentajeImporte(
      numeroSeguro(
        response &&
        response.totalPorcentajeImporte
      )
    );


    setTotalPorcentajeClientes(
      numeroSeguro(
        response &&
        response.totalPorcentajeClientes
      )
    );

  }


  /* ==========================================================
     KPIS
     ========================================================== */

  const kpis =
    useMemo(
      function () {

        return [

          {
            label:
              "Clientes",

            value:
              entero(
                totalClientes
              ),
          },


          {
            label:
              "Monto esperado",

            value:
              moneda(
                totalMontoEsperado
              ),
          },


          {
            label:
              "Anticipos",

            value:
              moneda(
                totalMontoAnticipo
              ),
          },


          {
            label:
              "Total percibido",

            value:
              moneda(
                totalMontoCobrado
              ),

            featured:
              true,
          },


          {
            label:
              "Pendiente por cobrar",

            value:
              moneda(
                totalPendienteCobrar
              ),

            danger:
              totalPendienteCobrar >
              0,
          },


          {
            label:
              "Efectividad importe",

            value:
              porcentajeTexto(
                totalPorcentajeImporte
              ),

            featured:
              true,
          },


          {
            label:
              "Efectividad clientes",

            value:
              porcentajeTexto(
                totalPorcentajeClientes
              ),
          },

        ];

      },
      [
        totalClientes,
        totalMontoEsperado,
        totalMontoAnticipo,
        totalMontoCobrado,
        totalPendienteCobrar,
        totalPorcentajeImporte,
        totalPorcentajeClientes,
      ]
    );


  /* ==========================================================
     ABRIR DETALLE
     ========================================================== */

  function abrirDetalleLapso(
    dato
  ) {

    if (
      dato.lapso ===
      "Otros"
    ) {

      abrirModal(
        "efectivo",
        "Clientes en efectivo",
        dato.registros
      );


      return;

    }


    abrirModal(
      "registro",
      "Registro de clientes",
      dato.registros
    );

  }


  function abrirClientesCobrados(
    event,
    dato
  ) {

    event.stopPropagation();


    if (
      dato.lapso ===
      "Otros"
    ) {

      return;

    }


    abrirModal(
      "cobrados",
      "Clientes cobrados",
      dato.registros_clientes_cobrados
    );

  }


  function abrirClientesPorCobrar(
    event,
    dato
  ) {

    event.stopPropagation();


    if (
      dato.lapso ===
      "Otros"
    ) {

      return;

    }


    abrirModal(
      "por_cobrar",
      "Clientes por cobrar",
      dato.registros_clientes_por_cobrar
    );

  }


  function abrirModal(
    tipo,
    title,
    data
  ) {

    setDetalleModal({
      open:
        true,

      tipo:
        tipo,

      title:
        title,

      data:
        Array.isArray(data)
          ? data
          : [],
    });

  }


  function cerrarModal() {

    setDetalleModal({
      open:
        false,

      tipo:
        null,

      title:
        "",

      data:
        [],
    });

  }


  /* ==========================================================
     COLUMNAS EFECTIVIDAD
     ========================================================== */

  const columnasEfectividad = [

    {
      title:
        "Lapso",

      dataIndex:
        "lapso",

      key:
        "lapso",

      width:
        125,

      render:
        function (
          value
        ) {

          return (

            <span
              className={
                obtenerClaseLapso(
                  value
                )
              }
            >

              {
                value
              }

            </span>

          );

        },
    },


    {
      title:
        "Fecha considerada",

      dataIndex:
        "fecha_considerada",

      key:
        "fecha_considerada",

      width:
        135,
    },


    {
      title:
        "Clientes",

      dataIndex:
        "total_clientes",

      key:
        "total_clientes",

      align:
        "center",

      width:
        85,
    },


    {
      title:
        "Monto esperado",

      dataIndex:
        "monto_esperado",

      key:
        "monto_esperado",

      align:
        "right",

      width:
        130,

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
        "Anticipo",

      dataIndex:
        "monto_anticipo",

      key:
        "monto_anticipo",

      align:
        "right",

      width:
        120,

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
        "Cobrados",

      dataIndex:
        "clientes_cobrados",

      key:
        "clientes_cobrados",

      align:
        "center",

      width:
        95,

      render:
        function (
          value,
          dato
        ) {

          if (
            dato.lapso ===
            "Otros"
          ) {

            return value;

          }


          return (

            <button
              type="button"
              className="report-effectiveness-link report-effectiveness-link--success"
              onClick={
                function (
                  event
                ) {

                  abrirClientesCobrados(
                    event,
                    dato
                  );

                }
              }
            >

              {
                value
              }

            </button>

          );

        },
    },


    {
      title:
        "Total percibido",

      dataIndex:
        "monto_cobrado",

      key:
        "monto_cobrado",

      align:
        "right",

      width:
        135,

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
        "Por cobrar",

      dataIndex:
        "clientes_por_cobrar",

      key:
        "clientes_por_cobrar",

      align:
        "center",

      width:
        100,

      render:
        function (
          value,
          dato
        ) {

          if (
            dato.lapso ===
            "Otros"
          ) {

            return value;

          }


          return (

            <button
              type="button"
              className="report-effectiveness-link report-effectiveness-link--danger"
              onClick={
                function (
                  event
                ) {

                  abrirClientesPorCobrar(
                    event,
                    dato
                  );

                }
              }
            >

              {
                value
              }

            </button>

          );

        },
    },


    {
      title:
        "Pendiente",

      dataIndex:
        "pendiente_por_cobrar",

      key:
        "pendiente_por_cobrar",

      align:
        "right",

      width:
        130,

      render:
        function (
          value,
          dato
        ) {

          return (

            <button
              type="button"
              className="report-effectiveness-money-button"
              onClick={
                function (
                  event
                ) {

                  abrirClientesPorCobrar(
                    event,
                    dato
                  );

                }
              }
            >

              {
                moneda(
                  value
                )
              }

            </button>

          );

        },
    },


    {
      title:
        "% importe",

      dataIndex:
        "porcentaje_importe",

      key:
        "porcentaje_importe",

      width:
        150,

      render:
        function (
          value
        ) {

          const porcentaje =
            porcentajeSeguro(
              value
            );


          return (

            <Progress
              percent={
                porcentaje
              }
              size="small"
              format={
                function () {

                  return (
                    porcentajeTexto(
                      porcentaje
                    )
                  );

                }
              }
            />

          );

        },
    },


    {
      title:
        "% clientes",

      dataIndex:
        "porcentaje_clientes",

      key:
        "porcentaje_clientes",

      width:
        150,

      render:
        function (
          value
        ) {

          const porcentaje =
            porcentajeSeguro(
              value
            );


          return (

            <Progress
              percent={
                porcentaje
              }
              size="small"
              format={
                function () {

                  return (
                    porcentajeTexto(
                      porcentaje
                    )
                  );

                }
              }
            />

          );

        },
    },

  ];


  /* ==========================================================
     CLIENTES CONGELADOS
     ========================================================== */

  const columnasCongelados = [

    {
      title:
        "Proyecto / Lote",

      dataIndex:
        "lote",

      key:
        "lote",

      width:
        140,
    },


    {
      title:
        "Cliente",

      dataIndex:
        "nombre_completo",

      key:
        "nombre_completo",

      width:
        220,

      render:
        function (
          value
        ) {

          return (

            <strong>

              {
                value
              }

            </strong>

          );

        },
    },


    {
      title:
        "Importe vencido",

      dataIndex:
        "importe_vencido",

      key:
        "importe_vencido",

      align:
        "right",

      width:
        130,

      render:
        function (
          value
        ) {

          return (

            <span className="report-effectiveness-danger">

              {
                moneda(
                  value
                )
              }

            </span>

          );

        },
    },


    {
      title:
        "Saldo pagado",

      dataIndex:
        "saldo",

      key:
        "saldo",

      align:
        "right",

      width:
        125,

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
        "Percibido",

      dataIndex:
        "pago_fechas",

      key:
        "pago_fechas",

      align:
        "right",

      width:
        120,

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
        "Último pago",

      dataIndex:
        "ultimo_pago",

      key:
        "ultimo_pago",

      width:
        115,
    },


    {
      title:
        "Fecha congeló",

      dataIndex:
        "fecha_congelado",

      key:
        "fecha_congelado",

      width:
        115,
    },


    {
      title:
        "Fecha termina",

      dataIndex:
        "fecha_termina",

      key:
        "fecha_termina",

      width:
        115,
    },

  ];


  /* ==========================================================
     ANUALIDADES
     ========================================================== */

  const columnasAnualidades = [

    {
      title:
        "Proyecto / Lote",

      key:
        "lote",

      width:
        130,

      render:
        function (
          value,
          dato
        ) {

          return (
            dato &&
            dato.info_lote
              ? dato.info_lote.lote
              : ""
          );

        },
    },


    {
      title:
        "Cliente",

      key:
        "cliente",

      width:
        220,

      render:
        function (
          value,
          dato
        ) {

          return (

            <strong>

              {
                dato &&
                dato.info_cliente
                  ? dato.info_cliente.nombre_completo
                  : ""
              }

            </strong>

          );

        },
    },


    {
      title:
        "Importe vencido",

      key:
        "vencido",

      align:
        "right",

      width:
        130,

      render:
        function (
          value,
          dato
        ) {

          return (

            <span className="report-effectiveness-danger">

              {
                moneda(
                  obtenerInfoLote(
                    dato,
                    "monto_vencido_anualidades"
                  )
                )
              }

            </span>

          );

        },
    },


    {
      title:
        "Saldo restante",

      key:
        "saldo",

      align:
        "right",

      width:
        130,

      render:
        function (
          value,
          dato
        ) {

          const total =
            numeroSeguro(
              obtenerInfoLote(
                dato,
                "monto_total_anualidades"
              )
            );


          const pagado =
            numeroSeguro(
              obtenerInfoLote(
                dato,
                "monto_pagado_anualidades"
              )
            );


          return moneda(
            Math.max(
              0,
              total -
              pagado
            )
          );

        },
    },


    {
      title:
        "Monto requerido",

      key:
        "requerido",

      align:
        "right",

      width:
        125,

      render:
        function (
          value,
          dato
        ) {

          return moneda(
            obtenerInfoLote(
              dato,
              "monto_pago_requerido_anualidad"
            )
          );

        },
    },


    {
      title:
        "Requerido a la fecha",

      key:
        "esperado",

      align:
        "right",

      width:
        145,

      render:
        function (
          value,
          dato
        ) {

          return moneda(
            obtenerInfoLote(
              dato,
              "esperado_ala_fecha_anualidad"
            )
          );

        },
    },


    {
      title:
        "Documentos",

      key:
        "documentos",

      width:
        195,

      render:
        function (
          value,
          dato
        ) {

          const lote =
            dato &&
            dato.info_lote
              ? dato.info_lote
              : {};


          return (

            <div className="report-effectiveness-documents">

              <Button
                size="small"
                onClick={
                  function () {

                    window.open(
                      "https://api.santamariadelaluz.com/iUsuarios/" +
                      lote.solicitud_id +
                      ".pdf"
                    );

                  }
                }
              >

                Amortización

              </Button>


              <Button
                size="small"
                onClick={
                  function () {

                    window.open(
                      "https://api.santamariadelaluz.com/getClienteByLote/" +
                      lote.terreno_id +
                      "/" +
                      lote.lote_id +
                      ".pdf"
                    );

                  }
                }
              >

                Estado de cuenta

              </Button>

            </div>

          );

        },
    },

  ];


  /* ==========================================================
     RENDER
     ========================================================== */

  return (

    <div className="report-effectiveness-page">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="report-effectiveness-header">

        <div>

          <span className="report-effectiveness-header__eyebrow">

            DESEMPEÑO DE COBRANZA

          </span>


          <h2 className="report-effectiveness-header__title">

            Efectividad de cobranza

          </h2>


          <p className="report-effectiveness-header__description">

            Analiza la recuperación de cartera,
            los importes esperados, cobrados y pendientes
            durante el periodo seleccionado.

          </p>

        </div>

      </div>


      {/* =====================================================
          FILTROS
          ===================================================== */}

      <section className="report-effectiveness-filter-card">

        <div className="report-effectiveness-card-header">

          <span>

            FILTROS

          </span>


          <h3>

            Periodo de análisis

          </h3>


          <p>

            Selecciona mes, año y proyecto
            para consultar la efectividad.

          </p>

        </div>


        <Form
          form={
            form
          }
          layout="vertical"
          className="report-effectiveness-form"
        >

          <div className="report-effectiveness-filter-grid">


            <Form.Item
              name="mes"
              label="Mes"
            >

              <Select
                size="large"
                placeholder="Seleccione mes"
                options={
                  MESES
                }
                onChange={
                  function (
                    value
                  ) {

                    setMesSelected(
                      value
                    );

                  }
                }
              />

            </Form.Item>


            <Form.Item
              name="anio"
              label="Año"
            >

              <Select
                size="large"
                placeholder="Seleccione año"
                options={
                  ANIOS
                }
                onChange={
                  function (
                    value
                  ) {

                    setAnioSelected(
                      value
                    );

                  }
                }
              />

            </Form.Item>


            <Form.Item
              name="proyecto"
              label="Proyecto"
            >

              <Select
                showSearch
                size="large"
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

            </Form.Item>


            <div className="report-effectiveness-filter-action">

              <Button
                type="primary"
                size="large"
                className="report-effectiveness-search-button"
                onClick={
                  cargarEfectividadCobranza
                }
              >

                Buscar reporte

              </Button>

            </div>

          </div>

        </Form>

      </section>


      {/* =====================================================
          KPIS
          ===================================================== */}

      {busquedaRealizada && (

        <div className="report-effectiveness-kpis">

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
                      "report-effectiveness-kpi",

                      item.featured
                        ? "report-effectiveness-kpi--featured"
                        : "",

                      item.danger
                        ? "report-effectiveness-kpi--danger"
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

                  <span className="report-effectiveness-kpi__label">

                    {
                      item.label
                    }

                  </span>


                  <strong className="report-effectiveness-kpi__value">

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
          EFECTIVIDAD PRINCIPAL
          ===================================================== */}

      <section className="report-effectiveness-table-card">

        <div className="report-effectiveness-table-card__header">

          <div>

            <span>

              EFECTIVIDAD

            </span>


            <h3>

              Resumen por lapso

            </h3>


            <p>

              Selecciona una fila o los indicadores
              de clientes para consultar el detalle.

            </p>

          </div>


          <strong>

            {
              datos.length
            }

            {" "}registros

          </strong>

        </div>


        <Table
          rowKey={
            function (
              dato,
              index
            ) {

              return (
                dato.id ||
                dato.lapso ||
                index
              );

            }
          }
          columns={
            columnasEfectividad
          }
          dataSource={
            datos
          }
          size="small"
          scroll={{
            x:
              1450,
          }}
          pagination={
            false
          }
          onRow={
            function (
              dato
            ) {

              return {

                onClick:
                  function () {

                    abrirDetalleLapso(
                      dato
                    );

                  },

                className:
                  "report-effectiveness-main-row",

              };

            }
          }
          locale={{
            emptyText:
              busquedaRealizada
                ? "No hay información para el periodo seleccionado."
                : "Realiza una búsqueda para consultar la efectividad.",
          }}
          className="report-effectiveness-table"
        />

      </section>


      {/* =====================================================
          CONGELADOS
          ===================================================== */}

      <section className="report-effectiveness-table-card">

        <div className="report-effectiveness-table-card__header">

          <div>

            <span>

              CARTERA CONGELADA

            </span>


            <h3>

              Clientes congelados

            </h3>


            <p>

              Clientes cuya cobranza permanece congelada
              dentro del periodo consultado.

            </p>

          </div>


          <strong>

            {
              datosClientesCongelados.length
            }

            {" "}clientes

          </strong>

        </div>


        <Table
          rowKey={
            function (
              dato,
              index
            ) {

              return (
                dato.id ||
                index
              );

            }
          }
          columns={
            columnasCongelados
          }
          dataSource={
            datosClientesCongelados
          }
          size="small"
          scroll={{
            x:
              1100,
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
                  " clientes"
                );

              },
          }}
          locale={{
            emptyText:
              busquedaRealizada
                ? "No hay clientes congelados."
                : "Realiza una búsqueda para consultar clientes congelados.",
          }}
          className="report-effectiveness-table"
        />

      </section>


      {/* =====================================================
          ANUALIDADES
          ===================================================== */}

      <section className="report-effectiveness-table-card">

        <div className="report-effectiveness-table-card__header">

          <div>

            <span>

              ANUALIDADES

            </span>


            <h3>

              Anualidades del mes

            </h3>


            <p>

              Seguimiento de vencimientos, saldos
              y requerimientos de anualidad.

            </p>

          </div>


          <strong>

            {
              datosClientesAnualidad.length
            }

            {" "}clientes

          </strong>

        </div>


        <Table
          rowKey={
            function (
              dato,
              index
            ) {

              return (
                obtenerInfoLote(
                  dato,
                  "solicitud_id"
                ) ||
                index
              );

            }
          }
          columns={
            columnasAnualidades
          }
          dataSource={
            datosClientesAnualidad
          }
          size="small"
          scroll={{
            x:
              1250,
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
                  " anualidades"
                );

              },
          }}
          locale={{
            emptyText:
              busquedaRealizada
                ? "No hay anualidades para el periodo."
                : "Realiza una búsqueda para consultar anualidades.",
          }}
          className="report-effectiveness-table"
        />

      </section>


      {/* =====================================================
          MODAL REUTILIZABLE
          ===================================================== */}

      <Modal
        title={
          detalleModal.title
        }
        footer={
          null
        }
        width={
          1150
        }
        open={
          detalleModal.open
        }
        destroyOnClose
        onCancel={
          cerrarModal
        }
      >

        <DetalleModal
          tipo={
            detalleModal.tipo
          }
          data={
            detalleModal.data
          }
        />

      </Modal>

    </div>

  );

}


/* ============================================================
   MODAL DETALLE
   ============================================================ */

function DetalleModal({
  tipo,
  data,
}) {

  let columnas =
    columnasRegistro();


  if (
    tipo ===
    "por_cobrar"
  ) {

    columnas =
      columnasPorCobrar();

  }


  if (
    tipo ===
    "efectivo"
  ) {

    columnas =
      columnasEfectivo();

  }


  return (

    <div className="report-effectiveness-modal">

      <Table
        rowKey={
          function (
            dato,
            index
          ) {

            return (
              dato.id ||
              (
                String(
                  dato.nombre_cliente ||
                  ""
                ) +
                "-" +
                index
              )
            );

          }
        }
        columns={
          columnas
        }
        dataSource={
          Array.isArray(data)
            ? data
            : []
        }
        size="small"
        scroll={{
          x:
            tipo ===
            "por_cobrar"
              ? 1250
              : 950,
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
        }}
        locale={{
          emptyText:
            "No hay registros disponibles.",
        }}
        className="report-effectiveness-table"
      />

    </div>

  );

}


/* ============================================================
   COLUMNAS REGISTRO
   ============================================================ */

function columnasRegistro() {

  return [

    {
      title:
        "Cliente",

      dataIndex:
        "nombre_cliente",

      key:
        "nombre_cliente",

      width:
        210,
    },


    {
      title:
        "No. pago",

      dataIndex:
        "no_pago",

      key:
        "no_pago",

      width:
        80,
    },


    {
      title:
        "Fecha pago",

      dataIndex:
        "fecha_pago",

      key:
        "fecha_pago",

      width:
        110,
    },


    {
      title:
        "Monto a pagar",

      dataIndex:
        "monto_pago",

      key:
        "monto_pago",

      align:
        "right",

      render:
        moneda,
    },


    {
      title:
        "Pagado",

      dataIndex:
        "monto_pagado",

      key:
        "monto_pagado",

      align:
        "right",

      render:
        moneda,
    },


    {
      title:
        "Pendiente",

      dataIndex:
        "monto_pendiente",

      key:
        "monto_pendiente",

      align:
        "right",

      render:
        moneda,
    },


    {
      title:
        "Vencido",

      dataIndex:
        "monto_vencido",

      key:
        "monto_vencido",

      align:
        "right",

      render:
        function (
          value
        ) {

          return (

            <span className="report-effectiveness-danger">

              {
                moneda(
                  value
                )
              }

            </span>

          );

        },
    },


    {
      title:
        "A favor",

      dataIndex:
        "monto_favor",

      key:
        "monto_favor",

      align:
        "right",

      render:
        moneda,
    },


    {
      title:
        "Proyecto / Lote",

      dataIndex:
        "terreno",

      key:
        "terreno",

      width:
        130,
    },

  ];

}


/* ============================================================
   POR COBRAR
   ============================================================ */

function columnasPorCobrar() {

  const columnas =
    columnasRegistro();


  columnas.splice(
    8,
    0,
    {
      title:
        "Intereses",

      dataIndex:
        "monto_interes",

      key:
        "monto_interes",

      align:
        "right",

      render:
        moneda,
    }
  );


  columnas.push({
    title:
      "Teléfono",

    dataIndex:
      "telefono",

    key:
      "telefono",

    width:
      115,
  });


  return columnas;

}


/* ============================================================
   EFECTIVO
   ============================================================ */

function columnasEfectivo() {

  return [

    {
      title:
        "Cliente",

      dataIndex:
        "nombre_cliente",

      key:
        "nombre_cliente",

      width:
        220,
    },


    {
      title:
        "Fecha solicitud",

      dataIndex:
        "fecha_solicitud",

      key:
        "fecha_solicitud",

      width:
        120,
    },


    {
      title:
        "Pagado",

      dataIndex:
        "monto_pagado",

      key:
        "monto_pagado",

      align:
        "right",

      render:
        moneda,
    },


    {
      title:
        "Pendiente",

      dataIndex:
        "pendiente",

      key:
        "pendiente",

      align:
        "right",

      render:
        moneda,
    },


    {
      title:
        "Vencido",

      dataIndex:
        "monto_vencido",

      key:
        "monto_vencido",

      align:
        "right",

      render:
        moneda,
    },


    {
      title:
        "A favor",

      dataIndex:
        "monto_favor",

      key:
        "monto_favor",

      align:
        "right",

      render:
        moneda,
    },


    {
      title:
        "Proyecto / Lote",

      dataIndex:
        "terreno",

      key:
        "terreno",

      width:
        140,
    },

  ];

}


/* ============================================================
   LAPSO
   ============================================================ */

function obtenerClaseLapso(
  lapso
) {

  if (
    lapso ===
    "Mes"
  ) {

    return (
      "report-effectiveness-period report-effectiveness-period--month"
    );

  }


  if (
    lapso ===
    "Quincena - 1"
  ) {

    return (
      "report-effectiveness-period report-effectiveness-period--first"
    );

  }


  if (
    lapso ===
    "Quincena - 2"
  ) {

    return (
      "report-effectiveness-period report-effectiveness-period--second"
    );

  }


  return (
    "report-effectiveness-period"
  );

}


/* ============================================================
   INFO LOTE
   ============================================================ */

function obtenerInfoLote(
  dato,
  propiedad
) {

  if (
    !dato ||
    !dato.info_lote
  ) {

    return 0;

  }


  return (
    dato.info_lote[
      propiedad
    ] ||
    0
  );

}


/* ============================================================
   FORMATTERS
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


function porcentajeSeguro(
  value
) {

  const numero =
    numeroSeguro(
      value
    );


  if (
    numero <
    0
  ) {

    return 0;

  }


  if (
    numero >
    100
  ) {

    return 100;

  }


  return numero;

}


function porcentajeTexto(
  value
) {

  return (
    numeroSeguro(
      value
    ).toFixed(
      2
    ) +
    "%"
  );

}