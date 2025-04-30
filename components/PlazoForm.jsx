"use client";

import { Button, Form, InputNumber, Col, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import Swal from "sweetalert2";
import InputIn from "./Input";
import Loader from "./Loader";
import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import plazosService from "@/services/plazosService";
import { formatPrecio } from "@/helpers/formatters";

const PlazosForm = forwardRef(({ terrenoId }, ref) => {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      form.resetFields();
    },
  }));

  const onGuardarPlazo = (values) => {
    Swal.fire({
      title: "Verifique que los datos sean correctos",
      icon: "info",
      html: `Cantidad de meses: ${
        values.cantidadMeses
      }<br/><br/>Precio por m<sup>2</sup>: $${formatPrecio(values.precio)}`,
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        plazosService.createPlazo(
          { ...values, terreno_id: terrenoId },
          onPlazoGuardado,
          onerror
        );
      }
    });
  };

  const handleCancel = async () => {
    Swal.fire({
      title: "¿Desea cancelar el proceso?",
      icon: "info",
      text: "Se eliminarán los datos ingresados",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        form.resetFields();
      }
    });
  };

  const validacionMensajes = {
    required: "${label} es requerido",
    types: {
      number: "${label} no es un número válido!",
    },
    number: {
      min: "${label} no puede ser menor a ${min}",
    },
  };

  const onPlazoGuardado = (data) => {
    setLoading(false);
    if (data.success) {
      Swal.fire({
        title: "Guardado con Éxito",
        icon: "success",
        confirmButtonColor: "#4096ff",
        confirmButtonText: "Aceptar",
      }).then(() => {
        form.resetFields();
      });
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: data.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div>
      {loading && (
        <>
          <Loader />
        </>
      )}
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Datos del Plazo
      </h1>
      <Form
        name="basic"
        onFinish={onGuardarPlazo}
        autoComplete="off"
        className="grid gap-1"
        validateMessages={validacionMensajes}
        layout="vertical"
        form={form}
      >
        <InputIn
          placeholder="Ingrese la Descripción del Plazo"
          name="descripcion"
          label="Descripción"
          rules={[
            {
              required: true,
              message: "Descripción del Plazo es requerida",
            },
          ]}
        />

        <Form.Item
          name={"cantidadMeses"}
          label={"Cantidad de Meses"}
          style={{ width: "100%" }}
          rules={[
            {
              type: "number",
              min: 0,
              required: true,
            },
          ]}
        >
          <InputNumber
            placeholder="Ingrese la Cantidad de Meses del Plazo"
            style={{
              width: "100%",
            }}
            suffix="Meses"
          />
        </Form.Item>

        <Form.Item
          name={"precio"}
          label={"Precio por M2"}
          style={{ width: "100%" }}
          rules={[
            {
              type: "number",
              min: 1,
              required: true,
            },
          ]}
        >
          <InputNumber
            placeholder="Ingrese el Precio por M2"
            style={{
              width: "100%",
            }}
            formatter={formatPrecio}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            prefix="$"
            suffix="MXN"
          />
        </Form.Item>

        <Row className="flex gap-2 justify-end">
          <Button htmlType="submit" size="large">
            Guardar
          </Button>

          <Button onClick={handleCancel} danger size="large">
            Cancelar
          </Button>
        </Row>
      </Form>
    </div>
  );
});

PlazosForm.displayName = "PlazosForm";
export default PlazosForm;
