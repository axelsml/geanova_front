"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Loader from "@/components/Loader";
import Swal from "sweetalert2";
import {
  Row,
  Col,
  Button,
  Checkbox,
  Select,
  Input,
  Modal,
  Typography,
} from "antd";
import lotesService from "@/services/lotesService";
import { FaArrowLeft } from "react-icons/fa6";

const { Option } = Select;
const { Text } = Typography;

export default function Diez() {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [show, setShow] = useState(false);
  const [lotes, setLotes] = useState([]);
  const [lote, setLote] = useState(null);
  const [loteId, setLoteId] = useState(null);
  const svgRef = useRef(null);
  const [puntosRelativos, setPuntosRelativos] = useState([]);
  const [coordenadas, setCoordenadas] = useState("");
  const [imageWidth, setImageWidth] = useState(1000);
  const [imageHeight, setImageHeight] = useState(700);

  const onError = (e) => {
    setLoading(false);
    console.log(e);
  };

  useEffect(() => {
    cargarLotes();
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setImageWidth(window.innerWidth * 0.9);
        setImageHeight(window.innerWidth * 0.9 * 0.7);
      } else {
        setImageWidth(1000);
        setImageHeight(700);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function cargarLotes() {
    let params = {
      terreno_id: 4,
    };
    lotesService.lotesByTerreno(params, setLotes, console.error);
  }

  const handleSvgClick = (e) => {
    if (!editMode || !svgRef.current || e.target.tagName === "polygon") return;
    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;

    const newPoints = [...puntosRelativos, relativeX, relativeY];
    setPuntosRelativos(newPoints);
    setCoordenadas(
      newPoints
        .reduce((acc, val, idx) => {
          if (idx % 2 === 0) {
            return acc + `[${(val * 100).toFixed(2)}%, `;
          } else {
            return acc + `${(val * 100).toFixed(2)}%], `;
          }
        }, "")
        .slice(0, -2)
    );
  };

  const handleClear = () => {
    setPuntosRelativos([]);
    setCoordenadas("");
  };

  const calcularPuntosAbsolutos = () => {
    return puntosRelativos.map((coord, index) => {
      if (index % 2 === 0) {
        return coord * imageWidth;
      } else {
        return coord * imageHeight;
      }
    });
  };

  const getPolygonPointsString = () => {
    const puntosAbsolutos = calcularPuntosAbsolutos();
    return puntosAbsolutos
      .reduce((acc, val, idx) => {
        if (idx % 2 === 0) {
          return acc + `${val},`;
        } else {
          return acc + `${val} `;
        }
      }, "")
      .trim();
  };

  const handleSave = () => {
    setLoading(true);
    let params = {
      lote_id: loteId,
      coordenadas: puntosRelativos,
    };
    lotesService.postCoordenadas(params, onSave, onError);
  };

  async function onSave(data) {
    setLoading(false);
    if (data.success) {
      Swal.fire({
        title: "Guardado",
        icon: "success",
        text: data.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
      handleClear();
      setLoteId(null);
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
      handleClear();
      setLoteId(null);
    }
  }

  // Función para obtener la cadena de puntos del polígono de un lote
  const getPolygonPointsFromLote = (coordenadas, imageWidth, imageHeight) => {
    if (!coordenadas) return "";
    const coordenadasArray = coordenadas
      .replace("[", "")
      .replace("]", "")
      .split(",")
      .map(Number);
    // Coordenadas originales <= coordenadasArray
    if (coordenadasArray.length === 0) return "";
    // Convertir coordenadas relativas a absolutas
    const puntosAbsolutos = coordenadasArray.map((coord, index) => {
      if (index % 2 === 0) {
        return coord * imageWidth;
      } else {
        return coord * imageHeight;
      }
    });
    // Coordenadas absolutas <= puntosAbsolutos
    // Formatear la cadena de puntos para el SVG
    const puntosString = puntosAbsolutos
      .reduce((acc, val, idx) => {
        if (idx % 2 === 0) {
          return acc + `${val},`;
        } else {
          return acc + `${val} `;
        }
      }, "")
      .trim();
    //  Cadena de puntos SVG <= puntosString
    return puntosString;
  };

  const handlePolygonClick = (e, lote) => {
    setLote(lote);
    setShow(true);
  };

  return (
    <div style={{ marginTop: "5vh" }}>
      {loading && (
        <>
          <Loader />
        </>
      )}
      {/* INPUTS */}
      <div
        style={{
          width: `${imageWidth}px`,
          margin: "0 auto",
          marginBottom: "5vh",
        }}
      >
        <Row justify={"center"} style={{ margin: "32px" }}>
          <Link href={"/mapas"} passHref>
            <Button
              style={{
                width: "150px",
                height: "50px",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Col>
                <FaArrowLeft />
              </Col>
              <Col>
                <Text>Regresar</Text>
              </Col>
            </Button>
          </Link>
        </Row>
        <Row justify={"center"}>
          <Checkbox
            checked={editMode}
            onChange={(e) => {
              setEditMode(e.target.checked);
              handleClear();
              setLoteId(null);
            }}
          >
            Editar Puntos
          </Checkbox>
        </Row>
        {editMode && (
          <Row justify={"center"}>
            <Row
              style={{
                width: `${imageWidth / 2}px`,
                justifyContent: "space-evenly",
                margin: "2vh",
              }}
            >
              <Col>
                <Select
                  style={{ width: 150 }}
                  showSearch
                  placeholder="Seleccione un Lote"
                  onChange={(e) => setLoteId(e)}
                  value={loteId}
                >
                  {lotes?.map((item) => (
                    <Option key={item.id} value={item.id} label={item.numero}>
                      {item?.numero}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col>
                <Button onClick={handleClear}>Limpiar</Button>
              </Col>
              <Col>
                <Button
                  onClick={handleSave}
                  disabled={loteId == null || puntosRelativos.length == 0}
                >
                  Guardar
                </Button>
              </Col>
            </Row>
            <Row>
              <Input
                style={{ width: `${imageWidth}px` }}
                value={coordenadas}
                readOnly
              />
            </Row>
          </Row>
        )}
      </div>
      {/* IMAGEN, SVG. */}
      <div style={{ margin: "5vh 0 5vh" }}>
        <div
          style={{
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            position: "relative",
            margin: "0 auto",
          }}
        >
          <img
            src={"/azeroth-map.jpg"}
            alt="Mapa"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              boxShadow: "4px 4px 4px 4px rgba(0, 0, 0, 0.4)",
            }}
          />
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            onClick={editMode ? handleSvgClick : undefined}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "auto",
            }}
          >
            {editMode && (
              <>
                <polygon
                  points={getPolygonPointsString()}
                  stroke="red"
                  strokeWidth="2"
                  fill="none"
                />
                {calcularPuntosAbsolutos().map((coord, index) => {
                  if (index % 2 === 0) {
                    return (
                      <circle
                        key={`point-${index}`}
                        cx={coord}
                        cy={calcularPuntosAbsolutos()[index + 1]}
                        r="5"
                        fill="blue"
                      />
                    );
                  }
                  return null;
                })}
              </>
            )}
            {/* Dibuja los polígonos de los lotes existentes */}
            {!editMode &&
              lotes.map((lote) => {
                const puntos = getPolygonPointsFromLote(
                  lote.coordenadas,
                  imageWidth,
                  imageHeight
                );

                if (puntos) {
                  return (
                    <polygon
                      style={{ cursor: "pointer" }}
                      key={lote.id}
                      points={puntos}
                      stroke="green"
                      strokeWidth="2"
                      fill="rgba(0, 255, 0, 0.3)"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita interferencias con el SVG
                        handlePolygonClick(e, lote); // Abre el modal
                      }}
                    />
                  );
                }
                return null;
              })}
          </svg>
        </div>
      </div>
      {/* MODAL */}
      {show && (
        <div>
          <Modal
            title={"Datos del Lote"}
            open={show}
            onCancel={() => setShow(false)}
            width={320}
            footer={null}
          >
            <h1>{lote.superficie}</h1>
          </Modal>
        </div>
      )}
    </div>
  );
}
