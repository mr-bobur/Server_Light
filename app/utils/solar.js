/**
 * NOAA Solar Calculation Algorithm
 * Accurately calculates astronomical Sunrise, Sunset and Solar Noon
 * based on Latitude, Longitude and Date.
 */

function calculateSunTimes(lat, lng, date = new Date(), timezoneOffsetHours = 5) {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Fractional year in radians
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (date.getHours() - 12) / 24);

  // Equation of time in minutes
  const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
                 - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));

  // Solar declination in radians
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
               - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
               - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);

  // Standard zenith for sunrise/sunset (90.833 degrees = 90 deg 50')
  const zenith = 90.833 * rad;
  const latRad = lat * rad;

  // Hour angle
  const cosH = (Math.cos(zenith) / (Math.cos(latRad) * Math.cos(decl))) - (Math.tan(latRad) * Math.tan(decl));

  if (cosH > 1) {
    return { polar: 'night', sunriseStr: '00:00:00', sunsetStr: '00:00:00' };
  }
  if (cosH < -1) {
    return { polar: 'day', sunriseStr: '00:00:00', sunsetStr: '23:59:59' };
  }

  const ha = Math.acos(cosH) * deg;

  // Solar noon in minutes from midnight UTC
  const solarNoonUTC = 720 - (4 * lng) - eqtime;
  const sunriseMinUTC = solarNoonUTC - (ha * 4);
  const sunsetMinUTC = solarNoonUTC + (ha * 4);

  // Convert to local minutes (UTC + timezoneOffsetHours)
  const sunriseMinLocal = (sunriseMinUTC + timezoneOffsetHours * 60 + 1440) % 1440;
  const sunsetMinLocal = (sunsetMinUTC + timezoneOffsetHours * 60 + 1440) % 1440;
  const noonMinLocal = (solarNoonUTC + timezoneOffsetHours * 60 + 1440) % 1440;

  const formatMin = (mins) => {
    const h = Math.floor(mins / 60);
    const m = Math.floor(mins % 60);
    const s = Math.floor((mins * 60) % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const todayStr = date.toISOString().substring(0, 10);
  const sunriseDate = new Date(`${todayStr}T${formatMin(sunriseMinLocal)}+05:00`);
  const sunsetDate = new Date(`${todayStr}T${formatMin(sunsetMinLocal)}+05:00`);

  const dayDurationMin = (sunsetMinLocal - sunriseMinLocal + 1440) % 1440;
  const dayDurationHours = Math.floor(dayDurationMin / 60);
  const dayDurationMinutes = Math.floor(dayDurationMin % 60);

  return {
    sunriseStr: formatMin(sunriseMinLocal),
    sunsetStr: formatMin(sunsetMinLocal),
    solarNoonStr: formatMin(noonMinLocal),
    dayLength: `${dayDurationHours} soat ${dayDurationMinutes} daqiqa`,
    sunriseDate,
    sunsetDate
  };
}

module.exports = {
  calculateSunTimes
};
