package handlers

import (
	"encoding/json"
	"net/http"

	"girocash/api/internal/mock"
)

func respond(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func Health(w http.ResponseWriter, r *http.Request) {
	respond(w, http.StatusOK, map[string]string{"status": "ok"})
}

func GetDashboard(w http.ResponseWriter, r *http.Request) {
	respond(w, http.StatusOK, mock.Dashboard())
}

func GetWorkdays(w http.ResponseWriter, r *http.Request) {
	respond(w, http.StatusOK, mock.Workdays())
}

func CreateWorkday(w http.ResponseWriter, r *http.Request) {
	respond(w, http.StatusCreated, map[string]string{"message": "workday created (mock)"})
}

func GetFuel(w http.ResponseWriter, r *http.Request) {
	respond(w, http.StatusOK, mock.FuelEntries())
}

func CreateFuelEntry(w http.ResponseWriter, r *http.Request) {
	respond(w, http.StatusCreated, map[string]string{"message": "fuel entry created (mock)"})
}

func GetMaintenance(w http.ResponseWriter, r *http.Request) {
	respond(w, http.StatusOK, mock.MaintenanceEntries())
}

func CreateMaintenanceEntry(w http.ResponseWriter, r *http.Request) {
	respond(w, http.StatusCreated, map[string]string{"message": "maintenance entry created (mock)"})
}

func GetGoals(w http.ResponseWriter, r *http.Request) {
	respond(w, http.StatusOK, mock.Goals())
}

func CreateGoal(w http.ResponseWriter, r *http.Request) {
	respond(w, http.StatusCreated, map[string]string{"message": "goal created (mock)"})
}

func GetAchievements(w http.ResponseWriter, r *http.Request) {
	respond(w, http.StatusOK, mock.Achievements())
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
	respond(w, http.StatusOK, mock.Profile())
}
