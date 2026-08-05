import { BookOpen, Database, Calculator, Shield, Table } from 'lucide-react';
import { defaultConstants, aircraftData } from '../data/data';

export default function DataDescription() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-[#0A2B3D] to-[#133A4B] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <BookOpen className="w-7 h-7" />
          <div>
            <h2 className="text-xl font-bold">数据说明</h2>
            <p className="text-sm text-gray-300 mt-0.5">数据来源、计算方法和参数默认值</p>
          </div>
        </div>
      </div>

      {/* 数据来源总览 */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-[#133A4B]" />
          数据来源总览
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: '机场经纬度', desc: '基于 OpenStreetMap 公开地理数据及中国民航局公布的机场坐标信息。覆盖全国 50+ 主要机场。' },
            { title: '航线距离', desc: '通过 Haversine 大圆距离公式计算。部分航线距离参考各航司公布的航线里程数据。' },
            { title: '机型参数', desc: '参考飞机制造商（空客、波音、商飞）公布的性能参数手册，包括巡航速度、小时油耗等。' },
            { title: '航油排放因子', desc: '航空煤油 CO₂ 排放因子 3.15 吨CO₂/吨燃油，参考 IPCC 2006 指南及国际航空运输协会（IATA）推荐值。' },
            { title: 'SAF / 碳价', desc: 'SAF 价格参考国际 SAF 市场均价及国内试点项目数据。碳价参考全国碳排放权交易市场（CEA）近期成交均价。' },
            { title: '减碳方案假设', desc: '基于行业减排路径研究设定。成本估算参考 IATA、ICAO 技术报告及国内航空碳减排试点项目数据。' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 核心公式 */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[#133A4B]" />
          核心计算公式
        </h3>
        <div className="space-y-4">
          {[
            {
              name: 'Haversine 大圆距离公式',
              formula: 'd = 2R × arcsin(√(sin²(Δlat/2) + cos(lat₁) × cos(lat₂) × sin²(Δlng/2)))',
              desc: '其中 R = 6371 km（地球半径），Δlat、Δlng 分别为两点经纬度差值（弧度）。用于精确计算地球表面两点间的最短弧线距离。',
            },
            {
              name: '燃油消耗公式',
              formula: 'F = (D / V) × H × L',
              desc: '其中 D 为航距（km），V 为巡航速度（km/h），H 为小时油耗（吨/小时），L 为 LTO 附加系数（' + defaultConstants.ltoFactor + '）。LTO 附加系数用于校正起降阶段的额外燃油消耗。',
            },
            {
              name: '碳排放公式',
              formula: 'CO₂ = F × 3.15',
              desc: '其中 F 为燃油消耗量（吨），3.15 为航空煤油 CO₂ 排放因子（吨CO₂/吨燃油），基于 IPCC 指南推荐的碳含量及氧化率计算。',
            },
            {
              name: 'SAF 减排量公式',
              formula: 'R = CO₂ × β × η',
              desc: '其中 β 为 SAF 掺混比例（%），η 为 SAF 生命周期减排率（默认 ' + (defaultConstants.safLifecycleReduction * 100) + '%）。SAF 减排率考虑从原料种植/收集到燃烧的全生命周期。',
            },
            {
              name: '成本变化公式',
              formula: 'ΔC = F × β × (P_SAF − P_Jet) − R × P_Carbon',
              desc: '其中 P_SAF 为 SAF 价格（元/吨），P_Jet 为航空煤油价格（元/吨），P_Carbon 为碳价（元/吨CO₂）。正值表示净成本增加，负值表示净成本节约。',
            },
          ].map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">{item.name}</h4>
              <div className="bg-slate-50 rounded-lg p-3 mb-2 font-mono text-sm text-gray-700">
                {item.formula}
              </div>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ISO 14064 说明 */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#133A4B]" />
          ISO 14064 核算说明
        </h3>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <p className="text-sm text-gray-700 leading-relaxed">
            本平台参照 <strong>ISO 14064-1:2018</strong>《温室气体 — 第1部分：组织层级温室气体排放与移除的量化和报告规范》
            的以下核心原则组织碳排放核算过程：
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
            <li>
              <strong>• 边界设定：</strong>
              采用运营控制法，核算范围限定在航司运营控制下的航班飞行活动产生的直接温室气体排放（Scope 1）。
              涵盖航空煤油燃烧产生的 CO₂ 排放，暂不包括其他温室气体（如 N₂O、CH₄）及地面设施排放。
            </li>
            <li>
              <strong>• 活动数据采集：</strong>
              依据 ISO 14064 对活动数据质量的分级要求（初级数据优先），航线距离采用 Haversine 大圆距离计算，
              燃油消耗基于机型性能参数和航距估算，LTO 附加系数用于修正起降阶段的额外消耗。
            </li>
            <li>
              <strong>• 排放因子选择：</strong>
              航空煤油 CO₂ 排放因子 3.15 吨CO₂/吨燃油，来源于 IPCC 2006 国家温室气体清单指南，
              符合 ISO 14064 对排放因子"来源可靠、定期更新"的要求。
            </li>
            <li>
              <strong>• 量化方法：</strong>
              采用排放因子法（活动数据 × 排放因子），这是 ISO 14064 推荐的温室气体量化基本方法。
            </li>
            <li>
              <strong>• 披露原则：</strong>
              遵循相关性、完整性、一致性、准确性和透明度五大原则。本平台在"数据说明"页面公开所有默认参数、
              计算公式和数据来源，确保核算过程可追溯、可验证。
            </li>
          </ul>
          <p className="mt-3 text-xs text-blue-600">
            <strong>重要声明：</strong>本平台参照的是 ISO 14064 的核算原则和框架，而非特指某一航空排放公式。
            航空碳排放的具体计算公式参考 IPCC 指南和 IATA 推荐方法。实际核算应以航司运营数据为准，
            本平台结果仅供研究和演示参考。
          </p>
        </div>
      </div>

      {/* 默认参数表格 */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Table className="w-5 h-5 text-[#133A4B]" />
          默认参数一览
        </h3>

        {/* 燃料与碳价参数 */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">燃料与碳价参数</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 pr-4">参数名称</th>
                  <th className="pb-2 pr-4">默认值</th>
                  <th className="pb-2 pr-4">单位</th>
                  <th className="pb-2">说明</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['航空煤油价格', defaultConstants.jetFuelPrice.toLocaleString(), '元/吨', '参考国内航油出厂价'],
                  ['SAF 价格', defaultConstants.safPrice.toLocaleString(), '元/吨', '参考国际 SAF 市场均价'],
                  ['碳价', defaultConstants.carbonPrice.toLocaleString(), '元/吨CO₂', '参考 CEA 碳市场成交均价'],
                  ['CO₂ 排放因子', defaultConstants.co2EmissionFactor, '吨CO₂/吨燃油', 'IPCC 航空煤油推荐值'],
                  ['LTO 附加系数', defaultConstants.ltoFactor, '—', '起降循环额外燃油消耗系数'],
                  ['SAF 生命周期减排率', `${defaultConstants.safLifecycleReduction * 100}%`, '—', '考虑全生命周期减排效果'],
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="py-2 pr-4 font-medium">{row[0]}</td>
                    <td className="py-2 pr-4">{row[1]}</td>
                    <td className="py-2 pr-4 text-gray-500">{row[2]}</td>
                    <td className="py-2 text-gray-500">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 机型参数 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">各机型默认参数</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 pr-4">机型</th>
                  <th className="pb-2 pr-4">类型</th>
                  <th className="pb-2 pr-4">巡航速度 (km/h)</th>
                  <th className="pb-2 pr-4">小时油耗 (吨/小时)</th>
                  <th className="pb-2">默认座位数</th>
                </tr>
              </thead>
              <tbody>
                {aircraftData.map((ac, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="py-2 pr-4 font-medium">{ac.model}</td>
                    <td className="py-2 pr-4">{ac.type}</td>
                    <td className="py-2 pr-4">{ac.cruiseSpeed}</td>
                    <td className="py-2 pr-4">{ac.hourlyFuelBurn}</td>
                    <td className="py-2">{ac.seats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
