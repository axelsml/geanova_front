"use client";

import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Modal,
  Progress,
  Select,
  Table,
  Tabs,
  Tooltip,
} from "antd";

import Swal from "sweetalert2";

import terrenosService from "@/services/terrenosService";
import pagosService from "@/services/pagosService";

import {
  formatDate,
  formatPrecio,
  formatPrecio2,
} from "@/helpers/formatters";

import {
  LoadingContext,
} from "@/contexts/loading";


const {
  Option,
} = Select;


const {
  TabPane,
} = Tabs;


/* ============================================================
   ESTATUS
   ============================================================ */

const OPCIONES_ESTATUS = [
  {
    id: 0,
    nombre: "Todas",
  },
  {
    id: 1,
    nombre: "Cobranza",
  },
  {
    id: 2,
    nombre: "Liquidadas",
  },
];


export default function ReporteEstatusCobranza() {

  const loadingContext =
    useContext(
      LoadingContext
    );


  if (!loadingContext) {

    throw new Error(
      "ReporteEstatusCobranza debe estar dentro de LoadingProvider"
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
     CATÁLOGOS
     ========================================================== */

  const [
    terrenos,
    setTerrenos,
  ] =
    useState([]);


  /* ==========================================================
     FILTROS
     ========================================================== */

  const [
    terrenoSelected,
    setTerrenoSelected,
  ] =
    useState(0);


  const [
    estatus,
    setEstatus,
  ] =
    useState(0);


  const [
    fecha,
    setFecha,
  ] =
    useState(null);


  const [
    semanal,
    setSemanal,
  ] =
    useState(true);


  const [
    quincenal,
    setQuincenal,
  ] =
    useState(true);


  const [
    mensual,
    setMensual,
  ] =
    useState(true);


  /* ==========================================================
     RESULTADOS
     ========================================================== */

  const [
    dataClientes,
    setDataClientes,
  ] =
    useState([]);


  const [
    dataSemanas,
    setDataSemanas,
  ] =
    useState([]);


  const [
    dataFechas,
    setDataFechas,
  ] =
    useState([]);


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
    selectedRowData,
    setSelectedRowData,
  ] =
    useState(null);


  const [
    checked,
    setChecked,
  ] =
    useState(null);


  /* ==========================================================
     CARGA INICIAL
     ========================================================== */

  useEffect(
    function () {

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
      "ReporteEstatusCobranza:",
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
          : "No fue posible realizar la consulta.",

      confirmButtonText:
        "Aceptar",
    });

  }


  /* ==========================================================
     BUSCAR
     ========================================================== */

  const onSearch =
    function () {

      if (
        !semanal &&
        !quincenal &&
        !mensual
      ) {

        Swal.fire({
          title:
            "Periodicidad requerida",

          icon:
            "warning",

          text:
            "Seleccione al menos una periodicidad para realizar el reporte.",

          confirmButtonText:
            "Aceptar",
        });


        return;

      }


      setIsLoading(
        true
      );


      const params = {

        fecha:
          fecha,

        terreno_id:
          Number(
            terrenoSelected ||
            0
          ),

        status_id:
          Number(
            estatus ||
            0
          ),

        semanal:
          semanal,

        quincenal:
          quincenal,

        mensual:
          mensual,

      };


      pagosService.getReporteEstatusCobranza(
        params,
        onReporte,
        onError
      );

    };


  /* ==========================================================
     RESPUESTA
     ========================================================== */

  function onReporte(
    response
  ) {

    setIsLoading(
      false
    );


    setBusquedaRealizada(
      true
    );


    if (
      response &&
      response.encontrado
    ) {

      setDataClientes(
        Array.isArray(
          response.response
        )
          ? response.response
          : []
      );


      setDataSemanas(
        Array.isArray(
          response.semanas
        )
          ? response.semanas
          : []
      );


      setDataFechas(
        Array.isArray(
          response.fechas
        )
          ? response.fechas
          : []
      );


      return;

    }


    setDataClientes(
      []
    );


    setDataSemanas(
      []
    );


    setDataFechas(
      []
    );


    Swal.fire({
      title:
        "Sin resultados",

      icon:
        "info",

      text:
        "No se encontró información con los filtros seleccionados.",

      confirmButtonText:
        "Aceptar",
    });

  }


  /* ==========================================================
     CHECKBOXES
     ========================================================== */

  const handleCheckboxSemanalChange =
    function (event) {

      const value =
        event.target.checked;


      setSemanal(
        value
      );


      form.setFieldsValue({
        semanal:
          value,
      });

    };


  const handleCheckboxQuincenalChange =
    function (event) {

      const value =
        event.target.checked;


      setQuincenal(
        value
      );


      form.setFieldsValue({
        quincenal:
          value,
      });

    };


  const handleCheckboxMensualChange =
    function (event) {

      const value =
        event.target.checked;


      setMensual(
        value
      );


      form.setFieldsValue({
        mensual:
          value,
      });

    };


  /* ==========================================================
     CLIENTE
     ========================================================== */

  const handleClienteRowClick =
    function (row) {

      const loteId =
        row.lote_id;


      const terrenoId =
        row.terreno_id;


      window.open(
        "https://king-prawn-app-9pkxd.ondigitalocean.app/cliente" +
          "?terreno_id=" +
          terrenoId +
          "&lote_id=" +
          loteId +
          "&shouldSearch=true",
        "_blank"
      );

    };


  /* ==========================================================
     ABRIR DETALLE
     ========================================================== */

  const handleRowClick =
    function (
      rowDataM,
      rowDataQ,
      rowDataS
    ) {

      setSelectedRowData({
        rowDataM:
          Array.isArray(rowDataM)
            ? rowDataM
            : [],

        rowDataQ:
          Array.isArray(rowDataQ)
            ? rowDataQ
            : [],

        rowDataS:
          Array.isArray(rowDataS)
            ? rowDataS
            : [],
      });


      setChecked({
        semanal:
          semanal,

        quincenal:
          quincenal,

        mensual:
          mensual,
      });


      setShow(
        true
      );

    };


  const handleCloseModal =
    function () {

      setShow(
        false
      );


      setSelectedRowData(
        null
      );


      setChecked(
        null
      );

    };


  /* ==========================================================
     RESUMEN GENERAL
     ========================================================== */

  const resumenGeneral =
    useMemo(
      function () {

        const semanas =
          Array.isArray(
            dataSemanas
          )
            ? dataSemanas
            : [];


        const pagados =
          semanas.reduce(
            function (
              total,
              item
            ) {

              return (
                total +
                numeroSeguro(
                  item.pagado
                )
              );

            },
            0
          );


        const sinPagar =
          semanas.reduce(
            function (
              total,
              item
            ) {

              return (
                total +
                numeroSeguro(
                  item.sin_pagar
                )
              );

            },
            0
          );


        const montoPagado =
          semanas.reduce(
            function (
              total,
              item
            ) {

              return (
                total +
                numeroSeguro(
                  item.suma_pagado
                )
              );

            },
            0
          );


        const anticipos =
          semanas.reduce(
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


        const montoSinPagar =
          semanas.reduce(
            function (
              total,
              item
            ) {

              return (
                total +
                numeroSeguro(
                  item.suma_sin_pagar
                )
              );

            },
            0
          );


        const totalMovimientos =
          pagados +
          sinPagar;


        const porcentaje =
          totalMovimientos >
          0
            ? (
                pagados /
                totalMovimientos
              ) *
              100
            : 0;


        return {

          clientes:
            Array.isArray(
              dataClientes
            )
              ? dataClientes.length
              : 0,

          pagados:
            pagados,

          sinPagar:
            sinPagar,

          montoPagado:
            montoPagado,

          anticipos:
            anticipos,

          montoSinPagar:
            montoSinPagar,

          porcentaje:
            porcentaje,

        };

      },
      [
        dataSemanas,
        dataClientes,
      ]
    );


  /* ==========================================================
     KPIS
     ========================================================== */

  const kpis = [

    {
      label:
        "Clientes",
      value:
        entero(
          resumenGeneral.clientes
        ),
    },

    {
      label:
        "Pagos realizados",
      value:
        entero(
          resumenGeneral.pagados
        ),
    },

    {
      label:
        "Monto pagado",
      value:
        moneda(
          resumenGeneral.montoPagado
        ),
      featured:
        true,
    },

    {
      label:
        "Anticipos",
      value:
        moneda(
          resumenGeneral.anticipos
        ),
    },

    {
      label:
        "Sin pagar",
      value:
        entero(
          resumenGeneral.sinPagar
        ),
      danger:
        resumenGeneral.sinPagar >
        0,
    },

    {
      label:
        "Monto pendiente",
      value:
        moneda(
          resumenGeneral.montoSinPagar
        ),
      danger:
        resumenGeneral.montoSinPagar >
        0,
    },

    {
      label:
        "Efectividad",
      value:
        porcentajeTexto(
          resumenGeneral.porcentaje
        ),
      featured:
        true,
    },

  ];


  /* ==========================================================
     TABLA RESUMEN SEMANAS
     ========================================================== */

  const columnasSemanas = [

    {
      title:
        "Semana",

      dataIndex:
        "semana",

      key:
        "semana",

      width:
        100,

      render:
        function (
          value
        ) {

          return (
            <strong className="report-status-week">

              {
                value
              }

            </strong>
          );

        },
    },


    {
      title:
        "Clientes",

      dataIndex:
        "clientes",

      key:
        "clientes",

      align:
        "center",

      width:
        90,
    },


    {
      title:
        "Pagado",

      key:
        "pagado",

      align:
        "center",

      width:
        100,

      render:
        function (
          value,
          item
        ) {

          return (

            <button
              type="button"
              className="report-status-link-button"
              onClick={
                function () {

                  handleRowClick(
                    item.detalle_pagado_mensual,
                    item.detalle_pagado_quicenal,
                    item.detalle_pagado_semanal
                  );

                }
              }
            >

              {
                item.pagado
              }

            </button>

          );

        },
    },


    {
      title:
        "Monto pagado",

      dataIndex:
        "suma_pagado",

      key:
        "suma_pagado",

      align:
        "right",

      width:
        125,

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
        "Anticipo",

      dataIndex:
        "anticipo",

      key:
        "anticipo",

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
        "Sin pagar",

      key:
        "sin_pagar",

      align:
        "center",

      width:
        100,

      render:
        function (
          value,
          item
        ) {

          return (

            <button
              type="button"
              className="report-status-link-button report-status-link-button--danger"
              onClick={
                function () {

                  handleRowClick(
                    item.detalle_sin_pagar_mensual,
                    item.detalle_sin_pagar_quicenal,
                    item.detalle_sin_pagar_semanal
                  );

                }
              }
            >

              {
                item.sin_pagar
              }

            </button>

          );

        },
    },


    {
      title:
        "Monto pendiente",

      dataIndex:
        "suma_sin_pagar",

      key:
        "suma_sin_pagar",

      align:
        "right",

      width:
        135,

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
                  ? "report-status-money-danger"
                  : ""
              }
            >

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
        "Efectividad",

      dataIndex:
        "porcentaje",

      key:
        "porcentaje",

      width:
        170,

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
                    formatPrecio2(
                      porcentaje
                    ) +
                    "%"
                  );

                }
              }
            />

          );

        },
    },

  ];


  /* ==========================================================
     TABLA CLIENTES DINÁMICA
     ========================================================== */

  const columnasClientes =
    useMemo(
      function () {

        const columnas = [

          {
            title:
              "Cliente",

            dataIndex:
              "nombre_cliente",

            key:
              "nombre_cliente",

            width:
              210,

            fixed:
              "left",

            render:
              function (
                value,
                row
              ) {

                return (

                  <button
                    type="button"
                    className="report-status-client-link"
                    onClick={
                      function () {

                        handleClienteRowClick(
                          row
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
              "Proyecto",

            dataIndex:
              "terreno",

            key:
              "terreno",

            width:
              140,
          },


          {
            title:
              "Lote",

            dataIndex:
              "lote",

            key:
              "lote",

            width:
              80,

            align:
              "center",
          },

        ];


        const fechas =
          Array.isArray(
            dataFechas
          )
            ? dataFechas
            : [];


        fechas.forEach(
          function (
            fechaSemana,
            index
          ) {

            columnas.push({

              title: (

                <Tooltip
                  title={
                    fechaSemana &&
                    fechaSemana.fechas
                      ? fechaSemana.fechas
                      : ""
                  }
                >

                  <span className="report-status-week-header">

                    Semana {
                      index +
                      1
                    }

                  </span>

                </Tooltip>

              ),

              key:
                "semana_" +
                index,

              width:
                115,

              align:
                "right",

              render:
                function (
                  value,
                  row
                ) {

                  const pagos =
                    Array.isArray(
                      row.pagos
                    )
                      ? row.pagos
                      : [];


                  const pago =
                    pagos[index];


                  if (
                    !pago ||
                    pago.monto_pagado ===
                      "" ||
                    pago.monto_pagado ===
                      null ||
                    pago.monto_pagado ===
                      undefined
                  ) {

                    return (

                      <span className="report-status-no-payment">

                        —

                      </span>

                    );

                  }


                  return (

                    <span className="report-status-payment">

                      {
                        moneda(
                          pago.monto_pagado
                        )
                      }

                    </span>

                  );

                },

            });

          }
        );


        columnas.push({

          title:
            "Total pagado",

          dataIndex:
            "importe_total",

          key:
            "importe_total",

          align:
            "right",

          width:
            135,

          fixed:
            "right",

          render:
            function (
              value
            ) {

              return (

                <strong className="report-status-total">

                  {
                    moneda(
                      value
                    )
                  }

                </strong>

              );

            },

        });


        return columnas;

      },
      [
        dataFechas,
      ]
    );


  /* ==========================================================
     ROW CLASS
     ========================================================== */

  function getClientRowClassName(
    row
  ) {

    const financiamientoId =
      Number(
        row.financiamiento_id ||
        0
      );


    if (
      financiamientoId ===
      1
    ) {

      return (
        "report-status-client-row report-status-client-row--monthly"
      );

    }


    if (
      financiamientoId ===
      2
    ) {

      return (
        "report-status-client-row report-status-client-row--biweekly"
      );

    }


    if (
      financiamientoId ===
      3
    ) {

      return (
        "report-status-client-row report-status-client-row--weekly"
      );

    }


    return (
      "report-status-client-row"
    );

  }


  /* ==========================================================
     RENDER
     ========================================================== */

  return (

    <div className="report-status-page">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="report-status-header">

        <div>

          <span className="report-status-header__eyebrow">

            SEGUIMIENTO DE CARTERA

          </span>


          <h2 className="report-status-header__title">

            Estatus de cobranza

          </h2>


          <p className="report-status-header__description">

            Analiza el comportamiento de pago por semana
            y consulta el detalle de clientes por periodicidad.

          </p>

        </div>


        <div className="report-status-frequency-legend">

          <span className="report-status-frequency report-status-frequency--monthly">

            Mensual

          </span>


          <span className="report-status-frequency report-status-frequency--biweekly">

            Quincenal

          </span>


          <span className="report-status-frequency report-status-frequency--weekly">

            Semanal

          </span>

        </div>

      </div>


      {/* =====================================================
          FILTROS
          ===================================================== */}

      <section className="report-status-filter-card">

        <div className="report-status-card-header">

          <span>

            FILTROS

          </span>


          <h3>

            Configuración del reporte

          </h3>


          <p>

            Selecciona proyecto, estatus, fecha
            y las periodicidades que deseas analizar.

          </p>

        </div>


        <Form
          form={
            form
          }
          layout="vertical"
          onFinish={
            onSearch
          }
          initialValues={{
            terreno:
              0,

            estatus:
              0,

            semanal:
              true,

            quincenal:
              true,

            mensual:
              true,
          }}
          className="report-status-form"
        >

          <div className="report-status-filter-grid">


            {/* PROYECTO */}

            <Form.Item
              label="Proyecto"
              name="terreno"
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


            {/* ESTATUS */}

            <Form.Item
              label="Estatus"
              name="estatus"
            >

              <Select
                size="large"
                placeholder="Todas"
                onChange={
                  function (
                    value
                  ) {

                    setEstatus(
                      Number(
                        value ||
                        0
                      )
                    );

                  }
                }
              >

                {OPCIONES_ESTATUS.map(
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

            </Form.Item>


            {/* FECHA */}

            <Form.Item
              name="fecha"
              label="Fecha"
            >

              <DatePicker
                allowClear
                size="large"
                style={{
                  width:
                    "100%",
                }}
                placeholder="Seleccione una fecha"
                onChange={
                  function (
                    value
                  ) {

                    setFecha(
                      value
                        ? formatDate(
                            value
                          )
                        : null
                    );

                  }
                }
              />

            </Form.Item>


            {/* PERIODICIDAD */}

            <div className="report-status-periodicity">

              <span className="report-status-periodicity__label">

                Periodicidad

              </span>


              <div className="report-status-periodicity__options">

                <Form.Item
                  name="semanal"
                  valuePropName="checked"
                  noStyle
                >

                  <Checkbox
                    onChange={
                      handleCheckboxSemanalChange
                    }
                  >

                    Semanal

                  </Checkbox>

                </Form.Item>


                <Form.Item
                  name="quincenal"
                  valuePropName="checked"
                  noStyle
                >

                  <Checkbox
                    onChange={
                      handleCheckboxQuincenalChange
                    }
                  >

                    Quincenal

                  </Checkbox>

                </Form.Item>


                <Form.Item
                  name="mensual"
                  valuePropName="checked"
                  noStyle
                >

                  <Checkbox
                    onChange={
                      handleCheckboxMensualChange
                    }
                  >

                    Mensual

                  </Checkbox>

                </Form.Item>

              </div>

            </div>


            {/* BUSCAR */}

            <div className="report-status-filter-action">

              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="report-status-search-button"
              >

                Buscar reporte

              </Button>

            </div>

          </div>

        </Form>

      </section>


      {/* =====================================================
          RESULTADOS
          ===================================================== */}

      {busquedaRealizada && (

        <>

          {/* =================================================
              KPIS
              ================================================= */}

          <div className="report-status-kpis">

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
                        "report-status-kpi",

                        item.featured
                          ? "report-status-kpi--featured"
                          : "",

                        item.danger
                          ? "report-status-kpi--danger"
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

                    <span className="report-status-kpi__label">

                      {
                        item.label
                      }

                    </span>


                    <strong className="report-status-kpi__value">

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
              SEMANAS
              ================================================= */}

          <section className="report-status-table-card">

            <div className="report-status-table-card__header">

              <div>

                <span>

                  RESUMEN

                </span>


                <h3>

                  Comportamiento por semana

                </h3>


                <p>

                  Haz clic en Pagado o Sin pagar
                  para consultar el detalle de clientes.

                </p>

              </div>


              <strong>

                {
                  dataSemanas.length
                }

                {" "}semanas

              </strong>

            </div>


            <Table
              rowKey={
                function (
                  item,
                  index
                ) {

                  return (
                    item.semana ||
                    index
                  );

                }
              }
              columns={
                columnasSemanas
              }
              dataSource={
                dataSemanas
              }
              size="small"
              scroll={{
                x:
                  1000,
              }}
              pagination={
                false
              }
              locale={{
                emptyText:
                  "No hay información semanal disponible.",
              }}
              className="report-status-table"
            />

          </section>


          {/* =================================================
              CLIENTES
              ================================================= */}

          <section className="report-status-table-card">

            <div className="report-status-table-card__header">

              <div>

                <span>

                  DETALLE

                </span>


                <h3>

                  Clientes

                </h3>


                <p>

                  Seguimiento de pagos por cliente
                  durante las semanas consultadas.

                </p>

              </div>


              <strong>

                {
                  dataClientes.length
                }

                {" "}clientes

              </strong>

            </div>


            <Table
              rowKey={
                function (
                  item,
                  index
                ) {

                  return (
                    item.solicitud_id ||
                    (
                      String(
                        item.terreno_id ||
                        ""
                      ) +
                      "-" +
                      String(
                        item.lote_id ||
                        ""
                      ) +
                      "-" +
                      index
                    )
                  );

                }
              }
              columns={
                columnasClientes
              }
              dataSource={
                dataClientes
              }
              rowClassName={
                getClientRowClassName
              }
              size="small"
              scroll={{
                x:
                  Math.max(
                    900,
                    500 +
                    (
                      dataFechas.length *
                      115
                    )
                  ),
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
                  "No hay clientes para los filtros seleccionados.",
              }}
              className="report-status-table"
            />

          </section>

        </>

      )}


      {/* =====================================================
          MODAL
          ===================================================== */}

      <Modal
        width={
          1050
        }
        visible={
          show
        }
        footer={
          null
        }
        destroyOnClose
        title="Detalle de clientes"
        onCancel={
          handleCloseModal
        }
      >

        {show &&
          selectedRowData &&
          checked && (

          <ModalResumenDetalle
            rowData={
              selectedRowData
            }
            checkData={
              checked
            }
          />

        )}

      </Modal>

    </div>

  );

}


/* ============================================================
   MODAL DETALLE
   ============================================================ */

function ModalResumenDetalle({
  rowData,
  checkData,
}) {

  const columnas = [

    {
      title:
        "Cliente",

      dataIndex:
        "nombre",

      key:
        "nombre",

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
        "Teléfono",

      dataIndex:
        "telefono",

      key:
        "telefono",

      width:
        130,
    },


    {
      title:
        "Proyecto",

      dataIndex:
        "terreno",

      key:
        "terreno",

      width:
        140,
    },


    {
      title:
        "Lote",

      dataIndex:
        "no_lote",

      key:
        "no_lote",

      width:
        80,

      align:
        "center",
    },


    {
      title:
        "Pago",

      dataIndex:
        "pago",

      key:
        "pago",

      width:
        120,

      align:
        "right",

      render:
        function (
          value
        ) {

          if (
            typeof value ===
            "number"
          ) {

            return moneda(
              value
            );

          }


          return (
            value ||
            "No disponible"
          );

        },
    },


    {
      title:
        "Saldo vencido",

      dataIndex:
        "vencido",

      key:
        "vencido",

      width:
        130,

      align:
        "right",

      render:
        function (
          value,
          record
        ) {

          if (
            typeof record.pago ===
            "number"
          ) {

            return (

              <span
                className={
                  numeroSeguro(
                    value
                  ) >
                  0
                    ? "report-status-money-danger"
                    : ""
                }
              >

                {
                  moneda(
                    value
                  )
                }

              </span>

            );

          }


          return (
            "No disponible"
          );

        },
    },

  ];


  return (

    <div className="report-status-modal">

      <div className="report-status-modal__header">

        <span>

          DETALLE

        </span>


        <h3>

          Información de clientes

        </h3>


        <p>

          Consulta los clientes correspondientes
          al movimiento seleccionado.

        </p>

      </div>


      <Tabs
        defaultActiveKey={
          obtenerPrimerTab(
            checkData
          )
        }
        animated={
          false
        }
      >

        {checkData.mensual && (

          <TabPane
            tab={
              "Mensual (" +
              rowData.rowDataM.length +
              ")"
            }
            key="mensual"
          >

            <TablaDetalle
              data={
                rowData.rowDataM
              }
              columns={
                columnas
              }
            />

          </TabPane>

        )}


        {checkData.quincenal && (

          <TabPane
            tab={
              "Quincenal (" +
              rowData.rowDataQ.length +
              ")"
            }
            key="quincenal"
          >

            <TablaDetalle
              data={
                rowData.rowDataQ
              }
              columns={
                columnas
              }
            />

          </TabPane>

        )}


        {checkData.semanal && (

          <TabPane
            tab={
              "Semanal (" +
              rowData.rowDataS.length +
              ")"
            }
            key="semanal"
          >

            <TablaDetalle
              data={
                rowData.rowDataS
              }
              columns={
                columnas
              }
            />

          </TabPane>

        )}

      </Tabs>

    </div>

  );

}


/* ============================================================
   TABLA MODAL
   ============================================================ */

function TablaDetalle({
  data,
  columns,
}) {

  return (

    <Table
      rowKey={
        function (
          item,
          index
        ) {

          return (
            item.id ||
            (
              String(
                item.nombre ||
                ""
              ) +
              "-" +
              index
            )
          );

        }
      }
      columns={
        columns
      }
      dataSource={
        Array.isArray(
          data
        )
          ? data
          : []
      }
      size="small"
      scroll={{
        x:
          850,
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
          "No hay clientes en esta periodicidad.",
      }}
      className="report-status-table"
    />

  );

}


/* ============================================================
   PRIMER TAB
   ============================================================ */

function obtenerPrimerTab(
  checkData
) {

  if (
    checkData.mensual
  ) {

    return "mensual";

  }


  if (
    checkData.quincenal
  ) {

    return "quincenal";

  }


  return "semanal";

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


function porcentajeTexto(
  value
) {

  return (
    formatPrecio2(
      numeroSeguro(
        value
      )
    ) +
    "%"
  );

}