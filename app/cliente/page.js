"use client";

import { formatPrecio } from "@/helpers/formatters";
import VentaForm from "@/components/VentaForm";
import PagoForm from "@/components/PagoForm";
import ventasService from "@/services/ventasService";
import { Button, Col, Collapse, Row, Typography,Form,Select  } from "antd";
import { useContext, useEffect, useState } from "react";
import {FaArrowCircleLeft } from "react-icons/fa";
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
import terrenosService from "@/services/terrenosService";
import lotesService from "@/services/lotesService";

export default function ClientesInfo() {
  const [nuevaVenta, setNuevaVenta] = useState(false);
  const [nuevoPago, setNuevoPago] = useState(false);
  const [ventas, setVentas] = useState(null);
  const [changeState, setChangeState] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const Panel = Collapse.Panel;
  const { setIsLoading } = useContext(LoadingContext);
  const [terrenos, setTerrenos] = useState(null);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [lotes, setLotes] = useState(null);
  const [loteSelected, setLoteSelected] = useState(null);

  const [info_lote, setInfoLote] = useState(null);
  const [info_cliente, setInfoCliente] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
//     ventasService.getVentas(setVentas, Error);
     if(terrenoSelected == null || loteSelected == null){
     terrenosService.getTerrenos(setTerrenos, Error);
     }
    if(terrenoSelected != null && loteSelected != null){
         BuscarInfoLote()
    }
  }, [changeState]);

  const CreateNuevaVenta = () => {
    setNuevaVenta(!nuevaVenta);
  };

  const CreateNuevoPago = () => {
    setNuevoPago(!nuevoPago);
  };

  const BuscarInfoLote = () => {
     // console.log(terrenoSelected)
     // console.log(loteSelected)
     setInfoCliente(null)
     setInfoLote(null)
     setIsLoading(true)
     lotesService.getClienteByLote(terrenoSelected.id,loteSelected.id,onInfoClienteCargado,onError)
   };

   async function onInfoClienteCargado(data){
     setIsLoading(false)
     if(data.encontrado){
          setInfoCliente(data.info_cliente)
          setInfoLote(data.info_lote)

     }else{
          Swal.fire({
               title: "Error",
               icon: "error",
               text: "No Se Pudo Encontrar La Informacion",
               confirmButtonColor: "#4096ff",
               cancelButtonColor: "#ff4d4f",
               showDenyButton: true,
               confirmButtonText: "Aceptar",
               });
     }
   }

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
  const onBuscarLotes = (value) => {
     setTerrenoSelected(terrenos.find((terreno) => terreno.id == value));
     lotesService.getLotesAsignados(
       value,
       (data) => {
         setLotes(data);
       },
       onError
     );
     
   };

  return (
    <div className="p-8 grid gap-4">

     <Row justify={"center"} className="gap-10">
          <Col>
          <Form.Item
              label={"Terreno"}
              name={"terreno"}
              style={{ width: "100%" }}
              rules={[{ required: true, message: "Terreno no seleccionado" }]}
              initialValue={terrenoSelected?.nombre}
            >
              <Select
                showSearch
                placeholder="Seleccione un Terreno"
                optionLabelProp="label"
                onChange={onBuscarLotes}
              >
                {terrenos?.map((item,index) => (
                  <Option key={index} value={item.id} label={item.nombre}>
                    {item?.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col>
          <Form.Item
              label={"Lote"}
              name="lote_id"
              style={{ width: "100%" }}
              rules={[{ required: true, message: "Lote no seleccionado" }]}
            >
              <Select
                showSearch
                placeholder="Seleccione un Lote"
                optionLabelProp="label"
                onChange={(value) => {
                  const loteSelected = lotes.find((lote) => lote.id == value);
                  setLoteSelected(loteSelected);
                }}
              >
                {lotes?.map((item,index) => (
                  <Option key={index} value={item.id} label={item.numero}>
                    {item?.numero}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Button onClick={BuscarInfoLote}>
              Buscar
            </Button>
          </Col>
     </Row>
    {info_cliente != null &&(<>
          
     <Row justify={"center"} gutter={[16]}>
        <Col xs={24} sm={12} lg={12}>
          <Paper style={{ backgroundColor:"lightgrey"}}>
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Nombre Cliente: {info_cliente.nombre_completo}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Cliente Desde: {info_cliente.cliente_desde}
                    </Col>
               </Row>
               <Row>
                    <Col>
                         Domicilio: {info_cliente.domicilio}
                    </Col>
               </Row>
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Telefono 1: {info_cliente.telefono_celular}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Telefono 2: {info_cliente.telefono_celular_2}
                    </Col>
               </Row>
               
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Fecha Nacimiento: {info_cliente.fecha_nacimiento}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Lotes Adquiridos: {info_cliente.lotes_adquiridos}
                    </Col>
               </Row>
               
               
          </Paper>
        </Col> 
      </Row>
      <Row justify={"center"} gutter={[16]}>
        <Col xs={24} sm={12} lg={12}>
          <Paper style={{ backgroundColor:"lightgrey"}}>
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         No. Lote: {info_lote.lote}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Superficie(M2): {info_lote.superficie}
                    </Col>
               </Row>
          
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Terreno: {info_lote.terreno}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Fecha De Solicitud: {info_lote.fecha_solicitud}
                    </Col>
               </Row>
               
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Monto Contrato: ${formatPrecio(info_lote.monto_contrato)}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Cantidad Pagos: {info_lote.cantidad_pagos}
                    </Col>
               </Row>
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Anticipo: ${formatPrecio(info_lote.anticipo)}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Sistema De Pago: {info_lote.sistema_pago}
                    </Col>
               </Row>
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Plazo: {info_lote.plazo}
                    </Col>
                   
               </Row>
               
          </Paper>
        </Col> 
      </Row>
      <Row justify={"center"} gutter={[16]}>
        <Col xs={24} sm={12} lg={12}>
          <Paper style={{ backgroundColor:"lightgrey"}}>
               <Row>
                    Estado:
                    <Button disabled size={"small"} shape="round" style={{backgroundColor:info_lote.situacion_solicitud_color}}>
                    </Button>
               </Row>
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Monto Pagado: ${(info_lote.monto_pagado)}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Monto Vencido: ${(info_lote.monto_vencido)}
                    </Col>
               </Row>
          
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Pagos Vencidos: {info_lote.cantidad_vencidos}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Pagos Adelantados: {info_lote.cantidad_adelantados}
                    </Col>
               </Row>
               
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Pagos Completados: {(info_lote.pagos_completados)}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Pagos Realizados: {info_lote.pagos_dados}
                    </Col>
               </Row>
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Pagos Transcurridos: {(info_lote.pagos_esperados)}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Saldo: ${formatPrecio(info_lote.saldo)}
                    </Col>
               </Row>
              
               
          </Paper>
        </Col> 
      </Row>
    </>)}


       {info_cliente != null && info_lote != null && (
        <Row justify={"center"} className="gap-10">
          <Col>
            <Button size={"large"} onClick={CreateNuevoPago}>
              Nuevo Pago
            </Button>
          </Col>
        </Row>
      )} 


      <Row justify={"center"}>
        <Col span={24}>
          {nuevoPago && (
            <PagoForm
              setNuevoPago={setNuevoPago}
              cliente={info_cliente}
              lote={info_lote}
              setWatch={setChangeState}
              watch={changeState}
            />
          )}
        </Col>
      </Row>

      {/* {!nuevoPago && ventas?.length > 0 && (
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
      )} */}
    </div>
  );
}
