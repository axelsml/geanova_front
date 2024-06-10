"use client";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "@/contexts/loading";
import { usuario_id } from "@/helpers/user";

import { formatPrecio, FormatDate } from "@/helpers/formatters";
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
  Tabs,
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
import Swal from "sweetalert2";
import {
  FaRegFileAlt,
  FaFilePdf,
  FaMoneyCheck,
  FaMoneyCheckAlt,
  FaMoneyBillAlt,
  FaCoins,
} from "react-icons/fa";

import ventasService from "@/services/ventasService";
import terrenosService from "@/services/terrenosService";
import lotesService from "@/services/lotesService";
import pagosService from "@/services/pagosService";
import PagoForm from "./PagoForm";
import { FaMoneyCheckDollar } from "react-icons/fa6";

export default function ReporteLotes() {
  const { setIsLoading } = useContext(LoadingContext);
  const [lotes, setLotes] = useState(null);
  const [loteSelected, setLoteSelected] = useState(null);
  const [terrenos, setTerrenos] = useState(null);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [info, setInfo] = useState(null);
  const [infoCliente, setInfoCliente] = useState(null);
  const [infoLote, setInfoLote] = useState(null);
  const [infoFecha, setInfoFecha] = useState(null);
  const [nuevoPago, setNuevoPago] = useState(false);
  const { Option } = Select;
  const opcion = [{ index: 0, id: 0, nombre: "Todos" }];

  const [changeState, setChangeState] = useState(false);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    terrenosService.getTerrenos(setTerrenos, Error);
  }, []);

  const BuscarInfoLote = () => {
    var params = {
      lote_id: loteSelected.id,
    };
    lotesService.reporteLotes(params, onInfoClienteCargado, onError);
  };

  async function onInfoClienteCargado(data) {
    setIsLoading(false);
    if (data.encontrado) {
      setInfo(data.response);
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
    console.log(lotes);
  }

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

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

  const handleModalPago = (lote, cliente, fecha) => {
    setShow(true);
    setNuevoPago(!nuevoPago);
    setInfoLote(lote);
    setInfoCliente(cliente);
    setInfoFecha(fecha);
    debugger;
  };

  const handleCloseModal = () => {
    setShow(false);
    setNuevoPago(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          xxl={7}
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
                setLoteSelected(loteSelected || "0");
              }}
            >
              {lotes &&
                opcion.map((item, index) => (
                  <Option key={index} value={item.id} label={item.nombre}>
                    {item?.nombre}
                  </Option>
                ))}
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
      {info != null && (
        <Row justify={"center"} className="large tabla">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="tabla_encabezado">
                  <TableCell>
                    <p>No.</p>
                  </TableCell>
                  <TableCell>
                    <p>No. Lote</p>
                  </TableCell>
                  <TableCell>
                    <p>Nombre</p>
                  </TableCell>
                  <TableCell>
                    <p>Telefono</p>
                  </TableCell>
                  <TableCell>
                    <p>Estado</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Pago</p>
                  </TableCell>
                  <TableCell>
                    <p>Anticipo</p>
                  </TableCell>
                  <TableCell>
                    <p>Monto Contrato</p>
                  </TableCell>
                  <TableCell>
                    <p>Saldo Vencido</p>
                  </TableCell>
                  <TableCell>
                    <p>Estado de cuenta</p>
                  </TableCell>
                  <TableCell>
                    <p>Amortizacion</p>
                  </TableCell>
                  <TableCell>
                    <p>Realizar pago</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {info.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item["resumen_lote"]["lote"]}</TableCell>
                    <TableCell>
                      {item["resumen_cliente"]["nombre_completo"]}
                    </TableCell>
                    <TableCell>
                      {item["resumen_cliente"]["telefono_celular"]}
                    </TableCell>
                    <TableCell>
                      <Button
                        disabled
                        size={"small"}
                        shape="round"
                        style={{
                          backgroundColor:
                            item["resumen_lote"]["situacion_solicitud_color"],
                        }}
                      ></Button>
                    </TableCell>
                    <TableCell>
                      ${" "}
                      {formatPrecio(
                        item["resumen_lote"]["amortizaciones"][0]["monto_pago"]
                      )}
                    </TableCell>
                    <TableCell>
                      $ {formatPrecio(item["resumen_lote"]["anticipo"])}
                    </TableCell>
                    <TableCell>
                      $ {formatPrecio(item["resumen_lote"]["monto_contrato"])}
                    </TableCell>
                    <TableCell>
                      $ {formatPrecio(item["resumen_lote"]["monto_vencido"])}
                    </TableCell>
                    <TableCell>
                      <Button
                        className="boton"
                        size="large"
                        key={item}
                        onClick={() => {
                          window.open(
                            `https://api.santamariadelaluz.com/getClienteByLote/${terrenoSelected.id}/${item["resumen_lote"]["lote_id"]}.pdf`
                          );
                        }}
                      >
                        <FaFilePdf className="m-auto" size={"20px"} />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        className="boton"
                        size="large"
                        onClick={() => {
                          window.open(
                            `https://api.santamariadelaluz.com/iUsuarios/${item["resumen_lote"]["amortizaciones"][0]["solicitud_id"]}.pdf`
                          );
                        }}
                      >
                        <FaFilePdf className="m-auto" size={"20px"} />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        className="boton"
                        size={"large"}
                        onClick={() => {
                          handleModalPago(
                            item["resumen_lote"],
                            item["resumen_cliente"],
                            item["fecha_proximo_pago"]
                          );
                        }}
                      >
                        <FaMoneyCheckDollar className="m-auto" size={"20px"} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={infoLote.pagos.length}
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
      {show && (
        <Modal visible={show} footer={null} onCancel={() => handleCloseModal()}>
          <Row justify={"center"}>
            <Col
              xs={24}
              sm={20}
              md={16}
              lg={14}
              xl={14}
              xxl={8}
              className="titulo_pantallas"
            >
              <b>Nuevo Pago</b>
            </Col>
          </Row>
          <Row justify={"center"}>
            <Col span={24}>
              {nuevoPago && (
                <PagoForm
                  setNuevoPago={setNuevoPago}
                  cliente={infoCliente}
                  lote={infoLote}
                  proximoPago={infoFecha}
                  setWatch={setChangeState}
                  watch={changeState}
                />
              )}
            </Col>
          </Row>
        </Modal>
      )}
    </div>
  );
}
