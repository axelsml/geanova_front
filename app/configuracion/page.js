"use client";

import { Col, Row, Typography, Tabs, Form, Input, Table, Button } from "antd";

import TablaUsuarios from "./tabs/Usuarios/TablaUsuarios";
import TablaRoles from "./tabs/Roles/TablaRoles";
import TablaPermisos from "./tabs/Permisos/TablaPermisos";
/**
 * Esta función representa la página de configuración principal de la aplicación.
 * Presenta un diseño con un título y tres pestañas: "Usuarios", "Roles" y "Permisos".
 *
 * @returns {JSX.Element}: un componente de React que representa la página de configuración.
 */
export default function Configuracion() {
  const items = [
    {
      key: "1",
      label: "Usuarios",
      children: <TablaUsuarios />,
    },
    {
      key: "2",
      label: "Roles",
      children: <TablaRoles />,
    },
    {
      key: "3",
      label: "Permisos",
      children: <TablaPermisos />,
    },
  ];
  return (
    <div>
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={18} xl={16} xxl={14}>
          <Row justify="center">
            <Typography.Title level={2}>Configuración</Typography.Title>
          </Row>
          <Tabs defaultActiveKey="1" items={items}></Tabs>
        </Col>
      </Row>
    </div>
  );
}
