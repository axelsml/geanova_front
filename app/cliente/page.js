"use client";
import { formatPrecio, formatDate } from "@/helpers/formatters";
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
  Input,
  Checkbox,
  Tooltip,
  Badge,
} from "antd";
const { Text } = Typography;
import { useContext, useEffect, useState } from "react";
import {
  FaArrowCircleLeft,
  FaPrint,
  FaPencilAlt,
  FaRegTimesCircle,
  FaRegCheckCircle,
} from "react-icons/fa";
import { LoadingContext } from "@/contexts/loading";
import CancelarSolicitud from "@/components/CancelarSolicitud";
import queryString from "query-string";
import { FaFilePdf } from "react-icons/fa6";
import { SiOpslevel } from "react-icons/si";
import { usuario_id } from "@/helpers/user";
import locale from "antd/lib/date-picker/locale/es_ES"; // Importa el locale que desees

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
import { getCookiePermisos } from "@/helpers/valorPermisos";
import { getCookie } from "@/helpers/Cookies";
import cobranzaService from "@/services/cobranzaService";
import plazosService from "@/services/plazosService";

export default function ClientesInfo() {
  const [nuevaVenta, setNuevaVenta] = useState(false);
  const [nuevoPago, setNuevoPago] = useState(false);
  const [errorNuevoPago, setErrorNuevoPago] = useState(false);
  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const [changeState, setChangeState] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const Panel = Collapse.Panel;
  const { setIsLoading } = useContext(LoadingContext);
  const [terrenos, setTerrenos] = useState(null);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [lotes, setLotes] = useState(null);
  const [loteSelected, setLoteSelected] = useState(null);

  const [tieneLuzPantalla, setTieneLuzPantalla] = useState(null);
  const [clienteInfo, setClienteInfo] = useState([]);
  const [info_cliente, setInfoCliente] = useState(null);
  const [imagenes, verImagenes] = useState(false);
  const [fecha_proximo_pago, setProximoPago] = useState(null);

  const [show, setShow] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showCongelar, setShowCongelar] = useState(false);
  const [congelarFecha, setCongelarFecha] = useState(null);

  const [selectedPago, setSelectedPago] = useState({
    pago_id: null,
    no_pago: null,
    monto_pagado: null,
    fecha_operacion: null,
    fecha: null,
    fecha_transferencia: null,
  });
  const [sistemas_pago, setSistemasPago] = useState(null);
  const [plazos, setPlazos] = useState(null);
  const [sistemaPagoSelected, setSistemaPagoSelected] = useState(null);

  const [info_lote, setInfoLote] = useState(null);

  const [primerNombre, setPrimerNombre] = useState(null);
  const [segundoNombre, setSegundoNombre] = useState(null);
  const [primerApellido, setPrimerApellido] = useState(null);
  const [segundoApellido, setSegundoApellido] = useState(null);
  const [montoContrato, setMontoContrato] = useState(null);
  const [cantidadPagos, setCantidadPagos] = useState(null);
  const [anticipo, setAnticipo] = useState(null);

  const [sistemas_pagoModal, setSistemasPagoModal] = useState(null);
  const [sistemaPagoSelectedModal, setSistemaPagoSelectedModal] =
    useState(null);

  const [calle, setCalle] = useState(null);
  const [colonia, setColonia] = useState(null);
  const [numeroExt, setNumeroExt] = useState(null);
  const [numeroInt, setNumeroInt] = useState(null);
  const [codigoPostal, setCodigoPostal] = useState(null);
  const [totalImpuestoLuz, setTotalImpuestoLuz] = useState(0);
  const [agregarLuz, setAgregarLuz] = useState(false);
  const [tieneLuz, setTieneLuz] = useState(false);
  const [financiamientoId, setFinanciamientoId] = useState(0);
  const [financiamientoNombre, setFinanciamientoNombre] = useState(null);
  const [plazoId, setPlazoId] = useState(null);
  const [plazoNombre, setPlazoNombre] = useState(null);
  const [fechaSolicitud, setFechaSolicitud] = useState(null);
  const [modalKey, setModalKey] = useState(0);
  const [cambiarFecha, setCambiarFecha] = useState(false);
  const [newAmortizacion, setNewAmortizacion] = useState(false);

  const [cookiePermisos, setCookiePermisos] = useState([]);
  const [clienteCongelado, setClienteCongelado] = useState([]);

  const opcionFinanciamiento = [
    { index: 0, id: 1, nombre: "Mensual" },
    { index: 1, id: 2, nombre: "Quincenal" },
    { index: 2, id: 3, nombre: "Semanal" },
  ];

  const { Option } = Select;

  const [forms] = Form.useForm();
  useEffect(() => {
    // Verifica que se esté ejecutando en el lado del cliente
    if (typeof window !== "undefined") {
      const storedUsuario = localStorage.getItem("usuario");
      if (storedUsuario) {
        setUsuarioInfo(JSON.parse(storedUsuario));
      }
    }
  }, []);

  useEffect(() => {
    pagosService.getSistemasPago(setSistemasPago, onError);
    // se necesita el nombre de la pantalla o un callback para setear el valor
    getCookiePermisos("informacion del cliente", setCookiePermisos);
  }, []);

  let shouldSearch = false;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldSearch = params.get("shouldSearch");
    if (shouldSearch) {
      const terrenoId = params.get("terreno_id");
      const loteId = params.get("lote_id");

      lotesService.getClienteByLote(
        terrenoId,
        loteId,
        onInfoClienteCargado,
        onError
      );
    }
  }, [shouldSearch]);

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

  useEffect(() => {
    if (errorNuevoPago) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No se pudo encontrar la sesión, favor de iniciar sesión antes de continuar.",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
    }
  }, [errorNuevoPago]);

  const CreateNuevaVenta = () => {
    setNuevaVenta(!nuevaVenta);
  };

  const CreateNuevoPago = () => {
    const cookieUsuario = getCookie("usuario");

    cookieUsuario
      .then((cookie) => {
        if (!cookie || !cookie.value) {
          // Si cookie.value es null o false, activar nuevoPago
          setErrorNuevoPago(!errorNuevoPago);
        } else {
          // Si cookie.value es true, desactivar nuevoPago
          setNuevoPago(!nuevoPago);
        }
      })
      .catch((error) => {
        console.error("Error al obtener la cookie:", error); // Manejar cualquier error
      });
  };

  const BuscarInfoLote = () => {
    verImagenes(false);
    setInfoCliente(null);
    setInfoLote(null);
    setProximoPago(null);
    setIsLoading(true);
    setFinanciamientoId(0);
    setFinanciamientoNombre(null);
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
      setTieneLuzPantalla(data.tiene_luz);
      plazosService.getPlazos(
        { terreno_id: data.info_lote.terreno_id },
        setPlazos,
        onError
      );
      setPlazoId(data.info_lote.plazo_id);
      setPlazoNombre(data.info_lote.plazo);
      setFinanciamientoId(data.info_lote.financiamiento_id);
      setFinanciamientoNombre(data.info_lote.financiamiento_nombre);
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
      nueva_cantidad_pagos: cantidadPagos,
    };
    debugger;
    ventasService.borrarAmortizacion(params, onAmortizacionBorrada, onError);
  }
  async function onAmortizacionBorrada(data) {
    if (data.success) {
      window.open(
        `https://api.santamariadelaluz.com/iUsuarios/${info_lote.solicitud_id}.pdf`
        // `http://localhost:3000/iUsuarios/${info_lote.solicitud_id}.pdf`
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

  const handleCloseModalEditar = () => {
    setShowModalEditar(false);
    setFinanciamientoId(0);
    setFinanciamientoNombre(null);
    setFechaSolicitud(null);
    setModalKey(modalKey + 1);
    setCambiarFecha(false);
    setNewAmortizacion(false);
  };

  function handleCloseCongelar() {
    setShowCongelar(false);
    forms.resetFields();
  }

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

  async function actualizarDatos() {
    let form = {
      solicitud_id: info_lote.solicitud_id,
      idCliente: info_cliente.id,
      primerNombre: primerNombre,
      segundoNombre: segundoNombre,
      primerApellido: primerApellido,
      segundoApellido: segundoApellido,
      calle: calle,
      colonia: colonia,
      numero_ext: numeroExt,
      numero_int: numeroInt,
      cp: codigoPostal,
      montoContrato: montoContrato,
      cantidadPagos: cantidadPagos,
      anticipo: anticipo,
      sistemaPago: sistemaPagoSelectedModal,
      montoLuz: totalImpuestoLuz,
      tieneLuz: tieneLuz,
      financiamiento_id: financiamientoId,
      fecha_solicitud: fechaSolicitud,
      plazoId: plazoId,
    };

    debugger;
    await Swal.fire({
      title: "Guardar cambios en la información del cliente?",
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        lotesService.updateClienteByLote(form, onClienteActualizado, onError);
      }
    });
  }

  function datosModal() {
    setIsLoading(true);

    pagosService.getSistemasPago(setSistemasPagoModal, onError);

    lotesService
      .cargarClienteInfo(info_lote.solicitud_id, setClienteInfo, onError)
      .then(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (Object.keys(clienteInfo).length > 0) {
      let infoClienteNombre = clienteInfo.nombre[0];
      setPrimerNombre(infoClienteNombre.primer_nombre);
      setSegundoNombre(infoClienteNombre.segundo_nombre);
      setPrimerApellido(infoClienteNombre.primer_apellido);
      setSegundoApellido(infoClienteNombre.segundo_apellido);
      let infoClienteDomicilio = clienteInfo.domicilio[0];
      setCalle(infoClienteDomicilio.calle);
      setColonia(infoClienteDomicilio.colonia);
      setNumeroExt(infoClienteDomicilio.numero_ext);
      setNumeroInt(infoClienteDomicilio.numero_int);
      setCodigoPostal(infoClienteDomicilio.cp);

      //congelar_cliente
      setClienteCongelado(info_lote.congelar_cliente);

      setFechaSolicitud(info_lote.fecha_solicitud);
      setMontoContrato(info_lote.monto_contrato);
      setCantidadPagos(info_lote.cantidad_pagos);
      setAnticipo(info_lote.anticipo);
      if (info_lote.sistema_pago == "Transferencia") {
        setSistemaPagoSelectedModal(2);
      } else {
        setSistemaPagoSelectedModal(1);
      }

      setAgregarLuz(false);
    }
  }, [clienteInfo]);

  function calcularLuz(superficie) {
    let calculo;
    calculo = 25900 / 119;
    calculo = calculo * superficie;
    setTotalImpuestoLuz(calculo);
    let total;
    if (!agregarLuz) {
      total = montoContrato + calculo;
      setTieneLuz("agregar");
      setMontoContrato(total);
    } else {
      total = montoContrato - calculo;
      setMontoContrato(total);
    }
  }

  function restarLuz(superficie) {
    let calculo;
    calculo = 25900 / 119;
    calculo = calculo * superficie;
    setTotalImpuestoLuz(calculo);
    let total;
    if (!agregarLuz) {
      total = montoContrato - calculo;
      setTieneLuz("quitar");
      setMontoContrato(total);
    } else {
      total = montoContrato + calculo;
      setMontoContrato(total);
    }
  }

  const formatValue = (value) => {
    if (value === "" || value === undefined) return "";
    const fixedValue = Number(value).toFixed(2);
    return `$ ${fixedValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseValue = (value) => {
    return value.replace(/\$\s?|(,*)/g, "");
  };

  const onClienteActualizado = (data) => {
    setShowModalEditar(false);
    setCantidadPagos(data.cantidad_pagos);
    // if (data.montoModificado) {
    //Borrar mortizaciones con la funcion borrarAmortizacion()
    // }
    if (newAmortizacion) {
      borrarAmortizacion();
    }
    setIsLoading(false);
    if (data.type == "success") {
      BuscarInfoLote();
      Swal.fire({
        title: "Cliente actualizado con Éxito",
        icon: "success",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: data.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
    }
  };

  const customTitle = (
    <Row justify={"center"}>
      <Typography.Title level={3}>
        Editar Información del Cliente
      </Typography.Title>
    </Row>
  );

  const customTitleCongelar = (
    <Row justify={"center"}>
      <Typography.Title level={3}>Congelar Cliente</Typography.Title>
    </Row>
  );

  async function actualizarPerdonarInteres() {
    let form = {
      solicitud_id: info_lote.solicitud_id,
    };
    let titulo;
    if (info_lote.perdonar_interes) {
      titulo = "Aplicar interés de este cliente?";
    } else {
      titulo = "Perdonar interés de este cliente?";
    }
    await Swal.fire({
      title: titulo,
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        lotesService
          .updatePerdonarInteres(form, onClienteActualizado, onError)
          .then(() => {
            setIsLoading(false);
          });
      }
    });
  }
  const dateFormat = "DD/MM/YYYY";

  function congelarCliente() {
    // setIsLoading(true);
    if (info_lote.fecha_congelamiento != null) {
      Swal.fire({
        title: "¿Desea descongelar este cliente?",
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
          let data = {
            solicitud_id: info_lote.solicitud_id,
          };
          console.log("data: ", data);

          cobranzaService
            .descongelarCliente(data, onClienteCongelado, onError)
            .then((result) => {
              setIsLoading(false);
            });
        }
      });
    } else {
      // ! modal congelar
      setShowCongelar(true);
    }

    // cobranzaService.congelarCliente(params, onClienteActualizado, onError);
  }

  function handleSubmitCongelar(values) {
    // Obtener el valor de fecha del objeto
    let fechaCongelar = values.fechaCongelar;
    let today = new Date();

    // Asegurarse de que el valor de fechaCongelar sea un objeto de tipo Date
    let fecha = new Date(fechaCongelar);

    // Formatear la fecha en DD/MM/YYYY
    let dia = String(fecha.getDate()).padStart(2, "0");
    let mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
    let año = fecha.getFullYear();

    let fechaFormateada = `${dia}/${mes}/${año}`;
    let datos = {
      fechaCongelar: today,
      fechaTerminaCongelamiento: fechaFormateada,
      solicitud_id: info_lote.solicitud_id,
    };

    cobranzaService
      .congelarCliente(datos, onClienteCongelado, onError)
      .then((result) => {
        setIsLoading(false);
        handleCloseCongelar();
      });
  }

  const validarFecha = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Debe ingresar una fecha."));
    }

    // Fecha actual
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establecer la hora en 00:00:00 para comparar solo las fechas

    // Fecha límite (3 meses desde hoy)
    const limite = new Date();
    limite.setMonth(limite.getMonth() + 3);

    // Validar si la fecha seleccionada es menor o igual a hoy
    if (value.toDate() <= today) {
      return Promise.reject(
        new Error("La fecha debe ser mayor a la fecha actual.")
      );
    }

    // Validar si la fecha seleccionada es mayor que la fecha límite (3 meses)
    if (value.toDate() > limite) {
      return Promise.reject(
        new Error("La fecha no puede ser mayor a 3 meses desde hoy.")
      );
    }

    // Si la fecha está dentro del rango permitido
    return Promise.resolve();
  };

  function onClienteCongelado(params) {
    BuscarInfoLote();

    console.log("congela2");
  }

  return (
    <div className="p-8 grid gap-4">
      <Row justify={"center"}>
        <Text className="titulo_pantallas" style={{ fontSize: "24px" }}>
          INFORMACION DEL CLIENTE
        </Text>
      </Row>
      <Row
        justify={"center"}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div style={{ display: "flex", textAlign: "center", margin: "0 auto" }}>
          <Col
            style={{
              margin: "0.5rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text>Proyecto</Text>
            <Select
              style={{ width: 150 }}
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
          </Col>
          <Col
            style={{
              margin: "0.5rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Text>Lote</Text>
            <Select
              style={{ width: 150 }}
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
          </Col>
        </div>
        <div style={{ margin: "0.5rem auto" }}>
          <Button
            className="boton"
            disabled={terrenoSelected == null || loteSelected == null}
            onClick={BuscarInfoLote}
          >
            Buscar
          </Button>
        </div>
      </Row>
      {info_cliente != null && (
        <Row justify={"center"}>
          <Col xs={24} sm={20} md={16} lg={14} xl={14} xxl={14}>
            <TableContainer>
              <Table className="formulario_alterno" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2} style={{ textAlign: "right" }}>
                      <Button
                        className="boton renglon_otro_color"
                        disabled={usuarioInfo.id > 2}
                        onClick={() => {
                          datosModal();
                          setShowModalEditar(true);
                        }}
                        size="large"
                      >
                        <FaPencilAlt className="m-auto" size={"20px"} />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className="renglon_otro_color">
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Nombre Cliente: {info_cliente.nombre_completo}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Cliente Desde: {info_cliente.cliente_desde}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Domicilio: {info_cliente.domicilio}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Telefono 1: {info_cliente.telefono_celular}
                    </TableCell>
                  </TableRow>
                  <TableRow className="renglon_otro_color">
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Telefono 2: {info_cliente.telefono_celular_2}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Fecha Nacimiento: {info_cliente.fecha_nacimiento}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Lotes Adquiridos: {info_cliente.lotes_adquiridos}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      No. Lote: {info_lote.lote}
                    </TableCell>
                  </TableRow>
                  <TableRow className="renglon_otro_color">
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Superficie(M2): {info_lote.superficie}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Proyecto: {info_lote.terreno}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Fecha De Solicitud: {info_lote.fecha_solicitud}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Monto Contrato: ${formatPrecio(info_lote.monto_contrato)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="renglon_otro_color">
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Cantidad Pagos: {info_lote.cantidad_pagos}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Anticipo: $
                      {info_lote.anticipo
                        ? formatPrecio(info_lote.anticipo)
                        : 0}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Sistema De Pago: {info_lote.sistema_pago}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Plazo: {info_lote.plazo}
                    </TableCell>
                  </TableRow>
                  <TableRow className="renglon_otro_color">
                    <TableCell style={{ color: "#FFFFFF" }}>
                      {" "}
                      Monto Requerido: $
                      {formatPrecio(info_lote.monto_pago_requerido)}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>Estado:</span>
                        <div>
                          <Button
                            disabled
                            size={"small"}
                            shape="round"
                            style={{
                              backgroundColor:
                                info_lote.situacion_solicitud_color,
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
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      {" "}
                      Monto Interés: $
                      {info_lote.interes
                        ? formatPrecio(info_lote.interes)
                        : "0"}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Monto Pagado: ${formatPrecio(info_lote.monto_pagado)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="renglon_otro_color">
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Monto Vencido: ${formatPrecio(info_lote.monto_vencido)}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Pagos Vencidos: {info_lote.cantidad_vencidos}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Pagos Adelantados: {info_lote.cantidad_adelantados}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Pagos Completados: {info_lote.pagos_completados}
                    </TableCell>
                  </TableRow>
                  <TableRow className="renglon_otro_color">
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Pagos Realizados: {info_lote.pagos_dados}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Pagos Transcurridos: {info_lote.pagos_esperados}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Saldo: ${formatPrecio(info_lote.saldo)}
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF" }}>
                      Tiene Luz:{" "}
                      {tieneLuzPantalla ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: 8,
                          }}
                        >
                          <FaRegCheckCircle
                            style={{ color: "#22bb33", marginRight: 8 }}
                          />
                          Este contrato sí cuenta con suministro de electricidad
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: 8,
                          }}
                        >
                          <FaRegTimesCircle
                            style={{ color: "red", marginRight: 8 }}
                          />
                          Este contrato no cuenta con suministro de electricidad
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Col>
        </Row>
      )}

      {info_cliente != null && info_lote != null && (
        <Row justify={"center"} style={{ justifyContent: "space-evenly" }}>
          <Button
            className="boton"
            size={"large"}
            disabled={cookiePermisos >= 1 ? false : true}
            onClick={CreateNuevoPago}
          >
            Nuevo Pago
          </Button>

          <Button
            className="boton"
            //disabled={cookiePermisos > 2 ? false : true}
            size={"large"}
            onClick={() => {
              borrarAmortizacion();
            }}
          >
            Borrar Amortizacion
          </Button>

          <Button
            className="boton"
            disabled={cookiePermisos >= 1 ? false : true}
            size="large"
            onClick={() => {
              borrarAmortizacion();
            }}
          >
            Amortización
          </Button>

          <Button
            className="boton"
            disabled={cookiePermisos >= 1 ? false : true}
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

          <Button
            className="boton"
            disabled={cookiePermisos >= 1 ? false : true}
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

          <Button
            className="boton"
            onClick={() => {
              actualizarPerdonarInteres();
            }}
            disabled={usuarioInfo.id > 2}
            size="large"
          >
            {info_lote.perdonar_interes
              ? `Aplicar Interés`
              : `Perdonar Interés`}
          </Button>

          <Button
            className="boton"
            onClick={() => {
              congelarCliente();
            }}
            disabled={usuarioInfo.id > 2}
            size="large"
          >
            {info_lote.fecha_congelamiento != null
              ? `Descongelar Cliente`
              : `Congelar Cliente`}
          </Button>

          <CancelarSolicitud
            solicitudId={info_lote.solicitud_id}
            loteId={info_lote.lote_id}
            fechaCancelacion={info_lote.fecha_cancelacion}
          />
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
                  <TableCell>
                    <p>Estatus Pago</p>
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
                      <TableCell>${formatPrecio(pago.monto_pagado)}</TableCell>
                      <TableCell>
                        ${formatPrecio(pago.saldo_pendiente)}
                      </TableCell>
                      <TableCell>{pago.sistema_pago}</TableCell>
                      <TableCell>{pago.estatus_pago}</TableCell>
                      <TableCell>
                        {usuario_id <= 2 && (
                          <Tooltip title="Haz clic aquí para editar este pago">
                            <Button
                              className="boton"
                              disabled={cookiePermisos >= 2 ? false : true}
                              key={pago}
                              onClick={() => {
                                setShow(true);
                                handleModalPago(pago);
                              }}
                              size="large"
                            >
                              <FaPencilAlt className="m-auto" size={"20px"} />
                            </Button>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Haz clic aquí para generar recibo de este pago">
                          <Button
                            className="boton"
                            disabled={cookiePermisos >= 1 ? false : true}
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
                        </Tooltip>
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

      <Modal
        key={modalKey}
        title={customTitle}
        footer={null}
        width={800}
        open={showModalEditar}
        onCancel={() => handleCloseModalEditar()}
      >
        <Form
          labelCol={{ span: 10 }}
          labelAlign={"left"}
          style={{ margin: "0 auto" }}
        >
          <Row style={{ paddingTop: 10, justifyContent: "space-evenly" }}>
            <Col
              xs={24}
              sm={20}
              md={16}
              lg={14}
              xl={14}
              xxl={14}
              style={{
                maxWidth: 300,
              }}
            >
              <Form.Item label="Primer Nombre">
                <Input
                  placeholder="Primer Nombre"
                  value={primerNombre}
                  onChange={(e) => {
                    setPrimerNombre(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label="Segundo Nombre">
                <Input
                  placeholder="Segundo Nombre"
                  value={segundoNombre}
                  onChange={(e) => {
                    setSegundoNombre(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label="Primer Apellido">
                <Input
                  placeholder="Primer Apellido"
                  value={primerApellido}
                  onChange={(e) => {
                    setPrimerApellido(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label="Segundo Apellido">
                <Input
                  placeholder="Segundo Apellido"
                  value={segundoApellido}
                  onChange={(e) => {
                    setSegundoApellido(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label="Monto Contrato">
                <InputNumber
                  placeholder="Monto Contrato"
                  style={{ width: "100%" }}
                  value={montoContrato}
                  formatter={formatValue}
                  parser={parseValue}
                  step={0.01}
                  min={0}
                  onChange={(e) => {
                    setMontoContrato(e);
                    setNewAmortizacion(true);
                  }}
                />
              </Form.Item>
              <Form.Item label="Cantidad Pagos">
                <InputNumber
                  placeholder="Cantidad Pagos"
                  style={{ width: "100%" }}
                  value={cantidadPagos}
                  disabled={true}
                  onChange={(e) => {
                    setCantidadPagos(e);
                    setNewAmortizacion(true);
                  }}
                />
              </Form.Item>
              <Form.Item label="Anticipo">
                <InputNumber
                  placeholder="Anticipo"
                  style={{ width: "100%" }}
                  value={anticipo}
                  onChange={(e) => {
                    setAnticipo(e);
                  }}
                />
              </Form.Item>
              <Form.Item label="Sistema de Pago">
                <Select
                  showSearch
                  placeholder="Sistema de pago"
                  optionLabelProp="label"
                  value={sistemaPagoSelectedModal}
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    setSistemaPagoSelectedModal(value);
                  }}
                >
                  {sistemas_pagoModal?.map((item, index) => (
                    <Option key={index} value={item.id} label={item.Nombre}>
                      {item?.Nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={20}
              md={16}
              lg={14}
              xl={14}
              xxl={14}
              style={{
                maxWidth: 300,
              }}
            >
              <Form.Item label="Calle">
                <Input
                  placeholder="Calle"
                  value={calle}
                  onChange={(e) => {
                    setCalle(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label="Colonia">
                <Input
                  placeholder="Colonia"
                  value={colonia}
                  onChange={(e) => {
                    setColonia(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label="Número exterior">
                <Input
                  placeholder="Número exterior"
                  value={numeroExt}
                  onChange={(e) => {
                    setNumeroExt(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label="Número interior">
                <Input
                  placeholder="Número Interior"
                  value={numeroInt}
                  onChange={(e) => {
                    setNumeroInt(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label="Código Postal">
                <InputNumber
                  placeholder="Código Postal"
                  value={codigoPostal}
                  maxLength={5}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    setCodigoPostal(e);
                  }}
                />
              </Form.Item>
              <Form.Item
                label={
                  clienteInfo.tiene_luz !== null ? "Quitar Luz" : "Agregar luz"
                }
              >
                <Checkbox
                  checked={agregarLuz}
                  onChange={() => {
                    setAgregarLuz(!agregarLuz);
                    if (clienteInfo.tiene_luz) {
                      restarLuz(info_lote.superficie);
                      setNewAmortizacion(false);
                    } else {
                      calcularLuz(info_lote.superficie);
                      setNewAmortizacion(true);
                    }
                  }}
                >
                  {agregarLuz && (
                    <Typography.Text>
                      Se {clienteInfo.tiene_luz !== null ? "quitó " : "agregó "}
                      ${formatPrecio(totalImpuestoLuz.toFixed(0))} al monto
                      contrato
                    </Typography.Text>
                  )}
                  {clienteInfo.tiene_luz !== null && agregarLuz === false && (
                    <Typography.Text>
                      Ya cuenta con Luz en la solicitud
                    </Typography.Text>
                  )}
                </Checkbox>
              </Form.Item>
              <Form.Item label="Financiamiento">
                <Select
                  placeholder={"Financiamiento"}
                  optionLabelProp="label"
                  value={
                    financiamientoNombre
                      ? financiamientoNombre
                      : info_lote
                      ? info_lote.financiamiento_nombre
                      : " "
                  }
                  style={{ width: "100%" }}
                  onChange={(value, label) => {
                    console.log("valuie? " + value);
                    setFinanciamientoId(value);
                    setFinanciamientoNombre(label);
                  }}
                >
                  {opcionFinanciamiento.map((item, index) => (
                    <Option key={index} value={item.id} label={item.nombre}>
                      {item?.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Plazos">
                <Select
                  placeholder={"Plazos"}
                  optionLabelProp="label"
                  value={plazoNombre ? plazoNombre : " "}
                  style={{ width: "100%" }}
                  onChange={(value, label) => {
                    setPlazoId(value);
                    setPlazoNombre(label);
                  }}
                >
                  {plazos?.map((item, index) => (
                    <Option
                      key={index}
                      value={item.id}
                      label={item.descripcion}
                    >
                      {item?.descripcion}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="fecha"
                label="Fecha Solicitud"
                style={{ width: "100%" }}
              >
                <Row justify={"space-around"}>
                  <Col>
                    <span>
                      <b>{fechaSolicitud}</b>
                    </span>
                  </Col>
                  <Col>
                    <Checkbox
                      checked={cambiarFecha}
                      onChange={() => {
                        setCambiarFecha(!cambiarFecha);
                      }}
                    >
                      <b style={{ color: "rgb(67, 141, 204)" }}>Cambiar</b>
                    </Checkbox>
                  </Col>
                </Row>
              </Form.Item>
              {cambiarFecha && (
                <Form.Item name="fecha" label="" style={{ width: "100%" }}>
                  <Input
                    type="date"
                    onChange={(e) => {
                      setFechaSolicitud(e.target.value);
                      setNewAmortizacion(true);
                    }}
                    style={{ width: "60%", left: "40%" }}
                    placeholder="Ingresar fecha"
                  />
                </Form.Item>
              )}
            </Col>
          </Row>

          <div
            className="terreno-edit__botones-footer"
            style={{ paddingBottom: 15 }}
          >
            <span className="flex gap-2 justify-end">
              <Button
                onClick={actualizarDatos}
                className="boton"
                htmlType="submit"
                size="large"
              >
                Guardar
              </Button>

              <Button onClick={handleCloseModalEditar} danger size="large">
                Cancelar
              </Button>
            </span>
          </div>
        </Form>
      </Modal>

      <Modal
        title={customTitleCongelar}
        footer={null}
        //width={800}
        size="md"
        open={showCongelar}
        onCancel={() => handleCloseCongelar()}
      >
        <Form
          labelCol={{ span: 10 }}
          layout="horizontal"
          name="congelarForm"
          form={forms}
          onFinish={handleSubmitCongelar}
        >
          <Row style={{ paddingTop: 10, justifyContent: "space-evenly" }}>
            <Col
              xs={24}
              sm={20}
              md={16}
              lg={14}
              xl={14}
              xxl={14}
              style={{
                maxWidth: 300,
              }}
            >
              <Form.Item
                name="fechaCongelar"
                label="Fecha Congelar"
                rules={[
                  {
                    required: true,
                    message: "Debe ingresar una fecha del congelar.",
                  },
                  { validator: validarFecha }, // Aquí la validación personalizada
                ]}
              >
                <DatePicker
                  format={dateFormat}
                  locale={locale}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <div
            className="terreno-edit__botones-footer"
            style={{ paddingBottom: 15 }}
          >
            <span className="flex gap-2 justify-end">
              <Button
                onClick={handleSubmitCongelar}
                className="boton"
                htmlType="submit"
                size="large"
              >
                Guardar
              </Button>

              <Button onClick={handleCloseCongelar} danger size="large">
                Cancelar
              </Button>
            </span>
          </div>
        </Form>
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
