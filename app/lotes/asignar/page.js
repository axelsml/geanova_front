"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { Select, Row, Form, Button, InputNumber, Typography } from "antd";
import Swal from "sweetalert2";
import { LoadingContext } from "@/contexts/loading";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableFooter,
} from "@mui/material";
import lotesService from "@/services/lotesService";
import { formatPrecio } from "@/helpers/formatters";

export default function AsignarM2({ terrenoId }) {
  const { setIsLoading } = useContext(LoadingContext);
  const { Option } = Select;
  const [changeState, setChangeState] = useState(false);
  const prevChangeStateRef = useRef(changeState);
  const [lotes, setLotes] = useState(null);
  const [areaVendible, setAreaVendible] = useState(0);
  const [areaAsignada, setAreaAsignada] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    lotesService.getLoteByTerrenoId(
      terrenoId,
      (data) => {
        setLotes(data.lotes);
        setAreaVendible(data.area_vendible);
        setAreaAsignada(data.area_asignada);
      },
      onError
    );
  }, [terrenoId]);

  const onError = () => {};

  useEffect(() => {
    if (changeState !== prevChangeStateRef.current) {
      lotesService.getLoteByTerrenoId(
        terrenoId,
        (data) => {
          setLotes(data.lotes);
          setAreaVendible(data.area_vendible);
          setAreaAsignada(data.area_asignada);
        },
        onError
      );

      prevChangeStateRef.current = changeState;
    }
  }, [terrenoId, changeState]);

  function Lote({ lote, setWatch, watch }) {
    const { setIsLoading } = useContext(LoadingContext);
    const [estatus, setEstatus] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loteValue, setLote] = useState(lote);

    const isValidSurface = (surface) => {
      const pattern = /^\d+(\.\d+)?$/;
      return pattern.test(surface);
    };

    const handleSuperficieChange = (value) => {
      if (isValidSurface(value)) {
        setEstatus("");
        setErrorMessage("");
        setLote({ ...lote, superficie: value });
      } else {
        setEstatus("error");
        setErrorMessage("Superficie no válida");
      }
    };

    const onGuardarSuperficie = () => {
      Swal.fire({
        title: "Verifique que los datos sean correctos",
        icon: "info",
        html: `Superficie: ${loteValue.superficie} m<sup>2</sup>`,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          setIsLoading(true);
          lotesService.asignarSuperficie(
            loteValue,
            onSuperficieAsignada,
            onError
          );
        }
      });
    };

    const onSuperficieAsignada = (data) => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      if (data.success) {
        setWatch(!watch);
      }
    };

    return (
      <TableRow>
        <TableCell>{lote.numero}</TableCell>

        <TableCell align="center">
          <span className="mb-4">
            <InputNumber
              placeholder="Ingrese la Superficie del Lote en M2"
              className="m-0 w-3/4"
              name="superficie"
              label=""
              suffix={"M2"}
              status={estatus}
              value={lote.superficie}
              onChange={(e) => {
                handleSuperficieChange(e);
              }}
            />
            <p className="error-message">{errorMessage}</p>
          </span>
        </TableCell>
        <TableCell align="center">
          <Button
            htmlType="submit"
            size="large"
            disabled={loteValue.superficie === null}
            onClick={onGuardarSuperficie}
          >
            Asignar Superficie
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className="p-8 grid gap-8">
      <Row justify={"start"}>
        <h1>Asignación de Superficie</h1>
      </Row>

      <Row justify={"space-between"}>
        <Typography>
          Área Asignada: {formatPrecio(areaAsignada.toFixed(2))}
        </Typography>
        <Typography>
          Área por Asignar:{" "}
          {formatPrecio((areaVendible - areaAsignada).toFixed(2))}
        </Typography>
      </Row>

      {lotes && (
        <Row justify={"center"}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>N° de Lote</TableCell>
                  <TableCell>Superficie</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lotes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((lote, index) => (
                    <Lote
                      key={index}
                      lote={lote}
                      setWatch={setChangeState}
                      watch={changeState}
                    />
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={lotes?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Lotes por Página"
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Row>
      )}
    </div>
  );
}
