package models

import "time"

type WeatherData struct {
	ID        interface{} `json:"id,omitempty" bson:"_id,omitempty"`
	Temp      float64     `json:"temp" bson:"temp"`
	RainLevel float64     `json:"rain_level" bson:"rain_level"`
	WindSpeed float64     `json:"wind_speed" bson:"wind_speed"`
	CreatedAt time.Time   `json:"created_at" bson:"created_at"`
	Humidity  float64     `json:"humidity" bson:"humidity"`
}

type User struct {
	ID       interface{} `json:"id,omitempty" bson:"_id,omitempty"`
	Username string      `json:"username" bson:"username"`
	Password string      `json:"password" bson:"password"`
}
