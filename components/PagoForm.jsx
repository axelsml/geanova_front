"use client";

import {
  Typography,
  Tag,
  Button,
  Form,
  Col,
  DatePicker,
  Select,
  InputNumber,
  Row,
} from "antd";
import Swal from "sweetalert2";
import { useState, useContext, useEffect } from "react";
import { formatPrecio, formatDate } from "@/helpers/formatters";
import BuscarCliente from "./BuscarCliente";
import { LoadingContext } from "@/contexts/loading";
import pagosService from "@/services/pagosService";
import { usuario_id } from "@/helpers/user";
import InputIn from "./Input";
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

export default function PagoForm({
  setNuevoPago,
  cliente,
  lote,
  proximoPago,
  setWatch,
  watch,
}) {
  const { setIsLoading } = useContext(LoadingContext);
  const [sistemas_pago, setSistemasPago] = useState(null);
  const [sistemaSelected, setSistemaSelected] = useState(null);
  const [tipoPagoSelected, setTipoPagoSelected] = useState(null);
  const [tipo_pagos, setTipoPagos] = useState(null);
  // const [cliente, setCliente] = useState(null);
  const [form] = Form.useForm();
  const { Option } = Select;
  const { Title, Text, Paragraph } = Typography;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [valoresIniciales, setValoresIniciales] = useState({
    monto_pago: lote.monto_pago_requerido,
  });
  const [valor, setValor] = useState(lote.monto_pago_requerido);

  const [fecha_movimiento, setFechaMovimiento] = useState("");
  const [movimientos_pendientes, setPendientes] = useState([]);
  const [movimiento_id_conciliar, setMovimientoIdConciliar] = useState(0);

  useEffect(() => {
    pagosService.getSistemasPago(setSistemasPago, onError);
    pagosService.getTipoPagos(setTipoPagos, onError);
  }, []);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const onGuardarPago = (values) => {
    if(usuario_id == 0){
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No se pudo verificar al usuario. Favor de iniciar sesión nuevamente.",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
    }else{
      values["fecha"] = formatDate(values.fecha);
      Swal.fire({
        title: "Verifique que los datos sean correctos",
        icon: "info",
        html: `Cliente: ${cliente.nombre_completo}<br/><br/>Lote: ${
          lote.lote
        }<br/><br/>Monto de Pago:  $${formatPrecio(
          values.monto_pagado
        )}<br/><br/>Fecha: ${values.fecha}`,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          let params = {
            ...values,
            usuario_id: usuario_id,
            solicitud_id: lote.solicitud_id,
            conciliacion: movimiento_id_conciliar,
          };
          debugger;
          pagosService.createPago({ pago: params }, onPagoGuardado, onError);
        }
      });
    }

  };

  const handleCancel = async () => {
    //MENSAJE EMERGENTE PARA REAFIRMAR QUE SE VA A
    //CANCELAR EL PROCESO DE GUARDADO
    Swal.fire({
      title: "¿Desea cancelar el proceso?",
      icon: "info",
      text: "Se eliminarán los datos ingresados",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setNuevoPago(false);
      }
    });
  };

  const onPagoGuardado = (data) => {
    setIsLoading(false);
    if (data.success) {
      setWatch(!watch);
      Swal.fire({
        title: "Guardado con Éxito",
        icon: "success",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
      setNuevoPago(false);
      window.open(
        `https://api.santamariadelaluz.com/iPagos/recibo/${data.pago.id}.pdf`
      );
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

  const validacionMensajes = {
    required: "${label} es requerido",
    types: {
      number: "${label} no es un número válido!",
    },
    number: {
      min: "${label} no puede ser menor a ${min}",
    },
  };

  function buscarMovimientosBanco() {
    setIsLoading(true);
    setPendientes([]);
    var params = {
      fecha_operacion: fecha_movimiento,
      monto_pago: valor,
    };
    debugger;
    pagosService.BuscarMovimientoBanco(params, onMovimientosCoinciden, onError);
  }

  async function onMovimientosCoinciden(data) {
    setIsLoading(false);
    setPendientes(data.pendientes);
    if (data.pendientes.length == 0) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No Se Encontro Movimiento",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
    } else {
      setPendientes(data.pendientes);
    }
  }

  return (
    <div className="w-3/4 mx-auto p-6 m-7 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-center">Datos de Pago</h1>
      {/* <BuscarCliente
        setCliente={setCliente}
        setWatch={setWatch}
        watch={watch}
      /> */}

      <Row style={{ marginBottom: "16px", marginLeft: "8px" }}>
        <Col>
          <Text style={{ display: "block" }}>
            <b>Próximo Pago:</b>
          </Text>
          <Text style={{ display: "block" }}>{proximoPago}</Text>
        </Col>
      </Row>

      <div className="grid gap-10">
        <Form
          form={form}
          onFinish={onGuardarPago}
          name="pago"
          autoComplete="off"
          className="grid gap-1"
          layout="vertical"
          validateMessages={validacionMensajes}
          initialValues={valoresIniciales}
        >
          <Col>
            <Form.Item
              name={"monto_pagado"}
              label={"Monto de Pago"}
              style={{ width: "100%" }}
              initialValue={valor}
              rules={[{ required: true }, { type: "number", min: 1 }]}
            >
              <InputNumber
                style={{
                  width: "100%",
                }}
                onChange={(value) => {
                  setValor(value);
                }}
                placeholder="Ingrese el Monto de Pago"
                formatter={formatPrecio}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                prefix="$"
                suffix="MXN"
              />
            </Form.Item>

            <Form.Item
              name="fecha"
              label="Fecha de Pago"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: "Fecha de Pago es requerida",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Ingrese la Fecha de Pago"
              />
            </Form.Item>

            <Form.Item
              label={"Sistema de Pago"}
              name={"sistema_pago_id"}
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: "Sistema de Pago no seleccionado",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Seleccione un Sistema de Pago"
                optionLabelProp="label"
                onChange={(value) => {
                  setSistemaSelected(value);
                }}
              >
                {sistemas_pago?.map((item, index) => (
                  <Option key={index} value={item.id} label={item.Nombre}>
                    {item?.Nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {sistemaSelected === 1 && (
              <>
                <Form.Item
                  label={"Tipo de Pago"}
                  name={"tipo_pago_id"}
                  style={{ width: "100%" }}
                  rules={[
                    {
                      required: true,
                      message: "Tipo de Pago no seleccionado",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Seleccione un Tipo de Pago"
                    optionLabelProp="label"
                    onChange={(value) => {
                      setTipoPagoSelected(value);
                    }}
                  >
                    {tipo_pagos?.map((item, index) => (
                      <Option key={index} value={item.id} label={item.nombre}>
                        {item?.nombre}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {tipoPagoSelected === 1 && (
                  <InputIn
                    placeholder="Ingrese Nombre de Quién Recibió"
                    name="usuario_recibio"
                    label="Recibió"
                    rules={[
                      {
                        required: true,
                        message: "Nombre de Quién Recibió es requerido",
                      },
                    ]}
                  />
                )}
              </>
            )}

            {sistemaSelected === 2 && (
              <div>
                <Form.Item
                  name="fechaTransferencia"
                  label="Fecha de Transferencia"
                  style={{ width: "100%" }}
                  rules={[
                    {
                      required: true,
                      message: "Fecha de Transferencia requerida",
                    },
                  ]}
                >
                  <DatePicker
                    onChange={(value) => {
                      setFechaMovimiento(formatDate(value));
                    }}
                    style={{ width: "100%" }}
                    placeholder="Ingrese la Fecha en la que se Realizó la Transferencia"
                  />
                </Form.Item>
                <Button
                  onClick={() => {
                    buscarMovimientosBanco();
                  }}
                >
                  Buscar
                </Button>
                {movimientos_pendientes.length != 0 && (
                  <>
                    <Row justify={"center"} className="m-auto">
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Fecha Operacion</TableCell>
                              <TableCell>Descripcion</TableCell>
                              <TableCell>Cantidad</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {movimientos_pendientes
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((movimiento, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {movimiento.fecha_operacion}
                                  </TableCell>
                                  <TableCell>{movimiento.concepto}</TableCell>
                                  <TableCell>
                                    ${formatPrecio(movimiento.abono)}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      key={movimiento}
                                      onClick={() => {
                                        setMovimientoIdConciliar(movimiento.id);
                                        setPendientes([]);
                                      }}
                                      size="large"
                                    >
                                      Seleccionar
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                              <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={movimientos_pendientes.length}
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
              </div>
            )}
          </Col>

          <span className="flex gap-2 justify-end">
            <Button htmlType="submit" size="large">
              Guardar
            </Button>

            <Button onClick={handleCancel} danger size="large">
              Cancelar
            </Button>
          </span>
        </Form>
      </div>
    </div>
  );
}
