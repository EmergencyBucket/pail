package routes

import "github.com/gin-gonic/gin"
import "github.com/EmergencyBucket/pail/routes/api/auth"

func setupRoutes() {
	router := gin.Default()
	router.GET("/api/auth/user/:id", )
}
