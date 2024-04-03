"use client";

import {
  Typography,
  Button,
  Form,
  Col,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import Swal from "sweetalert2";
import { useState, useContext, useEffect } from "react";
import { formatPrecio, formatDate } from "@/helpers/formatters";
import BuscarCliente from "./BuscarCliente";
import { LoadingContext } from "@/contexts/loading";
import pagosService from "@/services/pagosService";
import { usuario_id } from "@/helpers/user";

export default function PagoForm({ setNuevoPago, setWatch, watch }) {
  const { setIsLoading } = useContext(LoadingContext);
  const [sistemas_pago, setSistemasPago] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [form] = Form.useForm();
  const { Option } = Select;

  const [valoresIniciales, setValoresIniciales] = useState({
    monto_pago: 0,
  });


  useEffect(() => {
    pagosService.getSistemasPago(setSistemasPago, Error);
  }, []);

  const onGuardarPago = (values) => {
    values["fecha"] = formatDate(values.fecha);
    console.log(values);
    Swal.fire({
      title: "Verifique que los datos sean correctos",
      icon: "info",
      html: `Cliente: ${cliente[0].nombre_cliente}<br/><br/>Folio: ${cliente[0].folio_cliente}<br/><br/>Monto de Pago:  $${formatPrecio(values.monto_pagado)}<br/><br/>Fecha: ${values.fecha}`,
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        let params = {
          ...values,
          usuario_id: usuario_id,
          cliente_id: cliente[0].folio_cliente
        }
        pagosService.createPago({pago: params}, onPagoGuardado, onError);
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
        setNuevoPago(false);
      }
    });
  };

  const onPagoGuardado = (data) => {
    setIsLoading(false);
    console.log(data);
    if (data.success) {
      setWatch(!watch);
      Swal.fire({
        title: "Guardado con Éxito",
        icon: "success",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
      setNuevoPago(false);
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

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
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

  return (
    <div className="w-3/4 mx-auto p-6 m-7 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-center">Datos de Pago</h1>
      <BuscarCliente
        setCliente={setCliente}
        setWatch={setWatch}
        watch={watch}
      />

      {cliente && (
        <div className="grid gap-10">
          <div className="flex justify-around flex-wrap">
            <Typography className="py-2">
              Folio Cliente: {cliente[0].folio_cliente}
            </Typography>

            <Typography className="py-2">
              Cliente: {cliente[0].nombre_cliente}
            </Typography>

            <Typography className="py-2">
              Celular Cliente: {cliente[0].celular_cliente}
            </Typography>

            <Typography className="py-2">
              Monto de Contrato: ${formatPrecio(cliente[0].monto_contrato)}
            </Typography>
            <Typography className="py-2">
              Anticipo: ${formatPrecio(cliente[0].anticipo)}
            </Typography>

            <Typography className="py-2">Plazo: {cliente[0].plazo}</Typography>

            <Typography className="py-2">
              Número de Lote: {cliente[0].numero_lote}
            </Typography>
          </div>

          <Form
            form={form}
            onFinish={onGuardarPago}
            name="pago"
            autoComplete="off"
            className="grid gap-1"
            layout="vertical"
            validateMessages={validacionMensajes}
            initialValues={valoresIniciales}
          >
            <Col>
              <Form.Item
                name={"monto_pagado"}
                label={"Monto de Pago"}
                style={{ width: "100%" }}
                rules={[{ required: true }, { type: "number", min: 1 }]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  placeholder="Ingrese el Monto de Pago"
                  formatter={formatPrecio}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  prefix="$"
                  suffix="MXN"
                />
              </Form.Item>

              <Form.Item
                name="fecha"
                label="Fecha de Pago"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: "Fecha de Pago es requerida",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Ingrese la Fecha de Pago"
                />
              </Form.Item>

              <Form.Item
                label={"Sistema de Pago"}
                name={"sistema_pago_id"}
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: "Sistema de Pago no seleccionado",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Seleccione un Sistema de Pago"
                  optionLabelProp="label"
                >
                  {sistemas_pago?.map((item, index) => (
                    <Option key={index} value={item.id} label={item.Nombre}>
                      {item?.Nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

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
      )}
    </div>
  );
}
