"use client";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "@/contexts/loading";
import { usuario_id } from "@/helpers/user";

import { formatPrecio, formatPrecio2, formatDate } from "@/helpers/formatters";
import {
  Button,
  Col,
  Row,
  Form,
  Select,
  Modal,
  DatePicker,
  Checkbox,
  Typography,
} from "antd";
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
  const [form] = Form.useForm();

  const [dataClientes, setDataClientes] = useState(null);
  const [dataSemanas, setDataSemanas] = useState(null);
  const [dataFechas, setDataFechas] = useState(null);

  const [semanal, setSemanal] = useState(true);
  const [quincenal, setQuincenal] = useState(true);
  const [mensual, setMensual] = useState(true);

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
  const [checked, setChecked] = useState(null);

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
      semanal: semanal,
      quincenal: quincenal,
      mensual: mensual,
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

  const handleRowClick = (rowDataM, rowDataQ, rowDataS) => {
    let array = {
      rowDataM: rowDataM,
      rowDataQ: rowDataQ,
      rowDataS: rowDataS,
    };

    let arrChecked = {
      semanal: semanal,
      quincenal: quincenal,
      mensual: mensual,
    };
    setChecked(arrChecked);
    setSelectedRowData(array);
    setShow(true);
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedRowData(null);
    setChecked(null);
    setPage2(0);
  };

  const ModalResumenDetalle = ({ rowData, checkData }) => {
    const [dataM, setDataM] = useState(rowData.rowDataM);
    const [dataQ, setDataQ] = useState(rowData.rowDataQ);
    const [dataS, setDataS] = useState(rowData.rowDataS);
    const [semanalModal, setSemanalModal] = useState(checkData.semanal);
    const [quicenalModal, setQuicenalModal] = useState(checkData.quincenal);
    const [mensualModal, setMensualModal] = useState(checkData.mensual);

    return (
      <Row>
        <Row justify={"center"} style={{ padding: "16px", margin: " 0 auto" }}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            xxl={24}
            className="titulo_pantallas"
          >
            <b style={{ padding: "12px" }}>Información de Clientes</b>
          </Col>
        </Row>
        {mensualModal && (
          <Row
            justify={"center"}
            className=" mb-5 tabla"
            style={{ width: "1500px" }}
          >
            <Row justify={"center"}>
              <Typography.Title level={3}>Mensual</Typography.Title>
            </Row>
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
                  {dataM
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
                      count={dataM.length}
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
        )}
        {quicenalModal && (
          <Row
            justify={"center"}
            className="mb-5 tabla"
            style={{ width: "1500px" }}
          >
            <Row justify={"center"}>
              <Typography.Title level={3}>Quincenal</Typography.Title>
            </Row>
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
                  {dataQ
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
                      count={dataQ.length}
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
        )}
        {semanalModal && (
          <Row
            justify={"center"}
            className=" tabla"
            style={{ width: "1500px" }}
          >
            <Row justify={"center"}>
              <Typography.Title level={3}>Semanal</Typography.Title>
            </Row>
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
                  {dataS
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
                      count={dataS.length}
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
        )}
      </Row>
    );
  };
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const handleCheckboxSemanalChange = (e) => {
    setSemanal(!semanal);
    form.setFieldsValue({ semanal: e.target.checked });
  };

  const handleCheckboxQuincenalChange = (e) => {
    setQuincenal(!quincenal);
    form.setFieldsValue({ quincenal: e.target.checked });
  };
  const handleCheckboxMensualChange = (e) => {
    setMensual(!mensual);
    form.setFieldsValue({ mensual: e.target.checked });
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
      <Form
        {...layout}
        form={form}
        onFinish={onSearch}
        initialValues={{
          semanal: true,
          quincenal: true,
          mensual: true,
        }}
      >
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          justify="center"
          style={{ paddingTop: 10 }}
        >
          <Col xs={14} sm={10} md={8} lg={6} xl={4} xxl={6}>
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
          <Col xs={14} sm={10} md={8} lg={6} xl={4} xxl={6}>
            <Form.Item
              label={"Estatús"}
              name="estatus"
              style={{ width: "100%" }}
            >
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
          <Col xs={14} sm={10} md={8} lg={6} xl={4} xxl={6}>
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
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          justify="center"
          style={{ paddingTop: 10 }}
        >
          <Col xs={14} sm={10} md={8} lg={6} xl={4} xxl={6}>
            <Form.Item name="semanal" valuePropName="checked">
              <Checkbox onChange={handleCheckboxSemanalChange}>
                <Typography.Text>Semanal</Typography.Text>
              </Checkbox>
            </Form.Item>
          </Col>
          <Col xs={14} sm={10} md={8} lg={6} xl={4} xxl={6}>
            <Form.Item name="quincenal" valuePropName="checked">
              <Checkbox onChange={handleCheckboxQuincenalChange}>
                <Typography.Text>Quincenal</Typography.Text>
              </Checkbox>
            </Form.Item>
          </Col>
          <Col xs={14} sm={10} md={8} lg={6} xl={4} xxl={6}>
            <Form.Item name="mensual" valuePropName="checked">
              <Checkbox onChange={handleCheckboxMensualChange}>
                <Typography.Text>Mensual</Typography.Text>
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"center"}>
          <Button
            className="boton"
            htmlType="submit"
            /*   onClick={() => {
              onSearch();
            }} */
          >
            Buscar
          </Button>
        </Row>
      </Form>

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
                  <b>Monto Anticipo</b>
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
                      {item.semana}
                    </TableCell>
                    <TableCell style={{ textAlign: "center", color: "white" }}>
                      {item.clientes}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        handleRowClick(
                          item.detalle_pagado_mensual,
                          item.detalle_pagado_quicenal,
                          item.detalle_pagado_semanal
                        );
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
                    
                    <TableCell style={{ textAlign: "center", color: "white" }}>
                      $ {formatPrecio(item.anticipo)}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        handleRowClick(
                          item.detalle_sin_pagar_mensual,
                          item.detalle_sin_pagar_quicenal,
                          item.detalle_sin_pagar_semanal
                        );
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
            <ModalResumenDetalle
              rowData={selectedRowData}
              checkData={checked}
            />
          </Modal>
        </Row>
      )}
    </div>
  );
}
