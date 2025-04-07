import React, { useState, useRef, useEffect } from "react";
import { Button, Input } from "antd";

export default function CoordinateEditor({
  imageUrl,
  imageWidth,
  imageHeight,
}) {
  const [puntos, setPuntos] = useState([]);
  const [coordenadas, setCoordenadas] = useState("");
  const svgRef = useRef(null);

  const handleSvgClick = (e) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;

    const newPoints = [...puntos, relativeX, relativeY];
    setPuntos(newPoints);
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
    console.log(`PUNTOS ${puntos}  COOREDENADAS ${coordenadas}`);
    setPuntos([]);
    setCoordenadas("");
  };

  const getPolygonPointsString = () => {
    return puntos
      .reduce((acc, val, idx) => {
        if (idx % 2 === 0) {
          return acc + `${val * imageWidth},`;
        } else {
          return acc + `${val * imageHeight} `;
        }
      }, "")
      .trim();
  };

  return (
    <div>
      <Input value={coordenadas} readOnly />
      <Button onClick={handleClear}>Limpiar</Button>
      <div style={{ width: imageWidth, height: imageHeight }}>
        <svg
          ref={svgRef}
          width={imageWidth}
          height={imageHeight}
          onClick={handleSvgClick}
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        >
          <polygon
            points={getPolygonPointsString()}
            stroke="red"
            strokeWidth={"2"}
            fill="none"
          />
          {puntos.map((coord, index) => {
            if (index % 2 === 0) {
              return (
                <circle
                  key={`point-${index}`}
                  cx={coord * imageWidth}
                  cy={puntos[index + 1] * imageHeight}
                  r="5"
                  fill="blue"
                />
              );
            }
            return null;
          })}
        </svg>
      </div>
    </div>
  );
}
