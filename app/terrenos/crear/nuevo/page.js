"use client";

import { Button, Form, InputNumber, Select, Row, Col, Modal } from "antd";
const { Option } = Select;
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import InputIn from "@/components/Input";
import { useRef, useState, useCallback } from "react";
import terrenosService from "@/services/terrenosService";
import AsignarM2 from "@/components/AsignarM2";
import CrearPlazo from "@/components/CrearPlazo";
import CroquisUploader from "@/components/CroquisUploader";

export default function NuevoTerreno() {
  const [loading, setLoading] = useState(false);
  const [lotes, setAsignarLotes] = useState(false);
  const [asignar, setAsignar] = useState(false);
  const [plazos, setPlazos] = useState(false);

  const [terreno_info, setTerrenoInfo] = useState(null);

  const [precio_compra, setPrecioCompra] = useState(0.0);
  const [superficie_total_proyecto, setSuperficieTotalProyecto] = useState(0.0);

  const [pdf, setPdf] = useState("");
  const [imagenRecortada, setImagenRecortada] = useState("");
  const [resetCroquis, setResetCroquis] = useState(() => () => {});

  const formRef = useRef(null);
  const asignarM2Ref = useRef(null);
  const crearPlazoRef = useRef(null);

  const empresas = [
    {
      id: 1,
      nombre: "Sucursal 1",
    },
  ];

  const onGuardarTerreno = (values) => {
    Swal.fire({
      title: "Verifique que los datos sean correctos",
      icon: "info",
      html: `Nombre del terreno: ${values.nombreTerreno}<br/><br/>Cantidad de Lotes: ${values.cantidadLotes}`,
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        terrenosService.createTerreno(
          { ...values, pdf: pdf, recorte: imagenRecortada },
          onTerrenoGuardado,
          onerror
        );
      }
    });
  };

  const handleCancel = async () => {
    Swal.fire({
      title: "¿Desea cancelar el proceso?",
      icon: "question",
      text: "Se eliminarán los datos ingresados",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (formRef.current) {
          formRef.current.resetFields();
        }
        resetCroquis();
        setPdf("");
        setImagenRecortada("");
        setPrecioCompra(0.0);
        setSuperficieTotalProyecto(0.0);
      }
    });
  };

  const validacionMensajes = {
    required: "${label} es requerido",
    types: {
      number: "${label} no es un número válido!",
    },
    number: {
      min: "${label} no puede ser menor a ${min}",
    },
  };

  const onTerrenoGuardado = (data) => {
    setLoading(false);
    if (data.success) {
      setAsignarLotes(true);
      setTerrenoInfo(data.terreno);
      Swal.fire({
        title: "Guardado con Éxito",
        icon: "success",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: data.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleFileSelected = (pdf) => {
    setPdf(pdf);
  };

  const handleCroquisReset = useCallback((resetFunc) => {
    setResetCroquis(() => resetFunc);
  }, []);

  const handleClearAsignar = () => {
    setAsignar(false);
    if (asignarM2Ref.current && asignarM2Ref.current.resetFields) {
      asignarM2Ref.current.resetFields();
    }
  };

  const handleClearCrearPlazo = () => {
    setPlazos(false);
    if (crearPlazoRef.current && crearPlazoRef.current.resetFields) {
      crearPlazoRef.current.resetFields();
    }
  };

  return (
    <>
      {loading && (
        <>
          <Loader />
        </>
      )}
      <Form
        name="basic"
        onFinish={onGuardarTerreno}
        autoComplete="off"
        className="grid gap-1"
        validateMessages={validacionMensajes}
        layout="vertical"
        ref={formRef}
      >
        <Row justify={"center"}>
          <Col className="titulo_pantallas">
            <span className="titulo_pantallas-text">NUEVO TERRENO</span>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ margin: "16px" }}>
          <Col xs={24} sm={12} lg={12} className="formulario_col">
            <div className="formulario">
              <p>Nombre Del Propietario</p>

              <InputIn
                className="input_formulario"
                placeholder="Nombre Del Propietario"
                name="nombrePropietario"
                rules={[
                  {
                    required: true,
                    message: "Nombre del Propietario es requerido",
                  },
                ]}
              />
              <p>Empresa</p>

              <Form.Item
                name={"empresaId"}
                style={{ width: "100%" }}
                rules={[{ required: true, message: "Empresa no seleccionada" }]}
              >
                <Select
                  showSearch
                  placeholder="Seleccione una Empresa"
                  optionLabelProp="label"
                >
                  {empresas?.map((item) => (
                    <Option
                      key={item.nombre}
                      value={item.id}
                      label={item.nombre}
                    >
                      {item?.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <p>Nombre del Terreno</p>

              <InputIn
                className="input_formulario"
                placeholder="Ingrese el Nombre del Terreno"
                name="nombreTerreno"
                rules={[
                  {
                    required: true,
                    message: "Nombre del Terreno es requerido",
                  },
                ]}
              />
              <p>Domicilio del Terreno</p>
              <InputIn
                className="input_formulario"
                placeholder="Ingrese el Domicilio del Terreno"
                name="domicilioTerreno"
                rules={[
                  {
                    required: true,
                    message: "Domicilio del Terreno es requerido",
                  },
                ]}
              />
              <p>Croquis</p>
              <CroquisUploader
                onFileSelected={handleFileSelected}
                onReset={handleCroquisReset}
              />
              <p>Colonia/Localidad</p>
              <InputIn
                className="input_formulario"
                placeholder="Colonia/Localidad"
                name="colonia"
                rules={[
                  {
                    required: false,
                    message: "",
                  },
                ]}
              />
              <p>Ciudad</p>
              <InputIn
                className="input_formulario"
                placeholder="Ciudad"
                name="ciudad"
                rules={[
                  {
                    required: false,
                    message: "",
                  },
                ]}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <div className="formulario">
              <p> Cantidad De Lotes</p>
              <Form.Item
                name={"cantidadLotes"}
                style={{ width: "100%" }}
                rules={[
                  {
                    type: "number",
                    min: 1,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  className="input_formulario"
                  placeholder="Ingrese la Cantidad de Lotes"
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
              <p>Precio De Compra</p>

              <Form.Item
                name={"precioCompra"}
                style={{ width: "100%" }}
                rules={[
                  {
                    type: "number",
                    min: 1,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  className="input_formulario"
                  placeholder="Ingrese El Precio De Compra"
                  onChange={(data) => setPrecioCompra(data)}
                  suffix={"M2"}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
              <p>Superficie Total</p>

              <Form.Item
                name={"superficieTotal"}
                style={{ width: "100%" }}
                rules={[
                  {
                    type: "number",
                    min: 1,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  className="input_formulario"
                  placeholder="Ingrese la Superficie del Total en M2"
                  onChange={(data) => setSuperficieTotalProyecto(data)}
                  suffix={"M2"}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
              <p>Precio Por M2</p>

              <Form.Item
                name={"precio_m2"}
                style={{ width: "100%" }}
                rules={[
                  {
                    type: "number",
                    min: 1,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  className="input_formulario"
                  placeholder={"Ingrese Precio del M2"}
                  value={precio_compra / superficie_total_proyecto}
                  suffix={"M2"}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
              <p>Precio Proyectado De Area Vendible (Contado)</p>

              <Form.Item
                name={"precioProyectadoContado"}
                label={""}
                style={{ width: "100%" }}
                rules={[
                  {
                    type: "number",
                    min: 1,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  className="input_formulario"
                  placeholder="Ingrese el Precio Proyectado"
                  suffix={"M2"}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
              <p>Área de Reserva</p>
              <Form.Item
                name={"areaReserva"}
                label={""}
                style={{ width: "100%" }}
                rules={[
                  {
                    type: "number",
                    min: 1,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  className="input_formulario"
                  placeholder="Ingrese el Área de Reserva en M2"
                  suffix={"M2"}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
              <p>Área Vendible</p>

              <Form.Item
                name={"areaVendible"}
                label={""}
                style={{ width: "100%" }}
                rules={[
                  {
                    type: "number",
                    min: 1,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  className="input_formulario"
                  placeholder="Ingrese el Área Vendible en M2"
                  suffix={"M2"}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
              <p>Área de Vialidad</p>

              <Form.Item
                name={"areaVialidad"}
                label={""}
                style={{ width: "100%" }}
                rules={[
                  {
                    type: "number",
                    min: 1,
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  className="input_formulario"
                  placeholder="Ingrese el Área de Vialidad en M2"
                  suffix={"M2"}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row
          style={{
            margin: "0px 24px 16px 24px",
            justifyContent: "space-between",
          }}
        >
          <Col className="flex gap-2">
            <Button
              size={"large"}
              className="boton"
              disabled={lotes == false}
              onClick={() => setPlazos(true)}
            >
              Crear Plazos
            </Button>

            <Button
              size={"large"}
              className="boton"
              disabled={lotes == false}
              onClick={() => setAsignar(true)}
            >
              Asignar M2
            </Button>
          </Col>

          <Col className="flex gap-2">
            <Button size={"large"} className="boton">
              Guardar
            </Button>

            <Button onClick={handleCancel} danger size={"large"}>
              Cancelar
            </Button>
          </Col>
        </Row>
      </Form>

      <Modal
        open={asignar}
        onCancel={handleClearAsignar}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <AsignarM2 terrenoId={terreno_info?.id} ref={asignarM2Ref} />
      </Modal>
      <Modal
        open={plazos}
        onCancel={handleClearCrearPlazo}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <CrearPlazo terrenoId={terreno_info?.id} ref={crearPlazoRef} />
      </Modal>
    </>
  );
}
