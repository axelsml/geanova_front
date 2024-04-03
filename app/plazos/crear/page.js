"use client";

import { formatPrecio } from "@/helpers/formatters";
import PlazoForm from "@/components/PlazoForm";
import plazosService from "@/services/plazosService";
import { Button, Col, Collapse, Row, Typography } from "antd";
import { useState, useEffect } from "react";

export default function PlazosCrear() {
  const [nuevoPlazo, setNuevoPlazo] = useState(false);
  const [plazos, setPlazos] = useState(null);
  const [changeState, setChangeState] = useState(false);

  useEffect(() => {
    plazosService.getPlazos(setPlazos, Error);
  }, [changeState]);

  const CreateNuevoPlazo = () => {
    setNuevoPlazo(!nuevoPlazo);
  };

  return (
    <div className="p-8 grid gap-4">
      {!nuevoPlazo && (
        <Row justify={"center"}>
          <Col>
            <Button size={"large"} onClick={CreateNuevoPlazo}>
              Crear Nuevo Plazo
            </Button>
          </Col>
        </Row>
      )}
      <Row justify={"center"}>
        <Col span={24}>
          {nuevoPlazo && (
            <PlazoForm
              setNuevoPlazo={setNuevoPlazo}
              setWatch={setChangeState}
              watch={changeState}
            />
          )}
        </Col>
      </Row>

      {(!nuevoPlazo && plazos?.length > 0) && (
        <Row justify={"center"}>
          <Collapse className="w-3/4">
            <Collapse.Panel header="Lista de Plazos" >
              {plazos?.map((plazo, index) => (
                <span className="flex justify-around py-2" key={index}>
                  <Typography>{plazo.descripcion}</Typography>
                  <Typography>${formatPrecio(plazo.precio)}</Typography>
                </span>
                ))}
            </Collapse.Panel>
          </Collapse>
        </Row>
      )}
    </div>
  );
}
