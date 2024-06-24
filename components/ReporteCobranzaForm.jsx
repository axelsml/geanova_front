"use client";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "@/contexts/loading";
import { usuario_id } from "@/helpers/user";

import { formatPrecio, formatDate } from "@/helpers/formatters";
import { Button, Col, Row, Form, Select, Modal, Tabs, DatePicker } from "antd";
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
import InputIn from "./Input";
import Swal from "sweetalert2";

import terrenosService from "@/services/terrenosService";
import pagosService from "@/services/pagosService";

export default function ReporteCobranza() {
  const { setIsLoading } = useContext(LoadingContext);

  const [data, setData] = useState(null);
  const [dataSolicitudes, setDataSolicitudes] = useState(null);
  const [terrenos, setTerrenos] = useState(null);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [sistemasPago, setSistemasPago] = useState(null);
  const [sistemaPagoSelected, setSistemaPagoSelected] = useState(null);
  const [cuentasBancarias, setCuentasBancarias] = useState(null);
  const [cuentaBancariaSelected, setCuentaBancariaSelected] = useState(null);
  const [statusPagoId, setStatusPagoId] = useState(null);
  const [fechaInicial, setFechaInicial] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);

  const [pagos, setPagos] = useState(0);
  const [totalPagado, setTotalPagado] = useState(0);
  const [totalContrato, setTotalContrato] = useState(0);
  const [totalPendiente, setTotalPendiente] = useState(0);
  const [totalAnticipo, setTotalAnticipo] = useState(0);

  const { Option } = Select;
  const opcion = [{ index: 0, id: 0, nombre: "Todos" }];
  const opcionStatus = [
    { index: 0, id: 0, nombre: "Todos" },
    { index: 1, id: 1, nombre: "Conciliado" },
    { index: 2, id: 2, nombre: "Pendiente" },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    terrenosService.getTerrenos(setTerrenos, Error);
    pagosService.getSistemasPago(setSistemasPago, Error);
    pagosService.getCuentasBancarias(setCuentasBancarias, Error);
  }, []);

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

  const onSearch = () => {
    if (sistemaPagoSelected != 2 || statusPagoId != 2) {
      setCuentaBancariaSelected(null);
    }
    setIsLoading(true);
    setTotalPagado(0);
    setTotalContrato(0);
    setTotalPendiente(0);
    setTotalAnticipo(0);
    var params = {
      fecha_inicial: fechaInicial,
      fecha_final: fechaFinal,
      terreno_id: terrenoSelected,
      sistema_pago_id: sistemaPagoSelected,
      cuenta_id: cuentaBancariaSelected,
      status_id: statusPagoId,
    };
    pagosService.getReporteCobranza(params, onReporte, onError);
  };

  async function onReporte(data) {
    setIsLoading(false);
    if (data.encontrado && data.response.length > 0) {
      setData(data.response);
      setDataSolicitudes(data.solicitudes);
      setTotalPagado(data.pagado);
      setTotalContrato(data.contrato);
      setTotalPendiente(data.pendiente);
      setTotalAnticipo(data.anticipo);
      setPagos(data.pagos);
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
      setData(null);
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
    console.log("entro al handleMouseEnter");
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    console.log("salio del handleMouseEnter");
    setIsHovered(false);
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
          xxl={6}
          className="titulo_pantallas"
        >
          <b>REPORTE DE COBRANZA</b>
        </Col>
      </Row>

      <div className="reporte-cobranza__container--filtros">
        <Row justify={"center"}>
          <Col>
            <Form.Item
              name="fechaInicial"
              label="Fecha Inicial"
              style={{ width: "100%" }}
            >
              <DatePicker
                allowClear={false}
                onChange={(value) => {
                  setFechaInicial(formatDate(value));
                }}
                style={{ width: "100%" }}
                placeholder="Ingreser fecha"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="fechaFinal"
              label="Fecha Final"
              style={{ width: "100%" }}
            >
              <DatePicker
                allowClear={false}
                onChange={(value) => {
                  setFechaFinal(formatDate(value));
                }}
                style={{ width: "100%" }}
                placeholder="Ingresar fecha"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"center"}>
          <Col>
            <Form.Item
              label={"Proyecto"}
              name="terreno_id"
              style={{ width: "100%" }}
            >
              <Select
                showSearch
                placeholder="Seleccionar Proyecto"
                optionLabelProp="label"
                onChange={(value) => {
                  setTerrenoSelected(value || "0");
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
        </Row>
        <Row justify={"center"}>
          <Col>
            <Form.Item
              label={"Status pago"}
              name="statuspago_id"
              style={{ width: "100%" }}
            >
              <Select
                showSearch
                placeholder="Seleccionar Status Pago"
                optionLabelProp="label"
                onChange={(value) => {
                  setStatusPagoId(value || "0");
                }}
              >
                {opcionStatus.map((item, index) => (
                  <Option key={index} value={item.id} label={item.nombre}>
                    {item?.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={"Sistema de Pago"}
              name="sistemapago_id"
              style={{ width: "100%" }}
            >
              <Select
                showSearch
                placeholder="Seleccionar Sistema de Pago"
                optionLabelProp="label"
                onChange={(value) => {
                  setSistemaPagoSelected(value || "0");
                }}
              >
                {sistemasPago &&
                  opcion.map((item, index) => (
                    <Option key={index} value={item.id} label={item.nombre}>
                      {item?.nombre}
                    </Option>
                  ))}
                {sistemasPago?.map((item, index) => (
                  <Option key={index} value={item.id} label={item.Nombre}>
                    {item?.Nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {sistemaPagoSelected == 2 && statusPagoId == 1 && (
            <Col>
              <Form.Item
                label={"Cuentas Bancarias"}
                name="cuentas_id"
                style={{ width: "100%" }}
              >
                <Select
                  showSearch
                  placeholder="Seleccionar Cuenta"
                  optionLabelProp="label"
                  onChange={(value) => {
                    setCuentaBancariaSelected(value || "0");
                  }}
                >
                  {cuentasBancarias &&
                    opcion.map((item, index) => (
                      <Option key={index} value={item.id} label={item.nombre}>
                        {item?.nombre}
                      </Option>
                    ))}
                  {cuentasBancarias?.map((item, index) => (
                    <Option
                      key={index}
                      value={item.id}
                      label={item.alias_nombre}
                    >
                      {item?.alias_nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>
      </div>
      <Row justify={"center"}>
        <Button
          className="boton boton-margin-bottom"
          disabled={fechaInicial > fechaFinal}
          onClick={() => {
            onSearch();
          }}
        >
          Buscar
        </Button>
      </Row>
      <div className="reporte-cobranza__labels-container">
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Monto Anticipo
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="anticipo"
              className="reporte-lotes__input--realizado"
              value={
                totalAnticipo !== 0
                  ? "$ " + formatPrecio(parseFloat(totalAnticipo))
                  : "$ 0.0"
              }
              disabled={true}
              placeholder={
                totalAnticipo !== 0
                  ? "$ " + formatPrecio(parseFloat(totalAnticipo))
                  : "$ 0.0"
              }
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
              id="pagado"
              className="reporte-lotes__input--realizado"
              value={
                totalPagado !== 0
                  ? "$ " + formatPrecio(parseFloat(totalPagado))
                  : "$ 0.0"
              }
              disabled={true}
              placeholder={
                totalPagado !== 0
                  ? "$ " + formatPrecio(parseFloat(totalPagado))
                  : "$ 0.0"
              }
            />
          </Row>
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Row justify={"center"}>
            <label className="reporte-lotes__label--input" htmlFor="">
              Monto Contrato
            </label>
          </Row>
          <Row justify={"center"}>
            <input
              id="contrato"
              className="reporte-lotes__input--realizado"
              value={
                totalContrato !== 0
                  ? "$ " + formatPrecio(parseFloat(totalContrato))
                  : "$ 0.0"
              }
              disabled={true}
              placeholder={
                totalContrato !== 0
                  ? "$ " + formatPrecio(parseFloat(totalContrato))
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
      {data != null && (
        <Row justify={"center"} className="tabla">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="tabla_encabezado">
                  <TableCell>
                    <p>Cliente</p>
                  </TableCell>
                  <TableCell>
                    <p>Proyecto</p>
                  </TableCell>
                  <TableCell>
                    <p>No. Lote</p>
                  </TableCell>
                  <TableCell>
                    <p>Folio Pago</p>
                  </TableCell>
                  <TableCell>
                    <p>Sistema de Pago</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Pago</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Pago</p>
                  </TableCell>
                  <TableCell>
                    <p>Status Pago</p>
                  </TableCell>
                  <TableCell>
                    <p
                      className="hoover-target"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      Status Solicitud
                    </p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.nombre_cliente}</TableCell>
                      <TableCell>{item.terreno}</TableCell>
                      <TableCell>{item.no_lote}</TableCell>
                      <TableCell>{item.folio}</TableCell>
                      <TableCell>{item.sistema_pago}</TableCell>
                      <TableCell>$ {formatPrecio(item.monto_pago)}</TableCell>
                      <TableCell>{item.fecha_pago}</TableCell>
                      <TableCell>{item.status_pago}</TableCell>
                      <TableCell>
                        <Button
                          disabled
                          size={"small"}
                          shape="round"
                          style={{
                            backgroundColor: item.status_solicitud,
                          }}
                        ></Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={pagos}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Pagos por Página"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Row>
      )}
      {data != null && (
        <Row style={{ marginTop: "24px" }} justify={"center"} className="tabla">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="tabla_encabezado">
                  <TableCell>
                    <p>Cliente</p>
                  </TableCell>
                  <TableCell>
                    <p>Proyecto</p>
                  </TableCell>
                  <TableCell>
                    <p>No. Lote</p>
                  </TableCell>
                  <TableCell>
                    <p>Anticipo</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Solicitud</p>
                  </TableCell>
                  <TableCell>
                    <p>Status Solicitud</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataSolicitudes
                  .slice(
                    page2 * rowsPerPage2,
                    page2 * rowsPerPage2 + rowsPerPage2
                  )
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.cliente_nombre}</TableCell>
                      <TableCell>{item.proyecto}</TableCell>
                      <TableCell>{item.no_lote}</TableCell>
                      <TableCell>$ {formatPrecio(item.anticipo)}</TableCell>
                      <TableCell>{item.fecha}</TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          disabled
                          size={"small"}
                          shape="round"
                          style={{
                            backgroundColor: item.status,
                          }}
                        ></Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={dataSolicitudes.length}
                    rowsPerPage={rowsPerPage}
                    page={page2}
                    onPageChange={handleChangePage2}
                    onRowsPerPageChange={handleChangeRowsPerPage2}
                    labelRowsPerPage="Solicitudes por Página"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Row>
      )}
      {isHovered && (
        <div className="hover-container reporte-cobranza">
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
    </div>
  );
}
