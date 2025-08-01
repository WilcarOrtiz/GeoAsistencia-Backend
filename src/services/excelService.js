const ExcelJS = require("exceljs");

async function generarExcelAsistencia(datos) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reporte");
  
  const headerStyle = {
    font: { bold: true, color: { argb: "FFFFFFFF" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF4CAF50" } }, 
    border: {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    },
    alignment: { horizontal: "center", vertical: "middle" },
  };

  worksheet.addRow(["Asignatura","Código","Grupo","Código","Fecha","Semestre","Docente","Tema de clase"]);
  const rowHistorial = worksheet.addRow([
    datos.historial.nombre_asignatura,
    datos.historial.codigo_asignatura,
    datos.historial.nombre_grupo,
    datos.historial.codigo_grupo,
    datos.historial.fecha,
    datos.historial.semestre,
    datos.historial.docente,
    datos.historial.tema,
  ]);

  rowHistorial.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });

  worksheet.getRow(1).eachCell((cell) => (cell.style = headerStyle));
  worksheet.addRow(["Lista de Asistencia"]).eachCell((cell) => (cell.style = headerStyle));
  worksheet.mergeCells("A3:F3");

  const headers = [
    "Identificación",
    "Nombres",
    "Apellidos",
    "Correo",
    "Hora",
    "Estado Asistencia"
  ];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => (cell.style = headerStyle));

  datos.lista.forEach((est) => {
    const row = worksheet.addRow([
      est.identificacion,
      est.nombres,
      est.apellidos,
      est.correo,
      est.hora,
      est.estado_asistencia ? "ASISTIÓ" : "NO ASISTIÓ",
    ]);

    const estadoCell = row.getCell(6);
      if (est.estado_asistencia) {

      estadoCell.style = {
      font: { color: { argb: "FF388E3C" }, bold: true },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFC8E6C9" } } 
    };
    } else {
      estadoCell.style = {
        font: { color: { argb: "FFD32F2F" }, bold: true },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFCDD2" } }
      };
    }
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });
  });

  worksheet.columns.forEach((col) => {
    col.width = 20;
  });

  return await workbook.xlsx.writeBuffer();
}

module.exports = { generarExcelAsistencia };
