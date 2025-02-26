import terrenosService from "@/services/terrenosService";
import { Button, Checkbox, Col, Form, Row, Select, Typography } from "antd";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TableFooter,
} from "@mui/material";
import { useEffect, useState } from "react";
import recursosService from "@/services/recursosService";
import Loader80 from "@/components/Loader80";
import { formatPrecio } from "@/helpers/formatters";
import Swal from "sweetalert2";
const { Option } = Select;

export default function Anticipos() {
  // * Variables del funcionamiento de la Tabla
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("fecha_operacion");

  // * Variables del funcionamiento de la Tabla
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);
  const [order2, setOrder2] = useState("desc");
  const [orderBy2, setOrderBy2] = useState("fecha_operacion");

  const [cambiados, setCambiados] = useState([]);
  const [datos, setDatos] = useState([]);
  const [terrenos, setTerrenos] = useState([]);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [sistemaPagoSelected, setSistemaPagoSelected] = useState(null);
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    terrenosService.getTerrenos(setTerrenos, onError);
  }, []);

  const handleSelectChange = (value) => {
    setTerrenoSelected(value);
  };

  const handleChangeSistemaPago = (value) => {
    setSistemaPagoSelected(value);
  };

  const onError = () => {
    setLoading(false);
    Swal.fire({
      title: "Error",
      icon: "error",
      text: "Ha ocurrido un error",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    });
  };

  // * Handlers para cambiar la página y el número de filas por página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  // * Funciones de comparación para ordenar la tabla
  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
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

  const stableSort2 = (array, comparador) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparador(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const descendingComparator2 = (a, b, orderBy) => {
    if (b[orderBy2] < a[orderBy2]) {
      return -1;
    }
    if (b[orderBy2] > a[orderBy2]) {
      return 1;
    }
    return 0;
  };

  // * Obtiene el comparador según el orden y el campo de ordenamiento
  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getComparator2 = (order, orderBy) => {
    return order2 === "desc"
      ? (a, b) => descendingComparator2(a, b, orderBy2)
      : (a, b) => -descendingComparator2(a, b, orderBy2);
  };

  const handleRequestSort2 = (event, property) => {
    const isAsc = orderBy2 === property && order2 === "asc";
    setOrder2(isAsc ? "desc" : "asc");
    setOrderBy2(property);
  };

  function buscarAnticipos() {
    let forms = {
      terreno_id: terrenoSelected,
      sistema_pago_id: sistemaPagoSelected,
      check: check,
    };
    setLoading(true);
    recursosService.getAnticipos(forms, onBusqueda, onError).then(() => {
      setLoading(false);
    });
  }

  function onBusqueda(data) {
    setDatos(data.anticipo_info);
    setCambiados(data.recibidos);
  }

  async function cambiarEstatus(fila) {
    let forms = {
      id: fila.id,
      sistema_pago_id: fila.sistema_pago_id,
    };
    let titulo;
    let texto;
    if (fila.sistema_pago_id === 1) {
      titulo = "Recibir Anticipo";
      texto = "¿Estás seguro de recibir este anticipo?";
    } else {
      titulo = "Consolidar Transferencia de Anticipo";
      texto = "¿Estás seguro de consolidar la transferencia de este anticipo?";
    }
    await Swal.fire({
      title: titulo,
      text: texto,
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        recursosService.cambiarAnticipo(forms, onCambioExitoso, onError);
      }
    });
  }

  function onCambioExitoso(data) {
    setLoading(false);
    if (data.type == "Success") {
      buscarAnticipos();
      Swal.fire({
        title: data.message,
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
  }

  return (
    <div>
      {loading && (
        <>
          <Loader80 />
        </>
      )}
      <Form
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
      >
        <Row justify={"center"} className="mb-5 gap-2">
          <Col>
            <Select
              showSearch
              placeholder="Seleccione un Sistema de Pago"
              style={{ minWidth: "12vw", maxWidth: "12vw" }}
              optionLabelProp="label"
              onChange={handleChangeSistemaPago}
            >
              <Option value={0} label={"Todos"}>
                Todos
              </Option>
              <Option value={1} label={"Pago en Oficina"}>
                Pago en Oficina
              </Option>
              <Option value={2} label={"Transferencia"}>
                Transferencia
              </Option>
            </Select>
          </Col>
          <Col>
            <Select
              showSearch
              placeholder="Seleccione un Proyecto"
              style={{ minWidth: "12vw", maxWidth: "12vw" }}
              optionLabelProp="label"
              onChange={handleSelectChange}
            >
              <Option value={0} label={"Todos"}>
                Todos
              </Option>
              {terrenos?.map((item, index) => (
                <Option key={item.id} value={item.id} label={item.nombre}>
                  {item?.nombre}
                </Option>
              ))}
            </Select>
          </Col>
          <Col style={{ marginTop: "auto", marginBottom: "auto" }}>
            <Checkbox
              onChange={() => {
                setCheck(!check);
              }}
              checked={check}
            >
              Recibidos Y Consolidados
            </Checkbox>
          </Col>
          <Col>
            <Button
              className="boton"
              onClick={() => {
                buscarAnticipos();
              }}
            >
              Cargar Anticipos
            </Button>
          </Col>
        </Row>
      </Form>
      <Row justify={"center"} className="mt-5" style={{ margin: "16px" }}>
        <Col className="titulo_pantallas">
          <p>Pendientes</p>
        </Col>
      </Row>

      <Row justify={"center"} className="mb-5">
        <Col xs={20} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Nombre Cliente</p>
                  </TableCell>
                  <TableCell>
                    <p>Proyecto</p>
                  </TableCell>
                  <TableCell>
                    <p>Lote</p>
                  </TableCell>
                  <TableCell>
                    <p>
                      <TableSortLabel
                        active={orderBy === "fecha_operacion"}
                        direction={
                          orderBy === "fecha_operacion" ? order : "asc"
                        }
                        onClick={(event) =>
                          handleRequestSort(event, "fecha_operacion")
                        }
                      ></TableSortLabel>
                      Fecha Operacion
                    </p>
                  </TableCell>
                  <TableCell>
                    <p>Importe</p>
                  </TableCell>
                  <TableCell>
                    <p>Sistema Pago</p>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stableSort(datos, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dato, index) => (
                    <TableRow key={dato.id}>
                      <TableCell>{dato.nombre_cliente}</TableCell>
                      <TableCell>{dato.nombre_lote}</TableCell>
                      <TableCell>{dato.lote}</TableCell>
                      <TableCell>{dato.fecha_operacion}</TableCell>
                      <TableCell>${formatPrecio(dato.importe)}</TableCell>
                      <TableCell>{dato.sistema_pago}</TableCell>
                      <TableCell>
                        <Button
                          key={dato}
                          onClick={() => {
                            cambiarEstatus(dato);
                          }}
                          size="large"
                        >
                          {dato.sistema_pago_id === 1 ? "Recibir" : "Conciliar"}
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
      <Row justify={"center"} className="mt-5" style={{ margin: "16px" }}>
        <Col className="titulo_pantallas">
          <p>Recibidos o Consolidados</p>
        </Col>
      </Row>
      <Row justify={"center"} className="mb-5">
        <Col xs={20} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Nombre Cliente</p>
                  </TableCell>
                  <TableCell>
                    <p>Proyecto</p>
                  </TableCell>
                  <TableCell>
                    <p>Lote</p>
                  </TableCell>
                  <TableCell>
                    <p>
                      <TableSortLabel
                        active={orderBy === "fecha_operacion"}
                        direction={
                          orderBy === "fecha_operacion" ? order2 : "asc"
                        }
                        onClick={(event) =>
                          handleRequestSort2(event, "fecha_operacion")
                        }
                      ></TableSortLabel>
                      Fecha Operacion
                    </p>
                  </TableCell>
                  <TableCell>
                    <p>Importe</p>
                  </TableCell>
                  <TableCell>
                    <p>Sistema Pago</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Recibio</p>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stableSort2(cambiados, getComparator2(order2, orderBy2))
                  .slice(
                    page2 * rowsPerPage2,
                    page2 * rowsPerPage2 + rowsPerPage2
                  )
                  .map((cambiado, index) => (
                    <TableRow key={cambiado.id}>
                      <TableCell>{cambiado.nombre_cliente}</TableCell>
                      <TableCell>{cambiado.nombre_lote}</TableCell>
                      <TableCell>{cambiado.lote}</TableCell>
                      <TableCell>{cambiado.fecha_operacion}</TableCell>
                      <TableCell>${formatPrecio(cambiado.importe)}</TableCell>
                      <TableCell>{cambiado.sistema_pago}</TableCell>
                      <TableCell>{cambiado.fecha_recibio}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={cambiados.length}
                    rowsPerPage={rowsPerPage2}
                    page={page2}
                    onPageChange={handleChangePage2}
                    onRowsPerPageChange={handleChangeRowsPerPage2}
                    labelRowsPerPage="Registros por Página"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Col>
      </Row>
    </div>
  );
}
