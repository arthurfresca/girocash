import type {
  DashboardSummary,
  Workday,
  FuelEntry,
  Goal,
  UserProfile,
} from './types'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  getDashboard: () => get<DashboardSummary>('/dashboard'),
  getWorkdays: () => get<Workday[]>('/workdays'),
  getFuel: () => get<FuelEntry[]>('/fuel'),
  getGoals: () => get<Goal[]>('/goals'),
  getProfile: () => get<UserProfile>('/profile'),
}
