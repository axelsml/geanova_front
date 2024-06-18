"use client";

import { Col, Row, Typography, Tabs, Form, Input, Table, Button } from "antd";

import TablaUsuarios from "./tabs/Usuarios/TablaUsuarios";
import TablaRoles from "./tabs/Roles/TablaRoles";
/**
 * Esta función representa la página de configuración principal de la aplicación.
 * Presenta un diseño con un título y tres pestañas: "Usuarios", "Roles" y "Permisos".
 *
 * @returns {JSX.Element}: un componente de React que representa la página de configuración.
 */
export default function Configuracion() {
  return (
    <div>
      <Row justify={"center"}>
        <Col xs={24} sm={20} md={16} lg={16} xl={18} xxl={18}>
          <Row justify={"center"}>
            <Typography.Title level={2}>Configuración</Typography.Title>
          </Row>
          <Tabs>
            <Tabs.TabPane tab="Usuarios" key="1">
              <TablaUsuarios />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Roles" key="2">
              <TablaRoles />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Permisos" key="3">
              <Row justify={"center"}>
                <Col xs={24} sm={20} md={16} lg={12} xl={8} xxl={4}>
                  <Typography.Title level={3}>
                    Registrar Permisos
                  </Typography.Title>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
