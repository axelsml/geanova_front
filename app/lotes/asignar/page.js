"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { Select, Row, Form, Button, InputNumber, Typography } from "antd";
import Swal from "sweetalert2";
import { LoadingContext } from "@/contexts/loading";

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
import lotesService from "@/services/lotesService";
import { formatPrecio } from "@/helpers/formatters";

export default function AsignarM2({ terrenoId }) {
  const { setIsLoading } = useContext(LoadingContext);
  const { Option } = Select;
  const [changeState, setChangeState] = useState(false);
  const prevChangeStateRef = useRef(changeState);
  const [lotes, setLotes] = useState(null);
  const [areaVendible, setAreaVendible] = useState(0);
  const [areaAsignada, setAreaAsignada] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [lotesData, setLotesData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    lotesService.getLoteByTerrenoId(
      terrenoId,
      (data) => {
        setLotes(data.lotes);
        setAreaVendible(data.area_vendible);
        setAreaAsignada(data.area_asignada);
      },
      onError
    );
  }, [terrenoId]);

  const onError = () => {};

  useEffect(() => {
    if (changeState !== prevChangeStateRef.current) {
      lotesService.getLoteByTerrenoId(
        terrenoId,
        (data) => {
          setLotes(data.lotes);
          setAreaVendible(data.area_vendible);
          setAreaAsignada(data.area_asignada);
        },
        onError
      );

      prevChangeStateRef.current = changeState;
    }
  }, [terrenoId, changeState]);

  const handleSuperficieChange = (id, event) => {
    setErrorMessage("");
    const value = event;
    const index = lotes.findIndex((item) => item.id === id);
    if (index !== -1) {
      const updatedLotesData = [...lotes];
      updatedLotesData[index].superficie = value;
      setLotesData(updatedLotesData);
    } else {
      setErrorMessage("Superficie no válida");
      setLotesData((prevState) => [
        ...prevState,
        { lote_id: id, superficie: value },
      ]);
    }
  };

  const validateSuperficie = () => {
    for (let lote of lotesData) {
      if (!lote.superficie) {
        return false;
      }
    }
    return true;
  };

  const onGuardarSuperficie = () => {
    if (!validateSuperficie()) {
      Swal.fire({
        title: "Error",
        text: "Por favor, complete todas las superficies antes de guardar.",
        icon: "error",
        confirmButtonColor: "#ff4d4f",
      });
      return;
    } else {
      Swal.fire({
        title: "Verifique que los datos sean correctos",
        icon: "info",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          setIsLoading(true);
          lotesService.asignarSuperficie(
            { data_lotes: lotesData },
            onSuperficieAsignada,
            onError
          );
        }
      });
    }
  };

  const onSuperficieAsignada = (data) => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    if (data.success) {
      setWatch(!watch);
    }
  };

  return (
    <div className="p-8 grid gap-8 asignacion-container">
      <Row justify={"center"} style={{ backgroundColor: "rgb(66, 142, 202)" }}>
        <h1 style={{ color: "white", padding: "4px", fontSize: "20px" }}>
          Asignación de Superficie
        </h1>
      </Row>

      <Row justify={"space-between"} style={{ width: "80%", margin: "0 auto" }}>
        <Typography>
          Área Asignada: {formatPrecio(areaAsignada.toFixed(2))}
        </Typography>
        <Typography>
          Área por Asignar:{" "}
          {formatPrecio((areaVendible - areaAsignada).toFixed(2))}
        </Typography>
      </Row>

      {lotes && (
        <Row justify={"center"}>
          <Form
            style={{ width: "100%" }}
            initialValues={lotes.reduce((acc, lote) => {
              acc[`superficie_${lote.id}`] = lote.superficie;
              return acc;
            }, {})}
          >
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ textAlign: "center" }}>
                      <b style={{ fontWeight: "bold" }}>N° de Lote</b>
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <b style={{ fontWeight: "bold" }}>Superficie en M2</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lotes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((lote, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ textAlign: "center" }}>
                          {lote.numero}
                        </TableCell>
                        <TableCell align="center">
                          <Form.Item
                            name={`superficie_${lote.id}`}
                            rules={[
                              {
                                required: true,
                                message: "Ingrese la Superficie del Lote",
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Ingrese la Superficie"
                              className="m-0 w-2/4"
                              suffix={"M2"}
                              value={lote.superficie}
                              onChange={(e) =>
                                handleSuperficieChange(lote.id, e)
                              }
                            />
                          </Form.Item>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <Button
                      style={{ left: "100%", marginTop: "12px" }}
                      htmlType="submit"
                      size="large"
                      onClick={onGuardarSuperficie}
                    >
                      Asignar Superficie
                    </Button>
                  </TableRow>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      count={lotes?.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      labelRowsPerPage="Lotes por Página"
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Form>
        </Row>
      )}
    </div>
  );
}
