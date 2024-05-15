"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import  * as Ant from "antd/es/layout/layout";
import { BiHomeAlt2, BiExit  } from "react-icons/bi";
import { useEffect, useState } from "react";
import { removeCookies } from "@/app/login/Cookie";

import Image from "next/image";

export default function Header() {
  const pathname = usePathname();

  const [current, setCurrent] = useState(pathname);

  useEffect(() => {
    setCurrent(pathname);
  }, [pathname]);

  const onCerrarSesion = async () => {
    await localStorage.clear()
    await removeCookies('usuario')
    window.location.href = '/login';
  }

  const items = [
    {
      label: <Link href={"/"}>Inicio</Link>,
      icon: <BiHomeAlt2 />,
    },

    {
      label:"Cerrar Sesión",
      icon: <BiExit  />,
      onClick: onCerrarSesion
    },
  ];

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <>
      {!(pathname.includes("/login") || pathname.includes("/registro")) && (
        <Ant.Header className="p-4 flex items-center bg-inherit gap-10" style={{ position: 'relative' }}>
          {(pathname === "/") && (<>
          <Image src={"/fondo.png"} width={1000} height={600} layout="responsive" alt="Logo Geanova" style={{ position: 'absolute',left:0,top:0, zIndex: -1 }} />
          </>)}
          {!(pathname === "/") && (<>
            <Image src={"/geanova.svg"} width={200} height={10} style={{marginTop:"50px"}} priority alt="Logo Geanova"/>
          </>)}


          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            className="flex-1 justify-end border-0"
            items={items}
            style={{ background: 'transparent', border: 'none' }}
          >
            </Menu>
        </Ant.Header>

      )}
    </>
  );
}
