package models

type DashboardSummary struct {
	Today  DayStats    `json:"today"`
	Week   PeriodStats `json:"week"`
	Month  PeriodStats `json:"month"`
	Charts ChartData   `json:"charts"`
}

type DayStats struct {
	GrossEarnings float64 `json:"gross_earnings"`
	NetProfit     float64 `json:"net_profit"`
	KmDriven      float64 `json:"km_driven"`
	HoursWorked   float64 `json:"hours_worked"`
	FuelCost      float64 `json:"fuel_cost"`
	RideCount     int     `json:"ride_count"`
}

type PeriodStats struct {
	GrossEarnings float64 `json:"gross_earnings"`
	NetProfit     float64 `json:"net_profit"`
	KmDriven      float64 `json:"km_driven"`
	HoursWorked   float64 `json:"hours_worked"`
	FuelCost      float64 `json:"fuel_cost"`
	RideCount     int     `json:"ride_count"`
}

type ChartData struct {
	DailyEarnings []ChartPoint `json:"daily_earnings"`
	ExpenseBreakdown []ChartSlice `json:"expense_breakdown"`
}

type ChartPoint struct {
	Label string  `json:"label"`
	Gross float64 `json:"gross"`
	Net   float64 `json:"net"`
}

type ChartSlice struct {
	Label string  `json:"label"`
	Value float64 `json:"value"`
	Color string  `json:"color"`
}

type Workday struct {
	ID            string  `json:"id"`
	Date          string  `json:"date"`
	GrossEarnings float64 `json:"gross_earnings"`
	NetProfit     float64 `json:"net_profit"`
	KmDriven      float64 `json:"km_driven"`
	HoursWorked   float64 `json:"hours_worked"`
	FuelCost      float64 `json:"fuel_cost"`
	RideCount     int     `json:"ride_count"`
	Platform      string  `json:"platform"`
	Notes         string  `json:"notes"`
}

type FuelEntry struct {
	ID           string  `json:"id"`
	Date         string  `json:"date"`
	FuelType     string  `json:"fuel_type"`
	Liters       float64 `json:"liters"`
	TotalCost    float64 `json:"total_cost"`
	PricePerLiter float64 `json:"price_per_liter"`
	KmAtFill     float64 `json:"km_at_fill"`
	Station      string  `json:"station"`
}

type MaintenanceEntry struct {
	ID            string  `json:"id"`
	Date          string  `json:"date"`
	Type          string  `json:"type"`
	Description   string  `json:"description"`
	Cost          float64 `json:"cost"`
	KmAtService   float64 `json:"km_at_service"`
	NextServiceKm float64 `json:"next_service_km"`
}

type Goal struct {
	ID           string  `json:"id"`
	Title        string  `json:"title"`
	TargetValue  float64 `json:"target_value"`
	CurrentValue float64 `json:"current_value"`
	Type         string  `json:"type"`
	Period       string  `json:"period"`
	Deadline     string  `json:"deadline"`
}

type Achievement struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	Unlocked    bool   `json:"unlocked"`
	UnlockedAt  string `json:"unlocked_at,omitempty"`
	XP          int    `json:"xp"`
}

type UserProfile struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Plan     string `json:"plan"`
	Level    int    `json:"level"`
	XP       int    `json:"xp"`
	Streak   int    `json:"streak"`
	Platform string `json:"platform"`
	Vehicle  string `json:"vehicle"`
}
