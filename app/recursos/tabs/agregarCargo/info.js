"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";

import Swal from "sweetalert2";

import Loader80 from "@/components/Loader80";
import recursosService from "@/services/recursosService";
import { formatDate, formatPrecio } from "@/helpers/formatters";
import { getCookiePermisos } from "@/helpers/valorPermisos";

import locale from "antd/lib/date-picker/locale/es_ES";

export default function AgregarCargo() {
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState([]);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [cookiePermisos, setCookiePermisos] = useState(0);

  const [form] = Form.useForm();

  useEffect(() => {
    recursosService
      .showTipoMovimientoManejo(setDatos, onError)
      .then(() => {
        setLoading(false);
      });

    getCookiePermisos(
      "agregar cargo",
      setCookiePermisos
    );
  }, []);

  const onError = (error) => {
    setLoading(false);

    console.error(
      "AgregarCargo:",
      error
    );

    const detalle =
      error && error.message
        ? error.message
        : String(error || "");

    setErrorMessage(
      "Error al realizar la operación" +
        (detalle ? ": " + detalle : ".")
    );
  };

  const obtenerUsuarioId = () => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const storedUsuario =
        window.localStorage.getItem("usuario");

      if (!storedUsuario) {
        return null;
      }

      const usuario =
        JSON.parse(storedUsuario);

      return usuario && usuario.id
        ? usuario.id
        : null;
    } catch (error) {
      console.error(
        "No fue posible leer el usuario:",
        error
      );

      return null;
    }
  };

  async function onFinish(data) {
    const usuarioId =
      obtenerUsuarioId();

    if (!usuarioId) {
      Swal.fire({
        title: "Sesión no disponible",
        icon: "warning",
        text: "No fue posible identificar al usuario que está registrando el cargo.",
        confirmButtonText: "Aceptar",
      });

      return;
    }

    const folio =
      String(data.folio || "").trim();

    const forms = {
      fecha: formatDate(data.fecha),
      monto: Number(data.monto || 0),
      comentario:
        "Pago de cliente con folio: " +
        folio,
      tipoCargo: data.tipoCargo,
      usuarioCreacion: usuarioId,
    };

    const result =
      await Swal.fire({
        title: "¿Guardar nuevo cargo?",
        icon: "question",
        html:
          '<div style="text-align:left">' +
          "<b>Monto:</b> $" +
          formatPrecio(forms.monto) +
          "<br/><br/>" +
          "<b>Concepto:</b> " +
          forms.comentario +
          "</div>",
        confirmButtonColor: "#438dcc",
        cancelButtonColor: "#64748b",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
      });

    if (!result.isConfirmed) {
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setMessage(null);

    recursosService.agregarCargo(
      onCargoGuardado,
      forms,
      onError
    );
  }

  const onCargoGuardado = (data) => {
    setLoading(false);

    if (data.type === "success") {
      form.resetFields();

      setMessage({
        type: data.type,
        message: data.message,
      });

      Swal.fire({
        title: "Cargo guardado",
        icon: "success",
        text:
          data.message ||
          "El cargo se registró correctamente.",
        confirmButtonColor: "#438dcc",
        confirmButtonText: "Aceptar",
      });

      return;
    }

    Swal.fire({
      title: "Error",
      icon: "error",
      text:
        data.message ||
        "No fue posible guardar el cargo.",
      confirmButtonColor: "#438dcc",
      confirmButtonText: "Aceptar",
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === " ") {
      event.preventDefault();
    }
  };

  return (
    <div className="resource-form-page">
      {loading && <Loader80 />}

      <div className="resource-section-header">
        <div>
          <span className="resource-section-header__eyebrow">
            MOVIMIENTO MANUAL
          </span>

          <h2 className="resource-section-header__title">
            Agregar cargo
          </h2>

          <p className="resource-section-header__description">
            Registra un cargo asociado a un cliente y clasifícalo
            dentro de los movimientos de recursos.
          </p>
        </div>
      </div>

      <div className="resource-form-card">
        {message && !errorMessage && (
          <Alert
            className="resource-alert"
            message="Cargo registrado"
            description={message.message}
            type="success"
            showIcon
            closable
            onClose={() => setMessage(null)}
          />
        )}

        {errorMessage && (
          <Alert
            className="resource-alert"
            message="Error"
            description={errorMessage}
            type="error"
            showIcon
            closable
            onClose={() => setErrorMessage("")}
          />
        )}

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          className="resource-form"
        >
          <div className="resource-form-grid">
            <Form.Item
              label="Fecha"
              name="fecha"
              rules={[
                {
                  required: true,
                  message:
                    "Debe ingresar una fecha del cargo.",
                },
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                locale={locale}
                style={{ width: "100%" }}
                size="large"
                placeholder="Seleccione la fecha"
              />
            </Form.Item>

            <Form.Item
              label="Monto del cargo"
              name="monto"
              rules={[
                {
                  required: true,
                  message:
                    "Debe ingresar un monto del cargo.",
                },
                {
                  type: "number",
                  min: 0.01,
                  message:
                    "El monto debe ser mayor a cero.",
                },
              ]}
            >
              <InputNumber
                size="large"
                min={0.01}
                precision={2}
                style={{ width: "100%" }}
                prefix="$"
                 
                placeholder="0.00"
                formatter={(value) =>
                  value === undefined ||
                  value === null
                    ? ""
                    : formatPrecio(value)
                }
                parser={(value) =>
                  String(value || "").replace(
                    /\$\s?|(,*)/g,
                    ""
                  )
                }
              />
            </Form.Item>

            <Form.Item
              label="Folio del cliente"
              name="folio"
              rules={[
                {
                  required: true,
                  message:
                    "Debe ingresar el folio del cliente.",
                },
              ]}
            >
              <Input
                size="large"
                addonBefore="Pago de cliente con folio:"
                placeholder="Folio"
                onKeyDown={handleKeyPress}
              />
            </Form.Item>

            <Form.Item
              label="Tipo de cargo"
              name="tipoCargo"
              rules={[
                {
                  required: true,
                  message:
                    "Debe seleccionar un tipo de cargo.",
                },
              ]}
            >
              <Select
                size="large"
                showSearch
                optionFilterProp="children"
                placeholder="Seleccione un tipo de cargo"
              >
                {datos
                  .filter(
                    (option) =>
                      option.tipo_ingreso != 1
                  )
                  .map((option) => (
                    <Select.Option
                      key={option.id}
                      value={option.id}
                    >
                      {option.descripcion}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </div>

          <div className="resource-form-footer">
            <span className="resource-form-footer__hint">
              Los campos son obligatorios.
            </span>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="resource-primary-button"
              disabled={
                Number(cookiePermisos || 0) < 2
              }
            >
              Guardar cargo
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
