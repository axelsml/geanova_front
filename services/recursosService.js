import http from "./axiosService.js";
import axios from "axios";
import Swal from "sweetalert2";

class RecursosService {
  //Dépositos
  getDepositos(params, callbackMessage, callback, callback2, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("getIDepositos", { params }, { cancelToken: call.token })
      .then((response) => {
        if (response.data.type === "error") {
          error(response.data);
          return;
        }

        return Promise.all([
          callbackMessage({
            type: response.data.type,
            message: response.data.message,
          }),
          callback(response.data.movimientosAlonso),
          callback2(response.data.movimientosSucursal),
        ]);
      })
      .catch((response) => {
        try {
          if (axios.isCancel(response)) {
            console.log("Peticion Cancelada");
          } else {
            error(response);
            return Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `Error Handled: ${response}`,
            });
          }
        } catch (err) {
          console.error("Error Handled", err);
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Error Handled: ${err}`,
          });
        }
      });
  }
}

export default new RecursosService();
