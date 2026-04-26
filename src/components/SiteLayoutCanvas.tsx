import { useEffect, useRef } from 'react'

interface SiteLayoutCanvasProps {
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
  onGeometryGenerated?: (geometry: {
    lots: Array<{ x: number; y: number; width: number; depth: number; number: number }>
    roads: Array<{ x1: number; y1: number; x2: number; y2: number; width: number; name: string }>
    amenities: Array<{ type: string; x: number; y: number; width: number; height: number }>
  }) => void
}

interface Lot {
  id: number
  x: number
  y: number
  width: number
  depth: number
  roadSide: 'left' | 'right' | 'top' | 'bottom' | 'internal'
}

interface Road {
  x1: number
  y1: number
  x2: number
  y2: number
  width: number
  name: string
}

interface Amenity {
  type: 'playground' | 'detentionPond'
  x: number
  y: number
  width: number
  height: number
}

export default function SiteLayoutCanvas({
  siteBoundary,
  zoning,
  roadDesign,
  amenities,
  lots,
  onGeometryGenerated
}: SiteLayoutCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas with dark gray background
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Calculate scale to fit canvas
    const padding = 40
    const availableWidth = canvas.width - padding * 2
    const availableHeight = canvas.height - padding * 2
    const scaleX = availableWidth / siteBoundary.width
    const scaleY = availableHeight / siteBoundary.depth
    const scale = Math.min(scaleX, scaleY)

    // Calculate lot dimensions based on zoning
    const lotWidth = Math.max(zoning.minFrontage, Math.sqrt(zoning.minLotArea))
    const lotDepth = Math.ceil(zoning.minLotArea / lotWidth)

    // STEP 1: Define parcel shape boundaries (always rectangular)
    const shapeBoundaries = {
      width: siteBoundary.width,
      depth: siteBoundary.depth
    }

    // Function to check if a point is within the parcel boundary (rectangular only)
    const isWithinBoundary = (x: number, y: number): boolean => {
      return x >= 0 && x <= shapeBoundaries.width && y >= 0 && y <= shapeBoundaries.depth
    }

    // STEP 2: Generate road network based on type
    const roads: Road[] = []
    const roadWidth = roadDesign.rowWidth
    const culDeSacRadius = roadDesign.curbReturnR

    if (roadDesign.roadNetworkType === 'Loop road with cul-de-sacs') {
      // Create a rectangular loop with a cul-de-sac dead-end
      const loopRoadY = shapeBoundaries.depth * 0.5
      const loopRoadX = shapeBoundaries.width * 0.5
      const loopWidth = shapeBoundaries.width * 0.6
      const loopHeight = shapeBoundaries.depth * 0.5

      // Top horizontal segment of loop
      roads.push({
        x1: loopRoadX - loopWidth / 2,
        y1: loopRoadY - loopHeight / 2,
        x2: loopRoadX + loopWidth / 2,
        y2: loopRoadY - loopHeight / 2,
        width: roadWidth,
        name: 'Loop Rd (N)'
      })

      // Bottom horizontal segment of loop
      roads.push({
        x1: loopRoadX - loopWidth / 2,
        y1: loopRoadY + loopHeight / 2,
        x2: loopRoadX + loopWidth / 2,
        y2: loopRoadY + loopHeight / 2,
        width: roadWidth,
        name: 'Loop Rd (S)'
      })

      // Left vertical segment of loop
      roads.push({
        x1: loopRoadX - loopWidth / 2,
        y1: loopRoadY - loopHeight / 2,
        x2: loopRoadX - loopWidth / 2,
        y2: loopRoadY + loopHeight / 2,
        width: roadWidth,
        name: 'Loop Rd (W)'
      })

      // Right vertical segment of loop
      roads.push({
        x1: loopRoadX + loopWidth / 2,
        y1: loopRoadY - loopHeight / 2,
        x2: loopRoadX + loopWidth / 2,
        y2: loopRoadY + loopHeight / 2,
        width: roadWidth,
        name: 'Loop Rd (E)'
      })

      // Dead-end road extending from the bottom loop to the center
      roads.push({
        x1: loopRoadX,
        y1: loopRoadY + loopHeight / 2,
        x2: loopRoadX,
        y2: loopRoadY,
        width: roadWidth,
        name: 'Cul-de-sac Rd'
      })

      // Cul-de-sac bulb at the center (circular - represented as a short road segment for rendering)
      roads.push({
        x1: loopRoadX - culDeSacRadius,
        y1: loopRoadY,
        x2: loopRoadX + culDeSacRadius,
        y2: loopRoadY,
        width: roadWidth,
        name: 'Cul-de-sac'
      })

    } else if (roadDesign.roadNetworkType === 'Grid network') {
      // Create evenly spaced grid network
      const numHorizontalRoads = 3
      const numVerticalRoads = 3
      const horizontalSpacing = shapeBoundaries.width / (numHorizontalRoads + 1)
      const verticalSpacing = shapeBoundaries.depth / (numVerticalRoads + 1)

      // Horizontal roads (1, 3, 5, etc.)
      for (let i = 1; i <= numHorizontalRoads; i++) {
        const y = verticalSpacing * i
        roads.push({
          x1: 0,
          y1: y,
          x2: shapeBoundaries.width,
          y2: y,
          width: roadWidth,
          name: `Road ${i * 2 - 1}`
        })
      }

      // Vertical roads (2, 4, 6, etc.)
      for (let i = 1; i <= numVerticalRoads; i++) {
        const x = horizontalSpacing * i
        roads.push({
          x1: x,
          y1: 0,
          x2: x,
          y2: shapeBoundaries.depth,
          width: roadWidth,
          name: `Road ${i * 2}`
        })
      }

    } else if (roadDesign.roadNetworkType === 'Curvilinear loop') {
      // Simple curvilinear loop (approximated with segments)
      const centerX = shapeBoundaries.width * 0.5
      const centerY = shapeBoundaries.depth * 0.5
      const radiusX = shapeBoundaries.width * 0.35
      const radiusY = shapeBoundaries.depth * 0.35
      const segments = 16

      for (let i = 0; i < segments; i++) {
        const angle1 = (i / segments) * Math.PI * 2
        const angle2 = ((i + 1) / segments) * Math.PI * 2
        const x1 = centerX + Math.cos(angle1) * radiusX
        const y1 = centerY + Math.sin(angle1) * radiusY
        const x2 = centerX + Math.cos(angle2) * radiusX
        const y2 = centerY + Math.sin(angle2) * radiusY

        roads.push({
          x1,
          y1,
          x2,
          y2,
          width: roadWidth,
          name: i === 0 ? 'Loop Rd' : ''
        })
      }

    } else if (roadDesign.roadNetworkType === 'Spine + laterals') {
      // Main spine road with lateral connections
      const spineX = shapeBoundaries.width * 0.5
      const numLaterals = 4
      const lateralSpacing = shapeBoundaries.depth / (numLaterals + 1)

      // Main spine road (vertical)
      roads.push({
        x1: spineX,
        y1: 0,
        x2: spineX,
        y2: shapeBoundaries.depth,
        width: roadWidth,
        name: 'Spine Rd'
      })

      // Lateral roads (horizontal)
      for (let i = 1; i <= numLaterals; i++) {
        const y = lateralSpacing * i
        roads.push({
          x1: 0,
          y1: y,
          x2: shapeBoundaries.width,
          y2: y,
          width: roadWidth,
          name: `Lateral ${i}`
        })
      }
    }

    // Function to check if a lot overlaps with existing lots
    const checkLotOverlap = (x: number, y: number, width: number, depth: number, existingLots: Lot[]): boolean => {
      return existingLots.some(lot => 
        x < lot.x + lot.width &&
        x + width > lot.x &&
        y < lot.y + lot.depth &&
        y + depth > lot.y
      )
    }

    // Function to check if a lot overlaps with any road
    const checkRoadOverlap = (x: number, y: number, width: number, depth: number, roadList: Road[]): boolean => {
      return roadList.some(road => {
        const roadHalfWidth = road.width / 2
        
        if (road.x1 === road.x2) {
          // Vertical road
          const roadX = road.x1
          const roadY1 = Math.min(road.y1, road.y2)
          const roadY2 = Math.max(road.y1, road.y2)
          
          // Check if lot overlaps vertical road
          return x < roadX + roadHalfWidth &&
                 x + width > roadX - roadHalfWidth &&
                 y < roadY2 &&
                 y + depth > roadY1
        } else {
          // Horizontal road
          const roadY = road.y1
          const roadX1 = Math.min(road.x1, road.x2)
          const roadX2 = Math.max(road.x1, road.x2)
          
          // Check if lot overlaps horizontal road
          return x < roadX2 &&
                 x + width > roadX1 &&
                 y < roadY + roadHalfWidth &&
                 y + depth > roadY - roadHalfWidth
        }
      })
    }

    // STEP 3: Generate lots within shape boundaries after roads
    const generatedLots: Lot[] = []
    let lotNumber = 1

    // Helper function to place lots along a road
    const placeLotsAlongRoad = (
      roadY: number,
      roadWidth: number,
      isAbove: boolean,
      maxX: number,
      maxY: number
    ) => {
      const roadEdge = isAbove ? roadY - roadWidth / 2 : roadY + roadWidth / 2
      const availableWidth = maxX - zoning.sideSetback * 2
      const lotsPerRow = Math.floor(availableWidth / lotWidth)
      const horizontalSpacing = lotsPerRow > 1 ? (availableWidth - lotsPerRow * lotWidth) / (lotsPerRow - 1) : 0
      
      for (let i = 0; i < lotsPerRow; i++) {
        if (lotNumber > lots) break
        const x = zoning.sideSetback + i * (lotWidth + horizontalSpacing)
        const lotY = isAbove ? roadEdge - lotDepth - zoning.frontSetback : roadEdge + zoning.frontSetback
        
        // Check if lot is within boundary and doesn't overlap roads or other lots
        if (lotY > zoning.frontSetback && 
            lotY + lotDepth < maxY - zoning.rearSetback &&
            isWithinBoundary(x, lotY) && 
            isWithinBoundary(x + lotWidth, lotY + lotDepth) &&
            !checkRoadOverlap(x, lotY, lotWidth, lotDepth, roads) &&
            !checkLotOverlap(x, lotY, lotWidth, lotDepth, generatedLots)) {
          generatedLots.push({
            id: lotNumber,
            x,
            y: lotY,
            width: lotWidth,
            depth: lotDepth,
            roadSide: isAbove ? 'bottom' : 'top'
          })
          lotNumber++
        }
      }
    }

    // Place lots along each road based on shape
    roads.forEach(road => {
      if (road.x1 !== road.x2) {
        // Horizontal road
        const roadMaxX = Math.max(road.x1, road.x2)
        placeLotsAlongRoad(road.y1, road.width, true, roadMaxX, shapeBoundaries.depth)
        placeLotsAlongRoad(road.y1, road.width, false, roadMaxX, shapeBoundaries.depth)
      }
    })

    // STEP 4: Place amenities in remaining space after roads and lots
    const amenityList: Amenity[] = []
    
    // Helper function to find free space for amenities
    const findFreeSpace = (width: number, height: number, preferredX?: number, preferredY?: number, existingAmenities?: Amenity[]) => {
      const searchStep = 10

      // Check if amenity overlaps with existing amenities
      const checkAmenityOverlap = (x: number, y: number, width: number, height: number, amenityList: Amenity[]): boolean => {
        return amenityList.some(amenity =>
          x < amenity.x + amenity.width &&
          x + width > amenity.x &&
          y < amenity.y + amenity.height &&
          y + height > amenity.y
        )
      }

      // If preferred location is provided, check it first
      if (preferredX !== undefined && preferredY !== undefined) {
        const spaceAvailable = !generatedLots.some(lot =>
          lot.x < preferredX + width &&
          lot.x + lot.width > preferredX &&
          lot.y < preferredY + height &&
          lot.y + lot.depth > preferredY
        ) && !checkRoadOverlap(preferredX, preferredY, width, height, roads) &&
           !checkAmenityOverlap(preferredX, preferredY, width, height, existingAmenities || []) &&
           isWithinBoundary(preferredX, preferredY) &&
           isWithinBoundary(preferredX + width, preferredY + height)

        if (spaceAvailable) {
          return { x: preferredX, y: preferredY }
        }
      }

      // Search for free space starting from top-left
      for (let y = 20; y < shapeBoundaries.depth - height - 20; y += searchStep) {
        for (let x = 20; x < shapeBoundaries.width - width - 20; x += searchStep) {
          const spaceAvailable = !generatedLots.some(lot =>
            lot.x < x + width &&
            lot.x + lot.width > x &&
            lot.y < y + height &&
            lot.y + lot.depth > y
          ) && !checkRoadOverlap(x, y, width, height, roads) &&
             !checkAmenityOverlap(x, y, width, height, existingAmenities || []) &&
             isWithinBoundary(x, y) && isWithinBoundary(x + width, y + height)

          if (spaceAvailable) {
            return { x, y }
          }
        }
      }

      return null
    }

    // Find free space for playground
    if (amenities.playground) {
      const playgroundWidth = 120
      const playgroundHeight = 100
      const pgLocation = findFreeSpace(playgroundWidth, playgroundHeight, 20, 20, amenityList)

      if (pgLocation) {
        amenityList.push({
          type: 'playground',
          x: pgLocation.x,
          y: pgLocation.y,
          width: playgroundWidth,
          height: playgroundHeight
        })
      }
    }

    // Find free space for detention pond (check against playground if it exists)
    if (amenities.detentionPond) {
      const pondWidth = 100
      const pondHeight = 80
      const preferredX = shapeBoundaries.width - pondWidth - 20
      const preferredY = shapeBoundaries.depth - pondHeight - 20
      const pondLocation = findFreeSpace(pondWidth, pondHeight, preferredX, preferredY, amenityList)

      if (pondLocation) {
        amenityList.push({
          type: 'detentionPond',
          x: pondLocation.x,
          y: pondLocation.y,
          width: pondWidth,
          height: pondHeight
        })
      }
    }

    // Draw parcel boundary (rectangular only)
    ctx.strokeStyle = '#00e6a4'
    ctx.lineWidth = 3
    ctx.strokeRect(padding, padding, siteBoundary.width * scale, siteBoundary.depth * scale)

    // Draw all roads as a single layer
    ctx.fillStyle = '#374151'
    ctx.beginPath()
    roads.forEach(road => {
      // Special handling for cul-de-sac bulb (draw as circle)
      if (road.name === 'Cul-de-sac') {
        const centerX = padding + ((road.x1 + road.x2) / 2) * scale
        const centerY = padding + ((road.y1 + road.y2) / 2) * scale
        const radius = (Math.abs(road.x2 - road.x1) / 2) * scale
        ctx.moveTo(centerX + radius, centerY)
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      } else {
        const roadX1 = padding + road.x1 * scale
        const roadY1 = padding + road.y1 * scale - (road.width * scale) / 2
        const roadWidthScaled = road.width * scale

        if (road.x1 === road.x2) {
          // Vertical road
          const roadHeight = Math.abs(road.y2 - road.y1) * scale
          ctx.rect(roadX1 - roadWidthScaled / 2, roadY1, roadWidthScaled, roadHeight)
        } else {
          // Horizontal road
          const roadLength = Math.abs(road.x2 - road.x1) * scale
          ctx.rect(roadX1, roadY1, roadLength, roadWidthScaled)
        }
      }
    })
    ctx.fill()

    // Draw road labels on top
    roads.forEach(road => {
      if (road.name) {
        ctx.fillStyle = '#00e6a4'
        ctx.font = 'bold 10px Arial'
        ctx.textAlign = 'center'
        if (road.x1 === road.x2) {
          // Vertical road - center label vertically
          const labelX = padding + road.x1 * scale
          const labelY = padding + ((road.y1 + road.y2) / 2) * scale
          ctx.save()
          ctx.translate(labelX, labelY)
          ctx.rotate(-Math.PI / 2)
          ctx.fillText(road.name, 0, 0)
          ctx.restore()
        } else {
          // Horizontal road
          const labelX = padding + ((road.x1 + road.x2) / 2) * scale
          const labelY = padding + road.y1 * scale + 3
          ctx.fillText(road.name, labelX, labelY)
        }
      }
    })

    // Draw lots
    ctx.fillStyle = '#00e6a4'
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 1

    generatedLots.forEach(lot => {
      const x = padding + lot.x * scale
      const y = padding + lot.y * scale
      const width = lot.width * scale
      const height = lot.depth * scale

      ctx.fillRect(x, y, width - 2, height - 2)
      ctx.strokeRect(x, y, width - 2, height - 2)

      // Draw lot number
      ctx.fillStyle = '#000'
      ctx.font = '11px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(lot.id.toString(), x + 3, y + 12)
      ctx.fillStyle = '#00e6a4'
    })

    // Draw amenities
    amenityList.forEach(amenity => {
      if (amenity.type === 'playground') {
        ctx.fillStyle = '#fbbf24'
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        const x = padding + amenity.x * scale
        const y = padding + amenity.y * scale
        const width = amenity.width * scale
        const height = amenity.height * scale
        
        ctx.fillRect(x, y, width, height)
        ctx.strokeRect(x, y, width, height)
        
        ctx.fillStyle = '#000'
        ctx.font = 'bold 10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('PLAYGROUND', x + width / 2, y + height / 2 + 4)
      } else if (amenity.type === 'detentionPond') {
        ctx.fillStyle = '#60a5fa'
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        const x = padding + amenity.x * scale
        const y = padding + amenity.y * scale
        const width = amenity.width * scale
        const height = amenity.height * scale
        
        ctx.beginPath()
        ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 9px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('POND', x + width / 2, y + height / 2 + 3)
      }
    })

    // Draw scale
    ctx.strokeStyle = '#00e6a4'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(canvas.width - 120, canvas.height - 30)
    ctx.lineTo(canvas.width - 20, canvas.height - 30)
    ctx.stroke()
    ctx.fillStyle = '#00e6a4'
    ctx.font = '12px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('Scale: 1" = 100\'', canvas.width - 120, canvas.height - 40)

    // Draw north arrow
    ctx.fillStyle = '#00e6a4'
    ctx.beginPath()
    ctx.moveTo(30, canvas.height - 60)
    ctx.lineTo(40, canvas.height - 80)
    ctx.lineTo(50, canvas.height - 60)
    ctx.closePath()
    ctx.fill()
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('N', 40, canvas.height - 82)

    // Call the callback with the generated geometry
    if (onGeometryGenerated) {
      onGeometryGenerated({
        lots: generatedLots.map(lot => ({
          x: lot.x,
          y: lot.y,
          width: lot.width,
          depth: lot.depth,
          number: lot.id
        })),
        roads: roads.map(road => ({
          x1: road.x1,
          y1: road.y1,
          x2: road.x2,
          y2: road.y2,
          width: road.width,
          name: road.name
        })),
        amenities: amenityList.map(amenity => ({
          type: amenity.type,
          x: amenity.x,
          y: amenity.y,
          width: amenity.width,
          height: amenity.height
        }))
      })
    }

  }, [siteBoundary, zoning, roadDesign, amenities, lots, onGeometryGenerated])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="border border-gray-800 rounded-lg"
        style={{ display: 'block' }}
      />
    </div>
  )
}
