"use client";

import { Button, Form, InputNumber, Select, Row, Col } from "antd";
import Swal from "sweetalert2";
import InputIn from "./Input";
import { useContext, useState } from "react";
import { LoadingContext } from "@/contexts/loading";
import terrenosService from "@/services/terrenosService";
import { formatPrecio } from "@/helpers/formatters";
import { Paper } from "@mui/material";
import AsignarM2 from "@/app/lotes/asignar/page";
import PlazosCrear from "@/app/plazos/crear/page";

export default function TerrenoForm({ setTerrenoNuevo, setWatch, watch }) {
  const { setIsLoading } = useContext(LoadingContext);
  const { Option } = Select;
  const [precio_compra, setPrecioCompra] = useState(0.0);
  const [superficie_total_proyecto, setSuperficieTotalProyecto] = useState(0.0);
  const [lotes, setAsignarLotes] = useState(false);
  const [terreno_info, setTerrenoInfo] = useState(null);

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
        setIsLoading(true);
        terrenosService.createTerreno(values, onTerrenoGuardado, onError);
      }
    });
  };

  const handleCancel = async () => {
    //MENSAJE EMERGENTE PARA REAFIRMAR QUE SE VA A
    //CANCELAR EL PROCESO DE GUARDADO
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

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
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
              <Col xs={24} sm={20} md={16} lg={12} xl={8} xxl={4} className="titulo_pantallas">
              <b>DATOS DEL TERRENO</b>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} style={{marginTop:"15px"}}>
              <Col xs={24} sm={12} lg={12} className="formulario_col">
                <div className="formulario">
                  <p>Nombre Del Propietario</p>

                  <InputIn
                  className = "input_formulario"
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
                   className = "input_formulario"
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
                   className = "input_formulario"
                    placeholder="Ingrese el Domicilio del Terreno"
                    name="domicilioTerreno"
                  
                    rules={[
                      {
                        required: true,
                        message: "Domicilio del Terreno es requerido",
                      },
                    ]}
                  />
                   <p>Colonia/Localidad</p>

                  <InputIn
                   className = "input_formulario"
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
                   className = "input_formulario"
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
                     className = "input_formulario"
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
                     className = "input_formulario"
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
                     className = "input_formulario"
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
                     className = "input_formulario"
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
                     className = "input_formulario"
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
                     className = "input_formulario"
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
                     className = "input_formulario"
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
                     className = "input_formulario"
                      placeholder="Ingrese el Área de Vialidad en M2"
                      suffix={"M2"}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                </div >
              </Col>
            </Row>

            <span className="flex gap-2 justify-end">
              <Button htmlType="submit"  size={"large"} className="boton">
                Guardar
              </Button>

              <Button onClick={handleCancel} danger  size={"large"}>
                Cancelar
              </Button>
            </span>
          </Form>
        </>
      )}
    </div>
  );
}
