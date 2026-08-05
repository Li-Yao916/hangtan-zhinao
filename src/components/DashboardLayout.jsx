import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Plane, Map, TrendingUp, FileText, Download, Home } from 'lucide-react';

const subNavItems = [
  { path: '/dashboard/emissions', label: '碳排核算', icon: Plane },
  { path: '/dashboard/routes', label: '航线网络', icon: Map },
  { path: '/dashboard/saf', label: 'SAF 趋势', icon: TrendingUp },
  { path: '/dashboard/data', label: '数据说明', icon: FileText },
];

export default function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 顶部品牌栏 */}
      <header className="bg-[#0A2B3D] text-white sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between px-6 lg:px-8 h-14">
          {/* 左侧 Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-lg font-bold tracking-wide hover:opacity-80 transition-opacity"
          >
            <Plane className="w-5 h-5" />
            <span>航碳智脑</span>
          </button>

          {/* 右侧 */}
          <div className="flex items-center gap-6">
            <span className="hidden md:block text-sm text-gray-300">
              航司碳效智能决策平台
            </span>
            <NavLink
              to="/"
              className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">首页</span>
            </NavLink>
            <button
              onClick={() => alert('演示版：已生成 PDF 综合报告摘要！\n\n报告涵盖：\n• 碳排放总量核算\n• 航线排放排名\n• 减排措施分析\n• 成本变化评估\n• 十五五实施路径')}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>下载综合报告</span>
            </button>
          </div>
        </div>
      </header>

      {/* 二级功能导航 */}
      <nav className="bg-white border-b border-gray-200 sticky top-14 z-40 shadow-sm">
        <div className="flex items-center px-6 lg:px-8 h-12 gap-1">
          {subNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#133A4B] text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#0A2B3D]'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* 页面内容 */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 底部 */}
      <footer className="bg-[#0A2B3D] text-gray-400 text-xs text-center py-3">
        © 2026 航碳智脑 — 民航碳效智能决策平台 | 本平台数据仅供研究与演示参考
      </footer>
    </div>
  );
}
