"use client";

import {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Row, Form, Button, Modal, InputNumber, Typography } from "antd";
const { Title } = Typography;
import { useForm } from "antd/es/form/Form";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";

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
import lotesService from "@/services/lotesService";
import { formatPrecio } from "@/helpers/formatters";
import CroquisUploader from "@/components/CroquisUploader";
import CroquisCropped from "./CroquisCropper";

const AsignarM2 = forwardRef(({ terrenoId }, ref) => {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const [lotes, setLotes] = useState(null);
  const [loteId, setLoteId] = useState(0);
  const [initialLotes, setInitialLotes] = useState(null);
  const [areaVendible, setAreaVendible] = useState(0);
  const [areaAsignada, setAreaAsignada] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [lotesData, setLotesData] = useState([]);

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [pdf, setPdf] = useState("");
  const [resetCroquis, setResetCroquis] = useState(() => () => {});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    lotesService.getLoteByTerrenoId(
      terrenoId,
      (data) => {
        setLotes(data.lotes);
        setInitialLotes(JSON.parse(JSON.stringify(data.lotes)));
        setAreaVendible(data.area_vendible);
        setAreaAsignada(data.area_asignada);
      },
      onerror
    );
    setRefresh(false);
  }, [terrenoId, refresh]);

  const handleSuperficieChange = (id, event) => {
    const value = event;
    const index = lotes.findIndex((item) => item.id === id);
    if (index !== -1) {
      const updatedLotes = [...lotes];
      updatedLotes[index].superficie = value;
      setLotes(updatedLotes);
      const updatedLotesData = lotesData.filter((item) => item.lote_id !== id);
      setLotesData([...updatedLotesData, { lote_id: id, superficie: value }]);
    } else {
      setLotesData((prevState) => [
        ...prevState,
        { lote_id: id, superficie: value },
      ]);
    }
  };

  const validateSuperficie = () => {
    for (let lote of lotesData) {
      if (!lote.superficie) {
        return false;
      }
    }
    return true;
  };

  const onGuardarSuperficie = () => {
    if (!validateSuperficie()) {
      Swal.fire({
        title: "Error",
        text: "Por favor, complete todas las superficies antes de guardar.",
        icon: "error",
        confirmButtonColor: "#ff4d4f",
      });
      return;
    } else {
      Swal.fire({
        title: "Verifique que los datos sean correctos",
        icon: "info",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          lotesService.asignarSuperficie(
            { data_lotes: lotesData },
            onSuperficieAsignada,
            onerror
          );
        }
      });
    }
  };

  const onSuperficieAsignada = (data) => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    if (data.success) {
      Swal.fire({
        title: "Superficie Asignada correctamente",
        icon: "success",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`,
      });
    }
  };

  const handleSaveFile = () => {
    let params = {
      lote_id: loteId,
      pdf: pdf,
    };
    lotesService.postLoteCroquis(params, onSaveFile, onerror);
  };

  async function onSaveFile(data) {
    if (data.success) {
      Swal.fire({
        title: "Guardado",
        icon: "success",
        text: "Se ha guardado el archivo",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showCancelButton: false,
        confirmButtonText: "Aceptar",
        customClass: {
          container: "swal-z-index-9999",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setRefresh(true);
          handleClose();
          console.log(data.data);
        }
      });
    } else {
      Swal.fire({
        title: "Error al guardar",
        icon: "error",
        text: `Ha ocurrido un error al intentar guardar el archivo: ${data.message}`,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showCancelButton: false,
        confirmButtonText: "Aceptar",
        customClass: {
          container: "swal-z-index-9999",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          handleClose();
        }
      });
    }
  }

  const handleCancel = async () => {
    Swal.fire({
      title: "¿Desea cancelar el proceso?",
      icon: "info",
      text: "Se revertirán todos los valores al estado original.",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setLotes(JSON.parse(JSON.stringify(initialLotes)));
        form.resetFields();
        form.setFieldsValue(
          initialLotes.reduce((acc, lote) => {
            acc[`superficie_${lote.id}`] = lote.superficie;
            return acc;
          }, {})
        );
        setLotesData([]);
      }
    });
  };

  const handleFileSelected = (pdf) => {
    setPdf(pdf);
  };

  const handleCroquisReset = useCallback((resetFunc) => {
    setResetCroquis(() => resetFunc);
  }, []);

  const handleClose = () => {
    resetCroquis();
    setShow(false);
    setShow2(false);
    setPdf("");
    setLoteId(0);
  };

  useImperativeHandle(ref, () => ({
    resetFields: () => {
      form.resetFields();
      setLotesData([]);
    },
  }));

  return (
    <div className="p-8 grid gap-8">
      {loading && (
        <>
          <Loader />
        </>
      )}
      <Row justify={"center"} style={{ backgroundColor: "rgb(66, 142, 202)" }}>
        <h1 style={{ color: "white", padding: "4px", fontSize: "20px" }}>
          Asignación de Superficie
        </h1>
      </Row>

      <Row justify={"space-around"}>
        <Typography>
          Área Asignada: {formatPrecio(areaAsignada.toFixed(2))}
        </Typography>
        <Typography>
          Área por Asignar:{" "}
          {formatPrecio((areaVendible - areaAsignada).toFixed(2))}
        </Typography>
      </Row>

      {lotes && (
        <Row justify={"center"}>
          <Form
            style={{ width: "100%" }}
            initialValues={lotes.reduce((acc, lote) => {
              acc[`superficie_${lote.id}`] = lote.superficie;
              return acc;
            }, {})}
            form={form}
          >
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ textAlign: "center" }}>
                      <b style={{ fontWeight: "bold" }}>N° de Lote</b>
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <b style={{ fontWeight: "bold" }}>Superficie en M²</b>
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      <b style={{ fontWeight: "bold" }}>Croquis del lote</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lotes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((lote, index) => (
                      <TableRow key={lote.id}>
                        <TableCell align="center">{lote.numero}</TableCell>
                        <TableCell align="center">
                          <Form.Item
                            name={`superficie_${lote.id}`}
                            rules={[
                              {
                                required: true,
                                message: "Ingrese la Superficie del Lote",
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: "80px", marginTop: "25px" }}
                              placeholder="Ingrese la Superficie"
                              suffix={"M²"}
                              value={lote.superficie}
                              onChange={(e) =>
                                handleSuperficieChange(lote.id, e)
                              }
                            />
                          </Form.Item>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            style={{ width: "120px" }}
                            onClick={() => {
                              setShow(true);
                              setLoteId(lote.id);
                            }}
                          >
                            {lote.pdf ? "Actualizar" : "Subir archivo"}
                          </Button>
                          <Button
                            style={{ width: "120px" }}
                            onClick={() => {
                              setShow2(true);
                              setLoteId(lote.id);
                            }}
                          >
                            {lote.recorte
                              ? "Actualizar cuadro"
                              : "Recortar cuadro"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>
                      <Button size="large" danger onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </TableCell>
                    <TableCell colSpan={2} style={{ textAlign: "right" }}>
                      <Button
                        htmlType="submit"
                        size="large"
                        onClick={onGuardarSuperficie}
                      >
                        Asignar Superficie
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      count={lotes?.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      labelRowsPerPage="Lotes por Página"
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Form>
        </Row>
      )}
      <Modal
        title={
          <Title
            className="formulario"
            style={{ textAlign: "center", color: "#FFFFFF", margin: "8px" }}
          >
            Croquis del Lote
          </Title>
        }
        open={show}
        onCancel={() => {
          handleClose();
        }}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="formulario">
          <div style={{ margin: "16px", textAlign: "center" }}>
            <CroquisUploader
              onFileSelected={handleFileSelected}
              onReset={handleCroquisReset}
            />
          </div>
          <Row justify={"center"}>
            <Button disabled={pdf == ""} onClick={handleSaveFile}>
              Guardar
            </Button>
          </Row>
        </div>
      </Modal>
      {show2 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 9999,
            overflow: "auto",
            padding: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              maxWidth: "90vw",
              margin: "auto",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <CroquisCropped
              id={loteId}
              onCloseRequest={() => setShow2(false)}
            />
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Button onClick={() => setShow2(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

AsignarM2.displayName = "AsignarM2";
export default AsignarM2;
