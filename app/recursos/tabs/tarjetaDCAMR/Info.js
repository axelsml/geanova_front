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
  message as MessageAntd,
  Select,
  Card,
  Modal,
  Alert,
  Input,
  Upload,
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
import { FaCircleExclamation } from "react-icons/fa6";
import Loader80 from "@/components/Loader80";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import locale from "antd/lib/date-picker/locale/es_ES"; // Importa el locale que desees
import { UploadOutlined } from "@ant-design/icons";
import recursosService from "@/services/recursosService";
import { formatPrecio, fechaFormateada } from "@/helpers/formatters";
import AdministrarTipoMovimiento from "./AdministrarTipoMovimiento";
import AdministrarTarjetas from "./AdministrarTarjetas";
import "./styles.css"; // Archivo CSS personalizado
import { getCookiePermisos } from "@/helpers/valorPermisos";

const { RangePicker } = DatePicker;
export default function TarjetaDCAMR() {
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
  const [showModalTarjetas, setShowModalTarjetas] = useState(false);
  const [showModalDetalles, setShowModalDetalles] = useState(false);

  const [tabla, setTabla] = useState([]);
  const [tablaDetalles, setTablaDetalles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [titleDetalles, setTitleDetalles] = useState("");

  const [range, setRange] = useState([]);
  const [movimientos, setMovimientos] = useState(false);
  const [terrenos, setTerrenos] = useState(null);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [tipoSelected, setTipoSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [datos, setDatos] = useState([]);
  const [datosTarjetas, setDatosTarjetas] = useState([]);
  const [otroAbonos, setOtroAbonos] = useState();
  const [otroCargo, setOtroCargo] = useState();
  const [resumenConciliados, setResumenConciliados] = useState();
  const [totalAbono, setTotalAbono] = useState();
  const [totalCargo, setTotalCargo] = useState();

  const [formValues, setFormValues] = useState({});
  const [formValuesSucursal, setFormValuesSucursal] = useState({});
  const [cookiePermisos, setCookiePermisos] = useState([]);
  const { Option } = Select;
  const [excelData, setExcelData] = useState([]);

  const onError = (e) => {
    setLoading(false);
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
  const handleCloseModalTarjetas = () => {
    setShowModalTarjetas(false);
  };
  const handleCloseModalDetalles = () => {
    setShowModalDetalles(false);
    setTablaDetalles([]);
    setTitleDetalles("");
  };

  useEffect(() => {
    // Obtener la fecha actual
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const today = new Date();
    getCookiePermisos("depositos", setCookiePermisos);
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
    cargarTarjetas();
  }, []);
  function setearMovimientos(params) {
    recursosService.showTipoMovimientoTarjeta(setDatos, onError).then(() => {
      setLoading(false);
    });
  }
  function cargarTarjetas() {
    console.log("cargar tarjetas");
    recursosService.showTarjeta(setDatosTarjetas, onError).then(() => {
      setLoading(false);
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

  const filtrarTabla = (movimientos, tipoId) => {
    let filtrarTabla;
    if (tipoId) {
      filtrarTabla = movimientos.filter((dato) => dato.tipo_id === tipoId);
      setTablaDetalles(filtrarTabla);
    }
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
    setLoading(true);
    let form = {
      fechaInicial: range[0],
      fechaFinal: range[1],
      movimientos: movimientos,
      tarjeta: tipoSelected,
    };
    console.log("form", form);
    recursosService
      .getMovimientosTarjetas(form, Consultado, onError)
      .then(() => {
        setLoading(false);
      });
  }

  function Consultado(response) {
    setLoading(false);

    let { type, message, movimientos, resumenTipo } = response;
    let totalSumStatus1;
    let totalSumStatus2;
    let tiposMovimientos = resumenTipo;
    let totalAbonos;
    let totalCargo;
    let initialValues = {};

    console.log("consultado", response);
    setTabla(movimientos);
    movimientos.forEach((item) => {
      initialValues[`${item.id}`] = item.tipo_id;
    });
    setFormValues(initialValues);
    setDatos(tiposMovimientos);

    setMessage({
      type: type,
      message: message,
    });

    if (tiposMovimientos !== null) {
      totalSumStatus1 = sumValuesByStatus(tiposMovimientos, 1);
      totalSumStatus2 = sumValuesByStatus(tiposMovimientos, 2);

      totalAbonos = parseFloat(totalSumStatus1);
      totalCargo = parseFloat(totalSumStatus2);
      setTotalAbono(formatPrecio(totalAbonos));
      setTotalCargo(formatPrecio(totalCargo));
    }
  }

  function onConsulta(response) {
    let { type, message, movimientos } = response;

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

  function onTablaAlonsoSet(
    response,
    responseResumen,
    responseOtrosAbono,
    responseOtrosCargos,
    responseConciliados
  ) {
    // Inicializar formValues con los valores obtenidos
    let initialValues = {};
    response.forEach((item) => {
      initialValues[`${item.id}`] = item.tipo_movimiento_id;
    });
    setFormValues(initialValues);
    setDatos(responseResumen);
    setOtroAbonos(responseOtrosAbono);
    setOtroCargo(responseOtrosCargos);
    setResumenConciliados(responseConciliados);
    const totalSumStatus1 = sumValuesByStatus(responseResumen, 1);
    const totalSumStatus2 = sumValuesByStatus(responseResumen, 2);
    let totalAbonos =
      totalSumStatus1 + responseOtrosAbono + responseConciliados;
    let totalCargo = totalSumStatus2 + responseOtrosCargos;

    setTotalAbono(formatPrecio(totalAbonos));
    setTotalCargo(formatPrecio(totalCargo));
  }
  function onTablaSucursalSet(response) {
    // Inicializar formValues con los valores obtenidos
    let initialValues = {};
    response.forEach((item) => {
      initialValues[`${item.id}`] = item.tipo_movimiento_id;
    });
    setFormValuesSucursal(initialValues);
  }

  const sumValuesByStatus = (obj, tipo_ingreso) => {
    
    return Object.values(obj)
      .filter(item => item.tipo_ingreso === tipo_ingreso && parseInt(item.tipo_id) != 15)
      .reduce((acc, item) => acc + item.total, 0);
  };

  const handleChange = (value, name) => {
    let params = {
      id: name,
      tipo_movimiento_id: value,
    };

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    recursosService.updateTipoMovimientoTarjeta(onBuscar, params, onError);
  };

  const handleChangeSucursal = (value, name) => {
    let params = {
      id: name,
      tipo_movimiento_id: value,
    };

    setFormValuesSucursal((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  function colorDinamicoRow(codigo_color) {
    return {
      backgroundColor: codigo_color,
    };
  }

  function colorDinamicoText(status) {
    if (status === 1) {
      return {
        color: "white",
      };
    } else {
      return {
        color: "black",
      };
    }
  }

  // Títulos personalizados para los modales
  const customTitle = (title, level) => {
    return (
      <Row justify={"center"}>
        <Typography.Title level={level}>{title}</Typography.Title>
      </Row>
    );
  };

  const customTitleDetalles = (
    <Row justify={"center"} style={{ color: "#438dcc", margin: "0 auto" }}>
      <Typography.Title level={2}>{titleDetalles}</Typography.Title>
    </Row>
  );
  // Títulos personalizados para los cards

  function disableSelect(status) {
    if (status === 1 || cookiePermisos < 2) {
      return true;
    } else {
      return false;
    }
  }

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const dataArr = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(dataArr);
      MessageAntd.success(`${file.name} Adjuntado`);
      guardarEstadoCuenta(dataArr);
    };
    reader.readAsArrayBuffer(file);
  };

  function guardarEstadoCuenta(excel_data) {
    excel_data.length > 0
      ? excel_data[0].map((header, index) => ({
          title: header,
          dataIndex: index.toString(),
        }))
      : [];

    //setLoading(true);
    var datos = excel_data.slice(1);
    var datos_formateados = [];

    for (let i = 0; i < datos.length; i++) {
      // let fecha = XLSX.SSF.format('YYYY-DD-MM', datos[i][0]);
      var formattedDate = "";
      if (typeof datos[i][0] === "number") {
        let fecha = excelDateToJSDate(datos[i][0]);
        formattedDate = fecha.toISOString().split("T")[0];
        formattedDate = convertDateFormat(formattedDate);
      } else {
        formattedDate = formatDateString(datos[i][0]);
      }
      var info = {
        tarjeta: datos[i][4],
        fecha_operacion: formattedDate,
        concepto: datos[i][1],
        abono: parseFloat(datos[i][2]),
        cargo: parseFloat(datos[i][3]),
      };

      datos_formateados.push(info);
    }
    var params = {
      movimientos: datos_formateados,
    };
    recursosService.guardarMovimientosTarjetas(
      params,
      onMovimientosGuardados,
      onError
    );
  }

  async function onMovimientosGuardados(data) {
    setLoading(false);
    if (data.success) {
      if (data.datos == 0) {
        Swal.fire({
          title: "Sin cambios",
          icon: "warning",
          text: "No se han registrado cambios",
          confirmButtonColor: "#4096ff",
          cancelButtonColor: "#ff4d4f",
          showDenyButton: false,
          confirmButtonText: "Aceptar",
        });
      } else {
        Swal.fire({
          title: "Info",
          icon: "info",
          text: "Cantidad De Registros Nuevos Guardados: " + data.datos,
          confirmButtonColor: "#4096ff",
          cancelButtonColor: "#ff4d4f",
          showDenyButton: false,
          confirmButtonText: "Aceptar",
        });
      }
    } else {
      Swal.fire({
        title: "Ha ocurrido un Error",
        icon: "warning",
        text: data.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
    }
  }
  function excelDateToJSDate(serial) {
    const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
    const timezoneOffset = date.getTimezoneOffset() * 60000; // Compensa el desfase de la zona horaria
    return new Date(date.getTime() + timezoneOffset);
  }
  function convertDateFormat(dateString) {
    const [year, day, month] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }
  function formatDateString(dateString) {
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day); // Meses en JavaScript van de 0 a 11
    const formattedDate = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    return formattedDate;
  }
  return (
    <div style={{ paddingBottom: 30 }}>
      {loading && (
        <>
          <Loader80 />
        </>
      )}
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
                  onRangeChange(value, dateString);
                }}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <Form.Item
              label="Tarjeta"
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
                <Option value={"0"} label={"Todos"}>
                  Todos
                </Option>
                {datosTarjetas.map((item) => (
                  <Option key={item.id} value={item.id} label={item.alias}>
                    {item?.alias}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <Form.Item name="movimientos" label="Seleccion opcional">
              <Checkbox
                checked={movimientos}
                onChange={() => setMovimientos(!movimientos)}
              >
                <Typography.Text>Todos los movimientos</Typography.Text>
              </Checkbox>
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
                disabled={cookiePermisos >= 2 ? false : true}
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
                  setShowModalTarjetas(true);
                }}
                disabled={cookiePermisos >= 2 ? false : true}
                type="primary"
                block
              >
                Administrar Tarjetas
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

        <Row
          justify="center"
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          className="mb-5"
        >
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <div>
              <Upload
                beforeUpload={(file) => {
                  handleUpload(file);
                  return false;
                }}
                showUploadList={false}
              >
                <Button
                  block
                  className="boton"
                  icon={<UploadOutlined />}
                  disabled={cookiePermisos >= 2 ? false : true}
                >
                  Adjuntar Archivo
                </Button>
              </Upload>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}></Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}></Col>
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
            title={customTitle("Abonos", 4)}
            hoverable
            bordered={false}
          >
            <Form {...layoutResumen} name="basicForm">
              {datos.map((dato, index) => {
                if (dato.tipo_ingreso === 1) {
                  return (
                    <Form.Item
                      key={dato.id}
                      name={`movimiento_${index}`}
                      label={
                        <span
                          style={{ cursor: "pointer" }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.color = "#4096ff")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.color = "initial")
                          }
                          onClick={() => {
                            setTablaDetalles(tabla);
                            filtrarTabla(tabla, dato.id);
                            setTitleDetalles(
                              "Detalles de" + " " + dato.descripcion
                            );
                            setShowModalDetalles(true);
                          }}
                        >
                          {dato.descripcion}
                        </span>
                      }
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
            title={customTitle("Cargos", 4)}
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
                      label={
                        <span
                          style={{ cursor: "pointer" }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.color = "#4096ff")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.color = "initial")
                          }
                          onClick={() => {
                            setTablaDetalles(tabla);
                            filtrarTabla(tabla, dato.id);
                            setTitleDetalles(
                              "Detalles de" + " " + dato.descripcion
                            );
                            setShowModalDetalles(true);
                          }}
                        >
                          {dato.descripcion}
                        </span>
                      }
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
        <Row>
          <Col style={{ margin: "auto" }}>
            <p className="titulo_pantallas" style={{ fontSize: "24px" }}>
              Movimientos
            </p>
          </Col>
        </Row>

        <Col xs={24}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Fecha</p>
                  </TableCell>
                  <TableCell>
                    <p>Tarjeta</p>
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
                  <TableCell style={{ width: 180 }}>
                    <p>Tipo de movimiento</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(tabla, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dato, index) => (
                    <TableRow
                      key={dato.id}
                      style={colorDinamicoRow(dato.codigo_color)}
                    >
                      <TableCell>
                        {fechaFormateada(dato.fecha_operacion)}
                      </TableCell>
                      <TableCell>{dato.tarjeta}</TableCell>
                      <TableCell>{dato.concepto}</TableCell>
                      <TableCell>
                        ${dato.cargo ? formatPrecio(dato.cargo) : "0.00"}
                      </TableCell>
                      <TableCell>
                        ${dato.abono ? formatPrecio(dato.abono) : "0.00"}
                      </TableCell>
                      <TableCell>
                        <Form.Item>
                          <Select
                            value={formValues[`${dato.id}`]}
                            style={{ width: "100%" }}
                            disabled={disableSelect(dato.status)}
                            placeholder={dato.tipo_id}
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
                    count={tabla.length}
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
        title={customTitle("Administrar Tipos de Movimientos", 3)}
        footer={null}
        width={600}
        open={showModal}
        onCancel={() => handleCloseModal()}
      >
        {/* Crud de tipo movimientos */}
        <AdministrarTipoMovimiento></AdministrarTipoMovimiento>
      </Modal>
      <Modal
        title={customTitle("Administrar Tarjetas", 3)}
        footer={null}
        width={600}
        open={showModalTarjetas}
        onCancel={() => handleCloseModalTarjetas()}
      >
        {/* Crud de tipo movimientos */}
        <AdministrarTarjetas
          cargarTarjetas={cargarTarjetas}
        ></AdministrarTarjetas>
      </Modal>

      <Modal
        title={customTitleDetalles}
        footer={null}
        width={900}
        open={showModalDetalles}
        onCancel={() => handleCloseModalDetalles()}
      >
        <div>
          {tablaDetalles.length === 0 && (
            <Row
              justify={"center"}
              style={{ margin: 16, flexDirection: "column" }}
            >
              <Row>
                <Typography.Title
                  level={3}
                  style={{
                    color: "orange",
                    textAlign: "center",
                    margin: "0 auto",
                  }}
                >
                  No hay {titleDetalles} disponibles con la información
                  solicitada
                </Typography.Title>
              </Row>
              <Row style={{ margin: "24px" }}>
                <FaCircleExclamation
                  className="m-auto"
                  size={"60px"}
                  color="orange"
                />
              </Row>
            </Row>
          )}
          {tablaDetalles.length > 0 && (
            <Row
              gutter={[8, 8]}
              justify="center"
              style={{ paddingTop: 10, paddingBottom: 10, margin: 0 }}
            >
              <Typography.Title level={3}>Movimientos</Typography.Title>

              <Col xs={24}>
                <TableContainer component={Paper} className="tabla">
                  <Table>
                    <TableHead className="tabla_encabezado">
                      <TableRow>
                        <TableCell>
                          <p>Fecha</p>
                        </TableCell>
                        <TableCell>
                          <p>Tarjeta</p>
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
                        <TableCell style={{ width: 180 }}>
                          <p>Tipo de movimiento</p>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stableSort2(
                        tablaDetalles,
                        getComparator2(order2, orderBy2)
                      )
                        .slice(
                          page2 * rowsPerPage2,
                          page2 * rowsPerPage2 + rowsPerPage2
                        )
                        .map((dato, index) => (
                          <TableRow
                            key={dato.id}
                            style={colorDinamicoRow(dato.codigo_color)}
                          >
                            <TableCell>
                              {fechaFormateada(dato.fecha_operacion)}
                            </TableCell>
                            <TableCell>{dato.tarjeta}</TableCell>
                            <TableCell>{dato.concepto}</TableCell>
                            <TableCell>
                              ${dato.cargo ? formatPrecio(dato.cargo) : "0.00"}
                            </TableCell>
                            <TableCell>
                              ${dato.abono ? formatPrecio(dato.abono) : "0.00"}
                            </TableCell>
                            <TableCell>{dato.descripcion}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          count={tablaDetalles.length}
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
          )}
        </div>
      </Modal>
    </div>
  );
}
