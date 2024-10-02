"use client";

import { LoadingContext } from "@/contexts/loading";
import {
  fechaFormateada2,
  formatPrecio,
  formatPrecio2,
} from "@/helpers/formatters";
import cobranzaService from "@/services/cobranzaService";
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

export default function EfectividadCobranza() {
  const { RangePicker } = DatePicker;
  const [date, setDate] = useState();
  const [range, setRange] = useState([]);
  const [mesSelected, setMesSelected] = useState(null);
  const [añoSelected, setAñoSelected] = useState(2024);
  const { setIsLoading } = useContext(LoadingContext);

  const [orderBy2] = useState("fechaOperacion");
  const [order2] = useState("desc");
  const [rowsPerPage2, setRowsPerPage2] = useState(5);
  const [page2, setPage2] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [datos, setDatos] = useState([]);
  const [datosModal, setDatosModal] = useState([]);

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const [form] = Form.useForm();

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

    setMesSelected(mesActual);
  }, []);

  function handleCloseModal(params) {
    setShowModal(false);
  }

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

  const customTitle = (
    <Row justify={"center"}>
      <Typography.Title level={3}>
        Administrar Tipos de Movimientos
      </Typography.Title>
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

  function cargarEfectividadCobranza() {
    let form = {
      mes: mesSelected,
      año: añoSelected,
    };
    setIsLoading(true);
    console.log("form:", form);

    cobranzaService.getIEfectividadCobranza(
      form,
      onEfectividadCargada,
      onError
    );
  }

  /* 
    todo modal para mostrar registros
  */
  function onEfectividadCargada(params) {
    console.log("params: ", params);
    console.log("filas: ", params.datos);

    setDatos(params.datos);
    setIsLoading(false);
  }

  const handleRowClick = (dato) => {
    console.log("Fila clickeada:", dato);
    setDatosModal(dato);
    setShowModal(true);
  };

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
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <Form.Item
              name="fecha"
              label="Selecciona fechas"
              style={{ width: "100%" }}
            >
              <Space style={{ width: "100%" }}>
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
                    <p>Monto Cobrado</p>
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
                {/* {stableSort2(datos, getComparator2(order2, orderBy2))
                  .slice(
                    page2 * rowsPerPage2,
                    page2 * rowsPerPage2 + rowsPerPage2
                  )
                  .map((dato, index) => ( */}
                {datos.map((dato, index) => (
                  <TableRow
                    key={dato.id}
                    hover
                    onClick={() => handleRowClick(dato.registros)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{dato.lapso}</TableCell>
                    <TableCell>{dato.fecha_considerada}</TableCell>
                    <TableCell>{dato.total_clientes}</TableCell>
                    <TableCell>${formatPrecio2(dato.monto_esperado)}</TableCell>
                    <TableCell>${formatPrecio2(dato.monto_cobrado)}</TableCell>
                    <TableCell>{dato.clientes_por_cobrar}</TableCell>
                    <TableCell>
                      ${formatPrecio2(dato.pendiente_por_cobrar)}
                    </TableCell>
                    <TableCell>
                      {formatPrecio2(dato.porcentaje_importe)} %
                    </TableCell>
                    <TableCell>
                      {formatPrecio2(dato.porcentaje_clientes)} %
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {/* <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={datos.length}
                    rowsPerPage={rowsPerPage2}
                    page={page2}
                    onPageChange={handleChangePage2}
                    onRowsPerPageChange={handleChangeRowsPerPage2}
                    labelRowsPerPage="Registros por Página"
                  />
                </TableRow>
              </TableFooter> */}
            </Table>
          </TableContainer>
        </Col>
      </Row>

      <Modal
        title={customTitle}
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
                  <TableCell>
                    <p>Monto Pago</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Pagado</p>
                  </TableCell>
                  <TableCell /* style={{ width: 180 }} */>
                    <p>Monto Pendiente</p>
                  </TableCell>
                  <TableCell>
                    <p>Fecha Pagado</p>
                  </TableCell>
                  <TableCell>
                    <p>Terreno</p>
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
                      <TableCell>{dato.fecha_pago}</TableCell>
                      <TableCell>${dato.monto_pago}</TableCell>
                      <TableCell>${dato.monto_pagado}</TableCell>
                      <TableCell>${dato.monto_pendiente}</TableCell>
                      <TableCell>{dato.fecha_pagado}</TableCell>
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
              Cancelar
            </Button>
          </span>
        </div>
      </Modal>
    </>
  );
}