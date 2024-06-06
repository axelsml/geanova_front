"use client";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "@/contexts/loading";
import { usuario_id } from "@/helpers/user";

import { formatPrecio, FormatDate } from "@/helpers/formatters";
import {
  Button,
  Col,
  Collapse,
  Row,
  Typography,
  Form,
  Select,
  Modal,
  DatePicker,
  Tabs,
} from "antd";
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

import ventasService from "@/services/ventasService";
import terrenosService from "@/services/terrenosService";
import lotesService from "@/services/lotesService";
import pagosService from "@/services/pagosService";

export default function ReporteLotes() {
  return (
    <div className="p-8 grid gap-4">
      <Row justify={"center"}>
        <Col
          xs={24}
          sm={20}
          md={16}
          lg={12}
          xl={8}
          xxl={4}
          className="titulo_pantallas"
        >
          <b>INFORMACION DEL CLIENTE</b>
        </Col>
      </Row>
    </div>
  );
}
