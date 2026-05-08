export interface DayStats {
  gross_earnings: number
  net_profit: number
  km_driven: number
  hours_worked: number
  fuel_cost: number
  ride_count: number
}

export interface ChartPoint {
  label: string
  gross: number
  net: number
}

export interface ChartSlice {
  label: string
  value: number
  color: string
}

export interface DashboardSummary {
  today: DayStats
  week: DayStats
  month: DayStats
  charts: {
    daily_earnings: ChartPoint[]
    expense_breakdown: ChartSlice[]
  }
}

export interface Workday {
  id: string
  date: string
  gross_earnings: number
  net_profit: number
  km_driven: number
  hours_worked: number
  fuel_cost: number
  ride_count: number
  platform: string
  notes: string
}

export interface FuelEntry {
  id: string
  date: string
  fuel_type: string
  liters: number
  total_cost: number
  price_per_liter: number
  km_at_fill: number
  station: string
}

export interface Goal {
  id: string
  title: string
  target_value: number
  current_value: number
  type: string
  period: string
  deadline: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  plan: string
  level: number
  xp: number
  streak: number
  platform: string
  vehicle: string
}
