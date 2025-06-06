"use client";

import { Card, Row, Col, Button } from "antd";
import { BiBuildings, BiCart, BiMoneyWithdraw, BiUser } from "react-icons/bi";
import { TbReport } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import { usuario_id } from "@/helpers/user";
import { useEffect, useState } from "react";
import { getCookie, expiredCookie, removeCookies } from "@/helpers/Cookies";
export default function Home() {
  const [cookieMenu, setCookieMenu] = useState([]);
  useEffect(() => {
    const cookieMenu = getCookie("menu");
    cookieMenu
      .then((cookie) => {
        setCookieMenu(JSON.parse(cookie.value));
      })
      .catch((error) => {
        console.error("Error al obtener la cookie1:", error); // Manejar cualquier error
      });
  }, []);

  const terreno = cookieMenu.filter((item) => item.descripcion === "Terreno");
  const ventas = cookieMenu.filter((item) => item.descripcion === "Ventas");
  const clientes = cookieMenu.filter((item) => item.descripcion === "Clientes");
  const recursos = cookieMenu.filter((item) => item.descripcion === "Recursos");
  const reportes = cookieMenu.filter((item) => item.descripcion === "Reportes");
  const configuracion = cookieMenu.filter(
    (item) => item.descripcion === "Configuracion"
  );
  const mapas = cookieMenu.filter((item) => item.descripcion === "Mapas");

  return (
    <div className="menu">
      <Row justify={"center"}>
        <Image
          src={"/geanova.svg"}
          width={500}
          height={100}
          priority
          alt="Logo Geanova"
        />
      </Row>
      <Row gutter={[16, 16]} wrap>
        {terreno[0]?.descripcion === "Terreno" && (
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link key={"TerrenosCrear"} href={"/terrenos/crear"}>
              <Card hoverable>
                <div>
                  <Row justify={"center"}>
                    <Image
                      src={"/icono terreno.svg"}
                      width={200}
                      height={200}
                      priority
                      alt="Logo Terreno"
                    />
                  </Row>
                  <Row justify={"center"}>
                    <p className="text-lg text-center">Terreno</p>
                  </Row>
                </div>
              </Card>
            </Link>
          </Col>
        )}
        {ventas[0]?.descripcion === "Ventas" && (
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link key={"Ventas"} href={"/ventas"}>
              <Card hoverable>
                <div>
                  <Row justify={"center"}>
                    <Image
                      src={"/icono ventas.svg"}
                      width={200}
                      height={200}
                      priority
                      alt="Logo Ventas"
                    />
                  </Row>
                  <Row justify={"center"}>
                    <p className="text-lg text-center">Ventas</p>
                  </Row>
                </div>
              </Card>
            </Link>
          </Col>
        )}
        {clientes[0]?.descripcion === "Clientes" && (
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link key={"clientes"} href={"/cliente"}>
              <Card hoverable>
                <div>
                  <Row justify={"center"}>
                    <Image
                      src={"/icono usuario.svg"}
                      width={200}
                      height={200}
                      priority
                      alt="Logo Usuario"
                    />
                  </Row>
                  <Row justify={"center"}>
                    <p className="text-lg text-center">Clientes</p>
                  </Row>
                </div>
              </Card>
            </Link>
          </Col>
        )}
        {recursos[0]?.descripcion === "Recursos" && (
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link key={"recursos"} href={"/recursos"}>
              <Card hoverable>
                <div>
                  <Row justify={"center"}>
                    <Image
                      src={"/icono recursos.svg"}
                      width={200}
                      height={200}
                      priority
                      alt="Logo Recursos"
                    />
                  </Row>
                  <Row justify={"center"}>
                    <p className="text-lg text-center">Recursos</p>
                  </Row>
                </div>
              </Card>
            </Link>
          </Col>
        )}
        {reportes[0]?.descripcion === "Reportes" && (
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link key={"Reportes"} href={"/reportes"}>
              <Card hoverable>
                <div>
                  <Row justify={"center"}>
                    <Image
                      src={"/icono reporte.svg"}
                      width={200}
                      height={200}
                      priority
                      alt="Logo Reportes"
                    />
                  </Row>
                  <Row justify={"center"}>
                    <p className="text-lg text-center">Reportes</p>
                  </Row>
                </div>
              </Card>
            </Link>
          </Col>
        )}
        {configuracion[0]?.descripcion === "Configuracion" && (
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link key={"Configuracion"} href={"/configuracion"}>
              <Card hoverable>
                <div>
                  <Row justify={"center"}>
                    <Image
                      src={"/icono configuracion.svg"}
                      width={200}
                      height={200}
                      priority
                      alt="Logo Configuracion"
                    />
                  </Row>
                  <Row justify={"center"}>
                    <p className="text-lg text-center">Configuración</p>
                  </Row>
                </div>
              </Card>
            </Link>
          </Col>
        )}

        {/* <Col xs={24} sm={12} md={8} lg={6}>
          <Link key={"Mapas"} href={"/mapas"}>
            <Card hoverable>
              <div>
                <Row justify={"center"}>
                  <Image
                    src={"/icono terreno.svg"}
                    width={200}
                    height={200}
                    priority
                    alt="Logo Mapas"
                  />
                </Row>
                <Row justify={"center"}>
                  <p className="text-lg text-center">Mapas</p>
                </Row>
              </div>
            </Card>
          </Link>
        </Col> */}
      </Row>
    </div>
  );
}
