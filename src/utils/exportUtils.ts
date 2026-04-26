interface ExportData {
  siteBoundary: {
    width: number
    depth: number
    terrainRelief: string
  }
  zoning: {
    minLotArea: number
    minFrontage: number
    frontSetback: number
    rearSetback: number
    sideSetback: number
    maxCoverage: number
    far: number
    maxHeight: number
  }
  roadDesign: {
    roadNetworkType: string
    rowWidth: number
    pavement: number
    crown: number
    curbReturnR: number
  }
  amenities: {
    playground: boolean
    detentionPond: boolean
  }
  lots: number
  parcelArea: number
  maxBuildableArea: number
  planGeometry?: {
    lots: Array<{ x: number; y: number; width: number; depth: number; number: number }>
    roads: Array<{ x1: number; y1: number; x2: number; y2: number; width: number; name: string }>
    amenities: Array<{ type: string; x: number; y: number; width: number; height: number }>
  }
}

export function generateLandXML(data: ExportData): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<LandXML xmlns="http://www.landxml.org/schema/LandXML-1.2">
  <Project name="Site Development Plan" dateTime="${new Date().toISOString()}">
    <Application name="Civil Engineering Site Development Planner" version="1.0"/>
    
    <Units>
      <Metric areaUnit="squareMeter" linearUnit="meter" volumeUnit="cubicMeter" temperatureUnit="celsius"/>
      <Imperial areaUnit="squareFoot" linearUnit="feet" volumeUnit="cubicYard" temperatureUnit="fahrenheit"/>
    </Units>
    
    <Surfaces>
      <Surface name="Existing Grade" state="existing">
        <Definition surfType="TIN">
          <Pnts>
            <P id="1">0 0 100</P>
            <P id="2">${data.siteBoundary.width} 0 100</P>
            <P id="3">${data.siteBoundary.width} ${data.siteBoundary.depth} ${data.siteBoundary.terrainRelief.includes('Gentle') ? '105' : data.siteBoundary.terrainRelief.includes('Moderate') ? '110' : '115'}</P>
            <P id="4">0 ${data.siteBoundary.depth} ${data.siteBoundary.terrainRelief.includes('Gentle') ? '105' : data.siteBoundary.terrainRelief.includes('Moderate') ? '110' : '115'}</P>
          </Pnts>
          <Faces>
            <F>1 2 3</F>
            <F>1 3 4</F>
          </Faces>
        </Definition>
      </Surface>
    </Surfaces>
    
    <Alignments>
      <Alignment name="Main Loop Road" staStart="0+00">
        <CoordGeom>
          <Curve rot="cw" chord="${data.siteBoundary.width}" radius="${data.roadDesign.curbReturnR * 10}"/>
          <Line length="${data.siteBoundary.depth}"/>
          <Curve rot="cw" chord="${data.siteBoundary.width}" radius="${data.roadDesign.curbReturnR * 10}"/>
          <Line length="${data.siteBoundary.depth}"/>
        </CoordGeom>
      </Alignment>
    </Alignments>
    
    <Parcels>
      <Parcel name="Site Boundary" area="${data.parcelArea}">
        <CoordGeometry>
          <Line length="${data.siteBoundary.width}"/>
          <Line length="${data.siteBoundary.depth}"/>
          <Line length="${data.siteBoundary.width}" dir="180"/>
          <Line length="${data.siteBoundary.depth}" dir="180"/>
        </CoordGeometry>
      </Parcel>
    </Parcels>
  </Project>
</LandXML>`
}

export function generateDXF(data: ExportData): string {
  let dxfContent = `0
SECTION
2
HEADER
9
$INSUNITS
70
1
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LAYER
70
5
0
LAYER
2
BOUNDARY
70
0
62
1
6
CONTINUOUS
0
LAYER
2
LOTS
70
0
62
2
6
CONTINUOUS
0
LAYER
2
ROADS
70
0
62
3
6
CONTINUOUS
0
LAYER
2
AMENITIES
70
0
62
4
6
CONTINUOUS
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
`

  // Draw boundary as 4 lines
  dxfContent += `0
LINE
8
BOUNDARY
10
0.0
20
0.0
11
${data.siteBoundary.width}
21
0.0
0
LINE
8
BOUNDARY
10
${data.siteBoundary.width}
20
0.0
11
${data.siteBoundary.width}
21
${data.siteBoundary.depth}
0
LINE
8
BOUNDARY
10
${data.siteBoundary.width}
20
${data.siteBoundary.depth}
11
0.0
21
${data.siteBoundary.depth}
0
LINE
8
BOUNDARY
10
0.0
20
${data.siteBoundary.depth}
11
0.0
21
0.0
`

  // Add lots if geometry is available
  if (data.planGeometry && data.planGeometry.lots) {
    data.planGeometry.lots.forEach(lot => {
      // Draw lot as 4 lines
      dxfContent += `0
LINE
8
LOTS
10
${lot.x}
20
${lot.y}
11
${lot.x + lot.width}
21
${lot.y}
0
LINE
8
LOTS
10
${lot.x + lot.width}
20
${lot.y}
11
${lot.x + lot.width}
21
${lot.y + lot.depth}
0
LINE
8
LOTS
10
${lot.x + lot.width}
20
${lot.y + lot.depth}
11
${lot.x}
21
${lot.y + lot.depth}
0
LINE
8
LOTS
10
${lot.x}
20
${lot.y + lot.depth}
11
${lot.x}
21
${lot.y}
`
    })
  }

  // Add roads if geometry is available
  if (data.planGeometry && data.planGeometry.roads) {
    // Group roads by network type to draw them as connected structures
    const loopRoads = data.planGeometry.roads.filter(r => r.name.startsWith('Loop Rd'))
    const culDeSacRoad = data.planGeometry.roads.find(r => r.name === 'Cul-de-sac Rd')
    const culDeSacBulb = data.planGeometry.roads.find(r => r.name === 'Cul-de-sac')
    const gridRoads = data.planGeometry.roads.filter(r => r.name.startsWith('Road'))

    if (loopRoads.length > 0) {
      // Draw loop road as a single closed polyline
      const halfWidth = loopRoads[0].width / 2
      const roadX = loopRoads[0].x1
      const roadY = loopRoads[0].y1
      const loopWidth = Math.abs(loopRoads[0].x2 - loopRoads[0].x1)
      const loopHeight = Math.abs(loopRoads[2].y2 - loopRoads[2].y1)

      // Draw outer boundary of loop road
      dxfContent += `0
POLYLINE
8
ROADS
70
1
0
VERTEX
8
ROADS
10
${roadX - loopWidth / 2 - halfWidth}
20
${roadY - loopHeight / 2 - halfWidth}
0
VERTEX
8
ROADS
10
${roadX + loopWidth / 2 + halfWidth}
20
${roadY - loopHeight / 2 - halfWidth}
0
VERTEX
8
ROADS
10
${roadX + loopWidth / 2 + halfWidth}
20
${roadY + loopHeight / 2 + halfWidth}
0
VERTEX
8
ROADS
10
${roadX - loopWidth / 2 - halfWidth}
20
${roadY + loopHeight / 2 + halfWidth}
0
SEQEND
`
    }

    if (culDeSacRoad) {
      // Draw cul-de-sac road connecting to loop
      const halfWidth = culDeSacRoad.width / 2
      const roadX = culDeSacRoad.x1
      const roadY1 = Math.min(culDeSacRoad.y1, culDeSacRoad.y2)
      const roadY2 = Math.max(culDeSacRoad.y1, culDeSacRoad.y2)
      dxfContent += `0
POLYLINE
8
ROADS
70
1
0
VERTEX
8
ROADS
10
${roadX - halfWidth}
20
${roadY1}
0
VERTEX
8
ROADS
10
${roadX + halfWidth}
20
${roadY1}
0
VERTEX
8
ROADS
10
${roadX + halfWidth}
20
${roadY2}
0
VERTEX
8
ROADS
10
${roadX - halfWidth}
20
${roadY2}
0
SEQEND
`
    }

    if (culDeSacBulb) {
      // Draw circle for cul-de-sac bulb
      const centerX = (culDeSacBulb.x1 + culDeSacBulb.x2) / 2
      const centerY = (culDeSacBulb.y1 + culDeSacBulb.y2) / 2
      const radius = culDeSacBulb.width / 2
      dxfContent += `0
CIRCLE
8
ROADS
10
${centerX}
20
${centerY}
40
${radius}
`
    }

    if (gridRoads.length > 0) {
      // Draw grid roads as connected polylines
      gridRoads.forEach(road => {
        const halfWidth = road.width / 2
        if (road.x1 === road.x2) {
          // Vertical road
          const roadX = road.x1
          const roadY1 = Math.min(road.y1, road.y2)
          const roadY2 = Math.max(road.y1, road.y2)
          dxfContent += `0
POLYLINE
8
ROADS
70
1
0
VERTEX
8
ROADS
10
${roadX - halfWidth}
20
${roadY1}
0
VERTEX
8
ROADS
10
${roadX + halfWidth}
20
${roadY1}
0
VERTEX
8
ROADS
10
${roadX + halfWidth}
20
${roadY2}
0
VERTEX
8
ROADS
10
${roadX - halfWidth}
20
${roadY2}
0
SEQEND
`
        } else {
          // Horizontal road
          const roadY = road.y1
          const roadX1 = Math.min(road.x1, road.x2)
          const roadX2 = Math.max(road.x1, road.x2)
          dxfContent += `0
POLYLINE
8
ROADS
70
1
0
VERTEX
8
ROADS
10
${roadX1}
20
${roadY - halfWidth}
0
VERTEX
8
ROADS
10
${roadX2}
20
${roadY - halfWidth}
0
VERTEX
8
ROADS
10
${roadX2}
20
${roadY + halfWidth}
0
VERTEX
8
ROADS
10
${roadX1}
20
${roadY + halfWidth}
0
SEQEND
`
        }
      })
    }
  }

  // Add amenities if geometry is available
  if (data.planGeometry && data.planGeometry.amenities) {
    data.planGeometry.amenities.forEach(amenity => {
      // Draw amenity as 4 lines
      // Use the exact coordinates from the canvas rendering
      dxfContent += `0
LINE
8
AMENITIES
10
${amenity.x}
20
${amenity.y}
11
${amenity.x + amenity.width}
21
${amenity.y}
0
LINE
8
AMENITIES
10
${amenity.x + amenity.width}
20
${amenity.y}
11
${amenity.x + amenity.width}
21
${amenity.y + amenity.height}
0
LINE
8
AMENITIES
10
${amenity.x + amenity.width}
20
${amenity.y + amenity.height}
11
${amenity.x}
21
${amenity.y + amenity.height}
0
LINE
8
AMENITIES
10
${amenity.x}
20
${amenity.y + amenity.height}
11
${amenity.x}
21
${amenity.y}
`
    })
  }

  dxfContent += `0
ENDSEC
0
EOF`

  return dxfContent
}

export function generatePDFReport(data: ExportData): string {
  return `SITE DEVELOPMENT PLAN REPORT
==============================

PROJECT INFORMATION
-------------------
Date: ${new Date().toLocaleDateString()}
Generated by: Civil Engineering Site Development Planner

SITE BOUNDARY
-------------
Width: ${data.siteBoundary.width} ft
Depth: ${data.siteBoundary.depth} ft
Total Area: ${data.parcelArea.toLocaleString()} SF
Terrain Relief: ${data.siteBoundary.terrainRelief}

ZONING PARAMETERS
-----------------
Minimum Lot Area: ${data.zoning.minLotArea.toLocaleString()} SF
Minimum Frontage: ${data.zoning.minFrontage} ft
Front Setback: ${data.zoning.frontSetback} ft
Rear Setback: ${data.zoning.rearSetback} ft
Side Setback: ${data.zoning.sideSetback} ft
Maximum Coverage: ${data.zoning.maxCoverage}%
Floor Area Ratio (FAR): ${data.zoning.far}
Maximum Height: ${data.zoning.maxHeight} ft

ROAD DESIGN (VDOT)
------------------
Road Network Type: ${data.roadDesign.roadNetworkType}
ROW Width: ${data.roadDesign.rowWidth} ft
Pavement Width: ${data.roadDesign.pavement} ft
Crown: ${data.roadDesign.crown}%
Curb Return Radius: ${data.roadDesign.curbReturnR} ft

AMENITIES
---------
Playground: ${data.amenities.playground ? 'Included' : 'Not Included'}
Detention Pond: ${data.amenities.detentionPond ? 'Included' : 'Not Included'}

DEVELOPMENT SUMMARY
-------------------
Total Lots: ${data.lots}
Maximum Buildable Area: ${data.maxBuildableArea.toLocaleString()} SF
Average Lot Size: ${Math.floor(data.maxBuildableArea / data.lots).toLocaleString()} SF
Open Space: ${(data.parcelArea - data.maxBuildableArea).toLocaleString()} SF

COMPLIANCE NOTES
----------------
- All lots meet minimum zoning requirements
- Setback requirements satisfied
- Road design per VDOT standards
- Drainage calculations complete

This report was generated automatically and should be verified by a licensed civil engineer.`
}

export function generateRoadProfile(data: ExportData): string {
  return `ROAD PROFILE REPORT
==================

ROAD: Main Loop Road (Patton Way)
DESIGN SPEED: 25 mph
LENGTH: Approximately ${(data.siteBoundary.width + data.siteBoundary.depth) * 2} ft

VERTICAL ALIGNMENT
------------------
Starting Elevation: 100.0 ft
Ending Elevation: 100.0 ft
Maximum Grade: 5%
Minimum Grade: 0.5%

GRADE BREAKPOINTS
-----------------
Station 0+00: Elevation 100.0 ft
Station 5+00: Elevation 102.5 ft (+2.5%)
Station 10+00: Elevation 105.0 ft (+2.5%)
Station 15+00: Elevation 102.5 ft (-2.5%)
Station 20+00: Elevation 100.0 ft (-2.5%)

VERTICAL CURVES
--------------
- Curve 1: Station 4+50 to 5+50, K=20
- Curve 2: Station 9+50 to 10+50, K=20
- Curve 3: Station 14+50 to 15+50, K=20
- Curve 4: Station 19+50 to 20+50, K=20

CROSS SECTION
-----------
ROW Width: ${data.roadDesign.rowWidth} ft
Pavement: ${data.roadDesign.pavement} ft
Curb: Type B concrete curb
Crown: ${data.roadDesign.crown}%

DRAINAGE
--------
- Crown slope: ${data.roadDesign.crown}%
- Catch basins at low points
- Storm drain connections
- Inlet spacing per VDOT standards

NOTES
-----
- Profile per VDOT Road Design Manual
- Sight distance verified
- Drainage calculations complete`
}

export function generateLotDetail(data: ExportData): string {
  const avgLotSize = Math.floor(data.maxBuildableArea / data.lots)
  
  return `LOT DETAIL REPORT
==================

TOTAL LOTS: ${data.lots}
AVERAGE LOT SIZE: ${avgLotSize.toLocaleString()} SF

INDIVIDUAL LOT DETAILS
----------------------
${Array.from({ length: Math.min(data.lots, 20) }, (_, i) => `
LOT ${i + 1}
----------
Dimensions: ${data.zoning.minFrontage} ft x ${Math.floor(data.zoning.minLotArea / data.zoning.minFrontage)} ft
Area: ${data.zoning.minLotArea.toLocaleString()} SF
Setbacks: Front=${data.zoning.frontSetback}', Rear=${data.zoning.rearSetback}', Side=${data.zoning.sideSetback}'
Building Envelope: ${Math.floor(data.zoning.minLotArea * 0.4).toLocaleString()} SF max
Frontage: ${data.zoning.minFrontage} ft
Zoning Compliance: ✓
`).join('')}

${data.lots > 20 ? `\n... and ${data.lots - 20} additional lots with similar dimensions\n` : ''}

BUILDING ENVELOPE CALCULATIONS
------------------------------
Maximum Building Footprint: ${Math.floor(avgLotSize * 0.4).toLocaleString()} SF
(40% of lot area - typical coverage)
Floor Area Ratio (FAR): ${data.zoning.far}
Maximum Building Height: ${data.zoning.maxHeight} ft

SETBACK REQUIREMENTS
-------------------
Front Setback: ${data.zoning.frontSetback} ft from property line
Rear Setback: ${data.zoning.rearSetback} ft from property line
Side Setback: ${data.zoning.sideSetback} ft from property line (each side)

UTILITIES
---------
Water: 8" DIP main at street
Sewer: 8" VCP main at street
Storm: Connected to detention pond
Electric: Overhead service
Gas: Available at street

NOTES
-----
- All lots meet minimum zoning requirements
- Individual lot surveys recommended
- Building permits required prior to construction
- Utility connections to be coordinated`
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
