import { LoadingContext } from "@/contexts/loading";
import configuracionService from "@/services/configuracionService";
import { Button, Checkbox, Col, Form, Row } from "antd";
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
import { FaPencilAlt, FaRegTrashAlt, FaUsersCog } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

/**
 * Component to edit a Menue.
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.data - The Menue data to be edited.
 * @param {Function} props.callback - The callback function to be called after editing.
 * @param {Function} props.recargarDatos - The function to reload data.
 * @returns {JSX.Element} - The JSX element for the EditarMenu component.
 */
export default function AsignarMenu({ data, callback, recargarDatos }) {
  //Variables del funcionamiento de la Tabla
  const [orderBy, setOrderBy] = useState("created_at");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  // State variables
  const [nombre, setNombre] = useState(data.nombre);
  const [datos, setDatos] = useState([]);
  const [menuActivos, setMenuActivos] = useState([]);

  /*  const [checkedItems, setCheckedItems] = useState(
    datos.reduce((acc, dato, index) => {
      acc[dato.descripcion] = false; // Inicializa todos los checkboxes como no seleccionados
      return acc;
    }, {})
  ); */
  const [checkedItems, setCheckedItems] = useState({});

  // Función para manejar el cambio del checkbox
  const handleCheckboxChange = (descripcion) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [descripcion]: !prevCheckedItems[descripcion], // Alterna el estado del checkbox
    }));
  };
  // Context
  const { setIsLoading } = useContext(LoadingContext);

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
      nombreRol: nombre,
      checkedItems: checkedItems,
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
   * Callback function for when the Menue is saved.
   * @param {Object} data - The response data from the server.
   */
  const onMenuGuardado = (data) => {
    setIsLoading(false);
    if (data.type == "success") {
      recargarDatos();
      Swal.fire({
        title: "Menú actualizado con éxito",
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

  // Efecto para cargar los datos cuando el componente se monta
  useEffect(() => {
    cargarDatos();
  }, []);

  // Función para cargar los datos de los Menues
  function cargarDatos() {
    setIsLoading(true);
    configuracionService
      .getIMenu(data.id, setDatos, setMenuActivos, onError)
      .then(() => {
        setIsLoading(false);
      });
  }

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

  // Función para manejar el cambio del checkbox en el TableHead
  const handleSelectAllChange = (e) => {
    const { checked } = e.target;
    const newCheckedItems = {};
    datos.forEach((dato) => {
      newCheckedItems[dato.descripcion] = checked;
    });
    setCheckedItems(newCheckedItems);
  };

  // Verificar si todos los checkboxes están seleccionados
  const allChecked = datos.every((dato) => checkedItems[dato.descripcion]);

  useEffect(() => {
    if (menuActivos.length > 0) {
      // IDs de los elementos que deben estar activados inicialmente
      const checkedInitialItems = menuActivos.map((e) => {
        return e.descripcion;
      });

      // Inicializa los checkboxes basados en checkedInitialItems
      const initialCheckedItems = datos.reduce((acc, item) => {
        acc[item.descripcion] = checkedInitialItems.includes(item.descripcion);
        return acc;
      }, {});
      setCheckedItems(initialCheckedItems);
    }
  }, [menuActivos]);

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
                      <p>Descripción</p>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={allChecked}
                        onChange={handleSelectAllChange}
                      >
                        <p>Todos</p>
                      </Checkbox>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {stableSort(datos, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((dato, index) => (
                      <TableRow key={index}>
                        <TableCell>{dato.descripcion}</TableCell>
                        <TableCell>
                          <Form.Item>
                            <Checkbox
                              checked={checkedItems[dato.descripcion]}
                              onChange={() => {
                                handleCheckboxChange(dato.descripcion);
                              }}
                            ></Checkbox>
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
