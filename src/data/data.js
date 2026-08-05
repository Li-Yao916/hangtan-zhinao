// ============================================================
// 航碳智脑 - 静态数据与常量
// ============================================================

// ---------- 机场数据 (50+ 中国主要机场) ----------
export const airportsData = [
  { name: '北京首都', city: '北京', icao: 'ZBAA', iata: 'PEK', lat: 40.0799, lng: 116.6031, type: '枢纽' },
  { name: '北京大兴', city: '北京', icao: 'ZBAD', iata: 'PKX', lat: 39.5098, lng: 116.4105, type: '枢纽' },
  { name: '上海虹桥', city: '上海', icao: 'ZSSS', iata: 'SHA', lat: 31.1979, lng: 121.3363, type: '枢纽' },
  { name: '上海浦东', city: '上海', icao: 'ZSPD', iata: 'PVG', lat: 31.1434, lng: 121.8052, type: '枢纽' },
  { name: '广州白云', city: '广州', icao: 'ZGGG', iata: 'CAN', lat: 23.3924, lng: 113.2988, type: '枢纽' },
  { name: '深圳宝安', city: '深圳', icao: 'ZGSZ', iata: 'SZX', lat: 22.6394, lng: 113.8147, type: '枢纽' },
  { name: '成都天府', city: '成都', icao: 'ZUTF', iata: 'TFU', lat: 30.3190, lng: 104.4410, type: '枢纽' },
  { name: '成都双流', city: '成都', icao: 'ZUUU', iata: 'CTU', lat: 30.5785, lng: 103.9470, type: '枢纽' },
  { name: '重庆江北', city: '重庆', icao: 'ZUCK', iata: 'CKG', lat: 29.7192, lng: 106.6417, type: '枢纽' },
  { name: '西安咸阳', city: '西安', icao: 'ZLXY', iata: 'XIY', lat: 34.4471, lng: 108.7516, type: '枢纽' },
  { name: '昆明长水', city: '昆明', icao: 'ZPPP', iata: 'KMG', lat: 25.1019, lng: 102.9291, type: '枢纽' },
  { name: '杭州萧山', city: '杭州', icao: 'ZSHC', iata: 'HGH', lat: 30.2295, lng: 120.4344, type: '普通' },
  { name: '南京禄口', city: '南京', icao: 'ZSNJ', iata: 'NKG', lat: 31.7420, lng: 118.8620, type: '普通' },
  { name: '武汉天河', city: '武汉', icao: 'ZHHH', iata: 'WUH', lat: 30.7838, lng: 114.2081, type: '普通' },
  { name: '长沙黄花', city: '长沙', icao: 'ZGHA', iata: 'CSX', lat: 28.1892, lng: 113.2198, type: '普通' },
  { name: '厦门高崎', city: '厦门', icao: 'ZSAM', iata: 'XMN', lat: 24.5440, lng: 118.1277, type: '普通' },
  { name: '青岛胶东', city: '青岛', icao: 'ZSQD', iata: 'TAO', lat: 36.3619, lng: 120.0890, type: '普通' },
  { name: '乌鲁木齐地窝堡', city: '乌鲁木齐', icao: 'ZWWW', iata: 'URC', lat: 43.9071, lng: 87.4742, type: '普通' },
  { name: '哈尔滨太平', city: '哈尔滨', icao: 'ZYHB', iata: 'HRB', lat: 45.6234, lng: 126.2503, type: '普通' },
  { name: '海口美兰', city: '海口', icao: 'ZJHK', iata: 'HAK', lat: 19.9349, lng: 110.4590, type: '普通' },
  { name: '郑州新郑', city: '郑州', icao: 'ZHCC', iata: 'CGO', lat: 34.5197, lng: 113.8405, type: '普通' },
  { name: '沈阳桃仙', city: '沈阳', icao: 'ZYTX', iata: 'SHE', lat: 41.6398, lng: 123.4836, type: '普通' },
  { name: '大连周水子', city: '大连', icao: 'ZYTL', iata: 'DLC', lat: 38.9657, lng: 121.5386, type: '普通' },
  { name: '济南遥墙', city: '济南', icao: 'ZSJN', iata: 'TNA', lat: 36.8572, lng: 117.2159, type: '普通' },
  { name: '天津滨海', city: '天津', icao: 'ZBTJ', iata: 'TSN', lat: 39.1244, lng: 117.3462, type: '普通' },
  { name: '福州长乐', city: '福州', icao: 'ZSFZ', iata: 'FOC', lat: 25.9351, lng: 119.6633, type: '普通' },
  { name: '南宁吴圩', city: '南宁', icao: 'ZGNN', iata: 'NNG', lat: 22.6083, lng: 108.1724, type: '普通' },
  { name: '贵阳龙洞堡', city: '贵阳', icao: 'ZUGY', iata: 'KWE', lat: 26.5385, lng: 106.8007, type: '普通' },
  { name: '太原武宿', city: '太原', icao: 'ZBYN', iata: 'TYN', lat: 37.7469, lng: 112.6284, type: '普通' },
  { name: '南昌昌北', city: '南昌', icao: 'ZSCN', iata: 'KHN', lat: 28.8650, lng: 115.9000, type: '普通' },
  { name: '合肥新桥', city: '合肥', icao: 'ZSOF', iata: 'HFE', lat: 31.9878, lng: 116.9768, type: '普通' },
  { name: '石家庄正定', city: '石家庄', icao: 'ZBSJ', iata: 'SJW', lat: 38.2807, lng: 114.6973, type: '普通' },
  { name: '长春龙嘉', city: '长春', icao: 'ZYCC', iata: 'CGQ', lat: 43.9962, lng: 125.6852, type: '普通' },
  { name: '兰州中川', city: '兰州', icao: 'ZLLL', iata: 'LHW', lat: 36.5152, lng: 103.6206, type: '普通' },
  { name: '呼和浩特白塔', city: '呼和浩特', icao: 'ZBHH', iata: 'HET', lat: 40.8514, lng: 111.8241, type: '普通' },
  { name: '温州龙湾', city: '温州', icao: 'ZSWZ', iata: 'WNZ', lat: 27.9122, lng: 120.8520, type: '普通' },
  { name: '珠海金湾', city: '珠海', icao: 'ZGSD', iata: 'ZUH', lat: 22.0064, lng: 113.3760, type: '普通' },
  { name: '无锡硕放', city: '无锡', icao: 'ZSWX', iata: 'WUX', lat: 31.4944, lng: 120.4294, type: '普通' },
  { name: '烟台蓬莱', city: '烟台', icao: 'ZSYT', iata: 'YNT', lat: 37.4017, lng: 121.3717, type: '普通' },
  { name: '泉州晋江', city: '泉州', icao: 'ZSQZ', iata: 'JJN', lat: 24.7964, lng: 118.5895, type: '普通' },
  { name: '常州奔牛', city: '常州', icao: 'ZSCG', iata: 'CZX', lat: 31.9197, lng: 119.7788, type: '普通' },
  { name: '南通兴东', city: '南通', icao: 'ZSNT', iata: 'NTG', lat: 32.0708, lng: 120.9756, type: '普通' },
  { name: '扬州泰州', city: '扬州', icao: 'ZSYA', iata: 'YTY', lat: 32.5634, lng: 119.7198, type: '普通' },
  { name: '惠州平潭', city: '惠州', icao: 'ZGHZ', iata: 'HUZ', lat: 23.0490, lng: 114.6000, type: '普通' },
  { name: '丽江三义', city: '丽江', icao: 'ZPLJ', iata: 'LJG', lat: 26.6800, lng: 100.2460, type: '普通' },
  { name: '运城张孝', city: '运城', icao: 'ZBYC', iata: 'YCU', lat: 35.1100, lng: 111.0400, type: '普通' },
  { name: '宜春明月山', city: '宜春', icao: 'ZSYC', iata: 'YIC', lat: 27.8025, lng: 114.3062, type: '普通' },
  { name: '绵阳南郊', city: '绵阳', icao: 'ZUMY', iata: 'MIG', lat: 31.4280, lng: 104.7410, type: '普通' },
  { name: '宜宾五粮液', city: '宜宾', icao: 'ZUYB', iata: 'YBP', lat: 28.8000, lng: 104.5450, type: '普通' },
  { name: '景德镇罗家', city: '景德镇', icao: 'ZSJD', iata: 'JDZ', lat: 29.3386, lng: 117.1758, type: '普通' },
  { name: '台州路桥', city: '台州', icao: 'ZSLQ', iata: 'HYN', lat: 28.5622, lng: 121.4286, type: '普通' },
  { name: '池州九华山', city: '池州', icao: 'ZSJH', iata: 'JUH', lat: 30.7400, lng: 117.6850, type: '普通' },
  { name: '临沂启阳', city: '临沂', icao: 'ZSLY', iata: 'LYI', lat: 34.9887, lng: 118.4013, type: '普通' },
  { name: '襄阳刘集', city: '襄阳', icao: 'ZHXF', iata: 'XFN', lat: 32.1500, lng: 112.2910, type: '普通' },
  { name: '巴中恩阳', city: '巴中', icao: 'ZUBZ', iata: 'BZX', lat: 31.7380, lng: 106.6450, type: '普通' },
];

// ---------- 航线数据 (30+ 条国内航线) ----------
export const routesData = [
  { origin: '北京首都', dest: '深圳宝安', distance: 2077, airline: '中国国航', aircraft: 'B737-800', annualEmission: 18500 },
  { origin: '北京首都', dest: '成都天府', distance: 1697, airline: '中国国航', aircraft: 'A320-200', annualEmission: 15200 },
  { origin: '北京首都', dest: '泉州晋江', distance: 1732, airline: '中国国航', aircraft: 'B737-800', annualEmission: 14800 },
  { origin: '北京首都', dest: '南宁吴圩', distance: 2250, airline: '中国国航', aircraft: 'A320neo', annualEmission: 17500 },
  { origin: '北京首都', dest: '南通兴东', distance: 1080, airline: '中国国航', aircraft: 'ARJ21', annualEmission: 8200 },
  { origin: '上海虹桥', dest: '广州白云', distance: 1308, airline: '东方航空', aircraft: 'A330-300', annualEmission: 22000 },
  { origin: '上海浦东', dest: '深圳宝安', distance: 1346, airline: '东方航空', aircraft: 'B787-9', annualEmission: 21000 },
  { origin: '杭州萧山', dest: '广州白云', distance: 1099, airline: '南方航空', aircraft: 'A320-200', annualEmission: 9800 },
  { origin: '杭州萧山', dest: '深圳宝安', distance: 1179, airline: '深圳航空', aircraft: 'B737-800', annualEmission: 10200 },
  { origin: '广州白云', dest: '成都天府', distance: 1390, airline: '南方航空', aircraft: 'A320neo', annualEmission: 11500 },
  { origin: '广州白云', dest: '海口美兰', distance: 548, airline: '南方航空', aircraft: 'A320-200', annualEmission: 5200 },
  { origin: '广州白云', dest: '哈尔滨太平', distance: 3119, airline: '南方航空', aircraft: 'A330-300', annualEmission: 32000 },
  { origin: '广州白云', dest: '南京禄口', distance: 1255, airline: '南方航空', aircraft: 'B737-800', annualEmission: 10800 },
  { origin: '广州白云', dest: '西安咸阳', distance: 1528, airline: '南方航空', aircraft: 'A320-200', annualEmission: 13500 },
  { origin: '广州白云', dest: '青岛胶东', distance: 1867, airline: '南方航空', aircraft: 'B737-800', annualEmission: 16800 },
  { origin: '成都天府', dest: '广州白云', distance: 1390, airline: '四川航空', aircraft: 'A320-200', annualEmission: 11200 },
  { origin: '成都天府', dest: '深圳宝安', distance: 1446, airline: '四川航空', aircraft: 'A320neo', annualEmission: 11800 },
  { origin: '成都天府', dest: '南京禄口', distance: 1618, airline: '四川航空', aircraft: 'B737-800', annualEmission: 14200 },
  { origin: '成都天府', dest: '合肥新桥', distance: 1392, airline: '四川航空', aircraft: 'A320-200', annualEmission: 11000 },
  { origin: '成都双流', dest: '深圳宝安', distance: 1446, airline: '中国国航', aircraft: 'A320-200', annualEmission: 11600 },
  { origin: '重庆江北', dest: '深圳宝安', distance: 1290, airline: '重庆航空', aircraft: 'A320-200', annualEmission: 10500 },
  { origin: '重庆江北', dest: '南京禄口', distance: 1305, airline: '重庆航空', aircraft: 'B737-800', annualEmission: 11200 },
  { origin: '重庆江北', dest: '南昌昌北', distance: 970, airline: '重庆航空', aircraft: 'ARJ21', annualEmission: 7500 },
  { origin: '西安咸阳', dest: '广州白云', distance: 1528, airline: '东方航空', aircraft: 'A320-200', annualEmission: 13000 },
  { origin: '昆明长水', dest: '成都天府', distance: 734, airline: '东方航空', aircraft: 'B737-800', annualEmission: 6200 },
  { origin: '深圳宝安', dest: '海口美兰', distance: 603, airline: '深圳航空', aircraft: 'A320-200', annualEmission: 5600 },
  { origin: '深圳宝安', dest: '哈尔滨太平', distance: 3034, airline: '深圳航空', aircraft: 'A330-300', annualEmission: 31000 },
  { origin: '深圳宝安', dest: '长春龙嘉', distance: 2983, airline: '深圳航空', aircraft: 'A330-300', annualEmission: 30500 },
  { origin: '合肥新桥', dest: '广州白云', distance: 1105, airline: '东方航空', aircraft: 'A320-200', annualEmission: 9200 },
  { origin: '合肥新桥', dest: '深圳宝安', distance: 1191, airline: '东方航空', aircraft: 'B737-800', annualEmission: 10100 },
  { origin: '福州长乐', dest: '南宁吴圩', distance: 1455, airline: '厦门航空', aircraft: 'B737-800', annualEmission: 12800 },
  { origin: '武汉天河', dest: '广州白云', distance: 1015, airline: '南方航空', aircraft: 'A320-200', annualEmission: 8800 },
  { origin: '长沙黄花', dest: '烟台蓬莱', distance: 1437, airline: '南方航空', aircraft: 'B737-800', annualEmission: 12100 },
  { origin: '海口美兰', dest: '无锡硕放', distance: 1939, airline: '海南航空', aircraft: 'B737-800', annualEmission: 17200 },
  { origin: '哈尔滨太平', dest: '南京禄口', distance: 1756, airline: '深圳航空', aircraft: 'A320-200', annualEmission: 15600 },
];

// ---------- 机型数据 ----------
export const aircraftData = [
  { model: 'A320-200', cruiseSpeed: 840, hourlyFuelBurn: 2.5, seats: 150, type: '窄体机' },
  { model: 'A320neo', cruiseSpeed: 840, hourlyFuelBurn: 2.1, seats: 165, type: '窄体机' },
  { model: 'B737-800', cruiseSpeed: 840, hourlyFuelBurn: 2.6, seats: 162, type: '窄体机' },
  { model: 'B737 MAX 8', cruiseSpeed: 840, hourlyFuelBurn: 2.2, seats: 178, type: '窄体机' },
  { model: 'A330-300', cruiseSpeed: 870, hourlyFuelBurn: 5.8, seats: 300, type: '宽体机' },
  { model: 'B787-9', cruiseSpeed: 903, hourlyFuelBurn: 5.4, seats: 290, type: '宽体机' },
  { model: 'ARJ21', cruiseSpeed: 780, hourlyFuelBurn: 1.3, seats: 90, type: '支线机' },
  { model: 'C919', cruiseSpeed: 840, hourlyFuelBurn: 2.4, seats: 158, type: '窄体机' },
];

// ---------- 默认常量 ----------
export const defaultConstants = {
  jetFuelPrice: 5000,        // 航空煤油价格（元/吨）
  safPrice: 9000,            // SAF 价格（元/吨）
  carbonPrice: 80,           // 碳价（元/吨CO₂）
  ltoFactor: 1.06,           // LTO 附加系数
  safLifecycleReduction: 0.80, // SAF 生命周期减排率
  co2EmissionFactor: 3.15,   // 航空煤油 CO₂ 排放因子 (吨CO₂/吨燃油)
};

// ---------- 航司列表 ----------
export const airlines = [
  '中国国航', '东方航空', '南方航空', '海南航空', '深圳航空',
  '厦门航空', '四川航空', '山东航空', '春秋航空', '吉祥航空',
];

// ---------- 燃油类型 ----------
export const fuelTypes = [
  { label: '航空煤油 (Jet A-1)', value: 'JetA1' },
  { label: '航空煤油 + SAF 掺混', value: 'JetA1+SAF' },
];

// ============================================================
// 计算工具函数
// ============================================================

/** Haversine 大圆距离公式 - 计算两经纬度点之间的距离（公里） */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // 地球半径（公里）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/** 根据机场名称查找机场数据 */
export function findAirport(name) {
  return airportsData.find(
    (a) => a.name === name || a.iata === name || a.city === name
  );
}

/** 根据机型查找机型数据 */
export function findAircraft(model) {
  return aircraftData.find((a) => a.model === model);
}

/** 计算巡航时间（小时） */
export function calcCruiseTime(distanceKm, cruiseSpeedKmh) {
  if (!distanceKm || !cruiseSpeedKmh || cruiseSpeedKmh === 0) return 0;
  return distanceKm / cruiseSpeedKmh;
}

/** 计算燃油消耗（吨），含 LTO 附加系数 */
export function calcFuelConsumption(distanceKm, cruiseSpeedKmh, hourlyFuelBurn, ltoFactor = defaultConstants.ltoFactor) {
  const cruiseTime = calcCruiseTime(distanceKm, cruiseSpeedKmh);
  return cruiseTime * hourlyFuelBurn * ltoFactor;
}

/** 计算 CO₂ 排放量（吨） */
export function calcCO2Emission(fuelTons, co2Factor = defaultConstants.co2EmissionFactor) {
  return fuelTons * co2Factor;
}

/** 计算 SAF 减排量（吨CO₂） */
export function calcSAFReduction(co2Emission, safBlendRatio, safReductionRate = defaultConstants.safLifecycleReduction) {
  return co2Emission * (safBlendRatio / 100) * safReductionRate;
}

/** 计算年度航班量（每日航班数 × 365） */
export function calcAnnualFlights(dailyFlights) {
  return dailyFlights * 365;
}

/** 计算年度燃油成本（元） */
export function calcAnnualFuelCost(annualFuelTons, fuelPrice) {
  return annualFuelTons * fuelPrice;
}

/** 计算碳成本（元） */
export function calcCarbonCost(co2Emission, carbonPrice) {
  return co2Emission * carbonPrice;
}

/** 计算 SAF 增量成本（元） */
export function calcSAFIncrementalCost(annualFuelTons, safBlendRatio, jetFuelPrice, safPrice) {
  const safTons = annualFuelTons * (safBlendRatio / 100);
  return safTons * (safPrice - jetFuelPrice);
}

/** 综合核算：根据全部输入参数返回完整结果 */
export function fullCalculation(params) {
  const {
    origin, dest, aircraft, dailyFlights, seats,
    loadFactor, jetFuelPrice, safPrice, carbonPrice,
    safBlendRatio, emissionTarget,
  } = params;

  const originAirport = findAirport(origin);
  const destAirport = findAirport(dest);
  const ac = findAircraft(aircraft);

  if (!originAirport || !destAirport || !ac) {
    return null;
  }

  const distance = haversineDistance(
    originAirport.lat, originAirport.lng,
    destAirport.lat, destAirport.lng
  );

  const fuelPerFlight = calcFuelConsumption(distance, ac.cruiseSpeed, ac.hourlyFuelBurn);
  const co2PerFlight = calcCO2Emission(fuelPerFlight);
  const annualFlights = calcAnnualFlights(dailyFlights || 1);
  const annualFuel = fuelPerFlight * annualFlights;
  const annualCO2 = co2PerFlight * annualFlights;
  const perPassengerCO2 = (seats && loadFactor) ? co2PerFlight / (seats * loadFactor / 100) : 0;

  const annualFuelCost = calcAnnualFuelCost(annualFuel, jetFuelPrice);
  const carbonCostTotal = calcCarbonCost(annualCO2, carbonPrice);
  const safIncrementalCost = calcSAFIncrementalCost(annualFuel, safBlendRatio, jetFuelPrice, safPrice);
  const safReduction = calcSAFReduction(annualCO2, safBlendRatio);
  const netCO2AfterSAF = annualCO2 - safReduction;
  const netCostChange = safIncrementalCost - safReduction * carbonPrice;

  return {
    distance,
    fuelPerFlight,
    co2PerFlight,
    annualFlights,
    annualFuel,
    annualCO2,
    perPassengerCO2,
    annualFuelCost,
    carbonCostTotal,
    safIncrementalCost,
    safReduction,
    netCO2AfterSAF,
    netCostChange,
    aircraft: ac,
  };
}
