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
import InputIn from "./Input";

export default function PagoForm({ setNuevoPago,cliente, lote,setWatch, watch }) {
  const { setIsLoading } = useContext(LoadingContext);
  const [sistemas_pago, setSistemasPago] = useState(null);
  const [sistemaSelected, setSistemaSelected] = useState(null);
  const [tipoPagoSelected, setTipoPagoSelected] = useState(null);
  const [tipo_pagos, setTipoPagos] = useState(null);
  // const [cliente, setCliente] = useState(null);
  const [form] = Form.useForm();
  const { Option } = Select;

  const [valoresIniciales, setValoresIniciales] = useState({
    monto_pago: lote.monto_pago_requerido,
  });
  const [valor, setValor] = useState(lote.monto_pago_requerido);

  useEffect(() => {
    pagosService.getSistemasPago(setSistemasPago, onError);
    pagosService.getTipoPagos(setTipoPagos, onError);
  }, []);

  const onGuardarPago = (values) => {
    values["fecha"] = formatDate(values.fecha);
    Swal.fire({
      title: "Verifique que los datos sean correctos",
      icon: "info",
      html: `Cliente: ${cliente.nombre_completo}<br/><br/>Lote: ${
        lote.lote
      }<br/><br/>Monto de Pago:  $${formatPrecio(
        values.monto_pagado
      )}<br/><br/>Fecha: ${values.fecha}`,
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
          solicitud_id: lote.solicitud_id,
        };
        debugger
        pagosService.createPago({ pago: params }, onPagoGuardado, onError);
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
      window.open(
        `https://api.santamariadelaluz.com/iPagos/recibo/${data.pago.id}.pdf`
      );
   
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
      {/* <BuscarCliente
        setCliente={setCliente}
        setWatch={setWatch}
        watch={watch}
      /> */}

     
        <div className="grid gap-10">

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
                initialValue={valor}
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
                  onChange={(value) => {
                    setSistemaSelected(value);
                  }}
                >
                  {sistemas_pago?.map((item, index) => (
                    <Option key={index} value={item.id} label={item.Nombre}>
                      {item?.Nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {sistemaSelected === 1 && (
                <>
                  <Form.Item
                    label={"Tipo de Pago"}
                    name={"tipo_pago_id"}
                    style={{ width: "100%" }}
                    rules={[
                      {
                        required: true,
                        message: "Tipo de Pago no seleccionado",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Seleccione un Tipo de Pago"
                      optionLabelProp="label"
                      onChange={(value) => {
                        setTipoPagoSelected(value);
                      }}
                    >
                      {tipo_pagos?.map((item, index) => (
                        <Option key={index} value={item.id} label={item.nombre}>
                          {item?.nombre}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {tipoPagoSelected === 1 && (
                    <InputIn
                      placeholder="Ingrese Nombre de Quién Recibió"
                      name="usuario_recibio"
                      label="Recibió"
                      rules={[
                        {
                          required: true,
                          message: "Nombre de Quién Recibió es requerido",
                        },
                      ]}
                    />
                  )}
                </>
              )}

              {sistemaSelected === 2 && (
                <div>
                  <Form.Item
                    name="fechaTransferencia"
                    label="Fecha de Transferencia"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        required: true,
                        message: "Fecha de Transferencia requerida",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="Ingrese la Fecha en la que se Realizó la Transferencia"
                    />
                  </Form.Item>

                  <InputIn
                    placeholder="Ingrese la Cuenta"
                    name="comentario"
                    label="Cuenta a la que se Depositó"
                    rules={[
                      {
                        required: true,
                        message: "Cuenta es requerida",
                      },
                    ]}
                  />
                  <Form.Item
                    name={"numeroMoviento"}
                    label={"Movimiento de Estado Cuenta"}
                    style={{ width: "100%" }}
                    rules={[
                      {
                        required: true,
                        message: "Movimiento de Estado Cuenta es requerido",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                </div>
              )}
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
  
      
    </div>
  );
}
