"use client";

import { Button, DatePicker, Col, Row, Select, Modal } from "antd";
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
  const handleClose = () => setShow(false);

  const [fechaInicial, setFechaInicial] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);

  const [proyectos, setProyectos] = useState([]);
  const [proyectoID, setProyectoID] = useState(null);

  const [anticipo, setAnticipo] = useState({});
  const [efectivo, setEfectivo] = useState({});
  const [transferencia, setTransferencia] = useState({});
  const [total, setTotal] = useState({});
  const [detalles, setDetalles] = useState([]);

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
    setLoading(true);

    pagosService.getReporteIngresos(params, onReporte, onError);
  }

  async function onReporte(data) {
    setLoading(false);
    if (data.total.numero != 0) {
      setAnticipo(data.anticipo);
      setEfectivo(data.cobranza_efectivo);
      setTransferencia(data.cobranza_terminal);
      setTotal(data.total);
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No se encontraron registros con la información solicitada",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
    }
  }

  const onError = (e) => {
    setLoading(false);
  };

  var formatNumero = function (n, currency) {
    return currency + "" + n.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  };

  return (
    <>
      {loading && (
        <>
          <Loader80 />
        </>
      )}
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
            <Button className="boton" onClick={handleSearchButton}>
              BUSCAR
            </Button>
          </Col>
        </Row>

        <Row
          style={{ paddingTop: "20px" }}
          justify={"center"}
          className="m-auto"
        >
          <Col className="titulo_pantallas">
            <b>Reporte de Ingresos</b>
          </Col>
        </Row>
        <Row
          justify={"center"}
          className="m-auto"
          style={{ marginTop: "20px" }}
        >
          <Col xs={26} sm={20} md={16} lg={9} xl={9} xxl={9}>
            <TableContainer className="tabla">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Concepto</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Número</TableCell>
                    <TableCell>Importe</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setDetalles(efectivo.detalle);
                      setShow(true);
                    }}
                  >
                    <TableCell>Cobranza</TableCell>
                    <TableCell>Efectivo</TableCell>
                    <TableCell>{efectivo.numero}</TableCell>
                    <TableCell>
                      {!isNaN(parseFloat(efectivo.importe))
                        ? formatNumero(parseFloat(efectivo.importe), "$")
                        : "$ 0.0"}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setDetalles(transferencia.detalle);
                      setShow(true);
                    }}
                  >
                    <TableCell></TableCell>
                    <TableCell>Transferencia</TableCell>
                    <TableCell>{transferencia.numero}</TableCell>
                    <TableCell>
                      {!isNaN(parseFloat(transferencia.importe))
                        ? formatNumero(parseFloat(transferencia.importe), "$")
                        : "$ 0.0"}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setDetalles(anticipo.detalle);
                      setShow(true);
                    }}
                  >
                    <TableCell>Anticipo</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{anticipo.numero}</TableCell>
                    <TableCell>
                      {!isNaN(parseFloat(anticipo.importe))
                        ? formatNumero(parseFloat(anticipo.importe), "$")
                        : "$ 0.0"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{total.numero}</TableCell>
                    <TableCell>
                      {!isNaN(parseFloat(total.importe))
                        ? formatNumero(parseFloat(total.importe), "$")
                        : "$ 0.0"}
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow></TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Col>
        </Row>
        <Modal
          width={900}
          height={600}
          title=""
          visible={show}
          onCancel={handleClose}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <Row
            style={{ paddingTop: "20px" }}
            justify={"center"}
            className="m-auto"
          >
            <Col className="formulario">
              <b>Detalles de las solicitudes</b>
            </Col>
          </Row>
          {detalles?.length != 0 && (
            <>
              <Row
                justify={"center"}
                className="m-auto"
                style={{ marginTop: "20px" }}
              >
                <Col xs={22} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <TableContainer className="tabla">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Lote</TableCell>
                          <TableCell>Nombre Cliente</TableCell>
                          <TableCell>Monto Pagado</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detalles?.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.info_lote.lote}</TableCell>
                            <TableCell>
                              {item.info_cliente.nombre_completo}
                            </TableCell>
                            <TableCell>
                              ${formatPrecio(parseFloat(item.info_pago))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow></TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Col>
              </Row>
            </>
          )}
        </Modal>
      </div>
    </>
  );
}
