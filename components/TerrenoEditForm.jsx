"use client";

import { Button, Form, InputNumber, message, Input, Row, Col } from "antd";
import Swal from "sweetalert2";
import InputIn from "./Input";
import Loader from "./Loader";
import { useContext, useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { Paper } from "@mui/material";
import terrenosService from "@/services/terrenosService";
import { formatPrecio } from "@/helpers/formatters";
import { LoadingContext } from "@/contexts/loading";

export default function TerrenoEditForm({
  setTerrenoEditado,
  setWatch,
  watch,
  terrenoId,
  terreno,
}) {
  const { setIsLoading } = useContext(LoadingContext);

  const onGuardarTerreno = (values) => {
    Swal.fire({
      title: "Verifique que los datos sean correctos",
      icon: "info",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        terrenosService.actualizarTerreno(
          { ...values, terreno_id: terrenoId },
          onTerrenoGuardado,
          onError
        );
      }
    });
  };

  const handleCancel = async () => {
    //Mensaje para confirmar la cancelacion
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
        setTerrenoEditado(false);
        setWatch(false)
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
      setTerrenoEditado(false);
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
  };

  return (
    <>
      <Form
        name="basic"
        onFinish={onGuardarTerreno}
        autoComplete="off"
        className="grid gap-1"
        validateMessages={validacionMensajes}
        layout="vertical"
      >
       
        <Row justify={"center"}>
          <Col xs={24} sm={20} md={16} lg={16} xl={8} xxl={8} className="titulo_pantallas">
            <b> EDITAR DATOS DEL TERRENO</b>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{marginTop:"25px"}}>
          <Col xs={24} sm={12} lg={12}>
            <div className="formulario">

            
            <Form.Item
              className="terreno-edit__form-item"
              name={"nombre_proyecto"}
              label={"Nombre"}
              initialValue={terreno.nombre}
              rules={[
                {
                  required: true,
                  message: "Nombre del proyecto requerido",
                },
              ]}
            >
              <InputIn
                className="terreno-edit__input-in"
                placeholder={terreno.nombre || "Ingrese el nombre del Proyecto"}
              />
            </Form.Item>

            <Form.Item
              className="terreno-edit__form-item"
              name={"nombre_propietario"}
              label={"Propietario"}
              initialValue={terreno.propietario}
              rules={[
                {
                  required: true,
                  message: "Nombre del propietario requerido",
                },
              ]}
            >
              <InputIn
                className="terreno-edit__input-in"
                placeholder={
                  terreno.propietario || "Ingrese el nombre del Propietario"
                }
              />
            </Form.Item>

            <Form.Item
              className="terreno-edit__form-item"
              name={"ciudad"}
              label={"Ciudad"}
              initialValue={terreno.ciudad}
              rules={[
                {
                  required: true,
                  message: "Ciudad requerida",
                },
              ]}
            >
              <InputIn
                className="terreno-edit__input-in"
                placeholder={terreno.ciudad || "Ingrese la Ciudad"}
              />
            </Form.Item>

            <Form.Item
              className="terreno-edit__form-item"
              name={"domicilio"}
              label={"Domicilio"}
              initialValue={terreno.domicilio}
              rules={[
                {
                  required: true,
                  message: "Domicilio requerido",
                },
              ]}
            >
              <InputIn
                className="terreno-edit__input-in"
                placeholder={terreno.domicilio || "Ingrese el Domicilio"}
              />
            </Form.Item>

            <Form.Item
              className="terreno-edit__form-item"
              name={"colonia"}
              label={"Colonia"}
              initialValue={terreno.colonia}
              rules={[
                {
                  required: true,
                  message: "Colonia requerida",
                },
              ]}
            >
              <InputIn
                className="terreno-edit__input-in"
                placeholder={terreno.colonia || "Ingrese la Colonia"}
              />
            </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={12} className="formulario">
            <Form.Item
              className="terreno-edit__form-item"
              name={"cantidad_lotes"}
              label={"Cantidad de Lotes"}
              style={{ width: "100%" }}
              initialValue={terreno.cantidad_lotes}
              rules={[
                {
                  type: "number",
                  min: 0,
                  required: true,
                },
              ]}
            >
              <InputNumber
                placeholder="Ingrese la cantidad de Lotes"
                style={{
                  width: "100%",
                }}
                suffix="Lotes"
              />
            </Form.Item>

            <Form.Item
              className="terreno-edit__form-item"
              name={"superficie_total"}
              label={"Superficie Total"}
              style={{ width: "100%" }}
              initialValue={terreno.superficie_total}
              rules={[
                {
                  type: "number",
                  min: 0,
                  required: true,
                },
              ]}
            >
              <InputNumber
                placeholder="Ingresar superficie Total"
                style={{
                  width: "100%",
                }}
                suffix=""
              />
            </Form.Item>

            <Form.Item
              className="terreno-edit__form-item"
              name={"area_vendible"}
              label={"Área vendible"}
              style={{ width: "100%" }}
              initialValue={terreno.area_vendible}
              rules={[
                {
                  type: "number",
                  min: 0,
                  required: true,
                },
              ]}
            >
              <InputNumber
                placeholder="Ingresar Área vendible"
                style={{
                  width: "100%",
                }}
                suffix=""
              />
            </Form.Item>

            <Form.Item
              className="terreno-edit__form-item"
              name={"area_reserva"}
              label={"Área reserva"}
              style={{ width: "100%" }}
              initialValue={terreno.area_reserva}
              rules={[
                {
                  type: "number",
                  min: 0,
                  required: true,
                },
              ]}
            >
              <InputNumber
                placeholder="Ingresar Área reservada"
                style={{
                  width: "100%",
                }}
                suffix=""
              />
            </Form.Item>

            <Form.Item
              className="terreno-edit__form-item"
              name={"area_vialidad"}
              label={"Área vialidad"}
              style={{ width: "100%" }}
              initialValue={terreno.area_vialidad}
              rules={[
                {
                  type: "number",
                  min: 0,
                  required: true,
                },
              ]}
            >
              <InputNumber
                placeholder="Ingresar Área vialidad"
                style={{
                  width: "100%",
                }}
                suffix=""
              />
            </Form.Item>

            <Form.Item
              className="terreno-edit__form-item"
              name={"precio_compra"}
              label={"Precio de Compra"}
              style={{ width: "100%" }}
              initialValue={terreno.precio_compra}
              rules={[
                {
                  type: "number",
                  min: 0,
                  required: true,
                },
              ]}
            >
              <InputNumber
                placeholder="Ingrese el Precio de compra"
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
              className="terreno-edit__form-item"
              name={"precio_m2"}
              label={"Precio por M2"}
              style={{ width: "100%" }}
              initialValue={terreno.precio_m2}
              rules={[
                {
                  type: "number",
                  min: 0,
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

            <Form.Item
              className="terreno-edit__form-item"
              name={"precio_proyectado_contado"}
              label={"Precio Venta Proyectado de contado"}
              style={{ width: "100%" }}
              initialValue={terreno.precio_proyectado_contado}
              rules={[
                {
                  type: "number",
                  min: 0,
                  required: true,
                },
              ]}
            >
              <InputNumber
                placeholder="Ingrese el Precio Venta Proyectado"
                style={{
                  width: "100%",
                }}
                formatter={formatPrecio}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                prefix="$"
                suffix="MXN"
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="terreno-edit__botones-footer">
          <span className="flex gap-2 justify-end">
            <Button className="boton" htmlType="submit" size="large">
              Guardar
            </Button>

            {/* <Button onClick={handleCancel} danger size="large">
              Cancelar
            </Button> */}
          </span>
        </div>
      </Form>
    </>
  );
}
