"use client";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "@/contexts/loading";
import { usuario_id } from "@/helpers/user";

import { formatPrecio, formatPrecio2, formatDate } from "@/helpers/formatters";
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
import ClientesInfo from "@/app/cliente/page";

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
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);
  const [isHovered, setIsHovered] = useState(false);

  const [show, setShow] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

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
  };

  async function onReporte(data) {
    setIsLoading(false);
    if (data.encontrado) {
      setDataClientes(data.response);
      setDataSemanas(data.semanas);
      setDataFechas(data.fechas);
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

  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClienteRowClick = (row) => {
    const loteId = row.lote_id;
    const terrenoId = row.terreno_id;
    const shouldSearch = true;

    window.open(
      `https://king-prawn-app-9pkxd.ondigitalocean.app/cliente?terreno_id=${terrenoId}&lote_id=${loteId}&shouldSearch=${shouldSearch}`,
      "_blank"
    );
  };

  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
    setShow(true);
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedRowData(null);
    setPage2(0);
  };

  const ModalResumenDetalle = ({ rowData }) => {
    const [data, setData] = useState(rowData);

    return (
      <>
        {data != null && (
          <Row>
            <Row
              justify={"center"}
              style={{ padding: "16px", margin: " 0 auto" }}
            >
              <Col
                xs={24}
                sm={20}
                md={16}
                lg={14}
                xl={14}
                xxl={24}
                className="titulo_pantallas"
              >
                <b style={{ padding: "12px" }}>Información de Clientes</b>
              </Col>
            </Row>
            <Row
              justify={"center"}
              className=" tabla"
              style={{ width: "1500px" }}
            >
              <TableContainer>
                <Table>
                  <TableHead className="formulario_alterno">
                    <TableCell style={{ textAlign: "center", color: "white" }}>
                      Nombre
                    </TableCell>
                    <TableCell style={{ textAlign: "center", color: "white" }}>
                      Telefono
                    </TableCell>
                    <TableCell style={{ textAlign: "center", color: "white" }}>
                      Terreno
                    </TableCell>
                    <TableCell style={{ textAlign: "center", color: "white" }}>
                      No. Lote
                    </TableCell>
                    <TableCell style={{ textAlign: "center", color: "white" }}>
                      Pago
                    </TableCell>
                    <TableCell style={{ textAlign: "center", color: "white" }}>
                      Saldo vencido
                    </TableCell>
                  </TableHead>
                  <TableBody>
                    {data
                      .slice(
                        page2 * rowsPerPage2,
                        page2 * rowsPerPage2 + rowsPerPage2
                      )
                      .map((item, index) => (
                        <TableRow key={index}>
                          <TableCell
                            className={
                              index % 2 === 0
                                ? "renglon_otro_color"
                                : "renglon_color"
                            }
                            style={{ textAlign: "center", color: "white" }}
                          >
                            {item.nombre}
                          </TableCell>
                          <TableCell
                            className={
                              index % 2 === 0
                                ? "renglon_otro_color"
                                : "renglon_color"
                            }
                            style={{ textAlign: "center", color: "white" }}
                          >
                            {item.telefono}
                          </TableCell>
                          <TableCell
                            className={
                              index % 2 === 0
                                ? "renglon_otro_color"
                                : "renglon_color"
                            }
                            style={{ textAlign: "center", color: "white" }}
                          >
                            {item.terreno}
                          </TableCell>
                          <TableCell
                            className={
                              index % 2 === 0
                                ? "renglon_otro_color"
                                : "renglon_color"
                            }
                            style={{ textAlign: "center", color: "white" }}
                          >
                            {item.no_lote}
                          </TableCell>
                          <TableCell
                            className={
                              index % 2 === 0
                                ? "renglon_otro_color"
                                : "renglon_color"
                            }
                            style={{ textAlign: "center", color: "white" }}
                          >
                            {typeof item.pago === "number"
                              ? `$ ${formatPrecio(item.pago)}`
                              : item.pago}
                          </TableCell>
                          <TableCell
                            className={
                              index % 2 === 0
                                ? "renglon_otro_color"
                                : "renglon_color"
                            }
                            style={{ textAlign: "center", color: "white" }}
                          >
                            {typeof item.pago === "number"
                              ? `$ ${formatPrecio(item.vencido)}`
                              : "no disponible"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        count={data.length}
                        rowsPerPage={rowsPerPage2}
                        page={page2}
                        onPageChange={handleChangePage2}
                        onRowsPerPageChange={handleChangeRowsPerPage2}
                        labelRowsPerPage="Registros por Página"
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Row>
          </Row>
        )}
      </>
    );
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
          className="w-3/4 m-auto tabla"
          style={{ marginTop: "24px" }}
        >
          <TableContainer>
            <Table>
              <TableHead className="formulario_alterno">
                <TableCell style={{ textAlign: "center", color: "white" }}>
                  <b>Semanas</b>
                </TableCell>
                <TableCell style={{ textAlign: "center", color: "white" }}>
                  <b>No. Clientes</b>
                </TableCell>
                <TableCell style={{ textAlign: "center", color: "white" }}>
                  <b>Pagado</b>
                </TableCell>
                <TableCell style={{ textAlign: "center", color: "white" }}>
                  <b>Monto pagado</b>
                </TableCell>
                <TableCell style={{ textAlign: "center", color: "white" }}>
                  <b>Sin Pagar</b>
                </TableCell>
                <TableCell style={{ textAlign: "center", color: "white" }}>
                  <b>Monto sin pagar</b>
                </TableCell>
                <TableCell style={{ textAlign: "center", color: "white" }}>
                  <b>Porcentaje pagado</b>
                </TableCell>
              </TableHead>
              <TableBody>
                {dataSemanas.map((item, index) => (
                  <TableRow
                    key={index}
                    className={
                      index % 2 === 0
                        ? "renglon_otro_color"
                        : "formulario_alterno"
                    }
                  >
                    <TableCell style={{ textAlign: "center", color: "white" }}>
                      Semana {index + 1}
                    </TableCell>
                    <TableCell style={{ textAlign: "center", color: "white" }}>
                      {item.clientes}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        handleRowClick(item.detalle_pagado);
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={
                        isHovered
                          ? {
                              textAlign: "center",
                              fontWeight: "bold",
                              color: "white",
                              cursor: "pointer",
                            }
                          : { textAlign: "center", color: "white" }
                      }
                    >
                      {item.pagado}
                    </TableCell>
                    <TableCell style={{ textAlign: "center", color: "white" }}>
                      $ {formatPrecio(item.suma_pagado)}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        handleRowClick(item.detalle_sin_pagar);
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={
                        isHovered
                          ? {
                              textAlign: "center",
                              fontWeight: "bold",
                              color: "white",
                              cursor: "pointer",
                            }
                          : { textAlign: "center", color: "white" }
                      }
                    >
                      {item.sin_pagar}
                    </TableCell>
                    <TableCell style={{ textAlign: "center", color: "white" }}>
                      $ {formatPrecio(item.suma_sin_pagar)}
                    </TableCell>
                    <TableCell style={{ textAlign: "center", color: "white" }}>
                      {formatPrecio2(item.porcentaje)} %
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
                    <b style={{ color: "rgb(66, 142, 204)" }}>
                      Semana {index + 1}
                    </b>
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
                    <TableRow
                      key={index}
                      style={{
                        backgroundColor:
                          item.financiamiento_id === 1
                            ? "rgb(66, 142, 202)"
                            : item.financiamiento_id === 2
                            ? "rgb(93, 185, 255)"
                            : "inherit",
                      }}
                    >
                      <TableCell
                        className="hover__resaltar-texto"
                        style={{ textAlign: "center" }}
                        onClick={() => {
                          handleClienteRowClick(item);
                        }}
                      >
                        {item.nombre_cliente}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {item.terreno}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {item.lote}
                      </TableCell>
                      {item.pagos.map((pago, index) =>
                        pago.monto_pagado !== "" ? (
                          <TableCell
                            key={index}
                            style={{ textAlign: "center" }}
                          >
                            $ {formatPrecio(pago.monto_pagado)}
                          </TableCell>
                        ) : (
                          <TableCell
                            key={index}
                            style={{ textAlign: "center" }}
                          >
                            <Button
                              disabled
                              size={"small"}
                              shape="round"
                              style={{ backgroundColor: "lightslategray" }}
                            />
                          </TableCell>
                        )
                      )}
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
      {show && (
        <Row>
          <Modal
            width={"50%"}
            visible={show}
            footer={null}
            onCancel={() => handleCloseModal()}
          >
            <ModalResumenDetalle rowData={selectedRowData} />
          </Modal>
        </Row>
      )}
    </div>
  );
}
