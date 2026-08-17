import http from "./axiosService.js";
import axios from "axios";
import Swal from "sweetalert2";

// ============================================================
// CANCEL TOKEN
// Se declara afuera para poder cancelar la petición anterior.
// ============================================================

let getImagenesLoteCall = null;

const imagenesService = {

  // ==========================================================
  // LISTAR IMÁGENES DEL LOTE
  // ==========================================================

  getImagenesLote(params, callback, error) {

    if (getImagenesLoteCall) {
      getImagenesLoteCall.cancel(
        "Nueva petición de imágenes"
      );
    }

    const CancelToken = axios.CancelToken;

    getImagenesLoteCall =
      CancelToken.source();

    return http
      .get(
        "get_imagenes_lotes",
        {
          params: params,

          cancelToken:
            getImagenesLoteCall.token,
        }
      )
      .then((response) => {

        if (
          !response.data ||
          response.data.success === false
        ) {

          if (error) {
            error(response.data);
          }

          return;
        }

        if (callback) {
          return callback(
            response.data
          );
        }

        return response.data;

      })
      .catch((response) => {

        if (axios.isCancel(response)) {

          console.log(
            "Petición de imágenes cancelada"
          );

          return;
        }

        console.error(
          "Error getImagenesLote:",
          response
        );

        if (error) {
          error(response);
        }

        return Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            "No fue posible obtener las imágenes del lote.",
        });

      });
  },


  // ==========================================================
  // CREAR
  // ==========================================================

  createImagen(
    formData,
    callback,
    error
  ) {

    return http
      .post(
        "crear_imagen_lote",
        formData
      )
      .then((response) => {

        if (
          !response.data ||
          response.data.success === false
        ) {

          if (error) {
            error(response.data);
          }

          return;
        }

        if (callback) {
          return callback(
            response.data
          );
        }

        return response.data;

      })
      .catch((response) => {

        console.error(
          "Error createImagen:",
          response
        );

        if (error) {
          error(response);
        }

      });
  },


  // ==========================================================
  // ACTUALIZAR
  // ==========================================================

  updateImagen(
    id,
    formData,
    callback,
    error
  ) {

    return http
      .put(
        `actualizar_imagen_lote/${id}`,
        formData
      )
      .then((response) => {

        if (
          !response.data ||
          response.data.success === false
        ) {

          if (error) {
            error(response.data);
          }

          return;
        }

        if (callback) {
          return callback(
            response.data
          );
        }

        return response.data;

      })
      .catch((response) => {

        console.error(
          "Error updateImagen:",
          response
        );

        if (error) {
          error(response);
        }

      });
  },


  // ==========================================================
  // ELIMINAR
  // ==========================================================

  deleteImagen(
    id,
    callback,
    error
  ) {

    return http
      .delete(
        `eliminar_imagen_lote/${id}`
      )
      .then((response) => {

        if (
          !response.data ||
          response.data.success === false
        ) {

          if (error) {
            error(response.data);
          }

          return;
        }

        if (callback) {
          return callback(
            response.data
          );
        }

        return response.data;

      })
      .catch((response) => {

        console.error(
          "Error deleteImagen:",
          response
        );

        if (error) {
          error(response);
        }

      });
  },

};

export default imagenesService;