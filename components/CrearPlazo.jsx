"use client";

import { formatPrecio } from "@/helpers/formatters";
import PlazoForm from "@/components/PlazoForm";
import plazosService from "@/services/plazosService";
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Row,
  Typography,
  Form,
  InputNumber,
  Tabs,
} from "antd";
import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import Loader from "./Loader";
import { useForm } from "antd/es/form/Form";
import Swal from "sweetalert2";

const CrearPlazo = forwardRef(({ terrenoId }, ref) => {
  const [plazos, setPlazos] = useState(null);
  const [loading, setLoading] = useState(false);
  const plazosFormRef = useRef(null);

  const resetPlazosForm = () => {
    plazosFormRef.current?.resetForm();
  };

  useEffect(() => {
    setLoading(true);
    plazosService
      .getPlazos({ terreno_id: terrenoId }, setPlazos, onError)
      .finally(() => setLoading(false));
  }, [terrenoId]);

  const onError = (e) => {
    setLoading(false);
    console.error("Error al obtener los plazos:", e);
    Swal.fire({
      title: "Error al cargar los plazos",
      icon: "error",
      text: "Hubo un problema al cargar la lista de plazos",
      confirmButtonColor: "#4096ff",
    });
  };

  const Plazo = ({ plazo }) => {
    const [editar, setEditar] = useState(false);
    const [form] = useForm();

    useEffect(() => {
      form.setFieldValue("precio", plazo.precio);
    }, [form, editar, plazo.precio]);

    const guardarPrecioEditado = (values) => {
      let params = {
        plazo_id: plazo.id,
        ...values,
      };

      Swal.fire({
        title: "Verifique que los datos sean correctos",
        icon: "info",
        html: `Precio por m<sup>2</sup>: $${formatPrecio(values.precio)}`,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          plazosService.editarPlazo(params, onPrecioEditado, onError);
        }
      });
    };

    const onPrecioEditado = (data) => {
      setLoading(false);
      setEditar(false);
      if (data.success) {
        Swal.fire({
          title: "Guardado con Éxito",
          icon: "success",
          confirmButtonColor: "#4096ff",
          confirmButtonText: "Aceptar",
        });
        setPlazos((prevPlazos) =>
          prevPlazos?.map((p) =>
            p.id === plazo.id ? { ...p, precio: data.plazo.precio } : p
          )
        );
      } else {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: data.message || "Hubo un error al guardar el precio.",
          confirmButtonColor: "#4096ff",
          confirmButtonText: "Aceptar",
        });
      }
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

    return (
      <Form
        className="flex justify-between py-2 items-center"
        form={form}
        onFinish={guardarPrecioEditado}
        validateMessages={validacionMensajes}
      >
        <Typography>{plazo.descripcion}</Typography>
        {editar ? (
          <Form.Item
            name={"precio"}
            rules={[
              {
                type: "number",
                min: 1,
                required: true,
              },
            ]}
            className=" m-0"
          >
            <InputNumber
              placeholder="Precio por M2"
              className="w-full m-0"
              formatter={formatPrecio}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              prefix="$"
              suffix="MXN"
            />
          </Form.Item>
        ) : (
          <Typography>${formatPrecio(plazo.precio)}</Typography>
        )}

        <Checkbox
          onChange={() => {
            setEditar(!editar);
          }}
        >
          Editar
        </Checkbox>
        {editar && (
          <Button htmlType="submit" size="small">
            Guardar
          </Button>
        )}
      </Form>
    );
  };

  const items = [
    {
      key: "editar",
      label: "Editar Plazos",
      children: (
        <Row justify={"center"}>
          <Col style={{ width: "100%" }}>
            {plazos?.length > 0 ? (
              <Collapse>
                <Collapse.Panel header="Lista de Plazos">
                  {plazos?.map((plazo, index) => (
                    <Plazo key={index} plazo={plazo} />
                  ))}
                </Collapse.Panel>
              </Collapse>
            ) : (
              <Typography className="text-center">
                No hay plazos creados para este terreno.
              </Typography>
            )}
          </Col>
        </Row>
      ),
    },
    {
      key: "crear",
      label: "Crear Nuevo Plazo",
      children: (
        <Row justify={"center"}>
          <Col span={24}>
            <PlazoForm terrenoId={terrenoId} ref={plazosFormRef} />
          </Col>
        </Row>
      ),
    },
  ];

  useImperativeHandle(ref, () => ({
    resetFields: resetPlazosForm,
  }));

  return (
    <div className="p-8 grid gap-4">
      {loading && <Loader />}
      <Tabs defaultActiveKey="editar" items={items} />
    </div>
  );
});

CrearPlazo.displayName = "CrearPlazo";
export default CrearPlazo;
