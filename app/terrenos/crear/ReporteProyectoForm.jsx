"use client";

import { Button, Select, Row, Col } from "antd";
import Swal from "sweetalert2";
import { useContext, useState, useEffect } from "react";
import { LoadingContext } from "@/contexts/loading";
import terrenosService from "@/services/terrenosService";
import { formatPrecio } from "@/helpers/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
} from "@mui/material";

export default function ReporteProyectoForm({ setReporteNuevo }) {
  const { setIsLoading } = useContext(LoadingContext);
  const { Option } = Select;

  const [proyectos, setProyectos] = useState([]);
  const [proyectoID, setProyectoID] = useState(null);

  const [terreno, setTerreno] = useState({});
  const [lotes, setLotes] = useState([]);
  const [lotesTotal, setLotesTotal] = useState({});

  const [resumenProyectos, setResumenProyectos] = useState({});
  const [detalleProyectos, setDetalleProyectos] = useState({});

  useEffect(() => {
    terrenosService.getTerrenosAll(onTerreno);
  }, []);

  async function onTerreno(terrenos) {
    setProyectos(terrenos);
  }

  function handleSearchButton() {
    var params = {
      id_proyecto: proyectoID,
    };
    setIsLoading(true);
    terrenosService.getReporteProyectos(params, onReporte, onError);
    setTerreno({});
    setLotes([]);
    setLotesTotal({});
  }

  async function onReporte(data) {
    setIsLoading(false);
    data.success == false
      ? Swal.fire({
          title: "Error",
          icon: "error",
          text: "No se encontraron registros con la información solicitada",
          confirmButtonColor: "#4096ff",
          cancelButtonColor: "#ff4d4f",
          showDenyButton: true,
          confirmButtonText: "Aceptar",
        })
      : setResumenProyectos(data.resumen);

    setTerreno(data.resumen.proyecto);
    setLotes(data.resumen.lista_de_fracciones.lista);
    setLotesTotal(data.resumen.lista_de_fracciones);
  }

  const onError = (e) => {
    setIsLoading(false);
  };

  const handleCancel = async () => {
    Swal.fire({
      title: "¿Desea salir del apartado de Reporte de Proyectos?",
      icon: "question",
      text: "Presione Aceptar para confirmar",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setReporteNuevo(false);
      }
    });
  };

  var formatNumero = function (n, currency) {
    return currency + "" + n.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  };

  return (
    <>
      <div className="rep-pro__container">
        <div className="rep-pro__header">
          <Select
            showSearch
            placeholder="Seleccione un proyecto"
            optionLabelProp="label"
            onChange={(value) => {
              setProyectoID(value);
            }}
          >
            {proyectos?.map((proyecto) => (
              <Option
                key={proyecto.id}
                value={proyecto.id}
                label={proyecto.nombre}
              >
                {proyecto?.nombre}
              </Option>
            ))}
          </Select>

          <Button
            className="rep-pro__button--buscar"
            disabled={!proyectoID}
            onClick={handleSearchButton}
          >
            BUSCAR
          </Button>
          <Button
            className="rep-pro-button__salir"
            onClick={handleCancel}
            danger
            size="large"
          >
            Salir
          </Button>
        </div>
        <div className="rep-pro__body">
          <Table className="rep-pro__table--proyecto">
            <TableHead className="rep-pro__thead">
              <tr className="rep-pro__tr--header">
                <th colSpan={"4"} className="rep-pro__th">
                  PROYECTO
                </th>
              </tr>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={"2"}>
                  <strong>Propietario: </strong>
                  {terreno.propietario}
                </TableCell>
                <TableCell colSpan={"2"}>
                  <strong>Terreno: </strong>
                  {terreno.terreno}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={"2"}>
                  <strong>Domicilio: </strong>
                  {terreno.domicilio}
                </TableCell>
                <TableCell>
                  {" "}
                  <strong>Colonia: </strong>
                  {terreno.colonia}
                </TableCell>
                <TableCell>
                  {" "}
                  <strong>Ciudad: </strong>
                  {terreno.ciudad}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Cantidad de lotes: </strong>
                  {terreno.cantidad_lotes}
                </TableCell>
                <TableCell>
                  {" "}
                  <strong>Precio de compra: </strong>
                  {terreno.precio_compra}
                </TableCell>
                <TableCell>
                  <strong>Superficie total: </strong>
                  {terreno.superficie_total}
                </TableCell>
                <TableCell>
                  {" "}
                  <strong>Precio M2: </strong>
                  {terreno.precio_m2}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Precio de área vendible: </strong>
                  {terreno.precio_area_vendible}
                </TableCell>
                <TableCell>
                  {" "}
                  <strong>Área de reserva: </strong>
                  {terreno.area_reserva}
                </TableCell>
                <TableCell>
                  {" "}
                  <strong>Área vendible: </strong>
                  {terreno.area_vendible}
                </TableCell>
                <TableCell>
                  {" "}
                  <strong>Area de vialidad: </strong>
                  {terreno.area_vialidad}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={"2"}>
                  <strong>Fracciones pendientes: </strong>
                  {terreno.fracciones_pendientes}
                </TableCell>
                <TableCell colSpan={"2"}>
                  <strong>Total Proyectado de venta: </strong>
                  {terreno.total_proyectado_de_venta}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        {lotes && (
          <div>
            <Table className="rep-pro__table--fracciones">
              <TableHead>
                <tr className="rep-pro__tr--header">
                  <th colSpan={"10"} className="rep-pro__th">
                    FRACCIONES
                  </th>
                </tr>
                <TableRow>
                  <TableCell>
                    {" "}
                    <strong>No.</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <strong>Fehca</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <strong>Nombre</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <strong>Monto Contratado</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <strong>Plazo</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <strong>Requerido a la fecha</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <strong>Realizado a la fecha</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <strong>Saldo Pendiente</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <strong>Sistema de Pago</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <strong>Cta. de deposito</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lotes.map((lote, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {lote["fraccion"] || "Informacion no disponible"}
                      </TableCell>
                      <TableCell>
                        {lote["fecha"] || "Informacion no disponible"}
                      </TableCell>
                      <TableCell>
                        {lote["cliente_nombre"]}{" "}
                        {lote["cliente_apellido"] ||
                          "Informacion no disponible"}
                      </TableCell>
                      <TableCell>
                        {lote["monto_contratado"] ||
                          "Informacion no disponible"}
                      </TableCell>
                      <TableCell>
                        {lote["plazo"] || "Informacion no disponible"}
                      </TableCell>
                      <TableCell>
                        {lote["requerido_actual"] ||
                          "Informacion no disponible"}
                      </TableCell>
                      <TableCell>
                        {lote["realizado_actual"] ||
                          "Informacion no disponible"}
                      </TableCell>
                      <TableCell>
                        {lote["saldo_pendiente"] || "Informacion no disponible"}
                      </TableCell>
                      <TableCell>
                        {lote["sistema_pago"] || "Informacion no disponible"}
                      </TableCell>
                      <TableCell>
                        {lote["cuenta_deposito"] || "Informacion no disponible"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableRow>
                <TableCell>
                  <strong>TOTAL</strong>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>{lotesTotal.total_contrato}</TableCell>
                <TableCell></TableCell>
                <TableCell>{lotesTotal.total_requerido}</TableCell>
                <TableCell>{lotesTotal.total_realizado}</TableCell>
                <TableCell>{lotesTotal.total_pendiente}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
