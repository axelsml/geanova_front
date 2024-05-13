"use client";
import usuariosService from "@/services/usuariosService";
import { redirect, useRouter } from "next/navigation";
import InputIn from "@/components/Input";
import { Form, Button, Row ,Col,Upload,message,Tabs  } from "antd";
import {Table as TablaExcel } from "antd";
const { TabPane } = Tabs;
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { LoadingContext } from "@/contexts/loading";
import Image from "next/image";
import { usuario_id } from "@/helpers/user";
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import {
     formatPrecio,
   } from "@/helpers/formatters";
import pagosService from "@/services/pagosService";
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
export default function Recursos() {

//   useEffect(() => {
  
//   }, []);
const { setIsLoading } = useContext(LoadingContext);
const [excelData, setExcelData] = useState([]);
const [pendientes, setMovimientosPendientes] = useState([]);
const [recibidos, setMovimientosRecibidos] = useState([]);
const [por_conciliar, setMovimientoBanco] = useState([]);

const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);

const [pago_conciliar_id, setPagoConciliarId] = useState(0);
const [show, setShow] = useState(false);

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

   
const handleUpload = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const dataArr = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    setExcelData(dataArr);
    message.success(`${file.name} file uploaded successfully`);
  };
  reader.readAsArrayBuffer(file);
};

const columns = excelData.length > 0 ? excelData[0].map((header, index) => ({ title: header, dataIndex: index.toString() })) : [];



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

  function guardarEstadoCuenta(){
    var datos =  excelData.slice(1)
    var datos_formateados = []
    for (let i = 0; i < datos.length; i++) {
     var info = {
     fecha_operacion:XLSX.SSF.format('YYYY-MM-DD', datos[i][0]),
     descripcion:datos[i][1],
     cargo:datos[i][2],
     abono:datos[i][3],
     saldo:datos[i][4],
     }
     datos_formateados.push(info);
   }
     console.log(datos)
     console.log(datos_formateados)
     debugger
     var params = {
          movimientos:datos_formateados
     }
     pagosService.GuardarMovimientosBanco(params,onMovimientosGuardados,onError)
  }

  function cargarMovimientosPendientesConciliar(){
     setIsLoading(true)
     pagosService.BuscarMovimientoBancoPendientesConciliar(onMovimientosEncontrados,onError)
  }
  async function onMovimientosEncontrados(data){
     setIsLoading(false)
     setMovimientoBanco(data.pendientes)
  }
  async function onMovimientosGuardados(data){
     debugger
  }
function cargarMovimientosEfectivo(){
     setIsLoading(true)
     pagosService.getMovimientosEfectivo(onMovimientosEfectivoCargados,onError)
}
async function onMovimientosEfectivoCargados(data){
     setIsLoading(false)
     setMovimientosPendientes(data.pendientes)
     setMovimientosRecibidos(data.recibidos)
}

function cambiar_a_recibido(movimiento){
     Swal.fire({
          title: "El Status De Este Movimiento Se Cambiara a Recibido,¿Desea Continuar?",
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
               setIsLoading(true)
               var params = {
                    movimiento_id:movimiento.id,
                    usuario_recibio:usuario_id
               }
               pagosService.cambiarRecibido(params,onMovimientoRecibido,onError)
          }
        });
     

}
async function onMovimientoRecibido(data){
     setIsLoading(false)
     if(data.success){
          Swal.fire({
               title: "Success",
               icon: "success",
               text: "Efectivo Recibido",
               confirmButtonColor: "#4096ff",
               cancelButtonColor: "#ff4d4f",
               showDenyButton: false,
               confirmButtonText: "Aceptar",
             });
             setMovimientosPendientes(data.pendientes)
             setMovimientosRecibidos(data.recibidos)    
     }else{
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
  return (
    <div>
     <Tabs defaultActiveKey="1">
      <TabPane tab="Efectivo" key="1">
          <Row justify={"center"} className="m-auto">
               <Button onClick={() =>{cargarMovimientosEfectivo()}}>
                    Cargar Efectivo
               </Button>
          </Row>
          <Row style={{paddingTop:"20px"}} justify={"center"} className="m-auto">
               <b>Movimientos Pendientes</b>
          </Row>
          <Row justify={"center"} className="m-auto">
               <TableContainer component={Paper}>
                    <Table>
                    <TableHead>
                       
                    <TableRow>
                         <TableCell>Concepto</TableCell>
                         <TableCell>Detalle</TableCell>
                         <TableCell>Fecha Operacion</TableCell>
                         <TableCell>Importe</TableCell>
                         <TableCell>Usuario</TableCell>
                         <TableCell></TableCell>
                    </TableRow>
                    </TableHead>

                    <TableBody>
                         {pendientes.slice(
                         page * rowsPerPage,
                         page * rowsPerPage + rowsPerPage
                         )
                         .map((pendiente, index) => (
                         <TableRow key={index}>
                         <TableCell>
                         {pendiente.concepto}
                         </TableCell>
                         <TableCell>
                         {pendiente.comentario}
                         </TableCell>
                         <TableCell>
                         {pendiente.fecha_operacion}
                         </TableCell>
                         <TableCell>
                         ${formatPrecio(pendiente.importe)}
                         </TableCell>
                         <TableCell>
                         {pendiente.usuario_creacion}
                         </TableCell>
                         <TableCell>
                         <Button key={pendiente} onClick={() => {
                         cambiar_a_recibido(pendiente)
                    }}  size="large">
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
          </Row>
          <Row style={{paddingTop:"20px"}} justify={"center"} className="m-auto">
               <b>Movimientos Recibidos</b>
          </Row>
          <Row justify={"center"} className="m-auto">
               <TableContainer component={Paper}>
                    <Table>
                    <TableHead>
                       
                    <TableRow>
                         <TableCell>Concepto</TableCell>
                         <TableCell>Detalle</TableCell>
                         <TableCell>Fecha Operacion</TableCell>
                         <TableCell>Importe</TableCell>
                         <TableCell>Usuario Creo</TableCell>
                         <TableCell>Usuario Recibio</TableCell>
                         <TableCell>Fecha Recibio</TableCell>
                         <TableCell>Saldo</TableCell>
                    </TableRow>
                    </TableHead>

                    <TableBody>
                         {recibidos.slice(
                         page2 * rowsPerPage2,
                         page2 * rowsPerPage2 + rowsPerPage2
                         )
                         .map((recibido, index) => (
                         <TableRow key={index}>
                         <TableCell>
                         {recibido.concepto}
                         </TableCell>
                         <TableCell>
                         {recibido.comentario}
                         </TableCell>
                         <TableCell>
                         {recibido.fecha_operacion}
                         </TableCell>
                         <TableCell>
                         ${formatPrecio(recibido.importe)}
                         </TableCell>
                         <TableCell>
                         {recibido.usuario_creacion}
                         </TableCell>
                         <TableCell>
                         {recibido.usuario_recibio}
                         </TableCell>
                         <TableCell>
                         {recibido.fecha_recibio}
                         </TableCell>
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
                    <Button icon={<UploadOutlined />}>Adjuntar Archivo</Button>
                    </Upload>
               </Col>
               <Col>
               <Button disabled={excelData.slice(1).length == 0} onClick={() =>{guardarEstadoCuenta()}}>
                    Guardar Estado De Cuenta
               </Button>
               </Col>
               <Col>
               <Button onClick={() =>{cargarMovimientosPendientesConciliar()}}>
                    Movimientos Pendientes Conciliar
               </Button>
               </Col>
          </Row>
          {excelData.slice(1).length != 0 &&(<>
          <Row>
               <Col>
                    <TablaExcel dataSource={excelData.slice(1)} columns={columns} />
               </Col>
          </Row>
          </>)}
          {por_conciliar.length != 0 && (<>
          <Row justify={"center"} className="m-auto">
               <TableContainer component={Paper}>
                    <Table>
                    <TableHead>
                       
                    <TableRow>
                         <TableCell>Nombre Cliente</TableCell>
                         <TableCell>Folio Pago</TableCell>
                         <TableCell>Monto Pagado</TableCell>
                         <TableCell>Fecha Operacion</TableCell>
                         <TableCell>Ingreso</TableCell>
                         <TableCell></TableCell>
                    </TableRow>
                    </TableHead>

                    <TableBody>
                         {por_conciliar.slice(
                         page * rowsPerPage,
                         page * rowsPerPage + rowsPerPage
                         )
                         .map((pago, index) => (
                         <TableRow key={index}>
                         <TableCell>
                         {pago.nombre_cliente}
                         </TableCell>
                         <TableCell>
                         {pago.folio_pago}
                         </TableCell>
                         <TableCell>
                         ${formatPrecio(pago.monto_pagado)}
                         </TableCell>
                         <TableCell>
                         {pago.fecha_operacion}
                         </TableCell>
                         <TableCell>
                         {pago.usuario_ingreso}
                         </TableCell>
                         <TableCell>
                         <Button key={pago} onClick={() => {
                         setPagoConciliarId(pago.id);
                         setShow(true)
                    }}  size="large">
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
          </>)}

      </TabPane>
     
    </Tabs>
      
    </div>
  );
}
