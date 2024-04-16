"use client";

import { Button, Form, InputNumber, Select,Row,Col } from "antd";
import Swal from "sweetalert2";
import InputIn from "./Input";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "@/contexts/loading";
import terrenosService from "@/services/terrenosService";
import { formatPrecio } from "@/helpers/formatters";
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
import AsignarM2 from "@/app/lotes/asignar/page";
import PlazosCrear from "@/app/plazos/crear/page";

export default function TerrenoInfoForm({ setTerrenoNuevo,terrenoSeleccionado, setWatch, watch }) {
  debugger
  const { setIsLoading } = useContext(LoadingContext);
  const { Option } = Select;
  const [precio_compra, setPrecioCompra] = useState(0.0);
  const [superficie_total_proyecto, setSuperficieTotalProyecto] = useState(0.0);
  const [lotes, setAsignarLotes] = useState(false);
  const [plazos, setPlazos] = useState(false);
  const [terreno_info, setTerrenoInfo] = useState(null);
//   useEffect(() => {
//      lotesService.getLoteByTerrenoId(
//        terrenoId,
//        (data) => {
//          setLotes(data.lotes);
        
//        },
//        onError
//      );
//    }, []);
  const empresas = [
    {
      id: 1,
      nombre: "Sucursal 1",
    },
  ];

  const verTerrenos = () => {
     setAsignarLotes(!lotes)
   };

   const verPlazos = () => {
     setPlazos(!plazos)
   };

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

  return (
    <div>
     
     
        
      <Row justify={"center"} gutter={[16]}>
        <Col xs={24} sm={12} lg={12}>
          <Paper style={{ backgroundColor:"lightgrey"}}>
            <h1 className="text-2xl font-semibold mb-4 text-center">
              Datos del Terreno seleccionado
            </h1>
          </Paper>
        </Col> 
      </Row>
      <Row justify={"center"} gutter={[16]}>
        <Col xs={24} sm={12} lg={12}>
          <Paper style={{ backgroundColor:"lightgrey"}}>
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Nombre Proyecto: {terrenoSeleccionado.nombre}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Nombre Propietario: {terrenoSeleccionado.propietario}
                    </Col>
               </Row>
               <Row>
                    <Col>
                         Domicilio: {terrenoSeleccionado.domicilio}
                    </Col>
               </Row>
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Colonia/Localidad: {terrenoSeleccionado.colonia}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Ciudad: {terrenoSeleccionado.ciudad}
                    </Col>
               </Row>
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Cantidad De Lotes: {terrenoSeleccionado.cantidad_lotes}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Precio Venta Proyectado de contado: {terrenoSeleccionado.precio_proyectado_contado}
                    </Col>
               </Row>
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Superficie Total: {terrenoSeleccionado.superficie_total}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Area Reserva: {terrenoSeleccionado.area_reserva}
                    </Col>
               </Row>
               
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Area Vendible: {terrenoSeleccionado.area_vendible}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Area Vialidad: {terrenoSeleccionado.area_vialidad}
                    </Col>
               </Row>
               <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                         Precio De Compra: {terrenoSeleccionado.precio_compra}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                         Precio M2: {terrenoSeleccionado.precio_m2}
                    </Col>
               </Row>
          </Paper>
        </Col> 
      </Row>
      
      <Row style={{paddingTop:"30px"}} justify={"center"} gutter={[16]}>
      <Row gutter={[16]}>
               <Col>
               <Button onClick={verTerrenos} size="large">
                    Superficie
               </Button>
               </Col>
               <Col>
               <Button onClick={verPlazos} size="large">
                    Plazos
               </Button>
               </Col>
          </Row>
      </Row>
      
        
      {lotes &&(<>
        {/* <PlazosCrear terrenoId={terrenoSeleccionado.id} /> */}
        <AsignarM2 terrenoId={terrenoSeleccionado.id}/>
      </>)}
      {plazos &&(<>
        <PlazosCrear terrenoId={terrenoSeleccionado.id} />
        {/* <AsignarM2 terrenoId={terrenoSeleccionado.id}/> */}
      </>)}
    </div>
  );
}
