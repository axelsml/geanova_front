"use client";

import { Col, Row, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";

import ReporteLotes from "./lotes/page";
import ReporteCobranza from "./cobranza/page";
import ReporteEstatusCobranza from "./cobranza_estatus/page";
import EfectividadCobranza from "./cobranza_efectividad/page";
import ReporteIngresos from "./ingresos/page";
import ReporteProyeccion from "./proyeccion/page";
import InformeCortes from "./cortes/page";
import SolicitudesCanceladas from "./solicitudes_canceladas/page";

export default function Reportes() {
  return (
    <div>
      <Row justify={"center"} style={{ marginTop: "1%" }}>
        <Col xs={20} sm={22} md={22} lg={22} xl={22} xxl={22}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Lotes" key={"1"}>
              <Row justify={"center"} className="mb-5">
                <Col xs={24} sm={18} md={24} lg={24} xl={22} xxl={20}>
                  <ReporteLotes />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Cobranza" key={"2"}>
              <Row justify={"center"}>
                <Col xs={24} sm={18} md={24} lg={24} xl={22} xxl={20}>
                  <ReporteCobranza />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Estatús Cobranza" key={"3"}>
              <Row justify={"center"} className="mb-5">
                <Col xs={24} sm={18} md={24} lg={24} xl={22} xxl={20}>
                  <ReporteEstatusCobranza />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Efectividad Cobranza" key={"4"}>
              <Row justify={"center"} className="mb-5">
                <Col xs={24} sm={18} md={24} lg={24} xl={22} xxl={20}>
                  <EfectividadCobranza />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Ingresos" key={"5"}>
              <Row justify={"center"} className="mb-5">
                <Col xs={24} sm={18} md={24} lg={24} xl={22} xxl={20}>
                  <ReporteIngresos />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Proyección" key={"6"}>
              <Row justify={"center"} className="mb-5">
                <Col>
                  <ReporteProyeccion />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Informe Histórico" key={"7"}>
              <Row justify={"center"} className="mb-5">
                <Col>
                  <InformeCortes />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Solicitudes Canceladas" key={"8"}>
              <Row justify={"center"} className="mb-5">
                <Col>
                  <SolicitudesCanceladas />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
