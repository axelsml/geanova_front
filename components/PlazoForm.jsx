"use client";

import { Button, Form, InputNumber } from "antd";
import Swal from "sweetalert2";
import InputIn from "./Input";
import Loader from "./Loader";
import { useState } from "react";
import plazosService from "@/services/plazosService";
import { formatPrecio } from "@/helpers/formatters";

export default function PlazosForm({ setNuevoPlazo, setWatch, watch }) {
  const [loading, setLoading] = useState(false);

  const onGuardarPlazo = (values) => {
    Swal.fire({
      title: "Verifique que los datos sean correctos",
      icon: "info",
      html: `Cantidad de meses: ${values.cantidadMeses}<br/><br/>Precio por m<sup>2</sup>: $${formatPrecio(values.precio)}`,
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        plazosService.createPlazo(values, onPlazoGuardado, onError);
      }
    });
  };

  const handleCancel = async () => {
    //MENSAJE EMERGENTE PARA REAFIRMAR QUE SE VA A
    //CANCELAR EL PROCESO DE GUARDADO
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
        setNuevoPlazo(false);
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
    if (data.success) {
      setLoading(false);
      setWatch(!watch);
      Swal.fire({
        title: "Guardado con Éxito",
        icon: "success",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
      setNuevoPlazo(false);
    } else {
      setLoading(false);
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

  const onError = (e) => {
    setLoading(false);
    console.log(e);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-1/2 max-w-md mx-auto p-6 m-7 bg-white rounded-lg shadow-md">
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

        <span className="flex gap-2 justify-end">
          <Button htmlType="submit" size="large">
            Guardar
          </Button>

          <Button onClick={handleCancel} danger size="large">
            Cancelar
          </Button>
        </span>
      </Form>
    </div>
  );
}
