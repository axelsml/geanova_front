"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  Row,
  Col,
  Typography,
  Button,
  DatePicker,
  Form,
  Checkbox,
  message as MessageAntd,
  Select,
  Card,
  Modal,
  Alert,
  Input,
  Upload,
} from "antd";

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

import {
  FaCircleExclamation,
} from "react-icons/fa6";

import Loader80 from "@/components/Loader80";

import * as XLSX from "xlsx";

import Swal from "sweetalert2";

import locale from "antd/lib/date-picker/locale/es_ES";

import {
  UploadOutlined,
} from "@ant-design/icons";

import recursosService from "@/services/recursosService";

import {
  formatPrecio,
  fechaFormateada,
} from "@/helpers/formatters";

import AdministrarTipoMovimiento from "./AdministrarTipoMovimiento";

import AdministrarTarjetas from "./AdministrarTarjetas";

import "./styles.css";

import {
  getCookiePermisos,
} from "@/helpers/valorPermisos";

const {
  RangePicker,
} = DatePicker;

const {
  Option,
} = Select;

export default function TarjetaDCAMR() {
  // ==========================================================
  // TABLA PRINCIPAL
  // ==========================================================

  const [orderBy] =
    useState(
      "fecha_operacion"
    );

  const [order] =
    useState("desc");

  const [
    page,
    setPage,
  ] = useState(0);

  const [
    rowsPerPage,
    setRowsPerPage,
  ] = useState(5);

  // ==========================================================
  // TABLA DETALLE
  // ==========================================================

  const [orderBy2] =
    useState(
      "fecha_operacion"
    );

  const [order2] =
    useState("desc");

  const [
    page2,
    setPage2,
  ] = useState(0);

  const [
    rowsPerPage2,
    setRowsPerPage2,
  ] = useState(5);

  // ==========================================================
  // MODALES
  // ==========================================================

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    showModalTarjetas,
    setShowModalTarjetas,
  ] = useState(false);

  const [
    showModalDetalles,
    setShowModalDetalles,
  ] = useState(false);

  // ==========================================================
  // DATOS
  // ==========================================================

  const [
    tabla,
    setTabla,
  ] = useState([]);

  const [
    tablaDetalles,
    setTablaDetalles,
  ] = useState([]);

  /*
   * MUY IMPORTANTE
   *
   * Antes utilizabas "datos"
   * tanto para:
   *
   * 1. Catálogo
   * 2. Resumen
   *
   * Ahora los separamos.
   */

  const [
    catalogoTipos,
    setCatalogoTipos,
  ] = useState([]);

  const [
    datosResumen,
    setDatosResumen,
  ] = useState([]);

  const [
    datosTarjetas,
    setDatosTarjetas,
  ] = useState([]);

  // ==========================================================
  // FILTROS
  // ==========================================================

  const [
    filtroEstado,
    setFiltroEstado,
  ] =
    useState("todos");

  const [
    filtroEstadoDetalle,
    setFiltroEstadoDetalle,
  ] =
    useState("todos");

  const [
    titleDetalles,
    setTitleDetalles,
  ] = useState("");

  const [
    range,
    setRange,
  ] = useState([]);

  const [
    movimientos,
    setMovimientos,
  ] = useState(false);

  const [
    tipoSelected,
    setTipoSelected,
  ] = useState("0");

  // ==========================================================
  // MENSAJES
  // ==========================================================

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState(null);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  // ==========================================================
  // TOTALES
  // ==========================================================

  const [
    totalAbono,
    setTotalAbono,
  ] = useState(0);

  const [
    totalCargo,
    setTotalCargo,
  ] = useState(0);

  // ==========================================================
  // SELECT MOVIMIENTOS
  // ==========================================================

  const [
    formValues,
    setFormValues,
  ] = useState({});

  const [
    cookiePermisos,
    setCookiePermisos,
  ] = useState([]);

  // ==========================================================
  // ERROR
  // ==========================================================

  const onError = (e) => {
    setLoading(false);

    console.error(e);

    if (e?.message) {
      setErrorMessage(
        `Error al realizar la consulta: ${e.message}`
      );
    } else {
      setErrorMessage(
        `Error al realizar la consulta: ${e}`
      );
    }
  };

  // ==========================================================
  // PENDIENTE
  // ==========================================================

  const esMovimientoPendiente = (
    movimiento
  ) => {
    const tipoId =
      parseInt(
        movimiento.tipo_id,
        10
      );

    return (
      movimiento.tipo_id ===
        null ||
      movimiento.tipo_id ===
        undefined ||
      movimiento.tipo_id ===
        "" ||
      isNaN(tipoId) ||
      tipoId === 0 ||
      tipoId === 15
    );
  };

  const filtrarMovimientosPorEstado = (
    movimientosLista,
    filtro
  ) => {
    if (
      !Array.isArray(
        movimientosLista
      )
    ) {
      return [];
    }

    if (
      filtro ===
      "pendientes"
    ) {
      return movimientosLista.filter(
        (movimiento) =>
          esMovimientoPendiente(
            movimiento
          )
      );
    }

    if (
      filtro ===
      "asignados"
    ) {
      return movimientosLista.filter(
        (movimiento) =>
          !esMovimientoPendiente(
            movimiento
          )
      );
    }

    return movimientosLista;
  };

  const tablaFiltrada =
    filtrarMovimientosPorEstado(
      tabla,
      filtroEstado
    );

  const tablaDetallesFiltrada =
    filtrarMovimientosPorEstado(
      tablaDetalles,
      filtroEstadoDetalle
    );

  // ==========================================================
  // TIPOS PERMITIDOS SEGUN TARJETA
  // ==========================================================

  const obtenerTiposMovimiento = (
    movimiento
  ) => {
    const tarjetaId =
      parseInt(
        movimiento
          ?.tarjeta_credito_id,
        10
      );

    const tipoActual =
      parseInt(
        movimiento?.tipo_id,
        10
      );

    return catalogoTipos.filter(
      (tipo) => {
        const tarjetaTipo =
          parseInt(
            tipo.tarjeta_id,
            10
          );

        const tipoId =
          parseInt(
            tipo.id,
            10
          );

        // -----------------------------------------------
        // Si ya tiene ese tipo,
        // lo conservamos visible.
        // -----------------------------------------------

        if (
          tipoId ===
          tipoActual
        ) {
          return true;
        }

        // -----------------------------------------------
        // GLOBAL
        // -----------------------------------------------

        if (
          tipo.tarjeta_id ===
            null ||
          tipo.tarjeta_id ===
            undefined ||
          tipo.tarjeta_id ===
            "" ||
          isNaN(
            tarjetaTipo
          ) ||
          tarjetaTipo === 0
        ) {
          return true;
        }

        // -----------------------------------------------
        // MISMA TARJETA
        // -----------------------------------------------

        return (
          tarjetaTipo ===
          tarjetaId
        );
      }
    );
  };

  // ==========================================================
  // MODALES
  // ==========================================================

  const handleCloseModal =
    () => {
      setShowModal(false);
    };

  const handleCloseModalTarjetas =
    () => {
      setShowModalTarjetas(
        false
      );
    };

  const handleCloseModalDetalles =
    () => {
      setShowModalDetalles(
        false
      );

      setTablaDetalles([]);

      setTitleDetalles("");

      setFiltroEstadoDetalle(
        "todos"
      );

      setPage2(0);
    };

  // ==========================================================
  // INICIO
  // ==========================================================

  useEffect(() => {
    const today =
      new Date();

    const startOfMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

    const formatearFecha = (
      fecha
    ) => {
      const year =
        fecha.getFullYear();

      const month =
        String(
          fecha.getMonth() +
            1
        ).padStart(
          2,
          "0"
        );

      const day =
        String(
          fecha.getDate()
        ).padStart(
          2,
          "0"
        );

      return `${year}-${month}-${day}`;
    };

    setRange([
      formatearFecha(
        startOfMonth
      ),

      formatearFecha(
        today
      ),
    ]);

    getCookiePermisos(
      "depositos",
      setCookiePermisos
    );

    setearMovimientos();

    cargarTarjetas();
  }, []);

  // ==========================================================
  // CATALOGO DE TIPOS
  // ==========================================================

  function setearMovimientos() {
    return recursosService
      .showTipoMovimientoTarjeta(
        (response) => {
          setCatalogoTipos(
            Array.isArray(
              response
            )
              ? response
              : []
          );
        },
        onError
      )
      .then(() => {
        setLoading(false);
      });
  }

  // ==========================================================
  // TARJETAS
  // ==========================================================

function cargarTarjetas() {
  return recursosService
    .showTarjeta(
      setDatosTarjetas,
      onError
    )
    .then(() => {
      setLoading(false);
    });
}

  // ==========================================================
  // RANGO
  // ==========================================================

  const onRangeChange = (
    dates,
    dateStrings
  ) => {
    setRange(dateStrings);
  };

  const layout = {
    labelCol: {
      span: 24,
    },

    wrapperCol: {
      span: 24,
    },
  };

  const layoutResumen = {
    labelCol: {
      span: 16,
    },

    wrapperCol: {
      span: 24,
    },
  };

  // ==========================================================
  // PAGINACION
  // ==========================================================

  const handleChangePage = (
    event,
    newPage
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage =
    (event) => {
      setRowsPerPage(
        parseInt(
          event.target.value,
          10
        )
      );

      setPage(0);
    };

  const handleChangePage2 = (
    event,
    newPage
  ) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage2 =
    (event) => {
      setRowsPerPage2(
        parseInt(
          event.target.value,
          10
        )
      );

      setPage2(0);
    };

  // ==========================================================
  // ORDENAMIENTO
  // ==========================================================

  const stableSort = (
    array,
    comparator
  ) => {
    const stabilizedThis =
      array.map(
        (el, index) => [
          el,
          index,
        ]
      );

    stabilizedThis.sort(
      (a, b) => {
        const value =
          comparator(
            a[0],
            b[0]
          );

        if (
          value !== 0
        ) {
          return value;
        }

        return (
          a[1] - b[1]
        );
      }
    );

    return stabilizedThis.map(
      (el) => el[0]
    );
  };

  const descendingComparator = (
    a,
    b,
    field
  ) => {
    if (
      b[field] <
      a[field]
    ) {
      return -1;
    }

    if (
      b[field] >
      a[field]
    ) {
      return 1;
    }

    return 0;
  };

  const getComparator = (
    orderValue,
    field
  ) => {
    return orderValue ===
      "desc"
      ? (a, b) =>
          descendingComparator(
            a,
            b,
            field
          )
      : (a, b) =>
          -descendingComparator(
            a,
            b,
            field
          );
  };

  // ==========================================================
  // DETALLES
  // ==========================================================

  const abrirDetalles = (
    tipo
  ) => {
    const movimientosTipo =
      tabla.filter(
        (movimiento) =>
          parseInt(
            movimiento.tipo_id,
            10
          ) ===
          parseInt(
            tipo.id,
            10
          )
      );

    setTablaDetalles(
      movimientosTipo
    );

    setTitleDetalles(
      `Detalles de ${tipo.descripcion}`
    );

    setFiltroEstadoDetalle(
      "todos"
    );

    setPage2(0);

    setShowModalDetalles(
      true
    );
  };

  // ==========================================================
  // AUTOMATIZAR
  // ==========================================================

  function automatizarMovimientos() {
    Swal.fire({
      title:
        "Clasificación automática",

      text:
        "Se clasificarán únicamente movimientos que todavía no tengan un tipo asignado.",

      icon:
        "question",

      showCancelButton:
        true,

      confirmButtonText:
        "Clasificar",

      cancelButtonText:
        "Cancelar",

      confirmButtonColor:
        "#4096ff",
    }).then(
      (result) => {
        if (
          !result.isConfirmed
        ) {
          return;
        }

        setLoading(true);

        const params = {
          fechaInicial:
            range[0],

          fechaFinal:
            range[1],

          tarjeta:
            tipoSelected,

          minimo_registros:
            3,

          confianza:
            0.8,
        };

        recursosService
          .automatizarTiposMovimientoTarjeta(
            onAutomatizacionTerminada,
            params,
            onError
          );
      }
    );
  }

  function onAutomatizacionTerminada(
    response
  ) {
    setLoading(false);

    if (
      !response ||
      !response.success
    ) {
      Swal.fire({
        icon: "error",

        title:
          "Error",

        text:
          response?.message ||
          "No se pudo realizar la clasificación.",
      });

      return;
    }

    Swal.fire({
      icon:
        "success",

      title:
        "Clasificación terminada",

      html:
        `Movimientos clasificados: <b>${response.total_clasificados || 0}</b><br/>` +
        `Pendientes de clasificar: <b>${response.total_sin_clasificar || 0}</b>`,

      confirmButtonText:
        "Aceptar",

      confirmButtonColor:
        "#4096ff",
    }).then(() => {
      onBuscar();
    });
  }

  // ==========================================================
  // BUSCAR
  // ==========================================================

  function onBuscar() {
    setMessage(null);

    setErrorMessage("");

    if (
      !range ||
      range.length !== 2 ||
      !range[0] ||
      !range[1]
    ) {
      return Swal.fire({
        icon: "error",

        title:
          "Oops...",

        text:
          "Debes seleccionar un rango de fechas",
      });
    }

    setLoading(true);

    const form = {
      fechaInicial:
        range[0],

      fechaFinal:
        range[1],

      movimientos:
        movimientos,

      tarjeta:
        tipoSelected,
    };

    recursosService
      .getMovimientosTarjetas(
        form,
        Consultado,
        onError
      )
      .then(() => {
        setLoading(false);
      });
  }

  // ==========================================================
  // RESPUESTA BUSQUEDA
  // ==========================================================

  function Consultado(
    response
  ) {
    setLoading(false);

    const {
      type,
      message:
        messageResponse,
      movimientos:
        movimientosResponse,
      resumenTipo,
    } = response;

    const listaMovimientos =
      Array.isArray(
        movimientosResponse
      )
        ? movimientosResponse
        : [];

    const resumen =
      Array.isArray(
        resumenTipo
      )
        ? resumenTipo
        : [];

    setTabla(
      listaMovimientos
    );

    setDatosResumen(
      resumen
    );

    const initialValues =
      {};

    listaMovimientos.forEach(
      (item) => {
        initialValues[
          `${item.id}`
        ] =
          item.tipo_id;
      }
    );

    setFormValues(
      initialValues
    );

    setMessage({
      type:
        type,

      message:
        messageResponse,
    });

    const abonos =
      sumValuesByStatus(
        resumen,
        1
      );

    const cargos =
      sumValuesByStatus(
        resumen,
        2
      );

    setTotalAbono(
      parseFloat(
        abonos || 0
      )
    );

    setTotalCargo(
      parseFloat(
        cargos || 0
      )
    );
  }

  // ==========================================================
  // SUMAS
  // ==========================================================

  const sumValuesByStatus = (
    lista,
    tipoIngreso
  ) => {
    if (
      !Array.isArray(lista)
    ) {
      return 0;
    }

    return lista
      .filter(
        (item) =>
          parseInt(
            item.tipo_ingreso,
            10
          ) ===
            parseInt(
              tipoIngreso,
              10
            ) &&
          parseInt(
            item.tipo_id,
            10
          ) !== 15
      )
      .reduce(
        (
          acc,
          item
        ) =>
          acc +
          parseFloat(
            item.total ||
              0
          ),
        0
      );
  };

  // ==========================================================
  // CAMBIAR TIPO PRINCIPAL
  // ==========================================================

  const handleChange = (
    value,
    movimientoId
  ) => {
    const params = {
      id:
        movimientoId,

      tipo_movimiento_id:
        value,
    };

    setFormValues(
      (
        prevValues
      ) => ({
        ...prevValues,

        [
          movimientoId
        ]: value,
      })
    );

    actualizarMovimientoLocal(
      movimientoId,
      value
    );

    recursosService.updateTipoMovimientoTarjeta(
      () => {
        onBuscar();
      },
      params,
      onError
    );
  };

  // ==========================================================
  // CAMBIAR TIPO DETALLE
  // ==========================================================

  const handleChangeDetalle = (
    value,
    movimientoId
  ) => {
    const params = {
      id:
        movimientoId,

      tipo_movimiento_id:
        value,
    };

    setFormValues(
      (
        prevValues
      ) => ({
        ...prevValues,

        [
          movimientoId
        ]: value,
      })
    );

    actualizarMovimientoLocal(
      movimientoId,
      value
    );

    recursosService.updateTipoMovimientoTarjeta(
      () => {
        onBuscar();
      },
      params,
      onError
    );
  };

  // ==========================================================
// CAMBIAR TARJETA DEL MOVIMIENTO
// ==========================================================

const handleChangeTarjetaMovimiento = (
  tarjetaId,
  movimientoId
) => {
  const tarjeta =
    datosTarjetas.find(
      (item) =>
        parseInt(
          item.id,
          10
        ) ===
        parseInt(
          tarjetaId,
          10
        )
    );

  if (!tarjeta) {
    MessageAntd.error(
      "No se encontró la tarjeta seleccionada."
    );

    return;
  }

  const params = {
    id:
      movimientoId,

    tarjeta_credito_id:
      tarjeta.id,
  };

  // ========================================================
  // ACTUALIZAR VISUALMENTE
  // ========================================================

  const actualizar =
    (movimiento) => {
      if (
        parseInt(
          movimiento.id,
          10
        ) !==
        parseInt(
          movimientoId,
          10
        )
      ) {
        return movimiento;
      }

      return {
        ...movimiento,

        tarjeta_credito_id:
          tarjeta.id,

        tarjeta_alias:
          tarjeta.alias,

        tarjeta_numero:
          tarjeta.tarjeta,
      };
    };

  setTabla((prev) =>
    prev.map(
      actualizar
    )
  );

  setTablaDetalles(
    (prev) =>
      prev.map(
        actualizar
      )
  );

  // ========================================================
  // GUARDAR EN BD
  // ========================================================

  recursosService.updateTarjetaMovimientoTarjeta(
    (response) => {
      if (
        !response ||
        response.success ===
          false
      ) {
        MessageAntd.error(
          response?.message ||
            "No fue posible cambiar la tarjeta."
        );

        /*
         * Recuperamos el estado
         * real de BD.
         */
        onBuscar();

        return;
      }

      MessageAntd.success(
        "Tarjeta actualizada."
      );

      /*
       * Recargamos porque cambiar
       * tarjeta puede cambiar los
       * tipos permitidos.
       */
      onBuscar();
    },
    params,
    onError
  );
};
  // ==========================================================
  // ACTUALIZACION LOCAL
  // ==========================================================

  const actualizarMovimientoLocal = (
    movimientoId,
    tipoId
  ) => {
    const tipo =
      catalogoTipos.find(
        (item) =>
          parseInt(
            item.id,
            10
          ) ===
          parseInt(
            tipoId,
            10
          )
      );

    const actualizar =
      (movimiento) => {
        if (
          parseInt(
            movimiento.id,
            10
          ) !==
          parseInt(
            movimientoId,
            10
          )
        ) {
          return movimiento;
        }

        return {
          ...movimiento,

          tipo_id:
            tipoId,

          descripcion:
            tipo
              ? tipo.descripcion
              : movimiento.descripcion,

          codigo_color:
            tipo
              ? tipo.codigo_color
              : movimiento.codigo_color,
        };
      };

    setTabla((prev) =>
      prev.map(
        actualizar
      )
    );

    setTablaDetalles(
      (prev) =>
        prev.map(
          actualizar
        )
    );
  };

  // ==========================================================
  // TOTAL FILTROS
  // ==========================================================

  const totalTodos =
    tabla.length;

  const totalPendientes =
    tabla.filter(
      (movimiento) =>
        esMovimientoPendiente(
          movimiento
        )
    ).length;

  const totalAsignados =
    totalTodos -
    totalPendientes;

  // ==========================================================
  // COLORES
  // ==========================================================

  function colorDinamicoRow(
    codigoColor
  ) {
    return {
      backgroundColor:
        codigoColor ||
        "transparent",
    };
  }

  // ==========================================================
  // TITULOS
  // ==========================================================

  const customTitle = (
    title,
    level
  ) => (
    <Row justify="center">
      <Typography.Title
        level={level}
      >
        {title}
      </Typography.Title>
    </Row>
  );

  const customTitleDetalles =
    (
      <Row
        justify="center"
        style={{
          color:
            "#438dcc",

          margin:
            "0 auto",
        }}
      >
        <Typography.Title
          level={2}
        >
          {titleDetalles}
        </Typography.Title>
      </Row>
    );

  // ==========================================================
  // PERMISOS
  // ==========================================================

  function disableSelect(
    status
  ) {
    return (
      status === 1 ||
      cookiePermisos < 2
    );
  }

  // ==========================================================
  // EXCEL
  // ==========================================================

  const handleUpload = (
    file
  ) => {
    const reader =
      new FileReader();

    reader.onload = (
      e
    ) => {
      const data =
        new Uint8Array(
          e.target.result
        );

      const workbook =
        XLSX.read(
          data,
          {
            type:
              "array",
          }
        );

      const sheetName =
        workbook
          .SheetNames[0];

      const worksheet =
        workbook
          .Sheets[
          sheetName
        ];

      const dataArr =
        XLSX.utils.sheet_to_json(
          worksheet,
          {
            header: 1,
          }
        );

      MessageAntd.success(
        `${file.name} Adjuntado`
      );

      guardarEstadoCuenta(
        dataArr
      );
    };

    reader.readAsArrayBuffer(
      file
    );
  };

  function guardarEstadoCuenta(
    excelData
  ) {
    if (
      !excelData ||
      excelData.length <= 1
    ) {
      return;
    }

    const filas =
      excelData.slice(1);

    const datosFormateados =
      [];

    for (
      let i = 0;
      i < filas.length;
      i++
    ) {
      if (
        !filas[i] ||
        filas[i].length === 0
      ) {
        continue;
      }

      let formattedDate =
        "";

      if (
        typeof filas[i][0] ===
        "number"
      ) {
        const fecha =
          excelDateToJSDate(
            filas[i][0]
          );

        formattedDate =
          fecha
            .toISOString()
            .split("T")[0];
      } else {
        formattedDate =
          formatDateString(
            filas[i][0]
          );
      }

      const info = {
        tarjeta:
          filas[i][4],

        fecha_operacion:
          formattedDate,

        concepto:
          filas[i][1],

        abono:
          parseFloat(
            filas[i][2] ||
              0
          ),

        cargo:
          parseFloat(
            filas[i][3] ||
              0
          ),
      };

      datosFormateados.push(
        info
      );
    }

    const params = {
      movimientos:
        datosFormateados,
    };

    setLoading(true);

    recursosService.guardarMovimientosTarjetas(
      params,
      onMovimientosGuardados,
      onError
    );
  }

  function onMovimientosGuardados(
    data
  ) {
    setLoading(false);

    if (data.success) {
      Swal.fire({
        title:
          data.datos == 0
            ? "Sin cambios"
            : "Movimientos guardados",

        icon:
          data.datos == 0
            ? "warning"
            : "success",

        text:
          data.datos == 0
            ? "No se han registrado cambios."
            : `Registros nuevos guardados: ${data.datos}`,

        confirmButtonColor:
          "#4096ff",

        confirmButtonText:
          "Aceptar",
      }).then(() => {
        onBuscar();
      });
    } else {
      Swal.fire({
        title:
          "Ha ocurrido un Error",

        icon:
          "warning",

        text:
          data.message,

        confirmButtonColor:
          "#4096ff",

        confirmButtonText:
          "Aceptar",
      });
    }
  }

  function excelDateToJSDate(
    serial
  ) {
    const date =
      new Date(
        Math.round(
          (serial -
            25569) *
            86400 *
            1000
        )
      );

    const timezoneOffset =
      date.getTimezoneOffset() *
      60000;

    return new Date(
      date.getTime() +
        timezoneOffset
    );
  }

  function formatDateString(
    dateString
  ) {
    if (!dateString) {
      return "";
    }

    const partes =
      dateString
        .toString()
        .split("/")
        .map(Number);

    if (
      partes.length !== 3
    ) {
      return dateString;
    }

    const [
      day,
      month,
      year,
    ] = partes;

    const date =
      new Date(
        year,
        month - 1,
        day
      );

    return date
      .toISOString()
      .split("T")[0];
  }

  // ==========================================================
  // TABLA MOVIMIENTOS REUTILIZABLE
  // ==========================================================

  const renderTablaMovimientos = ({
    lista,
    pagina,
    filasPorPagina,
    setPagina,
    setFilasPorPagina,
    detalle = false,
  }) => {
    return (
      <TableContainer
        component={Paper}
        className="tabla"
      >
        <Table>
          <TableHead
            className="tabla_encabezado"
          >
            <TableRow>
              <TableCell>
                <p>Fecha</p>
              </TableCell>

              <TableCell>
                <p>
                  Tarjeta
                </p>
              </TableCell>

              <TableCell>
                <p>
                  Concepto
                </p>
              </TableCell>

              <TableCell>
                <p>
                  Cargos
                </p>
              </TableCell>

              <TableCell>
                <p>
                  Abonos
                </p>
              </TableCell>

              <TableCell
                style={{
                  width: 220,
                }}
              >
                <p>
                  Tipo de
                  movimiento
                </p>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {stableSort(
              lista,
              getComparator(
                detalle
                  ? order2
                  : order,

                detalle
                  ? orderBy2
                  : orderBy
              )
            )
              .slice(
                pagina *
                  filasPorPagina,

                pagina *
                  filasPorPagina +
                  filasPorPagina
              )
              .map(
                (dato) => (
                  <TableRow
                    key={
                      dato.id
                    }
                    style={colorDinamicoRow(
                      dato.codigo_color
                    )}
                  >
                    <TableCell>
                      {fechaFormateada(
                        dato.fecha_operacion
                      )}
                    </TableCell>

                    <TableCell>
  <Select
    value={
      dato.tarjeta_credito_id
        ? parseInt(
            dato.tarjeta_credito_id,
            10
          )
        : undefined
    }
    placeholder="Sin identificar"
    style={{
      width: 190,
    }}
    showSearch
    optionFilterProp="label"
    disabled={
      cookiePermisos < 2
    }
    onChange={(value) =>
      handleChangeTarjetaMovimiento(
        value,
        dato.id
      )
    }
  >
    {datosTarjetas.map(
      (tarjeta) => {
        const numero =
          tarjeta.tarjeta
            ? tarjeta.tarjeta
                .toString()
                .replace(
                  /\D/g,
                  ""
                )
            : "";

        const ultimos =
          numero.length >= 4
            ? `•••• ${numero.slice(
                -4
              )}`
            : tarjeta.tarjeta ||
              "";

        const texto =
          `${tarjeta.alias || "Sin alias"}` +
          `${
            ultimos
              ? ` - ${ultimos}`
              : ""
          }`;

        return (
          <Option
            key={
              tarjeta.id
            }
            value={parseInt(
              tarjeta.id,
              10
            )}
            label={texto}
          >
            {texto}
          </Option>
        );
      }
    )}
  </Select>
</TableCell>

                    <TableCell>
                      {
                        dato.concepto
                      }
                    </TableCell>

                    <TableCell>
                      $
                      {dato.cargo
                        ? formatPrecio(
                            dato.cargo
                          )
                        : "0.00"}
                    </TableCell>

                    <TableCell>
                      $
                      {dato.abono
                        ? formatPrecio(
                            dato.abono
                          )
                        : "0.00"}
                    </TableCell>

                    <TableCell>
                      <Select
                        value={
                          formValues[
                            `${dato.id}`
                          ]
                        }
                        style={{
                          width:
                            "100%",

                          minWidth:
                            190,
                        }}
                        disabled={disableSelect(
                          dato.status
                        )}
                        placeholder="Tipo de movimiento"
                        onChange={(
                          value
                        ) =>
                          detalle
                            ? handleChangeDetalle(
                                value,
                                dato.id
                              )
                            : handleChange(
                                value,
                                `${dato.id}`
                              )
                        }
                      >
                        {obtenerTiposMovimiento(
                          dato
                        ).map(
                          (
                            option
                          ) => (
                            <Option
                              key={
                                option.id
                              }
                              value={
                                option.id
                              }
                            >
                              {
                                option.descripcion
                              }
                            </Option>
                          )
                        )}
                      </Select>
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
                  lista.length
                }
                rowsPerPage={
                  filasPorPagina
                }
                page={
                  pagina
                }
                onPageChange={(
                  event,
                  value
                ) =>
                  setPagina(
                    value
                  )
                }
                onRowsPerPageChange={(
                  event
                ) => {
                  setFilasPorPagina(
                    parseInt(
                      event
                        .target
                        .value,
                      10
                    )
                  );

                  setPagina(
                    0
                  );
                }}
                labelRowsPerPage="Registros por Página"
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="resources-legacy-panel"
      style={{
        paddingBottom: 30,
      }}
    >
      {loading && (
        <Loader80 />
      )}

      <Form {...layout}>
        <Row
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32,
          }}
          justify="center"
          style={{
            paddingTop: 10,
          }}
        >
          <Col
            xs={24}
            sm={12}
            md={12}
            lg={8}
            xl={6}
          >
            <Form.Item
              name="range"
              label="Selecciona fechas"
            >
              <RangePicker
                locale={locale}
                format="YYYY-MM-DD"
                onChange={
                  onRangeChange
                }
                style={{
                  width:
                    "100%",
                }}
              />
            </Form.Item>
          </Col>

          <Col
            xs={24}
            sm={12}
            md={12}
            lg={8}
            xl={6}
          >
            <Form.Item
              label="Tarjeta"
            >
              <Select
                placeholder="Todos"
                value={
                  tipoSelected
                }
                onChange={(
                  value
                ) =>
                  setTipoSelected(
                    value ||
                      "0"
                  )
                }
                style={{
                  width:
                    "100%",
                }}
              >
                <Option
                  value="0"
                >
                  Todos
                </Option>

                {datosTarjetas.map(
                  (
                    item
                  ) => (
                    <Option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >
                      {
                        item.alias
                      }
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>
          </Col>

          <Col
            xs={24}
            sm={12}
            md={12}
            lg={8}
            xl={6}
          >
            <Form.Item
              label="Selección opcional"
            >
              <Checkbox
                checked={
                  movimientos
                }
                onChange={() =>
                  setMovimientos(
                    !movimientos
                  )
                }
              >
                Todos los
                movimientos
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <Row
          justify="center"
          gutter={16}
          className="mb-5"
        >
          <Col
            xs={24}
            md={6}
          >
            <Button
              type="primary"
              block
              disabled={
                cookiePermisos <
                2
              }
              onClick={() =>
                setShowModal(
                  true
                )
              }
            >
              Administrar
              Movimientos
            </Button>
          </Col>

          <Col
            xs={24}
            md={6}
          >
            <Button
              type="primary"
              block
              disabled={
                cookiePermisos <
                2
              }
              onClick={() =>
                setShowModalTarjetas(
                  true
                )
              }
            >
              Administrar
              Tarjetas
            </Button>
          </Col>

          <Col
            xs={24}
            md={6}
          >
            <Button
              type="primary"
              block
              onClick={
                onBuscar
              }
            >
              Buscar
            </Button>
          </Col>

          <Col
            xs={24}
            md={6}
          >
            <Button
              type="primary"
              block
              disabled={
                cookiePermisos <
                2
              }
              onClick={
                automatizarMovimientos
              }
            >
              Clasificar
              automáticamente
            </Button>
          </Col>
        </Row>

        <Row
          justify="center"
          style={{
            marginBottom: 25,
          }}
        >
          <Col
            xs={24}
            md={6}
          >
            <Upload
              beforeUpload={(
                file
              ) => {
                handleUpload(
                  file
                );

                return false;
              }}
              showUploadList={
                false
              }
            >
              <Button
                block
                icon={
                  <UploadOutlined />
                }
                disabled={
                  cookiePermisos <
                  2
                }
              >
                Adjuntar Archivo
              </Button>
            </Upload>
          </Col>
        </Row>
      </Form>

      {message &&
        !errorMessage && (
          <Alert
            style={{
              marginBottom: 25,
            }}
            message={
              message.type
            }
            description={
              message.message
            }
            type="success"
            showIcon
            closable
          />
        )}

      {errorMessage && (
        <Alert
          style={{
            marginBottom: 25,
          }}
          message="Error"
          description={
            errorMessage
          }
          type="error"
          showIcon
          closable
        />
      )}

      {/* =======================================================
          RESUMEN
      ======================================================= */}

      <Row
        justify="space-evenly"
        gutter={16}
      >
        <Col
          xs={24}
          lg={10}
        >
          <Card
            className="custom-card"
            title={customTitle(
              "Abonos",
              4
            )}
          >
            <Form
              {...layoutResumen}
            >
              {datosResumen.map(
                (
                  dato
                ) => {
                  if (
                    parseInt(
                      dato.tipo_ingreso,
                      10
                    ) !==
                    1
                  ) {
                    return null;
                  }

                  return (
                    <Form.Item
                      key={
                        dato.id
                      }
                      label={
                        <span
                          style={{
                            cursor:
                              "pointer",
                          }}
                          onClick={() =>
                            abrirDetalles(
                              dato
                            )
                          }
                        >
                          {
                            dato.descripcion
                          }
                        </span>
                      }
                    >
                      <Input
                        readOnly
                        value={`$ ${
                          dato.total
                            ? formatPrecio(
                                dato.total
                              )
                            : "0"
                        }`}
                      />
                    </Form.Item>
                  );
                }
              )}

              <Form.Item
                label="Total"
              >
                <Input
                  readOnly
                  value={`$ ${formatPrecio(
                    totalAbono
                  )}`}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col
          xs={24}
          lg={10}
        >
          <Card
            className="custom-card"
            title={customTitle(
              "Cargos",
              4
            )}
          >
            <Form
              {...layoutResumen}
            >
              {datosResumen.map(
                (
                  dato
                ) => {
                  if (
                    parseInt(
                      dato.tipo_ingreso,
                      10
                    ) !==
                    2
                  ) {
                    return null;
                  }

                  return (
                    <Form.Item
                      key={
                        dato.id
                      }
                      label={
                        <span
                          style={{
                            cursor:
                              "pointer",
                          }}
                          onClick={() =>
                            abrirDetalles(
                              dato
                            )
                          }
                        >
                          {
                            dato.descripcion
                          }
                        </span>
                      }
                    >
                      <Input
                        readOnly
                        value={`$ ${
                          dato.total
                            ? formatPrecio(
                                dato.total
                              )
                            : "0"
                        }`}
                      />
                    </Form.Item>
                  );
                }
              )}

              <Form.Item
                label="Total"
              >
                <Input
                  readOnly
                  value={`$ ${formatPrecio(
                    totalCargo
                  )}`}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* =======================================================
          MOVIMIENTOS
      ======================================================= */}

      <Row
        style={{
          marginTop: 25,
        }}
      >
        <Col xs={24}>
          <Row
            justify="space-between"
            align="middle"
            style={{
              marginBottom: 10,
            }}
          >
            <Typography.Title
              level={3}
              style={{
                margin: 0,
              }}
            >
              Movimientos
            </Typography.Title>

            <Select
              value={
                filtroEstado
              }
              style={{
                width: 190,
              }}
              onChange={(
                value
              ) => {
                setFiltroEstado(
                  value
                );

                setPage(0);
              }}
            >
              <Option
                value="todos"
              >
                Todos (
                {totalTodos})
              </Option>

              <Option
                value="asignados"
              >
                Asignados (
                {totalAsignados}
                )
              </Option>

              <Option
                value="pendientes"
              >
                Pendientes (
                {totalPendientes}
                )
              </Option>
            </Select>
          </Row>

          {renderTablaMovimientos({
            lista:
              tablaFiltrada,

            pagina:
              page,

            filasPorPagina:
              rowsPerPage,

            setPagina:
              setPage,

            setFilasPorPagina:
              setRowsPerPage,

            detalle:
              false,
          })}
        </Col>
      </Row>

      {/* =======================================================
          ADMINISTRAR TIPOS
      ======================================================= */}

      <Modal
        title={customTitle(
          "Administrar Tipos de Movimientos",
          3
        )}
        footer={null}
        width={850}
        open={showModal}
        onCancel={
          handleCloseModal
        }
      >
        <AdministrarTipoMovimiento
          tarjetas={
            datosTarjetas
          }
          onTiposActualizados={
            setearMovimientos
          }
        />
      </Modal>

      {/* =======================================================
          ADMINISTRAR TARJETAS
      ======================================================= */}

      <Modal
        title={customTitle(
          "Administrar Tarjetas",
          3
        )}
        footer={null}
        width={600}
        open={
          showModalTarjetas
        }
        onCancel={
          handleCloseModalTarjetas
        }
      >
        <AdministrarTarjetas
          cargarTarjetas={
            cargarTarjetas
          }
        />
      </Modal>

      {/* =======================================================
          DETALLE
      ======================================================= */}

      <Modal
        title={
          customTitleDetalles
        }
        footer={null}
        width={950}
        open={
          showModalDetalles
        }
        onCancel={
          handleCloseModalDetalles
        }
      >
        {tablaDetalles.length ===
        0 ? (
          <Row
            justify="center"
            style={{
              margin: 30,
              flexDirection:
                "column",
            }}
          >
            <Typography.Title
              level={3}
              style={{
                color:
                  "orange",

                textAlign:
                  "center",
              }}
            >
              No hay movimientos
              disponibles
            </Typography.Title>

            <FaCircleExclamation
              style={{
                margin:
                  "20px auto",
              }}
              size={60}
              color="orange"
            />
          </Row>
        ) : (
          <>
            <Row
              justify="space-between"
              align="middle"
              style={{
                marginBottom: 10,
              }}
            >
              <Typography.Title
                level={4}
                style={{
                  margin: 0,
                }}
              >
                Movimientos
              </Typography.Title>

              <Select
                value={
                  filtroEstadoDetalle
                }
                style={{
                  width:
                    180,
                }}
                onChange={(
                  value
                ) => {
                  setFiltroEstadoDetalle(
                    value
                  );

                  setPage2(
                    0
                  );
                }}
              >
                <Option
                  value="todos"
                >
                  Todos
                </Option>

                <Option
                  value="asignados"
                >
                  Asignados
                </Option>

                <Option
                  value="pendientes"
                >
                  Pendientes
                </Option>
              </Select>
            </Row>

            {renderTablaMovimientos({
              lista:
                tablaDetallesFiltrada,

              pagina:
                page2,

              filasPorPagina:
                rowsPerPage2,

              setPagina:
                setPage2,

              setFilasPorPagina:
                setRowsPerPage2,

              detalle:
                true,
            })}
          </>
        )}
      </Modal>
    </div>
  );
}