"use client";
import { useContext, useEffect, useState } from "react";

import { Col, Row, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";

import ReporteLotes from "@/components/ReporteLotesForm";
import ReporteCobranza from "@/components/ReporteCobranzaForm";
import ReporteEstatusCobranza from "@/components/ReporteEstatusCobranza";

export default function Reportes() {
  const [showReporteLote, setShowReporteLote] = useState(false);

  // const handleTabChange = (key) => {
  //   if (key === "2") {
  //   }
  // };
  // en <Tabs /> onChange={handleTabChange} como prop

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
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
