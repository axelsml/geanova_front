import { LoadingContext } from "@/contexts/loading";
import configuracionService from "@/services/configuracionService";
import { Button, Col, Form, Input, Row, Select, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
/**
 * Componente para crear un nuevo Menu.
 *
 * @param {Object} props: las propiedades pasadas al componente.
 * @param {Función} props.callback: una función de devolución de llamada que se ejecutará después de crear el Menu.
 * @param {Función} props.recargarDatos - Una función para recargar datos después de crear el Menu.
 *
 * @returns {JSX.Element}: el elemento JSX para el nuevo componente de función.
 */
export default function NuevoMenu({ callback, recargarDatos }) {
  // Variable de estado para el nombre del Menu
  const [nombre, setNombre] = useState("");
  // Contexto para gestionar el estado de carga
  const { setIsLoading } = useContext(LoadingContext);
  //Seleccionar opciones de componentes
  // Función de devolución de llamada para ejecutar la devolución de llamada del componente principal
  const onHandleCallback = () => {
    callback();
  };
  // Función de manejo de errores
  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };
  /**
   * Maneja el envío del formulario para crear un nuevo Menu.
   * Muestra un cuadro de diálogo de confirmación antes de realizar la llamada API.
   */
  async function handleSubmit() {
    let form = {
      nombre: nombre,
    };

    await Swal.fire({
      title: "Guardar nuevo Menú?",
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        configuracionService
          .guardarIMenu(onMenuGuardado, form, onError)
          .then((result) => {
            onHandleCallback();
          });
      }
    });
  }
  /**
   * Función de devolución de llamada para manejar la respuesta después de crear un nuevo Menu.
   * Muestra mensajes de éxito o error según la respuesta.
   *
   * @param {Objeto} datos: los datos de respuesta de la llamada API.
   */
  const onMenuGuardado = (data) => {
    setIsLoading(false);
    if (data.type == "success") {
      recargarDatos();
      Swal.fire({
        title: "Menú guardado con éxito",
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
            <Form.Item
              name="Nombre Menu"
              label="Nombre Menú"
              rules={[
                {
                  required: true,
                  message: "Ingresa un nombre de Menu!",
                },
              ]}
            >
              <Input
                placeholder="Nombre Menu"
                onChange={(e) => {
                  setNombre(e.target.value);
                }}
              />
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
