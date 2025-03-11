"use client";

import { useState } from "react";
import { formatPrecio } from "@/helpers/formatters";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Col, Row, Typography } from "antd";

export default function TableInCol({ data }) {
  const { Text } = Typography;

  return (
    <Col className="tabla" style={{ margin: "12px" }}>
      {data && (
        <Row>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="tabla_encabezado">
                  <TableCell colSpan={4}>
                    <p style={{ textAlign: "center", fontWeight: "bold" }}>
                      {data.nombre_mes}
                    </p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                      Financiamiento
                    </p>
                  </TableCell>
                  <TableCell>
                    <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                      Clientes
                    </p>
                  </TableCell>
                  <TableCell>
                    <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                      Monto Proyectado
                    </p>
                  </TableCell>
                  <TableCell>
                    <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                      Termino Contrato
                    </p>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <p>Mensuales</p>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {data?.numero_solicitudes_mensuales}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    ${" "}
                    {formatPrecio(
                      parseFloat(data?.monto_solicitudes_mensuales)
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {data?.termina_contrato_solicitudes_mensuales}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <p>Quincenales</p>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {data?.numero_solicitudes_quincenales}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    ${" "}
                    {formatPrecio(
                      parseFloat(data?.monto_solicitudes_quincenales)
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {data?.termina_contrato_solicitudes_quincenales}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <p>Semanales</p>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {data?.numero_solicitudes_semanales}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    ${" "}
                    {formatPrecio(
                      parseFloat(data?.monto_solicitudes_semanales)
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {data?.termina_contrato_solicitudes_semanales}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <p style={{ fontWeight: "bold" }}>Total: </p>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {data?.total_solicitudes}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    $ {formatPrecio(parseFloat(data?.total_montos))}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {data?.total_contratos}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Row>
      )}
    </Col>
  );
}
