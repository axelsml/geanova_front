"use client";

// import TerrenoForm from "@/components/TerrenoForm";
import { formatPrecio } from "@/helpers/formatters";
import terrenosService from "@/services/terrenosService";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { Button, Col, Collapse, Row, Typography, Radio, Tooltip } from "antd";
import { useState, useEffect } from "react";
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
// import TerrenoInfoForm from "@/components/TerrenoInfoForm";
// import ReporteProyectoForm from "@/components/ReporteProyectoForm";
import { getCookiePermisos } from "@/helpers/valorPermisos";
export default function TerrenosCrear() {
  const [nuevoTerreno, setNuevoTerreno] = useState(false);
  const [infoTerreno, setInfoTerreno] = useState(false);

  const [reporteProyecto, setReporteProyecto] = useState(false);

  const [terrenos, setTerrenos] = useState(null);
  const [terreno, setTerreno] = useState(null);

  const [changeState, setChangeState] = useState(false);
  const [value, setValue] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [cookiePermisos, setCookiePermisos] = useState([]);
  const empresas = [
    {
      id: 1,
      nombre: "Sucursal 1",
    },
  ];

  const onChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    terrenosService.getTerrenos(setTerrenos, Error);
    getCookiePermisos("lista de terrenos", setCookiePermisos);
  }, [changeState]);

  async function onTerreno(terrenos) {
    setProyectos(terrenos);
  }

  const CreateNuevoTerreno = () => {
    setNuevoTerreno(!nuevoTerreno);
  };
  const CreateReporteProyecto = () => {
    setReporteProyecto(!reporteProyecto);
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
      {!nuevoTerreno && !infoTerreno && !reporteProyecto && (
        <>
          <Row justify={"center"}>
            <Col
              xs={24}
              sm={20}
              md={16}
              lg={12}
              xl={8}
              xxl={4}
              className="titulo_pantallas"
            >
              <b>LISTA DE TERRENOS</b>
            </Col>
          </Row>
        </>
      )}
      {!nuevoTerreno && !infoTerreno && !reporteProyecto && (
        <>
          <Row
            style={{ marginTop: "100px", marginRight: "12%" }}
            justify={"end"}
          >
            <Col>
              <Button
                className="boton"
                size={"large"}
                disabled={cookiePermisos >= 2 ? false : true}
                onClick={CreateNuevoTerreno}
              >
                Crear Nuevo Terreno
              </Button>
            </Col>
            <Col>
              <Button
                className="boton"
                disabled={cookiePermisos >= 1 ? false : true}
                size={"large"}
                onClick={CreateReporteProyecto}
              >
                Reporte general proyecto
              </Button>
            </Col>
          </Row>
        </>
      )}
      <Row justify={"center"}>
        <Col span={24}>
          {/* {nuevoTerreno && (
            <TerrenoForm
              setTerrenoNuevo={setNuevoTerreno}
              setWatch={setChangeState}
              watch={changeState}
            />
          )} */}
        </Col>
      </Row>

      <Row justify={"center"}>
        <Col span={24}>
          {/* {infoTerreno && (
            <TerrenoInfoForm
              setTerrenoNuevo={setNuevoTerreno}
              terrenoSeleccionado={terreno}
            />
          )} */}
        </Col>
      </Row>

      <Row justify={"center"}>
        <Col span={24}>
          {/* {reporteProyecto && (
            <ReporteProyectoForm
              setReporteNuevo={setReporteProyecto}
              setWatch={setChangeState}
              watch={changeState}
            />
          )} */}
        </Col>
      </Row>

      {!nuevoTerreno &&
        !infoTerreno &&
        terrenos?.length > 0 &&
        !reporteProyecto && (
          <Row justify={"center"}>
            {/* <Col span={21}>
              <Typography>Lista de Terrenos</Typography>
              <br />
            </Col> */}
            <Row justify={"center"} className="w-3/4 m-auto">
              <TableContainer component={Paper} className="tabla">
                <Table>
                  <TableHead>
                    <TableRow className="tabla_encabezado">
                      <TableCell>
                        <p>Proyecto</p>
                      </TableCell>
                      <TableCell>
                        <p>Propietario</p>
                      </TableCell>
                      <TableCell>
                        <p>Domicilio</p>
                      </TableCell>
                      <TableCell>
                        <p>Colonia/Localidad</p>
                      </TableCell>
                      <TableCell>
                        <p>Ciudad</p>
                      </TableCell>
                      <TableCell>
                        <p>Superficie</p>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {terrenos?.map((terreno, index) => (
                      <TableRow key={index}>
                        <TableCell>{terreno.nombre}</TableCell>
                        <TableCell>{terreno.propietario}</TableCell>
                        <TableCell>{terreno.domicilio}</TableCell>
                        <TableCell>{terreno.colonia}</TableCell>
                        <TableCell>{terreno.ciudad}</TableCell>
                        <TableCell>
                          {formatPrecio(terreno.superficie_total)}
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={
                              "Datos del terreno seleccionado " + terreno.nombre
                            }
                          >
                            <Button
                              className="boton"
                              onClick={() => {
                                setTerreno(terreno);
                                setInfoTerreno(true);
                              }}
                              size="large"
                            >
                              <FaArrowUpRightFromSquare
                                className="m-auto"
                                size={"20px"}
                              />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Row>
          </Row>
        )}
      <div>
        {terreno != null && (
          <>
            <div>
              <Row>
                <h1>{terreno.proyecto}</h1>
              </Row>
              <Row>
                <Col></Col>
              </Row>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
