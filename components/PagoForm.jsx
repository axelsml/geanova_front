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

import {
  useState,
  useContext,
  useEffect,
} from "react";

import {
  formatPrecio,
  formatDate,
} from "@/helpers/formatters";

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


/* ============================================================
   TIPOS DE PAGO

   1 = Solicitud
   2 = Anualidad
   3 = Escrituración
   ============================================================ */

const TIPOS_PAGO = {
  SOLICITUD: 1,
  ANUALIDAD: 2,
  ESCRITURACION: 3,
};


const NOMBRES_TIPO_PAGO = {
  1: "Pago de solicitud",
  2: "Pago de anualidad",
  3: "Pago de escrituración",
};


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

  const loadingContext =
    useContext(LoadingContext);


  if (!loadingContext) {
    throw new Error(
      "PagoForm debe estar dentro de LoadingProvider"
    );
  }


  const { setIsLoading } =
    loadingContext;


  const [form] =
    Form.useForm();


  const { Option } =
    Select;


  const { Text } =
    Typography;


  /* ==========================================================
     TIPO DE PAGO
     ========================================================== */

  const tipoPagoId =
    Number(
      tipo_pago_id_opcion ||
      TIPOS_PAGO.SOLICITUD
    );


  const nombreTipoPago =
    NOMBRES_TIPO_PAGO[
      tipoPagoId
    ] ||
    "Pago de solicitud";


  /* ==========================================================
     CATÁLOGOS
     ========================================================== */

  const [
    sistemasPago,
    setSistemasPago,
  ] = useState([]);


  const [
    cuentasBancarias,
    setCuentasBancarias,
  ] = useState([]);


  /* ==========================================================
     SISTEMA DE PAGO
     ========================================================== */

  const [
    sistemaSelected,
    setSistemaSelected,
  ] = useState(null);


  /* ==========================================================
     COMPROBANTE
     ========================================================== */

  const [
    comprobanteBanco,
    setComprobanteBanco,
  ] = useState(null);


  /* ==========================================================
     PAGO
     ========================================================== */

  const [
    valor,
    setValor,
  ] = useState(
    Number(monto_requerido || 0)
  );


  /* ==========================================================
     CONCILIACIÓN
     ========================================================== */

  const [
    fechaMovimiento,
    setFechaMovimiento,
  ] = useState("");


  const [
    movimientosPendientes,
    setMovimientosPendientes,
  ] = useState([]);


  const [
    movimientoIdConciliar,
    setMovimientoIdConciliar,
  ] = useState(0);


  /* ==========================================================
     PAGINACIÓN MOVIMIENTOS
     ========================================================== */

  const [
    page,
    setPage,
  ] = useState(0);


  const [
    rowsPerPage,
    setRowsPerPage,
  ] = useState(5);


  /* ==========================================================
     CONFIGURACIÓN SISTEMAS

     2 = Transferencia
     5 = Depósito bancario
     ========================================================== */

  const SISTEMAS_CON_CUENTA_BANCARIA =
    [2, 5];


  const SISTEMAS_CON_COMPROBANTE =
    [2, 5];


  /* ==========================================================
     CARGAR CATÁLOGOS
     ========================================================== */

  useEffect(() => {

    pagosService.getSistemasPago(
      function (data) {

        setSistemasPago(
          Array.isArray(data)
            ? data
            : []
        );

      },
      onError
    );


    pagosService.getBancosCuentasBancarias(
      function (data) {

        setCuentasBancarias(
          Array.isArray(data)
            ? data
            : []
        );

      },
      onError
    );

  }, []);


  /* ==========================================================
     SINCRONIZAR TIPO Y MONTO

     Esto es importante porque PagoForm puede abrirse para:

     solicitud
     anualidad
     escrituración
     ========================================================== */

  useEffect(() => {

    const montoInicial =
      Number(
        monto_requerido || 0
      );


    form.setFieldsValue({
      tipo_pago_id:
        tipoPagoId,

      monto_pagado:
        montoInicial,
    });


    setValor(
      montoInicial
    );

  }, [
    tipoPagoId,
    monto_requerido,
  ]);


  /* ==========================================================
     LABEL CUENTA BANCARIA
     ========================================================== */

  const getCuentaBancariaLabel = (
    cuenta
  ) => {

    if (!cuenta) {
      return "";
    }


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
      partes.push(
        banco
      );
    }


    if (numeroCuenta) {

      partes.push(
        numeroCuenta
      );

    } else if (clabe) {

      partes.push(
        clabe
      );

    }


    if (titular) {

      partes.push(
        titular
      );

    }


    if (partes.length === 0) {

      return (
        "Cuenta " +
        cuenta.id
      );

    }


    return partes.join(
      " - "
    );

  };


  /* ==========================================================
     DESCRIPCIÓN DEL CONCEPTO
     ========================================================== */

  const obtenerDescripcionTipoPago =
    function () {

      if (
        tipoPagoId ===
        TIPOS_PAGO.ESCRITURACION
      ) {

        return (
          "Este movimiento se aplicará exclusivamente " +
          "al saldo de escrituración."
        );

      }


      if (
        tipoPagoId ===
        TIPOS_PAGO.ANUALIDAD
      ) {

        return (
          "Este movimiento se aplicará exclusivamente " +
          "al saldo de anualidades."
        );

      }


      return (
        "Este movimiento se aplicará al saldo normal " +
        "de la solicitud."
      );

    };


  /* ==========================================================
     CAMBIO SISTEMA DE PAGO
     ========================================================== */

  const handleSistemaPagoChange =
    function (value) {

      const sistema =
        Number(value);


      setSistemaSelected(
        sistema
      );


      /* ======================================================
         CUENTA BANCARIA
         ====================================================== */

      if (
        !SISTEMAS_CON_CUENTA_BANCARIA.includes(
          sistema
        )
      ) {

        form.setFieldsValue({
          cuenta_bancaria_id:
            undefined,
        });

      }


      /* ======================================================
         COMPROBANTE
         ====================================================== */

      if (
        !SISTEMAS_CON_COMPROBANTE.includes(
          sistema
        )
      ) {

        setComprobanteBanco(
          null
        );

      }


      /* ======================================================
         DATOS EXCLUSIVOS DE TRANSFERENCIA
         ====================================================== */

      if (sistema !== 2) {

        setMovimientoIdConciliar(
          0
        );


        setMovimientosPendientes(
          []
        );


        setFechaMovimiento(
          ""
        );


        form.setFieldsValue({

          fechaTransferencia:
            undefined,

          referenciaTransferencia:
            undefined,

        });

      }


      /* ======================================================
         EFECTIVO
         ====================================================== */

      if (sistema !== 1) {

        form.setFieldsValue({
          usuario_recibio:
            undefined,
        });

      }


      /* ======================================================
         OTRO
         ====================================================== */

      if (sistema !== 8) {

        form.setFieldsValue({
          otro_pago:
            undefined,
        });

      }

    };


  /* ==========================================================
     PAGINACIÓN
     ========================================================== */

  const handleChangePage =
    function (
      event,
      newPage
    ) {

      setPage(
        newPage
      );

    };


  const handleChangeRowsPerPage =
    function (event) {

      setRowsPerPage(
        parseInt(
          event.target.value,
          10
        )
      );


      setPage(
        0
      );

    };


  /* ==========================================================
     VALIDAR PAGO DE ESCRITURACIÓN
     ========================================================== */

  const validarPagoEscrituracion =
    function (monto) {

      if (
        tipoPagoId !==
        TIPOS_PAGO.ESCRITURACION
      ) {

        return true;

      }


      /* ------------------------------------------------------
         Debe ser plan independiente
         ------------------------------------------------------ */

      if (!lote.tiempo_extra) {

        Swal.fire({

          title:
            "Escrituración no independiente",

          icon:
            "warning",

          text:
            "La escrituración de esta solicitud está incluida en los pagos normales.",

          confirmButtonText:
            "Aceptar",

        });


        return false;

      }


      /* ------------------------------------------------------
         Saldo
         ------------------------------------------------------ */

      const saldoEscrituracion =
        Number(
          lote.saldo_escrituracion ||
          0
        );


      if (
        saldoEscrituracion <= 0
      ) {

        Swal.fire({

          title:
            "Escrituración liquidada",

          icon:
            "info",

          text:
            "La escrituración ya no tiene saldo pendiente.",

          confirmButtonText:
            "Aceptar",

        });


        return false;

      }


      if (
        Number(monto) >
        saldoEscrituracion
      ) {

        Swal.fire({

          title:
            "Monto mayor al saldo",

          icon:
            "warning",

          text:
            "El saldo pendiente de escrituración es $" +
            formatPrecio(
              saldoEscrituracion
            ) +
            ".",

          confirmButtonText:
            "Aceptar",

        });


        return false;

      }


      return true;

    };


  /* ==========================================================
     GUARDAR PAGO
     ========================================================== */

  const onGuardarPago =
    function (values) {

      const montoPagado =
        Number(
          values.monto_pagado ||
          0
        );


      /* ======================================================
         VALIDAR MONTO
         ====================================================== */

      if (
        montoPagado <= 0
      ) {

        Swal.fire({

          title:
            "Monto inválido",

          icon:
            "warning",

          text:
            "El monto del pago debe ser mayor a cero.",

          confirmButtonText:
            "Aceptar",

        });


        return;

      }


      /* ======================================================
         VALIDAR ESCRITURACIÓN
         ====================================================== */

      if (
        !validarPagoEscrituracion(
          montoPagado
        )
      ) {

        return;

      }


      /* ======================================================
         VALIDAR COMPROBANTE

         2 = transferencia
         5 = depósito
         ====================================================== */

      if (
        SISTEMAS_CON_COMPROBANTE.includes(
          sistemaSelected
        ) &&
        !comprobanteBanco
      ) {

        Swal.fire({

          title:
            "Comprobante requerido",

          icon:
            "warning",

          text:
            sistemaSelected === 5
              ? "Debe adjuntar el comprobante del depósito bancario."
              : "Debe adjuntar el comprobante de la transferencia.",

          confirmButtonText:
            "Aceptar",

        });


        return;

      }


      /* ======================================================
         VALIDAR CUENTA BANCARIA
         ====================================================== */

      if (
        SISTEMAS_CON_CUENTA_BANCARIA.includes(
          sistemaSelected
        ) &&
        !values.cuenta_bancaria_id
      ) {

        Swal.fire({

          title:
            "Cuenta bancaria requerida",

          icon:
            "warning",

          text:
            "Debe seleccionar la cuenta bancaria donde se recibió el pago.",

          confirmButtonText:
            "Aceptar",

        });


        return;

      }


      /* ======================================================
         TIPO DE PAGO

         IMPORTANTE:

         No depende del sistema de pago.

         Efectivo + escrituración       = tipo 3
         Transferencia + escrituración = tipo 3
         Depósito + escrituración      = tipo 3
         ====================================================== */

      values.tipo_pago_id =
        tipoPagoId;


      /* ======================================================
         FECHA PAGO
         ====================================================== */

      values.fecha =
        formatDate(
          values.fecha
        );


      /* ======================================================
         FECHA TRANSFERENCIA
         ====================================================== */

      if (
        values.fechaTransferencia
      ) {

        values.fechaTransferencia =
          formatDate(
            values.fechaTransferencia
          );

      }


      /* ======================================================
         CONFIRMAR
         ====================================================== */

      Swal.fire({

        title:
          "Verifique que los datos sean correctos",

        icon:
          "info",

        html:
          `
            <div style="text-align:left">

              <b>Cliente:</b>
              ${cliente.nombre_completo || ""}

              <br/><br/>

              <b>Lote:</b>
              ${lote.lote || ""}

              <br/><br/>

              <b>Concepto:</b>
              ${nombreTipoPago}

              <br/><br/>

              <b>Monto:</b>
              $${formatPrecio(
                montoPagado
              )}

              <br/><br/>

              <b>Fecha:</b>
              ${values.fecha}

            </div>
          `,

        confirmButtonColor:
          "#4096ff",

        cancelButtonColor:
          "#ff4d4f",

        showDenyButton:
          true,

        showCancelButton:
          false,

        allowOutsideClick:
          false,

        confirmButtonText:
          "Guardar pago",

        denyButtonText:
          "Cancelar",

      }).then(
        function (result) {

          if (
            !result.isConfirmed
          ) {

            return;

          }


          /* ==================================================
             PARAMETROS
             ================================================== */

          const params = {
            ...values,

            tipo_pago_id:
              tipoPagoId,

            usuario_id:
              usuario_id,

            solicitud_id:
              lote.solicitud_id,

            conciliacion:
              movimientoIdConciliar,
          };


          /* ==================================================
             FORMDATA
             ================================================== */

          const formData =
            new FormData();


          Object.keys(
            params
          ).forEach(
            function (key) {

              const value =
                params[key];


              if (
                value !== undefined &&
                value !== null &&
                value !== ""
              ) {

                formData.append(
                  "pago[" +
                  key +
                  "]",
                  value
                );

              }

            }
          );


          /* ==================================================
             COMPROBANTE
             ================================================== */

          if (
            comprobanteBanco
          ) {

            formData.append(
              "pago[comprobante]",
              comprobanteBanco
            );

          }


          /* ==================================================
             GUARDAR
             ================================================== */

          setIsLoading(
            true
          );


          pagosService.createPago(
            formData,
            onPagoGuardado,
            onError
          );

        }
      );

    };


  /* ==========================================================
     CANCELAR
     ========================================================== */

  const handleCancel =
    function () {

      Swal.fire({

        title:
          "¿Desea cancelar el proceso?",

        icon:
          "info",

        text:
          "Se eliminarán los datos ingresados.",

        confirmButtonColor:
          "#4096ff",

        cancelButtonColor:
          "#ff4d4f",

        showDenyButton:
          true,

        showCancelButton:
          false,

        confirmButtonText:
          "Sí, cancelar",

        denyButtonText:
          "Continuar",

      }).then(
        function (result) {

          if (
            result.isConfirmed
          ) {

            setNuevoPago(
              false
            );

          }

        }
      );

    };


  /* ==========================================================
     PAGO GUARDADO
     ========================================================== */

  const onPagoGuardado =
    function (data) {

      setIsLoading(
        false
      );


      if (
        data &&
        data.success
      ) {

        setWatch(
          !watch
        );


        Swal.fire({

          title:
            "Pago guardado con éxito",

          icon:
            "success",

          html:
            `
              <div style="text-align:center">

                <b>Concepto:</b>
                ${nombreTipoPago}

                <br/><br/>

                El pago fue registrado correctamente.

              </div>
            `,

          confirmButtonColor:
            "#4096ff",

          showDenyButton:
            false,

          confirmButtonText:
            "Aceptar",

        });


        setNuevoPago(
          false
        );


        if (
          data.pago &&
          data.pago.id
        ) {

          window.open(
            "https://api.santamariadelaluz.com/iPagos/recibo/" +
              data.pago.id +
              ".pdf",
            "_blank"
          );

        }


        return;

      }


      Swal.fire({

        title:
          "Error",

        icon:
          "error",

        text:
          data &&
          data.message
            ? data.message
            : "No se pudo guardar el pago.",

        confirmButtonColor:
          "#4096ff",

        confirmButtonText:
          "Aceptar",

      });

    };


  /* ==========================================================
     ERROR
     ========================================================== */

  function onError(error) {

    setIsLoading(
      false
    );


    console.error(
      "PagoForm:",
      error
    );


    Swal.fire({

      title:
        "Error",

      icon:
        "error",

      text:
        "Ocurrió un error al realizar la operación.",

      confirmButtonText:
        "Aceptar",

    });

  }


  /* ==========================================================
     VALIDACIONES ANT DESIGN
     ========================================================== */

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


  /* ==========================================================
     BUSCAR MOVIMIENTO BANCARIO
     ========================================================== */

  function buscarMovimientosBanco() {

    if (
      !fechaMovimiento
    ) {

      Swal.fire({

        title:
          "Fecha requerida",

        icon:
          "warning",

        text:
          "Seleccione la fecha de transferencia antes de buscar.",

        confirmButtonText:
          "Aceptar",

      });


      return;

    }


    if (
      !valor ||
      Number(valor) <= 0
    ) {

      Swal.fire({

        title:
          "Monto requerido",

        icon:
          "warning",

        text:
          "Ingrese el monto del pago antes de buscar.",

        confirmButtonText:
          "Aceptar",

      });


      return;

    }


    setIsLoading(
      true
    );


    setMovimientosPendientes(
      []
    );


    setMovimientoIdConciliar(
      0
    );


    const params = {

      fecha_operacion:
        fechaMovimiento,

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


  /* ==========================================================
     MOVIMIENTOS ENCONTRADOS
     ========================================================== */

  function onMovimientosCoinciden(
    data
  ) {

    setIsLoading(
      false
    );


    const movimientos =
      data &&
      Array.isArray(
        data.pendientes
      )
        ? data.pendientes
        : [];


    if (
      movimientos.length === 0
    ) {

      setMovimientosPendientes(
        []
      );


      Swal.fire({

        title:
          "Sin coincidencias",

        icon:
          "warning",

        text:
          "No se encontró ningún movimiento bancario que coincida con la fecha y el monto.",

        confirmButtonColor:
          "#4096ff",

        confirmButtonText:
          "Aceptar",

      });


      return;

    }


    setMovimientosPendientes(
      movimientos
    );

  }


  /* ==========================================================
     RENDER
     ========================================================== */

  return (

    <div
      className="
        w-3/4
        mx-auto
        p-6
        m-7
        bg-white
        rounded-lg
        shadow-md
      "
    >

      {/* ======================================================
          TITULO
          ====================================================== */}

      <h1
        className="
          text-2xl
          font-semibold
          mb-4
          text-center
        "
      >
        Registrar Pago
      </h1>


      {/* ======================================================
          CONCEPTO
          ====================================================== */}

      <div
        style={{
          marginBottom:
            20,

          padding:
            "16px 18px",

          borderRadius:
            8,

          border:
            tipoPagoId ===
            TIPOS_PAGO.ESCRITURACION
              ? "1px solid #b7d9f5"
              : "1px solid #d9e7f5",

          background:
            "#f4f9fd",
        }}
      >

        <Text
          type="secondary"
          style={{
            display:
              "block",

            fontSize:
              11,

            fontWeight:
              600,

            letterSpacing:
              "0.08em",
          }}
        >
          CONCEPTO DEL PAGO
        </Text>


        <Text
          strong
          style={{
            display:
              "block",

            marginTop:
              4,

            fontSize:
              18,

            color:
              "#1d699b",
          }}
        >
          {nombreTipoPago}
        </Text>


        <Text
          type="secondary"
          style={{
            display:
              "block",

            marginTop:
              5,
          }}
        >
          {obtenerDescripcionTipoPago()}
        </Text>


        <Text
          strong
          style={{
            display:
              "block",

            marginTop:
              12,
          }}
        >

          Monto requerido: $

          {formatPrecio(
            Number(
              monto_requerido ||
              0
            )
          )}

        </Text>


        {tipoPagoId ===
          TIPOS_PAGO.ESCRITURACION && (

          <div
            style={{
              display:
                "flex",

              gap:
                24,

              flexWrap:
                "wrap",

              marginTop:
                12,

              paddingTop:
                12,

              borderTop:
                "1px solid #d9e7f5",
            }}
          >

            <Text>

              <b>
                Saldo escrituración:
              </b>
              {" $"}

              {formatPrecio(
                Number(
                  lote.saldo_escrituracion ||
                  0
                )
              )}

            </Text>


            <Text>

              <b>
                Próximo pago:
              </b>
              {" "}

              {proximoPago || "—"}

            </Text>

          </div>

        )}

      </div>


      {/* ======================================================
          PRÓXIMO PAGO
          ====================================================== */}

      <Row
        style={{
          marginBottom:
            16,
        }}
      >

        <Col>

          <Text
            type="secondary"
            style={{
              display:
                "block",
            }}
          >
            Próximo pago
          </Text>


          <Text
            strong
            style={{
              display:
                "block",

              marginTop:
                2,
            }}
          >
            {proximoPago || "—"}
          </Text>

        </Col>

      </Row>


      {/* ======================================================
          FORMULARIO
          ====================================================== */}

      <Form

        form={form}

        onFinish={
          onGuardarPago
        }

        name="pago"

        autoComplete="off"

        className="grid gap-1"

        layout="vertical"

        validateMessages={
          validacionMensajes
        }

        initialValues={{

          tipo_pago_id:
            tipoPagoId,

          monto_pagado:
            Number(
              monto_requerido ||
              0
            ),

          referenciaTransferencia:
            "",

        }}

      >


        {/* ====================================================
            TIPO DE PAGO OCULTO

            Aunque no se muestra como Select,
            Ant Design mantiene el valor.
            ==================================================== */}

        <Form.Item
          name="tipo_pago_id"
          hidden
        >

          <InputNumber />

        </Form.Item>


        <Col>


          {/* ==================================================
              MONTO
              ================================================== */}

          <Form.Item

            name="monto_pagado"

            label="Monto de Pago"

            style={{
              width:
                "100%",
            }}

            rules={[
              {
                required:
                  true,

                message:
                  "Monto de Pago es requerido",
              },
              {
                type:
                  "number",

                min:
                  1,
              },
            ]}

          >

            <InputNumber

              style={{
                width:
                  "100%",
              }}

              size="large"

              min={1}

              value={
                valor
              }

              onChange={
                function (value) {

                  setValor(
                    value
                  );

                }
              }

              placeholder=
                "Ingrese el Monto de Pago"

              formatter={
                formatPrecio
              }

              parser={
                function (value) {

                  if (
                    value ===
                      undefined ||
                    value ===
                      null
                  ) {

                    return "";

                  }


                  return String(
                    value
                  ).replace(
                    /\$\s?|(,*)/g,
                    ""
                  );

                }
              }

              prefix="$"

              suffix="MXN"

            />

          </Form.Item>


          {/* ==================================================
              FECHA PAGO
              ================================================== */}

          <Form.Item

            name="fecha"

            label="Fecha de Pago"

            style={{
              width:
                "100%",
            }}

            rules={[
              {
                required:
                  true,

                message:
                  "Fecha de Pago es requerida",
              },
            ]}

          >

            <DatePicker

              style={{
                width:
                  "100%",
              }}

              size="large"

              placeholder=
                "Ingrese la Fecha de Pago"

            />

          </Form.Item>


          {/* ==================================================
              SISTEMA DE PAGO
              ================================================== */}

          <Form.Item

            label="Sistema de Pago"

            name="sistema_pago_id"

            style={{
              width:
                "100%",
            }}

            rules={[
              {
                required:
                  true,

                message:
                  "Sistema de Pago no seleccionado",
              },
            ]}

          >

            <Select

              showSearch

              size="large"

              placeholder=
                "Seleccione un Sistema de Pago"

              optionLabelProp=
                "label"

              optionFilterProp=
                "label"

              onChange={
                handleSistemaPagoChange
              }

            >

              {sistemasPago.map(
                function (item) {

                  return (

                    <Option

                      key={
                        item.id
                      }

                      value={
                        item.id
                      }

                      label={
                        item.Nombre
                      }

                    >

                      {item.Nombre}

                    </Option>

                  );

                }
              )}

            </Select>

          </Form.Item>


          {/* ==================================================
              CUENTA BANCARIA
              ================================================== */}

          {SISTEMAS_CON_CUENTA_BANCARIA.includes(
            sistemaSelected
          ) && (

            <Form.Item

              name=
                "cuenta_bancaria_id"

              label=
                "Cuenta Bancaria"

              rules={[
                {
                  required:
                    true,

                  message:
                    "Seleccione la cuenta bancaria donde se recibió el pago",
                },
              ]}

            >

              <Select

                showSearch

                allowClear

                size="large"

                placeholder=
                  "Seleccione la Cuenta Bancaria"

                optionFilterProp=
                  "label"

                optionLabelProp=
                  "label"

              >

                {cuentasBancarias.map(
                  function (cuenta) {

                    const label =
                      getCuentaBancariaLabel(
                        cuenta
                      );


                    return (

                      <Option

                        key={
                          cuenta.id
                        }

                        value={
                          cuenta.id
                        }

                        label={
                          label
                        }

                      >

                        {label}

                      </Option>

                    );

                  }
                )}

              </Select>

            </Form.Item>

          )}


          {/* ==================================================
              EFECTIVO

              IMPORTANTE:
              Ya no se selecciona tipo de pago aquí.

              El tipo ya fue definido desde ClientesInfo.
              ================================================== */}

          {sistemaSelected === 1 && (

            <InputIn

              placeholder=
                "Ingrese Nombre de Quién Recibió"

              name=
                "usuario_recibio"

              label=
                "Recibió"

              rules={[
                {
                  required:
                    true,

                  message:
                    "Nombre de Quién Recibió es requerido",
                },
              ]}

            />

          )}


          {/* ==================================================
              TRANSFERENCIA / DEPÓSITO
              ================================================== */}

          {(sistemaSelected === 2 ||
            sistemaSelected === 5) && (

            <div>


              {/* ==============================================
                  FECHA TRANSFERENCIA
                  ============================================== */}

              <Form.Item

                name=
                  "fechaTransferencia"

                label={
                  sistemaSelected === 5
                    ? "Fecha de Depósito"
                    : "Fecha de Transferencia"
                }

                rules={[
                  {
                    required:
                      true,

                    message:
                      sistemaSelected === 5
                        ? "Fecha de Depósito requerida"
                        : "Fecha de Transferencia requerida",
                  },
                ]}

              >

                <DatePicker

                  size="large"

                  onChange={
                    function (value) {

                      if (value) {

                        setFechaMovimiento(
                          formatDate(
                            value
                          )
                        );

                      } else {

                        setFechaMovimiento(
                          ""
                        );

                      }


                      setMovimientoIdConciliar(
                        0
                      );


                      setMovimientosPendientes(
                        []
                      );

                    }
                  }

                  style={{
                    width:
                      "100%",
                  }}

                  placeholder={
                    sistemaSelected === 5
                      ? "Ingrese la Fecha del Depósito"
                      : "Ingrese la Fecha de Transferencia"
                  }

                />

              </Form.Item>


              {/* ==============================================
                  COMPROBANTE
                  ============================================== */}

              <Form.Item

                label=
                  "Comprobante de Pago"

                required

                extra=
                  "Formatos permitidos: JPG, JPEG o PNG. Máximo 5 MB."

              >

                <Upload

                  beforeUpload={
                    function (file) {

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


                      if (
                        !menor5MB
                      ) {

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

                    }
                  }

                  onRemove={
                    function () {

                      setComprobanteBanco(
                        null
                      );

                    }
                  }

                  maxCount={
                    1
                  }

                  accept=
                    ".jpg,.jpeg,.png"

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


              {/* ==============================================
                  REFERENCIA
                  ============================================== */}

              <Form.Item

                name=
                  "referenciaTransferencia"

                label={
                  sistemaSelected === 5
                    ? "Referencia de Depósito"
                    : "Referencia de Transferencia"
                }

              >

                <InputIn
                  placeholder={
                    sistemaSelected === 5
                      ? "Ingrese Referencia de Depósito"
                      : "Ingrese Referencia de Transferencia"
                  }
                />

              </Form.Item>


              {/* ==============================================
                  BUSCAR MOVIMIENTO

                  Solamente para transferencia.
                  ============================================== */}

              {sistemaSelected === 2 && (

                <Button

                  onClick={
                    buscarMovimientosBanco
                  }

                  style={{
                    marginBottom:
                      15,
                  }}

                >

                  Buscar Movimiento Bancario

                </Button>

              )}


              {/* ==============================================
                  MOVIMIENTO SELECCIONADO
                  ============================================== */}

              {sistemaSelected === 2 &&
                movimientoIdConciliar > 0 && (

                <div
                  style={{
                    marginBottom:
                      15,
                  }}
                >

                  <Text
                    type="success"
                    strong
                  >

                    Movimiento bancario seleccionado:{" "}

                    {movimientoIdConciliar}

                  </Text>

                </div>

              )}


              {/* ==============================================
                  RESULTADOS CONCILIACIÓN
                  ============================================== */}

              {sistemaSelected === 2 &&
                movimientosPendientes.length > 0 && (

                <Row
                  justify="center"
                  className="m-auto"
                >

                  <TableContainer
                    component={
                      Paper
                    }
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

                          <TableCell />

                        </TableRow>

                      </TableHead>


                      <TableBody>

                        {movimientosPendientes
                          .slice(
                            page *
                              rowsPerPage,

                            page *
                              rowsPerPage +
                              rowsPerPage
                          )
                          .map(
                            function (
                              movimiento
                            ) {

                              return (

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

                                      onClick={
                                        function () {

                                          setMovimientoIdConciliar(
                                            movimiento.id
                                          );


                                          setMovimientosPendientes(
                                            []
                                          );

                                        }
                                      }

                                    >

                                      Seleccionar

                                    </Button>

                                  </TableCell>

                                </TableRow>

                              );

                            }
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
                              movimientosPendientes.length
                            }

                            rowsPerPage={
                              rowsPerPage
                            }

                            page={
                              page
                            }

                            onPageChange={
                              handleChangePage
                            }

                            onRowsPerPageChange={
                              handleChangeRowsPerPage
                            }

                            labelRowsPerPage=
                              "Movimientos por Página"

                          />

                        </TableRow>

                      </TableFooter>

                    </Table>

                  </TableContainer>

                </Row>

              )}

            </div>

          )}


          {/* ==================================================
              OTRO
              ================================================== */}

          {sistemaSelected === 8 && (

            <InputIn

              placeholder=
                "Especifique el medio de pago"

              name=
                "otro_pago"

              label=
                "Otro"

              rules={[
                {
                  required:
                    true,

                  message:
                    "Especifique el medio de pago",
                },
              ]}

            />

          )}

        </Col>


        {/* ====================================================
            RESUMEN ANTES DEL BOTÓN
            ==================================================== */}

        <div
          style={{
            marginTop:
              10,

            marginBottom:
              20,

            padding:
              14,

            border:
              "1px solid #e2e8f0",

            borderRadius:
              8,

            background:
              "#f8fafc",
          }}
        >

          <Row
            justify=
              "space-between"
          >

            <Col>

              <Text
                type="secondary"
              >
                Concepto
              </Text>

              <br />

              <Text
                strong
              >
                {nombreTipoPago}
              </Text>

            </Col>


            <Col
              style={{
                textAlign:
                  "right",
              }}
            >

              <Text
                type="secondary"
              >
                Monto capturado
              </Text>

              <br />

              <Text
                strong
              >

                $

                {formatPrecio(
                  Number(
                    valor ||
                    0
                  )
                )}

              </Text>

            </Col>

          </Row>

        </div>


        {/* ====================================================
            BOTONES
            ==================================================== */}

        <span
          className="
            flex
            gap-2
            justify-end
          "
        >

          <Button

            htmlType=
              "submit"

            size=
              "large"

            className=
              "boton"

          >

            Guardar Pago

          </Button>


          <Button

            onClick={
              handleCancel
            }

            danger

            size=
              "large"

          >

            Cancelar

          </Button>

        </span>

      </Form>

    </div>

  );

}