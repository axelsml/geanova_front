export const formatDateHours = (date) => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

//Se suman siete horas en hora de misa y llegada a jardin. Inhumaciones
export const sumarSieteHoras = (date) => {
  var hours = date.getHours() + 7;
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

export const fecha_hoy = () => {
  var x = new Date();
  var y = x.getFullYear().toString();
  var m = (x.getMonth() + 1).toString();
  var d = x.getDate().toString();
  d.length == 1 && (d = "0" + d);
  m.length == 1 && (m = "0" + m);
  var yyyymmdd = y + "-" + m + "-" + d;
  return yyyymmdd;
};

export const fecha_dia_anterior = () => {
  var x = new Date();
  var y = x.getFullYear().toString();
  var m = (x.getMonth() + 1).toString();
  var d = (x.getDate() - 1).toString();
  d.length == 1 && (d = "0" + d);
  m.length == 1 && (m = "0" + m);
  var yyyymmdd = y + "-" + m + "-" + d;
  return yyyymmdd;
};

export const fecha_mes_anterior = () => {
  var x = new Date();
  if (x.getMonth() == 0) {
    var y = (x.getFullYear() - 1).toString();
    var m = "12";
  } else {
    var y = x.getFullYear().toString();
    var m = x.getMonth().toString();
  }
  var d = x.getDate().toString();
  d.length == 1 && (d = "0" + d);
  m.length == 1 && (m = "0" + m);
  var yyyymmdd = y + "-" + m + "-" + d;
  return yyyymmdd;
};

export const formatPrecio = (value) => `${value.toLocaleString("es-MX")}`;

export const fechaFormateada = (value) => {
  let fecha = new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));

  return fecha;
};

export const formatPrecio2 = (value) => `${value.toFixed(2)}`;

export const FormatDate = (date) => {
  var aux, months, newDate, dias, diaNumero;
  months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  diaNumero = new Date(date + "T00:00").getDay();

  if (date == null) {
    date = "";
  }
  aux = date.split("-");

  newDate =
    date == ""
      ? ""
      : dias[diaNumero] + " " + aux[2] + " de " + months[aux[1] - 1];
  return newDate;
};

export const getNombreMes = (numeroMes) => {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  if (numeroMes >= 1 && numeroMes <= 12) {
    return meses[numeroMes - 1];
  } else {
    return "Mes inválido";
  }
};

export const fileToBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.onloadend = function () {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
};

export function obtenerDia(fecha) {
  var partes = fecha.split("-");
  return partes[2];
}

export function getInicioDelMes() {
  let fecha = new Date();
  let primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  return primerDia.toISOString().split("T")[0];
}

export function getFinDelMes() {
  let fecha = new Date();
  let ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
  return ultimoDia.toISOString().split("T")[0];
}

export function calcularSemanas(meses) {
  // Calcular las semanas como un número decimal
  let semanas = meses * 4.34524;

  // Redondear las semanas al número entero más cercano
  let semanasRedondeadas;
  if (semanas - Math.floor(semanas) < 0.6) {
    semanasRedondeadas = Math.floor(semanas);
  } else {
    semanasRedondeadas = Math.ceil(semanas);
  }

  // Devolver las semanas redondeadas
  return semanasRedondeadas;
}

export function formatDate(obj) {
  var year = obj.$y;
  var month = obj.$M + 1; // Los meses en JavaScript comienzan desde 0
  var day = obj.$D;

  // Asegurarse de que el mes y el día sean de dos dígitos
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  return year + "-" + month + "-" + day;
}
