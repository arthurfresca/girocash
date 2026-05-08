package mock

import "girocash/api/internal/models"

func Dashboard() models.DashboardSummary {
	return models.DashboardSummary{
		Today: models.DayStats{
			GrossEarnings: 187.50,
			NetProfit:     142.30,
			KmDriven:      95,
			HoursWorked:   7.5,
			FuelCost:      45.20,
			RideCount:     12,
		},
		Week: models.PeriodStats{
			GrossEarnings: 892.40,
			NetProfit:     671.80,
			KmDriven:      423,
			HoursWorked:   35,
			FuelCost:      210.60,
			RideCount:     58,
		},
		Month: models.PeriodStats{
			GrossEarnings: 3450.80,
			NetProfit:     2580.60,
			KmDriven:      1820,
			HoursWorked:   148,
			FuelCost:      870.20,
			RideCount:     242,
		},
		Charts: models.ChartData{
			DailyEarnings: []models.ChartPoint{
				{Label: "Seg", Gross: 160.00, Net: 118.50},
				{Label: "Ter", Gross: 195.50, Net: 148.20},
				{Label: "Qua", Gross: 142.30, Net: 105.80},
				{Label: "Qui", Gross: 210.80, Net: 162.40},
				{Label: "Sex", Gross: 187.50, Net: 142.30},
				{Label: "Sáb", Gross: 0, Net: 0},
				{Label: "Dom", Gross: 0, Net: 0},
			},
			ExpenseBreakdown: []models.ChartSlice{
				{Label: "Combustível", Value: 870.20, Color: "#22c55e"},
				{Label: "Manutenção", Value: 320.00, Color: "#3b82f6"},
				{Label: "Impostos", Value: 345.08, Color: "#8b5cf6"},
				{Label: "Outros", Value: 150.00, Color: "#f59e0b"},
			},
		},
	}
}

func Workdays() []models.Workday {
	return []models.Workday{
		{ID: "1", Date: "2026-05-08", GrossEarnings: 187.50, NetProfit: 142.30, KmDriven: 95, HoursWorked: 7.5, FuelCost: 45.20, RideCount: 12, Platform: "Uber", Notes: ""},
		{ID: "2", Date: "2026-05-07", GrossEarnings: 210.80, NetProfit: 162.40, KmDriven: 108, HoursWorked: 8.0, FuelCost: 48.40, RideCount: 14, Platform: "Uber", Notes: "Bom dia"},
		{ID: "3", Date: "2026-05-06", GrossEarnings: 142.30, NetProfit: 105.80, KmDriven: 72, HoursWorked: 5.5, FuelCost: 36.50, RideCount: 9, Platform: "99", Notes: ""},
		{ID: "4", Date: "2026-05-05", GrossEarnings: 195.50, NetProfit: 148.20, KmDriven: 98, HoursWorked: 7.0, FuelCost: 47.30, RideCount: 13, Platform: "Uber", Notes: ""},
		{ID: "5", Date: "2026-05-04", GrossEarnings: 160.00, NetProfit: 118.50, KmDriven: 85, HoursWorked: 6.5, FuelCost: 41.50, RideCount: 10, Platform: "Uber", Notes: "Chuva à tarde"},
		{ID: "6", Date: "2026-05-01", GrossEarnings: 220.00, NetProfit: 170.00, KmDriven: 115, HoursWorked: 9.0, FuelCost: 50.00, RideCount: 16, Platform: "Uber", Notes: "Feriado - muito movimento"},
	}
}

func FuelEntries() []models.FuelEntry {
	return []models.FuelEntry{
		{ID: "1", Date: "2026-05-08", FuelType: "Gasolina", Liters: 35.5, TotalCost: 213.00, PricePerLiter: 6.00, KmAtFill: 48250, Station: "Shell Paulista"},
		{ID: "2", Date: "2026-05-05", FuelType: "Gasolina", Liters: 33.0, TotalCost: 198.00, PricePerLiter: 6.00, KmAtFill: 47827, Station: "Ipiranga Centro"},
		{ID: "3", Date: "2026-05-01", FuelType: "Etanol", Liters: 40.0, TotalCost: 176.00, PricePerLiter: 4.40, KmAtFill: 47402, Station: "Posto Bom Preço"},
		{ID: "4", Date: "2026-04-28", FuelType: "Gasolina", Liters: 34.0, TotalCost: 203.70, PricePerLiter: 5.99, KmAtFill: 46987, Station: "Shell Paulista"},
	}
}

func MaintenanceEntries() []models.MaintenanceEntry {
	return []models.MaintenanceEntry{
		{ID: "1", Date: "2026-04-15", Type: "Óleo", Description: "Troca de óleo 5W30 sintético", Cost: 180.00, KmAtService: 45000, NextServiceKm: 50000},
		{ID: "2", Date: "2026-03-10", Type: "Pneus", Description: "Alinhamento e balanceamento", Cost: 120.00, KmAtService: 43500, NextServiceKm: 53500},
		{ID: "3", Date: "2026-02-20", Type: "Freios", Description: "Troca das pastilhas dianteiras", Cost: 280.00, KmAtService: 41200, NextServiceKm: 61200},
		{ID: "4", Date: "2026-01-08", Type: "Filtro", Description: "Filtro de ar e filtro de combustível", Cost: 95.00, KmAtService: 39800, NextServiceKm: 49800},
	}
}

func Goals() []models.Goal {
	return []models.Goal{
		{ID: "1", Title: "Renda mensal", TargetValue: 3500.00, CurrentValue: 3450.80, Type: "earnings", Period: "monthly", Deadline: "2026-05-31"},
		{ID: "2", Title: "Economia de combustível", TargetValue: 800.00, CurrentValue: 870.20, Type: "fuel", Period: "monthly", Deadline: "2026-05-31"},
		{ID: "3", Title: "Km dirigidos", TargetValue: 2000.00, CurrentValue: 1820.00, Type: "km", Period: "monthly", Deadline: "2026-05-31"},
		{ID: "4", Title: "Corridas realizadas", TargetValue: 250.00, CurrentValue: 242.00, Type: "rides", Period: "monthly", Deadline: "2026-05-31"},
	}
}

func Achievements() []models.Achievement {
	return []models.Achievement{
		{ID: "1", Title: "Primeiro dia", Description: "Registrou o primeiro dia de trabalho", Icon: "🚗", Unlocked: true, UnlockedAt: "2026-01-02", XP: 50},
		{ID: "2", Title: "Semana completa", Description: "Trabalhou 5 dias seguidos", Icon: "📅", Unlocked: true, UnlockedAt: "2026-01-07", XP: 100},
		{ID: "3", Title: "R$ 1.000 em um mês", Description: "Atingiu R$ 1.000 de lucro mensal", Icon: "💰", Unlocked: true, UnlockedAt: "2026-01-31", XP: 200},
		{ID: "4", Title: "Mestre do combustível", Description: "Registrou 10 abastecimentos", Icon: "⛽", Unlocked: true, UnlockedAt: "2026-02-15", XP: 150},
		{ID: "5", Title: "R$ 3.000 em um mês", Description: "Atingiu R$ 3.000 de lucro mensal", Icon: "🏆", Unlocked: false, XP: 500},
		{ID: "6", Title: "100 corridas", Description: "Completou 100 corridas em um mês", Icon: "🎯", Unlocked: false, XP: 300},
		{ID: "7", Title: "Manutenção em dia", Description: "Registrou 5 manutenções preventivas", Icon: "🔧", Unlocked: false, XP: 200},
		{ID: "8", Title: "Streak de 30 dias", Description: "Trabalhou 30 dias seguidos", Icon: "🔥", Unlocked: false, XP: 1000},
	}
}

func Profile() models.UserProfile {
	return models.UserProfile{
		ID:       "1",
		Name:     "Carlos Silva",
		Email:    "carlos.silva@email.com",
		Plan:     "Pro",
		Level:    8,
		XP:       2450,
		Streak:   12,
		Platform: "Uber",
		Vehicle:  "Toyota Corolla 2022",
	}
}
