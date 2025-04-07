"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Col, Collapse, Row, Typography, Radio, Tooltip } from "antd";
const { Text } = Typography;

export default function Mapas() {
  return (
    <>
      <div style={{ marginTop: "15vh" }}>
        <Row justify={"center"}>
          <Link href={"/mapas/diez"} passHref>
            <Button
              style={{
                margin: "32px auto 32px",
                width: "300px",
                height: "120px",
                cursor: "pointer",
                boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Text
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "rgb(67, 141, 204)",
                }}
              >
                El Diez
              </Text>
            </Button>
          </Link>
        </Row>
        <Row justify={"center"}>
          <Link href={"/mapas/ranchito"} passHref>
            <Button
              style={{
                margin: "32px auto 32px",
                width: "300px",
                height: "120px",
                cursor: "pointer",
                boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Text
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "rgb(67, 141, 204)",
                }}
              >
                El Ranchito
              </Text>
            </Button>
          </Link>
        </Row>
      </div>
    </>
  );
}
