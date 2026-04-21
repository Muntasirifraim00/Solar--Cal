import React, { useState, useMemo } from 'react';
import { 
  Sun, Battery, Zap, Home, ChevronRight, ChevronLeft, 
  Plus, Trash2, CheckCircle2, Settings, AlertCircle, Info, Clock, X, Scale,
  Calculator, Ruler, Box, ShieldCheck, Wrench
} from 'lucide-react';

// Common appliances database for quick selection
const APPLIANCE_DB = [
  { name: 'এলইডি বাতি (Super Star/Walton)', defaultWatts: 15, icon: '💡', surgeMult: 1 },
  { name: 'সিলিং ফ্যান (BRB/Vision)', defaultWatts: 75, icon: '🌀', surgeMult: 1.5 },
  { name: 'বিএলডিসি ফ্যান (Energy Saving)', defaultWatts: 30, icon: '🌀', surgeMult: 1.1 },
  { name: '৩২" টিভি (Singer/Walton)', defaultWatts: 50, icon: '📺', surgeMult: 1 },
  { name: '৫৫" ফোরকে টিভি (Sony/Samsung)', defaultWatts: 150, icon: '📺', surgeMult: 1 },
  { name: 'ফ্রিজ ২০০লি. (Direct Cool - Walton)', defaultWatts: 150, icon: '🧊', surgeMult: 3 },
  { name: 'ফ্রিজ 8০০লি. (Non-Frost - Sharp/LG)', defaultWatts: 250, icon: '🧊', surgeMult: 3 },
  { name: 'এসি ১ টন (General/Midea)', defaultWatts: 1200, icon: '❄️', surgeMult: 2.5 },
  { name: 'এসি ১.৫ টন ইনভার্টার (Gree)', defaultWatts: 1500, icon: '❄️', surgeMult: 1.2 },
  { name: 'পানির পাম্প ০.৫ ঘোড়া (Pedrollo/Gazi)', defaultWatts: 375, icon: '💧', surgeMult: 3 },
  { name: 'পানির পাম্প ১ ঘোড়া (RFL)', defaultWatts: 750, icon: '💧', surgeMult: 3 },
  { name: 'ওয়াশিং মেশিন (Front Load)', defaultWatts: 1500, icon: '👕', surgeMult: 1.5 },
  { name: 'মাইক্রোওয়েভ ওভেন (Miyako/Walton)', defaultWatts: 1000, icon: '♨️', surgeMult: 1.2 },
  { name: 'রাইস কুকার/ব্লেন্ডার (Vision)', defaultWatts: 700, icon: '🍚', surgeMult: 1 },
  { name: 'ওয়াইফাই রাউটার ও অনু', defaultWatts: 15, icon: '🌐', surgeMult: 1 },
  { name: 'ল্যাপটপ (HP/Dell/Lenovo)', defaultWatts: 65, icon: '💻', surgeMult: 1 },
  { name: 'ডেস্কটপ পিসি (Gaming/Heavy)', defaultWatts: 350, icon: '🖥️', surgeMult: 1 },
  { name: 'অন্যান্য (Custom)', defaultWatts: 100, icon: '🔌', surgeMult: 1 },
];

const LOCATIONS_DB = [
  { name: 'ঢাকা (Dhaka)', sunHours: 4.5 },
  { name: 'চট্টগ্রাম (Chittagong)', sunHours: 4.8 },
  { name: 'রাজশাহী (Rajshahi)', sunHours: 5.0 },
  { name: 'সিলেট (Sylhet)', sunHours: 4.2 },
  { name: 'খুলনা (Khulna)', sunHours: 4.6 },
  { name: 'বরিশাল (Barisal)', sunHours: 4.5 },
  { name: 'রংপুর (Rangpur)', sunHours: 4.4 },
  { name: 'কাস্টম (Custom)', sunHours: 4.5 },
];

const SYSTEM_BRANDS = {
  inverters: [
    { brand: 'Growatt', desc: 'SPF / SPH Series (সাশ্রয়ী ও জনপ্রিয়)' },
    { brand: 'Deye', desc: 'Hybrid Series (অ্যাডভান্সড ও নির্ভরযোগ্য)' },
    { brand: 'LuxPower', desc: 'SNA Series (দারুণ পারফরম্যান্স)' },
    { brand: 'Voltronic / Axpert', desc: 'King/Max Series (অফ-গ্রিডে পরীক্ষিত)' },
    { brand: 'Luminous', desc: 'Solarverter (বাজেট ফ্রেন্ডলি)' }
  ],
  lithium: [
    { brand: 'Pylontech', desc: 'US2000/US3000 (বিশ্বস্ত ব্র্যান্ড)' },
    { brand: 'Felicity Solar', desc: 'Wall Mount Series (বাংলাদেশে জনপ্রিয়)' },
    { brand: 'Dyness', desc: 'BX Series (দীর্ঘস্থায়ী)' },
    { brand: 'Rosen Solar', desc: 'Powerwall (স্লিম ডিজাইন)' },
    { brand: 'Walton', desc: 'LiFePO4 Series (দেশীয় ওয়ারেন্টি)' }
  ],
  tubular: [
    { brand: 'Rahimafrooz', desc: 'Globatt/IPB Tall Tubular' },
    { brand: 'Hamko', desc: 'HPD/Solar Series' },
    { brand: 'Volvo', desc: 'Solar Premium Tubular' },
    { brand: 'Navana', desc: 'Solar Heavy Duty' },
    { brand: 'Rimso', desc: 'Solar Deep Cycle' }
  ],
  panels: [
    { brand: 'Trina Solar', desc: 'Vertex Series' },
    { brand: 'Jinko Solar', desc: 'Tiger Neo (N-type)' },
    { brand: 'LONGi', desc: 'Hi-MO Series' },
    { brand: 'Canadian Solar', desc: 'HiKu Series' },
    { brand: 'JA Solar', desc: 'DeepBlue Series' }
  ],
  powerStations: [
    { brand: 'EcoFlow', desc: 'Delta / River Series (পোর্টেবল ও ফাস্ট চার্জিং)' },
    { brand: 'Anker', desc: 'PowerHouse Series (স্মার্ট ও দীর্ঘস্থায়ী)' },
    { brand: 'Growatt', desc: 'All-in-One ESS (সম্পূর্ণ হোম সলিউশন)' },
    { brand: 'Bluetti', desc: 'AC/EB Series (হেভি-ডিউটি ব্যাকআপ)' },
    { brand: 'Walton', desc: 'Power Station (সহজলভ্য দেশীয় সার্ভিস)' }
  ]
};

const PRODUCT_COMPARISON_DB = {
  inverters: [
    { brand: 'Growatt', model: 'SPF 5000 ES', type: 'Off-Grid', capacity: '5kW', maxSurge: '10kVA', warranty: '5 Years', price: '৳ 65,000' },
    { brand: 'Deye', model: 'SUN-5K-SG03LP1', type: 'Hybrid', capacity: '5kW', maxSurge: '10kVA', warranty: '5 Years', price: '৳ 105,000' },
    { brand: 'LuxPower', model: 'SNA 5000', type: 'Hybrid/Off-Grid', capacity: '5kW', maxSurge: '10kVA', warranty: '2 Years', price: '৳ 55,000' },
    { brand: 'Voltronic', model: 'Axpert Max 7.2KW', type: 'Off-Grid', capacity: '7.2kW', maxSurge: '15kVA', warranty: '1 Year', price: '৳ 85,000' },
  ],
  batteries: [
    { brand: 'Pylontech', model: 'US3000C', chemistry: 'LiFePO4', capacity: '48V 74Ah (3.5kWh)', lifeCycles: '6000+', warranty: '10 Years', price: '৳ 145,000' },
    { brand: 'Felicity', model: 'LPBF48100', chemistry: 'LiFePO4', capacity: '48V 100Ah (5kWh)', lifeCycles: '6000+', warranty: '5 Years', price: '৳ 135,000' },
    { brand: 'Hamko', model: 'HPD 200', chemistry: 'Tall Tubular', capacity: '12V 200Ah (2.4kWh)', lifeCycles: '800-1000', warranty: '1.5 Years', price: '৳ 26,000' },
    { brand: 'Walton', model: 'WBS-LFP48100', chemistry: 'LiFePO4', capacity: '48V 100Ah (5kWh)', lifeCycles: '4000+', warranty: '5 Years', price: '৳ 140,000' },
  ],
  panels: [
    { brand: 'Trina Solar', model: 'Vertex 550W', tech: 'Mono PERC', efficiency: '21.0%', warranty: '12/25 Years', price: '৳ 18,000' },
    { brand: 'Jinko Solar', model: 'Tiger Neo 540W', tech: 'N-Type TOPCon', efficiency: '21.5%', warranty: '15/30 Years', price: '৳ 19,000' },
    { brand: 'LONGi', model: 'Hi-MO 5 540W', tech: 'Half-Cut Mono', efficiency: '21.1%', warranty: '12/25 Years', price: '৳ 18,500' },
    { brand: 'Canadian Solar', model: 'HiKu6 545W', tech: 'Mono PERC', efficiency: '21.1%', warranty: '12/25 Years', price: '৳ 18,200' },
  ]
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Form State
  const [basicInfo, setBasicInfo] = useState({
    propertyType: 'আবাসিক',
    location: 'ঢাকা (Dhaka)',
    sunHours: 4.5, // Average peak sun hours
    backupNeeds: 'partial', // partial, full, grid-tied
    // Advanced settings
    batteryType: 'lead-acid', // lead-acid, lithium
    systemVoltage: 24, // 12, 24, 48
    panelWattage: 500,
    showAdvanced: false,
  });

  const [appliances, setAppliances] = useState([
    { id: '1', name: 'এলইডি বাতি (Super Star/Walton)', watts: 15, quantity: 4, hours: 6, backupHours: 4 },
    { id: '2', name: 'সিলিং ফ্যান (BRB/Vision)', watts: 75, quantity: 2, hours: 8, backupHours: 6 },
    { id: '3', name: 'ফ্রিজ ২০০লি. (Direct Cool - Walton)', watts: 150, quantity: 1, hours: 24, backupHours: 12 },
  ]);

  // Calculations
  const metrics = useMemo(() => {
    let peakLoadW = 0;
    let dailyEnergyWh = 0;
    let backupEnergyWh = 0;
    let maxSurgeDifference = 0;

    appliances.forEach(app => {
      const load = (Number(app.watts) || 0) * (Number(app.quantity) || 0);
      peakLoadW += load;
      
      const preset = APPLIANCE_DB.find(p => p.name === app.name);
      const surgeMultiplier = preset ? preset.surgeMult : 1;
      const surgeDiff = ((Number(app.watts) || 0) * surgeMultiplier) - (Number(app.watts) || 0);
      if (surgeDiff > maxSurgeDifference) {
        maxSurgeDifference = surgeDiff;
      }
      
      const totalHrs = Number(app.hours) || 0;
      const backupHrs = Math.min(Number(app.backupHours) || 0, totalHrs); // Backup cannot exceed total hours
      
      dailyEnergyWh += load * totalHrs;
      backupEnergyWh += load * backupHrs;
    });

    // Inverter Sizing
    // Needs to handle continuous sum + largest starting surge, or just continuous + 25% safety
    const continuousRequired = peakLoadW * 1.25;
    const surgeRequired = peakLoadW + maxSurgeDifference;
    const recommendedInverterW = Math.ceil(Math.max(continuousRequired, surgeRequired) / 100) * 100;

    // Solar Array Sizing (Daily Energy / Sun Hours / System Efficiency ~ 0.8)
    const requiredSolarArrayW = Math.ceil(dailyEnergyWh / basicInfo.sunHours / 0.8);
    const panelCount = Math.ceil(requiredSolarArrayW / basicInfo.panelWattage);

    // Battery Sizing 
    let requiredUsableBatteryWh = 0;
    if (basicInfo.backupNeeds === 'full') {
      requiredUsableBatteryWh = dailyEnergyWh * 1.5; // 1.5 days autonomy
    } else if (basicInfo.backupNeeds === 'partial') {
      requiredUsableBatteryWh = backupEnergyWh;
    }

    const DoD = basicInfo.batteryType === 'lithium' ? 0.8 : 0.5;
    const requiredGrossBatteryWh = Math.ceil(requiredUsableBatteryWh / DoD / 0.85); // 0.85 inverter efficiency
    
    // Battery Count
    const standardBatteryWh = basicInfo.batteryType === 'lithium' ? 4800 : 2400; // Li: 48V 100Ah, Pb: 12V 200Ah
    const batteryCount = requiredGrossBatteryWh > 0 ? Math.ceil(requiredGrossBatteryWh / standardBatteryWh) : 0;

    // Financial Analysis (Bangladesh Market Realistic Pricing)
    const COST_PER_WATT_PANEL = 40; // Tier-1 Mono Half-Cut/TOPCon
    const COST_PER_VA_INVERTER = 16; // Average for Hybrid/Off-grid (e.g. Growatt, LuxPower)
    const COST_LITHIUM_48V100AH = 135000; // E.g., Felicity, Pylontech basic
    const COST_TUBULAR_12V200AH = 26000; // E.g., Hamko, Rimso, Volvo

    const panelCost = panelCount * basicInfo.panelWattage * COST_PER_WATT_PANEL;
    const inverterCost = recommendedInverterW * COST_PER_VA_INVERTER;
    const batteryCost = basicInfo.batteryType === 'lithium' 
      ? batteryCount * COST_LITHIUM_48V100AH 
      : batteryCount * COST_TUBULAR_12V200AH;
      
    const structureCost = panelCount * 3000; // Mount structures per panel (GI/SS)
    const bosCost = (panelCost + inverterCost + batteryCost) * 0.08; // Balance of System: Cables, DB box, SPD, Breakers
    const installCost = requiredSolarArrayW * 4 > 5000 ? requiredSolarArrayW * 4 : 5000; // Labor and transport (min 5k)
    
    const totalSetupCost = panelCost + inverterCost + batteryCost + structureCost + bosCost + installCost;
    
    // Engineering constraints
    const requiredSpaceSqFt = panelCount * 25; // standard 500W+ panel needs approx 25 sq ft
    const suggestedCableAWG = basicInfo.systemVoltage === 48 ? '4 AWG / 25mm²' : basicInfo.systemVoltage === 24 ? '2 AWG / 35mm²' : '1/0 AWG / 50mm²';

    // Savings & ROI
    const dailyGenerationPotentialKWh = requiredSolarArrayW * basicInfo.sunHours * 0.8 / 1000;
    const savingsKWhDay = Math.min(dailyGenerationPotentialKWh, dailyEnergyWh / 1000);
    const monthlySavingsBDT = savingsKWhDay * 30 * 9.5; // 9.5 BDT average blended grid rate in BD
    const roiYears = monthlySavingsBDT > 0 ? totalSetupCost / (monthlySavingsBDT * 12) : 0;

    return {
      peakLoadW,
      surgeTargetW: surgeRequired,
      dailyEnergyWh,
      dailyEnergyKWh: (dailyEnergyWh / 1000).toFixed(2),
      backupEnergyWh,
      
      recommendedInverterW,
      
      requiredSolarArrayW,
      panelCount,
      
      requiredGrossBatteryWh,
      batteryCount,
      
      panelCost,
      inverterCost,
      batteryCost,
      structureCost,
      bosCost,
      installCost,
      totalSetupCost,
      
      requiredSpaceSqFt,
      suggestedCableAWG,

      monthlySavingsBDT,
      roiYears
    };
  }, [appliances, basicInfo]);

  const handleNext = () => currentStep < totalSteps && setCurrentStep(curr => curr + 1);
  const handlePrev = () => currentStep > 1 && setCurrentStep(curr => curr - 1);

  const addAppliance = () => {
    setAppliances([...appliances, { 
      id: Date.now().toString(), 
      name: 'অন্যান্য (Custom)', 
      watts: 100, 
      quantity: 1, 
      hours: 1,
      backupHours: 1
    }]);
  };

  const removeAppliance = (id: string) => {
    setAppliances(appliances.filter(app => app.id !== id));
  };

  const updateAppliance = (id: string, field: string, value: string | number) => {
    setAppliances(appliances.map(app => 
      app.id === id ? { ...app, [field]: value } : app
    ));
  };

  const applyPreset = (id: string, presetName: string) => {
    const preset = APPLIANCE_DB.find(p => p.name === presetName);
    if (preset) {
      updateAppliance(id, 'name', preset.name);
      updateAppliance(id, 'watts', preset.defaultWatts);
    }
  };

  // Components for Steps
  const StepIndicator = () => (
    <div className="flex gap-2 sm:gap-3 items-center">
      {[
        { step: 1, label: 'প্রোফাইল' }, 
        { step: 2, label: 'লোড' }, 
        { step: 3, label: 'ROI' }, 
        { step: 4, label: 'ব্লুপ্রিন্ট' }
      ].map((item, idx) => (
        <div key={item.step} className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300 ${
              currentStep === item.step 
                ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110' 
                : currentStep > item.step 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'bg-white text-slate-300 border border-slate-200'
            }`}>
              {currentStep > item.step ? <CheckCircle2 className="w-4 h-4" /> : item.step}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${currentStep === item.step ? 'text-blue-600' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </div>
          {idx < 3 && <div className={`w-4 sm:w-8 h-[2px] rounded-full hidden sm:block ${currentStep > item.step ? 'bg-blue-200' : 'bg-slate-100'}`} />}
        </div>
      ))}
    </div>
  );

  const Step1 = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-black text-slate-800">প্রজেক্ট প্রোফাইল (Project Profile)</h2>
        <p className="text-sm text-slate-500 mt-2">আপনার প্রজেক্টের সঠিক ধরন ও অবস্থান নির্বাচন করুন যাতে অ্যালগরিদম নিখুঁত সোলার সাইজ হিসাব করতে পারে।</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/60 p-5 sm:p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] gap-4 flex flex-col">
         <span className="text-[11px] uppercase tracking-[0.1em] text-slate-400 font-bold">1. ইনস্টলেশনের ধরন</span>
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
           {[
             { id: 'আবাসিক', label: 'আবাসিক', desc: 'বাড়ি বা ফ্ল্যাট' },
             { id: 'বাণিজ্যিক', label: 'বাণিজ্যিক', desc: 'অফিস বা কারখানা' },
             { id: 'অফ-গ্রিড কেবিন', label: 'অফ-গ্রিড', desc: 'বিদ্যুৎহীন এলাকা' },
             { id: 'আরভি/মোবাইল', label: 'মোবাইল', desc: 'গাড়ি বা বোট' }
           ].map(type => (
             <button
               key={type.id}
               onClick={() => setBasicInfo({...basicInfo, propertyType: type.id})}
               className={`relative p-4 border rounded-xl text-left transition-all duration-200 cursor-pointer overflow-hidden ${
                 basicInfo.propertyType === type.id 
                   ? 'border-blue-500 bg-blue-50/50 shadow-inner' 
                   : 'border-slate-200 hover:border-blue-300 hover:shadow-sm bg-white'
               }`}
             >
               {basicInfo.propertyType === type.id && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />}
               <div className={`text-sm font-bold ${basicInfo.propertyType === type.id ? 'text-blue-700' : 'text-slate-700'}`}>{type.label}</div>
               <div className={`text-[10px] mt-1 ${basicInfo.propertyType === type.id ? 'text-blue-500' : 'text-slate-400'}`}>{type.desc}</div>
             </button>
           ))}
         </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200/60 p-5 sm:p-7 space-y-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.05em] text-slate-500 font-bold mb-2">অবস্থান (Location)</label>
            <select 
              value={basicInfo.location}
              onChange={(e) => {
                const loc = LOCATIONS_DB.find(l => l.name === e.target.value);
                setBasicInfo({
                  ...basicInfo, 
                  location: e.target.value,
                  sunHours: loc ? loc.sunHours : basicInfo.sunHours
                });
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-md text-sm p-2 outline-none focus:ring-1 focus:ring-blue-500"
            >
              {LOCATIONS_DB.map(loc => (
                <option key={loc.name} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.05em] text-slate-500 font-bold mb-2">
              গড় কার্যকর রোদ (PSH)
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="2" max="7" step="0.5"
                value={basicInfo.sunHours}
                onChange={(e) => setBasicInfo({...basicInfo, sunHours: parseFloat(e.target.value), location: 'কাস্টম (Custom)'})}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="font-mono font-bold text-blue-600 text-sm whitespace-nowrap">{basicInfo.sunHours} h</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <label className="block text-[11px] uppercase tracking-[0.05em] text-slate-500 font-bold mt-4 mb-3">ব্যাকআপের প্রয়োজনীয়তা</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div 
              onClick={() => setBasicInfo({...basicInfo, backupNeeds: 'grid-tied'})}
              className={`p-3 border rounded-md cursor-pointer transition-all ${basicInfo.backupNeeds === 'grid-tied' ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <h4 className="text-sm font-bold text-slate-800 mb-1">গ্রিড-টাইড (ব্যাটারি ছাড়া)</h4>
              <p className="text-[11px] text-slate-500">বিদ্যুৎ বিল কমাবে, কিন্তু লোডশেডিং এর সময় বন্ধ থাকবে।</p>
            </div>
            <div 
              onClick={() => setBasicInfo({...basicInfo, backupNeeds: 'partial'})}
              className={`p-3 border rounded-md cursor-pointer transition-all ${basicInfo.backupNeeds === 'partial' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <h4 className="text-sm font-bold text-slate-800 mb-1">হাইব্রিড (আংশিক ব্যাকআপ)</h4>
              <p className="text-[11px] text-slate-500">লোডশেডিং এর সময় বা রাতে প্রয়োজনীয় লোড চালানোর জন্য ব্যাটারি।</p>
            </div>
            <div 
              onClick={() => setBasicInfo({...basicInfo, backupNeeds: 'full'})}
              className={`p-3 border rounded-md cursor-pointer transition-all ${basicInfo.backupNeeds === 'full' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <h4 className="text-sm font-bold text-slate-800 mb-1">অফ-গ্রিড (স্বাধীন)</h4>
              <p className="text-[11px] text-slate-500">সম্পূর্ণ স্বাধীন। মেঘলা দিনের জন্য বড় ব্যাটারি ব্যাংক প্রয়োজন।</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button 
            onClick={() => setBasicInfo({...basicInfo, showAdvanced: !basicInfo.showAdvanced})}
            className="text-[11px] uppercase tracking-[0.05em] text-slate-500 font-bold flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <Settings className="w-3 h-3" />
            অ্যাডভান্সড টেকনিক্যাল সেটিংস {basicInfo.showAdvanced ? 'লুকান' : 'দেখুন'}
          </button>
          
          {basicInfo.showAdvanced && (
            <div className="grid md:grid-cols-3 gap-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.05em] text-slate-500 font-bold mb-2">ব্যাটারির ধরন</label>
                <select 
                  value={basicInfo.batteryType}
                  onChange={(e) => setBasicInfo({...basicInfo, batteryType: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md text-sm p-2 outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="lead-acid">লিড-অ্যাসিড (Lead Acid / Tubular) - 50% DoD</option>
                  <option value="lithium">লিথিয়াম (LiFePO4) - 80% DoD</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.05em] text-slate-500 font-bold mb-2">সোলার প্যানেল সাইজ (W)</label>
                <input 
                  type="number"
                  value={basicInfo.panelWattage}
                  onChange={(e) => setBasicInfo({...basicInfo, panelWattage: parseInt(e.target.value) || 500})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md text-sm p-2 outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.05em] text-slate-500 font-bold mb-2">সিস্টেম ভোল্টেজ (V)</label>
                <select 
                  value={basicInfo.systemVoltage}
                  onChange={(e) => setBasicInfo({...basicInfo, systemVoltage: parseInt(e.target.value) || 24})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md text-sm p-2 outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={12}>12V System</option>
                  <option value={24}>24V System</option>
                  <option value={48}>48V System</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="animate-in fade-in flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
      <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-base font-black text-slate-800 flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-500" /> লোড অ্যানালাইসিস (Load Analysis)</h2>
          <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">আপনার দৈনন্দিন ব্যবহৃত ইলেকট্রনিক যন্ত্রপাতিগুলো যোগ করুন।</p>
        </div>
        <button 
          onClick={addAppliance}
          className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-700 hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">নতুন যন্ত্র যোগ করুন</span><span className="sm:hidden">যোগ করুন</span>
        </button>
      </div>

      <div className="overflow-y-auto flex-1 max-h-[400px]">
        <datalist id="appliance-presets">
          {APPLIANCE_DB.map(preset => (
            <option key={preset.name} value={preset.name}>
              {preset.icon} {preset.name}
            </option>
          ))}
        </datalist>
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
            <tr>
              <th className="p-2 sm:p-3 text-[10px] sm:text-[11px] text-left uppercase tracking-[0.05em] text-slate-500 font-bold whitespace-nowrap">যন্ত্রের নাম</th>
              <th className="p-2 sm:p-3 text-[10px] sm:text-[11px] text-left uppercase tracking-[0.05em] text-slate-500 font-bold whitespace-nowrap">ওয়াট (W)</th>
              <th className="p-2 sm:p-3 text-[10px] sm:text-[11px] text-center uppercase tracking-[0.05em] text-slate-500 font-bold whitespace-nowrap">সংখ্যা</th>
              <th className="p-2 sm:p-3 text-[10px] sm:text-[11px] text-left uppercase tracking-[0.05em] text-slate-500 font-bold whitespace-nowrap">মোট ঘণ্টা</th>
              <th className="p-2 sm:p-3 text-[10px] sm:text-[11px] text-left uppercase tracking-[0.05em] text-slate-500 font-bold whitespace-nowrap">ব্যাকআপ</th>
              <th className="p-2 sm:p-3 text-[10px] sm:text-[11px] text-right uppercase tracking-[0.05em] text-slate-500 font-bold whitespace-nowrap">Wh</th>
              <th className="p-2 sm:p-3 text-[10px] sm:text-[11px] text-center uppercase tracking-[0.05em] text-slate-500 font-bold whitespace-nowrap">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {appliances.map((app) => (
              <tr key={app.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors group">
                <td className="p-2 sm:p-3 font-medium">
                  <div className="relative">
                    <input 
                      list="appliance-presets"
                      value={app.name}
                      placeholder="যন্ত্রের নাম লিখুন..."
                      onChange={(e) => {
                        const val = e.target.value;
                        updateAppliance(app.id, 'name', val);
                        const preset = APPLIANCE_DB.find(p => p.name === val);
                        if (preset) updateAppliance(app.id, 'watts', preset.defaultWatts);
                      }}
                      className="w-[140px] sm:w-[220px] bg-white border border-slate-200 hover:border-blue-300 rounded text-[11px] sm:text-xs p-1.5 focus:ring-1 focus:ring-blue-500 outline-none text-slate-700 font-semibold cursor-text shadow-sm transition-all"
                    />
                  </div>
                </td>
                <td className="p-1 sm:p-2 align-middle">
                  <div className="flex border border-slate-200 rounded bg-white overflow-hidden w-16 sm:w-20 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    <input 
                      type="number" min="1" 
                      value={app.watts}
                      onChange={(e) => updateAppliance(app.id, 'watts', e.target.value)}
                      className="w-full text-right p-1 outline-none text-[11px] sm:text-xs font-mono"
                    />
                    <span className="bg-slate-50 text-slate-500 text-[9px] sm:text-[10px] px-1 sm:px-1.5 flex items-center border-l border-slate-200">W</span>
                  </div>
                </td>
                <td className="p-1 sm:p-2 align-middle">
                  <div className="flex justify-center">
                    <div className="flex items-center bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
                      <button onClick={() => updateAppliance(app.id, 'quantity', Math.max(1, app.quantity - 1))} className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-100 cursor-pointer font-bold text-xs">-</button>
                      <input 
                        type="number" min="1" 
                        value={app.quantity}
                        onChange={(e) => updateAppliance(app.id, 'quantity', e.target.value)}
                        className="w-6 sm:w-8 text-center text-[11px] sm:text-xs p-1 outline-none font-mono"
                      />
                      <button onClick={() => updateAppliance(app.id, 'quantity', app.quantity + 1)} className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-100 cursor-pointer font-bold text-xs">+</button>
                    </div>
                  </div>
                </td>
                <td className="p-1 sm:p-2 align-middle">
                  <div className="flex border border-slate-200 rounded bg-white overflow-hidden w-14 sm:w-16 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    <input 
                      type="number" min="0" max="24" step="0.5"
                      value={app.hours}
                      onChange={(e) => updateAppliance(app.id, 'hours', e.target.value)}
                      className="w-full text-right p-1 outline-none text-[11px] sm:text-xs font-mono"
                    />
                    <span className="bg-slate-50 text-slate-500 text-[9px] sm:text-[10px] px-1 flex items-center border-l border-slate-200">h</span>
                  </div>
                </td>
                <td className="p-1 sm:p-2 align-middle">
                  <div className="flex border border-indigo-200 rounded bg-indigo-50/50 overflow-hidden w-14 sm:w-16 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                    <input 
                      type="number" min="0" max={app.hours} step="0.5"
                      value={app.backupHours}
                      onChange={(e) => updateAppliance(app.id, 'backupHours', e.target.value)}
                      className="w-full bg-transparent text-indigo-700 text-right p-1 outline-none text-[11px] sm:text-xs font-mono"
                    />
                    <span className="bg-indigo-100 text-indigo-600 text-[10px] px-1 flex items-center border-l border-indigo-200">h</span>
                  </div>
                </td>
                <td className="p-1 sm:p-2 text-right font-mono text-[10px] sm:text-xs text-slate-500 align-middle">
                  {((Number(app.watts)||0) * (Number(app.quantity)||0) * (Number(app.hours)||0)).toLocaleString()}
                </td>
                <td className="p-1 sm:p-2 text-center align-middle">
                  <button 
                    onClick={() => removeAppliance(app.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer inline-flex"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {appliances.length === 0 && (
          <div className="text-center p-8 bg-slate-50 m-4 rounded-lg border border-dashed border-slate-300">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500 text-sm font-medium">কোনো যন্ত্রপাতি যোগ করা হয়নি। লোড হিসাব করতে কিছু যোগ করুন।</p>
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.05em] text-slate-500 font-bold">সর্বোচ্চ লোড</span>
            <span className="text-lg font-black text-slate-800">{metrics.peakLoadW.toLocaleString()} W</span>
          </div>
          <div className="flex flex-col border-l border-slate-200 pl-6">
            <span className="text-[11px] uppercase tracking-[0.05em] text-slate-500 font-bold">দৈনিক শক্তি</span>
            <span className="text-lg font-black text-blue-600">{metrics.dailyEnergyKWh} kWh</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 text-right italic hidden sm:block">
          *নিরাপত্তা মার্জিন ২৫% হিসেবে গণনা করা হয়েছে।
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-black text-slate-800">অডিট রিপোর্ট (Audit Report)</h2>
        <p className="text-sm text-slate-500 mt-2">আপনার লোড প্রোফাইলের উপর ভিত্তি করে তৈরি করা শক্তি বিশ্লেষণ। এটি সিস্টেম ডিজাইন করতে ব্যবহৃত হবে।</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-xl p-6 border border-amber-200 bg-gradient-to-br from-amber-50 to-white flex flex-col gap-3 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-32 h-32 text-amber-600" />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-[11px] uppercase tracking-[0.1em] text-amber-700 font-bold bg-amber-100 px-2 py-1 rounded inline-block mb-3">পিক লোড (Peak Load)</span>
              <div className="text-3xl font-black text-slate-800 tracking-tight">
                {metrics.peakLoadW.toLocaleString()} <span className="text-lg font-bold text-amber-500">W</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-2 border-t border-amber-200/50 pt-3 relative z-10">সবগুলো যন্ত্রপাতি একসাথে চালালে আপনার ইনভার্টারকে এই পরিমাণ লোড নিতে হবে।</p>
        </div>

        <div className="rounded-xl p-6 border border-blue-200 bg-gradient-to-br from-blue-50 to-white flex flex-col gap-3 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Battery className="w-32 h-32 text-blue-600" />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-[11px] uppercase tracking-[0.1em] text-blue-700 font-bold bg-blue-100 px-2 py-1 rounded inline-block mb-3">দৈনিক শক্তি (Daily Energy)</span>
              <div className="text-3xl font-black text-slate-800 tracking-tight">
                {metrics.dailyEnergyKWh} <span className="text-lg font-bold text-blue-500">kWh</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Battery className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-2 border-t border-blue-200/50 pt-3 relative z-10">প্রতিদিন আপনার ব্যবহৃত মোট শক্তির পরিমাণ {metrics.dailyEnergyWh.toLocaleString()} Wh।</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-white overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
        <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-[11px] uppercase tracking-[0.1em] text-slate-500 font-bold">এনার্জি কনজাম্পশন ব্রেকডাউন</h4>
          <span className="text-xs font-medium text-slate-400">টপ ৩ যন্ত্রপাতি</span>
        </div>
        <div className="flex flex-col">
          {[...appliances]
            .map(app => ({...app, dailyWh: app.watts * app.quantity * app.hours}))
            .sort((a, b) => b.dailyWh - a.dailyWh)
            .slice(0, 3)
            .map((app, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 px-4 border-b last:border-b-0 border-slate-100 hover:bg-slate-50">
                <span className="font-semibold text-sm text-slate-700">{app.name}</span>
                <div className="flex items-center gap-4">
                  <div className="w-24 sm:w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{width: `${metrics.dailyEnergyWh > 0 ? (app.dailyWh / metrics.dailyEnergyWh) * 100 : 0}%`}}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono font-bold w-10 text-right">
                    {metrics.dailyEnergyWh > 0 ? ((app.dailyWh / metrics.dailyEnergyWh) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="text-center mb-2 print:hidden">
        <h2 className="text-2xl font-black text-slate-800">সিস্টেম ব্লুপ্রিন্ট (System Blueprint)</h2>
        <p className="text-sm text-slate-500 mt-2">আপনার নির্দিষ্ট চাহিদার ভিত্তিতে আমাদের ইঞ্জিন প্রস্তুতকৃত অ্যাডভান্সড সিস্টেম স্পেসিফিকেশন।</p>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden border border-slate-700">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Settings className="w-64 h-64 rotate-45 transform translate-x-12 -translate-y-12" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 border-b border-slate-700/50 pb-6">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400 mb-3 bg-blue-900/40 px-3 py-1 rounded inline-block border border-blue-500/20">প্রস্তাবিত সিস্টেম ক্যাপাসিটি</h3>
            <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-md">
              {(metrics.recommendedInverterW / 1000).toFixed(1)} <span className="text-2xl text-slate-400 font-bold">kW</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-[10px] uppercase tracking-[0.1em] text-emerald-400 font-bold mb-1">আনুমানিক প্রজেক্ট খরচ</div>
            <div className="text-2xl font-bold text-white">৳ {metrics.totalSetupCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            <div className="text-[11px] text-slate-400 mt-1">ROI: {metrics.roiYears > 0 ? `${metrics.roiYears.toFixed(1)} বছর` : 'হিসাব করা যাচ্ছে না'}</div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/20 rounded-lg"><Sun className="w-5 h-5 text-amber-400" /></div>
              <span className="text-sm font-bold text-slate-200">সোলার অ্যারে</span>
            </div>
            <div className="text-2xl font-black">{metrics.requiredSolarArrayW.toLocaleString()} <span className="text-sm text-slate-400 font-bold">W</span></div>
            <div className="text-xs text-slate-400 mt-2 font-medium">{metrics.panelCount}x {basicInfo.panelWattage}W প্যানেল প্রয়োজন</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg"><Zap className="w-5 h-5 text-blue-400" /></div>
              <span className="text-sm font-bold text-slate-200">ইনভার্টার সাইজ</span>
            </div>
            <div className="text-2xl font-black">{metrics.recommendedInverterW.toLocaleString()} <span className="text-sm text-slate-400 font-bold">VA</span></div>
            <div className="text-xs text-slate-400 mt-2 font-medium">পিওর সাইন ওয়েভ {basicInfo.backupNeeds === 'grid-tied' ? 'অন-গ্রিড' : basicInfo.backupNeeds === 'full' ? 'অফ-গ্রিড' : 'হাইব্রিড'}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg"><Battery className="w-5 h-5 text-emerald-400" /></div>
              <span className="text-sm font-bold text-slate-200">ব্যাটারি স্টোরেজ</span>
            </div>
            <div className="text-2xl font-black">
              {metrics.requiredGrossBatteryWh === 0 ? "০" : metrics.requiredGrossBatteryWh.toLocaleString()} <span className="text-sm text-slate-400 font-bold">Wh</span>
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">
              {metrics.requiredGrossBatteryWh > 0 ? `${metrics.batteryCount}x ${basicInfo.batteryType === 'lithium' ? '48V 100Ah' : '12V 200Ah'} ব্যাটারি` : 'বিনা ব্যাটারি সিস্টেম'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Cost Breakdown (BOM) */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden flex flex-col">
          <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-500" />
              বিস্তারিত খরচ (Bill of Materials) - BDT
            </h3>
          </div>
          <div className="flex-1 p-0 flex flex-col">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 text-slate-600">সোলার প্যানেল ({metrics.panelCount}x {basicInfo.panelWattage}W)</td>
                  <td className="px-5 py-3 text-right font-bold text-slate-800">৳ {metrics.panelCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 text-slate-600">ইনভার্টার ({metrics.recommendedInverterW} VA)</td>
                  <td className="px-5 py-3 text-right font-bold text-slate-800">৳ {metrics.inverterCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 text-slate-600">ব্যাটারি ({metrics.requiredGrossBatteryWh > 0 ? `${metrics.batteryCount}x ${basicInfo.batteryType === 'lithium' ? 'LiFePO4' : 'Tubular'}` : 'প্রয়োজন নেই'})</td>
                  <td className="px-5 py-3 text-right font-bold text-slate-800">৳ {metrics.batteryCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 text-slate-600">মাউন্টিং স্ট্রাকচার (GI/SS)</td>
                  <td className="px-5 py-3 text-right font-bold text-slate-800">৳ {metrics.structureCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 text-slate-600">ক্যাবল, ব্রেকার ও সাব-কম্পোনেন্টস (BOS)</td>
                  <td className="px-5 py-3 text-right font-bold text-slate-800">৳ {metrics.bosCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                </tr>
                <tr className="hover:bg-slate-50/50 border-b-2 border-slate-200">
                  <td className="px-5 py-3 text-slate-600">ইন্সটলেশন ও লেবার চার্জ</td>
                  <td className="px-5 py-3 text-right font-bold text-slate-800">৳ {metrics.installCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                </tr>
                <tr className="bg-emerald-50/50">
                  <td className="px-5 py-4 text-emerald-900 font-black">সর্বমোট আনুমানিক প্রজেক্ট খরচ</td>
                  <td className="px-5 py-4 text-right text-lg font-black text-emerald-600">৳ {metrics.totalSetupCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                </tr>
              </tbody>
            </table>
            <div className="px-5 py-3 text-[10px] text-slate-400 border-t border-slate-100 bg-slate-50/50 mt-auto">
              * এটি বাংলাদেশের বর্তমান বাজারদর অনুযায়ী আনুমানিক হিসাব। ব্র্যান্ড ও স্পেসিফিকেশন ভেদে ৫-১০% পরিবর্তন হতে পারে।
            </div>
          </div>
        </div>

        {/* Engineering constraints */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
              <Ruler className="w-5 h-5 text-blue-500" />
              ইঞ্জিনিয়ারিং স্পেসিফিকেশন (Technical Needs)
            </h3>
            
            <div className="flex justify-between items-center border-b border-slate-50 pb-3 mt-2">
              <div className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                <Box className="w-4 h-4 text-slate-400" /> ছাদের জায়গা প্রয়োজন
              </div>
              <div className="font-bold text-slate-800">~{metrics.requiredSpaceSqFt} স্কয়ার ফুট</div>
            </div>
            
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <div className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                <Wrench className="w-4 h-4 text-slate-400" /> প্রস্তাবিত ক্যাবল সাইজ (Battery)
              </div>
              <div className="font-bold text-slate-800">{metrics.suggestedCableAWG}</div>
            </div>

            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <div className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                <ShieldCheck className="w-4 h-4 text-slate-400" /> সেফটি রিকমেন্ডেশন
              </div>
              <div className="font-bold text-slate-800 text-right text-[11px] sm:text-xs">
                DC Breaker + SPD + Proper Earthing
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] uppercase tracking-[0.1em] text-blue-800 font-bold">বিনিয়োগ ফেরত (Return on Investment)</span>
            </div>
            <div className="flex justify-between items-end">
               <div>
                 <div className="text-xs text-slate-500 font-medium">মাসিক সাশ্রয় (বিদ্যুৎ বিল)</div>
                 <div className="text-xl font-black text-blue-700 mt-0.5">৳ {metrics.monthlySavingsBDT.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
               </div>
               <div className="text-right">
                 <div className="text-xs text-slate-500 font-medium">বিনিয়োগ উঠবে</div>
                 <div className="text-lg font-black text-slate-800">{metrics.roiYears > 0 ? `${metrics.roiYears.toFixed(1)} বছরে` : '-'}</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 sm:p-8 mt-2 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
        <h3 className="text-base font-black text-slate-800 mb-6 pb-3 border-b border-slate-200 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          প্রকিউরমেন্ট স্পেসিফিকেশন (Technical Specs)
        </h3>
        
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="bg-white p-5 border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <h4 className="text-[11px] font-bold text-blue-600 mb-4 uppercase tracking-[0.1em] flex items-center gap-2"><Zap className="w-3.5 h-3.5"/> ১. ইনভার্টার প্যারামিটার</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">ধরন</span>
                <span className="font-bold text-slate-800 text-right">{basicInfo.backupNeeds === 'grid-tied' ? 'On-Grid' : basicInfo.backupNeeds === 'full' ? 'Off-Grid' : 'Hybrid'} </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">ক্যাপাসিটি</span>
                <span className="font-bold text-slate-800">{metrics.recommendedInverterW} VA</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">সার্জ পাওয়ার</span>
                <span className="font-bold text-slate-800">{Math.ceil(metrics.surgeTargetW / 500) * 500} W</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500 font-medium">সিস্টেম ভোল্টেজ</span>
                <span className="font-bold text-slate-800">{basicInfo.systemVoltage}V DC</span>
              </div>
            </div>
          </div>

          {metrics.requiredGrossBatteryWh > 0 && (
            <div className="bg-white p-5 border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <h4 className="text-[11px] font-bold text-emerald-600 mb-4 uppercase tracking-[0.1em] flex items-center gap-2"><Battery className="w-3.5 h-3.5"/> ২. স্টোরেজ প্যারামিটার</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500 font-medium">কেমিস্ট্রি</span>
                  <span className="font-bold text-slate-800 text-right">{basicInfo.batteryType === 'lithium' ? 'LiFePO4' : 'Tall Tubular'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500 font-medium">মোট ক্যাপাসিটি</span>
                  <span className="font-bold text-slate-800">{metrics.requiredGrossBatteryWh} Wh</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500 font-medium">কনফিগারেশন</span>
                  <span className="font-bold text-slate-800 text-right">{metrics.batteryCount}x {basicInfo.batteryType === 'lithium' ? '48V' : '12V'}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500 font-medium">DoD লিমিট</span>
                  <span className="font-bold text-slate-800">{basicInfo.batteryType === 'lithium' ? '৮০%' : '৫০%'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-5 border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <h4 className="text-[11px] font-bold text-amber-600 mb-4 uppercase tracking-[0.1em] flex items-center gap-2"><Sun className="w-3.5 h-3.5"/> ৩. সোলার অ্যারে প্যারামিটার</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">প্রযুক্তি</span>
                <span className="font-bold text-slate-800 text-right">Mono PERC / TOPCon</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">প্যানেল রেটিং</span>
                <span className="font-bold text-slate-800">{basicInfo.panelWattage} Wp</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-medium">প্যানেল সংখ্যা</span>
                <span className="font-bold text-slate-800">{metrics.panelCount} টি</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500 font-medium">মোট ক্যাপাসিটি</span>
                <span className="font-bold text-slate-800">{(metrics.requiredSolarArrayW / 1000).toFixed(1)} kW</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 sm:p-8 mt-4 shadow-[0_2px_10px_-3px_rgba(30,41,59,0.05)]">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-6 pb-4 border-b border-slate-100 gap-4">
          <div>
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              রিকমেন্ডেড কমপোনেন্ট ব্র্যান্ড
            </h3>
            <p className="text-xs text-slate-500 mt-1">বাংলাদেশের বাজারে প্রাপ্ত বিশ্বস্ত ব্র্যান্ডের তালিকা</p>
          </div>
          <button 
            onClick={() => setShowCompareModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-lg shadow-sm transition-transform active:scale-95"
          >
            <Scale className="w-4 h-4" /> প্রোডাক্ট তুলনা করুন
          </button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h4 className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">ইনভার্টার</h4>
            <ul className="space-y-3">
              {SYSTEM_BRANDS.inverters.map(b => (
                <li key={b.brand} className="text-sm">
                  <span className="font-semibold text-slate-700">{b.brand}</span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{b.desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
              ব্যাটারি ({basicInfo.batteryType === 'lithium' ? 'Lithium' : 'Lead-Acid'})
            </h4>
            <ul className="space-y-3">
              {(basicInfo.batteryType === 'lithium' ? SYSTEM_BRANDS.lithium : SYSTEM_BRANDS.tubular).map(b => (
                <li key={b.brand} className="text-sm">
                  <span className="font-semibold text-slate-700">{b.brand}</span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{b.desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">সোলার প্যানেল</h4>
            <ul className="space-y-3">
              {SYSTEM_BRANDS.panels.map(b => (
                <li key={b.brand} className="text-sm">
                  <span className="font-semibold text-slate-700">{b.brand}</span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{b.desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">পাওয়ার স্টেশন (All-in-One)</h4>
            <ul className="space-y-3">
              {SYSTEM_BRANDS.powerStations.map(b => (
                <li key={b.brand} className="text-sm">
                  <span className="font-semibold text-slate-700">{b.brand}</span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{b.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Compare Modal
  const CompareModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">তুলনামূলক বিশ্লেষণ (Product Comparison)</h2>
              <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">ইনভার্টার, ব্যাটারি এবং সোলার প্যানেলের বিস্তারিত তথ্যাদি</p>
            </div>
          </div>
          <button onClick={() => setShowCompareModal(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-6 space-y-8 bg-slate-50/50">
          
          {/* Inverters Comparison */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
              <h3 className="font-bold text-blue-800 flex items-center gap-2 text-sm uppercase tracking-wider"><Settings className="w-4 h-4"/> ইনভার্টার (Inverters) 5kW</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm min-w-[600px]">
                <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="p-3 border-b font-bold">ব্র্যান্ড ও মডেল</th>
                    <th className="p-3 border-b font-bold">ধরন (Type)</th>
                    <th className="p-3 border-b font-bold">ক্যাপাসিটি</th>
                    <th className="p-3 border-b font-bold">সার্জ রেটিং</th>
                    <th className="p-3 border-b font-bold">ওয়ারেন্টি</th>
                    <th className="p-3 border-b font-bold text-right">আনুমানিক মূল্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PRODUCT_COMPARISON_DB.inverters.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">{item.brand} <span className="text-slate-500 text-xs font-normal block">{item.model}</span></td>
                      <td className="p-3 text-slate-600">{item.type}</td>
                      <td className="p-3 text-slate-600 font-mono">{item.capacity}</td>
                      <td className="p-3 text-slate-600 text-xs">{item.maxSurge}</td>
                      <td className="p-3 text-slate-600 text-xs">{item.warranty}</td>
                      <td className="p-3 text-right font-bold text-emerald-600">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Batteries Comparison */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100">
              <h3 className="font-bold text-emerald-800 flex items-center gap-2 text-sm uppercase tracking-wider"><Battery className="w-4 h-4"/> ব্যাটারি (Batteries)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm min-w-[700px]">
                <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="p-3 border-b font-bold">ব্র্যান্ড ও মডেল</th>
                    <th className="p-3 border-b font-bold">কেমিস্ট্রি</th>
                    <th className="p-3 border-b font-bold">ক্যাপাসিটি (Wh)</th>
                    <th className="p-3 border-b font-bold">জীবনকাল (Cycles)</th>
                    <th className="p-3 border-b font-bold">ওয়ারেন্টি</th>
                    <th className="p-3 border-b font-bold text-right">আনুমানিক মূল্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PRODUCT_COMPARISON_DB.batteries.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">{item.brand} <span className="text-slate-500 text-xs font-normal block">{item.model}</span></td>
                      <td className="p-3 text-slate-600"><span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${item.chemistry === 'LiFePO4' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>{item.chemistry}</span></td>
                      <td className="p-3 text-slate-600 font-mono text-xs">{item.capacity}</td>
                      <td className="p-3 text-slate-600 text-xs font-mono">{item.lifeCycles}</td>
                      <td className="p-3 text-slate-600 text-xs">{item.warranty}</td>
                      <td className="p-3 text-right font-bold text-emerald-600">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panels Comparison */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
              <h3 className="font-bold text-amber-800 flex items-center gap-2 text-sm uppercase tracking-wider"><Sun className="w-4 h-4"/> সোলার প্যানেল (Solar Panels)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm min-w-[600px]">
                <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="p-3 border-b font-bold">ব্র্যান্ড ও মডেল</th>
                    <th className="p-3 border-b font-bold">প্রযুক্তি</th>
                    <th className="p-3 border-b font-bold">দক্ষতা (Efficiency)</th>
                    <th className="p-3 border-b font-bold">ওয়ারেন্টি (Prod/Perf)</th>
                    <th className="p-3 border-b font-bold text-right">আনুমানিক মূল্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PRODUCT_COMPARISON_DB.panels.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">{item.brand} <span className="text-slate-500 text-xs font-normal block">{item.model}</span></td>
                      <td className="p-3 text-slate-600 text-xs">{item.tech}</td>
                      <td className="p-3 text-slate-600 font-mono text-xs"><span className="text-emerald-600 font-bold">{item.efficiency}</span></td>
                      <td className="p-3 text-slate-600 text-xs">{item.warranty}</td>
                      <td className="p-3 text-right font-bold text-emerald-600">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 font-sans text-slate-800 flex justify-center">
      {showCompareModal && <CompareModal />}
      <div className="w-full max-w-[1024px] flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 sm:p-2.5 rounded-xl shadow-inner border border-amber-400">
              <Sun className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">SolarCalc <span className="text-blue-600">PRO™</span></h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-[0.15em] mt-0.5">অ্যাডভান্সড সোলার অডিট অ্যালগরিদম</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <StepIndicator />
            <button className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-800 hidden sm:block">
              সেটিংস
            </button>
          </div>
        </header>

        {/* Main Area */}
        <div className="flex-1 min-h-[600px] bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 sm:p-6 flex-1 flex flex-col min-h-0 overflow-y-auto bg-slate-50">
            <div className={`${currentStep === 1 ? 'block' : 'hidden print:block mb-8 break-inside-avoid'}`}><Step1 /></div>
            <div className={`${currentStep === 2 ? 'block' : 'hidden print:block mb-8 break-inside-avoid'}`}><Step2 /></div>
            <div className={`${currentStep === 3 ? 'block' : 'hidden print:block mb-8 break-inside-avoid'}`}><Step3 /></div>
            <div className={`${currentStep === 4 ? 'block' : 'hidden print:block mb-8 break-inside-avoid'}`}><Step4 /></div>
          </div>

          {/* Navigation Footer */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold transition-colors cursor-pointer text-sm ${
                currentStep === 1 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : 'text-slate-600 hover:bg-slate-200 border border-slate-200 bg-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> আগের ধাপ
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95 cursor-pointer text-sm"
              >
                পরের ধাপ <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-md font-bold hover:bg-slate-800 shadow-sm transition-all active:scale-95 cursor-pointer text-sm"
              >
                রিপোর্ট প্রিন্ট করুন
              </button>
            )}
          </div>
        </div>
        
        <footer className="flex justify-between items-center text-xs text-slate-400 font-medium border-t pt-4 border-slate-200">
          <div>© ২০২৪ সোলারক্যালক বিডি (SolarCalc BD) • ভার্সন ২.১.০</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-600">সহায়িকা</a>
            <a href="#" className="hover:text-blue-600">শর্তাবলী</a>
            <a href="#" className="hover:text-blue-600">যোগাযোগ</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
