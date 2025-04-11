"use client";

import {
  Button,
  Form,
  InputNumber,
  Select,
  Row,
  Col,
  Upload,
  Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import InputIn from "./Input";
import { useContext, useState } from "react";
import { LoadingContext } from "@/contexts/loading";
import terrenosService from "@/services/terrenosService";
import { formatPrecio } from "@/helpers/formatters";
import { Paper } from "@mui/material";
import AsignarM2 from "@/app/lotes/asignar/page";
import PlazosCrear from "@/app/plazos/crear/page";
// import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";

export default function TerrenoForm({ setTerrenoNuevo }) {
  const { setIsLoading } = useContext(LoadingContext);
  const { Option } = Select;
  const [precio_compra, setPrecioCompra] = useState(0.0);
  const [superficie_total_proyecto, setSuperficieTotalProyecto] = useState(0.0);
  const [lotes, setAsignarLotes] = useState(false);
  const [terreno_info, setTerrenoInfo] = useState(null);
  const [imagen, setImagen] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [show, setShow] = useState(false);
  const [crop, setCrop] = useState();
  const [error, setError] = useState("");

  const ASPECT_RATIO = 1;
  const MIN_DIMENSION = 150;

  const empresas = [
    {
      id: 1,
      nombre: "Sucursal 1",
    },
  ];

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

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
        setIsLoading(true);
        terrenosService.createTerreno(
          { ...values, imagenBase64: imagen, recorteBase64: imagenRecorte },
          onTerrenoGuardado,
          onError
        );
      }
    });
  };

  const handleCancel = async () => {
    Swal.fire({
      title: "¿Desea cancelar el proceso?",
      icon: "info",
      text: "Se eliminarán los datos ingresados",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setTerrenoNuevo(false);
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
    setIsLoading(false);
    if (data.success) {
      // setWatch(!watch);
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
      // setTerrenoNuevo(false);
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

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reinicia estados relacionados con la advertencia
    setError("");
    setImagen("");
    setFileName("");
    setImagenUrl("");

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;

        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          const errorMessage = "Imagen demasiado pequeña";
          setError(errorMessage);

          Swal.fire({
            title: "Advertencia",
            icon: "warning",
            text: errorMessage,
            confirmButtonColor: "#4096ff",
            showDenyButton: false,
            confirmButtonText: "Aceptar",
          });
          return; // Termina la ejecución aquí si la imagen es demasiado pequeña
        }

        // Si la imagen es válida, establece los estados correspondientes
        setFileName(file.name);
        setImagen(imageUrl);
        setImagenUrl(imageUrl);

        Swal.fire({
          title: "¿Recortar Cuadro de Construcción?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#4096ff",
          cancelButtonColor: "#ff4d4f",
          confirmButtonText: "Recortar",
          cancelButtonText: "Omitir",
        }).then((result) => {
          if (result.isConfirmed) {
            setShow(true); // Alterna el estado de show
          }
        });
      });
    });
    reader.readAsDataURL(file);
  };
  // else if (info.file.status === "error") {
  //   Swal.fire({
  //     title: "Error al intentar cargar la imagen",
  //     icon: "error",
  //     confirmButtonColor: "#4096ff",
  //   });
  // }

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: MIN_DIMENSION,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  return (
    <div>
      {lotes && (
        <>
          <PlazosCrear terrenoId={terreno_info.id} />
          <AsignarM2 terrenoId={terreno_info.id} />
        </>
      )}
      {!lotes && (
        <>
          <Form
            name="basic"
            onFinish={onGuardarTerreno}
            autoComplete="off"
            className="grid gap-1"
            validateMessages={validacionMensajes}
            layout="vertical"
          >
            <Row justify={"center"}>
              <Col className="titulo_pantallas">
                <b>DATOS DEL TERRENO</b>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "15px" }}>
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
                    rules={[
                      { required: true, message: "Empresa no seleccionada" },
                    ]}
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
                  {/* <div style={{ marginBottom: "16px" }}>
                    <label
                      htmlFor="fileInput"
                      style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        backgroundColor: "#FFFFFF",
                        color: "rgb(66, 142, 204)",
                        borderRadius: "10px",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      Subir archivo
                    </label>
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*, application/pdf"
                      onChange={onSelectFile}
                      style={{
                        display: "none",
                      }}
                    />
                    {fileName && (
                      <p style={{ color: "#FFFFFF" }}>
                        Imagen Cargada: {fileName}
                      </p>
                    )}
                  </div> */}
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

            <span className="flex gap-2 justify-end">
              <Button htmlType="submit" size={"large"} className="boton">
                Guardar
              </Button>

              <Button onClick={handleCancel} danger size={"large"}>
                Cancelar
              </Button>
            </span>
          </Form>

          <Modal
            title="Recortar Cuadro de Construcción"
            visible={show}
            onCancel={() => {
              setShow(false);
            }}
          >
            {imagenUrl && (
              <div>
                <ReactCrop
                  crop={crop}
                  keepSelection
                  aspect={ASPECT_RATIO}
                  minWidth={MIN_DIMENSION}
                  onChange={(newCrop) => {
                    setCrop(newCrop);
                  }}
                >
                  <img src={imagenUrl} alt="mapa" onLoad={onImageLoad} />
                </ReactCrop>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
}
