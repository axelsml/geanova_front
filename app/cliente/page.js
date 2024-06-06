"use client";
import { formatPrecio, FormatDate } from "@/helpers/formatters";
import VentaForm from "@/components/VentaForm";
import PagoForm from "@/components/PagoForm";
import ventasService from "@/services/ventasService";
import {
  Button,
  Col,
  Collapse,
  Row,
  Typography,
  Form,
  Select,
  Modal,
  DatePicker,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { FaArrowCircleLeft, FaPrint, FaPencilAlt } from "react-icons/fa";
import { LoadingContext } from "@/contexts/loading";
import { FaFilePdf } from "react-icons/fa6";
import { SiOpslevel } from "react-icons/si";
import { usuario_id } from "@/helpers/user";

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
import pagosService from "@/services/pagosService";
import InputIn from "@/components/Input";
import { InputNumber } from "antd";

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
  const [imagenes, verImagenes] = useState(false);
  const [fecha_proximo_pago, setProximoPago] = useState(null);

  const [show, setShow] = useState(false);
  const [selectedPago, setSelectedPago] = useState({
    pago_id: null,
    no_pago: null,
    monto_pagado: null,
    fecha_operacion: null,
    fecha: null,
    fecha_transferencia: null,
  });
  const [sistemas_pago, setSistemasPago] = useState(null);
  const [sistemaPagoSelected, setSistemaPagoSelected] = useState(null);

  const { Option } = Select;

  useEffect(() => {
    pagosService.getSistemasPago(setSistemasPago, onError);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    //     ventasService.getVentas(setVentas, Error);
    terrenosService.getTerrenos(setTerrenos, Error);
    //     BuscarInfoLote()
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
    verImagenes(false);
    setInfoCliente(null);
    setInfoLote(null);
    setProximoPago(null);
    setIsLoading(true);
    lotesService.getClienteByLote(
      terrenoSelected.id,
      loteSelected.id,
      onInfoClienteCargado,
      onError
    );
  };

  async function onInfoClienteCargado(data) {
    setIsLoading(false);
    if (data.encontrado) {
      setInfoCliente(data.info_cliente);
      setInfoLote(data.info_lote);
      setProximoPago(data.fecha_proximo_pago);
    } else {
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
          { folio_cliente: cliente.folio_cliente },
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
  function borrarAmortizacion() {
    var params = {
      solicitud_id: info_lote.solicitud_id,
    };
    ventasService.borrarAmortizacion(params, onAmortizacionBorrada, onError);
  }
  async function onAmortizacionBorrada(data) {
    if (data.success) {
      window.open(
        `https://api.santamariadelaluz.com/iUsuarios/${info_lote.solicitud_id}.pdf`
      );
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No Se Pudo Borrar Amortizacion",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
    }
  }

  const handleModalPago = (pago) => {
    setSelectedPago(pago);
    debugger;
    var params = {
      sistema_pago_id: pago.sistema_pago_id,
    };
    pagosService.getSistemaPago(params, onSistemaPago, onError);
  };

  async function onSistemaPago(data) {
    if (data.success) {
      setSistemaPago(data.response);
    }
  }
  const handleCloseModal = () => {
    setShow(false);
    setSelectedPago({
      pago_id: null,
      no_pago: null,
      monto_pagado: null,
      fecha_operacion: null,
      fecha: null,
      sistema_pago: null,
      sistema_pago_id: null,
    });
    setSistemaPagoSelected(null);
  };

  const handleCancel = () => {
    Swal.fire({
      title: "¿Cancelar cambios?",
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
        handleCloseModal();
      }
    });
  };

  const handleSaveChanges = () => {
    if (sistemaPagoSelected == null || sistemaPagoSelected == "") {
      Swal.fire({
        title: "Seleccione un Sistema de Pago",
        icon: "error",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
    } else {
      var params = {
        id: selectedPago.pago_id,
        no_pago: selectedPago.no_pago,
        monto_pagado: selectedPago.monto_pagado,
        fecha_operacion: selectedPago.fecha_operacion,
        fecha: selectedPago.fecha,
        fecha_transferencia: selectedPago.fecha_transferencia,
        sistema_pago_id: sistemaPagoSelected,
      };
      pagosService.editarInfoPago(params, onSaveChanges, onError);
    }
  };

  async function onSaveChanges(data) {
    if (data.success) {
      Swal.fire({
        title: "Los cambios se han guardado",
        icon: "success",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          handleCloseModal();
          BuscarInfoLote();
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

  const onChanged = (name, value) => {
    setSelectedPago((prevSelectedPago) => ({
      ...prevSelectedPago,
      [name]: value,
    }));
  };

  return (
    <div className="p-8 grid gap-4">
      <Row justify={"center"}>
        <Col
          xs={24}
          sm={20}
          md={16}
          lg={12}
          xl={8}
          xxl={4}
          className="titulo_pantallas"
        >
          <b>INFORMACION DEL CLIENTE</b>
        </Col>
      </Row>
      <Row justify={"center"} style={{ marginTop: "15px" }}>
        <Col>
          <Form.Item
            label={"Proyecto"}
            name={"terreno"}
            style={{ width: "100%" }}
            rules={[{ required: true, message: "Terreno no seleccionado" }]}
            initialValue={terrenoSelected?.nombre}
          >
            <Select
              showSearch
              placeholder="Seleccione un Proyecto"
              optionLabelProp="label"
              onChange={onBuscarLotes}
            >
              {terrenos?.map((item, index) => (
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
              {lotes?.map((item, index) => (
                <Option key={index} value={item.id} label={item.numero}>
                  {item?.numero}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Button className="boton" onClick={BuscarInfoLote}>
            Buscar
          </Button>
        </Col>
      </Row>
      {info_cliente != null && (
        <>
          <Row justify={"center"} gutter={[16]}>
            <Col className="formulario_alterno" xs={24} sm={12} lg={12}>
              <Row
                justify={"center"}
                gutter={[16]}
                style={{ marginTop: "5px" }}
              >
                <Col xs={24} sm={24} lg={24}>
                  <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                      Nombre Cliente: {info_cliente.nombre_completo}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                      Cliente Desde: {info_cliente.cliente_desde}
                    </Col>
                  </Row>
                  <Row gutter={[16]} className="renglon_otro_color">
                    <Col>Domicilio: {info_cliente.domicilio}</Col>
                  </Row>
                  <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                      Telefono 1: {info_cliente.telefono_celular}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                      Telefono 2: {info_cliente.telefono_celular_2}
                    </Col>
                  </Row>

                  <Row gutter={[16]} className="renglon_otro_color">
                    <Col xs={24} sm={12} lg={12}>
                      Fecha Nacimiento: {info_cliente.fecha_nacimiento}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                      Lotes Adquiridos: {info_cliente.lotes_adquiridos}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row justify={"center"} gutter={[16]}>
                <Col xs={24} sm={24} lg={24}>
                  <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                      No. Lote: {info_lote.lote}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                      Superficie(M2): {info_lote.superficie}
                    </Col>
                  </Row>

                  <Row gutter={[16]} className="renglon_otro_color">
                    <Col xs={24} sm={12} lg={12}>
                      Proyecto: {info_lote.terreno}
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
                  <Row gutter={[16]} className="renglon_otro_color">
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
                    <Col xs={24} sm={12} lg={12}>
                      Monto Requerido: $
                      {formatPrecio(info_lote.monto_pago_requerido)}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row justify={"center"} gutter={[16]}>
                <Col xs={24} sm={24} lg={24}>
                  <Row gutter={[16]} className="renglon_otro_color">
                    <Col xs={4} sm={4} lg={2}>
                      Estado:
                    </Col>

                    <Col xs={4} sm={4} lg={2}>
                      <Button
                        disabled
                        size={"small"}
                        shape="round"
                        style={{
                          backgroundColor: info_lote.situacion_solicitud_color,
                          border: "none",
                        }}
                      >
                        <SiOpslevel
                          style={{
                            backgroundColor:
                              info_lote.situacion_solicitud_color,
                          }}
                        />
                      </Button>
                    </Col>
                  </Row>
                  <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                      Monto Pagado: ${formatPrecio(info_lote.monto_pagado)}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                      Monto Vencido: ${formatPrecio(info_lote.monto_vencido)}
                    </Col>
                  </Row>

                  <Row gutter={[16]} className="renglon_otro_color">
                    <Col xs={24} sm={12} lg={12}>
                      Pagos Vencidos: {info_lote.cantidad_vencidos}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                      Pagos Adelantados: {info_lote.cantidad_adelantados}
                    </Col>
                  </Row>

                  <Row gutter={[16]}>
                    <Col xs={24} sm={12} lg={12}>
                      Pagos Completados: {info_lote.pagos_completados}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                      Pagos Realizados: {info_lote.pagos_dados}
                    </Col>
                  </Row>
                  <Row
                    gutter={[16]}
                    className="renglon_otro_color"
                    style={{ marginBottom: "18px" }}
                  >
                    <Col xs={24} sm={12} lg={12}>
                      Pagos Transcurridos: {info_lote.pagos_esperados}
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                      Saldo: ${formatPrecio(info_lote.saldo)}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}

      {info_cliente != null && info_lote != null && (
        <Row justify={"center"} className="gap-10">
          <Col>
            <Button className="boton" size={"large"} onClick={CreateNuevoPago}>
              Nuevo Pago
            </Button>
          </Col>
          <Col>
            <Button
              className="boton"
              size={"large"}
              onClick={() => {
                borrarAmortizacion();
              }}
            >
              Borrar Amortizacion
            </Button>
          </Col>
          <Col>
            <Button
              className="boton"
              size="large"
              onClick={() => {
                window.open(
                  `https://api.santamariadelaluz.com/iUsuarios/${info_lote.solicitud_id}.pdf`
                );
              }}
            >
              Amortización
            </Button>
          </Col>
          <Col>
            <Button
              className="boton"
              size="large"
              onClick={() => {
                // terrenoSelected.id,loteSelected.id
                window.open(
                  `https://api.santamariadelaluz.com/getClienteByLote/${terrenoSelected.id}/${loteSelected.id}.pdf`
                );
              }}
            >
              Estado De Cuenta
            </Button>
          </Col>
          <Col>
            <Button
              className="boton"
              onClick={() => {
                window.open(
                  // https://api.santamariadelaluz.com
                  `https://api.santamariadelaluz.com/mostrar_imagen/${info_cliente.id}.pdf`
                );
              }}
              size="large"
            >
              Ver Imagenes
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
              proximoPago={fecha_proximo_pago}
              setWatch={setChangeState}
              watch={changeState}
            />
          )}
        </Col>
      </Row>

      {info_lote != null && (
        <>
          <Row justify={"center"} className="w-3/4 m-auto tabla">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow className="tabla_encabezado">
                    <TableCell>
                      <p>#</p>
                    </TableCell>
                    <TableCell>
                      <p>Folio</p>
                    </TableCell>
                    <TableCell>
                      <p>Fecha Operacion</p>
                    </TableCell>
                    <TableCell>
                      <p>Fecha Captura</p>
                    </TableCell>
                    <TableCell>
                      <p>Requerido</p>
                    </TableCell>
                    <TableCell>
                      <p>Realizado</p>
                    </TableCell>
                    <TableCell>
                      <p>Saldo Pendiente</p>
                    </TableCell>
                    <TableCell>
                      <p>Sistema Pago</p>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {info_lote.pagos
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((pago, index) => (
                      <TableRow key={index}>
                        <TableCell>{pago.no_pago}</TableCell>
                        <TableCell>{pago.folio}</TableCell>
                        <TableCell>{pago.fecha_operacion}</TableCell>
                        <TableCell>{pago.fecha}</TableCell>
                        <TableCell>
                          ${formatPrecio(pago.monto_requerido)}
                        </TableCell>
                        <TableCell>
                          ${formatPrecio(pago.monto_pagado)}
                        </TableCell>
                        <TableCell>
                          ${formatPrecio(pago.saldo_pendiente)}
                        </TableCell>
                        <TableCell>{pago.sistema_pago}</TableCell>
                        <TableCell>
                          {usuario_id <= 2 && (
                            <Button
                              className="boton"
                              key={pago}
                              onClick={() => {
                                setShow(true);
                                handleModalPago(pago);
                              }}
                              size="large"
                            >
                              <FaPencilAlt className="m-auto" size={"20px"} />
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            className="boton"
                            key={pago}
                            onClick={() => {
                              window.open(
                                `https://api.santamariadelaluz.com/iPagos/recibo/${pago.pago_id}.pdf`
                              );
                            }}
                            size="large"
                          >
                            <FaPrint className="m-auto" size={"20px"} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      count={info_lote.pagos.length}
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
        </>
      )}
      <Modal visible={show} footer={null} onCancel={() => handleCloseModal()}>
        <Row justify={"center"}>
          <Col
            xs={24}
            sm={20}
            md={16}
            lg={14}
            xl={14}
            xxl={14}
            className="titulo_pantallas"
          >
            <b>Editar Pago</b>
          </Col>
        </Row>
        <div className="modal-edit-pago__div--inputs-container">
          <div className="modal-edit-pago__div--inputs">
            <Col xs={12} sm={6} lg={6}>
              <Row justify={"center"}>
                <label className="modal-edit-pago__label--input" htmlFor="">
                  No. de Pago
                </label>
              </Row>
              <Row justify={"center"}>
                <InputNumber
                  id="no_pago"
                  className="modal-edit-pago__input--no-pago"
                  value={selectedPago ? selectedPago.no_pago : null}
                  onChange={(value) => {
                    onChanged("no_pago", value);
                  }}
                  placeholder={
                    selectedPago ? selectedPago.no_pago : "Número de pago"
                  }
                />
              </Row>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Row justify={"center"}>
                <label className="modal-edit-pago__label--input" htmlFor="">
                  Pago Realizado
                </label>
              </Row>
              <Row justify={"center"}>
                <InputIn
                  id="folio"
                  className="modal-edit-pago__input--realizado"
                  value={selectedPago ? selectedPago.monto_pagado : null}
                  onChange={(value) => {
                    onChanged("monto_pagado", value.target.value);
                  }}
                  placeholder={
                    selectedPago ? selectedPago.monto_pagado : "Pago Realizado"
                  }
                />
              </Row>
            </Col>
            <Col xs={12} sm={6} lg={8}>
              <Row justify={"center"}>
                <label className="modal-edit-pago__label--input" htmlFor="">
                  Sistema de Pago
                </label>
              </Row>
              <Row justify={"center"}>
                <Select
                  className="modal-edit-pago__input--sis-pago"
                  id="sistema_pago"
                  showSearch
                  value={
                    sistemaPagoSelected !== null ? sistemaPagoSelected : null
                  }
                  placeholder={"Seleccione un Sistema de Pago"}
                  onChange={(value) => {
                    setSistemaPagoSelected(value);
                  }}
                >
                  {sistemas_pago?.map((item, index) => (
                    <Option key={index} value={item.id} label={item.Nombre}>
                      {item?.Nombre}
                    </Option>
                  ))}
                </Select>
              </Row>
            </Col>
          </div>
          <div className="modal-edit-pago__div--inputs-fechas">
            <Col xs={12} sm={6} lg={8}>
              <Row justify={"center"}>
                <label className="modal-edit-pago__label--input" htmlFor="">
                  Fecha de Operación
                </label>
              </Row>
              <Row justify={"center"}>
                <input
                  type="date"
                  id="fecha_operacion"
                  className="modal-edit-pago__input--fecha"
                  value={
                    selectedPago.fecha_operacion !== null
                      ? selectedPago.fecha_operacion
                      : null
                  }
                  onChange={(date) =>
                    onChanged("fecha_operacion", date.target.value)
                  }
                  placeholder={
                    selectedPago.fecha_operacion !== null
                      ? selectedPago.fecha_operacion
                      : "Fecha de Operación"
                  }
                />
              </Row>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <Row justify={"center"}>
                <label className="modal-edit-pago__label--input" htmlFor="">
                  Fecha Captura
                </label>
              </Row>
              <Row justify={"center"}>
                <input
                  type="date"
                  id="fecha"
                  className="modal-edit-pago__input--fecha"
                  value={
                    selectedPago.fecha !== null ? selectedPago.fecha : null
                  }
                  onChange={(date) => {
                    onChanged("fecha", date.target.value);
                  }}
                  placeholder={
                    selectedPago.fecha !== null ? selectedPago.fecha : "Fecha"
                  }
                />
              </Row>
            </Col>
            <Col xs={12} sm={6} lg={8}>
              <Row justify={"center"}>
                <label className="modal-edit-pago__label--input" htmlFor="">
                  Fecha de Transferencia
                </label>
              </Row>
              <Row justify={"center"}>
                <input
                  type="date"
                  id="fecha_transferencia"
                  className="modal-edit-pago__input--fecha"
                  value={
                    selectedPago.fecha_transferencia !== null
                      ? selectedPago.fecha_transferencia
                      : null
                  }
                  onChange={(date) => {
                    onChanged("fecha_transferencia", date.target.value);
                  }}
                  placeholder={
                    selectedPago.fecha_transferencia !== null
                      ? selectedPago.fecha_transferencia
                      : "Fecha Transferencia"
                  }
                />
              </Row>
            </Col>
          </div>
        </div>
        <div className="modal-edit-pago__div-buttons">
          <Button
            className="boton-cancelar"
            onClick={() => {
              handleCancel();
            }}
          >
            Cancelar
          </Button>
          <Button
            className="boton"
            onClick={() => {
              handleSaveChanges();
            }}
          >
            Guardar
          </Button>
        </div>
      </Modal>

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
