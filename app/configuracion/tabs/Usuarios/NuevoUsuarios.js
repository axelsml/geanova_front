import { LoadingContext } from "@/contexts/loading";
import configuracionService from "@/services/configuracionService";
import { Button, Col, Form, Input, Row, Select, Tooltip } from "antd";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
/**
 * Componente para crear un nuevo usuario.
 * @param {Función} callback de llamada: función de devolución de llamada que se ejecutará después de la creación del usuario.
 * @param {Función} recargarDatos - Función para recargar datos del usuario.
 * @returns {JSX.Element}: elemento JSX para el nuevo formulario de usuario.
 */
export default function NuevoUsuario({ callback, recargarDatos }) {
  // Variables de estado para campos de entrada del usuario
  const [nombre, setNombre] = useState("");
  const [nickname, setNickname] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [contraseñaConfirmada, setContraseñaConfirmada] = useState("");
  // Variables de estado para datos de roles y roles seleccionados
  const [roles, setRoles] = useState([]);
  const [rolesSelected, setRolesSelected] = useState([]);
  // Contexto para el estado de carga
  const { setIsLoading } = useContext(LoadingContext);
  // Componente seleccionado deconstruido de Ant Design
  const { Option } = Select;
  // Función de devolución de llamada para ejecutar la función de devolución de llamada del componente principal
  const onHandleCallback = () => {
    callback();
  };
  // Función de manejo de errores
  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };
  // Obtener datos de roles en el montaje del componente
  useEffect(() => {
    configuracionService.getIRoles(setRoles, onError);
  }, []);
  /**
   * Maneja el envío de formularios.
   * Valida la coincidencia de contraseña y muestra un cuadro de diálogo de confirmación antes de guardar al usuario.
   */
  async function handleSubmit() {
    if (contraseña !== contraseñaConfirmada) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
      });
    }

    let form = {
      nombre: nombre,
      nickname: nickname,
      password: contraseña,
      rol_id: rolesSelected,
    };

    await Swal.fire({
      title: "Guardar nuevo usuario?",
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        configuracionService
          .guardarIUsuario(onUsuarioGuardado, form, onError)
          .then((result) => {
            onHandleCallback();
          });
      }
    });
  }
  /**
   * Función de devolución de llamada para la operación de guardado del usuario.
   * Muestra mensaje de éxito o error según la respuesta.
   * @param {Objeto} datos: datos de respuesta de la operación de guardado del usuario.
   */
  const onUsuarioGuardado = (data) => {
    setIsLoading(false);
    if (data.type == "success") {
      recargarDatos();
      Swal.fire({
        title: "Usuario guardado con éxito",
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
              name="Nombre Usuario"
              label="Nombre Usuario"
              rules={[
                {
                  required: true,
                  message: "Ingresa un nombre de usuario!",
                },
              ]}
            >
              <Input
                placeholder="Nombre Usuario"
                onChange={(e) => {
                  setNombre(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              label="Nickname"
              name="Nickname"
              rules={[
                {
                  required: true,
                  message: "Ingresa un nickname!",
                },
              ]}
            >
              <Input
                placeholder="Nickname"
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="Rol"
              label="Rol"
              rules={[
                {
                  required: true,
                  message: "Selecciona un rol!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Rol"
                optionLabelProp="label"
                value={rolesSelected}
                style={{ width: "100%" }}
                onChange={(value) => {
                  setRolesSelected(value);
                }}
              >
                {roles?.map((item, index) => (
                  <Option key={index} value={item.id} label={item.nombre}>
                    {item?.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="Contraseña"
              label="Contraseña"
              rules={[
                {
                  required: true,
                  message: "Ingresa una contraseña!",
                },
              ]}
            >
              <Input.Password
                placeholder="Contraseña"
                onChange={(e) => {
                  setContraseña(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="Confirmar Contraseña"
              label="Confirmar Contraseña"
              rules={[
                {
                  required: true,
                  message: "Confirma tu contraseña!",
                },
              ]}
            >
              <Input.Password
                placeholder="Confirmar Contraseña"
                onChange={(e) => {
                  setContraseñaConfirmada(e.target.value);
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
