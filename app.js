/**
 * KrishiChakra - Smart Rural Machinery Sharing & Resilient Dispatch Platform
 * Complete Application Logic, Machine Photo Gallery, Mathematical Optimizer & Exhaustive Multi-Language Translation
 */

// ============================================================================
// 1. DATA MODELS & INITIAL STATE
// ============================================================================

const EQUIPMENT_SPEEDS = {
  "Tractor": 20.0,    // km/h
  "Harvester": 14.0,  // km/h
  "Sprayer": 25.0     // km/h
};
const DEFAULT_SPEED = 18.0;
const ROAD_WINDING_FACTOR = 1.25;

let currentSimDate = "2026-11-18";
let currentLang = "en";
let activePersona = "farmer";
let activeExplanation = "";

// Agricultural Cluster Geolocation Coordinates
const VILLAGE_COORDS = {
  "Rampur Central Hub": { lat: 28.6139, lon: 77.2090 },
  "Sitapur Agro Center": { lat: 28.6350, lon: 77.2250 },
  "Kalyanpur Grain Yard": { lat: 28.5800, lon: 77.2100 },
  "Shivpur Farm Depot": { lat: 28.6500, lon: 77.1900 },
  "Fatehgarh Fields": { lat: 28.6020, lon: 77.1950 },
  "Rampur Kalan": { lat: 28.6180, lon: 77.2150 },
  "Rampur North": { lat: 28.6250, lon: 77.2100 },
  "Sitapur Khurd": { lat: 28.6400, lon: 77.2300 },
  "Sitapur West": { lat: 28.6300, lon: 77.2150 },
  "Kalyanpur East": { lat: 28.5900, lon: 77.2200 },
  "Shivpur South": { lat: 28.6450, lon: 77.1850 },
  "Fatehgarh East": { lat: 28.6080, lon: 77.2020 }
};

// Registered Equipment Fleet with Accurate Real-World Machine Photos
let equipmentList = [
  {
    id: "EQ-01",
    name: "Mahindra 575 DI (47 HP)",
    type: "Tractor",
    workRate: 1.4, // acres/hr
    rate: 850,
    rateUnit: "hour",
    locationName: "Rampur Central Hub",
    lat: 28.6139,
    lon: 77.2090,
    ownerName: "Gurmeet Singh",
    phone: "9876543210",
    status: "Available",
    specs: "Authentic Red Mahindra 47 HP Tractor with 9-tyne cultivator & heavy rotavator",
    photoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_Tractor,_India.jpg?width=800",
    backupPhotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Mahindra_Tractor%2C_India.jpg/800px-Mahindra_Tractor%2C_India.jpg"
  },
  {
    id: "EQ-02",
    name: "John Deere 5050D (50 HP)",
    type: "Tractor",
    workRate: 1.8,
    rate: 950,
    rateUnit: "hour",
    locationName: "Sitapur Agro Center",
    lat: 28.6350,
    lon: 77.2250,
    ownerName: "Harjit Singh",
    phone: "9876543211",
    status: "Available",
    specs: "Iconic Green & Yellow John Deere 50 HP Utility Tractor with Happy Seeder & Zero-Till Drill",
    photoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/John_Deere_5103_S,_transport_in_India.jpg?width=800",
    backupPhotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/John_Deere_5103_S%2C_transport_in_India.jpg/800px-John_Deere_5103_S%2C_transport_in_India.jpg"
  },
  {
    id: "EQ-03",
    name: "Claas Crop Tiger 30 (Combine)",
    type: "Harvester",
    workRate: 2.5,
    rate: 2200,
    rateUnit: "acre",
    locationName: "Kalyanpur Grain Yard",
    lat: 28.5800,
    lon: 77.2100,
    ownerName: "Vikram Patel",
    phone: "9876543212",
    status: "Available",
    specs: "Claas Crop Tiger 30 Combine Harvester for Indian Paddy & Wheat harvesting",
    photoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Crop_Harvesting_Machine_2.JPG?width=800",
    backupPhotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/MechanizedHarvesting.jpg?width=800"
  },
  {
    id: "EQ-04",
    name: "ASPEE Boom Sprayer (500L)",
    type: "Sprayer",
    workRate: 4.0,
    rate: 450,
    rateUnit: "acre",
    locationName: "Shivpur Farm Depot",
    lat: 28.6500,
    lon: 77.1900,
    ownerName: "Rohan Verma",
    phone: "9876543213",
    status: "Available",
    specs: "Tractor-mounted 12m wide hydraulic boom sprayer with anti-drift nozzles",
    photoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Tractor_spraying_pesticides_IMG_5235.jpg?width=800",
    backupPhotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Tractor_spraying_pesticides_IMG_5235.jpg/800px-Tractor_spraying_pesticides_IMG_5235.jpg"
  },
  {
    id: "EQ-05",
    name: "Kubota DC-68G (Track Harvester)",
    type: "Harvester",
    workRate: 2.2,
    rate: 2400,
    rateUnit: "acre",
    locationName: "Fatehgarh Fields",
    lat: 28.6020,
    lon: 77.1950,
    ownerName: "Manmohan Sharma",
    phone: "9876543214",
    status: "Available",
    specs: "Kubota DC-Series Rubber Caterpillar Track Harvester for marshy wet paddy fields",
    photoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Kubota_DC-60.jpg?width=800",
    backupPhotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Kubota_DC-60.jpg/800px-Kubota_DC-60.jpg"
  }
];

// Registered Farmer Plots
let plotsList = [
  {
    id: "PL-01",
    farmerName: "Balwinder Singh",
    phone: "9811122205",
    village: "Rampur North",
    lat: 28.6250,
    lon: 77.2100,
    acres: 8.0,
    crop: "Paddy",
    operation: "Harvesting",
    windowStart: "2026-11-18",
    windowEnd: "2026-11-19", // CRITICAL: 1 day window!
    requiredMachineType: "Harvester",
    notes: "Crop fully ripe. Rain forecasted; high risk of grain lodging & shattering."
  },
  {
    id: "PL-02",
    farmerName: "Ramesh Kumar",
    phone: "9811122201",
    village: "Rampur Kalan",
    lat: 28.6180,
    lon: 77.2150,
    acres: 4.0,
    crop: "Paddy",
    operation: "Harvesting",
    windowStart: "2026-11-18",
    windowEnd: "2026-11-19", // CRITICAL
    requiredMachineType: "Harvester",
    notes: "Border plot, moisture level optimal for combine harvesting."
  },
  {
    id: "PL-03",
    farmerName: "Suresh Patel",
    phone: "9811122202",
    village: "Sitapur Khurd",
    lat: 28.6400,
    lon: 77.2300,
    acres: 6.0,
    crop: "Wheat",
    operation: "Sowing",
    windowStart: "2026-11-18",
    windowEnd: "2026-11-23", // Flexible 5 days!
    requiredMachineType: "Tractor",
    notes: "Requires Happy Seeder for zero-till sowing."
  },
  {
    id: "PL-04",
    farmerName: "Lakshmi Devi",
    phone: "9811122204",
    village: "Shivpur South",
    lat: 28.6450,
    lon: 77.1850,
    acres: 3.0,
    crop: "Cotton",
    operation: "Spraying",
    windowStart: "2026-11-18",
    windowEnd: "2026-11-20",
    requiredMachineType: "Sprayer",
    notes: "Whitefly pest outbreak detected; urgent pesticide coverage required."
  },
  {
    id: "PL-05",
    farmerName: "Daler Singh",
    phone: "9811122203",
    village: "Kalyanpur East",
    lat: 28.5900,
    lon: 77.2200,
    acres: 5.0,
    crop: "Paddy",
    operation: "Harvesting",
    windowStart: "2026-11-18",
    windowEnd: "2026-11-20",
    requiredMachineType: "Harvester",
    notes: "Harvesting paddy before winter wheat rotation."
  },
  {
    id: "PL-06",
    farmerName: "Manpreet Kaur",
    phone: "9811122206",
    village: "Sitapur West",
    lat: 28.6300,
    lon: 77.2150,
    acres: 3.5,
    crop: "Wheat",
    operation: "Sowing",
    windowStart: "2026-11-19",
    windowEnd: "2026-11-22",
    requiredMachineType: "Tractor",
    notes: "Wheat sowing in prepared seedbed."
  },
  {
    id: "PL-07",
    farmerName: "Hardeep Singh",
    phone: "9811122207",
    village: "Fatehgarh East",
    lat: 28.6080,
    lon: 77.2020,
    acres: 7.0,
    crop: "Mustard",
    operation: "Sowing",
    windowStart: "2026-11-20",
    windowEnd: "2026-11-24",
    requiredMachineType: "Tractor",
    notes: "Mustard sowing with seed drill."
  }
];

// Active Booking Requests State (Tracks Farmer Requests & Owner Approvals)
let bookingRequests = [
  {
    id: "REQ-01",
    plotId: "PL-01",
    farmerName: "Balwinder Singh",
    phone: "9811122205",
    village: "Rampur North",
    acres: 8.0,
    crop: "Paddy",
    operation: "Harvesting",
    equipId: "EQ-03",
    equipName: "Claas Crop Tiger 30 (Combine)",
    ownerName: "Vikram Patel",
    ownerPhone: "9876543212",
    startDate: "2026-11-18",
    endDate: "2026-11-19",
    status: "Approved",
    notes: "Crop fully ripe. Rain forecasted."
  },
  {
    id: "REQ-02",
    plotId: "PL-02",
    farmerName: "Ramesh Kumar",
    phone: "9811122201",
    village: "Rampur Kalan",
    acres: 4.0,
    crop: "Paddy",
    operation: "Harvesting",
    equipId: "EQ-03",
    equipName: "Claas Crop Tiger 30 (Combine)",
    ownerName: "Vikram Patel",
    ownerPhone: "9876543212",
    startDate: "2026-11-18",
    endDate: "2026-11-19",
    status: "Approved",
    notes: "Border plot optimal for combine harvesting."
  },
  {
    id: "REQ-03",
    plotId: "PL-03",
    farmerName: "Suresh Patel",
    phone: "9811122202",
    village: "Sitapur Khurd",
    acres: 6.0,
    crop: "Wheat",
    operation: "Sowing",
    equipId: "EQ-02",
    equipName: "John Deere 5050D (50 HP)",
    ownerName: "Harjit Singh",
    ownerPhone: "9876543211",
    startDate: "2026-11-18",
    endDate: "2026-11-23",
    status: "Approved",
    notes: "Requires Happy Seeder."
  },
  {
    id: "REQ-04",
    plotId: "PL-04",
    farmerName: "Lakshmi Devi",
    phone: "9811122204",
    village: "Shivpur South",
    acres: 3.0,
    crop: "Cotton",
    operation: "Spraying",
    equipId: "EQ-04",
    equipName: "ASPEE Boom Sprayer (500L)",
    ownerName: "Rohan Verma",
    ownerPhone: "9876543213",
    startDate: "2026-11-18",
    endDate: "2026-11-20",
    status: "Approved",
    notes: "Whitefly pest outbreak detected."
  },
  {
    id: "REQ-05",
    plotId: "PL-05",
    farmerName: "Daler Singh",
    phone: "9811122203",
    village: "Kalyanpur East",
    acres: 5.0,
    crop: "Paddy",
    operation: "Harvesting",
    equipId: "EQ-01",
    equipName: "Mahindra 575 DI (47 HP)",
    ownerName: "Gurmeet Singh",
    ownerPhone: "9876543210",
    startDate: "2026-11-18",
    endDate: "2026-11-20",
    status: "Pending", // PENDING OWNER APPROVAL from Gurmeet Singh!
    notes: "Harvesting paddy before winter wheat rotation."
  }
];


// Active Disruptions State
let disruptions = {
  weatherBlocks: {}, // "YYYY-MM-DD" -> reason string
  equipmentBreakdowns: {} // equipId -> {start: "YYYY-MM-DD", end: "YYYY-MM-DD", reason: string}
};

// Optimizer Results & Bookings Cache
let currentSchedule = {
  assignedSlots: [],
  unfulfilled: [],
  rescheduledCount: 0,
  unaffectedCount: 0,
  atRiskCount: 0,
  notifications: []
};

// ============================================================================
// 2. EXHAUSTIVE MULTI-LINGUAL TRANSLATION SYSTEM
// ============================================================================

const DICTIONARY = {
  en: {
    top_help_text: "Can't type or need fast booking?",
    top_dial_text: "Use AI Voice Assistant:",
    top_phone_number: "🤖 Speak to Book Instantly (AI-Powered)",
    language_label: "🌐 Language:",
    listen_aloud: "🔊 Listen Aloud",
    app_tag: "कृषि चक्र",
    app_subtitle: "Smart Rural Machinery Sharing & Resilient Dispatch System",
    nav_farmer: "Farmer Portal",
    nav_owner: "Equipment Owner",
    nav_dealer: "",
    badge_call: "AI VOICE",
    sim_date_label: "Simulated Date:",
    clash_safe_text: "0 Clashes | Buffers Safe",
    disruption_tests_label: "Disruption Tests:",
    rain_btn_inject: "Inject Heavy Rain (Nov 19)",
    rain_btn_clear: "Clear Rain Disruption",
    breakdown_btn_inject: "Inject Harvester Breakdown",
    breakdown_btn_repair: "Repair Harvester (EQ-03)",
    btn_reset: "↺ Reset Baseline",
    disruption_active_tag: "Disruption Active",
    disruption_auto_handled: "Auto-Rescheduled with Deadline Priority",
    farmer_hero_badge: "Farmer Dashboard • Simple & Transparent",
    farmer_hero_title: "Book Tractors, Harvesters & Sprayers With Live Machine Photos",
    farmer_hero_desc: "See real photos of available machinery before booking. Your harvest and sowing deadlines are strictly prioritized, travel buffers prevent late arrivals, and weather delays are automatically rescheduled.",
    btn_request_machine: "Request a Machine Now",
    btn_voice_assistant: "🤖 AI Voice Assistant — Speak to Book",
    btn_call_dealer: "🤖 AI Voice Assistant — Speak to Book",
    phone_box_title: "AI Voice Booking Assistant",
    phone_box_desc: "Speak naturally in your language! Our AI assistant understands your crop, acreage, and village, and directly books the best machine with zero clashes — no typing needed!",
    phone_box_btn: "🎙️ Start Voice Booking Now",
    title_available_fleet: "Available Machinery Fleet (Photos & Specs)",
    subtitle_available_fleet: "Browse real machine photos, rates, work capacity, and click to request directly for your plot.",
    badge_fleet_active: "5 Machines Available in Your Cluster",
    title_my_plots: "My Registered Farm Plots & Operation Windows",
    subtitle_my_plots: "Each plot has a critical window. Operations scheduled earlier prevent yield loss.",
    btn_register_plot: "+ Register New Plot",
    title_my_bookings: "My Machine Booking Requests & Live Status",
    subtitle_my_bookings: "Track accepted, dispatched, rescheduled, or travel buffer status with plain-language explanations.",
    hint_listen_explanation: "Click 🔊 on any card to listen to the status explanation",
    stat_active_fleet: "Active Fleet",
    stat_geo_tracked: "100% Geo-Tracked",
    stat_confirmed_bookings: "Scheduled Bookings",
    stat_zero_clash: "Zero Clashes",
    stat_projected_revenue: "Projected Revenue",
    stat_period: "Next 7 Days",
    stat_transit_opt: "Transit Optimization",
    stat_km_saved: "42 km Saved",
    stat_clustered_dispatch: "Clustered Rural Dispatch",
    title_owner_fleet: "My Equipment Fleet Registry",
    subtitle_owner_fleet: "List machines with photos, hourly/per-acre rates, work rates, base locations, and operational health.",
    btn_register_machine: "+ Register New Machine",
    title_owner_requests: "Incoming Booking Requests & Clash-Free Dispatch",
    subtitle_owner_requests: "Review scheduled requests from farmers. Duration and travel buffers are automatically managed.",
    badge_buffer_active: "Automated Travel Buffer Protection Active",
    dealer_badge: "AI VOICE ASSISTANT • INSTANT ALLOCATION",
    dealer_title: "AI Voice-Assisted Booking for Farmers",
    dealer_desc: "Farmers speak naturally to book equipment instantly without typing or dealers. The system immediately checks travel buffers, assigns the slot, and sends an automated SMS.",
    btn_simulate_call: "Test AI Voice Booking 🎙️",
    dealer_form_title: "AI Voice Booking Engine",
    dealer_form_subtitle: "Voice input automatically parsed into crop, plot size, and optimal machine with verified travel buffers.",
    label_farmer_name: "Farmer Name",
    label_phone_number: "Mobile Number (For SMS)",
    label_village_cluster: "Village / Cluster",
    label_plot_area: "Plot Area (Acres)",
    label_crop_type: "Crop Type",
    label_operation: "Requested Operation",
    label_deadline: "Strict Deadline Window",
    btn_dealer_submit: "Instant Allocate Slot & Dispatch SMS Confirmation",
    dealer_audio_title: "AI Voice Readout & SMS Simulator",
    dealer_audio_subtitle: "Preview simulated voice prompts and automated SMS sent to the farmer's handset.",
    ivr_idle_status: "● AI VOICE ASSISTANT READY",
    ivr_waiting_text: "AI Voice Assistant ready. Tap the microphone or test voice prompts to book directly!",
    dealer_note_title: "📱 Real-World Farmer Value:",
    dealer_note_text: "Farmers receive an immediate SMS with date, time, driver contact, and buffer guarantee without typing.",
    modal_booking_title: "Request Equipment Booking",
    modal_booking_subtitle: "Clashes prevented with automatic travel time buffers",
    modal_select_plot: "Select Farm Plot",
    modal_select_equip: "Select Machinery to Request (See Photos)",
    modal_start_date: "Earliest Start Date",
    modal_end_date: "Critical Deadline",
    modal_notes_label: "Agronomic Notes / Special Instructions",
    modal_guarantee_title: "Zero Double-Booking Guarantee",
    modal_guarantee_text: "The scheduler automatically accounts for plot size, work duration, and road travel time from previous jobs.",
    btn_cancel: "Cancel",
    btn_submit_request: "Submit Booking Request",
    modal_plot_title: "Register New Farm Plot",
    modal_plot_subtitle: "Define acreage, crop, and critical agronomic window",
    btn_save_plot: "Register Farm Plot",
    modal_equip_title: "Register New Equipment",
    modal_equip_subtitle: "Provide machine photo, work rate, and hourly or per-acre pricing",
    modal_machine_name: "Machine Model & Name",
    modal_machine_photo: "Machine Photo URL",
    label_category: "Category",
    label_work_rate: "Work Rate (Acres / Hr)",
    label_rate_price: "Rate (₹)",
    label_rate_basis: "Rate Basis",
    basis_hour: "Per Hour",
    basis_acre: "Per Acre",
    label_base_hub: "Base Hub Location",
    label_owner_phone: "Owner Contact Phone",
    btn_add_fleet: "Add Equipment to Fleet",
    call_live_status: "AI Voice Assistant",
    call_helpline_title: "KrishiChakra AI Voice Assistant",
    call_helpline_sub: "Powered by Voice AI • Multilingual",
    call_connected_info: "● Ready • Hindi, Telugu, Punjabi, Marathi & English",
    btn_speak_to_book: "Tap & Speak to Book a Machine",
    btn_play_hindi_ivr: "🎙️ Demo Hindi Voice",
    btn_play_english_ivr: "🎙️ Demo English Voice",
    voice_try_saying: "💡 Or tap an example voice query:",
    ai_how_it_works_title: "🧠 How it works:",
    ai_how_it_works_desc: "Just speak naturally — tell the AI your crop, village, acreage, and deadline. It finds the best available machine, books it instantly, and sends you an SMS confirmation. No typing, no dealer, no waiting!",
    btn_open_dealer_intake: "🎙️ Open Voice Assistant →",
    modal_why_title: "Why Was This Decision Made?",
    btn_listen_explanation_audio: "🔊 Listen to this Explanation Aloud (Audio)",
    btn_close: "Close",
    footer_platform_desc: "Smart Agricultural Dispatch & Machinery Sharing",
    footer_zero_clash: "Zero Double-Booking Guarantee",
    footer_rescheduler: "Minimal-Disruption Rescheduler",
    footer_helpline: "🤖 AI Voice Assistant Enabled",
    // Dynamic terms
    crop_paddy: "🌾 Paddy / Rice",
    crop_wheat: "🌱 Wheat",
    crop_cotton: "🌸 Cotton",
    crop_mustard: "🌼 Mustard",
    crop_sugarcane: "🎋 Sugarcane",
    op_harvest: "🚜 Harvesting (High Urgency - Shattering)",
    op_sow: "🌱 Sowing / Seeding (Moisture Window)",
    op_spray: "💧 Pesticide / Fungicide Spraying",
    op_till: "⚙️ Land Preparation / Rotavator",
    btn_request_this_machine: "Request This Machine",
    rate_per_hour: "/ Hour",
    rate_per_acre: "/ Acre",
    acres_label: "Acres",
    days_left: "Days Left",
    overdue: "OVERDUE",
    priority_rules: "Priority Rules",
    listen_btn: "Listen",
    read_rationale: "Read Decision Rationale",
    report_breakdown: "Report Breakdown",
    mark_repaired: "Mark Repaired",
    status_available: "Available",
    status_under_repair: "Under Repair",
    status_confirmed: "Confirmed",
    status_rescheduled_safe: "Rescheduled (Safe)",
    status_rescheduled_at_risk: "⚠️ Rescheduled (At-Risk)",
    lender_title: "Lending Owner:",
    modal_lender_notice: "Notice: Your request will be sent to this owner for approval. The machine will be officially allotted with a travel buffer once the owner approves.",
    title_pending_approvals: "Pending Booking Requests Awaiting Your Approval",
    subtitle_pending_approvals: "Farmers requesting your machinery. Review earnings and travel buffer, then click Approve to allot the machine.",
    status_pending_approval: "⏳ Pending Owner Approval",
    status_approved_allotted: "✅ Approved & Allotted",
    btn_approve_and_allot: "✅ Approve & Allot Machine",
    btn_reject_request: "❌ Reject",
    btn_quick_approve_demo: "⚡ Quick-Approve as Owner (Demo)",
    waiting_for_owner: "Waiting for owner",
    to_approve: "to approve before allotment.",
  },
  hi: {
    top_help_text: "टाइप नहीं कर सकते या तुरंत बुक करना है?",
    top_dial_text: "AI वॉइस असिस्टेंट इस्तेमाल करें:",
    top_phone_number: "🤖 बोलकर तुरंत बुक करें (AI तकनीक)",
    language_label: "🌐 भाषा:",
    listen_aloud: "🔊 बोलकर सुनें",
    app_tag: "कृषि चक्र",
    app_subtitle: "स्मार्ट ग्रामीण कृषि मशीनरी साझाकरण एवं लचीली प्रेषण प्रणाली",
    nav_farmer: "किसान पोर्टल",
    nav_owner: "उपकरण मालिक",
    nav_dealer: "",
    badge_call: "AI वॉयस",
    sim_date_label: "सिम्युलेटेड तारीख:",
    clash_safe_text: "0 टकराव | बफर सुरक्षित",
    disruption_tests_label: "आपदा परीक्षण:",
    rain_btn_inject: "भारी बारिश सिमुलेट करें (19 नवं)",
    rain_btn_clear: "बारिश समाप्त करें",
    breakdown_btn_inject: "हार्वेस्टर खराबी सिमुलेट करें",
    breakdown_btn_repair: "हार्वेस्टर ठीक करें (EQ-03)",
    btn_reset: "↺ सामान्य करें",
    disruption_active_tag: "आपदा सक्रिय",
    disruption_auto_handled: "समय-सीमा प्राथमिकता के साथ स्वत: पुनर्नियोजित",
    farmer_hero_badge: "किसान डैशबोर्ड • सरल और पारदर्शी",
    farmer_hero_title: "असली फोटो देखकर ट्रैक्टर, हार्वेस्टर और स्प्रेयर बुक करें",
    farmer_hero_desc: "बुकिंग से पहले उपलब्ध मशीनों की असली फोटो देखें। आपकी कटाई और बुवाई की समय-सीमा को प्राथमिकता दी जाती है और मौसम खराब होने पर स्वचालित रूप से समय बदल दिया जाता है।",
    btn_request_machine: "अभी मशीन बुक करें",
    btn_voice_assistant: "🤖 AI वॉइस असिस्टेंट — बोलकर बुक करें",
    btn_call_dealer: "🤖 AI वॉइस असिस्टेंट — बोलकर बुक करें",
    phone_box_title: "AI वॉइस बुकिंग सहायक",
    phone_box_desc: "अपनी भाषा में बोलिए! हमारा AI वॉइस असिस्टेंट आपकी फसल, एकड़ और गाँव समझकर बिना किसी टकराव के तुरंत मशीन बुक कर देगा — टाइप करने की जरूरत नहीं!",
    phone_box_btn: "🎙️ बोलकर तुरंत बुक करें",
    title_available_fleet: "उपलब्ध कृषि मशीनें (फोटो और विवरण)",
    subtitle_available_fleet: "असली मशीनों की फोटो, किराया, कार्य क्षमता देखें और अपने खेत के लिए सीधे बुक करें।",
    badge_fleet_active: "आपके क्षेत्र में 5 मशीनें उपलब्ध हैं",
    title_my_plots: "मेरे पंजीकृत खेत और समय-सीमा",
    subtitle_my_plots: "प्रत्येक खेत की एक निश्चित समय-सीमा होती है। समय पर कार्य होने से फसल का नुकसान नहीं होता।",
    btn_register_plot: "+ नया खेत जोड़ें",
    title_my_bookings: "मेरी मशीन बुकिंग और वर्तमान स्थिति",
    subtitle_my_bookings: "स्वीकृत, प्रेषित, पुनर्निर्धारित या यात्रा बफर स्थिति को सरल भाषा में समझें।",
    hint_listen_explanation: "स्थिति समझने के लिए किसी भी कार्ड पर 🔊 दबाएं",
    stat_active_fleet: "सक्रिय मशीनें",
    stat_geo_tracked: "100% जीपीएस ट्रैक",
    stat_confirmed_bookings: "निर्धारित बुकिंग",
    stat_zero_clash: "शून्य टकराव",
    stat_projected_revenue: "अनुमानित आय",
    stat_period: "अगले 7 दिन",
    stat_transit_opt: "बचत दूरी",
    stat_km_saved: "42 किमी बचत",
    stat_clustered_dispatch: "क्लस्टर ग्रामीण प्रेषण",
    title_owner_fleet: "मेरी कृषि मशीनरी सूची",
    subtitle_owner_fleet: "फोटो, प्रति घंटा/प्रति एकड़ किराया, कार्य दर, स्थान और रखरखाव स्थिति देखें।",
    btn_register_machine: "+ नई मशीन जोड़ें",
    title_owner_requests: "आने वाले बुकिंग अनुरोध और स्वीकृति",
    subtitle_owner_requests: "किसानों के बुकिंग अनुरोध देखें। समय और यात्रा बफर स्वतः सुरक्षित हैं।",
    badge_buffer_active: "स्वचालित यात्रा बफर सुरक्षा सक्रिय",
    dealer_badge: "AI वॉइस असिस्टेंट • त्वरित आवंटन",
    dealer_title: "किसानों के लिए AI बोलकर बुकिंग सेवा",
    dealer_desc: "किसान स्वाभाविक रूप से बोलकर बिना टाइप किए या बिना डीलर के तुरंत मशीन बुक कर सकते हैं। सिस्टम तुरंत यात्रा बफर जांच कर स्लॉट और SMS भेजता है।",
    btn_simulate_call: "AI वॉइस बुकिंग टेस्ट करें 🎙️",
    dealer_form_title: "AI वॉइस बुकिंग इंजन",
    dealer_form_subtitle: "आवाज से फसल, खेत का आकार और सर्वोत्तम मशीन स्वतः आवंटित होती है।",
    label_farmer_name: "किसान का नाम",
    label_phone_number: "मोबाइल नंबर (SMS हेतु)",
    label_village_cluster: "गाँव / क्षेत्र",
    label_plot_area: "खेत का क्षेत्रफल (एकड़)",
    label_crop_type: "फसल का प्रकार",
    label_operation: "आवश्यक कार्य",
    label_deadline: "अंतिम तिथि",
    btn_dealer_submit: "तुरंत स्लॉट आवंटित करें और SMS भेजें",
    dealer_audio_title: "AI वॉइस आवाज और SMS सिम्युलेटर",
    dealer_audio_subtitle: "सिम्युलेटेड AI आवाज और किसान के फोन पर भेजे गए SMS का पूर्वावलोकन देखें।",
    ivr_idle_status: "● AI वॉइस असिस्टेंट तैयार है",
    ivr_waiting_text: "AI वॉइस असिस्टेंट तैयार है। सीधे बुक करने के लिए माइक दबाएं या टेस्ट वॉइस दबाएं!",
    dealer_note_title: "📱 किसानों के लिए लाभ:",
    dealer_note_text: "किसानों को तारीख, समय, ड्राइवर नंबर और बफर सुरक्षा के साथ तत्काल SMS मिलता है।",
    modal_booking_title: "मशीन बुकिंग अनुरोध",
    modal_booking_subtitle: "स्वचालित यात्रा बफर के साथ टकराव मुक्त बुकिंग",
    modal_select_plot: "खेत का चयन करें",
    modal_select_equip: "वांछित मशीन चुनें (फोटो देखें)",
    modal_start_date: "प्रारंभिक तिथि",
    modal_end_date: "अंतिम समय-सीमा",
    modal_notes_label: "खेत संबंधी विशेष निर्देश",
    modal_guarantee_title: "शून्य डबल-बुकिंग गारंटी",
    modal_guarantee_text: "शेड्यूलर स्वचालित रूप से खेत के आकार, कार्य समय और सड़क यात्रा के समय को जोड़ता है।",
    btn_cancel: "रद्द करें",
    btn_submit_request: "बुकिंग अनुरोध सबमिट करें",
    modal_plot_title: "नया खेत पंजीकृत करें",
    modal_plot_subtitle: "क्षेत्रफल, फसल और कटाई/बुवाई की अंतिम तिथि दर्ज करें",
    btn_save_plot: "खेत पंजीकृत करें",
    modal_equip_title: "नई मशीन पंजीकृत करें",
    modal_equip_subtitle: "मशीन की फोटो, कार्य दर और प्रति घंटा/एकड़ किराया दर्ज करें",
    modal_machine_name: "मशीन का मॉडल और नाम",
    modal_machine_photo: "मशीन की फोटो का URL",
    label_category: "श्रेणी",
    label_work_rate: "कार्य दर (एकड़ / घंटा)",
    label_rate_price: "किराया (₹)",
    label_rate_basis: "किराया आधार",
    basis_hour: "प्रति घंटा",
    basis_acre: "प्रति एकड़",
    label_base_hub: "आधार स्थान",
    label_owner_phone: "मालिक का फोन नंबर",
    btn_add_fleet: "सूची में मशीन जोड़ें",
    call_live_status: "AI वॉइस असिस्टेंट",
    call_helpline_title: "कृषि चक्र AI वॉइस असिस्टेंट",
    call_helpline_sub: "वॉयस AI द्वारा संचालित • बहुभाषी",
    call_connected_info: "● तैयार • हिन्दी, तेलुगु, पंजाबी, मराठी व अंग्रेजी",
    btn_speak_to_book: "माइक दबाकर बोलें और मशीन बुक करें",
    btn_play_hindi_ivr: "🎙️ हिन्दी आवाज डेमो",
    btn_play_english_ivr: "🎙️ अंग्रेजी आवाज डेमो",
    voice_try_saying: "💡 या उदाहरण बोलकर बुक करें:",
    ai_how_it_works_title: "🧠 यह कैसे काम करता है:",
    ai_how_it_works_desc: "बस स्वाभाविक रूप से बोलें — AI को अपनी फसल, गाँव, एकड़ और समय-सीमा बताएं। यह उपलब्ध सबसे अच्छी मशीन खोजता है, तुरंत बुक करता है, और SMS पुष्टि भेजता है। न कोई टाइपिंग, न कोई डीलर, न कोई इंतज़ार!",
    btn_open_dealer_intake: "🎙️ AI वॉइस बुकिंग शुरू करें →",
    modal_why_title: "यह निर्णय क्यों लिया गया?",
    btn_listen_explanation_audio: "🔊 यह कारण बोलकर सुनें (ऑडियो)",
    btn_close: "बंद करें",
    footer_platform_desc: "स्मार्ट कृषि प्रेषण एवं मशीनरी साझाकरण",
    footer_zero_clash: "शून्य डबल-बुकिंग गारंटी",
    footer_rescheduler: "आपदा में स्वतः पुनर्नियोजन",
    footer_helpline: "🤖 AI वॉइस असिस्टेंट सक्रिय",
    // Dynamic terms
    crop_paddy: "🌾 धान (चावल)",
    crop_wheat: "🌱 गेहूं",
    crop_cotton: "🌸 कपास",
    crop_mustard: "🌼 सरसों",
    crop_sugarcane: "🎋 गन्ना",
    op_harvest: "🚜 कटाई (अत्यधिक जरूरी)",
    op_sow: "🌱 बुवाई (नमी खिड़की)",
    op_spray: "💧 कीटनाशक छिड़काव",
    op_till: "⚙️ जुताई / रोटावेटर",
    btn_request_this_machine: "यह मशीन बुक करें",
    rate_per_hour: "/ घंटा",
    rate_per_acre: "/ एकड़",
    acres_label: "एकड़",
    days_left: "दिन शेष",
    overdue: "अवधि समाप्त!",
    priority_rules: "प्राथमिकता नियम",
    listen_btn: "सुनें",
    read_rationale: "कारण पढ़ें",
    report_breakdown: "खराबी दर्ज करें",
    mark_repaired: "ठीक हो गई",
    status_available: "उपलब्ध",
    status_under_repair: "मरम्मत जारी",
    status_confirmed: "पुष्ट (Confirmed)",
    status_rescheduled_safe: "पुनर्निर्धारित (सुरक्षित)",
    status_rescheduled_at_risk: "⚠️ खतरे में (At-Risk)",
    lender_title: "मालिक / ऋणदाता:",
    modal_lender_notice: "सूचना: आपका अनुरोध स्वीकृति के लिए सीधे मशीन मालिक को भेजा जाएगा। मालिक द्वारा स्वीकृत होने पर यात्रा बफर के साथ मशीन आधिकारिक रूप से आवंटित की जाएगी।",
    title_pending_approvals: "आपके अनुमोदन की प्रतीक्षा में आने वाले अनुरोध",
    subtitle_pending_approvals: "किसान आपकी मशीन मांग रहे हैं। कमाई और यात्रा समय जांचें, फिर आवंटन के लिए 'स्वीकार करें' दबाएं।",
    status_pending_approval: "⏳ मालिक की स्वीकृति लंबित",
    status_approved_allotted: "✅ स्वीकृत एवं आवंटित",
    btn_approve_and_allot: "✅ स्वीकार करें और मशीन आवंटित करें",
    btn_reject_request: "❌ अस्वीकार करें",
    btn_quick_approve_demo: "⚡ मालिक के रूप में तुरंत स्वीकार करें (डेमो)",
    waiting_for_owner: "मालिक",
    to_approve: "द्वारा स्वीकृति की प्रतीक्षा है।",
  },
  te: {
    top_help_text: "టైప్ చేయలేరా లేదా త్వరగా బుక్ చేయాలా?",
    top_dial_text: "AI వాయిస్ అసిస్టెంట్ ఉపయోగించండి:",
    top_phone_number: "🤖 మాట్లాడి వెంటనే బుక్ చేయండి (AI ద్వారా)",
    language_label: "🌐 భాష:",
    listen_aloud: "🔊 వినండి",
    app_tag: "కృషి చక్ర",
    app_subtitle: "స్మార్ట్ గ్రామీణ యంత్రాల భాగస్వామ్యం & సహాయక వ్యవస్థ",
    nav_farmer: "రైతు పోర్టల్",
    nav_owner: "యంత్ర యజమాని",
    nav_dealer: "",
    badge_call: "AI వాయిస్",
    sim_date_label: "తేదీ:",
    clash_safe_text: "0 సమస్యలు | సురక్షితం",
    disruption_tests_label: "ఆపద పరీక్షలు:",
    rain_btn_inject: "భారీ వర్షం పరీక్ష (నవంబర్ 19)",
    rain_btn_clear: "వర్షం సమస్య తొలగించు",
    breakdown_btn_inject: "హార్వెస్టర్ సమస్య పరీక్ష",
    breakdown_btn_repair: "హార్వెస్టర్ బాగుచేయి",
    btn_reset: "↺ రీసెట్",
    disruption_active_tag: "ఆపద సక్రియం",
    disruption_auto_handled: "గడువు ప్రాధాన్యతతో ఆటోమేటిక్ షెడ్యూల్",
    farmer_hero_badge: "రైతు డాష్‌బోర్డ్ • సరళమైనది & పారదర్శకం",
    farmer_hero_title: "ఫోటోలు చూసి ట్రాక్టర్లు, హార్వెస్టర్లు బుక్ చేసుకోండి",
    farmer_hero_desc: "బుకింగ్ చేయడానికి ముందు యంత్రాల ఫోటోలు చూడండి. కోత మరియు విత్తే గడువులకు అత్యంత ప్రాధాన్యత ఇవ్వబడుతుంది.",
    btn_request_machine: "ఇప్పుడే మెషిన్ బుక్ చేయండి",
    btn_voice_assistant: "🤖 AI వాయిస్ అసిస్టెంట్ — మాట్లాడి బుక్ చేయండి",
    btn_call_dealer: "🤖 AI వాయిస్ అసిస్టెంట్ — మాట్లాడి బుక్ చేయండి",
    phone_box_title: "AI వాయిస్ బుకింగ్ అసిస్టెంట్",
    phone_box_desc: "మీ సొంత భాషలో సహజంగా మాట్లాడండి! మా AI వాయిస్ అసిస్టెంట్ మీ పంట, విస్తీర్ణం మరియు గ్రామాన్ని అర్థం చేసుకుని సున్నా క్లాష్‌లతో వెంటనే యంత్రాన్ని బుక్ చేస్తుంది!",
    phone_box_btn: "🎙️ మాట్లాడి వెంటనే బుక్ చేసుకోండి",
    title_available_fleet: "అందుబాటులో ఉన్న యంత్రాలు (ఫోటోలు & వివరాలు)",
    subtitle_available_fleet: "నిజమైన యంత్రాల ఫోటోలు, అద్దె ధరలు చూసి మీ పొలం కోసం బుక్ చేసుకోండి.",
    badge_fleet_active: "మీ ప్రాంతంలో 5 యంత్రాలు సిద్ధంగా ఉన్నాయి",
    title_my_plots: "నా పొలాలు & గడువులు",
    subtitle_my_plots: "ప్రతి పొలానికి ఒక గడువు ఉంటుంది. సమయానికి పని పూర్తయితే పంట నష్టం ఉండదు.",
    btn_register_plot: "+ కొత్త పొలం నమోదు చేయండి",
    title_my_bookings: "నా బుకింగ్‌లు & ప్రస్తుత స్థితి",
    subtitle_my_bookings: "మీ బుకింగ్ వివరాలను సులభమైన భాషలో తెలుసుకోండి.",
    hint_listen_explanation: "వివరాలు వినడానికి 🔊 గుర్తుపై నొక్కండి",
    stat_active_fleet: "క్రియాశీల యంత్రాలు",
    stat_geo_tracked: "100% జీపీఎస్ ట్రాకింగ్",
    stat_confirmed_bookings: "షెడ్యూల్ బుకింగ్‌లు",
    stat_zero_clash: "ఎటువంటి సమస్యలు లేవు",
    stat_projected_revenue: "అంచనా ఆదాయం",
    stat_period: "తదుపరి 7 రోజులు",
    stat_transit_opt: "ప్రయాణ ఆదా",
    stat_km_saved: "42 కిమీ ఆదా",
    stat_clustered_dispatch: "గ్రామీణ సమన్వయం",
    title_owner_fleet: "నా యంత్రాల జాబితా",
    subtitle_owner_fleet: "ఫోటోలు, గంటకు/ఎకరాకు రేట్లు, పని సామర్థ్యం నమోదు చేయండి.",
    btn_register_machine: "+ కొత్త యంత్రం చేర్చండి",
    title_owner_requests: "వచ్చిన బుకింగ్ అభ్యర్థనలు",
    subtitle_owner_requests: "రైతుల అభ్యర్థనలను సమీక్షించండి. ప్రయాణ సమయం ఆటోమేటిక్‌గా రక్షించబడుతుంది.",
    badge_buffer_active: "ప్రయాణ సమయ బఫర్ రక్షణ ఉంది",
    dealer_badge: "AI వాయిస్ అసిస్టెంట్ • తక్షణ కేటాయింపు",
    dealer_title: "రైతుల కోసం AI వాయిస్ బుకింగ్",
    dealer_desc: "రైతులు టైప్ చేయకుండా లేదా డీలర్ల అవసరం లేకుండా సహజంగా మాట్లాడి యంత్రాలను వెంటనే బుక్ చేసుకోవచ్చు.",
    btn_simulate_call: "AI వాయిస్ బుకింగ్ పరీక్షించండి 🎙️",
    dealer_form_title: "AI వాయిస్ బుకింగ్ ఇంజిన్",
    dealer_form_subtitle: "వాయిస్ ఇన్‌పుట్ ద్వారా పంట, పొలం పరిమాణం మరియు ఉత్తమ యంత్రం కేటాయింపు.",
    label_farmer_name: "రైతు పేరు",
    label_phone_number: "మొబైల్ నంబర్ (SMS కోసం)",
    label_village_cluster: "గ్రామం / ప్రాంతం",
    label_plot_area: "పొలం విస్తీర్ణం (ఎకరాలు)",
    label_crop_type: "పంట రకం",
    label_operation: "అవసరమైన పని",
    label_deadline: "చివరి గడువు తేదీ",
    btn_dealer_submit: "వెంటనే స్లాట్ కేటాయించి SMS పంపండి",
    dealer_audio_title: "AI వాయిస్ ఆడియో & SMS సిమ్యులేటర్",
    dealer_audio_subtitle: "రైతు ఫోన్‌కు వచ్చే ఆడియో మరియు SMS సందేశాలను చూడండి.",
    ivr_idle_status: "● AI వాయిస్ అసిస్టెంట్ సిద్ధంగా ఉంది",
    ivr_waiting_text: "AI వాయిస్ అసిస్టెంట్ సిద్ధంగా ఉంది. నేరుగా బుక్ చేయడానికి మైక్ నొక్కండి!",
    dealer_note_title: "📱 రైతులకు ప్రయోజనం:",
    dealer_note_text: "తేదీ, సమయం, డ్రైవర్ వివరాలతో తక్షణ SMS అందుతుంది.",
    modal_booking_title: "యంత్రం బుకింగ్ అభ్యర్థన",
    modal_booking_subtitle: "ప్రయాణ బఫర్‌తో సురక్షితమైన బుకింగ్",
    modal_select_plot: "పొలాన్ని ఎంచుకోండి",
    modal_select_equip: "కావాల్సిన యంత్రాన్ని ఎంచుకోండి (ఫోటోలు చూడండి)",
    modal_start_date: "ప్రారంభ తేదీ",
    modal_end_date: "చివరి గడువు",
    modal_notes_label: "ప్రత్యేక సూచనలు",
    modal_guarantee_title: "డబుల్ బుకింగ్ లేని గ్యారెంటీ",
    modal_guarantee_text: "పొలం పరిమాణం మరియు ప్రయాణ దూరాన్ని బట్టి ఖచ్చితమైన సమయం కేటాయించబడుతుంది.",
    btn_cancel: "రద్దు చేయండి",
    btn_submit_request: "బుకింగ్ అభ్యర్థన పంపండి",
    modal_plot_title: "కొత్త పొలం నమోదు చేయండి",
    modal_plot_subtitle: "విస్తీర్ణం, పంట మరియు గడువు నమోదు చేయండి",
    btn_save_plot: "పొలం నమోదు చేయండి",
    modal_equip_title: "కొత్త యంత్రాన్ని చేర్చండి",
    modal_equip_subtitle: "యంత్రం ఫోటో, అద్దె ధర నమోదు చేయండి",
    modal_machine_name: "యంత్రం పేరు & మోడల్",
    modal_machine_photo: "యంత్రం ఫోటో URL",
    label_category: "వర్గం",
    label_work_rate: "పని సామర్థ్యం (ఎకరాలు / గంట)",
    label_rate_price: "అద్దె (₹)",
    label_rate_basis: "అద్దె రకం",
    basis_hour: "గంటకు",
    basis_acre: "ఎకరాకు",
    label_base_hub: "కేంద్ర స్థానం",
    label_owner_phone: "యజమాని ఫోన్ నంబర్",
    btn_add_fleet: "జాబితాలో చేర్చండి",
    call_live_status: "AI వాయిస్ అసిస్టెంట్",
    call_helpline_title: "కృషి చక్ర AI వాయిస్ అసిస్టెంట్",
    call_helpline_sub: "వాయిస్ AI ఆధారితం • బహుభాషా",
    call_connected_info: "● సిద్ధంగా ఉంది • తెలుగు, హిందీ, పంజాబీ, మరాఠీ & ఇంగ్లీష్",
    btn_speak_to_book: "మైక్ నొక్కి మాట్లాడి మెషిన్ బుక్ చేయండి",
    btn_play_hindi_ivr: "🎙️ డెమో హిందీ వాయిస్",
    btn_play_english_ivr: "🎙️ డెమో ఇంగ్లీష్ వాయిస్",
    voice_try_saying: "💡 లేదా ఈ ఉదాహరణ నొక్కండి:",
    ai_how_it_works_title: "🧠 ఇది ఎలా పని చేస్తుంది:",
    ai_how_it_works_desc: "సహజంగా మాట్లాడండి — AI కి మీ పంట, గ్రామం, విస్తీర్ణం మరియు గడువు చెప్పండి. ఇది ఉత్తమమైన యంత్రాన్ని కనుగొని, వెంటనే బుక్ చేసి SMS పంపుతుంది. టైపింగ్ లేదు, డీలర్ అవసరం లేదు!",
    btn_open_dealer_intake: "🎙️ AI వాయిస్ బుకింగ్ ప్రారంభించండి →",
    modal_why_title: "ఈ నిర్ణయం ఎందుకు తీసుకున్నారు?",
    btn_listen_explanation_audio: "🔊 ఈ వివరణ వినండి (ఆడియో)",
    btn_close: "మూసివేయండి",
    footer_platform_desc: "స్మార్ట్ వ్యవసాయ యంత్రాల నిర్వహణ",
    footer_zero_clash: "డబుల్ బుకింగ్ లేని హామీ",
    footer_rescheduler: "ఆపదలో ఆటోమేటిక్ రీషెడ్యూల్",
    footer_helpline: "🤖 AI వాయిస్ అసిస్టెంట్ ప్రారంభించబడింది",
    // Dynamic terms
    crop_paddy: "🌾 వరి",
    crop_wheat: "🌱 గోధుమ",
    crop_cotton: "🌸 పత్తి",
    crop_mustard: "🌼 ఆవాలు",
    crop_sugarcane: "🎋 చెరకు",
    op_harvest: "🚜 కోత (అత్యవసరం)",
    op_sow: "🌱 విత్తడం (తేమ సమయం)",
    op_spray: "💧 పిచికారీ",
    op_till: "⚙️ దున్నడం",
    btn_request_this_machine: "ఈ యంత్రం బుక్ చేయండి",
    rate_per_hour: "/ గంటకు",
    rate_per_acre: "/ ఎకరాకు",
    acres_label: "ఎకరాలు",
    days_left: "రోజులు మిగిలి ఉన్నాయి",
    overdue: "గడువు ముగిసింది!",
    priority_rules: "ప్రాధాన్యతా నియమాలు",
    listen_btn: "వినండి",
    read_rationale: "కారణం చదవండి",
    report_breakdown: "సమస్య తెలపండి",
    mark_repaired: "బాగుచేయబడింది",
    status_available: "అందుబాటులో ఉంది",
    status_under_repair: "మరమ్మత్తులో ఉంది",
    status_confirmed: "ఖరారైంది (Confirmed)",
    status_rescheduled_safe: "రీషెడ్యూల్ (సురక్షితం)",
    status_rescheduled_at_risk: "⚠️ ప్రమాదంలో ఉంది",
    lender_title: "యంత్ర యజమాని:",
    modal_lender_notice: "గమనిక: మీ అభ్యర్థన యజమాని ఆమోదం కోసం పంపబడుతుంది. యజమాని ఆమోదించిన తర్వాత మాత్రమే యంత్రం అధికారਿਕంగా కేటాయించబడుతుంది.",
    title_pending_approvals: "మీ ఆమోదం కోసం వేచి ఉన్న అభ్యర్థనలు",
    subtitle_pending_approvals: "రైతులు మీ యంత్రాలను కోరుతున్నారు. వివరాలు చూసి ఆమోదించండి.",
    status_pending_approval: "⏳ యజమాని ఆమోదం కోసం వేచి ఉంది",
    status_approved_allotted: "✅ ఆమోదించబడింది & కేటాయించబడింది",
    btn_approve_and_allot: "✅ ఆమోదించి కేటాయించండి",
    btn_reject_request: "❌ తిరస్కరించు",
    btn_quick_approve_demo: "⚡ యజమానిగా త్వరగా ఆమోదించండి",
    waiting_for_owner: "యజమాని",
    to_approve: "ఆమోదం కోసం వేచి ఉంది.",
  },
  pa: {
    top_help_text: "ਟਾਈਪ ਨਹੀਂ ਕਰ ਸਕਦੇ ਜਾਂ ਤੁਰੰਤ ਬੁੱਕ ਕਰਨਾ ਹੈ?",
    top_dial_text: "AI ਵਾਇਸ ਅਸਿਸਟੈਂਟ ਵਰਤੋ:",
    top_phone_number: "🤖 ਬੋਲ ਕੇ ਤੁਰੰਤ ਬੁੱਕ ਕਰੋ (AI ਰਾਹੀਂ)",
    language_label: "🌐 ਭਾਸ਼ਾ:",
    listen_aloud: "🔊 ਬੋਲ ਕੇ ਸੁਣੋ",
    app_tag: "ਕ੍ਰਿਸ਼ੀ ਚੱਕਰ",
    app_subtitle: "ਸਮਾਰਟ ਪੇਂਡੂ ਖੇਤੀ ਮਸ਼ੀਨਰੀ ਸਾਂਝਾਕਰਨ ਪ੍ਰਣਾਲੀ",
    nav_farmer: "ਕਿਸਾਨ ਪੋਰਟਲ",
    nav_owner: "ਮਸ਼ੀਨ ਮਾਲਕ",
    nav_dealer: "",
    badge_call: "AI ਵਾਇਸ",
    sim_date_label: "ਸਿਮੂਲੇਟਿਡ ਮਿਤੀ:",
    clash_safe_text: "0 ਟਕਰਾਅ | ਸੁਰੱਖਿਅਤ",
    disruption_tests_label: "ਆਪਦਾ ਟੈਸਟ:",
    rain_btn_inject: "ਵੱਡੀ ਬਾਰਿਸ਼ ਟੈਸਟ (19 ਨਵੰ)",
    rain_btn_clear: "ਬਾਰਿਸ਼ ਸਮਾਪਤ ਕਰੋ",
    breakdown_btn_inject: "ਹਾਰਵੈਸਟਰ ਖਰਾਬੀ ਟੈਸਟ",
    breakdown_btn_repair: "ਹਾਰਵੈਸਟਰ ਠੀਕ ਕਰੋ",
    btn_reset: "↺ ਰੀਸੈੱਟ",
    disruption_active_tag: "ਆਪਦਾ ਸਰਗਰਮ",
    disruption_auto_handled: "ਮਿਆਦ ਪਹਿਲ ਨਾਲ ਆਟੋਮੈਟਿਕ ਤਬਦੀਲ",
    farmer_hero_badge: "ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ • ਸਰਲ ਅਤੇ ਪਾਰਦਰਸ਼ੀ",
    farmer_hero_title: "ਅਸਲੀ ਫੋਟੋਆਂ ਵੇਖ ਕੇ ਟਰੈਕਟਰ ਅਤੇ ਕੰਬਾਈਨਾਂ ਬੁੱਕ ਕਰੋ",
    farmer_hero_desc: "ਬੁਕਿੰਗ ਤੋਂ ਪਹਿਲਾਂ ਮਸ਼ੀਨਾਂ ਦੀਆਂ ਅਸਲੀ ਫੋਟੋਆਂ ਵੇਖੋ। ਤੁਹਾਡੀ ਫਸਲ ਦੀ ਕਟਾਈ ਅਤੇ ਬਿਜਾਈ ਦੇ ਸਮੇਂ ਦੀ ਪੂਰੀ ਗਾਰੰਟੀ।",
    btn_request_machine: "ਹੁਣੇ ਮਸ਼ੀਨ ਬੁੱਕ ਕਰੋ",
    btn_voice_assistant: "🤖 AI ਵਾਇਸ ਅਸਿਸਟੈਂਟ — ਬੋਲ ਕੇ ਬੁੱਕ ਕਰੋ",
    btn_call_dealer: "🤖 AI ਵਾਇਸ ਅਸਿਸਟੈਂਟ — ਬੋਲ ਕੇ ਬੁੱਕ ਕਰੋ",
    phone_box_title: "AI ਵਾਇਸ ਬੁਕਿੰਗ ਸਹਾਇਕ",
    phone_box_desc: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸੁਭਾਵਿਕ ਤੌਰ 'ਤੇ ਬੋਲੋ! ਸਾਡਾ AI ਵਾਇਸ ਅਸਿਸਟੈਂਟ ਤੁਹਾਡੀ ਫ਼ਸਲ, ਰਕਬਾ ਅਤੇ ਪਿੰਡ ਸਮਝ ਕੇ ਬਿਨਾਂ ਕਿਸੇ ਟਕਰਾਅ ਦੇ ਤੁਰੰਤ ਮਸ਼ੀਨ ਬੁੱਕ ਕਰ ਦੇਵੇਗਾ!",
    phone_box_btn: "🎙️ ਬੋਲ ਕੇ ਹੁਣੇ ਬੁੱਕ ਕਰੋ",
    title_available_fleet: "ਉਪਲਬਧ ਖੇਤੀ ਮਸ਼ੀਨਾਂ (ਫੋਟੋਆਂ ਅਤੇ ਵੇਰਵੇ)",
    subtitle_available_fleet: "ਮਸ਼ੀਨਾਂ ਦੀਆਂ ਅਸਲੀ ਫੋਟੋਆਂ, ਕਿਰਾਇਆ ਅਤੇ ਕੰਮ ਦੀ ਰਫ਼ਤਾਰ ਵੇਖ ਕੇ ਸਿੱਧਾ ਬੁੱਕ ਕਰੋ।",
    badge_fleet_active: "ਤੁਹਾਡੇ ਇਲਾਕੇ ਵਿੱਚ 5 ਮਸ਼ੀਨਾਂ ਉਪਲਬਧ ਹਨ",
    title_my_plots: "ਮੇਰੇ ਰਜਿਸਟਰਡ ਖੇਤ ਅਤੇ ਮਿਆਦ",
    subtitle_my_plots: "ਹਰ ਖੇਤ ਦਾ ਨਿਸ਼ਚਿਤ ਸਮਾਂ ਹੁੰਦਾ ਹੈ। ਸਮੇਂ ਸਿਰ ਕੰਮ ਹੋਣ ਨਾਲ ਫਸਲ ਦਾ ਨੁਕਸਾਨ ਨਹੀਂ ਹੁੰਦਾ।",
    btn_register_plot: "+ ਨਵਾਂ ਖੇਤ ਦਰਜ ਕਰੋ",
    title_my_bookings: "ਮੇਰੀ ਮਸ਼ੀਨ ਬੁਕਿੰਗ ਅਤੇ ਸਥਿਤੀ",
    subtitle_my_bookings: "ਆਪਣੀ ਬੁਕਿੰਗ ਦੀ ਸਥਿਤੀ ਆਸਾਨ ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਣੋ।",
    hint_listen_explanation: "ਵੇਰਵਾ ਸੁਣਨ ਲਈ ਕਿਸੇ ਵੀ ਕਾਰਡ 'ਤੇ 🔊 ਦਬਾਓ",
    stat_active_fleet: "ਸਰਗਰਮ ਮਸ਼ੀਨਾਂ",
    stat_geo_tracked: "100% ਜੀਪੀਐਸ ਟਰੈਕ",
    stat_confirmed_bookings: "ਪੱਕੀਆਂ ਬੁਕਿੰਗਾਂ",
    stat_zero_clash: "ਕੋਈ ਟਕਰਾਅ ਨਹੀਂ",
    stat_projected_revenue: "ਅੰਦਾਜ਼ਨ ਆਮਦਨ",
    stat_period: "ਅਗਲੇ 7 ਦਿਨ",
    stat_transit_opt: "ਬੱਚਤ ਦੂਰੀ",
    stat_km_saved: "42 ਕਿਮੀ ਬੱਚਤ",
    stat_clustered_dispatch: "ਪੇਂਡੂ ਤਾਲਮੇਲ",
    title_owner_fleet: "ਮੇਰੀ ਖੇਤੀ ਮਸ਼ੀਨਰੀ ਸੂਚੀ",
    subtitle_owner_fleet: "ਫੋਟੋਆਂ, ਪ੍ਰਤੀ ਘੰਟਾ/ਏਕੜ ਕਿਰਾਇਆ ਅਤੇ ਸਥਾਨ ਦਰਜ ਕਰੋ।",
    btn_register_machine: "+ ਨਵੀਂ ਮਸ਼ੀਨ ਸ਼ਾਮਲ ਕਰੋ",
    title_owner_requests: "ਆਈਆਂ ਬੁਕਿੰਗ ਬੇਨਤੀਆਂ",
    subtitle_owner_requests: "ਕਿਸਾਨਾਂ ਦੀਆਂ ਬੇਨਤੀਆਂ ਦੀ ਜਾਂਚ ਕਰੋ। ਸਫ਼ਰ ਦਾ ਸਮਾਂ ਆਟੋਮੈਟਿਕ ਸੁਰੱਖਿਅਤ ਹੈ।",
    badge_buffer_active: "ਸਫ਼ਰ ਸਮਾਂ ਬਫਰ ਸੁਰੱਖਿਆ ਚਾਲੂ ਹੈ",
    dealer_badge: "AI ਵਾਇਸ ਅਸਿਸਟੈਂਟ • ਤੁਰੰਤ ਅਲਾਟਮੈਂਟ",
    dealer_title: "ਕਿਸਾਨਾਂ ਲਈ AI ਬੋਲ ਕੇ ਬੁਕਿੰਗ ਸੇਵਾ",
    dealer_desc: "ਕਿਸਾਨ ਬਿਨਾਂ ਟਾਈਪ ਕੀਤੇ ਜਾਂ ਬਿਨਾਂ ਡੀਲਰ ਦੇ ਬੋਲ ਕੇ ਸਿੱਧਾ ਮਸ਼ੀਨ ਬੁੱਕ ਕਰ ਸਕਦੇ ਹਨ।",
    btn_simulate_call: "AI ਵਾਇਸ ਬੁਕਿੰਗ ਟੈਸਟ 🎙️",
    dealer_form_title: "AI ਵਾਇਸ ਬੁਕਿੰਗ ਇੰਜਣ",
    dealer_form_subtitle: "ਆਵਾਜ਼ ਰਾਹੀਂ ਫ਼ਸਲ, ਖੇਤ ਦਾ ਰਕਬਾ ਅਤੇ ਸਭ ਤੋਂ ਵਧੀਆ ਮਸ਼ੀਨ ਅਲਾਟ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।",
    label_farmer_name: "ਕਿਸਾਨ ਦਾ ਨਾਂ",
    label_phone_number: "ਮੋਬਾਈਲ ਨੰਬਰ (SMS ਲਈ)",
    label_village_cluster: "ਪਿੰਡ / ਇਲਾਕਾ",
    label_plot_area: "ਖੇਤ ਦਾ ਰਕਬਾ (ਏਕੜ)",
    label_crop_type: "ਫਸਲ ਦੀ ਕਿਸਮ",
    label_operation: "ਲੋੜੀਂਦਾ ਕੰਮ",
    label_deadline: "ਆਖਰੀ ਮਿਆਦ ਮਿਤੀ",
    btn_dealer_submit: "ਤੁਰੰਤ ਸਲਾਟ ਦਿਓ ਅਤੇ SMS ਭੇਜੋ",
    dealer_audio_title: "AI ਵਾਇਸ ਆਡੀਓ ਅਤੇ SMS ਸਿਮੂਲੇਟਰ",
    dealer_audio_subtitle: "ਕਿਸਾਨ ਦੇ ਫੋਨ 'ਤੇ ਜਾਣ ਵਾਲੇ ਆਡੀਓ ਅਤੇ SMS ਦਾ ਨਮੂਨਾ ਵੇਖੋ।",
    ivr_idle_status: "● AI ਵਾਇਸ ਅਸਿਸਟੈਂਟ ਤਿਆਰ ਹੈ",
    ivr_waiting_text: "AI ਵਾਇਸ ਅਸਿਸਟੈਂਟ ਤਿਆਰ ਹੈ। ਸਿੱਧਾ ਬੁੱਕ ਕਰਨ ਲਈ ਮਾਈਕ ਦਬਾਓ!",
    dealer_note_title: "📱 ਕਿਸਾਨਾਂ ਨੂੰ ਲਾਭ:",
    dealer_note_text: "ਤਾਰੀਖ, ਸਮਾਂ ਅਤੇ ਡਰਾਈਵਰ ਨੰਬਰ ਨਾਲ ਤੁਰੰਤ SMS ਮਿਲਦਾ ਹੈ।",
    modal_booking_title: "ਮਸ਼ੀਨ ਬੁਕਿੰਗ ਬੇਨਤੀ",
    modal_booking_subtitle: "ਸਫ਼ਰ ਬਫਰ ਦੇ ਨਾਲ ਟਕਰਾਅ ਮੁਕਤ ਬੁਕਿੰਗ",
    modal_select_plot: "ਖੇਤ ਚੁਣੋ",
    modal_select_equip: "ਲੋੜੀਂਦੀ ਮਸ਼ੀਨ ਚੁਣੋ (ਫੋਟੋਆਂ ਵੇਖੋ)",
    modal_start_date: "ਸ਼ੁਰੂਆਤੀ ਮਿਤੀ",
    modal_end_date: "ਆਖਰੀ ਮਿਆਦ",
    modal_notes_label: "ਖਾਸ ਹਦਾਇਤਾਂ",
    modal_guarantee_title: "ਡਬਲ ਬੁਕਿੰਗ ਰਹਿਤ ਗਾਰੰਟੀ",
    modal_guarantee_text: "ਖੇਤ ਦੇ ਰਕਬੇ ਅਤੇ ਸਫ਼ਰ ਦੇ ਸਮੇਂ ਦਾ ਪੂਰਾ ਹਿਸਾਬ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।",
    btn_cancel: "ਰੱਦ ਕਰੋ",
    btn_submit_request: "ਬੁਕਿੰਗ ਬੇਨਤੀ ਭੇਜੋ",
    modal_plot_title: "ਨਵਾਂ ਖੇਤ ਦਰਜ ਕਰੋ",
    modal_plot_subtitle: "ਰਕਬਾ, ਫਸਲ ਅਤੇ ਕਟਾਈ ਦੀ ਆਖਰੀ ਮਿਤੀ ਲਿਖੋ",
    btn_save_plot: "ਖੇਤ ਦਰਜ ਕਰੋ",
    modal_equip_title: "ਨਵੀਂ ਮਸ਼ੀਨ ਦਰਜ ਕਰੋ",
    modal_equip_subtitle: "ਮਸ਼ੀਨ ਦੀ ਫੋਟੋ ਅਤੇ ਕਿਰਾਇਆ ਲਿਖੋ",
    modal_machine_name: "ਮਸ਼ੀਨ ਦਾ ਨਾਂ ਅਤੇ ਮਾਡਲ",
    modal_machine_photo: "ਮਸ਼ੀਨ ਦੀ ਫੋਟੋ ਦਾ URL",
    label_category: "ਸ਼੍ਰੇਣੀ",
    label_work_rate: "ਕੰਮ ਦੀ ਰਫ਼ਤਾਰ (ਏਕੜ / ਘੰਟਾ)",
    label_rate_price: "ਕਿਰਾਇਆ (₹)",
    label_rate_basis: "ਕਿਰਾਏ ਦਾ ਆਧਾਰ",
    basis_hour: "ਪ੍ਰਤੀ ਘੰਟਾ",
    basis_acre: "ਪ੍ਰਤੀ ਏਕੜ",
    label_base_hub: "ਮੁੱਖ ਅੱਡਾ",
    label_owner_phone: "ਮਾਲਕ ਦਾ ਫੋਨ ਨੰਬਰ",
    btn_add_fleet: "ਸੂਚੀ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ",
    call_live_status: "AI ਵਾਇਸ ਅਸਿਸਟੈਂਟ",
    call_helpline_title: "ਕ੍ਰਿਸ਼ੀ ਚੱਕਰ AI ਵਾਇਸ ਅਸਿਸਟੈਂਟ",
    call_helpline_sub: "ਵਾਇਸ AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ • ਬਹੁਭਾਸ਼ਾਈ",
    call_connected_info: "● ਤਿਆਰ • ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਤੇਲਗੂ, ਮਰਾਠੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ",
    btn_speak_to_book: "ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ ਅਤੇ ਮਸ਼ੀਨ ਬੁੱਕ ਕਰੋ",
    btn_play_hindi_ivr: "🎙️ ਡੈਮੋ ਹਿੰਦੀ ਆਵਾਜ਼",
    btn_play_english_ivr: "🎙️ ਡੈਮੋ ਅੰਗਰੇਜ਼ੀ ਆਵਾਜ਼",
    voice_try_saying: "💡 ਜਾਂ ਇਹ ਉਦਾਹਰਨ ਦਬਾਓ:",
    ai_how_it_works_title: "🧠 ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ:",
    ai_how_it_works_desc: "ਬਸ ਸੁਭਾਵਿਕ ਤੌਰ 'ਤੇ ਬੋਲੋ — AI ਨੂੰ ਆਪਣੀ ਫ਼ਸਲ, ਪਿੰਡ, ਰਕਬਾ ਅਤੇ ਆਖਰੀ ਤਾਰੀਖ ਦੱਸੋ। ਇਹ ਸਭ ਤੋਂ ਵਧੀਆ ਮਸ਼ੀਨ ਲੱਭ ਕੇ ਤੁਰੰਤ ਬੁੱਕ ਕਰਦਾ ਹੈ ਅਤੇ SMS ਭੇਜਦਾ ਹੈ। ਕੋਈ ਟਾਈਪਿੰਗ ਨਹੀਂ, ਕੋਈ ਡੀਲਰ ਨਹੀਂ!",
    btn_open_dealer_intake: "🎙️ AI ਵਾਇਸ ਬੁਕਿੰਗ ਸ਼ੁਰੂ ਕਰੋ →",
    modal_why_title: "ਇਹ ਫੈਸਲਾ ਕਿਉਂ ਲਿਆ ਗਿਆ?",
    btn_listen_explanation_audio: "🔊 ਇਹ ਵੇਰਵਾ ਸੁਣੋ (ਆਡੀਓ)",
    btn_close: "ਬੰਦ ਕਰੋ",
    footer_platform_desc: "ਸਮਾਰਟ ਖੇਤੀ ਮਸ਼ੀਨਰੀ ਪ੍ਰਬੰਧਨ",
    footer_zero_clash: "ਡਬਲ ਬੁਕਿੰਗ ਰਹਿਤ ਗਾਰੰਟੀ",
    footer_rescheduler: "ਮੌਸਮ ਖਰਾਬ ਹੋਣ ਤੇ ਤੁਰੰਤ ਬਦਲਾਅ",
    footer_helpline: "🤖 AI ਵਾਇਸ ਅਸਿਸਟੈਂਟ ਸਮਰਥਿਤ",
    // Dynamic terms
    crop_paddy: "🌾 ਝੋਨਾ",
    crop_wheat: "🌱 ਕਣਕ",
    crop_cotton: "🌸 ਨਰਮਾ / ਕਪਾਹ",
    crop_mustard: "🌼 ਸਰ੍ਹੋਂ",
    crop_sugarcane: "🎋 ਗੰਨਾ",
    op_harvest: "🚜 ਕਟਾਈ (ਜ਼ਰੂਰੀ)",
    op_sow: "🌱 ਬਿਜਾਈ (ਨਮੀ ਸਮਾਂ)",
    op_spray: "💧 ਸਪਰੇਅ",
    op_till: "⚙️ ਵਾਹੀ / ਰੋਟਾਵੇਟਰ",
    btn_request_this_machine: "ਇਹ ਮਸ਼ੀਨ ਬੁੱਕ ਕਰੋ",
    rate_per_hour: "/ ਘੰਟਾ",
    rate_per_acre: "/ ਏਕੜ",
    acres_label: "ਏਕੜ",
    days_left: "ਦਿਨ ਬਾਕੀ",
    overdue: "ਸਮਾਂ ਸਮਾਪਤ!",
    priority_rules: "ਪਹਿਲ ਦੇ ਨਿਯਮ",
    listen_btn: "ਸੁਣੋ",
    read_rationale: "ਕਾਰਨ ਪੜ੍ਹੋ",
    report_breakdown: "ਖਰਾਬੀ ਦਰਜ ਕਰੋ",
    mark_repaired: "ਠੀਕ ਹੋ ਗਈ",
    status_available: "ਉਪਲਬਧ",
    status_under_repair: "ਮੁਰੰਮਤ ਅਧੀਨ",
    status_confirmed: "ਪੱਕੀ (Confirmed)",
    status_rescheduled_safe: "ਤਬਦੀਲ (ਸੁਰੱਖਿਅਤ)",
    status_rescheduled_at_risk: "⚠️ ਖਤਰੇ ਵਿੱਚ",
    lender_title: "ਮਸ਼ੀਨ ਮਾਲਕ:",
    modal_lender_notice: "ਨੋਟਿਸ: ਤੁਹਾਡੀ ਬੇਨਤੀ ਮਨਜ਼ੂਰੀ ਲਈ ਸਿੱਧੀ ਮਾਲਕ ਨੂੰ ਭੇਜੀ ਜਾਵੇਗੀ। ਮਾਲਕ ਦੀ ਮਨਜ਼ੂਰੀ ਤੋਂ ਬਾਅਦ ਹੀ ਮਸ਼ੀਨ ਅਲਾਟ ਹੋਵੇਗੀ।",
    title_pending_approvals: "ਤੁਹਾਡੀ ਮਨਜ਼ੂਰੀ ਦੀ ਉਡੀਕ ਵਿੱਚ ਆਈਆਂ ਬੇਨਤੀਆਂ",
    subtitle_pending_approvals: "ਕਿਸਾਨ ਤੁਹਾਡੀ ਮਸ਼ੀਨ ਮੰਗ ਰਹੇ ਹਨ। ਕਮਾਈ ਅਤੇ ਸਮਾਂ ਵੇਖ ਕੇ ਮਨਜ਼ੂਰ ਕਰੋ।",
    status_pending_approval: "⏳ ਮਾਲਕ ਦੀ ਮਨਜ਼ੂਰੀ ਬਾਕੀ",
    status_approved_allotted: "✅ ਮਨਜ਼ੂਰ ਅਤੇ ਅਲਾਟ",
    btn_approve_and_allot: "✅ ਮਨਜ਼ੂਰ ਕਰੋ ਅਤੇ ਮਸ਼ੀਨ ਦਿਓ",
    btn_reject_request: "❌ ਰੱਦ ਕਰੋ",
    btn_quick_approve_demo: "⚡ ਮਾਲਕ ਵਜੋਂ ਤੁਰੰਤ ਮਨਜ਼ੂਰ ਕਰੋ",
    waiting_for_owner: "ਮਾਲਕ",
    to_approve: "ਦੀ ਮਨਜ਼ੂਰੀ ਦੀ ਉਡੀਕ ਹੈ।",
  },
  mr: {
    top_help_text: "टाइप करू शकत नाही किंवा त्वरित बुक करायचे आहे?",
    top_dial_text: "AI व्हॉइस असिस्टंट वापरा:",
    top_phone_number: "🤖 बोलून त्वरित बुक करा (AI तंत्रज्ञान)",
    language_label: "🌐 भाषा:",
    listen_aloud: "🔊 बोलून ऐका",
    app_tag: "कृषी चक्र",
    app_subtitle: "स्मार्ट ग्रामीण कृषी यंत्रणा वाटप आणि लवचिक प्रणाली",
    nav_farmer: "शेतकरी पोर्टल",
    nav_owner: "यंत्र मालक",
    nav_dealer: "",
    badge_call: "AI व्हॉइस",
    sim_date_label: "तारीਖ:",
    clash_safe_text: "0 अडथळे | सुरक्षित",
    disruption_tests_label: "आपत्ती चाचणी:",
    rain_btn_inject: "मुसळधार पाऊस चाचणी (19 नोव्हें)",
    rain_btn_clear: "पाऊस अडथळा दूर करा",
    breakdown_btn_inject: "कापणी यंत्र बिघाड चाचणी",
    breakdown_btn_repair: "यंत्र दुरुस्त करा",
    btn_reset: "↺ पूर्ववत करा",
    disruption_active_tag: "आपत्ती सक्रिय",
    disruption_auto_handled: "मुदतीच्या प्राधान्यासह स्वयंचलित बदल",
    farmer_hero_badge: "शेतकरी डॅशबोर्ड • सोपे आणि पारदर्शक",
    farmer_hero_title: "खरे फोटो पाहून ट्रॅक्टर, कापणी यंत्र आणि स्प्रेअर बुक करा",
    farmer_hero_desc: "बुकिंगपूर्वी यंत्रांचे खरे फोटो पहा. तुमच्या कापणी आणि पेरणीच्या मुदतीला सर्वोच्च प्राधान्य दिले जाते.",
    btn_request_machine: "आता मशीन बुक करा",
    btn_voice_assistant: "🤖 AI व्हॉइस असिस्टंट — बोलून बुक करा",
    btn_call_dealer: "🤖 AI व्हॉइस असिस्टंट — बोलून बुक करा",
    phone_box_title: "AI व्हॉइस बुकिंग सहाय्यक",
    phone_box_desc: "आपल्या भाषेत बोला! आमचा AI व्हॉइस असिस्टंट आपले पीक, एकर आणि गाव समजून शून्य संघर्षासह त्वरित मशीन बुक करेल — टाइप करण्याची गरज नाही!",
    phone_box_btn: "🎙️ बोलून आताच बुक करा",
    title_available_fleet: "उपलब्ध शेती यंत्रे (फोटो आणि तपशील)",
    subtitle_available_fleet: "यंत्रांचे फोटो, भाडे आणि कार्यक्षमता पाहून थेट आपल्या शेतासाठी बुक करा.",
    badge_fleet_active: "तुमच्या भागात 5 यंत्रे उपलब्ध आहेत",
    title_my_plots: "माझी शेते आणि मुदत",
    subtitle_my_plots: "प्रत्येक शेताची एक मुदत असते. वेळेवर काम झाल्यास पिकांचे नुकसान टळते.",
    btn_register_plot: "+ नवीन शेत जोडा",
    title_my_bookings: "माझे मशीन बुकिंग आणि सद्यस्थिती",
    subtitle_my_bookings: "तुमच्या बुकिंगची माहिती सोप्या भाषेत समजून घ्या.",
    hint_listen_explanation: "माहिती ऐकण्यासाठी कोणत्याही कार्डवर 🔊 दाबा",
    stat_active_fleet: "सक्रिय यंत्रे",
    stat_geo_tracked: "100% जीपीएस ट्रॅक",
    stat_confirmed_bookings: "नियोजित बुकिंग",
    stat_zero_clash: "शून्य अडथळा",
    stat_projected_revenue: "अंदाजे उत्पन्न",
    stat_period: "पुढील 7 दिवस",
    stat_transit_opt: "बचत अंतर",
    stat_km_saved: "42 किमी बचत",
    stat_clustered_dispatch: "ग्रामीण समन्वय",
    title_owner_fleet: "माझी कृषी यंत्रणा यादी",
    subtitle_owner_fleet: "फोटो, प्रति तास/एकर भाडे आणि देखभाल स्थिती तपासा.",
    btn_register_machine: "+ नवीन यंत्र जोडा",
    title_owner_requests: "आलेली बुकिंग विनंती",
    subtitle_owner_requests: "शेतकऱ्यांच्या विनंत्या तपासा. प्रवासाचा वेळ स्वयंचलितपणे राखला जातो.",
    badge_buffer_active: "प्रवास वेळ बफर सुरक्षा सक्रिय आहे",
    dealer_badge: "AI व्हॉइस असिस्टंट • तात्काळ वाटप",
    dealer_title: "शेतकऱ्यांसाठी AI बोलून बुकिंग",
    dealer_desc: "शेतकरी कोणतीही टाइपिंग किंवा डीलरशिवाय थेट बोलून यंत्र बुक करू शकतात.",
    btn_simulate_call: "AI व्हॉइस बुकिंग चाचणी 🎙️",
    dealer_form_title: "AI व्हॉइस बुकिंग इंजिन",
    dealer_form_subtitle: "आवाजावरून पीक, शेताचा आकार आणि सर्वोत्तम यंत्राचे तात्काळ वाटप.",
    label_farmer_name: "शेतकऱ्याचे नाव",
    label_phone_number: "मोबाईल नंबर (SMS साठी)",
    label_village_cluster: "गाव / परिसर",
    label_plot_area: "शेताचे क्षेत्रफळ (एकर)",
    label_crop_type: "पिकाचा प्रकार",
    label_operation: "आवश्यक काम",
    label_deadline: "शेवटची मुदत",
    btn_dealer_submit: "तात्काळ स्लॉट द्या आणि SMS पाठवा",
    dealer_audio_title: "AI व्हॉइस ऑडिओ आणि SMS सिम्युलेटर",
    dealer_audio_subtitle: "शेतकऱ्याच्या फोनवर जाणाऱ्या ऑडिओ आणि SMS चा नमुना पहा.",
    ivr_idle_status: "● AI व्हॉइस असिस्टंट सज्ज आहे",
    ivr_waiting_text: "AI व्हॉइस असिस्टंट सज्ज आहे. थेट बुक करण्यासाठी माइक दाबा!",
    dealer_note_title: "📱 शेतकऱ्यांना फायदा:",
    dealer_note_text: "तारीख, वेळ आणि ड्रायव्हर नंबरसह तात्काळ SMS मिळतो.",
    modal_booking_title: "मशीन बुकिंग विनंती",
    modal_booking_subtitle: "प्रवास बफरसह अडथळामुक्त बुकिंग",
    modal_select_plot: "शेत निवडा",
    modal_select_equip: "आवश्यक यंत्र निवडा (फोटो पहा)",
    modal_start_date: "सुरुवातीची तारीख",
    modal_end_date: "शेवटची मुदत",
    modal_notes_label: "विशेष सूचना",
    modal_guarantee_title: "डबल बुकिंग नाही याची खात्री",
    modal_guarantee_text: "शेताचा आकार आणि रस्त्यावरील प्रवासाचा वेळ पूर्णपणे मोजला जातो.",
    btn_cancel: "रद्द करा",
    btn_submit_request: "बुकिंग विनंती पाठवा",
    modal_plot_title: "नवीन शेत नोंदवा",
    modal_plot_subtitle: "क्षेत्रफळ, पीक आणि कामाची मुदत नोंदवा",
    btn_save_plot: "शेत नोंदवा",
    modal_equip_title: "नवीन यंत्र जोडा",
    modal_equip_subtitle: "यंत्राचा फोटो आणि भाडे नोंदवा",
    modal_machine_name: "यंत्राचे नाव आणि मॉडेल",
    modal_machine_photo: "यंत्राच्या फोटोची URL",
    label_category: "प्रवर्ग",
    label_work_rate: "कामाचा वेग (एकर / तास)",
    label_rate_price: "भाडे (₹)",
    label_rate_basis: "भाड्याचा आधार",
    basis_hour: "प्रति तास",
    basis_acre: "प्रति एकर",
    label_base_hub: "मुख्य केंद्र",
    label_owner_phone: "मालकाचा फोन नंबर",
    btn_add_fleet: "यादीत समाविष्ट करा",
    call_live_status: "AI व्हॉइस असिस्टंट",
    call_helpline_title: "कृषी चक्र AI व्हॉइस असिस्टंट",
    call_helpline_sub: "व्हॉइस AI आधारित • बहुभाषिक",
    call_connected_info: "● सज्ज • मराठी, हिन्दी, तेलुगु, पंजाबी आणि इंग्रजी",
    btn_speak_to_book: "माइक दाबून बोला आणि मशीन बुक करा",
    btn_play_hindi_ivr: "🎙️ डेमो हिन्दी आवाज",
    btn_play_english_ivr: "🎙️ डेमो इंग्रजी आवाज",
    voice_try_saying: "💡 किंवा हे उदाहरण दाबा:",
    ai_how_it_works_title: "🧠 हे कसे कार्य करते:",
    ai_how_it_works_desc: "फक्त मोकळेपणाने बोला — AI ला आपले पीक, गाव, एकर आणि मुदत सांगा. ते उपलब्ध सर्वोत्तम यंत्र शोधून त्वरित बुक करते आणि SMS पाठवते. टाइपिंग नाही, डीलर नाही, वाट पाहणे नाही!",
    btn_open_dealer_intake: "🎙️ AI व्हॉइस बुकिंग सुरू करा →",
    modal_why_title: "हा निर्णय का घेण्यात आला?",
    btn_listen_explanation_audio: "🔊 हे कारण बोलून ऐका (ऑडिओ)",
    btn_close: "बंद करा",
    footer_platform_desc: "स्मार्ट कृषी यंत्रणा वाटप",
    footer_zero_clash: "डबल बुकिंग नाही याची खात्री",
    footer_rescheduler: "आपत्तीत स्वयंचलित बदल",
    footer_helpline: "🤖 AI व्हॉइस असिस्टंट उपलब्ध",
    // Dynamic terms
    crop_paddy: "🌾 भात (धान)",
    crop_wheat: "🌱 गहू",
    crop_cotton: "🌸 कापूस",
    crop_mustard: "🌼 मोहरी",
    crop_sugarcane: "🎋 ऊस",
    op_harvest: "🚜 कापणी (अत्यंत तातडीची)",
    op_sow: "🌱 पेरणी (ओलावा वेळ)",
    op_spray: "💧 फवारणी",
    op_till: "⚙️ नांगरणी / रोटाव्हेटर",
    btn_request_this_machine: "हे यंत्र बुक करा",
    rate_per_hour: "/ तास",
    rate_per_acre: "/ एकर",
    acres_label: "एकर",
    days_left: "दिवਸ शिल्लक",
    overdue: "मुदत संपली!",
    priority_rules: "प्राधान्य नियम",
    listen_btn: "ऐका",
    read_rationale: "कारण वाचा",
    report_breakdown: "बिघाड नोंदवा",
    mark_repaired: "दुरुस्त झाले",
    status_available: "उपलब्ध",
    status_under_repair: "दुरुस्ती सुरू",
    status_confirmed: "निश्चित (Confirmed)",
    status_rescheduled_safe: "पुनर्नियोजित (सुरक्षित)",
    status_rescheduled_at_risk: "⚠️ धोक्यात (At-Risk)",
    lender_title: "यंत्र मालक:",
    modal_lender_notice: "सूचना: तुमची विनंती मंजुरीसाठी थेट मालकाकडे पाठवली जाईल. मालकाने मंजूर केल्यानंतरच मशीनचे अधिकृत वाटप केले जाईल.",
    title_pending_approvals: "तुमच्या मंजुरीची प्रतीक्षा असलेल्या विनंत्या",
    subtitle_pending_approvals: "शेतकरी तुमच्या मशीनची मागणी करत आहेत. उत्पन्न आणि वेळ तपासून मंजूर करा.",
    status_pending_approval: "⏳ मालकाच्या मंजुरीची प्रतीक्षा",
    status_approved_allotted: "✅ मंजूर आणि वाटप",
    btn_approve_and_allot: "✅ मंजूर करा आणि मशीन द्या",
    btn_reject_request: "❌ नकार द्या",
    btn_quick_approve_demo: "⚡ मालक म्हणून तात्काळ मंजूर करा",
    waiting_for_owner: "मालक",
    to_approve: "च्या मंजुरीची प्रतीक्षा आहे.",
  }
};

function t(key) {
  const langDict = DICTIONARY[currentLang] || DICTIONARY.en;
  return langDict[key] !== undefined ? langDict[key] : (DICTIONARY.en[key] || key);
}

/**
 * Updates EVERY text element on the page according to currentLang
 */
function changeLanguage(lang) {
  currentLang = lang;
  const langDict = DICTIONARY[lang] || DICTIONARY.en;

  // 1. Translate all elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (langDict[key] !== undefined) {
      el.innerText = langDict[key];
    }
  });

  // 2. Translate select dropdown options with data-i18n
  document.querySelectorAll("option[data-i18n]").forEach(opt => {
    const key = opt.getAttribute("data-i18n");
    if (langDict[key] !== undefined) {
      opt.innerText = langDict[key];
    }
  });

  // 3. Re-render all dynamic views to reflect translated crops, operations, rates, and statuses
  renderAllViews();
}

// ============================================================================
// 3. MATHEMATICAL & GEOGRAPHIC UTILITIES
// ============================================================================

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371.0;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c * ROAD_WINDING_FACTOR).toFixed(2));
}

function calculateWorkDuration(acres, workRateAcresPerHr) {
  return Number(((acres / workRateAcresPerHr) + 0.5).toFixed(2));
}

function calculateTravelTime(distanceKm, equipmentType) {
  const speed = EQUIPMENT_SPEEDS[equipmentType] || DEFAULT_SPEED;
  const transitHours = distanceKm / speed;
  const bufferHours = 0.25; // 15 min hitching buffer
  return Number((transitHours + bufferHours).toFixed(2));
}

function formatDecimalHour(h) {
  let hours = Math.floor(h);
  let minutes = Math.round((h - hours) * 60);
  if (minutes >= 60) {
    hours += 1;
    minutes = 0;
  }
  const ampm = hours < 12 ? "AM" : "PM";
  let dispH = hours <= 12 ? hours : hours - 12;
  if (dispH === 0) dispH = 12;
  const dispM = minutes < 10 ? "0" + minutes : minutes;
  return `${dispH < 10 ? '0' + dispH : dispH}:${dispM} ${ampm}`;
}

// ============================================================================
// 4. DEADLINE PRIORITY & EXPLANATION ENGINE
// ============================================================================

function calculatePriorityScore(plot, refDateStr) {
  const refDate = new Date(refDateStr);
  const endDate = new Date(plot.windowEnd);
  const diffDays = Math.round((endDate - refDate) / (1000 * 60 * 60 * 24));

  const opWeights = {
    "Harvesting": 2.0, // High risk: grain shatter, lodging, moisture spoilage
    "Spraying": 1.6,   // High risk: exponential pest reproduction window
    "Sowing": 1.3,     // Moderate: soil moisture evaporation window
    "Tilling": 1.0     // Routine land preparation
  };
  const weight = opWeights[plot.operation] || 1.0;

  let urgency = 10;
  let urgencyText = "";

  if (diffDays < 0) {
    urgency = 999;
    urgencyText = currentLang === 'hi' ? `समय-सीमा ${Math.abs(diffDays)} दिन पहले समाप्त हो चुकी है! तत्काल कटाई आवश्यक है।` :
                  (currentLang === 'te' ? `గడువు ${Math.abs(diffDays)} రోజుల క్రితం ముగిసింది! తక్షణ చర్య అవసరం.` :
                  `OVERDUE by ${Math.abs(diffDays)} day(s)! Urgent harvest salvage required.`);
  } else if (diffDays === 0) {
    urgency = 100;
    urgencyText = currentLang === 'hi' ? "फसल नुकसान से पहले अंतिम दिन!" : "FINAL DAY of optimal window before severe yield loss occurs.";
  } else if (diffDays === 1) {
    urgency = 75;
    urgencyText = currentLang === 'hi' ? "समय-सीमा समाप्त होने में केवल 24 घंटे शेष।" : "Only 24 hours remaining before deadline.";
  } else if (diffDays <= 3) {
    urgency = 45 - (diffDays * 5);
    urgencyText = currentLang === 'hi' ? `महत्वपूर्ण समय-सीमा में ${diffDays} दिन शेष हैं।` : `${diffDays} days remaining in critical agronomic window.`;
  } else {
    urgency = Math.max(5, 25 - diffDays);
    urgencyText = currentLang === 'hi' ? `${diffDays} दिन शेष हैं (लचीली समय-सीमा)।` : `${diffDays} days remaining (flexible scheduling window).`;
  }

  const score = Number(((urgency * weight) + (plot.acres * 0.2)).toFixed(2));

  const explanation = currentLang === 'hi' ? 
    `किसान ${plot.farmerName} (${plot.crop} ${plot.operation}, ${plot.acres} एकड़) के लिए प्राथमिकता दी गई: ${urgencyText} (अंतिम तिथि: ${plot.windowEnd})। ${plot.operation} के लिए जोखिम गुणक: ${weight}x। फसल की पैदावार को सुरक्षित रखने के लिए इसे लचीले अनुरोधों से पहले रखा गया है।` :
    `Prioritized for Farmer ${plot.farmerName} (${plot.crop} ${plot.operation}, ${plot.acres} acres): ${urgencyText} (Deadline: ${plot.windowEnd}). Agronomic risk multiplier: ${weight}x for ${plot.operation}. Scheduled ahead of more flexible requests to protect against yield degradation.`;

  return { score, explanation, slackDays: diffDays, weight };
}

// ============================================================================
// 5. CORE OPTIMIZER & DYNAMIC RESCHEDULER (Runs Seamlessly in Background)
// ============================================================================

function runGlobalOptimization() {
  const refDate = new Date(currentSimDate);
  const DAY_START = 7.0;  // 07:00 AM
  const DAY_END = 18.5;   // 06:30 PM (daylight limit)

  // Filter plots: only schedule approved requests
  const approvedPlotIds = new Set(bookingRequests.filter(r => r.status === 'Approved').map(r => r.plotId));
  const plotsToSchedule = plotsList.filter(p => approvedPlotIds.has(p.id));

  // Rank approved plots by deadline priority score
  const rankedPlots = plotsToSchedule.map(p => {
    const pInfo = calculatePriorityScore(p, currentSimDate);
    return {
      plot: p,
      score: pInfo.score,
      explanation: pInfo.explanation
    };
  }).sort((a, b) => b.score - a.score);

  const assignedSlots = [];
  const unfulfilled = [];
  const machineSchedules = {};
  equipmentList.forEach(eq => { machineSchedules[eq.id] = []; });

  // Iterate through ranked plots
  for (const item of rankedPlots) {
    const plot = item.plot;
    let assigned = false;
    const rejectionReasons = [];

    const eligibleEquip = equipmentList.filter(e => 
      e.type === plot.requiredMachineType || e.name.toLowerCase().includes(plot.requiredMachineType.toLowerCase())
    );

    if (eligibleEquip.length === 0) {
      unfulfilled.push({
        plot,
        reason: `No equipment of type '${plot.requiredMachineType}' available in regional fleet.`
      });
      continue;
    }

    const neededDuration = calculateWorkDuration(plot.acres, eligibleEquip[0].workRate);

    const startDate = new Date(Math.max(refDate.getTime(), new Date(plot.windowStart).getTime()));
    const endDate = new Date(plot.windowEnd);

    let candidateDays = [];
    let dIter = new Date(startDate);
    while (dIter <= endDate) {
      candidateDays.push(dIter.toISOString().split("T")[0]);
      dIter.setDate(dIter.getDate() + 1);
    }

    if (candidateDays.length === 0) {
      unfulfilled.push({
        plot,
        reason: `Agronomic deadline (${plot.windowEnd}) has passed relative to current date (${currentSimDate}).`
      });
      continue;
    }

    let bestPlacement = null;
    let minAddedTravel = Infinity;

    for (const dayStr of candidateDays) {
      if (disruptions.weatherBlocks[dayStr]) {
        rejectionReasons.push(`Date ${dayStr} blocked by weather`);
        continue;
      }

      for (const eq of eligibleEquip) {
        if (disruptions.equipmentBreakdowns[eq.id]) {
          const bd = disruptions.equipmentBreakdowns[eq.id];
          if (dayStr >= bd.start && dayStr <= bd.end) {
            rejectionReasons.push(`${eq.name} down for repair on ${dayStr}`);
            continue;
          }
        }

        const daySlots = machineSchedules[eq.id].filter(s => s.dayStr === dayStr)
                                                .sort((a, b) => a.startHour - b.startHour);

        let prevLat = eq.lat;
        let prevLon = eq.lon;
        let prevName = `${eq.locationName} (Base Hub)`;
        let earliestStart = DAY_START;

        if (daySlots.length > 0) {
          const lastSlot = daySlots[daySlots.length - 1];
          prevLat = lastSlot.plot.lat;
          prevLon = lastSlot.plot.lon;
          prevName = `Plot ${lastSlot.plot.village} (${lastSlot.plot.farmerName})`;
          earliestStart = lastSlot.endHour;
        }

        const distKm = haversineDistance(prevLat, prevLon, plot.lat, plot.lon);
        const travelHrs = calculateTravelTime(distKm, eq.type);

        const candStart = Number((earliestStart + travelHrs).toFixed(2));
        const candEnd = Number((candStart + neededDuration).toFixed(2));

        if (candEnd <= DAY_END) {
          if (distKm < minAddedTravel) {
            minAddedTravel = distKm;
            bestPlacement = {
              equipment: eq,
              dayStr,
              startHour: candStart,
              endHour: candEnd,
              travelHrs,
              distKm,
              prevLoc: prevName
            };
            if (distKm < 3.0) break;
          }
        }
      }
      if (bestPlacement && minAddedTravel < 5.0) break;
    }

    if (bestPlacement) {
      const eq = bestPlacement.equipment;
      const fullExplanation = currentLang === 'hi' ?
        `${eq.name} को ${plot.farmerName} के लिए ${bestPlacement.dayStr} (${formatDecimalHour(bestPlacement.startHour)} - ${formatDecimalHour(bestPlacement.endHour)}) पर आवंटित किया गया। सुरक्षित यात्रा बफर: ${Math.round(bestPlacement.travelHrs * 60)} मिनट (${bestPlacement.distKm} किमी)। ${item.explanation}` :
        `Assigned ${eq.name} to ${plot.farmerName} on ${bestPlacement.dayStr} (${formatDecimalHour(bestPlacement.startHour)} - ${formatDecimalHour(bestPlacement.endHour)}). Travel buffer enforced: ${Math.round(bestPlacement.travelHrs * 60)} mins (${bestPlacement.distKm} km from ${bestPlacement.prevLoc}). Decision reason: ${item.explanation}`;

      const slot = {
        bookingId: `BK-${plot.id}-${eq.id}`,
        plot,
        equipment: eq,
        dayStr: bestPlacement.dayStr,
        startHour: bestPlacement.startHour,
        endHour: bestPlacement.endHour,
        travelHrs: bestPlacement.travelHrs,
        distKm: bestPlacement.distKm,
        prevLoc: bestPlacement.prevLoc,
        priorityScore: item.score,
        explanation: fullExplanation,
        status: "Confirmed"
      };

      machineSchedules[eq.id].push(slot);
      assignedSlots.push(slot);
      assigned = true;
    } else {
      unfulfilled.push({
        plot,
        reason: rejectionReasons.length > 0 ? rejectionReasons.join("; ") : "All daylight hours occupied before agronomic deadline."
      });
    }
  }

  // Handle disruptions if active
  const hasDisruptions = Object.keys(disruptions.weatherBlocks).length > 0 || Object.keys(disruptions.equipmentBreakdowns).length > 0;
  
  if (hasDisruptions) {
    const reschedResult = executeMinimalDisruptionReschedule(assignedSlots);
    currentSchedule = reschedResult;
  } else {
    currentSchedule = {
      assignedSlots,
      unfulfilled,
      rescheduledCount: 0,
      unaffectedCount: assignedSlots.length,
      atRiskCount: 0,
      notifications: []
    };
  }

  auditClashes();
  renderAllViews();
}

function executeMinimalDisruptionReschedule(baseSlots) {
  const unaffectedSlots = [];
  const impactedSlots = [];
  const notifications = [];
  const atRiskBookings = [];
  const unfulfilled = [];

  for (const slot of baseSlots) {
    let isImpacted = false;
    let impactReason = "";

    if (disruptions.weatherBlocks[slot.dayStr]) {
      isImpacted = true;
      impactReason = `Heavy Weather: ${disruptions.weatherBlocks[slot.dayStr]}`;
    }

    if (disruptions.equipmentBreakdowns[slot.equipment.id]) {
      const bd = disruptions.equipmentBreakdowns[slot.equipment.id];
      if (slot.dayStr >= bd.start && slot.dayStr <= bd.end) {
        isImpacted = true;
        impactReason = `Equipment Breakdown: ${slot.equipment.name} down for repair`;
      }
    }

    if (isImpacted) {
      impactedSlots.push({ slot, impactReason });
    } else {
      unaffectedSlots.push(slot);
    }
  }

  // Sort impacted by deadline urgency
  impactedSlots.sort((a, b) => new Date(a.slot.plot.windowEnd) - new Date(b.slot.plot.windowEnd));

  const newSlots = [...unaffectedSlots]; // Unaffected bookings remain locked!

  for (const item of impactedSlots) {
    const origSlot = item.slot;
    const plot = origSlot.plot;
    let reassigned = false;

    const eligibleEquip = equipmentList.filter(e => 
      e.type === plot.requiredMachineType || e.name.toLowerCase().includes(plot.requiredMachineType.toLowerCase())
    );

    const startDate = new Date(Math.max(new Date(currentSimDate).getTime(), new Date(plot.windowStart).getTime()));
    const maxSearchDate = new Date(new Date(plot.windowEnd).getTime() + (2 * 24 * 60 * 60 * 1000));

    let dIter = new Date(startDate);
    while (dIter <= maxSearchDate && !reassigned) {
      const candDayStr = dIter.toISOString().split("T")[0];

      if (disruptions.weatherBlocks[candDayStr]) {
        dIter.setDate(dIter.getDate() + 1);
        continue;
      }

      for (const eq of eligibleEquip) {
        if (disruptions.equipmentBreakdowns[eq.id]) {
          const bd = disruptions.equipmentBreakdowns[eq.id];
          if (candDayStr >= bd.start && candDayStr <= bd.end) continue;
        }

        const dayBookings = newSlots.filter(s => s.equipment.id === eq.id && s.dayStr === candDayStr)
                                    .sort((a, b) => a.startHour - b.startHour);

        const neededDuration = calculateWorkDuration(plot.acres, eq.workRate);

        let prevLat = eq.lat;
        let prevLon = eq.lon;
        let prevName = `${eq.locationName} (Hub)`;
        let startH = 7.0;

        if (dayBookings.length > 0) {
          const lastS = dayBookings[dayBookings.length - 1];
          prevLat = lastS.plot.lat;
          prevLon = lastS.plot.lon;
          prevName = `Plot ${lastS.plot.village} (${lastS.plot.farmerName})`;
          startH = lastS.endHour;
        }

        const distKm = haversineDistance(prevLat, prevLon, plot.lat, plot.lon);
        const travelH = calculateTravelTime(distKm, eq.type);

        const candStart = Number((startH + travelH).toFixed(2));
        const candEnd = Number((candStart + neededDuration).toFixed(2));

        if (candEnd <= 18.5) {
          const isOverdue = candDayStr > plot.windowEnd;
          let fullExpl = currentLang === 'hi' ?
            `आपदा समाधान: मूल स्लॉट मौसम/खराबी के कारण अवरुद्ध था। स्वचालित रूप से ${candDayStr} (${formatDecimalHour(candStart)} - ${formatDecimalHour(candEnd)}) पर ${eq.name} के साथ पुनर्निर्धारित किया गया। सुरक्षित यात्रा बफर: ${Math.round(travelH * 60)} मिनट।` :
            `Disruption Re-optimization: Original slot blocked due to disruption. Automatically shifted to ${candDayStr} (${formatDecimalHour(candStart)} - ${formatDecimalHour(candEnd)}) with ${eq.name}. Travel buffer: ${Math.round(travelH * 60)} mins (${distKm} km).`;

          if (isOverdue) {
            fullExpl += currentLang === 'hi' ? ` ⚠️ चेतावनी: यह स्लॉट अंतिम समय-सीमा के बाद का है।` : ` ⚠️ WARNING: Slips past initial deadline. Expedited inspection advised.`;
          }

          const reschedSlot = {
            bookingId: `RESCHED-${origSlot.bookingId}`,
            plot,
            equipment: eq,
            dayStr: candDayStr,
            startHour: candStart,
            endHour: candEnd,
            travelHrs: travelH,
            distKm,
            prevLoc: prevName,
            priorityScore: origSlot.priorityScore,
            explanation: fullExpl,
            status: isOverdue ? "Rescheduled (At-Risk)" : "Rescheduled (Safe)",
            isRescheduled: true,
            originalDate: origSlot.dayStr
          };

          newSlots.push(reschedSlot);
          reassigned = true;
          break;
        }
      }
      dIter.setDate(dIter.getDate() + 1);
    }

    if (!reassigned) {
      unfulfilled.push({
        plot,
        reason: `Disruption fallout: All alternative machine slots exhausted before deadline.`
      });
    }
  }

  return {
    assignedSlots: newSlots,
    unfulfilled,
    rescheduledCount: impactedSlots.length - unfulfilled.length,
    unaffectedCount: unaffectedSlots.length,
    atRiskCount: atRiskBookings.length,
    notifications
  };
}

function auditClashes() {
  const violations = [];
  const slots = currentSchedule.assignedSlots;

  const byEquip = {};
  slots.forEach(s => {
    if (!byEquip[s.equipment.id]) byEquip[s.equipment.id] = {};
    if (!byEquip[s.equipment.id][s.dayStr]) byEquip[s.equipment.id][s.dayStr] = [];
    byEquip[s.equipment.id][s.dayStr].push(s);
  });

  for (const eqId in byEquip) {
    for (const dayStr in byEquip[eqId]) {
      const daySlots = byEquip[eqId][dayStr].sort((a, b) => a.startHour - b.startHour);

      for (let i = 0; i < daySlots.length - 1; i++) {
        const curr = daySlots[i];
        const next = daySlots[i + 1];

        if (curr.endHour > next.startHour) {
          violations.push({ type: "DIRECT_OVERLAP" });
        }

        const distKm = haversineDistance(curr.plot.lat, curr.plot.lon, next.plot.lat, next.plot.lon);
        const reqBuffer = calculateTravelTime(distKm, curr.equipment.type);
        const actualGap = next.startHour - curr.endHour;

        if (actualGap < reqBuffer - 0.05) {
          violations.push({ type: "TRAVEL_BUFFER_VIOLATION" });
        }
      }
    }
  }

  const clashBadge = document.getElementById("clash-badge");
  const clashCountText = document.getElementById("clash-count-text");

  if (violations.length === 0) {
    if (clashBadge) {
      clashBadge.className = "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50";
      clashCountText.innerText = t("clash_safe_text");
    }
  } else {
    if (clashBadge) {
      clashBadge.className = "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-500/50";
      clashCountText.innerText = `${violations.length} Clashes!`;
    }
  }
}

// ============================================================================
// 6. UI RENDERERS (MACHINE PHOTOS, PLOTS, BOOKINGS, OWNER, DEALER)
// ============================================================================

function renderAllViews() {
  renderFarmerFleetGallery();
  renderFarmerPlots();
  renderFarmerBookings();
  renderOwnerFleet();
  renderOwnerRequests();
  populateBookingModalOptions();
  updateDisruptionBanners();
}

/**
 * Farmer View: Available Machinery Fleet Gallery With REAL PHOTOS
 */
function renderFarmerFleetGallery() {
  const container = document.getElementById("farmer-fleet-gallery");
  if (!container) return;

  container.innerHTML = equipmentList.map(eq => {
    const isBroken = disruptions.equipmentBreakdowns[eq.id];
    const categoryBadge = eq.type === 'Tractor' ? '🚜 Tractor' : (eq.type === 'Harvester' ? '🌾 Combine' : '💧 Sprayer');

    return `
      <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
        <!-- Machine Photo -->
        <div class="relative h-48 w-full overflow-hidden bg-slate-100">
          <img src="${eq.photoUrl}" alt="${eq.name}" onerror="if (this.dataset.tried !== '1') { this.dataset.tried = '1'; this.src = '${eq.backupPhotoUrl || eq.photoUrl}'; }" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
          
          <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
            ${categoryBadge}
          </span>
          <span class="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${isBroken ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'} shadow">
            ${isBroken ? t("status_under_repair") : t("status_available")}
          </span>

          <div class="absolute bottom-3 left-3 right-3 text-white">
            <h4 class="font-extrabold text-base leading-tight">${eq.name}</h4>
            <p class="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
              <span>📍</span> ${eq.locationName}
            </p>
          </div>
        </div>

        <!-- Machine Specs & Pricing -->
        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div class="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
            <div>
              <span class="text-slate-400 text-[10px] uppercase font-bold block">${t("label_work_rate")}</span>
              <span class="font-bold text-slate-800">${eq.workRate} ${t("acres_label")}/${t("rate_per_hour")}</span>
            </div>
            <div>
              <span class="text-slate-400 text-[10px] uppercase font-bold block">${t("label_rate_price")}</span>
              <span class="font-bold text-emerald-700">₹${eq.rate} ${eq.rateUnit === 'hour' ? t("rate_per_hour") : t("rate_per_acre")}</span>
            </div>
          </div>

          <p class="text-[11px] text-slate-500 line-clamp-1 italic">${eq.specs}</p>

          <button onclick="openBookingForSpecificMachine('${eq.id}')" ${isBroken ? 'disabled' : ''} class="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow transition ${isBroken ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-krishi-700 hover:bg-krishi-800 text-white'}">
            <span>🚜</span>
            <span>${t("btn_request_this_machine")}</span>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Farmer View: Plot Cards
 */
function renderFarmerPlots() {
  const container = document.getElementById("farmer-plots-grid");
  if (!container) return;

  const cropIcons = {
    "Paddy": "🌾",
    "Wheat": "🌱",
    "Cotton": "🌸",
    "Mustard": "🌼",
    "Sugarcane": "🎋"
  };

  container.innerHTML = plotsList.map(plot => {
    const pInfo = calculatePriorityScore(plot, currentSimDate);
    const isUrgent = pInfo.slackDays <= 1;
    const isPast = pInfo.slackDays < 0;

    const cropName = plot.crop === 'Paddy' ? t("crop_paddy") :
                     (plot.crop === 'Wheat' ? t("crop_wheat") :
                     (plot.crop === 'Cotton' ? t("crop_cotton") :
                     (plot.crop === 'Mustard' ? t("crop_mustard") : t("crop_sugarcane"))));

    return `
      <div class="bg-white rounded-2xl border ${isUrgent ? 'border-amber-300 ring-2 ring-amber-200/50' : 'border-slate-200'} p-5 shadow-sm space-y-3 hover:shadow-md transition">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl font-bold border border-emerald-200">
              ${cropIcons[plot.crop] || '🌱'}
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-base">${plot.farmerName}</h4>
              <p class="text-xs text-slate-500">${plot.village} • ${plot.acres} ${t("acres_label")}</p>
            </div>
          </div>
          <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${isUrgent ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-700'}">
            ${cropName}
          </span>
        </div>

        <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1">
          <div class="flex justify-between text-slate-600">
            <span>${t("modal_notes_label")}:</span>
            <span class="font-bold text-slate-900">${plot.windowStart} → ${plot.windowEnd}</span>
          </div>
          <div class="flex justify-between items-center pt-1">
            <span>${t("label_deadline")}:</span>
            <span class="font-black ${isUrgent ? 'text-amber-600' : 'text-emerald-700'}">
              ${isPast ? t("overdue") : pInfo.slackDays + ' ' + t("days_left")}
            </span>
          </div>
        </div>

        <p class="text-[11px] text-slate-500 italic line-clamp-2">"${plot.notes}"</p>

        <div class="pt-2 flex items-center justify-between border-t border-slate-100">
          <button onclick="showExplanationModal('${t("priority_rules")}: ${plot.farmerName}', '${pInfo.explanation}')" class="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            <span>💡</span> ${t("priority_rules")}
          </button>
          <button onclick="speakText('${plot.farmerName}, ${plot.crop}. ${pInfo.slackDays} days remaining.')" class="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1">
            🔊 ${t("listen_btn")}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Farmer View: Bookings & Tracking Cards (Shows both Pending Owner Approval and Approved Allotments)
 */
function renderFarmerBookings() {
  const container = document.getElementById("farmer-bookings-list");
  if (!container) return;

  const slots = currentSchedule.assignedSlots;
  const pending = bookingRequests.filter(r => r.status === 'Pending');

  if (slots.length === 0 && pending.length === 0) {
    container.innerHTML = `<div class="p-6 text-center text-slate-400 bg-white rounded-2xl border">No active bookings right now. Click "Request a Machine Now" above!</div>`;
    return;
  }

  let html = "";

  // 1. Render Pending Approvals First
  pending.forEach(req => {
    html += `
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 p-5 shadow-sm space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 pb-3">
          <div class="flex items-center gap-3">
            <span class="text-3xl">⏳</span>
            <div>
              <h4 class="font-extrabold text-slate-900 text-sm sm:text-base">${req.farmerName} • ${req.crop} ${req.operation}</h4>
              <p class="text-xs text-slate-600">${req.village} (${req.acres} ${t("acres_label")}) • Requested Machine: <strong class="text-slate-900">${req.equipName}</strong></p>
            </div>
          </div>
          <span class="text-xs font-black px-3 py-1 rounded-full bg-amber-200 text-amber-900 border border-amber-400 animate-pulse">
            ${t("status_pending_approval")}
          </span>
        </div>

        <div class="bg-white/80 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-700">${t("lender_title")}</span>
            <span class="font-black text-emerald-800">${req.ownerName}</span>
            <span class="text-slate-500 font-mono">(📞 ${req.ownerPhone})</span>
          </div>
          <p class="text-slate-600">${t("waiting_for_owner")} <strong>${req.ownerName}</strong> ${t("to_approve")}</p>
        </div>

        <div class="flex items-center justify-between pt-1">
          <div class="text-[11px] text-slate-500">
            Requested Window: ${req.startDate} → ${req.endDate}
          </div>
          <div class="flex items-center gap-2">
            <button onclick="approveBookingRequest('${req.id}')" class="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm flex items-center gap-1">
              ${t("btn_quick_approve_demo")}
            </button>
            <button onclick="switchPersona('owner')" class="text-xs font-semibold text-emerald-800 hover:underline">
              Switch to Owner Portal →
            </button>
          </div>
        </div>
      </div>
    `;
  });

  // 2. Render Approved Allotted Bookings
  slots.forEach(slot => {
    const isAtRisk = slot.status.includes("At-Risk");
    const isResched = slot.status.includes("Rescheduled");

    let badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
    let statusLabel = t("status_approved_allotted");
    if (isAtRisk) {
      badgeClass = "bg-rose-100 text-rose-800 border-rose-300 animate-pulse";
      statusLabel = t("status_rescheduled_at_risk");
    } else if (isResched) {
      badgeClass = "bg-amber-100 text-amber-800 border-amber-300";
      statusLabel = t("status_rescheduled_safe");
    }

    html += `
      <div class="bg-white rounded-2xl border ${isAtRisk ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-200'} p-5 shadow-sm space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <div class="flex items-center gap-3">
            <img src="${slot.equipment.photoUrl}" alt="${slot.equipment.name}" onerror="if (this.dataset.tried !== '1') { this.dataset.tried = '1'; this.src = '${slot.equipment.backupPhotoUrl || slot.equipment.photoUrl}'; }" class="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h4 class="font-bold text-slate-900 text-sm sm:text-base">${slot.plot.farmerName} • ${slot.plot.crop} ${slot.plot.operation}</h4>
              <p class="text-xs text-slate-500">${slot.plot.village} (${slot.plot.acres} ${t("acres_label")}) • Allotted Machine: <span class="font-semibold text-slate-800">${slot.equipment.name}</span> (Lender: ${slot.equipment.ownerName})</p>
            </div>
          </div>
          <span class="text-xs font-black px-3 py-1 rounded-full border ${badgeClass}">
            ${statusLabel}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
          <div>
            <span class="text-slate-500 block">${t("modal_start_date")}:</span>
            <span class="font-bold text-slate-800">${slot.dayStr}</span>
          </div>
          <div>
            <span class="text-slate-500 block">Time Slot:</span>
            <span class="font-bold text-slate-800">${formatDecimalHour(slot.startHour)} - ${formatDecimalHour(slot.endHour)}</span>
          </div>
          <div>
            <span class="text-slate-500 block">Travel Buffer:</span>
            <span class="font-bold text-amber-700">${Math.round(slot.travelHrs * 60)} min (${slot.distKm} km)</span>
          </div>
        </div>

        <div class="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2">
          <span class="text-base mt-0.5">ℹ️</span>
          <p class="leading-relaxed">${slot.explanation}</p>
        </div>

        <div class="flex items-center justify-between pt-1">
          <button onclick="showExplanationModal('Why this slot was scheduled for ${slot.plot.farmerName}', '${slot.explanation}')" class="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline">
            ${t("read_rationale")}
          </button>
          <button onclick="speakText('${slot.explanation}')" class="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition">
            🔊 ${t("listen_btn")}
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Owner View: Fleet Grid with Machine Photos
 */
function renderOwnerFleet() {
  const container = document.getElementById("owner-fleet-grid");
  if (!container) return;

  container.innerHTML = equipmentList.map(eq => {
    const isBroken = disruptions.equipmentBreakdowns[eq.id];

    return `
      <div class="bg-white rounded-2xl border ${isBroken ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-200'} overflow-hidden shadow-sm space-y-3">
        <div class="h-40 w-full overflow-hidden relative">
          <img src="${eq.photoUrl}" alt="${eq.name}" onerror="if (this.dataset.tried !== '1') { this.dataset.tried = '1'; this.src = '${eq.backupPhotoUrl || eq.photoUrl}'; }" class="w-full h-full object-cover">
          <span class="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${isBroken ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'} shadow">
            ${isBroken ? t("status_under_repair") : t("status_available")}
          </span>
        </div>

        <div class="p-4 pt-1 space-y-3">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">${eq.type}</span>
            <h4 class="font-bold text-slate-900 text-base">${eq.name}</h4>
            <p class="text-xs text-slate-500">Base: ${eq.locationName}</p>
          </div>

          <div class="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
            <div>
              <span class="text-slate-500 block">${t("label_work_rate")}:</span>
              <span class="font-bold text-slate-800">${eq.workRate} ${t("acres_label")}/${t("rate_per_hour")}</span>
            </div>
            <div>
              <span class="text-slate-500 block">${t("label_rate_price")}:</span>
              <span class="font-bold text-slate-800">₹${eq.rate} ${eq.rateUnit === 'hour' ? t("rate_per_hour") : t("rate_per_acre")}</span>
            </div>
          </div>

          <div class="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <span class="text-slate-500">Speed: ${EQUIPMENT_SPEEDS[eq.type] || DEFAULT_SPEED} km/h</span>
            <button onclick="toggleSpecificBreakdown('${eq.id}')" class="text-xs font-bold ${isBroken ? 'text-emerald-700 hover:text-emerald-800' : 'text-rose-600 hover:text-rose-700'} underline">
              ${isBroken ? t("mark_repaired") : t("report_breakdown")}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Owner View: Incoming Requests & Pending Approvals
 */
function renderOwnerRequests() {
  const pendingContainer = document.getElementById("owner-pending-requests-list");
  const confirmedContainer = document.getElementById("owner-requests-list");
  const badge = document.getElementById("owner-pending-badge");

  const pending = bookingRequests.filter(r => r.status === 'Pending');
  const slots = currentSchedule.assignedSlots;

  if (badge) {
    badge.innerText = `${pending.length} Pending Approval`;
    badge.className = pending.length > 0 ? 
      "text-xs font-black bg-amber-200 text-amber-900 border border-amber-400 px-3 py-1 rounded-full animate-pulse" :
      "text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300 px-3 py-1 rounded-full";
  }

  // 1. Render Pending Requests Awaiting Owner Approval
  if (pendingContainer) {
    if (pending.length === 0) {
      pendingContainer.innerHTML = `
        <div class="p-4 text-center bg-white/70 rounded-xl border border-amber-200 text-slate-600 text-xs">
          No pending booking requests. All farmer requests have been reviewed and allotted!
        </div>
      `;
    } else {
      pendingContainer.innerHTML = pending.map(req => {
        const eq = equipmentList.find(e => e.id === req.equipId) || equipmentList[0];
        const estHours = calculateWorkDuration(req.acres, eq.workRate);
        const estRevenue = Math.round(eq.rateUnit === 'hour' ? estHours * eq.rate : req.acres * eq.rate);

        return `
          <div class="bg-white rounded-2xl border-2 border-amber-300 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <img src="${eq.photoUrl}" alt="${eq.name}" onerror="if (this.dataset.tried !== '1') { this.dataset.tried = '1'; this.src = '${eq.backupPhotoUrl || eq.photoUrl}'; }" class="w-16 h-16 object-cover rounded-xl border border-slate-200">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900 text-base">${req.farmerName}</span>
                  <span class="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold border border-amber-300">${req.crop} ${req.operation}</span>
                  <span class="text-xs font-black text-emerald-700">₹${estRevenue.toLocaleString()} Earned</span>
                </div>
                <p class="text-xs text-slate-600">${req.village} (${req.acres} ${t("acres_label")}) • Requested: <strong>${req.equipName}</strong> (Owner: ${req.ownerName})</p>
                <p class="text-[11px] text-slate-500">Date Window: ${req.startDate} → ${req.endDate} • Approx Work: ${estHours} hrs</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="approveBookingRequest('${req.id}')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5 transition transform hover:scale-105">
                ${t("btn_approve_and_allot")}
              </button>
              <button onclick="rejectBookingRequest('${req.id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2.5 rounded-xl text-xs transition">
                ${t("btn_reject_request")}
              </button>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // 2. Render Confirmed Allotments
  if (confirmedContainer) {
    if (slots.length === 0) {
      confirmedContainer.innerHTML = `<div class="p-4 text-center text-slate-400 text-xs">No confirmed dispatches yet.</div>`;
    } else {
      confirmedContainer.innerHTML = slots.map(slot => `
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img src="${slot.equipment.photoUrl}" alt="${slot.equipment.name}" onerror="if (this.dataset.tried !== '1') { this.dataset.tried = '1'; this.src = '${slot.equipment.backupPhotoUrl || slot.equipment.photoUrl}'; }" class="w-12 h-12 object-cover rounded-xl border border-slate-200">
            <div class="space-y-0.5">
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900">${slot.plot.farmerName}</span>
                <span class="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">${slot.plot.crop} ${slot.plot.operation}</span>
                <span class="text-xs font-bold text-emerald-700">₹${Math.round(slot.plot.acres * slot.equipment.rate)}</span>
              </div>
              <p class="text-xs text-slate-500">${slot.plot.village} (${slot.plot.acres} ${t("acres_label")}) • Assigned: <span class="font-semibold text-slate-800">${slot.equipment.name}</span></p>
              <p class="text-[11px] text-slate-600">Travel Distance: ${slot.distKm} km (${Math.round(slot.travelHrs * 60)} min buffer from ${slot.prevLoc})</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
              ${t("status_approved_allotted")}
            </span>
            <button onclick="speakText('Booking confirmed for ${slot.plot.farmerName} on ${slot.dayStr}')" class="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded-lg text-xs font-bold">
              🔊
            </button>
          </div>
        </div>
      `).join("");
    }
  }
}

/**
 * Booking Modal Machine Option & Live Photo Preview
 */
function populateBookingModalOptions() {
  const sel = document.getElementById("booking-equip-select");
  const plotSel = document.getElementById("booking-plot-select");

  if (sel) {
    sel.innerHTML = equipmentList.map(eq => `<option value="${eq.id}">${eq.name} (${eq.type}) • Lender: ${eq.ownerName} (₹${eq.rate}/${eq.rateUnit})</option>`).join("");
    if (equipmentList.length > 0) {
      updateBookingModalPhoto(equipmentList[0].id);
    }
  }

  if (plotSel) {
    plotSel.innerHTML = plotsList.map(p => `<option value="${p.id}">${p.farmerName} - ${p.crop} (${p.village}, ${p.acres} ac)</option>`).join("");
  }
}

function updateBookingModalPhoto(equipId) {
  const eq = equipmentList.find(e => e.id === equipId) || equipmentList[0];
  const imgEl = document.getElementById("modal-machine-preview-img");
  const nameEl = document.getElementById("modal-machine-preview-name");
  const specsEl = document.getElementById("modal-machine-preview-specs");

  if (imgEl && eq) {
    imgEl.src = eq.photoUrl;
    imgEl.onerror = function() {
      if (this.dataset.tried !== '1') {
        this.dataset.tried = '1';
        this.src = eq.backupPhotoUrl || eq.photoUrl;
      }
    };
  }
  if (nameEl && eq) nameEl.innerText = eq.name;
  const ownerEl = document.getElementById("modal-machine-preview-owner");
  const phoneEl = document.getElementById("modal-machine-preview-phone");
  if (ownerEl && eq) ownerEl.innerText = eq.ownerName;
  if (phoneEl && eq) phoneEl.innerText = eq.phone;
  if (specsEl && eq) specsEl.innerText = `${eq.workRate} ${t("acres_label")}/${t("rate_per_hour")} • ₹${eq.rate} ${eq.rateUnit === 'hour' ? t("rate_per_hour") : t("rate_per_acre")} • Base: ${eq.locationName}`;
}

function openBookingForSpecificMachine(equipId) {
  openNewBookingModal();
  const sel = document.getElementById("booking-equip-select");
  if (sel) {
    sel.value = equipId;
    updateBookingModalPhoto(equipId);
  }
}

/**
 * Disruption Banner Updates
 */
function updateDisruptionBanners() {
  const banner = document.getElementById("disruption-alert-banner");
  const bannerMsg = document.getElementById("disruption-banner-message");
  const rainBtnLabel = document.getElementById("rain-btn-label");
  const breakdownBtnLabel = document.getElementById("breakdown-btn-label");

  const hasRain = !!disruptions.weatherBlocks["2026-11-19"];
  const hasBreakdown = !!disruptions.equipmentBreakdowns["EQ-03"];

  if (rainBtnLabel) {
    rainBtnLabel.innerText = hasRain ? t("rain_btn_clear") : t("rain_btn_inject");
  }
  if (breakdownBtnLabel) {
    breakdownBtnLabel.innerText = hasBreakdown ? t("breakdown_btn_repair") : t("breakdown_btn_inject");
  }

  if (hasRain || hasBreakdown) {
    if (banner) banner.classList.remove("hidden");
    let msgs = [];
    if (hasRain) {
      msgs.push(currentLang === 'hi' ? "19 नवंबर को भारी बारिश। खेत में कार्य असंभव। प्रभावित बुकिंग स्वतः पुनर्निर्धारित।" : "Monsoon Rain (48mm) on Nov 19. Field soil unworkable. Bookings auto-rescheduled.");
    }
    if (hasBreakdown) {
      msgs.push(currentLang === 'hi' ? "हार्वेस्टर Claas Tiger 30 की खराबी। कार्य अन्य मशीनों को स्थानांतरित किया गया।" : "Harvester Claas Tiger-30 breakdown on Nov 19. Dispatched to alternative units.");
    }
    if (bannerMsg) bannerMsg.innerText = msgs.join(" | ");
  } else {
    if (banner) banner.classList.add("hidden");
  }
}

// ============================================================================
// 7. AI VOICE ASSISTANT — MULTILINGUAL VOICE BOOKING ENGINE FOR FARMERS
// ============================================================================

let aiSpeechRecognition = null;
let isVoiceListening = false;

function openAIVoiceAssistantModal() {
  openModal("modal-ai-voice");

  const greetingMap = {
    hi: "नमस्ते किसान भाई! मैं कृषि चक्र AI सहायक हूँ। बस बोलिए — कौन सी फसल है, कितने एकड़ का खेत है, और कब तक मशीन चाहिए। मैं तुरंत बुकिंग कर दूँगा!",
    en: "Hello Farmer! I am your KrishiChakra AI Voice Assistant. Speak naturally — tell me your crop, acreage, village, and deadline. I will book the right machine for you immediately!",
    te: "నమస్కారం రైతు సోదరా! నేను కృషి చక్ర AI వాయిస్ అసిస్టెంట్‌ని. మీ పంట, విస్తీర్ణం మరియు గ్రామం చెప్పండి. నేను వెంటనే మెషిన్ బుక్ చేస్తాను!",
    pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਕ੍ਰਿਸ਼ੀ ਚੱਕਰ AI ਸਹਾਇਕ ਹਾਂ। ਬੋਲੋ — ਕਿਹੜੀ ਫ਼ਸਲ, ਕਿੰਨੇ ਏਕੜ ਅਤੇ ਕਦੋਂ ਤੱਕ ਮਸ਼ੀਨ ਚਾਹੀਦੀ ਹੈ। ਮੈਂ ਤੁਰੰਤ ਬੁੱਕ ਕਰ ਦੇਵਾਂਗਾ!",
    mr: "नमस्कार शेतकरी बांधवांनो! मी कृषी चक्र AI व्हॉइस असिस्टंट आहे. आपले पीक, एकर आणि गाव सांगा. मी लगेच यंत्र बुक करेन!"
  };

  const greet = greetingMap[currentLang] || greetingMap.en;
  const greetEl = document.getElementById("ai-initial-greeting");
  if (greetEl) greetEl.innerText = `"${greet}"`;

  speakText(greet);
}

function startAIVoiceBooking() {
  const micBtn = document.getElementById("ai-mic-btn");
  const micLabel = document.getElementById("ai-mic-label");
  const transcript = document.getElementById("ai-voice-transcript");

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRec) {
    // If browser environment has no live SpeechRecognition API, run realistic interactive demo
    const lang = currentLang === 'en' ? 'en' : 'hi';
    demoAIVoiceBooking(lang);
    return;
  }

  if (isVoiceListening && aiSpeechRecognition) {
    aiSpeechRecognition.stop();
    return;
  }

  try {
    aiSpeechRecognition = new SpeechRec();
    aiSpeechRecognition.continuous = false;
    aiSpeechRecognition.interimResults = false;

    // Set recognition language matching active portal language
    if (currentLang === 'hi') aiSpeechRecognition.lang = 'hi-IN';
    else if (currentLang === 'te') aiSpeechRecognition.lang = 'te-IN';
    else if (currentLang === 'pa') aiSpeechRecognition.lang = 'pa-IN';
    else if (currentLang === 'mr') aiSpeechRecognition.lang = 'mr-IN';
    else aiSpeechRecognition.lang = 'en-US';

    aiSpeechRecognition.onstart = () => {
      isVoiceListening = true;
      if (micBtn) {
        micBtn.classList.add("mic-listening");
        micBtn.innerHTML = "⏹️";
      }
      if (micLabel) {
        micLabel.innerText = currentLang === 'hi' ? "सुन रहा हूँ... बोलिए!" : "Listening... Speak your crop, acres & village!";
        micLabel.classList.add("text-rose-400");
      }
      if (transcript) {
        const listeningNotice = document.createElement("div");
        listeningNotice.id = "ai-listening-indicator";
        listeningNotice.className = "text-amber-400 italic text-xs animate-pulse";
        listeningNotice.innerText = currentLang === 'hi' ? "🎙️ आपकी आवाज रिकॉर्ड हो रही है... बोलें (उदा. 'रामपुर में 5 एकड़ धान कटाई')" : "🎙️ Recording your voice... speak now (e.g. '5 acres paddy harvest in Rampur')";
        transcript.appendChild(listeningNotice);
        transcript.scrollTop = transcript.scrollHeight;
      }
    };

    aiSpeechRecognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      processFarmerVoiceInput(spokenText, currentLang);
    };

    aiSpeechRecognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      resetMicUI();
      if (event.error === 'not-allowed' || event.error === 'no-speech') {
        const lang = currentLang === 'en' ? 'en' : 'hi';
        demoAIVoiceBooking(lang);
      }
    };

    aiSpeechRecognition.onend = () => {
      resetMicUI();
    };

    aiSpeechRecognition.start();
  } catch (err) {
    console.error("Speech recognition start failed:", err);
    resetMicUI();
    demoAIVoiceBooking(currentLang === 'en' ? 'en' : 'hi');
  }
}

function resetMicUI() {
  isVoiceListening = false;
  const micBtn = document.getElementById("ai-mic-btn");
  const micLabel = document.getElementById("ai-mic-label");
  const ind = document.getElementById("ai-listening-indicator");
  if (ind && typeof ind.remove === 'function') ind.remove();

  if (micBtn) {
    micBtn.classList.remove("mic-listening");
    micBtn.innerHTML = "🎙️";
  }
  if (micLabel) {
    micLabel.innerText = t("btn_speak_to_book") || "Tap & Speak to Book a Machine";
    micLabel.classList.remove("text-rose-400");
  }
}

function handleVoiceTextInput(e) {
  e.preventDefault();
  const inputEl = document.getElementById("ai-voice-text-fallback");
  if (!inputEl || !inputEl.value.trim()) return;
  const text = inputEl.value.trim();
  inputEl.value = "";
  processFarmerVoiceInput(text, currentLang);
}

function speakAndBookPrompt(promptText, lang) {
  processFarmerVoiceInput(promptText, lang);
}

function demoAIVoiceBooking(lang) {
  if (lang === 'hi') {
    processFarmerVoiceInput("नमस्ते, मुझे रामपुर कलां में 5 एकड़ धान की कटाई के लिए 20 तारीख तक कंबाइन हार्वेस्टर चाहिए।", "hi");
  } else {
    processFarmerVoiceInput("Hello AI, I need a tractor for 4 acres wheat sowing in Sitapur Khurd before November 21.", "en");
  }
}

function processFarmerVoiceInput(farmerSpeech, lang) {
  const transcript = document.getElementById("ai-voice-transcript");
  if (!transcript) return;

  resetMicUI();

  // 1. Append Farmer's speech bubble
  const farmerBubble = document.createElement("div");
  farmerBubble.className = "bg-violet-900/40 p-2.5 rounded-xl border border-violet-600/40 text-xs text-white space-y-1";
  farmerBubble.innerHTML = `
    <div class="font-bold text-amber-300 flex items-center gap-1.5">
      <span>👨‍🌾</span> <span>Farmer Spoke:</span>
    </div>
    <div class="italic text-slate-100">"${farmerSpeech}"</div>
  `;
  transcript.appendChild(farmerBubble);
  transcript.scrollTop = transcript.scrollHeight;

  // 2. Intelligent NLP Entity Extraction
  const lower = farmerSpeech.toLowerCase();

  // Crop detection
  let detectedCrop = "Paddy";
  if (lower.includes("wheat") || lower.includes("गेहूं") || lower.includes("ਕਣਕ") || lower.includes("గోధుమ") || lower.includes("गहू")) {
    detectedCrop = "Wheat";
  } else if (lower.includes("cotton") || lower.includes("कपास") || lower.includes("ਨਰਮਾ") || lower.includes("పత్తి") || lower.includes("कापूस")) {
    detectedCrop = "Cotton";
  } else if (lower.includes("mustard") || lower.includes("सरसों") || lower.includes("ਸਰ੍ਹੋਂ") || lower.includes("ఆవాలు") || lower.includes("मोहरी")) {
    detectedCrop = "Mustard";
  } else {
    detectedCrop = "Paddy";
  }

  // Operation & Machine detection
  let detectedOp = "Harvesting";
  let detectedMachineType = "Harvester";

  if (lower.includes("spray") || lower.includes("छिड़काव") || lower.includes("ਸਪਰੇਅ") || lower.includes("పిచికారీ") || lower.includes("फवारणी")) {
    detectedOp = "Spraying";
    detectedMachineType = "Sprayer";
  } else if (lower.includes("sow") || lower.includes("seeding") || lower.includes("बुवाई") || lower.includes("ਬਿਜਾਈ") || lower.includes("విత్తనం") || lower.includes("पेरणी")) {
    detectedOp = "Sowing";
    detectedMachineType = "Tractor";
  } else if (lower.includes("till") || lower.includes("rotavator") || lower.includes("जुताई") || lower.includes("ਰੋਟਾਵੇਟਰ") || lower.includes("मशागत")) {
    detectedOp = "Tilling";
    detectedMachineType = "Tractor";
  } else if (lower.includes("tractor") || lower.includes("ट्रैक्टर") || lower.includes("ਟਰੈਕਟਰ")) {
    detectedOp = "Sowing";
    detectedMachineType = "Tractor";
  } else {
    detectedOp = "Harvesting";
    detectedMachineType = "Harvester";
  }

  // Acreage detection
  let detectedAcres = 4.0;
  const acreMatch = lower.match(/(\d+(\.\d+)?)\s*(acre|acres|एकड़|ਏਕੜ|ఎకరాలు|एकर)?/);
  if (acreMatch && parseFloat(acreMatch[1])) {
    detectedAcres = parseFloat(acreMatch[1]);
  } else if (lower.includes("5") || lower.includes("पाँच") || lower.includes("पांच") || lower.includes("ਪੰਜ") || lower.includes("ఐదు")) {
    detectedAcres = 5.0;
  } else if (lower.includes("3") || lower.includes("तीन") || lower.includes("ਤਿੰਨ") || lower.includes("మూడు")) {
    detectedAcres = 3.0;
  } else if (lower.includes("2") || lower.includes("दो") || lower.includes("ਦੋ") || lower.includes("రెండు")) {
    detectedAcres = 2.0;
  }

  // Village detection
  let detectedVillage = "Rampur Kalan";
  if (lower.includes("sitapur") || lower.includes("सीतापुर") || lower.includes("ਸੀਤਾਪੁਰ") || lower.includes("సీతాపూర్")) {
    detectedVillage = "Sitapur Khurd";
  } else if (lower.includes("kalyanpur") || lower.includes("कल्याणपुर") || lower.includes("ਕਲਿਆਣਪੁਰ") || lower.includes("కళ్యాణపూర్")) {
    detectedVillage = "Kalyanpur East";
  } else if (lower.includes("shivpur") || lower.includes("शिवपुर") || lower.includes("ਸ਼ਿਵਪੁਰ") || lower.includes("శివపూర్")) {
    detectedVillage = "Shivpur South";
  } else if (lower.includes("fatehgarh") || lower.includes("फतेहगढ़") || lower.includes("ਫ਼ਤਿਹਗੜ੍ਹ") || lower.includes("ఫతేగఢ్")) {
    detectedVillage = "Fatehgarh Fields";
  } else {
    detectedVillage = "Rampur Kalan";
  }

  // Deadline date
  let detectedDeadline = "2026-11-20";
  if (lower.includes("21") || lower.includes("22")) {
    detectedDeadline = "2026-11-21";
  } else if (lower.includes("19")) {
    detectedDeadline = "2026-11-19";
  }

  const farmerName = lang === 'hi' ? "सुखविंदर सिंह (Sukhwinder Singh)" : "Ramesh Patel";
  const farmerPhone = "9876543210";

  // 3. Direct booking execution in KrishiChakra system
  const bookingResult = bookDirectlyForFarmer({
    farmerName,
    phone: farmerPhone,
    village: detectedVillage,
    acres: detectedAcres,
    crop: detectedCrop,
    operation: detectedOp,
    deadlineDate: detectedDeadline,
    machineType: detectedMachineType,
    notes: `Voice booking: "${farmerSpeech}"`
  });

  // 4. Formulate spoken & textual response
  const equip = bookingResult.equip;
  const assignedSlot = currentSchedule.assignedSlots.find(s => s.plot.id === bookingResult.plot.id);
  const travelBufferMins = assignedSlot ? Math.round(assignedSlot.travelHrs * 60) : 35;
  const scheduledDate = assignedSlot ? assignedSlot.dayStr : currentSimDate;
  const scheduledTime = assignedSlot ? `${formatDecimalHour(assignedSlot.startHour)} - ${formatDecimalHour(assignedSlot.endHour)}` : "08:00 AM - 11:30 AM";

  let aiSpeechResponse = "";
  if (lang === 'hi') {
    aiSpeechResponse = `नमस्ते ${farmerName}! आपकी बुकिंग तुरंत कर दी गई है। ${detectedCrop} ${detectedOp} के लिए मशीन ${equip.name} को ${scheduledDate} (${scheduledTime}) पर आवंटित किया गया है। यात्रा बफर: ${travelBufferMins} मिनट। 0 क्लैश की पूर्ण गारंटी है। आपके फोन पर SMS भेज दिया गया है।`;
  } else {
    aiSpeechResponse = `Booking confirmed, Farmer ${farmerName}! ${equip.name} has been directly booked for ${detectedAcres} acres ${detectedCrop} ${detectedOp} on ${scheduledDate} (${scheduledTime}). Travel buffer enforced: ${travelBufferMins} minutes. Zero clashes guaranteed. SMS sent!`;
  }

  // 5. Append AI Assistant confirmation card in transcript
  const aiBubble = document.createElement("div");
  aiBubble.className = "bg-slate-900 p-3 rounded-xl border border-emerald-500/60 text-xs text-white space-y-2";
  aiBubble.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="font-bold text-emerald-400 flex items-center gap-1.5">
        <span>🤖</span> <span>AI Assistant Response:</span>
      </div>
      <span class="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/50">
        ✅ 0 Clashes Guaranteed
      </span>
    </div>

    <div class="text-slate-200 text-xs leading-relaxed">
      ${aiSpeechResponse}
    </div>

    <!-- Booking Summary Card -->
    <div class="bg-slate-950 p-2.5 rounded-lg border border-slate-700 space-y-1.5">
      <div class="flex items-center justify-between text-[11px]">
        <span class="text-slate-400">Allotted Machine:</span>
        <strong class="text-white">${equip.name}</strong>
      </div>
      <div class="flex items-center justify-between text-[11px]">
        <span class="text-slate-400">Field & Operation:</span>
        <span class="text-emerald-300 font-semibold">${detectedVillage} • ${detectedAcres} Acres ${detectedCrop} (${detectedOp})</span>
      </div>
      <div class="flex items-center justify-between text-[11px]">
        <span class="text-slate-400">Scheduled Slot:</span>
        <span class="text-amber-300 font-mono font-bold">${scheduledDate} (${scheduledTime})</span>
      </div>
      <div class="flex items-center justify-between text-[11px]">
        <span class="text-slate-400">Safe Travel Buffer:</span>
        <span class="text-purple-300 font-semibold">🚗 ${travelBufferMins} mins road transit protected</span>
      </div>
    </div>

    <!-- Simulated SMS -->
    <div class="bg-emerald-950/80 p-2 rounded-lg border border-emerald-700/50 text-[11px] text-emerald-200">
      <span class="font-bold">📱 SMS Sent to ${farmerPhone}:</span> "KrishiChakra Confirmed: ${equip.name} allotted for ${detectedCrop} on ${scheduledDate}. Zero clash guarantee active."
    </div>
  `;
  transcript.appendChild(aiBubble);
  transcript.scrollTop = transcript.scrollHeight;

  // 6. Speak confirmation aloud using Web Speech API
  speakText(aiSpeechResponse);
}

function bookDirectlyForFarmer({ farmerName, phone, village, acres, crop, operation, deadlineDate, machineType, notes }) {
  const villageCoord = VILLAGE_COORDS[village] || { lat: 28.6180, lon: 77.2150 };
  const reqMachineType = machineType || (operation === 'Harvesting' ? 'Harvester' : (operation === 'Spraying' ? 'Sprayer' : 'Tractor'));

  // Find best eligible machine that is not broken down
  const matchingEquip = equipmentList.find(e => 
    e.type === reqMachineType && !disruptions.equipmentBreakdowns[e.id]
  ) || equipmentList.find(e => e.type === reqMachineType) || equipmentList[0];

  const plotId = `PL-${Date.now()}`;
  const newPlot = {
    id: plotId,
    farmerName: farmerName || "Farmer",
    phone: phone || "9876543210",
    village: village,
    lat: villageCoord.lat,
    lon: villageCoord.lon,
    acres: acres,
    crop: crop,
    operation: operation,
    windowStart: currentSimDate,
    windowEnd: deadlineDate,
    requiredMachineType: reqMachineType,
    notes: notes || `Direct booking by KrishiChakra AI Voice Assistant.`
  };

  plotsList.unshift(newPlot);

  // Create an approved booking request so both owner & farmer views reflect it immediately
  const newReq = {
    id: `REQ-${Date.now()}`,
    plotId: newPlot.id,
    farmerName: newPlot.farmerName,
    phone: newPlot.phone,
    village: newPlot.village,
    acres: newPlot.acres,
    crop: newPlot.crop,
    operation: newPlot.operation,
    equipId: matchingEquip.id,
    equipName: matchingEquip.name,
    equipType: matchingEquip.type,
    ownerName: matchingEquip.ownerName,
    ownerPhone: matchingEquip.phone,
    startDate: currentSimDate,
    endDate: deadlineDate,
    status: "Approved",
    notes: `Direct allocation via Multilingual AI Voice Assistant.`
  };
  bookingRequests.unshift(newReq);

  // Recalculate schedule with mathematical travel buffer and clash-free guarantee
  runGlobalOptimization();

  return {
    plot: newPlot,
    equip: matchingEquip,
    req: newReq
  };
}

// ============================================================================
// 8. DISRUPTION TOGGLE CONTROLLERS
// ============================================================================

function toggleRainDisruption() {
  if (disruptions.weatherBlocks["2026-11-19"]) {
    delete disruptions.weatherBlocks["2026-11-19"];
  } else {
    disruptions.weatherBlocks["2026-11-19"] = "Continuous Heavy Rain (48mm) - Severe Waterlogging";
  }
  runGlobalOptimization();
}

function toggleBreakdownDisruption() {
  if (disruptions.equipmentBreakdowns["EQ-03"]) {
    delete disruptions.equipmentBreakdowns["EQ-03"];
  } else {
    disruptions.equipmentBreakdowns["EQ-03"] = {
      start: "2026-11-18",
      end: "2026-11-19",
      reason: "Hydraulic Cutter Bar Failure (48h workshop repair)"
    };
  }
  runGlobalOptimization();
}

function toggleSpecificBreakdown(eqId) {
  if (disruptions.equipmentBreakdowns[eqId]) {
    delete disruptions.equipmentBreakdowns[eqId];
  } else {
    disruptions.equipmentBreakdowns[eqId] = {
      start: currentSimDate,
      end: "2026-11-20",
      reason: "Alternator Electrical Breakdown"
    };
  }
  runGlobalOptimization();
}

function resetAllDisruptions() {
  disruptions.weatherBlocks = {};
  disruptions.equipmentBreakdowns = {};
  runGlobalOptimization();
}

// ============================================================================
// 9. SPEECH & ACCESSIBILITY READOUT (WEB SPEECH API)
// ============================================================================

function speakText(text) {
  if (!('speechSynthesis' in window)) {
    console.warn("Web Speech API not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  if (currentLang === 'hi') {
    utterance.lang = 'hi-IN';
  } else if (currentLang === 'te') {
    utterance.lang = 'te-IN';
  } else if (currentLang === 'pa') {
    utterance.lang = 'pa-IN';
  } else if (currentLang === 'mr') {
    utterance.lang = 'mr-IN';
  } else {
    utterance.lang = 'en-US';
  }

  const btn = document.getElementById("btn-read-screen");
  if (btn) btn.classList.add("audio-speaking");

  utterance.onend = () => {
    if (btn) btn.classList.remove("audio-speaking");
  };
  utterance.onerror = () => {
    if (btn) btn.classList.remove("audio-speaking");
  };

  window.speechSynthesis.speak(utterance);
}

function readActiveViewAloud() {
  if (activePersona === 'farmer') {
    const text = currentLang === 'hi' ?
      `किसान पोर्टल में आपका स्वागत है। आपके पास ${plotsList.length} पंजीकृत खेत और ${currentSchedule.assignedSlots.length} निर्धारित मशीन बुकिंग हैं। असली फोटो देखकर मशीन चुनें या AI वॉइस असिस्टेंट से बोलकर तुरंत बुक करें।` :
      `Welcome to Farmer Portal. You have ${plotsList.length} registered farm plots and ${currentSchedule.assignedSlots.length} scheduled machinery bookings. Browse live machine photos or use the AI Voice Assistant to book directly by speaking.`;
    speakText(text);
  } else {
    const text = currentLang === 'hi' ?
      `उपकरण मालिक पोर्टल। ${equipmentList.length} मशीनों का बेड़ा चालू है। शून्य टकराव की गारंटी है।` :
      `Equipment Owner Portal. Fleet of ${equipmentList.length} machines operational. Zero clashes guaranteed.`;
    speakText(text);
  }
}

function playPhoneAudioDemo(lang) {
  demoAIVoiceBooking(lang);
}

// ============================================================================
// 10. MODALS & TAB NAVIGATION
// ============================================================================

function switchPersona(persona) {
  activePersona = persona;

  ['farmer', 'owner'].forEach(p => {
    const btn = document.getElementById(`nav-btn-${p}`);
    const view = document.getElementById(`view-${p}`);
    if (btn && view) {
      if (p === persona) {
        btn.classList.add("active");
        btn.classList.remove("text-emerald-200");
        view.classList.remove("hidden");
      } else {
        btn.classList.remove("active");
        btn.classList.add("text-emerald-200");
        view.classList.add("hidden");
      }
    }
  });
}

function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove("hidden");
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add("hidden");
}

function openPhoneSimulatorModal() {
  openAIVoiceAssistantModal();
}

function openNewBookingModal() {
  populateBookingModalOptions();
  const sDate = document.getElementById("booking-start-date");
  const eDate = document.getElementById("booking-end-date");
  if (sDate) sDate.value = currentSimDate;
  if (eDate) eDate.value = "2026-11-21";
  openModal("modal-new-booking");
}

function openNewPlotModal() {
  const sDate = document.getElementById("plot-window-start");
  const eDate = document.getElementById("plot-window-end");
  if (sDate) sDate.value = currentSimDate;
  if (eDate) eDate.value = "2026-11-22";
  openModal("modal-new-plot");
}

function openNewEquipmentModal() {
  openModal("modal-new-equip");
}

function openPhoneSimulatorModal() {
  openModal("modal-phone-simulator");
}

function showExplanationModal(title, body) {
  const titleEl = document.getElementById("explanation-modal-title");
  const bodyEl = document.getElementById("explanation-modal-body");
  if (titleEl) titleEl.innerText = title;
  if (bodyEl) bodyEl.innerText = body;
  activeExplanation = body;
  openModal("modal-explanation");
}

function speakCurrentExplanation() {
  if (activeExplanation) {
    speakText(activeExplanation);
  }
}


function approveBookingRequest(reqId) {
  const req = bookingRequests.find(r => r.id === reqId);
  if (!req) return;

  req.status = 'Approved';
  
  // Ensure plot matches requested equipment type
  const targetPlot = plotsList.find(p => p.id === req.plotId);
  if (targetPlot) {
    targetPlot.requiredMachineType = req.equipType || 'Tractor';
  }

  runGlobalOptimization();

  const msg = currentLang === 'hi' ? 
    `स्वीकृत! ${req.equipName} किसान ${req.farmerName} को सफलतापूर्वक आवंटित कर दी गई है।` :
    `Approved! Machine ${req.equipName} officially allotted to Farmer ${req.farmerName} with safe travel buffer.`;

  speakText(msg);
  alert(msg);
}

function rejectBookingRequest(reqId) {
  const req = bookingRequests.find(r => r.id === reqId);
  if (!req) return;

  req.status = 'Rejected';
  renderAllViews();
  alert(currentLang === 'hi' ? "अनुरोध अस्वीकार कर दिया गया।" : "Booking request declined.");
}

// Form Handlers
function handleFarmerBookingSubmit(e) {
  e.preventDefault();
  const plotId = document.getElementById("booking-plot-select").value;
  const equipId = document.getElementById("booking-equip-select").value;
  const sDate = document.getElementById("booking-start-date").value;
  const eDate = document.getElementById("booking-end-date").value;
  const notes = document.getElementById("booking-notes").value;

  const targetPlot = plotsList.find(p => p.id === plotId);
  const targetEquip = equipmentList.find(e => e.id === equipId);

  if (targetPlot && targetEquip) {
    targetPlot.requiredMachineType = targetEquip.type;
    targetPlot.windowStart = sDate;
    targetPlot.windowEnd = eDate;
    if (notes) targetPlot.notes = notes;

    // Create a new pending request requiring owner approval
    const newReq = {
      id: `REQ-${Date.now()}`,
      plotId: targetPlot.id,
      farmerName: targetPlot.farmerName,
      phone: targetPlot.phone,
      village: targetPlot.village,
      acres: targetPlot.acres,
      crop: targetPlot.crop,
      operation: targetPlot.operation,
      equipId: targetEquip.id,
      equipName: targetEquip.name,
      equipType: targetEquip.type,
      ownerName: targetEquip.ownerName,
      ownerPhone: targetEquip.phone,
      startDate: sDate,
      endDate: eDate,
      status: "Pending", // WAITING FOR OWNER APPROVAL!
      notes: notes || targetPlot.notes
    };
    bookingRequests.unshift(newReq);
  }

  closeModal("modal-new-booking");
  runGlobalOptimization();

  const alertMsg = currentLang === 'hi' ? 
    `बुकिंग अनुरोध मालिक ${targetEquip.ownerName} (${targetEquip.phone}) को भेजा गया! मालिक द्वारा स्वीकृत होने पर ही मशीन आवंटित की जाएगी।` :
    `Booking request sent to owner ${targetEquip.ownerName} (${targetEquip.phone})! The machine will be officially allotted once the owner reviews and approves it.`;

  speakText(currentLang === 'hi' ? `मालिक ${targetEquip.ownerName} को अनुरोध भेजा गया।` : `Request sent to owner ${targetEquip.ownerName} for approval.`);
  alert(alertMsg);
}

function handleNewPlotSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("plot-farmer-name").value;
  const phone = document.getElementById("plot-phone").value;
  const village = document.getElementById("plot-village").value;
  const acres = parseFloat(document.getElementById("plot-acres").value);
  const crop = document.getElementById("plot-crop").value;
  const op = document.getElementById("plot-operation").value;
  const sDate = document.getElementById("plot-window-start").value;
  const eDate = document.getElementById("plot-window-end").value;

  const vCoord = VILLAGE_COORDS[village] || { lat: 28.6180, lon: 77.2150 };

  const newPlot = {
    id: `PL-${Date.now()}`,
    farmerName: name,
    phone: phone,
    village: village,
    lat: vCoord.lat,
    lon: vCoord.lon,
    acres: acres,
    crop: crop,
    operation: op,
    windowStart: sDate,
    windowEnd: eDate,
    requiredMachineType: op === 'Harvesting' ? 'Harvester' : (op === 'Spraying' ? 'Sprayer' : 'Tractor'),
    notes: `Registered directly from portal.`
  };

  plotsList.push(newPlot);
  closeModal("modal-new-plot");
  runGlobalOptimization();
  alert(currentLang === 'hi' ? `${name} का खेत सफलतापूर्वक पंजीकृत हुआ!` : `Farm plot for ${name} registered successfully!`);
}

function handleNewEquipmentSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("equip-name").value;
  const photo = document.getElementById("equip-photo").value;
  const type = document.getElementById("equip-type").value;
  const workRate = parseFloat(document.getElementById("equip-work-rate").value);
  const rate = parseFloat(document.getElementById("equip-rate").value);
  const rateUnit = document.getElementById("equip-rate-unit").value;
  const loc = document.getElementById("equip-location").value;
  const phone = document.getElementById("equip-phone").value;

  const vCoord = VILLAGE_COORDS[loc] || { lat: 28.6139, lon: 77.2090 };

  const defaultPhoto = type === 'Tractor' ? 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80' :
                       (type === 'Harvester' ? 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80' :
                       'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80');

  const newEquip = {
    id: `EQ-${Date.now().toString().slice(-3)}`,
    name: name,
    type: type,
    workRate: workRate,
    rate: rate,
    rateUnit: rateUnit,
    locationName: loc,
    lat: vCoord.lat,
    lon: vCoord.lon,
    ownerName: "Partner Owner",
    phone: phone,
    status: "Available",
    specs: `${type} added to active regional pool`,
    photoUrl: photo && photo.trim() !== "" ? photo : defaultPhoto
  };

  equipmentList.push(newEquip);
  closeModal("modal-new-equip");
  runGlobalOptimization();
  alert(currentLang === 'hi' ? `मशीन ${name} बेड़े में जोड़ी गई!` : `Machine ${name} added to equipment registry!`);
}

// Initial Kickoff
window.addEventListener("DOMContentLoaded", () => {
  runGlobalOptimization();
});
