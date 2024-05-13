"use client";

import { Card,Row,Col } from "antd";
import { BiBuildings, BiCart, BiMoneyWithdraw, BiUser } from "react-icons/bi";
import {TbReport  } from "react-icons/tb";

import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Row gutter={[16, 16]} wrap>
        <Col span={8}>
          <Link key={"TerrenosCrear"} href={"/terrenos/crear"}>
            <Card hoverable>
              <div>
                <BiBuildings className="m-auto" size={"20px"} />
                <p className="text-lg text-center">Terreno</p>
              </div>
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link key={"Ventas"} href={"/ventas"}>
            <Card hoverable>
              <div>
                <BiCart className="m-auto" size={"20px"} />
                <p className="text-lg text-center">Ventas</p>
              </div>
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link key={"clientes"} href={"/cliente"}>
            <Card hoverable>
              <div>
                <BiUser className="m-auto" size={"20px"} />
                <p className="text-lg text-center">Clientes</p>
              </div>
            </Card>
          </Link>
        </Col>

     
      </Row>
      
      <Row gutter={[16, 16]} wrap>
        <Col span={8}>
          <Link key={"ReporteIngresos"} href={"/ingresos"}>
            <Card hoverable>
              <div>
                <TbReport className="m-auto" size={"20px"} />
                <p className="text-lg text-center">Ingresos</p>
              </div>
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link key={"recursos"} href={"/recursos"}>
            <Card hoverable>
              <div>
                <BiMoneyWithdraw className="m-auto" size={"20px"} />
                <p className="text-lg text-center">Recursos</p>
              </div>
            </Card>
          </Link>
        </Col>
      
      </Row>

    </div>
  );
}
