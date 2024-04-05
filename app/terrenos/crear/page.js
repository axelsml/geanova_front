"use client";

import AsignarM2 from "@/app/lotes/asignar/page";
import PlazosCrear from "@/app/plazos/crear/page";
import TerrenoForm from "@/components/TerrenoForm";
import { formatPrecio } from "@/helpers/formatters";
import terrenosService from "@/services/terrenosService";
import { Button, Col, Collapse, Row, Typography, Radio } from "antd";
import { useState, useEffect } from "react";

export default function TerrenosCrear() {
  const [nuevoTerreno, setNuevoTerreno] = useState(false);
  const [terrenos, setTerrenos] = useState(null);
  const [changeState, setChangeState] = useState(false);
  const [value, setValue] = useState(null);

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

  const CreateNuevoTerreno = () => {
    setNuevoTerreno(!nuevoTerreno);
  };

  return (
    <div className="p-8 grid gap-4">
      {!nuevoTerreno && (
        <Row justify={"center"}>
          <Col>
            <Button size={"large"} onClick={CreateNuevoTerreno}>
              Crear Nuevo Terreno
            </Button>
          </Col>
        </Row>
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

      {!nuevoTerreno && terrenos?.length > 0 && (
        <Row justify={"center"}>
          <Col span={21}>
            <Typography>Lista de Terrenos</Typography>
            <br />
          </Col>
          <Collapse className="w-11/12">
            {terrenos?.map((terreno, index) => (
              <Collapse.Panel header={terreno.nombre} key={index}>
                <Row justify={"space-between"}>
                  <Col className="px-5 grid gap-1">
                    <Typography className="text-lg">
                      Empresa:{" "}
                      {
                        empresas.find(
                          (empresa) => empresa.id === terreno.empresa_id
                        )?.nombre
                      }
                    </Typography>
                    <Typography className="text-lg">
                      Superficie Total: {formatPrecio(terreno.superficie_total)}{" "}
                      m<sup>2</sup>
                    </Typography>
                    <Typography className="text-lg">
                      Área de Reserva: {formatPrecio(terreno.area_reserva)} m
                      <sup>2</sup>
                    </Typography>
                    <Typography className="text-lg">
                      Área Vendible: {formatPrecio(terreno.area_vendible)} m
                      <sup>2</sup>
                    </Typography>
                    <Typography className="text-lg">
                      Área Vialidad: {formatPrecio(terreno.area_vialidad)} m
                      <sup>2</sup>
                    </Typography>
                  </Col>
                </Row>
                <br />
                <br />
                <Row justify={"center"}>
                  <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Asignar Superficie</Radio>
                    <Radio value={2}>Crear Plazos</Radio>
                  </Radio.Group>
                </Row>
                {value == 1 && <AsignarM2 terrenoId={terreno.id} />}
                {value == 2 && <PlazosCrear terrenoId={terreno.id} />}
              </Collapse.Panel>
            ))}
          </Collapse>
        </Row>
      )}
    </div>
  );
}
