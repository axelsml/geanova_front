"use client";

import { Col, Row, Typography, Tabs, Form, Input, Table, Button } from "antd";

import TablaUsuarios from "./tabs/Usuarios/TablaUsuarios";
import TablaRoles from "./tabs/Roles/TablaRoles";
import TablaMenus from "./tabs/Menus/TablaMenus";
/**
 * Esta función representa la página de configuración principal de la aplicación.
 * Presenta un diseño con un título y tres pestañas: "Usuarios", "Roles", "Menús" y "Permisos".
 *
 * @returns {JSX.Element}: un componente de React que representa la página de configuración.
 */
export default function Configuracion() {
  return (
    <div>
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={18} xl={16} xxl={14}>
          <Row justify="center">
            <Typography.Title level={2}>Configuración</Typography.Title>
          </Row>
          <Tabs>
            <Tabs.TabPane tab="Usuarios" key="1">
              <TablaUsuarios />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Roles" key="2">
              <TablaRoles />
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab="Menús" key="3">
            <TablaMenus />
          </Tabs.TabPane> */}
            <Tabs.TabPane tab="Permisos" key="4">
              <Row justify="center">
                <Col xs={24} sm={22} md={20} lg={18} xl={16} xxl={14}>
                  <Row justify="center">
                    <Typography.Title level={3}>
                      Registrar Permisos
                    </Typography.Title>
                  </Row>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
