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
  Form,
  Select,
  Table,
  Tooltip,
} from "antd";

import {
  BiSearch,
} from "react-icons/bi";

import Swal from "sweetalert2";

import terrenosService from "@/services/terrenosService";
import pagosService from "@/services/pagosService";

import {
  formatPrecio,
  formatDate,
} from "@/helpers/formatters";

import {
  LoadingContext,
} from "@/contexts/loading";


const {
  Option,
} = Select;


/* ============================================================
   STATUS DE PAGO
   ============================================================ */

const STATUS_PAGO = [
  {
    id: 0,
    nombre: "Todos",
  },
  {
    id: 1,
    nombre: "Conciliado",
  },
  {
    id: 2,
    nombre: "Pendiente",
  },
];


/* ============================================================
   ESTADOS DE SOLICITUD
   ============================================================ */

const ESTADOS_SOLICITUD = [
  {
    color: "#0000FF",
    nombre: "Liquidada",
  },
  {
    color: "#008000",
    nombre: "Al corriente",
  },
  {
    color: "#EAB308",
    nombre: "Adelantado",
  },
  {
    color: "#F39C12",
    nombre: "Atrasado",
  },
  {
    color: "#FF0000",
    nombre: "Vencido",
  },
];


export default function ReporteCobranza() {

  const loadingContext =
    useContext(
      LoadingContext
    );


  if (!loadingContext) {

    throw new Error(
      "ReporteCobranza debe estar dentro de LoadingProvider"
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


  const [
    sistemasPago,
    setSistemasPago,
  ] =
    useState([]);


  const [
    cuentasBancarias,
    setCuentasBancarias,
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
    sistemaPagoSelected,
    setSistemaPagoSelected,
  ] =
    useState(0);


  const [
    cuentaBancariaSelected,
    setCuentaBancariaSelected,
  ] =
    useState(0);


  const [
    statusPagoId,
    setStatusPagoId,
  ] =
    useState(0);


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


  /* ==========================================================
     RESULTADOS
     ========================================================== */

  const [
    data,
    setData,
  ] =
    useState([]);


  const [
    dataSolicitudes,
    setDataSolicitudes,
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
    cantidadPagos,
    setCantidadPagos,
  ] =
    useState(0);


  const [
    totalPagado,
    setTotalPagado,
  ] =
    useState(0);


  const [
    totalContrato,
    setTotalContrato,
  ] =
    useState(0);


  const [
    totalPendiente,
    setTotalPendiente,
  ] =
    useState(0);


  const [
    totalAnticipo,
    setTotalAnticipo,
  ] =
    useState(0);


  const [
    totalInteres,
    setTotalInteres,
  ] =
    useState(0);


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


      pagosService.getSistemasPago(
        function (response) {

          setSistemasPago(
            Array.isArray(response)
              ? response
              : []
          );

        },
        onError
      );


      pagosService.getCuentasBancarias(
        function (response) {

          setCuentasBancarias(
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
     MOSTRAR CUENTA BANCARIA
     ========================================================== */

  const mostrarCuentaBancaria =
    Number(
      sistemaPagoSelected
    ) ===
      2 &&
    Number(
      statusPagoId
    ) ===
      1;


  /* ==========================================================
     SI CAMBIA SISTEMA / STATUS
     ========================================================== */

  useEffect(
    function () {

      if (
        !mostrarCuentaBancaria
      ) {

        setCuentaBancariaSelected(
          0
        );


        form.setFieldsValue({
          cuentas_id:
            undefined,
        });

      }

    },
    [
      mostrarCuentaBancaria,
    ]
  );


  /* ==========================================================
     BUSCAR
     ========================================================== */

  const onSearch =
    function () {

      /* ------------------------------------------------------
         VALIDAR RANGO DE FECHAS
         ------------------------------------------------------ */

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


      setIsLoading(
        true
      );


      limpiarTotales();


      const params = {

        fecha_inicial:
          fechaInicial,

        fecha_final:
          fechaFinal,

        terreno_id:
          Number(
            terrenoSelected ||
            0
          ),

        sistema_pago_id:
          Number(
            sistemaPagoSelected ||
            0
          ),

        cuenta_id:
          mostrarCuentaBancaria
            ? Number(
                cuentaBancariaSelected ||
                0
              )
            : 0,

        status_id:
          Number(
            statusPagoId ||
            0
          ),

      };


      pagosService.getReporteCobranza(
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
      response.encontrado &&
      Array.isArray(
        response.response
      ) &&
      response.response.length >
        0
    ) {

      setData(
        response.response
      );


      setDataSolicitudes(
        Array.isArray(
          response.solicitudes
        )
          ? response.solicitudes
          : []
      );


      setTotalPagado(
        numeroSeguro(
          response.pagado
        )
      );


      setTotalContrato(
        numeroSeguro(
          response.contrato
        )
      );


      setTotalPendiente(
        numeroSeguro(
          response.pendiente
        )
      );


      setTotalAnticipo(
        numeroSeguro(
          response.anticipo
        )
      );


      setTotalInteres(
        numeroSeguro(
          response.monto_interes
        )
      );


      setCantidadPagos(
        numeroSeguro(
          response.cantidad_pagos
        )
      );


      return;

    }


    setData(
      []
    );


    setDataSolicitudes(
      []
    );


    limpiarTotales();


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
     ERROR
     ========================================================== */

  function onError(
    error
  ) {

    setIsLoading(
      false
    );


    console.error(
      "ReporteCobranza:",
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
          : "No fue posible consultar el reporte.",
      confirmButtonText:
        "Aceptar",
    });

  }


  /* ==========================================================
     LIMPIAR TOTALES
     ========================================================== */

  function limpiarTotales() {

    setCantidadPagos(
      0
    );


    setTotalPagado(
      0
    );


    setTotalContrato(
      0
    );


    setTotalPendiente(
      0
    );


    setTotalAnticipo(
      0
    );


    setTotalInteres(
      0
    );

  }


  /* ==========================================================
     TOTAL COBRADO
     ========================================================== */

  const totalCobrado =
    useMemo(
      function () {

        return (
          numeroSeguro(
            totalPagado
          ) +
          numeroSeguro(
            totalAnticipo
          )
        );

      },
      [
        totalPagado,
        totalAnticipo,
      ]
    );


  /* ==========================================================
     KPIS
     ========================================================== */

 const kpis = [
  {
    label: "Anticipos",
    value: moneda(totalAnticipo),
  },

  {
    label: "Pagos recibidos",
    value: moneda(totalPagado),
  },

  {
    label: "Total cobrado",
    value: moneda(totalCobrado),
    featured: true,
  },

  {
    label: "Monto contratado",
    value: moneda(totalContrato),
  },

  {
    label: "Pendiente",
    value: moneda(totalPendiente),
    danger:
      Number(
        totalPendiente || 0
      ) > 0,
  },

  {
    label: "Intereses",
    value: moneda(totalInteres),
  },

  {
    label: "Pagos registrados",
    value: entero(cantidadPagos),
  },
];


  /* ==========================================================
     TABLA COBRANZA
     ========================================================== */

  const columnasCobranza = [

    {
      title:
        "Cliente",
      dataIndex:
        "nombre_cliente",
      key:
        "nombre_cliente",
      width:
        220,

      render:
        function (
          value
        ) {

          return (
            <strong className="report-cobranza-client">

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
        75,
    },

    {
      title:
        "Folio",
      dataIndex:
        "folio",
      key:
        "folio",
      width:
        100,
    },

    {
      title:
        "Sistema de pago",
      dataIndex:
        "sistema_pago",
      key:
        "sistema_pago",
      width:
        145,
    },

    {
      title:
        "Monto",
      dataIndex:
        "monto_pago",
      key:
        "monto_pago",
      align:
        "right",
      width:
        120,

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
        "Fecha",
      dataIndex:
        "fecha_pago",
      key:
        "fecha_pago",
      width:
        110,
    },

    {
      title:
        "Status pago",
      dataIndex:
        "status_pago",
      key:
        "status_pago",
      width:
        110,

      render:
        function (
          value
        ) {

          const conciliado =
            String(
              value ||
              ""
            )
              .toLowerCase()
              .includes(
                "concili"
              );


          return (

            <span
              className={
                conciliado
                  ? "report-cobranza-payment-status report-cobranza-payment-status--success"
                  : "report-cobranza-payment-status"
              }
            >

              {
                value ||
                "Pendiente"
              }

            </span>

          );

        },
    },

    {
      title:
        "Solicitud",
      dataIndex:
        "status_solicitud",
      key:
        "status_solicitud",
      width:
        130,

      render:
        function (
          color
        ) {

          return (

            <EstadoSolicitud
              color={
                color
              }
            />

          );

        },
    },

  ];


  /* ==========================================================
     TABLA ANTICIPOS
     ========================================================== */

  const columnasAnticipos = [

    {
      title:
        "Cliente",
      dataIndex:
        "cliente_nombre",
      key:
        "cliente_nombre",
      width:
        220,

      render:
        function (
          value
        ) {

          return (
            <strong className="report-cobranza-client">

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
        "Proyecto",
      dataIndex:
        "proyecto",
      key:
        "proyecto",
      width:
        150,
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
        130,

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
        "Fecha solicitud",
      dataIndex:
        "fecha",
      key:
        "fecha",
      width:
        125,
    },

    {
      title:
        "Estado",
      dataIndex:
        "status",
      key:
        "status",
      width:
        130,

      render:
        function (
          color
        ) {

          return (

            <EstadoSolicitud
              color={
                color
              }
            />

          );

        },
    },

  ];


  /* ==========================================================
     RENDER
     ========================================================== */

  return (

    <div className="report-cobranza-page">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="report-cobranza-header">

        <div>

          <span className="report-cobranza-header__eyebrow">

            INGRESOS Y COBRANZA

          </span>


          <h2 className="report-cobranza-header__title">

            Reporte de cobranza

          </h2>


          <p className="report-cobranza-header__description">

            Consulta los pagos recibidos, anticipos,
            saldos e intereses por proyecto, sistema
            de pago y periodo.

          </p>

        </div>


        <Tooltip
          placement="bottomRight"
          title={

            <div className="report-cobranza-legend">

              {ESTADOS_SOLICITUD.map(
                function (
                  estado
                ) {

                  return (

                    <div
                      key={
                        estado.nombre
                      }
                      className="report-cobranza-legend__item"
                    >

                      <span
                        className="report-cobranza-status__dot"
                        style={{
                          backgroundColor:
                            estado.color,
                        }}
                      />

                      <span>

                        {
                          estado.nombre
                        }

                      </span>

                    </div>

                  );

                }
              )}

            </div>

          }
        >

          <button
            type="button"
            className="report-cobranza-legend-button"
          >

            <span className="report-cobranza-legend-dots">

              {ESTADOS_SOLICITUD
                .slice(
                  0,
                  4
                )
                .map(
                  function (
                    estado
                  ) {

                    return (

                      <span
                        key={
                          estado.nombre
                        }
                        style={{
                          backgroundColor:
                            estado.color,
                        }}
                      />

                    );

                  }
                )}

            </span>


            Ver estados

          </button>

        </Tooltip>

      </div>


      {/* =====================================================
          FILTROS
          ===================================================== */}

      <section className="report-cobranza-filter-card">

        <div className="report-cobranza-card-header">

          <div>

            <span>

              FILTROS

            </span>


            <h3>

              Consulta de cobranza

            </h3>


            <p>

              Todos los filtros son opcionales.
              Sin filtros se consultará la información completa.

            </p>

          </div>

        </div>


        <Form
          form={
            form
          }
          layout="vertical"
          className="report-cobranza-form"
        >

          <div className="report-cobranza-filter-grid">


            {/* FECHA INICIAL */}

            <Form.Item
              name="fechaInicial"
              label="Fecha inicial"
            >

              <DatePicker
                allowClear
                size="large"
                style={{
                  width:
                    "100%",
                }}
                placeholder="Fecha inicial"
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

            </Form.Item>


            {/* FECHA FINAL */}

            <Form.Item
              name="fechaFinal"
              label="Fecha final"
            >

              <DatePicker
                allowClear
                size="large"
                style={{
                  width:
                    "100%",
                }}
                placeholder="Fecha final"
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

            </Form.Item>


            {/* PROYECTO */}

            <Form.Item
              label="Proyecto"
              name="terreno_id"
            >

              <Select
                showSearch
                allowClear
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


            {/* STATUS */}

            <Form.Item
              label="Status de pago"
              name="statuspago_id"
            >

              <Select
                size="large"
                placeholder="Todos"
                onChange={
                  function (
                    value
                  ) {

                    setStatusPagoId(
                      Number(
                        value ||
                        0
                      )
                    );

                  }
                }
              >

                {STATUS_PAGO.map(
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


            {/* SISTEMA DE PAGO */}

            <Form.Item
              label="Sistema de pago"
              name="sistemapago_id"
            >

              <Select
                showSearch
                allowClear
                size="large"
                placeholder="Todos"
                optionFilterProp="label"
                onChange={
                  function (
                    value
                  ) {

                    setSistemaPagoSelected(
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

            </Form.Item>


            {/* CUENTA BANCARIA */}

            {mostrarCuentaBancaria && (

              <Form.Item
                label="Cuenta bancaria"
                name="cuentas_id"
              >

                <Select
                  showSearch
                  allowClear
                  size="large"
                  placeholder="Todas las cuentas"
                  optionFilterProp="label"
                  onChange={
                    function (
                      value
                    ) {

                      setCuentaBancariaSelected(
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
                    label="Todas"
                  >

                    Todas

                  </Option>


                  {cuentasBancarias.map(
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
                            item.alias_nombre
                          }
                        >

                          {
                            item.alias_nombre
                          }

                        </Option>

                      );

                    }
                  )}

                </Select>

              </Form.Item>

            )}


            {/* BOTÓN */}

            <div className="report-cobranza-filter-action">

              <Button
                type="primary"
                size="large"
                className="report-cobranza-search-button"
                icon={
                  <BiSearch />
                }
                onClick={
                  onSearch
                }
              >

                Buscar reporte

              </Button>

            </div>

          </div>

        </Form>

      </section>


      {/* =====================================================
          KPI
          ===================================================== */}

      <div className="report-cobranza-kpis">

        {kpis.map(
  function (item, index) {

    return (
      <div
        key={
          item.label +
          "-" +
          index
        }
        className={
          [
            "report-cobranza-kpi",

            item.featured
              ? "report-cobranza-kpi--featured"
              : "",

            item.danger
              ? "report-cobranza-kpi--danger"
              : "",
          ]
            .filter(Boolean)
            .join(" ")
        }
      >

        <div className="report-cobranza-kpi__top">

          <span className="report-cobranza-kpi__label">
            {item.label}
          </span>

        </div>

        <strong className="report-cobranza-kpi__value">
          {item.value}
        </strong>

      </div>
    );
  }
)}

      </div>


      {/* =====================================================
          COBRANZA
          ===================================================== */}

      <section className="report-cobranza-table-card">

        <div className="report-cobranza-table-card__header">

          <div>

            <span>

              PAGOS

            </span>


            <h3>

              Cobranza

            </h3>


            <p>

              Movimientos de pago registrados
              según los filtros seleccionados.

            </p>

          </div>


          <div className="report-cobranza-table-card__summary">

            <small>

              Total recibido

            </small>


            <strong>

              {
                moneda(
                  totalPagado
                )
              }

            </strong>

          </div>

        </div>


        <Table
          rowKey={
            function (
              item,
              index
            ) {

              return (
                item.id ||
                item.folio ||
                index
              );

            }
          }
          columns={
            columnasCobranza
          }
          dataSource={
            data
          }
          size="small"
          scroll={{
            x:
              1150,
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
                  " pagos"
                );

              },
          }}
          locale={{
            emptyText:
              busquedaRealizada
                ? "No hay pagos para los filtros seleccionados."
                : "Realiza una búsqueda para consultar la cobranza.",
          }}
          className="report-cobranza-table"
        />

      </section>


      {/* =====================================================
          ANTICIPOS
          ===================================================== */}

      <section className="report-cobranza-table-card">

        <div className="report-cobranza-table-card__header">

          <div>

            <span>

              SOLICITUDES

            </span>


            <h3>

              Anticipos

            </h3>


            <p>

              Anticipos registrados en las solicitudes
              que forman parte del reporte.

            </p>

          </div>


          <div className="report-cobranza-table-card__summary">

            <small>

              Total anticipos

            </small>


            <strong>

              {
                moneda(
                  totalAnticipo
                )
              }

            </strong>

          </div>

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
                  String(
                    item.no_lote ||
                    ""
                  ) +
                  "-" +
                  index
                )
              );

            }
          }
          columns={
            columnasAnticipos
          }
          dataSource={
            dataSolicitudes
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
              busquedaRealizada
                ? "No hay anticipos para los filtros seleccionados."
                : "Realiza una búsqueda para consultar anticipos.",
          }}
          className="report-cobranza-table"
        />

      </section>

    </div>

  );

}


/* ============================================================
   ESTADO SOLICITUD
   ============================================================ */

function EstadoSolicitud({
  color,
}) {

  const estado =
    obtenerEstadoSolicitud(
      color
    );


  return (

    <span className="report-cobranza-status">

      <span
        className="report-cobranza-status__dot"
        style={{
          backgroundColor:
            estado.color,
        }}
      />


      {
        estado.nombre
      }

    </span>

  );

}


/* ============================================================
   OBTENER ESTADO POR COLOR
   ============================================================ */

function obtenerEstadoSolicitud(
  color
) {

  const colorNormalizado =
    String(
      color ||
      ""
    ).toLowerCase();


  const estado =
    ESTADOS_SOLICITUD.find(
      function (
        item
      ) {

        return (
          String(
            item.color
          ).toLowerCase() ===
          colorNormalizado
        );

      }
    );


  if (
    estado
  ) {

    return estado;

  }


  return {
    color:
      color ||
      "#94a3b8",

    nombre:
      "Sin definir",
  };

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