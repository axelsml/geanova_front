"use client";

import { useEffect, useState } from "react";
import terrenosService from "@/services/terrenosService";
import pagosService from "@/services/pagosService";

import Loader80 from "@/components/Loader80";
import { formatPrecio } from "@/helpers/formatters";
import Swal from "sweetalert2";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Button, Col, Form, Row, Select, Typography } from "antd";

export default function ReporteProyeccion() {
  const { Option } = Select;
  const { Text } = Typography;
  const [loading, setLoading] = useState(false);

  const [general, setGeneral] = useState(null);
  const [mensual, setMensual] = useState(null);

  const [terrenos, setTerrenos] = useState([]);
  const [tiposFinanciamiento, setTiposFinanciamiento] = useState([]);
  const [tiposSistemaPago, setTiposSistemaPago] = useState([]);

  const opcion = [{ index: 0, id: 0, nombre: "Todos" }];

  const [mesNombre, setMesNombre] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [financiamientoSeleccionado, setFinanciamientoSeleccionado] =
    useState(null);
  const [sistemaPagoSeleccionado, setSistemaPagoSeleccionado] = useState(null);

  const months = [
    { value: 1, label: "1 MES" },
    { value: 2, label: "2 MESES" },
    { value: 3, label: "3 MESES" },
    { value: 4, label: "4 MESES" },
    { value: 5, label: "5 MESES" },
    { value: 6, label: "6 MESES" },
    { value: 7, label: "7 MESES" },
    { value: 8, label: "8 MESES" },
    { value: 9, label: "9 MESES" },
    { value: 10, label: "10 MESES" },
    { value: 11, label: "11 MESES" },
    { value: 12, label: "12 MESES" },
  ];

  const today = new Date();
  const year = today.getFullYear();
  const last_year = year + 5;

  const years = [];
  for (let i = year; i <= last_year; i++) {
    years.push({ value: i, label: `${i}` });
  }

  useEffect(() => {
    terrenosService.getTerrenos(setTerrenos, Error);
    pagosService.getTiposFinanciamiento(setTiposFinanciamiento, Error);
    pagosService.getSistemasPago(setTiposSistemaPago, Error);
  }, []);

  const onError = (e) => {
    setLoading(false);
    Swal.fire({
      title: "ERROR",
      icon: "error",
      text: "error: " + e,
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: false,
      confirmButtonText: "Aceptar",
    });
  };

  const getMonthName = (numero, months) => {
    const selectedMonthObj = months.find((month) => month.value === numero);
    return selectedMonthObj ? selectedMonthObj.label : "Todos";
  };

  function handleSearch() {
    setLoading(true);
    let params = {
      terreno_id: terrenoSelected,
      meses: selectedMonth,
      financiamiento_id: financiamientoSeleccionado,
      sistema_pago_id: sistemaPagoSeleccionado,
    };
    pagosService.getResumenProyeccion(params, onResumen, onError);
  }

  async function onResumen(data) {
    setLoading(false);
    if (data.success) {
      setGeneral(data.resumen_general);
      setMensual(data.resumenes_mensuales);
    } else {
      Swal.fire({
        title: "Aviso",
        icon: "warning",
        text: data.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
      setGeneral(null);
      setMensual(null);
    }
  }

  return (
    <>
      {loading && (
        <>
          <Loader80 />
        </>
      )}
      <div
        style={{ margin: "0 auto", display: "flex", flexDirection: "column" }}
      >
        <Row justify={"center"} style={{ margin: "12px 0px 24px 0px" }}>
          <Col className="titulo_pantallas">
            <Text>
              <b style={{ color: "white", fontSize: "18px", padding: "8px" }}>
                RESUMEN DE PROYECCION
              </b>
            </Text>
          </Col>
        </Row>
        <Row style={{ display: "flex", justifyContent: "space-around" }}>
          <Col
            style={{
              textAlign: "center",
              margin: "0px 5px 0px 5px",
            }}
          >
            <Form.Item>
              <p>
                <Text>Seleccionar Proyecto</Text>
              </p>
              <Select
                showSearch
                placeholder="Seleccione un Proyecto"
                optionLabelProp="label"
                onChange={(value) => setTerrenoSelected(value)}
                style={{ width: 200 }}
              >
                {terrenos &&
                  opcion.map((item, index) => (
                    <Option key={item.id} value={item.id} label={item.nombre}>
                      {item?.nombre}
                    </Option>
                  ))}
                {terrenos?.map((item, index) => (
                  <Option key={item.id} value={item.id} label={item.nombre}>
                    {item?.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ textAlign: "center", margin: "0px 5px 0px 5px" }}>
            <Form.Item>
              <p>
                <Text>Seleccionar rango de Meses</Text>
              </p>
              <Select
                showSearch
                placeholder="Seleccione un rango"
                optionLabelProp="label"
                onChange={(value) => {
                  setSelectedMonth(value);
                }}
                options={months}
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
          <Col
            style={{
              textAlign: "center",
              margin: "0px 5px 0px 5px",
            }}
          >
            <Form.Item>
              <p>
                <Text>Seleccionar Financiamiento</Text>
              </p>
              <Select
                showSearch
                placeholder="Seleccione un Financiamiento"
                optionLabelProp="label"
                onChange={(value) => setFinanciamientoSeleccionado(value)}
                style={{ width: 200 }}
              >
                {tiposFinanciamiento &&
                  opcion.map((item, index) => (
                    <Option key={item.id} value={item.id} label={item.nombre}>
                      {item?.nombre}
                    </Option>
                  ))}
                {tiposFinanciamiento?.map((item, index) => (
                  <Option
                    key={item.id}
                    value={item.id}
                    label={item.descripcion}
                  >
                    {item?.descripcion}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col
            style={{
              textAlign: "center",
              margin: "0px 5px 0px 5px",
            }}
          >
            <Form.Item>
              <p>
                <Text>Seleccionar Sistema de Pago</Text>
              </p>
              <Select
                showSearch
                placeholder="Seleccione un Sistema de Pago"
                optionLabelProp="label"
                onChange={(value) => setSistemaPagoSeleccionado(value)}
                style={{ width: 200 }}
              >
                {tiposSistemaPago &&
                  opcion.map((item, index) => (
                    <Option key={item.id} value={item.id} label={item.nombre}>
                      {item?.nombre}
                    </Option>
                  ))}
                {tiposSistemaPago?.map((item, index) => (
                  <Option key={item.id} value={item.id} label={item.Nombre}>
                    {item?.Nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Button
            className="boton"
            style={{ margin: "0 auto", backgroundColor: "67, 141, 204" }}
            size="large"
            onClick={() => {
              handleSearch();
              setMesNombre(getMonthName(selectedMonth, months));
            }}
          >
            Buscar
          </Button>
        </Row>
      </div>

      {general != null && mensual != null && (
        <div style={{ margin: "0  auto" }}>
          <Text style={{ margin: "auto", textAlign: "center" }}>
            <h3 style={{ marginTop: "16px", color: "rgb(67, 141, 204)" }}>
              {mesNombre}
            </h3>
          </Text>
          <Row style={{ marginTop: "24px" }}>
            <Col className="tabla" style={{ margin: "0 auto" }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow style={{ backgroundColor: "rgb(67, 141, 204)" }}>
                      <TableCell
                        colSpan={5}
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#FFFFFF",
                        }}
                      >
                        Financiamiento
                      </TableCell>
                      <TableCell
                        colSpan={4}
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#FFFFFF",
                        }}
                      >
                        Monto Proyectado
                      </TableCell>
                    </TableRow>
                    <TableRow style={{ backgroundColor: "rgb(67, 141, 204)" }}>
                      <TableCell
                        style={{ fontWeight: "bold", color: "#FFFFFF" }}
                      >
                        Mes
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "bold", color: "#FFFFFF" }}
                      >
                        Mensuales
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "bold", color: "#FFFFFF" }}
                      >
                        Quincenales
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "bold", color: "#FFFFFF" }}
                      >
                        Semanales
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "bold", color: "#FFFFFF" }}
                      >
                        Total clientes
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "bold", color: "#FFFFFF" }}
                      >
                        Mensuales
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "bold", color: "#FFFFFF" }}
                      >
                        Quincenales
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "bold", color: "#FFFFFF" }}
                      >
                        Semanales
                      </TableCell>
                      <TableCell
                        style={{ fontWeight: "bold", color: "#FFFFFF" }}
                      >
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mensual?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ fontWeight: "bold" }}>
                          {item.nombre_mes}
                        </TableCell>
                        <TableCell>
                          {item.numero_solicitudes_mensuales}
                        </TableCell>
                        <TableCell>
                          {item.numero_solicitudes_quincenales}
                        </TableCell>
                        <TableCell>
                          {item.numero_solicitudes_semanales}
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          {item.total_solicitudes}
                        </TableCell>
                        <TableCell>
                          {`$ ${formatPrecio(
                            item.monto_solicitudes_mensuales
                          )}`}
                        </TableCell>
                        <TableCell>
                          {`$ ${item.monto_solicitudes_quincenales}`}
                        </TableCell>
                        <TableCell>
                          {`$ ${item.monto_solicitudes_semanales}`}
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                        >{`$ ${item.total_montos}`}</TableCell>
                      </TableRow>
                    ))}
                    {general && (
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Totales
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          {general.total_clientes_mensuales}
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          {general.total_clientes_quincenales}
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          {general.total_clientes_semanales}
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          {general.total_clientes}
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          {`$ ${formatPrecio(
                            general.total_importes_mensuales
                          )}`}
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          {`$ ${formatPrecio(
                            general.total_importes_quincenales
                          )}`}
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          {`$ ${formatPrecio(
                            general.total_importes_semanales
                          )}`}
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold" }}
                        >{`$ ${formatPrecio(
                          general.total_importes
                        )}`}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}
