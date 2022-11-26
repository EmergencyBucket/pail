package database

import (
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Id       uint `gorm:"primaryKey"`
	Username string
	Email    string
}

var DB *gorm.DB

func connect() {
	database, err := gorm.Open(postgres.Open(os.Getenv("DATABASE_URL")))

	if err != nil {
		panic("Could not connect to database!")
	}

	DB = database
}

func migrate(db gorm.DB) {
	db.AutoMigrate(&User{})
}
