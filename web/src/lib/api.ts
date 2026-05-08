import type {
  DashboardSummary,
  Workday,
  FuelEntry,
  MaintenanceEntry,
  Goal,
  Achievement,
  UserProfile,
} from './types'

// API_URL is used for server-side fetches (inside Docker: http://api:8080)
// NEXT_PUBLIC_API_URL is used for client-side fetches (browser: http://localhost:8080)
const BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  getDashboard: () => get<DashboardSummary>('/dashboard'),
  getWorkdays: () => get<Workday[]>('/workdays'),
  getFuel: () => get<FuelEntry[]>('/fuel'),
  getMaintenance: () => get<MaintenanceEntry[]>('/maintenance'),
  getGoals: () => get<Goal[]>('/goals'),
  getAchievements: () => get<Achievement[]>('/achievements'),
  getProfile: () => get<UserProfile>('/profile'),
}
