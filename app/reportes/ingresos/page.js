"use client";

import { Button, DatePicker, Col, Row, Select, Modal, Typography } from "antd";
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
import { formatPrecio } from "@/helpers/formatters";
import Swal from "sweetalert2";
import pagosService from "@/services/pagosService";
import { formatDate } from "@/helpers/formatters";
import terrenosService from "@/services/terrenosService";

export default function ReporteIngresos() {
  const [loading, setLoading] = useState(false);

  const { Option } = Select;

  const [show, setShow] = useState(false);

  const [proyectos, setProyectos] = useState([]);

  const [fechaInicial, setFechaInicial] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);
  const [terrenoId, setTerrenoId] = useState(null);

  const [response, setResponse] = useState(null);
  const [detalles, setDetalles] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onError = (e) => {
    setLoading(false);
  };

  useEffect(() => {
    terrenosService.getTerrenosAll(onTerreno);
  }, []);

  async function onTerreno(terrenos) {
    setProyectos(terrenos);
  }

  function handleSearchButton() {
    var params = {
      fecha_inicial: fechaInicial,
      fecha_final: fechaFinal,
      terreno_id: terrenoId,
    };
    setLoading(true);

    pagosService.getReporteIngresos(params, onReporte, onError);
  }

  async function onReporte(data) {
    setLoading(false);
    if (data.success) {
      setResponse(data);
    } else {
      Swal.fire({
        title: "No se encontraron registros",
        icon: "warning",
        text: data.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
      setResponse(null);
    }
  }

  return (
    <>
      {loading && (
        <>
          <Loader80 />
        </>
      )}
      <div>
        <Row style={{ margin: "16px" }} justify={"center"} className="m-auto">
          <Col className="titulo_pantallas">
            <b>Reporte de Ingresos</b>
          </Col>
        </Row>
      </div>
      <div>
        <Col xs={24} sm={24} md={24} lg={16} style={{ margin: "0 auto" }}>
          <Row
            className="rep-ing-row__header"
            style={{ justifyContent: "space-evenly" }}
          >
            <Col className="rep-ing-fechas__datepicker--inicial">
              <DatePicker
                style={{ width: "100%", margin: "12px" }}
                placeholder="Fecha Inicial"
                onChange={(e) => {
                  setFechaInicial(formatDate(e));
                }}
              />
            </Col>
            <Col className="rep-ing-fechas__datepicker--inicial">
              <DatePicker
                style={{ width: "100%", margin: "12px" }}
                placeholder="Fecha Final"
                onChange={(e) => {
                  setFechaFinal(formatDate(e));
                }}
              />
            </Col>
            <Col>
              <Select
                showSearch
                style={{ width: "100%", margin: "12px" }}
                placeholder="Seleccione un proyecto"
                optionLabelProp="label"
                onChange={(value) => {
                  setTerrenoId(value);
                }}
              >
                {" "}
                <Option value={0} label="Todos">
                  Todos
                </Option>
                {proyectos?.map((proyecto) => (
                  <Option
                    key={proyecto.nombre}
                    value={proyecto.id}
                    label={proyecto.nombre}
                  >
                    {proyecto?.nombre}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Col>
        <Row>
          <Button
            className="boton"
            style={{ margin: "16px auto" }}
            onClick={handleSearchButton}
          >
            BUSCAR
          </Button>
        </Row>
      </div>
      {/* TABLA */}
      {response && (
        <div className="tabla" style={{ margin: "0 auto", width: "500px" }}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow style={{ backgroundColor: "rgb(67, 141, 204)" }}>
                  <TableCell colSpan={3} style={{ textAlign: "center" }}>
                    <Text style={{ color: "#FFFFFF" }}>COBRANZA</Text>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ fontWeight: "bold", color: "rgb(67, 141, 204)" }}
                  >
                    Tipo
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", color: "rgb(67, 141, 204)" }}
                  >
                    Número
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", color: "rgb(67, 141, 204)" }}
                  >
                    Importe
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setDetalles(
                      response.reporte_ingresos_cobranza.efectivo
                        .pagos_en_efectivo_detalles
                    );
                    setShow(!show);
                  }}
                >
                  <TableCell>Efectivo</TableCell>
                  <TableCell style={{ color: "blue", fontWeight: "bold" }}>
                    {response.reporte_ingresos_cobranza.efectivo.numero}
                  </TableCell>
                  <TableCell>
                    {`$ ${formatPrecio(
                      response.reporte_ingresos_cobranza.efectivo.importes
                    )}`}
                  </TableCell>
                </TableRow>
                <TableRow
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setDetalles(
                      response.reporte_ingresos_cobranza.transferencia
                        .pagos_en_transferencia_detalles
                    );
                    setShow(!show);
                  }}
                >
                  <TableCell>Transferencia</TableCell>
                  <TableCell style={{ color: "blue", fontWeight: "bold" }}>
                    {response.reporte_ingresos_cobranza.transferencia.numero}
                  </TableCell>
                  <TableCell>
                    {`$ ${formatPrecio(
                      response.reporte_ingresos_cobranza.transferencia.importes
                    )}`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell>
                    {response.reporte_ingresos_cobranza.num_pagos_total}
                  </TableCell>
                  <TableCell>
                    {`$ ${formatPrecio(
                      response.reporte_ingresos_cobranza.importes_total
                    )}`}
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableHead>
                <TableRow style={{ backgroundColor: "rgb(67, 141, 204)" }}>
                  <TableCell colSpan={3} style={{ textAlign: "center" }}>
                    <Text style={{ color: "#FFFFFF" }}>ANTICIPO</Text>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ fontWeight: "bold", color: "rgb(67, 141, 204)" }}
                  >
                    Tipo
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", color: "rgb(67, 141, 204)" }}
                  >
                    Número
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", color: "rgb(67, 141, 204)" }}
                  >
                    Importe
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setDetalles(
                      response.reporte_ingresos_anticipos.efectivo
                        .pagos_en_efectivo_detalles
                    );
                    setShow(!show);
                  }}
                >
                  <TableCell>Efectivo</TableCell>
                  <TableCell style={{ color: "blue", fontWeight: "bold" }}>
                    {response.reporte_ingresos_anticipos.efectivo.numero}
                  </TableCell>
                  <TableCell>
                    {`$ ${formatPrecio(
                      response.reporte_ingresos_anticipos.efectivo.importes
                    )}`}
                  </TableCell>
                </TableRow>
                <TableRow
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setDetalles(
                      response.reporte_ingresos_anticipos.transferencia
                        .pagos_en_transferencia_detalles
                    );
                    setShow(!show);
                  }}
                >
                  <TableCell>Transferencia</TableCell>
                  <TableCell style={{ color: "blue", fontWeight: "bold" }}>
                    {response.reporte_ingresos_anticipos.transferencia.numero}
                  </TableCell>
                  <TableCell>
                    {`$ ${formatPrecio(
                      response.reporte_ingresos_anticipos.transferencia.importes
                    )}`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell>
                    {response.reporte_ingresos_anticipos.num_pagos_total}
                  </TableCell>
                  <TableCell>
                    {`$ ${formatPrecio(
                      response.reporte_ingresos_anticipos.importes_total
                    )}`}
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    <Text>RESUMEN TOTAL</Text>
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    {response.totales.num_pagos_total}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    {`$ ${formatPrecio(response.totales.importes_total)}`}
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </div>
      )}

      {show && (
        <div style={{ width: "500px" }}>
          <Modal
            visible={show}
            footer={false}
            onCancel={() => {
              setShow(!show);
              setDetalles(null);
              setPage(0);
            }}
          >
            <Row justify={"center"}>
              <Col>
                <Text
                  style={{
                    color: "rgb(67, 141, 204)",
                    fontWeight: "bold",
                    fontSize: "24px",
                  }}
                >
                  DETALLES
                </Text>
              </Col>
            </Row>
            <Row>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow style={{ backgroundColor: "rgb(67, 141, 204)" }}>
                      <TableCell
                        style={{
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        No.
                      </TableCell>
                      <TableCell
                        style={{
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Lote No.
                      </TableCell>
                      <TableCell
                        style={{
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Nombre del cliente
                      </TableCell>
                      <TableCell
                        style={{
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Monto pagado
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detalles
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.lote}</TableCell>
                          <TableCell>{item.cliente_nombre}</TableCell>
                          <TableCell>{`$ ${formatPrecio(
                            item.monto
                          )}`}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        count={detalles.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Clientes por Página"
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Row>
          </Modal>
        </div>
      )}
    </>
  );
}
