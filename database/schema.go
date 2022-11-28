package database

import (
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	pq "github.com/lib/pq"
)

type User struct {
	gorm.Model
	Id       uint   `gorm:"primaryKey"` // github Id
	Username string `gorm:"not null"`
	Email    string `gorm:"not null"`
	Admin    bool   `gorm:"not null"`
}

type Team struct {
	gorm.Model
	Teamname string        `gorm:"not null"`
	LeaderId uint          `gorm:"not null"` // User ID of the leader of the team
	Leader   User          `gorm:"foreignKey:LeaderId"`
	Members  pq.Int32Array `gorm:"not null;type:integer[]"` // Stores User ID's of members
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
