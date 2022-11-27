package main

import (
	"fmt"

	"github.com/EmergencyBucket/pail/database"
)

func main() {
	fmt.Println("Starting Pail v1.0.0")
	database.Connect()
	database.Migrate()
}
