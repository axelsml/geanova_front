"use client";

import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Radio,
  Select,
  Tooltip,
} from "antd";

import locale from "antd/lib/date-picker/locale/es_ES";

import {
  FaPencilAlt,
  FaPrint,
  FaRegCheckCircle,
  FaRegTimesCircle,
} from "react-icons/fa";

import {
  BiFile,
  BiImage,
  BiMoney,
  BiReceipt,
  BiSearch,
  BiUser,
} from "react-icons/bi";

import Swal from "sweetalert2";
import { useContext, useEffect, useMemo, useState } from "react";

import { usuario_id } from "@/helpers/user";
import { getCookie } from "@/helpers/Cookies";
import { getCookiePermisos } from "@/helpers/valorPermisos";

import { LoadingContext } from "@/contexts/loading";

import PagoForm from "@/components/PagoForm";
import ImagenesLoteModal from "@/components/ImagenesLoteModal";
import CancelarSolicitud from "@/components/CancelarSolicitud";

import terrenosService from "@/services/terrenosService";
import lotesService from "@/services/lotesService";
import pagosService from "@/services/pagosService";
import ventasService from "@/services/ventasService";
import cobranzaService from "@/services/cobranzaService";
import plazosService from "@/services/plazosService";

const TIPOS_ESCRITURACION = {
  SIN_ESCRITURACION: 0,
  PRECIO_FIJO: 1,
  POR_M2: 2,
};

const OPCIONES_FINANCIAMIENTO = [
  { value: 1, label: "Mensual" },
  { value: 2, label: "Quincenal" },
  { value: 3, label: "Semanal" },
];

const DATE_FORMAT = "DD/MM/YYYY";

export default function ClientesInfo() {
  const loadingContext = useContext(LoadingContext);

  if (!loadingContext) {
    throw new Error(
      "ClientesInfo debe estar dentro de LoadingProvider"
    );
  }

  const { setIsLoading } = loadingContext;

  const [forms] = Form.useForm();

  /* =========================================================
     SESIÓN / PERMISOS
     ========================================================= */

  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const [cookiePermisos, setCookiePermisos] = useState(0);

  /* =========================================================
     BÚSQUEDA
     ========================================================= */

  const [terrenos, setTerrenos] = useState([]);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [loteSelected, setLoteSelected] = useState(null);

  /* =========================================================
     INFORMACIÓN
     ========================================================= */

  const [infoCliente, setInfoCliente] = useState(null);
  const [infoLote, setInfoLote] = useState(null);
  const [fechaProximoPago, setFechaProximoPago] = useState(null);
  const [tieneLuzPantalla, setTieneLuzPantalla] = useState(false);
  const [tieneAnualidad, setTieneAnualidad] = useState(false);

  /* =========================================================
     PAGO
     ========================================================= */

  const [nuevoPago, setNuevoPago] = useState(false);
  const [tipoPagoId, setTipoPagoId] = useState(1);
  const [montoRequerido, setMontoRequerido] = useState(0);
  const [errorNuevoPago, setErrorNuevoPago] = useState(false);
  const [changeState, setChangeState] = useState(false);
  const [showTipoPago, setShowTipoPago] = useState(false);
  const [tipoPagoSeleccionado, setTipoPagoSeleccionado] = useState(1);

  const TIPOS_PAGO = {
    SOLICITUD: 1,
    ANUALIDAD: 2,
    ESCRITURACION: 3,
  };


  const abrirSelectorTipoPago = () => {
    setTipoPagoSeleccionado(TIPOS_PAGO.SOLICITUD);
    setShowTipoPago(true);
  };

  const obtenerMontoRequeridoTipoPago = (tipo) => {
    if (!infoLote) return 0;

    if (tipo === TIPOS_PAGO.ANUALIDAD) {
      return Number(
        infoLote.monto_pago_requerido_anualidad || 0
      );
    }

    if (tipo === TIPOS_PAGO.ESCRITURACION) {
      return Number(
        infoLote.monto_pago_requerido_escrituracion || 0
      );
    }

    return Number(
      infoLote.monto_pago_requerido || 0
    );
  };
  const obtenerNombreTipoPago = (tipo) => {
  if (tipo === TIPOS_PAGO.ANUALIDAD) {
    return "Anualidad";
  }

  if (tipo === TIPOS_PAGO.ESCRITURACION) {
    return "Escrituración";
  }

  return "Solicitud";
};
const confirmarTipoPago = () => {
  const monto = obtenerMontoRequeridoTipoPago(
    tipoPagoSeleccionado
  );

  setShowTipoPago(false);

  abrirFormularioPago(
    tipoPagoSeleccionado,
    monto
  );
};
  /* =========================================================
     EDITAR PAGO
     ========================================================= */

  const [showPagoEdit, setShowPagoEdit] = useState(false);
  const [sistemasPago, setSistemasPago] = useState([]);
  const [sistemaPagoSelected, setSistemaPagoSelected] = useState(null);

  const [selectedPago, setSelectedPago] = useState({
    pago_id: null,
    no_pago: null,
    monto_pagado: null,
    fecha_operacion: null,
    fecha: null,
    fecha_transferencia: null,
    sistema_pago_id: null,
  });

  /* =========================================================
     EDITAR CLIENTE / SOLICITUD
     ========================================================= */

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [clienteInfoEdit, setClienteInfoEdit] = useState({});
  const [sistemasPagoModal, setSistemasPagoModal] = useState([]);

  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");

  const [calle, setCalle] = useState("");
  const [colonia, setColonia] = useState("");
  const [numeroExt, setNumeroExt] = useState("");
  const [numeroInt, setNumeroInt] = useState("");
  const [codigoPostal, setCodigoPostal] = useState(null);

  const [montoContrato, setMontoContrato] = useState(null);
  const [cantidadPagos, setCantidadPagos] = useState(null);
  const [anticipo, setAnticipo] = useState(null);
  const [sistemaPagoSelectedModal, setSistemaPagoSelectedModal] =
    useState(null);

  const [financiamientoId, setFinanciamientoId] = useState(null);
  const [plazoId, setPlazoId] = useState(null);
  const [plazos, setPlazos] = useState([]);
  const [fechaSolicitud, setFechaSolicitud] = useState(null);
  const [cambiarFecha, setCambiarFecha] = useState(false);

  const [newAmortizacion, setNewAmortizacion] = useState(false);

  /* =========================================================
     LUZ
     ========================================================= */

  const [totalImpuestoLuz, setTotalImpuestoLuz] = useState(0);
  const [agregarLuz, setAgregarLuz] = useState(false);
  const [tieneLuz, setTieneLuz] = useState(false);

  /* =========================================================
     ESCRITURACIÓN EN EDICIÓN
     ========================================================= */

  const [tipoEscrituracionEdit, setTipoEscrituracionEdit] = useState(0);
  const [tiempoExtraEdit, setTiempoExtraEdit] = useState(false);
  const [cantidadPagosEscrituracionEdit, setCantidadPagosEscrituracionEdit] =
    useState(null);
  const [financiamientoEscrituracionEdit, setFinanciamientoEscrituracionEdit] =
    useState(null);
  const [fechaInicioEscrituracionEdit, setFechaInicioEscrituracionEdit] =
    useState(null);

  /* =========================================================
     OTROS MODALES
     ========================================================= */

  const [showCongelar, setShowCongelar] = useState(false);
  const [showImagenes, setShowImagenes] = useState(false);

  /* =========================================================
     DERIVADOS
     ========================================================= */

  const tieneEscrituracion =
    Number(infoLote?.tipo_escrituracion || 0) !== 0;

  const escrituracionBloqueada =
    Array.isArray(infoLote?.pagos_escrituracion) &&
    infoLote.pagos_escrituracion.length > 0;

  const montoEscrituracionPreview = useMemo(() => {
    if (!infoLote) return 0;

    if (tipoEscrituracionEdit === TIPOS_ESCRITURACION.PRECIO_FIJO) {
      return Number(infoLote.escrituracion_fija_terreno || 0);
    }

    if (tipoEscrituracionEdit === TIPOS_ESCRITURACION.POR_M2) {
      return (
        Number(infoLote.superficie || 0) *
        Number(infoLote.escrituracion_m2_terreno || 0)
      );
    }

    return 0;
  }, [
    infoLote,
    tipoEscrituracionEdit,
  ]);

  /* =========================================================
     CARGA INICIAL
     ========================================================= */

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsuario = localStorage.getItem("usuario");

      if (storedUsuario) {
        try {
          setUsuarioInfo(JSON.parse(storedUsuario));
        } catch (error) {
          console.error("Usuario local inválido:", error);
        }
      }
    }

    pagosService.getSistemasPago(
      (data) => setSistemasPago(Array.isArray(data) ? data : []),
      onError
    );

    getCookiePermisos(
      "informacion del cliente",
      setCookiePermisos
    );

    terrenosService.getTerrenos(
      (data) => setTerrenos(Array.isArray(data) ? data : []),
      onError
    );
  }, []);

  /* =========================================================
     BÚSQUEDA AUTOMÁTICA POR URL
     ========================================================= */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const shouldSearch = params.get("shouldSearch");

    if (!shouldSearch) return;

    const terrenoId = params.get("terreno_id");
    const loteId = params.get("lote_id");

    if (!terrenoId || !loteId) return;

    setIsLoading(true);

    lotesService.getClienteByLote(
      terrenoId,
      loteId,
      onInfoClienteCargado,
      onError
    );
  }, []);

  useEffect(() => {
    if (!infoLote?.terreno_id || !infoLote?.lote_id) return;

    setIsLoading(true);

    lotesService.getClienteByLote(
      infoLote.terreno_id,
      infoLote.lote_id,
      onInfoClienteCargado,
      onError
    );
  }, [changeState]);

  /* =========================================================
     ERROR DE SESIÓN
     ========================================================= */

  useEffect(() => {
    if (!errorNuevoPago) return;

    Swal.fire({
      title: "Sesión no encontrada",
      icon: "error",
      text: "Inicie sesión antes de registrar un pago.",
      confirmButtonText: "Aceptar",
      buttonsStyling: false,
      customClass: {
        popup: "swal-geanova",
        confirmButton: "swal-geanova-confirm",
      },
    });
  }, [errorNuevoPago]);

  /* =========================================================
     BÚSQUEDA
     ========================================================= */

  const onBuscarLotes = (value) => {
    const terreno = terrenos.find(
      (item) => Number(item.id) === Number(value)
    );

    setTerrenoSelected(terreno || null);
    setLoteSelected(null);
    setLotes([]);

    lotesService.getLotesAsignados(
      value,
      (data) => setLotes(Array.isArray(data) ? data : []),
      onError
    );
  };

  const BuscarInfoLote = () => {
    if (!terrenoSelected || !loteSelected) return;

    limpiarConsulta();
    setIsLoading(true);

    lotesService.getClienteByLote(
      terrenoSelected.id,
      loteSelected.id,
      onInfoClienteCargado,
      onError
    );
  };

  const limpiarConsulta = () => {
    setInfoCliente(null);
    setInfoLote(null);
    setFechaProximoPago(null);
    setNuevoPago(false);
  };

  function onInfoClienteCargado(data) {
    setIsLoading(false);

    if (!data?.encontrado) {
      Swal.fire({
        title: "Sin información",
        icon: "info",
        text: "No se pudo encontrar información para el lote seleccionado.",
        confirmButtonText: "Aceptar",
        buttonsStyling: false,
        customClass: {
          popup: "swal-geanova",
          confirmButton: "swal-geanova-confirm",
        },
      });

      return;
    }

    const lote = data.info_lote || {};

    setInfoCliente(data.info_cliente || null);
    setInfoLote(lote);
    setFechaProximoPago(data.fecha_proximo_pago || lote.proximo_pago || null);
    setTieneLuzPantalla(Boolean(data.tiene_luz));
    setTieneAnualidad(Boolean(lote.tiene_anualidad));

    setPlazoId(lote.plazo_id || null);
    setFinanciamientoId(lote.financiamiento_id || null);

    cargarEstadosEscrituracion(lote);

    if (lote.terreno_id) {
      plazosService.getPlazos(
        { terreno_id: lote.terreno_id },
        (dataPlazos) => setPlazos(Array.isArray(dataPlazos) ? dataPlazos : []),
        onError
      );
    }
  }

  /* =========================================================
     PAGOS
     ========================================================= */

  const abrirFormularioPago = (tipo, monto) => {
    const cookieUsuario = getCookie("usuario");

    setTipoPagoId(tipo);
    setMontoRequerido(Number(monto || 0));

    cookieUsuario
      .then((cookie) => {
        if (!cookie || !cookie.value) {
          setErrorNuevoPago(true);
          return;
        }

        setNuevoPago(true);
      })
      .catch((error) => {
        console.error("Error al obtener cookie:", error);
      });
  };

  const CreateNuevoPago = () => {
    abrirFormularioPago(
      1,
      infoLote?.monto_pago_requerido
    );
  };

  const CreateNuevoPagoAnualidad = () => {
    abrirFormularioPago(
      2,
      infoLote?.monto_pago_requerido_anualidad
    );
  };

  const CreateNuevoPagoEscrituracion = () => {
    abrirFormularioPago(
      3,
      infoLote?.monto_pago_requerido_escrituracion
    );
  };

  /* =========================================================
     EDITAR PAGO
     ========================================================= */

  const handleModalPago = (pago) => {
    setSelectedPago({
      pago_id: pago.pago_id,
      no_pago: pago.no_pago,
      monto_pagado: pago.monto_pagado,
      fecha_operacion: normalizarFechaInput(pago.fecha_operacion),
      fecha: normalizarFechaInput(pago.fecha),
      fecha_transferencia: normalizarFechaInput(pago.fecha_transferencia),
      sistema_pago_id: pago.sistema_pago_id,
    });

    setSistemaPagoSelected(pago.sistema_pago_id || null);
    setShowPagoEdit(true);
  };

  const handleCloseModalPago = () => {
    setShowPagoEdit(false);
    setSistemaPagoSelected(null);

    setSelectedPago({
      pago_id: null,
      no_pago: null,
      monto_pagado: null,
      fecha_operacion: null,
      fecha: null,
      fecha_transferencia: null,
      sistema_pago_id: null,
    });
  };

  const onChangedPago = (name, value) => {
    setSelectedPago((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChangesPago = () => {
    if (!sistemaPagoSelected) {
      mostrarError("Seleccione un sistema de pago.");
      return;
    }

    const params = {
      id: selectedPago.pago_id,
      no_pago: selectedPago.no_pago,
      monto_pagado: selectedPago.monto_pagado,
      fecha_operacion: selectedPago.fecha_operacion,
      fecha: selectedPago.fecha,
      fecha_transferencia: selectedPago.fecha_transferencia,
      sistema_pago_id: sistemaPagoSelected,
    };

    setIsLoading(true);

    pagosService.editarInfoPago(
      params,
      onSaveChangesPago,
      onError
    );
  };

  function onSaveChangesPago(data) {
    setIsLoading(false);

    if (!data?.success) {
      mostrarError(data?.message || "No fue posible editar el pago.");
      return;
    }

    Swal.fire({
      title: "Pago actualizado",
      icon: "success",
      confirmButtonText: "Aceptar",
      buttonsStyling: false,
      customClass: {
        popup: "swal-geanova",
        confirmButton: "swal-geanova-confirm",
      },
    }).then(() => {
      handleCloseModalPago();
      BuscarInfoLote();
    });
  }

  /* =========================================================
     EDICIÓN CLIENTE / SOLICITUD
     ========================================================= */

  const abrirEditarCliente = () => {
    setShowModalEditar(true);
    datosModal();
  };

  const handleCloseModalEditar = () => {
    setShowModalEditar(false);
    setCambiarFecha(false);
    setNewAmortizacion(false);
    setAgregarLuz(false);
    setTieneLuz(false);
    setTotalImpuestoLuz(0);
  };

  function datosModal() {
    if (!infoLote) return;

    setIsLoading(true);

    pagosService.getSistemasPago(
      (data) => setSistemasPagoModal(Array.isArray(data) ? data : []),
      onError
    );

    lotesService
      .cargarClienteInfo(
        infoLote.solicitud_id,
        (data) => setClienteInfoEdit(data || {}),
        onError
      )
      .then(() => {
        setIsLoading(false);
      })
      .catch(onError);
  }

  useEffect(() => {
    if (!clienteInfoEdit || Object.keys(clienteInfoEdit).length === 0) {
      return;
    }

    const nombre = Array.isArray(clienteInfoEdit.nombre)
      ? clienteInfoEdit.nombre[0]
      : null;

    const domicilio = Array.isArray(clienteInfoEdit.domicilio)
      ? clienteInfoEdit.domicilio[0]
      : null;

    if (nombre) {
      setPrimerNombre(nombre.primer_nombre || "");
      setSegundoNombre(nombre.segundo_nombre || "");
      setPrimerApellido(nombre.primer_apellido || "");
      setSegundoApellido(nombre.segundo_apellido || "");
    }

    if (domicilio) {
      setCalle(domicilio.calle || "");
      setColonia(domicilio.colonia || "");
      setNumeroExt(domicilio.numero_ext || "");
      setNumeroInt(domicilio.numero_int || "");
      setCodigoPostal(domicilio.cp || null);
    }

    if (infoLote) {
      setFechaSolicitud(normalizarFechaInput(infoLote.fecha_solicitud));
      setMontoContrato(Number(infoLote.monto_contrato || 0));
      setCantidadPagos(Number(infoLote.cantidad_pagos || 0));
      setAnticipo(Number(infoLote.anticipo || 0));
      setFinanciamientoId(infoLote.financiamiento_id || null);
      setPlazoId(infoLote.plazo_id || null);

      setSistemaPagoSelectedModal(
        obtenerSistemaPagoIdActual(
          infoLote,
          sistemasPagoModal
        )
      );

      cargarEstadosEscrituracion(infoLote);
    }

    setAgregarLuz(false);
  }, [
    clienteInfoEdit,
    infoLote,
    sistemasPagoModal,
  ]);

  const cargarEstadosEscrituracion = (lote) => {
    setTipoEscrituracionEdit(
      Number(lote?.tipo_escrituracion || 0)
    );

    setTiempoExtraEdit(
      Boolean(lote?.tiempo_extra)
    );

    setCantidadPagosEscrituracionEdit(
      lote?.cantidad_pagos_escrituracion || null
    );

    setFinanciamientoEscrituracionEdit(
      lote?.tipo_financiamiento_escrituracion || null
    );

    setFechaInicioEscrituracionEdit(
      normalizarFechaInput(
        lote?.fecha_inicio_escrituracion
      )
    );
  };

  const actualizarDatos = async () => {
    if (!infoLote || !infoCliente) return;

    if (tiempoExtraEdit && tipoEscrituracionEdit !== 0) {
      if (!cantidadPagosEscrituracionEdit || cantidadPagosEscrituracionEdit <= 0) {
        mostrarError("Indique la cantidad de pagos de escrituración.");
        return;
      }

      if (!financiamientoEscrituracionEdit) {
        mostrarError("Seleccione la frecuencia de la escrituración.");
        return;
      }

      if (!fechaInicioEscrituracionEdit) {
        mostrarError("Indique la fecha del primer cobro de escrituración.");
        return;
      }
    }

    const form = {
      solicitud_id: infoLote.solicitud_id,
      idCliente: infoCliente.id,

      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,

      calle,
      colonia,
      numero_ext: numeroExt,
      numero_int: numeroInt,
      cp: codigoPostal,

      montoContrato,
      cantidadPagos,
      anticipo,
      sistemaPago: sistemaPagoSelectedModal,

      montoLuz: totalImpuestoLuz,
      tieneLuz,

      financiamiento_id: financiamientoId,
      fecha_solicitud: fechaSolicitud,
      plazoId,

      tipo_escrituracion: tipoEscrituracionEdit,
      tiempo_extra:
        tipoEscrituracionEdit === 0
          ? false
          : tiempoExtraEdit,

      cantidad_pagos_escrituracion:
        tipoEscrituracionEdit !== 0 && tiempoExtraEdit
          ? Number(cantidadPagosEscrituracionEdit || 0)
          : 0,

      tipo_financiamiento_escrituracion:
        tipoEscrituracionEdit !== 0 && tiempoExtraEdit
          ? financiamientoEscrituracionEdit
          : null,

      fecha_inicio_escrituracion:
        tipoEscrituracionEdit !== 0 && tiempoExtraEdit
          ? fechaInicioEscrituracionEdit
          : null,
    };

    const result = await Swal.fire({
      title: "Guardar cambios",
      text: "Se actualizará la información del cliente y de la solicitud.",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Guardar cambios",
      denyButtonText: "Cancelar",
      buttonsStyling: false,
      customClass: {
        popup: "swal-geanova",
        confirmButton: "swal-geanova-confirm",
        denyButton: "swal-geanova-cancel",
      },
    });

    if (!result.isConfirmed) return;

    setIsLoading(true);

    lotesService.updateClienteByLote(
      form,
      onClienteActualizado,
      onError
    );
  };

const onClienteActualizado = (data) => {
  setShowModalEditar(false);
  setIsLoading(false);

  if (data.type === "success") {
    setCantidadPagos(
      data.cantidad_pagos
    );

    if (
      data.regenerar_amortizacion
    ) {
      borrarAmortizacion();
      return;
    }

    BuscarInfoLote();

    Swal.fire({
      title:
        "Cliente actualizado con éxito",
      icon:
        "success",
      confirmButtonText:
        "Aceptar",
    });

  } else {

    Swal.fire({
      title:
        "Error",
      icon:
        "error",
      text:
        data.message,
      confirmButtonText:
        "Aceptar",
    });
  }
};

  /* =========================================================
     LUZ
     ========================================================= */

  function calcularLuz(superficie) {
    const calculo = (25900 / 119) * Number(superficie || 0);

    setTotalImpuestoLuz(calculo);

    if (!agregarLuz) {
      setTieneLuz("agregar");
      setMontoContrato(Number(montoContrato || 0) + calculo);
    } else {
      setTieneLuz(false);
      setMontoContrato(Number(montoContrato || 0) - calculo);
    }

    setNewAmortizacion(true);
  }

  function restarLuz(superficie) {
    const calculo = (25900 / 119) * Number(superficie || 0);

    setTotalImpuestoLuz(calculo);

    if (!agregarLuz) {
      setTieneLuz("quitar");
      setMontoContrato(Number(montoContrato || 0) - calculo);
    } else {
      setTieneLuz(false);
      setMontoContrato(Number(montoContrato || 0) + calculo);
    }

    setNewAmortizacion(true);
  }

  /* =========================================================
     AMORTIZACIÓN NORMAL
     ========================================================= */

  function regenerarAmortizacion(abrirPdf = true) {
    if (!infoLote) return;

    const params = {
      solicitud_id: infoLote.solicitud_id,
      nueva_cantidad_pagos: cantidadPagos || infoLote.cantidad_pagos,
    };

    setIsLoading(true);

    ventasService.borrarAmortizacion(
      params,
      (data) => onAmortizacionBorrada(data, abrirPdf),
      onError
    );
  }

  function onAmortizacionBorrada(data, abrirPdf) {
    setIsLoading(false);

    if (!data?.success) {
      mostrarError("No se pudo regenerar la amortización.");
      return;
    }

    if (abrirPdf && infoLote) {
      window.open(
        `https://api.santamariadelaluz.com/iUsuarios/${infoLote.solicitud_id}.pdf`,
        "_blank"
      );
    }

    BuscarInfoLote();
  }

  /* =========================================================
     INTERÉS
     ========================================================= */

  async function actualizarPerdonarInteres() {
    if (!infoLote) return;

    const titulo = infoLote.perdonar_interes
      ? "¿Aplicar interés a este cliente?"
      : "¿Perdonar interés a este cliente?";

    const result = await Swal.fire({
      title: titulo,
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: "Cancelar",
      buttonsStyling: false,
      customClass: {
        popup: "swal-geanova",
        confirmButton: "swal-geanova-confirm",
        denyButton: "swal-geanova-cancel",
      },
    });

    if (!result.isConfirmed) return;

    setIsLoading(true);

    lotesService
      .updatePerdonarInteres(
        { solicitud_id: infoLote.solicitud_id },
        onClienteActualizado,
        onError
      )
      .catch(onError);
  }

  /* =========================================================
     CONGELAR
     ========================================================= */

  async function congelarCliente() {
    if (!infoLote) return;

    if (infoLote.fecha_congelamiento != null) {
      const result = await Swal.fire({
        title: "¿Descongelar este cliente?",
        icon: "warning",
        showDenyButton: true,
        confirmButtonText: "Descongelar",
        denyButtonText: "Cancelar",
        buttonsStyling: false,
        customClass: {
          popup: "swal-geanova",
          confirmButton: "swal-geanova-confirm",
          denyButton: "swal-geanova-cancel",
        },
      });

      if (!result.isConfirmed) return;

      setIsLoading(true);

      cobranzaService
        .descongelarCliente(
          { solicitud_id: infoLote.solicitud_id },
          onClienteCongelado,
          onError
        )
        .catch(onError);

      return;
    }

    setShowCongelar(true);
  }

  function handleCloseCongelar() {
    setShowCongelar(false);
    forms.resetFields();
  }

  function handleSubmitCongelar(values) {
    const fechaCongelar = values.fechaCongelar;
    const today = new Date();
    const fecha =
      fechaCongelar && typeof fechaCongelar.toDate === "function"
        ? fechaCongelar.toDate()
        : new Date(fechaCongelar);

    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();

    const datos = {
      fechaCongelar: today,
      fechaTerminaCongelamiento: `${dia}/${mes}/${anio}`,
      solicitud_id: infoLote.solicitud_id,
    };

    setIsLoading(true);

    cobranzaService
      .congelarCliente(
        datos,
        onClienteCongelado,
        onError
      )
      .catch(onError);
  }

  function onClienteCongelado() {
    setIsLoading(false);
    handleCloseCongelar();
    BuscarInfoLote();
  }

  const validarFecha = (_, value) => {
    if (!value) {
      return Promise.reject(
        new Error("Debe ingresar una fecha.")
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const limite = new Date();
    limite.setMonth(limite.getMonth() + 3);

    if (value.toDate() <= today) {
      return Promise.reject(
        new Error("La fecha debe ser mayor a la fecha actual.")
      );
    }

    if (value.toDate() > limite) {
      return Promise.reject(
        new Error("La fecha no puede ser mayor a 3 meses desde hoy.")
      );
    }

    return Promise.resolve();
  };

  /* =========================================================
     ERROR
     ========================================================= */

  function onError(error) {
    setIsLoading(false);
    console.error("ClientesInfo:", error);
  }

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
              <BiUser /> COBRANZA
            </div>

            <h1 className="page-title">
              Información del cliente
            </h1>

            <p className="page-description">
              Consulta contrato, pagos, escrituración y estado de cuenta.
            </p>
          </div>
        </header>

        {/* ===================================================
            BUSCADOR
        ==================================================== */}

        <section className="filter-bar client-search-bar">
          <div className="form-group">
            <label className="form-label">
              Proyecto
            </label>

            <Select
              showSearch
              size="large"
              placeholder="Seleccione un proyecto"
              optionFilterProp="label"
              options={terrenos.map((item) => ({
                value: item.id,
                label: item.nombre,
              }))}
              onChange={onBuscarLotes}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Lote
            </label>

            <Select
              showSearch
              size="large"
              disabled={!terrenoSelected}
              placeholder="Seleccione un lote"
              optionFilterProp="label"
              options={lotes.map((item) => ({
                value: item.id,
                label: `Lote ${item.numero}`,
              }))}
              onChange={(value) => {
                const seleccionado = lotes.find(
                  (item) => Number(item.id) === Number(value)
                );

                setLoteSelected(seleccionado || null);
              }}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary"
            disabled={!terrenoSelected || !loteSelected}
            onClick={BuscarInfoLote}
          >
            <BiSearch />
            Buscar cliente
          </button>
        </section>

        {/* ===================================================
            CLIENTE
        ==================================================== */}

        {infoCliente && infoLote && (
          <>
            <section className="client-hero">
              <div>
                <span className="client-hero__eyebrow">
                  CLIENTE
                </span>

                <h2>
                  {infoCliente.nombre_completo || "Cliente"}
                </h2>

                <p>
                  {infoCliente.domicilio || "Sin domicilio registrado"}
                </p>
              </div>

              <div className="client-hero__right">
                <span
                  className={`status-badge status-badge--${obtenerEstadoClase(
                    obtenerEstadoGeneral(infoLote)
                  )}`}
                >
                  {obtenerEstadoGeneral(infoLote)}
                </span>

                <button
                  type="button"
                  className="btn btn-icon"
                  disabled={Number(usuarioInfo?.id || 999) > 2}
                  onClick={abrirEditarCliente}
                  title="Editar cliente"
                >
                  <FaPencilAlt />
                </button>
              </div>
            </section>

            {/* =================================================
                KPIs
            ================================================== */}

            <section className="client-kpis">
              <Kpi
                label="Monto contrato"
                value={moneda(infoLote.monto_contrato)}
              />

              <Kpi
                label="Pagado"
                value={moneda(infoLote.monto_pagado)}
              />

              <Kpi
                label="Saldo"
                value={moneda(infoLote.saldo)}
              />

              <Kpi
                label="Monto vencido"
                value={moneda(infoLote.monto_vencido)}
                danger={Number(infoLote.monto_vencido || 0) > 0}
              />
            </section>

            {/* =================================================
                DATOS CLIENTE / CONTRATO
            ================================================== */}

            <section className="card client-details-card">
              <div className="card__header">
                <div>
                  <h2 className="card__title">
                    Datos del contrato
                  </h2>

                  <p className="card__description">
                    Información general del cliente y de la operación.
                  </p>
                </div>

                <BiReceipt className="terrain-card-header-icon" />
              </div>

              <div className="client-details-grid">
                <Dato
                  label="Proyecto"
                  value={infoLote.terreno}
                />

                <Dato
                  label="Lote"
                  value={`Lote ${infoLote.lote}`}
                />

                <Dato
                  label="Superficie"
                  value={`${numero(infoLote.superficie)} m²`}
                />

                <Dato
                  label="Fecha solicitud"
                  value={infoLote.fecha_solicitud || "—"}
                />

                <Dato
                  label="Anticipo"
                  value={moneda(infoLote.anticipo)}
                />

                <Dato
                  label="Cantidad de pagos"
                  value={infoLote.cantidad_pagos || 0}
                />

                <Dato
                  label="Plazo"
                  value={infoLote.plazo || "—"}
                />

                <Dato
                  label="Financiamiento"
                  value={infoLote.financiamiento_nombre || "—"}
                />

                <Dato
                  label="Sistema de pago"
                  value={infoLote.sistema_pago || "—"}
                />

                <Dato
                  label="Pago requerido"
                  value={moneda(infoLote.monto_pago_requerido)}
                />

                <Dato
                  label="Interés acumulado"
                  value={moneda(infoLote.interes_acumulado)}
                />

                <Dato
                  label="Próximo pago"
                  value={infoLote.proximo_pago || fechaProximoPago || "—"}
                />

                <Dato
                  label="Teléfono 1"
                  value={infoCliente.telefono_celular || "—"}
                />

                <Dato
                  label="Teléfono 2"
                  value={infoCliente.telefono_celular_2 || "—"}
                />

                <Dato
                  label="Cliente desde"
                  value={infoCliente.cliente_desde || "—"}
                />

                <Dato
                  label="Lotes adquiridos"
                  value={infoCliente.lotes_adquiridos || 0}
                />
              </div>

              <div className="client-electricity">
                {tieneLuzPantalla ? (
                  <>
                    <FaRegCheckCircle />
                    <span>
                      Este contrato sí cuenta con suministro de electricidad.
                    </span>
                  </>
                ) : (
                  <>
                    <FaRegTimesCircle />
                    <span>
                      Este contrato no cuenta con suministro de electricidad.
                    </span>
                  </>
                )}
              </div>
            </section>

            {/* =================================================
                ESCRITURACIÓN
            ================================================== */}

            {tieneEscrituracion && (
              <section className="card client-writing-card">
                <div className="card__header">
                  <div>
                    <h2 className="card__title">
                      Escrituración
                    </h2>

                    <p className="card__description">
                      {infoLote.tiempo_extra
                        ? "La escrituración tiene un plan de cobro independiente."
                        : "La escrituración está integrada al saldo normal de la solicitud."}
                    </p>
                  </div>

                  <span className="badge badge-primary">
                    {Number(infoLote.tipo_escrituracion) === 1
                      ? "Precio fijo"
                      : "Por m²"}
                  </span>
                </div>

                <div className="client-writing-grid">
                  <Dato
                    label="Monto de escrituración"
                    value={moneda(infoLote.monto_escrituracion)}
                  />

                  {!infoLote.tiempo_extra && (
                    <>
                      <Dato
                        label="Total solicitud"
                        value={moneda(infoLote.monto_total_pagar)}
                      />

                      <Dato
                        label="Modalidad"
                        value="Incluida en la solicitud"
                      />
                    </>
                  )}

                  {infoLote.tiempo_extra && (
                    <>
                      <Dato
                        label="Frecuencia"
                        value={
                          infoLote.tipo_financiamiento_escrituracion_nombre ||
                          "—"
                        }
                      />

                      <Dato
                        label="Cantidad de pagos"
                        value={infoLote.cantidad_pagos_escrituracion || 0}
                      />

                      <Dato
                        label="Pago requerido"
                        value={moneda(
                          infoLote.monto_pago_requerido_escrituracion
                        )}
                      />

                      <Dato
                        label="Pagado"
                        value={moneda(
                          infoLote.monto_pagado_escrituracion
                        )}
                      />

                      <Dato
                        label="Saldo"
                        value={moneda(
                          infoLote.saldo_escrituracion
                        )}
                      />

                      <Dato
                        label="Monto vencido"
                        value={moneda(
                          infoLote.monto_vencido_escrituracion
                        )}
                      />

                      <Dato
                        label="Próximo pago"
                        value={
                          infoLote.proximo_pago_escrituracion ||
                          "—"
                        }
                      />

                      <Dato
                        label="Estado"
                        value={
                          infoLote.situacion_escrituracion ||
                          "—"
                        }
                      />
                    </>
                  )}
                </div>

              </section>
            )}

            {/* =================================================
                ACCIONES
            ================================================== */}

            <section className="card client-actions-card">
              <div className="card__header">
                <div>
                  <h2 className="card__title">
                    Acciones
                  </h2>

                  <p className="card__description">
                    Cobranza, documentos y administración del contrato.
                  </p>
                </div>
              </div>

              <div className="client-actions">
                <button
                type="button"
                className="btn btn-primary"
                disabled={Number(cookiePermisos || 0) < 1}
                onClick={abrirSelectorTipoPago}
              >
                <BiMoney />
                Nuevo pago
              </button>

                {/* {tieneAnualidad && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={Number(cookiePermisos || 0) < 1}
                    onClick={CreateNuevoPagoAnualidad}
                  >
                    Pago anualidad
                  </button>
                )}

                {infoLote.tiempo_extra &&
                  Number(infoLote.saldo_escrituracion || 0) > 0 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={Number(cookiePermisos || 0) < 1}
                      onClick={CreateNuevoPagoEscrituracion}
                    >
                      <BiFile />
                      Pago escrituración
                    </button>
                  )} */}

                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={Number(cookiePermisos || 0) < 1}
                  onClick={() => regenerarAmortizacion(true)}
                >
                  Amortización
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={Number(cookiePermisos || 0) < 1}
                  onClick={() => {
                    window.open(
                      `https://api.santamariadelaluz.com/getClienteByLote/${infoLote.terreno_id}/${infoLote.lote_id}.pdf`,
                      "_blank"
                    );
                  }}
                >
                  Estado de cuenta
                </button>

                {infoLote.liquidado_total && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      window.open(
                        `https://api.santamariadelaluz.com/carta_liquidacion_pdf/${infoLote.terreno_id}/${infoLote.lote_id}.pdf`,
                        "_blank"
                      );
                    }}
                  >
                    Hoja de liquidación
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={Number(cookiePermisos || 0) < 1}
                  onClick={() => setShowImagenes(true)}
                >
                  <BiImage />
                  Ver imágenes
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={Number(usuarioInfo?.id || 999) > 2}
                  onClick={actualizarPerdonarInteres}
                >
                  {infoLote.perdonar_interes
                    ? "Aplicar interés"
                    : "Perdonar interés"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={Number(usuarioInfo?.id || 999) > 2}
                  onClick={congelarCliente}
                >
                  {infoLote.fecha_congelamiento != null
                    ? "Descongelar cliente"
                    : "Congelar cliente"}
                </button>

                <CancelarSolicitud
                  solicitudId={infoLote.solicitud_id}
                  loteId={infoLote.lote_id}
                  fechaCancelacion={infoLote.fecha_cancelacion}
                />
              </div>
            </section>

            {/* =================================================
                PAGO FORM
            ================================================== */}

            {nuevoPago && (
              <section className="card client-payment-form-card">
                <PagoForm
                  setNuevoPago={setNuevoPago}
                  cliente={infoCliente}
                  lote={infoLote}
                  proximoPago={
                    tipoPagoId === 3
                      ? infoLote.proximo_pago_escrituracion
                      : fechaProximoPago
                  }
                  setWatch={setChangeState}
                  watch={changeState}
                  tipo_pago_id_opcion={tipoPagoId}
                  monto_requerido={montoRequerido}
                />
              </section>
            )}

            {/* =================================================
                HISTORIALES
            ================================================== */}

            <HistorialPagos
              title="Pagos de solicitud"
              pagos={infoLote.pagos || []}
              cookiePermisos={cookiePermisos}
              onEdit={handleModalPago}
            />

            {tieneAnualidad && (
              <HistorialPagos
                title="Pagos de anualidad"
                pagos={infoLote.pagos2 || []}
                cookiePermisos={cookiePermisos}
                onEdit={handleModalPago}
              />
            )}

            {infoLote.tiempo_extra && (
              <HistorialPagos
                title="Pagos de escrituración"
                pagos={infoLote.pagos_escrituracion || []}
                cookiePermisos={cookiePermisos}
                onEdit={handleModalPago}
              />
            )}
          </>
        )}
      </div>

        <Modal
  title="Registrar nuevo pago"
  footer={null}
  open={showTipoPago}
  onCancel={() => setShowTipoPago(false)}
  width={620}
>
  <div className="payment-type-modal">

    <div className="payment-type-header">
      <span className="payment-type-eyebrow">
        TIPO DE PAGO
      </span>

      <h3>
        ¿Qué concepto desea pagar?
      </h3>

      <p>
        Seleccione el concepto al que se aplicará
        el pago.
      </p>
    </div>


    <Radio.Group
      value={tipoPagoSeleccionado}
      onChange={(event) => {
        setTipoPagoSeleccionado(
          Number(event.target.value)
        );
      }}
      className="payment-type-options"
    >

      {/* ================================================
          SOLICITUD
      ================================================= */}

      <Radio
        value={TIPOS_PAGO.SOLICITUD}
        className="payment-type-option"
      >
        <div className="payment-type-option__content">

          <div>
            <strong>
              Pago de solicitud
            </strong>

            <span>
              Se aplicará al saldo normal del contrato.
            </span>
          </div>

          <div className="payment-type-option__amount">
            <span>
              Requerido
            </span>

            <strong>
              {moneda(
                infoLote?.monto_pago_requerido
              )}
            </strong>
          </div>

        </div>
      </Radio>


      {/* ================================================
          ANUALIDAD
      ================================================= */}

      {tieneAnualidad && (
        <Radio
          value={TIPOS_PAGO.ANUALIDAD}
          className="payment-type-option"
        >
          <div className="payment-type-option__content">

            <div>
              <strong>
                Pago de anualidad
              </strong>

              <span>
                Se aplicará exclusivamente al saldo
                de anualidades.
              </span>
            </div>

            <div className="payment-type-option__amount">

              <span>
                Requerido
              </span>

              <strong>
                {moneda(
                  infoLote?.monto_pago_requerido_anualidad
                )}
              </strong>

            </div>

          </div>
        </Radio>
      )}


      {/* ================================================
          ESCRITURACION
      ================================================= */}

      {infoLote?.tiempo_extra &&
        Number(
          infoLote?.saldo_escrituracion || 0
        ) > 0 && (

        <Radio
          value={TIPOS_PAGO.ESCRITURACION}
          className="payment-type-option"
        >
          <div className="payment-type-option__content">

            <div>
              <strong>
                Pago de escrituración
              </strong>

              <span>
                Se aplicará exclusivamente al plan
                independiente de escrituración.
              </span>
            </div>

            <div className="payment-type-option__amount">

              <span>
                Requerido
              </span>

              <strong>
                {moneda(
                  infoLote
                    ?.monto_pago_requerido_escrituracion
                )}
              </strong>

            </div>

          </div>
        </Radio>
      )}

    </Radio.Group>


    {/* ================================================
        RESUMEN
    ================================================= */}

    <div className="payment-type-summary">

      <span>
        Concepto seleccionado
      </span>

      <strong>
        {obtenerNombreTipoPago(
          tipoPagoSeleccionado
        )}
      </strong>


      <span>
        Monto requerido
      </span>

      <strong>
        {moneda(
          obtenerMontoRequeridoTipoPago(
            tipoPagoSeleccionado
          )
        )}
      </strong>

    </div>


    <div className="modal-actions">

      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
          setShowTipoPago(false);
        }}
      >
        Cancelar
      </button>


      <button
        type="button"
        className="btn btn-primary"
        onClick={confirmarTipoPago}
      >
        Continuar
      </button>

    </div>

  </div>
</Modal>

      {/* =====================================================
          MODAL EDITAR PAGO
      ====================================================== */}

      <Modal
        title="Editar pago"
        footer={null}
        open={showPagoEdit}
        onCancel={handleCloseModalPago}
        width={720}
      >
        <div className="geanova-form">
          <div className="form-grid form-grid--3">
            <div className="form-group">
              <label className="form-label">
                No. de pago
              </label>

              <InputNumber
                size="large"
                controls={false}
                value={selectedPago.no_pago}
                onChange={(value) => onChangedPago("no_pago", value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Pago realizado
              </label>

              <InputNumber
                size="large"
                controls={false}
                value={selectedPago.monto_pagado}
                formatter={formatValue}
                parser={parseValue}
                onChange={(value) => onChangedPago("monto_pagado", value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Sistema de pago
              </label>

              <Select
                size="large"
                value={sistemaPagoSelected}
                placeholder="Seleccione un sistema"
                options={sistemasPago.map((item) => ({
                  value: item.id,
                  label: item.Nombre,
                }))}
                onChange={setSistemaPagoSelected}
              />
            </div>
          </div>

          <div className="form-grid form-grid--3 client-edit-payment-dates">
            <div className="form-group">
              <label className="form-label">
                Fecha operación
              </label>

              <Input
                size="large"
                type="date"
                value={selectedPago.fecha_operacion || ""}
                onChange={(event) =>
                  onChangedPago("fecha_operacion", event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Fecha captura
              </label>

              <Input
                size="large"
                type="date"
                value={selectedPago.fecha || ""}
                onChange={(event) =>
                  onChangedPago("fecha", event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Fecha transferencia
              </label>

              <Input
                size="large"
                type="date"
                value={selectedPago.fecha_transferencia || ""}
                onChange={(event) =>
                  onChangedPago("fecha_transferencia", event.target.value)
                }
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModalPago}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveChangesPago}
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>

      {/* =====================================================
          MODAL EDITAR CLIENTE / SOLICITUD
      ====================================================== */}

      <Modal
        title="Editar información del cliente"
        footer={null}
        width={980}
        open={showModalEditar}
        onCancel={handleCloseModalEditar}
      >
        <div className="client-edit-modal geanova-form">
          {/* DATOS PERSONALES */}

          <section className="form-section">
            <div className="form-section__header">
              <div className="form-section__icon">
                <BiUser />
              </div>

              <div>
                <h3 className="form-section__title">
                  Datos personales
                </h3>

                <p className="form-section__description">
                  Nombre y domicilio del cliente.
                </p>
              </div>
            </div>

            <div className="form-section__body">
              <div className="form-grid form-grid--2">
                <Form.Item label="Primer nombre">
                  <Input
                    size="large"
                    value={primerNombre}
                    onChange={(e) => setPrimerNombre(e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Segundo nombre">
                  <Input
                    size="large"
                    value={segundoNombre}
                    onChange={(e) => setSegundoNombre(e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Primer apellido">
                  <Input
                    size="large"
                    value={primerApellido}
                    onChange={(e) => setPrimerApellido(e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Segundo apellido">
                  <Input
                    size="large"
                    value={segundoApellido}
                    onChange={(e) => setSegundoApellido(e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Calle">
                  <Input
                    size="large"
                    value={calle}
                    onChange={(e) => setCalle(e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Colonia">
                  <Input
                    size="large"
                    value={colonia}
                    onChange={(e) => setColonia(e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Número exterior">
                  <Input
                    size="large"
                    value={numeroExt}
                    onChange={(e) => setNumeroExt(e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Número interior">
                  <Input
                    size="large"
                    value={numeroInt}
                    onChange={(e) => setNumeroInt(e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Código postal">
                  <InputNumber
                    size="large"
                    controls={false}
                    value={codigoPostal}
                    onChange={setCodigoPostal}
                  />
                </Form.Item>
              </div>
            </div>
          </section>

          {/* CONTRATO */}

          <section className="form-section">
            <div className="form-section__header">
              <div className="form-section__icon">
                <BiReceipt />
              </div>

              <div>
                <h3 className="form-section__title">
                  Contrato
                </h3>

                <p className="form-section__description">
                  Condiciones económicas y de financiamiento.
                </p>
              </div>
            </div>

            <div className="form-section__body">
              <div className="form-grid form-grid--3">
                <Form.Item label="Monto contrato">
                  <InputNumber
                    size="large"
                    controls={false}
                    value={montoContrato}
                    formatter={formatValue}
                    parser={parseValue}
                    min={0}
                    onChange={(value) => {
                      setMontoContrato(value);
                      setNewAmortizacion(true);
                    }}
                  />
                </Form.Item>

                <Form.Item label="Cantidad de pagos">
                  <InputNumber
                    size="large"
                    controls={false}
                    disabled
                    value={cantidadPagos}
                  />
                </Form.Item>

                <Form.Item label="Anticipo">
                  <InputNumber
                    size="large"
                    controls={false}
                    min={0}
                    value={anticipo}
                    formatter={formatValue}
                    parser={parseValue}
                    onChange={setAnticipo}
                  />
                </Form.Item>

                <Form.Item label="Sistema de pago">
                  <Select
                    size="large"
                    value={sistemaPagoSelectedModal}
                    placeholder="Sistema de pago"
                    options={sistemasPagoModal.map((item) => ({
                      value: item.id,
                      label: item.Nombre,
                    }))}
                    onChange={setSistemaPagoSelectedModal}
                  />
                </Form.Item>

                <Form.Item label="Financiamiento">
                  <Select
                    size="large"
                    value={financiamientoId}
                    placeholder="Financiamiento"
                    options={OPCIONES_FINANCIAMIENTO}
                    onChange={(value) => {
                      setFinanciamientoId(value);
                      setNewAmortizacion(true);
                    }}
                  />
                </Form.Item>

                <Form.Item label="Plazo">
                  <Select
                    size="large"
                    value={plazoId}
                    placeholder="Plazo"
                    options={plazos.map((item) => ({
                      value: item.id,
                      label: item.descripcion,
                    }))}
                    onChange={(value) => {
                      setPlazoId(value);
                      setNewAmortizacion(true);
                    }}
                  />
                </Form.Item>
              </div>

              <div className="client-edit-special-row">
                <Checkbox
                  checked={agregarLuz}
                  onChange={() => {
                    setAgregarLuz(!agregarLuz);

                    if (clienteInfoEdit?.tiene_luz) {
                      restarLuz(infoLote?.superficie);
                    } else {
                      calcularLuz(infoLote?.superficie);
                    }
                  }}
                >
                  {clienteInfoEdit?.tiene_luz
                    ? "Quitar suministro de luz"
                    : "Agregar suministro de luz"}
                </Checkbox>

                {agregarLuz && (
                  <span className="client-edit-hint">
                    Impacto estimado: {moneda(totalImpuestoLuz)}
                  </span>
                )}
              </div>

              <div className="client-edit-date-row">
                <div>
                  <span className="form-label">
                    Fecha solicitud
                  </span>

                  <strong>
                    {fechaSolicitud || "—"}
                  </strong>
                </div>

                <Checkbox
                  checked={cambiarFecha}
                  onChange={(event) =>
                    setCambiarFecha(event.target.checked)
                  }
                >
                  Cambiar fecha
                </Checkbox>

                {cambiarFecha && (
                  <Input
                    type="date"
                    size="large"
                    value={fechaSolicitud || ""}
                    onChange={(event) => {
                      setFechaSolicitud(event.target.value);
                      setNewAmortizacion(true);
                    }}
                  />
                )}
              </div>
            </div>
          </section>

          {/* ESCRITURACIÓN */}

          <section className="form-section">
            <div className="form-section__header">
              <div className="form-section__icon">
                <BiFile />
              </div>

              <div>
                <h3 className="form-section__title">
                  Escrituración
                </h3>

                <p className="form-section__description">
                  Agrega, cambia o elimina la configuración de escrituración.
                </p>
              </div>
            </div>

            <div className="form-section__body">
              {escrituracionBloqueada && (
                <div className="form-alert form-alert--warning">
                  La escrituración ya tiene pagos aplicados. Para proteger la
                  contabilidad, no puede eliminarse ni cambiarse desde esta
                  pantalla.
                </div>
              )}

              <Form.Item label="Tipo de escrituración">
                <Radio.Group
                  className="sale-writing-options"
                  value={tipoEscrituracionEdit}
                  disabled={escrituracionBloqueada}
                  onChange={(event) => {
                    const value = Number(event.target.value);

                    setTipoEscrituracionEdit(value);
                    setNewAmortizacion(true);

                    if (value === TIPOS_ESCRITURACION.SIN_ESCRITURACION) {
                      setTiempoExtraEdit(false);
                      setCantidadPagosEscrituracionEdit(null);
                      setFinanciamientoEscrituracionEdit(null);
                      setFechaInicioEscrituracionEdit(null);
                    }
                  }}
                >
                  <Radio.Button value={TIPOS_ESCRITURACION.SIN_ESCRITURACION}>
                    Sin escrituración
                  </Radio.Button>

                  <Radio.Button
                    value={TIPOS_ESCRITURACION.PRECIO_FIJO}
                    disabled={
                      escrituracionBloqueada ||
                      !Number(infoLote?.escrituracion_fija_terreno || 0)
                    }
                  >
                    Precio fijo
                  </Radio.Button>

                  <Radio.Button
                    value={TIPOS_ESCRITURACION.POR_M2}
                    disabled={
                      escrituracionBloqueada ||
                      !Number(infoLote?.escrituracion_m2_terreno || 0)
                    }
                  >
                    Por m²
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>

              {tipoEscrituracionEdit !== 0 && (
                <>
                  <div className="client-writing-preview">
                    <div>
                      <span>Monto estimado</span>
                      <strong>
                        {moneda(montoEscrituracionPreview)}
                      </strong>
                    </div>

                    {tipoEscrituracionEdit === TIPOS_ESCRITURACION.POR_M2 && (
                      <div>
                        <span>Cálculo</span>
                        <strong>
                          {numero(infoLote?.superficie)} m² × {" "}
                          {moneda(infoLote?.escrituracion_m2_terreno)}/m²
                        </strong>
                      </div>
                    )}
                  </div>

                  <Form.Item>
                    <Checkbox
                      checked={tiempoExtraEdit}
                      disabled={escrituracionBloqueada}
                      onChange={(event) => {
                        const checked = event.target.checked;

                        setTiempoExtraEdit(checked);
                        setNewAmortizacion(true);

                        if (!checked) {
                          setCantidadPagosEscrituracionEdit(null);
                          setFinanciamientoEscrituracionEdit(null);
                          setFechaInicioEscrituracionEdit(null);
                        }
                      }}
                    >
                      Cobrar escrituración en un plan independiente
                    </Checkbox>
                  </Form.Item>

                  {tiempoExtraEdit && (
                    <div className="form-grid form-grid--3">
                      <Form.Item label="Cantidad de pagos">
                        <InputNumber
                          size="large"
                          controls={false}
                          min={1}
                          disabled={escrituracionBloqueada}
                          value={cantidadPagosEscrituracionEdit}
                          onChange={setCantidadPagosEscrituracionEdit}
                        />
                      </Form.Item>

                      <Form.Item label="Frecuencia">
                        <Select
                          size="large"
                          disabled={escrituracionBloqueada}
                          value={financiamientoEscrituracionEdit}
                          placeholder="Frecuencia"
                          options={OPCIONES_FINANCIAMIENTO}
                          onChange={setFinanciamientoEscrituracionEdit}
                        />
                      </Form.Item>

                      <Form.Item label="Primer cobro">
                        <Input
                          size="large"
                          type="date"
                          disabled={escrituracionBloqueada}
                          value={fechaInicioEscrituracionEdit || ""}
                          onChange={(event) =>
                            setFechaInicioEscrituracionEdit(event.target.value)
                          }
                        />
                      </Form.Item>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModalEditar}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={actualizarDatos}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </Modal>

      {/* =====================================================
          MODAL CONGELAR
      ====================================================== */}

      <Modal
        title="Congelar cliente"
        footer={null}
        open={showCongelar}
        onCancel={handleCloseCongelar}
        width={520}
      >
        <Form
          layout="vertical"
          name="congelarForm"
          form={forms}
          onFinish={handleSubmitCongelar}
        >
          <Form.Item
            name="fechaCongelar"
            label="Fecha hasta la que permanecerá congelado"
            rules={[
              {
                required: true,
                message: "Debe ingresar una fecha.",
              },
              { validator: validarFecha },
            ]}
          >
            <DatePicker
              format={DATE_FORMAT}
              locale={locale}
              size="large"
              className="w-100"
            />
          </Form.Item>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseCongelar}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Guardar
            </button>
          </div>
        </Form>
      </Modal>

      {/* =====================================================
          IMÁGENES
      ====================================================== */}

      <ImagenesLoteModal
        visible={showImagenes}
        onClose={() => setShowImagenes(false)}
        loteId={infoLote?.lote_id || null}
        terrenoId={infoLote?.terreno_id || null}
      />
    </div>
  );
}

/* =========================================================
   KPI
   ========================================================= */

function Kpi({ label, value, danger = false }) {
  return (
    <div className={danger ? "kpi-card kpi-card--danger" : "kpi-card"}>
      <span className="kpi-card__label">
        {label}
      </span>

      <strong className="kpi-card__value">
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   DATO
   ========================================================= */

function Dato({ label, value }) {
  return (
    <div className="client-data-item">
      <span>
        {label}
      </span>

      <strong>
        {value === null || value === undefined || value === ""
          ? "—"
          : value}
      </strong>
    </div>
  );
}

/* =========================================================
   HISTORIAL DE PAGOS
   ========================================================= */

function HistorialPagos({
  title,
  pagos,
  cookiePermisos,
  onEdit,
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const inicio = (page - 1) * pageSize;
  const visibles = pagos.slice(inicio, inicio + pageSize);

  useEffect(() => {
    const totalPaginas = Math.max(
      1,
      Math.ceil(pagos.length / pageSize)
    );

    if (page > totalPaginas) {
      setPage(totalPaginas);
    }
  }, [pagos.length, page, pageSize]);

  return (
    <section className="card client-payment-card">
      <div className="card__header">
        <div>
          <h2 className="card__title">
            {title}
          </h2>

          <p className="card__description">
            Historial de movimientos registrados.
          </p>
        </div>

        <span className="badge">
          {pagos.length} registros
        </span>
      </div>

      {pagos.length > 0 ? (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Folio</th>
                  <th>Operación</th>
                  <th>Captura</th>
                  <th>Requerido</th>
                  <th>Realizado</th>
                  <th>Saldo</th>
                  <th>Sistema</th>
                  <th>Estatus</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {visibles.map((pago, index) => (
                  <tr key={pago.pago_id || `${pago.folio}-${index}`}>
                    <td>{pago.no_pago || "—"}</td>
                    <td>{pago.folio || "—"}</td>
                    <td>{pago.fecha_operacion || "—"}</td>
                    <td>{pago.fecha || "—"}</td>
                    <td>{moneda(pago.monto_requerido)}</td>
                    <td>{moneda(pago.monto_pagado)}</td>
                    <td>{moneda(pago.saldo_pendiente)}</td>
                    <td>{pago.sistema_pago || "—"}</td>
                    <td>{pago.estatus_pago || "—"}</td>

                    <td className="table-actions">
                      {usuario_id <= 2 && (
                        <Tooltip title="Editar pago">
                          <button
                            type="button"
                            className="btn btn-icon"
                            disabled={Number(cookiePermisos || 0) < 2}
                            onClick={() => onEdit(pago)}
                          >
                            <FaPencilAlt />
                          </button>
                        </Tooltip>
                      )}

                      <Tooltip title="Generar recibo">
                        <button
                          type="button"
                          className="btn btn-icon"
                          disabled={Number(cookiePermisos || 0) < 1}
                          onClick={() => {
                            window.open(
                              `https://api.santamariadelaluz.com/iPagos/recibo/${pago.pago_id}.pdf`,
                              "_blank"
                            );
                          }}
                        >
                          <FaPrint />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sale-pagination">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={pagos.length}
              showSizeChanger
              pageSizeOptions={[5, 10, 25]}
              onChange={(newPage, newPageSize) => {
                setPage(newPage);
                setPageSize(newPageSize);
              }}
            />
          </div>
        </>
      ) : (
        <div className="empty-state">
          <strong>
            Sin pagos registrados
          </strong>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function moneda(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function numero(value) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatValue(value) {
  if (value === "" || value === undefined || value === null) {
    return "";
  }

  return `$ ${Number(value).toFixed(2)}`.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
}

function parseValue(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).replace(/\$\s?|,/g, "");
}

function normalizarFechaInput(value) {
  if (!value) return null;

  const texto = String(value);

  if (/^\d{4}-\d{2}-\d{2}/.test(texto)) {
    return texto.substring(0, 10);
  }

  const partes = texto.split("/");

  if (partes.length === 3) {
    return `${partes[2]}-${String(partes[1]).padStart(2, "0")}-${String(
      partes[0]
    ).padStart(2, "0")}`;
  }

  return texto;
}

function obtenerSistemaPagoIdActual(infoLote, sistemas) {
  if (!infoLote) return null;

  const encontrado = sistemas.find(
    (item) => item.Nombre === infoLote.sistema_pago
  );

  return encontrado ? encontrado.id : null;
}


function obtenerEstadoGeneral(infoLote) {
  if (!infoLote) return "Sin estado";

  if (
    infoLote.situacion_solicitud === "Liquidado" &&
    infoLote.tiempo_extra &&
    !infoLote.liquidado_total
  ) {
    return "Escrituración pendiente";
  }

  return infoLote.situacion_solicitud || "Sin estado";
}

function obtenerEstadoClase(estado) {
  switch (estado) {
    case "Liquidado":
    case "Al Corriente":
      return "success";

    case "Atrasado":
    case "Vencido":
      return "danger";

    case "Adelantado":
    case "Escrituración pendiente":
      return "warning";

    default:
      return "neutral";
  }
}

function mostrarError(mensaje) {
  Swal.fire({
    title: "Error",
    text: mensaje,
    icon: "error",
    confirmButtonText: "Aceptar",
    buttonsStyling: false,
    customClass: {
      popup: "swal-geanova",
      confirmButton: "swal-geanova-confirm",
    },
  });
}