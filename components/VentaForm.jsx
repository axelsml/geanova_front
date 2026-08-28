"use client";

import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Pagination,
  Radio,
  Select,
  Upload,
} from "antd";

import {
  UploadOutlined,
} from "@ant-design/icons";

import Swal from "sweetalert2";

import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  BiCalendar,
  BiCheck,
  BiFile,
  BiMoney,
  BiReceipt,
  BiSearch,
  BiUser,
} from "react-icons/bi";

import {
  TbBuildingEstate,
  TbMapPin,
  TbRulerMeasure,
} from "react-icons/tb";

import {
  calcularCantidad,
  formatDate,
  formatPrecio,
} from "@/helpers/formatters";

import {
  usuario_id,
} from "@/helpers/user";

import {
  LoadingContext,
} from "@/contexts/loading";

import terrenosService
  from "@/services/terrenosService";

import plazosService
  from "@/services/plazosService";

import lotesService
  from "@/services/lotesService";

import ventasService
  from "@/services/ventasService";

import pagosService
  from "@/services/pagosService";


/* =========================================================
   TIPOS DE ESCRITURACIÓN
   ========================================================= */

const TIPOS_ESCRITURACION = {
  SIN_ESCRITURACION: 0,
  PRECIO_FIJO: 1,
  POR_M2: 2,
};


const FINANCIAMIENTOS = [
  {
    id: 1,
    nombre: "Mensual",
  },
  {
    id: 2,
    nombre: "Quincenal",
  },
  {
    id: 3,
    nombre: "Semanal",
  },
];


export default function VentaForm() {

  /* =========================================================
     CONTEXTO
     ========================================================= */

  const loadingContext =
    useContext(LoadingContext);

  if (!loadingContext) {
    throw new Error(
      "VentaForm debe estar dentro de LoadingProvider"
    );
  }

  const {
    setIsLoading,
  } = loadingContext;


  /* =========================================================
     FORM
     ========================================================= */

  const [form] =
    Form.useForm();


  /* =========================================================
     CATÁLOGOS
     ========================================================= */

  const [
    terrenos,
    setTerrenos,
  ] = useState([]);

  const [
    plazos,
    setPlazos,
  ] = useState([]);

  const [
    lotes,
    setLotes,
  ] = useState([]);

  const [
    sistemasPago,
    setSistemasPago,
  ] = useState([]);

  const [
    clientesExistentes,
    setClientesExistentes,
  ] = useState([]);


  /* =========================================================
     SELECCIONES
     ========================================================= */

  const [
    terrenoSelected,
    setTerrenoSelected,
  ] = useState(null);

  const [
    plazoSelected,
    setPlazoSelected,
  ] = useState(null);

  const [
    loteSelected,
    setLoteSelected,
  ] = useState(null);

  const [
    financiamientoId,
    setFinanciamientoId,
  ] = useState(null);


  /* =========================================================
     CLIENTE
     ========================================================= */

  const [
    opcionUsuario,
    setOpcionUsuario,
  ] = useState(0);

  const [
    pasoCliente,
    setPasoCliente,
  ] = useState(1);

  const [
    dataForm,
    setDataForm,
  ] = useState({});


  /* =========================================================
     PAGINACIÓN
     ========================================================= */

  const [
    paginaLotes,
    setPaginaLotes,
  ] = useState(1);

  const [
    filasLotes,
    setFilasLotes,
  ] = useState(5);

  const [
    paginaClientes,
    setPaginaClientes,
  ] = useState(1);

  const [
    filasClientes,
    setFilasClientes,
  ] = useState(5);


  /* =========================================================
     ARCHIVOS
     ========================================================= */

  const [
    imagenBase64,
    setImagenBase64,
  ] = useState(null);

  const [
    imagenBase64R,
    setImagenBase64R,
  ] = useState(null);

  const [
    pdf,
    setPdf,
  ] = useState(null);


  /* =========================================================
     SOLICITUD
     ========================================================= */

  const [
    solicitud,
    setSolicitud,
  ] = useState({
    terreno_id: "",
    plazo_id: "",
    financiamiento_id: null,

    monto_contrato: "",
    anticipo: "",
    
    lote_pagado: false,

    lote_id: "",

    plazo_pagos: 0,

    fecha_solicitud: "",

    sistemas_pago_id: null,

    tipo_escrituracion:
      TIPOS_ESCRITURACION
        .SIN_ESCRITURACION,

    monto_escrituracion: 0,
     tiempo_extra: false,
      cantidad_pagos_escrituracion: 0,
      tipo_financiamiento_escrituracion: null,

      fecha_inicio_escrituracion: null,
  });


  /* =========================================================
     USUARIO
     ========================================================= */

  const [
    usuario,
    setUsuario,
  ] = useState({
    primer_nombre: "",
    segundo_nombre: "",

    primer_apellido: "",
    segundo_apellido: "",

    celular_cliente: null,
    celular_cliente_2: null,

    usuario_registro:
      usuario_id,

    calle: "",
    colonia: "",

    numero_ext: null,
    numero_int: null,

    cp: null,

    imagen: null,
  });


  /* =========================================================
     CARGA INICIAL
     ========================================================= */

  useEffect(() => {

    terrenosService.getTerrenos(
      (data) => {
        setTerrenos(
          Array.isArray(data)
            ? data
            : []
        );
      },
      onError
    );


    pagosService.getSistemasPago(
      (data) => {
        setSistemasPago(
          Array.isArray(data)
            ? data
            : []
        );
      },
      onError
    );

  }, []);


  /* =========================================================
     TERRENO
     ========================================================= */

  const onBuscarPlazos =
    (terrenoId) => {

      const terreno =
        terrenos.find(
          (item) =>
            Number(item.id) ===
            Number(terrenoId)
        );


      setTerrenoSelected(
        terreno || null
      );


      setPlazoSelected(null);
      setLoteSelected(null);

      setPlazos([]);
      setLotes([]);

      setPaginaLotes(1);


      setSolicitud(
        (prev) => ({
          ...prev,

          terreno_id:
            terrenoId,

          plazo_id:
            "",

          lote_id:
            "",

          monto_contrato:
            "",

          tipo_escrituracion:
            TIPOS_ESCRITURACION
              .SIN_ESCRITURACION,

          monto_escrituracion:
            0,
        })
      );


      form.setFieldsValue({
        plazo_id:
          undefined,

        montoContrato:
          undefined,

        cantidad_pagos:
          undefined,

        tipo_escrituracion:
          TIPOS_ESCRITURACION
            .SIN_ESCRITURACION,
      });


      plazosService.getPlazos(
        {
          terreno_id:
            terrenoId,
        },

        (data) => {
          setPlazos(
            Array.isArray(data)
              ? data
              : []
          );
        },

        onError
      );
    };


  /* =========================================================
     PLAZO
     ========================================================= */

  const onPlazoChange =
    (plazoId) => {

      const plazo =
        plazos.find(
          (item) =>
            Number(item.id) ===
            Number(plazoId)
        );


      setPlazoSelected(
        plazo || null
      );


      setLoteSelected(null);
      setLotes([]);

      setPaginaLotes(1);


      let cantidadPagos = 0;


      if (
        financiamientoId &&
        plazo
      ) {
        cantidadPagos =
          calcularCantidad(
            financiamientoId,
            plazo.cantidad_meses
          );
      }


      form.setFieldsValue({
        cantidad_pagos:
          cantidadPagos,

        montoContrato:
          undefined,
      });


      setSolicitud(
        (prev) => ({
          ...prev,

          plazo_id:
            plazoId,

          lote_id:
            "",

          monto_contrato:
            "",

          plazo_pagos:
            cantidadPagos,

          monto_escrituracion:
            prev.tipo_escrituracion ===
            TIPOS_ESCRITURACION
              .PRECIO_FIJO
              ? Number(
                  terrenoSelected
                    ?.escrituracion_fija ||
                    0
                )
              : 0,
        })
      );


      onBuscarLotes(
        plazoId
      );
    };


  /* =========================================================
     FINANCIAMIENTO
     ========================================================= */

  const onFinanciamientoChange =
    (value) => {

      setFinanciamientoId(
        value
      );


      let cantidadPagos = 0;


      if (plazoSelected) {
        cantidadPagos =
          calcularCantidad(
            value,
            plazoSelected
              .cantidad_meses
          );
      }


      form.setFieldValue(
        "cantidad_pagos",
        cantidadPagos
      );


      setSolicitud(
        (prev) => ({
          ...prev,

          financiamiento_id:
            value,

          plazo_pagos:
            cantidadPagos,
        })
      );
    };


  /* =========================================================
     BUSCAR LOTES
     ========================================================= */

  function onBuscarLotes(
    plazoId
  ) {

    if (!terrenoSelected) {
      return;
    }


    setIsLoading(true);


    lotesService
      .getLoteByTerrenoIdPlazo(
        terrenoSelected.id,

        plazoId,

        (data) => {

          setIsLoading(false);


          setLotes(
            Array.isArray(
              data?.lotes
            )
              ? data.lotes
              : []
          );
        },

        onError
      );
  }


  /* =========================================================
     SELECCIONAR LOTE
     ========================================================= */

  const seleccionarLote =
    (lote) => {

      setLoteSelected(
        lote
      );


      let cantidadPagos =
        solicitud.plazo_pagos ||
        0;


      if (
        financiamientoId &&
        plazoSelected
      ) {

        cantidadPagos =
          calcularCantidad(
            financiamientoId,
            plazoSelected
              .cantidad_meses
          );
      }


      const montoEscrituracion =
        calcularMontoEscrituracion(
          solicitud
            .tipo_escrituracion,

          lote,

          terrenoSelected
        );


      form.setFieldsValue({
        montoContrato:
          Number(
            lote.costo || 0
          ),

        cantidad_pagos:
          cantidadPagos,
      });


      const esContado =
        Number(
          plazoSelected
            ?.cantidad_meses
        ) === 0;


      if (esContado) {

        form.setFieldValue(
          "anticipo",
          Number(
            lote.costo || 0
          )
        );
      }


      setSolicitud(
        (prev) => ({
          ...prev,

          lote_id:
            lote.id,

          monto_contrato:
            Number(
              lote.costo || 0
            ),

          plazo_pagos:
            cantidadPagos,

          anticipo:
            esContado
              ? Number(
                  lote.costo || 0
                )
              : prev.anticipo,

          monto_escrituracion:
            montoEscrituracion,
        })
      );
    };


  /* =========================================================
     ESCRITURACIÓN
     ========================================================= */

  const handleTipoEscrituracion =
    (event) => {

      const tipo =
        Number(
          event.target.value
        );


      const monto =
        calcularMontoEscrituracion(
          tipo,
          loteSelected,
          terrenoSelected
        );


      setSolicitud(
        (prev) => ({
          ...prev,

          tipo_escrituracion:
            tipo,

          monto_escrituracion:
            monto,
        })
      );
    };


  /* =========================================================
     CLIENTE - VALIDAR OPERACIÓN
     ========================================================= */

  const validarOperacion =
    async () => {

      try {

        await form.validateFields([
          "terreno",
          "plazo_id",
          "sistema_pago_id",
          "fechaInicioContrato",
        ]);


        if (
          !solicitud.lote_id ||
          !solicitud.monto_contrato
        ) {

          await Swal.fire({
            title:
              "Selecciona un lote",

            text:
              "Debes seleccionar el lote de la venta antes de continuar.",

            icon:
              "info",

            confirmButtonText:
              "Aceptar",
          });


          return false;
        }


        return true;

      } catch (error) {

        return false;
      }
    };


  /* =========================================================
     NUEVO CLIENTE
     ========================================================= */

  const iniciarNuevoCliente =
    async () => {

      const valido =
        await validarOperacion();


      if (!valido) {
        return;
      }


      setOpcionUsuario(1);
      setPasoCliente(1);
    };


  /* =========================================================
     CLIENTE EXISTENTE
     ========================================================= */

  const iniciarClienteExistente =
    async () => {

      const valido =
        await validarOperacion();


      if (!valido) {
        return;
      }


      setOpcionUsuario(2);

      BuscarClientesExistentes();
    };


  function BuscarClientesExistentes() {

    setIsLoading(true);


    ventasService
      .clientesExistentes(
        (data) => {

          setIsLoading(false);


          setClientesExistentes(
            Array.isArray(
              data?.usuarios
            )
              ? data.usuarios
              : []
          );


          setPaginaClientes(1);
        },

        onError
      );
  }


  /* =========================================================
     SIGUIENTE PASO CLIENTE
     ========================================================= */

  const siguientePasoCliente =
    async (paso) => {

      try {

        const values =
          await form.validateFields();


        setDataForm(
          (prev) => ({
            ...prev,
            ...values,
          })
        );


        setPasoCliente(
          paso
        );

      } catch (error) {

        console.log(
          "Formulario incompleto",
          error
        );
      }
    };


  /* =========================================================
     GUARDAR CLIENTE
     ========================================================= */

  async function guardarCliente() {

    try {

      const values =
        await form.validateFields();


      const formularioCompleto = {
        ...dataForm,
        ...values,
      };


      const resultado =
        await Swal.fire({
          title:
            "Guardar nueva venta",

          text:
            "Verifique que los datos de la venta y del cliente sean correctos.",

          icon:
            "question",

          showDenyButton:
            true,

          showCancelButton:
            false,

          allowOutsideClick:
            false,

          confirmButtonText:
            "Guardar venta",

          denyButtonText:
            "Cancelar",

          buttonsStyling:
            false,

          customClass: {
            popup:
              "swal-geanova",

            confirmButton:
              "swal-geanova-confirm",

            denyButton:
              "swal-geanova-cancel",
          },
        });


      if (
        !resultado.isConfirmed
      ) {
        return;
      }


      setIsLoading(true);


      ventasService.createVenta(
        {
          ...formularioCompleto,

          usuarioId:
            usuario_id,

          ...usuario,
        },

        onVentaGuardada,

        onError
      );

    } catch (error) {

      console.log(
        "Formulario incompleto:",
        error
      );
    }
  }


  /* =========================================================
     VENTA GUARDADA
     ========================================================= */

  const onVentaGuardada =
    (data) => {

      setIsLoading(false);


      if (!data?.success) {

        mostrarError(
          data?.message ||
          "No fue posible guardar el cliente."
        );

        return;
      }


      guardarImagenes(
        data.cliente.id
      );
    };


  /* =========================================================
     IMÁGENES
     ========================================================= */

  function guardarImagenes(
    clienteId
  ) {

    const params = {
      cliente_id:
        clienteId,

      img_doc:
        imagenBase64,

      img_docR:
        imagenBase64R,

      pdf:
        pdf,
    };


    setIsLoading(true);


    ventasService
      .createImagenesUsuario(
        params,
        onImagenGuardada,
        onError
      );
  }


  const onImagenGuardada =
    (data) => {

      setIsLoading(false);


      if (!data?.success) {

        mostrarError(
          data?.message ||
          "No fue posible guardar los documentos."
        );

        return;
      }


      guardarSolicitud(
        data.cliente_id
      );
    };


  /* =========================================================
     SOLICITUD
     ========================================================= */

  async function guardarSolicitud(
    clienteId
  ) {

    setIsLoading(true);


    ventasService.createSolicitud(
      {
        solicitud:
          solicitud,

        cliente_id:
          clienteId,
      },

      onSolicitudGuardada,

      onError
    );
  }


  const onSolicitudGuardada =
    (data) => {

      setIsLoading(false);


      if (!data?.success) {

        mostrarError(
          data?.message ||
          "No fue posible guardar la solicitud."
        );

        return;
      }


      Swal.fire({
        title:
          "Venta guardada",

        text:
          "La venta fue registrada correctamente.",

        icon:
          "success",

        confirmButtonText:
          "Aceptar",

        buttonsStyling:
          false,

        customClass: {
          popup:
            "swal-geanova",

          confirmButton:
            "swal-geanova-confirm",
        },
      }).then(
        (result) => {

          if (
            result.isConfirmed
          ) {
            window.location.reload();
          }
        }
      );
    };


  /* =========================================================
     CLIENTE EXISTENTE
     ========================================================= */

  const seleccionarClienteExistente =
    async (clienteId) => {

      const valido =
        await validarOperacion();


      if (!valido) {
        return;
      }


      guardarSolicitud(
        clienteId
      );
    };


  /* =========================================================
     UPLOAD
     ========================================================= */

  const procesarImagen =
    (
      info,
      setter
    ) => {

      const archivo =
        info.file
          ?.originFileObj ||
        info.file;


      if (!archivo) {
        return;
      }


      const reader =
        new FileReader();


      reader.onload =
        (event) => {

          setter(
            event.target.result
          );
        };


      reader.readAsDataURL(
        archivo
      );


      const fecha =
        archivo.lastModified
          ? new Date(
              archivo.lastModified
            ).toLocaleString(
              "es-MX"
            )
          : null;


      setUsuario(
        (prev) => ({
          ...prev,

          imagen: {
            nombre:
              archivo.name,

            type:
              archivo.type,

            size:
              archivo.size,

            updated:
              fecha,

            originFileObj:
              archivo,
          },
        })
      );
    };


  const procesarPdf =
    (info) => {

      const archivo =
        info.file
          ?.originFileObj ||
        info.file;


      if (!archivo) {
        return;
      }


      const reader =
        new FileReader();


      reader.onload =
        (event) => {

          setPdf(
            event.target.result
          );
        };


      reader.readAsDataURL(
        archivo
      );
    };


  const uploadBaseProps = {
    beforeUpload: () => false,
    maxCount: 1,
  };


  /* =========================================================
     ERROR
     ========================================================= */

  function onError(error) {

    setIsLoading(false);


    console.error(
      "Error VentaForm:",
      error
    );


    mostrarError(
      "Ocurrió un error procesando la solicitud."
    );
  }


  /* =========================================================
     PAGINACIÓN LOTES
     ========================================================= */

  const inicioLotes =
    (paginaLotes - 1) *
    filasLotes;


  const lotesVisibles =
    lotes.slice(
      inicioLotes,
      inicioLotes +
        filasLotes
    );


  /* =========================================================
     PAGINACIÓN CLIENTES
     ========================================================= */

  const inicioClientes =
    (paginaClientes - 1) *
    filasClientes;


  const clientesVisibles =
    clientesExistentes.slice(
      inicioClientes,
      inicioClientes +
        filasClientes
    );


  /* =========================================================
     RENDER
     ========================================================= */

  return (

    <div className="page">

      <div className="page-container">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <header className="page-header">

          <div className="page-header__content">

            <div className="page-header__eyebrow">
              <BiReceipt />
              VENTAS
            </div>


            <h1 className="page-title">
              Nueva venta
            </h1>


            <p className="page-description">
              Configura el proyecto,
              lote, condiciones comerciales
              y datos del cliente.
            </p>

          </div>

        </header>


        <Form
          form={form}

          name="nueva-venta"

          layout="vertical"

          autoComplete="off"

          className="geanova-form"

          initialValues={{
            tipo_escrituracion:
              TIPOS_ESCRITURACION
                .SIN_ESCRITURACION,
          }}
        >

          {/* =================================================
              OPERACIÓN
          ================================================== */}

          <section className="form-section">

            <div className="form-section__header">

              <div className="form-section__icon">
                <BiReceipt />
              </div>


              <div>

                <h2 className="form-section__title">
                  Datos de la operación
                </h2>


                <p className="form-section__description">
                  Selecciona el proyecto,
                  plazo y condiciones de pago.
                </p>

              </div>

            </div>


            <div className="form-section__body">

              <div className="form-grid form-grid--3">

                <Form.Item
                  name="terreno"

                  label="Proyecto"

                  rules={[
                    {
                      required:
                        true,

                      message:
                        "Proyecto no seleccionado",
                    },
                  ]}
                >
                  <Select
                    showSearch

                    size="large"

                    optionFilterProp="label"

                    placeholder="Seleccione un proyecto"

                    options={
                      terrenos.map(
                        (item) => ({
                          value:
                            item.id,

                          label:
                            item.nombre,
                        })
                      )
                    }

                    onChange={
                      onBuscarPlazos
                    }
                  />
                </Form.Item>


                <Form.Item
                  name="plazo_id"

                  label="Plazo"

                  rules={[
                    {
                      required:
                        true,

                      message:
                        "Plazo no seleccionado",
                    },
                  ]}
                >
                  <Select
                    showSearch

                    size="large"

                    optionFilterProp="label"

                    disabled={
                      !terrenoSelected
                    }

                    placeholder="Seleccione un plazo"

                    options={
                      plazos.map(
                        (item) => ({
                          value:
                            item.id,

                          label:
                            item.descripcion,
                        })
                      )
                    }

                    onChange={
                      onPlazoChange
                    }
                  />
                </Form.Item>


                <Form.Item
                  name="financiamiento"

                  label="Financiamiento"
                >
                  <Select
                    size="large"

                    placeholder="Seleccione financiamiento"

                    options={
                      FINANCIAMIENTOS.map(
                        (item) => ({
                          value:
                            item.id,

                          label:
                            item.nombre,
                        })
                      )
                    }

                    onChange={
                      onFinanciamientoChange
                    }
                  />
                </Form.Item>


                <Form.Item
                name="anticipo"
                label="Anticipo"
                className="sale-money-field"
              >
                <InputNumber
                  size="large"
                  controls={false}

                  style={{
                    width: "100%",
                  }}

                  formatter={formatPrecio}
                  parser={parseMoney}

                  prefix="$"
                  suffix="MXN"

                  placeholder="0.00"

                  disabled={
                    solicitud.lote_pagado
                  }

                  onChange={(value) => {

                    if (solicitud.lote_pagado) {
                      return;
                    }

                    setSolicitud((prev) => ({
                      ...prev,
                      anticipo: value,
                    }));
                  }}
                />
              </Form.Item>


                <Form.Item
                  name="sistema_pago_id"

                  label="Sistema de pago"

                  rules={[
                    {
                      required:
                        true,

                      message:
                        "Sistema de pago no seleccionado",
                    },
                  ]}
                >
                  <Select
                    showSearch

                    size="large"

                    optionFilterProp="label"

                    placeholder="Seleccione un sistema"

                    options={
                      sistemasPago.map(
                        (item) => ({
                          value:
                            item.id,

                          label:
                            item.Nombre,
                        })
                      )
                    }

                    onChange={
                      (value) => {

                        setSolicitud(
                          (prev) => ({
                            ...prev,

                            sistemas_pago_id:
                              value,
                          })
                        );
                      }
                    }
                  />
                </Form.Item>


                <Form.Item
                  name="fechaInicioContrato"

                  label="Fecha de inicio"

                  rules={[
                    {
                      required:
                        true,

                      message:
                        "Fecha de inicio requerida",
                    },
                  ]}
                >
                  <DatePicker
                    size="large"

                    placeholder="Seleccione una fecha"

                    onChange={
                      (value) => {

                        setSolicitud(
                          (prev) => ({
                            ...prev,

                            fecha_solicitud:
                              formatDate(
                                value
                              ),
                          })
                        );
                      }
                    }
                  />
                </Form.Item>

              </div>

            </div>

          </section>


          {/* =================================================
              LOTES
          ================================================== */}

          <section className="card sale-section">

            <div className="card__header">

              <div>

                <h2 className="card__title">
                  Selecciona un lote
                </h2>


                <p className="card__description">
                  Consulta los lotes
                  disponibles para el plazo
                  seleccionado.
                </p>

              </div>


              <span className="badge badge-primary">
                {lotes.length} disponibles
              </span>

            </div>


            {lotes.length > 0 ? (

              <>

                <div className="table-container">

                  <table className="table">

                    <thead>

                      <tr>

                        <th>
                          Lote
                        </th>

                        <th>
                          Superficie
                        </th>

                        <th>
                          Precio
                        </th>

                        <th />

                      </tr>

                    </thead>


                    <tbody>

                      {lotesVisibles.map(
                        (lote) => {

                          const seleccionado =
                            loteSelected?.id ===
                            lote.id;


                          return (

                            <tr
                              key={
                                lote.id
                              }

                              className={
                                seleccionado
                                  ? "table-row-selected"
                                  : ""
                              }
                            >

                              <td>

                                <strong>
                                  Lote{" "}
                                  {
                                    lote.numero
                                  }
                                </strong>

                              </td>


                              <td>

                                {formatNumber(
                                  lote.superficie
                                )}{" "}
                                m²

                              </td>


                              <td>

                                <strong>
                                  {formatCurrency(
                                    lote.costo
                                  )}
                                </strong>

                              </td>


                              <td className="table-actions">

                                <button
                                  type="button"

                                  className={
                                    seleccionado
                                      ? "btn btn-secondary"
                                      : "btn btn-primary"
                                  }

                                  onClick={
                                    () =>
                                      seleccionarLote(
                                        lote
                                      )
                                  }
                                >

                                  {seleccionado && (
                                    <BiCheck />
                                  )}

                                  {seleccionado
                                    ? "Seleccionado"
                                    : "Seleccionar"}

                                </button>

                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>


                {lotes.length >
                  filasLotes && (

                  <div className="sale-pagination">

                    <Pagination
                      current={
                        paginaLotes
                      }

                      pageSize={
                        filasLotes
                      }

                      total={
                        lotes.length
                      }

                      showSizeChanger

                      pageSizeOptions={[
                        5,
                        10,
                        25,
                      ]}

                      onChange={
                        (
                          page,
                          pageSize
                        ) => {

                          setPaginaLotes(
                            page
                          );

                          setFilasLotes(
                            pageSize
                          );
                        }
                      }
                    />

                  </div>
                )}

              </>

            ) : (

              <div className="empty-state">

                <TbMapPin
                  size={32}
                />


                <strong>
                  Sin lotes disponibles
                </strong>


                <span>
                  Selecciona un proyecto
                  y un plazo para consultar
                  lotes.
                </span>

              </div>
            )}

          </section>


          {/* =================================================
              RESUMEN
          ================================================== */}

          {loteSelected && (

            <>

              <section className="sale-summary">

                <ResumenItem
                  icon={
                    TbBuildingEstate
                  }

                  label="Lote"

                  value={
                    `Lote ${loteSelected.numero}`
                  }
                />


                <ResumenItem
                  icon={
                    TbRulerMeasure
                  }

                  label="Superficie"

                  value={
                    `${formatNumber(
                      loteSelected.superficie
                    )} m²`
                  }
                />


                <ResumenItem
                  icon={
                    BiMoney
                  }

                  label="Monto contrato"

                  value={
                    formatCurrency(
                      solicitud
                        .monto_contrato
                    )
                  }
                />


                <ResumenItem
                  icon={
                    BiCalendar
                  }

                  label="Cantidad de pagos"

                  value={
                    solicitud
                      .plazo_pagos ||
                    "—"
                  }
                />

              </section>


              <section className="form-section">

                <div className="form-section__header">

                  <div className="form-section__icon">
                    <BiMoney />
                  </div>


                  <div>

                    <h2 className="form-section__title">
                      Condiciones económicas
                    </h2>


                    <p className="form-section__description">
                      Puedes ajustar el
                      monto contratado antes
                      de guardar la venta.
                    </p>

                  </div>

                </div>


                <div className="form-section__body">

                  <div className="form-grid form-grid--3">

                    <Form.Item
  name="montoContrato"
  label="Monto contrato"
  className="sale-money-field"
>
  <InputNumber
    size="large"
    controls={false}

    style={{
      width: "100%",
    }}

    formatter={formatPrecio}
    parser={parseMoney}

    prefix="$"
    suffix="MXN"

    onChange={(value) => {

      setSolicitud((prev) => ({
        ...prev,
        monto_contrato: value,
      }));

    }}
  />
</Form.Item>


                    <Form.Item
                      name="cantidad_pagos"

                      label="Cantidad de pagos"
                    >
                      <InputNumber
                        disabled

                        size="large"

                        controls={false}

                        suffix={
                          obtenerUnidadPagos(
                            financiamientoId
                          )
                        }
                      />
                    </Form.Item>


                    {Number(
                      plazoSelected
                        ?.monto_anualidad
                    ) > 0 && (

                      <div className="sale-annual-payment">

                        <span>
                          Monto anualidad
                        </span>

                        <strong>
                          {formatCurrency(
                            plazoSelected
                              .monto_anualidad
                          )}
                        </strong>

                      </div>
                    )}
                  <Form.Item
                      name="lote_pagado"
                      label="Estado actual del lote"
                      initialValue={false}
                    >
                      <Radio.Group
                        className="sale-payment-status-options"
                        onChange={(event) => {

                          const lotePagado =
                            event.target.value === true;


                          setSolicitud(
                            (prev) => ({
                              ...prev,

                              lote_pagado:
                                lotePagado,

                              /*
                              * El anticipo deja de intervenir
                              * en la cobranza si el lote
                              * ya estaba liquidado.
                              */
                              anticipo:
                                lotePagado
                                  ? 0
                                  : prev.anticipo,
                            })
                          );


                          if (lotePagado) {

                            form.setFieldsValue({
                              anticipo: 0,
                            });

                          }

                        }}
                      >

                        <Radio.Button value={false}>
                          Venta normal
                        </Radio.Button>


                        <Radio.Button value={true}>
                          Lote ya pagado
                        </Radio.Button>

                      </Radio.Group>

                    </Form.Item>
                    
                  </div>
                  {solicitud.lote_pagado && (
                    <div className="sale-paid-lot-notice">

                      <div className="sale-paid-lot-notice__title">
                        Lote liquidado previamente
                      </div>
                      <p>
                        Se conservará el monto original del contrato
                        y la información comercial del lote, pero no
                        se generará saldo pendiente por el terreno.
                        Únicamente se cobrará la escrituración,
                        cuando corresponda.
                      </p>

                    </div>

                  )}
                        
                </div>

              </section>


              {/* =============================================
                  ESCRITURACIÓN
              ============================================== */}

              <section className="form-section">

                <div className="form-section__header">

                  <div className="form-section__icon">
                    <BiFile />
                  </div>


                  <div>

                    <h2 className="form-section__title">
                      Escrituración
                    </h2>


                    <p className="form-section__description">
                      Define el tipo de
                      escrituración correspondiente
                      a esta venta.
                    </p>

                  </div>

                </div>


                <div className="form-section__body">

                  <Form.Item
                    name="tipo_escrituracion"

                    label="Tipo de escrituración"
                  >

                    <Radio.Group
                      className="sale-writing-options"

                      onChange={
                        handleTipoEscrituracion
                      }
                    >

                      <Radio.Button
                        value={
                          TIPOS_ESCRITURACION
                            .SIN_ESCRITURACION
                        }
                      >
                        Sin escrituración
                      </Radio.Button>


                      <Radio.Button
                        value={
                          TIPOS_ESCRITURACION
                            .PRECIO_FIJO
                        }

                        disabled={
                          !Number(
                            terrenoSelected
                              ?.escrituracion_fija
                          )
                        }
                      >
                        Precio fijo
                      </Radio.Button>


                      <Radio.Button
                        value={
                          TIPOS_ESCRITURACION
                            .POR_M2
                        }

                        disabled={
                          !Number(
                            terrenoSelected
                              ?.escrituracion_m2
                          )
                        }
                      >
                        Por m²
                      </Radio.Button>

                    </Radio.Group>

                  </Form.Item>


                  {solicitud
                    .tipo_escrituracion !==
                    TIPOS_ESCRITURACION
                      .SIN_ESCRITURACION && (

                    <div className="sale-writing-summary">

                      <div>

                        <span>
                          Método
                        </span>


                        <strong>

                          {solicitud
                            .tipo_escrituracion ===
                          TIPOS_ESCRITURACION
                            .PRECIO_FIJO
                            ? "Precio fijo"
                            : "Precio por m²"}

                        </strong>

                      </div>


                      <div>

                        <span>
                          Cálculo
                        </span>


                        <strong>

                          {solicitud
                            .tipo_escrituracion ===
                          TIPOS_ESCRITURACION
                            .PRECIO_FIJO

                            ? formatCurrency(
                                terrenoSelected
                                  ?.escrituracion_fija
                              )

                            : `${formatNumber(
                                loteSelected
                                  ?.superficie
                              )} m² × ${formatCurrency(
                                terrenoSelected
                                  ?.escrituracion_m2
                              )}`}
                        </strong>

                      </div>
                              

                      <div className="sale-writing-summary__total">

                        <span>
                          Monto de escrituración
                        </span>


                        <strong>
                          {formatCurrency(
                            solicitud
                              .monto_escrituracion
                          )}
                        </strong>

                      </div>

                    </div>
                  )}
                    {solicitud.tipo_escrituracion !== 0 && (
                    <>
                      <Form.Item
                        label="Forma de cobro de escrituración"
                        name="tiempo_extra"
                        initialValue={false}
                      >
                        <Radio.Group
                          className="sale-writing-options"
                          onChange={(event) => {
                            const tiempoExtra =
                              event.target.value === true;

                            setSolicitud((prev) => ({
                              ...prev,
                              tiempo_extra: tiempoExtra,

                              cantidad_pagos_escrituracion:
                                tiempoExtra
                                  ? prev.cantidad_pagos_escrituracion
                                  : 0,

                              tipo_financiamiento_escrituracion:
                                tiempoExtra
                                  ? prev.tipo_financiamiento_escrituracion
                                  : null,

                              fecha_inicio_escrituracion:
                                tiempoExtra
                                  ? prev.fecha_inicio_escrituracion
                                  : null,
                            }));
                          }}
                        >
                          <Radio.Button value={false}>
                            Incluir en la solicitud
                          </Radio.Button>

                          <Radio.Button value={true}>
                            Plan independiente
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>

                      {solicitud.tiempo_extra && (
                        <div className="form-grid form-grid--3">
                          <Form.Item
                            label="Cantidad de pagos"
                            name="cantidad_pagos_escrituracion"
                            rules={[
                              {
                                required: true,
                                message: "Indique la cantidad de pagos",
                              },
                            ]}
                          >
                            <InputNumber
                              size="large"
                              min={1}
                              controls={false}
                              placeholder="Ej. 12"
                              onChange={(value) => {
                                setSolicitud((prev) => ({
                                  ...prev,
                                  cantidad_pagos_escrituracion:
                                    Number(value || 0),
                                }));
                              }}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Frecuencia"
                            name="tipo_financiamiento_escrituracion"
                            rules={[
                              {
                                required: true,
                                message: "Seleccione la frecuencia",
                              },
                            ]}
                          >
                            <Select
                              size="large"
                              placeholder="Frecuencia"
                              options={[
                                {
                                  value: 1,
                                  label: "Mensual",
                                },
                                {
                                  value: 2,
                                  label: "Quincenal",
                                },
                                {
                                  value: 3,
                                  label: "Semanal",
                                },
                              ]}
                              onChange={(value) => {
                                setSolicitud((prev) => ({
                                  ...prev,
                                  tipo_financiamiento_escrituracion:
                                    value,
                                }));
                              }}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Primer cobro"
                            name="fecha_inicio_escrituracion"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Seleccione la fecha del primer cobro",
                              },
                            ]}
                          >
                            <DatePicker
                              size="large"
                              format="DD/MM/YYYY"
                              onChange={(value) => {
                                setSolicitud((prev) => ({
                                  ...prev,

                                  fecha_inicio_escrituracion:
                                    value
                                      ? value.format("YYYY-MM-DD")
                                      : null,
                                }));
                              }}
                            />
                          </Form.Item>
                        </div>
                      )}
                    </>
                  )}
                  <div className="sale-writing-summary">
                  <div>
                    <span>Escrituración</span>
                    <strong>
                      {formatCurrency(
                        solicitud.monto_escrituracion
                      )}
                    </strong>
                  </div>

                 {!solicitud.tiempo_extra ? (

                  <div className="sale-writing-summary__total">

                    <span>
                      {solicitud.lote_pagado
                        ? "Saldo por cobrar"
                        : "Total operación"}
                    </span>


                    <strong>

                      {formatCurrency(

                        solicitud.lote_pagado

                          ? Number(
                              solicitud.monto_escrituracion ||
                              0
                            )

                          : (
                              Number(
                                solicitud.monto_contrato ||
                                0
                              ) +

                              Number(
                                solicitud.monto_escrituracion ||
                                0
                              )
                            )

                      )}

                    </strong>

                  </div>

                ) : (
                    <div className="sale-writing-summary__total">
                      <span>Monto de cada pago</span>

                      <strong>
                        {formatCurrency(
                          Number(solicitud.monto_escrituracion || 0) /
                            Number(
                              solicitud.cantidad_pagos_escrituracion || 1
                            )
                        )}
                      </strong>
                    </div>
                  )}
                </div>
                </div>
                

              </section>

            </>
          )}


          {/* =================================================
              CLIENTE
          ================================================== */}

          {loteSelected && (

            <section className="form-section">

              <div className="form-section__header">

                <div className="form-section__icon">
                  <BiUser />
                </div>


                <div>

                  <h2 className="form-section__title">
                    Cliente
                  </h2>


                  <p className="form-section__description">
                    Selecciona un cliente
                    existente o registra
                    uno nuevo.
                  </p>

                </div>

              </div>


              <div className="form-section__body">

                <div className="sale-client-actions">

                  <button
                    type="button"

                    className={
                      opcionUsuario === 1
                        ? "btn btn-primary"
                        : "btn btn-secondary"
                    }

                    onClick={
                      iniciarNuevoCliente
                    }
                  >
                    <BiUser />

                    Nuevo cliente
                  </button>


                  <button
                    type="button"

                    className={
                      opcionUsuario === 2
                        ? "btn btn-primary"
                        : "btn btn-secondary"
                    }

                    onClick={
                      iniciarClienteExistente
                    }
                  >
                    <BiSearch />

                    Cliente existente
                  </button>

                </div>

              </div>

            </section>
          )}


          {/* =================================================
              CLIENTE EXISTENTE
          ================================================== */}

          {opcionUsuario === 2 && (

            <section className="card sale-section">

              <div className="card__header">

                <div>

                  <h2 className="card__title">
                    Clientes existentes
                  </h2>


                  <p className="card__description">
                    Selecciona el cliente
                    relacionado con la venta.
                  </p>

                </div>


                <span className="badge badge-primary">
                  {
                    clientesExistentes.length
                  }{" "}
                  clientes
                </span>

              </div>


              {clientesExistentes.length >
              0 ? (

                <>

                  <div className="table-container">

                    <table className="table">

                      <thead>

                        <tr>

                          <th>
                            Cliente
                          </th>

                          <th />

                        </tr>

                      </thead>


                      <tbody>

                        {clientesVisibles.map(
                          (cliente) => (

                            <tr
                              key={
                                cliente.id
                              }
                            >

                              <td>

                                <strong>
                                  {
                                    cliente.nombre_completo
                                  }
                                </strong>

                              </td>


                              <td className="table-actions">

                                <button
                                  type="button"

                                  className="btn btn-primary"

                                  onClick={
                                    () =>
                                      seleccionarClienteExistente(
                                        cliente.id
                                      )
                                  }
                                >
                                  <BiCheck />

                                  Seleccionar
                                </button>

                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>


                  {clientesExistentes.length >
                    filasClientes && (

                    <div className="sale-pagination">

                      <Pagination
                        current={
                          paginaClientes
                        }

                        pageSize={
                          filasClientes
                        }

                        total={
                          clientesExistentes.length
                        }

                        showSizeChanger

                        pageSizeOptions={[
                          5,
                          10,
                          25,
                        ]}

                        onChange={
                          (
                            page,
                            pageSize
                          ) => {

                            setPaginaClientes(
                              page
                            );

                            setFilasClientes(
                              pageSize
                            );
                          }
                        }
                      />

                    </div>
                  )}

                </>

              ) : (

                <div className="empty-state">

                  <BiUser
                    size={32}
                  />


                  <strong>
                    Sin clientes
                  </strong>


                  <span>
                    No se encontraron
                    clientes disponibles.
                  </span>

                </div>
              )}

            </section>
          )}


          {/* =================================================
              NUEVO CLIENTE
          ================================================== */}

          {opcionUsuario === 1 && (

            <section className="form-section sale-client-form">

              <div className="sale-client-steps">

                <Paso
                  numero={1}
                  texto="Cliente"
                  activo={
                    pasoCliente === 1
                  }
                  completado={
                    pasoCliente > 1
                  }
                />


                <Paso
                  numero={2}
                  texto="Domicilio"
                  activo={
                    pasoCliente === 2
                  }
                  completado={
                    pasoCliente > 2
                  }
                />


                <Paso
                  numero={3}
                  texto="Contacto"
                  activo={
                    pasoCliente === 3
                  }
                  completado={
                    pasoCliente > 3
                  }
                />


                <Paso
                  numero={4}
                  texto="Documentos"
                  activo={
                    pasoCliente === 4
                  }
                />

              </div>


              <div className="form-section__body">

                {/* ===========================================
                    PASO 1
                ============================================ */}

                {pasoCliente === 1 && (

                  <>

                    <div className="form-grid form-grid--2">

                      <Form.Item
                        name="primer_nombre"

                        label="Primer nombre"

                        rules={[
                          {
                            required:
                              true,

                            message:
                              "Primer nombre requerido",
                          },
                        ]}
                      >
                        <Input
                          size="large"

                          placeholder="Primer nombre"

                          onChange={
                            (event) => {

                              setUsuario(
                                (prev) => ({
                                  ...prev,

                                  primer_nombre:
                                    event.target.value,
                                })
                              );
                            }
                          }
                        />
                      </Form.Item>


                      <Form.Item
                        name="segundo_nombre"

                        label="Segundo nombre"
                      >
                        <Input
                          size="large"

                          placeholder="Segundo nombre"

                          onChange={
                            (event) => {

                              setUsuario(
                                (prev) => ({
                                  ...prev,

                                  segundo_nombre:
                                    event.target.value,
                                })
                              );
                            }
                          }
                        />
                      </Form.Item>


                      <Form.Item
                        name="primer_apellido"

                        label="Primer apellido"

                        rules={[
                          {
                            required:
                              true,

                            message:
                              "Primer apellido requerido",
                          },
                        ]}
                      >
                        <Input
                          size="large"

                          placeholder="Primer apellido"

                          onChange={
                            (event) => {

                              setUsuario(
                                (prev) => ({
                                  ...prev,

                                  primer_apellido:
                                    event.target.value,
                                })
                              );
                            }
                          }
                        />
                      </Form.Item>


                      <Form.Item
                        name="segundo_apellido"

                        label="Segundo apellido"
                      >
                        <Input
                          size="large"

                          placeholder="Segundo apellido"

                          onChange={
                            (event) => {

                              setUsuario(
                                (prev) => ({
                                  ...prev,

                                  segundo_apellido:
                                    event.target.value,
                                })
                              );
                            }
                          }
                        />
                      </Form.Item>

                    </div>


                    <StepFooter
                      onCancel={
                        () =>
                          setOpcionUsuario(
                            0
                          )
                      }

                      onNext={
                        () =>
                          siguientePasoCliente(
                            2
                          )
                      }
                    />

                  </>
                )}


                {/* ===========================================
                    PASO 2
                ============================================ */}

                {pasoCliente === 2 && (

                  <>

                    <div className="form-grid form-grid--2">

                      <Form.Item
                        name="calle"

                        label="Calle"
                      >
                        <Input
                          size="large"

                          placeholder="Calle"

                          onChange={
                            (event) => {

                              setUsuario(
                                (prev) => ({
                                  ...prev,

                                  calle:
                                    event.target.value,
                                })
                              );
                            }
                          }
                        />
                      </Form.Item>


                      <Form.Item
                        name="colonia"

                        label="Colonia"
                      >
                        <Input
                          size="large"

                          placeholder="Colonia"

                          onChange={
                            (event) => {

                              setUsuario(
                                (prev) => ({
                                  ...prev,

                                  colonia:
                                    event.target.value,
                                })
                              );
                            }
                          }
                        />
                      </Form.Item>


                      <Form.Item
                        name="numero_ext"

                        label="Número exterior"
                      >
                        <InputNumber
                          size="large"

                          controls={false}

                          placeholder="Número exterior"

                          onChange={
                            (value) => {

                              setUsuario(
                                (prev) => ({
                                  ...prev,

                                  numero_ext:
                                    value,
                                })
                              );
                            }
                          }
                        />
                      </Form.Item>


                      <Form.Item
                        name="numero_int"

                        label="Número interior"
                      >
                        <InputNumber
                          size="large"

                          controls={false}

                          placeholder="Número interior"

                          onChange={
                            (value) => {

                              setUsuario(
                                (prev) => ({
                                  ...prev,

                                  numero_int:
                                    value,
                                })
                              );
                            }
                          }
                        />
                      </Form.Item>


                      <Form.Item
                        name="cp"

                        label="Código postal"
                      >
                        <InputNumber
                          size="large"

                          controls={false}

                          placeholder="Código postal"

                          onChange={
                            (value) => {

                              setUsuario(
                                (prev) => ({
                                  ...prev,

                                  cp:
                                    value,
                                })
                              );
                            }
                          }
                        />
                      </Form.Item>

                    </div>


                    <StepFooter
                      onBack={
                        () =>
                          setPasoCliente(
                            1
                          )
                      }

                      onCancel={
                        () =>
                          setOpcionUsuario(
                            0
                          )
                      }

                      onNext={
                        () =>
                          siguientePasoCliente(
                            3
                          )
                      }
                    />

                  </>
                )}


                {/* ===========================================
                    PASO 3
                ============================================ */}

                {pasoCliente === 3 && (

                  <>

                    <div className="form-grid form-grid--2">

                      <Form.Item
                        name="celular_cliente"

                        label="Celular de contacto"

                        rules={[
                          {
                            required:
                              true,

                            message:
                              "Número de celular requerido",
                          },

                          {
                            pattern:
                              /^(\+52)?\d{10}$/,

                            message:
                              "Número de celular no válido",
                          },
                        ]}
                      >
                        <Input
                          size="large"

                          placeholder="10 dígitos"

                          onChange={
                            (event) => {

                              setUsuario(
                                (prev) => ({
                                  ...prev,

                                  celular_cliente:
                                    event.target.value,
                                })
                              );
                            }
                          }
                        />
                      </Form.Item>


                      <Form.Item
                        name="celular_cliente_2"

                        label="Celular secundario"

                        rules={[
                          {
                            pattern:
                              /^(\+52)?\d{10}$/,

                            message:
                              "Número de celular no válido",
                          },
                        ]}
                      >
                        <Input
                          size="large"

                          placeholder="10 dígitos"

                          onChange={
                            (event) => {

                              setUsuario(
                                (prev) => ({
                                  ...prev,

                                  celular_cliente_2:
                                    event.target.value,
                                })
                              );
                            }
                          }
                        />
                      </Form.Item>

                    </div>


                    <StepFooter
                      onBack={
                        () =>
                          setPasoCliente(
                            2
                          )
                      }

                      onCancel={
                        () =>
                          setOpcionUsuario(
                            0
                          )
                      }

                      onNext={
                        () =>
                          siguientePasoCliente(
                            4
                          )
                      }
                    />

                  </>
                )}


                {/* ===========================================
                    PASO 4
                ============================================ */}

                {pasoCliente === 4 && (

                  <>

                    <div className="sale-upload-grid">

                      <UploadCard
                        title="INE frente"

                        preview={
                          imagenBase64
                        }
                      >

                        <Upload
                          {...uploadBaseProps}

                          accept="image/*"

                          onChange={
                            (info) =>
                              procesarImagen(
                                info,
                                setImagenBase64
                              )
                          }
                        >
                          <Button
                            icon={
                              <UploadOutlined />
                            }
                          >
                            Seleccionar imagen
                          </Button>
                        </Upload>

                      </UploadCard>


                      <UploadCard
                        title="INE reverso"

                        preview={
                          imagenBase64R
                        }
                      >

                        <Upload
                          {...uploadBaseProps}

                          accept="image/*"

                          onChange={
                            (info) =>
                              procesarImagen(
                                info,
                                setImagenBase64R
                              )
                          }
                        >
                          <Button
                            icon={
                              <UploadOutlined />
                            }
                          >
                            Seleccionar imagen
                          </Button>
                        </Upload>

                      </UploadCard>


                      <UploadCard
                        title="Documento PDF"
                      >

                        <Upload
                          {...uploadBaseProps}

                          accept=".pdf"

                          onChange={
                            procesarPdf
                          }
                        >
                          <Button
                            icon={
                              <UploadOutlined />
                            }
                          >
                            Seleccionar PDF
                          </Button>
                        </Upload>

                      </UploadCard>

                    </div>


                    <div className="sale-step-footer">

                      <div>

                        <button
                          type="button"

                          className="btn btn-secondary"

                          onClick={
                            () =>
                              setPasoCliente(
                                3
                              )
                          }
                        >
                          Anterior
                        </button>

                      </div>


                      <div className="sale-step-footer__actions">

                        <button
                          type="button"

                          className="btn btn-secondary"

                          onClick={
                            () =>
                              setOpcionUsuario(
                                0
                              )
                          }
                        >
                          Cancelar
                        </button>


                        <button
                          type="button"

                          className="btn btn-primary"

                          onClick={
                            guardarCliente
                          }
                        >
                          <BiCheck />

                          Guardar venta
                        </button>

                      </div>

                    </div>

                  </>
                )}

              </div>

            </section>
          )}

        </Form>

      </div>

    </div>
  );
}


/* =========================================================
   RESUMEN
   ========================================================= */

function ResumenItem({
  icon: Icon,
  label,
  value,
}) {

  return (

    <div className="sale-summary__item">

      <div className="sale-summary__icon">
        <Icon />
      </div>


      <div>

        <span>
          {label}
        </span>


        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


/* =========================================================
   PASO
   ========================================================= */

function Paso({
  numero,
  texto,
  activo,
  completado,
}) {

  const className = [
    "sale-client-step",

    activo
      ? "sale-client-step--active"
      : "",

    completado
      ? "sale-client-step--completed"
      : "",
  ]
    .filter(Boolean)
    .join(" ");


  return (

    <div className={className}>

      <span className="sale-client-step__number">

        {completado ? (
          <BiCheck />
        ) : (
          numero
        )}

      </span>


      <span>
        {texto}
      </span>

    </div>
  );
}


/* =========================================================
   FOOTER PASOS
   ========================================================= */

function StepFooter({
  onBack,
  onCancel,
  onNext,
}) {

  return (

    <div className="sale-step-footer">

      <div>

        {onBack && (

          <button
            type="button"

            className="btn btn-secondary"

            onClick={
              onBack
            }
          >
            Anterior
          </button>
        )}

      </div>


      <div className="sale-step-footer__actions">

        <button
          type="button"

          className="btn btn-secondary"

          onClick={
            onCancel
          }
        >
          Cancelar
        </button>


        <button
          type="button"

          className="btn btn-primary"

          onClick={
            onNext
          }
        >
          Siguiente
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   UPLOAD CARD
   ========================================================= */

function UploadCard({
  title,
  preview,
  children,
}) {

  return (

    <div className="sale-upload-card">

      <div>

        <strong>
          {title}
        </strong>

      </div>


      {preview && (

        <div className="sale-upload-preview">

          <img
            src={
              preview
            }

            alt={
              title
            }
          />

        </div>
      )}


      <div>
        {children}
      </div>

    </div>
  );
}


/* =========================================================
   ESCRITURACIÓN
   ========================================================= */

function calcularMontoEscrituracion(
  tipo,
  lote,
  terreno
) {

  switch (
    Number(tipo)
  ) {

    case TIPOS_ESCRITURACION
      .PRECIO_FIJO:

      return Number(
        terreno
          ?.escrituracion_fija ||
        0
      );


    case TIPOS_ESCRITURACION
      .POR_M2:

      return (
        Number(
          lote?.superficie ||
          0
        ) *

        Number(
          terreno
            ?.escrituracion_m2 ||
          0
        )
      );


    case TIPOS_ESCRITURACION
      .SIN_ESCRITURACION:

    default:

      return 0;
  }
}


/* =========================================================
   HELPERS
   ========================================================= */

function parseMoney(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }


  return String(
    value
  )
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .replace(/MXN/g, "")
    .trim();
}


function formatCurrency(
  value
) {

  const numero =
    Number(
      value || 0
    );


  return new Intl.NumberFormat(
    "es-MX",
    {
      style:
        "currency",

      currency:
        "MXN",

      minimumFractionDigits:
        2,

      maximumFractionDigits:
        2,
    }
  ).format(
    numero
  );
}


function formatNumber(
  value
) {

  return new Intl.NumberFormat(
    "es-MX",
    {
      maximumFractionDigits:
        2,
    }
  ).format(
    Number(
      value || 0
    )
  );
}


function obtenerUnidadPagos(
  financiamientoId
) {

  switch (
    Number(
      financiamientoId
    )
  ) {

    case 1:
      return "Meses";

    case 2:
      return "Quincenas";

    case 3:
      return "Semanas";

    default:
      return "";
  }
}


/* =========================================================
   ALERTA ERROR
   ========================================================= */

function mostrarError(
  mensaje
) {

  Swal.fire({
    title:
      "Error",

    text:
      mensaje,

    icon:
      "error",

    confirmButtonText:
      "Aceptar",

    buttonsStyling:
      false,

    customClass: {
      popup:
        "swal-geanova",

      confirmButton:
        "swal-geanova-confirm",
    },
  });
}