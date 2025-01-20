"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Input,
  Button,
  Form,
  Select,
  DatePicker,
  Alert,
  Space,
} from "antd";
import { LoadingContext } from "@/contexts/loading";
import Swal from "sweetalert2";
import recursosService from "@/services/recursosService";
import { formatDate } from "@/helpers/formatters";
import locale from "antd/lib/date-picker/locale/es_ES"; // Importa el locale que desees
import { getCookiePermisos } from "@/helpers/valorPermisos";

export default function AgregarCargo() {
  const contextValue = useContext(LoadingContext);
  const { setIsLoading, setType } = contextValue;
  const [datos, setDatos] = useState([]);
  const [message, setMessage] = useState("");
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const storedUsuario = window.localStorage.getItem("usuario");
  const [cookiePermisos, setCookiePermisos] = useState([]);
  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
    if (e.message) {
      setErrorMessage(
        `Error al realizar la consulta, favor de revisar: ${e.message}`
      );
    } else {
      setErrorMessage(`Error al realizar la consulta, favor de revisar ${e}`);
    }
  };

  useEffect(() => {
    recursosService.showTipoMovimientoManejo(setDatos, onError).then(() => {
      setIsLoading(false);
    });

    getCookiePermisos("agregar cargo", setCookiePermisos);
  }, []);

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
  const dateFormat = "DD/MM/YYYY";

  async function onFinish(data) {
    const usuarioId = JSON.parse(storedUsuario).id;
    let forms = {
      fecha: formatDate(data.fecha),
      monto: data.monto,
      comentario: data.comentario,
      tipoCargo: data.tipoCargo,
      usuarioCreacion: usuarioId,
    };

    await Swal.fire({
      title: "Guardar nuevo cargo?",
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        setType(80);
        recursosService.agregarCargo(onCargoGuardado, forms, onError);
      }
    });
  }

  const onCargoGuardado = (data) => {
    setIsLoading(false);
    if (data.type == "success") {
      form.resetFields();
      setMessage({
        type: data.type,
        message: data.message,
      });
      Swal.fire({
        title: "Cargo guardado con éxito",
        icon: "success",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: data.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === " ") {
      event.preventDefault();
    }
  };
  return (
    <div>
      <Row justify={"center"}>
        <Typography.Title level={3}>Agregar Cargo</Typography.Title>
      </Row>
      <Row justify={"center"}>
        <Form
          {...layout}
          style={{
            maxWidth: 600,
          }}
          form={form}
          onFinish={onFinish}
        >
          {Object.keys(message).length > 0 && errorMessage.length == 0 && (
            <Row style={{ paddingTop: 10, paddingBottom: 25 }}>
              <Alert
                style={{ width: "100%" }}
                message={message.type}
                description={message.message}
                type="success"
                showIcon
                closable
              />
            </Row>
          )}
          {errorMessage.length > 0 && (
            <Row style={{ paddingTop: 10, paddingBottom: 25 }}>
              <Alert
                style={{ width: "100%" }}
                message={"Error"}
                description={errorMessage}
                showIcon
                type="error"
                closable
              />
            </Row>
          )}
          <Row justify={"center"} gutter={16}>
            <Col xs={24} sm={18}>
              <Form.Item
                label="Fecha"
                name="fecha"
                rules={[
                  {
                    required: true,
                    message: "Debe ingresar una fecha del cargo.",
                  },
                ]}
              >
                <DatePicker
                  format={dateFormat}
                  locale={locale}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={18}>
              <Form.Item
                label="Monto del Cargo"
                name="monto"
                rules={[
                  {
                    required: true,
                    message: "Debe ingresar un monto del cargo.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={18}>
              <Form.Item
                label="Concepto del Cargo"
                name="comentario"
                rules={[
                  {
                    required: true,
                    message: "Debe ingresar un concepto del cargo.",
                  },
                ]}
              >
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    value={"Pago de cliente con folio: "}
                    defaultValue={"Pago de cliente con folio: "}
                    disabled
                  />
                  <Input placeholder="folio" onKeyDown={handleKeyPress} />
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col xs={24} sm={18}>
              <Form.Item
                label="Tipo de Cargo"
                name="tipoCargo"
                rules={[
                  {
                    required: true,
                    message: "Debe seleccionar un tipo del cargo.",
                  },
                ]}
              >
                <Select style={{ width: "100%" }}>
                  {datos.map(
                    (option) =>
                      option.tipo_ingreso != 1 && (
                        <Select.Option key={option.id} value={option.id}>
                          {option.descripcion}
                        </Select.Option>
                      )
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={18}>
              <div
                className="terreno-edit__botones-footer"
                style={{ paddingBottom: 15 }}
              >
                <span className="flex gap-2 justify-end">
                  <Button
                    className="boton"
                    disabled={cookiePermisos >= 2 ? false : true}
                    htmlType="submit"
                  >
                    Guardar
                  </Button>
                </span>
              </div>
            </Col>
          </Row>
        </Form>
      </Row>
    </div>
  );
}
