"use client";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "@/contexts/loading";
import { usuario_id } from "@/helpers/user";

import { formatPrecio } from "@/helpers/formatters";
import { Button, Col, Row, Form, Select, Modal, Tabs } from "antd";
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
import { FaFilePdf } from "react-icons/fa";

import ventasService from "@/services/ventasService";
import terrenosService from "@/services/terrenosService";
import lotesService from "@/services/lotesService";
import pagosService from "@/services/pagosService";
import PagoForm from "./PagoForm";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { getCookiePermisos } from "@/helpers/valorPermisos";

export default function ReporteLotes() {
  const { setIsLoading } = useContext(LoadingContext);
  const [lotes, setLotes] = useState(null);
  const [loteSelected, setLoteSelected] = useState(null);
  const [loteAux, setLoteAux] = useState(null);
  const [terrenos, setTerrenos] = useState(null);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [periodoPagoSelected, setPeriodoPagoSelected] = useState(null);
  const [terrenoAux, setTerrenoAux] = useState(null);
  const [info, setInfo] = useState(null);
  const [infoCliente, setInfoCliente] = useState(null);
  const [infoLote, setInfoLote] = useState(null);
  const [infoFecha, setInfoFecha] = useState(null);
  const [nuevoPago, setNuevoPago] = useState(false);
  const [totalLotes, setTotalLotes] = useState(0);
  const [totalPagados, setTotalPagados] = useState(0);
  const [totalVencidos, setTotalVencidos] = useState(0);
  const [totalPendiente, setTotalPendiente] = useState(0);
  const [totalSemanal, setTotalSemanal] = useState(0);
  const [totalMensual, setTotalMensual] = useState(0);
  const [totalLiquidados, setTotalLiquidados] = useState(0);
  const [totalCobranza, setTotalCobranza] = useState(0);

  const [info2, setInfo2] = useState(null);
  const [infoCliente2, setInfoCliente2] = useState(null);
  const [infoLote2, setInfoLote2] = useState(null);
  const [infoFecha2, setInfoFecha2] = useState(null);
  const [nuevoPago2, setNuevoPago2] = useState(false);
  const [totalLotes2, setTotalLotes2] = useState(0);
  const [totalPagados2, setTotalPagados2] = useState(0);
  const [totalVencidos2, setTotalVencidos2] = useState(0);
  const [totalPendiente2, setTotalPendiente2] = useState(0);
  const [totalSemanal2, setTotalSemanal2] = useState(0);
  const [totalMensual2, setTotalMensual2] = useState(0);
  const [totalLiquidados2, setTotalLiquidados2] = useState(0);
  const [totalCobranza2, setTotalCobranza2] = useState(0);

  const { Option } = Select;
  const opcion = [{ index: 0, id: 0, nombre: "Todos" }];

  const [changeState, setChangeState] = useState(false);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);
  const [isHovered, setIsHovered] = useState(false);

  const [cookiePermisos, setCookiePermisos] = useState([]);

  const [form] = Form.useForm();

  let periodos = [
    {
      id: 0,
      label: "Todos",
      value: 0,
    },
    {
      id: 1,
      label: "Mes",
      value: 1,
    },
    {
      id: 2,
      label: "Quincenal",
      value: 2,
    },
    {
      id: 3,
      label: "Semanal",
      value: 3,
    },
  ];

  useEffect(() => {
    terrenosService.getTerrenos(setTerrenos, Error);
    getCookiePermisos("lotes", setCookiePermisos);
  }, []);

  const BuscarInfoLote = () => {
    setIsLoading(true);
    setTotalLotes(0);
    setTotalPagados(0);
    setTotalVencidos(0);
    setTotalPendiente(0);
    setTotalSemanal(0);
    setTotalMensual(0);
    setTotalLiquidados(0);
    setTotalCobranza(0);
    setTerrenoAux(null);
    var params = {
      lote_id: loteSelected ? loteSelected.id : 0,
      terreno_id: terrenoSelected.id,
      periodoPago: periodoPagoSelected,
      bandera: 1,
    };
    lotesService.reporteLotes(params, onInfoClienteCargado, onError);
  };

  async function onInfoClienteCargado(data) {
    setIsLoading(false);
    if (data.encontrado) {
      setInfo(data.response);
      setTotalLotes(data.lotes);
      setTotalPagados(data.pagados);
      setTotalVencidos(data.vencidos);
      setTotalPendiente(data.pendiente);
      setTotalSemanal(data.semanal);
      setTotalMensual(data.mensual);
      setTotalLiquidados(data.liquidados);
      setTotalCobranza(data.cobranza);
      setTerrenoAux(terrenoSelected);
      setIsLoading(true);

      var params = {
        lote_id: loteSelected ? loteSelected.id : 0,
        terreno_id: terrenoSelected.id,
        bandera: 2,
      };
      lotesService.reporteLotes(params, onInfoClienteCargado2, onError);
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No Se Pudo Encontrar La Informacion",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
      setInfo(null);
    }
  }
  async function onInfoClienteCargado2(data) {
    setIsLoading(false);
    if (data.encontrado) {
      setInfo2(data.response);
      setTotalLotes2(data.lotes);
      setTotalPagados2(data.pagados);
      setTotalVencidos2(data.vencidos);
      setTotalPendiente2(data.pendiente);
      setTotalSemanal2(data.semanal);
      setTotalMensual2(data.mensual);
      setTotalLiquidados2(data.liquidados);
      setTotalCobranza2(data.cobranza);
      setTerrenoAux2(terrenoSelected);
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No Se Pudo Encontrar La Informacion",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
      setInfo2(null);
    }
  }

  const onBuscarLotes = (value) => {
    if (value == 0) {
      setTerrenoSelected(value);
      form.resetFields();
    } else {
      setTerrenoSelected(terrenos.find((terreno) => terreno.id == value));
      form.resetFields();
      lotesService.getLotesAsignados(
        value,
        (data) => {
          setLotes(data);
        },
        onError
      );
    }
  };

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

  const handleModalPago = (lote, cliente, fecha) => {
    setShow(true);
    setNuevoPago(!nuevoPago);
    setInfoLote(lote);
    setInfoCliente(cliente);
    setInfoFecha(fecha);
  };

  const handleCloseModal = () => {
    setShow(false);
    setNuevoPago(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  const handleMouseEnter = () => {
    console.log("entro al handleMouseEnter");
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    console.log("salio del handleMouseEnter");
    setIsHovered(false);
  };

  return (
    <Row className="grid gap-4">
      <Row justify={"center"}>
        <Col
          xs={24}
          sm={20}
          md={16}
          lg={12}
          xl={8}
          xxl={7}
          className="titulo_pantallas"
        >
          <b>REPORTE DE LOTES</b>
        </Col>
      </Row>
      <Row
        gutter={[16, 16]}
        wrap
        justify={"center"}
        style={{ marginTop: "15px" }}
      >
        <Col span={5}>
          <Form.Item
            label={"Proyecto"}
            name={"terreno"}
            style={{ width: "100%" }}
            rules={[{ required: true, message: "Terreno no seleccionado" }]}
            initialValue={terrenoSelected?.nombre}
          >
            <Select
              showSearch
              placeholder="Seleccione un Proyecto"
              optionLabelProp="label"
              onChange={onBuscarLotes}
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
        <Col span={5}>
          <Form name="loteform" form={form}>
            <Form.Item
              label={"Lote"}
              name="lote_id"
              style={{ width: "100%" }}
              rules={[{ required: true, message: "Lote no seleccionado" }]}
            >
              <Select
                showSearch
                placeholder="Seleccione un Lote"
                optionLabelProp="label"
                disabled={terrenoSelected == 0}
                value={loteSelected != null ? loteSelected.numero : undefined}
                onChange={(value) => {
                  const loteSelected = lotes.find((lote) => lote.id == value);
                  setLoteSelected(loteSelected);
                }}
              >
                {lotes && (
                  <Option key="all" value={0} label="Todos">
                    {"Todos"}
                  </Option>
                )}
                {lotes?.map((item, index) => (
                  <Option key={index} value={item.id} label={item.numero}>
                    {item?.numero}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Col>
        <Col span={5}>
          <Form.Item
            label={"Periodo"}
            name={"periodoPago"}
            style={{ width: "100%" }}
            // rules={[{ required: true, message: "Periodo no seleccionado" }]}
          >
            <Select
              //showSearch
              placeholder="Seleccione un Periodo"
              optionLabelProp="label"
              onChange={(data) => {
                setPeriodoPagoSelected(data);
              }}
            >
              {lotes &&
                periodos.map((periodo, index) => {
                  return (
                    <Option
                      key={periodo.id}
                      value={periodo.value}
                      label={periodo.label}
                    >
                      {periodo.label}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={1}>
          <Button
            className="boton"
            disabled={terrenoSelected == null}
            onClick={BuscarInfoLote}
          >
            Buscar
          </Button>
        </Col>
      </Row>

      <b>CLIENTES SIN CONGELADOS</b>

      <div className="reporte-lotes__labels-container">
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Lotes
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="lotes"
              className="reporte-lotes__input--realizado"
              value={totalLotes !== 0 ? totalLotes : 0}
              disabled={true}
              placeholder={totalLotes !== 0 ? totalLotes : "$ 0.0"}
            />
          </Row>
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Monto Pagado
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="pagados"
              className="reporte-lotes__input--realizado"
              value={
                totalPagados !== 0
                  ? "$ " + formatPrecio(parseFloat(totalPagados))
                  : "$ 0.0"
              }
              disabled={true}
              placeholder={
                totalPagados !== 0
                  ? "$ " + formatPrecio(parseFloat(totalPagados))
                  : "$ 0.0"
              }
            />
          </Row>
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Monto Vencido
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="vencidos"
              className="reporte-lotes__input--realizado"
              value={
                totalVencidos !== 0
                  ? "$ " + formatPrecio(parseFloat(totalVencidos))
                  : "$ 0.0"
              }
              disabled={true}
              placeholder={
                totalVencidos !== 0
                  ? "$ " + formatPrecio(parseFloat(totalVencidos))
                  : "$ 0.0"
              }
            />
          </Row>
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Monto Pendiente
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="pendiente"
              className="reporte-lotes__input--realizado"
              value={
                totalPendiente !== 0
                  ? "$ " + formatPrecio(parseFloat(totalPendiente))
                  : "$ 0.0"
              }
              disabled={true}
              placeholder={
                totalPendiente !== 0
                  ? "$ " + formatPrecio(parseFloat(totalPendiente))
                  : "$ 0.0"
              }
            />
          </Row>
        </Col>
      </div>
      <div className="reporte-lotes__labels-container">
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Lotes liquidados
            </label>
          </Row>
          <Row justify={"liquidados"}>
            <input
              id="liquidados"
              className="reporte-lotes__input--realizado"
              value={totalLiquidados !== 0 ? totalLiquidados : 0}
              disabled={true}
              placeholder={totalLiquidados !== 0 ? totalLiquidados : "$ 0.0"}
            />
          </Row>
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Lotes en cobranza
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="cobranza"
              className="reporte-lotes__input--realizado"
              value={totalCobranza !== 0 ? totalCobranza : 0}
              disabled={true}
              placeholder={totalCobranza !== 0 ? totalCobranza : "$ 0.0"}
            />
          </Row>
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Monto semanal
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="semanal"
              className="reporte-lotes__input--realizado"
              value={
                totalSemanal !== 0
                  ? "$ " + formatPrecio(parseFloat(totalSemanal))
                  : "$ 0.0"
              }
              disabled={true}
              placeholder={
                totalSemanal !== 0
                  ? "$ " + formatPrecio(parseFloat(totalSemanal))
                  : "$ 0.0"
              }
            />
          </Row>
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Monto mensual
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="mensual"
              className="reporte-lotes__input--realizado"
              value={
                totalMensual !== 0
                  ? "$ " + formatPrecio(parseFloat(totalMensual))
                  : "$ 0.0"
              }
              disabled={true}
              placeholder={
                totalMensual !== 0
                  ? "$ " + formatPrecio(parseFloat(totalMensual))
                  : "$ 0.0"
              }
            />
          </Row>
        </Col>
      </div>
      {info != null && (
        <Row justify={"center"} className="tabla">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="tabla_encabezado">
                  <TableCell>
                    <p>No.</p>
                  </TableCell>
                  {terrenoAux == 0 && (
                    <TableCell>
                      <p>Terreno</p>
                    </TableCell>
                  )}
                  <TableCell>
                    <p>No. Lote</p>
                  </TableCell>
                  <TableCell>
                    <p>Nombre</p>
                  </TableCell>
                  <TableCell>
                    <p>Telefono</p>
                  </TableCell>
                  <TableCell>
                    <p
                      className="hoover-target"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      Estado
                    </p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Pago</p>
                  </TableCell>
                  <TableCell>
                    <p>Anticipo</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Contrato</p>
                  </TableCell>
                  <TableCell>
                    <p>Pagado al momento</p>
                  </TableCell>
                  <TableCell>
                    <p>Saldo Vencido</p>
                  </TableCell>
                  <TableCell>
                    <p>Estado de cuenta</p>
                  </TableCell>
                  <TableCell>
                    <p>Amortizacion</p>
                  </TableCell>
                  <TableCell>
                    <p>Realizar pago</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {info
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      {terrenoAux == 0 && (
                        <TableCell>{item["resumen_lote"]["terreno"]}</TableCell>
                      )}
                      <TableCell>{item["resumen_lote"]["lote"]}</TableCell>
                      <TableCell>
                        {item["resumen_cliente"]["nombre_completo"]}
                      </TableCell>
                      <TableCell>
                        {item["resumen_cliente"]["telefono_celular"]}
                      </TableCell>
                      <TableCell>
                        <Button
                          disabled
                          size={"small"}
                          shape="round"
                          style={{
                            backgroundColor:
                              item["resumen_lote"]["situacion_solicitud_color"],
                          }}
                        ></Button>
                      </TableCell>
                      <TableCell>
                        ${" "}
                        {formatPrecio(
                          parseFloat(
                            item["resumen_lote"]["monto_pago_requerido"]
                          )
                        )}
                      </TableCell>
                      <TableCell>
                        ${" "}
                        {formatPrecio(
                          parseFloat(item["resumen_lote"]["anticipo"])
                        )}
                      </TableCell>
                      <TableCell>
                        ${" "}
                        {formatPrecio(
                          parseFloat(item["resumen_lote"]["monto_contrato"])
                        )}
                      </TableCell>
                      <TableCell>
                        ${" "}
                        {formatPrecio(
                          parseFloat(item["resumen_lote"]["monto_pagado"])
                        )}
                      </TableCell>
                      <TableCell>
                        ${" "}
                        {formatPrecio(
                          parseFloat(item["resumen_lote"]["monto_vencido"])
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          className="boton"
                          disabled={cookiePermisos >= 1 ? false : true}
                          size="large"
                          key={item}
                          onClick={() => {
                            window.open(
                              `https://api.santamariadelaluz.com/getClienteByLote/${terrenoSelected.id}/${item["resumen_lote"]["lote_id"]}.pdf`
                            );
                          }}
                        >
                          <FaFilePdf className="m-auto" size={"20px"} />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          className="boton"
                          disabled={cookiePermisos >= 1 ? false : true}
                          size="large"
                          onClick={() => {
                            window.open(
                              `https://api.santamariadelaluz.com/iUsuarios/${item["resumen_lote"]["amortizaciones"][0]["solicitud_id"]}.pdf`
                            );
                          }}
                        >
                          <FaFilePdf className="m-auto" size={"20px"} />
                        </Button>
                      </TableCell>
                      <TableCell>
                        {item["resumen_lote"]["situacion_solicitud_color"] !==
                          "blue" && (
                          <Button
                            className="boton"
                            disabled={cookiePermisos >= 2 ? false : true}
                            size={"large"}
                            onClick={() => {
                              handleModalPago(
                                item["resumen_lote"],
                                item["resumen_cliente"],
                                item["fecha_proximo_pago"]
                              );
                            }}
                          >
                            <FaMoneyCheckDollar
                              className="m-auto"
                              size={"20px"}
                            />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={totalLotes}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Amortizaciones por Página"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Row>
      )}
      <b>CLIENTES CONGELADOS</b>
      <div className="reporte-lotes__labels-container">
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Lotes
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="lotes"
              className="reporte-lotes__input--realizado"
              value={totalLotes2 !== 0 ? totalLotes2 : 0}
              disabled={true}
              placeholder={totalLotes2 !== 0 ? totalLotes2 : "$ 0.0"}
            />
          </Row>
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Monto Pagado
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="pagados"
              className="reporte-lotes__input--realizado"
              value={
                totalPagados2 !== 0
                  ? "$ " + formatPrecio(parseFloat(totalPagados2))
                  : "$ 0.0"
              }
              disabled={true}
              placeholder={
                totalPagados2 !== 0
                  ? "$ " + formatPrecio(parseFloat(totalPagados2))
                  : "$ 0.0"
              }
            />
          </Row>
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Monto Vencido
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="vencidos"
              className="reporte-lotes__input--realizado"
              value={
                totalVencidos2 !== 0
                  ? "$ " + formatPrecio(parseFloat(totalVencidos2))
                  : "$ 0.0"
              }
              disabled={true}
              placeholder={
                totalVencidos2 !== 0
                  ? "$ " + formatPrecio(parseFloat(totalVencidos2))
                  : "$ 0.0"
              }
            />
          </Row>
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Monto Pendiente
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="pendiente"
              className="reporte-lotes__input--realizado"
              value={
                totalPendiente2 !== 0
                  ? "$ " + formatPrecio(parseFloat(totalPendiente2))
                  : "$ 0.0"
              }
              disabled={true}
              placeholder={
                totalPendiente2 !== 0
                  ? "$ " + formatPrecio(parseFloat(totalPendiente2))
                  : "$ 0.0"
              }
            />
          </Row>
        </Col>
      </div>
      <div className="reporte-lotes__labels-container">
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Lotes liquidados
            </label>
          </Row>
          <Row justify={"liquidados"}>
            <input
              id="liquidados"
              className="reporte-lotes__input--realizado"
              value={totalLiquidados2 !== 0 ? totalLiquidados2 : 0}
              disabled={true}
              placeholder={totalLiquidados2 !== 0 ? totalLiquidados2 : "$ 0.0"}
            />
          </Row>
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Lotes en cobranza
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="cobranza"
              className="reporte-lotes__input--realizado"
              value={totalCobranza2 !== 0 ? totalCobranza2 : 0}
              disabled={true}
              placeholder={totalCobranza2 !== 0 ? totalCobranza2 : "$ 0.0"}
            />
          </Row>
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Monto semanal
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="semanal"
              className="reporte-lotes__input--realizado"
              value={
                totalSemanal2 !== 0
                  ? "$ " + formatPrecio(parseFloat(totalSemanal2))
                  : "$ 0.0"
              }
              disabled={true}
              placeholder={
                totalSemanal2 !== 0
                  ? "$ " + formatPrecio(parseFloat(totalSemanal2))
                  : "$ 0.0"
              }
            />
          </Row>
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Monto mensual
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="mensual"
              className="reporte-lotes__input--realizado"
              value={
                totalMensual2 !== 0
                  ? "$ " + formatPrecio(parseFloat(totalMensual2))
                  : "$ 0.0"
              }
              disabled={true}
              placeholder={
                totalMensual2 !== 0
                  ? "$ " + formatPrecio(parseFloat(totalMensual2))
                  : "$ 0.0"
              }
            />
          </Row>
        </Col>
      </div>
      {info2 != null && (
        <Row justify={"center"} className="tabla">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="tabla_encabezado">
                  <TableCell>
                    <p>No.</p>
                  </TableCell>
                  {terrenoAux == 0 && (
                    <TableCell>
                      <p>Terreno</p>
                    </TableCell>
                  )}
                  <TableCell>
                    <p>No. Lote</p>
                  </TableCell>
                  <TableCell>
                    <p>Nombre</p>
                  </TableCell>
                  <TableCell>
                    <p>Telefono</p>
                  </TableCell>
                  <TableCell>
                    <p
                      className="hoover-target"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      Estado
                    </p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Pago</p>
                  </TableCell>
                  <TableCell>
                    <p>Anticipo</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Contrato</p>
                  </TableCell>
                  <TableCell>
                    <p>Pagado al momento</p>
                  </TableCell>
                  <TableCell>
                    <p>Saldo Vencido</p>
                  </TableCell>
                  <TableCell>
                    <p>Estado de cuenta</p>
                  </TableCell>
                  <TableCell>
                    <p>Amortizacion</p>
                  </TableCell>
                  <TableCell>
                    <p>Realizar pago</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {info2
                  .slice(
                    page2 * rowsPerPage2,
                    page2 * rowsPerPage2 + rowsPerPage2
                  )
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      {terrenoAux == 0 && (
                        <TableCell>{item["resumen_lote"]["terreno"]}</TableCell>
                      )}
                      <TableCell>{item["resumen_lote"]["lote"]}</TableCell>
                      <TableCell>
                        {item["resumen_cliente"]["nombre_completo"]}
                      </TableCell>
                      <TableCell>
                        {item["resumen_cliente"]["telefono_celular"]}
                      </TableCell>
                      <TableCell>
                        <Button
                          disabled
                          size={"small"}
                          shape="round"
                          style={{
                            backgroundColor:
                              item["resumen_lote"]["situacion_solicitud_color"],
                          }}
                        ></Button>
                      </TableCell>
                      <TableCell>
                        ${" "}
                        {formatPrecio(
                          parseFloat(
                            item["resumen_lote"]["monto_pago_requerido"]
                          )
                        )}
                      </TableCell>
                      <TableCell>
                        ${" "}
                        {formatPrecio(
                          parseFloat(item["resumen_lote"]["anticipo"])
                        )}
                      </TableCell>
                      <TableCell>
                        ${" "}
                        {formatPrecio(
                          parseFloat(item["resumen_lote"]["monto_contrato"])
                        )}
                      </TableCell>
                      <TableCell>
                        ${" "}
                        {formatPrecio(
                          parseFloat(item["resumen_lote"]["monto_pagado"])
                        )}
                      </TableCell>
                      <TableCell>
                        ${" "}
                        {formatPrecio(
                          parseFloat(item["resumen_lote"]["monto_vencido"])
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          className="boton"
                          disabled={cookiePermisos >= 1 ? false : true}
                          size="large"
                          key={item}
                          onClick={() => {
                            window.open(
                              `https://api.santamariadelaluz.com/getClienteByLote/${terrenoSelected.id}/${item["resumen_lote"]["lote_id"]}.pdf`
                            );
                          }}
                        >
                          <FaFilePdf className="m-auto" size={"20px"} />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          className="boton"
                          disabled={cookiePermisos >= 1 ? false : true}
                          size="large"
                          onClick={() => {
                            window.open(
                              `https://api.santamariadelaluz.com/iUsuarios/${item["resumen_lote"]["amortizaciones"][0]["solicitud_id"]}.pdf`
                            );
                          }}
                        >
                          <FaFilePdf className="m-auto" size={"20px"} />
                        </Button>
                      </TableCell>
                      <TableCell>
                        {item["resumen_lote"]["situacion_solicitud_color"] !==
                          "blue" && (
                          <Button
                            className="boton"
                            disabled={cookiePermisos >= 2 ? false : true}
                            size={"large"}
                            onClick={() => {
                              handleModalPago(
                                item["resumen_lote"],
                                item["resumen_cliente"],
                                item["fecha_proximo_pago"]
                              );
                            }}
                          >
                            <FaMoneyCheckDollar
                              className="m-auto"
                              size={"20px"}
                            />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={totalLotes2}
                    rowsPerPage={rowsPerPage2}
                    page={page2}
                    onPageChange={handleChangePage2}
                    onrowsPerPage2Change={handleChangeRowsPerPage2}
                    labelRowsPerPage="Amortizaciones por Página"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Row>
      )}
      {show && (
        <Modal visible={show} footer={null} onCancel={() => handleCloseModal()}>
          <Row justify={"center"}>
            <Col
              xs={24}
              sm={20}
              md={16}
              lg={14}
              xl={14}
              xxl={8}
              className="titulo_pantallas"
            >
              <b>Nuevo Pago</b>
            </Col>
          </Row>
          <Row justify={"center"}>
            <Col span={24}>
              {nuevoPago && (
                <PagoForm
                  setNuevoPago={setNuevoPago}
                  cliente={infoCliente}
                  lote={infoLote}
                  proximoPago={infoFecha}
                  setWatch={setChangeState}
                  watch={changeState}
                />
              )}
            </Col>
          </Row>
        </Modal>
      )}
      {isHovered && (
        <div className="hover-container">
          <table className="hover-popup">
            <thead className="hover-popup-thead">
              <tr>
                <td>Color</td>
                <td>Estado</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Button
                    disabled
                    size={"small"}
                    shape="round"
                    style={{ backgroundColor: "#0000FF" }}
                  />
                </td>
                <td>Liquidada</td>
              </tr>
              <tr>
                <td>
                  <Button
                    disabled
                    size={"small"}
                    shape="round"
                    style={{ backgroundColor: "#008000" }}
                  />
                </td>
                <td>Al corriente</td>
              </tr>
              <tr>
                <td>
                  <Button
                    disabled
                    size={"small"}
                    shape="round"
                    style={{ backgroundColor: "#FFFF00" }}
                  />
                </td>
                <td>Adelantado</td>
              </tr>
              <tr>
                <td>
                  <Button
                    disabled
                    size={"small"}
                    shape="round"
                    style={{ backgroundColor: "#F39C12" }}
                  />
                </td>
                <td>Atrasado</td>
              </tr>
              <tr>
                <td>
                  <Button
                    disabled
                    size={"small"}
                    shape="round"
                    style={{ backgroundColor: "#FF0000" }}
                  />
                </td>
                <td>Vencido</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Row>
  );
}
