import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Calculator, Plane, MapPin, Droplets, TrendingDown,
  X, Download, Info, CheckCircle, Target, DollarSign, BarChart3, FileText,
  Zap, Wind, Wrench, Gauge, Leaf, Cpu, TrendingUp, Calendar, Layers, ArrowRight, AlertTriangle
} from 'lucide-react';
import {
  airportsData, aircraftData, airlines, fuelTypes, defaultConstants,
  findAirport, findAircraft, haversineDistance,
  calcFuelConsumption, calcCO2Emission, calcSAFReduction,
  calcAnnualFlights, calcAnnualFuelCost, calcCarbonCost,
  calcSAFIncrementalCost, fullCalculation,
} from '../data/data';

// ============================================================
// 减碳方案数据 —— 分层设计：差异化专项 + 共性普惠 + 远期战略
// ============================================================

// 一、差异化专项减碳方案（针对特定场景）
const SPECIAL_SCENARIOS = [
  {
    id: 'ops',
    name: '运行与地面优化',
    tag: '短途专项',
    tagColor: 'bg-emerald-100 text-emerald-700',
    icon: Zap,
    description: '聚焦繁忙枢纽和短途航线，通过深度滑行优化、改进离进场程序、单发滑行等手段降低地面与低空油耗。',
    safBlendRatio: 0,
    routeOptimize: 0.04,        // 航路优化 4%
    groundOptimize: 0.03,       // 地面优化 3%
    category: 'special',
    suggestions: [
      '深度滑行优化：繁忙枢纽推行单发滑行，减少地面等待油耗',
      '改进离进场程序（CDO/CCO）：短途航线优先使用连续下降/爬升',
      'APU 使用优化：推广地面电源车替代，减少 APU 运行时间',
      '预计单架次减排 5%-7%，适合日频次高的短途航线',
    ],
    costEstimate: '低（操作流程调整，几乎无硬件投入）',
    roiNote: '> 200%（纯节约型措施）',
  },
  {
    id: 'fleet',
    name: '机队与航线匹配',
    tag: '现有机队挖潜',
    tagColor: 'bg-blue-100 text-blue-700',
    icon: Plane,
    description: '针对现有机队进行精细化匹配：用更高效机型执飞高密度航线，提升客座率至 88%+，充分挖掘存量效率。',
    safBlendRatio: 0,
    routeOptimize: 0.02,        // 航线匹配优化 2%
    loadFactorImprove: 8,       // 客座率从 80% 提升到 88%
    category: 'special',
    suggestions: [
      '机型效率提升：将 A320neo/B737MAX 优先匹配长航线，旧机型调至短途',
      '客座率提升：通过动态定价和航线网络优化，目标 88%+',
      '舱位配置优化：调整两舱比例，提升单位座位收益与碳排放效率',
      '预计全机队减排 2%-3%，客座率每提升 1pp 约降低单客碳排 1.2%',
    ],
    costEstimate: '中（收益管理调整 + 航班计划重组）',
    roiNote: '~ 50% - 80%',
  },
  {
    id: 'saf',
    name: '能源替代与联运',
    tag: 'SAF 掺混 8%',
    tagColor: 'bg-amber-100 text-amber-700',
    icon: Droplets,
    description: '在短途航线上试点 SAF 掺混 8%，探索空铁联运替代方案，为远期能源转型积累运营经验。',
    safBlendRatio: 8,
    routeOptimize: 0.01,
    category: 'special',
    suggestions: [
      'SAF 掺混 8%：优先在短途航线（< 1500km）试行，利用其 80% 生命周期减排率',
      '空铁联运替代：针对 500km 以内航线，评估高铁替代可行性',
      '参与 CORSIA 试点：积累碳配额交易经验，为 EU ETS 合规做准备',
    ],
    costEstimate: '高（SAF 价格约为航煤 1.8x）',
    roiNote: '约 -157%（现阶段纯经济性为负，需政策补贴支撑）',
    warnSAF: true,
  },
];

// 二、共性普惠减碳措施（覆盖所有航线，标准化动作）
const COMMON_MEASURES = [
  {
    id: 'ground',
    name: '地面辅助降耗',
    icon: Zap,
    reduction: 0.005,  // 0.5%
    detail: '地面电源车替代 APU（0.2-0.5 吨/次），廊桥电源全覆盖',
    cost: '低',
    timeline: '0-6 个月',
  },
  {
    id: 'aero',
    name: '气动与减重',
    icon: Wind,
    reduction: 0.008,  // 0.8%
    detail: '定期清洁机身减少阻力、起落架整流优化、精准加油减少死重',
    cost: '低',
    timeline: '0-12 个月',
  },
  {
    id: 'engine',
    name: '发动机水洗维护',
    icon: Wrench,
    reduction: 0.013,  // 1.3%
    detail: '定期发动机水洗恢复排气温度裕度，提升约 1.3% 燃油效率',
    cost: '低',
    timeline: '0-6 个月',
  },
  {
    id: 'cda',
    name: '持续下降进近 (CDA)',
    icon: Gauge,
    reduction: 0.01,   // 1%
    detail: '推广持续下降进近程序，减少低空平飞段燃油消耗与噪音',
    cost: '低',
    timeline: '6-18 个月',
  },
  {
    id: 'cabin',
    name: '机舱轻量化',
    icon: Layers,
    reduction: 0.003,  // 0.3%
    detail: '机供品轻量化（减少餐车、用水量）、简配纸质刊物',
    cost: '极低',
    timeline: '0-3 个月',
  },
];

// 三、远期战略方向（十五五及远期）
const STRATEGIC_DIRECTIONS = [
  {
    id: 'renewal',
    name: '机队更新换代',
    icon: TrendingUp,
    desc: '逐步退役 A320ceo/B737-800，替换为 A320neo/B737MAX/A350/B787，单座油耗降低 15%-20%，远期削减 20%-30% 碳排。',
    phase: '3-10 年',
  },
  {
    id: 'digital_atc',
    name: '数字化空管优化 (TBO/FRA)',
    icon: Cpu,
    desc: '基于轨迹的运行（TBO）与实时风场航路规划，AI 预测高空气流推荐最优高度层，自由航路空域（FRA）减少绕飞。',
    phase: '3-7 年',
  },
  {
    id: 'fuel_policy',
    name: '动态燃油政策与数字孪生',
    icon: Calculator,
    desc: '基于大数据（历史气象、准点率）动态计算额外安全燃油（Contingency Fuel），减少不必要"死重"，每减 1 吨油 ≈ 减排 3.15 吨 CO₂。',
    phase: '2-5 年',
  },
  {
    id: 'hydrogen',
    name: '100% SAF 与氢能技术布局',
    icon: Leaf,
    desc: '推进 ASTM 标准 100% SAF 发动机兼容性测试，参与机场氢能加注基础设施联合规划，为 2035+ 氢能飞机商用做准备。',
    phase: '5-10 年',
  },
  {
    id: 'carbon_asset',
    name: '碳资产经营与旅客绿色联动',
    icon: DollarSign,
    desc: '建立航司碳抵消基金（林业/红树林碳汇），推出"绿色飞行积分"与"旅客自愿碳抵消"，将 SAF 成本转嫁给 ESG 意识强的客户。',
    phase: '2-5 年',
  },
];

// 四、十五五减排实施路径路线图
const ROADMAP_PHASES = [
  {
    phase: '🔴 第一阶段',
    period: '0-12 个月',
    title: '低成本全面铺开',
    tagline: '几乎无需大额投资，立刻执行',
    color: 'border-red-400 bg-red-50',
    dotColor: 'bg-red-500',
    items: [
      { label: '共性减碳措施', desc: '发动机水洗、地面电源替代、减重优化、机舱轻量化' },
      { label: '客座率提升', desc: '动态定价策略，目标从 80% 提升至 85%+' },
      { label: '飞行员节油培训', desc: '推广绿色运行手册，建立节油激励制度' },
      { label: '碳基线盘查', desc: '建立航线级碳排放 MRV 体系，摸清家底' },
    ],
  },
  {
    phase: '🟡 第二阶段',
    period: '1-3 年',
    title: '核心专项落地',
    tagline: '重点枢纽与主要航线推行',
    color: 'border-amber-400 bg-amber-50',
    dotColor: 'bg-amber-500',
    items: [
      { label: '滑行与进近优化', desc: '枢纽机场全面推行单发滑行 + CDA/CCO' },
      { label: '机型-航线匹配', desc: '高效机型优先匹配长航线，旧机型调短途' },
      { label: 'SAF 试点掺混', desc: '短途航线试行 5%-8% SAF，积累运营数据' },
      { label: '动态燃油政策', desc: '基于大数据优化额外安全燃油携带量' },
    ],
  },
  {
    phase: '🟢 第三阶段',
    period: '3-10 年',
    title: '战略转型与零碳探索',
    tagline: '面向碳中和目标的长线布局',
    color: 'border-green-400 bg-green-50',
    dotColor: 'bg-green-500',
    items: [
      { label: '机队更新换代', desc: '启动旧机退役计划，引进 A320neo/B737MAX/A350' },
      { label: '100% SAF 试点', desc: '推进 ASTM 标准 SAF 全掺混测试与认证' },
      { label: '碳资产经营', desc: '建立碳抵消基金，参与 CEA/EU ETS 碳交易' },
      { label: '氢能航空布局', desc: '参与机场氢能基础设施联合规划，技术跟踪' },
    ],
  },
];

// ===== 图标组件 =====
const hubIcon = (color) => `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke="white" stroke-width="2"/>
    <circle cx="12" cy="12" r="3" fill="white"/>
  </svg>`;

const normalIcon = (color) => `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="${color}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="5" stroke="white" stroke-width="1.5"/>
  </svg>`;

export default function CarbonAccounting() {
  // ===== 输入状态 =====
  const [airline, setAirline] = useState('中国国航');
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');
  const [stopover, setStopover] = useState('');
  const [aircraft, setAircraft] = useState('B737-800');
  const [fuelType, setFuelType] = useState('JetA1');
  const [dailyFlights, setDailyFlights] = useState(4);
  const [seats, setSeats] = useState(162);
  const [loadFactor, setLoadFactor] = useState(80);
  const [jetFuelPrice, setJetFuelPrice] = useState(defaultConstants.jetFuelPrice);
  const [safPrice, setSafPrice] = useState(defaultConstants.safPrice);
  const [carbonPrice, setCarbonPrice] = useState(defaultConstants.carbonPrice);
  const [safBlendRatio, setSafBlendRatio] = useState(10);
  const [emissionTarget, setEmissionTarget] = useState(15);

  // ===== 计算状态 =====
  const [calculated, setCalculated] = useState(false);

  // ===== 弹窗状态 =====
  const [dialogScenario, setDialogScenario] = useState(null);

  // ===== 地图状态 =====
  const [mapClickMode, setMapClickMode] = useState('origin'); // 'origin' | 'dest'

  // ===== 自动计算航距 =====
  const distance = useMemo(() => {
    const o = findAirport(origin);
    const d = findAirport(dest);
    if (o && d) return haversineDistance(o.lat, o.lng, d.lat, d.lng);
    return null;
  }, [origin, dest]);

  // ===== 自动根据机型计算参数 =====
  const acInfo = useMemo(() => findAircraft(aircraft), [aircraft]);

  const fuelPerFlight = useMemo(() => {
    if (!distance || !acInfo) return null;
    return calcFuelConsumption(distance, acInfo.cruiseSpeed, acInfo.hourlyFuelBurn);
  }, [distance, acInfo]);

  // ===== 核算结果 =====
  const results = useMemo(() => {
    if (!calculated || !distance || !acInfo) return null;
    return fullCalculation({
      origin, dest, aircraft, dailyFlights, seats, loadFactor,
      jetFuelPrice, safPrice, carbonPrice, safBlendRatio, emissionTarget,
    });
  }, [calculated, distance, acInfo]);

  // ===== 字段变化重置计算 =====
  const handleFieldChange = (setter) => (value) => {
    setter(value);
    setCalculated(false);
  };

  // ===== 机型变化联动 =====
  const handleAircraftChange = (model) => {
    setAircraft(model);
    const ac = findAircraft(model);
    if (ac) setSeats(ac.seats);
    setCalculated(false);
  };

  // ===== 地图点击机场 =====
  const handleAirportClick = (airportName) => {
    if (mapClickMode === 'origin') {
      setOrigin(airportName);
      setMapClickMode('dest');
    } else {
      setDest(airportName);
      setMapClickMode('origin');
    }
    setCalculated(false);
  };

  // ===== 地图标记坐标 =====
  const originCoords = useMemo(() => {
    const a = findAirport(origin);
    return a ? [a.lat, a.lng] : null;
  }, [origin]);
  const destCoords = useMemo(() => {
    const a = findAirport(dest);
    return a ? [a.lat, a.lng] : null;
  }, [dest]);

  // ===== 差异化方案计算 =====
  const specialResults = useMemo(() => {
    if (!results) return [];
    return SPECIAL_SCENARIOS.map((s) => {
      const routeReduction = results.annualFuel * (s.routeOptimize || 0);
      const loadFactorImproveReduction = s.loadFactorImprove
        ? results.annualCO2 * (s.loadFactorImprove / 100) * 0.5
        : 0;
      const groundReduction = s.groundOptimize
        ? results.annualFuel * (s.groundOptimize || 0)
        : 0;

      const optimizedFuel = results.annualFuel - routeReduction - groundReduction;
      const safReduction = calcSAFReduction(
        calcCO2Emission(optimizedFuel), s.safBlendRatio || 0
      );
      const newCO2 = calcCO2Emission(optimizedFuel) - safReduction - loadFactorImproveReduction;
      const reduction = results.annualCO2 - newCO2;
      const reductionRate = results.annualCO2 > 0 ? (reduction / results.annualCO2) * 100 : 0;
      const safCost = calcSAFIncrementalCost(optimizedFuel, s.safBlendRatio || 0, jetFuelPrice, safPrice);
      const carbonSaving = reduction * carbonPrice;
      const netCost = safCost - carbonSaving;
      const unitCost = reduction > 0 ? netCost / reduction : 0;
      const roi = safCost > 0 ? ((carbonSaving - safCost) / safCost * 100) : 0;

      return {
        ...s,
        newCO2: Math.round(newCO2),
        reduction: Math.round(reduction),
        reductionRate: reductionRate.toFixed(1),
        safCost: Math.round(safCost),
        carbonSaving: Math.round(carbonSaving),
        netCost: Math.round(netCost),
        unitCost: Math.round(unitCost),
        roi: roi.toFixed(1),
        optimizedFuel: Math.round(optimizedFuel),
      };
    });
  }, [results, jetFuelPrice, safPrice, carbonPrice]);

  // ===== 共性措施累计减排量 =====
  const commonMeasuresTotal = useMemo(() => {
    if (!results) return { totalReduction: 0, totalRate: 0 };
    const totalReductionRate = COMMON_MEASURES.reduce((sum, m) => sum + (m.reduction || 0), 0);
    const totalReduction = results.annualCO2 * totalReductionRate;
    return {
      totalReduction: Math.round(totalReduction),
      totalRate: (totalReductionRate * 100).toFixed(2),
      measures: COMMON_MEASURES.map((m) => ({
        ...m,
        measureReduction: Math.round(results.annualCO2 * m.reduction),
      })),
    };
  }, [results]);

  // ===== 综合方案对比图表数据 =====
  const scenarioChartData = useMemo(() => {
    if (!results) return [];
    const commonReduction = results.annualCO2 * COMMON_MEASURES.reduce((s, m) => s + m.reduction, 0);
    return [
      { name: '当前排放', emission: Math.round(results.annualCO2) },
      { name: '+共性措施', emission: Math.round(results.annualCO2 - commonReduction) },
      ...specialResults.map((s) => ({
        name: s.name,
        emission: s.newCO2,
      })),
    ];
  }, [results, specialResults]);

  // ===== 详情弹窗图表数据 =====
  const dialogChartData = useMemo(() => {
    if (!dialogScenario || !results) return null;
    return [
      { name: '减碳前', 碳排放: Math.round(results.annualCO2) },
      { name: '减碳后', 碳排放: dialogScenario.newCO2 },
    ];
  }, [dialogScenario, results]);

  const dialogCostData = useMemo(() => {
    if (!dialogScenario) return null;
    return [
      { name: 'SAF增量成本', 金额: dialogScenario.safCost },
      { name: '碳成本节约', 金额: -dialogScenario.carbonSaving },
      { name: '最终成本增减', 金额: dialogScenario.netCost },
    ];
  }, [dialogScenario]);

  // ===== 清空选择 =====
  const clearSelection = () => {
    setOrigin('');
    setDest('');
    setMapClickMode('origin');
    setCalculated(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-[#0A2B3D] to-[#133A4B] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Calculator className="w-7 h-7" />
          <div>
            <h2 className="text-xl font-bold">碳排核算</h2>
            <p className="text-sm text-gray-300 mt-0.5">输入航线参数，一键核算碳排放并获取减碳方案</p>
          </div>
        </div>
      </div>

      {/* 数据输入区 + 地图 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 输入表单 - 占2列 */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plane className="w-5 h-5 text-[#133A4B]" />
            航线参数设置
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 航司 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">航司</label>
              <select
                value={airline}
                onChange={(e) => handleFieldChange(setAirline)(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              >
                {airlines.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* 出发地 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                出发地
                <span className="text-xs text-gray-400 ml-1">（点击地图或下拉选择）</span>
              </label>
              <select
                value={origin}
                onChange={(e) => handleFieldChange(setOrigin)(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              >
                <option value="">请选择出发地</option>
                {airportsData.map((a) => (
                  <option key={a.name} value={a.name}>{a.name} ({a.iata})</option>
                ))}
              </select>
            </div>

            {/* 目的地 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                目的地
                <span className="text-xs text-gray-400 ml-1">（点击地图或下拉选择）</span>
              </label>
              <select
                value={dest}
                onChange={(e) => handleFieldChange(setDest)(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              >
                <option value="">请选择目的地</option>
                {airportsData.map((a) => (
                  <option key={a.name} value={a.name}>{a.name} ({a.iata})</option>
                ))}
              </select>
            </div>

            {/* 经停/中转 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">经停/中转</label>
              <input
                type="text"
                value={stopover}
                onChange={(e) => handleFieldChange(setStopover)(e.target.value)}
                placeholder="如无经停请留空"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              />
            </div>

            {/* 机型 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">机型</label>
              <select
                value={aircraft}
                onChange={(e) => handleAircraftChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              >
                {aircraftData.map((a) => (
                  <option key={a.model} value={a.model}>
                    {a.model}（{a.type}，巡航{a.cruiseSpeed}km/h，油耗{a.hourlyFuelBurn}t/h）
                  </option>
                ))}
              </select>
            </div>

            {/* 燃油类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">燃油类型</label>
              <select
                value={fuelType}
                onChange={(e) => handleFieldChange(setFuelType)(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              >
                {fuelTypes.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* 航距（自动计算） */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">航距（自动计算）</label>
              <input
                type="text"
                value={distance ? `${distance.toLocaleString()} 公里` : '请选择出发地和目的地'}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 outline-none"
              />
            </div>

            {/* 每日航班数 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">每日航班数</label>
              <input
                type="number"
                value={dailyFlights}
                onChange={(e) => handleFieldChange(setDailyFlights)(Number(e.target.value))}
                min={1} max={20}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              />
            </div>

            {/* 座位数 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">座位数</label>
              <input
                type="number"
                value={seats}
                onChange={(e) => handleFieldChange(setSeats)(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              />
            </div>

            {/* 客座率 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">客座率 (%)</label>
              <input
                type="number"
                value={loadFactor}
                onChange={(e) => handleFieldChange(setLoadFactor)(Number(e.target.value))}
                min={0} max={100}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              />
            </div>

            {/* 单位燃油消耗 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">单位燃油消耗（自动估算）</label>
              <input
                type="text"
                value={fuelPerFlight ? `${fuelPerFlight.toFixed(2)} 吨/架次` : '—'}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 outline-none"
              />
            </div>

            {/* 航空煤油价格 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                航空煤油价格（元/吨）
                <span className="text-xs text-gray-400 ml-1">默认市场均价 5000</span>
              </label>
              <input
                type="number"
                value={jetFuelPrice}
                onChange={(e) => handleFieldChange(setJetFuelPrice)(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              />
            </div>

            {/* SAF 价格 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                SAF 价格（元/吨）
                <span className="text-xs text-gray-400 ml-1">默认市场均价 9000</span>
              </label>
              <input
                type="number"
                value={safPrice}
                onChange={(e) => handleFieldChange(setSafPrice)(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              />
            </div>

            {/* 碳价 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                碳价（元/吨CO₂）
                <span className="text-xs text-gray-400 ml-1">默认 80</span>
              </label>
              <input
                type="number"
                value={carbonPrice}
                onChange={(e) => handleFieldChange(setCarbonPrice)(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              />
            </div>

            {/* SAF 掺混比例 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                SAF 掺混比例 (%)
              </label>
              <input
                type="number"
                value={safBlendRatio}
                onChange={(e) => handleFieldChange(setSafBlendRatio)(Number(e.target.value))}
                min={0} max={100}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              />
            </div>

            {/* 减排目标 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">减排目标 (%)</label>
              <input
                type="number"
                value={emissionTarget}
                onChange={(e) => handleFieldChange(setEmissionTarget)(Number(e.target.value))}
                min={0} max={100}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* 操作按钮组 */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setCalculated(true)}
              disabled={!origin || !dest}
              className="flex items-center gap-2 bg-[#0A2B3D] hover:bg-[#133A4B] disabled:bg-gray-300 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Calculator className="w-4 h-4" />
              开始核算
            </button>
            <button
              onClick={clearSelection}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              清空重选
            </button>
          </div>
        </div>

        {/* 地图区 - 占1列 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#133A4B]" />
              航线地图
              <span className="text-xs text-gray-400 font-normal ml-auto">
                点击机场选择 {mapClickMode === 'origin' ? '出发地' : '目的地'}
              </span>
            </h3>
          </div>
          <div className="h-[420px]">
            <MapContainer
              center={[35, 110]}
              zoom={4}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {airportsData.map((airport) => (
                <Marker
                  key={airport.name}
                  position={[airport.lat, airport.lng]}
                  icon={new L.DivIcon({
                    className: '',
                    html: airport.type === '枢纽'
                      ? hubIcon('#EF4444')
                      : normalIcon('#3B82F6'),
                    iconSize: airport.type === '枢纽' ? [24, 24] : [16, 16],
                    iconAnchor: airport.type === '枢纽' ? [12, 12] : [8, 8],
                  })}
                  eventHandlers={{
                    click: () => handleAirportClick(airport.name),
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{airport.name}</strong> ({airport.iata})
                      <br />
                      <span className="text-xs text-gray-500">
                        {airport.city} · {airport.type}机场
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {/* 航线连接线 */}
              {originCoords && destCoords && (
                <Polyline
                  positions={[originCoords, destCoords]}
                  pathOptions={{ color: '#10B981', weight: 2, dashArray: '8 6' }}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* 核算结果卡片 */}
      {results && (
        <div className="space-y-6">
          {/* 核心指标卡 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '总航距', value: `${results.distance.toLocaleString()} 公里`, icon: MapPin, color: 'text-blue-600' },
              { label: '当前总碳排放', value: `${Math.round(results.annualCO2).toLocaleString()} 吨/年`, icon: TrendingDown, color: 'text-orange-600' },
              { label: '每客碳排放', value: `${results.perPassengerCO2.toFixed(2)} 吨/客`, icon: Plane, color: 'text-purple-600' },
              { label: '年度航班量', value: `${results.annualFlights.toLocaleString()} 架次`, icon: Calculator, color: 'text-green-600' },
              { label: '年度燃油成本', value: `${Math.round(results.annualFuelCost).toLocaleString()} 元`, icon: Droplets, color: 'text-red-600' },
              { label: '碳成本', value: `${Math.round(results.carbonCostTotal).toLocaleString()} 元`, icon: DollarSign, color: 'text-yellow-600' },
              { label: 'SAF 减排量', value: `${Math.round(results.safReduction).toLocaleString()} 吨CO₂`, icon: Target, color: 'text-emerald-600' },
              { label: '净成本变化', value: `${results.netCostChange >= 0 ? '+' : ''}${Math.round(results.netCostChange).toLocaleString()} 元`, icon: BarChart3, color: results.netCostChange >= 0 ? 'text-red-600' : 'text-green-600' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
                <div className="text-lg font-bold text-gray-800">{item.value}</div>
              </div>
            ))}
          </div>

          {/* ===== 一、差异化专项减碳方案 ===== */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-[#133A4B] rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#133A4B]" />
                差异化专项减碳方案
              </h3>
              <span className="text-xs text-gray-400">针对特定场景，追求极限减排</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {specialResults.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                  {/* 顶部色条 */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    s.id === 'ops' ? 'bg-emerald-500' : s.id === 'fleet' ? 'bg-blue-500' : 'bg-amber-500'
                  }`}></div>
                  <div className="flex items-start justify-between mb-3 pt-1">
                    <div className="flex items-center gap-2">
                      <s.icon className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-800">{s.name}</h4>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.tagColor}`}>
                      {s.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{s.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">预计减排量</span>
                      <span className="font-semibold text-green-600">{s.reduction.toLocaleString()} 吨</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">减排率</span>
                      <span className="font-semibold text-green-600">{s.reductionRate}%</span>
                    </div>
                    {s.safBlendRatio > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">SAF 增量成本</span>
                          <span className="font-semibold text-orange-600">¥{s.safCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">碳成本节约</span>
                          <span className="font-semibold text-green-600">¥{s.carbonSaving.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">投资估算</span>
                      <span className="font-semibold text-gray-700">{s.costEstimate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">经济性评估</span>
                      <span className={`font-semibold text-xs ${s.warnSAF ? 'text-red-500' : 'text-green-600'}`}>
                        {s.roiNote}
                      </span>
                    </div>
                  </div>
                  {s.warnSAF && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">
                        现阶段 SAF 经济性为负，需政策补贴或碳资产交易收益才能实现盈亏平衡。
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => setDialogScenario(s)}
                    className="w-full mt-4 py-2 text-sm font-medium text-[#133A4B] border border-[#133A4B] rounded-lg hover:bg-[#133A4B] hover:text-white transition-colors"
                  >
                    查看详情
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 二、共性普惠减碳措施 ===== */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-green-600" />
                共性普惠减碳措施
              </h3>
              <span className="text-xs text-gray-400">覆盖所有航线 · 标准化动作 · 无需大额投资</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              以下措施适用于全部航线，预计累计可减排约 <strong className="text-green-600">{commonMeasuresTotal.totalRate}%</strong>（约 {commonMeasuresTotal.totalReduction.toLocaleString()} 吨CO₂/年），几乎无需额外资本投入。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {commonMeasuresTotal.measures.map((m) => (
                <div key={m.id} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3 border border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <m.icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-gray-800">{m.name}</span>
                      <span className="text-xs text-green-600 font-medium">-{(m.reduction * 100).toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-gray-500">{m.detail}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-gray-400">💰 {m.cost}</span>
                      <span className="text-xs text-gray-400">⏱ {m.timeline}</span>
                      <span className="text-xs text-green-600 font-medium">{m.measureReduction.toLocaleString()} 吨/年</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 三、远期战略方向 ===== */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                远期战略方向
              </h3>
              <span className="text-xs text-gray-400">面向碳中和的长线布局</span>
            </div>
            <div className="space-y-3">
              {STRATEGIC_DIRECTIONS.map((d) => (
                <div key={d.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-[#133A4B] flex items-center justify-center shrink-0">
                    <d.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-800">{d.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">{d.phase}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 碳排放对比图表 ===== */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">方案减排效果对比</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scenarioChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} label={{ value: '吨CO₂/年', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
                <Tooltip formatter={(v) => `${v.toLocaleString()} 吨CO₂`} />
                <Legend />
                <Bar dataKey="emission" name="年度碳排放" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ===== 四、输出报告 + 十五五路线图 ===== */}
      {results && (
        <div className="space-y-6">
          {/* 综合输出报告 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#133A4B]" />
              综合输出报告
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">当前碳排放概况</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• 当前总排放量：<strong>{Math.round(results.annualCO2).toLocaleString()} 吨CO₂/年</strong></li>
                  <li>• 航班：{origin} → {dest}，{aircraft}机型</li>
                  <li>• 每客碳排放：{results.perPassengerCO2.toFixed(2)} 吨CO₂/客</li>
                  <li>• 共性措施可减：<strong className="text-green-600">{commonMeasuresTotal.totalReduction.toLocaleString()} 吨</strong>（{commonMeasuresTotal.totalRate}%）</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">推荐减碳组合策略</h4>
                <p className="text-sm text-gray-600">
                  优先落地<strong className="text-green-600">共性普惠措施</strong>（零成本减碳 {commonMeasuresTotal.totalReduction.toLocaleString()} 吨），
                  同步推进<strong className="text-blue-600">机队与航线匹配优化</strong>，
                  在短途航线试点<strong className="text-amber-600"> SAF 掺混</strong>积累经验。
                  综合减排潜力可达 <strong className="text-green-600">
                    {((commonMeasuresTotal.totalReduction + (specialResults[1]?.reduction || 0)) / results.annualCO2 * 100).toFixed(1)}%
                  </strong>。
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => alert('✅ 演示版：已生成 PDF 综合报告摘要！\n\n═══════════════════\n  航碳智脑 · 综合报告\n═══════════════════\n\n📊 碳排放总量：' + Math.round(results.annualCO2).toLocaleString() + ' 吨CO₂/年\n✈️ 航线：' + origin + ' → ' + dest + '\n🛩️ 机型：' + aircraft + '\n💰 年度燃油成本：¥' + Math.round(results.annualFuelCost).toLocaleString() + '\n🏷️ 碳成本：¥' + Math.round(results.carbonCostTotal).toLocaleString() + '\n\n🌿 共性减排：' + commonMeasuresTotal.totalReduction.toLocaleString() + ' 吨\n📋 专项减排：' + (specialResults[1]?.reduction?.toLocaleString() || '—') + ' 吨\n\n═══════════════════\n  本报告由航碳智脑自动生成\n═══════════════════')}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                生成 PDF 综合报告
              </button>
            </div>
          </div>

          {/* ===== 五、十五五减排实施路径路线图 ===== */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-[#10B981] rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#10B981]" />
                十五五减排实施路径路线图
              </h3>
              <span className="text-xs text-gray-400">分阶段落地 · 层层递进</span>
            </div>

            {/* 横向时间轴 */}
            <div className="relative">
              {/* 时间轴线 */}
              <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
              <div className="hidden md:grid grid-cols-3 gap-6 relative">
                {ROADMAP_PHASES.map((phase, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full ${phase.dotColor} flex items-center justify-center text-white text-2xl font-bold mb-3 z-10 shadow-lg`}>
                      {idx + 1}
                    </div>
                    <span className="text-sm font-bold text-gray-800">{phase.phase}</span>
                    <span className="text-xs text-gray-500 mb-2">{phase.period}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 阶段卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {ROADMAP_PHASES.map((phase, idx) => (
                <div key={idx} className={`border-2 rounded-2xl p-5 ${phase.color}`}>
                  <div className="md:hidden flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-full ${phase.dotColor} flex items-center justify-center text-white text-sm font-bold`}>
                      {idx + 1}
                    </div>
                    <div>
                      <span className="text-sm font-bold">{phase.phase}</span>
                      <span className="text-xs text-gray-500 ml-2">{phase.period}</span>
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-gray-800 mb-1">{phase.title}</h4>
                  <p className="text-xs text-gray-500 mb-4">{phase.tagline}</p>
                  <div className="space-y-3">
                    {phase.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 方案详情弹窗 */}
      {dialogScenario && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setDialogScenario(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dialogScenario.tagColor}`}>
                  {dialogScenario.tag}
                </span>
                <h3 className="text-lg font-bold text-gray-800">{dialogScenario.name}</h3>
              </div>
              <button
                onClick={() => setDialogScenario(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 space-y-6">
              {/* 方案说明 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">方案说明</h4>
                <p className="text-sm text-gray-600">{dialogScenario.description}</p>
              </div>

              {/* 碳排放对比图 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">减碳前后碳排放对比</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dialogChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => `${v.toLocaleString()} 吨CO₂`} />
                    <Bar dataKey="碳排放" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 成本构成对比 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">成本构成对比</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dialogCostData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => `¥${v.toLocaleString()}`} />
                    <Bar dataKey="金额" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 执行建议 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">具体执行建议</h4>
                <ul className="space-y-1.5">
                  {dialogScenario.suggestions.map((sg, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {sg}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 底部减排标注 */}
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-green-700">
                  预计减碳：{dialogScenario.reduction.toLocaleString()} 吨 ({dialogScenario.reductionRate}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
