"use client";

import {
  Button,
  Form,
  InputNumber,
  DatePicker,
  Select,
  Radio,
  Row,
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

  const [valoresIniciales, setValoresIniciales] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    calle: "",
    colonia: "",
    numero_ext: null,
    numero_int: null,
    cp: null,
    celular_cliente: null, 
    celular_cliente_2: null,
    montoContrato: 0,
    anticipo: 0,
    lote_id: null,
    plazo_id: null,
    semanas: 0,
  });

  useEffect(() => {
    terrenosService.getTerrenos(setTerrenos, Error);
  }, []);

  function onBuscarLotes(plazo_id) {
    console.log(terrenoSelected)
    console.log(plazoSelected)
    console.log(plazo_id)
    debugger
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
    plazosService.getPlazos({ terreno_id: value }, setPlazos, onError);
  };

  const calcularMontoContratoPlazo = (plazo) => {
    if (loteSelected) {
      let monto_contrato = plazo.precio * loteSelected.superficie;
      form.setFieldValue("montoContrato", monto_contrato);
      form.setFieldValue("semanas", calcularSemanas(plazo.cantidad_meses));
      return monto_contrato;
    }
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

  const onGuardarVenta = async (values) => {
    values["fechaInicioContrato"] = formatDate(values.fechaInicioContrato);

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
          { ...dataForm, usuarioId: usuario_id, ...values },
          onVentaGuardada,
          onError
        );
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

  const onVentaGuardada = (data) => {
    setIsLoading(false);
    if (data.success) {
      setWatch(!watch);
      Swal.fire({
        title: "Guardado con Éxito",
        icon: "success",
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
      setNuevaVenta(false);
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
        >
          Siguiente
        </Button>

        {/* <Button onClick={handleCancel} danger size="large">
          Cancelar
        </Button> */}
      </span>
    );
  }

  return (
    <div className="w-1/2 max-w-md mx-auto p-6 m-7 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Datos del Cliente
      </h1>
      <Form
        form={form}
        name="basic"
        onFinish={onGuardarVenta}
        autoComplete="off"
        className="grid gap-1"
        validateMessages={validacionMensajes}
        layout="vertical"
        initialValues={valoresIniciales}
      >
        <Row justify={"center"}>
          <Radio.Group
            onChange={(e) => {
              handleClick(e.target.value);
            }}
            value={buttonSelected}
          >
            <Radio.Button value={1}>Lote</Radio.Button>
            <Radio.Button value={2}>Cliente</Radio.Button>
            <Radio.Button value={3}>Domicilio</Radio.Button>
            <Radio.Button value={4}>Contacto</Radio.Button>
          </Radio.Group>
        </Row>

        {buttonSelected === 2 && (
          <>
            <InputIn
              placeholder="Ingrese el Primer Nombre del Cliente"
              name="primer_nombre"
              label="Primer Nombre del Cliente"
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
            />

            <InputIn
              placeholder="Ingrese el Primer Apellido del Cliente"
              name="primer_apellido"
              label="Primer Apellido del Cliente"
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
            />

            <BotonesSiguiente option={3} />
          </>
        )}

        {buttonSelected === 3 && (
          <>
            <InputIn
              placeholder="Ingrese la Calle del Cliente"
              name="calle"
              label="Calle del Cliente"
              rules={[
                {
                  required: true,
                  message: "Calle del Cliente es requerida",
                },
              ]}
            />

            <InputIn
              placeholder="Ingrese la Colonia del Cliente"
              name="colonia"
              label="Colonia del Cliente"
              rules={[
                {
                  required: true,
                  message: "Colonia del Cliente es requerida",
                },
              ]}
            />

            <Form.Item
              name="numero_ext"
              label="Número Exterior del Cliente"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: "Número Exterior es requerido",
                },
                { type: "number", min: 1 },
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
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
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

            <BotonesSiguiente option={4} />
          </>
        )}

        {buttonSelected === 4 && (
          <>
            <InputIn
              name="celular_cliente"
              label="Celular de Contacto"
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
              placeholder="Ingrese el Número de Celular Secundario de Contacto"
              rules={[
                {
                  pattern: new RegExp(/^(\+52)?\d{10}$/),
                  message: "Número de Celular Secundario no es Válido",
                },
              ]}
            />

            {/* <BotonesSiguiente option={4} /> */}
            <span className="flex gap-2 justify-end">
              <Button htmlType="submit" size="large">
                Guardar
              </Button>

              <Button onClick={handleCancel} danger size="large">
                Cancelar
              </Button>
            </span>
          </>
        )}

        {buttonSelected === 1 && (
          <>
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
                  onBuscarLotes(value)
                  // setValoresIniciales({
                  //   ...valoresIniciales,
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
            <Row  className="m-auto">
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>No. Lote</TableCell>
                      <TableCell>SuPerficie</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lotes?.map((lote, index) => (
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
                            <Button onClick={() => {setLoteSelected(lote);
                            setValoresIniciales({
                              ...valoresIniciales,
                              montoContrato: lote.costo,
                            });debugger
                            }} size="large">
                              Seleccionar
                            </Button>
                          </TableCell>

                        </TableRow>
                      ))}
                  </TableBody>
                  
                </Table>
              </TableContainer>
            </Row>

            

            <Form.Item
              name={"montoContrato"}
              label={"Monto de Contrato"}
              style={{ width: "100%" }}
            >
              <InputNumber
                disabled
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
                }}
              />
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
                placeholder="Ingrese la Fecha de Inicio de Contrato"
              />
            </Form.Item>
            <BotonesSiguiente option={2} />

           
          </>
        )}
      </Form>
    </div>
  );
}
