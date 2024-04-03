"use client";

import { Button, Form, InputNumber } from "antd";
import Swal from "sweetalert2";
import InputIn from "./Input";
import { useContext } from "react";
import { LoadingContext } from "@/contexts/loading";
import terrenosService from "@/services/terrenosService";
import { formatPrecio } from "@/helpers/formatters";


export default function TerrenoForm({ setTerrenoNuevo, setWatch, watch }) {
  const { setIsLoading } = useContext(LoadingContext);

  const onGuardarTerreno = (values) => {
    Swal.fire({
      title: "Verifique que los datos sean correctos",
      icon: "info",
      html: `Nombre del terreno: ${values.nombreTerreno}<br/><br/>Cantidad de Lotes: ${values.cantidadLotes}`,
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        terrenosService.createTerreno(values, onTerrenoGuardado, onError);
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
        setTerrenoNuevo(false);
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

  const onTerrenoGuardado = (data) => {
    setIsLoading(false)
    if (data.success) {
      setWatch(!watch)
      Swal.fire({
        title: "Guardado con Éxito",
        icon: "success",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      })
      setTerrenoNuevo(false)
    }else{
      Swal.fire({
        title: "Error",
        icon: "error",
        text: data.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      })
    }
  };

  const onError = (e) => {
    setIsLoading(false)
    console.log(e);
  };

  return (
    <div className="w-1/2 max-w-md mx-auto p-6 m-7 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Datos del Terreno
      </h1>
      <Form
        name="basic"
        onFinish={onGuardarTerreno}
        autoComplete="off"
        className="grid gap-1"
        validateMessages={validacionMensajes}
        layout="vertical"
      >
        <InputIn
          placeholder="Ingrese el Nombre del Terreno"
          name="nombreTerreno"
          label="Nombre del Terreno"
          rules={[
            {
              required: true,
              message: "Nombre del Terreno es requerido",
            },
          ]}
        />

        <Form.Item
          name={"cantidadLotes"}
          label={"Cantidad Lotes"}
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
            placeholder="Ingrese la Cantidad de Lotes"
            style={{
              width: "100%",
            }}
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
