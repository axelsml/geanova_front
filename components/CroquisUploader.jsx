"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";

export default function CroquisUploader({ onFileSelected, onReset }) {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const resetState = () => {
    setFileName("");
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

    if (file.type !== "application/pdf") {
      Swal.fire({
        title: "Archivo no válido",
        text: "Por favor selecciona un archivo PDF.",
        icon: "error",
        confirmButtonColor: "#4096ff",
        customClass: {
          container: "swal-z-index-9999",
        },
      });
      resetState();
      return;
    }

    resetState();

    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      const pdfUrl = reader.result?.toString() || "";
      setFileName(file.name);
      onFileSelected(pdfUrl);
    });
    reader.readAsDataURL(file);
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
            Subir Archivo (PDF)
          </label>
          <input
            id="fileInput"
            type="file"
            accept="application/pdf"
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
            <span style={{ color: "#FFFFFF" }}>
              Archivo Cargado: {fileName}
            </span>

            <FaTrash
              style={{ cursor: "pointer" }}
              onClick={() => {
                resetState();
                onFileSelected(""); // Limpiar al eliminar
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
