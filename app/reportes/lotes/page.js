"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { Button, Form, Modal, Select, Table, Tooltip } from "antd";
import {
  BiArea,
  BiBuildingHouse,
  BiCheckCircle,
  BiErrorCircle,
  BiLockAlt,
  BiMoney,
  BiSearch,
  BiTrendingUp,
  BiWallet,
} from "react-icons/bi";
import { FaFilePdf } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import Swal from "sweetalert2";

import terrenosService from "@/services/terrenosService";
import lotesService from "@/services/lotesService";
import PagoForm from "@/components/PagoForm";
import { LoadingContext } from "@/contexts/loading";
import { formatPrecio } from "@/helpers/formatters";
import { getCookiePermisos } from "@/helpers/valorPermisos";


const { Option } = Select;

const PERIODOS = [
  { id: 0, label: "Todos", value: 0 },
  { id: 1, label: "Mensual", value: 1 },
  { id: 2, label: "Quincenal", value: 2 },
  { id: 3, label: "Semanal", value: 3 },
];

const ESTADOS = [
  { color: "#0000FF", nombre: "Liquidada" },
  { color: "#008000", nombre: "Al corriente" },
  { color: "#EAB308", nombre: "Adelantado" },
  { color: "#F39C12", nombre: "Atrasado" },
  { color: "#FF0000", nombre: "Vencido" },
];

export default function ReporteLotes() {
  const loadingContext = useContext(LoadingContext);

  if (!loadingContext) {
    throw new Error("ReporteLotes debe estar dentro de LoadingProvider");
  }

  const { setIsLoading } = loadingContext;
  const [form] = Form.useForm();

  const [terrenos, setTerrenos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [loteSelected, setLoteSelected] = useState(null);
  const [periodoPagoSelected, setPeriodoPagoSelected] = useState(0);

  const [infoActivos, setInfoActivos] = useState([]);
  const [infoCongelados, setInfoCongelados] = useState([]);
  const [resumenActivos, setResumenActivos] = useState(crearResumenVacio());
  const [resumenCongelados, setResumenCongelados] = useState(crearResumenVacio());
  const [dataCompleta, setDataCompleta] = useState({});
  const [terrenoConsultado, setTerrenoConsultado] = useState(null);
  const [consultado, setConsultado] = useState(false);

  const [cookiePermisos, setCookiePermisos] = useState(0);

  const [showPago, setShowPago] = useState(false);
  const [infoCliente, setInfoCliente] = useState(null);
  const [infoLote, setInfoLote] = useState(null);
  const [infoFecha, setInfoFecha] = useState(null);
  const [changeState, setChangeState] = useState(false);

  useEffect(() => {
    terrenosService.getTerrenos(
      (data) => setTerrenos(Array.isArray(data) ? data : []),
      onError
    );

    getCookiePermisos("lotes", setCookiePermisos);
  }, []);

  useEffect(() => {
    if (consultado) {
      BuscarInfoLote();
    }
  }, [changeState]);

  const terrenoIdSeleccionado = useMemo(() => {
    if (terrenoSelected === null || terrenoSelected === undefined) {
      return null;
    }

    if (typeof terrenoSelected === "object") {
      return Number(terrenoSelected.id || 0);
    }

    return Number(terrenoSelected || 0);
  }, [terrenoSelected]);

  const mostrarProyecto = Number(terrenoConsultado) === 0;

  const onBuscarLotes = (value) => {
    const terrenoId = Number(value);

    setLoteSelected(null);
    form.setFieldsValue({ lote_id: undefined });

    if (terrenoId === 0) {
      setTerrenoSelected(0);
      setLotes([]);
      return;
    }

    const terreno = terrenos.find(
      (item) => Number(item.id) === terrenoId
    );

    setTerrenoSelected(terreno || null);

    lotesService.getLotesAsignados(
      terrenoId,
      (data) => setLotes(Array.isArray(data) ? data : []),
      onError
    );
  };

  const BuscarInfoLote = () => {
    if (terrenoIdSeleccionado === null) {
      Swal.fire({
        title: "Proyecto requerido",
        icon: "warning",
        text: "Seleccione un proyecto antes de realizar la consulta.",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    limpiarResultados();
    setConsultado(true);
    setTerrenoConsultado(terrenoIdSeleccionado);
    setIsLoading(true);

    lotesService.reporteLotes(
      {
        lote_id: loteSelected && loteSelected.id ? loteSelected.id : 0,
        terreno_id: terrenoIdSeleccionado,
        periodoPago: periodoPagoSelected,
        bandera: 1,
      },
      onInfoClienteCargado,
      onError
    );
  };

  function onInfoClienteCargado(data) {
    if (data && data.encontrado) {
      setInfoActivos(Array.isArray(data.response) ? data.response : []);
      setResumenActivos(resumenDesdeRespuesta(data));
    } else {
      setInfoActivos([]);
      setResumenActivos(crearResumenVacio());
    }

    buscarCongelados();
  }

  function buscarCongelados() {
    lotesService.reporteLotes(
      {
        lote_id: loteSelected && loteSelected.id ? loteSelected.id : 0,
        terreno_id: terrenoIdSeleccionado,
        bandera: 2,
      },
      onInfoClienteCargado2,
      onError
    );
  }

  function onInfoClienteCargado2(data) {
    setIsLoading(false);

    if (data && data.encontrado) {
      setDataCompleta(data);
      setInfoCongelados(Array.isArray(data.response) ? data.response : []);
      setResumenCongelados(resumenDesdeRespuesta(data));
    } else {
      setDataCompleta({});
      setInfoCongelados([]);
      setResumenCongelados(crearResumenVacio());
    }
  }

  function onError(error) {
    setIsLoading(false);
    console.error("ReporteLotes:", error);

    Swal.fire({
      title: "Error",
      icon: "error",
      text:
        error && error.message
          ? error.message
          : "No fue posible consultar el reporte.",
      confirmButtonText: "Aceptar",
    });
  }

  function limpiarResultados() {
    setInfoActivos([]);
    setInfoCongelados([]);
    setResumenActivos(crearResumenVacio());
    setResumenCongelados(crearResumenVacio());
    setDataCompleta({});
  }

  const handleModalPago = (lote, cliente, fecha) => {
    setInfoLote(lote);
    setInfoCliente(cliente);
    setInfoFecha(fecha);
    setShowPago(true);
  };

  const handleCloseModal = () => {
    setShowPago(false);
    setInfoLote(null);
    setInfoCliente(null);
    setInfoFecha(null);
  };

  const columnasTabla = useMemo(() => {
    const columnas = [
      {
        title: "#",
        key: "numero",
        width: 52,
        render: (_, record, index) => index + 1,
      },
    ];

    if (mostrarProyecto) {
      columnas.push({
        title: "Proyecto",
        key: "terreno",
        width: 150,
        render: (_, item) => item.resumen_lote.terreno,
      });
    }

    columnas.push(
      {
        title: "Lote",
        key: "lote",
        width: 80,
        render: (_, item) => item.resumen_lote.lote,
      },
      {
        title: "Cliente",
        key: "cliente",
        width: 210,
        render: (_, item) => (
          <div className="report-lotes-client">
            <strong>{item.resumen_cliente.nombre_completo}</strong>
            <span>{item.resumen_cliente.telefono_celular || "Sin teléfono"}</span>
          </div>
        ),
      },
      {
        title: "Estado",
        key: "estado",
        width: 125,
        render: (_, item) => (
          <span className="report-lotes-status">
            <span
              className="report-lotes-status__dot"
              style={{
                backgroundColor: item.resumen_lote.situacion_solicitud_color,
              }}
            />
            {item.resumen_lote.situacion_solicitud || "Estado"}
          </span>
        ),
      },
      {
        title: "Pago requerido",
        key: "pago_requerido",
        align: "right",
        width: 125,
        render: (_, item) => moneda(item.resumen_lote.monto_pago_requerido),
      },
      {
        title: "Anticipo",
        key: "anticipo",
        align: "right",
        width: 115,
        render: (_, item) => moneda(item.resumen_lote.anticipo),
      },
      {
        title: "Contrato",
        key: "contrato",
        align: "right",
        width: 125,
        render: (_, item) => moneda(item.resumen_lote.monto_contrato),
      },
      {
        title: "Pagado",
        key: "pagado",
        align: "right",
        width: 120,
        render: (_, item) => moneda(item.resumen_lote.monto_pagado),
      },
      {
        title: "Saldo vencido",
        key: "vencido",
        align: "right",
        width: 125,
        render: (_, item) => (
          <span
            className={
              Number(item.resumen_lote.monto_vencido || 0) > 0
                ? "report-lotes-money report-lotes-money--danger"
                : "report-lotes-money"
            }
          >
            {moneda(item.resumen_lote.monto_vencido)}
          </span>
        ),
      },
      {
        title: "Documentos",
        key: "documentos",
        width: 115,
        align: "center",
        render: (_, item) => {
          const solicitudId = obtenerSolicitudId(item);
          const terrenoPdf =
            item.resumen_lote.terreno_id || terrenoIdSeleccionado;

          return (
            <div className="report-lotes-actions">
              <Tooltip title="Estado de cuenta">
                <Button
                  className="report-lotes-icon-button"
                  disabled={Number(cookiePermisos || 0) < 1}
                  onClick={() =>
                    window.open(
                      `https://api.santamariadelaluz.com/getClienteByLote/${terrenoPdf}/${item.resumen_lote.lote_id}.pdf`
                    )
                  }
                >
                  <FaFilePdf />
                </Button>
              </Tooltip>

              <Tooltip title="Amortización">
                <Button
                  className="report-lotes-icon-button"
                  disabled={Number(cookiePermisos || 0) < 1 || !solicitudId}
                  onClick={() => {
                    if (solicitudId) {
                      window.open(
                        `https://api.santamariadelaluz.com/iUsuarios/${solicitudId}.pdf`
                      );
                    }
                  }}
                >
                  <FaFilePdf />
                </Button>
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: "Pago",
        key: "pago",
        width: 72,
        align: "center",
        render: (_, item) => {
          const resumen = item.resumen_lote;
          const liquidada =
            String(resumen.situacion_solicitud_color || "").toLowerCase() ===
            "blue";

          if (liquidada) {
            return (
              <BiCheckCircle
                className="report-lotes-liquidado-icon"
                title="Liquidado"
              />
            );
          }

          return (
            <Tooltip title="Registrar pago">
              <Button
                className="report-lotes-pay-button"
                disabled={Number(cookiePermisos || 0) < 2}
                onClick={() =>
                  handleModalPago(
                    resumen,
                    item.resumen_cliente,
                    item.fecha_proximo_pago
                  )
                }
              >
                <FaMoneyCheckDollar />
              </Button>
            </Tooltip>
          );
        },
      }
    );

    return columnas;
  }, [mostrarProyecto, cookiePermisos, terrenoIdSeleccionado]);

  const kpisActivos = [
    {
      label: "Lotes",
      value: entero(resumenActivos.lotes),
      icon: BiBuildingHouse,
    },
    {
      label: "Lotes cobrados",
      value: entero(resumenActivos.cobranza),
      icon: BiCheckCircle,
    },
    {
      label: "Liquidados",
      value: entero(resumenActivos.liquidados),
      icon: BiCheckCircle,
    },
    {
      label: "Cobro mensual",
      value: moneda(resumenActivos.cobro_total_mensual),
      icon: BiMoney,
      featured: true,
    },
    {
      label: "Monto contratado",
      value: moneda(resumenActivos.monto_contrato),
      icon: BiWallet,
    },
    {
      label: "Monto cobrado",
      value: moneda(resumenActivos.pagados),
      icon: BiTrendingUp,
    },
    {
      label: "Pendiente por cobrar",
      value: moneda(resumenActivos.pendiente),
      icon: BiErrorCircle,
      danger: Number(resumenActivos.pendiente || 0) > 0,
    },
    {
      label: "Lotes disponibles",
      value: entero(resumenActivos.lotes_disponibles),
      icon: BiBuildingHouse,
    },
    {
      label: "Pendiente por contratar",
      value: moneda(resumenActivos.pendiente_por_contratar),
      icon: BiWallet,
    },
    {
      label: "Intereses",
      value: moneda(resumenActivos.monto_interes),
      icon: BiMoney,
    },
  ];

  const kpisInventario = [
    {
      label: "M² vendidos",
      value: numero(dataCompleta.total_metros_vendidos),
      icon: BiArea,
    },
    {
      label: "Costo por M²",
      value: moneda(dataCompleta.costo_m2),
      icon: BiMoney,
    },
    {
      label: "M² pendientes",
      value: numero(dataCompleta.pendientes_vender),
      icon: BiArea,
    },
    {
      label: "Posible venta simulada",
      subtitle: "4 meses",
      value: moneda(dataCompleta.posible_ganancia),
      icon: BiTrendingUp,
      featured: true,
    },
    {
      label: "Ventas de contado",
      value: entero(dataCompleta.lotes_contado),
      icon: BiCheckCircle,
    },
    {
      label: "Contado vendido",
      value: moneda(dataCompleta.lotes_contado_venta),
      icon: BiMoney,
    },
    {
      label: "Ventas a crédito",
      value: entero(dataCompleta.lotes_credito),
      icon: BiWallet,
      tooltip: crearResumenCredito(dataCompleta.resumen_credito),
    },
    {
      label: "Crédito vendido",
      value: moneda(dataCompleta.lotes_credito_venta),
      icon: BiMoney,
    },
  ];

  const kpisCongelados = [
    {
      label: "Lotes congelados",
      value: entero(resumenCongelados.lotes),
      icon: BiLockAlt,
    },
    {
      label: "Lotes cobrados",
      value: entero(resumenCongelados.cobranza),
      icon: BiCheckCircle,
    },
    {
      label: "Liquidados",
      value: entero(resumenCongelados.liquidados),
      icon: BiCheckCircle,
    },
    {
      label: "Cobro mensual",
      value: moneda(resumenCongelados.cobro_total_mensual),
      icon: BiMoney,
    },
    {
      label: "Monto contratado",
      value: moneda(resumenCongelados.monto_contrato),
      icon: BiWallet,
    },
    {
      label: "Monto cobrado",
      value: moneda(resumenCongelados.pagados),
      icon: BiTrendingUp,
    },
    {
      label: "Pendiente por cobrar",
      value: moneda(resumenCongelados.pendiente),
      icon: BiErrorCircle,
    },
    {
      label: "Intereses",
      value: moneda(resumenCongelados.monto_interes),
      icon: BiMoney,
    },
  ];

  return (
    <div className="report-lotes-page">
      <div className="report-lotes-header">
        <div>
          <span className="report-lotes-header__eyebrow">
            CARTERA E INVENTARIO
          </span>
          <h2 className="report-lotes-header__title">Reporte de lotes</h2>
          <p className="report-lotes-header__description">
            Consulta cartera, cobranza, inventario, ventas y situación de los
            lotes por proyecto.
          </p>
        </div>

        <Tooltip
          placement="bottomRight"
          title={
            <div className="report-lotes-legend">
              {ESTADOS.map((estado) => (
                <div key={estado.nombre} className="report-lotes-legend__item">
                  <span
                    className="report-lotes-status__dot"
                    style={{ backgroundColor: estado.color }}
                  />
                  <span>{estado.nombre}</span>
                </div>
              ))}
            </div>
          }
        >
          <button type="button" className="report-lotes-legend-button">
            <span className="report-lotes-legend-button__dots">
              {ESTADOS.slice(0, 4).map((estado) => (
                <span
                  key={estado.nombre}
                  style={{ backgroundColor: estado.color }}
                />
              ))}
            </span>
            Ver estados
          </button>
        </Tooltip>
      </div>

      <section className="report-lotes-filter-card">
        <div className="report-lotes-card-heading">
          <div>
            <span className="report-lotes-card-heading__eyebrow">FILTROS</span>
            <h3>Selecciona la información a consultar</h3>
          </div>
        </div>

        <Form form={form} layout="vertical" className="report-lotes-filter-form">
          <div className="report-lotes-filter-grid">
            <Form.Item
              label="Proyecto"
              name="terreno"
              rules={[{ required: true, message: "Seleccione un proyecto" }]}
            >
              <Select
                showSearch
                size="large"
                placeholder="Seleccione un proyecto"
                optionFilterProp="label"
                onChange={onBuscarLotes}
              >
                <Option value={0} label="Todos">
                  Todos los proyectos
                </Option>

                {terrenos.map((item) => (
                  <Option key={item.id} value={item.id} label={item.nombre}>
                    {item.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Lote" name="lote_id">
              <Select
                showSearch
                allowClear
                size="large"
                placeholder={
                  terrenoIdSeleccionado === 0
                    ? "Todos los lotes"
                    : "Seleccione un lote"
                }
                optionFilterProp="label"
                disabled={
                  terrenoIdSeleccionado === null || terrenoIdSeleccionado === 0
                }
                onChange={(value) => {
                  if (!value || Number(value) === 0) {
                    setLoteSelected(null);
                    return;
                  }

                  const lote = lotes.find(
                    (item) => Number(item.id) === Number(value)
                  );

                  setLoteSelected(lote || null);
                }}
              >
                <Option value={0} label="Todos">
                  Todos
                </Option>

                {lotes.map((item) => (
                  <Option
                    key={item.id}
                    value={item.id}
                    label={String(item.numero)}
                  >
                    {item.numero}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Periodicidad" name="periodoPago" initialValue={0}>
              <Select
                size="large"
                onChange={(value) => setPeriodoPagoSelected(Number(value))}
              >
                {PERIODOS.map((periodo) => (
                  <Option key={periodo.id} value={periodo.value}>
                    {periodo.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div className="report-lotes-filter-action">
              <Button
                type="primary"
                size="large"
                className="report-lotes-search-button"
                disabled={terrenoIdSeleccionado === null}
                onClick={BuscarInfoLote}
                icon={<BiSearch />}
              >
                Buscar reporte
              </Button>
            </div>
          </div>
        </Form>
      </section>

      {consultado && (
        <>
          <ReportSection
            eyebrow="CARTERA ACTIVA"
            title="Clientes no congelados"
            description="Resumen de la cartera activa y sus principales indicadores."
            badge={`${entero(resumenActivos.lotes)} lotes`}
          >
            <KpiGrid items={kpisActivos} />

            <div className="report-lotes-subsection">
              <div className="report-lotes-subsection__header">
                <span>INVENTARIO Y VENTAS</span>
                <h4>Indicadores comerciales</h4>
              </div>

              <KpiGrid items={kpisInventario} compact />
            </div>

            <ReportTable
              data={infoActivos}
              columns={columnasTabla}
              emptyText="No hay clientes no congelados para los filtros seleccionados."
            />
          </ReportSection>

          <ReportSection
            eyebrow="CARTERA CONGELADA"
            title="Clientes congelados"
            description="Solicitudes congeladas que permanecen dentro de la cartera."
            badge={`${entero(resumenCongelados.lotes)} lotes`}
            muted
          >
            <KpiGrid items={kpisCongelados} />

            <ReportTable
              data={infoCongelados}
              columns={columnasTabla}
              emptyText="No hay clientes congelados para los filtros seleccionados."
            />
          </ReportSection>
        </>
      )}

      <Modal
        open={showPago}
        footer={null}
        width={760}
        onCancel={handleCloseModal}
        destroyOnClose
        title="Registrar pago"
      >
        {showPago && infoLote && infoCliente && (
          <PagoForm
            setNuevoPago={setShowPago}
            cliente={infoCliente}
            lote={infoLote}
            proximoPago={infoFecha}
            setWatch={setChangeState}
            watch={changeState}
            tipo_pago_id_opcion={1}
            monto_requerido={Number(infoLote.monto_pago_requerido || 0)}
          />
        )}
      </Modal>
    </div>
  );
}

function ReportSection({
  eyebrow,
  title,
  description,
  badge,
  muted,
  children,
}) {
  return (
    <section
      className={
        muted
          ? "report-lotes-section report-lotes-section--muted"
          : "report-lotes-section"
      }
    >
      <div className="report-lotes-section__header">
        <div>
          <span className="report-lotes-section__eyebrow">{eyebrow}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <span className="report-lotes-section__badge">{badge}</span>
      </div>

      {children}
    </section>
  );
}

function KpiGrid({ items, compact }) {
  return (
    <div
      className={
        compact
          ? "report-lotes-kpis report-lotes-kpis--compact"
          : "report-lotes-kpis"
      }
    >
      {items.map((item, index) => {
        const Icon = item.icon;

        const card = (
          <div
            key={`${item.label}-${index}`}
            className={[
              "report-lotes-kpi",
              item.featured ? "report-lotes-kpi--featured" : "",
              item.danger ? "report-lotes-kpi--danger" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="report-lotes-kpi__top">
              <span className="report-lotes-kpi__icon">
                <Icon />
              </span>
              <span className="report-lotes-kpi__label">{item.label}</span>
            </div>

            <strong className="report-lotes-kpi__value">{item.value}</strong>

            {item.subtitle && (
              <span className="report-lotes-kpi__subtitle">
                {item.subtitle}
              </span>
            )}
          </div>
        );

        if (item.tooltip) {
          return (
            <Tooltip
              key={item.label}
              title={item.tooltip}
              placement="bottom"
              overlayStyle={{ maxWidth: 430 }}
            >
              {card}
            </Tooltip>
          );
        }

        return card;
      })}
    </div>
  );
}

function ReportTable({ data, columns, emptyText }) {
  return (
    <div className="report-lotes-table-card">
      <div className="report-lotes-table-card__header">
        <div>
          <span>DETALLE</span>
          <h4>Solicitudes</h4>
        </div>

        <strong>{Array.isArray(data) ? data.length : 0} registros</strong>
      </div>

      <Table
        rowKey={(item, index) =>
          item && item.resumen_lote && item.resumen_lote.solicitud_id
            ? item.resumen_lote.solicitud_id
            : index
        }
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        size="small"
        scroll={{ x: 1450 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "25"],
          showTotal: (total) => `${total} registros`,
        }}
        locale={{ emptyText }}
        className="report-lotes-table"
      />
    </div>
  );
}

function crearResumenVacio() {
  return {
    lotes: 0,
    pagados: 0,
    vencidos: 0,
    pendiente: 0,
    semanal: 0,
    mensual: 0,
    liquidados: 0,
    cobranza: 0,
    monto_contrato: 0,
    monto_interes: 0,
    cobro_total_mensual: 0,
    pendiente_por_contratar: 0,
    lotes_disponibles: 0,
  };
}

function resumenDesdeRespuesta(data) {
  return {
    lotes: numeroSeguro(data.lotes),
    pagados: numeroSeguro(data.pagados),
    vencidos: numeroSeguro(data.vencidos),
    pendiente: numeroSeguro(data.pendiente),
    semanal: numeroSeguro(data.semanal),
    mensual: numeroSeguro(data.mensual),
    liquidados: numeroSeguro(data.liquidados),
    cobranza: numeroSeguro(data.cobranza),
    monto_contrato: numeroSeguro(data.monto_contrato),
    monto_interes: numeroSeguro(data.monto_interes),
    cobro_total_mensual: numeroSeguro(data.cobro_total_mensual),
    pendiente_por_contratar: numeroSeguro(data.pendiente_por_contratar),
    lotes_disponibles: numeroSeguro(data.lotes_disponibles),
  };
}

function numeroSeguro(value) {
  const numero = Number(value || 0);
  return isNaN(numero) ? 0 : numero;
}

function moneda(value) {
  return `$ ${formatPrecio(numeroSeguro(value))}`;
}

function entero(value) {
  return numeroSeguro(value).toLocaleString("es-MX", {
    maximumFractionDigits: 0,
  });
}

function numero(value) {
  return numeroSeguro(value).toLocaleString("es-MX", {
    maximumFractionDigits: 2,
  });
}

function obtenerSolicitudId(item) {
  if (!item || !item.resumen_lote) {
    return null;
  }

  if (item.resumen_lote.solicitud_id) {
    return item.resumen_lote.solicitud_id;
  }

  const amortizaciones = item.resumen_lote.amortizaciones;

  if (Array.isArray(amortizaciones) && amortizaciones.length > 0) {
    return amortizaciones[0].solicitud_id;
  }

  return null;
}

function crearResumenCredito(resumen) {
  if (!Array.isArray(resumen) || resumen.length === 0) {
    return "No hay detalle de ventas a crédito.";
  }

  return (
    <div className="report-lotes-credit-tooltip">
      <strong>Ventas a crédito</strong>

      {resumen.map((item, index) => (
        <div key={index} className="report-lotes-credit-tooltip__row">
          <span>{item.tipo}</span>
          <span>{item.cantidad}</span>
          <strong>{moneda(item.dinero)}</strong>
        </div>
      ))}
    </div>
  );
}
