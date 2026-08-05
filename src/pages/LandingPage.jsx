import { useNavigate } from 'react-router-dom';
import AnimatedHeading from '../components/AnimatedHeading';
import FadeIn from '../components/FadeIn';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* 背景视频 - 无遮罩 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
          type="video/mp4"
        />
      </video>

      {/* 内容层 */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 导航栏 */}
        <nav className="px-6 md:px-12 lg:px-16 pt-6">
          <div className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between">
            <span className="text-2xl font-semibold tracking-tight text-white">
              航碳智脑
            </span>
            <div className="hidden md:flex items-center gap-8 text-sm text-white">
              <span className="cursor-pointer hover:text-gray-300 transition-colors">碳排核算</span>
              <span className="cursor-pointer hover:text-gray-300 transition-colors">航线网络</span>
              <span className="cursor-pointer hover:text-gray-300 transition-colors">SAF趋势</span>
              <span className="cursor-pointer hover:text-gray-300 transition-colors">数据说明</span>
            </div>
            <button
              onClick={() => navigate('/dashboard/emissions')}
              className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              进入平台
            </button>
          </div>
        </nav>

        {/* 英雄区内容 */}
        <div className="flex-1 flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-12 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:items-end">
            {/* 左侧内容 */}
            <div>
              <AnimatedHeading
                text={`Shaping tomorrow
with vision and action.`}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-6"
              />

              <FadeIn delay={800} duration={1000}>
                <p className="text-base md:text-lg text-gray-300 mb-5">
                  We back visionaries and craft ventures that define what comes next.
                </p>
              </FadeIn>

              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate('/dashboard/emissions')}
                    className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    进入平台
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/emissions')}
                    className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all"
                  >
                    了解更多
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* 右侧标签 */}
            <FadeIn delay={1400} duration={1000}>
              <div className="flex items-end justify-start lg:justify-end mt-8 lg:mt-0">
                <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl">
                  <span className="text-lg md:text-xl lg:text-2xl font-light text-white">
                    Investing. Building. Advisory.
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
