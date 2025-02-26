"use client";

import { useEffect, useState } from "react";
import Loader80 from "@/components/Loader80";
import { getCookiePermisos } from "@/helpers/valorPermisos";
import { formatPrecio } from "@/helpers/formatters";
import Swal from "sweetalert2";

import { Button, Row, Col, Select, Checkbox, Typography } from "antd";
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
const { Text } = Typography;
const { Option } = Select;

import terrenosService from "@/services/terrenosService";
import pagosService from "@/services/pagosService";

export default function Efectivo() {
  const [cookiePermisos, setCookiePermisos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [check, setCheck] = useState(false);
  const [terrenos, setTerrenos] = useState([]);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [pendientes, setMovimientosPendientes] = useState([]);
  const [recibidos, setMovimientosRecibidos] = useState([]);
  const [monto_pendientes, setMovimientosPendientesMonto] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("fecha_operacion");

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

  useEffect(() => {
    terrenosService.getTerrenos(setTerrenos, onError);
    getCookiePermisos("efectivo", setCookiePermisos);
  }, []);

  const onError = () => {
    setLoading(false);
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

  function cargarMovimientosEfectivo() {
    setLoading(true);
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
    setLoading(false);
    if (data.success) {
      setMovimientosPendientes(data.pendientes);
      setMovimientosPendientesMonto(data.monto_pendiente);
      setMovimientosRecibidos(data.recibidos);
    } else {
      Swal.fire({
        title: "Aviso",
        icon: "warning",
        text: "No se han encontrado registros con la información solicitada",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
    }
  }

  return (
    <>
      {loading && (
        <>
          <Loader80 />
        </>
      )}
      {/* div general */}
      <div style={{ margin: "0 auto" }}>
        {/* div secundario */}
        <div
          style={{ margin: "0 auto", display: "flex", flexDirection: "column" }}
        >
          <Row style={{ margin: "auto" }}>
            <Col
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginRight: "10px",
              }}
            >
              <Row>
                <Text>Seleccionar Proyecto</Text>
              </Row>
              <Row>
                <Select
                  showSearch
                  placeholder="Seleccione un Proyecto"
                  optionLabelProp="label"
                  onChange={handleSelectChange}
                >
                  {terrenos?.map((item, index) => (
                    <Option key={index} value={item.id}>
                      {item?.nombre}
                    </Option>
                  ))}
                </Select>
              </Row>
            </Col>
            <Col
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginLeft: "10px",
              }}
            >
              <Row>
                <Text>Recibidos</Text>
              </Row>
              <Row>
                <Checkbox
                  onChange={() => {
                    setCheck(!check);
                  }}
                  checked={check}
                />
              </Row>
            </Col>
          </Row>
          <Row style={{ margin: "12px auto 12px" }}>
            <Button
              className="boton"
              onClick={() => {
                cargarMovimientosEfectivo();
              }}
              disabled={terrenoSelected == null}
            >
              Cargar Efectivo
            </Button>
          </Row>

          <Row
            style={{
              margin: "24px auto 24px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Col
              xs={24}
              sm={20}
              md={16}
              lg={6}
              xl={6}
              xxl={6}
              className="titulo_pantallas"
              style={{ margin: "auto" }}
            >
              <Text style={{ color: "white" }}>
                <b>Movimientos Pendientes</b>
              </Text>
            </Col>
            <Col style={{ margin: "auto" }}>
              <Text>
                <b>Cantidad pendiente: </b>$
                {formatPrecio(parseFloat(monto_pendientes))}
              </Text>
            </Col>
            <Col>
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
                          <TableCell>{pendiente.usuario_creacion}</TableCell>

                          <TableCell>{pendiente.fecha_amortizacion}</TableCell>
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
            <Col
              xs={24}
              sm={20}
              md={16}
              lg={6}
              xl={6}
              xxl={6}
              className="titulo_pantallas"
              style={{ margin: "24px auto 12px" }}
            >
              <Text style={{ color: "white" }}>
                <b>Movimientos Recibidos</b>
              </Text>
            </Col>
            <Col>
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
                          <TableCell>${formatPrecio(recibido.saldo)}</TableCell>
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
        </div>
      </div>
    </>
  );
}
