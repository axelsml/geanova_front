import { LoadingContext } from "@/contexts/loading";
import configuracionService from "@/services/configuracionService";
import { Button, Col, Form, Row, Select } from "antd";
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
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { toTitleCase } from "@/helpers/formatters";
import "./styles.css"; // Archivo CSS personalizado

/**
 * Component to edit permissions.
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.data - The permissions data to be edited.
 * @param {Function} props.callback - The callback function to be called after editing.
 * @param {Function} props.recargarDatos - The function to reload data.
 * @returns {JSX.Element} - The JSX element for the EditarPermisos component.
 */
export default function EditarPermisos({ data, callback, recargarDatos }) {
  EditarPermisos.propTypes = {
    data: PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      rol_id: PropTypes.number.isRequired,
    }).isRequired,
    callback: PropTypes.func.isRequired,
    recargarDatos: PropTypes.func.isRequired,
  };

  const [orderBy] = useState("created_at");
  const [order] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [nombre] = useState(data.nombre);
  const [datos, setDatos] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const { Option } = Select;

  // State para manejar los valores de cada select
  const [formValues, setFormValues] = useState({});

  // Contexto de carga
  const { setIsLoading } = useContext(LoadingContext);

  // Función callback
  const onHandleCallback = () => {
    callback();
  };

  // Función para manejar errores
  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

  // Función para manejar el envío del formulario
  async function handleSubmit() {
    let form = {
      id: data.id,
      nombreRol: nombre,
      valuePermisos: formValues,
    };
    await Swal.fire({
      title: "Guardar permisos asignados?",
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        configuracionService
          .editPermisos(form, onPermisoGuardado, onError)
          .then((result) => {
            onHandleCallback();
          });
      }
    });
  }

  // Función callback para guardar el menú
  const onPermisoGuardado = (data) => {
    setIsLoading(false);
    if (data.type === "success") {
      recargarDatos();
      Swal.fire({
        title: "Permiso actualizado con éxito",
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

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  // Función para cargar los datos desde el servicio
  function cargarDatos() {
    setIsLoading(true);
    // Obtener permisos de pantallas para el rol específico
    configuracionService
      .getPermisosPantallas(data.rol_id, setDatos, onError)
      .finally(() => {
        setIsLoading(false);
      });

    // Obtener permisos específicos para el menú
    configuracionService
      .getPermisos(
        data.id,
        (response) => {
          // Inicializar formValues con los valores obtenidos
          let initialValues = {};
          response.forEach((item) => {
            initialValues[`${item.nombrePantalla}`] = item.nivel_id;
          });
          setFormValues(initialValues);
        },
        onError
      )
      .finally(() => {
        setIsLoading(false);
      });

    // Obtener niveles de permiso disponibles
    configuracionService.getNivelPermiso(setNiveles, onError).finally(() => {
      setIsLoading(false);
    });
  }

  // Función para manejar el cambio de página en la tabla
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Función para manejar el cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Función para ordenar la tabla
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

  // Función para comparar y ordenar descendente
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  // Función para obtener el comparador según el orden y el campo de ordenamiento
  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  // Función para manejar el cambio de valor en los selects
  const handleChange = (value, name) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div>
      <Row justify={"center"} style={{ paddingTop: 25, paddingBottom: 25 }}>
        <Form
          labelCol={{ span: 20 }}
          layout="horizontal"
          name="usuarioForm"
          onFinish={handleSubmit}
        >
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <TableContainer component={Paper} className="tabla">
              <Table>
                <TableHead className="tabla_encabezado">
                  <TableRow>
                    <TableCell>
                      <p>Pantalla</p>
                    </TableCell>
                    <TableCell>
                      <p>Nivel</p>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {stableSort(datos, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((dato, index) => (
                      <TableRow key={dato.id}>
                        <TableCell>
                          {toTitleCase(dato.pantallaNombre)}
                        </TableCell>
                        <TableCell>
                          <Form.Item>
                            <Select
                              value={formValues[`${dato.pantallaNombre}`]}
                              className="select-responsive"
                              onChange={(value) =>
                                handleChange(value, `${dato.pantallaNombre}`)
                              }
                            >
                              {niveles.map((option) => (
                                <Option key={option.id} value={option.id}>
                                  {option.descripcion}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
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
