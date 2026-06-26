import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Layers, 
  SlidersHorizontal, 
  Calendar, 
  Shield, 
  Activity, 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Eye, 
  Map as MapIcon, 
  Flame,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReportItem, Coordinates } from '../types';

interface InteractiveHazardMapProps {
  reports: ReportItem[];
  activeReport: ReportItem;
  setActiveReport: (report: ReportItem) => void;
  globalLang: 'en' | 'hi';
}

const SHI_TRANSLATIONS = {
  en: {
    sectionBadge: "GIS Spatial Analytics Overlay",
    sectionTitle: "Interactive Civic Threat Map",
    sectionSub: "Spatial database identifying local hazards, risk concentrations, and live resolution status on localized coordinate tracks.",
    filterCategory: "Hazard Category",
    filterSeverity: "Threat Severity",
    filterDate: "Date Offset",
    filterStatus: "Resolution Status",
    viewMode: "Display Overlay",
    all: "All Fields",
    low: "Low (<45%)",
    medium: "Medium (45-59%)",
    high: "High (60-74%)",
    critical: "Critical (25% Threshold)",
    allTime: "All Recorded",
    last7: "Last 7 Days",
    last30: "Last 30 Days",
    active: "Active Conflicts",
    resolved: "Resolved Treaties",
    pinView: "Marker Pin View",
    heatView: "Thermal Density Cloud",
    dualView: "Dual GIS Overlay",
    telemetryHeading: "Spatial Inspector",
    noSelections: "Hover over or click a hazard marker on the map to trigger deep telemetry tracking.",
    severityScore: "Severity Score",
    dateReported: "Date Input",
    stakeholders: "Stakeholders Covered",
    jurisdiction: "Jurisdiction Authority",
    actionPlan: "Communal Treaty Progress",
    focusCase: "Focus Active Case",
    unspecified: "Municipal Area Track",
    statusBadge: "Status Log",
    statsHotspots: "Tracked Hotspots",
    statsAvgSev: "Mean Threat Severity",
    statsConsensus: "Average Consensus",
    statsActive: "Unresolved Risks",
    sentimentSupport: "Supportive",
    sentimentNeutral: "Neutral",
    sentimentSkeptical: "Skeptical",
    sentimentOpposed: "Opposed"
  },
  hi: {
    sectionBadge: "जीआईएस स्थानिक विश्लेषण",
    sectionTitle: "इंटरैक्टिव नागरिक जोखिम मानचित्र",
    sectionSub: "स्थानिक डेटाबेस जो स्थानीय खतरों, जोखिम सांद्रता, और स्थानीयकृत ट्रैक पर समाधान स्थिति की पहचान करता है।",
    filterCategory: "जोखिम श्रेणी",
    filterSeverity: "खतरे की गंभीरता",
    filterDate: "समय सीमा",
    filterStatus: "समाधान स्थिति",
    viewMode: "मानचित्र दृश्य",
    all: "सभी श्रेणियां",
    low: "कम (<45%)",
    medium: "मध्यम (45-59%)",
    high: "उच्च (60-74%)",
    critical: "गंभीर (75%+ जोखिम)",
    allTime: "शुरू से अब तक",
    last7: "पिछले ७ दिन",
    last30: "पिछले ३० दिन",
    active: "सक्रिय संघर्ष",
    resolved: "सुलझाए गए मामले",
    pinView: "मार्कर पिन दृश्य",
    heatView: "थर्मल डेंसिटी क्लाउड",
    dualView: "दोहरा जीआईएस ओवरले",
    telemetryHeading: "स्थानिक निरीक्षक",
    noSelections: "गहन टेलीमेट्री ट्रैकिंग ट्रिगर करने के लिए मानचित्र पर किसी भी मार्कर पर क्लिक करें।",
    severityScore: "गंभीरता स्कोर",
    dateReported: "दर्ज तिथि",
    stakeholders: "शामिल हितधारक",
    jurisdiction: "अधिकारी कार्यक्षेत्र",
    actionPlan: "सामुदायिक समझौता प्रगति",
    focusCase: "सक्रिय मामला चुनें",
    unspecified: "नगर पालिका क्षेत्र",
    statusBadge: "स्थिति लॉग",
    statsHotspots: "ट्रैक किए गए जोखिम",
    statsAvgSev: "औसत खतरा गंभीरता",
    statsConsensus: "औसत सहमति दर",
    statsActive: "अनसुलझे खतरे",
    sentimentSupport: "समर्थक",
    sentimentNeutral: "neutral",
    sentimentSkeptical: "संदेहवादी",
    sentimentOpposed: "विरोधी"
  }
};

export default function InteractiveHazardMap({
  reports,
  activeReport,
  setActiveReport,
  globalLang
}: InteractiveHazardMapProps) {
  const t = SHI_TRANSLATIONS[globalLang];

  // Map settings and reference
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.FeatureGroup | null>(null);
  const heatmapLayerRef = useRef<L.FeatureGroup | null>(null);

  // Core filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  // Custom display overlay (Pin / Heatmap / Dual)
  const [viewMode, setViewMode] = useState<'pin' | 'heat' | 'dual'>('pin');

  // Currently inspected report on the map sidebar
  const [inspectedReport, setInspectedReport] = useState<ReportItem | null>(activeReport);

  // Update inspection if parent active report shifts
  useEffect(() => {
    if (activeReport) {
      setInspectedReport(activeReport);
      // Pan map to active report coordinates if map exists
      if (mapInstanceRef.current && activeReport.coordinates) {
        mapInstanceRef.current.setView([activeReport.coordinates.lat, activeReport.coordinates.lng], 14, {
          animate: true,
          duration: 1.2
        });
      }
    }
  }, [activeReport]);

  // Handle building filters
  const filteredReports = reports.filter(item => {
    // 1. Category Filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    // 2. Severity Filter
    const sevValue = item.visionAnalysis?.severityScore || item.resolutionScore || 50;
    if (selectedSeverity !== 'All') {
      if (selectedSeverity === 'critical' && sevValue < 75) return false;
      if (selectedSeverity === 'high' && (sevValue < 60 || sevValue >= 75)) return false;
      if (selectedSeverity === 'medium' && (sevValue < 45 || sevValue >= 60)) return false;
      if (selectedSeverity === 'low' && sevValue >= 45) return false;
    }

    // 3. Status Filter
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'active' && item.status !== 'active') return false;
      if (selectedStatus === 'resolved' && item.status !== 'resolved') return false;
    }

    // 4. Date Filter
    if (selectedPeriod !== 'All') {
      const now = Date.now();
      const reportDate = new Date(item.dateAdded).getTime();
      const diffDays = (now - reportDate) / (1000 * 60 * 60 * 24);
      if (selectedPeriod === '7' && diffDays > 7) return false;
      if (selectedPeriod === '30' && diffDays > 30) return false;
    }

    return true;
  });

  // Spatial stats calculated for currently filtered subset
  const totalHotspots = filteredReports.length;
  const meanSeverity = filteredReports.length > 0 
    ? Math.round(filteredReports.reduce((sum, item) => sum + (item.visionAnalysis?.severityScore || item.resolutionScore || 50), 0) / filteredReports.length)
    : 0;
  const unresolvedCount = filteredReports.filter(item => item.status === 'active').length;
  
  // Average consensus using standard calculation similar to dashboard
  const meanConsensusValue = filteredReports.length > 0
    ? Math.round(filteredReports.reduce((sum, report) => {
        let totalInfluence = 0;
        let weightedSentimentScore = 0;
        report.stakeholders?.forEach((st: any) => {
          let sentimentWeight = 50;
          if (st.sentiment === 'supportive') sentimentWeight = 100;
          else if (st.sentiment === 'neutral') sentimentWeight = 70;
          else if (st.sentiment === 'skeptical') sentimentWeight = 45;
          else if (st.sentiment === 'opposed') sentimentWeight = 15;
          totalInfluence += st.influence;
          weightedSentimentScore += (sentimentWeight * st.influence);
        });
        const sentimentBase = totalInfluence > 0 ? (weightedSentimentScore / totalInfluence) : 70;
        const finalEst = Math.round(sentimentBase * 0.65 + (100 - (report.visionAnalysis?.severityScore || 50)) * 0.15 + 15);
        return sum + Math.max(15, Math.min(100, finalEst));
      }, 0) / filteredReports.length)
    : 75;

  // Render Map pins and heatmap circles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not yet loaded
    if (!mapInstanceRef.current) {
      const initialCenter: [number, number] = activeReport?.coordinates 
        ? [activeReport.coordinates.lat, activeReport.coordinates.lng]
        : [23.3695, 85.3248];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 13,
        scrollWheelZoom: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(map);

      // Create layers
      markersLayerRef.current = L.featureGroup().addTo(map);
      heatmapLayerRef.current = L.featureGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const heatmapLayer = heatmapLayerRef.current;

    if (!map || !markersLayer || !heatmapLayer) return;

    // Clear old elements
    markersLayer.clearLayers();
    heatmapLayer.clearLayers();

    // Redraw based on current filtered records and viewMode
    filteredReports.forEach((report) => {
      const coords = report.coordinates || { lat: 23.3695, lng: 85.3248 };
      const sev = report.visionAnalysis?.severityScore || report.resolutionScore || 50;

      // Decide visual color based on threat severity for vectors
      let colorMetric = '#ef4444'; // Red
      if (sev < 45) {
        colorMetric = '#10b981'; // Emerald Green
      } else if (sev < 60) {
        colorMetric = '#fbbf24'; // Amber Yellow
      } else if (sev < 75) {
        colorMetric = '#f97316'; // Orange
      }

      // 1. PIN VIEW OVERLAYS
      if (viewMode === 'pin' || viewMode === 'dual') {
        const marker = L.marker([coords.lat, coords.lng], {
          icon: createCustomDivIcon(report, colorMetric)
        });

        // Interactive callback for map sidebar inspector
        marker.on('click', () => {
          setInspectedReport(report);
          map.setView([coords.lat, coords.lng], 14, { animate: true });
        });

        // Add hover popup
        const statusLabel = report.status === 'resolved' 
          ? `<span class="px-1.5 py-0.5 text-[9px] font-mono tracking-wider font-semibold rounded bg-emerald-100 text-emerald-800 border border-emerald-300">RESOLVED</span>`
          : `<span class="px-1.5 py-0.5 text-[9px] font-mono tracking-wider font-semibold rounded bg-rose-100 text-rose-800 border border-rose-300">ACTIVE</span>`;
        
        const popupContent = `
          <div class="p-2 font-sans text-slate-900 leading-snug w-52">
            <div class="flex items-center justify-between mb-1 gap-1.5">
              <span class="text-[9px] font-mono uppercase tracking-widest text-[#7E1E2C] font-semibold">${report.category}</span>
              ${statusLabel}
            </div>
            <h4 class="font-semibold text-xs text-slate-950 mb-1 leading-tight line-clamp-2">${report.title}</h4>
            <div class="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200 mt-1.5 text-[10px] text-slate-500">
              <div>
                <span class="block text-[8px] uppercase tracking-wider text-slate-400 font-medium">Severity</span>
                <span class="font-mono font-semibold text-slate-800">${sev}%</span>
              </div>
              <div>
                <span class="block text-[8px] uppercase tracking-wider text-slate-400 font-medium">Agreement</span>
                <span class="font-mono font-semibold text-slate-800">${report.resolutionScore}%</span>
              </div>
            </div>
            <p class="text-[9px] text-[#7E1E2C] mt-2 font-mono font-medium italic">👉 Click marker to inspect details</p>
          </div>
        `;

        marker.bindPopup(popupContent, { closeButton: false, offset: L.point(0, -5) });
        markersLayer.addLayer(marker);
      }

      // 2. THERMAL DENSITY HEATMAP LAYER
      if (viewMode === 'heat' || viewMode === 'dual') {
        // Build authentic concentric "halo gradient clouds" using multiple layered SVG circle points to simulate thermal bleed
        const innerRad = 150 + (sev * 2.5);
        const outerRad = innerRad * 2.2;

        // Outer low density envelope
        const outerCircle = L.circle([coords.lat, coords.lng], {
          radius: outerRad,
          stroke: false,
          fillColor: colorMetric,
          fillOpacity: 0.08,
          interactive: false
        });

        // Intermediate core
        const midCircle = L.circle([coords.lat, coords.lng], {
          radius: innerRad,
          stroke: false,
          fillColor: colorMetric,
          fillOpacity: 0.18,
          interactive: false
        });

        // Focal core hotspot
        const centerCircle = L.circle([coords.lat, coords.lng], {
          radius: 50,
          stroke: true,
          color: colorMetric,
          weight: 1,
          opacity: 0.45,
          fillColor: '#ffffff',
          fillOpacity: 0.5,
          interactive: true
        });

        centerCircle.on('click', () => {
          setInspectedReport(report);
          map.setView([coords.lat, coords.lng], 14, { animate: true });
        });

        heatmapLayer.addLayer(outerCircle);
        heatmapLayer.addLayer(midCircle);
        heatmapLayer.addLayer(centerCircle);
      }
    });

  }, [filteredReports, viewMode]);

  // Create DivIcon template dynamically avoiding failing image loads
  const createCustomDivIcon = (report: ReportItem, colorMetric: string) => {
    const sev = report.visionAnalysis?.severityScore || report.resolutionScore || 50;

    // Custom Category Mini Icons (raw SVGs for 100% load reliability)
    let path = '';
    switch (report.category) {
      case 'Transport':
        path = `<path stroke-linecap="round" stroke-linejoin="round" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 .6.4 1 1 1h1M14 17H8M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>`;
        break;
      case 'Safety':
        path = `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>`;
        break;
      case 'Energy':
        path = `<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>`;
        break;
      case 'Environmental':
        path = `<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>`;
        break;
      case 'Infrastructure':
      default:
        path = `<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>`;
        break;
    }

    const pinHtml = `
      <div class="relative group cursor-pointer flex items-center justify-center w-8 h-8 rounded-full border border-slate-700/35 shadow-lg bg-white transition hover:scale-110">
        <!-- Center icon node colored by severity -->
        <div class="flex items-center justify-center w-6 h-6 rounded-full" style="background-color: ${colorMetric}22; color: ${colorMetric}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            ${path}
          </svg>
        </div>
        
        <!-- Ripple effect for Critical severity levels -->
        ${sev >= 75 ? `
          <span class="absolute -inset-0.5 rounded-full border-2 border-rose-500 animate-ping opacity-25"></span>
          <span class="absolute -top-1 -right-1 flex h-2 w-2">
            <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
        ` : ''}
      </div>
    `;

    return L.divIcon({
      html: pinHtml,
      className: 'custom-div-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -14]
    });
  };

  return (
    <section id="interactive_hazard_spatial_map" className="w-full pt-8 pb-12 border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Block with Editorial/Typography specs */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950 border border-slate-700/40 rounded-full text-[11px] font-mono uppercase tracking-widest text-indigo-600 font-semibold mb-2 shadow-xs">
            <Activity className="w-3.5 h-3.5" />
            <span>{t.sectionBadge}</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100 mb-2 tracking-tight">
            {t.sectionTitle}
          </h2>
          <p className="text-xs sm:text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
            {t.sectionSub}
          </p>
          <div className="pt-2 flex items-center justify-center gap-1 text-[10px] text-indigo-600 font-mono tracking-wider italic">
            <span>✨ {globalLang === 'hi' ? "सत्यापित अक्षांश-देशांतर और रियल-टाइम स्थानिक विश्लेषकों का समन्वय।" : "AI spatial coordination mapping with verified latitudes, longitudes and density analysis."}</span>
          </div>
        </div>

        {/* Dynamic Spatial Summary Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#FAF9F5] border border-slate-800 p-3 sm:p-4 rounded-xl shadow-xs">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-600">{t.statsHotspots}</div>
            <div className="font-display font-extrabold text-xl sm:text-2xl text-slate-100 mt-1 flex items-baseline gap-1">
              <span>{totalHotspots}</span>
              <span className="text-xs text-slate-500 font-mono font-medium">/ {reports.length}</span>
            </div>
          </div>
          
          <div className="bg-[#FAF9F5] border border-slate-800 p-3 sm:p-4 rounded-xl shadow-xs">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-600">{t.statsAvgSev}</div>
            <div className="font-display font-extrabold text-xl sm:text-2xl text-slate-100 mt-1 flex items-baseline gap-1" style={{ color: meanSeverity >= 70 ? '#7E1E2C' : '#3F5E48' }}>
              <span>{meanSeverity}%</span>
              <span className="text-[10px] font-mono text-slate-500">
                {meanSeverity >= 75 ? 'Critical' : meanSeverity >= 60 ? 'High' : 'Moderate'}
              </span>
            </div>
          </div>

          <div className="bg-[#FAF9F5] border border-slate-800 p-3 sm:p-4 rounded-xl shadow-xs">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-600">{t.statsConsensus}</div>
            <div className="font-display font-extrabold text-xl sm:text-2xl text-emerald-500/90 mt-1 flex items-baseline gap-1">
              <span>{meanConsensusValue}%</span>
              <span className="text-[9px] font-mono text-slate-500">Agreement</span>
            </div>
          </div>

          <div className="bg-[#FAF9F5] border border-slate-800 p-3 sm:p-4 rounded-xl shadow-xs">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-600">{t.statsActive}</div>
            <div className="font-display font-extrabold text-xl sm:text-2xl text-slate-100 mt-1 flex items-baseline gap-1">
              <span>{unresolvedCount}</span>
              <span className="text-[9px] font-mono text-indigo-600 bg-indigo-950 px-1 py-0.5 rounded">LIVE</span>
            </div>
          </div>
        </div>

        {/* Advanced Filters Control Bar */}
        <div className="bg-[#F4F0E6] border border-slate-800 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
            <SlidersHorizontal className="w-4 h-4 text-[#7E1E2C]" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
              {globalLang === 'hi' ? 'जीआईएस स्थानिक फिल्टर' : 'GIS Spatial Filter Console'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
            {/* Category Filter */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">{t.filterCategory}</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs font-sans px-3 py-2 bg-[#FAF9F5] border border-slate-800 rounded-lg text-slate-300 outline-none focus:border-[#7E1E2C]"
              >
                <option value="All">{t.all}</option>
                <option value="Transport">Transport</option>
                <option value="Safety">Safety</option>
                <option value="Energy">Energy</option>
                <option value="Environmental">Environmental</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">{t.filterSeverity}</label>
              <select 
                value={selectedSeverity} 
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full text-xs font-sans px-3 py-2 bg-[#FAF9F5] border border-slate-800 rounded-lg text-slate-300 outline-none focus:border-[#7E1E2C]"
              >
                <option value="All">{t.all}</option>
                <option value="critical">{t.critical}</option>
                <option value="high">{t.high}</option>
                <option value="medium">{t.medium}</option>
                <option value="low">{t.low}</option>
              </select>
            </div>

            {/* Date period */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">{t.filterDate}</label>
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full text-xs font-sans px-3 py-2 bg-[#FAF9F5] border border-slate-800 rounded-lg text-slate-300 outline-none focus:border-[#7E1E2C]"
              >
                <option value="All">{t.allTime}</option>
                <option value="7">{t.last7}</option>
                <option value="30">{t.last30}</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">{t.filterStatus}</label>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs font-sans px-3 py-2 bg-[#FAF9F5] border border-slate-800 rounded-lg text-slate-300 outline-none focus:border-[#7E1E2C]"
              >
                <option value="All">{t.all}</option>
                <option value="active">{t.active}</option>
                <option value="resolved">{t.resolved}</option>
              </select>
            </div>

            {/* Overlay mode selector */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">{t.viewMode}</label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#FAF9F5] border border-slate-800 rounded-lg">
                <button 
                  onClick={() => setViewMode('pin')}
                  className={`py-1 text-[9px] font-mono rounded font-semibold uppercase tracking-wider max-h-[30px] border transition-colors ${viewMode === 'pin' ? 'bg-[#7E1E2C] text-white border-slate-900' : 'text-slate-500 border-transparent hover:bg-slate-800/10'}`}
                  title={t.pinView}
                >
                  Pins
                </button>
                <button 
                  onClick={() => setViewMode('heat')}
                  className={`py-1 text-[9px] font-mono rounded font-semibold uppercase tracking-wider max-h-[30px] border transition-colors ${viewMode === 'heat' ? 'bg-[#7E1E2C] text-white border-slate-900' : 'text-slate-500 border-transparent hover:bg-slate-800/10'}`}
                  title={t.heatView}
                >
                  Heat
                </button>
                <button 
                  onClick={() => setViewMode('dual')}
                  className={`py-1 text-[9px] font-mono rounded font-semibold uppercase tracking-wider max-h-[30px] border transition-colors ${viewMode === 'dual' ? 'bg-[#7E1E2C] text-white border-slate-900' : 'text-slate-500 border-transparent hover:bg-slate-800/10'}`}
                  title={t.dualView}
                >
                  Dual
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map visual canvas grid + Telemetry drawer */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Mapping Arena */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative w-full flex-1 min-h-[400px] sm:min-h-[480px] lg:h-[520px] bg-[#FAF9F5] border border-slate-800 rounded-xl overflow-hidden shadow-md">
              
              {/* Leaflet instance container */}
              <div 
                ref={mapContainerRef} 
                className="absolute inset-0 z-10"
                style={{ background: '#FAF9F5' }}
              />

              {/* Absolute GIS compass/indicator overlay panel */}
              <div className="absolute bottom-4 right-4 z-20 bg-[#FAF9F5]/95 border border-slate-800 p-2 text-[9px] font-mono tracking-wider rounded-lg shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                <div className="h-2 w-2 rounded-full bg-[#7E1E2C] animate-pulse" />
                <span className="text-slate-300 font-semibold uppercase">GIS OVERLAY ACTIVE</span>
              </div>

              {/* Thermal legend overlay */}
              {viewMode !== 'pin' && (
                <div className="absolute top-4 left-4 z-20 bg-[#FAF9F5]/95 border border-slate-800 p-2.5 rounded-lg shadow-lg backdrop-blur-md max-w-[140px]">
                  <h5 className="text-[8px] font-mono uppercase tracking-widest text-slate-500 font-bold mb-1.5">GIS HEATINDEX</h5>
                  <div className="flex flex-col gap-1 text-[8px] font-mono text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-rose-600 inline-block opacity-75" />
                      <span>Critical Hotspots</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block opacity-75" />
                      <span>High Risk Area</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" />
                      <span>Medium Exposure</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                      <span>Low Exposure</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Telemetry Inspection Drawer Side Panel */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="bg-[#FAF9F5] border border-slate-800 rounded-xl p-5 shadow-md flex-1 flex flex-col h-full min-h-[400px]">
              
              <div className="flex items-center justify-between pb-3.5 border-b border-dotted border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#7E1E2C]" />
                  <h4 className="font-display font-extrabold text-[#7E1E2C] text-sm tracking-wide">
                    {t.telemetryHeading}
                  </h4>
                </div>
                {inspectedReport && (
                  <span className="text-[9px] font-mono bg-indigo-950 text-indigo-600 px-2 py-0.5 rounded border border-slate-800/50 font-bold shadow-xs">
                    {inspectedReport.id.toUpperCase()}
                  </span>
                )}
              </div>

              <AnimatePresence mode="wait">
                {inspectedReport ? (
                  <motion.div 
                    key={inspectedReport.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col justify-between h-full"
                  >
                    <div>
                      {/* Badge categorization & Status line */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-[#7E1E2C]/10 text-[#7E1E2C] border border-[#7E1E2C]/30 rounded">
                          {inspectedReport.category}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase">{t.statusBadge}: </span>
                          <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase border ${
                            inspectedReport.status === 'resolved' 
                              ? 'bg-emerald-950 text-emerald-500 border-emerald-800/40' 
                              : 'bg-rose-950 text-rose-500 border-rose-800/40 animate-pulse'
                          }`}>
                            {inspectedReport.status}
                          </span>
                        </div>
                      </div>

                      {/* Title & Coordinates track */}
                      <h3 className="font-display font-black text-slate-100 text-base leading-tight mb-2">
                        {inspectedReport.title}
                      </h3>

                      <div className="flex items-center gap-1 text-[9px] font-mono text-slate-600 mb-3 bg-[#F4F0E6] p-1.5 rounded border border-slate-800/50">
                        <Info className="w-3 h-3 text-[#7E1E2C] shrink-0" />
                        <span>LOC: {inspectedReport.location || t.unspecified}</span>
                        <span className="mx-1 text-slate-700">|</span>
                        <span>LAT: {inspectedReport.coordinates?.lat.toFixed(4) || "23.3695"}</span>
                        <span className="mx-1 text-slate-700">|</span>
                        <span>LNG: {inspectedReport.coordinates?.lng.toFixed(4) || "85.3248"}</span>
                      </div>

                      {/* Severity Index Meter */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                          <span>{t.severityScore}</span>
                          <span className="font-bold text-slate-300">
                            {inspectedReport.visionAnalysis?.severityScore || inspectedReport.resolutionScore || 50}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-900 flex">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${inspectedReport.visionAnalysis?.severityScore || inspectedReport.resolutionScore || 50}%`,
                              backgroundColor: (inspectedReport.visionAnalysis?.severityScore || inspectedReport.resolutionScore || 50) >= 75 ? '#ef4444' : (inspectedReport.visionAnalysis?.severityScore || inspectedReport.resolutionScore || 50) >= 60 ? '#f97316' : '#fbbf24'
                            }}
                          />
                        </div>
                      </div>

                      {/* Stakeholder consensus checklist */}
                      <div className="mb-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-2 font-bold select-none border-b border-dotted border-slate-800 pb-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{t.stakeholders}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                          {inspectedReport.stakeholders && inspectedReport.stakeholders.length > 0 ? (
                            inspectedReport.stakeholders.map((st) => (
                              <div key={st.id} className="flex justify-between items-center text-[10px] p-2 py-1.5 bg-[#F4F0E6] rounded border border-slate-800/40">
                                <span className="font-sans font-medium text-slate-300 leading-tight pr-1.5">{st.name}</span>
                                <span className={`shrink-0 px-2 py-0.5 text-[8px] font-mono uppercase font-bold rounded border ${
                                  st.sentiment === 'supportive' ? 'bg-emerald-950 text-emerald-500 border-emerald-800/30' :
                                  st.sentiment === 'neutral' ? 'bg-blue-950 text-blue-500 border-blue-800/30' :
                                  st.sentiment === 'skeptical' ? 'bg-amber-950 text-amber-500 border-amber-800/30' :
                                  'bg-rose-950 text-rose-500 border-rose-800/30'
                                }`}>
                                  {st.sentiment}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-[10px] font-mono italic text-slate-500">None detected.</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[10px] font-mono border-t border-slate-800 pt-3">
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-slate-500">{t.dateReported}</span>
                          <span className="font-semibold text-slate-300">{inspectedReport.dateAdded}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-slate-500">Consensus Rate</span>
                          <span className="font-semibold text-slate-300">{inspectedReport.resolutionScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Button to focus entire screen active case on this point */}
                    <div className="pt-4 border-t border-slate-800 mt-4">
                      <button
                        onClick={() => {
                          setActiveReport(inspectedReport);
                          const timelineNode = document.getElementById("active-cases-consensus-deepdive");
                          if (timelineNode) {
                            timelineNode.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-[#7E1E2C] hover:bg-[#8F2B39] text-white rounded-lg font-mono text-xs uppercase tracking-wider font-semibold shadow-md active:scale-98 transition-transform"
                      >
                        <span>{t.focusCase}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <MapIcon className="w-10 h-10 text-slate-600 mb-3 stroke-1 animate-pulse" />
                    <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                      {t.noSelections}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
