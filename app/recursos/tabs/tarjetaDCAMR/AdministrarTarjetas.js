"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Input,
  Button,
  Modal,
  Tooltip,
  Form,
  Select,
  Checkbox,
} from "antd";
const { Option } = Select;
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableFooter,
} from "@mui/material";
import { MdOutlineAddCard, MdOutlineCreditCardOff } from "react-icons/md";
import { LoadingContext } from "@/contexts/loading";
import Swal from "sweetalert2";
import recursosService from "@/services/recursosService";
import {
  yellow,
  generate,
  green,
  presetPalettes,
  red,
} from "@ant-design/colors";

/**
 * Tabla de Roles que muestra la lista de roles con opciones de edición y eliminación.
 * @returns {JSX.Element} - Componente de React que renderiza la tabla de usuarios.
 */
export default function AdministrarTarjetas({ cargarTarjetas }) {
  //Variables del funcionamiento de la Tabla
  const [orderBy] = useState("created_at");
  const [order] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [form] = Form.useForm();

  //Variables del modal
  const [showModal, setShowModal] = useState(false);

  //Variables del componente
  const [datos, setDatos] = useState([]);
  const [tarjetaAdicional, setTarjetaAdicional] = useState(false);

  const { setIsLoading } = useContext(LoadingContext);

  // Handlers para cerrar los modales
  const handleCloseModal = () => {
    form.resetFields(); // Reset form fields when closing the modal
    setShowModal(false);
  };

  // Handler para eliminar una tarjeta
  async function handleEliminarTarjeta(id, nombre) {
    await Swal.fire({
      title: "Eliminar esta tarjeta?",
      text: `¿Estás seguro de eliminar '${nombre}' ? `,
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        recursosService.updateTarjeta(
          onTarjetaActualizada,
          { id: id },
          onError
        );
      }
    });
  }

  // Callback cuando se elimina un rol
  const onTarjetaActualizada = (data) => {
    console.log("data: ", data);
    setIsLoading(false);
    if (data.type == "success") {
      cargarTarjetas();
      cargarDatos();
      Swal.fire({
        title: "Tarjeta eliminada con éxito",
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

  // Títulos personalizados para los modales
  const customTitle = (title, level) => {
    return (
      <Row justify={"center"}>
        <Typography.Title level={level}>{title}</Typography.Title>
      </Row>
    );
  };
  // Handlers para cambiar la página y el número de filas por página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Funciones de comparación para ordenar la tabla
  const stableSort = (array, comparator) => {
    const result = Object.keys(array).map((key) => array[key]);

    const stabilizedThis = result.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  // Obtiene el comparador según el orden y el campo de ordenamiento
  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  // Callback cuando ocurre un error
  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

  // Efecto para cargar los datos cuando el componente se monta
  useEffect(() => {
    cargarDatos();
  }, []);

  // Función para cargar los datos de los roles
  function cargarDatos() {
    setIsLoading(true);
    recursosService.showTarjeta(setDatos, onError).then(() => {
      setIsLoading(false);
    });
  }

  // Handler para la búsqueda de roles
  const onSearch = (value) => {
    recursosService.showTarjetaSearch(value, setDatos, onError);
  };

  async function handleSubmitNuevo(data) {
    setShowModal(false);
    console.log("dataForm:", data);
    await Swal.fire({
      title: "Guardar nueva tarjeta?",
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        recursosService.agregarTarjeta(data, onTarjetaGuardada, onError);
        form.resetFields(); // Reset form fields when closing the modal
      }
    });
  }
  const onTarjetaGuardada = (data) => {
    setIsLoading(false);
    if (data.type == "Success") {
      cargarTarjetas();
      cargarDatos();
      Swal.fire({
        title: "Tarjeta guardada con éxito",
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
    <div style={{ paddingBottom: 30 }}>
      <Row
        style={{
          paddingTop: 20,
          paddingBottom: 20,
        }}
        justify="space-between"
      >
        <Tooltip title="Haz clic aquí para crear un nuevo tipo de movimiento">
          <Button
            className="boton"
            onClick={() => {
              setShowModal(true);
            }}
            size="large"
          >
            <MdOutlineAddCard className="m-auto" size={"20px"} />
          </Button>
        </Tooltip>
        <Input.Search
          placeholder="Buscar Tarjeta"
          style={{
            width: "100%",
            maxWidth: "20vw",
          }}
          enterButton="Buscar"
          size="large"
          onSearch={onSearch}
        />
      </Row>
      <Row justify={"center"}>
        <Col xs={24} sm={20} md={16} lg={24} xl={24} xxl={24}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Alias</p>
                  </TableCell>
                  <TableCell>
                    <p>Tarjeta</p>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stableSort(datos, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dato, index) => (
                    <TableRow key={dato.id}>
                      <TableCell>{dato.alias}</TableCell>
                      <TableCell>{dato.tarjeta}</TableCell>
                      <TableCell>
                        <Tooltip title="Haz clic aquí para eliminar esta tarjeta">
                          <Button
                            className="boton-eliminar"
                            key={dato.id}
                            onClick={() => {
                              handleEliminarTarjeta(dato.id, dato.alias);
                            }}
                            size="large"
                          >
                            <MdOutlineCreditCardOff
                              className="m-auto"
                              size={"20px"}
                            />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={datos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Registros por Página"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Col>
      </Row>
      <Modal
        title={customTitle("Registrar Tipo de Movimiento", 3)}
        footer={null}
        width={600}
        open={showModal}
        onCancel={() => handleCloseModal()}
      >
        <div>
          <Row justify={"center"} style={{ paddingTop: 25, paddingBottom: 25 }}>
            <Form
              labelCol={{ span: 10 }}
              layout="horizontal"
              name="usuarioForm"
              form={form}
              onFinish={handleSubmitNuevo}
            >
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                  name="alias"
                  label="Alias Tarjeta"
                  rules={[
                    {
                      required: true,
                      message: "Ingresa un alias de tarjeta!",
                    },
                  ]}
                >
                  <Input placeholder="Alias" />
                </Form.Item>
                <Form.Item
                  name="tarjeta"
                  label="Tarjeta"
                  rules={[
                    {
                      required: true,
                      message: "Ingresa una tarjeta!",
                    },
                  ]}
                >
                  <Input placeholder="Tarjeta" />
                </Form.Item>
                <Form.Item
                  name="checkBoxAdicional"
                  label="Tarjeta Adicional"
                  valuePropName="checked"
                >
                  <Checkbox
                    onChange={() => {
                      setTarjetaAdicional(!tarjetaAdicional);
                    }}
                  />
                </Form.Item>
                {tarjetaAdicional && (
                  <Form.Item
                    name="adicionalTarjeta"
                    label="Seleccionar Tarjeta"
                  >
                    <Select placeholder="Seleccione una tarjeta">
                      {datos.map((dato) => {
                        return (
                          <Option key={dato.id} value={dato.id}>
                            {dato.alias}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                )}
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
      </Modal>
    </div>
  );
}
