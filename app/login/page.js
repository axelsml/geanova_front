"use client";
import usuariosService from "@/services/usuariosService";
import { redirect, useRouter } from "next/navigation";
import InputIn from "@/components/Input";
import { Form, Button, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { assignCookie } from "./Cookie";
import { LoadingContext } from "@/contexts/loading";
import Image from "next/image";
import { usuario_id } from "@/helpers/user";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    console.log("usuario "+usuario_id);
    debugger
    console.log("usuario_id != null = "+usuario_id != null);
    if (usuario_id != null) {
      router.push("/");
    }
  }, []);


  const { setIsLoading } = useContext(LoadingContext);

  const onLoginUsuario = (credenciales) => {
    setIsLoading(true);
    usuariosService.authUser(credenciales, onUsuarioLoaded, onError);
  };

  const onUsuarioLoaded = async (data) => {
    setIsLoading(false);

    if (data.success) {
      await assignCookie("usuario", JSON.stringify(data.success));
      await localStorage.setItem("usuario", JSON.stringify(data.user));
      router.push("/");
    } else {
      setIsLoading(false);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: data.message,
        confirmButtonColor: "#4096ff",
        cancelButtonColor: "#ff4d4f",
        showDenyButton: true,
        confirmButtonText: "Aceptar",
      });
    }
  };

  const onError = () => {
    setIsLoading(false);
    Swal.fire({
      title: "Error",
      icon: "error",
      text: data.message,
      confirmButtonColor: "#4096ff",
      cancelButtonColor: "#ff4d4f",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
    });
  };

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="w-1/2 max-w-md mx-auto p-6 m-7 bg-white rounded-lg shadow-md">
        <Row justify={"center"}>
          <Image
            src="/geanova.svg"
            alt="Geanova Logo"
            width={260}
            height={260}
            priority
          />
        </Row>

        <h1 className="text-2xl font-semibold mb-4 text-center">
          Iniciar Sesión
        </h1>
        <Form
          name="basic"
          onFinish={onLoginUsuario}
          autoComplete="off"
          className="grid gap-1"
          layout="vertical"
        >
          <InputIn
            placeholder="Ingrese un Nombre de Usuario"
            name="nickname"
            label="Usuario"
            rules={[
              {
                required: true,
                message: "Usuario es requerido",
              },
            ]}
          />

          <InputIn
            placeholder="Ingrese su Contraseña"
            name="password"
            label="Contraseña"
            type="password"
            rules={[
              {
                required: true,
                message: "Contraseña es requerida",
              },
            ]}
          />

          <span className="flex gap-2 justify-center">
            <Button htmlType="submit" size="large">
              Log In
            </Button>
          </span>
        </Form>
      </div>
    </div>
  );
}
