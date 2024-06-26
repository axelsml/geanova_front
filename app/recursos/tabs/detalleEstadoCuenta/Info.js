"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Button,
  DatePicker,
  Form,
  Checkbox,
  Select,
  Alert,
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
import { LoadingContext } from "@/contexts/loading";
import terrenosService from "@/services/terrenosService";
import Swal from "sweetalert2";
import locale from "antd/lib/date-picker/locale/es_ES"; // Importa el locale que desees
import recursosService from "@/services/recursosService";
import { fechaFormateada, formatPrecio } from "@/helpers/formatters";

const { RangePicker } = DatePicker;
export default function DetalleEstadoCuenta() {
  //Variables del funcionamiento de la Tabla
  const [orderBy] = useState("fechaOperacion");
  const [order] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //Variables del funcionamiento de la segunda Tabla
  const [orderBy2] = useState("fechaOperacion");
  const [order2] = useState("desc");
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);

  const [tablaAlonso, setTablaAlonso] = useState([]);
  const [tablaSucursal, setTablaSucursal] = useState([]);
  const { setIsLoading } = useContext(LoadingContext);

  const [range, setRange] = useState([]);
  const [movimientos, setMovimientos] = useState(false);
  const [terrenos, setTerrenos] = useState(null);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [tipoSelected, setTipoSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { Option } = Select;

  const opcionTipo = [
    { index: 0, id: 0, nombre: "Todos" },
    { index: 1, id: 1, nombre: "Conciliado" },
    { index: 2, id: 2, nombre: "No conciliado" },
  ];
  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
    if (e.message) {
      setErrorMessage(
        `Error al realizar la consulta, favor de revisar: ${e.message}`
      );
    } else {
      setErrorMessage(`Error al realizar la consulta, favor de revisar ${e}`);
    }
  };

  useEffect(() => {
    // Obtener la fecha actual
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const today = new Date();

    // Función para formatear la fecha en YYYY-MM-DD
    const formatearFecha = (fecha) => {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses son de 0 a 11
      const day = String(fecha.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const fechaActual = formatearFecha(today);
    const fechaAtras = formatearFecha(startOfMonth);
    console.log("range: ", [fechaAtras, fechaActual]);
    setRange([fechaAtras, fechaActual]);
    terrenosService.getTerrenos(setTerrenos, onError);
  }, []);

  const onRangeChange = (dates, dateStrings) => {
    setRange(dateStrings);
    console.log("Dates:", dates);
    console.log("Date Strings:", dateStrings);
  };
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  // Handlers para cambiar la página y el número de filas por página
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

  // Funciones de comparación para ordenar la tabla
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

  const stableSort2 = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order2 = comparator(a[0], b[0]);
      if (order2 !== 0) return order2;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const descendingComparator2 = (a2, b2, orderBy2) => {
    if (b2[orderBy2] < a2[orderBy2]) {
      return -1;
    }
    if (b2[orderBy2] > a2[orderBy2]) {
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
  const getComparator2 = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator2(a, b, orderBy)
      : (a, b) => -descendingComparator2(a, b, orderBy);
  };

  // Funcion para buscar datos en base a los filtros
  function onBuscar() {
    setMessage("");
    setErrorMessage("");
    if (range.length === 0) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes seleccionar un rango de fechas",
      });
    }
    setIsLoading(true);
    let form = {
      fechaInicial: range[0],
      fechaFinal: range[1],
      movimientos: movimientos,
      tipo: tipoSelected,
      proyecto: terrenoSelected,
    };
    console.log("form:", form);
    recursosService
      .getDepositos(form, setMessage, setTablaAlonso, setTablaSucursal, onError)
      .then(() => {
        setIsLoading(false);
      });
  }

  function colorDinamico(statusConciliado) {
    console.log("conciliado: ", statusConciliado);
    if (statusConciliado === 1) {
      return {
        backgroundColor: "rgb(29, 105, 155)",
      };
    }
  }

  return (
    <div style={{ paddingBottom: 30 }}>
      <Form {...layout}>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          justify="center"
          style={{ paddingTop: 10 }}
        >
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <Form.Item name="range" label="Selecciona fechas">
              <RangePicker
                locale={locale}
                format="YYYY-MM-DD"
                defaultValue={range}
                onChange={(value, dateString) => {
                  console.log("Selected Time: ", value);
                  console.log("Formatted Selected Time: ", dateString);
                  onRangeChange(value, dateString);
                }}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <Form.Item
              label="Tipo"
              name="statuspago_id"
              style={{ width: "100%" }}
            >
              <Select
                placeholder="Todos"
                optionLabelProp="label"
                defaultValue={tipoSelected}
                onChange={(value) => {
                  setTipoSelected(value || "0");
                }}
                style={{ width: "100%" }}
              >
                {opcionTipo.map((item) => (
                  <Option key={item.id} value={item.id} label={item.nombre}>
                    {item?.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {tipoSelected === 1 && (
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
              <Form.Item
                label="Proyecto"
                name="terreno"
                style={{ width: "100%" }}
              >
                <Select
                  placeholder="Todos"
                  optionLabelProp="label"
                  onChange={(data) => {
                    setTerrenoSelected(data);
                  }}
                  style={{ width: "100%" }}
                >
                  <Option value={3} label="Todos">
                    Todos
                  </Option>
                  {terrenos?.map((item) => (
                    <Option key={item.id} value={item.id} label={item.nombre}>
                      {item?.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <Form.Item name="range" label="Seleccion opcional">
              <Checkbox
                checked={movimientos}
                onChange={() => setMovimientos(!movimientos)}
              >
                <Typography.Text>Todos los movimientos</Typography.Text>
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"center"}>
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <Button
              className="boton"
              onClick={() => {
                console.log("message: ", Object.keys(message).length);
                onBuscar();
              }}
              type="primary"
              block
            >
              Buscar
            </Button>
          </Col>
        </Row>
      </Form>
      {Object.keys(message).length > 0 && errorMessage.length == 0 && (
        <Row style={{ paddingTop: 10 }}>
          <Alert
            style={{ width: "100%" }}
            message={message.type}
            description={message.message}
            type="success"
            showIcon
            closable
          />
        </Row>
      )}
      {errorMessage.length > 0 && (
        <Row style={{ paddingTop: 10 }}>
          <Alert
            style={{ width: "100%" }}
            message={"Error"}
            description={errorMessage}
            showIcon
            type="error"
            closable
          />
        </Row>
      )}
      <Row
        gutter={[8, 8]}
        justify="center"
        style={{ paddingTop: 10, paddingBottom: 10, margin: 0 }}
      >
        <Typography.Title level={3}>
          Estado de cuenta Alonso Morales
        </Typography.Title>

        <Col xs={24}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Fecha</p>
                  </TableCell>
                  <TableCell>
                    <p>Concepto</p>
                  </TableCell>
                  <TableCell>
                    <p>Cargos</p>
                  </TableCell>
                  <TableCell>
                    <p>Abonos</p>
                  </TableCell>
                  <TableCell>
                    <p>Saldos</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(tablaAlonso, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dato, index) => (
                    <TableRow key={dato.id} style={colorDinamico(dato.status)}>
                      <TableCell>
                        {fechaFormateada(dato.fechaOperacion)}
                      </TableCell>
                      <TableCell>{dato.concepto}</TableCell>
                      <TableCell>
                        ${dato.cargo ? formatPrecio(dato.cargo) : "0.00"}
                      </TableCell>
                      <TableCell>
                        ${dato.abono ? formatPrecio(dato.abono) : "0.00"}
                      </TableCell>
                      <TableCell>
                        ${dato.saldo ? formatPrecio(dato.saldo) : "0.00"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={tablaAlonso.length}
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
      <Row
        gutter={[8, 8]}
        justify="center"
        style={{ paddingTop: 10, paddingBottom: 10, margin: 0 }}
      >
        <Typography.Title level={3}>
          Estado de cuenta sucursal uno de SFPSM #0496201440
        </Typography.Title>

        <Col xs={24}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Fecha</p>
                  </TableCell>
                  <TableCell>
                    <p>Concepto</p>
                  </TableCell>
                  <TableCell>
                    <p>Cargos</p>
                  </TableCell>
                  <TableCell>
                    <p>Abonos</p>
                  </TableCell>
                  <TableCell>
                    <p>Saldos</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort2(tablaSucursal, getComparator2(order2, orderBy2))
                  .slice(
                    page2 * rowsPerPage2,
                    page2 * rowsPerPage2 + rowsPerPage2
                  )
                  .map((dato, index) => (
                    <TableRow key={dato.id} style={colorDinamico(dato.status)}>
                      <TableCell>
                        {fechaFormateada(dato.fechaOperacion)}
                      </TableCell>
                      <TableCell>{dato.concepto}</TableCell>
                      <TableCell>
                        ${dato.cargo ? formatPrecio(dato.cargo) : "0.00"}
                      </TableCell>
                      <TableCell>
                        ${dato.abono ? formatPrecio(dato.abono) : "0.00"}
                      </TableCell>
                      <TableCell>
                        ${dato.saldo ? formatPrecio(dato.saldo) : "0.00"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={tablaSucursal.length}
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
