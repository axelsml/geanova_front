import { LoadingContext } from "@/contexts/loading";
import configuracionService from "@/services/configuracionService";
import { Button, Col, Form, Input, Row, Select, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
/**
 * Componente para editar información del usuario.
 * @param {Objeto} accesorios - Accesorios de componentes.
 * @param {Object} props.data: datos del usuario que se editarán.
 * @param {Función} props.callback: función de devolución de llamada que se llamará después de la edición.
 * @param {Función} props.recargarDatos - Función para recargar datos del usuario.
 * @returns {JSX.Element} - Editar componente de usuario.
 */
export default function EditarUsuarios({ data, callback, recargarDatos }) {
  // Variables de estado para datos de usuario
  const [nombre, setNombre] = useState(data.nombre);
  const [nickname, setNickname] = useState(data.nick);
  const [contraseña, setContraseña] = useState(data.pass);
  const [contraseñaConfirmada, setContraseñaConfirmada] = useState(data.pass);

  // Variables de estado para roles y rol seleccionado
  const [roles, setRoles] = useState([]);
  const [rolesSelected, setRolesSelected] = useState(data.rol_id);
  // Variable de estado para el estado del usuario
  const [estatusSelected, setEstatusSelected] = useState(data.active ? 1 : 0);
  // Contexto para el estado de carga
  const { setIsLoading } = useContext(LoadingContext);
  //Seleccionar opciones de componentes
  const { Option } = Select;
  // Función de devolución de llamada para llamar al componente principal
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
  // Manejar el envío del formulario
  async function handleSubmit() {
    if (contraseña !== contraseñaConfirmada) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
      });
      return;
    }
    //Datos del formulario a enviar al servidor
    let form = {
      id: data.id,
      nombre: nombre,
      nickname: nickname,
      password: contraseña,
      active: estatusSelected,
      rol_id: rolesSelected,
    };
    // Diálogo de confirmación antes de guardar
    await Swal.fire({
      title: "Guardar nuevo usuario?",
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        //Guardar datos del usuario
        configuracionService
          .editarIUsuario(onUsuarioGuardado, form, onError)
          .then((result) => {
            onHandleCallback();
          });
      }
    });
  }
  // Función de devolución de llamada después de guardar los datos del usuario
  const onUsuarioGuardado = (data) => {
    setIsLoading(false);
    if (data.type == "success") {
      recargarDatos();
      Swal.fire({
        title: "Usuario actualizado con éxito",
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
            <Form.Item label="Nickname" name="nickname">
              <Input
                placeholder="Nickname"
                defaultValue={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item name="rol" label="Rol">
              <Select
                placeholder="Rol"
                optionLabelProp="label"
                defaultValue={rolesSelected}
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
            <Form.Item name="contraseña" label="Contraseña">
              <Input.Password
                placeholder="Contraseña"
                defaultValue={contraseña}
                onChange={(e) => {
                  setContraseña(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item name="confirmarContraseña" label="Confirmar Contraseña">
              <Input.Password
                placeholder="Confirmar Contraseña"
                defaultValue={contraseñaConfirmada}
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
