"use client";

import {
  Button,
  DatePicker,
  Col,
  Row,
  Select,
  Modal,
  Typography,
} from "antd";

const { Text } = Typography;

import { useEffect, useState } from "react";

import Loader80 from "@/components/Loader80";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableFooter,
} from "@mui/material";

import {
  formatPrecio,
  formatDate,
} from "@/helpers/formatters";

import Swal from "sweetalert2";

import pagosService from "@/services/pagosService";
import terrenosService from "@/services/terrenosService";

export default function ReporteIngresos() {
  const { Option } = Select;

  // ============================================================
  // ESTADOS
  // ============================================================

  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);

  const [proyectos, setProyectos] = useState([]);

  const [fechaInicial, setFechaInicial] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);

  const [terrenoId, setTerrenoId] = useState(0);

  const [response, setResponse] = useState(null);

  const [detalles, setDetalles] = useState([]);

  const [detalleTitulo, setDetalleTitulo] = useState("");

  // cobranza | anticipo
  const [tipoDetalle, setTipoDetalle] = useState(null);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ============================================================
  // PAGINACIÓN
  // ============================================================

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(
      parseInt(event.target.value, 10)
    );

    setPage(0);
  };

  // ============================================================
  // CARGAR TERRENOS
  // ============================================================

  useEffect(() => {
    terrenosService.getTerrenosAll(onTerreno);
  }, []);

  async function onTerreno(terrenos) {
    setProyectos(
      Array.isArray(terrenos)
        ? terrenos
        : []
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  const onError = (error) => {
    setLoading(false);

    console.error(
      "Error al obtener reporte de ingresos:",
      error
    );

    Swal.fire({
      title: "Error",
      icon: "error",
      text: "No fue posible generar el reporte de ingresos.",
      confirmButtonColor: "#4096ff",
      confirmButtonText: "Aceptar",
    });
  };

  // ============================================================
  // BUSCAR
  // ============================================================

  function handleSearchButton() {
    const params = {
      fecha_inicial: fechaInicial,
      fecha_final: fechaFinal,

      terreno_id:
        terrenoId !== null &&
        terrenoId !== undefined
          ? terrenoId
          : 0,
    };

    setLoading(true);

    setShow(false);

    setDetalles([]);

    setTipoDetalle(null);

    setDetalleTitulo("");

    setPage(0);

    pagosService.getReporteIngresos(
      params,
      onReporte,
      onError
    );
  }

  // ============================================================
  // RESPUESTA
  // ============================================================

  async function onReporte(data) {
    setLoading(false);

    if (data && data.success) {
      setResponse(data);

      setDetalles([]);

      setShow(false);

      setTipoDetalle(null);

      setDetalleTitulo("");

      setPage(0);

      return;
    }

    Swal.fire({
      title: "No se encontraron registros",
      icon: "warning",

      text:
        data && data.message
          ? data.message
          : "No se encontraron registros.",

      confirmButtonColor: "#4096ff",

      confirmButtonText: "Aceptar",
    });

    setResponse(null);
  }

  // ============================================================
  // NORMALIZAR SISTEMA DE PAGO
  // ============================================================

  function normalizarSistemaPagoId(id) {
    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {
      return null;
    }

    return Number(id);
  }

  // ============================================================
  // ABRIR DETALLES COBRANZA
  // ============================================================

  function abrirDetallesCobranza(
    reporte,
    sistema
  ) {
    if (!reporte || !sistema) {
      return;
    }

    const detalleReporte =
      Array.isArray(reporte.detalle)
        ? reporte.detalle
        : [];

    const sistemaPagoId =
      normalizarSistemaPagoId(
        sistema.sistema_pago_id
      );

    const detallesFiltrados =
      detalleReporte.filter(function (item) {
        return (
          normalizarSistemaPagoId(
            item.sistema_pago_id
          ) === sistemaPagoId
        );
      });

    setDetalles(detallesFiltrados);

    setDetalleTitulo(
      "Cobranza - " +
        (
          sistema.sistema_pago ||
          "Sin especificar"
        )
    );

    setTipoDetalle("cobranza");

    setPage(0);

    setShow(true);
  }

  // ============================================================
  // ABRIR DETALLES ANTICIPO
  // ============================================================

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
      Array.isArray(reporte.detalle)
        ? reporte.detalle
        : [];

    setDetalles(detallesReporte);

    setDetalleTitulo("Anticipos");

    setTipoDetalle("anticipo");

    setPage(0);

    setShow(true);
  }

  // ============================================================
  // CERRAR DETALLES
  // ============================================================

  function cerrarDetalles() {
    setShow(false);

    setDetalles([]);

    setDetalleTitulo("");

    setTipoDetalle(null);

    setPage(0);
  }

  // ============================================================
  // COBRANZA:
  // RENDER DINÁMICO DE SISTEMAS DE PAGO
  // ============================================================

  function renderSistemasPagoCobranza(
    reporte
  ) {
    const sistemas =
      reporte &&
      Array.isArray(
        reporte.sistemas_pago
      )
        ? reporte.sistemas_pago
        : [];

    if (sistemas.length === 0) {
      return (
        <TableRow>
          <TableCell
            style={{
              color: "#888",
            }}
          >
            Sin movimientos
          </TableCell>

          <TableCell
            style={{
              color: "blue",
              fontWeight: "bold",
            }}
          >
            0
          </TableCell>

          <TableCell>
            {`$ ${formatPrecio(0)}`}
          </TableCell>
        </TableRow>
      );
    }

    return sistemas.map(
      (sistema, index) => {
        const tienePagos =
          Number(sistema.num_pagos || 0) > 0;

        return (
          <TableRow
            key={
              "cobranza-" +
              (
                sistema.sistema_pago_id !==
                  null &&
                sistema.sistema_pago_id !==
                  undefined
                  ? sistema.sistema_pago_id
                  : "sin-especificar"
              ) +
              "-" +
              index
            }
            style={{
              cursor: tienePagos
                ? "pointer"
                : "default",
            }}
            onClick={() => {
              if (tienePagos) {
                abrirDetallesCobranza(
                  reporte,
                  sistema
                );
              }
            }}
          >
            <TableCell>
              {sistema.sistema_pago ||
                "Sin especificar"}
            </TableCell>

            <TableCell
              style={{
                color: tienePagos
                  ? "blue"
                  : "inherit",

                fontWeight: "bold",
              }}
            >
              {sistema.num_pagos || 0}
            </TableCell>

            <TableCell>
              {`$ ${formatPrecio(
                sistema.importe || 0
              )}`}
            </TableCell>
          </TableRow>
        );
      }
    );
  }

  // ============================================================
  // FECHA DEL DETALLE
  // ============================================================

  function obtenerFechaDetalle(item) {
    if (!item) {
      return "-";
    }

    if (item.fecha_operacion) {
      return item.fecha_operacion;
    }

    if (item.fecha) {
      return item.fecha;
    }

    return "-";
  }

  // ============================================================
  // FOLIO
  // ============================================================

  function obtenerFolioDetalle(item) {
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

  // ============================================================
  // IMPORTE
  // ============================================================

  function obtenerImporteDetalle(item) {
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

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* ====================================================== */}
      {/* LOADER */}
      {/* ====================================================== */}

      {loading && <Loader80 />}

      {/* ====================================================== */}
      {/* TÍTULO */}
      {/* ====================================================== */}

      <Row
        style={{
          margin: "16px",
        }}
        justify="center"
        className="m-auto"
      >
        <Col className="titulo_pantallas">
          <b>Reporte de Ingresos</b>
        </Col>
      </Row>

      {/* ====================================================== */}
      {/* FILTROS */}
      {/* ====================================================== */}

      <div>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={16}
          style={{
            margin: "0 auto",
          }}
        >
          <Row
            className="rep-ing-row__header"
            style={{
              justifyContent:
                "space-evenly",
            }}
          >
            {/* FECHA INICIAL */}

            <Col className="rep-ing-fechas__datepicker--inicial">
              <DatePicker
                style={{
                  width: "100%",
                  margin: "12px",
                }}
                placeholder="Fecha Inicial"
                onChange={(e) => {
                  setFechaInicial(
                    e
                      ? formatDate(e)
                      : null
                  );
                }}
              />
            </Col>

            {/* FECHA FINAL */}

            <Col className="rep-ing-fechas__datepicker--inicial">
              <DatePicker
                style={{
                  width: "100%",
                  margin: "12px",
                }}
                placeholder="Fecha Final"
                onChange={(e) => {
                  setFechaFinal(
                    e
                      ? formatDate(e)
                      : null
                  );
                }}
              />
            </Col>

            {/* PROYECTO */}

            <Col>
              <Select
                showSearch
                style={{
                  width: "100%",
                  minWidth: "160px",
                  margin: "12px",
                }}
                placeholder="Seleccione un proyecto"
                optionLabelProp="label"
                defaultValue={0}
                onChange={(value) => {
                  setTerrenoId(value);
                }}
              >
                <Option
                  value={0}
                  label="Todos"
                >
                  Todos
                </Option>

                {proyectos.map(
                  (proyecto) => (
                    <Option
                      key={proyecto.id}
                      value={proyecto.id}
                      label={
                        proyecto.nombre
                      }
                    >
                      {proyecto.nombre}
                    </Option>
                  )
                )}
              </Select>
            </Col>
          </Row>
        </Col>

        {/* BUSCAR */}

        <Row>
          <Button
            className="boton"
            style={{
              margin: "16px auto",
            }}
            onClick={
              handleSearchButton
            }
          >
            BUSCAR
          </Button>
        </Row>
      </div>

      {/* ====================================================== */}
      {/* REPORTE */}
      {/* ====================================================== */}

      {response && (
        <div
          className="tabla"
          style={{
            margin: "0 auto",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <TableContainer
            component={Paper}
          >
            <Table size="small">

              {/* ================================================= */}
              {/* COBRANZA */}
              {/* ================================================= */}

              <TableHead>
                <TableRow
                  style={{
                    backgroundColor:
                      "rgb(67, 141, 204)",
                  }}
                >
                  <TableCell
                    colSpan={3}
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          "#FFFFFF",
                        fontWeight:
                          "bold",
                      }}
                    >
                      COBRANZA
                    </Text>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    style={{
                      fontWeight:
                        "bold",

                      color:
                        "rgb(67, 141, 204)",
                    }}
                  >
                    Tipo
                  </TableCell>

                  <TableCell
                    style={{
                      fontWeight:
                        "bold",

                      color:
                        "rgb(67, 141, 204)",
                    }}
                  >
                    Número
                  </TableCell>

                  <TableCell
                    style={{
                      fontWeight:
                        "bold",

                      color:
                        "rgb(67, 141, 204)",
                    }}
                  >
                    Importe
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {/* ============================================= */}
                {/* SISTEMAS DE PAGO DINÁMICOS */}
                {/* ============================================= */}

                {renderSistemasPagoCobranza(
                  response.reporte_ingresos_cobranza
                )}

                {/* TOTAL COBRANZA */}

                <TableRow
                  style={{
                    backgroundColor:
                      "#f5f5f5",
                  }}
                >
                  <TableCell
                    style={{
                      fontWeight:
                        "bold",
                    }}
                  >
                    Total
                  </TableCell>

                  <TableCell
                    style={{
                      fontWeight:
                        "bold",
                    }}
                  >
                    {response
                      .reporte_ingresos_cobranza
                      ?.num_pagos_total ||
                      0}
                  </TableCell>

                  <TableCell
                    style={{
                      fontWeight:
                        "bold",
                    }}
                  >
                    {`$ ${formatPrecio(
                      response
                        .reporte_ingresos_cobranza
                        ?.importes_total ||
                        0
                    )}`}
                  </TableCell>
                </TableRow>
              </TableBody>

              {/* ================================================= */}
              {/* ANTICIPO */}
              {/* ================================================= */}

              <TableHead>
                <TableRow
                  style={{
                    backgroundColor:
                      "rgb(67, 141, 204)",
                  }}
                >
                  <TableCell
                    colSpan={3}
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          "#FFFFFF",
                        fontWeight:
                          "bold",
                      }}
                    >
                      ANTICIPO
                    </Text>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    style={{
                      fontWeight:
                        "bold",

                      color:
                        "rgb(67, 141, 204)",
                    }}
                  >
                    Tipo
                  </TableCell>

                  <TableCell
                    style={{
                      fontWeight:
                        "bold",

                      color:
                        "rgb(67, 141, 204)",
                    }}
                  >
                    Número
                  </TableCell>

                  <TableCell
                    style={{
                      fontWeight:
                        "bold",

                      color:
                        "rgb(67, 141, 204)",
                    }}
                  >
                    Importe
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {/* ============================================= */}
                {/* ANTICIPO NO TIENE SISTEMA DE PAGO */}
                {/* ============================================= */}

                <TableRow
                  style={{
                    cursor:
                      Number(
                        response
                          .reporte_ingresos_anticipos
                          ?.num_pagos_total ||
                          0
                      ) > 0
                        ? "pointer"
                        : "default",
                  }}
                  onClick={() => {
                    if (
                      Number(
                        response
                          .reporte_ingresos_anticipos
                          ?.num_pagos_total ||
                          0
                      ) > 0
                    ) {
                      abrirDetallesAnticipos();
                    }
                  }}
                >
                  <TableCell>
                    Anticipos
                  </TableCell>

                  <TableCell
                    style={{
                      color:
                        Number(
                          response
                            .reporte_ingresos_anticipos
                            ?.num_pagos_total ||
                            0
                        ) > 0
                          ? "blue"
                          : "inherit",

                      fontWeight:
                        "bold",
                    }}
                  >
                    {response
                      .reporte_ingresos_anticipos
                      ?.num_pagos_total ||
                      0}
                  </TableCell>

                  <TableCell>
                    {`$ ${formatPrecio(
                      response
                        .reporte_ingresos_anticipos
                        ?.importes_total ||
                        0
                    )}`}
                  </TableCell>
                </TableRow>
              </TableBody>

              {/* ================================================= */}
              {/* RESUMEN TOTAL */}
              {/* ================================================= */}

              <TableHead>
                <TableRow
                  style={{
                    backgroundColor:
                      "#f5f5f5",
                  }}
                >
                  <TableCell
                    style={{
                      fontWeight:
                        "bold",

                      fontSize:
                        "15px",
                    }}
                  >
                    <Text strong>
                      RESUMEN TOTAL
                    </Text>
                  </TableCell>

                  <TableCell
                    style={{
                      fontWeight:
                        "bold",

                      fontSize:
                        "15px",
                    }}
                  >
                    {response.totales
                      ?.num_pagos_total ||
                      0}
                  </TableCell>

                  <TableCell
                    style={{
                      fontWeight:
                        "bold",

                      fontSize:
                        "15px",
                    }}
                  >
                    {`$ ${formatPrecio(
                      response.totales
                        ?.importes_total ||
                        0
                    )}`}
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL DETALLES */}
      {/* ======================================================== */}

      <Modal
        visible={show}
        footer={null}
        width={850}
        onCancel={cerrarDetalles}
      >
        {/* TÍTULO */}

        <Row justify="center">
          <Col>
            <Text
              style={{
                color:
                  "rgb(67, 141, 204)",

                fontWeight: "bold",

                fontSize: "22px",
              }}
            >
              {detalleTitulo ||
                "DETALLES"}
            </Text>
          </Col>
        </Row>

        {/* TABLA */}

        <Row
          style={{
            marginTop: "20px",
          }}
        >
          <TableContainer
            component={Paper}
          >
            <Table size="small">

              {/* CABECERA */}

              <TableHead>
                <TableRow
                  style={{
                    backgroundColor:
                      "rgb(67, 141, 204)",
                  }}
                >
                  {/* NÚMERO */}

                  <TableCell
                    style={{
                      color: "white",
                      fontWeight:
                        "bold",
                    }}
                  >
                    No.
                  </TableCell>

                  {/* FOLIO */}

                  <TableCell
                    style={{
                      color: "white",
                      fontWeight:
                        "bold",
                    }}
                  >
                    Folio
                  </TableCell>

                  {/* FECHA */}

                  <TableCell
                    style={{
                      color: "white",
                      fontWeight:
                        "bold",
                    }}
                  >
                    Fecha
                  </TableCell>

                  {/* SISTEMA DE PAGO:
                      SOLAMENTE COBRANZA */}

                  {tipoDetalle ===
                    "cobranza" && (
                    <TableCell
                      style={{
                        color:
                          "white",

                        fontWeight:
                          "bold",
                      }}
                    >
                      Sistema de pago
                    </TableCell>
                  )}

                  {/* IMPORTE */}

                  <TableCell
                    style={{
                      color: "white",
                      fontWeight:
                        "bold",
                    }}
                  >
                    Importe
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* DETALLES */}

              <TableBody>
                {detalles.length ===
                0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={
                        tipoDetalle ===
                        "cobranza"
                          ? 5
                          : 4
                      }
                      style={{
                        textAlign:
                          "center",

                        padding:
                          "25px",
                      }}
                    >
                      No hay detalles
                      disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  detalles
                    .slice(
                      page *
                        rowsPerPage,

                      page *
                        rowsPerPage +
                        rowsPerPage
                    )
                    .map(
                      (
                        item,
                        index
                      ) => (
                        <TableRow
                          key={
                            (
                              item.pago_id ||
                              item.solicitud_id ||
                              "detalle"
                            ) +
                            "-" +
                            index
                          }
                        >
                          {/* NO. */}

                          <TableCell>
                            {page *
                              rowsPerPage +
                              index +
                              1}
                          </TableCell>

                          {/* FOLIO */}

                          <TableCell>
                            {obtenerFolioDetalle(
                              item
                            )}
                          </TableCell>

                          {/* FECHA */}

                          <TableCell>
                            {obtenerFechaDetalle(
                              item
                            )}
                          </TableCell>

                          {/* SISTEMA DE PAGO
                              SOLO COBRANZA */}

                          {tipoDetalle ===
                            "cobranza" && (
                            <TableCell>
                              {item.sistema_pago ||
                                "Sin especificar"}
                            </TableCell>
                          )}

                          {/* IMPORTE */}

                          <TableCell>
                            {`$ ${formatPrecio(
                              obtenerImporteDetalle(
                                item
                              )
                            )}`}
                          </TableCell>
                        </TableRow>
                      )
                    )
                )}
              </TableBody>

              {/* PAGINACIÓN */}

              {detalles.length >
                0 && (
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                      ]}
                      count={
                        detalles.length
                      }
                      rowsPerPage={
                        rowsPerPage
                      }
                      page={page}
                      onPageChange={
                        handleChangePage
                      }
                      onRowsPerPageChange={
                        handleChangeRowsPerPage
                      }
                      labelRowsPerPage="Registros por página"
                    />
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </TableContainer>
        </Row>
      </Modal>
    </>
  );
}