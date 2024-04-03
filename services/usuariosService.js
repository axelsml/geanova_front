import http from "./axiosService.js";
import axios from "axios";

class usuariosService {
  createUser(params, callback, error) {
    Swal.fire({
      title: "Confirmación de registro",
      text: "¿Desea registrarse?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, guardar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Guardando...",
          didOpen: () => {
            Swal.showLoading();
          },
        });

        http
          .post("api/users/crear", params)
          .then((response) => {
            Swal.close();
            if (response.data.message) {
              Swal.fire({
                icon: "warning",
                title: "Advertencia",
                text: response.data.message,
              });
            } else {
              Swal.fire({
                icon: "success",
                title: "Registro Éxitoso",
                text: "Se ha registrado correctamente.",
              });
              callback(response.data);
            }
          })
          .catch((response) => {
            error(response.data);
            Swal.hideLoading();
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un error al registrarse.",
            });
          });
      }
    });
  }

  authUser(params, callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get(
        "iUsuariosSistema/login",
        { params },
        {
          cancelToken: call.token,
        }
      )
      .then((response) => {
        return callback(response.data);
      })
      .catch((response) => {
        try {
          if (axios.isCancel(response)) {
            console.log("Peticion Cancelada");
          } else {
            error(response.data);
          }
        } catch (err) {
          console.error("Error Handled", err);
        }
      });
  }

  buscarCliente(params, callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get(
        `iUsuarios/${params.folio_cliente}`,
        {
          cancelToken: call.token,
        }
      )
      .then((response) => {
        return callback(response.data);
      })
      .catch((response) => {
        try {
          if (axios.isCancel(response)) {
            console.log("Peticion Cancelada");
          } else {
            error(response.data);
          }
        } catch (err) {
          console.error("Error Handled", err);
        }
      });
  }
}
export default new usuariosService();
