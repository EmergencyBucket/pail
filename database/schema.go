package database

import (
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	pq "github.com/lib/pq"
)

type User struct {
	gorm.Model
	Username string `gorm:"not null"`
	Email    string `gorm:"not null"`
	Admin    bool   `gorm:"not null"`
}

type Team struct {
	gorm.Model
	Teamname string        `gorm:"not null"`
	LeaderId uint          `gorm:"not null"`
	Leader   User          `gorm:"not null"`
	Members  pq.Int64Array `gorm:"not null;type:integer[]"`
}

var DB *gorm.DB

func Connect() {
	database, err := gorm.Open(postgres.Open(os.Getenv("DATABASE_URL")))

	if err != nil {
		panic("Could not connect to database!")
	}

	DB = database
}

func Migrate() {
	DB.AutoMigrate(&User{}, &Team{})
}
