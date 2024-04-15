"use client";

import { formatPrecio } from "@/helpers/formatters";
import VentaForm from "@/components/VentaForm";
import PagoForm from "@/components/PagoForm";
import ventasService from "@/services/ventasService";
import { Button, Col, Collapse, Row, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
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
import Swal from "sweetalert2";

export default function VentasCrear() {
  const [nuevaVenta, setNuevaVenta] = useState(false);
  const [nuevoPago, setNuevoPago] = useState(false);
  const [ventas, setVentas] = useState(null);
  const [changeState, setChangeState] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const Panel = Collapse.Panel;
  const { setIsLoading } = useContext(LoadingContext);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    ventasService.getVentas(setVentas, Error);
  }, [changeState]);

  const CreateNuevaVenta = () => {
    setNuevaVenta(!nuevaVenta);
  };

  const CreateNuevoPago = () => {
    setNuevoPago(!nuevoPago);
  };

  const eliminarCliente = (cliente) => {
    Swal.fire({
      title: "¿Desea eliminar este cliente?",
      icon: "warning",
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
        ventasService.deleteCliente(
          {folio_cliente: cliente.folio_cliente},
          onClienteEliminado,
          onError
        );
      }
    });
  };

  const onClienteEliminado = (data) => {
    setIsLoading(false);
    if (data.success) {
      Swal.fire({
        title: "Cliente Eliminado con Éxito",
        icon: "success",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
      setChangeState(!changeState);
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
  };

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

  return (
    <div className="p-8 grid gap-4">
      {!nuevaVenta && !nuevoPago && (
        <Row justify={"center"} className="gap-10">
          <Col>
            <Button size={"large"} onClick={CreateNuevaVenta}>
              Crear Nueva Venta
            </Button>
          </Col>
          <Col>
            <Button size={"large"} onClick={CreateNuevoPago}>
              Crear Nuevo Pago
            </Button>
          </Col>
        </Row>
      )}

      <Row justify={"center"}>
        <Col span={24}>
          {nuevaVenta && (
            <VentaForm
              setNuevaVenta={setNuevaVenta}
              setWatch={setChangeState}
              watch={changeState}
            />
          )}
        </Col>
      </Row>

      <Row justify={"center"}>
        <Col span={24}>
          {nuevoPago && (
            <PagoForm
              setNuevoPago={setNuevoPago}
              setWatch={setChangeState}
              watch={changeState}
            />
          )}
        </Col>
      </Row>

      {!nuevaVenta && !nuevoPago && ventas?.length > 0 && (
        <div className="p-8 grid gap-8">
          <Row justify={"start"}>
            <h1 className="text-3xl">Lista de Ventas</h1>
          </Row>
          <Row justify={"center"} align={"middle"}>
            <Collapse className="w-3/4" accordion>
              {ventas?.map((venta, index) => (
                <Panel key={index} header={venta.nombre_cliente}>
                  <div className="flex justify-between items-center mx-7">
                    <Typography className="py-2">
                      Folio Cliente: {venta.folio_cliente}
                    </Typography>

                    <Typography className="py-2">
                      Celular Cliente: {venta.celular_cliente}
                    </Typography>

                    <Typography className="py-2">
                      Monto de Contrato: ${formatPrecio(venta.monto_contrato)}
                    </Typography>
                    <Typography className="py-2">
                      Anticipo: ${formatPrecio(venta.anticipo)}
                    </Typography>

                    <Typography className="py-2">
                      Plazo: {venta.plazo}
                    </Typography>

                    <Typography className="py-2">
                      Número de Lote: {venta.numero_lote}
                    </Typography>
                  </div>
                  <br />
                  <div className="flex mx-7 gap-3">
                    <Button
                      size="small"
                      onClick={() => {
                        window.open(
                          `https://api.santamariadelaluz.com/iUsuarios/${venta.folio_cliente}.pdf`
                        );
                      }}
                    >
                      Amortización
                    </Button>

                    <Button
                      size="small"
                      danger
                      onClick={() => {
                        eliminarCliente(venta);
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <br />

                  <Row justify={"center"} className="w-3/4 m-auto">
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">N° de Pago</TableCell>
                            <TableCell align="center">Fecha de Pago</TableCell>
                            <TableCell align="center">Monto de Pago</TableCell>
                            <TableCell align="center">Monto Pagado</TableCell>
                            <TableCell align="center">
                              Monto Pendiente
                            </TableCell>
                            <TableCell align="center">Estatus</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {venta?.amortizaciones
                            ?.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((amortizacion, index) => (
                              <TableRow key={index}>
                                <TableCell align="center">
                                  {amortizacion.no_pago}
                                </TableCell>

                                <TableCell align="center">
                                  {amortizacion.fecha_pago}
                                </TableCell>

                                <TableCell align="center">
                                  ${formatPrecio(amortizacion.monto_pago)}
                                </TableCell>

                                <TableCell align="center">
                                  ${formatPrecio(amortizacion.monto_pagado)}
                                </TableCell>

                                <TableCell align="center">
                                  ${formatPrecio(amortizacion.monto_pendiente)}
                                </TableCell>

                                <TableCell align="center">
                                  {amortizacion.pagado ? "Pagado" : "No Pagado"}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 25]}
                              count={venta?.amortizaciones?.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                              labelRowsPerPage="Amortizaciones por Página"
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  </Row>
                </Panel>
              ))}
            </Collapse>
          </Row>
        </div>
      )}
    </div>
  );
}
