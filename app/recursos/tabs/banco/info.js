"use client";

import { useEffect, useState } from "react";
import Loader80 from "@/components/Loader80";
import { getCookiePermisos } from "@/helpers/valorPermisos";
import { formatPrecio } from "@/helpers/formatters";
import Swal from "sweetalert2";
import { UploadOutlined } from "@ant-design/icons";
import { usuario_id } from "@/helpers/user";
import * as XLSX from "xlsx";
import { Button, Row, Col, Select, Typography, Upload, Modal } from "antd";
const { Text } = Typography;
const { Option } = Select;
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

import pagosService from "@/services/pagosService";
import terrenosService from "@/services/terrenosService";

export default function Banco() {
  const [cookiePermisos, setCookiePermisos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [excelData, setExcelData] = useState([]);
  const [message, setMessage] = useState("");

  const [terrenos, setTerrenos] = useState([]);
  const [terrenoSelected, setTerrenoSelected] = useState(null);

  const [por_conciliar, setMovimientoBanco] = useState([]);
  const [movimientos_pendientes, setPendientes] = useState([]);
  const [ultimos_movimientos, setUltimosMovimientos] = useState([]);
  const [movimientos_por_conciliar, setMovimientosPorConciliar] = useState([]);
  const [monto_pendientes2, setMovimientosPendientesMonto2] = useState(0);
  const [pago_seleccionado, setPagoSeleccionado] = useState({});

  const [visible, setVisible] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("fecha_operacion");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);

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

  useEffect(() => {
    buscarUltimoRegistroBancos();
    terrenosService.getTerrenos(setTerrenos, onError);
    getCookiePermisos("efectivo", setCookiePermisos);
  }, []);

  const onError = (data) => {
    setLoading(false);
    Swal.fire({
      title: "Error",
      icon: "error",
      text: "FALLO AL INTENTAR GUARDAR",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    });
  };

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const dataArr = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(dataArr);
      // message.success(`${file.name} Adjuntado`);
      guardarEstadoCuenta(dataArr);
    };
    reader.readAsArrayBuffer(file);
  };

  function guardarEstadoCuenta(excel_data) {
    const columns_aux =
      excel_data.length > 0
        ? excel_data[0].map((header, index) => ({
            title: header,
            dataIndex: index.toString(),
          }))
        : [];

    setLoading(true);
    var datos = excel_data.slice(1);
    var datos_formateados = [];

    for (let i = 0; i < datos.length; i++) {
      if (columns_aux[0].title == "CUENTA") {
        var formattedDate = "";
        if (typeof datos[i][1] === "number") {
          let fecha = excelDateToJSDate(datos[i][1]);
          formattedDate = fecha.toISOString().split("T")[0];
          formattedDate = convertDateFormat(formattedDate);
        } else {
          formattedDate = formatDateString(datos[i][1]);
        }
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
    var params = {
      movimientos: datos_formateados,
    };
    pagosService.GuardarMovimientosBanco(
      params,
      onMovimientosGuardados,
      onError
    );
  }
async function onMovimientosGuardados(data) {
  debugger
    console.log("data: ", data.movimientos_guardados);
    let aux = data.movimientos_guardados;
    setLoading(false);
    Swal.fire({
      title: "Info",
      icon: "info",
      text: "Cantidad De Registros Nuevos Guardados: " + data.movimientos_guardados,
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: false,
      confirmButtonText: "Aceptar",
    });
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

  function buscarUltimoRegistroBancos() {
    pagosService.ultimoMovimientoBanco(
      onUltimosMovimientosEncontrados,
      onError
    );
  }
  async function onUltimosMovimientosEncontrados(data) {
    setUltimosMovimientos(data.respuesta);
    setMovimientosPorConciliar(data.movimientos_pendientes);
  }

  function cargarMovimientosPendientesConciliar() {
    setLoading(true);
    var params = {
      terreno_id: terrenoSelected,
    };
    pagosService.BuscarMovimientoBancoPendientesConciliar(
      params,
      onMovimientosEncontrados,
      onError
    );
  }
  async function onMovimientosEncontrados(data) {
    setLoading(false);
    setMovimientoBanco(data.pendientes);
    setMovimientosPendientesMonto2(data.monto_pendiente);
  }

  function conciliarPago(movimiento) {
    setLoading(true);
    var params = {
      pago_id: pago_seleccionado.id,
      movimiento_id: movimiento.id,
      usuario_id: usuario_id,
    };
    pagosService.conciliarPagoCreado(params, onPagoConciliado, onError);
  }

  async function onPagoConciliado(data) {
    setLoading(false);
    setVisible(false);
    if (data.success) {
      cargarMovimientosPendientesConciliar();
    } else {
      Swal.fire({
        title: "Error",
        icon: "warning",
        text: "No se pudo conciliar Pago",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
    }
  }

  function buscarMovimientosBanco(pago) {
    setLoading(true);
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
    setLoading(false);
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

  const handleSelectChange = (value) => {
    setTerrenoSelected(value);
  };

  return (
    <>
      {loading && (
        <>
          <Loader80 />
        </>
      )}
      {/* div principal */}
      <div
        style={{ margin: "0 auto", display: "flex", flexDirection: "column" }}
      >
        {/* inputs */}
        <Row justify={"center"} style={{ marginBottom: "32px" }}>
          <Col>
            <Row justify={"center"} style={{ marginBottom: "4px" }}>
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
                  Adjuntar archivo
                </Button>
              </Upload>
            </Row>
            <Row justify={"center"} style={{ marginBottom: "16px" }}>
              <Button
                className="boton"
                onClick={() => {
                  cargarMovimientosPendientesConciliar();
                }}
              >
                Movimientos por conciliar
              </Button>
            </Row>
            <Row
              Row
              justify={"center"}
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Col>
                <Text>Selecionar Proyecto</Text>
              </Col>
              <Col>
                <Select
                  showSearch
                  placeholder="Seleccione un Proyecto"
                  optionLabelProp="label"
                  onChange={() => {
                    handleSelectChange();
                  }}
                >
                  {terrenos?.map((item, index) => (
                    <Option key={index} value={item.id} label={item.nombre}>
                      {item?.nombre}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* información, tablas, etc. */}
        <Row Row justify={"center"}>
          {ultimos_movimientos.length != 0 && (
            <Col>
              <Row Row justify={"center"} style={{ marginBottom: "12px" }}>
                <Text className="titulo_pantallas">
                  <b>Registro Cuentas</b>
                </Text>
              </Row>
              <Row Row justify={"center"} style={{ marginBottom: "32px" }}>
                <TableContainer className="tabla">
                  <Table>
                    <TableHead style={{ textAlign: "center" }}>
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
                          <TableCell>{mov.ultima_actualizacion}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow></TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Row>
            </Col>
          )}
          {por_conciliar.length != 0 && (
            <Col>
              <Row Row justify={"center"}>
                <Text className="titulo_pantallas">
                  <b>Movimientos Pendientes</b>
                </Text>
              </Row>
              <Row Row justify={"center"}>
                <Text>
                  <b>Cantidad pendiente: </b>$
                  {formatPrecio(parseFloat(monto_pendientes2))}
                </Text>
              </Row>
              <Row Row justify={"center"} style={{ marginBottom: "32px" }}>
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
                          <p>Fecha Transferencia</p>
                        </TableCell>
                        <TableCell>
                          <p>Fecha Amortizacion</p>
                        </TableCell>
                        <TableCell>
                          <p>Referencia de Transferencia</p>
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
                      {stableSort(por_conciliar, getComparator(order, orderBy))
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
                            <TableCell>{pago.fecha_transferencia}</TableCell>
                            <TableCell>{pago.fecha_amortizacion}</TableCell>
                            <TableCell>
                              {pago.referencia_transferencia}
                            </TableCell>
                            <TableCell>{pago.usuario_ingreso}</TableCell>
                            <TableCell>
                              <Button
                                disabled={cookiePermisos >= 2 ? false : true}
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
              </Row>
            </Col>
          )}
          <Col>
            <Row Row justify={"center"} style={{ marginBottom: "12px" }}>
              <Text className="titulo_pantallas">
                <b>Movimientos Disponibles</b>
              </Text>
            </Row>
            <Row Row justify={"center"} style={{ marginBottom: "32px" }}>
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
                        page2 * rowsPerPage2,
                        page2 * rowsPerPage2 + rowsPerPage2
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
                        rowsPerPage={rowsPerPage2}
                        page={page2}
                        onPageChange={handleChangePage2}
                        onRowsPerPageChange={handleChangeRowsPerPage2}
                        labelRowsPerPage="Pendientes por Página"
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Row>
          </Col>
          
        </Row>

        <Modal
          visible={visible}
          footer={null}
          onCancel={() => setVisible(false)}
        >
          <div>
            <Row Row justify={"center"} style={{ marginBottom: "24px" }}>
              <Text className="titulo_pantallas">
                <b>Estado de cuenta Coinciden</b>
              </Text>
            </Row>
            {movimientos_pendientes.length != 0 && (
              <Row Row justify={"center"}>
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
                          <TableCell>{movimiento.fecha_operacion}</TableCell>
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
            )}
          </div>
        </Modal>
      </div>
    </>
  );
}
