"use client";

import { useEffect, useState, useCallback } from "react";
import solicitudesService from "@/services/solicitudesService";
import { rol_id } from "@/helpers/rol";

import { formatPrecio } from "@/helpers/formatters";
import Loader80 from "@/components/Loader80";
import { Row, Col, Button, Checkbox, DatePicker, Typography } from "antd";
const { RangePicker } = DatePicker;
import locale from "antd/lib/date-picker/locale/es_ES";
const { Text } = Typography;
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
import Swal from "sweetalert2";

export default function SolicitudesCanceladas() {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    fecha_inicial: null,
    fecha_final: null,
    todos: false,
  });
  const [solicitudes, setSolicitudes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const actualizarParams = (param) => {
    setParams((prevParams) => ({
      ...prevParams,
      ...param,
    }));
  };

  const refresh = useCallback(() => {
    handleSearch();
  }, [handleSearch]);

  function handleSearch() {
    setLoading(true);
    solicitudesService.getSolicitudesCanceladas(params, onSearch, onerror);
  }

  async function onSearch(data) {
    setLoading(false);
    if (data.success) {
      setSolicitudes(data.solicitudes);
    } else {
      Swal.fire({
        title: "Búsqueda sin éxito",
        icon: "warning",
        text: "No se encontraron registros con la información solicitudada",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
      setSolicitudes([]);
    }
  }

  function regresarAnticipo(id) {
    Swal.fire({
      title: "Confirmar acción",
      icon: "question",
      text: "¿Está seguro de regresar el anticipo de la Solicitud?",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        let params = { solicitud_id: id };
        solicitudesService.postRegresarAnticipo(
          params,
          onRegresarAnticipo,
          onerror
        );
      }
    });
  }

  async function onRegresarAnticipo(data) {
    if (data.success) {
      Swal.fire({
        title: "Guardado",
        icon: "success",
        text: data.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          refresh();
        }
      });
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: data.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
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
      <Row justify={"center"}>
        <Text className="titulo_pantallas">Solicitudes Canceladas</Text>
      </Row>
      {/* FILTROS */}
      <Row
        justify={"center"}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          margin: "1em",
        }}
      >
        <Row justify={"center"} style={{ margin: "1em" }}>
          <Col>
            <Checkbox
              style={{ transform: "scale(1.25" }}
              checked={params.todos}
              onChange={(e) => {
                actualizarParams({
                  todos: e.target.checked,
                });
              }}
            >
              <span>Todos</span>
            </Checkbox>
          </Col>
        </Row>
        {params.todos == false && (
          <Row style={{ justifyContent: "space-around", margin: "1em" }}>
            <Col>
              <RangePicker
                locale={locale}
                format="YYYY-MM-DD"
                placeholder={["Fecha inicial", "Fecha final"]}
                onChange={(dates) => {
                  actualizarParams({
                    fecha_inicial: dates[0],
                    fecha_final: dates[1],
                  });
                }}
              />
            </Col>
          </Row>
        )}
        <Row justify={"center"} style={{ margin: "1em" }}>
          <Button
            size="large"
            onClick={() => {
              handleSearch();
            }}
          >
            Buscar
          </Button>
        </Row>
      </Row>
      {solicitudes.length > 0 && (
        <Row className="tabla" justify={"center"} style={{ margin: "3em" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow
                  className="table_encabezado"
                  style={{ backgroundColor: "rgb(67, 141, 204)" }}
                >
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      fontFamily: "serif",
                      fontSize: "1.2em",
                    }}
                  >
                    Nombre
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      fontFamily: "serif",
                      fontSize: "1.2em",
                    }}
                  >
                    Télefono
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      fontFamily: "serif",
                      fontSize: "1.2em",
                    }}
                  >
                    Anticipo
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      fontFamily: "serif",
                      fontSize: "1.2em",
                    }}
                  >
                    Monto Contrato
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      fontFamily: "serif",
                      fontSize: "1.2em",
                    }}
                  >
                    Fecha de contrato
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      fontFamily: "serif",
                      fontSize: "1.2em",
                    }}
                  >
                    Fecha de cancelación
                  </TableCell>
                  <TableCell
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      fontFamily: "serif",
                      fontSize: "1.2em",
                    }}
                  >
                    Regresar Anticipo
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {solicitudes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{item.telefono}</TableCell>
                      <TableCell>
                        $ {formatPrecio(parseFloat(item.anticipo))}
                      </TableCell>
                      <TableCell>
                        $ {formatPrecio(parseFloat(item.monto_contrato))}
                      </TableCell>
                      <TableCell>{item.fecha_contrato}</TableCell>
                      <TableCell>{item.fecha_cancelacion}</TableCell>
                      <TableCell>
                        {item.anticipo_regresado ? (
                          <Button disabled>Anticipo Regresado</Button>
                        ) : (
                          <Button
                            onClick={() => {
                              regresarAnticipo(item.id);
                            }}
                            disabled={rol_id != 1 || rol_id != 5}
                          >
                            Regresar Anticipo
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    style={{ color: "rgb(67, 141, 204)" }}
                    rowsPerPageOptions={[5, 10, 25]}
                    count={solicitudes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Solicitudes por página"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Row>
      )}
    </>
  );
}
