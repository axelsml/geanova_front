"use client";
import { Row, Col, Tabs } from "antd";

const { TabPane } = Tabs;
import DetalleEstadoCuenta from "./tabs/detalleEstadoCuenta/Info";
import ManejoEfectivo from "./tabs/manejoEfectivo/info";
import AgregarCargo from "./tabs/agregarCargo/info";
import Anticipos from "./tabs/anticipos/info";
import TarjetaDCAMR from "./tabs/tarjetaDCAMR/Info";
import Efectivo from "./tabs/efectivo/info";
import Banco from "./tabs/banco/info";

export default function Recursos() {
  return (
    <div>
      <Row justify={"center"}>
        <Col xs={24} sm={20} md={16} lg={12} xl={16} xxl={16}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Efectivo" key="1">
              <Efectivo />
            </TabPane>
            <TabPane tab="Banco" key="2">
              <Banco />
            </TabPane>
            <TabPane tab="Anticipos" key="3">
              <Anticipos />
            </TabPane>
            <TabPane tab="Dépositos" key="4">
              <DetalleEstadoCuenta />
            </TabPane>
            <TabPane tab="Manejo Efectivo" key="5">
              <ManejoEfectivo />
            </TabPane>
            <TabPane tab="Agregar Cargo" key="6">
              <AgregarCargo />
            </TabPane>
            <TabPane tab="Tarjeta de Crédito AMR" key="7">
              <TarjetaDCAMR />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
