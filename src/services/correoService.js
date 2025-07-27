const transporter = require("../config/mailer");
const { generarExcelAsistencia } = require("./excelService");

async function enviarCorreoConExcel(destinatario, datos) {
  const excelBuffer = await generarExcelAsistencia(datos);

  const mailOptions = {
    from: `"GeoAsistencia" <${process.env.GMAIL_USER}>`,
    to: Array.isArray(destinatario) ? destinatario.join(",") : destinatario,
    subject: `Reporte de Asistencia - Fecha: ${datos.historial.fecha} - Asignatura: ${datos.historial.nombre_asignatura} - Grupo: ${datos.historial.nombre_grupo}`,
    html: `
      <p>Hola,</p>
      <p>Adjunto encontrarás el <b>reporte de asistencia</b> correspondiente al grupo <b>${datos.historial.nombre_grupo}</b> de la asignatura <b>${datos.historial.nombre_asignatura}</b> del día <b>${datos.historial.fecha}</b>.</p>
      <p>Saludos,<br><b>GeoAsistencia App📍💙</b><br>geoasistenciaapp@gmail.com</p>
    `,
    attachments: [
      {
        filename: "reporte_asistencia.xlsx",
        content: excelBuffer,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  };

  transporter.sendMail(mailOptions);
  return { success: true, mensaje: "Correo enviado correctamente con Gmail" };
}

module.exports = { enviarCorreoConExcel };
