package handlers

import (
	"encoding/json"
	"os"
	"sync"
	"time"
	"weather-dashboard-api/database"
	"weather-dashboard-api/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// simple websocket hub
var (
	clients   = make(map[*websocket.Conn]bool)
	clientsMu sync.Mutex
)

// WsUpgrader is a fiber handler that upgrades to websocket and registers client
var WsUpgrader = websocket.New(func(c *websocket.Conn) {
	// register
	clientsMu.Lock()
	clients[c] = true
	clientsMu.Unlock()

	// ensure unregister on exit
	defer func() {
		clientsMu.Lock()
		delete(clients, c)
		clientsMu.Unlock()
		c.Close()
	}()

	// read loop: keep connection open, ignore incoming messages
	for {
		if _, _, err := c.ReadMessage(); err != nil {
			break
		}
	}
})

// BroadcastWeather broadcasts a WeatherData to all connected websocket clients
func BroadcastWeather(data models.WeatherData) {
	b, err := json.Marshal(data)
	if err != nil {
		return
	}

	clientsMu.Lock()
	defer clientsMu.Unlock()

	for conn := range clients {
		// write in goroutine so one slow client doesn't block others
		go func(ws *websocket.Conn) {
			if err := ws.WriteMessage(websocket.TextMessage, b); err != nil {
				// on error, remove client
				clientsMu.Lock()
				delete(clients, ws)
				clientsMu.Unlock()
				ws.Close()
			}
		}(conn)
	}
}

func IngestData(c *fiber.Ctx) error {
	apiKey := c.Get("X-API-Key")
	if apiKey != os.Getenv("IOT_API_KEY") {
		return c.Status(401).JSON(fiber.Map{"message": "API Key Salah!"})
	}

	var data models.WeatherData
	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Data rusak"})
	}

	data.CreatedAt = time.Now()
	_, err := database.DB.Collection("weather_logs").InsertOne(c.Context(), data)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "Gagal simpan ke DB"})
	}

	// broadcast to websocket clients (best-effort)
	go BroadcastWeather(data)

	return c.Status(201).JSON(fiber.Map{"status": "success"})
}

func GetWeatherStats(c *fiber.Ctx) error {
	var logs []models.WeatherData

	findOptions := options.Find()
	findOptions.SetLimit(20)
	findOptions.SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := database.DB.Collection("weather_logs").Find(c.Context(), bson.D{}, findOptions)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "Gagal ambil data"})
	}
	defer cursor.Close(c.Context())

	for cursor.Next(c.Context()) {
		var log models.WeatherData
		if err := cursor.Decode(&log); err != nil {
			// skip malformed document but continue
			continue
		}
		logs = append(logs, log)
	}

	return c.JSON(logs)
}
