import http from "./axiosService.js";
import axios from "axios";
import Swal from "sweetalert2";

class RecursosService {
  //Dépositos
  getDepositos(
    params,
    callbackMessage,
    callbackResumen,
    callback,
    callbackResumen2,
    callback2,
    callbackResumenId,
    error
  ) {
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
          callbackResumen(
            response.data.movimientosAlonso,
            response.data.dataResumen,
            response.data.resumenOtrosAbonos,
            response.data.resumenOtrosCargos,
            response.data.resumenConciliados
          ),
          callback(response.data.movimientosAlonso),
          callbackResumen2(response.data.movimientosSucursal),
          callback2(response.data.movimientosSucursal),
          callbackResumenId(
            response.data.resumenMovimientosId,
            response.data.resumenOtrosAbonosId,
            response.data.resumenOtrosCargosId,
            response.data.resumenConciliadosId
          ),
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
              text: `Error Handled1: ${response}`,
            });
          }
        } catch (err) {
          console.error("Error Handled", err);
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Error Handled2: ${err}`,
          });
        }
      });
  }
  //tipo movimiento
  showTipoMovimiento(callback, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("showTipoMovimiento", { cancelToken: call.token })
      .then((response) => {
        if (response.data.type === "error") {
          error(response.data);
          return;
        }
        return Promise.all([callback(response.data)]);
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
  showTipoMovimientoSearch(descripcion, callback, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get(`showTipoMovimiento/${descripcion}`, {
        cancelToken: call.token,
      })
      .then((response) => {
        if (response.data.type === "error") {
          error(response.data);
          return;
        }
        return Promise.all([callback(response.data)]);
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
  createTipoMovimiento(callback, params, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("createTipoMovimiento", params, { cancelToken: call.token })
      .then((response) => {
        return callback(response.data);
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
  destroyTipoMovimiento(callback, id, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .delete(`destroyTipoMovimiento/${id}`, { cancelToken: call.token })
      .then((response) => {
        return callback(response.data);
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

  updateTipoMovimiento(callback, params, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("updateTipoMovimiento", params, { cancelToken: call.token })
      .then((response) => {
        return callback();
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

  getIManejo(params, callback, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("getIManejo", { params }, { cancelToken: call.token })
      .then((response) => {
        if (response.data.type === "error") {
          error(response.data);
          return;
        }

        return Promise.all([callback(response.data)]);
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
              text: `Error Handled1: ${response}`,
            });
          }
        } catch (err) {
          console.error("Error Handled1", err);
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Error Handled2: ${err}`,
          });
        }
      });
  }

  showTipoMovimientoManejo(callback, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("showTipoMovimientoManejo", { cancelToken: call.token })
      .then((response) => {
        if (response.data.type === "error") {
          error(response.data);
          return;
        }
        return Promise.all([callback(response.data)]);
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
  showTipoMovimientoManejoSearch(descripcion, callback, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get(`showTipoMovimientoManejo/${descripcion}`, {
        cancelToken: call.token,
      })
      .then((response) => {
        if (response.data.type === "error") {
          error(response.data);
          return;
        }
        return Promise.all([callback(response.data)]);
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

  createTipoMovimientoManejo(callback, params, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("createTipoMovimientoManejo", params, { cancelToken: call.token })
      .then((response) => {
        return callback(response.data);
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

  destroyTipoMovimientoManejo(callback, id, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .delete(`destroyTipoMovimientoManejo/${id}`, { cancelToken: call.token })
      .then((response) => {
        return callback(response.data);
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

  updateTipoMovimientoManejo(callback, params, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("updateTipoMovimientoManejo", params, { cancelToken: call.token })
      .then((response) => {
        return callback();
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

  agregarCargo(callback, params, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("agregarCargo", params, { cancelToken: call.token })
      .then((response) => {
        return callback(response.data);
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

  getAnticipos(params, callback, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("getAnticipos", { params }, { cancelToken: call.token })
      .then((response) => {
        if (response.data.type === "error") {
          error(response.data);
          return;
        }

        return Promise.all([callback(response.data)]);
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
              text: `Error Handled1: ${response}`,
            });
          }
        } catch (err) {
          console.error("Error Handled1", err);
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Error Handled2: ${err}`,
          });
        }
      });
  }

  cambiarAnticipo(params, callback, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("cambiarAnticipo", params, { cancelToken: call.token })
      .then((response) => {
        return callback(response.data);
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

  guardarMovimientosTarjetas(params, callback, error) {
    var call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("guardarMovimientosTarjetas", params, {
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

  agregarTarjeta(params, callback, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("agregarTarjeta", params, { cancelToken: call.token })
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
  showTarjeta(callback, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("showTarjetas", { cancelToken: call.token })
      .then((response) => {
        if (response.data.type === "error") {
          error(response.data);
          return;
        }
        return Promise.all([callback(response.data)]);
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
  showTarjetaSearch(descripcion, callback, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get(`showTarjetas/${descripcion}`, {
        cancelToken: call.token,
      })
      .then((response) => {
        if (response.data.type === "error") {
          error(response.data);
          return;
        }
        return Promise.all([callback(response.data)]);
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
  updateTarjeta(callback, params, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("updateTarjeta", params, { cancelToken: call.token })
      .then((response) => {
        return callback(response.data);
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

  showTipoMovimientoTarjeta(callback, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("showTipoMovimientoTarjeta", { cancelToken: call.token })
      .then((response) => {
        if (response.data.type === "error") {
          error(response.data);
          return;
        }
        return Promise.all([callback(response.data)]);
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
  showTipoMovimientoTarjetaSearch(descripcion, callback, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get(`showTipoMovimientoTarjeta/${descripcion}`, {
        cancelToken: call.token,
      })
      .then((response) => {
        if (response.data.type === "error") {
          error(response.data);
          return;
        }
        return Promise.all([callback(response.data)]);
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

  createTipoMovimientoTarjeta(callback, params, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("createTipoMovimientoTarjeta", params, { cancelToken: call.token })
      .then((response) => {
        return callback(response.data);
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

  destroyTipoMovimientoTarjeta(callback, id, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .delete(`destroyTipoMovimientoTarjeta/${id}`, { cancelToken: call.token })
      .then((response) => {
        return callback(response.data);
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
  getMovimientosTarjetas(params, callback, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .get("getMovimientosTarjetas", { params }, { cancelToken: call.token })
      .then((response) => {
        if (response.data.type === "error") {
          error(response.data);
          return;
        }

        return Promise.all([callback(response.data)]);
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
              text: `Error Handled1: ${response}`,
            });
          }
        } catch (err) {
          console.error("Error Handled1", err);
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Error Handled2: ${err}`,
          });
        }
      });
  }

  updateTipoMovimientoTarjeta(callback, params, error) {
    let call;
    if (call) {
      call.cancel();
    }
    const CancelToken = axios.CancelToken;
    call = CancelToken.source();
    return http
      .post("updateTipoMovimientoTarjeta", params, { cancelToken: call.token })
      .then((response) => {
        console.log("response; ", response);
        return callback();
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
