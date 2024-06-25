import { removeCookies } from "@/helpers/Cookies";
import { useEffect } from "react";
// import useInactivity from "@/hooks/useInactivity";
import Swal from "sweetalert2";
function BackgroundTask() {
  // const isInactive = useInactivity(1800000); // Detecta inactividad después de tiempo establecido
  //1800000 = 30 min
  //60000 = 1 min

//   useEffect(() => {
//     if (isInactive) {
//       // Aquí puedes manejar la inactividad, por ejemplo, mostrando una alerta o cerrando la sesión
//       const storedUsuario = window.localStorage.getItem("usuario");
//       if (storedUsuario) {
//         const usuarioId = JSON.parse(storedUsuario).id;
//         if (usuarioId !== null) {
//           Swal.fire({
//             title: "Sesión cerrada debido a inactividad",
//             icon: "warning",
//             confirmButtonColor: "#4096ff",
//             showDenyButton: false,
//             confirmButtonText: "Aceptar",
//           }).then((result) => {
//             if (result.isConfirmed) {
//               onCerrarSesion();
//             }
//           });
//         }
//       }
//     }
//   }, [isInactive]);

//   return null; // Puedes devolver null o cualquier otro componente necesario
}

const onCerrarSesion = async () => {
  await localStorage.clear();
  await removeCookies("usuario");
  await removeCookies("menu");
  await removeCookies("token");
  window.location.href = "/login";
};

export default BackgroundTask;
