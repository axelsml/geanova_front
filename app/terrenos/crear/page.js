"use client";

import AsignarM2 from "@/app/lotes/asignar/page";
import PlazosCrear from "@/app/plazos/crear/page";
import TerrenoForm from "@/components/TerrenoForm";
import { formatPrecio } from "@/helpers/formatters";
import terrenosService from "@/services/terrenosService";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { Button, Col, Collapse, Row, Typography, Radio } from "antd";
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
import TerrenoInfoForm from "@/components/TerrenoInfoForm";
import ReporteProyectoForm from "@/components/ReporteProyectoForm";
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
            <Col>
              <Button size={"large"} onClick={CreateNuevoTerreno}>
                Crear Nuevo Terreno
              </Button>
            </Col>
          </Row>
          <Row justify={"center"}>
            <Col>
              <Button size={"large"} onClick={CreateReporteProyecto}>
                Reporte general proyecto
              </Button>
            </Col>
          </Row>
        </>
      )}

      <Row justify={"center"}>
        <Col span={24}>
          {nuevoTerreno && (
            <TerrenoForm
              setTerrenoNuevo={setNuevoTerreno}
              setWatch={setChangeState}
              watch={changeState}
            />
          )}
        </Col>
      </Row>

      <Row justify={"center"}>
        <Col span={24}>
          {infoTerreno && (
            <TerrenoInfoForm
              setTerrenoNuevo={setNuevoTerreno}
              terrenoSeleccionado={terreno}
              setWatch={setChangeState}
              watch={changeState}
            />
          )}
        </Col>
      </Row>

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

      {!nuevoTerreno &&
        !infoTerreno &&
        terrenos?.length > 0 &&
        !reporteProyecto && (
          <Row justify={"center"}>
            <Col span={21}>
              <Typography>Lista de Terrenos</Typography>
              <br />
            </Col>
            <Row justify={"center"} className="w-3/4 m-auto">
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Proyecto</TableCell>
                      <TableCell>Propietario</TableCell>
                      <TableCell>Domicilio</TableCell>
                      <TableCell>Colonia/Localidad</TableCell>
                      <TableCell>Ciudad</TableCell>
                      <TableCell>Superficie</TableCell>
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
                          <Button
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
