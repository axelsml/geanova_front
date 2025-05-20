"use client";
import { useState } from "react";
import { Col, Row, Modal, Button } from "antd";
import { FaFilePdf } from "react-icons/fa";
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
import ventasService from "@/services/ventasService";

export default function TablaInformeCortes({ informe }) {
  const [show, setShow] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [resumen, setResumen] = useState(null);

  const onError = (e) => {
    setLoading(false);
    console.log(e);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function handleResumen(
    fecha,
    terreno_id,
    sistema_pago_id,
    financiamiento_id
  ) {
    let params = {
      fecha: fecha,
      terreno_id: terreno_id,
      sistema_pago_id: sistema_pago_id,
      financiamiento_id: financiamiento_id,
    };
    pagosService.getResumenClientes(params, onResumen, onError);
  }

  async function onResumen(data) {
    if (data.success) {
      setResumen(data.response);
    } else {
      Swal.fire({
        title: "No se encontraron registros de pagos",
        icon: "warning",
        text: data.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
      setResumen(null);
    }
  }

  function borrarAmortizacion(id) {
    let params = {
      solicitud_id: id,
      nueva_cantidad_pagos: 0,
    };
    ventasService.borrarAmortizacion(
      params,
      (data) => onAmortizacionBorrada(data, id),
      onError
    );
  }

  async function onAmortizacionBorrada(data, id) {
    if (data.success) {
      window.open(`https://api.santamariadelaluz.com/iUsuarios/${id}.pdf`);
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No Se Pudo Borrar Amortizacion",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
    }
  }

  return (
    <Col style={{ margin: "16px" }}>
      {informe && (
        <>
          <div style={{ textAlign: "center" }}>
            <Col>
              <span style={{ fontFamily: "sans-serif", fontWeight: "bold" }}>
                Importe Total Acumulado: $
              </span>
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  color: "rgb(67, 141, 204)",
                }}
              >
                {" "}
                {formatPrecio(informe.resumen_por_mes.importes_acumulados)}
              </span>
            </Col>
            <Col>
              <span style={{ fontFamily: "sans-serif", fontWeight: "bold" }}>
                Recibos Totales Acumulados:{" "}
              </span>
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  color: "rgb(67, 141, 204)",
                }}
              >
                {informe.resumen_por_mes.recibos_acumulados}
              </span>
            </Col>
          </div>
          <div className="tabla">
            <TableContainer component={Paper} sx={{ width: "100%" }}>
              <Table size="small">
                <TableHead>
                  <TableRow style={{ backgroundColor: "rgb(67, 141, 204)" }}>
                    <TableCell colSpan={3}>
                      <p
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          color: "white",
                          fontSize: "16px",
                          textAlign: "center",
                        }}
                      >
                        Fecha Inicial:{" "}
                        {informe.resumen_por_mes.rango_de_fechas.fecha_inicial}
                      </p>
                    </TableCell>
                    <TableCell colSpan={3}>
                      <p
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          color: "white",
                          fontSize: "16px",
                          textAlign: "center",
                        }}
                      >
                        Fecha Final:{" "}
                        {informe.resumen_por_mes.rango_de_fechas.fecha_final}
                      </p>
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ backgroundColor: "rgb(67, 141, 204)" }}>
                    <TableCell>
                      <p
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          color: "white",
                          fontSize: "16px",
                        }}
                      >
                        Día
                      </p>
                    </TableCell>
                    <TableCell>
                      <p
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          color: "white",
                          fontSize: "16px",
                        }}
                      >
                        No.
                      </p>
                    </TableCell>
                    <TableCell>
                      <p
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          color: "white",
                          fontSize: "16px",
                        }}
                      >
                        Importe
                      </p>
                    </TableCell>
                    <TableCell>
                      <p
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          color: "white",
                          fontSize: "16px",
                        }}
                      >
                        No. Recibos
                      </p>
                    </TableCell>
                    <TableCell>
                      <p
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          color: "white",
                          fontSize: "16px",
                        }}
                      >
                        Importe Acumulado
                      </p>
                    </TableCell>
                    <TableCell>
                      <p
                        style={{
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                          color: "white",
                          fontSize: "16px",
                        }}
                      >
                        Recibos Acumulados
                      </p>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {informe.dias.map((item, index) => (
                    <TableRow
                      key={index}
                      style={{
                        backgroundColor: item.fondo_color,
                        color: item.texto_color,
                        fontWeight: item.font_weight,
                      }}
                    >
                      <TableCell
                        style={{
                          backgroundColor: item.fondo_color,
                          color: item.texto_color,
                          fontWeight: item.font_weight,
                        }}
                      >
                        {item.nombre_dia}
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: item.fondo_color,
                          color: item.texto_color,
                          fontWeight: item.font_weight,
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: item.fondo_color,
                          color: item.texto_color,
                          fontWeight: item.font_weight,
                        }}
                      >
                        {`$${formatPrecio(item.importe)}`}
                      </TableCell>
                      <TableCell
                        style={{
                          color: "#000cff",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setShow(!show);
                          handleResumen(
                            item.fecha,
                            item.terreno_id,
                            item.sistema_pago_id,
                            item.financiamiento_id
                          );
                        }}
                      >
                        {item.recibos}
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: item.fondo_color,
                          color: item.texto_color,
                          fontWeight: item.font_weight,
                        }}
                      >
                        {`$${formatPrecio(item.importe_acumulado)}`}
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: item.fondo_color,
                          color: item.texto_color,
                          fontWeight: item.font_weight,
                        }}
                      >
                        {item.recibo_acumulado}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
      {show && resumen && (
        <div>
          <Modal
            visible={show}
            width={1000}
            footer={false}
            onCancel={() => {
              setShow(!show);
            }}
          >
            <Row justify={"center"} style={{ margin: "16px" }}>
              <Col>
                <span
                  style={{
                    color: "rgb(67, 141, 204)",
                    fontWeight: "bold",
                    fontSize: "24px",
                  }}
                >
                  CLIENTES RESUMEN
                </span>
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
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        No.
                      </TableCell>
                      <TableCell
                        style={{
                          color: "white",
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        Nombre del solicitante
                      </TableCell>
                      <TableCell
                        style={{
                          color: "white",
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        Folio
                      </TableCell>
                      <TableCell
                        style={{
                          color: "white",
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        Monto de pago
                      </TableCell>
                      <TableCell
                        style={{
                          color: "white",
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        Saldo pendiente
                      </TableCell>
                      <TableCell
                        style={{
                          color: "white",
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        Sistema de Pago
                      </TableCell>
                      <TableCell
                        style={{
                          color: "white",
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        Financiamiento
                      </TableCell>
                      <TableCell
                        style={{
                          color: "white",
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        Estado de cuenta
                      </TableCell>
                      <TableCell
                        style={{
                          color: "white",
                          fontFamily: "sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        Amortizacion
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resumen
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.nombre_cliente}</TableCell>
                          <TableCell>{item.pago_folio}</TableCell>
                          <TableCell>{`$${formatPrecio(
                            item.monto_pagado
                          )}`}</TableCell>
                          <TableCell>{`$${formatPrecio(
                            item.saldo_pendiente
                          )}`}</TableCell>
                          <TableCell>{item.sistema_pago}</TableCell>
                          <TableCell>
                            {item.financiamiento
                              ? item.financiamiento
                              : "Sin financiamiento"}
                          </TableCell>
                          <TableCell
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              window.open(
                                `https://api.santamariadelaluz.com/getClienteByLote/${item.terreno_id}/${item.lote_id}.pdf`
                              );
                            }}
                          >
                            <FaFilePdf
                              style={{ margin: "0 auto", fontSize: "24px" }}
                            />
                          </TableCell>
                          <TableCell
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              borrarAmortizacion(item.solicitud_id);
                            }}
                          >
                            <FaFilePdf
                              style={{ margin: "0 auto", fontSize: "24px" }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        count={resumen.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        TextRowsPerPage="Clientes por Página"
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Row>
            <Row justify={"center"} style={{ marginTop: "16px" }}>
              <Button
                size="large"
                onClick={() => {
                  setShow(!show);
                }}
              >
                Cerrar
              </Button>
            </Row>
          </Modal>
        </div>
      )}
    </Col>
  );
}
