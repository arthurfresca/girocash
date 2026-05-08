package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"girocash/api/internal/handlers"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Get("/health", handlers.Health)

	r.Route("/api/v1", func(r chi.Router) {
		r.Get("/dashboard", handlers.GetDashboard)

		r.Get("/workdays", handlers.GetWorkdays)
		r.Post("/workdays", handlers.CreateWorkday)

		r.Get("/fuel", handlers.GetFuel)
		r.Post("/fuel", handlers.CreateFuelEntry)

		r.Get("/maintenance", handlers.GetMaintenance)
		r.Post("/maintenance", handlers.CreateMaintenanceEntry)

		r.Get("/goals", handlers.GetGoals)
		r.Post("/goals", handlers.CreateGoal)

		r.Get("/achievements", handlers.GetAchievements)

		r.Get("/profile", handlers.GetProfile)
	})

	addr := fmt.Sprintf(":%s", port)
	log.Printf("GiroCash API listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, r))
}
