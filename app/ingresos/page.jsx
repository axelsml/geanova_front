"use client";

import {
  Button,
  DatePicker,
  Col,
  Collapse,
  Row,
  Typography,
  Form,
  Select,
  Modal,
} from "antd";
// import { Modal } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "@/contexts/loading";
import { usuario_id } from "@/helpers/user";
import InputIn from "@/components/Input";
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
import pagosService from "@/services/pagosService";
import { formatDate } from "@/helpers/formatters";
import terrenosService from "@/services/terrenosService";

export default function ReporteIngresos() {
  const { setIsLoading } = useContext(LoadingContext);
  const { Option } = Select;

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [fechaInicial, setFechaInicial] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);

  const [proyectos, setProyectos] = useState([]);
  const [proyectoID, setProyectoID] = useState(null);

  const [resumenIngresos, setResumenIngresos] = useState({});
  const [detalleIngresos, setDetalleIngresos] = useState({});

  const [cobranzaNum, setCobranzaNum] = useState(0.0);
  const [cobranzaMonto, setCobranzaMonto] = useState(0.0);
  const [totalCobranza, setTotalCobranza] = useState(0.0);
  const [anticipoNum, setAnticipoNum] = useState(0.0);
  const [anticipoMonto, setAnticipoMonto] = useState(0.0);
  const [totalAnticipo, setTotalAnticipo] = useState(0.0);
  const [total, setTotal] = useState(0.0);

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
      id_terreno: proyectoID,
    };
    setIsLoading(true);
    console.log(fechaInicial);
    console.log(fechaFinal);

    pagosService.getReporteIngresos(params, onReporte, onError);
  }

  async function onReporte(data) {
    setIsLoading(false);
    data
      ? setResumenIngresos(data.resumen)
      : Swal.fire({
          title: "Error",
          icon: "error",
          text: "No se encontraron registros con la información solicitada",
          confirmButtonColor: "#4096ff",
          cancelButtonColor: "#ff4d4f",
          showDenyButton: true,
          confirmButtonText: "Aceptar",
        });
  }

  const onError = (e) => {
    setIsLoading(false);
  };

  var formatNumero = function (n, currency) {
    return currency + "" + n.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  };

  return (
    <>
      <div>
        <Row className="rep-ing-row__header">
          <Col className="rep-ing-fechas__datepicker--inicial">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Fecha Inicial"
              onChange={(e) => {
                setFechaInicial(formatDate(e));
              }}
            />
          </Col>
          <Col className="rep-ing-fechas__datepicker--inicial">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Fecha Final"
              onChange={(e) => {
                setFechaFinal(formatDate(e));
              }}
            />
          </Col>
          <Col>
            <Select
              showSearch
              placeholder="Seleccione un proyecto"
              optionLabelProp="label"
              onChange={(value) => {
                setProyectoID(value);
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
          <Col className="rep-ing-boton--buscar">
            <Button onClick={handleSearchButton}>BUSCAR</Button>
          </Col>
        </Row>
        <h1 className="rep-ing-title__h1">Reporte de Ingresos</h1>
        <Row>
          {resumenIngresos.cobranza != undefined && (
            <div className="rep-ing-main-div__table">
              <Table className="rep-ing__table">
                <thead className="rep-ing__thead">
                  <tr>
                    <th className="rep-ing__th">Concepto</th>
                    <th className="rep-ing__th">Tipo de pago</th>
                    <th className="rep-ing__th">Número</th>
                    <th className="rep-ing__th">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className="rep-ing__tr"
                    onClick={() => {
                      handleShow();
                      setDetalleIngresos(resumenIngresos.cobranza);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="rep-ing__td">Cobranza</td>
                    <td className="rep-ing__td">Oficina</td>
                    <td className="rep-ing__td">
                      {resumenIngresos.cobranza?.oficina}
                    </td>
                    <td className="rep-ing__td">
                      {formatNumero(
                        parseFloat(resumenIngresos.cobranza?.oficinamonto),
                        "$"
                      )}
                    </td>
                  </tr>
                  <tr
                    className="rep-ing__tr"
                    onClick={() => {
                      handleShow();
                      setDetalleIngresos(resumenIngresos.cobranza);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="rep-ing__td"></td>
                    <td className="rep-ing__td">Transferencia</td>
                    <td className="rep-ing__td">
                      {resumenIngresos.cobranza?.transferencia}
                    </td>
                    <td className="rep-ing__td">
                      {formatNumero(
                        parseFloat(
                          resumenIngresos.cobranza?.transferenciamonto
                        ),
                        "$"
                      )}
                    </td>
                  </tr>
                  <tr
                    className="rep-ing__tr"
                    onClick={() => {
                      handleShow();
                      setDetalleIngresos(resumenIngresos.anticipo);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="rep-ing__td">Anticipo</td>
                    <td className="rep-ing__td">Oficina</td>
                    <td className="rep-ing__td">
                      {resumenIngresos.anticipo?.oficina}
                    </td>
                    <td className="rep-ing__td">
                      {formatNumero(
                        parseFloat(resumenIngresos.anticipo?.oficinamonto),
                        "$"
                      )}
                    </td>
                  </tr>
                  <tr
                    className="rep-ing__tr"
                    onClick={() => {
                      handleShow();
                      setDetalleIngresos(resumenIngresos.anticipo);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="rep-ing__td"></td>
                    <td className="rep-ing__td">Transferencia</td>
                    <td className="rep-ing__td">
                      {resumenIngresos.anticipo?.transferencia}
                    </td>
                    <td className="rep-ing__td">
                      {formatNumero(
                        parseFloat(
                          resumenIngresos.anticipo?.transferenciamonto
                        ),
                        "$"
                      )}
                    </td>
                  </tr>
                  <tr className="rep-ing__tr">
                    <td className="rep-ing__td">Total</td>
                    <td className="rep-ing__td"></td>
                    <td className="rep-ing__td">
                      {resumenIngresos?.suma_numero}
                    </td>
                    <td className="rep-ing__td">
                      {formatNumero(
                        parseFloat(resumenIngresos?.suma_importe),
                        "$"
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
        </Row>
        <Modal
          width={900}
          height={600}
          title="Detalles de las solicitudes"
          visible={show}
          onCancel={handleClose}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          {detalleIngresos.detalle != undefined && (
            <>
              <Table>
                <thead>
                  <th>No.</th>
                  <th>Folio</th>
                  <th>Nombre</th>
                  <th>Telefono</th>
                  <th>Monto Pagado</th>
                  <th>Fecha</th>
                  <th>Tipo de pago</th>
                </thead>
                <tbody>
                  {detalleIngresos.detalle.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item["pago_folio"]}</td>
                        <td>
                          {item["usuario_cliente"][0]["primer_nombre"] + " "}
                          {item["usuario_cliente"][0]["primer_apellido"] + " "}
                          {item["usuario_cliente"][0]["segundo_apellido"]}
                        </td>
                        <td>
                          {item["usuario_cliente"][0]["telefono_celular"]}
                        </td>
                        <td>
                          {formatNumero(parseFloat(item["monto_pagado"]), "$")}
                        </td>
                        <td>{item["fecha_pago"]}</td>
                        <td>{item["sistema_pago"]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </>
          )}
        </Modal>
      </div>
    </>
  );
}
