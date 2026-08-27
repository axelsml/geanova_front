"use client";

import {
  Select,
} from "antd";

import Swal from "sweetalert2";

import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  BiBuildings,
  BiSearch,
  BiArrowBack,
  BiMap,
  BiMoney,
} from "react-icons/bi";

import {
  TbRulerMeasure,
  TbReportAnalytics,
} from "react-icons/tb";

import {
  LoadingContext,
} from "@/contexts/loading";

import terrenosService
  from "@/services/terrenosService";


export default function ReporteProyectoForm({
  setReporteNuevo,
}) {
  /* =========================================================
     CONTEXTO
     ========================================================= */

  const loadingContext =
    useContext(LoadingContext);

  if (!loadingContext) {
    throw new Error(
      "ReporteProyectoForm debe estar dentro de LoadingProvider"
    );
  }

  const {
    setIsLoading,
  } = loadingContext;


  /* =========================================================
     STATE
     ========================================================= */

  const [
    proyectos,
    setProyectos,
  ] = useState([]);

  const [
    proyectoID,
    setProyectoID,
  ] = useState(null);

  const [
    terreno,
    setTerreno,
  ] = useState(null);

  const [
    lotes,
    setLotes,
  ] = useState([]);

  const [
    lotesTotal,
    setLotesTotal,
  ] = useState({});


  /* =========================================================
     CARGAR PROYECTOS
     ========================================================= */

  useEffect(() => {
    terrenosService.getTerrenosAll(
      onTerrenos
    );
  }, []);


  const onTerrenos = (data) => {
    setProyectos(
      Array.isArray(data)
        ? data
        : []
    );
  };


  /* =========================================================
     BUSCAR REPORTE
     ========================================================= */

  const handleSearchButton = () => {
    if (!proyectoID) {
      return;
    }

    limpiarReporte();

    setIsLoading(true);

    terrenosService.getReporteProyectos(
      {
        id_proyecto: proyectoID,
      },
      onReporte,
      onError
    );
  };


  /* =========================================================
     RESPUESTA REPORTE
     ========================================================= */

  const onReporte = (data) => {
    setIsLoading(false);

    /*
     * También verificamos resumen.
     *
     * Esto evita intentar acceder a:
     *
     * data.resumen.proyecto
     *
     * cuando el backend no encontró datos.
     */
    if (
      data?.success === false ||
      !data?.resumen
    ) {
      limpiarReporte();

      Swal.fire({
        title: "Sin resultados",

        text:
          data?.message ||
          "No se encontraron registros con la información solicitada.",

        icon: "info",

        confirmButtonText:
          "Aceptar",

        buttonsStyling: false,

        customClass: {
          popup:
            "swal-geanova",

          confirmButton:
            "swal-geanova-confirm",
        },
      });

      return;
    }


    const resumen =
      data.resumen || {};

    const proyecto =
      resumen.proyecto || {};

    const fracciones =
      resumen.lista_de_fracciones || {};


    setTerreno(proyecto);


    setLotes(
      Array.isArray(
        fracciones.lista
      )
        ? fracciones.lista
        : []
    );


    setLotesTotal(
      fracciones || {}
    );
  };


  /* =========================================================
     ERROR
     ========================================================= */

  const onError = (error) => {
    setIsLoading(false);

    console.error(
      "Error al obtener reporte de proyecto:",
      error
    );

    Swal.fire({
      title: "Error",

      text:
        "No fue posible obtener el reporte del proyecto.",

      icon: "error",

      confirmButtonText:
        "Aceptar",

      buttonsStyling: false,

      customClass: {
        popup:
          "swal-geanova",

        confirmButton:
          "swal-geanova-confirm",
      },
    });
  };


  /* =========================================================
     LIMPIAR
     ========================================================= */

  const limpiarReporte = () => {
    setTerreno(null);
    setLotes([]);
    setLotesTotal({});
  };


  /* =========================================================
     SALIR
     ========================================================= */

  const handleCancel = async () => {
    const resultado =
      await Swal.fire({
        title:
          "¿Salir del reporte?",

        text:
          "Regresarás a la lista de terrenos.",

        icon:
          "question",

        showDenyButton:
          true,

        showCancelButton:
          false,

        confirmButtonText:
          "Salir",

        denyButtonText:
          "Permanecer",

        buttonsStyling:
          false,

        customClass: {
          popup:
            "swal-geanova",

          confirmButton:
            "swal-geanova-confirm",

          denyButton:
            "swal-geanova-cancel",
        },
      });


    if (
      resultado.isConfirmed &&
      typeof setReporteNuevo ===
        "function"
    ) {
      setReporteNuevo(false);
    }
  };


  /* =========================================================
     SELECT OPTIONS
     ========================================================= */

  const proyectoOptions =
    proyectos.map(
      (proyecto) => ({
        value: proyecto.id,

        label:
          proyecto.nombre ||
          `Proyecto ${proyecto.id}`,
      })
    );


  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="geanova-form-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="geanova-form-header">

        <div>

          <span className="geanova-form-header__eyebrow">
            <TbReportAnalytics />

            REPORTES
          </span>


          <h1 className="geanova-form-header__title">
            Reporte general del proyecto
          </h1>


          <p className="geanova-form-header__description">
            Consulta información general,
            superficies, proyección financiera
            y fracciones de un proyecto.
          </p>

        </div>

{/* 
        <button
          type="button"
          className="btn btn-secondary"
          onClick={
            handleCancel
          }
        >
          <BiArrowBack />

          Volver
        </button> */}

      </header>


      {/* =====================================================
          FILTROS
      ====================================================== */}

      <section className="filter-bar">

        <div className="form-group">

          <label className="form-label">
            Proyecto
          </label>


          <Select
            showSearch

            value={
              proyectoID
            }

            placeholder="Seleccione un proyecto"

            optionFilterProp="label"

            options={
              proyectoOptions
            }

            onChange={
              setProyectoID
            }

            size="large"

            style={{
              width: "100%",
            }}
          />

        </div>


        <button
          type="button"

          className="btn btn-primary"

          disabled={
            !proyectoID
          }

          onClick={
            handleSearchButton
          }
        >
          <BiSearch />

          Buscar reporte
        </button>

      </section>


      {/* =====================================================
          SIN REPORTE
      ====================================================== */}

      {!terreno && (
        <div className="card">

          <div className="empty-state">

            <TbReportAnalytics
              size={38}
            />


            <strong>
              Selecciona un proyecto
            </strong>


            <span>
              El reporte aparecerá aquí
              después de seleccionar un
              proyecto y presionar buscar.
            </span>

          </div>

        </div>
      )}


      {/* =====================================================
          REPORTE
      ====================================================== */}

      {terreno && (
        <>

          {/* =================================================
              PROYECTO
          ================================================== */}

          <section className="card">

            <div className="card__header">

              <div>

                <h2 className="card__title">
                  Información del proyecto
                </h2>


                <p className="terrain-card-description">
                  Datos generales del terreno seleccionado.
                </p>

              </div>


              <BiBuildings
                className="terrain-card-header-icon"
              />

            </div>


            <div className="terrain-info-grid">

              <InfoItem
                label="Proyecto"

                value={
                  terreno.terreno ||
                  terreno.nombre
                }
              />


              <InfoItem
                label="Propietario"

                value={
                  terreno.propietario
                }
              />


              <InfoItem
                label="Ciudad"

                value={
                  terreno.ciudad
                }
              />


              <InfoItem
                label="Colonia / Localidad"

                value={
                  terreno.colonia
                }
              />


              <InfoItem
                label="Domicilio"

                value={
                  terreno.domicilio
                }

                full
              />

            </div>

          </section>


          {/* =================================================
              INDICADORES
          ================================================== */}

          <section
            className="terrain-stats"
            style={{
              marginTop: "20px",
            }}
          >

            <StatItem
              icon={
                BiBuildings
              }

              label="Cantidad de lotes"

              value={
                formatNumero(
                  terreno.cantidad_lotes,
                  0
                )
              }
            />


            <StatItem
              icon={
                TbRulerMeasure
              }

              label="Superficie total"

              value={`${formatNumero(
                terreno.superficie_total
              )} m²`}
            />


            <StatItem
              icon={
                BiMoney
              }

              label="Precio de compra"

              value={
                formatMoneda(
                  terreno.precio_compra
                )
              }
            />


            <StatItem
              icon={
                BiMoney
              }

              label="Precio por m²"

              value={
                formatMoneda(
                  terreno.precio_m2
                )
              }
            />

          </section>


          {/* =================================================
              SUPERFICIES
          ================================================== */}

          <section
            className="card terrain-surfaces-card"
            style={{
              marginTop: "20px",
            }}
          >

            <div className="card__header">

              <div>

                <h2 className="card__title">
                  Superficies
                </h2>


                <p className="terrain-card-description">
                  Distribución territorial del proyecto.
                </p>

              </div>


              <TbRulerMeasure
                className="terrain-card-header-icon"
              />

            </div>


            <div className="terrain-surfaces">

              <SurfaceItem
                label="Superficie total"

                value={
                  terreno.superficie_total
                }
              />


              <SurfaceItem
                label="Área vendible"

                value={
                  terreno.area_vendible
                }
              />


              <SurfaceItem
                label="Área de reserva"

                value={
                  terreno.area_reserva
                }
              />


              <SurfaceItem
                label="Área de vialidad"

                value={
                  terreno.area_vialidad
                }
              />

            </div>

          </section>


          {/* =================================================
              INFORMACIÓN FINANCIERA
          ================================================== */}

          <section
            className="card"
            style={{
              marginTop: "20px",
            }}
          >

            <div className="card__header">

              <div>

                <h2 className="card__title">
                  Información financiera
                </h2>


                <p className="terrain-card-description">
                  Valores y proyección económica
                  del proyecto.
                </p>

              </div>


              <BiMoney
                className="terrain-card-header-icon"
              />

            </div>


            <div className="terrain-commercial-list">

              <CommercialItem
                label="Precio de compra"

                value={
                  formatMoneda(
                    terreno.precio_compra
                  )
                }
              />


              <CommercialItem
                label="Precio de área vendible"

                value={
                  formatMoneda(
                    terreno.precio_area_vendible
                  )
                }
              />


              <CommercialItem
                label="Fracciones pendientes"

                value={
                  formatNumero(
                    terreno.fracciones_pendientes,
                    0
                  )
                }
              />


              <CommercialItem
                label="Total proyectado de venta"

                value={
                  formatMoneda(
                    terreno.total_proyectado_de_venta
                  )
                }

                highlighted
              />

            </div>

          </section>


          {/* =================================================
              FRACCIONES
          ================================================== */}

          <section
            className="card"
            style={{
              marginTop: "20px",
            }}
          >

            <div className="card__header">

              <div>

                <h2 className="card__title">
                  Fracciones
                </h2>


                <p className="terrain-card-description">
                  Detalle de contratos y cobranza
                  del proyecto.
                </p>

              </div>


              <span className="badge badge-primary">
                {lotes.length} registros
              </span>

            </div>


            {lotes.length > 0 ? (

              <div className="table-container">

                <table className="table">

                  <thead>

                    <tr>

                      <th>
                        No.
                      </th>

                      <th>
                        Fecha
                      </th>

                      <th>
                        Cliente
                      </th>

                      <th>
                        Monto contratado
                      </th>

                      <th>
                        Plazo
                      </th>

                      <th>
                        Requerido
                      </th>

                      <th>
                        Realizado
                      </th>

                      <th>
                        Saldo pendiente
                      </th>

                      <th>
                        Sistema de pago
                      </th>

                      <th>
                        Cuenta depósito
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {lotes.map(
                      (
                        lote,
                        index
                      ) => (
                        <tr
                          key={
                            lote.id ||
                            `${lote.fraccion}-${index}`
                          }
                        >

                          <td>
                            <strong>
                              {mostrarValor(
                                lote.fraccion
                              )}
                            </strong>
                          </td>


                          <td>
                            {mostrarValor(
                              lote.fecha
                            )}
                          </td>


                          <td>
                            {nombreCliente(
                              lote
                            )}
                          </td>


                          <td>
                            {formatMoneda(
                              lote.monto_contratado
                            )}
                          </td>


                          <td>
                            {mostrarValor(
                              lote.plazo
                            )}
                          </td>


                          <td>
                            {formatMoneda(
                              lote.requerido_actual
                            )}
                          </td>


                          <td>
                            {formatMoneda(
                              lote.realizado_actual
                            )}
                          </td>


                          <td>
                            {formatMoneda(
                              lote.saldo_pendiente
                            )}
                          </td>


                          <td>
                            {mostrarValor(
                              lote.sistema_pago
                            )}
                          </td>


                          <td>
                            {mostrarValor(
                              lote.cuenta_deposito
                            )}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>


                  <tfoot>

                    <tr>

                      <td>
                        <strong>
                          TOTAL
                        </strong>
                      </td>

                      <td />

                      <td />

                      <td>
                        <strong>
                          {formatMoneda(
                            lotesTotal.total_contrato
                          )}
                        </strong>
                      </td>

                      <td />

                      <td>
                        <strong>
                          {formatMoneda(
                            lotesTotal.total_requerido
                          )}
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {formatMoneda(
                            lotesTotal.total_realizado
                          )}
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {formatMoneda(
                            lotesTotal.total_pendiente
                          )}
                        </strong>
                      </td>

                      <td />

                      <td />

                    </tr>

                  </tfoot>

                </table>

              </div>

            ) : (

              <div className="empty-state">

                <BiMap
                  size={32}
                />

                <strong>
                  Sin fracciones
                </strong>

                <span>
                  No existen fracciones registradas
                  para este proyecto.
                </span>

              </div>

            )}

          </section>

        </>
      )}

    </div>
  );
}


/* =========================================================
   INFO ITEM
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
        {mostrarValor(
          value
        )}
      </strong>

    </div>
  );
}


/* =========================================================
   KPI
   ========================================================= */

function StatItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="terrain-stat-card">

      <div className="terrain-stat-card__icon">
        <Icon />
      </div>


      <div>

        <span className="terrain-stat-card__label">
          {label}
        </span>


        <strong className="terrain-stat-card__value">
          {value}
        </strong>

      </div>

    </div>
  );
}


/* =========================================================
   SUPERFICIE
   ========================================================= */

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
          {formatNumero(
            value
          )}
        </strong>

        <small>
          m²
        </small>

      </div>

    </div>
  );
}


/* =========================================================
   COMERCIAL
   ========================================================= */

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

  const limpio =
    String(value)
      .replace(/\$/g, "")
      .replace(/,/g, "")
      .replace(/\s/g, "");


  const numero =
    Number(limpio);


  return Number.isFinite(
    numero
  )
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


  return new Intl.NumberFormat(
    "es-MX",
    {
      maximumFractionDigits: 2,
    }
  ).format(
    toNumber(value)
  );
}


function formatMoneda(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }


  return new Intl.NumberFormat(
    "es-MX",
    {
      style:
        "currency",

      currency:
        "MXN",

      maximumFractionDigits:
        2,
    }
  ).format(
    toNumber(value)
  );
}


function nombreCliente(lote) {
  const nombre = [
    lote?.cliente_nombre,
    lote?.cliente_apellido,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();


  return nombre || "—";
}