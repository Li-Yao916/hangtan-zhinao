import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Map, TrendingDown, Filter } from 'lucide-react';
import { airportsData, routesData, findAirport } from '../data/data';

// 排放等级着色
function getEmissionColor(emission) {
  if (emission < 10000) return '#10B981'; // 绿色 低排放
  if (emission < 20000) return '#F59E0B'; // 橙色 中排放
  return '#EF4444'; // 红色 高排放
}

function getEmissionLabel(emission) {
  if (emission < 10000) return '低排放';
  if (emission < 20000) return '中排放';
  return '高排放';
}

export default function RouteNetwork() {
  const [filterAirline, setFilterAirline] = useState('全部');

  const allAirlines = ['全部', ...new Set(routesData.map((r) => r.airline))];
  const filteredRoutes = filterAirline === '全部'
    ? routesData
    : routesData.filter((r) => r.airline === filterAirline);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="bg-gradient-to-r from-[#0A2B3D] to-[#133A4B] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Map className="w-7 h-7" />
          <div>
            <h2 className="text-xl font-bold">航线网络</h2>
            <p className="text-sm text-gray-300 mt-0.5">全国航线网络可视化，按排放等级着色展示</p>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">航司筛选：</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allAirlines.map((a) => (
            <button
              key={a}
              onClick={() => setFilterAirline(a)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterAirline === a
                  ? 'bg-[#133A4B] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#10B981]"></span>低排放</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>中排放</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>高排放</span>
        </div>
      </div>

      {/* 地图 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="h-[550px]">
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

            {/* 机场标记 */}
            {airportsData.map((airport) => (
              <Marker
                key={airport.name}
                position={[airport.lat, airport.lng]}
                icon={new L.DivIcon({
                  className: '',
                  html: `<svg width="${airport.type === '枢纽' ? '18' : '12'}" height="${airport.type === '枢纽' ? '18' : '12'}" viewBox="0 0 24 24" fill="${airport.type === '枢纽' ? '#EF4444' : '#3B82F6'}" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" stroke="white" stroke-width="2"/></svg>`,
                  iconSize: [airport.type === '枢纽' ? 18 : 12, airport.type === '枢纽' ? 18 : 12],
                  iconAnchor: [airport.type === '枢纽' ? 9 : 6, airport.type === '枢纽' ? 9 : 6],
                })}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{airport.name}</strong> ({airport.iata})
                    <br />
                    <span className="text-xs text-gray-500">{airport.city} · {airport.type}机场</span>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* 航线 */}
            {filteredRoutes.map((route, idx) => {
              const originAirport = findAirport(route.origin);
              const destAirport = findAirport(route.dest);
              if (!originAirport || !destAirport) return null;
              const color = getEmissionColor(route.annualEmission);
              return (
                <Polyline
                  key={idx}
                  positions={[
                    [originAirport.lat, originAirport.lng],
                    [destAirport.lat, destAirport.lng],
                  ]}
                  pathOptions={{
                    color,
                    weight: 1.5,
                    opacity: 0.7,
                  }}
                >
                  <Popup>
                    <div className="text-sm space-y-1 min-w-[180px]">
                      <p><strong>航司：</strong>{route.airline}</p>
                      <p><strong>起点：</strong>{route.origin}</p>
                      <p><strong>终点：</strong>{route.dest}</p>
                      <p><strong>航距：</strong>{route.distance} 公里</p>
                      <p><strong>机型：</strong>{route.aircraft}</p>
                      <p>
                        <strong>年度排放：</strong>
                        <span style={{ color }}>{route.annualEmission.toLocaleString()} 吨</span>
                        <span className="ml-1 text-xs">({getEmissionLabel(route.annualEmission)})</span>
                      </p>
                      <p className="text-xs text-green-600">
                        <strong>推荐减排方向：</strong>
                        {route.annualEmission > 20000
                          ? '高比例 SAF 掺混 + 机型升级'
                          : route.annualEmission > 10000
                          ? '优化航路 + 适度 SAF 掺混'
                          : '维持现有措施，持续监测'}
                      </p>
                    </div>
                  </Popup>
                </Polyline>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* 航线排放排名列表 */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-[#133A4B]" />
          航线排放排名（前10）
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 pr-4">排名</th>
                <th className="pb-2 pr-4">航线</th>
                <th className="pb-2 pr-4">航司</th>
                <th className="pb-2 pr-4">机型</th>
                <th className="pb-2 pr-4">航距(km)</th>
                <th className="pb-2 pr-4">年度排放(吨)</th>
                <th className="pb-2">等级</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredRoutes]
                .sort((a, b) => b.annualEmission - a.annualEmission)
                .slice(0, 10)
                .map((r, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 pr-4 font-medium">{idx + 1}</td>
                    <td className="py-2 pr-4">{r.origin} → {r.dest}</td>
                    <td className="py-2 pr-4">{r.airline}</td>
                    <td className="py-2 pr-4">{r.aircraft}</td>
                    <td className="py-2 pr-4">{r.distance}</td>
                    <td className="py-2 pr-4 font-medium">{r.annualEmission.toLocaleString()}</td>
                    <td className="py-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor:
                            r.annualEmission > 20000 ? '#FEE2E2' :
                            r.annualEmission > 10000 ? '#FEF3C7' : '#D1FAE5',
                          color:
                            r.annualEmission > 20000 ? '#DC2626' :
                            r.annualEmission > 10000 ? '#D97706' : '#059669',
                        }}
                      >
                        {getEmissionLabel(r.annualEmission)}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
