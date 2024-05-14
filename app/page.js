"use client";

import { Card,Row,Col } from "antd";
import { BiBuildings, BiCart, BiMoneyWithdraw, BiUser } from "react-icons/bi";
import {TbReport  } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="menu">
      <Row justify={"center"}>
      <Image src={"/geanova.svg"} width={500} height={100} priority alt="Logo Geanova"/>
      </Row>
      <Row gutter={[16, 16]} wrap>
        <Col span={8}>
          <Link key={"TerrenosCrear"} href={"/terrenos/crear"}>
            <Card hoverable>
              <div>
              <Row justify={"center"}>
                <Image src={"/icono terreno.svg"} width={200} height={200} priority alt="Logo Terreno"/>
                </Row>
                <Row justify={"center"}>
                <p className="text-lg text-center">Terreno</p>
                </Row>
              </div>
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link key={"Ventas"} href={"/ventas"}>
            <Card hoverable>
              <div>
                <Row justify={"center"}>
                <Image src={"/icono ventas.svg"} width={200} height={200} priority alt="Logo Ventas"/>
                </Row>
                <Row justify={"center"}>
                <p className="text-lg text-center">Ventas</p>
                </Row>

              </div>
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link key={"clientes"} href={"/cliente"}>
            <Card hoverable>
              <div>
              <Row justify={"center"}>
                <Image src={"/icono usuario.svg"} width={200} height={200} priority alt="Logo Usuario"/>
                </Row>
                <Row justify={"center"}>
                <p className="text-lg text-center">Clientes</p>
                </Row>
              </div>
            </Card>
          </Link>
        </Col>

     
      </Row>
      
      <Row gutter={[16, 16]} wrap style={{marginTop:"10px"}}>
        <Col span={8}>
          <Link key={"ReporteIngresos"} href={"/ingresos"}>
            <Card hoverable>
              <div>
              <Row justify={"center"}>
                <Image src={"/icono ingreso.svg"} width={200} height={200} priority alt="Logo Ingresos"/>
                </Row>
                <Row justify={"center"}>
                <p className="text-lg text-center">Ingresos</p>
                </Row>
              </div>
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link key={"recursos"} href={"/recursos"}>
            <Card hoverable>
              <div>
              <Row justify={"center"}>
                <Image src={"/icono recursos.svg"} width={200} height={200} priority alt="Logo Recursos"/>
                </Row>
                <Row justify={"center"}>
                <p className="text-lg text-center">Recursos</p>
                </Row>
              </div>
            </Card>
          </Link>
        </Col>
      
      </Row>

    </div>
  );
}
