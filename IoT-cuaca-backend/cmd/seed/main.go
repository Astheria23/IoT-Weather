package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Gak ada file .env bro")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(os.Getenv("MONGO_URI")))
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database(os.Getenv("DB_NAME"))
	userCol := db.Collection("users")

	username := "admin"
	password := "Admin@1234"

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	user := map[string]interface{}{
		"username": username,
		"password": string(hashedPassword),
		"role":     "admin",
	}

	_, err = userCol.InsertOne(ctx, user)
	if err != nil {
		log.Fatal("Gagal insert, mungkin usernamenya udah ada?")
	}

	fmt.Printf("✅ User Berhasil Dibuat!\nUsername: %s\nPassword: %s\n", username, password)
}
