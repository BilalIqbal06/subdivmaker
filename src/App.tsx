import { useState } from 'react'
import './App.css'
import SiteLayoutCanvas from './components/SiteLayoutCanvas'
import PlanComponents from './components/PlanComponents'
import { generateLandXML, generateDXF, generateRoadProfile, generateLotDetail, downloadFile } from './utils/exportUtils'

interface SiteBoundaryParams {
  width: number
  depth: number
  terrainRelief: string
}

interface ZoningParams {
  minLotArea: number
  minFrontage: number
  frontSetback: number
  rearSetback: number
  sideSetback: number
  maxCoverage: number
  far: number
  maxHeight: number
}

interface RoadDesignParams {
  roadNetworkType: string
  rowWidth: number
  pavement: number
  crown: number
  curbReturnR: number
}

interface AmenityParams {
  playground: boolean
  detentionPond: boolean
}

function App() {
  const [siteBoundary, setSiteBoundary] = useState<SiteBoundaryParams>({
    width: 900,
    depth: 700,
    terrainRelief: 'Gentle (5-30 ft)'
  })

  const [zoning, setZoning] = useState<ZoningParams>({
    minLotArea: 8500,
    minFrontage: 40,
    frontSetback: 35,
    rearSetback: 25,
    sideSetback: 10,
    maxCoverage: 55,
    far: 0.35,
    maxHeight: 35
  })

  const [roadDesign, setRoadDesign] = useState<RoadDesignParams>({
    roadNetworkType: 'Loop road with cul-de-sacs',
    rowWidth: 50,
    pavement: 33,
    crown: 6,
    curbReturnR: 5
  })

  const [amenities, setAmenities] = useState<AmenityParams>({
    playground: true,
    detentionPond: true
  })

  const [generatedPlan, setGeneratedPlan] = useState<any>(null)
  const [planGeometry, setPlanGeometry] = useState<any>(null)

  // Calculate estimated lots for display
  const estimatedLots = (() => {
    const parcelArea = siteBoundary.width * siteBoundary.depth
    const maxBuildableArea = parcelArea * (zoning.maxCoverage / 100)
    return Math.floor(maxBuildableArea / zoning.minLotArea)
  })()

  const generatePlan = () => {
    // Calculate basic statistics
    const parcelArea = siteBoundary.width * siteBoundary.depth
    const maxBuildableArea = parcelArea * (zoning.maxCoverage / 100)

    setGeneratedPlan({
      lots: estimatedLots,
      parcelArea,
      maxBuildableArea,
      parameters: { siteBoundary, zoning, roadDesign, amenities }
    })
  }

  const handleExportLandXML = () => {
    if (!generatedPlan) return
    const content = generateLandXML({
      siteBoundary,
      zoning,
      roadDesign,
      amenities,
      lots: generatedPlan.lots,
      parcelArea: generatedPlan.parcelArea,
      maxBuildableArea: generatedPlan.maxBuildableArea
    })
    downloadFile(content, 'site-plan.xml', 'application/xml')
  }

  const handleExportDXF = () => {
    if (!generatedPlan) return
    if (!planGeometry) {
      alert('Please wait for the site layout to render before exporting.')
      return
    }
    const content = generateDXF({
      siteBoundary,
      zoning,
      roadDesign,
      amenities,
      lots: generatedPlan.lots,
      parcelArea: generatedPlan.parcelArea,
      maxBuildableArea: generatedPlan.maxBuildableArea,
      planGeometry
    })
    downloadFile(content, 'site-plan.dxf', 'application/dxf')
  }

  const handleExportRoadProfile = () => {
    if (!generatedPlan) return
    const content = generateRoadProfile({
      siteBoundary,
      zoning,
      roadDesign,
      amenities,
      lots: generatedPlan.lots,
      parcelArea: generatedPlan.parcelArea,
      maxBuildableArea: generatedPlan.maxBuildableArea
    })
    downloadFile(content, 'road-profile.txt', 'text/plain')
  }

  const handleExportLotDetail = () => {
    if (!generatedPlan) return
    const content = generateLotDetail({
      siteBoundary,
      zoning,
      roadDesign,
      amenities,
      lots: generatedPlan.lots,
      parcelArea: generatedPlan.parcelArea,
      maxBuildableArea: generatedPlan.maxBuildableArea
    })
    downloadFile(content, 'lot-detail.txt', 'text/plain')
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-8 h-14 bg-black/85 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00e6a4]"></div>
          <span className="font-bold text-white text-lg">SubDivMaker</span>
        </div>
        <div className="flex gap-8 items-center">
          <a href="#how" className="text-gray-400 text-sm hover:text-white transition-colors">How it works</a>
          <a href="#app" className="text-gray-400 text-sm hover:text-white transition-colors">Try it</a>
          <a href="#sheets" className="text-gray-400 text-sm hover:text-white transition-colors">Plan set</a>
          <a href="#features" className="text-gray-400 text-sm hover:text-white transition-colors">Features</a>
        </div>
        <button 
          onClick={() => document.getElementById('app')?.scrollIntoView({behavior: 'smooth'})}
          className="bg-[#00e6a4] text-black border-none rounded px-4 py-1.5 text-sm font-medium hover:opacity-85 transition-opacity"
        >
          Launch app
        </button>
      </nav>

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-8 pt-20 text-center relative overflow-hidden">
        
        <div className="inline-flex items-center gap-2 border border-gray-700 rounded-full px-4 py-1 text-xs mb-8 bg-[#00e6a4]/10 text-[#00e6a4]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00e6a4] animate-pulse"></div>
          Civil 3D — compatible output
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-6 max-w-4xl tracking-tight text-[#00e6a4]">
          Subdivision layouts,<br />
          in seconds.
        </h1>
        
        <p className="text-gray-400 text-lg max-w-2xl mb-10 leading-relaxed">
          Site development planning tool. Input your parcel, zoning rules, and road standards. Get a complete lot layout, road network, and Civil 3D-ready export.
        </p>
        
        <div className="flex gap-3 flex-wrap justify-center mb-16">
          <button 
            onClick={() => document.getElementById('app')?.scrollIntoView({behavior: 'smooth'})}
            className="bg-[#00e6a4] text-black border-none rounded-lg px-7 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Generate a layout
          </button>
          <button 
            onClick={() => document.getElementById('how')?.scrollIntoView({behavior: 'smooth'})}
            className="bg-transparent text-white border border-gray-700 rounded-lg px-7 py-3 text-sm hover:border-[#00e6a4] hover:bg-[#00e6a4]/10 transition-colors"
          >
            See how it works
          </button>
        </div>
        
        <div className="flex gap-12 flex-wrap justify-center">
          <div>
            <div className="text-3xl font-bold text-[#00e6a4]">40hrs</div>
            <div className="text-xs text-gray-500 mt-1">Saved per preliminary layout</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#00e6a4]">8</div>
            <div className="text-xs text-gray-500 mt-1">Plan sheets automated</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#00e6a4]">LandXML</div>
            <div className="text-xs text-gray-500 mt-1">Direct Civil 3D import</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#00e6a4]">VDOT</div>
            <div className="text-xs text-gray-500 mt-1">Standards compliant</div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <section id="how" className="max-w-6xl mx-auto px-8 py-24">
        <div className="text-xs uppercase tracking-widest mb-2 text-[#00e6a4]">workflow</div>
        <h2 className="text-4xl font-bold mb-2 text-[#00e6a4]">From parcel to plan set</h2>
        <p className="text-gray-400 max-w-xl mb-12">SubDivMaker mirrors the exact workflow of a Civil 3D site development plan — boundary in, complete 8-sheet set out.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px border border-gray-800 rounded-xl overflow-hidden">
          <div className="bg-black p-8 hover:bg-gray-900 transition-colors">
            <div className="text-[11px] text-gray-500 mb-6">01</div>
            <div className="w-9 h-9 rounded-lg bg-[#00e6a4]/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#00e6a4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Define your parcel</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Input site dimensions, shape, and state plane coordinates. The tool parses the boundary polygon — just like importing a boundary survey into Civil 3D.</p>
          </div>
          
          <div className="bg-black p-8 hover:bg-gray-900 transition-colors">
            <div className="text-[11px] text-gray-500 mb-6">02</div>
            <div className="w-9 h-9 rounded-lg bg-[#00e6a4]/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#00e6a4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17l4-8 4 4 4-6 4 10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Set parcel parameters</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Min lot size, frontage, setbacks, FAR, max coverage, road ROW — the same fields you'd pull from a zoning ordinance for a cover sheet.</p>
          </div>
          
          <div className="bg-black p-8 hover:bg-gray-900 transition-colors">
            <div className="text-[11px] text-gray-500 mb-6">03</div>
            <div className="w-9 h-9 rounded-lg bg-[#00e6a4]/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#00e6a4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Generate layout</h3>
            <p className="text-sm text-gray-400 leading-relaxed">The engine places road alignments, subdivides lots respecting all setbacks, adds utility easements, open space, and retention — automatically.</p>
          </div>
          
          <div className="bg-black p-8 hover:bg-gray-900 transition-colors">
            <div className="text-[11px] text-gray-500 mb-6">04</div>
            <div className="w-9 h-9 rounded-lg bg-[#00e6a4]/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#00e6a4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Export to Civil 3D</h3>
            <p className="text-sm text-gray-400 leading-relaxed">One-click LandXML or DXF export with proper layer naming (C-PROP-LINE, C-ROAD-CNTR, C-ESMT-UTIL). Import directly into Civil 3D and refine.</p>
          </div>
        </div>
      </section>

      {/* App Section */}
      <div id="app" className="border-t border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-xs uppercase tracking-widest mb-2 text-[#00e6a4]">live tool</div>
          <h2 className="text-4xl font-bold mb-2 text-[#00e6a4]">Generate your layout</h2>
          <p className="text-gray-400 max-w-xl mb-8">Configure your site parameters and run the layout engine. Outputs are Civil 3D-compatible.</p>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-[320px_1fr] min-h-[700px] border-t border-gray-800">
          {/* Left Sidebar - Input Parameters */}
          <div className="bg-black border-r border-gray-800 p-6 overflow-y-auto max-h-[800px]">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#00e6a4] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#00e6a4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Input Parameters</h2>
            </div>

          {/* Site Boundary */}
          <div className="mb-6">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2.5 pb-1.5 border-b border-gray-800">// site boundary</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Width (ft)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={siteBoundary.width}
                  onChange={(e) => setSiteBoundary({ ...siteBoundary, width: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Depth (ft)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={siteBoundary.depth}
                  onChange={(e) => setSiteBoundary({ ...siteBoundary, depth: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-[11px] text-gray-400 mb-1">Terrain relief (ft)</label>
              <select
                className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                value={siteBoundary.terrainRelief}
                onChange={(e) => setSiteBoundary({ ...siteBoundary, terrainRelief: e.target.value })}
              >
                <option>Flat (&lt;5 ft)</option>
                <option>Gentle (5–30 ft)</option>
                <option>Rolling (30–70 ft)</option>
                <option>Steep (70+ ft)</option>
              </select>
            </div>
          </div>

          {/* Parcel Parameters */}
          <div className="mb-6">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2.5 pb-1.5 border-b border-gray-800">// parcel parameters</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Min lot area (SF)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={zoning.minLotArea}
                  onChange={(e) => setZoning({ ...zoning, minLotArea: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Min frontage (ft)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={zoning.minFrontage}
                  onChange={(e) => setZoning({ ...zoning, minFrontage: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Front setback (ft)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={zoning.frontSetback}
                  onChange={(e) => setZoning({ ...zoning, frontSetback: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Rear setback (ft)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={zoning.rearSetback}
                  onChange={(e) => setZoning({ ...zoning, rearSetback: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Side setback (ft)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={zoning.sideSetback}
                  onChange={(e) => setZoning({ ...zoning, sideSetback: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Max coverage (%)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={zoning.maxCoverage}
                  onChange={(e) => setZoning({ ...zoning, maxCoverage: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">FAR</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={zoning.far}
                  onChange={(e) => setZoning({ ...zoning, far: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Max height (ft)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={zoning.maxHeight}
                  onChange={(e) => setZoning({ ...zoning, maxHeight: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Road Design (VDOT) */}
          <div className="mb-6">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2.5 pb-1.5 border-b border-gray-800">// road design (VDOT)</div>
            <div className="mb-3">
              <label className="block text-[11px] text-gray-400 mb-1">Road network type</label>
              <select
                className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                value={roadDesign.roadNetworkType}
                onChange={(e) => setRoadDesign({ ...roadDesign, roadNetworkType: e.target.value })}
              >
                <option>Loop road with cul-de-sacs</option>
                <option>Grid network</option>
                <option>Curvilinear loop</option>
                <option>Spine + laterals</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">ROW width (ft)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={roadDesign.rowWidth}
                  onChange={(e) => setRoadDesign({ ...roadDesign, rowWidth: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Pavement (ft)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={roadDesign.pavement}
                  onChange={(e) => setRoadDesign({ ...roadDesign, pavement: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Crown (%)</label>
                <input
                  type="number"
                  step="0.5"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={roadDesign.crown}
                  onChange={(e) => setRoadDesign({ ...roadDesign, crown: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Curb return R (ft)</label>
                <input
                  type="number"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={roadDesign.curbReturnR}
                  onChange={(e) => setRoadDesign({ ...roadDesign, curbReturnR: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2.5 pb-1.5 border-b border-gray-800">// amenities</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Open space (AC)</label>
                <input
                  type="number"
                  step="0.05"
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value="0.45"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Retention pond</label>
                <select 
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={amenities.detentionPond ? "Yes" : "No"}
                  onChange={(e) => setAmenities({ ...amenities, detentionPond: e.target.value === "Yes" })}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Playground</label>
                <select 
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none"
                  value={amenities.playground ? "Yes" : "No"}
                  onChange={(e) => setAmenities({ ...amenities, playground: e.target.value === "Yes" })}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Landscaping</label>
                <select className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-[12px] text-white focus:border-[#00e6a4] focus:outline-none">
                  <option>Azalea 10' O.C.</option>
                  <option>Street trees</option>
                  <option>None</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={generatePlan}
            className="w-full bg-[#00e6a4] text-black py-2.5 px-4 rounded font-bold text-[13px] hover:opacity-85 transition-opacity mt-2"
          >
            ▶ Generate Layout
          </button>
        </div>

        {/* Right Side - Visual Output */}
        <div className="flex-1 p-6">
          <div className="rounded-lg shadow p-6 h-full bg-black">
            <h2 className="text-xl font-bold mb-6 text-white">Site Layout</h2>
            
            <div>
              {/* Visual Canvas - always visible for dynamic updates */}
              <div className="flex justify-center mb-6 bg-gray-900 rounded-lg p-4 border border-gray-700">
                <SiteLayoutCanvas
                  siteBoundary={siteBoundary}
                  zoning={zoning}
                  roadDesign={roadDesign}
                  amenities={amenities}
                  lots={estimatedLots}
                  onGeometryGenerated={setPlanGeometry}
                />
              </div>

              <div className="mb-6 p-4 rounded-lg bg-black border border-gray-800">
                <h3 className="font-semibold mb-4 text-white">Plan Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Estimated Lots:</p>
                    <p className="text-xl font-bold text-[#00e6a4]">{estimatedLots}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Site Area:</p>
                    <p className="text-xl font-bold text-[#00e6a4]">{(siteBoundary.width * siteBoundary.depth).toLocaleString()} SF</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Max Buildable Area:</p>
                    <p className="text-xl font-bold text-[#00e6a4]">{((siteBoundary.width * siteBoundary.depth) * (zoning.maxCoverage / 100)).toLocaleString()} SF</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Avg Lot Size:</p>
                    <p className="text-xl font-bold text-[#00e6a4]">{Math.floor(((siteBoundary.width * siteBoundary.depth) * (zoning.maxCoverage / 100)) / estimatedLots).toLocaleString()} SF</p>
                  </div>
                </div>
              </div>

              {/* Export Buttons - only enabled after plan generation */}
              {generatedPlan && (
                <div className="mt-6 flex gap-2 flex-wrap">
                  <button
                    onClick={handleExportLandXML}
                    className="px-4 py-2 bg-[#00e6a4] text-white rounded hover:bg-[#00e6a4] text-sm font-medium"
                  >
                    LandXML
                  </button>
                  <button
                    onClick={handleExportDXF}
                    className="px-4 py-2 bg-[#00e6a4] text-white rounded hover:bg-[#00e6a4] text-sm font-medium"
                  >
                    DXF
                  </button>
                  <button
                    onClick={handleExportRoadProfile}
                    className="px-4 py-2 bg-[#00e6a4] text-white rounded hover:bg-[#00e6a4] text-sm font-medium"
                  >
                    Road Profile
                  </button>
                  <button
                    onClick={handleExportLotDetail}
                    className="px-4 py-2 bg-[#00e6a4] text-white rounded hover:bg-[#00e6a4] text-sm font-medium"
                  >
                    Lot Detail
                  </button>
                </div>
              )}

              {/* Plan Sheets Information - only shown after plan generation */}
              {generatedPlan && (
                <div className="mt-6 p-4 rounded-lg bg-black border border-gray-800">
                  <h3 className="font-semibold mb-4 text-white">Plan Sheets</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-gray-800 rounded-lg overflow-hidden">
                    <div className="bg-black p-4 hover:bg-gray-900 transition-colors cursor-pointer">
                      <p className="text-[10px] text-gray-500 mb-1">C-1</p>
                      <p className="text-sm font-semibold text-white">Cover sheet</p>
                      <p className="text-xs text-gray-400 mt-1">General notes, zoning data, agency contacts</p>
                    </div>
                    <div className="bg-black p-4 hover:bg-gray-900 transition-colors cursor-pointer">
                      <p className="text-[10px] text-gray-500 mb-1">C-2</p>
                      <p className="text-sm font-semibold text-white">Boundary survey</p>
                      <p className="text-xs text-gray-400 mt-1">{siteBoundary.width} x {siteBoundary.depth} ft</p>
                    </div>
                    <div className="bg-black p-4 hover:bg-gray-900 transition-colors cursor-pointer">
                      <p className="text-[10px] text-gray-500 mb-1">C-3</p>
                      <p className="text-sm font-semibold text-white">Topographic survey</p>
                      <p className="text-xs text-gray-400 mt-1">{siteBoundary.terrainRelief}</p>
                    </div>
                    <div className="bg-black p-4 hover:bg-gray-900 transition-colors cursor-pointer">
                      <p className="text-[10px] text-gray-500 mb-1">C-4</p>
                      <p className="text-sm font-semibold text-white">Site plan</p>
                      <p className="text-xs text-gray-400 mt-1">Overall Layout</p>
                    </div>
                    <div className="bg-black p-4 hover:bg-gray-900 transition-colors cursor-pointer">
                      <p className="text-[10px] text-gray-500 mb-1">C-5</p>
                      <p className="text-sm font-semibold text-white">Lot layout</p>
                      <p className="text-xs text-gray-400 mt-1">{estimatedLots} Lots</p>
                    </div>
                    <div className="bg-black p-4 hover:bg-gray-900 transition-colors cursor-pointer">
                      <p className="text-[10px] text-gray-500 mb-1">C-6</p>
                      <p className="text-sm font-semibold text-white">Road layout</p>
                      <p className="text-xs text-gray-400 mt-1">{roadDesign.roadNetworkType}</p>
                    </div>
                    <div className="bg-black p-4 hover:bg-gray-900 transition-colors cursor-pointer">
                      <p className="text-[10px] text-gray-500 mb-1">C-7</p>
                      <p className="text-sm font-semibold text-white">Road profile</p>
                      <p className="text-xs text-gray-400 mt-1">{roadDesign.pavement} ft Pavement</p>
                    </div>
                    <div className="bg-black p-4 hover:bg-gray-900 transition-colors cursor-pointer">
                      <p className="text-[10px] text-gray-500 mb-1">C-8</p>
                      <p className="text-sm font-semibold text-white">Details</p>
                      <p className="text-xs text-gray-400 mt-1">Specs & Notes</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Plan Components - only shown after plan generation */}
              {generatedPlan && (
                <PlanComponents
                  siteBoundary={siteBoundary}
                  zoning={zoning}
                  roadDesign={roadDesign}
                  amenities={amenities}
                  lots={generatedPlan.lots}
                  parcelArea={generatedPlan.parcelArea}
                  maxBuildableArea={generatedPlan.maxBuildableArea}
                />
              )}
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-8 py-24">
        <div className="text-xs uppercase tracking-widest mb-2 text-[#00e6a4]">capabilities</div>
        <h2 className="text-4xl font-bold mb-2 text-[#00e6a4]">Built for how engineers actually work</h2>
        <p className="text-gray-400 max-w-xl mb-12">Every feature maps to a real step in the Civil 3D site development workflow.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="text-2xl mb-4">⬡</div>
            <h3 className="text-lg font-semibold text-white mb-2">Parcel geometry engine</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Reads site boundaries from shapefiles, LandXML, or manual input. Computes metes & bounds, bearing/distance calls, and COGO-accurate parcel polygons — the C-2 boundary survey, automated.</p>
          </div>
          
          <div className="bg-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="text-2xl mb-4">◎</div>
            <h3 className="text-lg font-semibold text-white mb-2">Lot optimization</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Maximizes lot yield within zoning constraints. Respects min frontage, setbacks, and lot area simultaneously. Handles irregular parcels, curve lots, and cul-de-sac bulb geometry.</p>
          </div>
          
          <div className="bg-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="text-2xl mb-4">↗</div>
            <h3 className="text-lg font-semibold text-white mb-2">Road alignment design</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Generates horizontal alignments with proper PI/PC/PT geometry, curve tables (Δ, R, L, T, C), and station equations. Output matches Civil 3D alignment objects directly.</p>
          </div>
          
          <div className="bg-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="text-2xl mb-4">▿</div>
            <h3 className="text-lg font-semibold text-white mb-2">Vertical profile generation</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Creates finished grade profiles from TIN surface data. Places PVI points, calculates K-values, designs sag and crest curves meeting VDOT stopping sight distance requirements.</p>
          </div>
          
          <div className="bg-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="text-2xl mb-4">▦</div>
            <h3 className="text-lg font-semibold text-white mb-2">Standard details library</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Pulls from a library of VDOT-compliant paving sections, curb & gutter types (24" combination), fire hydrant installations, and utility trench details — the C-8 details sheet, auto-assembled.</p>
          </div>
          
          <div className="bg-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="text-2xl mb-4">⇣</div>
            <h3 className="text-lg font-semibold text-white mb-2">Civil 3D export</h3>
            <p className="text-sm text-gray-400 leading-relaxed">LandXML export with parcel, alignment, and surface objects. DXF export with full layer structure: C-PROP-LINE, C-ROAD-CNTR, C-ROAD-EDGE, C-ESMT-UTIL, C-LOTNUM, C-BLDG-FTPRNT.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="text-center py-32 px-8 border-t border-gray-800">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 text-[#00e6a4]">Stop drawing lots<br />by hand.</h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-10">SubDivMaker is being built by a civil engineering student who spent a semester doing this manually in Civil 3D. Every feature exists because the pain is real.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button 
            onClick={() => document.getElementById('app')?.scrollIntoView({behavior: 'smooth'})}
            className="bg-[#00e6a4] text-black border-none rounded-lg px-7 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Try the prototype
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-8 flex justify-between items-center flex-wrap gap-4 text-xs text-gray-500 max-w-6xl mx-auto">
        <span>SubDivMaker — Civil Engineering Tools</span>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 100 100" fill="none">
            <path d="M15 15 L85 15 L85 85 L15 85 Z" fill="#660000"/>
            <text x="50" y="65" fontSize="45" fontWeight="bold" fill="#FF6600" textAnchor="middle" fontFamily="Arial, sans-serif">VT</text>
          </svg>
          <svg className="w-5 h-5" viewBox="0 0 100 100" fill="none">
            <path d="M50 20 L55 35 L70 35 L58 45 L63 60 L50 50 L37 60 L42 45 L30 35 L45 35 Z" fill="#FF6600"/>
            <path d="M50 65 L55 80 L70 80 L58 90 L63 105 L50 95 L37 105 L42 90 L30 80 L45 80 Z" fill="#FF6600" transform="translate(0, -30)"/>
          </svg>
          <span>Built with Love in Virginia Tech</span>
        </div>
        <span>LandXML · DXF · VDOT Standards</span>
      </footer>
    </div>
  )
}

export default App
