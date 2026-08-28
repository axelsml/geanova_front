"use client";

import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import {
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
} from "antd";

import Swal from "sweetalert2";

import {
  BiBuildings,
  BiMap,
  BiMoney,
  BiSave,
} from "react-icons/bi";

import {
  TbRulerMeasure,
  TbHomePlus,
  TbHomeMinus,
} from "react-icons/tb";

import {
  LoadingContext,
} from "@/contexts/loading";

import terrenosService
  from "@/services/terrenosService";

import lotesService
  from "@/services/lotesService";

import {
  formatPrecio,
} from "@/helpers/formatters";


const EditarTerreno = forwardRef(
  (
    {
      terreno,
      terrenoId,
    },
    ref
  ) => {
    /* =========================================================
       CONTEXT
       ========================================================= */

    const loadingContext =
      useContext(LoadingContext);

    if (!loadingContext) {
      throw new Error(
        "EditarTerreno debe estar dentro de LoadingProvider"
      );
    }

    const {
      setIsLoading,
    } = loadingContext;


    /* =========================================================
       FORM
       ========================================================= */

    const [form] =
      Form.useForm();


    /* =========================================================
       LOTES
       ========================================================= */

    const [
      accionLotes,
      setAccionLotes,
    ] = useState(null);

    const [
      cantidadAgregar,
      setCantidadAgregar,
    ] = useState(null);

    const [
      lotes,
      setLotes,
    ] = useState([]);

    const [
      lotesSeleccionados,
      setLotesSeleccionados,
    ] = useState([]);

    const [
      totalLotes,
      setTotalLotes,
    ] = useState(
      Number(
        terreno?.cantidad_lotes || 0
      )
    );


    /* =========================================================
       CROQUIS

       Se mantienen preparados para cuando vuelvas
       a habilitar CroquisUploader.
       ========================================================= */

    const [
      pdf,
      setPdf,
    ] = useState("");

    const [
      imagenRecortada,
      setImagenRecortada,
    ] = useState("");

    const [
      resetCroquis,
      setResetCroquis,
    ] = useState(
      () => () => {}
    );


    /* =========================================================
       CARGAR DATOS DEL TERRENO
       ========================================================= */

    useEffect(() => {
      if (!terreno) {
        return;
      }

      form.setFieldsValue({
        nombre_proyecto:
          terreno.nombre || "",

        nombre_propietario:
          terreno.propietario || "",

        ciudad:
          terreno.ciudad || "",

        domicilio:
          terreno.domicilio || "",

        colonia:
          terreno.colonia || "",

        superficie_total:
          toNumber(
            terreno.superficie_total
          ),

        area_vendible:
          toNumber(
            terreno.area_vendible
          ),

        area_reserva:
          toNumber(
            terreno.area_reserva
          ),

        area_vialidad:
          toNumber(
            terreno.area_vialidad
          ),

        precio_compra:
          toNumber(
            terreno.precio_compra
          ),

        precio_m2:
          toNumber(
            terreno.precio_m2
          ),

        precio_proyectado_contado:
          toNumber(
            terreno
              .precio_proyectado_contado
          ),
          escrituracion_m2:
          terreno.escrituracion_m2 !== null &&
          terreno.escrituracion_m2 !== undefined
            ? toNumber(
                terreno.escrituracion_m2
              )
            : null,

        escrituracion_fija:
          terreno.escrituracion_fija !== null &&
          terreno.escrituracion_fija !== undefined
            ? toNumber(
                terreno.escrituracion_fija
              )
            : null,
      });
      
      setTotalLotes(
        Number(
          terreno.cantidad_lotes || 0
        )
      );
    }, [
      terreno,
      form,
    ]);


    /* =========================================================
       CLEAR PARA EL PADRE
       ========================================================= */

    const clear =
      useCallback(() => {
        form.resetFields();

        resetCroquis();

        setPdf("");
        setImagenRecortada("");

        setAccionLotes(null);
        setCantidadAgregar(null);

        setLotes([]);
        setLotesSeleccionados([]);
      }, [
        form,
        resetCroquis,
      ]);


    useImperativeHandle(
      ref,
      () => ({
        clear,
      }),
      [clear]
    );


    /* =========================================================
       SUPERFICIES
       ========================================================= */

    const superficieTotal =
      Form.useWatch(
        "superficie_total",
        form
      );

    const areaVendible =
      Form.useWatch(
        "area_vendible",
        form
      );

    const areaReserva =
      Form.useWatch(
        "area_reserva",
        form
      );

    const areaVialidad =
      Form.useWatch(
        "area_vialidad",
        form
      );


    const superficieClasificada =
      useMemo(() => {
        return (
          toNumber(
            areaVendible
          ) +
          toNumber(
            areaReserva
          ) +
          toNumber(
            areaVialidad
          )
        );
      }, [
        areaVendible,
        areaReserva,
        areaVialidad,
      ]);


    const superficieDisponible =
      useMemo(() => {
        return (
          toNumber(
            superficieTotal
          ) -
          superficieClasificada
        );
      }, [
        superficieTotal,
        superficieClasificada,
      ]);


    /* =========================================================
       GUARDAR TERRENO
       ========================================================= */

    const onGuardarTerreno =
      async (values) => {
        const resultado =
          await Swal.fire({
            title:
              "Guardar cambios",

            text:
              "Se actualizará la información del terreno.",

            icon:
              "question",

            showDenyButton:
              true,

            showCancelButton:
              false,

            confirmButtonText:
              "Guardar cambios",

            denyButtonText:
              "Cancelar",

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
          !resultado.isConfirmed
        ) {
          return;
        }


        const params = {
          ...values,
          terreno_id:
            terrenoId,
        };


        /*
         * Sólo enviamos archivos
         * si realmente fueron modificados.
         */
        if (pdf) {
          params.pdf = pdf;
        }

        if (
          imagenRecortada
        ) {
          params.recorte =
            imagenRecortada;
        }


        setIsLoading(true);


        terrenosService
          .actualizarTerreno(
            params,
            onTerrenoGuardado,
            onError
          );
      };


    /* =========================================================
       TERRENO GUARDADO
       ========================================================= */

    const onTerrenoGuardado =
      (data) => {
        setIsLoading(false);


        if (!data?.success) {
          mostrarError(
            data?.message ||
              "No fue posible actualizar el terreno."
          );

          return;
        }


        Swal.fire({
          title:
            "Cambios guardados",

          text:
            data?.message ||
            "La información del terreno se actualizó correctamente.",

          icon:
            "success",

          confirmButtonText:
            "Aceptar",

          buttonsStyling:
            false,

          customClass: {
            popup:
              "swal-geanova",

            confirmButton:
              "swal-geanova-confirm",
          },
        });
      };


    /* =========================================================
       CANCELAR
       ========================================================= */

    const handleCancel =
      async () => {
        const resultado =
          await Swal.fire({
            title:
              "¿Restablecer cambios?",

            text:
              "Los cambios no guardados serán descartados.",

            icon:
              "question",

            showDenyButton:
              true,

            confirmButtonText:
              "Restablecer",

            denyButtonText:
              "Continuar editando",

            buttonsStyling:
              false,

            customClass: {
              popup:
                "swal-geanova",

              confirmButton:
                "swal-geanova-danger",

              denyButton:
                "swal-geanova-cancel",
            },
          });


        if (
          !resultado.isConfirmed
        ) {
          return;
        }


        form.resetFields();

        /*
         * Como resetFields vuelve a los
         * initialValues, volvemos a cargar
         * explícitamente el terreno.
         */
        cargarValoresTerreno(
          form,
          terreno
        );


        resetCroquis();

        setPdf("");
        setImagenRecortada("");
      };


    /* =========================================================
       ACCIÓN DE LOTES
       ========================================================= */

    const cambiarAccionLotes =
      (event) => {
        const accion =
          event.target.value;


        setAccionLotes(
          accion
        );

        setCantidadAgregar(
          null
        );

        setLotesSeleccionados(
          []
        );


        if (
          accion ===
          "eliminar"
        ) {
          cargarLotes();
        }
      };


    /* =========================================================
       CONSULTAR LOTES
       ========================================================= */

    const cargarLotes = () => {
      setIsLoading(true);


      lotesService
        .getAllLotes(
          {
            terreno_id:
              terrenoId,
          },
          onAllLotes,
          onError
        );
    };


    const onAllLotes =
      (data) => {
        setIsLoading(false);


        setLotes(
          Array.isArray(data)
            ? data
            : []
        );
      };


    /* =========================================================
       GUARDAR OPERACIÓN DE LOTES
       ========================================================= */

    const onSaveLotes = () => {
      if (
        accionLotes ===
        "agregar"
      ) {
        agregarLotes();

        return;
      }


      if (
        accionLotes ===
        "eliminar"
      ) {
        eliminarLotes();
      }
    };


    /* =========================================================
       AGREGAR LOTES
       ========================================================= */

    const agregarLotes =
      async () => {
        const cantidad =
          Number(
            cantidadAgregar
          );


        if (
          !cantidad ||
          cantidad <= 0
        ) {
          return;
        }


        const resultado =
          await Swal.fire({
            title:
              "Agregar lotes",

            text:
              `Se agregarán ${cantidad} lotes al proyecto.`,

            icon:
              "question",

            showDenyButton:
              true,

            confirmButtonText:
              "Agregar",

            denyButtonText:
              "Cancelar",

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
          !resultado.isConfirmed
        ) {
          return;
        }


        setIsLoading(true);


        lotesService.agregarLotes(
          {
            terreno_id:
              terrenoId,

            cantidad_lotes:
              cantidad,
          },
          onAgregarLotes,
          onError
        );
      };


    const onAgregarLotes =
      (data) => {
        setIsLoading(false);


        if (!data?.success) {
          mostrarError(
            data?.message ||
              "No fue posible agregar los lotes."
          );

          return;
        }


        setTotalLotes(
          (actual) =>
            actual +
            Number(
              cantidadAgregar ||
              0
            )
        );


        setCantidadAgregar(
          null
        );

        setAccionLotes(
          null
        );


        mostrarExito(
          data?.message ||
            "Los lotes se agregaron correctamente."
        );
      };


    /* =========================================================
       ELIMINAR LOTES
       ========================================================= */

    const eliminarLotes =
      async () => {
        if (
          lotesSeleccionados
            .length === 0
        ) {
          return;
        }


        const cantidad =
          lotesSeleccionados
            .length;


        const resultado =
          await Swal.fire({
            title:
              "Eliminar lotes",

            text:
              `Se eliminarán ${cantidad} lotes del proyecto.`,

            icon:
              "warning",

            showDenyButton:
              true,

            confirmButtonText:
              "Eliminar",

            denyButtonText:
              "Cancelar",

            buttonsStyling:
              false,

            customClass: {
              popup:
                "swal-geanova",

              confirmButton:
                "swal-geanova-danger",

              denyButton:
                "swal-geanova-cancel",
            },
          });


        if (
          !resultado.isConfirmed
        ) {
          return;
        }


        setIsLoading(true);


        lotesService.eliminarLotes(
          {
            terreno_id:
              terrenoId,

            lotes_seleccionados:
              lotesSeleccionados,
          },
          onEliminarLotes,
          onError
        );
      };


    const onEliminarLotes =
      (data) => {
        setIsLoading(false);


        if (!data?.success) {
          mostrarError(
            data?.message ||
              "No fue posible eliminar los lotes."
          );

          return;
        }


        const cantidad =
          lotesSeleccionados
            .length;


        setTotalLotes(
          (actual) =>
            Math.max(
              0,
              actual - cantidad
            )
        );


        setLotesSeleccionados(
          []
        );

        setAccionLotes(
          null
        );


        mostrarExito(
          data?.message ||
            "Los lotes se eliminaron correctamente."
        );
      };


    /* =========================================================
       ERROR
       ========================================================= */

    const onError =
      (error) => {
        setIsLoading(false);


        console.error(
          "Error en EditarTerreno:",
          error
        );


        mostrarError(
          "Ocurrió un error procesando la solicitud."
        );
      };


    /* =========================================================
       CROQUIS
       ========================================================= */

    const handleFileSelected =
      (archivo) => {
        setPdf(
          archivo || ""
        );
      };


    const handleCroquisReset =
      useCallback(
        (resetFunc) => {
          if (
            typeof resetFunc ===
            "function"
          ) {
            setResetCroquis(
              () => resetFunc
            );
          }
        },
        []
      );


    /* =========================================================
       VALIDACIÓN
       ========================================================= */

    const validacionMensajes = {
      required:
        "${label} es requerido",

      types: {
        number:
          "${label} no es un número válido",
      },

      number: {
        min:
          "${label} no puede ser menor a ${min}",
      },
    };


    /* =========================================================
       LOT OPTIONS
       ========================================================= */

    const opcionesLotes =
      lotes.map(
        (lote) => ({
          value:
            lote.id,

          label:
            `Lote ${lote.numero}`,
        })
      );


    /* =========================================================
       RENDER
       ========================================================= */

    return (
      <div className="terrain-edit">

        {/* =====================================================
            RESUMEN
        ====================================================== */}

        <div className="terrain-edit__summary">

          <div className="terrain-edit__summary-icon">
            <BiBuildings />
          </div>


          <div>

            <span className="terrain-edit__eyebrow">
              EDITANDO PROYECTO
            </span>


            <h2 className="terrain-edit__name">
              {terreno?.nombre ||
                "Terreno"}
            </h2>


            <span className="terrain-edit__meta">
              {totalLotes} lotes registrados
            </span>

          </div>

        </div>


        <Form
          form={form}

          name="editar-terreno"

          layout="vertical"

          autoComplete="off"

          validateMessages={
            validacionMensajes
          }

          onFinish={
            onGuardarTerreno
          }

          className="geanova-form"
        >

          {/* ===================================================
              INFORMACIÓN GENERAL
          ==================================================== */}

          <section className="form-section">

            <div className="form-section__header">

              <div className="form-section__icon">
                <BiBuildings />
              </div>


              <div>

                <h3 className="form-section__title">
                  Información general
                </h3>


                <p className="form-section__description">
                  Identificación y ubicación
                  del proyecto.
                </p>

              </div>

            </div>


            <div className="form-section__body">

              <div className="form-grid form-grid--2">

                <Form.Item
                  name="nombre_proyecto"

                  label="Nombre del proyecto"

                  rules={[
                    {
                      required:
                        true,

                      message:
                        "Nombre del proyecto requerido",
                    },
                  ]}
                >
                  <Input
                    size="large"

                    placeholder="Nombre del proyecto"
                  />
                </Form.Item>


                <Form.Item
                  name="nombre_propietario"

                  label="Propietario"

                  rules={[
                    {
                      required:
                        true,

                      message:
                        "Nombre del propietario requerido",
                    },
                  ]}
                >
                  <Input
                    size="large"

                    placeholder="Nombre del propietario"
                  />
                </Form.Item>


                <Form.Item
                  name="ciudad"

                  label="Ciudad"

                  rules={[
                    {
                      required:
                        true,

                      message:
                        "Ciudad requerida",
                    },
                  ]}
                >
                  <Input
                    size="large"

                    placeholder="Ciudad"
                  />
                </Form.Item>


                <Form.Item
                  name="colonia"

                  label="Colonia / Localidad"

                  rules={[
                    {
                      required:
                        true,

                      message:
                        "Colonia requerida",
                    },
                  ]}
                >
                  <Input
                    size="large"

                    placeholder="Colonia o localidad"
                  />
                </Form.Item>


                <Form.Item
                  name="domicilio"

                  label="Domicilio"

                  className="form-grid__full"

                  rules={[
                    {
                      required:
                        true,

                      message:
                        "Domicilio requerido",
                    },
                  ]}
                >
                  <Input
                    size="large"

                    placeholder="Domicilio del terreno"
                  />
                </Form.Item>

              </div>

            </div>

          </section>


          {/* ===================================================
              SUPERFICIES
          ==================================================== */}

          <section className="form-section">

            <div className="form-section__header">

              <div className="form-section__icon">
                <TbRulerMeasure />
              </div>


              <div>

                <h3 className="form-section__title">
                  Superficies
                </h3>


                <p className="form-section__description">
                  Distribución territorial
                  del proyecto.
                </p>

              </div>

            </div>


            <div className="form-section__body">

              <div className="form-grid form-grid--4">

                <Form.Item
                  name="superficie_total"

                  label="Superficie total"

                  rules={[
                    {
                      type:
                        "number",

                      min:
                        0,

                      required:
                        true,
                    },
                  ]}
                >
                  <InputNumber
                    size="large"

                    min={0}

                    controls={false}

                    suffix="m²"

                    placeholder="0.00"
                  />
                </Form.Item>


                <Form.Item
                  name="area_vendible"

                  label="Área vendible"

                  rules={[
                    {
                      type:
                        "number",

                      min:
                        0,

                      required:
                        true,
                    },
                  ]}
                >
                  <InputNumber
                    size="large"

                    min={0}

                    controls={false}

                    suffix="m²"

                    placeholder="0.00"
                  />
                </Form.Item>


                <Form.Item
                  name="area_reserva"

                  label="Área de reserva"

                  rules={[
                    {
                      type:
                        "number",

                      min:
                        0,

                      required:
                        true,
                    },
                  ]}
                >
                  <InputNumber
                    size="large"

                    min={0}

                    controls={false}

                    suffix="m²"

                    placeholder="0.00"
                  />
                </Form.Item>


                <Form.Item
                  name="area_vialidad"

                  label="Área de vialidad"

                  rules={[
                    {
                      type:
                        "number",

                      min:
                        0,

                      required:
                        true,
                    },
                  ]}
                >
                  <InputNumber
                    size="large"

                    min={0}

                    controls={false}

                    suffix="m²"

                    placeholder="0.00"
                  />
                </Form.Item>

              </div>


              {/* ===============================================
                  RESUMEN SUPERFICIE
              =============================================== */}

              <div className="terrain-area-summary">

                <div>

                  <span>
                    Superficie clasificada
                  </span>


                  <strong>
                    {formatNumber(
                      superficieClasificada
                    )}{" "}
                    m²
                  </strong>

                </div>


                <div
                  className={
                    superficieDisponible <
                    0
                      ? "terrain-area-summary__item terrain-area-summary__item--error"
                      : "terrain-area-summary__item"
                  }
                >

                  <span>
                    Superficie disponible
                  </span>


                  <strong>
                    {formatNumber(
                      superficieDisponible
                    )}{" "}
                    m²
                  </strong>

                </div>

              </div>

            </div>

          </section>


          {/* ===================================================
              FINANCIERO
          ==================================================== */}

          <section className="form-section">

            <div className="form-section__header">

              <div className="form-section__icon">
                <BiMoney />
              </div>


              <div>

                <h3 className="form-section__title">
                  Información financiera
                </h3>


                <p className="form-section__description">
                  Valores de compra y
                  proyección comercial.
                </p>

              </div>

            </div>


            <div className="form-section__body">

              <div className="form-grid form-grid--3">

                <Form.Item
                  name="precio_compra"

                  label="Precio de compra"

                  rules={[
                    {
                      type:
                        "number",

                      min:
                        0,

                      required:
                        true,
                    },
                  ]}
                >
                  <InputNumber
                    size="large"

                    min={0}

                    controls={false}

                    formatter={
                      formatPrecio
                    }

                    parser={
                      parseMoney
                    }

                    prefix="$"

                     

                    placeholder="0.00"
                  />
                </Form.Item>


                <Form.Item
                  name="precio_m2"

                  label="Precio por m²"

                  rules={[
                    {
                      type:
                        "number",

                      min:
                        0,

                      required:
                        true,
                    },
                  ]}
                >
                  <InputNumber
                    size="large"

                    min={0}

                    controls={false}

                    formatter={
                      formatPrecio
                    }

                    parser={
                      parseMoney
                    }

                    prefix="$"

                    suffix="MXN/m²"

                    placeholder="0.00"
                  />
                </Form.Item>


                <Form.Item
                  name="precio_proyectado_contado"

                  label="Venta proyectada de contado"

                  rules={[
                    {
                      type:
                        "number",

                      min:
                        0,

                      required:
                        true,
                    },
                  ]}
                >
                  <InputNumber
                    size="large"

                    min={0}

                    controls={false}

                    formatter={
                      formatPrecio
                    }

                    parser={
                      parseMoney
                    }

                    prefix="$"

                     

                    placeholder="0.00"
                  />
                </Form.Item>
                
                <Form.Item
                  name="escrituracion_m2"
                  label="Escrituración por m²"
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      required: false,
                    },
                  ]}
                >
                  <InputNumber
                    size="large"
                    min={0}
                    controls={false}
                    formatter={formatPrecio}
                    parser={parseMoney}
                    prefix="$"
                    suffix="MXN/m²"
                    placeholder="0.00"
                  />
                </Form.Item>


                <Form.Item
                  name="escrituracion_fija"
                  label="Escrituración fija"
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      required: false,
                    },
                  ]}
                >
                  <InputNumber
                    size="large"
                    min={0}
                    controls={false}
                    formatter={formatPrecio}
                    parser={parseMoney}
                    prefix="$"
                     
                    placeholder="0.00"
                  />
                </Form.Item>
              </div>

            </div>

          </section>


         

          <footer className="geanova-form-footer">

            
            <div className="geanova-form-footer__actions">


              <button
                type="submit"

                className="btn btn-primary"
              >
                <BiSave />

                Guardar cambios
              </button>

            </div>

          </footer>

        </Form>

      </div>
    );
  }
);


EditarTerreno.displayName =
  "EditarTerreno";


export default EditarTerreno;


/* =========================================================
   CARGAR VALORES
   ========================================================= */

function cargarValoresTerreno(
  form,
  terreno
) {
  if (
    !form ||
    !terreno
  ) {
    return;
  }


  form.setFieldsValue({
    nombre_proyecto:
      terreno.nombre || "",

    nombre_propietario:
      terreno.propietario || "",

    ciudad:
      terreno.ciudad || "",

    domicilio:
      terreno.domicilio || "",

    colonia:
      terreno.colonia || "",

    superficie_total:
      toNumber(
        terreno.superficie_total
      ),

    area_vendible:
      toNumber(
        terreno.area_vendible
      ),

    area_reserva:
      toNumber(
        terreno.area_reserva
      ),

    area_vialidad:
      toNumber(
        terreno.area_vialidad
      ),

    precio_compra:
      toNumber(
        terreno.precio_compra
      ),

    precio_m2:
      toNumber(
        terreno.precio_m2
      ),

    precio_proyectado_contado:
      toNumber(
        terreno
          .precio_proyectado_contado
      ),
      escrituracion_m2:
      terreno.escrituracion_m2 !== null &&
      terreno.escrituracion_m2 !== undefined
        ? toNumber(terreno.escrituracion_m2)
        : null,

    escrituracion_fija:
      terreno.escrituracion_fija !== null &&
      terreno.escrituracion_fija !== undefined
        ? toNumber(terreno.escrituracion_fija)
        : null,
  });
}


/* =========================================================
   NUMBER
   ========================================================= */

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
      .trim();


  const numero =
    Number(limpio);


  return Number.isFinite(
    numero
  )
    ? numero
    : 0;
}


/* =========================================================
   MONEY PARSER
   ========================================================= */

function parseMoney(value) {
  if (!value) {
    return "";
  }


  return String(value)
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .replace(/MXN/g, "")
    .replace(/\/m²/g, "")
    .trim();
}


/* =========================================================
   FORMAT NUMBER
   ========================================================= */

function formatNumber(value) {
  return new Intl.NumberFormat(
    "es-MX",
    {
      maximumFractionDigits:
        2,
    }
  ).format(
    toNumber(value)
  );
}


/* =========================================================
   ALERTS
   ========================================================= */

function mostrarExito(
  mensaje
) {
  Swal.fire({
    title:
      "Operación exitosa",

    text:
      mensaje,

    icon:
      "success",

    confirmButtonText:
      "Aceptar",

    buttonsStyling:
      false,

    customClass: {
      popup:
        "swal-geanova",

      confirmButton:
        "swal-geanova-confirm",
    },
  });
}


function mostrarError(
  mensaje
) {
  Swal.fire({
    title:
      "Error",

    text:
      mensaje,

    icon:
      "error",

    confirmButtonText:
      "Aceptar",

    buttonsStyling:
      false,

    customClass: {
      popup:
        "swal-geanova",

      confirmButton:
        "swal-geanova-confirm",
    },
  });
}