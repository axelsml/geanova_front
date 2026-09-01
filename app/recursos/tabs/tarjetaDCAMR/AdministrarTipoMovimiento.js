"use client";

import React, { useEffect, useState } from "react";

import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Table,
  Tag,
  Popconfirm,
  message,
} from "antd";

import recursosService from "@/services/recursosService";

const { Option } = Select;

export default function AdministrarTipoMovimiento({
  tarjetas = [],
  onTiposActualizados,
}) {
  const [form] = Form.useForm();

  const [tipos, setTipos] = useState([]);

  /*
   * Tenemos un estado local de tarjetas.
   *
   * Si el padre ya las trae, las usamos.
   * Si por alguna razón llegan vacías,
   * este componente las consulta directamente.
   */
  const [
    tarjetasDisponibles,
    setTarjetasDisponibles,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  // ==========================================================
  // INICIO
  // ==========================================================

  useEffect(() => {
    cargarTipos();
    cargarTarjetas();
  }, []);

  /*
   * Si el padre actualiza las tarjetas,
   * sincronizamos el estado local.
   */
  useEffect(() => {
    if (
      Array.isArray(tarjetas) &&
      tarjetas.length > 0
    ) {
      setTarjetasDisponibles(
        tarjetas
      );
    }
  }, [tarjetas]);

  // ==========================================================
  // ERROR
  // ==========================================================

  const onError = (error) => {
    setLoading(false);

    console.error(
      "AdministrarTipoMovimiento:",
      error
    );

    message.error(
      error?.message ||
        "Ocurrió un error al realizar la operación."
    );
  };

  // ==========================================================
  // CARGAR TIPOS
  // ==========================================================

  const cargarTipos = () => {
    setLoading(true);

    recursosService
      .showTipoMovimientoTarjeta(
        (response) => {
          console.log(
            "TIPOS MOVIMIENTO:",
            response
          );

          setTipos(
            Array.isArray(response)
              ? response
              : []
          );

          setLoading(false);
        },
        onError
      );
  };

  // ==========================================================
  // CARGAR TARJETAS
  // ==========================================================

  const cargarTarjetas = () => {
    /*
     * Primero aprovechamos las tarjetas
     * que ya mandó el padre.
     */
    if (
      Array.isArray(tarjetas) &&
      tarjetas.length > 0
    ) {
      console.log(
        "TARJETAS DESDE PADRE:",
        tarjetas
      );

      setTarjetasDisponibles(
        tarjetas
      );

      return;
    }

    /*
     * Si por alguna razón todavía no llegaron,
     * consultamos directamente.
     *
     * Este es el mismo patrón que ya utilizas
     * en AdministrarTarjetas.
     */
    recursosService
      .showTarjeta(
        (response) => {
          console.log(
            "TARJETAS CONSULTADAS:",
            response
          );

          setTarjetasDisponibles(
            Array.isArray(response)
              ? response
              : []
          );
        },
        onError
      );
  };

  // ==========================================================
  // REFRESCAR PADRE
  // ==========================================================

  const refrescarCatalogo = () => {
    cargarTipos();

    if (
      typeof onTiposActualizados ===
      "function"
    ) {
      onTiposActualizados();
    }
  };

  // ==========================================================
  // CREAR TIPO
  // ==========================================================

  const guardar = (values) => {
    const tarjetaId =
      parseInt(
        values.tarjeta_id,
        10
      );

    const params = {
      descripcion:
        values.descripcion,

      tipo_ingreso:
        values.tipo_ingreso,

      codigo_color:
        values.codigo_color,

      /*
       * 0 = Global
       * Lo enviamos como null.
       */
      tarjeta_id:
        tarjetaId > 0
          ? tarjetaId
          : null,
    };

    console.log(
      "CREAR TIPO:",
      params
    );

    setLoading(true);

    recursosService.createTipoMovimientoTarjeta(
      (response) => {
        setLoading(false);

        if (
          !response ||
          response.success === false ||
          response?.type ===
            "Error" ||
          response?.type ===
            "error"
        ) {
          message.error(
            response?.message ||
              "No se pudo guardar."
          );

          return;
        }

        message.success(
          response?.message ||
            "Tipo de movimiento guardado."
        );

        form.resetFields();

        form.setFieldsValue({
          tipo_ingreso: 2,
          tarjeta_id: 0,
          codigo_color:
            "#ffffff",
        });

        refrescarCatalogo();
      },
      params,
      onError
    );
  };

  // ==========================================================
  // CAMBIAR TARJETA DE UN TIPO EXISTENTE
  // ==========================================================

  const cambiarTarjetaTipo = (
    tipoMovimientoId,
    tarjetaId
  ) => {
    const tarjetaIdNumero =
      parseInt(
        tarjetaId,
        10
      );

    const params = {
      id:
        tipoMovimientoId,

      tarjeta_id:
        tarjetaIdNumero > 0
          ? tarjetaIdNumero
          : null,
    };

    console.log(
      "CAMBIAR RELACION:",
      params
    );

    /*
     * Cambio visual inmediato.
     */
    setTipos((prev) =>
      prev.map((tipo) => {
        if (
          parseInt(
            tipo.id,
            10
          ) !==
          parseInt(
            tipoMovimientoId,
            10
          )
        ) {
          return tipo;
        }

        return {
          ...tipo,

          tarjeta_id:
            tarjetaIdNumero > 0
              ? tarjetaIdNumero
              : null,
        };
      })
    );

    /*
     * Este servicio lo agregamos más abajo.
     */
    recursosService.updateRelacionTipoMovimientoTarjeta(
      (response) => {
        if (
          !response ||
          response.success === false ||
          response.type ===
            "Error" ||
          response.type ===
            "error"
        ) {
          message.error(
            response?.message ||
              "No se pudo actualizar la relación."
          );

          cargarTipos();

          return;
        }

        message.success(
          "Tarjeta relacionada correctamente."
        );

        if (
          typeof onTiposActualizados ===
          "function"
        ) {
          onTiposActualizados();
        }
      },
      params,
      onError
    );
  };

  // ==========================================================
  // ELIMINAR TIPO
  // ==========================================================

  const eliminar = (id) => {
    setLoading(true);

    recursosService.destroyTipoMovimientoTarjeta(
      (response) => {
        setLoading(false);

        if (
          response?.type ===
            "Error" ||
          response?.type ===
            "error"
        ) {
          message.error(
            response?.message ||
              "No se pudo eliminar."
          );

          return;
        }

        message.success(
          "Tipo de movimiento eliminado."
        );

        refrescarCatalogo();
      },
      {
        id: id,
      },
      onError
    );
  };

  // ==========================================================
  // FORMATEAR TARJETA
  // ==========================================================

  const formatearNumeroTarjeta = (
    numero
  ) => {
    if (!numero) {
      return "";
    }

    const limpio =
      numero
        .toString()
        .replace(
          /\D/g,
          ""
        );

    if (
      limpio.length < 4
    ) {
      return numero;
    }

    return `•••• ${limpio.slice(
      -4
    )}`;
  };

  const textoTarjeta = (
    tarjeta
  ) => {
    if (!tarjeta) {
      return "Sin tarjeta";
    }

    const numero =
      formatearNumeroTarjeta(
        tarjeta.tarjeta
      );

    return `${tarjeta.alias || "Sin alias"}${
      numero
        ? ` - ${numero}`
        : ""
    }`;
  };

  // ==========================================================
  // COLUMNAS
  // ==========================================================

  const columnas = [
    {
      title:
        "Descripción",

      dataIndex:
        "descripcion",

      key:
        "descripcion",
    },

    {
      title:
        "Tipo",

      dataIndex:
        "tipo_ingreso",

      key:
        "tipo_ingreso",

      width: 90,

      render: (value) =>
        parseInt(
          value,
          10
        ) === 1 ? (
          <Tag color="green">
            Abono
          </Tag>
        ) : (
          <Tag color="red">
            Cargo
          </Tag>
        ),
    },

    /*
     * AHORA LA TARJETA ES EDITABLE.
     */
    {
      title:
        "Tarjeta",

      dataIndex:
        "tarjeta_id",

      key:
        "tarjeta_id",

      width: 250,

      render: (
        tarjetaId,
        registro
      ) => (
        <Select
          value={
            tarjetaId
              ? parseInt(
                  tarjetaId,
                  10
                )
              : 0
          }
          style={{
            width:
              "100%",
          }}
          showSearch
          optionFilterProp="label"
          onChange={(
            value
          ) =>
            cambiarTarjetaTipo(
              registro.id,
              value
            )
          }
        >
          <Option
            value={0}
            label="Global"
          >
            Global
          </Option>

          {tarjetasDisponibles.map(
            (tarjeta) => (
              <Option
                key={
                  tarjeta.id
                }
                value={parseInt(
                  tarjeta.id,
                  10
                )}
                label={textoTarjeta(
                  tarjeta
                )}
              >
                {textoTarjeta(
                  tarjeta
                )}
              </Option>
            )
          )}
        </Select>
      ),
    },

    {
      title:
        "Color",

      dataIndex:
        "codigo_color",

      key:
        "codigo_color",

      width: 70,

      render: (color) => (
        <div
          style={{
            width: 24,
            height: 24,

            margin:
              "0 auto",

            borderRadius:
              5,

            backgroundColor:
              color ||
              "#ffffff",

            border:
              "1px solid #d9d9d9",
          }}
        />
      ),
    },

    {
      title: "",

      key:
        "acciones",

      width: 90,

      render: (
        _,
        registro
      ) => (
        <Popconfirm
          title="¿Eliminar este tipo?"
          okText="Eliminar"
          cancelText="Cancelar"
          onConfirm={() =>
            eliminar(
              registro.id
            )
          }
        >
          <Button
            danger
            size="small"
          >
            Eliminar
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={guardar}
        initialValues={{
          tipo_ingreso: 2,

          tarjeta_id: 0,

          codigo_color:
            "#ffffff",
        }}
      >
        <Row gutter={16}>
          <Col
            xs={24}
            md={12}
          >
            <Form.Item
              name="descripcion"
              label="Descripción"
              rules={[
                {
                  required:
                    true,

                  message:
                    "Ingresa una descripción.",
                },
              ]}
            >
              <Input
                placeholder="Ej. Gastos Alonso"
              />
            </Form.Item>
          </Col>

          <Col
            xs={24}
            md={12}
          >
            <Form.Item
              name="tipo_ingreso"
              label="Tipo de movimiento"
              rules={[
                {
                  required:
                    true,
                },
              ]}
            >
              <Select>
                <Option
                  value={1}
                >
                  Abono
                </Option>

                <Option
                  value={2}
                >
                  Cargo
                </Option>
              </Select>
            </Form.Item>
          </Col>

          <Col
            xs={24}
            md={16}
          >
            <Form.Item
              name="tarjeta_id"
              label="Tarjeta relacionada"
              extra="Global significa que el tipo estará disponible para cualquier tarjeta."
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Selecciona una tarjeta"
              >
                <Option
                  value={0}
                  label="Global / todas las tarjetas"
                >
                  Global / todas las tarjetas
                </Option>

                {tarjetasDisponibles.map(
                  (tarjeta) => (
                    <Option
                      key={
                        tarjeta.id
                      }
                      value={parseInt(
                        tarjeta.id,
                        10
                      )}
                      label={textoTarjeta(
                        tarjeta
                      )}
                    >
                      {textoTarjeta(
                        tarjeta
                      )}
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>
          </Col>

          <Col
            xs={24}
            md={8}
          >
            <Form.Item
              name="codigo_color"
              label="Color"
            >
              <Input
                type="color"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end">
          <Button
            type="primary"
            htmlType="submit"
            loading={
              loading
            }
          >
            Guardar tipo
          </Button>
        </Row>
      </Form>

      <div
        style={{
          marginTop: 25,
        }}
      >
        <Table
          rowKey="id"
          loading={
            loading
          }
          dataSource={
            tipos
          }
          columns={
            columnas
          }
          pagination={{
            pageSize: 8,
          }}
          size="small"
          scroll={{
            x: 700,
          }}
        />
      </div>
    </>
  );
}