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
} from "antd";
import { useState, useEffect, useContext } from "react";
import { LoadingContext } from "@/contexts/loading";
import { useForm } from "antd/es/form/Form";
import Swal from "sweetalert2";

export default function PlazosCrear({ terrenoId }) {
  const [nuevoPlazo, setNuevoPlazo] = useState(false);
  const [plazos, setPlazos] = useState(null);
  const [changeState, setChangeState] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    plazosService.getPlazos({ terreno_id: terrenoId }, setPlazos, Error);
  }, [terrenoId, changeState]);

  const CreateNuevoPlazo = () => {
    setNuevoPlazo(!nuevoPlazo);
  };

  const Plazo = ({ plazo }) => {
    const [editar, setEditar] = useState(false);
    const [form] = useForm();

    useEffect(() => {
      form.setFieldValue("precio", plazo.precio);
    }, [form, editar]);

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
          setIsLoading(true);
          plazosService.editarPlazo(params, onPrecioEditado, onError);
        }
      });
    };

    const onPrecioEditado = (data) => {
      setIsLoading(false);
      setEditar(false);
      if (data.success) {
        setChangeState(!changeState);
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

    const onError = (e) => {
      setIsLoading(false);
      console.log(e);
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

  return (
    <div className="p-8 grid gap-4">
      {!nuevoPlazo && (
        <Row justify={"center"}>
          <Col>
            <Button size={"large"} onClick={CreateNuevoPlazo}>
              Crear Nuevo Plazo
            </Button>
          </Col>
        </Row>
      )}
      <Row justify={"center"}>
        <Col span={24}>
          {nuevoPlazo && (
            <PlazoForm
              setNuevoPlazo={setNuevoPlazo}
              setWatch={setChangeState}
              watch={changeState}
              terrenoId={terrenoId}
            />
          )}
        </Col>
      </Row>

      {!nuevoPlazo && plazos?.length > 0 && (
        <Row justify={"center"}>
          <Collapse className="w-3/4">
            <Collapse.Panel header="Lista de Plazos">
              {plazos?.map((plazo, index) => (
                <Plazo key={index} plazo={plazo} />
              ))}
            </Collapse.Panel>
          </Collapse>
        </Row>
      )}
    </div>
  );
}
