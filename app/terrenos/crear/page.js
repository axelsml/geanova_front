"use client";

import AsignarM2 from "@/app/lotes/asignar/page";
import PlazosCrear from "@/app/plazos/crear/page";
import TerrenoForm from "@/components/TerrenoForm";
import terrenosService from "@/services/terrenosService";
import { Button, Col, Collapse, Row, Typography, Radio } from "antd";
import { useState, useEffect } from "react";

export default function TerrenosCrear() {
  const [nuevoTerreno, setNuevoTerreno] = useState(false);
  const [terrenos, setTerrenos] = useState(null);
  const [changeState, setChangeState] = useState(false);
  const [value, setValue] = useState(null);

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
          <Col span={24}>
            <Typography>Lista de Terrenos</Typography>
          </Col>
          {terrenos?.map((terreno, index) => (
            <Collapse key={index} className="w-4/5">
              <Collapse.Panel header={terreno.nombre}>
                <Row justify={"center"}>
                  <Radio.Group onChange={onChange} value={value}>
                      <Radio value={1}>Asignar Superficie</Radio>
                      <Radio value={2}>Crear Plazos</Radio>
                  </Radio.Group>
                </Row>
                {value == 1 && <AsignarM2 terrenoId={terreno.id} />}
                {value == 2 && <PlazosCrear terrenoId={terreno.id}/>}
              </Collapse.Panel>
            </Collapse>
          ))}
        </Row>
      )}
    </div>
  );
}
