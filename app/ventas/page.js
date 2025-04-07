"use client";

import VentaForm from "@/components/VentaForm";
import { Col, Row } from "antd";

export default function VentasCrear() {
  return (
    <div className="p-8 grid gap-4">
      <Row justify={"center"}>
        <Col span={24}>
          <VentaForm />
        </Col>
      </Row>
    </div>
  );
}
