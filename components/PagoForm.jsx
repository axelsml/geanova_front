"use client";

import {
  Typography,
  Button,
  Form,
  Col,
  DatePicker,
  Select,
  InputNumber,
  Row,
  Upload,
} from "antd";

import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useState, useContext, useEffect } from "react";

import { formatPrecio, formatDate } from "@/helpers/formatters";
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
  tipo_pago_id_opcion,
  monto_requerido,
}) {
  const { setIsLoading } = useContext(LoadingContext);

  const [form] = Form.useForm();

  const { Option } = Select;
  const { Text } = Typography;

  // ============================================================
  // CATÁLOGOS
  // ============================================================

  const [sistemas_pago, setSistemasPago] = useState([]);
  const [tipo_pagos, setTipoPagos] = useState([]);

  // NUEVO
  const [cuentasBancarias, setCuentasBancarias] = useState([]);

  // ============================================================
  // SELECCIONES
  // ============================================================

  const [sistemaSelected, setSistemaSelected] = useState(null);
  const [tipoPagoSelected, setTipoPagoSelected] = useState(null);

  // ============================================================
  // COMPROBANTE
  // ============================================================

  const [comprobanteBanco, setComprobanteBanco] = useState(null);

  // ============================================================
  // PAGINACIÓN
  // ============================================================

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ============================================================
  // PAGO
  // ============================================================

  const [valor, setValor] = useState(monto_requerido);

  const [fecha_movimiento, setFechaMovimiento] = useState("");

  // ============================================================
  // CONCILIACIÓN
  // ============================================================

  const [movimientos_pendientes, setPendientes] = useState([]);

  const [movimiento_id_conciliar, setMovimientoIdConciliar] =
    useState(0);

  // ============================================================
  // SISTEMAS QUE REQUIEREN CUENTA BANCARIA
  // 2 = Transferencia
  // 5 = Deposito Banco
  // ============================================================

  const SISTEMAS_CON_CUENTA_BANCARIA = [2, 5];

  // ============================================================
  // CARGAR CATÁLOGOS
  // ============================================================

  useEffect(() => {
    pagosService.getSistemasPago(
      setSistemasPago,
      onError
    );

    pagosService.getTipoPagos(
      setTipoPagos,
      onError
    );

    pagosService.getBancosCuentasBancarias(
      setCuentasBancarias,
      onError
    );
  }, []);

  // ============================================================
  // LABEL CUENTA BANCARIA
  //
  // Esto permite soportar diferentes nombres que pudiera
  // regresar tu API.
  // ============================================================

  const getCuentaBancariaLabel = (cuenta) => {
    if (!cuenta) return "";

    const banco =
      cuenta.banco ||
      cuenta.nombre_banco ||
      cuenta.nombreBanco ||
      cuenta.nombre ||
      "";

    const numeroCuenta =
      cuenta.numero_cuenta ||
      cuenta.no_cuenta ||
      cuenta.cuenta ||
      cuenta.numero ||
      "";

    const clabe =
      cuenta.clabe ||
      cuenta.clabe_interbancaria ||
      "";

    const titular =
      cuenta.titular ||
      cuenta.nombre_titular ||
      "";

    const partes = [];

    if (banco) {
      partes.push(banco);
    }

    if (numeroCuenta) {
      partes.push(numeroCuenta);
    } else if (clabe) {
      partes.push(clabe);
    }

    if (titular) {
      partes.push(titular);
    }

    if (partes.length === 0) {
      return `Cuenta ${cuenta.id}`;
    }

    return partes.join(" - ");
  };

  // ============================================================
  // CAMBIO SISTEMA PAGO
  // ============================================================

  const handleSistemaPagoChange = (value) => {
    setSistemaSelected(value);

    // Si no es transferencia o depósito banco,
    // limpiar la cuenta bancaria.
    if (!SISTEMAS_CON_CUENTA_BANCARIA.includes(value)) {
      form.setFieldsValue({
        cuenta_bancaria_id: undefined,
      });
    }

    // Estos datos actualmente son exclusivos de Transferencia.
    if (value !== 2) {
      setComprobanteBanco(null);

      setMovimientoIdConciliar(0);

      setPendientes([]);

      setFechaMovimiento("");

      form.setFieldsValue({
        fechaTransferencia: undefined,
        referenciaTransferencia: undefined,
      });
    }

    // Si deja Pago en Oficina
    if (value !== 1) {
      setTipoPagoSelected(null);

      form.setFieldsValue({
        usuario_recibio: undefined,
      });
    }

    // Si deja "Otro"
    if (value !== 8) {
      form.setFieldsValue({
        otro_pago: undefined,
      });
    }
  };

  // ============================================================
  // PAGINACIÓN
  // ============================================================

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(
      parseInt(event.target.value, 10)
    );

    setPage(0);
  };

  // ============================================================
  // GUARDAR PAGO
  // ============================================================

  const onGuardarPago = (values) => {
    // ----------------------------------------------------------
    // VALIDAR COMPROBANTE PARA TRANSFERENCIA
    // ----------------------------------------------------------

    if (
      sistemaSelected === 2 &&
      !comprobanteBanco
    ) {
      Swal.fire({
        title: "Comprobante requerido",
        icon: "warning",
        text: "Debe adjuntar el comprobante del pago bancario.",
        confirmButtonText: "Aceptar",
      });

      return;
    }

    // ----------------------------------------------------------
    // VALIDAR CUENTA BANCARIA
    // ----------------------------------------------------------

    if (
      SISTEMAS_CON_CUENTA_BANCARIA.includes(
        sistemaSelected
      ) &&
      !values.cuenta_bancaria_id
    ) {
      Swal.fire({
        title: "Cuenta bancaria requerida",
        icon: "warning",
        text: "Debe seleccionar la cuenta bancaria donde se recibió el pago.",
        confirmButtonText: "Aceptar",
      });

      return;
    }

    // ----------------------------------------------------------
    // PREPARAR VALORES
    // ----------------------------------------------------------

    values.fecha = formatDate(values.fecha);

    values.tipo_pago_id =
      tipo_pago_id_opcion;

    // DatePicker de Ant Design manda objeto moment.
    // Lo convertimos antes de enviarlo a Rails.
    if (values.fechaTransferencia) {
      values.fechaTransferencia =
        formatDate(values.fechaTransferencia);
    }

    // ----------------------------------------------------------
    // CONFIRMACIÓN
    // ----------------------------------------------------------

    Swal.fire({
      title: "Verifique que los datos sean correctos",
      icon: "info",

      html: `
        Cliente: ${cliente.nombre_completo}
        <br/><br/>

        Lote: ${lote.lote}
        <br/><br/>

        Monto de Pago:
        $${formatPrecio(values.monto_pagado)}
        <br/><br/>

        Fecha:
        ${values.fecha}
      `,

      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",

      showDenyButton: true,
      showCancelButton: false,

      allowOutsideClick: false,

      confirmButtonText: "Aceptar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const params = {
        ...values,

        usuario_id: usuario_id,

        solicitud_id:
          lote.solicitud_id,

        conciliacion:
          movimiento_id_conciliar,
      };

      // --------------------------------------------------------
      // FORMDATA
      // Necesario por el comprobante Paperclip.
      // --------------------------------------------------------

      const formData = new FormData();

      Object.keys(params).forEach((key) => {
        const value = params[key];

        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          formData.append(
            `pago[${key}]`,
            value
          );
        }
      });

      // --------------------------------------------------------
      // COMPROBANTE
      // --------------------------------------------------------

      if (comprobanteBanco) {
        formData.append(
          "pago[comprobante]",
          comprobanteBanco
        );
      }

      setIsLoading(true);

      pagosService.createPago(
        formData,
        onPagoGuardado,
        onError
      );
    });
  };

  // ============================================================
  // CANCELAR
  // ============================================================

  const handleCancel = () => {
    Swal.fire({
      title: "¿Desea cancelar el proceso?",
      icon: "info",

      text:
        "Se eliminarán los datos ingresados",

      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",

      showDenyButton: true,
      showCancelButton: false,

      confirmButtonText: "Aceptar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setNuevoPago(false);
      }
    });
  };

  // ============================================================
  // PAGO GUARDADO
  // ============================================================

  const onPagoGuardado = (data) => {
    setIsLoading(false);

    if (data.success) {
      setWatch(!watch);

      Swal.fire({
        title: "Guardado con Éxito",
        icon: "success",

        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",

        showDenyButton: false,

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

        text:
          data.message ||
          "No se pudo guardar el pago",

        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",

        showDenyButton: false,

        confirmButtonText: "Aceptar",
      });
    }
  };

  // ============================================================
  // ERROR
  // ============================================================

  const onError = (e) => {
    setIsLoading(false);

    console.log(e);

    Swal.fire({
      title: "Error",
      icon: "error",
      text: "Ocurrió un error al realizar la operación.",
      confirmButtonText: "Aceptar",
    });
  };

  // ============================================================
  // VALIDACIÓN FORM
  // ============================================================

  const validacionMensajes = {
    required:
      "${label} es requerido",

    types: {
      number:
        "${label} no es un número válido!",
    },

    number: {
      min:
        "${label} no puede ser menor a ${min}",
    },
  };

  // ============================================================
  // BUSCAR MOVIMIENTO BANCO
  // ============================================================

  function buscarMovimientosBanco() {
    if (!fecha_movimiento) {
      Swal.fire({
        title: "Fecha requerida",
        icon: "warning",

        text:
          "Seleccione la fecha de transferencia antes de buscar.",

        confirmButtonText: "Aceptar",
      });

      return;
    }

    if (!valor || Number(valor) <= 0) {
      Swal.fire({
        title: "Monto requerido",
        icon: "warning",

        text:
          "Ingrese el monto del pago antes de buscar.",

        confirmButtonText: "Aceptar",
      });

      return;
    }

    setIsLoading(true);

    setPendientes([]);

    setMovimientoIdConciliar(0);

    const params = {
      fecha_operacion:
        fecha_movimiento,

      monto_pago:
        valor,

      lote:
        lote.lote,
    };

    pagosService.BuscarMovimientoBanco(
      params,
      onMovimientosCoinciden,
      onError
    );
  }

  // ============================================================
  // MOVIMIENTOS ENCONTRADOS
  // ============================================================

  function onMovimientosCoinciden(data) {
    setIsLoading(false);

    const movimientos =
      data && data.pendientes
        ? data.pendientes
        : [];

    if (movimientos.length === 0) {
      setPendientes([]);

      Swal.fire({
        title: "Sin coincidencias",
        icon: "warning",

        text:
          "No se encontró ningún movimiento bancario que coincida con la fecha y el monto.",

        confirmButtonColor: "#4096ff",

        showDenyButton: false,

        confirmButtonText: "Aceptar",
      });

      return;
    }

    setPendientes(movimientos);
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="w-3/4 mx-auto p-6 m-7 bg-white rounded-lg shadow-md">

      <h1 className="text-2xl font-semibold mb-4 text-center">
        Datos de Pago
      </h1>

      {/* ======================================================
          PRÓXIMO PAGO
          ====================================================== */}

      <Row
        style={{
          marginBottom: "16px",
          marginLeft: "8px",
        }}
      >
        <Col>

          <Text
            style={{
              display: "block",
            }}
          >
            <b>Próximo Pago:</b>
          </Text>

          <Text
            style={{
              display: "block",
            }}
          >
            {proximoPago}
          </Text>

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

          validateMessages={
            validacionMensajes
          }

          initialValues={{
            monto_pagado:
              monto_requerido,

            referenciaTransferencia:
              "",
          }}
        >

          <Col>

            {/* =================================================
                MONTO
                ================================================= */}

            <Form.Item
              name="monto_pagado"

              label="Monto de Pago"

              style={{
                width: "100%",
              }}

              rules={[
                {
                  required: true,
                },
                {
                  type: "number",
                  min: 1,
                },
              ]}
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

                parser={(value) =>
                  value.replace(
                    /\$\s?|(,*)/g,
                    ""
                  )
                }

                prefix="$"

                suffix="MXN"
              />

            </Form.Item>


            {/* =================================================
                FECHA PAGO
                ================================================= */}

            <Form.Item
              name="fecha"

              label="Fecha de Pago"

              style={{
                width: "100%",
              }}

              rules={[
                {
                  required: true,

                  message:
                    "Fecha de Pago es requerida",
                },
              ]}
            >

              <DatePicker
                style={{
                  width: "100%",
                }}

                placeholder="Ingrese la Fecha de Pago"
              />

            </Form.Item>


            {/* =================================================
                SISTEMA PAGO
                ================================================= */}

            <Form.Item
              label="Sistema de Pago"

              name="sistema_pago_id"

              style={{
                width: "100%",
              }}

              rules={[
                {
                  required: true,

                  message:
                    "Sistema de Pago no seleccionado",
                },
              ]}
            >

              <Select
                showSearch

                placeholder="Seleccione un Sistema de Pago"

                optionLabelProp="label"

                optionFilterProp="label"

                onChange={
                  handleSistemaPagoChange
                }
              >

                {sistemas_pago?.map(
                  (item) => (

                    <Option
                      key={item.id}

                      value={item.id}

                      label={item.Nombre}
                    >
                      {item.Nombre}
                    </Option>

                  )
                )}

              </Select>

            </Form.Item>


            {/* =================================================
                CUENTA BANCARIA

                2 = Transferencia
                5 = Deposito Banco
                ================================================= */}

            {SISTEMAS_CON_CUENTA_BANCARIA.includes(
              sistemaSelected
            ) && (

              <Form.Item
                name="cuenta_bancaria_id"

                label="Cuenta Bancaria"

                style={{
                  width: "100%",
                }}

                rules={[
                  {
                    required: true,

                    message:
                      "Seleccione la cuenta bancaria donde se recibió el pago",
                  },
                ]}
              >

                <Select
                  showSearch

                  allowClear

                  placeholder="Seleccione la Cuenta Bancaria"

                  optionFilterProp="label"

                  optionLabelProp="label"
                >

                  {cuentasBancarias?.map(
                    (cuenta) => {

                      const label =
                        getCuentaBancariaLabel(
                          cuenta
                        );

                      return (

                        <Option
                          key={cuenta.id}

                          value={cuenta.id}

                          label={label}
                        >

                          {label}

                        </Option>

                      );
                    }
                  )}

                </Select>

              </Form.Item>

            )}


            {/* =================================================
                PAGO EN OFICINA
                ================================================= */}

            {sistemaSelected === 1 && (
              <>

                <Form.Item
                  label="Tipo de Pago"

                  name="tipo_pago_id"

                  style={{
                    width: "100%",
                  }}

                  rules={[
                    {
                      required: true,

                      message:
                        "Tipo de Pago no seleccionado",
                    },
                  ]}
                >

                  <Select
                    showSearch

                    placeholder="Seleccione un Tipo de Pago"

                    optionLabelProp="label"

                    onChange={(value) => {
                      setTipoPagoSelected(
                        value
                      );
                    }}
                  >

                    {tipo_pagos?.map(
                      (item) => (

                        <Option
                          key={item.id}

                          value={item.id}

                          label={item.nombre}
                        >
                          {item.nombre}
                        </Option>

                      )
                    )}

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

                        message:
                          "Nombre de Quién Recibió es requerido",
                      },
                    ]}
                  />

                )}

              </>
            )}


            {/* =================================================
                TRANSFERENCIA
                ================================================= */}

            {sistemaSelected === 2 && (

              <div>

                {/* ---------------------------------------------
                    FECHA TRANSFERENCIA
                    --------------------------------------------- */}

                <Form.Item
                  name="fechaTransferencia"

                  label="Fecha de Transferencia"

                  style={{
                    width: "100%",
                  }}

                  rules={[
                    {
                      required: true,

                      message:
                        "Fecha de Transferencia requerida",
                    },
                  ]}
                >

                  <DatePicker
                    onChange={(value) => {

                      if (value) {
                        setFechaMovimiento(
                          formatDate(value)
                        );
                      } else {
                        setFechaMovimiento(
                          ""
                        );
                      }

                      setMovimientoIdConciliar(
                        0
                      );

                      setPendientes([]);
                    }}

                    style={{
                      width: "100%",
                    }}

                    placeholder="Ingrese la Fecha en la que se Realizó la Transferencia"
                  />

                </Form.Item>


                {/* ---------------------------------------------
                    COMPROBANTE
                    --------------------------------------------- */}

                <Form.Item
                  label="Comprobante de Pago"

                  required

                  extra="Formatos permitidos: JPG, JPEG o PNG. Máximo 5 MB."
                >

                  <Upload
                    beforeUpload={(file) => {

                      const tiposPermitidos = [
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                      ];

                      if (
                        !tiposPermitidos.includes(
                          file.type
                        )
                      ) {

                        Swal.fire({
                          title:
                            "Archivo no válido",

                          icon:
                            "error",

                          text:
                            "Solo se permiten imágenes JPG, JPEG o PNG.",
                        });

                        return Upload.LIST_IGNORE;
                      }


                      const menor5MB =
                        file.size /
                          1024 /
                          1024 <=
                        5;

                      if (!menor5MB) {

                        Swal.fire({
                          title:
                            "Archivo demasiado grande",

                          icon:
                            "error",

                          text:
                            "La imagen debe pesar máximo 5 MB.",
                        });

                        return Upload.LIST_IGNORE;
                      }


                      setComprobanteBanco(
                        file
                      );

                      return false;
                    }}

                    onRemove={() => {
                      setComprobanteBanco(
                        null
                      );
                    }}

                    maxCount={1}

                    accept=".jpg,.jpeg,.png"
                  >

                    <Button
                      icon={
                        <UploadOutlined />
                      }
                    >
                      Seleccionar comprobante
                    </Button>

                  </Upload>

                </Form.Item>


                {/* ---------------------------------------------
                    REFERENCIA
                    --------------------------------------------- */}

                <Form.Item
                  name="referenciaTransferencia"

                  label="Referencia de Transferencia"

                  style={{
                    width: "100%",
                  }}
                >

                  <InputIn
                    placeholder="Ingrese Referencia de Transferencia"
                  />

                </Form.Item>


                {/* ---------------------------------------------
                    BUSCAR MOVIMIENTO
                    --------------------------------------------- */}

                <Button
                  onClick={
                    buscarMovimientosBanco
                  }

                  style={{
                    marginBottom: 15,
                  }}
                >
                  Buscar Movimiento Bancario
                </Button>


                {/* ---------------------------------------------
                    MOVIMIENTO SELECCIONADO
                    --------------------------------------------- */}

                {movimiento_id_conciliar >
                  0 && (

                  <div
                    style={{
                      marginBottom: 15,
                    }}
                  >

                    <Text
                      type="success"
                      strong
                    >
                      Movimiento bancario seleccionado:
                      {" "}
                      {movimiento_id_conciliar}
                    </Text>

                  </div>

                )}


                {/* ---------------------------------------------
                    RESULTADOS
                    --------------------------------------------- */}

                {movimientos_pendientes.length >
                  0 && (

                  <Row
                    justify="center"

                    className="m-auto"
                  >

                    <TableContainer
                      component={Paper}
                    >

                      <Table>

                        <TableHead>

                          <TableRow>

                            <TableCell>
                              Fecha Operación
                            </TableCell>

                            <TableCell>
                              Descripción
                            </TableCell>

                            <TableCell>
                              Cantidad
                            </TableCell>

                            <TableCell>
                            </TableCell>

                          </TableRow>

                        </TableHead>


                        <TableBody>

                          {movimientos_pendientes
                            .slice(
                              page *
                                rowsPerPage,

                              page *
                                rowsPerPage +
                                rowsPerPage
                            )
                            .map(
                              (movimiento) => (

                                <TableRow
                                  key={
                                    movimiento.id
                                  }
                                >

                                  <TableCell>
                                    {
                                      movimiento.fecha_operacion
                                    }
                                  </TableCell>

                                  <TableCell>
                                    {
                                      movimiento.concepto
                                    }
                                  </TableCell>

                                  <TableCell>
                                    $
                                    {formatPrecio(
                                      movimiento.abono
                                    )}
                                  </TableCell>

                                  <TableCell>

                                    <Button
                                      onClick={() => {

                                        setMovimientoIdConciliar(
                                          movimiento.id
                                        );

                                        setPendientes(
                                          []
                                        );
                                      }}

                                      size="large"
                                    >
                                      Seleccionar
                                    </Button>

                                  </TableCell>

                                </TableRow>

                              )
                            )}

                        </TableBody>


                        <TableFooter>

                          <TableRow>

                            <TablePagination
                              rowsPerPageOptions={[
                                5,
                                10,
                                25,
                              ]}

                              count={
                                movimientos_pendientes.length
                              }

                              rowsPerPage={
                                rowsPerPage
                              }

                              page={page}

                              onPageChange={
                                handleChangePage
                              }

                              onRowsPerPageChange={
                                handleChangeRowsPerPage
                              }

                              labelRowsPerPage="Movimientos por Página"
                            />

                          </TableRow>

                        </TableFooter>

                      </Table>

                    </TableContainer>

                  </Row>

                )}

              </div>

            )}


            {/* =================================================
                DEPÓSITO BANCO

                El select de cuenta bancaria ya aparece arriba
                automáticamente cuando sistemaSelected === 5.

                Si después quieres pedir también:
                - fecha depósito
                - referencia
                - comprobante
                podemos agregarlo aquí.
                ================================================= */}

            {sistemaSelected === 5 && (

              <div
                style={{
                  marginBottom: 16,
                  padding: 12,
                  backgroundColor:
                    "#f5f7fa",
                  borderRadius: 6,
                }}
              >

                <Text
                  type="secondary"
                >
                  Seleccione arriba la cuenta bancaria
                  donde se realizó el depósito.
                </Text>

              </div>

            )}


            {/* =================================================
                OTRO
                ================================================= */}

            {sistemaSelected === 8 && (

              <InputIn
                placeholder="Especifique tipo de pago"

                name="otro_pago"

                label="Otro"

                rules={[
                  {
                    required: true,

                    message:
                      "Especifique tipo de pago",
                  },
                ]}
              />

            )}

          </Col>


          {/* ===================================================
              BOTONES
              =================================================== */}

          <span className="flex gap-2 justify-end">

            <Button
              htmlType="submit"

              size="large"

              className="boton"
            >
              Guardar
            </Button>


            <Button
              onClick={
                handleCancel
              }

              danger

              size="large"
            >
              Cancelar
            </Button>

          </span>

        </Form>

      </div>

    </div>
  );
}