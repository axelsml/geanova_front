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
  ColorPicker,
  theme,
  Divider,
} from "antd";
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
import { FaRegTrashAlt, FaUserTag } from "react-icons/fa";
import { LoadingContext } from "@/contexts/loading";
import Swal from "sweetalert2";
import recursosService from "@/services/recursosService";
import { toTitleCase } from "@/helpers/formatters";
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
export default function AdministrarTipoMovimiento() {
  //Variables del funcionamiento de la Tabla
  const [orderBy] = useState("created_at");
  const [order] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [form] = Form.useForm();

  //Variables del modal
  const [showModal, setShowModal] = useState(false);

  //Variables del componente
  const [datos, setDatos] = useState([]);
  const [descripcion, setDescripcion] = useState([]);

  const [color, setColor] = useState("#438dcc");
  const genPresets = (presets = presetPalettes) =>
    Object.entries(presets).map(([label, colors]) => ({
      label,
      colors,
    }));
  const { token } = theme.useToken();
  const presets = genPresets({
    Azul: generate(token.colorPrimary),
    Rojo: red,
    Verde: green,
    Amarillo: yellow,
  });

  const customPanelRender = (_, { components: { Picker, Presets } }) => (
    <Row justify="space-between" wrap={false}>
      <Col span={12}>
        <Presets />
      </Col>
      <Divider
        type="vertical"
        style={{
          height: "auto",
        }}
      />
      <Col flex="auto">
        <Picker />
      </Col>
    </Row>
  );

  const [tipoIngreso, setTipoIngreso] = useState([]);
  const { setIsLoading } = useContext(LoadingContext);

  const { Option } = Select;

  // Handlers para cerrar los modales
  const handleCloseModal = () => {
    form.resetFields(); // Reset form fields when closing the modal
    setShowModal(false);
  };

  // Handler para eliminar un rol
  async function handleEliminarMovimiento(id, nombre) {
    await Swal.fire({
      title: "Eliminar este movimiento?",
      text: `¿Estás seguro de eliminar '${nombre}' ? `,
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        recursosService
          .destroyTipoMovimiento(onMovimientoEliminado, id, onError)
          .then(() => {
            cargarDatos();
          });
      }
    });
  }

  // Callback cuando se elimina un rol
  const onMovimientoEliminado = (data) => {
    setIsLoading(false);
    if (data.type == "success") {
      Swal.fire({
        title: "Movimiento eliminado con éxito",
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
  const customTitle = (
    <Row justify={"center"}>
      <Typography.Title level={3}>
        Registrar Tipo de Movimiento
      </Typography.Title>
    </Row>
  );

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
    recursosService.showTipoMovimiento(setDatos, onError).then(() => {
      setIsLoading(false);
    });
  }

  // Handler para la búsqueda de roles
  const onSearch = (value) => {
    recursosService.showTipoMovimientoSearch(value, setDatos, onError);
  };

  async function handleSubmitNuevo() {
    setShowModal(false);
    let forms = {
      descripcion: descripcion,
      tipo_ingreso: tipoIngreso,
      codigo_color: color,
    };

    await Swal.fire({
      title: "Guardar nuevo movimiento?",
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        recursosService.createTipoMovimiento(
          onMovimientoGuardado,
          forms,
          onError
        );
        form.resetFields(); // Reset form fields when closing the modal
      }
    });
  }
  const onMovimientoGuardado = (data) => {
    setIsLoading(false);
    if (data.type == "success") {
      setDescripcion("");
      setTipoIngreso("");
      cargarDatos();
      Swal.fire({
        title: "Movimiento guardado con éxito",
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
              console.log("datos: ", datos);
            }}
            size="large"
          >
            <FaUserTag className="m-auto" size={"20px"} />
          </Button>
        </Tooltip>
        <Input.Search
          placeholder="Buscar Movimiento"
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
                    <p>Nombre Movimiento</p>
                  </TableCell>
                  <TableCell>
                    <p>Tipo Ingreso</p>
                  </TableCell>
                  <TableCell>
                    <p>Color</p>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stableSort(datos, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dato, index) => (
                    <TableRow key={dato.id}>
                      <TableCell>{toTitleCase(dato.descripcion)}</TableCell>
                      <TableCell>
                        {dato.tipo_ingreso === 1 ? "Abono" : "Cargo"}
                      </TableCell>
                      <TableCell>
                        <ColorPicker
                          defaultValue={dato.codigo_color}
                          showText
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Haz clic aquí para eliminar un tipo de movimiento">
                          <Button
                            className="boton-eliminar"
                            key={dato.id}
                            onClick={() => {
                              handleEliminarMovimiento(
                                dato.id,
                                dato.descripcion
                              );
                            }}
                            size="large"
                          >
                            <FaRegTrashAlt className="m-auto" size={"20px"} />
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
        title={customTitle}
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
                  name="movimiento"
                  label="Nombre Movimiento"
                  rules={[
                    {
                      required: true,
                      message: "Ingresa un nombre de Movimiento!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nombre Movimiento"
                    value={descripcion}
                    onChange={(e) => {
                      setDescripcion(e.target.value);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="tipoIngreso"
                  label="Tipo de ingreso"
                  rules={[
                    {
                      required: true,
                      message: "Ingresa un Tipo de ingreso!",
                    },
                  ]}
                >
                  <Select
                    placeholder={"Financiamiento"}
                    optionLabelProp="label"
                    value={tipoIngreso}
                    style={{ width: "100%" }}
                    onChange={(value, label) => {
                      setTipoIngreso(value);
                    }}
                  >
                    <Option value={1} label={"Abono"}>
                      Abono
                    </Option>
                    <Option value={2} label={"Cargo"}>
                      Cargo
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item name="colorLinea" label="Color">
                  <ColorPicker
                    styles={{
                      popupOverlayInner: {
                        width: 480,
                      },
                    }}
                    presets={presets}
                    panelRender={customPanelRender}
                    showText
                    format="hex"
                    defaultValue={color}
                    onFormatChange="hex"
                    onChange={(value) => {
                      setColor(value.toHexString());
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
      </Modal>
    </div>
  );
}
