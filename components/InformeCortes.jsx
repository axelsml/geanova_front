"use client";

import { useEffect, useState } from "react";
import { formatPrecio } from "@/helpers/formatters";
import Loader80 from "@/components/Loader80";
import TablaInformeCortes from "./TablaInformeCortes";
import Swal from "sweetalert2";

import {
  Button,
  Col,
  Row,
  Form,
  Select,
  Modal,
  Typography,
  Checkbox,
  Input,
} from "antd";
const { Text } = Typography;

import terrenosService from "@/services/terrenosService";
import pagosService from "@/services/pagosService";

export default function InformeCortes() {
  const [loading, setLoading] = useState(false);

  const { Text } = Typography;
  const { Option } = Select;
  const opcion = [{ index: 0, id: 0, nombre: "Todos" }];

  const [terrenos, setTerrenos] = useState([]);
  const [financiamientos, setFinanciamientos] = useState([]);
  const [sistemasPago, setSistemasPago] = useState([]);

  const [informe, setInforme] = useState(null);
  const [total, setTotal] = useState(null);

  const [terreno, setTerreno] = useState(0);
  const [mes, setMes] = useState(1);
  const [financiamiento, setFinanciamiento] = useState(0);
  const [sistemaPago, setSistemaPago] = useState(0);
  // const [actualizar, setActualizar] = useState(false);

  const months = [
    { id: 1, nombre: "1 MES" },
    { id: 2, nombre: "2 MESES" },
    { id: 3, nombre: "3 MESES" },
    { id: 4, nombre: "4 MESES" },
    { id: 5, nombre: "5 MESES" },
    { id: 6, nombre: "6 MESES" },
    { id: 7, nombre: "7 MESES" },
    { id: 8, nombre: "8 MESES" },
    { id: 9, nombre: "9 MESES" },
    { id: 10, nombre: "10 MESES" },
    { id: 11, nombre: "11 MESES" },
    { id: 12, nombre: "12 MESES" },
  ];

  useEffect(() => {
    terrenosService.getTerrenos(setTerrenos, Error);
    pagosService.getTiposFinanciamiento(setFinanciamientos, Error);
    pagosService.getSistemasPago(setSistemasPago, Error);
  }, []);

  const onError = (e) => {
    setLoading(false);
    console.log(e);
  };

  const handleSearch = () => {
    setLoading(true);
    let params = {
      terreno_id: terreno,
      meses: mes,
      financiamiento_id: financiamiento,
      sistema_pago_id: sistemaPago,
      // actualizar: actualizar,
    };
    debugger;
    pagosService.getInformeCortes(params, onInforme, onError);
  };

  async function onInforme(data) {
    setLoading(false);
    if (data.response.success) {
      setInforme(data.response.informe);
      setTotal(data.response.total);
    } else {
      Swal.fire({
        title: "Busqueda sin éxito",
        icon: "warning",
        text: data.response.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
      setInforme(null);
      setTotal(null);
    }
  }

  return (
    <>
      {loading && (
        <>
          <Loader80 />
        </>
      )}
      {/* FILTROS */}
      <div style={{ margin: "16px" }}>
        <Row justify={"center"}>
          <Col className="titulo_pantallas">
            <b>Informe de Cortes</b>
          </Col>
        </Row>
      </div>
      <div>
        <Row
          justify={"center"}
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
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
                style={{ width: 200 }}
                placeholder="Seleccione un Proyecto"
                onChange={(value) => {
                  setTerreno(value);
                }}
              >
                {terrenos &&
                  opcion.map((item) => (
                    <Option key={item.id} value={item.id} label={item.nombre}>
                      {item?.nombre}
                    </Option>
                  ))}
                {terrenos?.map((item) => (
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
                style={{ width: 200 }}
                placeholder="Seleccione un rango"
                onChange={(value) => {
                  setMes(value);
                }}
              >
                {months.map((item) => (
                  <Option key={item.id} value={item.id} label={item.nombre}>
                    {item.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ textAlign: "center", margin: "0px 5px 0px 5px" }}>
            <Form.Item>
              <p>
                <Text>Seleccionar Financiamiento</Text>
              </p>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Seleccione un Financiamiento"
                onChange={(value) => {
                  setFinanciamiento(value);
                }}
              >
                {financiamientos &&
                  opcion.map((item) => (
                    <Option key={item.id} value={item.id} label={item.nombre}>
                      {item?.nombre}
                    </Option>
                  ))}
                {financiamientos?.map((item) => (
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
                style={{ width: 200 }}
                placeholder="Seleccione un Sistema de Pago"
                onChange={(value) => {
                  setSistemaPago(value);
                }}
              >
                {sistemasPago &&
                  opcion.map((item) => (
                    <Option key={item.id} value={item.id} label={item.nombre}>
                      {item?.nombre}
                    </Option>
                  ))}
                {sistemasPago?.map((item) => (
                  <Option key={item.id} value={item.id} label={item.Nombre}>
                    {item?.Nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {/* <Row justify={"center"}>
          <Col>
            <Form.Item label="Actualizar ">
              <Checkbox
                onChange={() => {
                  setActualizar(!actualizar);
                }}
              />
            </Form.Item>
          </Col>
        </Row> */}
        <Row justify={"center"}>
          <Form.Item>
            <Button
              size="large"
              onClick={() => {
                handleSearch();
              }}
            >
              Buscar
            </Button>
          </Form.Item>
        </Row>
      </div>
      {/* INPUTS DISABLED */}
      <div>
        {total && (
          <Row
            justify={"center"}
            style={{ margin: "16px", justifyContent: "space-evenly" }}
          >
            <Col
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <span style={{ fontFamily: "sans-serif" }}>
                Importe Total Acumulado
              </span>
              <Input
                style={{
                  width: "200px",
                  textAlign: "center",
                  backgroundColor: "#C8D1DB",
                  color: "black",
                }}
                disabled
                value={
                  total ? `$ ${formatPrecio(total.total_importe_acumulado)}` : 0
                }
              />
            </Col>
            <Col
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <span style={{ fontFamily: "sans-serif" }}>
                Importes al día <b>{total?.numero_dia}</b>
              </span>
              <Input
                style={{
                  width: "200px",
                  textAlign: "center",
                  backgroundColor: "#C8D1DB",
                  color: "black",
                }}
                disabled
                value={total ? `$ ${formatPrecio(total.importes_al_dia)}` : 0}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <span style={{ fontFamily: "sans-serif" }}>
                Importes promedio al día <b>{total?.numero_dia}</b>
              </span>
              <Input
                style={{
                  width: "200px",
                  textAlign: "center",
                  backgroundColor: "#C8D1DB",
                  color: "black",
                }}
                disabled
                value={
                  total
                    ? `$ ${formatPrecio(total.total_importe_promedio_al_dia)}`
                    : 0
                }
              />
            </Col>
            <Col
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <span style={{ fontFamily: "sans-serif" }}>
                Recibos Totales Acumulados
              </span>
              <Input
                style={{
                  width: "200px",
                  textAlign: "center",
                  backgroundColor: "#C8D1DB",
                  color: "black",
                }}
                disabled
                value={total ? total.total_recibo_acumulado : 0}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <span style={{ fontFamily: "sans-serif" }}>
                Recibos al día <b>{total?.numero_dia}</b>
              </span>
              <Input
                style={{
                  width: "200px",
                  textAlign: "center",
                  backgroundColor: "#C8D1DB",
                  color: "black",
                }}
                disabled
                value={total ? total.recibos_al_dia : 0}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <span style={{ fontFamily: "sans-serif" }}>
                Recibos promedio al día <b>{total?.numero_dia}</b>
              </span>
              <Input
                style={{
                  width: "200px",
                  textAlign: "center",
                  backgroundColor: "#C8D1DB",
                  color: "black",
                }}
                disabled
                value={total ? total.total_recibos_promedio_al_dia : 0}
              />
            </Col>
          </Row>
        )}
      </div>
      {/* TABLAS */}
      <div>
        <Row justify={"center"} style={{ display: "flex" }}>
          {informe &&
            informe.map((item, index) => (
              <TablaInformeCortes key={index} informe={item} />
            ))}
        </Row>
      </div>
    </>
  );
}
