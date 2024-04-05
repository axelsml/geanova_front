import http from "./axiosService.js";
import axios from "axios";

class pagosService {
  getSistemasPago(callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("iPagos/sistemas_pago", { cancelToken: call.token })
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

  getTipoPagos(callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("iPagos/tipo_pagos", { cancelToken: call.token })
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

  createPago(params, callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("iPagos/crear", params, {
        cancelToken: call.token,
      })
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

export default new pagosService();
