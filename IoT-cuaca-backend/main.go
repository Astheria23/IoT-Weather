package main

import (
	"log"
	"weather-dashboard-api/database"
	"weather-dashboard-api/handlers"
	"weather-dashboard-api/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization, X-Requested-With",
	}))
	app.Use(logger.New())

	database.ConnectDB()
	app.Post("/login", handlers.Login)

	app.Post("/api/sensor", handlers.IngestData)

	// realtime websocket endpoint for dashboard clients to receive new sensor data
	// upgrade and handling implemented in handlers package
	app.Get("/ws", handlers.WsUpgrader)

	api := app.Group("/api/dashboard", middleware.Protected())
	api.Get("/stats", handlers.GetWeatherStats)

	log.Fatal(app.Listen(":3000"))

}
