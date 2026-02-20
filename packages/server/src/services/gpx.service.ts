import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../lib/errors.js';

export async function generateGPX(routeId: number): Promise<string> {
  const route = await prisma.route.findUnique({
    where: { id: routeId },
    include: {
      peak: true,
      waypoints: { orderBy: { orderIndex: 'asc' } },
    },
  });

  if (!route) throw new NotFoundError('Route');

  const now = new Date().toISOString();
  let geoJson: any = null;
  try {
    geoJson = route.geoJson ? JSON.parse(route.geoJson) : null;
  } catch {}

  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Summit Line"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(route.name)}</name>
    <desc>${escapeXml(route.description || `Route on ${route.peak.name}`)}</desc>
    <author><name>Summit Line</name></author>
    <time>${now}</time>
  </metadata>
`;

  // Waypoints
  for (const wp of route.waypoints) {
    gpx += `  <wpt lat="${wp.latitude}" lon="${wp.longitude}">
    <name>${escapeXml(wp.name || `Point ${wp.orderIndex + 1}`)}</name>
    <type>${escapeXml(wp.waypointType)}</type>
${wp.elevation ? `    <ele>${wp.elevation}</ele>\n` : ''}${wp.description ? `    <desc>${escapeXml(wp.description)}</desc>\n` : ''}  </wpt>
`;
  }

  // Track from GeoJSON
  if (geoJson && geoJson.coordinates && geoJson.coordinates.length > 0) {
    gpx += `  <trk>
    <name>${escapeXml(route.name)}</name>
    <trkseg>
`;
    for (const coord of geoJson.coordinates) {
      const [lon, lat, ele] = coord;
      gpx += `      <trkpt lat="${lat}" lon="${lon}">`;
      if (ele !== undefined && ele !== null) {
        gpx += `<ele>${ele}</ele>`;
      }
      gpx += `</trkpt>\n`;
    }
    gpx += `    </trkseg>
  </trk>
`;
  }

  gpx += `</gpx>`;
  return gpx;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
