"use client";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "@/contexts/loading";
import { usuario_id } from "@/helpers/user";

import { formatPrecio, formatDate } from "@/helpers/formatters";
import { Button, Col, Row, Form, Select, Modal, DatePicker } from "antd";
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
import Swal from "sweetalert2";

import terrenosService from "@/services/terrenosService";
import pagosService from "@/services/pagosService";

export default function ReporteEstatusCobranza() {
  const { setIsLoading } = useContext(LoadingContext);
  const { Option } = Select;

  const [dataClientes, setDataClientes] = useState(null);
  const [dataSemanas, setDataSemanas] = useState(null);
  const [dataFechas, setDataFechas] = useState(null);

  const [fecha, setFecha] = useState(null);
  const [estatus, setEstatus] = useState(null);
  const [terrenos, setTerrenos] = useState(null);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const opcion = [{ index: 0, id: 0, nombre: "Todos" }];
  const opcionesEstatus = [
    { index: 0, id: 0, nombre: "Todas" },
    { index: 1, id: 1, nombre: "Cobranza" },
    { index: 2, id: 2, nombre: "Liquidadas" },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    terrenosService.getTerrenos(setTerrenos, Error);
  }, []);

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

  const onSearch = () => {
    setIsLoading(true);
    var params = {
      fecha: fecha,
      terreno_id: terrenoSelected,
      status_id: estatus,
    };
    pagosService.getReporteEstatusCobranza(params, onReporte, onError);
    debugger;
  };

  async function onReporte(data) {
    setIsLoading(false);
    if (data.encontrado) {
      setDataClientes(data.response);
      setDataSemanas(data.semanas);
      setDataFechas(data.fechas);
      debugger;
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No se pudo encontrar la información solicitada",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
      setDataClientes();
      setDataSemanas();
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Row justify={"center"}>
        <Col
          xs={24}
          sm={20}
          md={16}
          lg={12}
          xl={8}
          xxl={8}
          className="titulo_pantallas"
        >
          <b>REPORTE ESTATÚS COBRANZA</b>
        </Col>
      </Row>
      <Row
        style={{ width: "60%", margin: "0 auto", padding: "36px" }}
        justify={"space-around"}
      >
        <Col>
          <Form.Item
            label={"Proyecto"}
            name="terreno"
            style={{ width: "100%" }}
          >
            <Select
              showSearch
              placeholder="Seleccionar Proyecto"
              optionLabelProp="label"
              onChange={(value) => {
                setTerrenoSelected(value || 0);
              }}
            >
              {terrenos &&
                opcion.map((item, index) => (
                  <Option key={index} value={item.id} label={item.nombre}>
                    {item?.nombre}
                  </Option>
                ))}
              {terrenos?.map((item, index) => (
                <Option key={index} value={item.id} label={item.nombre}>
                  {item?.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label={"Estatús"} name="estatus" style={{ width: "100%" }}>
            <Select
              showSearch
              placeholder="Seleccionar Estatús"
              optionLabelProp="label"
              onChange={(value) => {
                setEstatus(value || 0);
              }}
            >
              {opcionesEstatus.map((item, index) => (
                <Option key={index} value={item.id} label={item.nombre}>
                  {item?.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="fecha" label="Fecha" style={{ width: "100%" }}>
            <DatePicker
              allowClear={false}
              onChange={(value) => {
                setFecha(formatDate(value));
              }}
              style={{ width: "100%" }}
              placeholder="Ingresar fecha"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ width: "10%", margin: "0 auto" }} justify={"center"}>
        <Button
          className="boton"
          onClick={() => {
            onSearch();
          }}
        >
          Buscar
        </Button>
      </Row>
      {dataSemanas != null && (
        <Row
          justify={"center"}
          className="w-2/4 m-auto tabla"
          style={{ marginTop: "24px" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableCell style={{ textAlign: "center" }}>
                  <b>Semanas</b>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <b>No. Clientes</b>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <b>Pagado</b>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <b>Sin Pagar</b>
                </TableCell>
              </TableHead>
              <TableBody>
                {dataSemanas.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ textAlign: "center" }}>
                      Semana {index + 1}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {item.clientes}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {item.pagado}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {item.sin_pagar}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Row>
      )}
      {dataClientes != null && (
        <Row justify={"center"} className="tabla" style={{ marginTop: "24px" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableCell style={{ textAlign: "center" }}>
                  <b>Clientes</b>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <b>Terreno</b>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <b>Lote</b>
                </TableCell>
                {dataFechas.map((item, index) => (
                  <TableCell
                    key={index}
                    style={{ textAlign: "center" }}
                    title={item.fechas}
                  >
                    <b>Semana {index + 1}</b>
                  </TableCell>
                ))}
                <TableCell style={{ textAlign: "center" }}>
                  <b>Importe Total Pagado</b>
                </TableCell>
              </TableHead>
              <TableBody>
                {dataClientes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ textAlign: "center" }}>
                        {item.nombre_cliente}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {item.terreno}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {item.lote}
                      </TableCell>
                      {item.pagos.map((pago, index) => (
                        <TableCell key={index} style={{ textAlign: "center" }}>
                          $ {formatPrecio(pago.monto_pagado)}
                        </TableCell>
                      ))}
                      <TableCell style={{ textAlign: "center" }}>
                        $ {formatPrecio(item.importe_total)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={dataClientes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Pagos por Página"
                  ></TablePagination>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Row>
      )}
    </div>
  );
}
