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
}

export default new RecursosService();
