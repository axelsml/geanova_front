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
        <Col xs={24} sm={20} md={16} lg={18} xl={20} xxl={20}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Lotes" key={"1"}>
              <Row justify={"center"} className="mb-5">
                <Col xs={24} sm={20} md={16} lg={16} xl={24} xxl={12}>
                  <ReporteLotes />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Cobranza" key={"2"}>
              <Row justify={"center"}>
                <Col xs={24} sm={20} md={16} lg={16} xl={24} xxl={12}>
                  <ReporteCobranza />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Estatús Cobranza" key={"3"}>
              <Row justify={"center"} className="mb-5">
                <Col xs={24} sm={20} md={16} lg={16} xl={24} xxl={12}>
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
