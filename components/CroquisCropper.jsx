"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Image, Modal } from "antd";
import Swal from "sweetalert2";
// import * as pdfjsLib from "pdfjs-dist/webpack";
// import html2canvas from "html2canvas";
import lotesService from "@/services/lotesService";
import Loader from "./Loader";

export default function CroquisCropped({ id, onCloseRequest }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const cropBoxRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [pdfBase64, setPdfBase64] = useState("");
  const [crop, setCrop] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    let params = { lote_id: id };
    lotesService.cargarPdfCroquis(params, onCargar, onError);
  }, []);

  const onCargar = async (data) => {
    if (data.success) {
      const dataUri = `data:${data.pdf.content_type};base64,${data.pdf.base64}`;
      setPdfBase64(dataUri);
    } else {
      Swal.fire({
        title: "Sin resultados",
        text: data.message,
        icon: "warning",
        confirmButtonColor: "#4096ff",
        customClass: { container: "swal-z-index-9999" },
      }).then((result) => {
        if (result.isConfirmed && onCloseRequest) onCloseRequest();
      });
    }
  };

  const onError = (err) => {
    Swal.fire({
      title: "Error",
      text: `Error al cargar PDF: ${err}`,
      icon: "error",
      confirmButtonColor: "#4096ff",
    });
    console.error("Error en carga de PDF:", err);
  };

  useEffect(() => {
    if (pdfBase64) renderPDF(pdfBase64);
  }, [pdfBase64]);

  const clearCrop = () => {
    setCrop("");
    setShow(false);
  };

  const renderPDF = async (dataUri) => {
    const loadingTask = pdfjsLib.getDocument(dataUri);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1 });
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  };

  const handleCrop = async () => {
    const container = containerRef.current;
    const cropBox = cropBoxRef.current.getBoundingClientRect();
    const containerBox = container.getBoundingClientRect();

    const relativeX = cropBox.left - containerBox.left;
    const relativeY = cropBox.top - containerBox.top;

    const canvas = await html2canvas(container, { scale: 2 });
    const croppedCanvas = document.createElement("canvas");
    const ctx = croppedCanvas.getContext("2d");

    croppedCanvas.width = cropBox.width * 2;
    croppedCanvas.height = cropBox.height * 2;

    ctx.drawImage(
      canvas,
      relativeX * 2,
      relativeY * 2,
      cropBox.width * 2,
      cropBox.height * 2,
      0,
      0,
      cropBox.width * 2,
      cropBox.height * 2
    );

    const croppedBase64 = croppedCanvas.toDataURL("image/png");
    setCrop(croppedBase64);
    setShow(true);
  };

  const handleGuardar = () => {
    setLoading(true);
    let params = {
      lote_id: id,
      pdf: "",
      recorte: crop,
    };
    lotesService.postLoteCroquis(params, onGuardar, onError);
  };

  async function onGuardar(data) {
    setLoading(false);
    if (data.success) {
      Swal.fire({
        title: "Guardado exitoso",
        text: data.message,
        icon: "success",
        confirmButtonColor: "#4096ff",
        customClass: { container: "swal-z-index-9999" },
      }).then((result) => {
        if (result.isConfirmed && onCloseRequest) onCloseRequest();
      });
    } else {
      Swal.fire({
        title: "Error al guardar",
        text: data.message,
        icon: "error",
        confirmButtonColor: "#4096ff",
        customClass: { container: "swal-z-index-9999" },
      }).then((result) => {
        if (result.isConfirmed) {
          clearCrop();
        }
      });
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        overflow: "auto",
        maxHeight: "80vh",
        maxWidth: "100%",
        border: "1px solid #ccc",
        margin: "auto",
      }}
    >
      {loading && (
        <>
          <Loader />
        </>
      )}
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          margin: "0 auto",
          border: "1px solid #ccc",
        }}
      />

      {/* Caja de recorte */}
      {pdfBase64 && (
        <div
          ref={cropBoxRef}
          contentEditable={false}
          style={{
            position: "absolute",
            top: "100px",
            left: "100px",
            width: "200px",
            height: "200px",
            border: "4px dashed red",
            resize: "both",
            overflow: "hidden",
            boxSizing: "border-box",
            touchAction: "none",
          }}
          onMouseDown={(e) => {
            const box = cropBoxRef.current;
            const startX = e.clientX;
            const startY = e.clientY;
            const startLeft = box.offsetLeft;
            const startTop = box.offsetTop;

            // Solo mover si el clic no es en los bordes (usamos padding para detectar centro)
            const boxRect = box.getBoundingClientRect();
            const padding = 10;
            const isResizeZone =
              e.clientX > boxRect.right - padding ||
              e.clientX < boxRect.left + padding ||
              e.clientY > boxRect.bottom - padding ||
              e.clientY < boxRect.top + padding;

            if (!isResizeZone) {
              const onMouseMove = (moveEvent) => {
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;
                box.style.left = `${startLeft + dx}px`;
                box.style.top = `${startTop + dy}px`;
              };

              const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
              };

              document.addEventListener("mousemove", onMouseMove);
              document.addEventListener("mouseup", onMouseUp);
            }
          }}
        >
          {/* Estilos visuales para mostrar que es redimensionable */}
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "12px",
              height: "12px",
              backgroundColor: "red",
              cursor: "se-resize",
            }}
          />
        </div>
      )}

      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <Button
          onClick={() => handleCrop()}
          // disabled={!!crop}
          style={{ marginRight: "10px" }}
        >
          Recortar
        </Button>
      </div>
      {/* MODAL DEL RECORTE */}
      <Modal
        open={show}
        footer={null}
        onCancel={() => setShow(false)}
        centered
        width={400}
      >
        {crop && (
          <div style={{ textAlign: "center" }}>
            <Image
              src={crop}
              alt="Recorte"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                marginBottom: "15px",
              }}
            />
            <div>
              <Button onClick={() => handleGuardar()}>Guardar</Button>
              <Button danger onClick={() => clearCrop()}>
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
