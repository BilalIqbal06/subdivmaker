import { useState } from 'react'

interface PlanComponentsProps {
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
}

export default function PlanComponents({
  siteBoundary,
  zoning,
  roadDesign,
  amenities,
  lots,
  parcelArea,
  maxBuildableArea
}: PlanComponentsProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)

  const renderCoverSheet = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-[#00e6a4] mb-2">Cover Sheet</h2>
        <p className="text-gray-400 text-sm">C-1 — Project Overview</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Project</p>
          <p className="text-white font-semibold">Site Development Plan</p>
          <p className="text-gray-400 text-sm">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Lots</p>
          <p className="text-3xl font-bold text-[#00e6a4]">{lots}</p>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Site Summary</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Dimensions</p>
            <p className="text-white">{siteBoundary.width} ft × {siteBoundary.depth} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Total Area</p>
            <p className="text-white">{parcelArea.toLocaleString()} SF</p>
          </div>
          <div>
            <p className="text-gray-500">Terrain</p>
            <p className="text-white">{siteBoundary.terrainRelief}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Zoning Summary</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Min Lot Area</p>
            <p className="text-white">{zoning.minLotArea.toLocaleString()} SF</p>
          </div>
          <div>
            <p className="text-gray-500">Min Frontage</p>
            <p className="text-white">{zoning.minFrontage} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Front Setback</p>
            <p className="text-white">{zoning.frontSetback} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Rear Setback</p>
            <p className="text-white">{zoning.rearSetback} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Side Setback</p>
            <p className="text-white">{zoning.sideSetback} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Max Coverage</p>
            <p className="text-white">{zoning.maxCoverage}%</p>
          </div>
          <div>
            <p className="text-gray-500">FAR</p>
            <p className="text-white">{zoning.far}</p>
          </div>
          <div>
            <p className="text-gray-500">Max Height</p>
            <p className="text-white">{zoning.maxHeight} ft</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Road Design</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Network Type</p>
            <p className="text-white">{roadDesign.roadNetworkType}</p>
          </div>
          <div>
            <p className="text-gray-500">ROW Width</p>
            <p className="text-white">{roadDesign.rowWidth} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Pavement</p>
            <p className="text-white">{roadDesign.pavement} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Crown</p>
            <p className="text-white">{roadDesign.crown}%</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Development Summary</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Buildable Area</p>
            <p className="text-white">{maxBuildableArea.toLocaleString()} SF</p>
          </div>
          <div>
            <p className="text-gray-500">Avg Lot Size</p>
            <p className="text-white">{Math.floor(maxBuildableArea / lots).toLocaleString()} SF</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Amenities</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${amenities.playground ? 'bg-[#00e6a4]' : 'bg-gray-600'}`}></div>
            <p className="text-white">Playground</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${amenities.detentionPond ? 'bg-[#00e6a4]' : 'bg-gray-600'}`}></div>
            <p className="text-white">Detention Pond</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBoundarySurvey = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-[#00e6a4] mb-2">Boundary Survey</h2>
        <p className="text-gray-400 text-sm">C-2 — Property Boundary</p>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Parcel Information</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Width</p>
            <p className="text-white">{siteBoundary.width} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Depth</p>
            <p className="text-white">{siteBoundary.depth} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Area</p>
            <p className="text-white">{parcelArea.toLocaleString()} SF</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Corner Coordinates</h3>
        <p className="text-xs text-gray-500 mb-3">Assumed SW corner at origin</p>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          <div className="bg-black/50 p-2 rounded">
            <p className="text-gray-500">Corner A</p>
            <p className="text-white">(0, 0)</p>
          </div>
          <div className="bg-black/50 p-2 rounded">
            <p className="text-gray-500">Corner B</p>
            <p className="text-white">({siteBoundary.width}, 0)</p>
          </div>
          <div className="bg-black/50 p-2 rounded">
            <p className="text-gray-500">Corner C</p>
            <p className="text-white">({siteBoundary.width}, {siteBoundary.depth})</p>
          </div>
          <div className="bg-black/50 p-2 rounded">
            <p className="text-gray-500">Corner D</p>
            <p className="text-white">(0, {siteBoundary.depth})</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Boundary Description</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          The subject property is a rectangular parcel beginning at the southwest corner and proceeding:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-[#00e6a4]">→</span>
            <span>North {siteBoundary.depth} feet to the northwest corner</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00e6a4]">→</span>
            <span>East {siteBoundary.width} feet to the northeast corner</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00e6a4]">→</span>
            <span>South {siteBoundary.depth} feet to the southeast corner</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00e6a4]">→</span>
            <span>West {siteBoundary.width} feet to the point of beginning</span>
          </li>
        </ul>
        <p className="mt-4 text-white font-semibold text-sm">
          CONTAINING {parcelArea.toLocaleString()} SQUARE FEET, MORE OR LESS.
        </p>
      </div>
    </div>
  )

  const renderTopographicSurvey = () => {
    const elevationChange = siteBoundary.terrainRelief.includes('Gentle') ? '5-30' : 
                           siteBoundary.terrainRelief.includes('Rolling') ? '30-70' :
                           siteBoundary.terrainRelief.includes('Steep') ? '70+' : '0-5'
    
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-[#00e6a4] mb-2">Topographic Survey</h2>
          <p className="text-gray-400 text-sm">C-3 — Existing Conditions</p>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Existing Topography</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Terrain Relief</p>
              <p className="text-white">{siteBoundary.terrainRelief}</p>
            </div>
            <div>
              <p className="text-gray-500">Elevation Range</p>
              <p className="text-white">{elevationChange} ft variation</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Contour Intervals</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Contour Interval</p>
              <p className="text-white">2 ft</p>
            </div>
            <div>
              <p className="text-gray-500">Index Contours</p>
              <p className="text-white">Every 10 ft</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Spot Elevations</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-black/50 p-2 rounded">
              <p className="text-gray-500">SW Corner</p>
              <p className="text-white font-mono">100.0 ft</p>
            </div>
            <div className="bg-black/50 p-2 rounded">
              <p className="text-gray-500">NW Corner</p>
              <p className="text-white font-mono">{100 + Number(elevationChange.split('-')[1] || 5)}.0 ft</p>
            </div>
            <div className="bg-black/50 p-2 rounded">
              <p className="text-gray-500">NE Corner</p>
              <p className="text-white font-mono">{100 + Number(elevationChange.split('-')[1] || 5)}.0 ft</p>
            </div>
            <div className="bg-black/50 p-2 rounded">
              <p className="text-gray-500">SE Corner</p>
              <p className="text-white font-mono">100.0 ft</p>
            </div>
            <div className="bg-black/50 p-2 rounded col-span-2">
              <p className="text-gray-500">Center</p>
              <p className="text-white font-mono">{100 + Number(elevationChange.split('-')[0] || 2)}.5 ft</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Grade Indicators</h3>
          <div className="text-sm">
            <p className="text-gray-500">Average slope</p>
            <p className="text-white">
              {elevationChange === '0-5' ? '0-2%' : elevationChange === '5-30' ? '2-5%' : elevationChange === '30-70' ? '5-10%' : '10%+'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderSitePlan = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-[#00e6a4] mb-2">Site Plan</h2>
        <p className="text-gray-400 text-sm">C-4 — Overall Layout</p>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">General Information</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Total Site Area</p>
            <p className="text-white">{parcelArea.toLocaleString()} SF</p>
          </div>
          <div>
            <p className="text-gray-500">Buildable Area</p>
            <p className="text-white">{maxBuildableArea.toLocaleString()} SF</p>
          </div>
          <div>
            <p className="text-gray-500">Open Space</p>
            <p className="text-white">{(parcelArea - maxBuildableArea).toLocaleString()} SF</p>
          </div>
          <div>
            <p className="text-gray-500">Coverage</p>
            <p className="text-white">{zoning.maxCoverage}%</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Lot Information</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Total Lots</p>
            <p className="text-white">{lots}</p>
          </div>
          <div>
            <p className="text-gray-500">Min Lot Size</p>
            <p className="text-white">{zoning.minLotArea.toLocaleString()} SF</p>
          </div>
          <div>
            <p className="text-gray-500">Min Frontage</p>
            <p className="text-white">{zoning.minFrontage} ft</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Setbacks</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Front</p>
            <p className="text-white">{zoning.frontSetback} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Rear</p>
            <p className="text-white">{zoning.rearSetback} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Side</p>
            <p className="text-white">{zoning.sideSetback} ft</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderLotLayout = () => {
    const avgLotSize = Math.floor(maxBuildableArea / lots)
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-[#00e6a4] mb-2">Lot Layout</h2>
          <p className="text-gray-400 text-sm">C-5 — Individual Lots</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Lots</p>
            <p className="text-3xl font-bold text-[#00e6a4]">{lots}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg Lot Size</p>
            <p className="text-3xl font-bold text-[#00e6a4]">{avgLotSize.toLocaleString()}</p>
            <p className="text-xs text-gray-500">SF</p>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Typical Lot Dimensions</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Width</p>
              <p className="text-white">{zoning.minFrontage} ft minimum</p>
            </div>
            <div>
              <p className="text-gray-500">Depth</p>
              <p className="text-white">{Math.floor(zoning.minLotArea / zoning.minFrontage)} ft minimum</p>
            </div>
            <div>
              <p className="text-gray-500">Area</p>
              <p className="text-white">{zoning.minLotArea.toLocaleString()} SF minimum</p>
            </div>
            <div>
              <p className="text-gray-500">Building Envelope</p>
              <p className="text-white">{Math.floor(avgLotSize * 0.4).toLocaleString()} SF max</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Setback Requirements</h3>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Front</p>
              <p className="text-white">{zoning.frontSetback} ft</p>
            </div>
            <div>
              <p className="text-gray-500">Rear</p>
              <p className="text-white">{zoning.rearSetback} ft</p>
            </div>
            <div>
              <p className="text-gray-500">Side</p>
              <p className="text-white">{zoning.sideSetback} ft</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderRoadLayout = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-[#00e6a4] mb-2">Road Layout</h2>
        <p className="text-gray-400 text-sm">C-6 — Road Network</p>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Road Network Type</h3>
        <p className="text-white text-lg">{roadDesign.roadNetworkType}</p>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Road Specifications</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">ROW Width</p>
            <p className="text-white">{roadDesign.rowWidth} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Pavement Width</p>
            <p className="text-white">{roadDesign.pavement} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Crown</p>
            <p className="text-white">{roadDesign.crown}%</p>
          </div>
          <div>
            <p className="text-gray-500">Curb Return Radius</p>
            <p className="text-white">{roadDesign.curbReturnR} ft</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Cross Section</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <p className="text-gray-500">ROW Width</p>
            <p className="text-white">{roadDesign.rowWidth} ft</p>
          </div>
          <div className="flex justify-between pl-4">
            <p className="text-gray-500">— Pavement</p>
            <p className="text-white">{roadDesign.pavement} ft</p>
          </div>
          <div className="flex justify-between pl-4">
            <p className="text-gray-500">— Curb & Gutter</p>
            <p className="text-white">2 ft each side</p>
          </div>
          <div className="flex justify-between pl-4">
            <p className="text-gray-500">— Sidewalk</p>
            <p className="text-white">5 ft each side</p>
          </div>
          <div className="flex justify-between pl-4">
            <p className="text-gray-500">— Utility Easement</p>
            <p className="text-white">5 ft each side</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderRoadProfile = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-[#00e6a4] mb-2">Road Profile</h2>
        <p className="text-gray-400 text-sm">C-7 — Vertical Alignment</p>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Profile Information</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Road</p>
            <p className="text-white">Main Loop Road</p>
          </div>
          <div>
            <p className="text-gray-500">Length</p>
            <p className="text-white">~{(siteBoundary.width + siteBoundary.depth) * 2} ft</p>
          </div>
          <div>
            <p className="text-gray-500">Design Speed</p>
            <p className="text-white">25 mph</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Vertical Alignment</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Starting Elevation</p>
            <p className="text-white">100.0 ft</p>
          </div>
          <div>
            <p className="text-gray-500">Ending Elevation</p>
            <p className="text-white">100.0 ft</p>
          </div>
          <div>
            <p className="text-gray-500">Maximum Grade</p>
            <p className="text-white">5%</p>
          </div>
          <div>
            <p className="text-gray-500">Minimum Grade</p>
            <p className="text-white">0.5%</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#00e6a4] mb-3 uppercase tracking-wider">Grade Breakpoints</h3>
        <div className="space-y-2 text-sm font-mono">
          <div className="flex justify-between bg-black/50 p-2 rounded">
            <span className="text-gray-500">Station 0+00</span>
            <span className="text-white">100.0 ft</span>
          </div>
          <div className="flex justify-between bg-black/50 p-2 rounded">
            <span className="text-gray-500">Station 5+00</span>
            <span className="text-white">102.5 ft (+2.5%)</span>
          </div>
          <div className="flex justify-between bg-black/50 p-2 rounded">
            <span className="text-gray-500">Station 10+00</span>
            <span className="text-white">105.0 ft (+2.5%)</span>
          </div>
          <div className="flex justify-between bg-black/50 p-2 rounded">
            <span className="text-gray-500">Station 15+00</span>
            <span className="text-white">102.5 ft (-2.5%)</span>
          </div>
          <div className="flex justify-between bg-black/50 p-2 rounded">
            <span className="text-gray-500">Station 20+00</span>
            <span className="text-white">100.0 ft (-2.5%)</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDetails = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-[#00e6a4] mb-2">Details</h2>
        <p className="text-gray-400 text-sm">C-8 — Standard Details</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#00e6a4] mb-2">Curb Section</h3>
          <p className="text-gray-400 text-xs">Type B concrete curb, 6" curb face, 12" width</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#00e6a4] mb-2">Pavement Section</h3>
          <p className="text-gray-400 text-xs">1.5" surface, 2.5" binder, 6" base, 12" subbase</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#00e6a4] mb-2">Sidewalk Details</h3>
          <p className="text-gray-400 text-xs">5' wide, 4" thick, ADA compliant</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#00e6a4] mb-2">Driveway Approach</h3>
          <p className="text-gray-400 text-xs">VDOT radius, drainage flumes, curb cuts</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#00e6a4] mb-2">Storm Drain Details</h3>
          <p className="text-gray-400 text-xs">Type I catch basin, 15" RCP minimum</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-[#00e6a4] mb-2">Utility Details</h3>
          <p className="text-gray-400 text-xs">8" water main, 8" sewer, 15"-24" storm drain</p>
        </div>
        {amenities.detentionPond && (
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#00e6a4] mb-2">Detention Pond</h3>
            <p className="text-gray-400 text-xs">Emergency spillway, outlet structure, 3:1 bottom slope</p>
          </div>
        )}
        {amenities.playground && (
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#00e6a4] mb-2">Playground Details</h3>
            <p className="text-gray-400 text-xs">Equipment layout, safety surfacing, accessibility</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (selectedComponent) {
      case 'Cover Sheet': return renderCoverSheet()
      case 'Boundary Survey': return renderBoundarySurvey()
      case 'Topographic Survey': return renderTopographicSurvey()
      case 'Site Plan': return renderSitePlan()
      case 'Lot Layout': return renderLotLayout()
      case 'Road Layout': return renderRoadLayout()
      case 'Road Profile': return renderRoadProfile()
      case 'Details': return renderDetails()
      default: return null
    }
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-white mb-3">Civil Engineering Plan Components</h3>
      <div className="grid grid-cols-2 gap-2">
        {['Cover Sheet', 'Boundary Survey', 'Topographic Survey', 'Site Plan', 'Lot Layout', 'Road Layout', 'Road Profile', 'Details'].map((component) => (
          <button
            key={component}
            onClick={() => setSelectedComponent(component)}
            className="px-4 py-3 border border-gray-700 rounded-lg bg-black hover:bg-gray-900 hover:border-[#00e6a4] text-white text-sm text-left transition-all"
          >
            <span className="font-medium">{component}</span>
          </button>
        ))}
      </div>

      {selectedComponent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedComponent(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            {renderContent()}
            <button
              onClick={() => setSelectedComponent(null)}
              className="mt-6 w-full bg-[#00e6a4] text-black py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
