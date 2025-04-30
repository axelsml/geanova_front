"use client";

import Link from "next/link";
import { formatPrecio } from "@/helpers/formatters";
import terrenosService from "@/services/terrenosService";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { Button, Col, Row, Tooltip } from "antd";
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
import ReporteProyectoForm from "@/components/ReporteProyectoForm";
import { getCookiePermisos } from "@/helpers/valorPermisos";

export default function TerrenosCrear() {
  const [reporteProyecto, setReporteProyecto] = useState(false);

  const [terrenos, setTerrenos] = useState(null);
  const [terreno, setTerreno] = useState(null);

  const [changeState, setChangeState] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [cookiePermisos, setCookiePermisos] = useState([]);

  useEffect(() => {
    terrenosService.getTerrenos(setTerrenos, Error);
    getCookiePermisos("lista de terrenos", setCookiePermisos);
  }, [changeState]);

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
    <>
      {!reporteProyecto && (
        <>
          <Row justify={"center"}>
            <Col className="titulo_pantallas">
              <span className="titulo_pantallas-text">LISTA DE TERRENOS</span>
            </Col>
          </Row>
        </>
      )}
      {!reporteProyecto && (
        <>
          <Row
            style={{ marginTop: "100px", marginRight: "12%" }}
            justify={"end"}
          >
            <Col>
              <Link href="/terrenos/crear/nuevo" passHref>
                <Button
                  className="boton"
                  size={"large"}
                  disabled={cookiePermisos >= 2 ? false : true}
                >
                  Nuevo Terreno
                </Button>
              </Link>
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
          {reporteProyecto && (
            <ReporteProyectoForm
              setReporteNuevo={setReporteProyecto}
              setWatch={setChangeState}
              watch={changeState}
            />
          )}
        </Col>
      </Row>

      {terrenos?.length > 0 && !reporteProyecto && (
        <Row justify={"center"}>
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
                          <Link
                            href={{
                              pathname: "/terrenos/crear/info",
                              query: { id: terreno.id },
                            }}
                            passHref
                          >
                            <Button className="boton" size="large">
                              <FaArrowUpRightFromSquare
                                className="m-auto"
                                size={"20px"}
                              />
                            </Button>
                          </Link>
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
    </>
  );
}
