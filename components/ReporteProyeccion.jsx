"use client";

import { useEffect, useState } from "react";
import cobranzaService from "@/services/cobranzaService";
import terrenosService from "@/services/terrenosService";
import pagosService from "@/services/pagosService";

import Loader80 from "@/components/Loader80";
import { formatPrecio } from "@/helpers/formatters";
import Swal from "sweetalert2";
import TableInCol from "./TableInCol";

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

  const [data, setData] = useState(null);
  const [dataMensual, setDataMensual] = useState(null);
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
      setData(data.response);
      setDataMensual(data.resumenes_mensuales);
      debugger;
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
      setData(null);
      setDataMensual(null);
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

      {data != null && (
        <div style={{ margin: "0  auto" }}>
          <Row style={{ marginTop: "24px" }}>
            <Col className="tabla" style={{ margin: "0 auto" }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow className="tabla_encabezado">
                      <TableCell colSpan={4}>
                        <p style={{ textAlign: "center", fontWeight: "bold" }}>
                          {mesNombre}
                        </p>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                          Financiamiento
                        </p>
                      </TableCell>
                      <TableCell>
                        <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                          Clientes
                        </p>
                      </TableCell>
                      <TableCell>
                        <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                          Monto Proyectado
                        </p>
                      </TableCell>
                      <TableCell>
                        <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                          Termino Contrato
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <p>Mensuales</p>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {data?.numero_solicitudes_mensuales}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        ${" "}
                        {formatPrecio(
                          parseFloat(data?.monto_solicitudes_mensuales)
                        )}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {data?.termina_contrato_solicitudes_mensuales}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <p>Quincenales</p>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {data?.numero_solicitudes_quincenales}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        ${" "}
                        {formatPrecio(
                          parseFloat(data?.monto_solicitudes_quincenales)
                        )}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {data?.termina_contrato_solicitudes_quincenales}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <p>Semanales</p>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {data?.numero_solicitudes_semanales}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        ${" "}
                        {formatPrecio(
                          parseFloat(data?.monto_solicitudes_semanales)
                        )}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {data?.termina_contrato_solicitudes_semanales}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <p style={{ fontWeight: "bold" }}>Total: </p>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {data?.total_solicitudes}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        $ {formatPrecio(parseFloat(data?.total_montos))}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {data?.total_contratos}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Col>
          </Row>
        </div>
      )}

      {dataMensual && (
        <div style={{ margin: "0 auto" }}>
          <Row style={{ display: "flex", justifyContent: "center" }}>
            {dataMensual.map((item, index) => (
              <TableInCol key={index} data={item} />
            ))}
          </Row>
        </div>
      )}
    </>
  );
}
