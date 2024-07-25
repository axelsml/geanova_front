"use client";
import usuariosService from "@/services/usuariosService";
import { redirect, useRouter } from "next/navigation";
import InputIn from "@/components/Input";
import {
  Form,
  Button,
  Row,
  Col,
  Upload,
  message,
  Tabs,
  Modal,
  Select,
  Checkbox,
} from "antd";
import { Table as TablaExcel } from "antd";
const { TabPane } = Tabs;
const { Option } = Select;

import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { LoadingContext } from "@/contexts/loading";
import Image from "next/image";
import { usuario_id } from "@/helpers/user";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { formatPrecio } from "@/helpers/formatters";
import pagosService from "@/services/pagosService";
import {
  Input,
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
import terrenosService from "@/services/terrenosService";
import lotesService from "@/services/lotesService";
import DetalleEstadoCuenta from "./tabs/detalleEstadoCuenta/Info";
import ManejoEfectivo from "./tabs/manejoEfectivo/info";
import AgregarCargo from "./tabs/agregarCargo/info";
import { getCookiePermisos } from "@/helpers/valorPermisos";
import Anticipos from "./tabs/anticipos/info";
import TarjetaDCAMR from "./tabs/tarjetaDCAMR/Info";
export default function Recursos() {
  //   useEffect(() => {

  //   }, []);
  const { setIsLoading } = useContext(LoadingContext);
  const [excelData, setExcelData] = useState([]);
  const [pendientes, setMovimientosPendientes] = useState([]);
  const [monto_pendientes, setMovimientosPendientesMonto] = useState(0);
  const [monto_pendientes2, setMovimientosPendientesMonto2] = useState(0);
  const [check, setCheck] = useState(false);
  const [recibidos, setMovimientosRecibidos] = useState([]);
  const [por_conciliar, setMovimientoBanco] = useState([]);
  const [movimientos_pendientes, setPendientes] = useState([]);
  const [pago_seleccionado, setPagoSeleccionado] = useState({});
  const [ultimos_movimientos, setUltimosMovimientos] = useState([]);
  const [movimientos_por_conciliar, setMovimientosPorConciliar] = useState([]);

  const [visible, setVisible] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("fecha_operacion");

  const [terrenos, setTerrenos] = useState([]);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [terrenoSelected2, setTerrenoSelected2] = useState(null);

  const [cuentas, setCuentas] = useState([]);
  const [cuentaSelected, setCuentaSelected] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);

  const [page3, setPage3] = useState(0);
  const [rowsPerPage3, setRowsPerPage3] = useState(5);

  const [pago_conciliar_id, setPagoConciliarId] = useState(0);
  const [show, setShow] = useState(false);
  const [cookiePermisos, setCookiePermisos] = useState([]);
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

  const handleChangePage3 = (event, newPage) => {
    setPage3(newPage);
  };

  const handleChangeRowsPerPage3 = (event) => {
    setRowsPerPage3(parseInt(event.target.value, 10));
    setPage3(0);
  };
  useEffect(() => {
    //     ventasService.getVentas(setVentas, Error);
    terrenosService.getTerrenos(setTerrenos, onError);
    //     BuscarInfoLote()
    getCookiePermisos("efectivo", setCookiePermisos);
  }, []);

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const dataArr = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(dataArr);
      message.success(`${file.name} Adjuntado`);
      guardarEstadoCuenta(dataArr);
    };
    reader.readAsArrayBuffer(file);
  };

  const columns =
    excelData.length > 0
      ? excelData[0].map((header, index) => ({
          title: header,
          dataIndex: index.toString(),
        }))
      : [];

  const handleTabChange = (key) => {
    if (key === "2") {
      buscarUltimoRegistroBancos();
    }
  };

  function buscarUltimoRegistroBancos() {
    debugger;
    pagosService.ultimoMovimientoBanco(
      onUltimosMovimientosEncontrados,
      onError
    );
  }
  async function onUltimosMovimientosEncontrados(data) {
    setUltimosMovimientos(data.respuesta);
    setMovimientosPorConciliar(data.movimientos_pendientes);
  }
  const onError = () => {
    setIsLoading(false);
    Swal.fire({
      title: "Error",
      icon: "error",
      text: data.message,
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    });
  };

  function excelDateToJSDate(serial) {
    const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
    const timezoneOffset = date.getTimezoneOffset() * 60000; // Compensa el desfase de la zona horaria
    return new Date(date.getTime() + timezoneOffset);
  }
  function convertDateFormat(dateString) {
    const [year, day, month] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }
  function formatFecha(fecha) {
    debugger;
    let partes = fecha.split("-");
    return `${partes[0]}-${partes[2]}-${partes[1]}`;
  }
  function formatDateString(dateString) {
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day); // Meses en JavaScript van de 0 a 11
    const formattedDate = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    return formattedDate;
  }
  function guardarEstadoCuenta(excel_data) {
    debugger;
    const columns_aux =
      excel_data.length > 0
        ? excel_data[0].map((header, index) => ({
            title: header,
            dataIndex: index.toString(),
          }))
        : [];

    setIsLoading(true);
    var datos = excel_data.slice(1);
    var datos_formateados = [];
    console.log(columns_aux);
    debugger;

    for (let i = 0; i < datos.length; i++) {
      if (columns_aux[0].title == "CUENTA") {
        console.log(datos[i][1]);
        debugger;
        var formattedDate = "";
        if (typeof datos[i][1] === "number") {
          let fecha = excelDateToJSDate(datos[i][1]);
          formattedDate = fecha.toISOString().split("T")[0];
          formattedDate = convertDateFormat(formattedDate);
        } else {
          formattedDate = formatDateString(datos[i][1]);
        }
        // Formato YYYY-MM-DD
        // let fecha = XLSX.SSF.format('YYYY-DD-MM', datos[i][1]);
        // let fecha_ingreso = XLSX.SSF.format('YYYY-DD-MM', datos[i][1]);
        var info = {
          fecha_operacion: formattedDate,
          fecha_ingreso: formattedDate,
          cuenta: datos[i][0],
          cuenta_id: 2,
          descripcion: datos[i][11],
          cargo: parseFloat(datos[i][8]),
          abono: parseFloat(datos[i][7]),
          saldo: parseFloat(datos[i][9]),
          movimiento: datos[i][10],
          descripcion_corta: datos[i][4],
          cod_transaccion: parseInt(datos[i][5]),
          cheque: datos[i][12],
        };
      } else {
        console.log(datos[i][0]);
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
          cuenta_id: 1,
          fecha_operacion: formattedDate,
          descripcion: datos[i][1],
          cargo: parseFloat(datos[i][2]),
          abono: parseFloat(datos[i][3]),
          saldo: parseFloat(datos[i][4]),
        };
      }

      datos_formateados.push(info);
    }
    console.log(datos);
    console.log(datos_formateados);
    debugger;
    var params = {
      movimientos: datos_formateados,
    };
    pagosService.GuardarMovimientosBanco(
      params,
      onMovimientosGuardados,
      onError
    );
  }

  function cargarMovimientosPendientesConciliar() {
    setIsLoading(true);
    var params = {
      terreno_id: terrenoSelected2,
    };
    pagosService.BuscarMovimientoBancoPendientesConciliar(
      params,
      onMovimientosEncontrados,
      onError
    );
  }
  async function onMovimientosEncontrados(data) {
    setIsLoading(false);
    setMovimientoBanco(data.pendientes);
    setMovimientosPendientesMonto2(data.monto_pendiente);
  }
  async function onMovimientosGuardados(data) {
    setIsLoading(false);
    Swal.fire({
      title: "Info",
      icon: "info",
      text:
        "Cantidad De Registros Nuevos Guardados: " + data.movimientos_guardados,
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: false,
      confirmButtonText: "Aceptar",
    });

    buscarUltimoRegistroBancos();
  }
  function cargarMovimientosEfectivo() {
    setIsLoading(true);
    var params = {
      terreno_id: terrenoSelected,
      check: check,
    };
    pagosService.getMovimientosEfectivo(
      params,
      onMovimientosEfectivoCargados,
      onError
    );
  }
  async function onMovimientosEfectivoCargados(data) {
    setIsLoading(false);
    setMovimientosPendientes(data.pendientes);
    setMovimientosPendientesMonto(data.monto_pendiente);
    setMovimientosRecibidos(data.recibidos);
  }

  function cambiar_a_recibido(movimiento) {
    Swal.fire({
      title:
        "El Status De Este Movimiento Se Cambiara a Recibido,¿Desea Continuar?",
      icon: "info",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        var params = {
          movimiento_id: movimiento.id,
          usuario_recibio: usuario_id,
        };
        pagosService
          .cambiarRecibido(params, onMovimientoRecibido, onError)
          .then(() => {
            cargarMovimientosEfectivo();
          });
      }
    });
  }

  function buscarMovimientosBanco(pago) {
    setIsLoading(true);
    setPendientes([]);
    setPagoSeleccionado(pago);
    var params = {
      fecha_operacion: pago.fecha_transferencia,
      monto_pago: pago.monto_pagado,
      lote: pago.lote,
      pago_id: pago.id,
    };
    debugger;
    pagosService.BuscarMovimientoBanco(params, onMovimientosCoinciden, onError);
  }

  async function onMovimientosCoinciden(data) {
    setIsLoading(false);
    if (data.pendientes.length == 0) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No Se Encontro Movimiento",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
    } else {
      setPendientes(data.pendientes);
      setVisible(true);
    }
  }

  function conciliarPago(movimiento) {
    setIsLoading(true);
    var params = {
      pago_id: pago_seleccionado.id,
      movimiento_id: movimiento.id,
      usuario_id: usuario_id,
    };
    debugger;
    pagosService.conciliarPagoCreado(params, onPagoConciliado, onError);
  }

  async function onPagoConciliado(data) {
    setIsLoading(false);
    setVisible(false);
    if (data.success) {
      cargarMovimientosPendientesConciliar();
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No Se Pudo Conciliar Pago",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
    }
  }
  async function onMovimientoRecibido(data) {
    setIsLoading(false);
    if (data.success) {
      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Efectivo Recibido",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
      cargarMovimientosEfectivo();
      setMovimientosPendientes(data.pendientes);
      setMovimientosRecibidos(data.recibidos);
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No Se Pudo Actualizar El Status A Recibido",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
    }
  }
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectChange = (value) => {
    setTerrenoSelected(value);
  };

  const handleSelectChange2 = (value) => {
    setTerrenoSelected2(value);
  };

  return (
    <div>
      <Row justify={"center"}>
        <Col xs={24} sm={20} md={16} lg={12} xl={16} xxl={16}>
          <Tabs defaultActiveKey="1" onChange={handleTabChange}>
            <TabPane tab="Efectivo" key="1">
              {/* <Row justify={"center"}>
               <Col xs={24} sm={20} md={16} lg={12} xl={8} xxl={4} className="titulo_pantallas">
                         <b>MANEJO DE EFECTIVO</b>
               </Col>
               </Row> */}
              <Row justify={"center"} className="m-auto">
                <Col>
                  <Select
                    showSearch
                    placeholder="Seleccione un Proyecto"
                    optionLabelProp="label"
                    onChange={handleSelectChange}
                  >
                    {terrenos?.map((item, index) => (
                      <Option key={index} value={item.id} label={item.nombre}>
                        {item?.nombre}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col>
                  <Checkbox
                    onChange={() => {
                      setCheck(!check);
                    }}
                    checked={check}
                  >
                    Recibidos
                  </Checkbox>
                </Col>
                <Col>
                  <Button
                    className="boton"
                    onClick={() => {
                      cargarMovimientosEfectivo();
                    }}
                  >
                    Cargar Efectivo
                  </Button>
                </Col>
              </Row>

              <Row
                style={{ paddingTop: "20px", paddingBottom: "10px" }}
                justify={"center"}
                className="m-auto"
              >
                <Col className="formulario">
                  <b>Movimientos Pendientes</b>
                </Col>
              </Row>
              <Row justify={"center"} className="m-auto">
                <b>Cantidad Pendiente:</b>
                <a>${formatPrecio(parseFloat(monto_pendientes))}</a>
              </Row>
              <Row justify={"center"} className="m-auto">
                <Col xs={24} sm={20} md={16} lg={16} xl={16} xxl={16}>
                  <TableContainer component={Paper} className="tabla">
                    <Table>
                      <TableHead className="tabla_encabezado">
                        <TableRow>
                          <TableCell>
                            <p>Nombre Cliente</p>
                          </TableCell>
                          <TableCell>
                            <p>Lote</p>
                          </TableCell>

                          <TableCell>
                            <p>Detalle</p>
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
                            <p>Usuario</p>
                          </TableCell>
                          <TableCell>
                            <p>Fecha Amortizacion</p>
                          </TableCell>
                          <TableCell>
                            <p></p>
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {stableSort(pendientes, getComparator(order, orderBy))
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((pendiente, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {pendiente.info_cliente.nombre_completo}
                              </TableCell>
                              <TableCell>{pendiente.lote}</TableCell>
                              <TableCell>{pendiente.comentario}</TableCell>
                              <TableCell>{pendiente.fecha_operacion}</TableCell>
                              <TableCell>
                                ${formatPrecio(pendiente.importe)}
                              </TableCell>
                              <TableCell>
                                {pendiente.usuario_creacion}
                              </TableCell>

                              <TableCell>
                                {pendiente.fecha_amortizacion}
                              </TableCell>
                              <TableCell>
                                <Button
                                  key={pendiente}
                                  disabled={cookiePermisos >= 2 ? false : true}
                                  onClick={() => {
                                    cambiar_a_recibido(pendiente);
                                  }}
                                  size="large"
                                >
                                  Recibir
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={pendientes.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Pendientes por Página"
                          />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Col>
              </Row>
              <Row
                style={{ paddingTop: "20px", paddingBottom: "10px" }}
                justify={"center"}
                className="m-auto"
              >
                <Col className="formulario">
                  <b>Movimientos Recibidos</b>
                </Col>
              </Row>
              <Row justify={"center"} className="m-auto">
                <Col xs={24} sm={20} md={16} lg={16} xl={16} xxl={16}>
                  <TableContainer component={Paper} className="tabla">
                    <Table>
                      <TableHead className="tabla_encabezado">
                        <TableRow>
                          <TableCell>
                            <p>Concepto</p>
                          </TableCell>
                          <TableCell>
                            <p>Detalle</p>
                          </TableCell>
                          <TableCell>
                            <p>Fecha Operacion</p>
                          </TableCell>
                          <TableCell>
                            <p>Importe</p>
                          </TableCell>
                          <TableCell>
                            <p>Usuario Creo</p>
                          </TableCell>
                          <TableCell>
                            <p>Usuario Recibio</p>
                          </TableCell>
                          <TableCell>
                            <p>Fecha Recibio</p>
                          </TableCell>
                          <TableCell>
                            <p>Saldo</p>
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {recibidos
                          .slice(
                            page2 * rowsPerPage2,
                            page2 * rowsPerPage2 + rowsPerPage2
                          )
                          .map((recibido, index) => (
                            <TableRow key={index}>
                              <TableCell>{recibido.concepto}</TableCell>
                              <TableCell>{recibido.comentario}</TableCell>
                              <TableCell>{recibido.fecha_operacion}</TableCell>
                              <TableCell>
                                ${formatPrecio(recibido.importe)}
                              </TableCell>
                              <TableCell>{recibido.usuario_creacion}</TableCell>
                              <TableCell>{recibido.usuario_recibio}</TableCell>
                              <TableCell>{recibido.fecha_recibio}</TableCell>
                              <TableCell>
                                ${formatPrecio(recibido.saldo)}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={recibidos.length}
                            rowsPerPage={rowsPerPage2}
                            page={page2}
                            onPageChange={handleChangePage2}
                            onRowsPerPageChange={handleChangeRowsPerPage2}
                            labelRowsPerPage="Recibidos por Página"
                          />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Banco" key="2">
              <Row justify={"center"} className="m-auto">
                <Col>
                  <Upload
                    beforeUpload={(file) => {
                      handleUpload(file);
                      return false;
                    }}
                    showUploadList={false}
                  >
                    <Button
                      className="boton"
                      disabled={cookiePermisos >= 2 ? false : true}
                      icon={<UploadOutlined />}
                    >
                      Adjuntar Archivo
                    </Button>
                  </Upload>
                </Col>
              </Row>
              <Row justify={"center"} className="m-auto">
                <Col>
                  <Select
                    showSearch
                    placeholder="Seleccione un Proyecto"
                    optionLabelProp="label"
                    onChange={handleSelectChange2}
                  >
                    {terrenos?.map((item, index) => (
                      <Option key={index} value={item.id} label={item.nombre}>
                        {item?.nombre}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col>
                  <Button
                    className="boton"
                    onClick={() => {
                      cargarMovimientosPendientesConciliar();
                    }}
                  >
                    Movimientos Pendientes Conciliar
                  </Button>
                </Col>
              </Row>
              {ultimos_movimientos.length != 0 && (
                <>
                  <Row
                    style={{ paddingTop: "20px" }}
                    justify={"center"}
                    className="m-auto"
                  >
                    <Col className="formulario">
                      <b>Registros Cuentas</b>
                    </Col>
                  </Row>
                  <Row
                    justify={"center"}
                    className="m-auto"
                    style={{ marginTop: "20px" }}
                  >
                    <Col xs={24} sm={20} md={10} lg={10} xl={10} xxl={10}>
                      <TableContainer className="tabla">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Cuenta</TableCell>
                              <TableCell>Fecha Ultimo Registro</TableCell>
                              <TableCell>Ultima Actualizacion</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {ultimos_movimientos.map((mov, index) => (
                              <TableRow key={index}>
                                <TableCell>{mov.cuenta}</TableCell>
                                <TableCell>{mov.fecha}</TableCell>
                                <TableCell>
                                  {mov.ultima_actualizacion}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <TableFooter>
                            <TableRow></TableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>
                    </Col>
                  </Row>
                </>
              )}

              {por_conciliar.length != 0 && (
                <>
                  <Row
                    style={{ paddingTop: "20px" }}
                    justify={"center"}
                    className="m-auto"
                  >
                    <Col className="formulario">
                      <b>Movimientos Pendientes</b>
                    </Col>
                  </Row>
                  <Row justify={"center"} className="m-auto">
                    <b>Cantidad Pendiente:</b>
                    <a>${formatPrecio(parseFloat(monto_pendientes2))}</a>
                  </Row>
                  <Row
                    justify={"center"}
                    className="m-auto"
                    style={{ marginTop: "20px" }}
                  >
                    <Col xs={24} sm={20} md={18} lg={18} xl={18} xxl={18}>
                      <TableContainer className="tabla">
                        <Table>
                          <TableHead className="tabla_encabezado">
                            <TableRow>
                              <TableCell>
                                <p>Nombre Cliente</p>
                              </TableCell>
                              <TableCell>
                                <p>Lote</p>
                              </TableCell>
                              <TableCell>
                                <p>Folio Pago</p>
                              </TableCell>
                              <TableCell>
                                <p>Monto Pagado</p>
                              </TableCell>
                              <TableCell>
                                <p>
                                  <TableSortLabel
                                    active={orderBy === "fecha_operacion"}
                                    direction={
                                      orderBy === "fecha_operacion"
                                        ? order
                                        : "asc"
                                    }
                                    onClick={(event) =>
                                      handleRequestSort(
                                        event,
                                        "fecha_operacion"
                                      )
                                    }
                                  ></TableSortLabel>
                                  Fecha Operacion
                                </p>
                              </TableCell>
                              <TableCell>
                                <p>Fecha Transferencia</p>
                              </TableCell>
                              <TableCell>
                                <p>Fecha Amortizacion</p>
                              </TableCell>
                              <TableCell>
                                <p>Ingreso</p>
                              </TableCell>
                              <TableCell>
                                <p></p>
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {stableSort(
                              por_conciliar,
                              getComparator(order, orderBy)
                            )
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((pago, index) => (
                                <TableRow key={index}>
                                  <TableCell>{pago.nombre_cliente}</TableCell>
                                  <TableCell>{pago.lote}</TableCell>
                                  <TableCell>{pago.folio_pago}</TableCell>
                                  <TableCell>
                                    ${formatPrecio(pago.monto_pagado)}
                                  </TableCell>
                                  <TableCell>{pago.fecha_operacion}</TableCell>
                                  <TableCell>
                                    {pago.fecha_transferencia}
                                  </TableCell>
                                  <TableCell>
                                    {pago.fecha_amortizacion}
                                  </TableCell>
                                  <TableCell>{pago.usuario_ingreso}</TableCell>
                                  <TableCell>
                                    <Button
                                      disabled={
                                        cookiePermisos >= 2 ? false : true
                                      }
                                      className="boton"
                                      key={pago}
                                      onClick={() => {
                                        buscarMovimientosBanco(pago);
                                      }}
                                      size="large"
                                    >
                                      Conciliar
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                              <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={por_conciliar.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Pendientes por Página"
                              />
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>
                    </Col>
                  </Row>
                </>
              )}
              <Row
                style={{ paddingTop: "20px" }}
                justify={"center"}
                className="m-auto"
              >
                <Col className="formulario">
                  <b>Movimientos Disponibles</b>
                </Col>
              </Row>
              <Row
                justify={"center"}
                className="m-auto"
                style={{ marginTop: "20px" }}
              >
                <Col xs={24} sm={20} md={20} lg={20} xl={20} xxl={20}>
                  <TableContainer className="tabla">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Cuenta</TableCell>
                          <TableCell>Fecha Operacion</TableCell>
                          <TableCell>Descripcion</TableCell>
                          <TableCell>Descripcion Larga</TableCell>
                          <TableCell>Monto</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stableSort(
                          movimientos_por_conciliar,
                          getComparator(order, orderBy)
                        )
                          .slice(
                            page3 * rowsPerPage3,
                            page3 * rowsPerPage3 + rowsPerPage3
                          )
                          .map((mov, index) => (
                            <TableRow key={index}>
                              <TableCell>{mov.cuenta}</TableCell>
                              <TableCell>{mov.fecha_operacion}</TableCell>
                              <TableCell>{mov.descripcion}</TableCell>
                              <TableCell>{mov.concepto}</TableCell>
                              <TableCell>
                                ${formatPrecio(parseFloat(mov.abono))}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={movimientos_por_conciliar.length}
                            rowsPerPage={rowsPerPage3}
                            page={page3}
                            onPageChange={handleChangePage3}
                            onRowsPerPageChange={handleChangeRowsPerPage3}
                            labelRowsPerPage="Pendientes por Página"
                          />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Col>
              </Row>
              {/* {excelData.slice(1).length != 0 &&(<>
                         <TablaExcel className="formulario" dataSource={excelData.slice(1)} columns={columns} />
               </>)} */}
              <Modal
                visible={visible}
                footer={null}
                onCancel={() => setVisible(false)}
              >
                <Row justify={"center"}>
                  <Col
                    xs={24}
                    sm={20}
                    md={16}
                    lg={14}
                    xl={14}
                    xxl={14}
                    className="titulo_pantallas"
                  >
                    <b>Estado De Cuenta Conciden</b>
                  </Col>
                </Row>
                {movimientos_pendientes.length != 0 && (
                  <>
                    <Row
                      justify={"center"}
                      className="m-auto"
                      style={{ marginTop: "20px" }}
                    >
                      <TableContainer className="tabla">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Fecha Operacion</TableCell>
                              <TableCell>Descripcion</TableCell>
                              <TableCell>Cantidad</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {stableSort(
                              movimientos_pendientes,
                              getComparator(order, orderBy)
                            ).map((movimiento, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {movimiento.fecha_operacion}
                                </TableCell>
                                <TableCell>{movimiento.concepto}</TableCell>
                                <TableCell>
                                  ${formatPrecio(movimiento.abono)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    className="boton"
                                    key={movimiento}
                                    onClick={() => {
                                      conciliarPago(movimiento);
                                      setPendientes([]);
                                    }}
                                    size="large"
                                  >
                                    Seleccionar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <TableFooter>
                            <TableRow></TableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>
                    </Row>
                  </>
                )}
              </Modal>
            </TabPane>
            <TabPane tab="Anticipos" key="3">
              <Anticipos />
            </TabPane>
            <TabPane tab="Dépositos" key="4">
              <DetalleEstadoCuenta />
            </TabPane>
            <TabPane tab="Manejo Efectivo" key="5">
              <ManejoEfectivo />
            </TabPane>
            <TabPane tab="Agregar Cargo" key="6">
              <AgregarCargo />
            </TabPane>
            <TabPane tab="Tarjeta de Crédito AMR" key="7">
              <TarjetaDCAMR />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
