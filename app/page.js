"use client";

import { Card } from "antd";
import { BiBuildings, BiCart } from "react-icons/bi";
import Link from "next/link";

export default function Home() {
  return (
    <main className="m-auto w-1/2 h-screen grid gap-4 items-center justify-center grid-cols-2 grid-rows-2">
      <Link key={"TerrenosCrear"} href={"/terrenos/crear"}>
        <Card hoverable>
          <div>
            <BiBuildings className="m-auto" size={"20px"} />
            <p className="text-lg text-center">Terreno</p>
          </div>
        </Card>
      </Link>

      <Link key={"Ventas"} href={"/ventas"}>
        <Card hoverable>
          <div>
            <BiCart className="m-auto" size={"20px"} />
            <p className="text-lg text-center">Ventas</p>
          </div>
        </Card>
      </Link>
    </main>
  );
}
