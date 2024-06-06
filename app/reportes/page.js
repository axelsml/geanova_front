"use client";
import { useContext, useEffect, useState } from "react";

import { Col, Row, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";

import ReporteLotes from "@/components/ReporteLotesForm";

export default function Reportes() {
  const [showReporteLote, setShowReporteLote] = useState(false);

  const handleTabChange = (key) => {
    if (key === "2") {
    }
  };

  return (
    <div>
      <Row justify={"center"}>
        <Col xs={24} sm={20} md={16} lg={12} xl={16} xxl={16}>
          <Tabs defaultActiveKey="1" onChange={handleTabChange}>
            <TabPane tab="Reporte Lotes" key={"1"}>
              <ReporteLotes />
            </TabPane>
            <TabPane tab="Reporte Terreno" key={"2"}></TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
