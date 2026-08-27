"use client";

import { Tabs } from "antd";

import DetalleEstadoCuenta from "./tabs/detalleEstadoCuenta/Info";
import ManejoEfectivo from "./tabs/manejoEfectivo/info";
import AgregarCargo from "./tabs/agregarCargo/info";
import Anticipos from "./tabs/anticipos/info";
import TarjetaDCAMR from "./tabs/tarjetaDCAMR/Info";
import Efectivo from "./tabs/efectivo/info";
import Banco from "./tabs/banco/info";


const { TabPane } = Tabs;

export default function Recursos() {
  return (
    <div className="resources-page">
      <header className="resources-page__header">
        <div>
          <span className="resources-page__eyebrow">
            RECURSOS
          </span>

          <h1 className="resources-page__title">
            Recursos financieros
          </h1>

          <p className="resources-page__description">
            Controla efectivo, bancos, anticipos, depósitos, cargos
            y movimientos financieros desde un solo lugar.
          </p>
        </div>
      </header>

      <section className="resources-tabs-card">
        <Tabs
          defaultActiveKey="1"
          className="resources-tabs"
          animated={false}
        >
          <TabPane tab="Efectivo" key="1">
            <div className="resources-tab-panel">
              <Efectivo />
            </div>
          </TabPane>

          <TabPane tab="Banco" key="2">
            <div className="resources-tab-panel">
              <Banco />
            </div>
          </TabPane>

          <TabPane tab="Anticipos" key="3">
            <div className="resources-tab-panel">
              <Anticipos />
            </div>
          </TabPane>

          <TabPane tab="Depósitos" key="4">
            <div className="resources-tab-panel">
              <DetalleEstadoCuenta />
            </div>
          </TabPane>

          <TabPane tab="Manejo de efectivo" key="5">
            <div className="resources-tab-panel">
              <ManejoEfectivo />
            </div>
          </TabPane>

          <TabPane tab="Agregar cargo" key="6">
            <div className="resources-tab-panel">
              <AgregarCargo />
            </div>
          </TabPane>

          <TabPane tab="Tarjeta de crédito AMR" key="7">
            <div className="resources-tab-panel">
              <TarjetaDCAMR />
            </div>
          </TabPane>
        </Tabs>
      </section>
    </div>
  );
}
