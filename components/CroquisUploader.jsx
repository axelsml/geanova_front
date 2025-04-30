"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, Row, Col, Typography } from "antd";
const { Text } = Typography;
import { FaTrash } from "react-icons/fa6";
import ReactCrop, { convertToPixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Swal from "sweetalert2";
import setCanvasPreview from "./setCanvasPreviw";

export default function CroquisUploader({ onImageSelected, onReset }) {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const fileRef = useRef(null);
  const [imagen, setImagen] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [imagenRecortada, setImagenRecortada] = useState("");
  const [fileName, setFileName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [crop, setCrop] = useState();

  const resetState = () => {
    setImagen("");
    setFileName("");
    setImagenUrl("");
    setImagenRecortada("");
    setCrop(undefined);
    if (fileRef) {
      fileRef.current.value = "";
    }
  };

  useEffect(() => {
    if (onReset) {
      onReset(resetState);
    }
  }, []);

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    resetState();

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageUrl = reader.result?.toString() || "";
      setFileName(file.name);
      setImagen(imageUrl);
      setImagenUrl(imageUrl);

      Swal.fire({
        title: "¿Recortar Cuadro de construcción?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        confirmButtonText: "Recortar",
        cancelButtonText: "Omitir",
        customClass: {
          container: "swal-z-index-9999",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setShowModal(true);
        } else {
          onImageSelected(imageUrl, ""); // Si se omite el recorte, la recortada es vacía
        }
      });
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const initialCropWidthPercent = 30;
    const initialCropHeightPercent = 30;

    const initialCrop = {
      unit: "%",
      width: initialCropWidthPercent,
      height: initialCropHeightPercent,
      x: (100 - initialCropWidthPercent) / 2,
      y: (100 - initialCropHeightPercent) / 2,
      aspect: 1,
    };
    setCrop(initialCrop);
  };

  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleCropSave = () => {
    Swal.fire({
      title: "Cuadro de construcción guardado con éxito",
      icon: "success",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: false,
      confirmButtonText: "Aceptar",
      customClass: {
        container: "swal-z-index-9999",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onImageSelected(imagen, imagenRecortada); // Llama a la función para enviar ambas imágenes
        setImagenUrl("");
        setCrop(undefined);
        setShowModal(false);
      }
    });
  };

  const handleCropCancel = () => {
    Swal.fire({
      title: "Confirme para cancelar",
      icon: "question",
      text: "Cancelar la selección del recorte de la imagen",
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`,
      customClass: {
        container: "swal-z-index-9999",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setImagenUrl("");
        setImagenRecortada("");
        setCrop(undefined);
        onImageSelected(imagen, ""); // Limpiar las imágenes si se cancela
        setShowModal(false);
      }
    });
  };

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <div>
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
            accept="image/*"
            onChange={onSelectFile}
            style={{
              display: "none",
            }}
            ref={fileRef}
          />
        </div>
        {fileName && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>Imagen Cargada: {fileName}</span>

            <FaTrash
              style={{ cursor: "pointer" }}
              onClick={() => {
                resetState();
                onImageSelected("", ""); // Limpiar las imágenes al eliminar
              }}
            />
          </div>
        )}
      </div>

      <Modal
        title={
          <Row justify={"center"}>
            <Text className="titulo_pantallas">Recortar Imagen</Text>
          </Row>
        }
        open={showModal}
        footer={
          <Row justify={"center"} style={{ justifyContent: "space-evenly" }}>
            <Button key={"guardar"} onClick={handleCropSave}>
              Guardar
            </Button>
            <Button key={"cancel"} onClick={handleCropCancel}>
              Cancelar
            </Button>
          </Row>
        }
        closable={false}
        maskClosable={false}
      >
        {imagenUrl && (
          <div style={{ marginTop: "16px" }}>
            <ReactCrop crop={crop} keepSelection onChange={onCropChange}>
              <img
                ref={imgRef}
                src={imagenUrl}
                alt="uploaded"
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <Row justify={"center"} style={{ margin: "16px" }}>
              <Button
                size="large"
                onClick={() => {
                  setCanvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    convertToPixelCrop(
                      crop,
                      imgRef.current.width,
                      imgRef.current.height
                    )
                  );
                  const dataUrl = previewCanvasRef.current.toDataURL();
                  setImagenRecortada(dataUrl);
                }}
              >
                Recortar
              </Button>
            </Row>
          </div>
        )}
        {crop && (
          <Row justify="center" style={{ margin: "16px" }}>
            <canvas
              ref={previewCanvasRef}
              style={{
                display: imagenRecortada ? "block" : "none",
                border: "1px solid black",
                objectFit: "contain",
                width: "90%",
                height: "90%",
              }}
            />
          </Row>
        )}
      </Modal>
    </div>
  );
}
