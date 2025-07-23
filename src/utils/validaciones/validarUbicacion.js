function calcularDistanciaHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function validarUbicacion(latitud, longitud) {
  const UNIVERSIDAD = { lat: 10.451236, lon: -73.261181 };
  const RADIO_GEOCERCA = 100; // metros

  const distancia = calcularDistanciaHaversine(
    UNIVERSIDAD.lat,
    UNIVERSIDAD.lon,
    latitud,
    longitud
  );

  return distancia <= RADIO_GEOCERCA;
}

module.exports = { validarUbicacion };
