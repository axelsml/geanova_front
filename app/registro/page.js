"use client";
// import { useForm } from "react-hook-form";
// import InputCustom from "@/components/Input/Input";
// import * as yup from "yup"
// import { yupResolver } from '@hookform/resolvers/yup'
// import usuariosService from "@/services/usuariosService";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
     const router = useRouter()

    //  const schema = yup.object().shape({
    //       password: yup
    //         .string()
    //         .required('La contraseña es obligatoria')
    //         .min(8, 'La contraseña debe tener al menos 8 caracteres')
    //         .matches(
    //           /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]/,
    //           'La contraseña debe contener al menos una mayúscula, un número y un carácter especial'
    //         ),
    //       correo: yup
    //       .string()
    //       .required('El correo es obligatorio')
    //       .matches(
    //            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    //            'Correo inválido'
    //       ),
    //       usuario: yup
    //       .string()
    //       .nullable(true)
    //       .test('minLength', 'El usuario debe tener al menos 4 caracteres', (value) => {
    //            if (value === '') {
    //              return true; // No hay error si el campo está vacío
    //            }
    //            return value.length >= 4;
    //          })
    //     });


  // const onSubmit = async (userData) => {
  //    await usuariosService.createUser(userData, () => { router.push('/login')}, Error)
  // };

  return (
    <div className="flex justify-center p-8 h-screen items-center">
      <div className="w-1/2 max-w-md mx-auto p-6 m-7 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Registro de Usuario
        </h1>
        {/* <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <InputCustom
              name="correo"
              label="Correo"
              size="small"
              fullWidth
              register={register}
              registerProps={{
                required: { value: true, message: "Correo Requerido" },
                pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Correo inválido',
                  }
              }}
              errors={errors}
            />
          </div>
          <div className="mb-4">
            <InputCustom
              name="usuario"
              label="Usuario"
              size="small"
              fullWidth
              register={register}
              registerProps={{
                required: { value: true, message: "Usuario Requerido" },
                minLength: {
                  value: 4,
                  message: "Usuario debe tener al menos 4 carácteres",
                },
              }}
              errors={errors}
            />
          </div>
          <div className="mb-4">
            <InputCustom
              name="password"
              size="small"
              fullWidth
              label="Contraseña"
              register={register}
              registerProps={{
                required: { value: true, message: "Contraseña Requerida" },
                minLength: {
                  value: 4,
                  message: "Contraseña debe tener un minímo de 4 carácteres",
                },
              }}
              errors={errors}
              type="password"
            />
          </div>
          <div className="w-100 flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Registrar
            </button>
          </div>
        </form> */}
      </div>
    </div>
  );
}
