const fs = require('fs');
const XLSX = require('xlsx');

// Función para convertir grados a radianes
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Generarador de nodos
function generateShapeNodes(lat, lon, distance, sides) {
  const earthRadius = 6371000; 
  const nodes = [];

  for (let i = 0; i < sides; i++) {
      const angle = (i * 360 / sides);
      const angleRad = degreesToRadians(angle);
      
      const dLat = distance * Math.cos(angleRad) / earthRadius;
      const dLon = distance * Math.sin(angleRad) / (earthRadius * Math.cos(degreesToRadians(lat)));

      const newLat = lat + dLat * (180 / Math.PI);
      const newLon = lon + dLon * (180 / Math.PI);

      nodes.push([newLon, newLat]);
  }

  // Cierra el poligono
  nodes.push(nodes[0]);

  return nodes;
}

// Lee archivo Excel y genera un archivo GeoJSON
function convertExcelToGeoJSON(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

  // La primera fila contiene el encabezado
  const rows = worksheet.slice(1);

  const features = rows.map(row => {
      const lat = parseFloat(row[0]);
      const lon = parseFloat(row[1]);
      const distance = parseFloat(row[2]);
      const shape = row[3].toLowerCase();

      let sides;
      switch (shape) {
          case 'triangulo':
              sides = 3;
              break;
          case 'pentagono':
              sides = 5;
              break;
          case 'octagono':
              sides = 8;
              break;
          case 'circulo':
          default:
              sides = 20;
              break;
      }

      const coordinates = generateShapeNodes(lat, lon, distance, sides);
      return {
          type: 'Feature',
          geometry: {
              type: 'Polygon',
              coordinates: [coordinates]
          },
          properties: {
              shape: shape,
              distance: distance
          }
      };
  });

  // Crear GeoJSON
  const geojsonData = {
      type: 'FeatureCollection',
      features: features
  };

  // Guardar GeoJSON 
  const outputFilePath = 'output.geojson';
  fs.writeFileSync(outputFilePath, JSON.stringify(geojsonData, null, 2));
  console.log(`Archivo GeoJSON guardado en ${outputFilePath}`);
}

// Archivo Excel
const excelFile = 'sample.xlsx';
convertExcelToGeoJSON(excelFile);