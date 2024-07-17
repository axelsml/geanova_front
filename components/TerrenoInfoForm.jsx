"use client";

import { Button, Form, InputNumber, Select, Row, Col } from "antd";
import Swal from "sweetalert2";
import InputIn from "./Input";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "@/contexts/loading";
import terrenosService from "@/services/terrenosService";
import { FaArrowCircleLeft } from "react-icons/fa";
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
import TerrenoEdit from "@/app/lotes/editar/page";
import Modal from "antd/es/modal/Modal";
import { getCookiePermisos } from "@/helpers/valorPermisos";

export default function TerrenoInfoForm({
  setTerrenoNuevo,
  terrenoSeleccionado,
  setWatch,
  watch,
}) {
  debugger;
  const { setIsLoading } = useContext(LoadingContext);
  const { Option } = Select;
  const [precio_compra, setPrecioCompra] = useState(0.0);
  const [superficie_total_proyecto, setSuperficieTotalProyecto] = useState(0.0);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };
  const [lotes, setAsignarLotes] = useState(false);
  const [plazos, setPlazos] = useState(false);
  const [terreno_info, setTerrenoInfo] = useState(null);
  const [cookiePermisos, setCookiePermisos] = useState([]);
  //   useEffect(() => {
  //      lotesService.getLoteByTerrenoId(
  //        terrenoId,
  //        (data) => {
  //          setLotes(data.lotes);

  //        },
  //        onError
  //      );
  //    }, []);

  useEffect(() => {
    getCookiePermisos("lista de terrenos", setCookiePermisos);
  }, []);

  const empresas = [
    {
      id: 1,
      nombre: "Sucursal 1",
    },
  ];

  const verTerrenos = () => {
    setAsignarLotes(!lotes);
    setPlazos(false);
  };

  const verPlazos = () => {
    setAsignarLotes(false);
    setPlazos(!plazos);
  };

  const editarTerreno = () => {
    handleShow();
  };

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

  return (
    <div>
      
      <Row justify={"center"}>
      {/* <Col>
            <Button
              style={{ backgroundColor: "lightgrey" }}
              href={"/terrenos/crear"}
              size="large"
            >
              <FaArrowCircleLeft className="m-auto" size={"20px"} />
            </Button>
          </Col> */}
        <Col
          xs={24}
          sm={20}
          md={16}
          lg={12}
          xl={8}
          xxl={4}
          className="titulo_pantallas"
        >
          <b> DATOS DEL TERRENO SELECCIONADO</b>
        </Col>
      </Row>

      <Row justify={"center"} gutter={[16]} style={{ marginTop: "80px" }}>
        <Col xs={24} sm={12} lg={12} className="formulario_alterno">
          <Row gutter={[16]}>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Nombre Proyecto:</b> <a>{terrenoSeleccionado.nombre}</a>
            </Col>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Nombre Propietario:</b>{" "}
              <a>{terrenoSeleccionado.propietario}</a>
            </Col>
          </Row>
          <Row gutter={[16]} className="renglon_otro_color">
            <Col xs={24} sm={24} lg={24} className="informacion_col">
              <b>Domicilio:</b> <a>{terrenoSeleccionado.domicilio}</a>
            </Col>
          </Row>
          <Row gutter={[16]}>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Colonia/Localidad:</b> <a>{terrenoSeleccionado.colonia}</a>
            </Col>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Ciudad:</b> <a>{terrenoSeleccionado.ciudad}</a>
            </Col>
          </Row>
          <Row gutter={[16]} className="renglon_otro_color">
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Cantidad De Lotes:</b>{" "}
              <a>{terrenoSeleccionado.cantidad_lotes}</a>
            </Col>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Precio Venta Proyectado de contado: </b>{" "}
              <a>{terrenoSeleccionado.precio_proyectado_contado}</a>
            </Col>
          </Row>
          <Row gutter={[16]}>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Superficie Total: </b>{" "}
              <a>{terrenoSeleccionado.superficie_total}</a>
            </Col>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Area Reserva: </b> <a>{terrenoSeleccionado.area_reserva}</a>
            </Col>
          </Row>

          <Row gutter={[16]} className="renglon_otro_color">
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Area Vendible: </b> <a>{terrenoSeleccionado.area_vendible}</a>
            </Col>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Area Vialidad: </b> <a>{terrenoSeleccionado.area_vialidad}</a>
            </Col>
          </Row>
          <Row gutter={[16]}>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Precio De Compra: </b>{" "}
              <a>{terrenoSeleccionado.precio_compra}</a>
            </Col>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Precio M2: </b> <a>{terrenoSeleccionado.precio_m2}</a>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row style={{ paddingTop: "30px" }} justify={"center"} gutter={[16]}>
        <Row gutter={[16]}>
          <Col>
            <Button
              className="boton"
              disabled={cookiePermisos >= 2 ? false : true}
              onClick={verTerrenos}
              size="large"
            >
              Superficie
            </Button>
          </Col>
          <Col>
            <Button
              className="boton"
              disabled={cookiePermisos >= 2 ? false : true}
              onClick={verPlazos}
              size="large"
            >
              Plazos
            </Button>
          </Col>
          <Col>
            <Button
              className="boton"
              disabled={cookiePermisos >= 2 ? false : true}
              onClick={editarTerreno}
              size="large"
            >
              Editar
            </Button>
          </Col>
        </Row>
      </Row>

      {lotes && (
        <>
          {/* <PlazosCrear terrenoId={terrenoSeleccionado.id} /> */}
          <AsignarM2 terrenoId={terrenoSeleccionado.id} />
        </>
      )}
      {plazos && (
        <>
          <PlazosCrear terrenoId={terrenoSeleccionado.id} />
          {/* <AsignarM2 terrenoId={terrenoSeleccionado.id}/> */}
        </>
      )}
      {show && (
        <>
          <Modal
            className="terreno-edit__modal"
            width={900}
            visible={show}
            onCancel={handleClose}
            okButtonProps={{ style: { display: "none" } }}
            cancelButtonProps={{ style: { display: "none" } }}
          >
            <TerrenoEdit
              terrenoId={terrenoSeleccionado.id}
              terreno={terrenoSeleccionado}
            />
          </Modal>
        </>
      )}
    </div>
  );
}
