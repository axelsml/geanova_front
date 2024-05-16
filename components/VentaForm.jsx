"use client";

import {
  Button,
  Form,
  InputNumber,
  DatePicker,
  Select,
  Radio,
  Row,
  Upload,
  Input,
  Col
} from "antd";
import Swal from "sweetalert2";
import InputIn from "./Input";
import Loader from "./Loader";
import { useState, useEffect, useContext } from "react";
import {
  formatPrecio,
  calcularSemanas,
  formatDate,
} from "@/helpers/formatters";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableFooter,
} from "@mui/material";
import terrenosService from "@/services/terrenosService";
import plazosService from "@/services/plazosService";
import lotesService from "@/services/lotesService";
import ventasService from "@/services/ventasService";
import { usuario_id } from "@/helpers/user";
import { LoadingContext } from "@/contexts/loading";
import { UploadOutlined } from '@ant-design/icons';
import pagosService from "@/services/pagosService";
import BuscarCliente from "./BuscarCliente";

export default function VentaForm({ setNuevaVenta, setWatch, watch }) {
  const { setIsLoading } = useContext(LoadingContext)
  const [terrenoSelected, setTerrenoSelected] = useState(null);
  const [terrenos, setTerrenos] = useState(null);
  const [plazos, setPlazos] = useState(null);
  const { Option } = Select;
  const [lotes, setLotes] = useState(null);
  const [loteSelected, setLoteSelected] = useState(null);
  const [plazoSelected, setPlazoSelected] = useState(null);
  const [buttonSelected, setButtonSelected] = useState(1);
  const [dataForm, setDataForm] = useState(null) 
  const [form] = Form.useForm();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [imagen, setImagen] = useState(null);
  const [opcion_usuario, setOpcionUsuario] = useState(0);
  const [sistemas_pago, setSistemasPago] = useState(null);
  const [sistemaSelected, setSistemaSelected] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [clienteExistentes, setClientesExistentes] = useState(null);
  const [cliente_existente, setClienteExistentes] = useState(null);

  
  const [solicitud, setSolicitud] = useState({
    terreno_id: "",
    plazo_id: "",
    monto_contrato: "",
    anticipo: "",
    lote_id:"",
    plazo_pagos: 0,
    fecha_solicitud: "",
    sistemas_pago_id: null
  });
   const [usuario, setUsuario] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    celular_cliente: null, 
    celular_cliente_2: null,
    usuario_registro: usuario_id,
    calle: "",
    colonia: "",
    numero_ext: null,
    numero_int: null,
    cp: null,
    imagen:null,
  });

  useEffect(() => {
    terrenosService.getTerrenos(setTerrenos, Error);
    pagosService.getSistemasPago(setSistemasPago, onError);

  }, []);

  const [pdf, setPdf] = useState(null);

  const props = {
    name: 'file',
    // action: 'https://www.yourserver.com/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        const reader = new FileReader();
        reader.onload = function(event) {
          const base64String = event.target.result;
          setPdf(base64String);
        };
        reader.readAsDataURL(info.file.originFileObj);
      } 
    },
  };


  const [imagenBase64, setImagenBase64] = useState(null);
  const [imagenBase64R, setImagenBase64R] = useState(null);

  const onChange = (info) => {
    if (info.file.status === 'done') {
      const fileReader = new FileReader();
      const fecha_update = new Date(info.file.lastModifiedDate).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      // const imageUrl = URL.createObjectURL(info.file.originFileObj);
      fileReader.onload = (event) => {
        // Obtener el contenido base64
        const base64Url = event.target.result;
        
        // Guardar el contenido base64 en el estado

        setImagenBase64(base64Url);
      };
      
      // Leer el contenido del archivo como base64
      fileReader.readAsDataURL(info.file.originFileObj);

      var imagen_aux = {
        nombre:info.file.name,
        type:info.file.originFileObj.type,
        size:info.file.originFileObj.size,
        updated:fecha_update,
        originFileObj:info.file.originFileObj
      }
      console.log(imagen_aux)
      
      setUsuario({
        ...usuario,
        imagen: imagen_aux,
      });
    }
  };
  const onChange2 = (info) => {
    if (info.file.status === 'done') {
      const fileReader = new FileReader();
      const fecha_update = new Date(info.file.lastModifiedDate).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      // const imageUrl = URL.createObjectURL(info.file.originFileObj);
      fileReader.onload = (event) => {
        // Obtener el contenido base64
        const base64Url = event.target.result;
        
        // Guardar el contenido base64 en el estado

        setImagenBase64R(base64Url);
      };
      
      // Leer el contenido del archivo como base64
      fileReader.readAsDataURL(info.file.originFileObj);

      var imagen_aux = {
        nombre:info.file.name,
        type:info.file.originFileObj.type,
        size:info.file.originFileObj.size,
        updated:fecha_update,
        originFileObj:info.file.originFileObj
      }
      console.log(imagen_aux)
      
      setUsuario({
        ...usuario,
        imagen: imagen_aux,
      });
    }
  };
 
  const uploadProps = {
    onChange: onChange, // Función que maneja el cambio
    multiple: false, // Permitir solo la subida de una imagen
  };
  const uploadProps2 = {
    onChange: onChange2, // Función que maneja el cambio
    multiple: false, // Permitir solo la subida de una imagen
  };

  function onBuscarLotes(plazo_id) {
    console.log(terrenoSelected)
    console.log(plazoSelected)
    console.log(plazo_id)
    
    lotesService.getLoteByTerrenoIdPlazo(
      terrenoSelected.id,
      plazo_id,
      (data) => {
        setLotes(data.lotes);
      },
      onError
    );
    // onBuscarPlazos(value);
  };

  const onBuscarPlazos = (value) => {
    setTerrenoSelected(terrenos.find((terreno) => terreno.id == value));
    setSolicitud({
      ...solicitud,
      terreno_id: value,
    });
    plazosService.getPlazos({ terreno_id: value }, setPlazos, onError);
  };

  const calcularMontoContratoPlazo = (lote) => {
      form.setFieldValue("montoContrato", lote.costo);
      form.setFieldValue("semanas", calcularSemanas(plazoSelected.cantidad_meses));
      setSolicitud({
        ...solicitud,
        plazo_pagos: calcularSemanas(plazoSelected.cantidad_meses), monto_contrato: lote.costo,lote_id: lote.id,
      });
      
      if(plazoSelected.cantidad_meses == 0){
        form.setFieldValue("anticipo", lote.costo);
      }
      return lote.costo;
  };

  const calcularMontoContratoLote = (lote) => {
    if (plazoSelected) {
      let monto_contrato = plazoSelected.precio * lote.superficie;
      form.setFieldValue("montoContrato", monto_contrato);
      form.setFieldValue(
        "semanas",
        calcularSemanas(plazoSelected.cantidad_meses)
      );

      return monto_contrato;
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

function guardarImagenes(cliente_id){
  console.log("entro en guardarimagenes 3")
  
  const params = {
    cliente_id: cliente_id,
    img_doc: imagenBase64,
    img_docR: imagenBase64R,
    pdf:pdf
  };
  
  setIsLoading(true);
  ventasService.createImagenesUsuario(
    params,
    onImagenGuardada,
    onError
  );

}

function guardarCliente(){
  // values["fechaInicioContrato"] = formatDate(values.fechaInicioContrato);
  console.log(usuario)
  console.log("entro en guardar cliente 1")
  console.log(pdf);
  debugger
  
  Swal.fire({
    title: "Verifique que los datos sean correctos",
    icon: "info",
    confirmButtonColor: "#4096ff",
    cancelButtonColor: "#ff4d4f",
    showDenyButton: true,
    showCancelButton: false,
    allowOutsideClick: false,
    confirmButtonText: "Aceptar",
    denyButtonText: `Cancelar`,
  }).then((result) => {
    if (result.isConfirmed) {
      setIsLoading(true);
      ventasService.createVenta(
        { ...dataForm, usuarioId: usuario_id, ...usuario },
        onVentaGuardada,
        onError
      );
    }
  });
};
async function guardarSolicitud(cliente_id){
  console.log("entro en guardar solicitud 5")
  
    setIsLoading(true);
    ventasService.createSolicitud(
      {
        solicitud:solicitud,
        cliente_id: cliente_id
      },
      onSolicitudGuardada,
      onError
    );
};
  // const onGuardarVenta = async (values) => {
  //   values["fechaInicioContrato"] = formatDate(values.fechaInicioContrato);
  //   console.log(values)
  //   console.log(usuario)

  //   
  //   Swal.fire({
  //     title: "Verifique que los datos sean correctos",
  //     icon: "info",
  //     confirmButtonColor: "#4096ff",
  //     cancelButtonColor: "#ff4d4f",
  //     showDenyButton: true,
  //     showCancelButton: false,
  //     allowOutsideClick: false,
  //     confirmButtonText: "Aceptar",
  //     denyButtonText: `Cancelar`,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       setIsLoading(true);
  //       ventasService.createVenta(
  //         { ...dataForm, usuarioId: usuario_id, ...values },
  //         onVentaGuardada,
  //         onError
  //       );
  //     }
  //   });
  // };

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
        setNuevaVenta(false);
      }
    });
  };

  const validacionMensajes = {
    required: "${label} es requerido",
    types: {
      number: "${label} no es un número válido",
    },
    number: {
      min: "${label} no puede ser menor a ${min}",
    },
  };

  const loteSeleccionado = (valor) =>{
    setLoteSelected(valor);
      setUsuario({
        ...usuario,
        montoContrato: valor.costo,
      });
      
  }
  const onVentaGuardada = (data) => {
  console.log("entro en ventaGuardada 2")

    setIsLoading(false);
    if (data.success) {
      setCliente(data.cliente)
      guardarImagenes(data.cliente.id)
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
  const onSolicitudGuardada = (data) => {
  console.log("entro en solicitudguardada 6")

    setIsLoading(false);
    
    if (data.success) {
      setWatch(!watch);
      Swal.fire({
        title: "Guardado con Éxito",
        icon: "success",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: false,
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
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

  const onImagenGuardada = (data) => {
  console.log("entro en onimagenguardada 4")
debugger
    setIsLoading(false);
    if (data.success) {
      guardarSolicitud(data.cliente_id)
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

  const handleClick = async (value) => {
    try {
      const values = await form.validateFields();
      setDataForm({...dataForm, ...values})
      setButtonSelected(value);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  function BotonesSiguiente({ option }) {
    return (
      <span className="flex gap-2 justify-end">
        <Button
          onClick={() => {
            handleClick(option);
          }}
          size="large"
          className="boton"
        >
          Siguiente
        </Button>

        {/* <Button onClick={handleCancel} danger size="large">
          Cancelar
        </Button> */}
      </span>
    );
  }

  function BuscarClientesExistentes(){
    setIsLoading(true);
    ventasService.clientesExistentes(
      onClientesExistentesCargados,
      onError
    );
  }

  async function onClientesExistentesCargados(data){
    setIsLoading(false);
    setClientesExistentes(data.usuarios)
  }

  return (
    <div className="w-1/2 max-w-md mx-auto p-6 m-7 bg-white">
      <Row justify={"center"}>
        <Col xs={24} sm={24} md={16} lg={16} xl={8} xxl={8} className="titulo_pantallas">
          <b>Nueva Venta</b>
        </Col>
      </Row>
      <Form
        form={form}
        name="basic"
        autoComplete="off"
        className="grid gap-1"
        validateMessages={validacionMensajes}
        layout="vertical"
        initialValues={usuario}
      >
        <Row justify={"center"} gutter={[24]} style={{marginTop:"30px"}}>
        <div className="formulario">
         <Form.Item
              label={"Proyecto"}
              name={"terreno"}
              style={{ width: "100%" }}
              rules={[{ required: true, message: "Proyecto no seleccionado" }]}
              initialValue={terrenoSelected?.nombre}
            >
              <Select
                showSearch
                placeholder="Seleccione un Proyecto"
                optionLabelProp="label"
                onChange={onBuscarPlazos}
                
              >
                {terrenos?.map((item) => (
                  <Option key={item.nombre} value={item.id} label={item.nombre}>
                    {item?.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>

           

            <Form.Item
              label={"Plazo"}
              name="plazo_id"
              style={{ width: "100%" }}
              rules={[{ required: true, message: "Plazo no seleccionado" }]}
            >
              <Select
                showSearch

                placeholder="Seleccione un Plazo"
                optionLabelProp="label"
                onChange={(value) => {
                  const plazoSelected = plazos.find(
                    (plazo) => plazo.id == value
                  );
                  setPlazoSelected(plazoSelected);
                  setSolicitud({
                    ...solicitud,
                    plazo_id: value,
                  });
                  onBuscarLotes(value)
                  // setUsuario({
                  //   ...usuario,
                  //   montoContrato: calcularMontoContratoPlazo(plazoSelected),
                  // });
                }}
              >
                {plazos?.map((item) => (
                  <Option
                    key={item.descripcion}
                    value={item.id}
                    label={item.descripcion}
                  >
                    {item?.descripcion}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
          {lotes != null &&(<>
          <Row justify={"center"} className="m-auto">
                    <TableContainer component={Paper} className="tabla">
                      <Table>
                        <TableHead>
                        <TableRow className="tabla_encabezado">
                          <TableCell><p>No. Lote</p></TableCell>
                          <TableCell><p>SuPerficie</p></TableCell>
                          <TableCell><p>Precio</p></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        </TableHead>

                        <TableBody>
                          {lotes.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((lote, index) => (
                              <TableRow key={index}>
                          <TableCell>
                            {lote.numero}
                          </TableCell>
                          <TableCell>
                            {lote.superficie}
                          </TableCell>
                          <TableCell>
                            ${formatPrecio(lote.costo)}
                          </TableCell>
                          <TableCell>
                          <Button key={lote} onClick={() => {
                            Swal.fire({
                              title: "Info",
                              icon: "info",
                              text: "Lote Seleccionado "+lote.numero,
                              confirmButtonColor: "#4096ff",
                              cancelButtonColor: "#ff4d4f",
                              showDenyButton: false,
                              confirmButtonText: "Aceptar",
                            });
                          
                             setLoteSelected(lote);
                                                      
                             setUsuario({
                               ...usuario,
                               montoContrato: calcularMontoContratoPlazo(lote),
                             });
                      }}  size="large">
                              Seleccionar
                            </Button>
                          </TableCell>

                        </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 25]}
                              count={lotes.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                              labelRowsPerPage="Amortizaciones por Página"
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  </Row>
      </>)}            

           

            <Form.Item
              name={"montoContrato"}
              label={"Monto de Contrato"}
              style={{ width: "100%" }}
            >
              <InputNumber
                onChange={(value) => { setSolicitud({
                  ...solicitud,
                  monto_contrato: value,
                });}}
                style={{
                  width: "100%",
                }}
                formatter={formatPrecio}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                prefix="$"
                suffix="MXN"
              />
            </Form.Item>

            <Form.Item
              name={"anticipo"}
              label={"Anticipo"}
              style={{ width: "100%" }}
            >
              <InputNumber
                style={{
                  width: "100%",
                }}
                formatter={formatPrecio}
                onChange={(value) => { setSolicitud({
                  ...solicitud,
                  anticipo: value,
                });}}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                prefix="$"
                suffix="MXN"
              />
            </Form.Item>

            <Form.Item
              name={"semanas"}
              label={"Plazo Semanal"}
              style={{ width: "100%" }}
            >
              <InputNumber
                disabled
                suffix={"Semanas"}
                style={{
                  width: "100%",
                  backgroundColor:"whitesmoke",
                  color:"black"
                }}
              />
            </Form.Item>
            <Form.Item
                label={"Sistema de Pago"}
                name={"sistema_pago_id"}
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: "Sistema de Pago no seleccionado",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Seleccione un Sistema de Pago"
                  optionLabelProp="label"
                  onChange={(value) => {
                    setSistemaSelected(value);
                    setSolicitud({
                      ...solicitud,
                      sistemas_pago_id: value,
                    });
                  }}
                >
                  {sistemas_pago?.map((item, index) => (
                    <Option key={index} value={item.id} label={item.Nombre}>
                      {item?.Nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

            <Form.Item
              name="fechaInicioContrato"
              label="Fecha de Inicio de Contrato"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: "Fecha de Inicio de Contrato es requerida",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                onChange={(value)=>{ setSolicitud({
                  ...solicitud,
                  fecha_solicitud: formatDate(value),
                });}}
                placeholder="Ingrese la Fecha de Inicio de Contrato"
              />
            </Form.Item>
        

            </div>
          </Row>
        <div>
          <Row justify={"center"} className="gap-10" style={{marginBottom:"20px",marginTop:"20px"}}>
            <Col xs={24} sm={24} md={16} lg={16} xl={4} xxl={6}>
              <Button
                disabled={solicitud.monto_contrato == ""}
                onClick={() => {
                  setOpcionUsuario(1);
                  console.log("soli: "+solicitud);
                  
                }}
                size="large"
                className="boton"
              >
                Nuevo Cliente
              </Button>
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={8} xxl={6}>
              <Button
              disabled={solicitud.monto_contrato == ""}
                onClick={() => {
                  setOpcionUsuario(2);
                  BuscarClientesExistentes();
                }}
                className="boton"

                size="large"
              >
                Cliente Existente
              </Button>
            </Col>

            <Col>
            </Col>
          </Row>
        </div>
        {opcion_usuario == 2 &&(<>
        <div>
          
          <Row>
          {/* clienteExistentes */}
          {clienteExistentes != null &&(<>
          <Row justify={"center"} className="m-auto">
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                        <TableRow>
                          <TableCell>Nombre Cliente</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        </TableHead>

                        <TableBody>
                          {clienteExistentes.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((cliente, index) => (
                              <TableRow key={index}>
                          <TableCell>
                            {cliente.nombre_completo}
                          </TableCell>
                          <TableCell>
                          <Button key={cliente} onClick={() => {
                              guardarSolicitud(cliente.id)
                            }}
                            size="large"
                          >
                            Guardar
                          </Button>
                          
                          </TableCell>
                          

                        </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 25]}
                              count={clienteExistentes.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                              labelRowsPerPage="Amortizaciones por Página"
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  </Row>
      </>)}    
          </Row>
        </div>
        </>)}        
       {opcion_usuario == 1 &&(<>
        <Row justify={"center"}>
          <Radio.Group
            onChange={(e) => {
              handleClick(e.target.value);
            }}
            value={buttonSelected}
          >
            {/* <Radio.Button value={1}>Lote</Radio.Button> */}
            <Radio.Button className="renglon_color" value={1}>Cliente</Radio.Button>
            <Radio.Button className="renglon_color" value={2}>Domicilio</Radio.Button>
            <Radio.Button className="renglon_color" value={3}>Contacto</Radio.Button>
            <Radio.Button className="renglon_color" value={4}>INE</Radio.Button>
          </Radio.Group>
        </Row>
        
         <br></br>   
        {buttonSelected === 1 && (
          <>
            
            <div className="formulario">
            <InputIn
              placeholder="Ingrese el Primer Nombre del Cliente"
              name="primer_nombre"
              label="Primer Nombre del Cliente"
              onChange={ (e) =>setUsuario({
                ...usuario,
                primer_nombre: e.target.value,
              })}
              rules={[
                {
                  required: true,
                  message: "Primer Nombre del Cliente es requerido",
                },
              ]}
            />

            <InputIn
              placeholder="Ingrese el Segundo Nombre del Cliente"
              name="segundo_nombre"
              label="Segundo Nombre del Cliente"
              onChange={ (e) =>setUsuario({
                ...usuario,
                segundo_nombre: e.target.value,
              })}
            />

            <InputIn
              placeholder="Ingrese el Primer Apellido del Cliente"
              name="primer_apellido"
              label="Primer Apellido del Cliente"
              onChange={ (e) =>setUsuario({
                ...usuario,
                primer_apellido: e.target.value,
              })}
              rules={[
                {
                  required: true,
                  message: "Primer Apellido del Cliente es requerido",
                },
              ]}
            />

            <InputIn
              placeholder="Ingrese el Segundo Apellido del Cliente"
              name="segundo_apellido"
              label="Segundo Apellido del Cliente"
              onChange={ (e) =>setUsuario({
                ...usuario,
                segundo_apellido: e.target.value,
              })}
            />
            <span className="flex gap-2 justify-end">
              <Button onClick={()=>setOpcionUsuario(0)} danger size="large">
                Cancelar
              </Button>
            <BotonesSiguiente option={2} />
            </span>
            </div>
          </>
        )}

        {buttonSelected === 2 && (
          <>
           <div className="formulario">
            <InputIn
              placeholder="Ingrese la Calle del Cliente"
              name="calle"
              label="Calle del Cliente"
              onChange={ (e) =>setUsuario({
                ...usuario,
                calle: e.target.value,
              })}
              rules={[
                {
                  required: false,
                  message: "Calle del Cliente es requerida",
                },
              ]}
            />

            <InputIn
              placeholder="Ingrese la Colonia del Cliente"
              name="colonia"
              label="Colonia del Cliente"
              onChange={ (e) =>setUsuario({
                ...usuario,
                colonia: e.target.value,
              })}
              rules={[
                {
                  required: false,
                  message: "Colonia del Cliente es requerida",
                },
              ]}
            />

            <Form.Item
              name="numero_ext"
              label="Número Exterior del Cliente"
              onChange={ (e) =>setUsuario({
                ...usuario,
                numero_ext: e.target.value,
              })}
              style={{ width: "100%" }}
              rules={[
                {
                  required: false,
                  message: "Número Exterior es requerido",
                },
              ]}
            >
              <InputNumber
                placeholder="Ingrese el Número Exterior del Cliente"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.Item
              name="numero_int"
              label="Número Interior del Cliente"
              onChange={ (e) =>setUsuario({
                ...usuario,
                numero_int: e.target.value,
              })}
              style={{ width: "100%" }}
              rules={[
                { type: "number", min: 1 },
              ]}
            >
              <InputNumber
                placeholder="Ingrese el Número Interior del Cliente"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.Item
              name="cp"
              label="Código Postal del Cliente"
              onChange={ (e) =>setUsuario({
                ...usuario,
                cp: e.target.value,
              })}
              style={{ width: "100%" }}
              rules={[
                {
                  required: false,
                  message: "Código Postal del Cliente es requerida",
                },
                { type: "number", min: 1 },
              ]}
            >
              <InputNumber
                placeholder="Ingrese el Código Postal del Cliente"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
            <span className="flex gap-2 justify-end">
              <Button onClick={()=>setOpcionUsuario(0)} danger size="large">
                Cancelar
              </Button>
            <BotonesSiguiente option={3} />
            </span> 
            </div>       
          </>
        )}

        {buttonSelected === 3 && (
          <>
          <div className="formulario">
            <InputIn
              name="celular_cliente"
              label="Celular de Contacto"
              onChange={ (e) =>setUsuario({
                ...usuario,
                celular_cliente: e.target.value,
              })}
              placeholder="Ingrese el Número de Celular de Contacto"
              rules={[
                {
                  required: true,
                  message: "Número de Celular del Cliente es requerido",
                },
                {
                  pattern: new RegExp(/^(\+52)?\d{10}$/),
                  message: "Número de Celular no es Válido",
                },
              ]}
            />

            <InputIn
              name="celular_cliente_2"
              label="Celular de Contacto Secundario"
              onChange={ (e) =>setUsuario({
                ...usuario,
                celular_cliente_2: e.target.value,
              })}
              placeholder="Ingrese el Número de Celular Secundario de Contacto"
              rules={[
                {
                  pattern: new RegExp(/^(\+52)?\d{10}$/),
                  message: "Número de Celular Secundario no es Válido",
                },
              ]}
            />
            <span className="flex gap-2 justify-end">
              <Button onClick={()=>setOpcionUsuario(0)} danger size="large">
                Cancelar
              </Button>
            <BotonesSiguiente option={4} />
            </span>
            </div>
          </>
        )}
        
{buttonSelected === 4 && (
          <>
                 <div className="formulario">
                 {/* <Row justify={"center"} className="gap-10" style={{marginBottom:"20px",marginTop:"20px"}}> */}
           
                 <Form.Item >
                  <Row justify={"center"} className="gap-10" style={{marginBottom:"20px",marginTop:"20px"}}>
                      <Col xs={24} sm={24} md={16} lg={16} xl={8} xxl={8}>
                        <Upload {...uploadProps}>
                          <Button className="boton" icon={<UploadOutlined />}>INE FRENTE</Button>
                        </Upload>
                      </Col>
                      <Col xs={24} sm={24} md={16} lg={16} xl={8} xxl={8}>
                        <Upload {...uploadProps2}>
                          <Button className="boton" icon={<UploadOutlined />}>INE REVERSO</Button>
                        </Upload>
                      </Col>
                      <Col xs={24} sm={24} md={16} lg={16} xl={8} xxl={8}>
                      <Upload {...props} accept=".pdf">
                        <Button className="boton" icon={<UploadOutlined />}>ADJUNTAR PDF</Button>
                      </Upload>
                      </Col>
                      
                    </Row>
                   </Form.Item>
                  </div>  
                  {imagenBase64 && (
                    <div>
                      <h2>Imagen INE FRENTE:</h2>
                      <img src={imagenBase64} alt="Imagen subida" />
                    </div>
                  )}
                   {imagenBase64R && (
                    <div>
                      <h2>Imagen INE REVERSO:</h2>
                      <img src={imagenBase64R} alt="Imagen subida" />
                    </div>
                  )}
                  
                  <span className="flex gap-2 justify-end">
                    <Button  onClick={()=>guardarCliente()} size="large">
                      Guardar
                    </Button>

                    <Button onClick={()=> setOpcionUsuario(0)} danger size="large">
                      Cancelar
                    </Button>
                  </span>
                  
          </>
        )}

        
      
       </>)}
           

           
        
      </Form>
    </div>
  );
}
