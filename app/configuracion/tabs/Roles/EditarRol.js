import { LoadingContext } from "@/contexts/loading";
import configuracionService from "@/services/configuracionService";
import { Button, Col, Form, Input, Row, Select, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

/**
 * Component to edit a role.
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.data - The role data to be edited.
 * @param {Function} props.callback - The callback function to be called after editing.
 * @param {Function} props.recargarDatos - The function to reload data.
 * @returns {JSX.Element} - The JSX element for the EditarRol component.
 */
export default function EditarRol({ data, callback, recargarDatos }) {
  // State variables
  const [nombre, setNombre] = useState(data.nombre);
  const [estatusSelected, setEstatusSelected] = useState(data.active ? 1 : 0);

  // Context
  const { setIsLoading } = useContext(LoadingContext);

  // Constants
  const { Option } = Select;

  // Callback function
  const onHandleCallback = () => {
    callback();
  };

  // Error handling function
  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };
  /**
   * Handles the form submission.
   */
  async function handleSubmit() {
    let form = {
      id: data.id,
      nombre: nombre,
      active: estatusSelected,
    };
    await Swal.fire({
      title: "Guardar nuevo Rol?",
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("form: ", form);
        configuracionService
          .editarIRoles(onRolGuardado, form, onError)
          .then((result) => {
            onHandleCallback();
          });
      }
    });
  }
  /**
   * Callback function for when the role is saved.
   * @param {Object} data - The response data from the server.
   */
  const onRolGuardado = (data) => {
    setIsLoading(false);
    if (data.type == "success") {
      recargarDatos();
      Swal.fire({
        title: "Rol actualizado con éxito",
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

  return (
    <div>
      <Row justify={"center"} style={{ paddingTop: 25, paddingBottom: 25 }}>
        <Form
          labelCol={{ span: 10 }}
          layout="horizontal"
          name="usuarioForm"
          onFinish={handleSubmit}
        >
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item name="nombre" label="Nombre Usuario">
              <Input
                placeholder="Nombre Usuario"
                defaultValue={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item name="status" label="Estatus">
              <Select
                placeholder="Estatus"
                optionLabelProp="label"
                defaultValue={estatusSelected}
                style={{ width: "100%" }}
                onChange={(value) => {
                  setEstatusSelected(value);
                }}
              >
                <Option value={0} label={"Inactivo"}>
                  Inactivo
                </Option>
                <Option value={1} label={"Activo"}>
                  Activo
                </Option>
              </Select>
            </Form.Item>
            <div
              className="terreno-edit__botones-footer"
              style={{ paddingBottom: 15 }}
            >
              <span className="flex gap-2 justify-end">
                <Button className="boton" htmlType="submit">
                  Guardar
                </Button>
              </span>
            </div>
          </Col>
        </Form>
      </Row>
    </div>
  );
}
