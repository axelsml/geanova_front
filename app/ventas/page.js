"use client";

import { formatPrecio } from "@/helpers/formatters";
import VentaForm from "@/components/VentaForm";
import PagoForm from "@/components/PagoForm";
import ventasService from "@/services/ventasService";
import { Button, Col, Collapse, Row, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
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
import Swal from "sweetalert2";

export default function VentasCrear() {
  const [nuevaVenta, setNuevaVenta] = useState(false);
  const [nuevoPago, setNuevoPago] = useState(false);
  const [ventas, setVentas] = useState(null);
  const [changeState, setChangeState] = useState(false);
  const { setIsLoading } = useContext(LoadingContext);

  const onError = (e) => {
    setIsLoading(false);
    console.log(e);
  };

  return (
    <div className="p-8 grid gap-4">
    
      <Row justify={"center"}>
        <Col span={24}>
            <VentaForm
              setNuevaVenta={setNuevaVenta}
              setWatch={setChangeState}
              watch={changeState}
            />
        </Col>
      </Row>

     
    </div>
  );
}
