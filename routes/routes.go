package routes

import "github.com/gin-gonic/gin"
import "github.com/EmergencyBucket/pail/routes/api/auth"

func SetupRoutes() {
	router := gin.Default()
	router.GET("/api/auth/user/:id", auth.GetUser)
}
