import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Map, 
  Globe, 
  Building2, 
  TreePine, 
  Route, 
  Users, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  FileText,
  Activity,
  Layers,
  Zap,
  TrendingUp,
  Inbox,
  AlertOctagon,
  Check
} from 'lucide-react';

interface ImpactScalabilityProps {
  globalLang: 'en' | 'hi';
}

interface MetricCard {
  value: string;
  label: string;
  lblHi: string;
  change: string;
  changeHi: string;
  icon: React.ReactNode;
  color: string;
}

export default function ImpactScalability({ globalLang }: ImpactScalabilityProps) {
  const [activePhase, setActivePhase] = useState<number>(0);

  const metrics: MetricCard[] = [
    {
      value: "94.2%",
      label: "Ranchi Pilot Consent Rate",
      lblHi: "रांची पायलट सहमति दर",
      change: "+37.4% Stance Improvement",
      changeHi: "+37.4% नागरिक दृष्टिकोण सुधार",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5"
    },
    {
      value: "-88%",
      label: "Consensus Negotiation Time",
      lblHi: "विवाद सुलझाने का समय",
      change: "Reduced from 30 Days to 1.5 Min",
      changeHi: "30 दिनों से घटकर मात्र 1.5 मिनट",
      icon: <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />,
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
    },
    {
      value: "+4.5x",
      label: "Marginalized Sentiment Uplift",
      lblHi: "अल्पमत वर्गों के विश्वास में वृद्धि",
      change: "Verified across Student & Tribals",
      changeHi: "छात्रावास और जनजातीय समूहों से सत्यापित",
      icon: <Users className="w-5 h-5 text-pink-400" />,
      color: "border-pink-500/30 text-pink-400 bg-pink-500/5"
    },
    {
      value: "7,300+",
      label: "Active Citizens Engaged",
      lblHi: "सक्रिय नागरिक भागीदारी",
      change: "Real-time ledger entries",
      changeHi: "वास्तविक समय खाता प्रविष्टियां",
      icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
      color: "border-amber-500/30 text-amber-400 bg-amber-500/5"
    }
  ];

  const currentUseCases = [
    {
      id: "drainage",
      title: "Drainage Siting & Conflicts",
      titleHi: "जल निकासी विवाद और नियोजन",
      desc: "Resolves alignment disputes between shopkeepers claiming silt backwashing and surrounding residents wanting clean street corridors.",
      descHi: "दुकानदारों (जो सिल्ट जमा होने का दावा करते हैं) और स्वच्छ गलियारा चाहने वाले निवासियों के बीच जल-निकासी मार्ग के विवाद निपटाए जाते हैं।",
      icon: <Route className="w-4 h-4 text-indigo-400" />,
      tag: "Infrastructure",
      tagHi: "बुनियादी ढांचा"
    },
    {
      id: "waterlogging",
      title: "Monsoon Waterlogging Safety",
      titleHi: "मानसून जलभराव सुरक्षा प्रबंधन",
      desc: "Connects localized hydrological blockages to ecological bypass zones and water harvesting storage pools to manage flash floods.",
      descHi: "बाढ़ की स्थिति में पानी की निकासी के लिए स्थानीय रुकावटों को सीधे प्राकृतिक जल संचयन क्षेत्रों (Groves) से जोड़ता है।",
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      tag: "Hydrology",
      tagHi: "जल विज्ञान"
    },
    {
      id: "waste",
      title: "Municipal Waste Allocation",
      titleHi: "नगरपालिका अपशिष्ट वितरण समन्वय",
      desc: "Mediates dump placements near girls' dormitories by strictly honoring youth curfew hours and local zoning safety regulations.",
      descHi: "युवाओं के सुरक्षा नियमों और स्थानीय भूमि उपयोग नियमों का आदर करते हुए हॉस्टल आदि के समीप कचरा डंपिंग स्थलों का शांतिपूर्ण स्थान-नियोजन करता है।",
      icon: <TreePine className="w-4 h-4 text-pink-400" />,
      tag: "Sanitation",
      tagHi: "स्वच्छता"
    }
  ];

  const futureUseCases = [
    {
      title: "Road Construction Routing",
      titleHi: "सड़क निर्माण मार्ग संरेखण",
      desc: "Negotiating right-of-way claims dynamically and defining non-disruptive transit loops prior to concrete pouring.",
      descHi: "अतिक्रमण और अधिकार दावों का गतिशील समाधान करके निर्माण कार्य शुरू होने से पूर्व ही जन-सहमति मार्ग का निर्धारण करना।",
      icon: <Route className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Smart City Infrastructure IoT",
      titleHi: "स्मार्ट सिटी सेंसर व इंटरनेट ऑफ थिंग्स (IoT)",
      desc: "Siting smart garbage containers and air quality sensors near sensitive demographic zones (like colleges and hostels).",
      descHi: "संवेदनशील क्षेत्रों (जैसे शिक्षा केंद्रों के पास) स्मार्ट अपशिष्ट डिब्बों तथा वायु गुणवत्ता निगरानी उपकरणों का सही नियोजन करना।",
      icon: <Zap className="w-5 h-5 text-amber-400" />
    },
    {
      title: "Community Development Hubs",
      titleHi: "सामुदायिक विकास केन्द्रीकरण",
      desc: "Locating community parks, health clinics, and ration dispensaries through structural interest-alignment modeling.",
      descHi: "पारस्परिक हितों के विश्लेषण द्वारा सामुदायिक पार्क, स्वास्थ्य केंद्रों और राशन दुकानों के लिए उपयुक्त स्थान का चुनाव।",
      icon: <Building2 className="w-5 h-5 text-indigo-400" />
    },
    {
      title: "Dynamic Public Consultations",
      titleHi: "त्वरित जन-सुनवाई प्रणाली",
      desc: "Replacing tedious paper-heavy, months-long public hearings with instant bilingual consensus-building portals.",
      descHi: "महीनों चलने वाली पारम्परिक लालफीताशाही युक्त जन-सुनवाइयों को डिजिटल बहुभाषी आम सहमति मंच में बदलना।",
      icon: <Users className="w-5 h-5 text-pink-400" />
    },
    {
      title: "Environmental Urban Planning",
      titleHi: "पर्यावरणीय शहरी नियोजन",
      desc: "Enforcing statutory nature zones, sacred adivasi buffers, and natural bio-retention groves directly on building codes.",
      descHi: "पर्यावरणीय नियमों, सांस्कृतिक विरासत क्षेत्रों तथा जैविक जल धारण बफ़र को सीधे म्यूनिसिपल कोड्स से जोड़ना।",
      icon: <TreePine className="w-5 h-5 text-emerald-400" />
    }
  ];

  const scalingPhases = [
    {
      phase: "Phase 1",
      title: "Local Ranchi Sandbox",
      titleHi: "स्थानीय रांची सैंडबॉक्स",
      sub: "Hyperlocal Alignment",
      subHi: "अति-स्थानीय सहमति",
      desc: "Refining custom multi-objective mediation formulas on hydrological hazards, commercial transit blocks, and educational zones in Raipur/Ranchi.",
      descHi: "रायपुर/रांची में जल विज्ञान संबंधी संकटों, व्यावसायिक बाधाओं और शैक्षणिक क्षेत्रों में आम सहमति के सूत्रों को परखना।",
      icon: <Building2 className="w-5 h-5 text-indigo-400" />
    },
    {
      phase: "Phase 2",
      title: "Statewide GIS Ingest",
      titleHi: "राज्यव्यापी भू-स्थानिक एकीकरण",
      sub: "Jharkhand Municipal Rollout",
      subHi: "झारखंड मुख्य जिलों में विस्तार",
      desc: "Connecting with state Department of Urban Development GIS interfaces to auto-trigger conflict vectors directly on city land registration grids.",
      descHi: "शहरी विकास विभाग के भू-स्थानिक जीआईएस पोर्टल से जुड़कर भूमि आवंटन ग्रिड पर सीधे संघर्षों का विश्लेषण करना।",
      icon: <Map className="w-5 h-5 text-emerald-400" />
    },
    {
      phase: "Phase 3",
      title: "India Stack & DPI Scale",
      titleHi: "इंडिया स्टैक और डिजिटल इंफ्रास्ट्रक्चर",
      sub: "National APIs Integration",
      subHi: "राष्ट्रीय एपीआई स्तर पर जुड़ाव",
      desc: "Utilizing India's open API infrastructure, including Bhashini translation pipelines for local dialects and e-Government APIs for ULB portals.",
      descHi: "भाषानी (Bhashini) अनुवाद एपीआई प्रणाली का उपयोग स्थानीय बोलियों के लिए करना तथा नगर निकायों (ULB) हेतु ई-गवर्नेंस एपीआई से जुड़ना।",
      icon: <Layers className="w-5 h-5 text-amber-400" />
    },
    {
      phase: "Phase 4",
      title: "National Sovereign Hub",
      titleHi: "राष्ट्रीय संप्रभु नागरिक केंद्र",
      sub: "4,000+ Municipalities Pan-India",
      subHi: "देश के ४,०००+ नगर निकय",
      desc: "Deploying self-authoritative community consensus engines nationwide, reducing municipal civil legal dispute filings by an estimated 40% globally.",
      descHi: "शहरी संघर्षों का स्थानीय स्तर पर ही १००% शांतिपूर्ण निपटारा सुनिश्चित करना, जिससे सिविल मुकदमों में ४०% से अधिक की कमी आए।",
      icon: <Globe className="w-5 h-5 text-blue-400" />
    }
  ];

  return (
    <div id="impact-scalability" className="py-20 border-t border-slate-900 bg-slate-950/60 relative overflow-hidden text-left scroll-mt-24">
      
      {/* Absolute Decorative Backdrops */}
      <div className="absolute top-1/4 -right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-16">
        
        {/* Section Heading with Silicon Valley / India Startup Pitch styling */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[11px] font-mono font-black text-indigo-400 uppercase tracking-widest animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{globalLang === 'hi' ? 'राष्ट्रव्यापी विकास और प्रभाव' : 'STARTUP PITCH DECK: SCALING NATIONWIDE'}</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-none bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
            {globalLang === 'hi' ? 'प्रभाव और राष्ट्रीय मापन ब्लूप्रिंट' : 'Impact & National Scalability'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
            {globalLang === 'hi' 
              ? 'रांची पायलट चरण की सफलता से सीखकर पूरे भारत के ४,०००+ नगर निकायों में इंडिया स्टैक, भाषानी एपीआई और जीआईएस एकीकरण द्वारा तीव्र आम सहमति समाधान प्रदान करना।' 
              : 'Transitioning from Ranchi pilot achievements into a sovereign conflict-resolution protocol capable of managing multi-stakeholder friction across 4,000+ Indian smart municipalities using Digital Public Infrastructure.'}
          </p>
        </div>

        {/* 1. National Performance Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              key={i}
              className={`p-6 rounded-2xl border ${m.color} relative overflow-hidden backdrop-blur-md shadow-lg`}
            >
              <div className="absolute right-4 top-4 opacity-15">
                {m.icon}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block font-bold">
                  {globalLang === 'hi' ? 'ट्रैक्टर मीट्रिक' : 'VERIFIED PILOT METRIC'}
                </span>
                <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white block">
                  {m.value}
                </span>
                <h4 className="text-xs font-bold text-slate-200 leading-snug">
                  {globalLang === 'hi' ? m.lblHi : m.label}
                </h4>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 pt-1 border-t border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{globalLang === 'hi' ? m.changeHi : m.change}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 2. Current vs. Future Use Cases Split (Bento Card Style) */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LHS: Ranchi Current Use Cases Pilot Panel (35% width) */}
          <div className="lg:col-span-5 bg-slate-900/40 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 flex flex-col justify-between backdrop-blur-xl relative shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Building2 className="w-24 h-24 text-slate-400 pointer-events-none" />
            </div>

            <div className="space-y-4 text-left">
              <span className="inline-block text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-widest font-black">
                {globalLang === 'hi' ? 'रांची पायलट उपयोग' : 'ACTIVE PILOT (RANCHI)'}
              </span>
              <h3 className="text-xl font-bold font-display text-white">
                {globalLang === 'hi' ? 'वर्तमान क्रियान्वित मामले' : 'Current Active Core Solved'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {globalLang === 'hi' 
                  ? 'रांची में हमने जलभराव, स्वच्छता संकटों और गलियारा नियोजन में परस्पर टकराने वाले हित-समूहों के बीच तुरंत शांतिपूर्ण समाधान खोजा है।'
                  : 'Direct, on-ground verification resolving high-friction community pain points across Raipur/Ranchi wards where conflicting civic agendas often block progress.'}
              </p>

              <div className="space-y-4 pt-2">
                {currentUseCases.map((use, index) => (
                  <div key={use.id} className="p-3.5 bg-slate-950/50 rounded-xl border border-slate-800 flex gap-3.5 items-start">
                    <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900 border border-white/5 text-slate-300">
                      {use.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-200">{globalLang === 'hi' ? use.titleHi : use.title}</h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-white/5 text-slate-500 rounded font-semibold">
                          {globalLang === 'hi' ? use.tagHi : use.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-450 leading-relaxed">
                        {globalLang === 'hi' ? use.descHi : use.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center gap-2 font-mono">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{globalLang === 'hi' ? 'वार्ड ४ और वार्ड ११ रायपुर पायलट सफलतापूर्वक सक्रिय।' : 'Raipur Ward-4 & Ward-11 pilot active & validated.'}</span>
            </div>
          </div>

          {/* RHS: Future Pan-India Use Cases Panel (65% width) */}
          <div className="lg:col-span-7 bg-slate-900/20 rounded-3xl border border-slate-900 p-6 sm:p-8 space-y-6 flex flex-col justify-between relative backdrop-blur-md">
            
            <div className="space-y-4">
              <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-widest font-black">
                {globalLang === 'hi' ? 'भविष्य की उपयोगिता' : 'PAN-INDIA SCALING EXPANSION'}
              </span>
              <h3 className="text-xl font-bold font-display text-white">
                {globalLang === 'hi' ? 'नवीन भविष्यकालीन उपयोग मामलों की योजना' : 'Future Multi-Objective Use Cases'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {globalLang === 'hi' 
                  ? 'शहरी विस्तार संघर्ष अपरिहार्य हैं। CivicSentinel स्थानीय हितों को तुरंत समझने और राष्ट्रव्यापी विकास कार्यक्रमों को तेजी से लागू करने में सहायता करेगा।'
                  : 'Urban development triggers complex community friction. CivicSentinel dynamically maps stakeholders, municipal codes, and structural engineering compromises before disputes escalate.'}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-3 text-left">
                {futureUseCases.map((f, idx) => (
                  <motion.div
                    whileHover={{ scale: 1.015, x: 2 }}
                    key={idx}
                    className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-slate-950 border border-white/5 text-slate-300">
                        {f.icon}
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-200">
                        {globalLang === 'hi' ? f.titleHi : f.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {globalLang === 'hi' ? f.descHi : f.desc}
                    </p>
                  </motion.div>
                ))}

                {/* Conceptual diagram representing scaling */}
                <div className="p-4 bg-gradient-to-br from-indigo-550/10 to-blue-550/10 rounded-xl border border-indigo-500/20 flex flex-col justify-between text-left col-span-1 sm:col-span-2 relative overflow-hidden group">
                  <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
                    <Globe className="w-32 h-32 text-indigo-400 group-hover:scale-110 transition duration-500" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-[11px] font-mono uppercase tracking-widest font-black">
                        {globalLang === 'hi' ? 'राष्ट्रीय स्तर पर जीआईएस मैपिंग' : 'DPI MUNICIPAL GIS PIPELINE'}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                      {globalLang === 'hi' ? 'राष्ट्रीय पीएम गतिशक्ति और भाषानी एपीआई इंटीग्रेशन' : 'PM GatiShakti & Bhashini Stack Localization'}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {globalLang === 'hi' 
                        ? 'भारत की भाषानी (Bhashini) अनुवाद कोर का उपयोग कर जिला स्तरों के विविध हितधारकों से सीधा क्षेत्रीय भाषा संवाद। स्थानीय भूमि विवादों के लिए सरकारी गतिशक्ति उपग्रह मैपिंग का एकीकरण।'
                        : 'Leveraging Sovereign AI to automatically translate consensus treaties into India-specific regional dialects via Bhashini API integration, instantly updating spatial GIS coordinates via government geoportals.'}
                    </p>
                  </div>
                  <div className="text-[9px] font-mono text-indigo-300 mt-2 flex items-center gap-1">
                    <span>APIs Synced</span>
                    <span className="animate-ping w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    <span>Real-time GIS Sandbox READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. National Scaling Pathway Roadmap (Interactive Visual Diagram) */}
        <div className="bg-slate-900/30 rounded-3xl border border-slate-900 p-6 sm:p-8 space-y-8 relative">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block font-bold">
                {globalLang === 'hi' ? 'रोडमैप ब्लूप्रिंट' : 'EXECUTIVE ACTION PLAN'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                {globalLang === 'hi' ? 'रांची सैंडओवर से भारत पैमाना' : 'Sovereign National Scaling Pathway'}
              </h3>
              <p className="text-xs text-slate-400">
                {globalLang === 'hi' 
                  ? 'नीचे दिए चरणों पर क्लिक करके देखें कि कैसे हम पायलट सैंडबॉक्स को एक एकीकृत राष्ट्रीय समाधान में बदल रहे हैं।'
                  : 'Click on a phase to explore the integrated modules, scaling parameters, and target milestones of our nationwide rollout.'}
              </p>
            </div>
            
            {/* Phase Pills Switcher */}
            <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-white/5">
              {scalingPhases.map((phase, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhase(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition select-none cursor-pointer ${
                    activePhase === idx 
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/10' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Phase {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Phase Detail Display with Animations */}
          <div className="grid md:grid-cols-12 gap-6 items-center">
            
            {/* Detail Layout */}
            <div className="md:col-span-5 space-y-4 text-left">
              <span className="inline-flex text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest font-black">
                {scalingPhases[activePhase].phase} - {globalLang === 'hi' ? scalingPhases[activePhase].subHi : scalingPhases[activePhase].sub}
              </span>
              <h4 className="text-2xl font-black text-white font-display leading-tight">
                {globalLang === 'hi' ? scalingPhases[activePhase].titleHi : scalingPhases[activePhase].title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                {globalLang === 'hi' ? scalingPhases[activePhase].descHi : scalingPhases[activePhase].desc}
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="px-2 py-1 rounded bg-slate-950 border border-white/5 text-indigo-400">
                  Target: ULBs Unified
                </span>
                <span className="px-2 py-1 rounded bg-slate-950 border border-white/5 text-emerald-400">
                  100% Zero-Loss Ledger
                </span>
              </div>
            </div>

            {/* RHS: Gorgeous SVG/CSS Scalability Diagram */}
            <div className="md:col-span-7 bg-slate-950 rounded-2xl border border-slate-900 p-6 flex flex-col justify-center min-h-[250px] relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 to-transparent pointer-events-none" />
              
              {/* Scale Diagram Concept */}
              <div className="relative flex flex-col gap-5">
                
                {/* Node Grid Layout */}
                <div className="flex items-center justify-between w-full px-4">
                  
                  {/* Local level */}
                  <div className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all duration-500 ${activePhase === 0 ? 'bg-indigo-600/10 border-indigo-400 scale-105 shadow-lg shadow-indigo-600/10' : 'bg-slate-900 border-white/5 opacity-50'}`}>
                    <Building2 className={`w-6 h-6 ${activePhase === 0 ? 'text-indigo-400 animate-bounce' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 font-bold">Local Ward</span>
                    <span className="text-[8px] bg-white/5 px-1 py-0.2 rounded text-slate-500">Ranchi</span>
                  </div>

                  {/* Connect arrow path */}
                  <div className="flex-1 h-[2px] bg-slate-800 mx-2 relative">
                    <div className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-700 ${activePhase >= 1 ? 'w-full' : 'w-0'}`} />
                    {activePhase >= 1 && <span className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                  </div>

                  {/* Stateful GIS State level */}
                  <div className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all duration-500 ${activePhase === 1 ? 'bg-emerald-600/10 border-emerald-400 scale-105 shadow-lg shadow-emerald-600/10' : 'bg-slate-900 border-white/5 opacity-50'}`}>
                    <Map className={`w-6 h-6 ${activePhase === 1 ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 font-bold">State GIS</span>
                    <span className="text-[8px] bg-white/5 px-1 py-0.2 rounded text-slate-500">Jharkhand</span>
                  </div>

                  {/* Connect arrow path */}
                  <div className="flex-1 h-[2px] bg-slate-800 mx-2 relative">
                    <div className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-700 ${activePhase >= 2 ? 'w-full' : 'w-0'}`} />
                    {activePhase >= 2 && <span className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                  </div>

                  {/* National Stack scale level */}
                  <div className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all duration-500 ${activePhase === 2 ? 'bg-amber-600/10 border-amber-400 scale-105 shadow-lg shadow-amber-600/10' : 'bg-slate-900 border-white/5 opacity-50'}`}>
                    <Layers className={`w-6 h-6 ${activePhase === 2 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 font-bold">India Stack</span>
                    <span className="text-[8px] bg-white/5 px-1 py-0.2 rounded text-slate-500">National</span>
                  </div>

                  {/* Connect arrow path */}
                  <div className="flex-1 h-[2px] bg-slate-800 mx-2 relative">
                    <div className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 to-blue-500 transition-all duration-700 ${activePhase >= 3 ? 'w-full' : 'w-0'}`} />
                    {activePhase >= 3 && <span className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-2 rounded-full bg-blue-400 animate-ping" />}
                  </div>

                  {/* Sovereign Hub level */}
                  <div className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all duration-500 ${activePhase === 3 ? 'bg-blue-600/10 border-blue-400 scale-105 shadow-lg shadow-blue-600/10' : 'bg-slate-900 border-white/5 opacity-50'}`}>
                    <Globe className={`w-6 h-6 ${activePhase === 3 ? 'text-blue-400 animate-spin-slow' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 font-bold">4k+ ULBs</span>
                    <span className="text-[8px] bg-white/5 px-1 py-0.2 rounded text-slate-500">Sovereign</span>
                  </div>

                </div>

                {/* Subsystem architecture ledger detail box */}
                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-2">
                  <div className="flex items-center justify-between text-slate-300 text-xs border-b border-white/5 pb-1.5 pb-2">
                    <span className="font-extrabold uppercase text-[10px] text-indigo-400 tracking-wider">Active Segment Simulation:</span>
                    <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded border border-white/5">ENG_MODE: DEPLOY_READY</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-slate-200 font-bold">Data Feed Syncing:</div>
                      <div>{activePhase === 0 ? "✓ Ward Hydrology Influx" : activePhase === 1 ? "✓ NIC State GIS Feed" : activePhase === 2 ? "✓ Bhashini Translator Dialects" : "✓ National Urban Digital Mission (NUDM)"}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-200 font-bold">Decentralized Trust:</div>
                      <div>{activePhase === 0 ? "✓ Local LocalStorage State Ledger" : activePhase === 1 ? "✓ Cloud Firestore Scaled Sync" : activePhase === 2 ? "✓ India Stack Open ID / eSign" : "✓ Sovereign Consensus Encryption Keys"}</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
