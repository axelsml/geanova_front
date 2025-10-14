"use client";

import { Button, Row, Col } from "antd";
import { useEffect, useState, useCallback, useRef } from "react";
import AsignarM2 from "@/components/AsignarM2";
import CrearPlazo from "@/components/CrearPlazo";
import EditarTerreno from "@/components/EditarTerreno";
import terrenosService from "@/services/terrenosService";
import Modal from "antd/es/modal/Modal";
import { getCookiePermisos } from "@/helpers/valorPermisos";
import { useSearchParams } from "next/navigation";

export default function TerrenoInfo() {
  const [searchParams, setSearchParams] = useState(null);
  const [terrenoId, setTerrenoId] = useState(null);

  const [terreno, setTerreno] = useState(null);

  const [editar, setEditar] = useState(false);
  const [asignar, setAsignar] = useState(false);
  const [plazos, setPlazos] = useState(false);

  const editarTerrenoRef = useRef(null);
  const asignarM2Ref = useRef(null);
  const crearPlazoRef = useRef(null);

  const [cookiePermisos, setCookiePermisos] = useState([]);

  const handleGetTerreno = useCallback(() => {
    if (terrenoId) {
      const params = { terreno_id: terrenoId };
      terrenosService.getTerreno(params, onTerreno, onerror);
    }
  }, [terrenoId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams(params);
    setTerrenoId(params.get("id"));
  }, []);

  useEffect(() => {
    getCookiePermisos("lista de terrenos", setCookiePermisos);
    handleGetTerreno();
  }, [handleGetTerreno, cookiePermisos]);

  async function onTerreno(data) {
    console.log(data);
    setTerreno(data);
  }

  const handleClearEditar = () => {
    setEditar(false);
    if (editarTerrenoRef.current && editarTerrenoRef.current.clear) {
      editarTerrenoRef.current.clear();
    }
  };

  const handleClearAsignar = () => {
    setAsignar(false);
    if (asignarM2Ref.current && asignarM2Ref.current.resetFields) {
      asignarM2Ref.current.resetFields();
    }
  };

  const handleClearCrearPlazo = () => {
    setPlazos(false);
    if (crearPlazoRef.current && crearPlazoRef.current.resetFields) {
      crearPlazoRef.current.resetFields();
    }
  };

  return (
    <div>
      <Row justify={"center"}>
        <Col className="titulo_pantallas">
          <span className="titulo_pantallas-texto">
            DATOS DEL TERRENO SELECCIONADO
          </span>
        </Col>
      </Row>

      <Row justify={"center"} style={{ marginTop: "16px" }}>
        <Col xs={24} sm={12} lg={12} className="formulario_alterno">
          <Row gutter={[16]}>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Nombre Proyecto:</b> <a>{terreno?.nombre}</a>
            </Col>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Nombre Propietario:</b> <a>{terreno?.propietario}</a>
            </Col>
          </Row>
          <Row gutter={[16]} className="renglon_otro_color">
            <Col xs={24} sm={24} lg={24} className="informacion_col">
              <b>Domicilio:</b> <a>{terreno?.domicilio}</a>
            </Col>
          </Row>
          <Row gutter={[16]}>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Colonia/Localidad:</b> <a>{terreno?.colonia}</a>
            </Col>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Ciudad:</b> <a>{terreno?.ciudad}</a>
            </Col>
          </Row>
          <Row gutter={[16]} className="renglon_otro_color">
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Cantidad De Lotes:</b> <a>{terreno?.cantidad_lotes}</a>
            </Col>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Precio Venta Proyectado de contado: </b>{" "}
              <a>{terreno?.precio_proyectado_contado}</a>
            </Col>
          </Row>
          <Row gutter={[16]}>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Superficie Total: </b> <a>{terreno?.superficie_total}</a>
            </Col>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Area Reserva: </b> <a>{terreno?.area_reserva}</a>
            </Col>
          </Row>

          <Row gutter={[16]} className="renglon_otro_color">
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Area Vendible: </b> <a>{terreno?.area_vendible}</a>
            </Col>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Area Vialidad: </b> <a>{terreno?.area_vialidad}</a>
            </Col>
          </Row>
          <Row gutter={[16]}>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Precio De Compra: </b> <a>{terreno?.precio_compra}</a>
            </Col>
            <Col xs={24} sm={12} lg={12} className="informacion_col">
              <b>Precio M2: </b> <a>{terreno?.precio_m2}</a>
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
              onClick={() => setAsignar(true)}
              size="large"
            >
              Superficie
            </Button>
          </Col>
          <Col>
            <Button
              className="boton"
              disabled={cookiePermisos >= 2 ? false : true}
              onClick={() => setPlazos(true)}
              size="large"
            >
              Plazos
            </Button>
          </Col>
          <Col>
            <Button
              className="boton"
              disabled={cookiePermisos >= 2 ? false : true}
              onClick={() => {
                setEditar(true);
              }}
              size="large"
            >
              Editar
            </Button>
          </Col>
        </Row>
      </Row>
      <Modal
        open={editar}
        onCancel={handleClearEditar}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <EditarTerreno
          terreno={terreno}
          terrenoId={terreno?.id}
          ref={editarTerrenoRef}
        />
      </Modal>
      <Modal
        open={asignar}
        onCancel={handleClearAsignar}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <AsignarM2 terrenoId={terreno?.id} ref={asignarM2Ref} />
        </Modal>
      <Modal
        open={plazos}
        onCancel={handleClearCrearPlazo}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <CrearPlazo terrenoId={terreno?.id} ref={crearPlazoRef} />
      </Modal>
    </div>
  );
}
