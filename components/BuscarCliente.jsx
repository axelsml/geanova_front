"use client";

import { Button, Form} from "antd";
import InputIn from "./Input";
import { useContext } from "react";
import { LoadingContext } from "@/contexts/loading";
import usuariosService from "@/services/usuariosService";
import Swal from "sweetalert2";

export default function BuscarCliente({ setCliente }) {
 const { setIsLoading } = useContext(LoadingContext)
 
  const buscarCliente = (values) => {
    setIsLoading(true);

   usuariosService.buscarCliente(values, onClienteEncontrado, onError)
  };

  const onClienteEncontrado = (data) => {
    setIsLoading(false);
    if (data.success) {
      setCliente(data.cliente)
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
  } 

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

  return (
    <Form
      name="basic"
      onFinish={buscarCliente}
      autoComplete="off"
      className="flex justify-center items-center"
      layout="vertical"
    >
      <InputIn
        placeholder="Ingrese el Folio del Cliente"
        name="folio_cliente"
        className="w-1/2"
        label="Folio del Cliente"
        rules={[
          {
            required: true,
            message: "Folio del Cliente es requerido",
          },
        ]}
      />

      <Button htmlType="submit" size="large">
        Buscar
      </Button>
    </Form>
  );
}
