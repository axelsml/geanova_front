"use client";

import { Button, Form, InputNumber, DatePicker, Select } from "antd";
import Swal from "sweetalert2";
import InputIn from "./Input";
import Loader from "./Loader";
import { useState, useEffect } from "react";
import {
  formatPrecio,
  calcularSemanas,
  formatDate,
} from "@/helpers/formatters";
import terrenosService from "@/services/terrenosService";
import plazosService from "@/services/plazosService";
import lotesService from "@/services/lotesService";
import ventasService from "@/services/ventasService";
import { usuario_id } from "@/helpers/user";

export default function VentaForm({ setNuevaVenta, setWatch, watch }) {
  const [loading, setLoading] = useState(false);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [terrenos, setTerrenos] = useState(null);
  const [plazos, setPlazos] = useState(null);
  const { Option } = Select;
  const [lotes, setLotes] = useState(null);
  const [loteSelected, setLoteSelected] = useState(null);
  const [plazoSelected, setPlazoSelected] = useState(null);
  const [form] = Form.useForm();

  const [valoresIniciales, setValoresIniciales] = useState({
    montoContrato: 0,
    anticipo: 0,
    semanas: 0,
    montoPago: 0,
  });

  useEffect(() => {
    terrenosService.getTerrenos(setTerrenos, Error);
  }, []);

  const onBuscarLotes = (value) => {
    setTerrenoSelected(terrenos.find((terreno) => terreno.id == value));
    lotesService.getLoteSuperficie(
      value,
      (data) => {
        setLotes(data);
      },
      onError
    );
    onBuscarPlazos(value)
  };

  const onBuscarPlazos = (value) => {
    setTerrenoSelected(terrenos.find((terreno) => terreno.id == value));
    plazosService.getPlazos({terreno_id: value}, setPlazos, onError);
  };

  const calcularMontoContratoPlazo = (plazo) => {
    if (loteSelected) {
      let monto_contrato = plazo.precio * loteSelected.superficie;
      form.setFieldValue("montoContrato", monto_contrato);
      form.setFieldValue("semanas", calcularSemanas(plazo.cantidad_meses));
      return monto_contrato;
    }
  };

  const calcularMontoContratoLote = (lote) => {
    if (plazoSelected) {
      let monto_contrato = plazoSelected.precio * lote.superficie;
      form.setFieldValue("montoContrato", monto_contrato);
      form.setFieldValue(
        "semanas",
        calcularSemanas(plazoSelected.cantidad_meses)
      );

      return monto_contrato;
    }
  };

  const onGuardarVenta = (values) => {
    values["fechaInicioContrato"] = formatDate(values.fechaInicioContrato);
    console.log(values);
    Swal.fire({
      title: "Verifique que los datos sean correctos",
      icon: "info",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        ventasService.createVenta({...values, usuarioId: usuario_id}, onVentaGuardada, onError);
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
        setNuevaVenta(false);
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

  const onVentaGuardada = (data) => {
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
      setNuevaVenta(false);
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
        Datos del Cliente
      </h1>
      <Form
        form={form}
        name="basic"
        onFinish={onGuardarVenta}
        autoComplete="off"
        className="grid gap-1"
        validateMessages={validacionMensajes}
        layout="vertical"
        initialValues={valoresIniciales}
      >
        <InputIn
          placeholder="Ingrese el Primer Nombre del Cliente"
          name="primer_nombre"
          label="Primer Nombre del Cliente"
          rules={[
            {
              required: true,
              message: "Primer Nombre del Cliente es requerido",
            },
          ]}
        />

        <InputIn
          placeholder="Ingrese el Segundo Nombre del Cliente"
          name="segundo_nombre"
          label="Segundo Nombre del Cliente"
        />

        <InputIn
          placeholder="Ingrese el Primer Apellido del Cliente"
          name="primer_apellido"
          label="Primer Apellido del Cliente"
          rules={[
            {
              required: true,
              message: "Primer Apellido del Cliente es requerido",
            },
          ]}
        />

        <InputIn
          placeholder="Ingrese el Segundo Apellido del Cliente"
          name="segundo_apellido"
          label="Segundo Apellido del Cliente"
        />

        <Form.Item
          label={"Terreno"}
          name={"terreno"}
          style={{ width: "100%" }}
          rules={[{ required: true, message: "Terreno no seleccionado" }]}
          initialValue={terrenoSelected?.nombre}
        >
          <Select
            showSearch
            placeholder="Seleccione un Terreno"
            optionLabelProp="label"
            onChange={onBuscarLotes}
          >
            {terrenos?.map((item) => (
              <Option key={item.nombre} value={item.id} label={item.nombre}>
                {item?.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={"Lote"}
          name="lote_id"
          style={{ width: "100%" }}
          rules={[{ required: true, message: "Lote no seleccionado" }]}
        >
          <Select
            showSearch
            placeholder="Seleccione un Lote"
            optionLabelProp="label"
            onChange={(value) => {
              const loteSelected = lotes.find((lote) => lote.id == value);
              setLoteSelected(loteSelected);
              setValoresIniciales({
                ...valoresIniciales,
                montoContrato: calcularMontoContratoLote(loteSelected),
              });
            }}
          >
            {lotes?.map((item) => (
              <Option key={item.numero} value={item.id} label={item.numero}>
                {item?.numero}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={"Plazo"}
          name="plazo_id"
          style={{ width: "100%" }}
          rules={[{ required: true, message: "Plazo no seleccionado" }]}
        >
          <Select
            showSearch
            disabled={!loteSelected}
            placeholder="Seleccione un Plazo"
            optionLabelProp="label"
            onChange={(value) => {
              const plazoSelected = plazos.find((plazo) => plazo.id == value);
              setPlazoSelected(plazoSelected);
              setValoresIniciales({
                ...valoresIniciales,
                montoContrato: calcularMontoContratoPlazo(plazoSelected),
              });
            }}
          >
            {plazos?.map((item) => (
              <Option
                key={item.descripcion}
                value={item.id}
                label={item.descripcion}
              >
                {item?.descripcion}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name={"montoContrato"}
          label={"Monto de Contrato"}
          style={{ width: "100%" }}
        >
          <InputNumber
            disabled
            style={{
              width: "100%",
            }}
            formatter={formatPrecio}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            prefix="$"
            suffix="MXN"
          />
        </Form.Item>

        <Form.Item
          name={"anticipo"}
          label={"Anticipo"}
          style={{ width: "100%" }}
        >
          <InputNumber
            style={{
              width: "100%",
            }}
            formatter={formatPrecio}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            prefix="$"
            suffix="MXN"
          />
        </Form.Item>

        <Form.Item
          name={"semanas"}
          label={"Plazo Semanal"}
          style={{ width: "100%" }}
        >
          <InputNumber
            disabled
            suffix={"Semanas"}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>

        <Form.Item
          name="fechaInicioContrato"
          label="Fecha de Inicio de Contrato"
          style={{ width: "100%" }}
          rules={[
            {
              required: true,
              message: "Fecha de Inicio de Contrato es requerida",
            },
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Ingrese la Fecha de Inicio de Contrato"
          />
        </Form.Item>

        <InputIn
          name="celular_cliente"
          label="Celular de Contacto"
          placeholder="Ingrese el Número de Celular de Contacto"
          rules={[
            {
              required: true,
              message: "Celular de Contacto es requerido",
            },
            {
              pattern: new RegExp(/^(\+52)?\d{10}$/),
              message: "Número de Celular no es Válido",
            },
          ]}
        />

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
