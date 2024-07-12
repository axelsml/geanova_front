"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Button,
  DatePicker,
  Form,
  Select,
  Card,
  Modal,
  Alert,
  Input,
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
import Swal from "sweetalert2";
import locale from "antd/lib/date-picker/locale/es_ES"; // Importa el locale que desees
import recursosService from "@/services/recursosService";
import {
  fechaFormateada2,
  formatPrecio,
  toTitleCase,
} from "@/helpers/formatters";
import AdministrarTipoMovimiento from "./AdministrarTipoMovimiento";
import "./styles.css"; // Archivo CSS personalizado

const { RangePicker } = DatePicker;
export default function ManejoEfectivo() {
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

  //Variables del modal
  const [showModal, setShowModal] = useState(false);

  const [solicitudes, setSolicitudes] = useState([]);
  const [cobranza, setCobranza] = useState([]);
  const { setIsLoading } = useContext(LoadingContext);

  const [range, setRange] = useState([]);
  const [movimientos, setMovimientos] = useState(false);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [tipoSelected, setTipoSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [datos, setDatos] = useState([]);
  const [cobranzaResumen, setCobranzaResumen] = useState();
  const [resumenAnticipo, setResumenAnticipo] = useState();
  const [totalAbono, setTotalAbono] = useState();
  const [totalCargo, setTotalCargo] = useState();

  const [formValues, setFormValues] = useState({});
  const [formValuesSucursal, setFormValuesSucursal] = useState({});

  const { Option } = Select;

  const opcionTipo = [
    { index: 0, id: 0, nombre: "Todos" },
    { index: 1, id: 1, nombre: "Cobranza" },
    { index: 2, id: 2, nombre: "Anticipo" },
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

  // Handlers para cerrar los modales
  const handleCloseModal = () => {
    setShowModal(false);
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
    setRange([fechaAtras, fechaActual]);

    setearMovimientos();
  }, []);

  function setearMovimientos(params) {
    recursosService.showTipoMovimientoManejo(setDatos, onError).then(() => {
      setIsLoading(false);
    });
  }

  const onRangeChange = (dates, dateStrings) => {
    setRange(dateStrings);
  };
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
  const layoutResumen = {
    labelCol: { span: 16 },
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
      tipo: tipoSelected,
    };

    recursosService.getIManejo(form, onConsulta, onError).then(() => {
      setIsLoading(false);
    });
  }

  function onConsulta(response) {
    let {
      resumenTotal,
      infoAnticipos,
      infoCobranza,
      message,
      sumaAnticipo,
      type,
      sumaCobranza,
    } = response;
    let totalSumStatus1;
    let totalSumStatus2;
    let tiposMovimientos = resumenTotal;
    let totalAbonos;
    let totalCargo;
    let initialValues = {};
    console.log("response:", response);
    if (infoAnticipos !== null) {
      setSolicitudes(infoAnticipos);
    } else {
      setSolicitudes([]);
    }
    if (infoCobranza !== null) {
      setCobranza(infoCobranza);
      infoCobranza.forEach((item) => {
        initialValues[`${item.id}`] = item.tipo_movimiento_id;
      });
      setFormValues(initialValues);
      setDatos(tiposMovimientos);
    } else {
      setCobranza([]);
    }
    // Inicializar formValues con los valores obtenidos
    if (tipoSelected === 2) {
      setCobranzaResumen(0);
      setResumenAnticipo(parseFloat(sumaAnticipo));
      setearMovimientos();
    } else {
      setCobranzaResumen(parseFloat(sumaCobranza));
      setResumenAnticipo(parseFloat(sumaAnticipo));
    }

    setMessage({
      type: type,
      message: message,
    });

    if (tiposMovimientos !== null) {
      totalSumStatus1 = sumValuesByStatus(tiposMovimientos, 1);
      totalSumStatus2 = sumValuesByStatus(tiposMovimientos, 2);

      if (tipoSelected === 0 || tipoSelected === null || tipoSelected === "0") {
        totalAbonos =
          Math.abs(totalSumStatus1) +
          parseFloat(sumaAnticipo) +
          parseFloat(sumaCobranza);
      } else {
        totalAbonos = Math.abs(totalSumStatus1) + parseFloat(sumaCobranza);
      }
      totalCargo = totalSumStatus2;
    } else {
      totalAbonos = parseFloat(sumaAnticipo);
      totalCargo = 0;
    }
    setTotalAbono(formatPrecio(totalAbonos));
    setTotalCargo(formatPrecio(totalCargo));
  }
  const sumValuesByStatus = (obj, tipo_ingreso) => {
    return Object.values(obj)
      .filter((item) => item.tipo_ingreso === tipo_ingreso)
      .reduce((acc, item) => acc + item.total, 0);
  };

  const handleChange = (value, name) => {
    let params = {
      id: name,
      tipo_movimiento_id: value,
    };
    recursosService.updateTipoMovimientoManejo(onBuscar, params, onError);

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  function colorDinamicoRow(codigo_color, monto, tipo_movimiento_id) {
    if (monto > 0 && tipo_movimiento_id === null) {
      return {
        backgroundColor: "rgb(67, 141, 204)",
      };
    } else {
      return {
        backgroundColor: codigo_color,
      };
    }
  }

  // Títulos personalizados para los modales
  const customTitle = (
    <Row justify={"center"}>
      <Typography.Title level={3}>
        Administrar Tipos de Movimientos
      </Typography.Title>
    </Row>
  );
  // Títulos personalizados para los cards
  const customTitleCard = (title) => {
    return (
      <Row justify={"center"}>
        <Typography.Title level={4}>{title}</Typography.Title>
      </Row>
    );
  };

  return (
    <div style={{ paddingBottom: 30 }}>
      <Form {...layout} name="busqueda">
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
        </Row>
        <Row
          justify="center"
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          className="mb-5"
        >
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <div>
              <Button
                className="boton"
                onClick={() => {
                  setShowModal(true);
                }}
                type="primary"
                block
              >
                Administrar Movimientos
              </Button>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <div>
              <Button
                className="boton"
                onClick={() => {
                  onBuscar();
                }}
                type="primary"
                block
              >
                Buscar
              </Button>
            </div>
          </Col>
        </Row>
      </Form>

      {Object.keys(message).length > 0 && errorMessage.length == 0 && (
        <Row style={{ paddingTop: 10, paddingBottom: 25 }}>
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
        <Row style={{ paddingTop: 10, paddingBottom: 25 }}>
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
      <Row justify="space-evenly" gutter={16}>
        <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
          <Card
            className="custom-card"
            title={customTitleCard("Abonos")}
            hoverable
            bordered={false}
          >
            <Form {...layoutResumen} name="basicForm">
              <Form.Item name={`anticipo`} label={"Anticipo"}>
                <Input
                  placeholder={
                    `$ ` + (resumenAnticipo ? formatPrecio(resumenAnticipo) : 0)
                  }
                  readOnly
                  value={
                    `$ ` + (resumenAnticipo ? formatPrecio(resumenAnticipo) : 0)
                  }
                />
                <p></p>
              </Form.Item>
              <Form.Item name={`otrosAbonos`} label={"Cobranza"}>
                <Input
                  placeholder={
                    `$ ` + (cobranzaResumen ? formatPrecio(cobranzaResumen) : 0)
                  }
                  readOnly
                  value={
                    `$ ` + (cobranzaResumen ? formatPrecio(cobranzaResumen) : 0)
                  }
                />
                <p></p>
              </Form.Item>
              {datos.map((dato, index) => {
                if (dato.tipo_ingreso === 1) {
                  return (
                    <Form.Item
                      key={dato.id}
                      name={`movimiento_${index}`}
                      label={toTitleCase(dato.descripcion)}
                    >
                      <Input
                        placeholder={
                          `$ ` +
                          (dato.total ? formatPrecio(Math.abs(dato.total)) : 0)
                        }
                        readOnly
                        value={
                          `$ ` +
                          (dato.total ? formatPrecio(Math.abs(dato.total)) : 0)
                        }
                      />
                      <p></p>
                    </Form.Item>
                  );
                }
              })}

              <Form.Item name={`totalAbonos`} label={"Total"}>
                <Input
                  placeholder={
                    `$ ` + (totalAbono ? formatPrecio(totalAbono) : 0)
                  }
                  readOnly
                  value={`$ ` + (totalAbono ? formatPrecio(totalAbono) : 0)}
                />
                <p></p>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
          <Card
            className="custom-card"
            title={customTitleCard("Cargos")}
            hoverable
            bordered={false}
          >
            <Form {...layoutResumen} name="basic">
              {datos.map((dato, index) => {
                if (dato.tipo_ingreso === 2) {
                  return (
                    <Form.Item
                      key={dato.id}
                      name={`movimiento_${index}`}
                      label={toTitleCase(dato.descripcion)}
                    >
                      <Input
                        placeholder={
                          `$ ` + (dato.total ? formatPrecio(dato.total) : 0)
                        }
                        readOnly
                        value={
                          `$ ` + (dato.total ? formatPrecio(dato.total) : 0)
                        }
                      />
                      <p></p>
                    </Form.Item>
                  );
                }
              })}
              <Form.Item name={`totalCargos`} label={"Total"}>
                <Input
                  placeholder={
                    `$ ` + (totalCargo ? formatPrecio(totalCargo) : 0)
                  }
                  readOnly
                  value={`$ ` + (totalCargo ? formatPrecio(totalCargo) : 0)}
                />
                <p></p>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Row
        gutter={[8, 8]}
        justify="center"
        style={{ paddingTop: 10, paddingBottom: 10, margin: 0 }}
      >
        <Typography.Title level={3}>Cobranza</Typography.Title>

        <Col xs={24}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Nombre Cliente</p>
                  </TableCell>
                  <TableCell>
                    <p>Lote/Terreno</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Operacion</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto</p>
                  </TableCell>
                  <TableCell>
                    <p>Usuario Ingreso</p>
                  </TableCell>
                  <TableCell style={{ width: 180 }}>
                    <p>Tipo de movimiento</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort2(cobranza, getComparator2(order2, orderBy2))
                  .slice(
                    page2 * rowsPerPage2,
                    page2 * rowsPerPage2 + rowsPerPage2
                  )
                  .map((dato, index) => (
                    <TableRow
                      key={dato.id}
                      style={colorDinamicoRow(
                        dato.codigo_color,
                        dato.monto,
                        dato.tipo_movimiento_id
                      )}
                    >
                      <TableCell>{dato.nombre_cliente}</TableCell>
                      <TableCell>
                        {dato.lote} - {dato.terreno}
                      </TableCell>
                      <TableCell>
                        {fechaFormateada2(dato.fecha_operacion)}
                      </TableCell>
                      <TableCell>
                        ${dato.monto ? formatPrecio(dato.monto) : "0.00"}
                      </TableCell>
                      <TableCell>{dato.usuario_creacion}</TableCell>
                      <TableCell>
                        <Form.Item>
                          <Select
                            value={formValues[`${dato.id}`]}
                            style={{ width: "100%" }}
                            disabled={dato.status === 1}
                            placeholder={dato.tipo_movimiento_id}
                            onChange={(value) =>
                              handleChange(value, `${dato.id}`)
                            }
                          >
                            {datos.map((option) => (
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
                    count={cobranza.length}
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
      <Row
        gutter={[8, 8]}
        justify="center"
        style={{ paddingTop: 10, paddingBottom: 10, margin: 0 }}
      >
        <Typography.Title level={3}>Anticipos</Typography.Title>

        <Col xs={24}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Nombre Cliente</p>
                  </TableCell>
                  <TableCell>
                    <p>Lote/Terreno</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Operacion</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(solicitudes, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dato, index) => (
                    <TableRow
                      key={dato.id + " " + index}
                      style={colorDinamicoRow("rgb(29, 105, 155)", 1, 1)}
                    >
                      <TableCell>{dato.nombre_cliente}</TableCell>
                      <TableCell>
                        {dato.lote} - {dato.terreno}
                      </TableCell>
                      <TableCell>
                        {fechaFormateada2(dato.fechaOperacion)}
                      </TableCell>
                      <TableCell>
                        ${dato.monto ? formatPrecio(dato.monto) : "0.00"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={solicitudes.length}
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
        {/* Crud de tipo movimientos */}
        <AdministrarTipoMovimiento></AdministrarTipoMovimiento>
      </Modal>
    </div>
  );
}
