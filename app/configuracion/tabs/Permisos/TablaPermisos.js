"use client";
import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Typography, Input, Button, Modal, Tooltip } from "antd";
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
import { FaDesktop, FaUserCheck, FaUserPlus } from "react-icons/fa";
import { LoadingContext } from "@/contexts/loading";
import EditarPermisos from "./EditarPermisos";
import NuevaPantalla from "./NuevaPantalla";
/**
 * Tabla de Usuarios que muestra la lista de Permisoes con opciones de edición y eliminación.
 * @returns {JSX.Element} - Componente de React que renderiza la tabla de usuarios.
 */
export default function TablaPermisos() {
  //Variables del funcionamiento de la Tabla
  const [orderBy] = useState("created_at");
  const [order] = useState("asc");
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

  // Títulos personalizados para los modales
  const customTitleEditar = (texto) => (
    <Row justify={"center"}>
      <Typography.Title level={3}>{texto}</Typography.Title>
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
    configuracionService.getIUsuarioSistema(setDatos, onError).then(() => {
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
        style={{ paddingTop: 20, paddingBottom: 20 }}
        justify="space-between"
      >
        <Col>
          <Tooltip title="Haz clic aquí para crear una nueva pantalla">
            <Button
              className="boton"
              onClick={() => setShowModal(true)}
              size="large"
            >
              <FaDesktop className="m-auto" size={"20px"} />
            </Button>
          </Tooltip>
        </Col>
        <Col xs={24} sm={20} md={16} lg={10} xl={8} xxl={6}>
          <Input.Search
            placeholder="Buscar Permiso"
            style={{
              width: "100%",
            }}
            enterButton="Buscar"
            size="large"
            onSearch={onSearch}
          />
        </Col>
      </Row>
      <Row justify={"center"}>
        <Col xs={24} sm={20} md={16} lg={24} xl={24} xxl={24}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Nombre Usuario</p>
                  </TableCell>
                  <TableCell>
                    <p>Rol</p>
                  </TableCell>
                  <TableCell>
                    <p>Permisos</p>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stableSort(datos, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dato, index) => (
                    <TableRow key={dato.id}>
                      <TableCell>{dato.nombre}</TableCell>
                      <TableCell>{dato.nombreRol}</TableCell>
                      <TableCell>
                        <Tooltip title="Haz clic aquí para asignar permisos a un usuario">
                          <Button
                            className="boton"
                            key={dato}
                            onClick={() => {
                              handleModalEditarPermiso(dato);
                            }}
                            size="large"
                          >
                            <FaUserCheck className="m-auto" size={"20px"} />
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
        title={customTitleEditar("Editar Permisos")}
        footer={null}
        destroyOnClose
        width={600}
        open={showModalEditar}
        onCancel={() => handleCloseModalEditar()}
      >
        {/* Formulario de Editar Permiso */}
        <EditarPermisos
          data={data}
          recargarDatos={cargarDatos}
          callback={handleCloseModalEditar}
        ></EditarPermisos>
      </Modal>
      <Modal
        title={customTitleEditar("Administrar Pantallas")}
        footer={null}
        width={1000}
        open={showModal}
        destroyOnClose
        onCancel={handleCloseModal}
      >
        <NuevaPantalla callback={handleCloseModal} />
      </Modal>
    </div>
  );
}
