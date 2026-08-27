"use client";

import { Tabs } from "antd";

import ReporteLotes from "./lotes/page";
import ReporteCobranza from "./cobranza/page";
import ReporteEstatusCobranza from "./cobranza_estatus/page";
import EfectividadCobranza from "./cobranza_efectividad/page";
import ReporteIngresos from "./ingresos/page";
import ReporteProyeccion from "./proyeccion/page";
import InformeCortes from "./cortes/page";
import SolicitudesCanceladas from "./solicitudes_canceladas/page";


const { TabPane } = Tabs;


export default function Reportes() {

  return (

    <div className="reports-page">


      {/* =====================================================
          ENCABEZADO
          ===================================================== */}

      <header className="reports-page__header">

        <div>

          <span className="reports-page__eyebrow">

            REPORTES

          </span>


          <h1 className="reports-page__title">

            Reportes y análisis

          </h1>


          <p className="reports-page__description">

            Consulta información de lotes, cobranza,
            ingresos, proyecciones e históricos para
            dar seguimiento a la operación comercial.

          </p>

        </div>


        <div className="reports-page__badge">

          <span>
            8
          </span>

          <small>
            reportes disponibles
          </small>

        </div>

      </header>


      {/* =====================================================
          CONTENEDOR TABS
          ===================================================== */}

      <section className="reports-tabs-card">

        <Tabs

          defaultActiveKey="1"

          className="reports-tabs"

          animated={false}

          tabBarGutter={26}

          destroyInactiveTabPane={false}

        >


          {/* =================================================
              LOTES
              ================================================= */}

          <TabPane
            tab="Lotes"
            key="1"
          >

            <ReportPanel>

              <ReporteLotes />

            </ReportPanel>

          </TabPane>


          {/* =================================================
              COBRANZA
              ================================================= */}

          <TabPane
            tab="Cobranza"
            key="2"
          >

            <ReportPanel>

              <ReporteCobranza />

            </ReportPanel>

          </TabPane>


          {/* =================================================
              ESTATUS COBRANZA
              ================================================= */}

          <TabPane
            tab="Estatus de cobranza"
            key="3"
          >

            <ReportPanel>

              <ReporteEstatusCobranza />

            </ReportPanel>

          </TabPane>


          {/* =================================================
              EFECTIVIDAD
              ================================================= */}

          <TabPane
            tab="Efectividad"
            key="4"
          >

            <ReportPanel>

              <EfectividadCobranza />

            </ReportPanel>

          </TabPane>


          {/* =================================================
              INGRESOS
              ================================================= */}

          <TabPane
            tab="Ingresos"
            key="5"
          >

            <ReportPanel>

              <ReporteIngresos />

            </ReportPanel>

          </TabPane>


          {/* =================================================
              PROYECCION
              ================================================= */}

          <TabPane
            tab="Proyección"
            key="6"
          >

            <ReportPanel>

              <ReporteProyeccion />

            </ReportPanel>

          </TabPane>


          {/* =================================================
              INFORME HISTORICO
              ================================================= */}

          <TabPane
            tab="Informe histórico"
            key="7"
          >

            <ReportPanel>

              <InformeCortes />

            </ReportPanel>

          </TabPane>


          {/* =================================================
              CANCELADAS
              ================================================= */}

          <TabPane
            tab="Solicitudes canceladas"
            key="8"
          >

            <ReportPanel>

              <SolicitudesCanceladas />

            </ReportPanel>

          </TabPane>


        </Tabs>

      </section>

    </div>

  );

}


/* ===========================================================
   CONTENEDOR REUTILIZABLE PARA CADA REPORTE

   Evita repetir Row / Col en cada TabPane.
   =========================================================== */

function ReportPanel({
  children,
}) {

  return (

    <div className="report-panel">

      {children}

    </div>

  );

}