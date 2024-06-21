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
      <Row justify={"center"}>
        <Col xs={24} sm={20} md={16} lg={12} xl={16} xxl={16}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Lotes" key={"1"}>
              <ReporteLotes />
            </TabPane>
            <TabPane tab="Cobranza" key={"2"}>
              <ReporteCobranza />
            </TabPane>
            <TabPane tab="Estatús Cobranza" key={"3"}>
              <ReporteEstatusCobranza />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
