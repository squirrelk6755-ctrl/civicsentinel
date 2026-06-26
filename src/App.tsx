/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  AlertTriangle, 
  Cpu, 
  Users, 
  Route, 
  BarChart3, 
  PlusCircle, 
  CheckCircle2, 
  Languages, 
  FileText, 
  Send, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  ThumbsUp, 
  Check, 
  Activity, 
  FileCheck, 
  X, 
  Globe, 
  Building2, 
  MessageSquare,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkle,
  Upload,
  Info,
  Eye,
  EyeOff,
  Target,
  Home,
  ShoppingBag,
  Landmark,
  TreePine,
  Search,
  Filter,
  ArrowUpRight,
  HelpCircle,
  CheckCircle,
  Key,
  History,
  RotateCcw,
  Trash2,
  GripVertical
} from 'lucide-react';
import { INITIAL_REPORTS, MOCK_INITIAL_COMMENTS, MAPPING_STAKEHOLDERS_DATA, createDynamicReport, getCoordinatesFromLocation } from './data';
import { ReportItem, Stakeholder, ConsensusStep, CommunityComment, MappingStakeholder } from './types';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ImpactScalability from './components/ImpactScalability';
import InteractiveHazardMap from './components/InteractiveHazardMap';

const FORM_TRANSLATIONS = {
  en: {
    sectionBadge: "Interactive Ingestion Engine",
    sectionTitle: "1. Ingest New Infrastructure Conflict",
    sectionSub: "Simulate the submission of a neighborhood hazard or infrastructure dispute. CivicSentinel instantly parses visual input context and initializes the mediation interface.",
    formTitleLabel: "Hazard Title",
    formTitlePlaceholder: "e.g., Oakridge Overpass Repair Detours",
    formLocationLabel: "Location",
    formLocationPlaceholder: "e.g., Corner of Pine St & 14th Avenue",
    formCategoryLabel: "Primary Dispute Category",
    formUrgencyLabel: "Urgency Classification",
    formDescLabel: "Description",
    formDescPlaceholder: "Describe who disagrees and why. For example: High-speed rail crossing will repair safety hazards but local homeowners object to 85dB noise barriers blocking natural sunlight views.",
    dragMessage: "Drag & Drop visual environmental attachment here",
    dragSub: "Supports PNG, JPG, or cellular screenshots (Mocked in-browser upload)",
    dragLoaded: "Geotagged Photo Loaded!",
    dragChange: "Resolution and metadata read successful. Click or drop new file to replace.",
    btnSubmit: "Analyze Hazard",
    btnProcessing: "Analyzing Hazard...",
    bannerSuccess: "AI Sentinel synthesis successfully completed. Results updated across all dashboards!",
    btnRemoveImage: "Remove Image"
  },
  hi: {
    sectionBadge: "इंटरएक्टिव रिपोर्टींग माध्यम",
    sectionTitle: "1. नया बुनियादी ढांचा संघर्ष दर्ज करें",
    sectionSub: "आस-पड़ोस के खतरे या बुनियादी ढांचे के विवाद की स्थिति दर्ज करें। सिविकसेंटिनल तुरंत दृश्य संदर्भ का विश्लेषण कर सहमति तंत्र आरंभ करता है।",
    formTitleLabel: "खतरे का शीर्षक (Hazard Title)",
    formTitlePlaceholder: "जैसे, ओक्रिज ओवरपास मरम्मत मार्ग परिवर्तन",
    formLocationLabel: "स्थान (Location)",
    formLocationPlaceholder: "जैसे, पाइन स्ट्रीट और 14वें एवेन्यू का कोना",
    formCategoryLabel: "प्राथमिक विवाद श्रेणी",
    formUrgencyLabel: "तत्परता वर्गीकरण (Urgency Level)",
    formDescLabel: "विवरण (Description)",
    formDescPlaceholder: "बताएं कि कौन असहमत है और क्यों। जैसे: हाई-स्पीड रेल क्रॉसिंग सुरक्षा खतरों को ठीक करेगी लेकिन स्थानीय लोग प्राकृतिक सूर्य के प्रकाश को रोकने वाले शोर अवरोधकों का विरोध कर रहे हैं।",
    dragMessage: "विज़ुअल पर्यावरणीय दस्तावेज़ यहाँ खींचें और छोड़ें (Drag & Drop)",
    dragSub: "PNG, JPG या स्क्रीनशॉट समर्थित हैं (सिम्युलेटेड ब्राउज़र इनपुट)",
    dragLoaded: "जियोटैग की गई फोटो सफलतापूर्वक लोड हुई!",
    dragChange: "रिज़ॉल्यूशन और मेटाडेटा पठन सफल रहा। बदलने के लिए क्लिक करें या दूसरी फाइल छोड़ें।",
    btnSubmit: "खतरे का विश्लेषण करें (Analyze Hazard)",
    btnProcessing: "खतरे का विश्लेषण किया जा रहा है...",
    bannerSuccess: "एआई सेंटिनल संश्लेषण सफलतापूर्वक पूर्ण हुआ। सभी डैशबोर्ड अपडेट किए जा चुके हैं!",
    btnRemoveImage: "छवि हटाएं"
  }
};

const getBoundingBoxesForHazard = (hazardType: string) => {
  const normalized = (hazardType || '').toLowerCase();
  if (normalized.includes("water") || normalized.includes("pooling") || normalized.includes("flood") || normalized.includes("puddle")) {
    return [
      { top: '35%', left: '15%', width: '38%', height: '30%', label: 'POOLED STANDING WATER [74%]' },
      { top: '55%', left: '55%', width: '32%', height: '22%', label: 'SUBMERGED MARKS [89%]' }
    ];
  }
  if (normalized.includes("drainage") || normalized.includes("sewer") || normalized.includes("pipe") || normalized.includes("clog")) {
    return [
      { top: '40%', left: '25%', width: '45%', height: '35%', label: 'CLOGGED CATCH BASIN [98%]' },
      { top: '15%', left: '60%', width: '25%', height: '20%', label: 'SPOIL BACKFLOW [92%]' }
    ];
  }
  if (normalized.includes("dump") || normalized.includes("waste") || normalized.includes("garbage") || normalized.includes("trash")) {
    return [
      { top: '35%', left: '20%', width: '50%', height: '40%', label: 'UNSANCTIONED DEBRIS [96%]' },
      { top: '22%', left: '72%', width: '18%', height: '25%', label: 'PLASTIC RESIDUE [88%]' }
    ];
  }
  if (normalized.includes("light") || normalized.includes("lamp") || normalized.includes("luminaire") || normalized.includes("corridor") || normalized.includes("dark")) {
    return [
      { top: '10%', left: '42%', width: '16%', height: '28%', label: 'OUTAGE APEX LUMINAIRE [99%]' },
      { top: '55%', left: '20%', width: '40%', height: '25%', label: 'DARK PEDESTRIAN CODES [84%]' }
    ];
  }
  if (normalized.includes("damage") || normalized.includes("pothole") || normalized.includes("road surface") || normalized.includes("degradation") || normalized.includes("crack") || normalized.includes("asphalt")) {
    return [
      { top: '45%', left: '15%', width: '42%', height: '30%', label: 'CRITICAL STRUCTURAL POTHOLE [93%]' },
      { top: '30%', left: '60%', width: '28%', height: '22%', label: 'SURFACE EDGE CRACK [89%]' }
    ];
  }
  if (normalized.includes("space contention") || normalized.includes("transit corridor") || normalized.includes("contention")) {
    return [
      { top: '25%', left: '10%', width: '48%', height: '35%', label: 'HIGH-DEMAND PARKING ZONE [94%]' },
      { top: '50%', left: '60%', width: '30%', height: '25%', label: 'BIKE/TRANSIT VECTOR [91%]' }
    ];
  }
  if (normalized.includes("wildlife") || normalized.includes("bat") || normalized.includes("nocturnal") || normalized.includes("disruption")) {
    return [
      { top: '15%', left: '25%', width: '50%', height: '35%', label: 'BAT NESTING CANOPY [86%]' },
      { top: '55%', left: '10%', width: '35%', height: '20%', label: 'ACTIVE TRANSIT TRAILS [98%]' }
    ];
  }
  if (normalized.includes("mast") || normalized.includes("tower") || normalized.includes("telecom") || normalized.includes("siting")) {
    return [
      { top: '10%', left: '38%', width: '24%', height: '55%', label: 'PROPOSED TOWER PEAK [91%]' },
      { top: '35%', left: '10%', width: '25%', height: '30%', label: 'SCHOOL SIGHTLINE WINDOWS [89%]' }
    ];
  }
  // Default general
  return [
    { top: '30%', left: '25%', width: '50%', height: '40%', label: 'CIVIC CONFLICT AREA [91%]' }
  ];
};

const getProposalDocumentText = (directive: string, tone: string, focus: string, lang: 'en' | 'hi' = 'en') => {
  const dateStr = "2026-06-23";
  const protocolId = `CIVIC-MED-2026-${directive.toUpperCase().slice(0, 3)}-${tone.toUpperCase().slice(0, 3)}`;
  
  if (lang === 'hi') {
    let directiveNameHindi = "सामंजस्यपूर्ण सह-अस्तित्व और सुरक्षित बुनियादी ढांचा वितरण";
    if (directive === 'eco') {
      directiveNameHindi = "प्राथमिक पर्यावरण संरक्षण और पारंपरिक संप्रभुता सुरक्षा";
    } else if (directive === 'indigenous') {
      directiveNameHindi = "स्वदेशी संपत्ति संरक्षण और डायवर्टेड ड्रेनेज एलाइनमेंट";
    } else if (directive === 'rapid') {
      directiveNameHindi = "त्वरित बाढ़ सुरक्षा और छात्र सुरक्षा एकीकरण";
    }

    let toneNameHindi = tone === 'empathetic' ? "सहानुभूतिपूर्ण आम सहमति सूत्रधार" : tone === 'sovereign' ? "संप्रभु नगर निगम कार्यकारी डिक्री" : "पारंपरिक पंचायत परिषद प्रारूप";
    let focusNameHindi = focus === 'all' ? "व्यापक एकीकृत समूह (सभी निर्वाचन क्षेत्र)" : 
                       focus === 'Girls Hostel Students' ? "गर्ल्स हॉस्टल छात्राएं" :
                       focus === 'Adivasi Households' ? "आदिवासी वन परिवार" :
                       focus === 'Local Residents' ? "स्थानीय निवासी" :
                       focus === 'Shopkeepers' ? "स्थानीय व्यापारी" : focus;

    return `========================================================================
नगर आयुक्त कार्यालय एवं नागरिक समाधान ब्यूरो
नागरिक सह-अस्तित्व प्रभाग • प्रोटोकॉल कोड: ${protocolId}
------------------------------------------------------------------------
दस्तावेज़ प्रकार: आधिकारिक सार्वजनिक मध्यस्थता समझौता पत्र
अनुमोदन तिथि: ${dateStr} • स्थिति: संयुक्त हस्ताक्षर हेतु लंबित
आधिकारिक मध्यस्थ: एआई राजनयिक एजेंट सिस्टम (ग्रिड अल्फा v3.5)
निर्देशात्मक डिक्री: ${directiveNameHindi.toUpperCase()}
मध्यस्थता मोड: ${toneNameHindi.toUpperCase()}
लक्षित निर्वाचन क्षेत्र: ${focusNameHindi.toUpperCase()}
========================================================================

प्रस्तावना:
नागरिक बुनियादी ढांचा संघर्ष शमन संहिता की धारा 14-बी के तहत, यह दस्तावेज़ नगर निगम बाढ़ नियंत्रण और जल निकासी गलियारे के निर्माण को लेकर लंबित विवादों को हल करने के लिए एक कानूनी रूप से बाध्यकारी मध्यस्थता योजना स्थापित करता है। यह समाधान इलाके के सामाजिक equilibrium को बनाए रखने के साथ-साथ इंजीनियरिंग आवश्यकताओं को समन्वित करता है।

1. सामुदायिक चिंताओं का मूल्यांकन (COMMUNITY CONCERNS ASSESSED)
------------------------------------------
विभिन्न हितधारकों के साथ किए गए गहन साक्षात्कारों के आधार पर निम्नलिखित सुरक्षा एवं सामाजिक चिंताओं को दर्ज और हल किया गया है:
• गर्ल्स हॉस्टल छात्राएं: रात के समय पढ़ाई के बाद घर/हॉस्टल लौटते समय बिजली की कमी के कारण असुरक्षा। परीक्षाओं के दौरान भारी शोरगुल और निर्माण कार्य पर प्रतिबंध की मांग। बहु-मंजिला इमारतों की खिड़कियों से हॉस्टल कमरों में निजता का उल्लंघन।
• आदिवासी वन परिवार: पुराने मूल-वृक्षों (Ancestral Groves) और औषधीय जड़ी-बूटी क्षेत्रों के धार्मिक और सांस्कृतिक महत्व पर संकट। खुदाई एवं मलबे से स्थानीय पेयजल धाराओं में सिल्टेशन और प्रदूषण का डर।
• स्थानीय निवासी: निर्माण कार्यों के कारण सुबह की धूप/सौर ऊर्जा में रुकावट, भारी वाहनों के मार्ग परिवर्तन से घरों की नींव में कंपन और सड़कों पर गड्ढे होना।
• स्थानीय व्यवसायी: निर्माण अवरोधों के कारण दुकानों के प्रदर्शन का छिपना और ग्राहकों के लिए पार्किंग का अभाव।
• नगर निगम अधिकारी: वित्तीय अनुदान सीमाओं के तहत कठोर समय-सीमा का पालन और भविष्य के रखरखाव खर्च को न्यूनतम रखना।

2. समग्र प्रस्तावित शांतिपूर्ण समाधान (PROPOSED COMPROMISE SOLUTION)
------------------------------------------
इंजीनियरिंग आवश्यकताओं तथा आदिवासी, छात्र एवं स्थानीय निवासियों के हितों के बीच संतुलन स्थापित करने के लिए एआई राजनयिक ने निम्नलिखित सह-अस्तित्व जल निकासी योजना को अधिकृत किया है:
• भूमिगत गलियारा (Subterranean Corridor): वन क्षेत्र की हरियाली को 100% अक्षुण्ण रखने के लिए सभी ड्रेनेज चैनलों को माइक्रो-टनलिंग तकनीक द्वारा सड़क के नीचे पूरी तरह से भूमिगत बनाया जाएगा।
• पर्यावरण-संरक्षण एवं जल-शुद्धिकरण डिजाइन: नालियों के मुहाने पर दोहरे कक्ष वाले 'बायो-रिटेंशन' रिटेनिंग बेसिन की स्थापना। यह शहर के प्रदूषित जल को प्राकृतिक ज्वालामुखी मिट्टी के स्तर से छानकर भारी धातुओं को प्राकृतिक रूप से अलग करेगा।
• संरक्षण संरेखण (Rerouted Alignment): मुख्य सड़क निर्माण के संरेखण को पारंपरिक मूल-वृक्षों की सीमा से कम से कम 30 मीटर दूर स्थानांतरित किया जाएगा, जिससे आदिवासी संस्कृति एवं ऐतिहासिक रास्तों की कानूनी सुरक्षा सुनिश्चित होगी।

3. जोखिम शमन एवं सुरक्षा प्रोटोकॉल (RISK MITIGATION PROTOCOLS)
------------------------------------------
नागरिकों की सुरक्षा और निजता की गारंटी के लिए ठेकेदार और नगर निगम एजेंसियाँ निम्नलिखित नियमों को लागू करने के लिए कानूनी रूप से बाध्य हैं:
• पैदल पथ सुरक्षा एवं स्मार्ट लाइटिंग: हॉस्टल की बाहरी सीमा पर गति-संवेदनशील (Motion-gated), हल्के अम्बर-स्पेक्ट्रम वाले एलईडी मार्ग प्रकाश उपकरणों की स्थापना (ताकि प्रकाश प्रदूषण न फैले)।
• मौन कर्फ्यू (Quiet Curfew): आवासीय अध्ययन ब्लॉकों के आसपास दैनिक रूप से रात 20:00 बजे से सुबह 08:00 बजे तक उच्च-तीव्रता वाले उपकरणों के उपयोग पर पूर्ण प्रतिबंध, जिसे परीक्षा तिथियों के साथ सिंक्रनाइज़ किया जाएगा।
• धूल नियंत्रण प्रणाली: दुकानों के सामने हवा को साफ रखने के लिए स्वचालित, सौर-संचालित वाटर मिस्ट (धूल शमन) तोपों की तैनाती।
• पारभासी गोपनीयता बफ़र्स (Privacy Shields): मचान या ऊंची निर्माण संरचनाओं के चारों ओर अस्थायी रूप से 5-मीटर ऊंचे ध्वनि-रोधक और निजता बफ़र्स की स्थापना, ताकि छात्राओं की निजता सुरक्षित रहे।

4. चरणबद्ध निर्माण समय-सारणी (PHASED CONSTRUCTION TIMELINE)
------------------------------------------
व्यवधानों को न्यूनतम करने के लिए ड्रेनेज कॉरिडोर का निर्माण 4 क्रमिक और सुनियोजित चरणों में पूरा किया जाएगा:
• चरण I (Q1) - पवित्र पर्यावरण संरक्षण: जड़ी-बूटी संकलन क्षेत्रों और पवित्र वन की सुरक्षा के लिए सिल्ट फेंसिंग और डिजिटल सुरक्षा मार्करों की स्थापना।
• चरण II (Q2) - मूक सुरंग निर्माण (Silent Trenching): भारी विस्फोटकों के बजाय दिन के समय कंपन-रहित, छोटे-व्यास वाली भूमिगत ड्रिलिंग का क्रियान्वयन।
• चरण III (Q3) - सुरक्षा बुनियादी ढांचा स्थापना: छात्र मार्गों के पास सर्व-ऋतु सुरक्षात्मक अम्बर लाइटिंग और निर्माण मार्गों पर हुए गड्ढों की तत्काल मरम्मत।
• चरण IV (Q4) - सार्वजनिक सुपुर्दगी: नागरिक प्रतिनिधियों के साथ ड्रेनेज चैनलों का संयुक्त निरीक्षण, स्वचालित जल गुणवत्ता सेंसर्स की सक्रियता और सामुदायिक समझौतों की सुपुर्दगी।

5. सामुदायिक भागीदारी एवं पारदर्शिता रणनीति (PUBLIC PARTICIPATION STRATEGY)
------------------------------------------
यह संपूर्ण समझौता स्थानीय समुदाय की निरंतर निगरानी में संचालित होगा:
• द्वि-साप्ताहिक संयुक्त परिषद (Joint Council): आदिवासी बुजुर्गों, छात्रावास प्रतिनिधियों, व्यापार संघ और नगर निगम के मुख्य इंजीनियरों का एक खुला प्रशासनिक बोर्ड गठित किया जाएगा।
• वास्तविक समय की सार्वजनिक टेलीमेट्री (Real-time Telemetry): एक नगर निगम पोर्टल जो जल गुणवत्ता सूचकांको (Water Quality Indexes), डेसिबल शोर स्तरों और बजट खर्च को 100% पारदर्शिता के साथ सजीव प्रसारित करेगा।
• जन-मतदान एकीकरण: स्थानीय निवासियों के पास परियोजना के पुनर्स्थापन विकल्पों या समय-परिवर्तनों पर मतदान करने और निर्णय को खारिज करने का सीधा अधिकार होगा।

6. अपेक्षित परिणाम (EXPECTED OUTCOMES)
------------------------------------------
• इलाके को मानसूनी जलभराव और गंभीर बाढ़ के प्रकोप से 100% मुक्ति।
• पवित्र वन वृक्षों, देवस्थलों और आदिवासी संकलन क्षेत्रों का पूर्ण संरक्षण।
• गर्ल्स हॉस्टल अध्ययन ब्लॉकों और रास्तों की पूर्ण गोपनीयता की सुरक्षा।
• दुकानदारों के लिए पार्किंग स्थानों की तीव्र पुनर्स्थापना और आर्थिक प्रोत्साहन योजनाओं की शुरुआत।
• विवादों का न्यायालय के बाहर समाधान, जिससे निर्माण के 130 मूल्यवान दिनों की बचत होगी।

========================================================================
हस्ताक्षरकर्ता सहमति पत्र (SIGNATORIES IN AGREEMENT):
[डिजिटल हस्ताक्षरित] मुख्य मध्यस्थ, एआई राजनयिक (ग्रिड अल्फ़ा)
[सहमति लंबित] प्रतिनिधि, गर्ल्स हॉस्टल छात्र समिति
[सहमति लंबित] आदिवासी बुजुर्ग परिषद, वन संरक्षण गठबंधन
[सहमति लंबित] आयुक्त, नगर निगम इंजीनियरिंग संघ
========================================================================`;
  }

  let headerTitle = "CONSOLIDATED MEDIATION TREATY & COEXISTENCE PROTOCOL";
  let directiveName = "Harmonized Coexistence & Safe Infrastructure Delivery";
  if (directive === 'eco') {
    headerTitle = "ECO-CONSERVATION & HYDROLOGICAL SANCTUARY TREATY";
    directiveName = "Priority Environmental Defense & Traditional Sovereignty Safeguarding";
  } else if (directive === 'indigenous') {
    headerTitle = "ADIVASI TRIBAL HERITAGE & ANCESTRAL GROVE PRESERVATION COMPROMISE";
    directiveName = "Indigenous Property Protection & Rerouted Drainage Alignment";
  } else if (directive === 'rapid') {
    headerTitle = "MUNICIPAL URBAN RESILIENCE & RAPID COEXISTENCE DIRECTIVE";
    directiveName = "Accelerated Flood Protection & Student Safety Integration";
  }

  let toneName = tone === 'empathetic' ? "Empathetic Consensus Facilitation" : tone === 'sovereign' ? "Sovereign Municipal Executive Directive" : "Traditional Panchayat General Assembly Council";

  return `========================================================================
OFFICE OF THE MUNICIPAL COMMISSIONER & CIVIC RESOLUTION BUREAU
CIVIL ACTION COEXISTENCE DIVISION • PROTOCOL ID: ${protocolId}
------------------------------------------------------------------------
DOCUMENT TYPE: OFFICIAL PUBLIC MEDIATION INSTRUMENT OF AGREEMENT
DATE OF RATIFICATION: ${dateStr} • STATUS: PENDING JOINT AUTHORIZATION
MUNICIPAL ARBITRATOR: AI DIPLOMAT AGENT SYSTEM (GRID ALPHA v3.5)
DIRECTIVE DECREE: ${directiveName.toUpperCase()}
ARBITRATION MODE: ${toneName.toUpperCase()}
TARGET FOCUS CONSTITUENCY: ${focus === 'all' ? 'COMPREHENSIVE ALL CONSTITUENCIES' : focus.toUpperCase()}
========================================================================

PREAMBLE:
Pursuant to Article 14-B of the Civic Infrastructure conflict mitigation code, this document establishes a legally binding mediation plan to resolve pending disputes regarding the installation of the Municipal Flood Control and Stormwater Drainage Corridor. The following resolution coordinates engineering mandates with critical local interests to restore neighborhood equilibrium.

1. COMMUNITY CONCERNS ASSESSED
------------------------------------------
In alignment with detailed neighborhood interviews conducted during current study phases, key stakeholder concerns have been logged and resolved:
• GIRLS HOSTEL CONSTITUENTS: Flagged elevated security vulnerabilities along back-alley pedestrian sectors during night hours due to lack of illumination. Expressed anxiety over loud construction during final exam schedules (curfews needed) and privacy invasion in study quarters due to high scaffolding.
• ADIVASI FOREST HOUSEHOLDS: Pointed to deep historical, ancestral, and environmental values linked to old-root grove trees and medicinal herb-gathering areas. Raised warning flags over stream siltation and sediment runoff polluting natural drinking watercourses.
• LOCAL HOMEOWNERS: Raised property valuation concerns tied to morning solar path blockage from overhead masts, structural foundation vibrations caused by cargo vehicle detours, and light trespass.
• SHOP MERCHANTS: Highlighted commercial sales impact due to construction blockades obscuring window displays and temporary loss of street parking spaces.
• MUNICIPALITY OFFICIALS: Demanded adherence to tight timeline boundaries under capital grants while minimizing future maintenance expenditure.

2. THE HOLISTIC PROPOSED COMPROMISE SOLUTION
------------------------------------------
To bridge engineering necessity with tribal, student, and local residential preservation, the AI Diplomat authorizes the following multi-purpose Coexistence Drainage Vector:
• SUBTERRANEAN CORRIDOR: All drainage channels will be constructed entirely subterranean, utilizing micro-tunneling under road buffers to prevent monsoonal overflows while preserving 100% of the forest canopy.
• HYDROLOGICAL SANCTUARY DESIGN: Installation of twin-chamber bio-retention retaining basins directly upstream. Reroutes toxic city surface runoff through porous volcanic soil beds to filter heavy metals naturally before joining forest water layers.
• ALIGNMENT COMPROMISE: Shifts the primary road paving vector to run at least 30 meters clear of the old-root grove, designating a permanent legal conservation boundary protecting ancestral trails and gathering hubs.

3. STRUCTURED SAFETY & RISK MITIGATION PROTOCOLS
------------------------------------------
To guarantee community comfort, the contractor and municipal agency are legally bound to enforce:
• PEDESTRIAN SHUNTS & SMART LIGHTING: Erecting motion-gated, amber-spectrum path LED lighting (preventing light pollution) along the entire hostel perimeter.
• NOISE ABSORPTION CURFEW: Imposing an absolute high-frequency tool ban from 20:00 to 08:00 daily, specifically around residential study blocks, synchronized with examination shifts.
• AIRBORNE DUST MITIGATION: Positioning automated, solar-powered dust misting cannons to continuously filter shop-front air.
• TRANSLUCENT PRIVACY BAFFLES: Installing temporary 5-meter micro-perforated sound and privacy buffers around scaffolding to keep study quarters hidden from construct visibility.

4. PHASED CONSTRUCTION TIMELINE
------------------------------------------
To reduce cumulative fatigue, development will adhere to a 4-phase sequential execution:
• PHASE I (Q1) - SACRED DEFENSE: Installing temporary silt fencing, stream monitors, and digital coordinate markers preserving herbal gather zones.
• PHASE II (Q2) - SILENT TRENCHING: Implementing localized, small-bore subterranean drilling during standard day hours, avoiding high-concussion blasting.
• PHASE III (Q3) - INFRASTRUCTURE REPAIR: Complete structural lighting installation near student paths, combined with rapid repaving of all local detours and roadway potholes.
• PHASE IV (Q4) - PUBLIC COMMISSIONING: Multi-stakeholder inspection of structural channels, activation of automatic water telemetry, and community contract handover.

5. PUBLIC PARTICIPATION & TRANSPARENCY STRATEGY
------------------------------------------
This compromise will operate under continuous citizen oversight:
• BI-WEEKLY JOINT COUNCIL: Establishing an open steering board comprising tribal elders, hostel representatives, storefront managers, and city engineers.
• PUBLIC REAL-TIME TELEMETRY: Open municipal portal streaming live water quality indexes, acoustic decibel monitors, and project spending data with 100% transparency.
• VOTING COMPROMISE ASSIMILATION: Residents retain the absolute right to veto work-schedule changes or vote on local land restoration options.

6. EXPECTED OUTCOMES
------------------------------------------
• 100% monsoonal defense preventing neighborhood flood hazards.
• Preservation of sacred old-root grove trees and gathering nodes.
• Complete privacy guarding for girls' study blocks and student pathways.
• Rapid restoration of customer parking bays alongside localized merchant incentives.
• Near-zero court disputes, accelerating project delivery by up to 130 calendar days.

========================================================================
SIGNATORIES IN AGREEMENT:
[SIGNED DIGITAL ENTRY] CHIEF ARBITRATOR, AI DIPLOMAT (GRID ALPHA)
[PENDING RATIFICATION] REPRESENTATIVE, GIRLS HOSTEL COMMITTEE
[PENDING RATIFICATION] TRIBAL ELDER COUNCIL, FOREST COALITION
[PENDING RATIFICATION] COMMISSIONER, MUNICIPAL ENGINEERING ASSN
========================================================================`;
};

const TranslationMap: Record<string, Record<string, string>> = {
  names: {
    'Girls Hostel Students': 'गर्ल्स हॉस्टल छात्राएं',
    'Local Residents': 'स्थानीय निवासी',
    'Adivasi Households': 'आदिवासी वन परिवार',
    'Shopkeepers': 'स्थानीय दुकानदार',
    'Municipal Authorities': 'नगर निगम अधिकारी',
    'Downtown Merchant Alliance': 'डाउनटाउन मर्चेंट एलायंस',
    'Metropolitan Transit Bureau': 'महानगर परिवहन ब्यूरो',
    'Green Lanes Cyclist Coalition': 'ग्रीन लेंस साइकिल चालक गठबंधन',
    'Broad Street Resident Association': 'ब्रॉड स्ट्रीट निवासी संघ',
    'Oakridge Nature Advocates': 'ओकरिज प्रकृति समर्थक',
    'Municipal Stormwater Directorate': 'नगर निगम तूफान जल निदेशालय',
    'Crestview Parents Guild': 'क्रेस्टव्यू पेरेंट्स गिल्ड',
    'Municipal Clean Energy Commission': 'नगर निगम स्वच्छ ऊर्जा आयोग',
    'Crestview High Parents Alliance': 'क्रेस्टव्यू हाई पेरेंट्स एलायंस',
    'District Energy Board': 'जिला ऊर्जा बोर्ड',
  },
  types: {
    'Vulnerable Demographic Group / Pedestrians': 'संवेदनशील जनसांख्यिकीय समूह / पैदल यात्री',
    'Long-term Neighborhood Homeowners': 'दीर्घकालिक स्थानीय निवासी',
    'Indigenous Inhabitant Forest Communities': 'मूल निवासी वन समुदाय',
    'Commercial Retail Coalition': 'वाणिज्यिक खुदरा विक्रेता संघ',
    'City Administration & Engineering Agency': 'नगर प्रशासन एवं इंजीनियरिंग एजेंसी',
    'Business Representative': 'व्यावसायिक प्रतिनिधि',
    'Government Agency': 'सरकारी एजेंसी',
    'Advocacy Group': 'समर्थन समूह',
    'Community Group': 'सामुदायिक समूह',
    'Stk': 'हितधारक'
  },
  concerns: {
    'Lack of overhead street lighting on campus boundaries, creating pedestrian safety risks during night study commutes.': 
      'परिसर की बाहरी सीमाओं पर स्ट्रीट लाइट की कमी, जिससे रात में पढ़ाई के दौरान छात्राओं के लिए सुरक्षा जोखिम पैदा होता है।',
    'High-decibel construction noise during examination shifts and early hours.': 
      'परीक्षा तिथियों और सुबह के समय उच्च-तीव्रता वाले लाउडस्पीकर/उपकरणों का शोर।',
    'Privacy breaches from proposed commercial high-rise views overlooking dormitory fenestrations.': 
      'प्रस्तावित बहु-मंजिला व्यावसायिक खिड़कियों से हॉस्टल के शयनकक्षों में अनुचित निजता का उल्लंघन।',
    'Inadequate transport access points along side alleys.': 
      'हॉस्टल के आसपास की संकरी गलियों में सुरक्षात्मक परिवहन पहुंच मार्गों का अभाव।',
    'Loss of morning sunlight/solar energy potential due to elevated mast or utility structure heights.': 
      'ऊंचे पोल या बुनियादी ढांचा संरचनाओं की ऊंचाई से सुबह की धूप/सौर ऊर्जा की उपलब्धता में रुकावट।',
    'Heavy-duty cargo vehicle detours causing vibration cracks in building foundations and severe roadway surface potholing.': 
      'भारी मालवाहक वाहनों के मार्ग परिवर्तन से घरों की नींव में कंपन और सड़कों पर गंभीर गड्ढे होना।',
    'Nighttime glare and light pollution from dynamic illuminated billboards.': 
      'सड़क किनारे गतिशील चमकीले विज्ञापनों से रात के समय होने वाला प्रकाश प्रदूषण।',
    'Destruction or structural encroachment of sacred heritage trees and medicinal herb zones.': 
      'पवित्र ऐतिहासिक वृक्षों और पारंपरिक औषधीय जड़ी-बूटी क्षेत्रों को निर्माण कार्य से नुकसान।',
    'Silt runoff from excavation blocks polluting natural clean water streams.': 
      'खुदाई स्थल से निकलने वाले सिल्ट और कीचड़युक्त पानी से प्राकृतिक पेयजल धाराओं का प्रदूषण।',
    'Displacement of local gathering markets and heritage footpaths.': 
      'पारंपरिक सामुदायिक सभा बाजारों और पुराने पैदल ग्रामीण रास्तों का विस्थापन।',
    'Immediate loss of customer street-front parking spaces, causing reduced sales volumes.': 
      'सड़क के सामने पार्किंग बंद होने से दुकानों की बिक्री में भारी गिरावट आना।',
    'Construction dust, debris, and aesthetic blockages obscuring active window displays.': 
      'निर्माण धूल, मलबे और अवरोधों के कारण दुकानों के कांच और विज्ञापनों का छिपना।',
    'Sustained detour confusion driving away multi-region vehicle buyers.': 
      'लंबे समय तक चलने वाले भ्रमित डाइवर्जन से बाहरी क्षेत्रों के ग्राहकों का न आना।',
    'Incurring excessive long-term operational maintenance budgets and over-budget liabilities.': 
      'अत्यधिक दीर्घकालिक परिचालन व्यय और बजट से बाहर होने वाली देयताएं।',
    'Potential regulatory compliance disputes or legal warnings from sovereign environmental authorities.': 
      'पर्यावरणीय संप्रभु अधिकारियों से विनियामक अनुपालन संबंधी विवाद या कानूनी चेतावनियां।',
    'Strict timelines set by fiscal project capital grant limits.': 
      'परियोजना अनुदान निधि की निश्चित समय-सीमा के भीतर सख्त निर्माण आवश्यकताएं।',
    'Loss of on-street shopper parking & drop in quarterly sales volumes.':
      'सड़क किनारे पार्किंग बंद होने से दुकानों की बिक्री और ग्राहकों में गिरावट।',
    'Reducing commuter bottlenecking & accelerating public bus intervals.':
      'यात्री बोतलबंद बाधाओं को कम करना और सार्वजनिक बसों का आवागमन सुगम बनाना।',
    'Establishing robust physical separation between active micro-mobility lanes and arterial traffic.':
      'सक्रिय साइकिल पथों और मुख्य सड़कों के वाहनों के बीच मजबूत भौतिक विभाजन स्थापित करना।',
    'Concerned about public transit noise levels and nocturnal exhaust odors near bedrooms.':
      'रात के समय बेडरूम के पास होने वाले शोर और प्रदूषण के स्तर को लेकर चिंतित।',
    'Minimizing active construction decibel emissions & property impact.': 
      'सक्रिय निर्माण कार्य की आवाज़ और संपत्ति पर प्रभाव को न्यूनतम करना।',
    'Integrating smart infrastructure blueprints in line with regulatory codes.': 
      'विनियामक नियमों के अनुरूप स्मार्ट बुनियादी ढांचे के ब्लूप्रिंट को एकीकृत करना।',
    'Maintaining shopper vehicle access channels and structural foot-traffic flow.': 
      'खरीदारों के वाहनों के मार्ग और पैदल चलने वालों के प्रवाह को बनाए रखना।'
  },
  benefits: {
    'Continuous, high-efficiency illumination covering 100% of commute pathways.': 
      'छात्रावास के सभी मार्गों पर शत-प्रतिशत कुशल एवं सतत प्रकाश व्यवस्था।',
    'Guaranteed quiet examination periods with structural noise limiters.': 
      'ध्वनि अवरोधकों के उपयोग से परीक्षा के दौरान पूर्ण शांति सुनिश्चित करना।',
    'Visual screen installations on nearby buildings to maintain safe living corridors.': 
      'छात्राओं के शयनकक्षों की सुरक्षा बनाए रखने के लिए खिड़कियों पर स्क्रीन लगाना।',
    'Restored property value stability through planned structural landscaping guides.': 
      'नियोजित वृक्षारोपण और सौंदर्य सौंदर्यीकरण से भू-संपत्तियों का मूल्य बनाए रखना।',
    'Decreased vibration noise and immediate repair of road surface flaws.': 
      'कंपन में कमी तथा सड़कों पर हुए गड्ढों की तत्काल पैचवर्क मरम्मत।',
    'Optimized neighborhood safety without cosmetic degradation.': 
      'इलाके के स्वरूप को नुकसान पहुंचाए बिना पैदल चलने वालों की सुरक्षा सुनिश्चित करना।',
    'Formalized conservation boundaries protecting cultural sites from future development.': 
      'पवित्र स्थलों और औषधीय क्षेत्रों की सुरक्षा के लिए स्थायी कानूनी सीमा स्थापित करना।',
    'Implementation of a dual-chamber stream retention basin to guarantee water purity.': 
      'प्राकृतिक पानी की स्वच्छता बनाए रखने के लिए दोहरे कक्ष वाले सिल्टेशन बेसिन का निर्माण।',
    'Creation of legal, designated organic herb-gathering green zones.': 
      'सामुदायिक जड़ी-बूटी संकलन के लिए कानूनी रूप से सुरक्षित हरित गलियारों का विकास।',
    'New, planned pedestrian sidewalk flows boosting general storefront density.': 
      'सुव्यवस्थित पैदल पथों के निर्माण से दुकान के सामने ग्राहकों का आना बढ़ाना।',
    'Dedicated off-street parking validation structures built nearby.': 
      'पास में ही सड़क से अलग समर्पित कार पार्किंग संरचनाओं का विकास।',
    'Fresh dynamic directory maps attracting tourist retail footprints.': 
      'पर्यटकों को आकर्षित करने के लिए आधुनिक गतिशील मार्गदर्शक मानचित्रों की स्थापना।',
    'Full safety and engineering certification achievement prior to physical hand-off.': 
      'हफ्तांतरण से पहले पूर्ण संरचनात्मक और वैज्ञानिक सुरक्षा प्रमाणपत्र प्राप्त करना।',
    'Establishment of an automated IoT visual reporting ecosystem requiring zero manual patrol costs.': 
      'जीरो पेट्रोलिंग व्यय वाली स्वचालित रिमोट सेंसिंग और रिसाव पहचान प्रणाली का निर्माण।',
    'Enhanced public satisfaction and minimal civil dispute records.': 
      'उन्नत सार्वजनिक कल्याण संतुष्टि तथा न्यूनतम कानूनी विवादों का रिकॉर्ड।'
  },
  mitigations: {
    'Install motion-gated, low-glare pathway LED lamps with smart focal coverage.': 
      'कम चकाचौंध वाले और गति से जलने वाले पथप्रदर्शक स्मार्ट एलईडी लैम्प लगाना।',
    'Set strict construction silent curfews (no high-frequency tools between 20:00 - 08:00).': 
      'निर्माण शांति कर्फ्यू का अनुपालन (रात 20:00 बजे से सुबह 08:00 बजे तक मौन संचालन)।',
    'Construct a 4-meter sound-deflector barrier near the main study blocks.': 
      'मुख्य छात्रावास ब्लॉकों के पास एक 4-मीटर ध्वनि-परावर्तक दीवार का निर्माण।',
    'Position all security cameras to face outward from hostel quarters, maintaining absolute residential privacy.': 
      'सभी बाहरी सुरक्षा कैमरों का कोण इस तरह रखना ताकि छात्रावास शयनकक्षों की निजता भंग न हो।',
    'Reposition structures to minimize shadows and optimize visual alignment angles.': 
      'छाया को न्यूनतम करने तथा प्रकाश पहुंच के सुधार के लिए संरचनात्मक फेरबदल।',
    'Implement a strict 15-ton load capacity restriction on local transit lanes during rush hours.': 
      'व्यस्त घंटों के दौरान स्थानीय उप-सड़कों पर भारी वजन वाले मालवाहक वाहनों पर पूर्ण प्रतिबंध।',
    'Replace traditional sodium lamps with custom amber spectra filters to eliminate residential light trespass.': 
      'आवासीय इलाकों में चकाचौंध रोकने के लिए लैंपों पर अम्बर स्पेक्ट्रा फिल्टर का उपयोग।',
    'Conduct pre-work building structural surveys to ensure seismic compliance.': 
      'प्रारंभिक सर्वेक्षणों के द्वारा इमारतों की भूकंपीय मजबूती और कंपन प्रतिरोध की जांच।',
    'Reroute the primary road paving vector to run at least 30 meters clear of the old-root grove boundary.': 
      'सड़क चौड़ीकरण को पुराने पवित्र वनों की सीमा से कम से कम 30 मीटर दूर मोड़ना।',
    'Construct bio-retention drainage channels lined with native grasses to naturally filter stormwater runoff.': 
      'प्राकृतिक जड़ी-बूटियों और घास से सुसज्जित बायो-फिल्टर नालियों का विकास।',
    'Provide fully-funded, long-term employment contracts for community stewards to manage green zone maintenance.': 
      'स्थानीय समुदाय के लिए हरित गलियारों के रखरखाव हेतु सवेतन रोजगार योजनाओं का सृजन।',
    'Incorporate traditional wooden signage markers on sacred gathering paths.': 
      'पारंपरिक देव रास्तों पर सुंदर प्राकृतिक लकड़ी के मार्गदर्शक चिन्ह लगाना।',
    'Create 8 designated temporal 15-minute customer pickup stalls in nearby bays.': 
      'सामने के रास्ते पर 15 मिनट के 8 समर्पित त्वरित खरीदारी पिक-अप पॉइंट बनाना।',
    'Deploy active solar mist-cannons during working times to eliminate airborne dust.': 
      'काम के घंटों के दौरान धूल शमन सौर-तोपों का निरंतर सजीव संचालन।',
    'Erect clear, illuminated roadside directional directory boards at major intersections.': 
      'महत्वपूर्ण चौराहों पर स्पष्ट, रात में चमकने वाले वाणिज्यिक निदेशक बोर्ड लगाना।',
    'Introduce tax-equivalent municipal parking coupons to reward shoppers.': 
      'दुकान पर आने वाले खरीदारों के लिए नगर निगम पार्किंग कूपन प्रोत्साहन योजना लागू करना।',
    'Utilize long-life composite materials with a minimum 25-year structural warranty.': 
      '25 साल की न्यूनतम गारंटी वाले उच्च-गुणवत्ता मिश्रित निर्माण सामग्री का उपयोग करना।',
    'Integrate solar-recharged, energy-autonomous monitoring modules on all key intersections.': 
      'सौर-ऊर्जा चालित स्वतंत्र रिमोट जल स्तर और सुरक्षा मॉनिटरिंग इकाइयां स्थापित करना।',
    'Establish a streamlined, digitised single-window citizen reporting portal.': 
      'नियमों की निगरानी के लिए एक सरलीकृत एकल-खिड़की डिजिटल नागरिक भागीदारी पोर्टल।',
    'Formulate a multi-tier financial bond backed by public infrastructure developers.': 
      'प्रोजेक्ट के संभावित जोखिमों के लिए बहु-स्तरीय पूंजीगत बुनियादी कार्य गारंटी बांड बनाना।'
  }
};

const translateText = (text: string, type: 'names' | 'types' | 'concerns' | 'benefits' | 'mitigations', lang: 'en' | 'hi') => {
  if (lang === 'en') return text;
  const item = TranslationMap[type]?.[text];
  return item || text;
};

const UI_TRANSLATIONS = {
  en: {
    reportHazard: "Report Hazard",
    aiAnalysis: "AI Analysis",
    stakeholders: "Stakeholders",
    mappingEngine: "Mapping Engine",
    aiDiplomat: "AI Diplomat",
    roadmaps: "Roadmaps",
    analytics: "Analytics",
    ingestHazard: "Ingest Hazard",
    flagship: "Flagship Capability",
    activeSafeguards: "Safeguards Active!",
    applyTreaty: "Apply Treaty Plan",
    copyTxt: "Copy TXT",
    download: "Download",
    subMonitor: "AGENT SUBSYSTEM MONITOR",
    solvingCivic: "Solving multidimensional civic conflicts...",
    noMedActive: "No Mediation Proposal Active",
    configureDesired: "Configure your desired arbitration parameters on the left, then click \"Generate Community Consensus Plan\" to execute the AI Diplomat Agent.",
    arbitrationParams: "Arbitration Parameters",
    arbDirectiveLabel: "1. Arbitration Directive Style",
    arbToneLabel: "2. Arbitration Tone Style",
    targetFocusLabel: "3. Target Focus Segment",
    standardPath: "Standard Path",
    balancedPath: "Balanced Path",
    ecoProtection: "Eco-Protection",
    stormwaterGroves: "Stormwater Groves",
    adivasiHeritage: "Adivasi Heritage",
    sacredBuffer: "Sacred 30m Buffer",
    rapidResilience: "Rapid Resilience",
    hostelSafety: "Hostel Safety First",
    allStakeholders: "All Stakeholders (Comprehensive Unified Treaty)",
    generateConsensusPlanButton: "Generate Community Consensus Plan",
    compilingConsensusPlanButton: "Compiling Consensus Treaty...",
    empTone: "Empathetic Consensus Facilitator (High Trust)",
    sovTone: "Sovereign Municipal Executive Decree (Fast Execution)",
    panTone: "Traditional Panchayat Council format (Indigenous Assembly)",
    girlsHostelDesc: "Girls Hostel Students (Exam curfew & privacy focus)",
    adivasiHouseholdsDesc: "Adivasi Households (Sacred trees & run-off filters)",
    localResidentsDesc: "Local Residents (Solar shadow offsets & quiet curfews)",
    shopkeepersDesc: "Shopkeepers (Customer bays & dust misting cannons)",
    consensusTreatyRatificationPlanReady: "Consensus Treaty Ratification Plan ready",
    deployAiProposalParameters: "Deploy AI proposal parameters. This will immediately resolve conflict friction margins and restore local stakeholder validation meters.",
    officialAccord: "OFFICIAL ACCORD",
    aiArbitratorApproved: "AI Arbitrator Approved",
    refCertified: "Protocol Ref ID Certified",
  },
  hi: {
    reportHazard: "जोखिम रिपोर्ट",
    aiAnalysis: "एआई विश्लेषण",
    stakeholders: "हितधारक",
    mappingEngine: "मैपिंग इंजन",
    aiDiplomat: "एआई राजनयिक",
    roadmaps: "रोडमैप",
    analytics: "एनालिटिक्स",
    ingestHazard: "जोखिम प्रविष्टि",
    flagship: "फ्लैगशिप क्षमता",
    activeSafeguards: "सुरक्षा उपाय सक्रिय!",
    applyTreaty: "राजनयिक योजना लागू करें",
    copyTxt: "कॉपी करें (TXT)",
    download: "डाउनलोड करें",
    subMonitor: "एजेंट सबसिस्टम मॉनिटर",
    solvingCivic: "बहुआयामी नागरिक नागरिक संघर्षों का समाधान किया जा रहा है...",
    noMedActive: "कोई मध्यस्थता प्रस्ताव सक्रिय नहीं है",
    configureDesired: "बाईं ओर अपनी पसंदीदा राजनयिक सेटिंग्स चुनें और 'सामुदायिक सहमति योजना तैयार करें' पर क्लिक करें।",
    arbitrationParams: "राजनयिक मध्यस्थता पैरामीटर",
    arbDirectiveLabel: "1. राजनयिक मध्यस्थता की मुख्य शैली",
    arbToneLabel: "2. मध्यस्थता वार्ता की टोन",
    targetFocusLabel: "3. लक्षित हितधारक समूह",
    standardPath: "मानक मार्ग",
    balancedPath: "संतुलित मार्ग",
    ecoProtection: "पर्यावरण-संरक्षण",
    stormwaterGroves: "जलभराव एवं हरित वन",
    adivasiHeritage: "आदिवासी विरासत",
    sacredBuffer: "पवित्र 30 मीटर बफ़र",
    rapidResilience: "तीव्र लचीलापन",
    hostelSafety: "हॉस्टल सुरक्षा सर्वोपरि",
    allStakeholders: "सभी हितधारक (व्यापक एकीकृत समझौता)",
    generateConsensusPlanButton: "सामुदायिक सहमति योजना तैयार करें",
    compilingConsensusPlanButton: "सहमति संधि संकलित की जा रही है...",
    empTone: "सहानुभूतिपूर्ण आम सहमति सूत्रधार (उच्च विश्वास)",
    sovTone: "संप्रभु नगर निगम कार्यकारी डिक्री (त्वरित निष्पादन)",
    panTone: "पारंपरिक पंचायत परिषद प्रारूप (स्वदेशी सभा)",
    girlsHostelDesc: "गर्ल्स हॉस्टल छात्राएं (परीक्षा कर्फ्यू और गोपनीयता)",
    adivasiHouseholdsDesc: "आदिवासी वन परिवार (पवित्र वृक्ष और रन-ऑफ फिल्टर)",
    localResidentsDesc: "स्थानीय निवासी (धूप की छाया और शांत घंटों की सुरक्षा)",
    shopkeepersDesc: "स्थानीय व्यापारी (पार्किंग और धूल हटाने की तोपें)",
    consensusTreatyRatificationPlanReady: "सामुदायिक सहमति संधि अनुसमर्थन योजना तैयार है",
    deployAiProposalParameters: "एआई प्रस्तावों को लागू करें। इससे तुरंत स्थानीय असंतोष कम होगा और हितधारकों का भरोसा बढ़ेगा।",
    officialAccord: "आधिकारिक समझौता",
    aiArbitratorApproved: "एआई मध्यस्थ द्वारा स्वीकृत",
    refCertified: "प्रोटोकॉल प्रमाणित रेफ आईडी",
  }
};

const SECTION_TRANSLATIONS = {
  en: {
    ingestionBadge: "Interactive Ingestion Engine",
    ingestionTitle: "Ingest New Infrastructure Conflict",
    ingestionDesc: "Simulate the submission of a neighborhood hazard or infrastructure dispute. CivicSentinel instantly parses visual input context and initializes the mediation interface.",
    aiVisionBadge: "AI Vision Module",
    aiVisionTitle: "Geospatial Vision Incident Analysis",
    aiVisionDesc: "Sentinel AI processes live aerial/photographic inputs to detect physical conflict vectors and automatically catalog hazard layers.",
    mitigationBadge: "Mitigation Workspace",
    mitigationTitle: "Environmental Mitigation Corridor",
    mitigationDesc: "Inspect the localized hazards verified in the region and review automated multiobjective compromise flyers produced by CivicSentinel's engine.",
    stakeholderBadge: "Strategic Audit Matrices",
    stakeholderTitle: "Stakeholder Sentiment Verification",
    stakeholderDesc: "Track localized concerns, identify mutual compromise avenues, and resolve operational friction elements across five core stakeholder segments.",
    mappingBadge: "Modelling Engine",
    mappingEngineTitle: "Stakeholder Mapping Matrix Engine",
    mappingEngineDesc: "Query our live simulation modeling the dynamic relationships, concerns, and proposed mitigations for community representatives.",
    diplomatBadge: "Flagship Capability",
    diplomatTitle: "AI Diplomat Agent",
    diplomatDesc: "Activate automated environmental and tribal arbitration. Instantly compile a professional mediation treaty aligning student privacy, Adivasi groves, shopkeeper commerce, and drainage engineering.",
    roadmapBadge: "Democratic Dispatch",
    roadmapTitle: "Community Consensus Roadmap & Timeline",
    roadmapDesc: "Track the progressive steps required to implement the negotiated compromises. Review vote statistics and ratify phase-by-phase advancements.",
    analyticsBadge: "Consensus Ledger",
    analyticsTitle: "Consensus Analytics Docket",
    analyticsDesc: "Real-time auditing of regional satisfaction indexes, system telemetry, and compromise balance across stakeholder types."
  },
  hi: {
    ingestionBadge: "इंटरैक्टिव प्रविष्टि इंजन",
    ingestionTitle: "नए बुनियादी ढांचे के विवाद की प्रविष्टि करें",
    ingestionDesc: "पड़ोस के खतरे या बुनियादी ढांचे के विवाद के सबमिशन का अनुकरण करें। सिविक सेंटीनेल तुरंत दृश्य इनपुट संदर्भ को पार्स करता है और मध्यस्थता इंटरफ़ेस शुरू करता है।",
    aiVisionBadge: "एआई विज़न मॉड्यूल",
    aiVisionTitle: "जियोस्पेशियल विज़न इंसिडेंट एनैलिसिस",
    aiVisionDesc: "सेंटीनेल एआई भौतिक संघर्ष वैक्टर का पता लगाने और खतरा परतों को स्वचालित रूप से कैटलॉग करने के लिए लाइव हवाई/फोटोग्राफिक इनपुट की प्रक्रिया करता है।",
    mitigationBadge: "शमन कार्यक्षेत्र",
    mitigationTitle: "पर्यावरणीय शमन गलियारा",
    mitigationDesc: "क्षेत्र में सत्यापित स्थानीय खतरों का निरीक्षण करें और सिविक सेंटीनेल के इंजन द्वारा उत्पादित स्वचालित बहु-उद्देश्यीय समझौता ब्रोशरों की समीक्षा करें।",
    stakeholderBadge: "रणनीतिक लेखापरीक्षा मैट्रिक्स",
    stakeholderTitle: "हितधारक भावना और सहमति सत्यापन",
    stakeholderDesc: "स्थानीय चिंताओं पर नज़र रखें, आपसी समझौतों के रास्तों की पहचान करें, और पांच मुख्य हितधारक समूहों में परिचालन घर्षण तत्वों को दूर करें।",
    mappingBadge: "प्रतिकृति मॉडलिंग इंजन",
    mappingEngineTitle: "हितधारक मैपिंग मैट्रिक्स इंजन",
    mappingEngineDesc: "सामुदायिक प्रतिनिधियों के लिए गतिशील संबंधों, चिंताओं और प्रस्तावित शमन उपायों को मॉडल करने वाले हमारे लाइव सिमुलेशन की खोज करें।",
    diplomatBadge: "प्रमुख गौरव क्षमता",
    diplomatTitle: "एआई राजनयिक एजेंट",
    diplomatDesc: "स्वचालित पर्यावरणीय और आदिवासी मध्यस्थता सक्रिय करें। छात्र गोपनीयता, आदिवासी वनों, दुकानदारों के व्यापार और ड्रेनेज इंजीनियरिंग को संरेखित करने वाली एक पेशेवर संधि तुरंत संकलित करें।",
    roadmapBadge: "लोकतांत्रिक प्रेषण",
    roadmapTitle: "सामुदायिक सहमति रोडमैप एवं चरणबद्ध समय-सारणी",
    roadmapDesc: "बातचीत के जरिए तय किए गए समझौतों को लागू करने के लिए आवश्यक क्रमिक कदमों को ट्रैक करें। मतदान के आंकड़ों की समीक्षा करें और चरण-दर-चरण प्रगति को मंजूरी दें।",
    analyticsBadge: "सहमति बहीखाता (लेजर)",
    analyticsTitle: "सहमति विश्लेषणात्मक डोकट",
    analyticsDesc: "हितधारक समूहों में क्षेत्रीय संतुष्टि सूचकांक, सिस्टम टेलीमेट्री और संतुलन का वास्तविक समय में लेखापरीक्षा (ऑडिटिंग)।"
  }
};

const getStkIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Users': return <Users className="w-5 h-5 text-indigo-400" />;
    case 'Shield': return <Shield className="w-5 h-5 text-indigo-400" />;
    case 'Target': return <Target className="w-5 h-5 text-indigo-400" />;
    case 'BarChart3': return <BarChart3 className="w-5 h-5 text-indigo-400" />;
    case 'Building2': return <Building2 className="w-5 h-5 text-indigo-400" />;
    default: return <Users className="w-5 h-5 text-indigo-400" />;
  }
};

const DEMO_STEPS = [
  {
    number: 1,
    title: "1. Capture Hazard Photo",
    subtitle: "Multimodal Visual Ingestion",
    description: "Citizen uploads a high-resolution hazard photo. AI parses geological and structural parameters.",
    duration: 8000,
    sectionId: "reporting",
    hint: "Notice how the ingest form is instantly populated with structured hazard parameters."
  },
  {
    number: 2,
    title: "2. Trigger AI Analysis",
    subtitle: "Multimodal Vision Transformer",
    description: "CivicSentinel compiles topological metrics, affected residents, and local municipal code sets.",
    duration: 8000,
    sectionId: "reporting",
    hint: "Watch the active step indicator parse ecological and transit variables in real-time."
  },
  {
    number: 3,
    title: "3. Spatial Object Recognition",
    subtitle: "Physical Hazard Classification Metrics",
    description: "The vision model isolates pooled waterlogged bodies, submerged lanes, and recommends structural repairs.",
    duration: 8000,
    sectionId: "ai-analysis",
    hint: "Observe detected objects list, confidence score and calculated severity score."
  },
  {
    number: 4,
    title: "4. Stakeholder Interest Mapping",
    subtitle: "Iterative Human Sentiment Mapping",
    description: "The system models human sentiments across local residents, commercial hubs, and government agencies.",
    duration: 10000,
    sectionId: "stakeholder-mapping-engine",
    hint: "Observe how conflicting groups are sorted by power rating vs. current sentiment values."
  },
  {
    number: 5,
    title: "5. Negotiate Win-Win Compromise",
    subtitle: "LLM Agentic Council Mediation",
    description: "AI Diplomat agent bridges resident, commercial, and government bodies with a detailed consensus action treaty.",
    duration: 13000,
    sectionId: "ai-diplomat-agent",
    hint: "See the live reasoning console logs synthetically aligning community constraints."
  },
  {
    number: 6,
    title: "6. Vernacular Translation",
    subtitle: "Regional Language Dissemination",
    description: "For complete trust, CivicSentinel translates the community notice into regional languages instantaneously.",
    duration: 8000,
    sectionId: "ai-diplomat-agent",
    hint: "Note how the entire interface adapts to high-fidelity Devanagari regional script."
  },
  {
    number: 7,
    title: "7. Executive Consensus Ratified",
    subtitle: "Frictionless Municipal Resolution",
    description: "All groups execute concessions. Sentiments elevate automatically, elevating the Consensus Index.",
    duration: 10000,
    sectionId: "consensus",
    hint: "The alignment score rises to 94%+ representing successfully ratified civic balance."
  }
];

export default function App() {
  // Application Core State
  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem("CIVIC_SENTINEL_REPORTS_V2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to load reports from localStorage:", e);
      }
    }
    return INITIAL_REPORTS.map((rep, idx) => ({
      ...rep,
      status: rep.status || (idx === 0 ? 'active' : idx === 1 ? 'pending' : 'resolved')
    }));
  });

  // Persist reports list whenever they change
  useEffect(() => {
    localStorage.setItem("CIVIC_SENTINEL_REPORTS_V2", JSON.stringify(reports));
  }, [reports]);

  const [historyTab, setHistoryTab] = useState<'recent' | 'history' | 'resolved'>('recent');

  const [selectedReportId, setSelectedReportId] = useState<string>(() => {
    const saved = localStorage.getItem("CIVIC_SENTINEL_REPORTS_V2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0].id;
        }
      } catch (e) {}
    }
    return 'report-1';
  });
  const [comments, setComments] = useState<CommunityComment[]>(MOCK_INITIAL_COMMENTS);
  const [activeLang, setActiveLang] = useState<'en' | 'es' | 'zh' | 'vi' | 'hi'>('en');
  const [formLang, setFormLang] = useState<'en' | 'hi'>('en');
  const [globalLang, setGlobalLang] = useState<'en' | 'hi'>('en');
  
  // Custom Comment Form State
  const [newCommentText, setNewCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('Sarah Green');
  const [commentRole, setCommentRole] = useState('Resident Architect');
  const [commentStepId, setCommentStepId] = useState<string>('step-1-1');

  // New Hazard Report Creation Form State
  const [formTitle, setFormTitle] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCategory, setFormCategory] = useState<'Transport' | 'Safety' | 'Energy' | 'Environmental' | 'Infrastructure'>('Transport');
  const [formUrgency, setFormUrgency] = useState<'low' | 'medium' | 'high' | 'emergency'>('medium');
  const [formDescription, setFormDescription] = useState('');
  const [mockPhotoPreview, setMockPhotoPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // AI Pipeline Simulation State
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiStepIndex, setAiStepIndex] = useState(0);
  const [aiProgressValue, setAiProgressValue] = useState(0);
  const [justProcessedId, setJustProcessedId] = useState<string | null>(null);
  
  // Stakeholder Mapping Engine States
  const [stkSearchQuery, setStkSearchQuery] = useState('');
  const [stkExpandedIds, setStkExpandedIds] = useState<Record<string, boolean>>({
    'mst-1': true, // Expand Girls Hostel by default
    'mst-3': true  // Expand Adivasi Households by default
  });
  const [mappingStakeholders, setMappingStakeholders] = useState<MappingStakeholder[]>(MAPPING_STAKEHOLDERS_DATA);
  
  // AI Diplomat Agent States
  const [isDiplomatGenerating, setIsDiplomatGenerating] = useState(false);
  const [diplomatGenStep, setDiplomatGenStep] = useState<'idle' | 'querying' | 'auditing' | 'synthesizing' | 'typing' | 'complete'>('idle');
  const [diplomatGenStepText, setDiplomatGenStepText] = useState('');
  const [diplomatDirective, setDiplomatDirective] = useState<'harmonized' | 'eco' | 'indigenous' | 'rapid'>('harmonized');
  const [diplomatTone, setDiplomatTone] = useState<'empathetic' | 'sovereign' | 'panchayat'>('empathetic');
  const [diplomatFocus, setDiplomatFocus] = useState<string>('all');
  const [diplomatGenProgress, setDiplomatGenProgress] = useState(0);
  const [showProposalDoc, setShowProposalDoc] = useState(false);
  const [hasAppliedCompromise, setHasAppliedCompromise] = useState(false);
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [proposalTypedChars, setProposalTypedChars] = useState(0);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [simulatedLogItems, setSimulatedLogItems] = useState<string[]>([]);
  
  // UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Secure Gemini API & Demo Mode States
  const [isGeminiActive, setIsGeminiActive] = useState<boolean>(() => {
    const val = localStorage.getItem("is_gemini_active");
    return val === null ? true : val === "true";
  });
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem("gemini_api_key") || "";
  });
  const [apiSettingsOpen, setApiSettingsOpen] = useState(false);
  const [customTreatyText, setCustomTreatyText] = useState<string | null>(null);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [showKeyPassword, setShowKeyPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interactive Guided Presentation Demo Sandboxed States & Orchestrator
  const [demoState, setDemoState] = useState({
    isActive: false,
    currentStepIndex: 0,
    isPlaying: false
  });
  const [demoStepProgress, setDemoStepProgress] = useState(0);

  const execStepAction = (stepNum: number) => {
    const step = DEMO_STEPS[stepNum - 1];
    
    // Smooth scroll with proper focal points
    const targetEl = document.getElementById(step.sectionId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    switch (stepNum) {
      case 1: {
        setFormTitle("Sector-3 Main Marg Stormwater Overflow");
        setFormLocation("Opposite Community Center, Block B, Lalpur, Ranchi");
        setFormCategory("Environmental");
        setFormUrgency("high");
        setFormDescription("Severe flash flood pooling waterlogged debris across Sector-3 Main Marg. Students at the adjacent girls hostel on Block-B are unable to cross safety, while retail shopkeepers are reporting clogged subsurface drainage channels, leaking silt, and deep potholes forming.");
        setMockPhotoPreview("https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80");
        setGlobalLang('en');
        setFormLang('en');
        setActiveLang('en');
        triggerBanner("Demo Level Ingest: Parsing high-resolution flooding imagery through vision channels.");
        break;
      }
      case 2: {
        const mockEvent = { preventDefault: () => {} } as any;
        startAiAnalysisSimulation(mockEvent);
        triggerBanner("Demo Ingest: Triggering spatial neural pipeline & municipal compliance check.");
        break;
      }
      case 3: {
        // Select the newly added report if available, else standard
        const newestReport = reports[0];
        if (newestReport) {
          setSelectedReportId(newestReport.id);
        }
        triggerBanner("Demo Vision: Isolating pooling water boundaries and submerged roadways.");
        break;
      }
      case 4: {
        setStkExpandedIds({
          'mst-1': true,
          'mst-2': true,
          'mst-3': true,
          'mst-4': true,
          'mst-5': true
        });
        triggerBanner("Demo Sentiment Audit: Highlighting human interest vectors and concern categories.");
        break;
      }
      case 5: {
        setDiplomatDirective('harmonized');
        setDiplomatTone('empathetic');
        setDiplomatFocus('all');
        startDiplomatGen();
        triggerBanner("Demo Diplomat agent: Mediating citizen constraints vs engineering standards.");
        break;
      }
      case 6: {
        setGlobalLang('hi');
        setFormLang('hi');
        setActiveLang('hi');
        triggerBanner("Demo Translation: Localizing consensus plans into regional languages (Hindi Devnagari).");
        break;
      }
      case 7: {
        applyDiplomatComprises();
        triggerBanner("Demo Ratification: Executing mutual balanced compromises. Sentiments elevated.");
        break;
      }
      default:
        break;
    }
  };

  const handleStartDemo = () => {
    setDemoState({
      isActive: true,
      currentStepIndex: 0,
      isPlaying: true
    });
    setDemoStepProgress(0);
    execStepAction(1);
    triggerBanner("🎬 CivicSentinel Guided Presentation Demo Mode Activated!");
  };

  const handleStopDemo = () => {
    setDemoState({
      isActive: false,
      currentStepIndex: 0,
      isPlaying: false
    });
    setDemoStepProgress(0);
    setGlobalLang('en');
    setFormLang('en');
    setActiveLang('en');
    triggerBanner("Demo Mode deactivated. Returned to standard sandbox mode.");
  };

  const setDemoToStep = (index: number) => {
    setDemoState(prev => ({
      ...prev,
      currentStepIndex: index,
      isPlaying: true
    }));
    setDemoStepProgress(0);
    execStepAction(index + 1);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    if (demoState.isActive && demoState.isPlaying) {
      const currentStep = DEMO_STEPS[demoState.currentStepIndex];
      const duration = currentStep.duration;
      const stepStartTime = Date.now();

      progressTimer = setInterval(() => {
        const elapsed = Date.now() - stepStartTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        setDemoStepProgress(progress);
      }, 100);

      timer = setTimeout(() => {
        if (demoState.currentStepIndex < DEMO_STEPS.length - 1) {
          const nextIndex = demoState.currentStepIndex + 1;
          setDemoState(prev => ({
            ...prev,
            currentStepIndex: nextIndex
          }));
          setDemoStepProgress(0);
          execStepAction(nextIndex + 1);
        } else {
          setDemoState(prev => ({
            ...prev,
            isPlaying: false
          }));
          triggerBanner("🎉 CivicSentinel Guided Demo sequence fully completed! Ready for Q&A.");
        }
      }, duration);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [demoState.isActive, demoState.isPlaying, demoState.currentStepIndex]);

  // Find Currently Active Report
  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];

  // Auto set the target comment step ID when active report changes
  useEffect(() => {
    if (activeReport && activeReport.consensusSteps.length > 0) {
      setCommentStepId(activeReport.consensusSteps[0].id);
    }
  }, [selectedReportId]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  // AI loading pipeline texts
  const AI_LOADING_PHASES = [
    { title: 'Ingesting Hazard Metrics', icon: AlertTriangle, desc: 'Parsing topological and visual inputs with localized infrastructure guidelines.' },
    { title: 'Mapping Key Stakeholders', icon: Users, desc: 'Compiling core jurisdictions, surrounding residents, and commercial entities.' },
    { title: 'Simulating Dynamic Consensus', icon: Cpu, desc: 'Running iterative mediation matrices to formulate alternative compromise parameters.' },
    { title: 'Synthesizing Multilingual Outreach', icon: Languages, desc: 'Drafting eye-safe notifications in localized language patterns (ES, ZH, VI, EN).' },
    { title: 'Publishing Shared Roadmap', icon: Route, desc: 'Generating structured phased action steps with automated validation hooks.' },
  ];

  // Trigger floating alert banner helper
  const triggerBanner = (message: string) => {
    setNotificationMsg(message);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  const toggleStkExpanded = (id: string) => {
    setStkExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAllStk = () => {
    const allExpanded: Record<string, boolean> = {};
    mappingStakeholders.forEach(st => {
      allExpanded[st.id] = true;
    });
    setStkExpandedIds(allExpanded);
  };

  const collapseAllStk = () => {
    setStkExpandedIds({});
  };

  const cycleMappingStkSentiment = (id: string) => {
    const stances: ('supportive' | 'neutral' | 'skeptical' | 'opposed')[] = ['supportive', 'neutral', 'skeptical', 'opposed'];
    setMappingStakeholders(prev => prev.map(st => {
      if (st.id === id) {
        const currIndex = stances.indexOf(st.initialSentiment);
        const nextIndex = (currIndex + 1) % stances.length;
        return {
          ...st,
          initialSentiment: stances[nextIndex]
        };
      }
      return st;
    }));
    triggerBanner("Recalculating stakeholder matrix parameters...");
  };

  const startDiplomatGen = async () => {
    if (isDiplomatGenerating) return;
    
    setIsDiplomatGenerating(true);
    setDiplomatGenStep('querying');
    setDiplomatGenProgress(5);
    setSimulatedLogItems([]);
    setShowProposalDoc(false);
    setProposalTypedChars(0);
    setHasAppliedCompromise(false);
    setCustomTreatyText(null); // Reset cache

    const logs = [
      "Initializing AI Diplomat Mediation Subroutines (Grid Alpha v3.5)...",
      "Analyzing focus node: " + (diplomatFocus === 'all' ? 'All Core Stakeholders' : diplomatFocus) + " with protocol: " + diplomatTone + "...",
      "Querying localized terrain surveys & municipal stormwater pipelines...",
      "Simulating high-efficiency double-compartment bio-retention retaining basins...",
      "Calculating 30-meter buffer protection parameters near old-root grove...",
      "Synthesizing privacy shields, examination study curfews (20:00 - 08:00) & security cameras alignment layout...",
      "Formulating custom amber path LEDs and low-vibration construction guidelines..."
    ];

    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < logs.length) {
        setSimulatedLogItems(prev => [...prev, `[AI DIPLOMAT] ${logs[logIdx]}`]);
        logIdx++;
        setDiplomatGenProgress(prev => Math.min(prev + 12, 60));
      } else {
        clearInterval(logInterval);
      }
    }, 250);

    // Call real Gemini API if active and configured
    let geminiTreaty = null;
    if (isGeminiActive && geminiApiKey) {
      try {
        const payload = {
          title: activeReport?.title,
          description: activeReport?.description,
          category: activeReport?.category,
          location: activeReport?.location,
          directive: diplomatDirective,
          tone: diplomatTone,
          focus: diplomatFocus,
          lang: globalLang
        };

        const res = await fetch("/api/gemini/generate-consensus-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Gemini-Key": geminiApiKey
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const resJson = await res.json();
          geminiTreaty = resJson.treatyText;
        } else {
          console.warn("Backend treaty fail, using offline translator template.");
        }
      } catch (err) {
        console.warn("API Exception during treaty compilation:", err);
      }
    }

    // Phase 2: Auditing concerns
    setTimeout(() => {
      setDiplomatGenStep('auditing');
      setDiplomatGenProgress(40);
    }, 850);

    // Phase 3: Synthesizing coexistence model
    setTimeout(() => {
      setDiplomatGenStep('synthesizing');
      setDiplomatGenProgress(70);
    }, 1700);

    // Phase 4: Word/Section progressive type out
    setTimeout(() => {
      setDiplomatGenStep('typing');
      setDiplomatGenProgress(95);
      setShowProposalDoc(true);
      
      const treatyText = geminiTreaty || getProposalDocumentText(diplomatDirective, diplomatTone, diplomatFocus, globalLang);
      setCustomTreatyText(treatyText);

      let count = 0;
      const ticks = 35;
      typingTimerRef.current = setInterval(() => {
        count++;
        // Speedily increments typed characters to reveal beautiful document contents
        setProposalTypedChars(prev => prev + 150);
        if (count >= ticks) {
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
          setDiplomatGenStep('complete');
          setDiplomatGenProgress(100);
          triggerBanner(geminiTreaty ? "Real Gemini AI Diplomat Consensus Treaty fully compiled!" : "Consensus Mediation Treaty compiled (Demo Mode)!");
        }
      }, 80);

    }, 2500);
  };

  const applyDiplomatComprises = () => {
    // 1. Update mapping stakeholders
    setMappingStakeholders(prev => prev.map(st => {
      if (st.id === 'mst-1') return { ...st, initialSentiment: 'supportive' as const };
      if (st.id === 'mst-2') return { ...st, initialSentiment: 'supportive' as const };
      if (st.id === 'mst-3') return { ...st, initialSentiment: 'neutral' as const }; // huge progress from opposed
      if (st.id === 'mst-4') return { ...st, initialSentiment: 'supportive' as const };
      if (st.id === 'mst-5') return { ...st, initialSentiment: 'supportive' as const };
      return st;
    }));

    // 2. Boost reports active stakeholders
    setReports(prev => prev.map(rep => {
      if (rep.id === selectedReportId) {
        const boostedSt = rep.stakeholders.map((st, sidx) => {
          // Increase all to supportive/neutral
          const nextSent = sidx === 2 ? 'neutral' : 'supportive';
          return { ...st, sentiment: nextSent as any };
        });
        const tempRep = { ...rep, stakeholders: boostedSt };
        const newScore = calculateDynamicConsensus(tempRep);
        return { ...rep, stakeholders: boostedSt, resolutionScore: newScore };
      }
      return rep;
    }));

    setHasAppliedCompromise(true);
    triggerBanner("Diplomatic treaty provisions successfully signed! Municipal sentiments elevated.");
  };

  const copyProposalToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedProposal(true);
    triggerBanner("Official proposal copied to clipboard!");
    setTimeout(() => setCopiedProposal(false), 2000);
  };

  const downloadProposalDoc = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerBanner("Official executive treaty downloaded successfully.");
  };

  // Helper score calculator: Weighted Consensus Index
  // Formula: Sum(Stakeholder Sentiment Weight * Influence) / Sum(Influence)
  const calculateDynamicConsensus = (report: ReportItem) => {
    let totalInfluence = 0;
    let weightedScore = 0;

    report.stakeholders.forEach(st => {
      let sentimentWeight = 50; // Neutral default
      if (st.sentiment === 'supportive') sentimentWeight = 100;
      else if (st.sentiment === 'neutral') sentimentWeight = 70;
      else if (st.sentiment === 'skeptical') sentimentWeight = 40;
      else if (st.sentiment === 'opposed') sentimentWeight = 12;

      totalInfluence += st.influence;
      weightedScore += (sentimentWeight * st.influence);
    });

    if (totalInfluence === 0) return 0;
    return Math.round(weightedScore / totalInfluence);
  };

  const dynamicConsensusScore = calculateDynamicConsensus(activeReport);

  // Toggle Stakeholder Sentiment (Interactive Showcase!)
  const cycleStakeholderSentiment = (stakeholderId: string) => {
    setReports(prev => prev.map(rep => {
      if (rep.id === selectedReportId) {
        const updatedStakeholders = rep.stakeholders.map(st => {
          if (st.id === stakeholderId) {
            const list: Array<Stakeholder['sentiment']> = ['supportive', 'neutral', 'skeptical', 'opposed'];
            const currentIndex = list.indexOf(st.sentiment);
            const nextIndex = (currentIndex + 1) % list.length;
            return { ...st, sentiment: list[nextIndex] };
          }
          return st;
        });

        // Also update resolution score to reflect the formula
        const tempReport = { ...rep, stakeholders: updatedStakeholders };
        const newScore = calculateDynamicConsensus(tempReport);
        return { ...rep, stakeholders: updatedStakeholders, resolutionScore: newScore };
      }
      return rep;
    }));
    triggerBanner("Recalculating consensus path index dynamically based on alignment shift.");
  };

  // Upvote Consensus Step Event Handlers
  const upvoteStep = (stepId: string) => {
    setReports(prev => prev.map(rep => {
      if (rep.id === selectedReportId) {
        return {
          ...rep,
          consensusSteps: rep.consensusSteps.map(step => {
            if (step.id === stepId) {
              return { ...step, votes: step.votes + 1 };
            }
            return step;
          })
        };
      }
      return rep;
    }));
    triggerBanner("Community support ballot verified. Alignment weighting refreshed.");
  };

  // Submitting a public comment on a Step
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommunityComment = {
      id: `comment-${Date.now()}`,
      author: commentAuthor,
      avatarSeed: commentAuthor.replace(/\s+/g, '-').toLowerCase(),
      role: commentRole || 'Community Contributor',
      content: newCommentText.trim(),
      timestamp: 'Just now',
      stepId: commentStepId
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
    triggerBanner("Civic message verified and appended onto consensus roadmap timeline!");
  };

  // Drag and Drop Files Mock Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      readMockFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      readMockFile(file);
    }
  };

  const readMockFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageResult = event.target.result as string;
        setMockPhotoPreview(imageResult);
        triggerBanner(`Mock attachment parsed: "${file.name}" ready for AI processing!`);

        // Infer location from report / file
        const inferredLocation = "Lalpur, Ranchi, Jharkhand, India";
        
        // Update the form input fields so the user sees it
        setFormLocation(inferredLocation);
        if (!formTitle) {
          setFormTitle("Civic Hazard - Lalpur, Ranchi");
        }

        // Update the active report's location and coordinates in the reports array
        // This instantly updates its marker position and flies the map there! (Requirement 4)
        setReports(prev => {
          return prev.map(rep => {
            const isActive = rep.id === selectedReportId || (!selectedReportId && rep.id === prev[0]?.id);
            if (isActive) {
              const updatedCoords = getCoordinatesFromLocation(inferredLocation, rep.title, rep.id);
              return {
                ...rep,
                location: inferredLocation,
                coordinates: updatedCoords,
                imageUrl: imageResult // attach the uploaded image
              };
            }
            return rep;
          });
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Triggering the AI analysis simulation sequence
  const startAiAnalysisSimulation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      triggerBanner("Please specify a hazard location or subject title first.");
      return;
    }

    // Initialize loading steps
    setIsAiProcessing(true);
    setAiStepIndex(0);
    setAiProgressValue(5);

    // Dynamic scheduling intervals to drive the loading animation
    const progressInterval = setInterval(() => {
      setAiProgressValue(p => {
        if (p >= 95) {
          // Keep it suspended at 95 until API finishes or simulation finishes
          return 95;
        }
        return p + Math.floor(Math.random() * 5) + 3;
      });
    }, 120);

    const stepInterval = setInterval(() => {
      setAiStepIndex(idx => {
        if (idx >= AI_LOADING_PHASES.length - 1) {
          return AI_LOADING_PHASES.length - 1;
        }
        return idx + 1;
      });
    }, 800);

    const finalizeAndAddReport = (report: ReportItem, isDemo: boolean) => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      setAiProgressValue(100);

      const reportWithStatus: ReportItem = {
        ...report,
        status: report.status || 'active'
      };

      setTimeout(() => {
        setReports(prev => [reportWithStatus, ...prev]);
        setSelectedReportId(reportWithStatus.id);

        // Add custom system greeting comment
        const newComment: CommunityComment = {
          id: `comment-sys-${Date.now()}`,
          author: 'CivicSentinel AI Bot',
          avatarSeed: 'sentinel-bot',
          role: 'Moderation System',
          content: `A dynamic consensus channel has been opened for the project: "${report.title}". Type your feedback to shape municipal compromises!`,
          timestamp: 'Just now',
          stepId: report.consensusSteps[0]?.id || `step-${report.id}-1`
        };
        setComments(prev => [newComment, ...prev]);

        // Reset Form fields
        setFormTitle('');
        setFormLocation('');
        setFormDescription('');
        setMockPhotoPreview(null);
        setIsAiProcessing(false);
        setJustProcessedId(report.id);

        if (isDemo) {
          triggerBanner(formLang === 'hi' 
            ? "डेमो मोड सक्रिय हुआ। सजीव सिमुलेशन परिणाम लोड कर दिए गए हैं।" 
            : "Demo Mode active. Realistic simulated results have been loaded.");
        } else {
          triggerBanner(formLang === 'hi'
            ? "गूगल जेमिनी एआई विश्लेषण सफलतापूर्वक पूरा हुआ!"
            : "Google Gemini AI analysis compiled successfully!");
        }

        // Smooth scroll to results
        const resultsSection = document.getElementById('ai-analysis');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    };

    const runDemoSimulation = () => {
      // Wait remaining time of 4.5s to give the user a beautiful progress flow
      setTimeout(() => {
        const newId = `report-${Date.now()}`;
        const processedDesc = formDescription || "General resident concerns regarding regional safety, traffic, and compliance. Sentinel Mediation AI is looking for win-win mitigation strategies.";
        const generatedReport = createDynamicReport(
          newId,
          formTitle,
          formLocation || "Municipal Area",
          formCategory,
          formUrgency,
          processedDesc,
          mockPhotoPreview || undefined
        );

        finalizeAndAddReport(generatedReport, true);
      }, 4500);
      return;

      /* BYPASSED PRE-EXISTING HARDCODED DEMO SECTIONS
      let matchedHazard: {
          hazardType: string;
          severityScore: number;
          riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
          affectedStakeholders: string[];
          detectedObjects: string[];
          recommendation: string;
        } = {
          hazardType: "General Infrastructure Conflict",
          severityScore: 55,
          riskLevel: "Medium",
          affectedStakeholders: ["Local Neighborhood Representatives", "Aesthetic Review Board", "Department of Planning Services"],
          detectedObjects: ["Structure Outlines (91%)", "Property Buffer Lines (84%)", "Zoning Layout Pins (88%)"],
          recommendation: "Establish automated remote telemetry monitoring and local stakeholder compromises regarding visible heights and active hours."
        };

        if (titleLower.includes("water") || titleLower.includes("flood") || titleLower.includes("puddle") || titleLower.includes("rain") || (formCategory === "Transport" && titleLower.includes("road")) || titleLower.includes("waterlogged")) {
          matchedHazard = {
            hazardType: "Waterlogged Road & Flood Pooling",
            severityScore: 74,
            riskLevel: "High" as const,
            affectedStakeholders: ["Daily Vehicle Commuters", "Local Retail Shopkeepers", "Municipal Stormwater Drainage Dept"],
            detectedObjects: ["Pooled Water Bodies (4x)", "Submerged Lane Markers (2x)", "Stalled Vehicles (1x)"],
            recommendation: "Clear sub-surface retention drains and implement dynamic digital warning signs for active speed limits during heavy precipitation."
          };
        } else if (titleLower.includes("drain") || titleLower.includes("sewer") || titleLower.includes("clog") || titleLower.includes("pipe") || titleLower.includes("drainage")) {
          matchedHazard = {
            hazardType: "Stormwater Drainage Structural Failure",
            severityScore: 86,
            riskLevel: "Critical" as const,
            affectedStakeholders: ["Surrounding Residents", "Environmental Protection Agency", "Municipal Sewer Crew"],
            detectedObjects: ["Clogged Catch Basin (98%)", "Sewer Backflow Outflow (92%)", "Silted Road Channel (85%)"],
            recommendation: "Deploy emergency hydro-flush trucks to clear silt backlogs and upgrade structural intake filters to custom non-clogging steel grates."
          };
        } else if (titleLower.includes("dump") || titleLower.includes("waste") || titleLower.includes("garbage") || titleLower.includes("trash") || titleLower.includes("dumping") || formCategory === "Environmental") {
          matchedHazard = {
            hazardType: "Unsanctioned Commercial Waste Dumping",
            severityScore: 62,
            riskLevel: "Medium" as const,
            affectedStakeholders: ["Neighborhood Welfare Society", "Sanitation Enforcement Agency", "Local Environmental Hub"],
            detectedObjects: ["Debris & Construction Waste Pile (95%)", "Hazardous Plastic Containers (88%)", "Blocked Sidewalk Corridor (91%)"],
            recommendation: "Install motion-activated deterrence cameras on solar stakes and initiate community-led cleanup sweeps with waste bin allocations."
          };
        } else if (titleLower.includes("light") || titleLower.includes("lamp") || titleLower.includes("dark") || titleLower.includes("bulb") || titleLower.includes("streetlight") || (formCategory === "Safety" && titleLower.includes("street"))) {
          matchedHazard = {
            hazardType: "Pedestrian Dark Corridor & Broken Luminaire",
            severityScore: 45,
            riskLevel: "Low" as const,
            affectedStakeholders: ["Nocturnal Pedestrians", "Local Crime Prevention Patrol", "Municipal Electrical Grid"],
            detectedObjects: ["Extinguished High-Pressure Sodium Lamp (99%)", "Corroded Luminaire Assembly (84%)", "Pedestrian Footpath Segment (92%)"],
            recommendation: "Replace burnt-out fixtures with high-efficiency motion-gated LED lights and calibrate timers to local solar coordinates."
          };
        } else if (titleLower.includes("damage") || titleLower.includes("pothole") || titleLower.includes("crack") || titleLower.includes("asphalt") || titleLower.includes("broken") || formCategory === "Infrastructure") {
          matchedHazard = {
            hazardType: "Arterial Road Surface Degradation & Deep Potholes",
            severityScore: 78,
            riskLevel: "High" as const,
            affectedStakeholders: ["Cyclists & Micro-mobility Users", "Emergency Ambulance Dispatch", "Department of Transportation"],
            detectedObjects: ["Deep Structural Potholes (3x)", "Severe Asphalt Cracking (89%)", "Vehicle Axle Deterrent (93%)"],
            recommendation: "Authorize rapid cold-mix asphalt patch team while queueing the corridor for structural micro-surfacing rehabilitation in next fiscal year."
          };
        }

        const draftEn = `📢 COMMUNITY NOTICE: AI Sentinel has audited "${shortDesc}". A balanced consensus action plan has been loaded at the public portal. Complete details mapped for transparent review.`;
        const generatedReport: ReportItem = {
          id: newId,
          title: shortDesc,
          location: formLocation || "Municipal Buffer Zone",
          category: formCategory,
          urgency: formUrgency,
          dateAdded: new Date().toISOString().split('T')[0],
          resolutionScore: 78,
          description: processedDesc,
          imageUrl: mockPhotoPreview || undefined,
          jurisdictionResponsibility: `Department of Public ${formCategory} Services & Citizen Consensus Committee`,
          aiSummary: `Sentinel Mediation AI completed mapping of "${shortDesc}". Recommended remediation framework details: Immediate low-profile monitoring trial, sound buffering configurations, and neighborhood sensor validation to ensure absolute safety compliance without interfering with local economic assets.`,
          multilingualDrafts: {
            en: draftEn,
            es: `📢 COMUNICADO GENERAL: AI Sentinel ha auditado "${shortDesc}". Un plan de acción balanceado ha sido cargado en el portal público de la comunidad.`,
            zh: `📢 社区倡议书：AI Sentinel 已经对 "${shortDesc}" 完成评估。兼顾多方利益的市政平衡妥协路线图现已上线公示。`,
            vi: `📢 THÔNG BÁO CHUNG: Hệ thống AI Sentinel đã kiểm định dự án "${shortDesc}" và đề xuất giải pháp trung lập cân bằng lợi ích địa phương.`,
            hi: `📢 सामुदायिक सूचना: एआई सेंटिनल ने "${shortDesc}" का विश्लेषण किया है। सार्वजनिक पोर्टल पर संतुलन और सहमति का मसौदा अपलोड कर दिया गया है। पारदर्शी समीक्षा के लिए पूर्ण कदम तैयार हैं।`
          },
          visionAnalysis: {
            hazardType: matchedHazard.hazardType,
            severityScore: matchedHazard.severityScore,
            riskLevel: matchedHazard.riskLevel,
            affectedStakeholders: matchedHazard.affectedStakeholders,
            analysisTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            confidenceScore: parseFloat((89 + Math.random() * 10).toFixed(1)),
            detectedObjects: matchedHazard.detectedObjects,
            recommendation: matchedHazard.recommendation
          },
          stakeholders: [
            {
              id: `st-${newId}-1`,
              name: 'Local Homeowners & Residents',
              type: 'Community Representation',
              influence: 75,
              sentiment: 'neutral',
              primaryConcern: 'Minimizing active construction decibel emissions & property impact.'
            },
            {
              id: `st-${newId}-2`,
              name: 'District Planning Authorities',
              type: 'Municipal Agency',
              influence: 85,
              sentiment: 'supportive',
              primaryConcern: 'Integrating smart infrastructure blueprints in line with regulatory codes.'
            },
            {
              id: `st-${newId}-3`,
              name: 'Regional Merchant Group',
              type: 'Commerce Council',
              influence: 80,
              sentiment: 'skeptical',
              primaryConcern: 'Maintaining shopper vehicle access channels and structural foot-traffic flow.'
            }
          ],
          consensusSteps: [
            {
              id: `step-${newId}-1`,
              phase: 'Phase 1',
              title: 'Initial Visual Survey & Containment',
              description: 'Deploy real-time environmental sensors and temporary low-key markers to measure real impact metrics.',
              votes: 24,
              unanimous: false,
              status: 'completed'
            },
            {
              id: `step-${newId}-2`,
              phase: 'Phase 2',
              title: 'Multilingual Digital Mediation',
              description: 'Provide localized information sheets in appropriate target languages and record alternative stakeholder concerns.',
              votes: 18,
              unanimous: true,
              status: 'active'
            },
            {
              id: `step-${newId}-3`,
              phase: 'Phase 3',
              title: 'Actionable Compromise Implementation',
              description: 'Inaugurate adaptive scheduling limits (e.g. noise-cap timings) and validate co-location setups.',
              votes: 42,
              unanimous: false,
              status: 'pending'
            }
          ]
        };

        finalizeAndAddReport(generatedReport, true);
      }, 4500);
      */
    };

    if (isGeminiActive) {
      try {
        const payload = {
          title: formTitle,
          description: formDescription || "General resident concerns regarding regional safety, traffic, and compliance.",
          category: formCategory,
          urgency: formUrgency,
          location: formLocation || "Municipal Area",
          image: mockPhotoPreview ? {
            data: mockPhotoPreview.split(',')[1],
            mimeType: mockPhotoPreview.split(';')[0].split(':')[1]
          } : null
        };

        const headers: Record<string, string> = {
          "Content-Type": "application/json"
        };
        if (geminiApiKey) {
          headers["X-Gemini-Key"] = geminiApiKey;
        }

        const res = await fetch("/api/gemini/analyze-report", {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Server responded with an error");
        }

        const aiResult = await res.json();
        const newId = `report-${Date.now()}`;

        const generatedReport: ReportItem = {
          id: newId,
          title: formTitle,
          location: formLocation || "Municipal Area",
          category: formCategory,
          urgency: formUrgency,
          dateAdded: new Date().toISOString().split('T')[0],
          resolutionScore: aiResult.severityScore || 75,
          description: formDescription || "Resident concerns regarding civic balance.",
          imageUrl: mockPhotoPreview || undefined,
          jurisdictionResponsibility: `Department of Public ${formCategory} Services & Citizen Consensus Committee`,
          aiSummary: aiResult.aiSummary || `Google Gemini completed its safety analysis for "${formTitle}".`,
          multilingualDrafts: aiResult.multilingualDrafts || {
            en: `📢 COMMUNITY NOTICE: AI Sentinel has audited "${formTitle}".`,
            es: `📢 COMUNICADO GENERAL: AI sintonizado ha auditado "${formTitle}".`,
            zh: `📢 社区：AI Sentinel 已经对 "${formTitle}" 完成评估。`,
            vi: `📢 THÔNG BÁO: AI Sentinel đã kiểm định "${formTitle}".`,
            hi: `📢 सामुदायिक सूचना: एआई सेंटिनल ने "${formTitle}" का विश्लेषण किया है।`
          },
          visionAnalysis: {
            hazardType: aiResult.hazardType || "AI Analyzed Hazard",
            severityScore: aiResult.severityScore || 70,
            riskLevel: aiResult.riskLevel || "Medium",
            affectedStakeholders: aiResult.stakeholders ? aiResult.stakeholders.map((s: any) => s.name) : ["Local Communities"],
            analysisTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            confidenceScore: aiResult.confidenceScore || 94.8,
            detectedObjects: aiResult.detectedObjects || ["Corridor Anchor Points"],
            recommendation: aiResult.recommendation || "Maintain remote monitoring.",
            estimatedAffectedArea: aiResult.estimatedAffectedArea || "150-meter radius around main intersection",
            publicSafetyImpact: aiResult.publicSafetyImpact || "Risks of debris collisions or slippery surfaces",
            environmentalImpact: aiResult.environmentalImpact || "Possible light pollution, local storm runoff complications",
            infrastructureImpact: aiResult.infrastructureImpact || "Mild structural wear on adjacent roadbeds",
            recommendedPriorityLevel: aiResult.recommendedPriorityLevel || "High",
            isUnclear: aiResult.isUnclear || false,
            multilingualAnalysis: aiResult.multilingualAnalysis || {
              hi: {
                hazardType: aiResult.hazardType || "सक्रिय संकट",
                estimatedAffectedArea: aiResult.estimatedAffectedArea || "१५० मीटर का केंद्रीय दायरा",
                publicSafetyImpact: aiResult.publicSafetyImpact || "फिसलन होने और दुर्घटनाओं की आशंका",
                environmentalImpact: aiResult.environmentalImpact || "स्थानीय ड्रेनेज रुकावट",
                infrastructureImpact: aiResult.infrastructureImpact || "सड़क की उपसतह संरचना का क्षरण",
                recommendation: aiResult.recommendation || "तत्काल ड्रेनेज क्लियरेंस और पानी निकासी व्यवस्था कराएं।"
              }
            }
          },
          stakeholders: aiResult.stakeholders ? aiResult.stakeholders.map((st: any, i: number) => ({
            id: `st-${newId}-${i+1}`,
            name: st.name,
            type: st.type || 'Community Representation',
            influence: st.influence || 70,
            sentiment: st.sentiment || 'neutral',
            primaryConcern: st.primaryConcern || 'General local impact'
          })) : [
            { id: `st-${newId}-1`, name: 'Local Homeowners & Residents', type: 'Community Representation', influence: 75, sentiment: 'neutral', primaryConcern: 'Impact on livability.' }
          ],
          consensusSteps: aiResult.consensusSteps ? aiResult.consensusSteps.map((step: any, i: number) => ({
            id: `step-${newId}-${i+1}`,
            phase: step.phase || `Phase ${i+1}`,
            title: step.title || `Phase Item ${i+1}`,
            description: step.description || `Task description`,
            votes: step.votes || 20,
            unanimous: step.unanimous || false,
            status: step.status || (i === 0 ? 'completed' : i === 1 ? 'active' : 'pending')
          })) : [
            { id: `step-${newId}-1`, phase: 'Phase 1', title: 'Survey Plan', description: 'Analyze structural offsets.', votes: 24, unanimous: false, status: 'completed' }
          ],
          coordinates: getCoordinatesFromLocation(formLocation || "Municipal Area", formTitle, newId)
        };

        finalizeAndAddReport(generatedReport, false);

      } catch (error: any) {
        console.error("Gemini Ingestion Failed:", error);
        triggerBanner(`Gemini API Error: ${error.message || "Unknown error"}. Switching to Demo Mode!`);
        runDemoSimulation();
      }
    } else {
      runDemoSimulation();
    }
  };

  // Helper metric calculations for Category Distribution (Analytics)
  const getCategoryCount = (cat: string) => {
    return reports.filter(r => r.category.toLowerCase() === cat.toLowerCase()).length;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* GLOWING MESH BACKDROP GRADIENTS (Startup Aesthetics) */}
      <div className="absolute top-[-100px] left-[-150px] w-[500px] h-[500px] rounded-full bg-indigo-900/20 blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-[40%] right-[-100px] w-[600px] h-[600px] rounded-full bg-blue-900/15 blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[10%] w-[500px] h-[500px] rounded-full bg-emerald-950/20 blur-[140px] -z-10 pointer-events-none" />

      {/* FLOATING BACKGROUND ANIMATED PARTICLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
        <div className="particle w-8 h-8 left-1/10" style={{ animationDelay: '0s', animationDuration: '28s' }} />
        <div className="particle w-12 h-12 left-1/3" style={{ animationDelay: '3s', animationDuration: '34s' }} />
        <div className="particle w-6 h-6 left-2/3" style={{ animationDelay: '8s', animationDuration: '24s' }} />
        <div className="particle w-10 h-10 left-4/5" style={{ animationDelay: '12s', animationDuration: '40s' }} />
        <div className="particle w-7 h-7 left-1/2" style={{ animationDelay: '17s', animationDuration: '30s' }} />
        <div className="particle w-9 h-9 left-3/4" style={{ animationDelay: '5s', animationDuration: '32s' }} />
      </div>

      {/* FLOATING NOTIFICATION BANNER */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900/95 border border-indigo-500/30 backdrop-blur-md rounded-xl p-4 shadow-2xl flex items-start gap-3 animate-slide-in text-xs leading-relaxed text-indigo-200">
          <div className="flex-shrink-0 bg-indigo-500/10 p-1.5 rounded-lg text-indigo-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-semibold text-slate-100 block mb-0.5">Civic Engine Broadcast</span>
            {notificationMsg}
          </div>
        </div>
      )}

      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand */}
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-emerald-500 p-[1.5px] shadow-lg shadow-indigo-500/10 transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-400 group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-white block">
                Civic<span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Sentinel</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 block -mt-1 tracking-widest uppercase">
                Consensus Net
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <a href="#reporting" className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition">
              Report Hazard
            </a>
            <a href="#report-history" className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition">
              History
            </a>
            <a href="#ai-analysis" className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition">
              AI Analysis
            </a>
            <a href="#stakeholders" className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition">
              Stakeholders
            </a>
            <a href="#stakeholder-mapping-engine" className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition">
              Mapping Engine
            </a>
            <a href="#ai-diplomat-agent" className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition">
              AI Diplomat
            </a>
            <a href="#consensus" className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition">
              Roadmaps
            </a>
            <a href="#analytics" className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition">
              Analytics
            </a>
            <a href="#impact-scalability" className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition">
              Impact & Scale
            </a>
          </nav>

          {/* Action CTA & Global Lang Switcher */}
          <div className="hidden md:flex items-center gap-4">
            {/* Master Global Language Toggler */}
            <div className="flex bg-slate-900 rounded-xl p-[3px] border border-white/5 relative items-center gap-1">
              <button
                onClick={() => {
                  setGlobalLang('en');
                  setFormLang('en');
                  setActiveLang('en');
                  triggerBanner?.("Interface and engine language switched to English.");
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all duration-300 relative select-none cursor-pointer ${
                  globalLang === 'en'
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => {
                  setGlobalLang('hi');
                  setFormLang('hi');
                  setActiveLang('hi');
                  triggerBanner?.("इंटरफ़ेस और रिज़ॉल्यूशन एजेंट भाषा को बदलकर हिन्दी कर दिया गया है।");
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all duration-300 relative select-none cursor-pointer ${
                  globalLang === 'hi'
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* API Keys Configuration Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setApiSettingsOpen(true)}
              id="api-config-trigger"
              className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
                isGeminiActive && geminiApiKey
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/15'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{isGeminiActive && geminiApiKey ? (globalLang === 'hi' ? 'जेमिनी एआई सक्रिय' : 'Gemini Active') : (globalLang === 'hi' ? 'डेमो मोड' : 'Demo Mode')}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartDemo}
              className="px-4.5 py-2 rounded-lg bg-gradient-to-r from-indigo-650 via-blue-600 to-emerald-600 hover:from-indigo-600 hover:via-blue-530 hover:to-emerald-530 text-xs font-extrabold text-white tracking-widest uppercase transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer animate-pulse"
              style={{ animationDuration: '4s' }}
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Run CivicSentinel Demo</span>
            </motion.button>

            <motion.a 
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              href="#reporting" 
              className="px-4.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-xs font-semibold text-slate-350 tracking-wide transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              {globalLang === 'hi' ? 'जोखिम प्रविष्टि दर्ज करें' : 'Ingest Hazard'}
            </motion.a>
          </div>

          {/* Mobile Menu Action Button */}
          <motion.button 
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <span className="block text-xl font-bold">✕</span>
            ) : (
              <div className="space-y-1.5 w-6">
                <span className="block h-0.5 w-full bg-slate-300" />
                <span className="block h-0.5 w-full bg-gradient-to-r from-blue-400 to-emerald-400" />
                <span className="block h-0.5 w-full bg-slate-300" />
              </div>
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-slate-950/95 py-4 px-6 space-y-3 shadow-2xl animate-fade-in text-left">
            <a 
              href="#reporting" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-white transition"
            >
              📍 {globalLang === 'hi' ? 'जोखिम प्रविष्टि फ़ॉर्म' : 'Ingest Hazard Form'}
            </a>
            <a 
              href="#report-history" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-white transition text-indigo-400 font-semibold"
            >
              📜 {globalLang === 'hi' ? 'नागरिक स्मृति और रिपोर्ट इतिहास' : 'Civic Intelligence History'}
            </a>
            <a 
              href="#ai-analysis" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-white transition"
            >
              🤖 {globalLang === 'hi' ? 'एआई विश्लेषण हब' : 'AI Analysis Hub'}
            </a>
            <a 
              href="#stakeholders" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-white transition"
            >
              👥 {globalLang === 'hi' ? 'हितधारक भावना' : 'Stakeholders Mapping'}
            </a>
            <a 
              href="#stakeholder-mapping-engine" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-white transition"
            >
              ⚙️ {globalLang === 'hi' ? 'हितधारक मैपिंग इंजन' : 'Stakeholder Mapping Engine'}
            </a>
            <a 
              href="#ai-diplomat-agent" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-white transition text-indigo-400 font-semibold"
            >
              📜 {globalLang === 'hi' ? 'एआई राजनयिक एजेंट' : 'AI Diplomat Agent'}
            </a>
            <a 
              href="#consensus" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-white transition"
            >
              🗺️ {globalLang === 'hi' ? 'सहमति रोडमैप' : 'Consensus Roadmaps'}
            </a>
            <a 
              href="#analytics" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-white transition"
            >
              📊 {globalLang === 'hi' ? 'सजीव नगर विश्लेषिकी' : 'Live City Analytics'}
            </a>
            <a 
              href="#impact-scalability" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-white transition"
            >
              📈 {globalLang === 'hi' ? 'प्रभाव और राष्ट्रीय मापन' : 'Impact & Scalability'}
            </a>

            {/* Mobile language selector */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{globalLang === 'hi' ? 'भाषा विकल्प' : 'Language Option'}</span>
              <div className="flex bg-slate-900 rounded-xl p-[2px] border border-white/5 items-center gap-1">
                <button
                  onClick={() => {
                    setGlobalLang('en');
                    setFormLang('en');
                    setActiveLang('en');
                    triggerBanner?.("Interface language switched to English.");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    globalLang === 'en'
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 border border-transparent'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    setGlobalLang('hi');
                    setFormLang('hi');
                    setActiveLang('hi');
                    triggerBanner?.("इंटरफ़ेस भाषा को हिन्दी कर दिया गया है।");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    globalLang === 'hi'
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 border border-transparent'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            <div className="pt-2">
              <a 
                href="#reporting"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-sm"
              >
                + {globalLang === 'hi' ? 'नया संकट प्रविष्ट करें' : 'Ingest New Hazard'}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="relative pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="md:col-span-7 space-y-6 text-left">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[11px] font-semibold text-indigo-400 tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
              Municipal Trust 2.0 Sandbox
            </div>

            {/* Title */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
              Civic<span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">Sentinel</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl font-semibold text-slate-200 tracking-tight glow-text font-display">
              AI-Powered Community Consensus Platform
            </p>

            {/* Description */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Transforming costly infrastructure conflicts into collaborative, scientifically balanced civic decisions through real-time AI-powered mediation, multilingual public communication, and community trust-building.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartDemo}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 hover:from-indigo-500 hover:via-blue-500 hover:to-emerald-500 text-sm font-bold text-white tracking-wider flex items-center gap-2 cursor-pointer shadow-xl shadow-indigo-600/25 border border-indigo-400/20"
              >
                <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" style={{ animationDuration: '6s' }} />
                Run CivicSentinel Demo
              </motion.button>
              <a 
                href="#reporting" 
                className="px-6 py-3 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-sm font-semibold text-slate-300 transition-all duration-300 flex items-center gap-1.5"
              >
                Report Hazard
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#ai-analysis" 
                className="px-6 py-3 rounded-lg border border-white/10 hover:border-indigo-500/50 bg-white/5 hover:bg-indigo-500/10 text-sm font-medium transition"
              >
                Explore Active Mediation Cases
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-white/5 flex items-center gap-8">
              <div>
                <span className="block text-2xl font-bold font-display text-emerald-400">98.4%</span>
                <span className="block text-[11px] font-mono tracking-wider uppercase text-slate-400">Consensus Rate</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="block text-2xl font-bold font-display text-blue-400">2.4 Days</span>
                <span className="block text-[11px] font-mono tracking-wider uppercase text-slate-400">Resolution Avg</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="block text-2xl font-bold font-display text-indigo-400">$1.2M+</span>
                <span className="block text-[11px] font-mono tracking-wider uppercase text-slate-400">Taxpayer Saved</span>
              </div>
            </div>

          </div>

          {/* Hero Right: Interactive Dashboard Status Spotlight Card */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-x-0 top-[-30px] bottom-12 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-3xl blur-2xl -z-5" />
            
            {/* Spotlight Container Glass Card */}
            <div className="glass-card rounded-2xl border border-white/10 p-5 shadow-2xl relative overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Active Civic Mediation</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-400 uppercase">
                  95% Alignment
                </div>
              </div>

              {/* Showcase selector for preset quick loading */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-400">Spotlight Mediation Project Selection:</p>
                <div className="flex flex-col gap-2">
                  {reports.map((rep) => (
                    <button
                      key={rep.id}
                      onClick={() => {
                        setSelectedReportId(rep.id);
                        triggerBanner(`Focus shifted to: "${rep.title}"`);
                      }}
                      className={`text-left p-2.5 rounded-lg border text-xs transition duration-200 flex items-center justify-between ${
                        selectedReportId === rep.id 
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold' 
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          rep.urgency === 'high' ? 'bg-rose-500' :
                          rep.urgency === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <span className="truncate">{rep.title}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Inline Snapshot */}
              <div className="mt-4 pt-4 border-t border-white/5 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Target Area:</span>
                  <span className="font-semibold text-slate-200">{activeReport.location}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Consensus Probability limit:</span>
                  <span className="font-semibold text-emerald-400">{dynamicConsensusScore}% (Dynamic)</span>
                </div>
                
                {/* Visual score bar */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${dynamicConsensusScore}%` }}
                  />
                </div>
                
                <p className="text-[10px] text-slate-400 leading-relaxed italic bg-indigo-950/20 p-2 rounded border border-indigo-900/40">
                  ⚠️ Note: Click on Stakeholders below to adjust sentiment and watch the alignment meter dynamically change.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* DETAILED ACTIVE COMPROMISE DEMO MAIN WRAPPER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-24">

        {/* LOADING ANIMATION IF SIMULATING AI GENERATION */}
        {isAiProcessing && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
              
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-indigo-500/10 text-indigo-400 animate-spin mb-1">
                  <Cpu className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-display text-white">CivicSentinel AI Engine Booting</h3>
                <p className="text-xs text-slate-400">Synthesizing consensus metrics, liability codes, and translation maps...</p>
              </div>

              {/* Visual Scanning Thumbnail */}
              {mockPhotoPreview && (
                <div className="relative w-full h-36 bg-[#100C08] border border-indigo-500/30 rounded-lg overflow-hidden flex items-center justify-center select-none shadow-md">
                  <img src={mockPhotoPreview} alt="Scanning preview" className="w-full h-full object-cover select-none pointer-events-none opacity-60" />
                  <div className="laser-scanner-line" />
                  
                  {/* Digital scope overlays */}
                  <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-indigo-500 opacity-60" />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-indigo-500 opacity-60" />
                  <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-indigo-500 opacity-60" />
                  <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-indigo-500 opacity-60" />
                  
                  <div className="absolute bottom-1 left-2 text-[8px] font-mono text-emerald-400 uppercase tracking-widest bg-slate-950/70 p-1 px-1.5 rounded border border-white/5 z-20 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                    Analyzing Array Tensors...
                  </div>
                </div>
              )}

              {/* Progress Slider Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>ANALYSING SPATIAL BLUEPRINTS</span>
                  <span>{aiProgressValue}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-[2px] border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-blue-400 to-emerald-400 rounded-full transition-all duration-200"
                    style={{ width: `${aiProgressValue}%` }}
                  />
                </div>
              </div>

              {/* Loading Steps Roster */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-white/5 text-xs">
                {AI_LOADING_PHASES.map((ph, idx) => {
                  const Icon = ph.icon;
                  const isDone = aiStepIndex > idx;
                  const isActive = aiStepIndex === idx;

                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-3 items-start transition duration-200 ${
                        isDone ? 'text-slate-400' :
                        isActive ? 'text-indigo-300 font-semibold scale-102' : 'text-slate-600'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {isDone ? (
                          <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : isActive ? (
                          <div className="w-4.5 h-4.5 rounded-full bg-indigo-500/20 border border-indigo-500 flex items-center justify-center text-indigo-400 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          </div>
                        ) : (
                          <div className="w-4.5 h-4.5 rounded-full border border-slate-700 flex items-center justify-center" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{ph.title}</p>
                        {isActive && <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{ph.desc}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* SECTION 1: HAZARD REPORTING (INTERACTIVE INGESTION ENGINE) */}
        <section id="reporting" className="scroll-mt-24 font-sans text-left">
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-500">
              <PlusCircle className="w-3.5 h-3.5" />
              {FORM_TRANSLATIONS[formLang].sectionBadge}
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100 glow-text">
              {FORM_TRANSLATIONS[formLang].sectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              {FORM_TRANSLATIONS[formLang].sectionSub}
            </p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400/80 mt-2 italic">
              ✨ {formLang === 'hi' ? "अपलोड किए गए साक्ष्यों और रिपोर्ट इतिहास से एआई द्वारा उत्पन्न।" : "AI-generated from uploaded evidence and report history."}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Form Column */}
            <form onSubmit={startAiAnalysisSimulation} className="lg:col-span-8 glass-card rounded-2xl border border-white/5 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Embedded Language Selector (English/Hindi) */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5 select-none text-left">
                    <Languages className="w-4 h-4 text-indigo-700 animate-pulse" />
                    {formLang === 'en' ? 'Form Language' : 'फॉर्म की भाषा'}
                  </span>
                  <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setFormLang('en');
                        triggerBanner("Reporting language set to English");
                      }}
                      className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer select-none ${
                        formLang === 'en' 
                          ? 'bg-indigo-600 text-white font-bold' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormLang('hi');
                        triggerBanner("रिपोर्ट दर्ज करने की भाषा हिन्दी की गई");
                      }}
                      className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer select-none ${
                        formLang === 'hi' 
                          ? 'bg-indigo-600 text-white font-bold' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      हिन्दी
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Hazard Title Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block text-left">
                      {FORM_TRANSLATIONS[formLang].formTitleLabel} <span className="text-indigo-600">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder={FORM_TRANSLATIONS[formLang].formTitlePlaceholder}
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-slate-950/70 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    />
                  </div>

                  {/* Location Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block text-left">
                      {FORM_TRANSLATIONS[formLang].formLocationLabel}
                    </label>
                    <input 
                      type="text"
                      placeholder={FORM_TRANSLATIONS[formLang].formLocationPlaceholder}
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-slate-950/70 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block text-left">
                      {FORM_TRANSLATIONS[formLang].formCategoryLabel}
                    </label>
                    <select 
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as ReportItem['category'])}
                      className="w-full bg-slate-950/70 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    >
                      <option value="Transport">{formLang === 'en' ? 'Transport & Mobility' : 'परिवहन और गतिशीलता'}</option>
                      <option value="Safety">{formLang === 'en' ? 'Safety & Illumination' : 'सुरक्षा और प्रकाश व्यवस्था'}</option>
                      <option value="Infrastructure">{formLang === 'en' ? 'Infrastructure Siting' : 'बुनियादी ढांचा और निर्माण'}</option>
                      <option value="Environmental">{formLang === 'en' ? 'Environmental Reserve' : 'पर्यावरण और संरक्षण'}</option>
                      <option value="Energy">{formLang === 'en' ? 'Energy Grid Integration' : 'ऊर्जा ग्रिड एकीकरण'}</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block text-left">
                      {FORM_TRANSLATIONS[formLang].formUrgencyLabel}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['low', 'medium', 'high', 'emergency'] as const).map((urg) => (
                        <button
                          key={urg}
                          type="button"
                          onClick={() => setFormUrgency(urg)}
                          className={`py-2 px-1 rounded-lg text-[10px] font-semibold border uppercase tracking-wider transition select-none cursor-pointer ${
                            formUrgency === urg 
                              ? urg === 'emergency' ? 'bg-red-500/20 border-red-500 text-red-700' :
                                urg === 'high' ? 'bg-rose-500/20 border-rose-500 text-rose-700' :
                                urg === 'medium' ? 'bg-amber-500/20 border-amber-500 text-amber-700' :
                                'bg-emerald-500/20 border-emerald-500 text-emerald-700'
                              : 'bg-white/5 border-white/5 text-slate-500 hover:bg-slate-900'
                          }`}
                        >
                          {urg === 'low' ? (formLang === 'en' ? 'low' : 'धीमा') :
                           urg === 'medium' ? (formLang === 'en' ? 'medium' : 'मध्यम') :
                           urg === 'high' ? (formLang === 'en' ? 'high' : 'उच्च') :
                           (formLang === 'en' ? 'critical' : 'आपात')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-300 block text-left">
                      {FORM_TRANSLATIONS[formLang].formDescLabel} <span className="text-indigo-600">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500 block text-right">
                      {formLang === 'en' ? 'Conflict details & viewpoints' : 'हितधारकों की असहमति का ब्यौरा'}
                    </span>
                  </div>
                  <textarea 
                    rows={3}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder={FORM_TRANSLATIONS[formLang].formDescPlaceholder}
                    className="w-full bg-slate-950/70 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
                  />
                </div>

                {/* Modern Drag and Drop Image Upload Card with Animations & Preview Discard */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block text-left">
                    {formLang === 'en' ? 'Visual Evidence / Geotagged Photo' : 'दृश्य साक्ष्य / जियोटैग की गई फोटो'}
                  </label>
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        triggerFileInput();
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                      dragActive 
                        ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-lg shadow-indigo-500/5' 
                        : mockPhotoPreview 
                          ? 'border-emerald-500/50 bg-emerald-500/5' 
                          : 'border-slate-800 hover:border-indigo-500 bg-slate-900/40 hover:bg-slate-900/60'
                    }`}
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {mockPhotoPreview ? (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="relative mx-auto w-full max-w-[280px] aspect-video rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shadow-inner group-hover:shadow-lg transition">
                          <img 
                            src={mockPhotoPreview} 
                            alt="Hazard upload preview" 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                            <span className="text-[10px] font-semibold text-white px-2.5 py-1 bg-slate-900/80 rounded border border-white/10 uppercase tracking-widest font-mono">
                              {formLang === 'en' ? 'Click to replace' : 'बदलने के लिए क्लिक करें'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <div className="text-left flex items-start gap-2.5">
                            <span className="relative flex h-2 w-2 mt-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <div>
                              <span className="text-xs font-semibold text-slate-200 block leading-tight">
                                {FORM_TRANSLATIONS[formLang].dragLoaded}
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                                Geotagged: Lat 28.61, Lon 77.23
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setMockPhotoPreview(null);
                              triggerBanner(formLang === 'en' ? "Image attachment removed" : "छवि हटा दी गई");
                            }}
                            className="px-3 py-1.5 rounded-md bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/25 text-[10px] font-semibold text-rose-600 hover:text-rose-500 transition select-none flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            {FORM_TRANSLATIONS[formLang].btnRemoveImage}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 space-y-2 group-hover:scale-[1.02] transition-transform duration-300">
                        <div className="p-3 rounded-full bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-500/30 transition-all shadow-inner">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-300 group-hover:text-indigo-600 transition-colors">
                            {FORM_TRANSLATIONS[formLang].dragMessage}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed font-mono">
                            {FORM_TRANSLATIONS[formLang].dragSub}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Ingestion Submit Button */}
              <div className="pt-5 mt-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-500 text-left">
                  <Info className="w-3.5 h-3.5 text-indigo-700 flex-shrink-0" />
                  <span>
                    {formLang === 'en' 
                      ? 'Submitting triggers a sandboxed five-step AI processing timeline simulation.' 
                      : 'जमा करने के बाद पांच-चरणीय एआई प्रसंस्करण और सहमति चक्र शुरू हो जाएगा।'}
                  </span>
                </div>
                <button 
                  type="submit"
                  disabled={isAiProcessing}
                  className="w-full md:w-auto px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white tracking-wide transition shadow-lg shadow-indigo-600/20 cursor-pointer text-center select-none disabled:opacity-50"
                >
                  {isAiProcessing ? FORM_TRANSLATIONS[formLang].btnProcessing : FORM_TRANSLATIONS[formLang].btnSubmit} →
                </button>
              </div>
            </form>

            {/* Sidebar Guide Info Column */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              
              {/* How it works mini guide */}
              <div className="glass-card rounded-2xl border border-white/5 p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-semibold text-white text-sm mb-3 text-left">
                    The Civic Consensus Strategy
                  </h3>
                  <div className="space-y-4 text-xs text-slate-400 text-left">
                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold font-mono">
                        1
                      </div>
                      <div>
                        <strong className="text-white font-medium">Capture Discord:</strong> Resident reporting gathers structural details, geo coordinate, and basic visual photographs from field incidents.
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold font-mono">
                        2
                      </div>
                      <div>
                        <strong className="text-white font-medium">Translate Consensus:</strong> Stakeholders are queried relative to local code variables. Out-of-court compromises map to alternative buffers.
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-mono">
                        3
                      </div>
                      <div>
                        <strong className="text-white font-medium">Verify Votes:</strong> Digital timeline processes public comment blocks and records verified municipal votes transparently.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                  <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Example conflict seeds</p>
                  <div className="flex flex-col gap-1.5">
                    <button 
                      onClick={() => {
                        setFormTitle("Oakridge Overpass High-Decibel Safety Barrier");
                        setFormLocation("Oakridge North Ramp (Block-8)");
                        setFormCategory("Safety");
                        setFormUrgency("high");
                        setFormDescription("Residents demand 12-foot concrete sound shields due to highway noise spiking to 87dB. However, local commerce owners protest claiming the walls block visual landmarks to storefronts, risking business closure.");
                        triggerBanner("Simulated Form parameters auto-filled!");
                      }}
                      className="text-left py-1.5 px-2 bg-white/2 hover:bg-white/5 rounded border border-white/5 text-[11px] text-indigo-300 hover:text-indigo-200 transition"
                    >
                      💡 Fill: Overpass Sound Barrier Conflict
                    </button>
                    <button 
                      onClick={() => {
                        setFormTitle("Solar Grid Farm vs Woodland Preservation");
                        setFormLocation("Eastside Reserve Boundary");
                        setFormCategory("Energy");
                        setFormUrgency("medium");
                        setFormDescription("Zoning authority proposes clean solar cells with double backing batteries. Local preservationists oppose clearing 14 acres of old-growth oak trees to secure horizontal spacing.");
                        triggerBanner("Simulated Form parameters auto-filled!");
                      }}
                      className="text-left py-1.5 px-2 bg-white/2 hover:bg-white/5 rounded border border-white/5 text-[11px] text-indigo-300 hover:text-indigo-200 transition"
                    >
                      💡 Fill: Solar Farm vs Canopy Conflict
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* GIS-inspired Interactive Hazard Map */}
        <InteractiveHazardMap
          reports={reports}
          activeReport={activeReport}
          setActiveReport={(rep) => setSelectedReportId(rep.id)}
          globalLang={globalLang}
        />

        {/* SECTION 1.2: CIVIC INTELLIGENCE MEMORY & HISTORY PORTAL */}
        <section id="report-history" className="scroll-mt-24 space-y-6 pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/5 pb-5">
            <div className="text-left space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
                <History className="w-3.5 h-3.5" />
                {globalLang === 'hi' ? 'नागरिक स्मृति और रिपोर्ट इतिहास' : 'Civic Intelligence Memory & History'}
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                {globalLang === 'hi' ? 'रिपोर्ट इतिहास और इंटेलिजेंस मेमोरी' : 'Report History & Civic Memory'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                {globalLang === 'hi' 
                  ? 'पड़ोस के विवादों, वास्तविक समय के हितधारक संरेखण और सत्यापित समझौतों के पूर्ण लॉग तक पहुंचें।'
                  : 'Access the complete log of parsed neighborhood conflicts, real-time stakeholder alignments, and verified compromises.'}
              </p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400/80 mt-2 italic">
                ✨ {globalLang === 'hi' ? "अपलोड किए गए साक्ष्यों और रिपोर्ट इतिहास से एआई द्वारा उत्पन्न।" : "AI-generated from uploaded evidence and report history."}
              </p>
            </div>

            {/* Tabs Selector */}
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/5 gap-1 select-none">
              <button
                type="button"
                onClick={() => setHistoryTab('recent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-200 cursor-pointer ${
                  historyTab === 'recent'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-205'
                }`}
              >
                {globalLang === 'hi' ? 'हालिया रिपोर्टें' : 'Recent Reports'}
              </button>
              <button
                type="button"
                onClick={() => setHistoryTab('history')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-200 cursor-pointer ${
                  historyTab === 'history'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-205'
                }`}
              >
                {globalLang === 'hi' ? 'इतिहास' : 'Analysis History'}
              </button>
              <button
                type="button"
                onClick={() => setHistoryTab('resolved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-200 cursor-pointer ${
                  historyTab === 'resolved'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-205'
                }`}
              >
                {globalLang === 'hi' ? 'सुलझाए गए मामले' : 'Resolved Issues'}
              </button>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
            {(() => {
              // Filtering reports based on current tab state
              let filtered = [...reports];
              if (historyTab === 'recent') {
                filtered = reports.filter(r => r.status !== 'resolved');
              } else if (historyTab === 'resolved') {
                filtered = reports.filter(r => r.status === 'resolved');
              }

              if (filtered.length === 0) {
                return (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mx-auto text-slate-500">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 italic max-w-sm mx-auto leading-relaxed">
                      {historyTab === 'recent' && (globalLang === 'hi' ? 'कोई लंबित या सक्रिय रिपोर्ट उपलब्ध नहीं है। आरंभ करने के लिए ऊपर एक नया संकट दर्ज करें!' : 'No pending or active reports available. Ingest a new hazard above to begin!')}
                      {historyTab === 'history' && (globalLang === 'hi' ? 'नागरिक स्मृति खाली है। कृपया पहले सुरक्षा ऑडिट पूरा करें।' : 'Civic memory is empty. Please complete an initial safety audit first.')}
                      {historyTab === 'resolved' && (globalLang === 'hi' ? 'वर्तमान रिकॉर्ड पर कोई समाधान नहीं मिला है। को-लोकेशन समझौतों को अंतिम रूप देने के लिए हितधारकों को संरेखित करें!' : 'No resolved cases on current record. Coordinate stakeholder alignments to finalize treaties!')}
                    </p>
                  </div>
                );
              }

              return (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] tracking-widest font-mono text-slate-400 uppercase select-none">
                        <th className="py-3 px-4">{globalLang === 'hi' ? 'पूर्वावलोकन' : 'Preview'}</th>
                        <th className="py-3 px-4">{globalLang === 'hi' ? 'जोखिम का प्रकार / शीर्षक' : 'Hazard & Case'}</th>
                        <th className="py-3 px-4 hidden md:table-cell">{globalLang === 'hi' ? 'स्थान' : 'Location'}</th>
                        <th className="py-3 px-4 text-center">{globalLang === 'hi' ? 'जोखिम गंभीरता' : 'Severity'}</th>
                        <th className="py-3 px-4 hidden sm:table-cell">{globalLang === 'hi' ? 'जोड़ने की तिथि' : 'Date Added'}</th>
                        <th className="py-3 px-4 text-center">{globalLang === 'hi' ? 'स्थिति' : 'Status'}</th>
                        <th className="py-3 px-4 text-right">{globalLang === 'hi' ? 'कार्रवाई' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                      {filtered.map((rep) => {
                        const isSelected = selectedReportId === rep.id;
                        const mainHazard = rep.visionAnalysis?.hazardType || rep.category || "Infrastructure Hazard";
                        const severity = rep.visionAnalysis?.severityScore ?? rep.resolutionScore ?? 50;
                        const dateString = rep.dateAdded || "2026-06-20";

                        // Get Category Icon
                        const renderIcon = () => {
                          const iconClass = "w-4 h-4 text-white";
                          switch (rep.category) {
                            case 'Transport':
                              return <Route className={iconClass} />;
                            case 'Safety':
                              return <Shield className={iconClass} />;
                            case 'Energy':
                              return <Sparkle className={iconClass} />;
                            case 'Environmental':
                              return <TreePine className={iconClass} />;
                            case 'Infrastructure':
                            default:
                              return <Building2 className={iconClass} />;
                          }
                        };

                        const getCategoryBg = () => {
                          switch (rep.category) {
                            case 'Transport': return 'from-amber-600 to-amber-700';
                            case 'Safety': return 'from-rose-600 to-rose-700';
                            case 'Energy': return 'from-yellow-500 to-amber-600';
                            case 'Environmental': return 'from-emerald-600 to-emerald-700';
                            case 'Infrastructure':
                            default:
                              return 'from-slate-600 to-indigo-700';
                          }
                        };

                        return (
                          <tr 
                            key={rep.id} 
                            className={`transition duration-150 hover:bg-white/2 cursor-pointer ${
                              isSelected ? 'bg-indigo-600/10 border-l-2 border-l-indigo-500' : ''
                            }`}
                            onClick={() => {
                              setSelectedReportId(rep.id);
                              triggerBanner(globalLang === 'hi' ? `फ़ोकस किया गया: "${rep.title}"` : `Focus shifted to: "${rep.title}"`);
                            }}
                          >
                            {/* Thumbnail Column */}
                            <td className="py-3 px-4" onClick={(e) => { e.stopPropagation(); setSelectedReportId(rep.id); }}>
                              {rep.imageUrl ? (
                                <img 
                                  src={rep.imageUrl} 
                                  alt={rep.title}
                                  referrerPolicy="no-referrer"
                                  className="w-11 h-11 rounded-lg border border-white/15 object-cover bg-slate-900 shadow-inner"
                                />
                              ) : (
                                <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${getCategoryBg()} flex items-center justify-center border border-white/10 shadow-md`}>
                                  {renderIcon()}
                                </div>
                              )}
                            </td>

                            {/* Title & Case Description */}
                            <td className="py-3 px-4 max-w-[180px] sm:max-w-[240px]">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-100 text-sm truncate block">{rep.title}</span>
                                {isSelected && (
                                  <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-[9px] text-indigo-400 font-mono scale-90">
                                    {globalLang === 'hi' ? 'सक्रिय' : 'Active'}
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-400 font-mono text-[10px] mt-0.5 truncate block text-left">{mainHazard}</span>
                            </td>

                            {/* Location column */}
                            <td className="py-3 px-4 text-slate-400 hidden md:table-cell max-w-[140px] truncate text-left">
                              <span className="truncate block font-sans">{rep.location}</span>
                            </td>

                            {/* Severity Score Column */}
                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex flex-col items-center">
                                <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                                  severity >= 75 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                  severity >= 45 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                }`}>
                                  {severity}%
                                </span>
                                <div className="w-12 h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                                  <div 
                                    className={`h-full ${
                                      severity >= 75 ? 'bg-rose-500' :
                                      severity >= 45 ? 'bg-amber-500' :
                                      'bg-emerald-500'
                                    }`}
                                    style={{ width: `${severity}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Date added */}
                            <td className="py-3 px-4 text-slate-400 hidden sm:table-cell font-mono text-[11px] text-left">
                              {dateString}
                            </td>

                            {/* Status Badge */}
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                                rep.status === 'resolved' 
                                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25' 
                                  : rep.status === 'pending'
                                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  rep.status === 'resolved' ? 'bg-blue-400' :
                                  rep.status === 'pending' ? 'bg-amber-400' : 'bg-emerald-400'
                                }`} />
                                {rep.status === 'resolved' ? (globalLang === 'hi' ? 'सुलझाया' : 'Resolved') :
                                 rep.status === 'pending' ? (globalLang === 'hi' ? 'लंबित' : 'Pending') :
                                 (globalLang === 'hi' ? 'सक्रिय' : 'Active')}
                              </span>
                            </td>

                            {/* Action Buttons Column */}
                            <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Toggle resolve status */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReports(prev => prev.map(r => {
                                      if (r.id === rep.id) {
                                        const nextStatus = r.status === 'resolved' ? 'active' : 'resolved';
                                        return { ...r, status: nextStatus };
                                      }
                                      return r;
                                    }));
                                    triggerBanner(
                                      rep.status === 'resolved'
                                        ? (globalLang === 'hi' ? "मामला पुनः सक्रिय किया गया और खुला है।" : "Case reopened and marked active.")
                                        : (globalLang === 'hi' ? "मामला सफलतापूर्वक सुलझाया गया!" : "Case solved and marked completed!")
                                    );
                                  }}
                                  title={rep.status === 'resolved' ? "Reopen Case" : "Resolve Case"}
                                  className={`p-1.5 rounded-lg border transition duration-150 cursor-pointer ${
                                    rep.status === 'resolved'
                                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                                      : 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20'
                                  }`}
                                >
                                  {rep.status === 'resolved' ? (
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  ) : (
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                {/* Delete button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(globalLang === 'hi' ? "क्या आप वाकई इस रिकॉर्ड को हटाना चाहते हैं?" : "Purge this report from civic memory? This cannot be undone.")) {
                                      const remaining = reports.filter(r => r.id !== rep.id);
                                      setReports(remaining);
                                      triggerBanner(globalLang === 'hi' ? "रिपोर्ट सफलतापूर्वक हटा दी गई।" : "Report permanently removed.");
                                      if (selectedReportId === rep.id) {
                                        if (remaining.length > 0) {
                                          setSelectedReportId(remaining[0].id);
                                        } else {
                                          setSelectedReportId('');
                                        }
                                      }
                                    }
                                  }}
                                  title="Delete Permanent"
                                  className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition duration-150 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        </section>

        {/* SECTION 1.5 - AI VISION TELEMETRY FEED */}
        <section id="ai-vision-agent" className="scroll-mt-24 space-y-6 pt-12 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-indigo-600/25 pb-5">
            <div className="text-left space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-650/10 border border-indigo-600/30 text-xs font-semibold text-indigo-650">
                <Eye className="w-3.5 h-3.5 animate-pulse" />
                Real-Time Computer Vision Agent
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100 glow-text">
                1.5. AI Vision Diagnostics Feed
              </h2>
              <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
                Visual telemetry feed analyzing <strong className="text-indigo-600 font-semibold">"{activeReport.title}"</strong>. Our spatial model automatically classifies regional debris, blockages, outages, and structural decay.
              </p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400/85 mt-2 italic">
                ✨ {globalLang === 'hi' ? "अपलोड किए गए साक्ष्यों और रिपोर्ट इतिहास से एआई द्वारा उत्पन्न।" : "AI-generated from uploaded evidence and report history."}
              </p>
            </div>
            
            {/* Precision status metrics */}
            <div className="flex items-center gap-4 bg-slate-100 border border-slate-300 p-2 px-3 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-emerald-500 select-none font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Model: Live (FPS: 30)
              </div>
              <div className="w-px h-3 bg-slate-300" />
              <div className="font-mono text-[10px] text-slate-500">
                Res: 1024x1024
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Image Camera Feed Panel - Left Col */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden relative group shadow-sm flex-1 flex flex-col justify-between">
                
                {/* Header label */}
                <div className="bg-slate-900 border-b border-slate-800 p-3 flex justify-between items-center bg-slate-900/90 backdrop-blur z-10">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2 font-bold select-none">
                    <Target className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '8s' }} />
                    Optical Live Scan
                  </span>
                  <span className="text-[9px] font-mono bg-indigo-600/10 border border-indigo-600/30 px-2 py-0.5 rounded text-indigo-600 uppercase font-bold">
                    Confidence: {(activeReport.visionAnalysis?.confidenceScore || 95.4)}%
                  </span>
                </div>

                {/* Main Viewport Container */}
                <div className="relative w-full aspect-square bg-[#100C08] flex items-center justify-center overflow-hidden min-h-[300px]">
                  {/* Absolute Background Crosshairs and Tech Grids */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 border border-indigo-600/5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-600 opacity-40" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-600 opacity-40" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-600 opacity-40" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-600 opacity-40" />
                  
                  {/* Scanning sweep line animation */}
                  <div className="laser-scanner-line" />

                  {/* actual Image or vector wireframe placeholder */}
                  {activeReport.imageUrl ? (
                    <img 
                      src={activeReport.imageUrl} 
                      alt="Hazard analysis visual feed" 
                      className="w-full h-full object-cover select-none pointer-events-none" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                      <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-500 animate-pulse">
                        <Eye className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                          [ NO VISUAL ATTACHMENT ]
                        </p>
                        <p className="text-[10px] text-slate-550 max-w-xs mt-1 leading-relaxed">
                          Standard CAD structural mock anchors are loaded automatically for current location.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* AI Computer Vision Bounding Boxes Overlay */}
                  {getBoundingBoxesForHazard(activeReport.visionAnalysis?.hazardType || activeReport.title).map((box, bIdx) => (
                    <div
                      key={bIdx}
                      className="absolute border-2 border-indigo-600/70 bg-indigo-600/5 select-none pointer-events-none animate-in fade-in zoom-in duration-700"
                      style={{
                        top: box.top,
                        left: box.left,
                        width: box.width,
                        height: box.height,
                      }}
                    >
                      <span className="absolute top-0 left-0 -translate-y-full bg-indigo-600 text-[8px] font-mono text-[#FAF8F5] px-1.5 py-0.5 rounded-br font-bold border-l-2 border-t-2 border-indigo-600 whitespace-nowrap shadow-md">
                        {box.label}
                      </span>
                    </div>
                  ))}

                  {/* Hover scan stats HUD overlay */}
                  <div className="absolute bottom-2 right-2 bg-[#100C08]/85 border border-slate-800 p-2 rounded text-[9px] font-mono text-slate-400 space-y-0.5 pointer-events-none z-10">
                    <div>GPS SECURE | JUR_CODE_4</div>
                    <div>LAT: 28.614 | LON: 77.231</div>
                    <div>UTC: {(activeReport.visionAnalysis?.analysisTimestamp || "2026-06-23 15:45:00 UTC")}</div>
                  </div>
                </div>

                {/* Simulated Diagnostic Logs console */}
                <div className="bg-[#100C08] border-t border-slate-800 p-3 h-24 overflow-y-auto font-mono text-[9px] text-left text-slate-400 space-y-1">
                  <div className="text-emerald-500 font-bold flex items-center gap-1.5 select-none">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
                    CONSOLE [STABLE]: Vision Sentinel analytical matrix loaded.
                  </div>
                  <div>&gt; Loading image array tensors to RGB-A structure... Success.</div>
                  <div>&gt; Searching spatial geometry boundaries... {getBoundingBoxesForHazard(activeReport.visionAnalysis?.hazardType || activeReport.title).length} anchors found.</div>
                  <div className="text-indigo-600 font-bold">&gt; Classification layer mapped: "{(activeReport.visionAnalysis?.hazardType || "Pavement Subgrade Damage")}"</div>
                  <div>&gt; confidence output initialized: {(activeReport.visionAnalysis?.confidenceScore || 95.4)}% core margin precision.</div>
                  <div>&gt; Syncing affected demographic matrix variables with active consensus ledger.</div>
                </div>

              </div>
            </div>

            {/* AI Diagnostics Bento Grid Blocks - Right Col */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5 animate-fade-in">
              
              {/* Unclear Feed Notification Block */}
              {activeReport.visionAnalysis?.isUnclear && (
                <div className="sm:col-span-2 p-4 rounded-xl bg-amber-500/10 border border-amber-500/35 text-amber-400 text-xs font-mono font-bold text-center flex items-center justify-center gap-2 animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{globalLang === 'hi' ? 'सटीक मूल्यांकन के लिए अतिरिक्त जानकारी आवश्यक है।' : 'Additional information required for accurate assessment.'}</span>
                </div>
              )}

              {/* Card 1: Hazard Type */}
              <div className="glass-card rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-indigo-650 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 text-left">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                      {globalLang === 'hi' ? "वर्गीकृत जोखिम" : "Classified Hazard"}
                    </p>
                    <h4 className="font-display font-bold text-base text-indigo-550 leading-tight">
                      {globalLang === 'hi' 
                        ? (activeReport.visionAnalysis?.multilingualAnalysis?.hi?.hazardType || activeReport.visionAnalysis?.hazardType || "सड़क की सतह का नुकसान")
                        : (activeReport.visionAnalysis?.hazardType || "Road Surface Degradation")}
                    </h4>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-600/15 text-indigo-400 border border-indigo-600/25">
                    <Target className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/40">
                  <p className="text-[11px] text-slate-500 text-left leading-relaxed">
                    {globalLang === 'hi'
                      ? `स्थानीय रांची नगर नियमों के अनुसार सीधे मैप किया गया। यह श्रेणी "${activeReport.category}" से मेल खाती है।`
                      : `Instantly mapped relative to municipal code provisions. Confirmed category aligns with "${activeReport.category}" guidelines.`}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/40 text-[9px] text-[#818cf8]/70 font-mono text-left italic">
                  {globalLang === 'hi' ? "एआई दृश्य विश्लेषण से उत्पन्न।" : "Generated from AI visual analysis."}
                </div>
              </div>

              {/* Card 2: Severity Score */}
              <div className="glass-card rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-indigo-650 transition-all duration-300">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold text-left">
                      {globalLang === 'hi' ? "गंभीरता सूचकांक" : "Severity Index"}
                    </p>
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-600/15 px-2 py-0.5 rounded border border-indigo-600/25">
                      {(activeReport.visionAnalysis?.severityScore || 78)}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium text-left">
                    {globalLang === 'hi'
                      ? "स्थान और प्रभाव के आधार पर गणना की गई वास्तविक भौतिक जोखिम दर।"
                      : "Weighted physical impact danger score based on spatial footprint."}
                  </p>
                </div>

                {/* Progress bar scale */}
                <div className="space-y-2">
                  <div className="w-full h-2.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-[2px]">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        (activeReport.visionAnalysis?.severityScore || 78) >= 80 ? 'bg-rose-600' :
                        (activeReport.visionAnalysis?.severityScore || 78) >= 60 ? 'bg-indigo-600' :
                        (activeReport.visionAnalysis?.severityScore || 78) >= 40 ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${(activeReport.visionAnalysis?.severityScore || 78)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                    <span>{globalLang === 'hi' ? "निम्न" : "Low"}</span>
                    <span>{globalLang === 'hi' ? "मध्य" : "Mod"}</span>
                    <span>{globalLang === 'hi' ? "उच्च" : "High"}</span>
                    <span>{globalLang === 'hi' ? "गंभीर" : "Critical"}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/40 text-[9px] text-[#818cf8]/70 font-mono text-left italic">
                  {globalLang === 'hi' ? "एआई दृश्य विश्लेषण से उत्पन्न।" : "Generated from AI visual analysis."}
                </div>
              </div>

              {/* Card 3: Risk Level */}
              <div className="glass-card rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-indigo-650 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 text-left">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                      {globalLang === 'hi' ? "जोखिम वर्गीकरण" : "Risk Classification"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`relative flex h-2.5 w-2.5`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          (activeReport.visionAnalysis?.riskLevel || "High") === 'Critical' ? 'bg-red-500' :
                          (activeReport.visionAnalysis?.riskLevel || "High") === 'High' ? 'bg-indigo-600' :
                          (activeReport.visionAnalysis?.riskLevel || "High") === 'Medium' ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`}></span>
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                          (activeReport.visionAnalysis?.riskLevel || "High") === 'Critical' ? 'bg-red-500' :
                          (activeReport.visionAnalysis?.riskLevel || "High") === 'High' ? 'bg-indigo-600' :
                          (activeReport.visionAnalysis?.riskLevel || "High") === 'Medium' ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`}></span>
                      </span>
                      <span className={`font-display font-black text-xl tracking-tight uppercase ${
                        (activeReport.visionAnalysis?.riskLevel || "High") === 'Critical' ? 'text-rose-500' :
                        (activeReport.visionAnalysis?.riskLevel || "High") === 'High' ? 'text-indigo-400' :
                        (activeReport.visionAnalysis?.riskLevel || "High") === 'Medium' ? 'text-amber-500' :
                        'text-emerald-400'
                      }`}>
                        {(activeReport.visionAnalysis?.riskLevel || "High")}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-600/15 text-indigo-400 border border-indigo-600/25">
                    <AlertTriangle className="w-4 h-4 hover:scale-105 transition" />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/40">
                  <p className="text-[11px] text-slate-500 text-left leading-relaxed">
                    {globalLang === 'hi' ? "कार्रवाई समय सीमा: " : "Action limit timeline: "}
                    <strong className="text-slate-400 font-mono">
                      {(activeReport.visionAnalysis?.riskLevel || "High") === 'Critical' ? (globalLang === 'hi' ? 'तत्काल (< १२ घंटे)' : 'Immediate (< 12 hrs)') :
                       (activeReport.visionAnalysis?.riskLevel || "High") === 'High' ? (globalLang === 'hi' ? 'त्वरित (< ४८ घंटे)' : 'Expedited (< 48 hrs)') :
                       (activeReport.visionAnalysis?.riskLevel || "High") === 'Medium' ? (globalLang === 'hi' ? 'सामान्य (< ५ दिन)' : 'Routine (< 5 days)') :
                       (globalLang === 'hi' ? 'मानक कार्रवाई' : 'Standard Action Schedule')}
                    </strong>
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/40 text-[9px] text-[#818cf8]/70 font-mono text-left italic">
                  {globalLang === 'hi' ? "एआई दृश्य विश्लेषण से उत्पन्न।" : "Generated from AI visual analysis."}
                </div>
              </div>

              {/* Card 4: Extracted Objects */}
              <div className="glass-card rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-indigo-650 transition-all duration-300">
                <div className="space-y-1 text-left">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                    {globalLang === 'hi' ? "पहचाने गए अवशेष व वस्तुएं" : "Detected Objects & Precision"}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium text-left">
                    {globalLang === 'hi' ? "छवि से निकाले गए निर्देशांक आधारित तत्व।" : "Recognized visual elements anchored in target coordinates."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/40">
                  {(activeReport.visionAnalysis?.detectedObjects || ["Pavement Defect Area", "Lateral Surface Cracks"]).map((obj, oIdx) => (
                    <span 
                      key={oIdx}
                      className="px-2 py-0.5 text-[9px] font-bold font-mono rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase select-none inline-flex items-center gap-1 hover:text-indigo-400 hover:border-indigo-600 transition"
                    >
                      <Target className="w-2.5 h-2.5 text-indigo-500" />
                      {obj}
                    </span>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-800/40 text-[9px] text-[#818cf8]/70 font-mono text-left italic">
                  {globalLang === 'hi' ? "एआई दृश्य विश्लेषण से उत्पन्न।" : "Generated from AI visual analysis."}
                </div>
              </div>

              {/* Card 7: Affected Area & Priority Level */}
              <div className="glass-card rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-indigo-650 transition-all duration-300">
                <div className="space-y-1 text-left">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                    {globalLang === 'hi' ? "प्रभावित सीमा क्षेत्र और प्राथमिकता" : "Spatial Footprint & Priority"}
                  </p>
                  
                  <div className="space-y-2.5 mt-2">
                    <h4 className="font-display font-medium text-[11px] text-slate-300">
                      <span className="text-[#818cf8] font-mono block text-[9px] uppercase tracking-wider font-semibold">
                        {globalLang === 'hi' ? "अनुमानित प्रभावित क्षेत्र:" : "Estimated Affected Area:"}
                      </span>
                      <strong className="text-white text-xs sm:text-[13px] font-semibold">
                        {globalLang === 'hi' 
                          ? (activeReport.visionAnalysis?.multilingualAnalysis?.hi?.estimatedAffectedArea || activeReport.visionAnalysis?.estimatedAffectedArea || "१५० मीटर का केंद्रीय दायरा")
                          : (activeReport.visionAnalysis?.estimatedAffectedArea || "150-meter radius around main intersection")}
                      </strong>
                    </h4>

                    <h4 className="font-display font-medium text-[11px] text-slate-300">
                      <span className="text-[#818cf8] font-mono block text-[9px] uppercase tracking-wider font-semibold">
                        {globalLang === 'hi' ? "अनुशंसित प्राथमिकता का स्तर:" : "Recommended Priority Level:"}
                      </span>
                      <span className="inline-block px-2.5 py-0.5 mt-1 rounded text-[10px] font-bold uppercase font-mono bg-indigo-650/20 border border-indigo-600/30 text-indigo-400">
                        {activeReport.visionAnalysis?.recommendedPriorityLevel || "High"}
                      </span>
                    </h4>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/40 text-[9px] text-[#818cf8]/70 font-mono text-left italic">
                  {globalLang === 'hi' ? "एआई दृश्य विश्लेषण से उत्पन्न।" : "Generated from AI visual analysis."}
                </div>
              </div>

              {/* Card 8: Impact Assessment Matrix */}
              <div className="glass-card rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-indigo-650 transition-all duration-300">
                <div className="space-y-2 text-left">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                    {globalLang === 'hi' ? "गतिशील बहु-आयामी प्रभाव विश्लेषण" : "Dynamic Impact Assessment"}
                  </p>
                  
                  <div className="space-y-2 text-[10px] sm:text-[11px] leading-relaxed select-none">
                    <div>
                      <span className="text-rose-400 font-mono font-bold block text-[9px] tracking-wider">[PUBLIC SAFETY]</span> 
                      <p className="text-slate-400 text-xs">
                        {globalLang === 'hi'
                          ? (activeReport.visionAnalysis?.multilingualAnalysis?.hi?.publicSafetyImpact || activeReport.visionAnalysis?.publicSafetyImpact || "फिसलन होने और दुर्घटनाओं की आशंका")
                          : (activeReport.visionAnalysis?.publicSafetyImpact || "Risks of debris collisions or slippery surfaces")}
                      </p>
                    </div>
                    <div>
                      <span className="text-emerald-400 font-mono font-bold block text-[9px] tracking-wider">[ENVIRONMENTAL]</span> 
                      <p className="text-slate-400 text-xs">
                        {globalLang === 'hi'
                          ? (activeReport.visionAnalysis?.multilingualAnalysis?.hi?.environmentalImpact || activeReport.visionAnalysis?.environmentalImpact || "स्थानीय ड्रेनेज रुकावट")
                          : (activeReport.visionAnalysis?.environmentalImpact || "Possible light pollution, local storm runoff complications")}
                      </p>
                    </div>
                    <div>
                      <span className="text-amber-400 font-mono font-bold block text-[9px] tracking-wider">[INFRASTRUCTURE]</span> 
                      <p className="text-slate-400 text-xs">
                        {globalLang === 'hi'
                          ? (activeReport.visionAnalysis?.multilingualAnalysis?.hi?.infrastructureImpact || activeReport.visionAnalysis?.infrastructureImpact || "सड़क की उपसतह संरचना का क्षरण")
                          : (activeReport.visionAnalysis?.infrastructureImpact || "Road subgrade erosion, utility cabinet risk, asphalt peeling.")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/40 text-[9px] text-[#818cf8]/70 font-mono text-left italic">
                  {globalLang === 'hi' ? "एआई दृश्य विश्लेषण से उत्पन्न।" : "Generated from AI visual analysis."}
                </div>
              </div>

              {/* Card 5: Stakeholder Connection Card (Full-width in grid span) */}
              <div className="sm:col-span-2 glass-card rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-indigo-650 transition-all duration-300">
                <div className="flex items-center justify-between text-left">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                      {globalLang === 'hi' ? "एआई द्वारा मानचित्रित प्रभावित समुदाय" : "A.I. Mapped Stakeholders"}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {globalLang === 'hi' ? "सक्रिय एआई मॉडल द्वारा जोखिम वाले क्षेत्र में पहचाने गए समूह।" : "Demographics flagged by the vision model as directly affected by this hazard footprint."}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-600/15 text-indigo-400 border border-indigo-600/25 hidden sm:block">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800/40 text-left">
                  {(activeReport.visionAnalysis?.affectedStakeholders || ["Residents", "Students", "Businesses", "Agency"]).map((stk, sIdx) => {
                    const getLocalizedStakeholderName = (name: string) => {
                      if (globalLang !== 'hi') return name;
                      const dictionary: Record<string, string> = {
                        "Daily Vehicle Commuters": "दैनिक वाहन यात्री",
                        "Local Retail Shopkeepers": "स्थानीय खुदरा दुकानदार",
                        "Municipal Stormwater Drainage Dept": "नगर निगम जल निकासी विभाग",
                        "Surrounding Residents": "आस-पास के निवासी",
                        "Environmental Protection Agency": "पर्यावरण संरक्षण एजेंसी",
                        "Municipal Sewer Crew": "नगर निगम सीवर दल",
                        "Neighborhood Welfare Society": "पड़ोस कल्याण समिति",
                        "Sanitation Enforcement Agency": "स्वच्छता प्रवर्तन दल",
                        "Local Environmental Hub": "स्थानीय पर्यावरण केंद्र",
                        "Nocturnal Pedestrians": "रात के पैदल यात्री",
                        "Local Crime Prevention Patrol": "स्थानीय अपराध निवारण गश्ती",
                        "Municipal Electrical Grid": "नगर निगम विद्युत ग्रिड",
                        "Cyclists & Micro-mobility Users": "साइकिल और माइक्रो-मोबिलिटी उपयोगकर्ता",
                        "Emergency Ambulance Dispatch": "आपातकालीन एम्बुलेंस प्रेषण",
                        "Department of Transportation": "परिवहन विभाग",
                        "Downtown Merchant Alliance": "डाउनटाउन मर्चेंट एलायंस",
                        "Metropolitan Transit Bureau": "महानगर परिवहन ब्यूरो",
                        "Green Lanes Cyclist Coalition": "ग्रीन लेंस साइकिल चालक गठबंधन",
                        "Broad Street Resident Association": "ब्रॉड स्ट्रीट निवासी संघ",
                        "Oakridge Nature Advocates": "ओकरीज प्रकृति समर्थक",
                        "Oakridge Runners Guild": "ओकरीज रनर्स गिल्ड",
                        "Westside Police Patrol Division": "वेस्टसाइड पुलिस पेट्रोल डिवीजन",
                        "Crestview Parents Alliance": "क्रेस्टव्यू स्कूल अभिभावक संघ",
                        "Crestview School Board": "क्रेस्टव्यू स्कूल बोर्ड",
                        "Telecommunications Partner": "दूरसंचार भागीदार",
                        "Commercial Zoning Council": "वाणिज्यिक ज़ोनिंग परिषद",
                        "Residents": "स्थानीय निवासी",
                        "Students": "छात्र",
                        "Local Businesses": "स्थानीय व्यवसाय",
                        "Pedestrians": "पैदल यात्री",
                        "Women Commuters": "महिला यात्री",
                        "Electricity Department": "विद्युत विभाग",
                        "Sanitation Department": "स्वच्छता विभाग",
                        "Shopkeepers": "दुकानदार",
                        "Drivers": "वाहन चालक",
                        "Delivery Workers": "डिलिवरी कर्मचारी",
                        "Municipal Engineering Department": "नगरपालिका इंजीनियरिंग विभाग"
                      };
                      return dictionary[name] || name;
                    };
                    const dispStkName = getLocalizedStakeholderName(stk);
                    return (
                      <div 
                        key={sIdx} 
                        className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 flex items-center gap-2.5 group hover:border-indigo-650 transition duration-300"
                      >
                        <div className="w-6.5 h-6.5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] select-none shrink-0">
                          {dispStkName[0] || stk[0]}
                        </div>
                        <div className="truncate">
                          <span className="text-[9px] font-mono text-slate-500 uppercase leading-none block font-semibold">
                            {globalLang === 'hi' ? `हितधारक #${sIdx + 1}` : `STK #${sIdx + 1}`}
                          </span>
                          <span className="text-xs font-semibold text-slate-350 block truncate group-hover:text-indigo-400 transition duration-300">
                            {dispStkName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-slate-800/40 text-[9px] text-[#818cf8]/70 font-mono text-left italic">
                  {globalLang === 'hi' ? "एआई दृश्य विश्लेषण से उत्पन्न।" : "Generated from AI visual analysis."}
                </div>
              </div>

              {/* Card 6: AI Vision System Recommendation (Full-width in grid span) */}
              <div className="sm:col-span-2 bg-[#FAF9F5] border border-indigo-650/20 p-5 rounded-2xl space-y-3 shadow-inner hover:border-indigo-650 transition-all duration-300">
                <div className="flex items-center gap-2 font-mono text-[10px] text-indigo-650 uppercase tracking-widest font-bold text-left select-none">
                  <Cpu className="w-4 h-4 animate-pulse" />
                  {globalLang === 'hi' ? "गतिशील इंजीनियरिंग सुरक्षा एवं आयोजन अनुशंसा" : "Visual Remediation Strategy (Automated Prompt Output)"}
                </div>
                <div className="bg-[#100C08] font-mono text-xs p-4 rounded-xl border border-slate-800 text-slate-400 text-left relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-1 px-2 text-[8px] bg-slate-900 border-b border-l border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                    Telemetry System
                  </div>
                  <p className="leading-relaxed leading-5 text-slate-300">
                    <span className="text-indigo-450 font-bold select-none">[SENTINEL-VISION-REC]:</span>{" "}
                    {globalLang === 'hi' 
                      ? (activeReport.visionAnalysis?.multilingualAnalysis?.hi?.recommendation || activeReport.visionAnalysis?.recommendation || "नियमित सुरक्षा सेंसर जांच और ड्रेनेज मार्ग को तत्काल सुव्यवस्थित करें।")
                      : (activeReport.visionAnalysis?.recommendation || "Authorize immediate low-profile monitoring checks.")}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#818cf8]/10 text-[9px] text-[#818cf8]/70 font-mono text-left italic">
                  {globalLang === 'hi' ? "एआई दृश्य विश्लेषण से उत्पन्न।" : "Generated from AI visual analysis."}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 2: AI ANALYSIS HUB */}
        <section id="ai-analysis" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/5 pb-5">
            <div className="text-left space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400">
                <Cpu className="w-3.5 h-3.5" />
                Active Cases Deep-Dive
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                2. AI Consensus Analysis
              </h2>
              <p className="text-sm text-slate-400 max-w-xl">
                Current active case: <strong className="text-indigo-300">"{activeReport.title}"</strong>. Mapped via generative compromise matrices.
              </p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400/80 mt-2 italic">
                ✨ {globalLang === 'hi' ? "अपलोड किए गए साक्ष्यों और रिपोर्ट इतिहास से एआई द्वारा उत्पन्न।" : "AI-generated from uploaded evidence and report history."}
              </p>
            </div>
            
            {/* Quick selector for cases */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Select Case:</span>
              <select
                value={selectedReportId}
                onChange={(e) => setSelectedReportId(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {reports.map(rep => (
                  <option key={rep.id} value={rep.id}>{rep.category} - {rep.title.slice(0, 24)}...</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Metrics column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Radial Probability Circle card */}
              <div className="glass-card rounded-2xl border border-white/5 p-6 text-center space-y-4">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest font-mono">Consensus Likelihood</p>
                
                {/* Big dial and percentage */}
                <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                  
                  {/* Glowing background glow */}
                  <div className="absolute inset-4 rounded-full bg-indigo-500/10 blur-xl animate-pulse" />
                  
                  {/* SVG progress circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="80" 
                      cy="80" 
                      r="68" 
                      className="stroke-slate-900 fill-none" 
                      strokeWidth="10" 
                    />
                    <circle 
                      cx="80" 
                      cy="80" 
                      r="68" 
                      className="stroke-indigo-500 fill-none transition-all duration-1000" 
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 68}
                      strokeDashoffset={2 * Math.PI * 68 * (1 - dynamicConsensusScore / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Score text */}
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-extrabold text-white font-display">{dynamicConsensusScore}%</span>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Resolved Index</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Highly Plausible Compromise Zone</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed px-2">
                    Dynamic algorithm calculates overall consensus probability relative to the active stakeholder sentiment indicators block below.
                  </p>
                </div>
              </div>

              {/* Jurisdiction Liability breakdown card */}
              <div className="glass-card rounded-2xl border border-white/5 p-5 space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4.5 h-4.5 text-indigo-400" />
                  <h3 className="font-semibold text-slate-200 text-xs uppercase tracking-widest font-mono">Liability & Routing</h3>
                </div>
                
                <div className="space-y-2.5 text-xs text-slate-400">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="block text-[10px] text-slate-500 uppercase font-mono">Responsible Authority</span>
                    <span className="block text-slate-200 font-medium mt-0.5">{activeReport.jurisdictionResponsibility}</span>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="block text-[10px] text-slate-500 uppercase font-mono mb-1">Relevant Compliance Codes</span>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[9px] text-indigo-400 rounded">MunIC-192.5 (Zoning Amendment)</span>
                      <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[9px] text-indigo-400 rounded">ENV-DecibelP (Limit 85)</span>
                      <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[9px] text-indigo-400 rounded">Safety-8a2f (Lighting)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* AI mediation details & Multilingual flyer generator column */}
            <div className="lg:col-span-8 glass-card rounded-2xl border border-white/5 p-6 sm:p-8 flex flex-col justify-between">
              
              <div className="space-y-6">
                
                {/* Header title */}
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase font-mono text-indigo-400 tracking-wider">AI Consolidated Mediation Strategy</span>
                  <h3 className="text-xl font-bold font-display text-white mt-1">Proposed Resolution Framework</h3>
                </div>

                {/* AI Summary main text block */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-xs sm:text-sm text-slate-300 leading-relaxed text-left relative shadow-inner">
                  <div className="absolute top-3 right-3 text-indigo-400 opacity-20">
                    <Cpu className="w-12 h-12" />
                  </div>
                  <strong className="text-white block mb-2 font-semibold">AI Synthesis:</strong>
                  {activeReport.aiSummary}
                </div>

                {/* Multilingual Flyer Generator Demo Area */}
                <div className="space-y-3.5 text-left pt-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-semibold text-white block">Automated Multilingual Community Flyer</h4>
                      <p className="text-[10px] text-slate-500 leading-none mt-0.5">Translate broadcast alerts instantly to prevent linguistic division.</p>
                    </div>
                    
                    {/* Switcher Lang Links */}
                    <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shadow-sm">
                      {(['en', 'hi', 'es', 'zh', 'vi'] as const).map((lang) => (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          key={lang}
                          onClick={() => {
                            setActiveLang(lang);
                            triggerBanner(`Alert preview translated into ${
                              lang === 'en' ? 'English' :
                              lang === 'hi' ? 'Hindi' :
                              lang === 'es' ? 'Spanish' :
                              lang === 'zh' ? 'Traditional Chinese' : 'Vietnamese'
                            }.`);
                          }}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold transition uppercase select-none cursor-pointer ${
                            activeLang === lang 
                              ? 'bg-indigo-600 font-bold text-white shadow-sm' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {lang}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Flyer container */}
                  <div className="bg-[#11131e] border border-blue-500/20 rounded-xl p-4 sm:p-5 relative overflow-hidden">
                    
                    {/* Header accents */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '20s' }} />
                        <span className="text-[10px] font-mono text-slate-400 tracking-wider font-semibold uppercase">
                          {activeLang === 'en' && 'Verified Community Broadcast'}
                          {activeLang === 'hi' && 'सत्यापित सामुदायिक प्रसारण (Verified Hindi Broadcast)'}
                          {activeLang === 'es' && 'Boletín Comunitario Oficial'}
                          {activeLang === 'zh' && '經審核的社區市民告知'}
                          {activeLang === 'vi' && 'Thông báo cộng đồng xác thực'}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">{activeReport.dateAdded}</span>
                    </div>

                    {/* Translated body */}
                    <p className="text-xs sm:text-sm text-indigo-150 leading-relaxed font-sans italic">
                      {activeReport.multilingualDrafts[activeLang] || activeReport.multilingualDrafts['en']}
                    </p>

                    {/* Footer disclaimer */}
                    <div className="flex justify-between items-center text-[9px] text-slate-500 mt-4 pt-3 border-t border-white/5">
                      <span>Powered by CivicSentinel Translations API</span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Auto-Aligned
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-[11px] text-slate-400 italic">Is this compromise acceptable to you? Select and adjust stakes below.</span>
                <a href="#consensus" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 transition">
                  Review Phased Timeline
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 3: STAKEHOLDER MAPPING MATRIX */}
        <section id="stakeholders" className="scroll-mt-24">
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400">
              <Users className="w-3.5 h-3.5" />
              {globalLang === 'hi' ? 'सक्रिय हितधारक सिमुलेशन' : 'Dynamic Stakeholder Simulation'}
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {globalLang === 'hi' ? '३. इंटरैक्टिव हितधारक भावना मानचित्रण' : '3. Interactive Stakeholder Sentiment Mapping'}
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              {globalLang === 'hi' 
                ? 'प्रत्येक नागरिक विवाद में भिन्न-भिन्न प्रभाव वाले पक्ष शामिल होते हैं। कार्डों पर भावना (Stance) लेबल पर क्लिक करके उनका रुख बदलें और एआई सहमति मीटर को तुरंत पुनः गणना करते देखें!' 
                : 'Each civic dispute involves parties with differing degrees of leverage. Click the Sentiment labels on the cards to cycle their stances and watch the AI consensus dial immediately recalculate!'}
            </p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400/80 mt-2 italic mx-auto text-center">
              ✨ {globalLang === 'hi' ? "अपलोड किए गए साक्ष्यों और रिपोर्ट इतिहास से एआई द्वारा उत्पन्न।" : "AI-generated from uploaded evidence and report history."}
            </p>
          </div>

          {/* Cards collection wrapped in motion.div for language transition */}
          <motion.div 
            key={globalLang}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {activeReport.stakeholders.map((st) => {
              const sentimentColors = {
                supportive: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
                neutral: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
                skeptical: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
                opposed: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              };

              const translateSentiment = (sentiment: string, lang: 'en' | 'hi') => {
                if (lang === 'en') return sentiment;
                const map: Record<string, string> = {
                  supportive: 'समर्थन (Supportive)',
                  neutral: 'तटस्थ (Neutral)',
                  skeptical: 'शंकित (Skeptical)',
                  opposed: 'विरोधी (Opposed)'
                };
                return map[sentiment] || sentiment;
              };

              return (
                <div 
                  key={st.id}
                  className="glass-card rounded-xl border border-white/5 p-5 flex flex-col justify-between text-left hover:border-indigo-550/30 transition duration-300"
                >
                  <div className="space-y-3">
                    
                    {/* Card Title Header */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div>
                        <h4 className="font-display font-bold text-slate-200 text-sm">
                          {translateText(st.name, 'names', globalLang)}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500">
                          {translateText(st.type, 'types', globalLang)}
                        </span>
                      </div>
                      <span className="p-1 px-1.5 rounded bg-white/5 text-[9px] font-semibold text-slate-400 uppercase tracking-wide">
                        {globalLang === 'hi' ? 'हितधारक' : 'Stk'}
                      </span>
                    </div>

                    {/* Sentiment Trigger Button */}
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-mono text-slate-500 block">
                        {globalLang === 'hi' ? 'दृष्टिकोण (बदलने के लिए क्लिक करें):' : 'Stance (Click to Cycle):'}
                      </span>
                      <button
                        onClick={() => cycleStakeholderSentiment(st.id)}
                        className={`w-full text-center py-1.5 rounded-lg text-xs font-semibold capitalize border cursor-pointer hover:scale-102 transition ${
                          sentimentColors[st.sentiment]
                        }`}
                      >
                        {translateSentiment(st.sentiment, globalLang)}
                      </button>
                    </div>

                    {/* Concern Info */}
                    <div className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/5">
                      <strong>{globalLang === 'hi' ? 'प्राथमिक चिंता:' : 'Concern:'}</strong> {translateText(st.primaryConcern, 'concerns', globalLang)}
                    </div>

                  </div>

                  {/* Bottom Influence weight slider bar */}
                  <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>{globalLang === 'hi' ? 'प्रभाव स्तर' : 'Influence Magnitude'}</span>
                      <span className="text-slate-300">{st.influence}%</span>
                    </div>
                    {/* Visual bar */}
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" 
                        style={{ width: `${st.influence}%` }}
                      />
                    </div>
                  </div>

                </div>
              );
            })}
          </motion.div>
          
          <div className="mt-6 p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs text-slate-400 max-w-xl mx-auto flex items-center gap-3">
            <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <p className="text-left leading-relaxed">
              <strong>Simulated Consensus Math:</strong> Supportive stakeholders award 100 points, Neutral 70 points, Skeptical 40 points, and Opposed 12 points. All are weighted by their specific municipal influence. Align them to maximize consensus before proceeding!
            </p>
          </div>
        </section>

        {/* SECTION 3.5 - COMPREHENSIVE STAKEHOLDER MAPPING ENGINE */}
        <section id="stakeholder-mapping-engine" className="scroll-mt-24 space-y-6 pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/5 pb-5">
            <div className="text-left space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-semibold text-indigo-400">
                <Users className="w-3.5 h-3.5" />
                Constituency Diagnostics
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                3.5. Stakeholder Mapping Engine
              </h2>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                A dedicated simulation engine mapping localized concerns, benefits, and protective mitigation steps proposed for active community stakeholders.
              </p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400/80 mt-2 italic">
                ✨ {globalLang === 'hi' ? "अपलोड किए गए साक्ष्यों और रिपोर्ट इतिहास से एआई द्वारा उत्पन्न।" : "AI-generated from uploaded evidence and report history."}
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={expandAllStk} 
                className="px-3 py-1.5 rounded-lg bg-indigo-600/10 border border-indigo-650/30 text-xs font-semibold text-indigo-400 hover:bg-indigo-600/20 active:scale-95 transition cursor-pointer select-none"
              >
                Expand All
              </button>
              <button 
                onClick={collapseAllStk} 
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-400 hover:bg-white/10 active:scale-95 transition cursor-pointer select-none"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <motion.div 
              whileHover={{ y: -2, scale: 1.01 }} 
              transition={{ duration: 0.2 }}
              className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-1 shadow-sm"
            >
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">TOTAL MAPPED</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-150">{mappingStakeholders.length}</span>
                <span className="text-xs text-indigo-400">Constituencies</span>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2, scale: 1.01 }} 
              transition={{ duration: 0.2 }}
              className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-1 shadow-sm"
            >
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">CONCERNS AUDITED</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-rose-450">
                  {mappingStakeholders.reduce((acc, st) => acc + st.mainConcerns.length, 0)}
                </span>
                <span className="text-xs text-rose-450">Key Points</span>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2, scale: 1.01 }} 
              transition={{ duration: 0.2 }}
              className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-1 shadow-sm"
            >
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">MITIGATIONS LINKED</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-450">
                  {mappingStakeholders.reduce((acc, st) => acc + st.suggestedMitigationMeasures.length, 0)}
                </span>
                <span className="text-xs text-emerald-500 font-semibold font-bold">Active Sol.</span>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2, scale: 1.01 }} 
              transition={{ duration: 0.2 }}
              className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-1 shadow-sm"
            >
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">AVG INFLUENCE DIAL</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-yellow-450">
                  {Math.round(mappingStakeholders.reduce((acc, st) => acc + st.influence, 0) / mappingStakeholders.length)}%
                </span>
                <span className="text-xs text-yellow-500">Authority</span>
              </div>
            </motion.div>
          </div>

          {/* Search bar UI */}
          <div className="relative max-w-md bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-2 group focus-within:border-indigo-600 transition duration-300 shadow-sm">
            <div className="pl-3 text-slate-500">
              <Search className="w-4 h-4 group-focus-within:text-indigo-400 transition" />
            </div>
            <input 
              type="text" 
              placeholder="Search stakeholder list, concerns, mitigations..." 
              value={stkSearchQuery}
              onChange={(e) => setStkSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-150 w-full p-1.5 focus:outline-none placeholder-slate-500 font-sans"
            />
            {stkSearchQuery && (
              <button 
                onClick={() => setStkSearchQuery('')}
                className="p-1 px-2.5 text-xs text-slate-400 hover:text-white rounded bg-white/5 hover:bg-white/10 active:scale-95 transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* Expandable list layout */}
          <div className="grid gap-4 text-left">
            {mappingStakeholders.filter(st => {
              const q = stkSearchQuery.toLowerCase();
              return st.name.toLowerCase().includes(q) || 
                     st.category.toLowerCase().includes(q) ||
                     st.mainConcerns.some(c => c.toLowerCase().includes(q)) ||
                     st.expectedBenefits.some(b => b.toLowerCase().includes(q)) ||
                     st.suggestedMitigationMeasures.some(m => m.toLowerCase().includes(q));
            }).length > 0 ? (
              mappingStakeholders.filter(st => {
                const q = stkSearchQuery.toLowerCase();
                return st.name.toLowerCase().includes(q) || 
                       st.category.toLowerCase().includes(q) ||
                       st.mainConcerns.some(c => c.toLowerCase().includes(q)) ||
                       st.expectedBenefits.some(b => b.toLowerCase().includes(q)) ||
                       st.suggestedMitigationMeasures.some(m => m.toLowerCase().includes(q));
              }).map((st) => {
                const isExpanded = !!stkExpandedIds[st.id];
                
                const sentimentStyle = {
                  supportive: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
                  neutral: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
                  skeptical: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
                  opposed: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }[st.initialSentiment];

                return (
                  <div 
                    key={st.id} 
                    className={`transition-all duration-300 rounded-2xl border ${
                      isExpanded 
                        ? 'bg-slate-950/80 border-indigo-600/50 shadow-lg shadow-indigo-650/5' 
                        : 'glass-card border-white/5 hover:border-white/10'
                    } overflow-hidden`}
                  >
                    
                    {/* Collapsed Header container (acting as clickable expansion trigger) */}
                    <div 
                      onClick={() => toggleStkExpanded(st.id)}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      {/* Left: icon + title */}
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center">
                          {getStkIconComponent(st.icon)}
                        </div>
                        <div className="text-left space-y-1">
                          <h3 className="font-display font-extrabold text-base text-slate-100 flex items-center gap-2">
                            {st.name}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 uppercase tracking-wider font-semibold">
                              {st.id}
                            </span>
                          </h3>
                          <p className="text-xs text-slate-500 truncate max-w-sm sm:max-w-md font-medium">
                            {st.category}
                          </p>
                        </div>
                      </div>

                      {/* Right side widgets: stance, influence & expand toggle */}
                      <div className="flex items-center justify-between sm:justify-end gap-5">
                        
                        {/* Stance status */}
                        <div className="flex flex-col items-center sm:items-end">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold block mb-0.5">Stance (Click to Cycle)</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // don't trigger expand/collapse on clicking the button
                              cycleMappingStkSentiment(st.id);
                            }}
                            className={`p-1 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg border flex items-center gap-1 cursor-pointer transition ${sentimentStyle}`}
                            title="Click to Cycle Sentiment"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-0.5" />
                            {st.initialSentiment}
                          </button>
                        </div>

                        {/* Authority/Influence magnitude bar */}
                        <div className="hidden md:flex flex-col items-end w-24">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold block mb-1">Influence</span>
                          <div className="w-full flex items-center gap-2">
                            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden p-[1px]">
                              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${st.influence}%` }} />
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 font-bold">{st.influence}%</span>
                          </div>
                        </div>

                        {/* Expand/Collapse Caret */}
                        <div className="p-2 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition text-slate-400">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Expandable content drawer */}
                    {isExpanded && (
                      <div className="px-5 pb-6 pt-1 border-t border-white/5 bg-slate-950/40 animate-in fade-in duration-300">
                        
                        <div className="grid md:grid-cols-3 gap-6 pt-3">
                          
                          {/* Segment 1: Main Concerns */}
                          <div className="space-y-3 bg-red-950/10 border border-red-500/10 p-4 rounded-xl">
                            <div className="flex items-center gap-2 pb-2 border-b border-red-500/15">
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                              </span>
                              <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                                Main Concerns
                              </h4>
                            </div>
                            <ul className="space-y-3 text-xs text-slate-400 leading-relaxed list-none p-0 m-0">
                              {st.mainConcerns.map((con, cIdx) => (
                                <li key={cIdx} className="relative pl-4 flex items-start gap-1">
                                  <span className="absolute left-0 top-1 text-red-550 select-none">•</span>
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Segment 2: Expected Benefits */}
                          <div className="space-y-3 bg-emerald-950/10 border border-emerald-500/10 p-4 rounded-xl">
                            <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/15">
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                                Expected Benefits
                              </h4>
                            </div>
                            <ul className="space-y-3 text-xs text-slate-400 leading-relaxed list-none p-0 m-0">
                              {st.expectedBenefits.map((ben, bIdx) => (
                                <li key={bIdx} className="relative pl-4 flex items-start gap-1">
                                  <span className="absolute left-0 top-1 text-emerald-400 select-none">✓</span>
                                  <span>{ben}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Segment 3: Suggested Mitigation Measures */}
                          <div className="space-y-3 bg-indigo-950/20 border border-indigo-600/10 p-4 rounded-xl">
                            <div className="flex items-center gap-2 pb-2 border-b border-indigo-600/15">
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                              </span>
                              <h4 className="text-xs font-mono font-bold text-indigo-450 uppercase tracking-widest">
                                Suggested Mitigations
                              </h4>
                            </div>
                            <ul className="space-y-3 text-xs text-slate-400 leading-relaxed list-none p-0 m-0">
                              {st.suggestedMitigationMeasures.map((mit, mIdx) => (
                                <li key={mIdx} className="relative pl-4 flex items-start gap-1">
                                  <span className="absolute left-0 top-1 text-indigo-400 select-none">★</span>
                                  <span className="font-medium text-slate-300">{mit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                        </div>

                        {/* Interactive consensus impact footer */}
                        <div className="mt-4 p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between text-[11px] text-slate-500">
                          <span className="flex items-center gap-1.5 leading-none">
                            <Info className="w-3.5 h-3.5 text-indigo-600" />
                            Adjust stance to test authority weight modifications in real time.
                          </span>
                          <span className="font-mono text-indigo-400 font-semibold">
                            Authority Force: {(st.influence * (st.initialSentiment === 'supportive' ? 1.0 : st.initialSentiment === 'neutral' ? 0.7 : st.initialSentiment === 'skeptical' ? 0.4 : 0.12)).toFixed(0)} weighted units
                          </span>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center space-y-2">
                <p className="text-sm font-mono text-slate-500 uppercase tracking-wider font-bold">
                  No Constituencies Matched
                </p>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Try clearing your search filters or inputting standard keywords like "Hostel," "Adivasi," or "Concerns" to locate matches.
                </p>
                <button 
                  onClick={() => setStkSearchQuery('')}
                  className="px-3 py-1 text-xs bg-white/5 border border-white/5 text-slate-300 rounded hover:bg-white/10 active:scale-95 transition mt-2 cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3.75 - AI DIPLOMAT AGENT */}
        <section id="ai-diplomat-agent" className="scroll-mt-24 space-y-6 pt-12 border-t border-white/5 text-left">
          <div className="border-b border-white/5 pb-5 space-y-1.5 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-semibold text-indigo-400 font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
              {UI_TRANSLATIONS[globalLang].flagship}
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {SECTION_TRANSLATIONS[globalLang].diplomatTitle}
            </h2>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              {SECTION_TRANSLATIONS[globalLang].diplomatDesc}
            </p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400/80 mt-2 italic">
              ✨ {globalLang === 'hi' ? "अपलोड किए गए साक्ष्यों और रिपोर्ट इतिहास से एआई द्वारा उत्पन्न।" : "AI-generated from uploaded evidence and report history."}
            </p>
          </div>

          <motion.div 
            key={globalLang} 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }} 
            className="grid lg:grid-cols-12 gap-6"
          >
            
            {/* Control Panel Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-display font-bold text-sm text-slate-100 uppercase tracking-widest">
                    Arbitration Parameters
                  </h3>
                </div>

                {/* 1. Technical Directive Parameter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    1. Arbitration Directive Style
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <motion.button 
                      whileHover={{ scale: 1.01, y: -0.5 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setDiplomatDirective('harmonized')}
                      className={`p-2.5 rounded-lg border text-left transition relative cursor-pointer select-none ${
                        diplomatDirective === 'harmonized' 
                          ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 font-semibold shadow-xs' 
                          : 'bg-slate-950/85 border-slate-800 text-slate-400 hover:bg-slate-950/50 hover:border-slate-700 shadow-2xs'
                      }`}
                    >
                      <div className="font-bold text-slate-100">Standard</div>
                      <div className="text-[10px] opacity-70">Balanced Path</div>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.01, y: -0.5 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setDiplomatDirective('eco')}
                      className={`p-2.5 rounded-lg border text-left transition relative cursor-pointer select-none ${
                        diplomatDirective === 'eco' 
                          ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 font-semibold shadow-xs' 
                          : 'bg-slate-950/85 border-slate-800 text-slate-400 hover:bg-slate-950/50 hover:border-slate-700 shadow-2xs'
                      }`}
                    >
                      <div className="font-bold text-slate-100">Eco-Protection</div>
                      <div className="text-[10px] opacity-70">Stormwater Groves</div>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.01, y: -0.5 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setDiplomatDirective('indigenous')}
                      className={`p-2.5 rounded-lg border text-left transition relative cursor-pointer select-none ${
                        diplomatDirective === 'indigenous' 
                          ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 font-semibold shadow-xs' 
                          : 'bg-slate-950/85 border-slate-800 text-slate-400 hover:bg-slate-950/50 hover:border-slate-700 shadow-2xs'
                      }`}
                    >
                      <div className="font-bold text-slate-100">Adivasi Heritage</div>
                      <div className="text-[10px] opacity-70">Sacred 30m Buffer</div>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.01, y: -0.5 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setDiplomatDirective('rapid')}
                      className={`p-2.5 rounded-lg border text-left transition relative cursor-pointer select-none ${
                        diplomatDirective === 'rapid' 
                          ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 font-semibold shadow-xs' 
                          : 'bg-slate-950/85 border-slate-800 text-slate-400 hover:bg-slate-950/50 hover:border-slate-700 shadow-2xs'
                      }`}
                    >
                      <div className="font-bold text-slate-100">Rapid Resilience</div>
                      <div className="text-[10px] opacity-70 font-sans">Hostel Safety First</div>
                    </motion.button>
                  </div>
                </div>

                {/* 2. Council Tone Parameter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    2. Arbitration Tone Style
                  </label>
                  <select 
                    value={diplomatTone}
                    onChange={(e) => setDiplomatTone(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans cursor-pointer"
                  >
                    <option value="empathetic">Empathetic Consensus Facilitator (High Trust)</option>
                    <option value="sovereign">Sovereign Municipal Executive Decree (Fast Execution)</option>
                    <option value="panchayat">Traditional Panchayat Council format (Indigenous Assembly)</option>
                  </select>
                </div>

                {/* 3. Primary Focus Stakeholder */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    3. Target Focus Segment
                  </label>
                  <select 
                    value={diplomatFocus}
                    onChange={(e) => setDiplomatFocus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans cursor-pointer"
                  >
                    <option value="all">All Stakeholders (Comprehensive Unified Treaty)</option>
                    <option value="Girls Hostel Students">Girls Hostel Students (Exam curfew & privacy focus)</option>
                    <option value="Adivasi Households">Adivasi Households (Sacred trees & run-off filters)</option>
                    <option value="Local Residents">Local Residents (Solar shadow offsets & quiet curfews)</option>
                    <option value="Shopkeepers">Shopkeepers (Customer bays & dust misting cannons)</option>
                  </select>
                </div>

                {/* Generate Button */}
                <motion.button
                  whileHover={!isDiplomatGenerating ? { scale: 1.02 } : {}}
                  whileTap={!isDiplomatGenerating ? { scale: 0.98 } : {}}
                  onClick={startDiplomatGen}
                  disabled={isDiplomatGenerating}
                  className={`w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest relative overflow-hidden transition-all duration-300 transform cursor-pointer select-none ${
                    isDiplomatGenerating 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 border border-indigo-500'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className={`w-4 h-4 ${isDiplomatGenerating ? 'animate-spin' : 'animate-pulse'}`} />
                    {isDiplomatGenerating ? 'Compiling Consensus Treaty...' : 'Generate Community Consensus Plan'}
                  </span>
                </motion.button>
              </div>

              {/* Live console logging for deep immersion */}
              {isDiplomatGenerating && (
                <div className="bg-[#0b0811] p-4 rounded-xl border border-white/5 font-mono text-[10px] text-indigo-300 space-y-2 h-[180px] overflow-y-auto custom-scrollbar text-left">
                  <div className="flex items-center justify-between pb-1.5 border-b border-indigo-500/20 text-indigo-400 font-bold tracking-widest uppercase">
                    <span>AGENT SUBSYSTEM MONITOR</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="space-y-1.5">
                    {simulatedLogItems.map((log, lidx) => (
                      <div key={lidx} className="leading-relaxed opacity-90">
                        {log}
                      </div>
                    ))}
                    {diplomatGenStep !== 'complete' && (
                      <div className="flex items-center gap-1.5 text-slate-500 animate-pulse">
                        <span className="inline-block w-1.5 h-3 bg-indigo-450 animate-bounce" />
                        <span>Solving multidimensional civic conflicts...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Document Render Column */}
            <div className="lg:col-span-7 flex flex-col min-h-[460px]">
              {!showProposalDoc && !isDiplomatGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-8 bg-slate-950/20 text-center space-y-4">
                  <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-500">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 text-center">
                    <h4 className="text-sm font-semibold text-slate-200">No Mediation Proposal Active</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Configure your desired arbitration parameters on the left, then click "Generate Community Consensus Plan" to execute the AI Diplomat Agent.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col space-y-4">
                  
                  {/* Outer Frame modeling an official government paper parchment */}
                  <div className="relative border-4 border-double border-indigo-600/30 rounded-2xl overflow-hidden bg-[#faf8f5] text-slate-900 shadow-xl p-5 sm:p-7 select-text">
                    
                    {/* Watermark of public seal */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none select-none z-0">
                      <Shield className="w-80 h-80 text-indigo-950" />
                    </div>

                    <div className="relative z-10 space-y-4 font-serif text-left">
                      {/* Document Header block */}
                      <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start gap-4">
                        <div className="space-y-1 text-left">
                          <h4 className="font-sans font-black text-[13px] tracking-widest text-slate-900 uppercase">
                            Office of the Municipal Commissioner
                          </h4>
                          <p className="font-sans text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
                            Civic Resolution Bureau • Conflict Mediation Unit
                          </p>
                        </div>
                        <div className="font-sans text-right text-[9px] font-mono text-slate-500 uppercase leading-tight bg-slate-200/60 p-1.5 rounded border border-slate-300">
                          Ref: MED-GRID-2026<br/>
                          Date: 23-JUN-2026
                        </div>
                      </div>

                      {/* Content block with live progressive text typing container */}
                      <div className="text-[11px] leading-relaxed space-y-4 text-slate-800 break-words whitespace-pre-wrap font-mono h-[360px] overflow-y-auto custom-scrollbar pr-2 p-2 bg-slate-100/40 rounded border border-slate-200">
                        {customTreatyText ? customTreatyText.slice(0, proposalTypedChars) : getProposalDocumentText(diplomatDirective, diplomatTone, diplomatFocus, globalLang).slice(0, proposalTypedChars)}
                        {diplomatGenStep === 'typing' && (
                          <span className="inline-block w-2 h-4 bg-indigo-900 animate-pulse ml-0.5" />
                        )}
                      </div>

                      {/* Official Stamp badge overlay */}
                      {diplomatGenStep === 'complete' && (
                        <div className="flex items-center justify-between pt-3 border-t border-slate-300 font-sans">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                              <Check className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <div className="text-[10px] font-bold text-slate-800 uppercase leading-none">AI Arbitrator Approved</div>
                              <div className="text-[9px] text-slate-500 text-mono">Protocol Ref ID Certified</div>
                            </div>
                          </div>
                          
                          <div className="p-1 px-2.5 rounded border-2 border-red-500/40 text-red-650 text-[9px] font-black uppercase tracking-widest transform rotate-[-2deg] select-none">
                            OFFICIAL ACCORD
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Actions Drawer */}
                  {diplomatGenStep === 'complete' && (
                    <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl animate-in fade-in duration-300">
                      <div className="text-left flex-1 space-y-1">
                        <h4 className="text-xs font-semibold text-slate-250 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Consensus Treaty Ratification Plan ready
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Deploy AI proposal parameters. This will immediately resolve conflict friction margins and restore local stakeholder validation meters.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto flex-shrink-0">
                        {/* 1. APPLY COMPROMISE BUTTON */}
                        <button 
                          onClick={applyDiplomatComprises}
                          disabled={hasAppliedCompromise}
                          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            hasAppliedCompromise 
                              ? 'bg-emerald-600/25 border border-emerald-600/30 text-emerald-405 cursor-default' 
                              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95 shadow-md hover:shadow-emerald-500/20'
                          }`}
                        >
                          {hasAppliedCompromise ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Safeguards Active!
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-3.5 h-3.5" />
                              Apply Treaty Plan
                            </>
                          )}
                        </button>

                        {/* 2. COPY BUTTON */}
                        <button 
                          onClick={() => copyProposalToClipboard(customTreatyText || getProposalDocumentText(diplomatDirective, diplomatTone, diplomatFocus, globalLang))}
                          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 active:scale-95 transition text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          {globalLang === 'hi' ? 'कॉपी करें' : 'Copy TXT'}
                        </button>

                        {/* 3. DOWNLOAD BUTTON */}
                        <button 
                          onClick={() => downloadProposalDoc(`CIVIC_MEDIATION_ACCORD_${diplomatDirective.toUpperCase()}_${globalLang.toUpperCase()}.txt`, customTreatyText || getProposalDocumentText(diplomatDirective, diplomatTone, diplomatFocus, globalLang))}
                          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 active:scale-95 transition text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {globalLang === 'hi' ? 'डाउनलोड' : 'Download'}
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              )}
            </div>

          </motion.div>
        </section>

        {/* SECTION 4: COMMUNITY CONSENSUS ROADMAP & TIMELINE COMMENTS */}
        <section id="consensus" className="scroll-mt-24 space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
              <Route className="w-3.5 h-3.5" />
              Consensus Timeline
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              4. Community Consensus Roadmap & Feedback
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Once AI outlines the compromise parameters, action steps are loaded as a phased resolution timeline. Vote on phases or write community feedback below.
            </p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400/80 mt-2 italic mx-auto text-center">
              ✨ {globalLang === 'hi' ? "अपलोड किए गए साक्ष्यों और रिपोर्ट इतिहास से एआई द्वारा उत्पन्न।" : "AI-generated from uploaded evidence and report history."}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Phased Steps List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest font-mono">Phased Action Schedule</span>
                <span className="text-[10px] text-slate-500 font-mono">Live updates based on community votes</span>
              </div>

              {activeReport.consensusSteps.map((step) => {
                const isActive = step.status === 'active';
                const isDone = step.status === 'completed';

                return (
                  <div 
                    key={step.id} 
                    className={`glass-card rounded-xl border p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition duration-300 transform ${
                      isActive ? 'border-indigo-500/60 bg-indigo-500/5' : 'border-white/5'
                    }`}
                  >
                    <div className="flex gap-4 items-start text-left">
                      {/* Circle phase block */}
                      <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center font-display font-bold text-xs ${
                        isDone ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        isActive ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500' :
                        'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>
                        {step.phase}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-sm text-slate-200">{step.title}</h4>
                          {isDone && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] text-emerald-400 font-medium">Completed</span>
                          )}
                          {isActive && (
                            <span className="px-1.5 py-0.5 rounded bg-indigo-550/20 text-[9px] text-indigo-400 font-semibold animate-pulse">In Focus</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-sm">{step.description}</p>
                      </div>
                    </div>

                    {/* Voting Action trigger */}
                    <div className="flex-shrink-0 flex items-center gap-2.5">
                      <span className="text-xs font-semibold font-mono text-slate-300 bg-white/3 px-2 py-1 rounded border border-white/5">
                        🗳️ {step.votes} Ballots
                      </span>
                      <button
                        onClick={() => upvoteStep(step.id)}
                        className="p-1 px-2.5 rounded bg-indigo-650/40 hover:bg-slate-200 hover:text-slate-900 border border-indigo-500/30 text-indigo-400 text-[10px] font-semibold transition flex items-center gap-1.5"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        Upvote
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Forums Feedback and interactive comments boards */}
            <div className="lg:col-span-5 glass-card rounded-2xl border border-white/5 p-5 space-y-6">
              
              {/* Box Header title */}
              <div className="border-b border-white/5 pb-3">
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                  <MessageSquare className="w-4.5 h-4.5 text-indigo-400" />
                  Community Comments Room
                </h3>
                <p className="text-[10px] text-slate-400 leading-none mt-1">Live consensus discussions for active phases.</p>
              </div>

              {/* Feed Comments */}
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                {comments.filter(c => 
                  activeReport.consensusSteps.some(s => s.id === c.stepId)
                ).length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-8">No comments recorded on this specific case. Write your thoughts below!</p>
                ) : (
                  comments.filter(c => 
                    activeReport.consensusSteps.some(s => s.id === c.stepId)
                  ).map((comm) => (
                    <div key={comm.id} className="p-3 bg-slate-950/70 rounded-xl border border-white/5 text-xs text-left text-slate-400 relative">
                      
                      {/* Comment Meta Info */}
                      <div className="flex justify-between items-center mb-1">
                        <div>
                          <strong className="text-slate-200 block">{comm.author}</strong>
                          <span className="text-[9px] block text-indigo-400 leading-none">{comm.role}</span>
                        </div>
                        <span className="text-[9px] text-slate-500">{comm.timestamp}</span>
                      </div>

                      {/* Content text */}
                      <p className="text-slate-300 leading-relaxed pb-2">{comm.content}</p>

                      {/* Targeted Phase marker */}
                      <div className="flex justify-between items-center pt-1.5 border-t border-white/5 text-[9px] text-slate-500">
                        <span>Target Step ID:</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/10 text-[9px]">
                          {activeReport.consensusSteps.find(s => s.id === comm.stepId)?.phase || 'General'}
                        </span>
                      </div>

                    </div>
                  ))
                )}
              </div>

              {/* New comment creation form */}
              <form onSubmit={handlePostComment} className="space-y-3.5 pt-3 border-t border-white/5 text-left">
                <span className="text-xs font-semibold text-slate-300 block">Post Local Citizens Feedback</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 block font-semibold uppercase">Your Name</label>
                    <input 
                      type="text" 
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded py-1.5 px-2 text-xs text-slate-200" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 block font-semibold uppercase">Your Constituency Role</label>
                    <input 
                      type="text" 
                      value={commentRole}
                      onChange={(e) => setCommentRole(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded py-1.5 px-2 text-xs text-slate-200" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block font-semibold uppercase">Target Phase Step</label>
                  <select
                    value={commentStepId}
                    onChange={(e) => setCommentStepId(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded py-1.5 px-2 text-xs text-slate-200"
                  >
                    {activeReport.consensusSteps.map(step => (
                      <option key={step.id} value={step.id}>Phase {step.phase} - {step.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <textarea 
                    rows={2}
                    required
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Provide neutral compromises or detail safety/noise worries..."
                    className="w-full bg-slate-950 border border-white/10 rounded py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Register Citizen Voice
                  </button>
                </div>

              </form>

            </div>
          </div>
        </section>

        {/* SECTION 5: LIVE ANALYTICS DASHBOARD */}
        <section id="analytics" className="scroll-mt-24">
          <AnalyticsDashboard 
            reports={reports} 
            comments={comments} 
            activeReport={activeReport} 
            dynamicConsensusScore={dynamicConsensusScore} 
            globalLang={globalLang} 
          />
        </section>

        {/* SECTION 6: IMPACT & SCALABILITY */}
        <ImpactScalability globalLang={globalLang} />

      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-slate-950 border-t border-white/5 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8 text-left mb-8">
          
          {/* Logo Brand area */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span className="font-display font-bold text-white text-sm">CivicSentinel</span>
            </div>
            <p className="leading-relaxed">
              Synthesizing municipal trust and engineering community alignment via technology.
            </p>
            <p className="text-[11px] font-mono text-slate-600">
              © 2026 CivicSentinel Inc. All rights protected.
            </p>
          </div>

          {/* Links 1 */}
          <div className="space-y-2">
            <h5 className="font-semibold text-slate-200">Municipal Services</h5>
            <div className="space-y-1.5 flex flex-col">
              <a href="#reporting" className="hover:text-slate-300 transition">Reporting Desk</a>
              <a href="#ai-analysis" className="hover:text-slate-300 transition">Translation Systems</a>
              <a href="#stakeholders" className="hover:text-slate-300 transition">Audit Matrices</a>
              <a href="#stakeholder-mapping-engine" className="hover:text-slate-300 transition">Mapping Engine</a>
              <a href="#ai-diplomat-agent" className="hover:text-slate-300 transition">AI Diplomat Agent</a>
              <a href="#consensus" className="hover:text-slate-300 transition">Consensus Voting</a>
            </div>
          </div>

          {/* Links 2 */}
          <div className="space-y-2">
            <h5 className="font-semibold text-slate-200">General Public Legal</h5>
            <div className="space-y-1.5 flex flex-col">
              <a href="#" className="hover:text-slate-300 transition">Conflict Settlement FAQ</a>
              <a href="#" className="hover:text-slate-300 transition">Federal EMF Siting Codes</a>
              <a href="#" className="hover:text-slate-300 transition">Decibel Limit Compliance</a>
              <a href="#" className="hover:text-slate-300 transition">Terms of Civic Service</a>
            </div>
          </div>

          {/* Newsletter Input */}
          <div className="space-y-3">
            <h5 className="font-semibold text-slate-200">Weekly Trust Newsletter</h5>
            <p className="leading-relaxed">Receive municipal resolutions filed in your neighboring ZIP codes.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              triggerBanner("Subscription received! Newsletter reports loaded.");
              (e.target as HTMLFormElement).reset();
            }} className="flex gap-2">
              <input 
                type="email" 
                required
                placeholder="Enter email..."
                className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button 
                type="submit"
                className="px-3.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
              >
                Join
              </button>
            </form>
          </div>

        </div>
        
        {/* Footnotes */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          <span>Designed with high-density premium glassmorphism for advanced civic startup operations.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition">System Status</a>
            <a href="#" className="hover:text-slate-300 transition">Developer APIs</a>
            <a href="#" className="hover:text-slate-300 transition">GitHub Sandbox</a>
          </div>
        </div>
      </footer>

      {/* Real Gemini API Settings Glass Modal */}
      {apiSettingsOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden text-slate-100 font-sans">
            
            {/* Top decorative accent light strip path */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Key className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-slate-200">
                    {globalLang === 'hi' ? 'जेमिनी एआई पोर्टल विन्यास' : 'Gemini AI Portal Config'}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {globalLang === 'hi' ? 'स्थानीय क्रोमियम सुरक्षित प्रॉक्सी इंजन' : 'Secure client-relay micro-mesh proxy configuration'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setApiSettingsOpen(false)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 hover:text-white transition text-slate-400 text-xs cursor-pointer select-none"
              >
                ✕
              </button>
            </div>

            {/* Config Status Section */}
            <div className="space-y-4">
              
              {/* Toggle switch for global integration */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-white/5 flex items-center justify-between gap-4">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-200">
                    {globalLang === 'hi' ? 'जेमिनी एआई सक्रिय' : 'Activate Gemini Core'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {globalLang === 'hi' 
                      ? 'यदि निष्क्रिय है, तो स्वचालित रूप से डेमो मोड पर वापस जाएं।' 
                      : 'Fallback directly to sandbox simulation when inactive.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsGeminiActive(!isGeminiActive);
                    triggerBanner(
                      !isGeminiActive 
                        ? (globalLang === 'hi' ? "जेमिनी सक्रिय, कृपया वैध एपीआई कुंजी प्रदान करें।" : "Gemini active. Provide a valid key.")
                        : (globalLang === 'hi' ? "डेमो मोड सिमुलेशन पर वापस आ गए।" : "Switched back to Demo Mode simulation.")
                    );
                  }}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                    isGeminiActive ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                    isGeminiActive ? 'translate-x-[20px]' : 'translate-x-[2px]'
                  }`} />
                </button>
              </div>

              {/* Secure API Key input form */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[11px] font-semibold text-slate-300">
                  {globalLang === 'hi' ? 'गूगल जेमिनी एपीआई कुंजी' : 'Google Gemini API Key'}
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showKeyPassword ? "text" : "password"}
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 pr-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyPassword(!showKeyPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200 transition text-[10px] font-bold cursor-pointer"
                  >
                    {showKeyPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {globalLang === 'hi'
                    ? "कुंजी स्थानीय स्टोरेज में सुरक्षित रूप से सहेजी जाती है और सर्वर लॉग में सहेजी नहीं जाती है।"
                    : "Stored securely strictly inside your browser's private local cache. Relayed over encrypted local proxy."}
                </p>
              </div>

              {/* Status Alert Badge */}
              <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-left ${
                isGeminiActive && geminiApiKey 
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                  : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
              }`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 ${isGeminiActive && geminiApiKey ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
                <div className="space-y-0.5 text-xs leading-normal">
                  <div className="font-semibold">
                    {isGeminiActive && geminiApiKey 
                      ? (globalLang === 'hi' ? 'जेमिनी प्रॉक्सी चालू' : 'Gemini Active Proxy') 
                      : (globalLang === 'hi' ? 'डेमो मोड सक्रिय' : 'Local Demo Sandbox Active')}
                  </div>
                  <div className="text-[10px] opacity-80 font-mono leading-relaxed">
                    {isGeminiActive && geminiApiKey 
                      ? (globalLang === 'hi' 
                        ? 'जेमिनी 1.5 फ़्लैश वास्तविक समय में चित्रों, जोखिम स्तरों और अनुवादों का विश्लेषण करेगा।'
                        : 'Using live gemini-2.5-flash vision for high-fidelity validation reports, Hindi conversions, and treaties.')
                      : (globalLang === 'hi'
                        ? 'ऑफ़लाइन जनरेशन सक्रिय। किसी सक्रिय कुंजी की आवश्यकता नहीं है।'
                        : 'Generating offline simulation templates. Active key not required.')}
                  </div>
                </div>
              </div>

              {/* Action Operations */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (!geminiApiKey.trim()) {
                      triggerBanner(globalLang === 'hi' ? "कृपया परीक्षण करने से पहले एक कुंजी दर्ज करें।" : "Please enter a key before testing.");
                      return;
                    }
                    setIsTestingKey(true);
                    triggerBanner(globalLang === 'hi' ? "एपीआई कुंजी का सत्यापन किया जा रहा है..." : "Validating developer credentials...");
                    try {
                      const res = await fetch("/api/gemini/validate-key", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ key: geminiApiKey })
                      });
                      const data = await res.json();
                      if (res.ok && data.valid) {
                        setIsTestingKey(false);
                        setIsGeminiActive(true);
                        localStorage.setItem("CIVIC_GEMINI_KEY", geminiApiKey);
                        triggerBanner(globalLang === 'hi' ? "कनेक्शन सफल! एपीआई कुंजी सहेजी गई।" : "Validation complete! Gemini active key saved.");
                      } else {
                        throw new Error(data.error || "Validation failed");
                      }
                    } catch (err: any) {
                      setIsTestingKey(false);
                      triggerBanner(`API Test Fail: ${err.message || "Credential invalid"}. Fallback to Sandbox.`);
                    }
                  }}
                  disabled={isTestingKey}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-xs font-semibold select-none cursor-pointer text-white flex items-center justify-center gap-1.5 transition active:scale-95 shadow shadow-indigo-900"
                >
                  {isTestingKey && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {globalLang === 'hi' ? 'सहेजें और परीक्षण करें' : 'Save & Validate Connection'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGeminiApiKey("");
                    setIsGeminiActive(false);
                    localStorage.removeItem("CIVIC_GEMINI_KEY");
                    triggerBanner(globalLang === 'hi' ? "एपीआई कुंजी हटा दी गई।" : "Cached API credentials removed.");
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold cursor-pointer active:scale-95 transition text-xs text-slate-300 border border-white/5"
                >
                  {globalLang === 'hi' ? 'हटाएं' : 'Clear Key'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* GUIDED PRESENTATION DEMO FLOATING CONTROL HUD */}
      {demoState.isActive && (
        <motion.div
          id="demo-guided-hud"
          drag
          dragMomentum={false}
          dragElastic={0.1}
          whileDrag={{ scale: 1.01, cursor: 'grabbing' }}
          className="fixed bottom-6 right-6 z-[9999] w-[92vw] max-w-sm sm:max-w-md bg-slate-950/95 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 shadow-2xl shadow-indigo-500/20 text-slate-100 font-sans select-none cursor-grab"
        >
          
          {/* Decorative Laser Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-indigo-500 to-emerald-500 rounded-t-2xl overflow-hidden">
            <div 
              className="h-full bg-white opacity-40 transition-all duration-300"
              style={{ width: `${demoStepProgress}%` }}
            />
          </div>

          <div className="flex flex-col gap-3">
            
            {/* HUD Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <div className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                  Presentation Engine
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                  2 Min Pitch
                </div>
                <button 
                  onClick={handleStopDemo} 
                  className="text-slate-400 hover:text-white hover:bg-white/5 p-1 rounded-lg transition select-none cursor-pointer"
                  title="Deactivate Presentation Mode"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {DEMO_STEPS.map((step, idx) => {
                const isActive = idx === demoState.currentStepIndex;
                const isCompleted = idx < demoState.currentStepIndex;
                return (
                  <button
                    key={step.number}
                    onClick={() => setDemoToStep(idx)}
                    className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg border transition-all relative select-none cursor-pointer ${
                      isActive 
                        ? 'bg-indigo-600/30 border-indigo-400 text-indigo-300 shadow-lg shadow-indigo-500/10 font-bold' 
                        : isCompleted
                          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                          : 'bg-slate-900/50 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
                    }`}
                    title={step.title}
                  >
                    <span className="text-[8px] font-mono tracking-tighter block uppercase">
                      S{step.number}
                    </span>
                    <div className="text-[11px] font-bold mt-0.5">
                      {isCompleted ? <Check className="w-3 h-3 mx-auto text-emerald-400" /> : step.number}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step Body */}
            {(() => {
              const currentStep = DEMO_STEPS[demoState.currentStepIndex];
              return (
                <div className="space-y-3 bg-slate-900/40 rounded-xl p-3 border border-white/5 text-left">
                  <div className="text-left space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-200 tracking-tight">
                          {currentStep.title}
                        </h4>
                        <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 font-medium">
                          {currentStep.subtitle}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                      {currentStep.description}
                    </p>
                    <div className="flex gap-1.5 bg-slate-950/60 rounded-lg p-2 text-[10px] sm:text-[11px] text-slate-350 border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-emerald-400 to-indigo-500" />
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-400">Pitch Hint:</strong> {currentStep.hint}
                      </div>
                    </div>
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5">
                    {/* Progress Bar (Compact inline) */}
                    <div className="flex-1 space-y-1 pr-2">
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>PITCH PROGRESS</span>
                        <span>{Math.round(demoStepProgress)}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 via-indigo-500 to-emerald-500 transition-all duration-300"
                          style={{ width: `${demoStepProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Left/Play/Right Controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const prevIdx = Math.max(0, demoState.currentStepIndex - 1);
                          setDemoToStep(prevIdx);
                        }}
                        disabled={demoState.currentStepIndex === 0}
                        className="p-1.5 bg-slate-900 border border-white/5 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 text-slate-300 rounded-lg transition active:scale-95 cursor-pointer"
                        title="Previous Step"
                      >
                        <ChevronUp className="w-3.5 h-3.5 -rotate-90" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDemoState(prev => ({
                            ...prev,
                            isPlaying: !prev.isPlaying
                          }));
                          triggerBanner(demoState.isPlaying ? "Demo Simulation Paused." : "Demo Simulation Resumed.");
                        }}
                        className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer ${
                          demoState.isPlaying 
                            ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                        }`}
                      >
                        {demoState.isPlaying ? (
                          <>
                            <div className="flex gap-0.5">
                              <span className="w-0.5 h-2.5 bg-current block rounded-xs" />
                              <span className="w-0.5 h-2.5 bg-current block rounded-xs" />
                            </div>
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <div className="w-0 h-0 border-t-3 border-t-transparent border-b-3 border-b-transparent border-l-5 border-l-white" />
                            <span>Play</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const nextIdx = Math.min(DEMO_STEPS.length - 1, demoState.currentStepIndex + 1);
                          setDemoToStep(nextIdx);
                        }}
                        disabled={demoState.currentStepIndex === DEMO_STEPS.length - 1}
                        className="p-1.5 bg-slate-900 border border-white/5 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 text-slate-300 rounded-lg transition active:scale-95 cursor-pointer"
                        title="Skip To Next Step"
                      >
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        </motion.div>
      )}

    </div>
  );
}
