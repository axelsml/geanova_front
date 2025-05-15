"use client";

import { useEffect, useState } from "react";
import solicitudesService from "@/services/solicitudesService";
import { formatDate } from "@/helpers/formatters";
import { rol_id } from "@/helpers/rol";

import Loader from "./Loader";
import {
  Row,
  Col,
  Button,
  Checkbox,
  DatePicker,
  Typography,
  Modal,
} from "antd";
const { Text } = Typography;
import Swal from "sweetalert2";

export default function CancelarSolicitud({
  solicitudId,
  loteId,
  fechaCancelacion,
}) {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [editar, setEditar] = useState(false);
  const [fecha, setFecha] = useState(null);

  function cancelarSolicitud() {
    setLoading(true);
    let params = {
      solicitud_id: solicitudId,
      lote_id: loteId,
      editar: editar,
      fecha_cancelacion:
        editar && fecha
          ? fecha
          : fechaCancelacion === "Sin fecha"
          ? null
          : fechaCancelacion,
    };
    solicitudesService.postCancelarSolicitud(params, onCancelar, onerror);
  }

  async function onCancelar(data) {
    setLoading(false);
    if (data.success) {
      Swal.fire({
        title: "Acción exitosa",
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
          setShow(false);
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
          <Loader />
        </>
      )}
      <Button
        className="boton-eliminar"
        size="large"
        onClick={() => {
          setShow(true);
        }}
        disabled={rol_id != 1 || rol_id != 5}
      >
        Cancelar Solicitud
      </Button>
      <Modal
        open={show}
        footer={false}
        onCancel={() => {
          setShow(false);
        }}
      >
        <Row justify={"center"}>
          <Text className="titulo_pantallas">CANCELAR SOLICITUD</Text>
        </Row>
        <Row
          justify={"center"}
          style={{
            margin: "1.5rem",
            flexDirection: "column",
          }}
        >
          <Col style={{ margin: "0.5rem", textAlign: "center" }}>
            <Text style={{ fontSize: "24px" }}>Fecha de cancelación: </Text>
            <Text style={{ fontSize: "24px", color: "rgb(67, 141, 204)" }}>
              {fechaCancelacion ? fechaCancelacion : "Sin fecha"}
            </Text>
          </Col>
          <Col style={{ margin: "0.5rem", textAlign: "center" }}>
            <Checkbox
              checked={editar}
              onChange={(e) => {
                setEditar(e.target.checked);
              }}
            >
              <Text>Editar fecha</Text>
            </Checkbox>
          </Col>
          {editar && (
            <Col style={{ textAlign: "center" }}>
              <DatePicker
                placeholder="Seleccionar fecha"
                onChange={(e) => {
                  setFecha(formatDate(e));
                }}
              />
            </Col>
          )}
          <Col style={{ margin: "1rem", textAlign: "center" }}>
            <Button
              className="boton"
              size="large"
              onClick={() => {
                cancelarSolicitud();
              }}
            >
              Confirmar
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
