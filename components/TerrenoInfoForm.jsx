"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";

import {
  BiBuildings,
  BiUser,
  BiMap,
  BiMoney,
  BiEdit,
} from "react-icons/bi";

import {
  TbRulerMeasure,
  TbCalendarDollar,
} from "react-icons/tb";

import AsignarM2 from "@/components/AsignarM2";
import CrearPlazo from "@/components/CrearPlazo";
import EditarTerreno from "@/components/EditarTerreno";

import { getCookiePermisos } from "@/helpers/valorPermisos";

export default function TerrenoInfoForm({
  setTerrenoNuevo,
  terrenoSeleccionado,
  setWatch,
  watch,
}) {
  const [modalActivo, setModalActivo] = useState(null);
  const [cookiePermisos, setCookiePermisos] = useState(0);

  useEffect(() => {
    getCookiePermisos(
      "lista de terrenos",
      setCookiePermisos
    );
  }, []);

  const puedeEditar = Number(cookiePermisos) >= 2;

  const superficieUtilizada = useMemo(() => {
    const vendible = toNumber(
      terrenoSeleccionado?.area_vendible
    );

    const reserva = toNumber(
      terrenoSeleccionado?.area_reserva
    );

    const vialidad = toNumber(
      terrenoSeleccionado?.area_vialidad
    );

    return vendible + reserva + vialidad;
  }, [terrenoSeleccionado]);

  const cerrarModal = () => {
    setModalActivo(null);
  };

  const regresar = () => {
    if (typeof setTerrenoNuevo === "function") {
      setTerrenoNuevo(false);
    }
  };

  if (!terrenoSeleccionado) {
    return (
      <div className="terrain-detail-empty">
        No se encontró información del terreno seleccionado.
      </div>
    );
  }

  return (
    <>
      <div className="terrain-detail">

        {/* =====================================================
            ENCABEZADO
        ====================================================== */}

        <header className="terrain-detail__header">

          <div className="terrain-detail__header-main">

            <div className="terrain-detail__icon">
              <BiBuildings />
            </div>

            <div>

              <span className="terrain-detail__eyebrow">
                PROYECTO INMOBILIARIO
              </span>

              <h1 className="terrain-detail__title">
                {terrenoSeleccionado.nombre || "Terreno"}
              </h1>

              <div className="terrain-detail__location">
                <BiMap />

                <span>
                  {crearUbicacion(
                    terrenoSeleccionado
                  )}
                </span>
              </div>

            </div>

          </div>



        </header>


        {/* =====================================================
            INDICADORES PRINCIPALES
        ====================================================== */}

        <section className="terrain-stats">

          <div className="terrain-stat-card">

            <div className="terrain-stat-card__icon">
              <BiBuildings />
            </div>

            <div>

              <span className="terrain-stat-card__label">
                Lotes
              </span>

              <strong className="terrain-stat-card__value">
                {formatNumero(
                  terrenoSeleccionado.cantidad_lotes,
                  0
                )}
              </strong>

            </div>

          </div>


          <div className="terrain-stat-card">

            <div className="terrain-stat-card__icon">
              <TbRulerMeasure />
            </div>

            <div>

              <span className="terrain-stat-card__label">
                Superficie total
              </span>

              <strong className="terrain-stat-card__value">
                {formatNumero(
                  terrenoSeleccionado.superficie_total
                )}

                <small> m²</small>
              </strong>

            </div>

          </div>


          <div className="terrain-stat-card">

            <div className="terrain-stat-card__icon">
              <BiMoney />
            </div>

            <div>

              <span className="terrain-stat-card__label">
                Precio de compra
              </span>

              <strong className="terrain-stat-card__value">
                {formatMoneda(
                  terrenoSeleccionado.precio_compra
                )}
              </strong>

            </div>

          </div>


          <div className="terrain-stat-card">

            <div className="terrain-stat-card__icon">
              <BiMoney />
            </div>

            <div>

              <span className="terrain-stat-card__label">
                Precio por m²
              </span>

              <strong className="terrain-stat-card__value">
                {formatMoneda(
                  terrenoSeleccionado.precio_m2
                )}
              </strong>

            </div>

          </div>

        </section>


        {/* =====================================================
            GRID PRINCIPAL
        ====================================================== */}

        <div className="terrain-detail__grid">

          {/* INFORMACIÓN GENERAL */}

          <section className="card terrain-info-card">

            <div className="card__header">

              <div>

                <h2 className="card__title">
                  Información general
                </h2>

                <p className="terrain-card-description">
                  Datos principales del proyecto.
                </p>

              </div>

              <BiUser className="terrain-card-header-icon" />

            </div>


            <div className="terrain-info-grid">

              <InfoItem
                label="Propietario"
                value={
                  terrenoSeleccionado.propietario
                }
              />

              <InfoItem
                label="Ciudad"
                value={
                  terrenoSeleccionado.ciudad
                }
              />

              <InfoItem
                label="Colonia / Localidad"
                value={
                  terrenoSeleccionado.colonia
                }
              />

              <InfoItem
                label="Domicilio"
                value={
                  terrenoSeleccionado.domicilio
                }
                full
              />

            </div>

          </section>


          {/* INFORMACIÓN COMERCIAL */}

          <section className="card terrain-info-card">

            <div className="card__header">

              <div>

                <h2 className="card__title">
                  Información comercial
                </h2>

                <p className="terrain-card-description">
                  Valores económicos del proyecto.
                </p>

              </div>

              <BiMoney className="terrain-card-header-icon" />

            </div>


            <div className="terrain-commercial-list">

              <CommercialItem
                label="Precio de compra"
                value={formatMoneda(
                  terrenoSeleccionado.precio_compra
                )}
              />

              <CommercialItem
                label="Precio por m²"
                value={formatMoneda(
                  terrenoSeleccionado.precio_m2
                )}
              />

              <CommercialItem
                label="Venta proyectada de contado"
                value={formatMoneda(
                  terrenoSeleccionado
                    .precio_proyectado_contado
                )}
                highlighted
              />
              <CommercialItem
                label="Escrituras por m²"
                value={formatMoneda(
                  terrenoSeleccionado
                    .escrituracion_m2
                )}
              />
              <CommercialItem
                label="Escrituras Costo Fijo"
                value={formatMoneda(
                  terrenoSeleccionado
                    .escrituracion_fija
                )}
              />

            </div>

          </section>

        </div>


        {/* =====================================================
            SUPERFICIES
        ====================================================== */}

        <section className="card terrain-surfaces-card">

          <div className="card__header">

            <div>

              <h2 className="card__title">
                Distribución de superficies
              </h2>

              <p className="terrain-card-description">
                Composición territorial del proyecto.
              </p>

            </div>

            <TbRulerMeasure className="terrain-card-header-icon" />

          </div>


          <div className="terrain-surfaces">

            <SurfaceItem
              label="Superficie total"
              value={
                terrenoSeleccionado.superficie_total
              }
            />

            <SurfaceItem
              label="Área vendible"
              value={
                terrenoSeleccionado.area_vendible
              }
            />

            <SurfaceItem
              label="Área de reserva"
              value={
                terrenoSeleccionado.area_reserva
              }
            />

            <SurfaceItem
              label="Área de vialidad"
              value={
                terrenoSeleccionado.area_vialidad
              }
            />

          </div>


          <div className="terrain-surface-footer">

            <span>
              Superficie clasificada
            </span>

            <strong>
              {formatNumero(superficieUtilizada)} m²
            </strong>

          </div>

        </section>


        {/* =====================================================
            ACCIONES
        ====================================================== */}

        <section className="terrain-management">

          <div>

            <h2 className="terrain-management__title">
              Administración del proyecto
            </h2>

            <p className="terrain-management__description">
              Configura superficies, plazos y datos
              generales del terreno.
            </p>

          </div>


          <div className="terrain-management__actions">

            <button
              type="button"
              className="btn btn-secondary"
              disabled={!puedeEditar}
              onClick={() =>
                setModalActivo("superficie")
              }
            >
              <TbRulerMeasure />

              Superficies
            </button>


            <button
              type="button"
              className="btn btn-secondary"
              disabled={!puedeEditar}
              onClick={() =>
                setModalActivo("plazos")
              }
            >
              <TbCalendarDollar />

              Plazos
            </button>


            <button
              type="button"
              className="btn btn-primary"
              disabled={!puedeEditar}
              onClick={() =>
                setModalActivo("editar")
              }
            >
              <BiEdit />

              Editar terreno
            </button>

          </div>

        </section>

      </div>


      {/* =====================================================
          MODAL SUPERFICIES
      ====================================================== */}

      <Modal
        open={modalActivo === "superficie"}
        onCancel={cerrarModal}
        footer={null}
        width={950}
        destroyOnClose
        centered
        className="geanova-modal"
        title="Administrar superficies"
      >
        <AsignarM2
          terrenoId={terrenoSeleccionado.id}
        />
      </Modal>


      {/* =====================================================
          MODAL PLAZOS
      ====================================================== */}

      <Modal
        open={modalActivo === "plazos"}
        onCancel={cerrarModal}
        footer={null}
        width={950}
        destroyOnClose
        centered
        className="geanova-modal"
        title="Plazos del proyecto"
      >
        <CrearPlazo
          terrenoId={terrenoSeleccionado.id}
        />
      </Modal>


      {/* =====================================================
          MODAL EDITAR
      ====================================================== */}

      <Modal
        open={modalActivo === "editar"}
        onCancel={cerrarModal}
        footer={null}
        width={1100}
        destroyOnClose
        centered
        className="geanova-modal geanova-modal--large"
        title={`Editar ${terrenoSeleccionado.nombre || "terreno"}`}
      >
        <EditarTerreno
          terreno={terrenoSeleccionado}
          terrenoId={terrenoSeleccionado.id}
        />
      </Modal>
    </>
  );
}


/* =========================================================
   COMPONENTES INTERNOS
   ========================================================= */

function InfoItem({
  label,
  value,
  full = false,
}) {
  return (
    <div
      className={
        full
          ? "terrain-info-item terrain-info-item--full"
          : "terrain-info-item"
      }
    >
      <span className="terrain-info-item__label">
        {label}
      </span>

      <strong className="terrain-info-item__value">
        {mostrarValor(value)}
      </strong>
    </div>
  );
}


function CommercialItem({
  label,
  value,
  highlighted = false,
}) {
  return (
    <div
      className={
        highlighted
          ? "terrain-commercial-item terrain-commercial-item--highlighted"
          : "terrain-commercial-item"
      }
    >
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}


function SurfaceItem({
  label,
  value,
}) {
  return (
    <div className="terrain-surface-item">

      <span className="terrain-surface-item__label">
        {label}
      </span>

      <div className="terrain-surface-item__value">

        <strong>
          {formatNumero(value)}
        </strong>

        <small>
          m²
        </small>

      </div>

    </div>
  );
}


/* =========================================================
   HELPERS
   ========================================================= */

function mostrarValor(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  return value;
}


function toNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }

  const numero = Number(
    String(value).replace(/,/g, "")
  );

  return Number.isFinite(numero)
    ? numero
    : 0;
}


function formatNumero(
  value,
  defaultValue = "—"
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return defaultValue;
  }

  const numero = toNumber(value);

  return new Intl.NumberFormat(
    "es-MX",
    {
      maximumFractionDigits: 2,
    }
  ).format(numero);
}


function formatMoneda(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const numero = toNumber(value);

  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    }
  ).format(numero);
}


function crearUbicacion(terreno) {
  const partes = [
    terreno?.colonia,
    terreno?.ciudad,
  ].filter(Boolean);

  if (partes.length === 0) {
    return "Ubicación no especificada";
  }

  return partes.join(", ");
}