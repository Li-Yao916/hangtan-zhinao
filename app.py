# -*- coding: utf-8 -*-
"""
航碳智脑：民航碳效智能决策平台
Aviation Carbon Intelligence: Civil Aviation Carbon Efficiency Decision Platform

用于本科生"零碳"比赛路演展示。
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import folium
from streamlit_folium import st_folium, folium_static
import os

# ============================================================
# 页面配置
# ============================================================
st.set_page_config(
    page_title="航碳智脑 - 民航碳效智能决策平台",
    page_icon="✈️",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ============================================================
# 自定义 CSS 样式
# ============================================================
def inject_css():
    st.markdown("""
    <style>
    /* 全局字体与背景 */
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
    }
    
    /* 隐藏 Streamlit 默认元素 */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* 顶部导航栏 */
    .top-nav {
        background: #FFFFFF;
        padding: 8px 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #0F4C5C;
        position: sticky;
        top: 0;
        z-index: 999;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .top-nav .logo {
        font-size: 20px;
        font-weight: 700;
        color: #0F4C5C;
        letter-spacing: 2px;
    }
    .top-nav .nav-links {
        display: flex;
        gap: 20px;
        align-items: center;
    }
    .top-nav .nav-links a {
        text-decoration: none;
        color: #0B2F3A;
        font-size: 14px;
        font-weight: 500;
        padding: 6px 12px;
        border-radius: 4px;
        transition: all 0.2s;
    }
    .top-nav .nav-links a:hover, .top-nav .nav-links a.active {
        background: #0F4C5C;
        color: #FFFFFF;
    }
    
    /* 卡片样式 */
    .card {
        background: #FFFFFF;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        margin-bottom: 16px;
    }
    .card-green {
        border-left: 4px solid #2FB66D;
    }
    .card-orange {
        border-left: 4px solid #C97A3A;
    }
    .card-blue {
        border-left: 4px solid #2D9CDB;
    }
    
    /* 指标卡片 */
    .metric-card {
        background: #FFFFFF;
        border-radius: 8px;
        padding: 16px 20px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .metric-card .value {
        font-size: 28px;
        font-weight: 700;
        color: #0F4C5C;
    }
    .metric-card .label {
        font-size: 13px;
        color: #666;
        margin-top: 4px;
    }
    .metric-card.green .value { color: #2FB66D; }
    .metric-card.orange .value { color: #C97A3A; }
    .metric-card.blue .value { color: #2D9CDB; }
    
    /* 按钮样式 */
    .btn-primary {
        background: #C97A3A;
        color: #FFFFFF;
        border: none;
        padding: 12px 32px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        text-decoration: none;
        display: inline-block;
    }
    .btn-primary:hover {
        background: #A85E2A;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(201,122,58,0.4);
    }
    
    /* 标签 */
    .tag-green {
        display: inline-block;
        background: #E8F5E9;
        color: #2FB66D;
        padding: 2px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
    }
    .tag-orange {
        display: inline-block;
        background: #FFF3E0;
        color: #C97A3A;
        padding: 2px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
    }
    .tag-blue {
        display: inline-block;
        background: #E3F2FD;
        color: #2D9CDB;
        padding: 2px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
    }
    
    /* 页面标题 */
    .page-header {
        background: #0F4C5C;
        color: #FFFFFF;
        padding: 24px 32px;
        border-radius: 0;
        margin-bottom: 24px;
    }
    .page-header h2 {
        margin: 0;
        font-size: 22px;
    }
    .page-header p {
        margin: 4px 0 0 0;
        opacity: 0.85;
        font-size: 14px;
    }
    
    /* 数据说明信息框 */
    .info-box {
        background: #F1F6F8;
        border-radius: 6px;
        padding: 12px 16px;
        font-size: 13px;
        color: #0B2F3A;
        margin: 8px 0;
    }
    
    /* 方案卡片 */
    .plan-card {
        background: #FFFFFF;
        border-radius: 10px;
        padding: 24px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        margin-bottom: 16px;
        border-top: 4px solid #0F4C5C;
    }
    .plan-card.recommended {
        border-top-color: #2FB66D;
        box-shadow: 0 4px 16px rgba(47,182,109,0.2);
    }
    .plan-card.economy {
        border-top-color: #2D9CDB;
    }
    .plan-card.deep {
        border-top-color: #C97A3A;
    }
    
    /* 底部 */
    .footer-note {
        text-align: center;
        color: #999;
        font-size: 12px;
        padding: 20px;
    }
    </style>
    """, unsafe_allow_html=True)

# ============================================================
# 数据加载
# ============================================================
@st.cache_data
def load_airports():
    """加载机场数据"""
    filepath = os.path.join(os.path.dirname(__file__), "airports.csv")
    if os.path.exists(filepath):
        return pd.read_csv(filepath)
    # 内置默认数据
    data = {
        "机场名称": ["北京首都","北京大兴","上海虹桥","上海浦东","广州白云","深圳宝安",
                    "成都天府","成都双流","重庆江北","西安咸阳","昆明长水","杭州萧山",
                    "南京禄口","武汉天河","长沙黄花","厦门高崎","青岛胶东",
                    "乌鲁木齐地窝堡","哈尔滨太平","海口美兰"],
        "城市": ["北京","北京","上海","上海","广州","深圳","成都","成都","重庆","西安",
                "昆明","杭州","南京","武汉","长沙","厦门","青岛","乌鲁木齐","哈尔滨","海口"],
        "ICAO代码": ["ZBAA","ZBAD","ZSSS","ZSPD","ZGGG","ZGSZ","ZUTF","ZUUU","ZUCK",
                     "ZLXY","ZPPP","ZSHC","ZSNJ","ZHHH","ZGHA","ZSAM","ZSQD","ZWWW","ZYHB","ZJHK"],
        "IATA代码": ["PEK","PKX","SHA","PVG","CAN","SZX","TFU","CTU","CKG","XIY","KMG",
                     "HGH","NKG","WUH","CSX","XMN","TAO","URC","HRB","HAK"],
        "纬度": [40.0799,39.5098,31.1979,31.1434,23.3924,22.6394,30.3190,30.5785,
                29.7192,34.4471,25.1019,30.2295,31.7420,30.7838,28.1892,24.5440,
                36.3619,43.9071,45.6234,19.9349],
        "经度": [116.6031,116.4105,121.3363,121.8052,113.2988,113.8147,104.4410,
                103.9470,106.6417,108.7516,102.9291,120.4344,118.8620,114.2081,
                113.2198,118.1277,120.0890,87.4742,126.2503,110.4590],
        "机场等级": ["枢纽","枢纽","枢纽","枢纽","枢纽","枢纽","枢纽","枢纽","枢纽",
                    "枢纽","枢纽","普通","普通","普通","普通","普通","普通","普通","普通","普通"]
    }
    return pd.DataFrame(data)

@st.cache_data
def load_aircraft():
    """加载机型数据"""
    filepath = os.path.join(os.path.dirname(__file__), "aircraft.csv")
    if os.path.exists(filepath):
        return pd.read_csv(filepath)
    data = {
        "机型": ["A320-200","A320neo","B737-800","B737 MAX 8","A330-300","ARJ21","C919"],
        "巡航速度_kmh": [840,840,840,840,870,780,840],
        "小时油耗_吨每小时": [2.5,2.1,2.6,2.2,5.8,1.3,2.4],
        "默认座位数": [150,165,162,178,300,90,158],
        "类型": ["窄体机","窄体机","窄体机","窄体机","宽体机","支线机","窄体机"]
    }
    return pd.DataFrame(data)

# ============================================================
# 航线数据加载（从用户提供的真实CSV文件）
# ============================================================
def parse_zero_carbon_routes(filepath, airline_name):
    """
    解析「零碳航线_XX航空.csv」格式的文件
    格式：航线（国内）/ 始发地, 目的地, 里程数
    """
    routes = []
    try:
        df_raw = pd.read_csv(filepath, header=None, encoding="utf-8")
        # 找到"始发地"行
        header_row = None
        for i, row in df_raw.iterrows():
            if str(row.iloc[0]).strip() == "始发地":
                header_row = i
                break
        if header_row is None:
            return routes
        
        # 从header_row+1开始读数据
        current_origin = None
        for i in range(header_row + 1, len(df_raw)):
            row = df_raw.iloc[i]
            origin = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) and str(row.iloc[0]).strip() != "nan" else ""
            dest = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else ""
            distance = row.iloc[2] if pd.notna(row.iloc[2]) else None
            
            if origin and origin != "":
                current_origin = origin
            
            if current_origin and dest and dest != "nan" and dest != "":
                try:
                    dist_val = float(distance) if distance is not None else None
                except (ValueError, TypeError):
                    dist_val = None
                routes.append({
                    "航司": airline_name,
                    "出发城市": current_origin,
                    "到达城市": dest,
                    "航距_km": dist_val,
                })
    except Exception as e:
        st.warning(f"读取 {os.path.basename(filepath)} 时出错：{e}")
    return routes

def parse_shandong_routes(filepath):
    """解析山航航线数据：起飞地点, 降落地点, 经停地点, 机型"""
    routes = []
    try:
        df_raw = pd.read_csv(filepath, header=None, encoding="utf-8")
        for i in range(1, len(df_raw)):
            row = df_raw.iloc[i]
            origin = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ""
            dest = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else ""
            aircraft = str(row.iloc[3]).strip() if pd.notna(row.iloc[3]) and "Unnamed" not in str(row.iloc[3]) else ""
            if origin and dest and origin != "nan" and dest != "nan":
                routes.append({
                    "航司": "山东航空",
                    "出发城市": origin,
                    "到达城市": dest,
                    "航距_km": None,
                    "机型_原始": aircraft,
                })
    except Exception as e:
        st.warning(f"读取山航数据时出错：{e}")
    return routes

def parse_chuanhang_routes(filepath):
    """解析川航航线数据：起飞地点, 经停地点, 降落地点"""
    routes = []
    try:
        df_raw = pd.read_csv(filepath, header=None, encoding="utf-8")
        for i in range(1, len(df_raw)):
            row = df_raw.iloc[i]
            origin = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ""
            dest = str(row.iloc[2]).strip() if pd.notna(row.iloc[2]) else ""
            if origin and dest and origin != "nan" and dest != "nan":
                routes.append({
                    "航司": "四川航空",
                    "出发城市": origin,
                    "到达城市": dest,
                    "航距_km": None,
                })
    except Exception as e:
        st.warning(f"读取川航数据时出错：{e}")
    return routes

def parse_shenzhen_routes(filepath):
    """解析深圳航空/通用routes格式：始发地, 目的地, 航距（公里）"""
    routes = []
    try:
        df_raw = pd.read_csv(filepath, header=None, encoding="utf-8")
        header_row = None
        for i, row in df_raw.iterrows():
            if str(row.iloc[0]).strip() == "始发地":
                header_row = i
                break
        if header_row is None:
            return routes
        
        for i in range(header_row + 1, len(df_raw)):
            row = df_raw.iloc[i]
            origin = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ""
            dest = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else ""
            distance = row.iloc[2] if pd.notna(row.iloc[2]) else None
            if origin and dest and origin != "nan" and dest != "nan":
                try:
                    dist_val = float(distance) if distance is not None else None
                except (ValueError, TypeError):
                    dist_val = None
                routes.append({
                    "航司": "深圳航空",
                    "出发城市": origin,
                    "到达城市": dest,
                    "航距_km": dist_val,
                })
    except Exception as e:
        st.warning(f"读取深圳航空数据时出错：{e}")
    return routes

@st.cache_data
def load_all_routes():
    """加载所有航线数据，返回统一的DataFrame"""
    data_dir = os.path.dirname(__file__)
    all_routes = []
    
    # 零碳航线文件映射
    zero_carbon_files = {
        "零碳航线_南方航空.csv": "中国南方航空",
        "零碳航线_东方航空.csv": "中国东方航空",
        "零碳航线_中国国际航空.csv": "中国国际航空",
        "零碳航线_厦门航空.csv": "厦门航空",
        "零碳航线_海南航空.csv": "海南航空",
        "zero_carbon_routes.csv": "综合航线",
    }
    
    for filename, airline in zero_carbon_files.items():
        filepath = os.path.join(data_dir, filename)
        if os.path.exists(filepath):
            routes = parse_zero_carbon_routes(filepath, airline)
            all_routes.extend(routes)
    
    # 山航
    shandong_path = os.path.join(data_dir, "航空公司航线1_山航.csv")
    if os.path.exists(shandong_path):
        all_routes.extend(parse_shandong_routes(shandong_path))
    
    # 川航
    chuanhang_path = os.path.join(data_dir, "航空公司航线1_川航.csv")
    if os.path.exists(chuanhang_path):
        all_routes.extend(parse_chuanhang_routes(chuanhang_path))
    
    # 深圳航空
    shenzhen_path = os.path.join(data_dir, "航空公司航线1_深圳航空.csv")
    if os.path.exists(shenzhen_path):
        all_routes.extend(parse_shenzhen_routes(shenzhen_path))
    
    # 吉祥航空（机型数据，暂不解析为航线）
    # 通用routes.csv
    routes_csv_path = os.path.join(data_dir, "routes.csv")
    if os.path.exists(routes_csv_path):
        try:
            df_raw = pd.read_csv(routes_csv_path, header=None, encoding="utf-8")
            for i in range(3, len(df_raw)):
                row = df_raw.iloc[i]
                origin = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ""
                dest = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else ""
                distance = row.iloc[2] if pd.notna(row.iloc[2]) else None
                if origin and dest and origin != "nan" and dest != "nan":
                    try:
                        dist_val = float(distance) if distance is not None else None
                    except (ValueError, TypeError):
                        dist_val = None
                    all_routes.append({
                        "航司": "深圳航空",
                        "出发城市": origin,
                        "到达城市": dest,
                        "航距_km": dist_val,
                    })
        except Exception:
            pass
    
    if not all_routes:
        return pd.DataFrame(columns=["航司", "出发城市", "到达城市", "航距_km"])
    
    df = pd.DataFrame(all_routes)
    # 去重
    df = df.drop_duplicates(subset=["航司", "出发城市", "到达城市"], keep="first")
    return df

# ============================================================
# 默认参数
# ============================================================
DEFAULTS = {
    "航空煤油价格": 6500,      # 元/吨
    "SAF价格": 16000,          # 元/吨
    "碳价": 80,                # 元/吨CO2
    "SAF生命周期减排率": 0.70,  # 70%
    "LTO附加系数": 1.15,
    "CO2排放因子": 3.15,       # 吨CO2/吨燃油
}

# ============================================================
# 核心计算函数
# ============================================================
def haversine_distance(lat1, lon1, lat2, lon2):
    """Haversine 大圆距离公式，返回公里"""
    R = 6371.0
    lat1_r, lon1_r = np.radians(lat1), np.radians(lon1)
    lat2_r, lon2_r = np.radians(lat2), np.radians(lon2)
    dlat = lat2_r - lat1_r
    dlon = lon2_r - lon1_r
    a = np.sin(dlat/2)**2 + np.cos(lat1_r) * np.cos(lat2_r) * np.sin(dlon/2)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))
    return R * c

def calculate_emissions(route_data, aircraft_data, defaults):
    """
    核心碳排放计算
    route_data: dict with keys like 航距, 机型, 每日航班数, 座位数, 客座率, SAF掺混比例, etc.
    aircraft_data: dict with 巡航速度_kmh, 小时油耗_吨每小时, 默认座位数
    """
    # 1. 获取航距（可能已计算或用户输入）
    distance = route_data.get("航距", 0)
    
    # 2. 巡航时间
    cruise_speed = aircraft_data["巡航速度_kmh"]
    cruise_hours = distance / cruise_speed if cruise_speed > 0 else 0
    
    # 3. 巡航油耗（吨）
    hourly_fuel = aircraft_data["小时油耗_吨每小时"]
    cruise_fuel = cruise_hours * hourly_fuel
    
    # 4. LTO附加
    lto_factor = defaults["LTO附加系数"]
    fuel_per_flight = cruise_fuel * lto_factor
    
    # 5. 年度航班量
    daily_flights = route_data.get("每日航班数", 1)
    annual_flights = daily_flights * 365
    
    # 6. 年度燃油消耗
    annual_fuel = fuel_per_flight * annual_flights
    
    # 7. 基准碳排放
    co2_factor = defaults["CO2排放因子"]
    baseline_co2 = annual_fuel * co2_factor
    
    # 8. 乘客数
    seats = route_data.get("座位数", aircraft_data["默认座位数"])
    load_factor = route_data.get("客座率", 0.80)
    pax_per_flight = seats * load_factor
    
    # 9. 单位旅客碳排放
    co2_per_flight = fuel_per_flight * co2_factor
    co2_per_pax = (co2_per_flight * 1000) / pax_per_flight if pax_per_flight > 0 else 0
    
    # 10. SAF 减排
    saf_ratio = route_data.get("SAF掺混比例", 0)
    saf_reduction_rate = defaults["SAF生命周期减排率"]
    saf_reduction = baseline_co2 * saf_ratio * saf_reduction_rate
    
    # 11. 减排后剩余排放
    remaining_co2 = baseline_co2 - saf_reduction
    
    # 12. 成本计算
    fuel_price = route_data.get("航空煤油价格", defaults["航空煤油价格"])
    saf_price = route_data.get("SAF价格", defaults["SAF价格"])
    carbon_price = route_data.get("碳价", defaults["碳价"])
    
    # 传统燃油成本
    traditional_fuel_cost = annual_fuel * fuel_price
    
    # 掺混后燃油成本
    saf_usage = annual_fuel * saf_ratio
    traditional_usage = annual_fuel * (1 - saf_ratio)
    blended_fuel_cost = traditional_usage * fuel_price + saf_usage * saf_price
    
    # SAF增量成本
    saf_incremental_cost = blended_fuel_cost - traditional_fuel_cost
    
    # 碳成本
    baseline_carbon_cost = baseline_co2 * carbon_price
    remaining_carbon_cost = remaining_co2 * carbon_price
    carbon_cost_saving = baseline_carbon_cost - remaining_carbon_cost
    
    # 最终成本变化（SAF增量成本 - 碳成本节约）
    net_cost_change = saf_incremental_cost - carbon_cost_saving
    
    return {
        "航距_km": round(distance, 1),
        "巡航时间_h": round(cruise_hours, 2),
        "单航班燃油消耗_吨": round(fuel_per_flight, 2),
        "年度航班量": int(annual_flights),
        "年度燃油消耗_吨": round(annual_fuel, 2),
        "基准CO2排放_吨": round(baseline_co2, 2),
        "单航班乘客数": round(pax_per_flight, 0),
        "每客碳排放_kgCO2": round(co2_per_pax, 2),
        "SAF减排量_吨": round(saf_reduction, 2),
        "减排后剩余排放_吨": round(remaining_co2, 2),
        "综合减排率": round(saf_reduction / baseline_co2 * 100, 1) if baseline_co2 > 0 else 0,
        "传统燃油成本_元": round(traditional_fuel_cost, 0),
        "掺混后燃油成本_元": round(blended_fuel_cost, 0),
        "SAF增量成本_元": round(saf_incremental_cost, 0),
        "基准碳成本_元": round(baseline_carbon_cost, 0),
        "减排后碳成本_元": round(remaining_carbon_cost, 0),
        "碳成本节约_元": round(carbon_cost_saving, 0),
        "最终成本变化_元": round(net_cost_change, 0),
    }

def generate_reduction_plans(baseline_co2, annual_fuel, fuel_price, saf_price, carbon_price, 
                              saf_ratio_current, saf_reduction_rate, load_factor):
    """生成三类减碳方案"""
    plans = []
    
    # 方案1: 低成本方案
    route_opt_rate = 0.05      # 航路优化 5%
    ground_opt_rate = 0.015    # 地面优化 1.5%
    load_opt_rate = 0.04       # 客座率 4%
    
    reduction_route = baseline_co2 * route_opt_rate
    reduction_ground = baseline_co2 * ground_opt_rate
    reduction_load = baseline_co2 * load_opt_rate
    
    # 低成本方案不使用SAF，仅少量碳汇
    saf_ratio_low = 0
    saf_reduction_low = 0
    total_reduction_low = reduction_route + reduction_ground + reduction_load
    remaining_low = baseline_co2 - total_reduction_low
    
    # 成本：航路优化几乎零成本，地面优化小成本，碳汇成本
    cost_route = annual_fuel * 0.005 * fuel_price  # 很小的优化成本
    cost_ground = annual_fuel * 0.002 * fuel_price
    cost_saf_low = 0
    carbon_offset_cost = remaining_low * carbon_price * 0.3  # 仅抵消30%剩余
    new_cost_low = cost_route + cost_ground + cost_saf_low + carbon_offset_cost
    carbon_saving_low = (baseline_co2 - remaining_low * 0.7) * carbon_price
    net_cost_low = new_cost_low - carbon_saving_low
    
    plans.append({
        "name": "低成本方案",
        "tag": "最经济",
        "tag_class": "tag-blue",
        "card_class": "economy",
        "定位": "最经济",
        "措施": ["航路优化 3%-7%", "地面滑行优化 1%-2%", "客座率优化 3%-6%", "少量碳汇抵消"],
        "特点": "低成本、易执行、短期见效",
        "预计减排量_吨": round(total_reduction_low, 2),
        "减排率": round(total_reduction_low / baseline_co2 * 100, 1) if baseline_co2 > 0 else 0,
        "新增成本_元": round(new_cost_low, 0),
        "碳成本节约_元": round(carbon_saving_low, 0),
        "最终成本变化_元": round(net_cost_low, 0),
        "推荐理由": "以航路优化、地面效率提升和客座率优化为主，辅以少量碳汇抵消，整体成本最低，适合作为短期快速见效的方案。",
        "details": {
            "航路优化": {"减排量": round(reduction_route, 2), "减排率": round(route_opt_rate*100, 1)},
            "地面滑行优化": {"减排量": round(reduction_ground, 2), "减排率": round(ground_opt_rate*100, 1)},
            "客座率优化": {"减排量": round(reduction_load, 2), "减排率": round(load_opt_rate*100, 1)},
            "SAF掺混": {"减排量": 0, "减排率": 0},
            "碳汇抵消": {"减排量": round(remaining_low * 0.3, 2), "减排率": round(remaining_low*0.3/baseline_co2*100, 1) if baseline_co2 > 0 else 0},
        }
    })
    
    # 方案2: 均衡减排方案
    route_opt_rate2 = 0.06
    aircraft_match_rate = 0.08
    load_opt_rate2 = 0.05
    saf_ratio2 = 0.10
    
    reduction_route2 = baseline_co2 * route_opt_rate2
    reduction_aircraft = baseline_co2 * aircraft_match_rate
    reduction_load2 = baseline_co2 * load_opt_rate2
    reduction_saf2 = baseline_co2 * saf_ratio2 * saf_reduction_rate
    
    total_reduction2 = reduction_route2 + reduction_aircraft + reduction_load2 + reduction_saf2
    remaining2 = baseline_co2 - total_reduction2
    
    saf_usage2 = annual_fuel * saf_ratio2
    saf_cost2 = saf_usage2 * saf_price
    fuel_saving2 = saf_usage2 * fuel_price
    saf_incremental2 = saf_cost2 - fuel_saving2
    
    cost_route2 = annual_fuel * 0.005 * fuel_price
    cost_aircraft2 = annual_fuel * 0.01 * fuel_price
    carbon_offset_cost2 = remaining2 * carbon_price * 0.5
    new_cost2 = cost_route2 + cost_aircraft2 + saf_incremental2 + carbon_offset_cost2
    carbon_saving2 = (baseline_co2 - remaining2 * 0.5) * carbon_price
    net_cost2 = new_cost2 - carbon_saving2
    
    plans.append({
        "name": "均衡减排方案",
        "tag": "最推荐",
        "tag_class": "tag-green",
        "card_class": "recommended",
        "定位": "最推荐",
        "措施": ["航路优化", "机型匹配", "客座率提升", "SAF 10%掺混", "剩余排放碳汇抵消"],
        "特点": "减排效果与成本平衡，适合作为航司「十五五」阶段主推方案",
        "预计减排量_吨": round(total_reduction2, 2),
        "减排率": round(total_reduction2 / baseline_co2 * 100, 1) if baseline_co2 > 0 else 0,
        "新增成本_元": round(new_cost2, 0),
        "碳成本节约_元": round(carbon_saving2, 0),
        "最终成本变化_元": round(net_cost2, 0),
        "推荐理由": "综合运用航路优化、机型匹配、客座率提升和10% SAF掺混，在减排效果和成本之间取得最佳平衡，是「十五五」阶段航司最可行的主推方案。",
        "details": {
            "航路优化": {"减排量": round(reduction_route2, 2), "减排率": round(route_opt_rate2*100, 1)},
            "机型效率提升": {"减排量": round(reduction_aircraft, 2), "减排率": round(aircraft_match_rate*100, 1)},
            "客座率优化": {"减排量": round(reduction_load2, 2), "减排率": round(load_opt_rate2*100, 1)},
            "SAF掺混10%": {"减排量": round(reduction_saf2, 2), "减排率": round(saf_ratio2*saf_reduction_rate*100, 1)},
            "碳汇抵消": {"减排量": round(remaining2 * 0.5, 2), "减排率": round(remaining2*0.5/baseline_co2*100, 1) if baseline_co2 > 0 else 0},
        }
    })
    
    # 方案3: 深度减排方案
    route_opt_rate3 = 0.07
    aircraft_match_rate3 = 0.12
    saf_ratio3 = 0.25
    
    reduction_route3 = baseline_co2 * route_opt_rate3
    reduction_aircraft3 = baseline_co2 * aircraft_match_rate3
    reduction_saf3 = baseline_co2 * saf_ratio3 * saf_reduction_rate
    
    total_reduction3 = reduction_route3 + reduction_aircraft3 + reduction_saf3
    remaining3 = baseline_co2 - total_reduction3
    
    saf_usage3 = annual_fuel * saf_ratio3
    saf_cost3 = saf_usage3 * saf_price
    fuel_saving3 = saf_usage3 * fuel_price
    saf_incremental3 = saf_cost3 - fuel_saving3
    
    cost_route3 = annual_fuel * 0.005 * fuel_price
    cost_aircraft3 = annual_fuel * 0.02 * fuel_price
    carbon_offset_cost3 = remaining3 * carbon_price * 0.8
    new_cost3 = cost_route3 + cost_aircraft3 + saf_incremental3 + carbon_offset_cost3
    carbon_saving3 = (baseline_co2 - remaining3 * 0.2) * carbon_price
    net_cost3 = new_cost3 - carbon_saving3
    
    plans.append({
        "name": "深度减排方案",
        "tag": "最符合政策",
        "tag_class": "tag-orange",
        "card_class": "deep",
        "定位": "最符合政策方向",
        "措施": ["更高比例 SAF 掺混 25%", "高效机型替代", "航班结构优化", "剩余排放碳汇抵消"],
        "特点": "减排效果强，但短期成本较高",
        "预计减排量_吨": round(total_reduction3, 2),
        "减排率": round(total_reduction3 / baseline_co2 * 100, 1) if baseline_co2 > 0 else 0,
        "新增成本_元": round(new_cost3, 0),
        "碳成本节约_元": round(carbon_saving3, 0),
        "最终成本变化_元": round(net_cost3, 0),
        "推荐理由": "采用高比例SAF掺混配合高效机型替代，减排效果显著，符合政策导向。随SAF产能扩大和价格下降，中长期将成为主力方案。",
        "details": {
            "航路优化": {"减排量": round(reduction_route3, 2), "减排率": round(route_opt_rate3*100, 1)},
            "机型效率提升": {"减排量": round(reduction_aircraft3, 2), "减排率": round(aircraft_match_rate3*100, 1)},
            "SAF掺混25%": {"减排量": round(reduction_saf3, 2), "减排率": round(saf_ratio3*saf_reduction_rate*100, 1)},
            "碳汇抵消": {"减排量": round(remaining3 * 0.8, 2), "减排率": round(remaining3*0.8/baseline_co2*100, 1) if baseline_co2 > 0 else 0},
        }
    })
    
    # 计算单位减排成本
    for plan in plans:
        if plan["预计减排量_吨"] > 0:
            plan["单位减排成本_元每吨"] = round(plan["最终成本变化_元"] / plan["预计减排量_吨"], 0)
        else:
            plan["单位减排成本_元每吨"] = 0
    
    return plans

# ============================================================
# 森林背景图片 Base64 加载
# ============================================================
@st.cache_data
def get_forest_image_b64():
    """读取森林背景图片并转为 base64，用于 CSS 内联背景"""
    img_path = os.path.join(os.path.dirname(__file__), "森林图片参考.jpg")
    if os.path.exists(img_path):
        import base64
        with open(img_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
    return None

# ============================================================
# 页面：进入页面
# ============================================================
def render_entry_page():
    forest_b64 = get_forest_image_b64()
    base_img = f"url(data:image/jpeg;base64,{forest_b64})" if forest_b64 else "none"
    
    # ═══════════════════════════════════════
    # 全局 CSS
    # ═══════════════════════════════════════
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    * { font-family: 'Inter', 'Microsoft YaHei', sans-serif; -webkit-font-smoothing: antialiased; }
    
    .stApp { background: #000 !important; }
    .stMainBlockContainer { padding: 0 !important; background: transparent !important; max-width: 100% !important; }
    section[data-testid="stSidebar"], header[data-testid="stHeader"] { display: none; }
    
    /* ── 字符动画 ── */
    .char { display:inline-block; opacity:0; transform:translateX(-18px);
        transition:opacity 0.5s ease-out, transform 0.5s ease-out; }
    .char.visible { opacity:1; transform:translateX(0); }
    
    /* ── fadeIn ── */
    .fade-in { opacity:0; transition:opacity 1s ease; }
    .fade-in.visible { opacity:1; }
    
    /* ── 液态玻璃 ── */
    .liquid-glass {
        background:rgba(0,0,0,0.4); backdrop-filter:blur(4px);
        -webkit-backdrop-filter:blur(4px);
        box-shadow:inset 0 1px 1px rgba(255,255,255,0.1);
        border:1px solid rgba(255,255,255,0.12); border-radius:0.75rem;
    }
    
    /* ── 按钮 ── */
    div[data-testid="stButton"] button {
        border-radius:0.5rem !important; font-size:0.875rem !important;
        font-weight:500 !important; padding:0.75rem 2rem !important;
        height:auto !important; transition:all 0.2s !important; border:none !important;
    }
    div[data-testid="stButton"] button[kind="primary"] {
        background:#fff !important; color:#000 !important;
    }
    div[data-testid="stButton"] button[kind="primary"]:hover {
        background:#f3f4f6 !important; transform:none !important; box-shadow:none !important;
    }
    div[data-testid="stButton"] button[kind="secondary"] {
        background:rgba(0,0,0,0.4) !important; color:#fff !important;
        backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px);
        border:1px solid rgba(255,255,255,0.2) !important;
    }
    div[data-testid="stButton"] button[kind="secondary"]:hover {
        background:#fff !important; color:#000 !important; transform:none !important;
    }
    </style>
    """, unsafe_allow_html=True)
    
    # ═══════════════════════════════════════
    # 全屏森林背景
    # ═══════════════════════════════════════
    st.markdown(f"""
    <div style="position:fixed;top:0;left:0;width:100%;height:100dvh;z-index:0;
        background-image:{base_img};background-size:cover;background-position:center;
        filter:brightness(0.55);"></div>
    <div style="position:fixed;top:0;left:0;width:100%;height:100dvh;z-index:1;
        background:linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 100%);pointer-events:none;"></div>
    """, unsafe_allow_html=True)
    
    # ═══════════════════════════════════════
    # 导航栏 — 液态玻璃风格
    # ═══════════════════════════════════════
    st.markdown('<div style="position:relative;z-index:100;padding:1.5rem 1.5rem 0;"></div>', unsafe_allow_html=True)
    st.markdown("""
    <div class="liquid-glass" style="margin:0 0;padding:0.5rem 1rem;display:flex;align-items:center;justify-content:space-between;">
    """, unsafe_allow_html=True)
    
    nav_cols = st.columns([1, 1, 1, 1, 1, 1, 1.5])
    with nav_cols[0]:
        st.markdown('<span style="font-size:1.25rem;font-weight:600;letter-spacing:-0.025em;color:#fff;">航碳智脑</span>', unsafe_allow_html=True)
    nav_items = ["碳核算","SAF评估","航线优化","成本测算","数据说明"]
    for i, p in enumerate(nav_items):
        with nav_cols[i+1]:
            if st.button(p, key=f"nv2_{p}", use_container_width=True, type="secondary"):
                page_map = {"碳核算":"碳排核算","SAF评估":"SAF趋势","航线优化":"航线网络","成本测算":"成本测算","数据说明":"数据说明"}
                st.session_state.page = page_map.get(p, p); st.rerun()
    with nav_cols[6]:
        if st.button("进入平台", key="nv2_enter", use_container_width=True, type="primary"):
            st.session_state.page = "碳排核算"; st.rerun()
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # ═══════════════════════════════════════
    # 底部内容区 — 左右网格
    # ═══════════════════════════════════════
    st.markdown('<div style="flex:1;display:flex;align-items:flex-end;padding-bottom:3rem;min-height:50vh;"></div>', unsafe_allow_html=True)
    
    left, right = st.columns([1, 1])
    
    with left:
        st.markdown("""
        <div style="padding-left:1.5rem;">
            <!-- 标题 — 字符动画由 JS 驱动 -->
            <div id="mainHeading" style="font-size:clamp(2.25rem,5vw,4rem);font-weight:400;letter-spacing:-0.04em;margin-bottom:1rem;color:#fff;">
                <div><span class="char">碳</span><span class="char">达</span><span class="char">峰</span><span class="char">攻</span><span class="char">坚</span></div>
                <div><span class="char">智</span><span class="char">控</span><span class="char">未</span><span class="char">来</span></div>
            </div>
            <!-- 副标题 -->
            <p id="subheading2" class="fade-in" style="font-size:1rem;color:#d1d5db;margin-bottom:1.25rem;">精准核算 · 智能优化 · 低成本减排</p>
        </div>
        """, unsafe_allow_html=True)
        
        # 按钮组
        btn_l, btn_r, _ = st.columns([1, 1, 2])
        with btn_l:
            if st.button("查看方案", key="e_plan2", use_container_width=True, type="primary"):
                st.session_state.page = "减碳方案"; st.rerun()
        with btn_r:
            if st.button("探索数据", key="e_data2", use_container_width=True, type="secondary"):
                st.session_state.page = "数据说明"; st.rerun()
    
    with right:
        st.markdown("""
        <div style="display:flex;justify-content:flex-end;padding-right:1.5rem;">
            <div id="tagCard2" class="fade-in liquid-glass" style="padding:0.75rem 1.5rem;">
                <span style="font-size:clamp(1.125rem,2vw,1.5rem);font-weight:300;color:#fff;">碳排放 · SAF · 碳中和</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    # ═══════════════════════════════════════
    # 字符动画 JS
    # ═══════════════════════════════════════
    import streamlit.components.v1 as components
    components.html("""
    <script>
    (function(){
        var doc = window.parent.document;
        var chars = doc.querySelectorAll('.char');
        chars.forEach(function(c, i){
            setTimeout(function(){ c.classList.add('visible'); }, 200 + i * 30);
        });
        setTimeout(function(){
            var s = doc.getElementById('subheading2');
            if(s) s.classList.add('visible');
        }, 800);
        setTimeout(function(){
            var t = doc.getElementById('tagCard2');
            if(t) t.classList.add('visible');
        }, 1400);
    })();
    </script>
    """, height=0)

# ============================================================
# 页面：碳排核算（主页面）
# ============================================================
def render_calculation_page():
    airports_df = load_airports()
    aircraft_df = load_aircraft()
    routes_df = load_all_routes()
    
    # 页面标题
    st.markdown("""
    <div class="page-header">
        <h2>📊 航班碳排核算与优化</h2>
        <p>支持单航线、多航线、差异化减碳方案生成。核算逻辑遵循 ISO 14064 的边界设定、活动数据采集、排放因子计算和可追溯披露原则。</p>
    </div>
    """, unsafe_allow_html=True)
    
    # 输入区
    col_input, col_map = st.columns([1, 1])
    
    with col_input:
        st.markdown("### 📝 航线参数")
        
        # 航司名称 - 从真实数据中加载
        if not routes_df.empty:
            airline_list = sorted(routes_df["航司"].unique().tolist())
        else:
            airline_list = ["中国南方航空", "中国东方航空", "中国国际航空", "海南航空", 
                          "厦门航空", "山东航空", "四川航空", "深圳航空"]
        airline = st.selectbox("航司名称", airline_list, 
                               index=airline_list.index("中国南方航空") if "中国南方航空" in airline_list else 0,
                               key="calc_airline")
        
        # 根据航司筛选可用航线
        if not routes_df.empty:
            airline_routes = routes_df[routes_df["航司"] == airline]
            # 构建出发城市列表
            dep_cities_from_data = sorted(airline_routes["出发城市"].unique().tolist())
            # 匹配机场名称（城市 → 机场名）
            dep_airport_options = []
            dep_city_to_airport = {}
            for city in dep_cities_from_data:
                matched = airports_df[airports_df["城市"].str.contains(city.replace("市","").replace("区",""), na=False)]
                if not matched.empty:
                    airport_name = matched.iloc[0]["机场名称"]
                    dep_airport_options.append(airport_name)
                    dep_city_to_airport[city] = airport_name
            
            if dep_airport_options:
                default_dep = "深圳宝安" if "深圳宝安" in dep_airport_options else dep_airport_options[0]
                dep_idx = dep_airport_options.index(default_dep) if default_dep in dep_airport_options else 0
            else:
                dep_airport_options = airports_df["机场名称"].tolist()
                dep_idx = 11  # 深圳宝安
        else:
            dep_airport_options = airports_df["机场名称"].tolist()
            dep_idx = 11
            airline_routes = pd.DataFrame()
            dep_city_to_airport = {}
        
        # 出发/到达机场
        col_dep, col_arr = st.columns(2)
        with col_dep:
            dep_airport = st.selectbox("出发机场", dep_airport_options, index=dep_idx, key="calc_dep")
        with col_arr:
            # 根据出发机场筛选可到达的目的地
            dep_city = airports_df[airports_df["机场名称"] == dep_airport]["城市"].iloc[0] if not airports_df[airports_df["机场名称"] == dep_airport].empty else ""
            
            if not airline_routes.empty and dep_city:
                # 找到该航司从该城市出发的所有目的地
                dests_from_data = airline_routes[airline_routes["出发城市"].str.contains(dep_city.replace("市",""), na=False)]["到达城市"].unique().tolist()
                arr_airport_options = []
                for city in dests_from_data:
                    matched = airports_df[airports_df["城市"].str.contains(city.replace("市","").replace("区",""), na=False)]
                    if not matched.empty:
                        arr_airport_options.append(matched.iloc[0]["机场名称"])
                
                if arr_airport_options:
                    default_arr = "成都天府" if "成都天府" in arr_airport_options else arr_airport_options[0]
                    arr_idx = arr_airport_options.index(default_arr) if default_arr in arr_airport_options else 0
                else:
                    arr_airport_options = airports_df[airports_df["机场名称"] != dep_airport]["机场名称"].tolist()
                    arr_idx = 6 if "成都天府" in arr_airport_options else 0
            else:
                arr_airport_options = airports_df[airports_df["机场名称"] != dep_airport]["机场名称"].tolist()
                arr_idx = 5 if "成都天府" in arr_airport_options else 0  # 成都天府
            
            arr_airport = st.selectbox("到达机场", arr_airport_options, index=arr_idx, key="calc_arr")
        
        # 航线名称自动生成
        route_name = f"{dep_airport} → {arr_airport}"
        st.text_input("航线名称", value=route_name, disabled=True, key="calc_route_name")
        
        # 飞机机型
        aircraft_type = st.selectbox("飞机机型", aircraft_df["机型"].tolist(), key="calc_aircraft")
        
        # 燃油类型和SAF
        col_fuel, col_saf = st.columns(2)
        with col_fuel:
            fuel_type = st.selectbox("燃油类型", ["传统航空煤油", "SAF 掺混燃油"], key="calc_fuel_type")
        with col_saf:
            saf_ratio = st.select_slider("SAF 掺混比例", options=[0, 5, 10, 15, 20, 30, 50], value=10, key="calc_saf_ratio") / 100
        
        # 航距 - 优先使用真实数据
        dep_row = airports_df[airports_df["机场名称"] == dep_airport].iloc[0]
        arr_row = airports_df[airports_df["机场名称"] == arr_airport].iloc[0]
        auto_distance = haversine_distance(dep_row["纬度"], dep_row["经度"], arr_row["纬度"], arr_row["经度"])
        
        # 尝试从真实航线数据中获取航距
        real_distance = None
        distance_source = ""
        if not routes_df.empty and not airline_routes.empty:
            dep_city = dep_row["城市"]
            arr_city = arr_row["城市"]
            # 模糊匹配城市名
            matched_route = airline_routes[
                airline_routes["出发城市"].str.contains(dep_city.replace("市","").replace("区",""), na=False) &
                airline_routes["到达城市"].str.contains(arr_city.replace("市","").replace("区",""), na=False)
            ]
            if not matched_route.empty:
                real_dist = matched_route.iloc[0]["航距_km"]
                if pd.notna(real_dist) and real_dist > 0:
                    real_distance = real_dist
                    distance_source = "（来自航线数据）"
        
        if real_distance:
            distance_input = st.number_input("航距 (km)", value=float(real_distance), min_value=0.0, key="calc_distance",
                                              help=f"来自真实航线数据{distance_source}")
            st.markdown(f'<span class="tag-green">{distance_source}</span>', unsafe_allow_html=True)
        else:
            distance_input = st.number_input("航距 (km)", value=round(auto_distance, 0), min_value=0.0, key="calc_distance",
                                              help="根据机场经纬度自动计算（Haversine大圆距离）")
            st.markdown('<span class="tag-blue">按经纬度自动计算</span>', unsafe_allow_html=True)
        
        # 航班参数
        col_freq, col_seats, col_load = st.columns(3)
        with col_freq:
            daily_flights = st.number_input("每日航班数", value=6, min_value=1, max_value=100, key="calc_daily")
        with col_seats:
            ac_row = aircraft_df[aircraft_df["机型"] == aircraft_type].iloc[0]
            seats = st.number_input("座位数", value=int(ac_row["默认座位数"]), min_value=1, key="calc_seats")
        with col_load:
            load_factor = st.slider("客座率 %", min_value=30, max_value=100, value=83, key="calc_load") / 100
        
        st.markdown("---")
        st.markdown("### 💰 价格参数")
        
        col_fp, col_sp, col_cp = st.columns(3)
        with col_fp:
            fuel_price = st.number_input("航空煤油价格 (元/吨)", value=DEFAULTS["航空煤油价格"], 
                                          min_value=0, key="calc_fuel_price")
            if fuel_price == DEFAULTS["航空煤油价格"]:
                st.markdown('<span class="tag-blue">默认市场均价</span>', unsafe_allow_html=True)
        with col_sp:
            saf_price = st.number_input("SAF 价格 (元/吨)", value=DEFAULTS["SAF价格"], 
                                         min_value=0, key="calc_saf_price")
            if saf_price == DEFAULTS["SAF价格"]:
                st.markdown('<span class="tag-blue">默认市场均价</span>', unsafe_allow_html=True)
        with col_cp:
            carbon_price = st.number_input("碳价 (元/吨CO₂)", value=DEFAULTS["碳价"], 
                                            min_value=0, key="calc_carbon_price")
            if carbon_price == DEFAULTS["碳价"]:
                st.markdown('<span class="tag-blue">默认市场均价</span>', unsafe_allow_html=True)
    
    with col_map:
        st.markdown("### 🗺️ 航线地图")
        # 创建地图
        center_lat = (dep_row["纬度"] + arr_row["纬度"]) / 2
        center_lon = (dep_row["经度"] + arr_row["经度"]) / 2
        
        m = folium.Map(location=[center_lat, center_lon], zoom_start=5, tiles="CartoDB positron")
        
        # 添加所有机场
        for _, airport in airports_df.iterrows():
            color = "#C97A3A" if airport["机场等级"] == "枢纽" else "#2D9CDB"
            radius = 8 if airport["机场等级"] == "枢纽" else 5
            folium.CircleMarker(
                location=[airport["纬度"], airport["经度"]],
                radius=radius,
                color=color,
                fill=True,
                fillColor=color,
                fillOpacity=0.7,
                popup=folium.Popup(f"<b>{airport['机场名称']}</b><br>{airport['城市']}<br>{airport['机场等级']}", max_width=200),
                tooltip=airport["机场名称"],
            ).add_to(m)
        
        # 画航线
        folium.PolyLine(
            locations=[(dep_row["纬度"], dep_row["经度"]), (arr_row["纬度"], arr_row["经度"])],
            color="#0F4C5C",
            weight=3,
            opacity=0.8,
            dash_array="8",
        ).add_to(m)
        
        # 起终点标记
        folium.Marker(
            [dep_row["纬度"], dep_row["经度"]],
            icon=folium.Icon(color="green", icon="plane", prefix="fa"),
            popup=f"出发: {dep_airport}"
        ).add_to(m)
        folium.Marker(
            [arr_row["纬度"], arr_row["经度"]],
            icon=folium.Icon(color="red", icon="plane", prefix="fa"),
            popup=f"到达: {arr_airport}"
        ).add_to(m)
        
        st_folium(m, height=420, width=None)
        
        st.markdown(f"""
        <div class="info-box">
            📍 自动计算航距：<b>{round(auto_distance, 0)} km</b>（Haversine 大圆距离）<br>
            🛫 出发：{dep_airport}（{dep_row['ICAO代码']}） &nbsp;|&nbsp; 
            🛬 到达：{arr_airport}（{arr_row['ICAO代码']}）
        </div>
        """, unsafe_allow_html=True)
    
    # 核算按钮
    st.markdown("<br>", unsafe_allow_html=True)
    _, btn_col, _ = st.columns([2, 1, 2])
    with btn_col:
        calculate_btn = st.button("🔍 开始核算", key="calc_btn", use_container_width=True, type="primary")
    
    if calculate_btn:
        st.session_state.calc_done = True
        st.session_state.calc_params = {
            "航司": airline,
            "航线": route_name,
            "出发": dep_airport,
            "到达": arr_airport,
            "机型": aircraft_type,
            "航距": distance_input if distance_input > 0 else auto_distance,
            "每日航班数": daily_flights,
            "座位数": seats,
            "客座率": load_factor,
            "燃油类型": fuel_type,
            "SAF掺混比例": saf_ratio,
            "航空煤油价格": fuel_price,
            "SAF价格": saf_price,
            "碳价": carbon_price,
        }
    
    if st.session_state.get("calc_done", False):
        render_calculation_results(aircraft_df)

def render_calculation_results(aircraft_df):
    """渲染核算结果"""
    params = st.session_state.calc_params
    ac_row = aircraft_df[aircraft_df["机型"] == params["机型"]].iloc[0]
    
    aircraft_data = {
        "巡航速度_kmh": ac_row["巡航速度_kmh"],
        "小时油耗_吨每小时": ac_row["小时油耗_吨每小时"],
        "默认座位数": ac_row["默认座位数"],
    }
    
    result = calculate_emissions(params, aircraft_data, DEFAULTS)
    
    st.markdown("---")
    st.markdown("### 📈 核算结果")
    
    # 核心指标卡
    c1, c2, c3, c4, c5, c6, c7 = st.columns(7)
    metrics = [
        ("当前总排放量", f"{result['基准CO2排放_吨']:,.0f} 吨", "dark"),
        ("预计减排量", f"{result['SAF减排量_吨']:,.0f} 吨", "green"),
        ("综合减排率", f"{result['综合减排率']}%", "green"),
        ("单位减排成本", f"{result.get('单位减排成本_元每吨', '-')} 元/吨", "orange"),
        ("年度燃油成本变化", f"{result['SAF增量成本_元']:+,.0f} 元", "orange"),
        ("碳成本节约", f"{result['碳成本节约_元']:,.0f} 元", "green"),
        ("最终成本增减", f"{result['最终成本变化_元']:+,.0f} 元", "blue"),
    ]
    for col, (label, value, color) in zip([c1,c2,c3,c4,c5,c6,c7], metrics):
        with col:
            cls = f"metric-card {color}" if color != "dark" else "metric-card"
            st.markdown(f"""
            <div class="{cls}">
                <div class="value">{value}</div>
                <div class="label">{label}</div>
            </div>
            """, unsafe_allow_html=True)
    
    # 航线结果卡
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("#### ✈️ 航线详情")
    col_a, col_b = st.columns(2)
    with col_a:
        st.markdown(f"""
        <div class="card">
            <table style="width:100%; font-size:14px;">
                <tr><td style="color:#666;">航线名称</td><td><b>{params['航线']}</b></td></tr>
                <tr><td style="color:#666;">航距</td><td><b>{result['航距_km']} km</b></td></tr>
                <tr><td style="color:#666;">机型</td><td><b>{params['机型']}</b></td></tr>
                <tr><td style="color:#666;">年度航班量</td><td><b>{result['年度航班量']:,} 班</b></td></tr>
                <tr><td style="color:#666;">年度燃油消耗</td><td><b>{result['年度燃油消耗_吨']:,.0f} 吨</b></td></tr>
            </table>
        </div>
        """, unsafe_allow_html=True)
    with col_b:
        st.markdown(f"""
        <div class="card">
            <table style="width:100%; font-size:14px;">
                <tr><td style="color:#666;">年度 CO₂ 排放</td><td><b style="color:#C97A3A;">{result['基准CO2排放_吨']:,.0f} 吨</b></td></tr>
                <tr><td style="color:#666;">每客碳排放</td><td><b>{result['每客碳排放_kgCO2']} kgCO₂</b></td></tr>
                <tr><td style="color:#666;">SAF 掺混比例</td><td><b>{params['SAF掺混比例']*100:.0f}%</b></td></tr>
                <tr><td style="color:#666;">SAF 减排量</td><td><b style="color:#2FB66D;">{result['SAF减排量_吨']:,.0f} 吨</b></td></tr>
                <tr><td style="color:#666;">减排后剩余排放</td><td><b>{result['减排后剩余排放_吨']:,.0f} 吨</b></td></tr>
            </table>
        </div>
        """, unsafe_allow_html=True)
    
    # 成本明细
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("#### 💰 成本明细")
    
    cost_data = {
        "项目": ["传统燃油成本", "掺混后燃油成本", "SAF 增量成本", "基准碳成本", "减排后碳成本", "碳成本节约", "最终成本变化"],
        "金额(元)": [
            result["传统燃油成本_元"], result["掺混后燃油成本_元"],
            result["SAF增量成本_元"], result["基准碳成本_元"],
            result["减排后碳成本_元"], result["碳成本节约_元"],
            result["最终成本变化_元"],
        ]
    }
    cost_df = pd.DataFrame(cost_data)
    
    fig_cost = px.bar(cost_df, x="项目", y="金额(元)", text="金额(元)",
                       color="金额(元)", color_continuous_scale=["#2FB66D", "#C97A3A"],
                       title="成本构成分析")
    fig_cost.update_traces(texttemplate="%{text:,.0f}", textposition="outside")
    fig_cost.update_layout(height=350, showlegend=False)
    st.plotly_chart(fig_cost, use_container_width=True)
    
    # 保存结果到 session
    st.session_state.last_result = result
    st.session_state.last_params = params
    st.session_state.last_aircraft_data = aircraft_data

# ============================================================
# 页面：减碳方案
# ============================================================
def render_plans_page():
    st.markdown("""
    <div class="page-header">
        <h2>🌿 减碳方案</h2>
        <p>基于核算结果，智能生成低成本、均衡和深度减排三类方案，支持方案对比与详情查看。</p>
    </div>
    """, unsafe_allow_html=True)
    
    if not st.session_state.get("calc_done", False):
        st.warning("⚠️ 请先在「碳排核算」页面完成航线碳排放核算，再查看减碳方案。")
        return
    
    params = st.session_state.last_params
    result = st.session_state.last_result
    aircraft_data = st.session_state.last_aircraft_data
    
    plans = generate_reduction_plans(
        result["基准CO2排放_吨"], result["年度燃油消耗_吨"],
        params["航空煤油价格"], params["SAF价格"], params["碳价"],
        params["SAF掺混比例"], DEFAULTS["SAF生命周期减排率"],
        params["客座率"]
    )
    
    st.session_state.plans = plans
    
    st.markdown("### 📋 方案概览")
    
    for plan in plans:
        card_cls = plan["card_class"]
        st.markdown(f"""
        <div class="plan-card {card_cls}">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h3 style="margin:0;">{plan['name']}</h3>
                    <span class="{plan['tag_class']}">{plan['tag']}</span>
                </div>
            </div>
            <p style="margin:8px 0; color:#666; font-size:13px;">{'、'.join(plan['措施'])}</p>
            <p style="color:#0B2F3A; font-size:14px;"><b>特点：</b>{plan['特点']}</p>
        </div>
        """, unsafe_allow_html=True)
        
        col1, col2, col3, col4, col5 = st.columns(5)
        with col1:
            st.metric("预计减排量", f"{plan['预计减排量_吨']:,.0f} 吨")
        with col2:
            st.metric("减排率", f"{plan['减排率']}%")
        with col3:
            st.metric("新增成本", f"{plan['新增成本_元']:+,.0f} 元")
        with col4:
            st.metric("碳成本节约", f"{plan['碳成本节约_元']:,.0f} 元")
        with col5:
            st.metric("最终成本变化", f"{plan['最终成本变化_元']:+,.0f} 元", 
                     delta_color="inverse")
        
        st.markdown(f"**推荐理由：**{plan['推荐理由']}")
        
        # 查看详情按钮
        if st.button(f"📋 查看「{plan['name']}」详情", key=f"detail_{plan['name']}"):
            st.session_state.selected_plan = plan
            st.session_state.show_plan_detail = True
            st.rerun()
        
        st.markdown("---")
    
    # 方案对比图
    st.markdown("### 📊 三方案对比")
    plans_df = pd.DataFrame([
        {"方案": p["name"], "减排量(吨)": p["预计减排量_吨"], "减排率(%)": p["减排率"],
         "新增成本(元)": p["新增成本_元"], "碳成本节约(元)": p["碳成本节约_元"],
         "最终成本变化(元)": p["最终成本变化_元"]}
        for p in plans
    ])
    
    col_c1, col_c2 = st.columns(2)
    with col_c1:
        fig1 = px.bar(plans_df, x="方案", y="减排量(吨)", color="方案",
                       color_discrete_map={"低成本方案":"#2D9CDB","均衡减排方案":"#2FB66D","深度减排方案":"#C97A3A"},
                       title="各方案预计减排量对比", text="减排量(吨)")
        fig1.update_traces(texttemplate="%{text:,.0f}", textposition="outside")
        fig1.update_layout(showlegend=False, height=350)
        st.plotly_chart(fig1, use_container_width=True)
    with col_c2:
        fig2 = px.bar(plans_df, x="方案", y=["新增成本(元)", "碳成本节约(元)", "最终成本变化(元)"],
                       barmode="group", title="各方案成本变化对比",
                       color_discrete_map={"新增成本(元)":"#C97A3A","碳成本节约(元)":"#2FB66D","最终成本变化(元)":"#0F4C5C"})
        fig2.update_layout(height=350)
        st.plotly_chart(fig2, use_container_width=True)
    
    # 方案详情弹窗
    if st.session_state.get("show_plan_detail", False):
        render_plan_detail()

def render_plan_detail():
    """渲染方案详情"""
    plan = st.session_state.selected_plan
    
    st.markdown("---")
    st.markdown(f"## 📋 {plan['name']} — 方案详情")
    
    # 方案组成
    st.markdown("### 🔧 方案组成")
    details = plan["details"]
    for measure, info in details.items():
        col_a, col_b, col_c = st.columns([2, 1, 1])
        with col_a:
            st.markdown(f"**{measure}**")
        with col_b:
            st.markdown(f"预计减排：{info['减排量']:,.0f} 吨")
        with col_c:
            st.markdown(f"减排率：{info['减排率']}%")
    
    # 数据对比图
    st.markdown("### 📊 数据对比")
    
    params = st.session_state.last_params
    result = st.session_state.last_result
    
    fig = make_subplots(rows=2, cols=2,
                        subplot_titles=("基准排放 vs 方案后排放", "基准成本 vs 方案后成本",
                                        "成本构成", "关键指标"))
    
    # 基准排放 vs 方案后
    remaining = result["基准CO2排放_吨"] - plan["预计减排量_吨"]
    fig.add_trace(go.Bar(name="基准排放", x=["CO₂排放"], y=[result["基准CO2排放_吨"]],
                          marker_color="#C97A3A"), row=1, col=1)
    fig.add_trace(go.Bar(name="方案后排放", x=["CO₂排放"], y=[remaining],
                          marker_color="#2FB66D"), row=1, col=1)
    
    # 成本对比
    fig.add_trace(go.Bar(name="新增成本", x=["成本"], y=[plan["新增成本_元"]],
                          marker_color="#C97A3A"), row=1, col=2)
    fig.add_trace(go.Bar(name="碳成本节约", x=["成本"], y=[plan["碳成本节约_元"]],
                          marker_color="#2FB66D"), row=1, col=2)
    
    fig.update_layout(height=500, showlegend=True)
    st.plotly_chart(fig, use_container_width=True)
    
    # 文字解释
    st.markdown("### 💡 方案解读")
    st.markdown(f"""
    <div class="info-box">
        <p>{plan['推荐理由']}</p>
        <p>在「十五五」碳达峰攻坚期背景下，本方案通过组合优化策略——而非单一依赖SAF或碳汇——帮助航司在控制成本的同时实现可量化的减排目标。</p>
        <p>通过源头减排减少需购买碳汇/碳配额的支出，形成<b>碳成本节约</b>，部分或完全抵消减排措施的新增成本。</p>
    </div>
    """, unsafe_allow_html=True)
    
    if st.button("关闭详情", key="close_detail"):
        st.session_state.show_plan_detail = False
        st.rerun()

# ============================================================
# 页面：航线网络
# ============================================================
def render_network_page():
    st.markdown("""
    <div class="page-header">
        <h2>🗺️ 航线网络</h2>
        <p>全国主要民航机场分布与航线碳排放可视化，展示真实航司航线数据。</p>
    </div>
    """, unsafe_allow_html=True)
    
    airports_df = load_airports()
    routes_df = load_all_routes()
    
    # 航司筛选
    if not routes_df.empty:
        airline_filter = st.selectbox("选择航司查看航线网络", 
                                       ["全部航司"] + sorted(routes_df["航司"].unique().tolist()),
                                       key="network_airline_filter")
    else:
        airline_filter = "全部航司"
    
    m = folium.Map(location=[35.0, 105.0], zoom_start=4, tiles="CartoDB positron")
    
    # 添加所有机场
    for _, airport in airports_df.iterrows():
        color = "#C97A3A" if airport["机场等级"] == "枢纽" else "#2D9CDB"
        radius = 10 if airport["机场等级"] == "枢纽" else 6
        
        folium.CircleMarker(
            location=[airport["纬度"], airport["经度"]],
            radius=radius,
            color=color,
            fill=True,
            fillColor=color,
            fillOpacity=0.6,
            popup=folium.Popup(
                f"<b>{airport['机场名称']}</b> ({airport['IATA代码']})<br>"
                f"城市: {airport['城市']}<br>"
                f"等级: {airport['机场等级']}",
                max_width=220
            ),
            tooltip=airport["机场名称"],
        ).add_to(m)
    
    # 画真实航线
    routes_drawn = 0
    if not routes_df.empty:
        display_routes = routes_df if airline_filter == "全部航司" else routes_df[routes_df["航司"] == airline_filter]
        
        # 限制显示数量（防止过多）
        display_routes = display_routes.head(200)
        
        # 按航司分配颜色
        airline_colors = {
            "中国南方航空": "#E74C3C",
            "中国东方航空": "#2D9CDB", 
            "中国国际航空": "#C97A3A",
            "海南航空": "#E67E22",
            "厦门航空": "#2FB66D",
            "山东航空": "#9B59B6",
            "四川航空": "#1ABC9C",
            "深圳航空": "#3498DB",
        }
        
        for _, route in display_routes.iterrows():
            dep_city = str(route["出发城市"])
            arr_city = str(route["到达城市"])
            
            # 匹配机场
            dep_match = airports_df[airports_df["城市"].str.contains(dep_city.replace("市","").replace("区",""), na=False)]
            arr_match = airports_df[airports_df["城市"].str.contains(arr_city.replace("市","").replace("区",""), na=False)]
            
            if not dep_match.empty and not arr_match.empty:
                dep_airport = dep_match.iloc[0]
                arr_airport = arr_match.iloc[0]
                
                color = airline_colors.get(route["航司"], "#95A5A6")
                
                folium.PolyLine(
                    locations=[(dep_airport["纬度"], dep_airport["经度"]), 
                              (arr_airport["纬度"], arr_airport["经度"])],
                    color=color,
                    weight=1.5,
                    opacity=0.4,
                    popup=folium.Popup(
                        f"<b>{dep_airport['机场名称']} → {arr_airport['机场名称']}</b><br>"
                        f"航司: {route['航司']}<br>"
                        f"航距: {route['航距_km'] if pd.notna(route['航距_km']) else 'N/A'} km",
                        max_width=250
                    ),
                ).add_to(m)
                routes_drawn += 1
    
    # 如果已核算，高亮显示核算航线
    if st.session_state.get("calc_done", False):
        params = st.session_state.last_params
        result = st.session_state.last_result
        dep_row = airports_df[airports_df["机场名称"] == params["出发"]]
        arr_row = airports_df[airports_df["机场名称"] == params["到达"]]
        if not dep_row.empty and not arr_row.empty:
            dep_row = dep_row.iloc[0]
            arr_row = arr_row.iloc[0]
            
            annual_co2 = result["基准CO2排放_吨"]
            if annual_co2 < 50000:
                line_color = "#2FB66D"
                emission_level = "低排放"
            elif annual_co2 < 150000:
                line_color = "#C97A3A"
                emission_level = "中排放"
            else:
                line_color = "#E74C3C"
                emission_level = "高排放"
            
            folium.PolyLine(
                locations=[(dep_row["纬度"], dep_row["经度"]), (arr_row["纬度"], arr_row["经度"])],
                color=line_color,
                weight=5,
                opacity=0.9,
                popup=folium.Popup(
                    f"<b>📊 核算航线</b><br>"
                    f"{params['航线']}<br>"
                    f"航司: {params['航司']}<br>"
                    f"机型: {params['机型']}<br>"
                    f"航距: {result['航距_km']} km<br>"
                    f"年度排放: {result['基准CO2排放_吨']:,.0f} 吨<br>"
                    f"排放等级: <b>{emission_level}</b>",
                    max_width=280
                ),
            ).add_to(m)
    
    st_folium(m, height=550, width=None)
    
    st.markdown(f"""
    <div style="display:flex; gap:20px; justify-content:center; margin-top:12px; flex-wrap:wrap;">
        <span>🟠 枢纽机场</span>
        <span>🔵 普通机场</span>
        <span style="color:#E74C3C;">━ 南方航空</span>
        <span style="color:#2D9CDB;">━ 东方航空</span>
        <span style="color:#C97A3A;">━ 国际航空</span>
        <span style="color:#2FB66D;">━ 厦门航空</span>
        <span style="color:#E67E22;">━ 海南航空</span>
    </div>
    <div style="text-align:center; margin-top:8px; color:#888; font-size:12px;">
        已加载 {routes_drawn} 条航线 | 粗线为已核算航线（按排放着色）
    </div>
    """, unsafe_allow_html=True)

# ============================================================
# 页面：成本测算
# ============================================================
def render_cost_page():
    st.markdown("""
    <div class="page-header">
        <h2>💰 成本测算</h2>
        <p>成本-减排平衡分析，系统通过组合优化避免单一依赖SAF带来的成本压力。</p>
    </div>
    """, unsafe_allow_html=True)
    
    if not st.session_state.get("calc_done", False):
        st.warning("⚠️ 请先在「碳排核算」页面完成核算。")
        return
    
    result = st.session_state.last_result
    params = st.session_state.last_params
    plans = st.session_state.get("plans", [])
    
    if not plans:
        plans = generate_reduction_plans(
            result["基准CO2排放_吨"], result["年度燃油消耗_吨"],
            params["航空煤油价格"], params["SAF价格"], params["碳价"],
            params["SAF掺混比例"], DEFAULTS["SAF生命周期减排率"],
            params["客座率"]
        )
    
    st.markdown("### 📊 成本-减排平衡分析")
    
    # 四图布局
    col1, col2 = st.columns(2)
    
    with col1:
        # 各方案总成本对比
        plans_cost = pd.DataFrame([
            {"方案": p["name"], "新增成本(元)": p["新增成本_元"],
             "碳成本节约(元)": p["碳成本节约_元"], "最终成本变化(元)": p["最终成本变化_元"]}
            for p in plans
        ])
        fig1 = go.Figure()
        fig1.add_trace(go.Bar(name="新增成本", x=plans_cost["方案"], y=plans_cost["新增成本(元)"],
                               marker_color="#C97A3A"))
        fig1.add_trace(go.Bar(name="碳成本节约", x=plans_cost["方案"], y=plans_cost["碳成本节约(元)"],
                               marker_color="#2FB66D"))
        fig1.add_trace(go.Bar(name="最终成本变化", x=plans_cost["方案"], y=plans_cost["最终成本变化(元)"],
                               marker_color="#0F4C5C"))
        fig1.update_layout(title="各方案成本变化对比", barmode="group", height=380)
        st.plotly_chart(fig1, use_container_width=True)
    
    with col2:
        # 减排量对比
        plans_reduction = pd.DataFrame([
            {"方案": p["name"], "预计减排量(吨)": p["预计减排量_吨"], "减排率(%)": p["减排率"]}
            for p in plans
        ])
        fig2 = px.bar(plans_reduction, x="方案", y="预计减排量(吨)", color="方案",
                       color_discrete_map={"低成本方案":"#2D9CDB","均衡减排方案":"#2FB66D","深度减排方案":"#C97A3A"},
                       title="各方案减排量对比", text="预计减排量(吨)")
        fig2.update_traces(texttemplate="%{text:,.0f}", textposition="outside")
        fig2.update_layout(showlegend=False, height=380)
        st.plotly_chart(fig2, use_container_width=True)
    
    col3, col4 = st.columns(2)
    
    with col3:
        # 单位减排成本
        unit_cost_data = pd.DataFrame([
            {"方案": p["name"], "单位减排成本(元/吨)": p["单位减排成本_元每吨"]}
            for p in plans
        ])
        fig3 = px.bar(unit_cost_data, x="方案", y="单位减排成本(元/吨)", color="方案",
                       color_discrete_map={"低成本方案":"#2D9CDB","均衡减排方案":"#2FB66D","深度减排方案":"#C97A3A"},
                       title="单位减排成本对比 (元/吨CO₂)")
        fig3.update_layout(showlegend=False, height=380)
        st.plotly_chart(fig3, use_container_width=True)
    
    with col4:
        # 堆叠柱状图
        stack_data = pd.DataFrame({
            "方案": [p["name"] for p in plans],
            "燃油成本": [result["传统燃油成本_元"]] * 3,
            "SAF增量成本": [
                plans[0]["新增成本_元"] * 0.3 if plans[0]["新增成本_元"] > 0 else 0,
                result["SAF增量成本_元"],
                result["SAF增量成本_元"] * 2.5
            ],
            "碳汇成本": [p["新增成本_元"] * 0.3 for p in plans],
            "碳成本节约": [-p["碳成本节约_元"] for p in plans],
        })
        fig4 = go.Figure()
        fig4.add_trace(go.Bar(name="碳成本节约", x=stack_data["方案"], y=stack_data["碳成本节约"],
                               marker_color="#2FB66D"))
        fig4.add_trace(go.Bar(name="碳汇成本", x=stack_data["方案"], y=stack_data["碳汇成本"],
                               marker_color="#C97A3A"))
        fig4.add_trace(go.Bar(name="SAF增量成本", x=stack_data["方案"], y=stack_data["SAF增量成本"],
                               marker_color="#E74C3C"))
        fig4.update_layout(title="成本构成堆叠图", barmode="relative", height=380)
        st.plotly_chart(fig4, use_container_width=True)
    
    # 核心表达
    st.markdown("""
    <div class="info-box" style="margin-top:20px;">
        <h4>💡 平台核心价值</h4>
        <p>系统通过<strong>运行优化、机型匹配、有限SAF掺混和碳汇抵消的组合优化</strong>，避免单一依赖SAF带来的成本压力。</p>
        <p>在「十五五」碳达峰攻坚期，航司需要在减排效果和成本控制之间找到最优平衡——这正是本平台的核心决策支持能力。</p>
    </div>
    """, unsafe_allow_html=True)

# ============================================================
# 页面：SAF 价格趋势预测
# ============================================================
def render_saf_trend_page():
    st.markdown("""
    <div class="page-header">
        <h2>📈 SAF 价格趋势预测</h2>
        <p>分析SAF价格下降趋势对航司减排成本的影响，探索成本临界点。</p>
    </div>
    """, unsafe_allow_html=True)
    
    col_input, col_chart = st.columns([1, 2])
    
    with col_input:
        st.markdown("### ⚙️ 情景参数")
        saf_current = st.number_input("SAF 当前价格 (元/吨)", value=DEFAULTS["SAF价格"], key="saf_current")
        fuel_p = st.number_input("传统航空煤油价格 (元/吨)", value=DEFAULTS["航空煤油价格"], key="saf_fuel_p")
        carbon_p = st.number_input("碳价 (元/吨CO₂)", value=DEFAULTS["碳价"], key="saf_carbon_p")
        saf_ratio_s = st.slider("SAF 掺混比例", 5, 50, 10, 5, key="saf_ratio_s") / 100
        saf_reduction = st.slider("SAF 生命周期减排率", 50, 90, 70, 5, key="saf_reduction_s") / 100
        years = st.slider("预测年份范围", 2026, 2035, (2026, 2035), key="saf_years")
        price_decline = st.slider("年均降价率 (%)", 3, 15, 8, key="saf_decline") / 100
    
    with col_chart:
        # 1. SAF 价格预测折线图
        year_range = list(range(years[0], years[1] + 1))
        saf_prices = [saf_current * (1 - price_decline) ** (y - years[0]) for y in year_range]
        
        fig1 = go.Figure()
        fig1.add_trace(go.Scatter(x=year_range, y=saf_prices, mode="lines+markers",
                                   line=dict(color="#C97A3A", width=3),
                                   marker=dict(size=8),
                                   name="SAF预测价格"))
        fig1.add_hline(y=fuel_p, line_dash="dash", line_color="#2D9CDB",
                        annotation_text=f"传统航油: {fuel_p}元/吨")
        fig1.update_layout(title="SAF 价格预测趋势", xaxis_title="年份", yaxis_title="价格 (元/吨)",
                            height=380, hovermode="x")
        st.plotly_chart(fig1, use_container_width=True)
        
        # 2. 不同掺混比例成本变化
        st.markdown("### 📊 不同掺混比例下的年度总成本变化")
        ratios = [0.05, 0.10, 0.20, 0.30]
        
        # 使用一个假设的年度燃油量
        annual_fuel_demo = 5000  # 假设年度燃油5000吨
        cost_data = []
        for ratio in ratios:
            for i, year in enumerate(year_range):
                saf_price_year = saf_prices[i]
                trad_cost = annual_fuel_demo * fuel_p
                saf_use = annual_fuel_demo * ratio
                trad_use = annual_fuel_demo * (1 - ratio)
                blended = trad_use * fuel_p + saf_use * saf_price_year
                incremental = blended - trad_cost
                co2_base = annual_fuel_demo * DEFAULTS["CO2排放因子"]
                co2_reduction = co2_base * ratio * saf_reduction
                carbon_saving = co2_reduction * carbon_p
                net = incremental - carbon_saving
                cost_data.append({"年份": year, "掺混比例": f"{int(ratio*100)}%", 
                                  "净成本变化(元)": net / 10000})  # 万元
        
        cost_df = pd.DataFrame(cost_data)
        fig2 = px.line(cost_df, x="年份", y="净成本变化(元)", color="掺混比例",
                        title="不同SAF掺混比例下净成本变化趋势（万元）",
                        color_discrete_map={"5%":"#2FB66D","10%":"#2D9CDB","20%":"#C97A3A","30%":"#E74C3C"})
        fig2.add_hline(y=0, line_dash="dash", line_color="gray")
        fig2.update_layout(height=380, yaxis_title="净成本变化 (万元)")
        st.plotly_chart(fig2, use_container_width=True)
        
        # 3. SAF 价格临界点
        st.markdown("### 🎯 SAF 价格临界点分析")
        # 找到使净成本变化为0时的SAF价格
        critical_prices = []
        for ratio in ratios:
            co2_base = annual_fuel_demo * DEFAULTS["CO2排放因子"]
            co2_reduction = co2_base * ratio * saf_reduction
            carbon_saving_per_ton_saf = (co2_reduction * carbon_p) / (annual_fuel_demo * ratio)
            critical_price = fuel_p - carbon_saving_per_ton_saf
            critical_prices.append({"掺混比例": f"{int(ratio*100)}%", 
                                     "临界SAF价格(元/吨)": max(0, critical_price)})
        
        critical_df = pd.DataFrame(critical_prices)
        fig3 = px.bar(critical_df, x="掺混比例", y="临界SAF价格(元/吨)", color="掺混比例",
                       title="不同掺混比例下SAF成本临界价格（综合成本持平传统方案时）",
                       text="临界SAF价格(元/吨)",
                       color_discrete_map={"5%":"#2FB66D","10%":"#2D9CDB","20%":"#C97A3A","30%":"#E74C3C"})
        fig3.add_hline(y=fuel_p, line_dash="dash", line_color="gray",
                        annotation_text=f"传统航油: {fuel_p}元/吨")
        fig3.update_traces(texttemplate="%{text:,.0f}", textposition="outside")
        fig3.update_layout(showlegend=False, height=380)
        st.plotly_chart(fig3, use_container_width=True)
        
        # 4. 减排量与成本对比柱状图
        st.markdown("### 📊 减排量与成本对比")
        bar_data = []
        for ratio in ratios:
            co2_base = annual_fuel_demo * DEFAULTS["CO2排放因子"]
            reduction = co2_base * ratio * saf_reduction
            saf_usage = annual_fuel_demo * ratio
            saf_cost_incremental = saf_usage * (saf_current - fuel_p)
            bar_data.append({"掺混比例": f"{int(ratio*100)}%", 
                            "减排量(吨)": reduction,
                            "SAF增量成本(万元)": saf_cost_incremental / 10000})
        
        bar_df = pd.DataFrame(bar_data)
        fig4 = make_subplots(specs=[[{"secondary_y": True}]])
        fig4.add_trace(go.Bar(name="减排量(吨)", x=bar_df["掺混比例"], y=bar_df["减排量(吨)"],
                               marker_color="#2FB66D", offsetgroup=0), secondary_y=False)
        fig4.add_trace(go.Bar(name="SAF增量成本(万元)", x=bar_df["掺混比例"], y=bar_df["SAF增量成本(万元)"],
                               marker_color="#C97A3A", offsetgroup=1), secondary_y=True)
        fig4.update_layout(title="不同SAF掺混比例：减排效果与成本对比", height=380,
                            barmode="group")
        fig4.update_yaxes(title_text="减排量 (吨CO₂)", secondary_y=False)
        fig4.update_yaxes(title_text="增量成本 (万元)", secondary_y=True)
        st.plotly_chart(fig4, use_container_width=True)
    
    # 说明
    st.markdown(f"""
    <div class="info-box">
        <h4>📌 情景说明</h4>
        <p>本页为情景预测，<strong>不代表市场价格承诺</strong>。用于展示SAF规模化应用、技术进步和碳成本约束下的成本敏感性。</p>
        <p>在民航绿色低碳转型、SAF产业化推进和碳约束增强的政策趋势下，SAF掺混比例与成本平衡将成为航司中长期减排决策的重要变量。</p>
        <p>当SAF价格降至约 <b>{fuel_p * 0.8:,.0f}-{fuel_p * 1.05:,.0f} 元/吨</b> 区间，叠加碳成本节约后，综合成本将逐步接近传统燃油方案。</p>
    </div>
    """, unsafe_allow_html=True)

# ============================================================
# 页面：输出报告
# ============================================================
def render_report_page():
    st.markdown("""
    <div class="page-header">
        <h2>📄 智能减碳方案输出报告</h2>
        <p>综合核算结果、减碳方案与成本分析，适合路演展示和截图。</p>
    </div>
    """, unsafe_allow_html=True)
    
    if not st.session_state.get("calc_done", False):
        st.warning("⚠️ 请先在「碳排核算」页面完成核算。")
        return
    
    result = st.session_state.last_result
    params = st.session_state.last_params
    plans = st.session_state.get("plans", [])
    
    if not plans:
        plans = generate_reduction_plans(
            result["基准CO2排放_吨"], result["年度燃油消耗_吨"],
            params["航空煤油价格"], params["SAF价格"], params["碳价"],
            params["SAF掺混比例"], DEFAULTS["SAF生命周期减排率"],
            params["客座率"]
        )
    
    # 报告头部
    st.markdown(f"""
    <div style="background:#0F4C5C; color:white; padding:24px; border-radius:8px; text-align:center;">
        <h2 style="margin:0;">航碳智脑 — 智能减碳方案输出报告</h2>
        <p style="margin:4px 0 0; opacity:0.8;">航司：{params['航司']} | 航线：{params['航线']} | 机型：{params['机型']}</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # 核心指标
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.metric("当前总排放量", f"{result['基准CO2排放_吨']:,.0f} 吨")
    with c2:
        st.metric("每客碳排放", f"{result['每客碳排放_kgCO2']} kgCO₂")
    with c3:
        st.metric("年度燃油消耗", f"{result['年度燃油消耗_吨']:,.0f} 吨")
    with c4:
        st.metric("年度航班量", f"{result['年度航班量']:,} 班")
    
    st.markdown("---")
    
    # 航线排放排名（演示中仅此一条）
    st.markdown("### 📊 航线排放排名")
    route_emission = pd.DataFrame([{
        "航线": params["航线"],
        "年度CO₂排放(吨)": result["基准CO2排放_吨"],
        "每客碳排放(kgCO₂)": result["每客碳排放_kgCO2"],
        "航距(km)": result["航距_km"],
    }])
    fig_route = px.bar(route_emission, x="航线", y="年度CO₂排放(吨)",
                        title="航线年度碳排放", text="年度CO₂排放(吨)",
                        color_discrete_sequence=["#C97A3A"])
    fig_route.update_traces(texttemplate="%{text:,.0f}", textposition="outside")
    st.plotly_chart(fig_route, use_container_width=True)
    
    # 减排措施潜力
    st.markdown("### 🌿 减排措施潜力")
    measures = {
        "措施": ["航路优化", "机型匹配", "客座率提升", "SAF掺混", "碳汇抵消", "地面优化"],
        "潜力(%)": [7, 12, 6, 10, 15, 3],
    }
    measures_df = pd.DataFrame(measures)
    fig_radar = px.line_polar(measures_df, r="潜力(%)", theta="措施", line_close=True,
                               title="减排措施潜力雷达图")
    fig_radar.update_traces(fill="toself", line_color="#0F4C5C")
    st.plotly_chart(fig_radar, use_container_width=True)
    
    # 三种方案成本变化
    st.markdown("### 💰 三种方案成本变化")
    plans_cost = pd.DataFrame([
        {"方案": p["name"], "新增成本(元)": p["新增成本_元"],
         "碳成本节约(元)": p["碳成本节约_元"], "最终成本变化(元)": p["最终成本变化_元"]}
        for p in plans
    ])
    fig_cost = go.Figure()
    fig_cost.add_trace(go.Bar(name="新增成本", x=plans_cost["方案"], y=plans_cost["新增成本(元)"],
                               marker_color="#C97A3A"))
    fig_cost.add_trace(go.Bar(name="碳成本节约", x=plans_cost["方案"], y=plans_cost["碳成本节约(元)"],
                               marker_color="#2FB66D"))
    fig_cost.add_trace(go.Bar(name="最终成本变化", x=plans_cost["方案"], y=plans_cost["最终成本变化(元)"],
                               marker_color="#0F4C5C"))
    fig_cost.update_layout(barmode="group", title="三种方案成本变化对比")
    st.plotly_chart(fig_cost, use_container_width=True)
    
    # 推荐方案
    st.markdown("### ⭐ 推荐方案")
    recommended = plans[1]  # 均衡方案
    st.markdown(f"""
    <div class="plan-card recommended">
        <h3>🏆 {recommended['name']} <span class="tag-green">{recommended['tag']}</span></h3>
        <p><b>预计减排量：</b>{recommended['预计减排量_吨']:,.0f} 吨 | <b>减排率：</b>{recommended['减排率']}%</p>
        <p><b>最终成本变化：</b>{recommended['最终成本变化_元']:+,.0f} 元</p>
        <p>{recommended['推荐理由']}</p>
    </div>
    """, unsafe_allow_html=True)
    
    # 实施路径
    st.markdown("### 🗓️ 「十五五」阶段实施路径")
    timeline_data = pd.DataFrame({
        "年份": [2026, 2027, 2028, 2029, 2030],
        "阶段": ["基线建立", "试点运行", "规模推广", "深化优化", "达标评估"],
        "累计减排(%)": [5, 15, 30, 42, 50],
        "措施": ["数据采集与核算\n航路优化启动", "SAF试点掺混\n机型匹配调整", 
                "SAF规模应用\n客座率优化", "全航线推广\n碳汇策略优化", "碳达峰评估\n持续改进"],
    })
    
    fig_timeline = px.line(timeline_data, x="年份", y="累计减排(%)", text="阶段",
                            title="「十五五」碳减排实施路径 (2026-2030)",
                            markers=True)
    fig_timeline.update_traces(line=dict(color="#0F4C5C", width=3),
                                textposition="top center")
    fig_timeline.update_layout(yaxis_range=[0, 60])
    st.plotly_chart(fig_timeline, use_container_width=True)
    
    for _, row in timeline_data.iterrows():
        st.markdown(f"**{row['年份']}年 - {row['阶段']}**：{row['措施']}")
    
    # 底部按钮
    st.markdown("<br>", unsafe_allow_html=True)
    col_btn1, col_btn2, col_btn3 = st.columns(3)
    with col_btn1:
        if st.button("📥 导出报告", use_container_width=True):
            st.success("演示版已生成当前方案摘要，可用于路演展示。")
    with col_btn2:
        if st.button("💾 保存到飞机档案", use_container_width=True):
            st.info("演示版：方案已保存至会话缓存。")
    with col_btn3:
        if st.button("↩️ 返回修改参数", use_container_width=True):
            st.session_state.page = "碳排核算"
            st.rerun()

# ============================================================
# 页面：数据说明与溯源
# ============================================================
def render_data_page():
    st.markdown("""
    <div class="page-header">
        <h2>📚 数据说明与溯源</h2>
        <p>可复算 · 可审计 · 可追溯</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div class="info-box">
        本页面公示平台所有数据来源、计算公式及估算假设，确保核算过程透明、可复算、可验证。
    </div>
    """, unsafe_allow_html=True)
    
    # 1. 数据来源总览
    st.markdown("### 📋 数据来源总览")
    
    sources = [
        ("🗺️", "机场经纬度坐标", "OpenStreetMap / 公开地理数据 / 用户导入数据"),
        ("✈️", "机型性能参数", "ICAO 碳排放数据库 / 公开资料 / 行业均值"),
        ("🔥", "航油排放因子", "IPCC / 行业估算因子"),
        ("📐", "航距计算", "Haversine 大圆距离公式"),
        ("🌿", "SAF 生命周期减排率", "公开研究与行业假设"),
        ("💰", "碳价 / 碳汇价格", "市场均价 / 用户输入"),
        ("📊", "减碳方案基准", "行业最佳实践与情景估算"),
    ]
    
    cols = st.columns(4)
    for i, (icon, title, desc) in enumerate(sources):
        with cols[i % 4]:
            st.markdown(f"""
            <div class="card">
                <div style="font-size:24px;">{icon}</div>
                <h4>{title}</h4>
                <p style="font-size:12px; color:#666;">{desc}</p>
            </div>
            """, unsafe_allow_html=True)
    
    # 2. 核心计算公式
    st.markdown("### 📐 核心计算公式")
    
    formula_cards = [
        ("Haversine 航距公式", 
         r"$$a = \sin^2(\Delta\varphi/2) + \cos(\varphi_1) \cdot \cos(\varphi_2) \cdot \sin^2(\Delta\lambda/2)$$"
         r"$$c = 2 \cdot \text{atan2}(\sqrt{a}, \sqrt{1-a})$$"
         r"$$D = R \cdot c$$"),
        ("巡航油耗",
         r"$$\text{巡航时间} = \frac{\text{航距}}{\text{巡航速度}}$$"
         r"$$\text{巡航油耗} = \text{巡航时间} \times \text{小时油耗}$$"),
        ("碳排放核算",
         r"$$\text{燃油消耗} = \text{巡航油耗} \times \text{LTO附加系数} \times \text{年度航班量}$$"
         r"$$\text{CO}_2\text{排放} = \text{燃油消耗} \times 3.15$$"),
        ("SAF 减排",
         r"$$\text{SAF减排量} = \text{基准CO}_2\text{排放} \times \text{SAF掺混比例} \times \text{SAF生命周期减排率}$$"),
        ("成本核算",
         r"$$\text{最终成本变化} = \text{减排措施新增成本} - \text{碳成本节约}$$"),
    ]
    
    for name, formula in formula_cards:
        with st.expander(f"📝 {name}", expanded=False):
            st.markdown(formula)
    
    # 3. ISO 14064 说明
    st.markdown("### 🏛️ ISO 14064 说明")
    st.markdown("""
    <div class="card card-blue">
        <p>本平台不声称 ISO 14064 直接给出航空排放因子，而是参照 <b>ISO 14064</b> 的温室气体量化、边界设定、活动数据采集、排放因子计算、记录留痕和结果披露原则组织核算过程。</p>
        <p>航空具体排放量采用<strong>"活动数据 × 排放因子"</strong>的方法估算，属于范围一（直接排放）核算框架。</p>
    </div>
    """, unsafe_allow_html=True)
    
    # 4. 默认值说明
    st.markdown("### ⚙️ 默认参数值")
    
    default_table = pd.DataFrame([
        ("航空煤油价格", f"{DEFAULTS['航空煤油价格']:,} 元/吨", "演示默认值，可由用户修改"),
        ("SAF 价格", f"{DEFAULTS['SAF价格']:,} 元/吨", "演示默认值，可由用户修改"),
        ("碳价 / 碳汇价格", f"{DEFAULTS['碳价']} 元/吨CO₂", "演示默认值，可由用户修改"),
        ("SAF 生命周期减排率", f"{DEFAULTS['SAF生命周期减排率']*100:.0f}%", "可调整假设值"),
        ("LTO 附加系数", f"{DEFAULTS['LTO附加系数']}", "行业通用估算系数"),
        ("CO₂ 排放因子", f"{DEFAULTS['CO2排放因子']} 吨CO₂/吨燃油", "航空煤油排放估算因子"),
    ], columns=["参数", "默认值", "说明"])
    
    st.dataframe(default_table, use_container_width=True, hide_index=True)
    
    # 机型参数表
    st.markdown("#### 机型默认参数")
    aircraft_df = load_aircraft()
    st.dataframe(aircraft_df, use_container_width=True, hide_index=True)
    
    st.markdown("""
    <div class="info-box" style="margin-top:16px;">
        <strong>📌 重要说明：</strong>所有默认值均为演示估算值，可由用户输入替换。正式应用需接入航司实际运行数据、燃油采购价格和经核证排放因子。
    </div>
    """, unsafe_allow_html=True)
    
    # 政策背景（稳妥表述）
    st.markdown("### 📜 政策背景")
    st.markdown("""
    <div class="info-box">
        <p>在<strong>民航绿色低碳转型、SAF产业化推进和碳约束增强</strong>的政策趋势下，航司面临越来越明确的碳排放核算、报告和减排要求。</p>
        <p>本平台旨在为航司提供一套<strong>透明、可追溯、可复算</strong>的碳排放核算与减排方案决策工具，服务于「十五五」碳达峰攻坚期的精准减排需求。</p>
    </div>
    """, unsafe_allow_html=True)

# ============================================================
# 顶部导航
# ============================================================
def render_top_nav():
    pages = ["首页", "碳排核算", "减碳方案", "航线网络", "成本测算", "SAF趋势", "输出报告", "数据说明"]
    current = st.session_state.get("page", "首页")
    
    cols = st.columns([2] + [1] * len(pages) + [1])
    with cols[0]:
        st.markdown('<span style="font-size:20px; font-weight:700; color:#0F4C5C;">✈️ 航碳智脑</span>', unsafe_allow_html=True)
    
    for i, page in enumerate(pages):
        with cols[i + 1]:
            if page == current:
                st.markdown(f'<div style="text-align:center; background:#0F4C5C; color:white; padding:6px 8px; border-radius:4px; font-size:13px; font-weight:600;">{page}</div>', unsafe_allow_html=True)
            else:
                if st.button(page, key=f"nav_{page}", use_container_width=True):
                    st.session_state.page = page
                    st.rerun()

# ============================================================
# 主函数
# ============================================================
def main():
    inject_css()
    
    # 初始化 session state
    if "page" not in st.session_state:
        st.session_state.page = "首页"
    if "calc_done" not in st.session_state:
        st.session_state.calc_done = False
    if "show_plan_detail" not in st.session_state:
        st.session_state.show_plan_detail = False
    
    # 顶部导航（首页自行内嵌导航栏，不使用 Streamlit 默认导航）
    if st.session_state.page != "首页":
        render_top_nav()
        st.markdown("<div style='height:8px;'></div>", unsafe_allow_html=True)
    
    # 根据页面状态渲染
    page = st.session_state.page
    
    if page == "首页":
        render_entry_page()
    elif page == "碳排核算":
        render_calculation_page()
    elif page == "减碳方案":
        render_plans_page()
    elif page == "航线网络":
        render_network_page()
    elif page == "成本测算":
        render_cost_page()
    elif page == "SAF趋势":
        render_saf_trend_page()
    elif page == "输出报告":
        render_report_page()
    elif page == "数据说明":
        render_data_page()
    
    # 底部
    if st.session_state.page != "首页":
        st.markdown("---")
        st.markdown('<div class="footer-note">航碳智脑 v1.0 | 民航碳效智能决策平台 | 演示版 · 仅供路演展示</div>', unsafe_allow_html=True)

if __name__ == "__main__":
    main()
