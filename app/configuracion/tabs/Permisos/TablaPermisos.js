"use client";
import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Typography, Input, Button, Modal } from "antd";
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
import configuracionService from "@/services/configuracionService";
import { fechaFormateada } from "@/helpers/formatters";
import { FaPencilAlt, FaRegTrashAlt, FaUserTag } from "react-icons/fa";
import { LoadingContext } from "@/contexts/loading";
import Swal from "sweetalert2";
import NuevoPermiso from "./NuevoPermiso";
import EditarPermiso from "./EditarPermiso";
/**
 * Tabla de Usuarios que muestra la lista de Permisoes con opciones de edición y eliminación.
 * @returns {JSX.Element} - Componente de React que renderiza la tabla de usuarios.
 */
export default function TablaPermisos() {
  //Variables del funcionamiento de la Tabla
  const [orderBy, setOrderBy] = useState("created_at");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //Variables del modal
  const [showModal, setShowModal] = useState(false);

  const [showModalEditar, setShowModalEditar] = useState(false);
  //Variables del componente
  const [datos, setDatos] = useState([]);
  const [data, setData] = useState([]);
  const { setIsLoading } = useContext(LoadingContext);

  // Handlers para cerrar los modales
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseModalEditar = () => {
    setShowModalEditar(false);
  };

  // Handler para abrir el modal de edición de Permiso
  const handleModalEditarPermiso = (inforPermiso) => {
    setData(inforPermiso);
    setShowModalEditar(true);
  };

  // Handler para eliminar un Permiso
  async function handleEliminarPermiso(id, nombre) {
    await Swal.fire({
      title: "Eliminar este Permiso?",
      text: `¿Estás seguro de eliminar ${nombre} ? `,
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        configuracionService
          .eliminarIPermisoes(onPermisoEliminado, id, onError)
          .then(() => {
            cargarDatos();
          });
      }
    });
  }

  // Callback cuando se elimina un Permiso
  const onPermisoEliminado = (data) => {
    setIsLoading(false);
    if (data.type == "success") {
      Swal.fire({
        title: "Permiso eliminado con éxito",
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
      <Typography.Title level={3}>Registrar Permiso</Typography.Title>
    </Row>
  );

  const customTitleEditar = (
    <Row justify={"center"}>
      <Typography.Title level={3}>Editar Permiso</Typography.Title>
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

  // Función para cargar los datos de los Permisoes
  function cargarDatos() {
    setIsLoading(true);
    configuracionService.getIPermiso(setDatos, onError).then(() => {
      setIsLoading(false);
    });
  }

  // Handler para la búsqueda de Permisoes
  const onSearch = (value) => {
    configuracionService.getIPermisoSearch(value, setDatos, onError);
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
        <Button
          className="boton"
          onClick={() => {
            setShowModal(true);
          }}
          size="large"
        >
          <FaUserTag className="m-auto" size={"20px"} />
        </Button>
        <Input.Search
          placeholder="Buscar Permiso"
          style={{
            width: "30%",
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
                    <p>Nombre Permiso</p>
                  </TableCell>
                  <TableCell>
                    <p>Estatus</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Creación</p>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stableSort(datos, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dato, index) => (
                    <TableRow key={index}>
                      <TableCell>{dato.nombre}</TableCell>
                      <TableCell>
                        {dato.active ? "Activo" : "Inactivo"}
                      </TableCell>
                      <TableCell>{fechaFormateada(dato.created_at)}</TableCell>
                      <TableCell>
                        <Button
                          className="boton"
                          key={dato}
                          onClick={() => {
                            handleModalEditarPermiso(dato);
                          }}
                          size="large"
                        >
                          <FaPencilAlt className="m-auto" size={"20px"} />
                        </Button>
                        <Button
                          className="boton-eliminar"
                          key={dato.id}
                          onClick={() => {
                            handleEliminarPermiso(dato.id, dato.nombre);
                          }}
                          size="large"
                        >
                          <FaRegTrashAlt className="m-auto" size={"20px"} />
                        </Button>
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
        destroyOnClose
        onCancel={() => handleCloseModal()}
      >
        {/* Formulario de Nuevo Permiso */}
        <NuevoPermiso
          recargarDatos={cargarDatos}
          callback={handleCloseModal}
        ></NuevoPermiso>
      </Modal>

      <Modal
        title={customTitleEditar}
        footer={null}
        destroyOnClose
        width={600}
        open={showModalEditar}
        onCancel={() => handleCloseModalEditar()}
      >
        {/* Formulario de Editar Permiso */}
        <EditarPermiso
          data={data}
          recargarDatos={cargarDatos}
          callback={handleCloseModalEditar}
        ></EditarPermiso>
      </Modal>
    </div>
  );
}
