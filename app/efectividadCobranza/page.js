"use client";

import { LoadingContext } from "@/contexts/loading";
import {
  fechaFormateada2,
  formatPrecio,
  formatPrecio2,
} from "@/helpers/formatters";
import cobranzaService from "@/services/cobranzaService";
import terrenosService from "@/services/terrenosService";
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
  Anchor,
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function EfectividadCobranza() {
  const { RangePicker } = DatePicker;
  const [totalClientes, setTotalClientes] = useState();
  const [totalMontoEsperado, setTotalMontoEsperado] = useState();
  const [totalMontoAnticipo, setTotalMontoAnticipo] = useState();
  const [totalMontoCobrado, setTotalMontoCobrado] = useState();
  const [totalPendienteCobrar, setTotalPendienteCobrar] = useState();
  const [totalPorcentajeImporte, setTotalPorcentajeImporte] = useState();
  const [totalPorcentajeClientes, setTotalPorcentajeClientes] = useState();
  const [range, setRange] = useState([]);
  const [mesSelected, setMesSelected] = useState(null);
  const [añoSelected, setAñoSelected] = useState(2024);
  const { setIsLoading } = useContext(LoadingContext);

  const [orderBy2] = useState("fechaOperacion");
  const [order2] = useState("desc");
  const [rowsPerPage2, setRowsPerPage2] = useState(5);
  const [page2, setPage2] = useState(0);

  const [orderBy3] = useState("fechaOperacion");
  const [order3] = useState("desc");
  const [rowsPerPage3, setRowsPerPage3] = useState(5);
  const [page3, setPage3] = useState(0);

  const [orderBy4] = useState("fechaOperacion");
  const [order4] = useState("desc");
  const [rowsPerPage4, setRowsPerPage4] = useState(5);
  const [page4, setPage4] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [showModalClientesCobrados, setShowModalClientesCobrados] =
    useState(false);
  const [showModalClientesPorCobrar, setShowModalClientesPorCobrar] =
    useState(false);
  const [showModalEfectivo, setShowModalEfectivo] = useState(false);

  const [datos, setDatos] = useState([]);
  const [datosClientesCongelados, setDatosClientesCongelados] = useState([]);
  const [datosModal, setDatosModal] = useState([]);
  const [datosModalClientesPagados, setDatosModalClientesPagados] = useState(
    []
  );
  const [datosModalClientesPorPagar, setDatosModalClientesPorPagar] = useState(
    []
  );
  const [datosModalEfectivo, setDatosModalEfectivo] = useState([]);
  const [terrenos, setTerrenos] = useState(null);
  const [terrenoSelected, setTerrenoSelected] = useState(null);

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const [form] = Form.useForm();
  const { Option } = Select;
  const opcion = [{ index: 0, id: 0, nombre: "Todos" }];

  const years = [];
  for (let i = 2017; i <= 2030; i++) {
    years.push({ value: i, label: `${i}` });
  }

  const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  useEffect(() => {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const añoActual = fechaActual.getFullYear();
    console.log("opciones: ", opcion[0]);
    console.log("mesActual: ", mesActual);
    console.log("añoActual: ", añoActual);

    terrenosService.getTerrenos(setTerrenos, Error);
    form.setFieldValue("mes", mesActual);
    form.setFieldValue("año", añoActual);
    form.setFieldValue("proyecto", 0);

    setMesSelected(mesActual);
  }, []);

  function handleCloseModal(params) {
    setShowModal(false);
    setPage2(0);
  }

  function handleCloseModalClientesCobrados(params) {
    setShowModalClientesCobrados(false);
    setPage3(0);
  }

  function handleCloseModalClientesPorCobrar(params) {
    setShowModalClientesPorCobrar(false);
    setPage4(0);
  }

  function handleCloseModalEfectivo(params) {
    setShowModalEfectivo(false);
    setPage2(0);
  }

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

  const customTitle = (title, level) => (
    <Row justify={"center"}>
      <Typography.Title level={level}>{title}</Typography.Title>
    </Row>
  );

  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  const stableSort2 = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order2 = comparator(a[0], b[0]);
      if (order2 !== 0) return order2;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const descendingComparator2 = (a2, b2, orderBy2) => {
    if (b2[orderBy2] < a2[orderBy2]) {
      return -1;
    }
    if (b2[orderBy2] > a2[orderBy2]) {
      return 1;
    }
    return 0;
  };

  const getComparator2 = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator2(a, b, orderBy)
      : (a, b) => -descendingComparator2(a, b, orderBy);
  };

  const handleChangePage3 = (event, newPage) => {
    setPage3(newPage);
  };

  const handleChangeRowsPerPage3 = (event) => {
    setRowsPerPage3(parseInt(event.target.value, 10));
    setPage3(0);
  };

  const stableSort3 = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order2 = comparator(a[0], b[0]);
      if (order2 !== 0) return order2;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const descendingComparator3 = (a2, b2, orderBy2) => {
    if (b2[orderBy2] < a2[orderBy2]) {
      return -1;
    }
    if (b2[orderBy2] > a2[orderBy2]) {
      return 1;
    }
    return 0;
  };

  const getComparator3 = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator3(a, b, orderBy)
      : (a, b) => -descendingComparator3(a, b, orderBy);
  };

  const handleChangePage4 = (event, newPage) => {
    setPage4(newPage);
  };

  const handleChangeRowsPerPage4 = (event) => {
    setRowsPerPage4(parseInt(event.target.value, 10));
    setPage4(0);
  };

  const stableSort4 = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order2 = comparator(a[0], b[0]);
      if (order2 !== 0) return order2;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const descendingComparator4 = (a2, b2, orderBy2) => {
    if (b2[orderBy2] < a2[orderBy2]) {
      return -1;
    }
    if (b2[orderBy2] > a2[orderBy2]) {
      return 1;
    }
    return 0;
  };

  const getComparator4 = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator4(a, b, orderBy)
      : (a, b) => -descendingComparator4(a, b, orderBy);
  };

  function cargarEfectividadCobranza() {
    let forms = {
      mes: mesSelected,
      año: añoSelected,
      proyecto: terrenoSelected,
    };
    setIsLoading(true);
    console.log("forms:", forms);

    cobranzaService.getIEfectividadCobranza(
      forms,
      onEfectividadCargada,
      onError
    );
  }

  function onEfectividadCargada(params) {
    console.log("params: ", params);
    console.log("filas: ", params.datos);

    setDatos(params.datos);
    setDatosClientesCongelados(params.clientesCongelados);
    setTotalClientes(params.totalClientes);
    setTotalMontoAnticipo(params.totalMontoAnticipo);
    setTotalMontoCobrado(params.totalMontoCobrado);
    setTotalMontoEsperado(params.totalMontoEsperado);
    setTotalPendienteCobrar(params.totalPendienteCobrar);
    setTotalPorcentajeImporte(params.totalPorcentajeImporte);
    setTotalPorcentajeClientes(params.totalPorcentajeClientes);

    setIsLoading(false);
  }

  const handleRowClick = (dato) => {
    console.log("Fila clickeada:", dato);
    if (dato.lapso == "Otros") {
      console.log("Fila clickeada Otros:", dato);
      setDatosModalEfectivo(dato.registros);
      setShowModalEfectivo(true);
    } else {
      setDatosModal(dato.registros);
      setShowModal(true);
    }
  };

  function cambiarColor(lapso) {
    if (lapso === "Mes") {
      return {
        backgroundColor: lapso === "Mes" ? "#15297c" : "default",
        color: lapso === "Mes" ? "white" : "black",
        cursor: "pointer",
        "& .MuiTableCell-root": {
          color: lapso === "Mes" ? "white" : "black",
        },
      };
    }
    if (lapso === "Quincena - 1") {
      return {
        backgroundColor: "#107acc",
        cursor: "pointer",
        "& .MuiTableCell-root": {
          color: lapso === "Quincena - 1" ? "white" : "black",
        },
      };
    }
    if (lapso === "Quincena - 2") {
      return {
        backgroundColor: "#2898ee",
        cursor: "pointer",
        "& .MuiTableCell-root": {
          color: lapso === "Quincena - 2" ? "white" : "black",
        },
      };
    } else {
      return {
        cursor: "pointer",
      };
    }
  }

  const handleClientesPagadosClick = (dato) => {
    setDatosModalClientesPagados(dato);
    setShowModalClientesCobrados(true);
  };

  const handleClientesPorPagarClick = (dato) => {
    setDatosModalClientesPorPagar(dato);
    setShowModalClientesPorCobrar(true);
  };

  async function borrarAmortizacion() {
    await Swal.fire({
      title: "Eliminar todas las amortizaciones?",
      text: `¿Estás seguro de eliminarlas? `,
      icon: "question",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    }).then((result) => {
      console.log("result: ", result);

      if (result.isConfirmed) {
        cobranzaService.borrarAmortizaciones(onAmortizacionBorrada, onError);
      }
    });
  }
  async function onAmortizacionBorrada(data) {
    if (data.success) {
      Swal.fire({
        title: "Amortizaciones eliminadas con éxito",
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
        text: "No Se Pudieron Borrar las Amortizaciones",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      });
    }
  }

  function handleTerrenos(params) {
    console.log("params: ", params);
    setTerrenoSelected(params);
  }

  return (
    <>
      <Row justify={"center"}>
        <Typography.Title level={2}>Efectividad Cobranza</Typography.Title>
      </Row>
      <Form form={form} {...layout} name="busqueda">
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          justify="center"
          style={{ paddingTop: 10 }}
        >
          <Col xs={24} sm={12} md={12} lg={8} xl={4} xxl={4}>
            <Form.Item
              name="mes"
              label="Seleccione mes"
              style={{ width: "100%" }}
            >
              <Select
                placeholder="Todos los meses"
                optionLabelProp="label"
                value={mesSelected}
                onChange={(value) => {
                  setMesSelected(value);
                }}
                options={months}
                style={{ minWidth: 150 }}
              ></Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={4} xxl={4}>
            <Form.Item
              name="año"
              label="Seleccione año"
              style={{ width: "100%" }}
            >
              <Select
                placeholder="Todos los Años"
                optionLabelProp="label"
                value={añoSelected}
                onChange={(value) => {
                  setAñoSelected(value || "0");
                }}
                options={years}
                style={{ minWidth: 150 }}
              ></Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <Form.Item
              name="proyecto"
              label="Seleccione un Proyecto"
              style={{ width: "100%" }}
            >
              <Space style={{ width: "100%" }}>
                <Select
                  showSearch
                  placeholder="Seleccione un Proyecto"
                  style={{ minWidth: 150 }}
                  optionLabelProp="label"
                  onChange={handleTerrenos}
                >
                  {terrenos &&
                    opcion.map((item, index) => (
                      <Option key={item.id} value={item.id} label={item.nombre}>
                        {item?.nombre}
                      </Option>
                    ))}
                  {terrenos?.map((item, index) => (
                    <Option key={item.id} value={item.id} label={item.nombre}>
                      {item?.nombre}
                    </Option>
                  ))}
                </Select>

                {/* <Button
                  type="primary"
                  onClick={() => {
                    borrarAmortizacion();
                  }}
                >
                  Borrar Todas Las Amortizaciones
                </Button> */}
                <Button
                  type="primary"
                  onClick={() => {
                    cargarEfectividadCobranza();
                  }}
                >
                  Buscar
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row justify={"center"} className="mb-5">
        <Col xs={24} sm={12} md={22} lg={22} xl={22} xxl={22}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Lapso</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Considerada</p>
                  </TableCell>
                  <TableCell>
                    <p>Total Clientes</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Esperado</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Anticipo</p>
                  </TableCell>
                  <TableCell>
                    <p>Clientes Cobrados</p>
                  </TableCell>
                  <TableCell>
                    <p>Total Percibido</p>
                  </TableCell>
                  <TableCell /* style={{ width: 180 }} */>
                    <p>Clientes Por Cobrar</p>
                  </TableCell>
                  <TableCell>
                    <p>Pendiente Por Cobrar</p>
                  </TableCell>
                  <TableCell>
                    <p>% Importe</p>
                  </TableCell>
                  <TableCell>
                    <p>% Clientes</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datos.map((dato, index) => (
                  <TableRow
                    key={dato.id}
                    onClick={() => handleRowClick(dato)}
                    sx={cambiarColor(dato.lapso)}
                  >
                    <TableCell>{dato.lapso}</TableCell>
                    <TableCell>{dato.fecha_considerada}</TableCell>
                    <TableCell>{dato.total_clientes}</TableCell>
                    <TableCell>
                      $
                      {formatPrecio(parseFloat(dato.monto_esperado.toFixed(2)))}
                    </TableCell>
                    <TableCell>
                      $
                      {formatPrecio(parseFloat(dato.monto_anticipo.toFixed(2)))}
                    </TableCell>
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el evento se propague al TableRow
                        console.log(
                          "clientes cobrados: ",
                          dato.clientes_cobrados
                        );
                        handleClientesPagadosClick(
                          dato.registros_clientes_cobrados
                        );
                      }}
                    >
                      {dato.clientes_cobrados}
                    </TableCell>
                    <TableCell>
                      ${formatPrecio(parseFloat(dato.monto_cobrado.toFixed(2)))}
                    </TableCell>
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el evento se propague al TableRow
                        console.log(
                          "clientes por cobrar: ",
                          dato.clientes_por_cobrar
                        );
                        handleClientesPorPagarClick(
                          dato.registros_clientes_por_cobrar
                        );
                      }}
                    >
                      {dato.clientes_por_cobrar}
                    </TableCell>
                    <TableCell>
                      $
                      {formatPrecio(
                        parseFloat(dato.pendiente_por_cobrar.toFixed(2))
                      )}
                    </TableCell>
                    <TableCell>
                      {isNaN(formatPrecio(parseFloat(dato.porcentaje_importe)))
                        ? "0"
                        : formatPrecio(parseFloat(dato.porcentaje_importe))}
                      %
                    </TableCell>
                    <TableCell>
                      {isNaN(formatPrecio(parseFloat(dato.porcentaje_clientes)))
                        ? "0"
                        : formatPrecio(parseFloat(dato.porcentaje_clientes))}
                      %
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>Total: {totalClientes}</TableCell>
                  <TableCell>
                    Total: $
                    {isNaN(totalMontoEsperado)
                      ? "0"
                      : formatPrecio(parseFloat(totalMontoEsperado.toFixed(2)))}
                  </TableCell>
                  <TableCell>
                    Total: $
                    {isNaN(totalMontoAnticipo)
                      ? "0"
                      : formatPrecio(parseFloat(totalMontoAnticipo.toFixed(2)))}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    Total: $
                    {isNaN(totalMontoCobrado)
                      ? "0"
                      : formatPrecio(parseFloat(totalMontoCobrado.toFixed(2)))}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    Total: $
                    {isNaN(totalPendienteCobrar)
                      ? "0"
                      : formatPrecio(
                          parseFloat(totalPendienteCobrar.toFixed(2))
                        )}
                  </TableCell>
                  <TableCell>
                    Total:
                    {isNaN(totalPorcentajeImporte)
                      ? "0"
                      : formatPrecio(parseFloat(totalPorcentajeImporte))}
                    %
                  </TableCell>
                  <TableCell>
                    Total:
                    {isNaN(totalPorcentajeClientes)
                      ? "0"
                      : formatPrecio(parseFloat(totalPorcentajeClientes))}
                    %
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Col>
      </Row>

      <Row justify={"center"}>
        <Typography.Title level={3}>Clientes Congelados</Typography.Title>
      </Row>

      <Row justify={"center"} className="mb-5 mt-2">
        <Col xs={24} sm={12} md={22} lg={22} xl={22} xxl={22}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Terreno/Lote</p>
                  </TableCell>
                  <TableCell>
                    <p>Nombre Cliente</p>
                  </TableCell>
                  <TableCell>
                    <p>Importe Vencido</p>
                  </TableCell>
                  <TableCell>
                    <p>Saldo</p>
                  </TableCell>
                  <TableCell>
                    <p>Ultimo Pago</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Congelo</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Termina</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort2(
                  datosClientesCongelados,
                  getComparator2(order2, orderBy2)
                )
                  .slice(
                    page2 * rowsPerPage2,
                    page2 * rowsPerPage2 + rowsPerPage2
                  )
                  .map((dato, index) => (
                    <TableRow key={dato.id}>
                      <TableCell>{dato.lote}</TableCell>
                      <TableCell>{dato.nombre_completo}</TableCell>
                      <TableCell>
                        ${formatPrecio(parseFloat(dato.importe_vencido))}
                      </TableCell>
                      <TableCell>
                        ${formatPrecio(parseFloat(dato.saldo))}
                      </TableCell>
                      <TableCell>{dato.ultimo_pago}</TableCell>
                      <TableCell>{dato.fecha_congelado}</TableCell>
                      <TableCell>{dato.fecha_termina}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={datosClientesCongelados.length}
                    rowsPerPage={rowsPerPage2}
                    page={page2}
                    onPageChange={handleChangePage2}
                    onRowsPerPageChange={handleChangeRowsPerPage2}
                    labelRowsPerPage="Registros por Página"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Col>
      </Row>

      <Modal
        title={customTitle("Registro de Clientes", 3)}
        footer={null}
        width="lg"
        open={showModal}
        onCancel={() => handleCloseModal()}
      >
        <Row style={{ paddingTop: 10, justifyContent: "space-evenly" }}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Nombre Cliente</p>
                  </TableCell>
                  <TableCell>
                    <p>Num. Pago</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Pago</p>
                  </TableCell>
                  {/* <TableCell>
                    <p>Fecha Pagado</p>
                  </TableCell> */}
                  <TableCell>
                    <p>Monto a Pagar</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Amortización Pagado</p>
                  </TableCell>
                  <TableCell /* style={{ width: 180 }} */>
                    <p>Monto Pendiente</p>
                  </TableCell>
                  <TableCell>
                    <p>Terreno/Lote</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort2(datosModal, getComparator2(order2, orderBy2))
                  .slice(
                    page2 * rowsPerPage2,
                    page2 * rowsPerPage2 + rowsPerPage2
                  )
                  .map((dato, index) => (
                    <TableRow key={dato.id}>
                      <TableCell>{dato.nombre_cliente}</TableCell>
                      <TableCell>{dato.no_pago}</TableCell>
                      {/* .join(", ") */}
                      <TableCell>{dato.fecha_pago}</TableCell>
                      {/* <TableCell>{dato.fecha_pagado}</TableCell> */}
                      <TableCell>
                        ${formatPrecio(parseFloat(dato.monto_pago))}
                      </TableCell>
                      <TableCell>
                        ${formatPrecio(parseFloat(dato.monto_pagado))}
                      </TableCell>
                      <TableCell>
                        $
                        {dato.monto_pago - dato.monto_pagado < 0
                          ? 0
                          : formatPrecio(
                              parseFloat(dato.monto_pago - dato.monto_pagado)
                            )}
                      </TableCell>
                      <TableCell>{dato.terreno}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={datosModal.length}
                    rowsPerPage={rowsPerPage2}
                    page={page2}
                    onPageChange={handleChangePage2}
                    onRowsPerPageChange={handleChangeRowsPerPage2}
                    labelRowsPerPage="Registros por Página"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Row>

        <div
          className="terreno-edit__botones-footer"
          style={{ paddingBottom: 15 }}
        >
          <span className="flex gap-2 justify-end">
            <Button onClick={handleCloseModal} danger size="large">
              Cerrar
            </Button>
          </span>
        </div>
      </Modal>

      <Modal
        title={customTitle("Clientes Cobrados", 3)}
        footer={null}
        width="lg"
        open={showModalClientesCobrados}
        onCancel={() => handleCloseModalClientesCobrados()}
      >
        <Row style={{ paddingTop: 10, justifyContent: "space-evenly" }}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Nombre Cliente</p>
                  </TableCell>
                  <TableCell>
                    <p>Num. Pago</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Pago</p>
                  </TableCell>
                  {/* <TableCell>
                    <p>Fecha Pagado</p>
                  </TableCell> */}
                  <TableCell>
                    <p>Monto a Pagar</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Amortización Pagado</p>
                  </TableCell>
                  <TableCell /* style={{ width: 180 }} */>
                    <p>Monto Pendiente</p>
                  </TableCell>
                  <TableCell>
                    <p>Terreno/Lote</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort3(
                  datosModalClientesPagados,
                  getComparator3(order3, orderBy3)
                )
                  .slice(
                    page3 * rowsPerPage3,
                    page3 * rowsPerPage3 + rowsPerPage3
                  )
                  .map((dato, index) => (
                    <TableRow key={dato.id}>
                      <TableCell>{dato.nombre_cliente}</TableCell>
                      <TableCell>{dato.no_pago}</TableCell> {/* .join(", ") */}
                      <TableCell>{dato.fecha_pago}</TableCell>
                      {/* <TableCell>{dato.fecha_pagado}</TableCell> */}
                      <TableCell>
                        ${formatPrecio(parseFloat(dato.monto_pago))}
                      </TableCell>
                      <TableCell>
                        ${formatPrecio(parseFloat(dato.monto_pagado))}
                      </TableCell>
                      <TableCell>
                        $
                        {dato.monto_pago - dato.monto_pagado < 0
                          ? 0
                          : formatPrecio(
                              parseFloat(dato.monto_pago - dato.monto_pagado)
                            )}
                      </TableCell>
                      <TableCell>{dato.terreno}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={datosModalClientesPagados.length}
                    rowsPerPage={rowsPerPage3}
                    page={page3}
                    onPageChange={handleChangePage3}
                    onRowsPerPageChange={handleChangeRowsPerPage3}
                    labelRowsPerPage="Registros por Página"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Row>

        <div
          className="terreno-edit__botones-footer"
          style={{ paddingBottom: 15 }}
        >
          <span className="flex gap-2 justify-end">
            <Button
              onClick={handleCloseModalClientesCobrados}
              danger
              size="large"
            >
              Cerrar
            </Button>
          </span>
        </div>
      </Modal>

      <Modal
        title={customTitle("Clientes Por Cobrar", 3)}
        footer={null}
        width="lg"
        open={showModalClientesPorCobrar}
        onCancel={() => handleCloseModalClientesPorCobrar()}
      >
        <Row style={{ paddingTop: 10, justifyContent: "space-evenly" }}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Nombre Cliente</p>
                  </TableCell>
                  <TableCell>
                    <p>Num. Pago</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Pago</p>
                  </TableCell>
                  {/* <TableCell>
                    <p>Fecha Pagado</p>
                  </TableCell> */}
                  <TableCell>
                    <p>Monto a Pagar</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Amortización Pagado</p>
                  </TableCell>
                  <TableCell /* style={{ width: 180 }} */>
                    <p>Monto Pendiente</p>
                  </TableCell>
                  <TableCell /* style={{ width: 180 }} */>
                    <p>Intereses</p>
                  </TableCell>
                  <TableCell>
                    <p>Terreno/Lote</p>
                  </TableCell>
                  <TableCell>
                    <p>Telefóno</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort4(
                  datosModalClientesPorPagar,
                  getComparator4(order4, orderBy4)
                )
                  .slice(
                    page4 * rowsPerPage4,
                    page4 * rowsPerPage4 + rowsPerPage4
                  )
                  .map((dato, index) => (
                    <TableRow key={dato.id}>
                      <TableCell>{dato.nombre_cliente}</TableCell>
                      <TableCell>{dato.no_pago}</TableCell>
                      {/* //.join(", ") */}
                      <TableCell>{dato.fecha_pago}</TableCell>
                      {/* <TableCell>{dato.fecha_pagado}</TableCell> */}
                      <TableCell>
                        ${formatPrecio(parseFloat(dato.monto_pago))}
                      </TableCell>
                      <TableCell>
                        ${formatPrecio(parseFloat(dato.monto_pagado))}
                      </TableCell>
                      <TableCell>
                        $
                        {dato.monto_pago - dato.monto_pagado < 0
                          ? 0
                          : formatPrecio(
                              parseFloat(dato.monto_pago - dato.monto_pagado)
                            )}
                      </TableCell>
                      <TableCell>
                        $
                        {formatPrecio(
                          isNaN(parseFloat(dato.monto_interes))
                            ? 0
                            : parseFloat(dato.monto_interes)
                        )}
                      </TableCell>
                      <TableCell>{dato.terreno}</TableCell>
                      <TableCell>{dato.telefono}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={datosModalClientesPorPagar.length}
                    rowsPerPage={rowsPerPage4}
                    page={page4}
                    onPageChange={handleChangePage4}
                    onRowsPerPageChange={handleChangeRowsPerPage4}
                    labelRowsPerPage="Registros por Página"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Row>

        <div
          className="terreno-edit__botones-footer"
          style={{ paddingBottom: 15 }}
        >
          <span className="flex gap-2 justify-end">
            <Button
              onClick={handleCloseModalClientesPorCobrar}
              danger
              size="large"
            >
              Cerrar
            </Button>
          </span>
        </div>
      </Modal>

      <Modal
        title={customTitle("Clientes En Efectivo", 3)}
        footer={null}
        width="lg"
        open={showModalEfectivo}
        onCancel={() => handleCloseModalEfectivo()}
      >
        <Row style={{ paddingTop: 10, justifyContent: "space-evenly" }}>
          <TableContainer component={Paper} className="tabla">
            <Table>
              <TableHead className="tabla_encabezado">
                <TableRow>
                  <TableCell>
                    <p>Nombre Cliente</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Solicitud</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Pagado</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Pendiente</p>
                  </TableCell>
                  <TableCell>
                    <p>Terreno/Lote</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort4(
                  datosModalEfectivo,
                  getComparator4(order4, orderBy4)
                )
                  .slice(
                    page4 * rowsPerPage4,
                    page4 * rowsPerPage4 + rowsPerPage4
                  )
                  .map((dato, index) => (
                    <TableRow key={dato.id}>
                      <TableCell>{dato.nombre_cliente}</TableCell>
                      <TableCell>{dato.fecha_solicitud}</TableCell>
                      <TableCell>
                        ${formatPrecio(parseFloat(dato.monto_pagado))}
                      </TableCell>
                      <TableCell>
                        ${formatPrecio(parseFloat(dato.pendiente))}
                      </TableCell>
                      <TableCell>{dato.terreno}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={datosModalEfectivo.length}
                    rowsPerPage={rowsPerPage4}
                    page={page4}
                    onPageChange={handleChangePage4}
                    onRowsPerPageChange={handleChangeRowsPerPage4}
                    labelRowsPerPage="Registros por Página"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Row>
        <div
          className="terreno-edit__botones-footer"
          style={{ paddingBottom: 15 }}
        >
          <span className="flex gap-2 justify-end">
            <Button onClick={handleCloseModalEfectivo} danger size="large">
              Cerrar
            </Button>
          </span>
        </div>
      </Modal>
    </>
  );
}
