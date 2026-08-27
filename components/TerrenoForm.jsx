"use client";

import { useContext, useRef, useState } from "react";

import {
  Form,
  Input,
  InputNumber,
  Select,
  Modal,
} from "antd";

import Swal from "sweetalert2";

import {
  BiBuildings,
  BiMap,
  BiMoney,
  BiCheckCircle,
} from "react-icons/bi";

import {
  TbRulerMeasure,
  TbCalendarDollar,
} from "react-icons/tb";

import { FaArrowLeft } from "react-icons/fa6";

import { LoadingContext } from "@/contexts/loading";

import terrenosService from "@/services/terrenosService";

import AsignarM2 from "@/components/AsignarM2";
import CrearPlazo from "@/components/CrearPlazo";

import { formatPrecio } from "@/helpers/formatters";

const EMPRESAS = [
  {
    id: 1,
    nombre: "Sucursal 1",
  },
];

export default function TerrenoForm({
  setTerrenoNuevo,
  setWatch,
  watch,
}) {
  const { setIsLoading } = useContext(LoadingContext);

  const [form] = Form.useForm();

  const [terrenoCreado, setTerrenoCreado] = useState(null);
  const [modalActivo, setModalActivo] = useState(null);

  const formContainerRef = useRef(null);

  const validacionMensajes = {
    required: "${label} es requerido",
    types: {
      number: "${label} no es un número válido",
    },
    number: {
      min: "${label} no puede ser menor a ${min}",
    },
  };

  /* =========================================================
     CALCULAR PRECIO POR M2
     ========================================================= */

  const onValuesChange = (_, valores) => {
    const precioCompra = Number(
      valores.precioCompra || 0
    );

    const superficieTotal = Number(
      valores.superficieTotal || 0
    );

    const precioM2 =
      superficieTotal > 0
        ? precioCompra / superficieTotal
        : 0;

    form.setFieldsValue({
      precio_m2:
        precioM2 > 0
          ? Number(precioM2.toFixed(2))
          : null,
    });
  };

  /* =========================================================
     GUARDAR
     ========================================================= */

  const onGuardarTerreno = async (values) => {
    const resultado = await Swal.fire({
      title: "Confirmar nuevo terreno",
      html: `
        <div class="swal-geanova-summary">
          <span>Proyecto</span>
          <strong>${values.nombreTerreno}</strong>

          <span>Cantidad de lotes</span>
          <strong>${values.cantidadLotes}</strong>
        </div>
      `,
      icon: "question",

      showDenyButton: true,
      showCancelButton: false,

      confirmButtonText: "Guardar terreno",
      denyButtonText: "Cancelar",

      buttonsStyling: false,

      customClass: {
        popup: "swal-geanova",
        confirmButton: "swal-geanova-confirm",
        denyButton: "swal-geanova-cancel",
      },
    });

    if (!resultado.isConfirmed) {
      return;
    }

    setIsLoading(true);

    terrenosService.createTerreno(
      values,
      onTerrenoGuardado,
      onError
    );
  };

  /* =========================================================
     CALLBACK GUARDADO
     ========================================================= */

  const onTerrenoGuardado = (data) => {
    setIsLoading(false);

    if (!data?.success) {
      Swal.fire({
        title: "No se pudo guardar",
        text:
          data?.message ||
          "Ocurrió un error al guardar el terreno.",
        icon: "error",

        confirmButtonText: "Aceptar",
        buttonsStyling: false,

        customClass: {
          popup: "swal-geanova",
          confirmButton: "swal-geanova-confirm",
        },
      });

      return;
    }

    setTerrenoCreado(data.terreno);

    notificarCambio();

    Swal.fire({
      title: "Terreno registrado",
      text:
        "El proyecto se guardó correctamente.",
      icon: "success",

      confirmButtonText: "Continuar",
      buttonsStyling: false,

      customClass: {
        popup: "swal-geanova",
        confirmButton: "swal-geanova-confirm",
      },
    });
  };

  /* =========================================================
     ERROR
     ========================================================= */

  const onError = (error) => {
    setIsLoading(false);

    console.error(
      "Error al guardar terreno:",
      error
    );

    Swal.fire({
      title: "Error",
      text:
        "No fue posible guardar el terreno. Intente nuevamente.",
      icon: "error",

      confirmButtonText: "Aceptar",
      buttonsStyling: false,

      customClass: {
        popup: "swal-geanova",
        confirmButton: "swal-geanova-confirm",
      },
    });
  };

  /* =========================================================
     CANCELAR
     ========================================================= */

  const handleCancel = async () => {
    const resultado = await Swal.fire({
      title: "¿Cancelar registro?",
      text:
        "Los datos ingresados en el formulario se perderán.",
      icon: "warning",

      showDenyButton: true,

      confirmButtonText: "Sí, cancelar",
      denyButtonText: "Continuar editando",

      buttonsStyling: false,

      customClass: {
        popup: "swal-geanova",
        confirmButton: "swal-geanova-danger",
        denyButton: "swal-geanova-cancel",
      },
    });

    if (resultado.isConfirmed) {
      volverTerrenos();
    }
  };

  /* =========================================================
     REFRESCAR PADRE
     ========================================================= */

  const notificarCambio = () => {
    if (typeof setWatch !== "function") {
      return;
    }

    if (typeof watch === "boolean") {
      setWatch(!watch);

      return;
    }

    if (typeof watch === "number") {
      setWatch(watch + 1);

      return;
    }

    setWatch();
  };

  /* =========================================================
     VOLVER
     ========================================================= */

  const volverTerrenos = () => {
    if (typeof setTerrenoNuevo === "function") {
      setTerrenoNuevo(false);
    }
  };

  /* =========================================================
     CREAR OTRO
     ========================================================= */

  const crearOtroTerreno = () => {
    form.resetFields();

    setTerrenoCreado(null);
    setModalActivo(null);

    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =========================================================
     TERRENO GUARDADO
     ========================================================= */

  if (terrenoCreado) {
    return (
      <>
        <div className="form-success">

          <div className="form-success__icon">
            <BiCheckCircle />
          </div>

          <span className="form-success__eyebrow">
            PROYECTO REGISTRADO
          </span>

          <h1 className="form-success__title">
            {terrenoCreado.nombre}
          </h1>

          <p className="form-success__description">
            El terreno fue registrado correctamente.
            Puedes continuar configurando el proyecto.
          </p>


          <div className="form-success__stats">

            <div>
              <span>
                Lotes
              </span>

              <strong>
                {terrenoCreado.cantidad_lotes || 0}
              </strong>
            </div>

            <div>
              <span>
                Superficie
              </span>

              <strong>
                {formatNumber(
                  terrenoCreado.superficie_total
                )}{" "}
                m²
              </strong>
            </div>

          </div>


          <div className="form-success__divider" />


          <div className="form-success__next">

            <h2>
              ¿Qué deseas configurar ahora?
            </h2>

            <p>
              Estos pasos también pueden realizarse
              posteriormente desde el proyecto.
            </p>


            <div className="form-success__actions">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setModalActivo("superficie")
                }
              >
                <TbRulerMeasure />

                Asignar superficies
              </button>


              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setModalActivo("plazos")
                }
              >
                <TbCalendarDollar />

                Crear plazos
              </button>


              <button
                type="button"
                className="btn btn-primary"
                onClick={volverTerrenos}
              >
                Ver terrenos
              </button>

            </div>


            <button
              type="button"
              className="form-success__new"
              onClick={crearOtroTerreno}
            >
              Registrar otro terreno
            </button>

          </div>

        </div>


        <Modal
          open={modalActivo === "superficie"}
          onCancel={() => setModalActivo(null)}
          footer={null}
          width={950}
          centered
          destroyOnClose
          className="geanova-modal"
          title="Asignar superficies"
        >
          <AsignarM2
            terrenoId={terrenoCreado.id}
          />
        </Modal>


        <Modal
          open={modalActivo === "plazos"}
          onCancel={() => setModalActivo(null)}
          footer={null}
          width={950}
          centered
          destroyOnClose
          className="geanova-modal"
          title="Crear plazos"
        >
          <CrearPlazo
            terrenoId={terrenoCreado.id}
          />
        </Modal>
      </>
    );
  }


  /* =========================================================
     FORMULARIO
     ========================================================= */

  return (
    <div
      ref={formContainerRef}
      className="geanova-form-page"
    >

      {/* HEADER */}

      <header className="geanova-form-header">

        <div>

          <span className="geanova-form-header__eyebrow">
            <BiBuildings />

            TERRENOS
          </span>

          <h1 className="geanova-form-header__title">
            Nuevo terreno
          </h1>

          <p className="geanova-form-header__description">
            Registra la información general,
            territorial y financiera del proyecto.
          </p>

        </div>


        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          <FaArrowLeft />

          Volver
        </button>

      </header>


      <Form
        form={form}
        name="nuevo-terreno"
        layout="vertical"
        autoComplete="off"
        validateMessages={validacionMensajes}
        onFinish={onGuardarTerreno}
        onValuesChange={onValuesChange}
        className="geanova-form"
      >

        {/* =====================================================
            INFORMACION GENERAL
        ====================================================== */}

        <section className="form-section">

          <div className="form-section__header">

            <div className="form-section__icon">
              <BiBuildings />
            </div>

            <div>

              <h2 className="form-section__title">
                Información general
              </h2>

              <p className="form-section__description">
                Datos principales para identificar
                el proyecto inmobiliario.
              </p>

            </div>

          </div>


          <div className="form-section__body">

            <div className="form-grid form-grid--2">

              <Form.Item
                label="Nombre del propietario"
                name="nombrePropietario"
                rules={[
                  {
                    required: true,
                    message:
                      "Nombre del propietario es requerido",
                  },
                ]}
              >
                <Input
                  placeholder="Ej. Juan Pérez"
                  size="large"
                />
              </Form.Item>


              <Form.Item
                label="Empresa"
                name="empresaId"
                rules={[
                  {
                    required: true,
                    message:
                      "Seleccione una empresa",
                  },
                ]}
              >
                <Select
                  showSearch
                  size="large"
                  placeholder="Seleccione una empresa"
                  optionFilterProp="label"
                  options={EMPRESAS.map(
                    (empresa) => ({
                      label: empresa.nombre,
                      value: empresa.id,
                    })
                  )}
                />
              </Form.Item>


              <Form.Item
                label="Nombre del proyecto"
                name="nombreTerreno"
                rules={[
                  {
                    required: true,
                    message:
                      "Nombre del terreno es requerido",
                  },
                ]}
              >
                <Input
                  placeholder="Ej. Residencial Santa María"
                  size="large"
                />
              </Form.Item>


              <Form.Item
                label="Ciudad"
                name="ciudad"
              >
                <Input
                  placeholder="Ej. Aguascalientes"
                  size="large"
                />
              </Form.Item>

            </div>

          </div>

        </section>


        {/* =====================================================
            UBICACION
        ====================================================== */}

        <section className="form-section">

          <div className="form-section__header">

            <div className="form-section__icon">
              <BiMap />
            </div>

            <div>

              <h2 className="form-section__title">
                Ubicación
              </h2>

              <p className="form-section__description">
                Dirección y localización general
                del terreno.
              </p>

            </div>

          </div>


          <div className="form-section__body">

            <div className="form-grid form-grid--2">

              <Form.Item
                className="form-grid__full"
                label="Domicilio"
                name="domicilioTerreno"
                rules={[
                  {
                    required: true,
                    message:
                      "Domicilio del terreno es requerido",
                  },
                ]}
              >
                <Input
                  placeholder="Calle, número o referencia"
                  size="large"
                />
              </Form.Item>


              <Form.Item
                label="Colonia / Localidad"
                name="colonia"
              >
                <Input
                  placeholder="Ingrese colonia o localidad"
                  size="large"
                />
              </Form.Item>


              <Form.Item
                label="Ciudad"
                name="ciudadUbicacion"
              >
                <Input
                  placeholder="Ciudad"
                  size="large"
                />
              </Form.Item>

            </div>

          </div>

        </section>


        {/* =====================================================
            SUPERFICIES
        ====================================================== */}

        <section className="form-section">

          <div className="form-section__header">

            <div className="form-section__icon">
              <TbRulerMeasure />
            </div>

            <div>

              <h2 className="form-section__title">
                Superficies y lotes
              </h2>

              <p className="form-section__description">
                Define la distribución física
                inicial del proyecto.
              </p>

            </div>

          </div>


          <div className="form-section__body">

            <div className="form-grid form-grid--3">

              <Form.Item
                label="Cantidad de lotes"
                name="cantidadLotes"
                rules={[
                  {
                    type: "number",
                    min: 1,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  controls={false}
                  placeholder="Ej. 150"
                  size="large"
                />
              </Form.Item>


              <Form.Item
                label="Superficie total"
                name="superficieTotal"
                rules={[
                  {
                    type: "number",
                    min: 1,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  controls={false}
                  placeholder="0.00"
                  suffix="m²"
                  size="large"
                />
              </Form.Item>


              <Form.Item
                label="Área vendible"
                name="areaVendible"
                rules={[
                  {
                    type: "number",
                    min: 0,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  controls={false}
                  placeholder="0.00"
                  suffix="m²"
                  size="large"
                />
              </Form.Item>


              <Form.Item
                label="Área de reserva"
                name="areaReserva"
                rules={[
                  {
                    type: "number",
                    min: 0,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  controls={false}
                  placeholder="0.00"
                  suffix="m²"
                  size="large"
                />
              </Form.Item>


              <Form.Item
                label="Área de vialidad"
                name="areaVialidad"
                rules={[
                  {
                    type: "number",
                    min: 0,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  controls={false}
                  placeholder="0.00"
                  suffix="m²"
                  size="large"
                />
              </Form.Item>

            </div>

          </div>

        </section>


        {/* =====================================================
            FINANZAS
        ====================================================== */}

        <section className="form-section">

          <div className="form-section__header">

            <div className="form-section__icon">
              <BiMoney />
            </div>

            <div>

              <h2 className="form-section__title">
                Información financiera
              </h2>

              <p className="form-section__description">
                Valores económicos principales
                del proyecto.
              </p>

            </div>

          </div>


          <div className="form-section__body">

            <div className="form-grid form-grid--3">

              <Form.Item
                label="Precio de compra"
                name="precioCompra"
                rules={[
                  {
                    type: "number",
                    min: 1,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  controls={false}
                  placeholder="0.00"
                  size="large"
                  formatter={formatPrecio}
                  parser={parseMoney}
                  prefix="$"
                  suffix="MXN"
                />
              </Form.Item>


              <Form.Item
                label="Precio por m²"
                name="precio_m2"
                tooltip="Se calcula automáticamente usando precio de compra ÷ superficie total."
              >
                <InputNumber
                  readOnly
                  controls={false}
                  size="large"
                  formatter={formatPrecio}
                  parser={parseMoney}
                  prefix="$"
                  suffix="MXN/m²"
                  className="form-control-calculated"
                />
              </Form.Item>


              <Form.Item
                label="Venta proyectada de contado"
                name="precioProyectadoContado"
                rules={[
                  {
                    type: "number",
                    min: 1,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  controls={false}
                  placeholder="0.00"
                  size="large"
                  formatter={formatPrecio}
                  parser={parseMoney}
                  prefix="$"
                  suffix="MXN"
                />
              </Form.Item>

            </div>
               <div className="form-grid form-grid--3">
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
                      suffix="MXN"
                      placeholder="0.00"
                    />
                  </Form.Item>
                </div>
          </div>

        </section>


        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="geanova-form-footer">

          <div className="geanova-form-footer__info">
            Los campos marcados con * son obligatorios.
          </div>


          <div className="geanova-form-footer__actions">

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancelar
            </button>


            <button
              type="submit"
              className="btn btn-primary"
            >
              Guardar terreno
            </button>

          </div>

        </footer>

      </Form>

    </div>
  );
}


/* =========================================================
   HELPERS
   ========================================================= */

function parseMoney(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .replace(/\$\s?/g, "")
    .replace(/,/g, "")
    .replace(/MXN/g, "")
    .trim();
}


function formatNumber(value) {
  const number = Number(value || 0);

  return new Intl.NumberFormat(
    "es-MX",
    {
      maximumFractionDigits: 2,
    }
  ).format(number);
}