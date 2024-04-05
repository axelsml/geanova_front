import http from "./axiosService.js";
import axios from "axios";

class plazosService {
  getPlazos(params, callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("getIPlazos", { params }, { cancelToken: call.token })
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

  createPlazo(params, callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("createPlazo", params, {
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

  editarPlazo(params, callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("editarPlazo", params, {
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

export default new plazosService();
