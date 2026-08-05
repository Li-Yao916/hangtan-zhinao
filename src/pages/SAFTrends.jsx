import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Droplets, DollarSign, Sliders, Info } from 'lucide-react';
import { defaultConstants } from '../data/data';

export default function SAFTrends() {
  // 控件状态
  const [safPrice, setSafPrice] = useState(defaultConstants.safPrice);
  const [jetFuelPrice, setJetFuelPrice] = useState(defaultConstants.jetFuelPrice);
  const [carbonPrice, setCarbonPrice] = useState(defaultConstants.carbonPrice);
  const [blendRatio, setBlendRatio] = useState(15); // 0-100
  const [lifecycleReduction, setLifecycleReduction] = useState(80); // SAF 生命周期减排率
  const [annualPriceDrop, setAnnualPriceDrop] = useState(5); // 年均降价率
  const [startYear] = useState(2026);
  const [endYear, setEndYear] = useState(2035);

  const years = useMemo(() => {
    const result = [];
    for (let y = startYear; y <= endYear; y++) result.push(y);
    return result;
  }, [startYear, endYear]);

  // SAF 价格预测数据
  const priceForecast = useMemo(() => {
    return years.map((year) => {
      const idx = year - startYear;
      const price = safPrice * Math.pow(1 - annualPriceDrop / 100, idx);
      return {
        year,
        SAF价格: Math.round(price),
        航空煤油价格: jetFuelPrice,
        价差: Math.round(price - jetFuelPrice),
      };
    });
  }, [years, safPrice, jetFuelPrice, annualPriceDrop]);

  // 不同掺混比例减排量
  const blendRatios = [5, 10, 15, 20, 30, 50];
  const reductionByBlend = useMemo(() => {
    const baseFuel = 10000; // 基准年耗油 10000 吨
    const baseCO2 = baseFuel * defaultConstants.co2EmissionFactor;
    return blendRatios.map((ratio) => ({
      掺混比例: `${ratio}%`,
      减排量: Math.round(baseCO2 * (ratio / 100) * (lifecycleReduction / 100)),
      剩余排放: Math.round(baseCO2 - baseCO2 * (ratio / 100) * (lifecycleReduction / 100)),
    }));
  }, [lifecycleReduction]);

  // 不同掺混比例成本变化
  const costByBlend = useMemo(() => {
    const baseFuel = 10000;
    const baseCO2 = baseFuel * defaultConstants.co2EmissionFactor;
    return blendRatios.map((ratio) => {
      const safTons = baseFuel * (ratio / 100);
      const safIncremental = safTons * (safPrice - jetFuelPrice);
      const carbonSaving = baseCO2 * (ratio / 100) * (lifecycleReduction / 100) * carbonPrice;
      return {
        掺混比例: `${ratio}%`,
        'SAF增量成本': Math.round(safIncremental),
        碳成本节约: Math.round(carbonSaving),
        净成本变化: Math.round(safIncremental - carbonSaving),
      };
    });
  }, [safPrice, jetFuelPrice, carbonPrice, lifecycleReduction]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-[#0A2B3D] to-[#133A4B] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-7 h-7" />
          <div>
            <h2 className="text-xl font-bold">SAF 趋势预测</h2>
            <p className="text-sm text-gray-300 mt-0.5">可持续航空燃料（SAF）价格、减排与成本情景分析</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧控件 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            情景参数设置
          </h3>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              SAF 当前价格（元/吨）
            </label>
            <input
              type="number"
              value={safPrice}
              onChange={(e) => setSafPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              航空煤油价格（元/吨）
            </label>
            <input
              type="number"
              value={jetFuelPrice}
              onChange={(e) => setJetFuelPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              碳价（元/吨CO₂）
            </label>
            <input
              type="number"
              value={carbonPrice}
              onChange={(e) => setCarbonPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              SAF 掺混比例：{blendRatio}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={blendRatio}
              onChange={(e) => setBlendRatio(Number(e.target.value))}
              className="w-full accent-[#10B981]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              SAF 生命周期减排率：{lifecycleReduction}%
            </label>
            <input
              type="range"
              min={50}
              max={100}
              value={lifecycleReduction}
              onChange={(e) => setLifecycleReduction(Number(e.target.value))}
              className="w-full accent-[#10B981]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              年均降价率：{annualPriceDrop}%
            </label>
            <input
              type="range"
              min={1}
              max={15}
              value={annualPriceDrop}
              onChange={(e) => setAnnualPriceDrop(Number(e.target.value))}
              className="w-full accent-[#10B981]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              预测结束年份
            </label>
            <select
              value={endYear}
              onChange={(e) => setEndYear(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#133A4B] outline-none"
            >
              {[2030, 2035, 2040, 2045, 2050].map((y) => (
                <option key={y} value={y}>{y} 年</option>
              ))}
            </select>
          </div>
        </div>

        {/* 右侧图表区 */}
        <div className="lg:col-span-3 space-y-6">
          {/* SAF 价格预测折线图 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#F59E0B]" />
              SAF 价格预测（{startYear}-{endYear}）
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={priceForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `¥${v.toLocaleString()}/吨`} />
                <Legend />
                <Line type="monotone" dataKey="SAF价格" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="航空煤油价格" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="价差" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 不同掺混比例减排量 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#10B981]" />
              不同掺混比例下的减排量（基准年耗油 10,000 吨）
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={reductionByBlend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="掺混比例" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `${v.toLocaleString()} 吨CO₂`} />
                <Legend />
                <Bar dataKey="减排量" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="剩余排放" fill="#E5E7EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 不同掺混比例成本变化 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#F59E0B]" />
              不同掺混比例下的成本变化
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={costByBlend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="掺混比例" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `¥${v.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="SAF增量成本" fill="#EF4444" radius={[8, 8, 0, 0]} />
                <Bar dataKey="碳成本节约" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="净成本变化" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 底部标注 */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          本页为情景预测分析，基于用户输入的参数进行模拟计算。SAF 价格趋势受技术路线、原料供应、政策力度等多因素影响，
          预测结果不代表市场价格承诺。建议结合行业报告和政策动态进行综合决策。
        </p>
      </div>
    </div>
  );
}
