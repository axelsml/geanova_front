"use client";

// import TerrenoEditForm from "@/components/TerrenoEditForm";
import { Col, Row } from "antd";
import { useState } from "react";

export default function TerrenoEdit({ terrenoId, terreno }) {
  const [terrenoEditado, setTerrenoEditado] = useState(false);
  const [changeState, setChangeState] = useState(false);

  return (
    <div className="p-8 grid gap-4">
      {terreno && (
        <Row justify={"center"}>
          <Col span={24}>
            {/* <TerrenoEditForm
              setTerrenoEditado={setTerrenoEditado}
              setWatch={setChangeState}
              watch={changeState}
              terrenoId={terrenoId}
              terreno={terreno}
            /> */}
          </Col>
        </Row>
      )}
    </div>
  );
}
