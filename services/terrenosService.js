import http from "./axiosService.js";
import axios from "axios";

class terrenosService {
  getTerrenos(callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("getTerrenos", { cancelToken: call.token })
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

  createTerreno(params, callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("createTerreno", params, {
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

  getTerrenosAll(callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("get_i_terrenos", { cancelToken: call.token })
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

  getReporteProyectos(params, callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("get_proyectos", { params: params }, { cancelToken: call.token })
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

  getTerreno(params, callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("get_terreno", { params: params }, { cancelToken: call.token })
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

  actualizarTerreno(params, callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("/terrenos/crear/editar", params, { cancelToken: call.token })
      .then((response) => {
        callback(response.data);
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

export default new terrenosService();
