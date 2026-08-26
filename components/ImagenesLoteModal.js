"use client";

import {
  Modal,
  Button,
  Upload,
  Form,
  InputNumber,
  Row,
  Col,
  Image,
  Card,
  Empty,
  Spin,
  Typography,
  Popconfirm,
  Space,
  Select
} from "antd";

import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

import {
  useEffect,
  useState,
} from "react";

import Swal from "sweetalert2";

import imagenesService from "@/services/imagenesService";

const { Text, Title } = Typography;

export default function ImagenesLoteModal({
  visible,
  onClose,
  loteId,
  terrenoId,
}) {

  const [form] = Form.useForm();

  // ============================================================
  // ESTADOS
  // ============================================================

  const [imagenes, setImagenes] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [guardando, setGuardando] =
    useState(false);

  const [editando, setEditando] =
    useState(null);

  const [archivoImagen, setArchivoImagen] =
    useState(null);

  const [archivoPdf, setArchivoPdf] =
    useState(null);


  // ============================================================
  // CARGAR CUANDO ABRE
  // ============================================================

  useEffect(() => {

    if (
      visible &&
      loteId &&
      terrenoId
    ) {

      cargarImagenes();

    }

  }, [
    visible,
    loteId,
    terrenoId,
  ]);


  // ============================================================
  // LISTAR
  // ============================================================

  function cargarImagenes() {

    setLoading(true);

    const params = {
      lote_id: loteId,
      terreno_id: terrenoId,
    };

    imagenesService.getImagenesLote(
      params,

      (data) => {

        setLoading(false);

        if (data.success) {

          setImagenes(
            data.imagenes || []
          );

        } else {

          setImagenes([]);

          Swal.fire({
            title: "Error",
            icon: "error",
            text:
              data.message ||
              "No fue posible cargar las imágenes.",
          });

        }

      },

      (error) => {

        setLoading(false);

        console.error(error);

        Swal.fire({
          title: "Error",
          icon: "error",
          text:
            "No fue posible cargar las imágenes.",
        });

      }
    );

  }


  // ============================================================
  // NUEVO
  // ============================================================

  function nuevoRegistro() {

    setEditando(null);

    setArchivoImagen(null);

    setArchivoPdf(null);

    form.resetFields();

  }


  // ============================================================
  // EDITAR
  // ============================================================

  function editarRegistro(imagen) {

    setEditando(imagen);

    setArchivoImagen(null);

    setArchivoPdf(null);

    form.setFieldsValue({
      tipo_id: imagen.tipo_id,
    });

  }


  // ============================================================
  // VALIDAR IMAGEN
  // ============================================================

  function validarImagen(file) {

    const tipos = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!tipos.includes(file.type)) {

      Swal.fire({
        title: "Archivo no válido",
        icon: "warning",
        text:
          "Solo se permiten JPG, JPEG, PNG o WEBP.",
      });

      return Upload.LIST_IGNORE;

    }

    const maximo =
      file.size / 1024 / 1024 <= 10;

    if (!maximo) {

      Swal.fire({
        title: "Archivo demasiado grande",
        icon: "warning",
        text:
          "La imagen debe pesar máximo 10 MB.",
      });

      return Upload.LIST_IGNORE;

    }

    setArchivoImagen(file);

    return false;

  }


  // ============================================================
  // VALIDAR PDF
  // ============================================================

  function validarPdf(file) {

    if (
      file.type !==
      "application/pdf"
    ) {

      Swal.fire({
        title: "Archivo no válido",
        icon: "warning",
        text:
          "Solamente se permiten archivos PDF.",
      });

      return Upload.LIST_IGNORE;

    }

    const maximo =
      file.size / 1024 / 1024 <= 15;

    if (!maximo) {

      Swal.fire({
        title: "Archivo demasiado grande",
        icon: "warning",
        text:
          "El PDF debe pesar máximo 15 MB.",
      });

      return Upload.LIST_IGNORE;

    }

    setArchivoPdf(file);

    return false;

  }


  // ============================================================
  // GUARDAR
  // ============================================================

async function guardar() {

  try {

    const values =
      await form.validateFields();

    // ========================================================
    // VALIDAR ARCHIVOS
    // Se permite:
    // - Solo imagen
    // - Solo PDF
    // - Imagen + PDF
    // ========================================================

    if (
      !editando &&
      !archivoImagen &&
      !archivoPdf
    ) {

      Swal.fire({
        title: "Archivo requerido",
        icon: "warning",
        text:
          "Seleccione una imagen o un PDF para guardar.",
      });

      return;

    }

    const formData =
      new FormData();

    formData.append(
      "imagen[lote_id]",
      loteId
    );

    formData.append(
      "imagen[terreno_id]",
      terrenoId
    );

    if (
      values.tipo_id !== undefined &&
      values.tipo_id !== null
    ) {

      formData.append(
        "imagen[tipo_id]",
        values.tipo_id
      );

    }

    // Imagen solamente si fue seleccionada
    if (archivoImagen) {

      formData.append(
        "imagen[img]",
        archivoImagen
      );

    }

    // PDF solamente si fue seleccionado
    if (archivoPdf) {

      formData.append(
        "imagen[pdf]",
        archivoPdf
      );

    }

    setGuardando(true);


    // ========================================================
    // UPDATE
    // ========================================================

    if (editando) {

      imagenesService.updateImagen(
        editando.id,
        formData,
        onGuardado,
        onErrorGuardar
      );

      return;

    }


    // ========================================================
    // CREATE
    // ========================================================

    imagenesService.createImagen(
      formData,
      onGuardado,
      onErrorGuardar
    );

  } catch (error) {

    console.log(error);

  }

}

  // ============================================================
  // GUARDADO
  // ============================================================

  function onGuardado(data) {

    setGuardando(false);

    if (!data.success) {

      Swal.fire({
        title: "Error",
        icon: "error",
        text:
          data.message ||
          "No fue posible guardar.",
      });

      return;

    }

    Swal.fire({
      title: "Guardado",
      icon: "success",
      text: data.message,
      timer: 1200,
      showConfirmButton: false,
    });

    nuevoRegistro();

    cargarImagenes();

  }


  function onErrorGuardar(error) {

    setGuardando(false);

    console.error(error);

    Swal.fire({
      title: "Error",
      icon: "error",
      text:
        "No fue posible guardar el archivo.",
    });

  }


  // ============================================================
  // ELIMINAR
  // ============================================================

  function eliminar(imagen) {

    setLoading(true);

    imagenesService.deleteImagen(
      imagen.id,

      (data) => {

        setLoading(false);

        if (data.success) {

          Swal.fire({
            title: "Eliminado",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
          });

          cargarImagenes();

        } else {

          Swal.fire({
            title: "Error",
            icon: "error",
            text: data.message,
          });

        }

      },

      (error) => {

        setLoading(false);

        console.error(error);

        Swal.fire({
          title: "Error",
          icon: "error",
          text:
            "No fue posible eliminar el archivo.",
        });

      }
    );

  }


  // ============================================================
  // CERRAR
  // ============================================================

  function cerrar() {

    nuevoRegistro();

    onClose();

  }


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <Modal
      visible={visible}
      footer={null}
      width={1000}
      onCancel={cerrar}
      destroyOnClose
      title="Imágenes del Lote"
    >

      {/* ====================================================== */}
      {/* FORMULARIO */}
      {/* ====================================================== */}

      <Card
        size="small"
        style={{
          marginBottom: 20,
        }}
      >

        <Row
          justify="space-between"
          align="middle"
          style={{
            marginBottom: 15,
          }}
        >

          <Col>

            <Title level={5}>
              {editando
                ? "Editar archivo"
                : "Agregar archivo"}
            </Title>

          </Col>

          {editando && (

            <Col>

              <Button
                onClick={nuevoRegistro}
                icon={<PlusOutlined />}
              >
                Nuevo
              </Button>

            </Col>

          )}

        </Row>


        <Form
          form={form}
          layout="vertical"
        >

          <Row gutter={16}>

            {/* ================================================ */}
            {/* TIPO */}
            {/* ================================================ */}

            <Col
              xs={24}
              md={6}
            >

              <Form.Item
                name="tipo_id"
                label="Tipo de documento"
                rules={[
                  {
                    required: true,
                    message: "Seleccione el tipo de documento",
                  },
                ]}
              >
                <Select
                  placeholder="Seleccione el tipo de documento"
                  optionLabelProp="label"
                >
                  <Select.Option
                    value={1}
                    label="Compra y venta"
                  >
                    Compra y venta
                  </Select.Option>

                  <Select.Option
                    value={2}
                    label="Promesa compra y venta"
                  >
                    Promesa compra y venta
                  </Select.Option>
                </Select>
              </Form.Item>

            </Col>


            {/* ================================================ */}
            {/* IMAGEN */}
            {/* ================================================ */}

            <Col
              xs={24}
              md={9}
            >

              <Form.Item
                label={
                  editando
                    ? "Reemplazar imagen"
                    : "Imagen"
                }
              >

                <Upload
                  beforeUpload={
                    validarImagen
                  }
                  onRemove={() => {
                    setArchivoImagen(null);
                  }}
                  maxCount={1}
                  accept=".jpg,.jpeg,.png,.webp"
                >

                  <Button
                    icon={
                      <UploadOutlined />
                    }
                  >
                    Seleccionar imagen
                  </Button>

                </Upload>

              </Form.Item>

            </Col>


            {/* ================================================ */}
            {/* PDF */}
            {/* ================================================ */}

            <Col
              xs={24}
              md={9}
            >

              <Form.Item
                  label="PDF"
                >

                <Upload
                  beforeUpload={
                    validarPdf
                  }
                  onRemove={() => {
                    setArchivoPdf(null);
                  }}
                  maxCount={1}
                  accept=".pdf"
                >

                  <Button
                    icon={
                      <FilePdfOutlined />
                    }
                  >
                    Seleccionar PDF
                  </Button>

                </Upload>

              </Form.Item>

            </Col>

          </Row>


          <Row justify="end">

            <Space>

              {editando && (

                <Button
                  onClick={nuevoRegistro}
                >
                  Cancelar edición
                </Button>

              )}

              <Button
                type="primary"
                loading={guardando}
                onClick={guardar}
              >

                {editando
                  ? "Guardar cambios"
                  : "Agregar"}

              </Button>

            </Space>

          </Row>

        </Form>

      </Card>


      {/* ====================================================== */}
      {/* GALERÍA */}
      {/* ====================================================== */}

      <Spin spinning={loading}>

        {imagenes.length === 0 ? (

          <Empty
            description="Este lote no tiene imágenes registradas"
          />

        ) : (

          <Row gutter={[16, 16]}>

            {imagenes.map(
              (imagen) => (

                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  key={imagen.id}
                >

                  <Card
                    hoverable
                    cover={
                      imagen.img_url ? (

                        <Image
                          src={
                            imagen.img_url
                          }
                          alt={
                            imagen.img_file_name
                          }
                          height={190}
                          style={{
                            objectFit:
                              "cover",
                          }}
                        />

                      ) : (

                        <div
                          style={{
                            height: 190,
                            display: "flex",
                            justifyContent:
                              "center",
                            alignItems:
                              "center",
                            background:
                              "#f5f5f5",
                          }}
                        >
                          Sin imagen
                        </div>

                      )
                    }
                  >

                    <div
                      style={{
                        marginBottom: 10,
                      }}
                    >

                      <Text strong>
                        Tipo:{" "}
                        {imagen.tipo_id ||
                          "-"}
                      </Text>

                      <br />

                      <Text
                        type="secondary"
                      >
                        {imagen.img_file_name ||
                          imagen.pdf_file_name ||
                          "Sin nombre"}
                      </Text>

                    </div>


                    <Space wrap>

                      <Button
                        size="small"
                        icon={
                          <EditOutlined />
                        }
                        onClick={() => {
                          editarRegistro(
                            imagen
                          );
                        }}
                      >
                        Editar
                      </Button>


                      {imagen.pdf_url && (

                        <Button
                          size="small"
                          icon={
                            <FilePdfOutlined />
                          }
                          onClick={() => {

                            window.open(
                              imagen.pdf_url,
                              "_blank"
                            );

                          }}
                        >
                          PDF
                        </Button>

                      )}


                      <Popconfirm
                        title="¿Eliminar este archivo?"
                        okText="Eliminar"
                        cancelText="Cancelar"
                        onConfirm={() => {
                          eliminar(imagen);
                        }}
                      >

                        <Button
                          size="small"
                          danger
                          icon={
                            <DeleteOutlined />
                          }
                        >
                          Eliminar
                        </Button>

                      </Popconfirm>

                    </Space>

                  </Card>

                </Col>

              )
            )}

          </Row>

        )}

      </Spin>

    </Modal>

  );

}