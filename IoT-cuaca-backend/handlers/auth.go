package handlers

import (
	"os"
	"time"
	"weather-dashboard-api/database"
	"weather-dashboard-api/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *fiber.Ctx) error {
	var input models.User
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Input error"})
	}

	var user models.User
	err := database.DB.Collection("users").FindOne(c.Context(), bson.M{"username": input.Username}).Decode(&user)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"message": "User gak ketemu!"})
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"message": "Password salah bro!"})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": user.Username,
		"exp":      time.Now().Add(time.Hour * 72).Unix(),
	})

	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.SendStatus(500)
	}

	return c.JSON(fiber.Map{"token": t})
}
