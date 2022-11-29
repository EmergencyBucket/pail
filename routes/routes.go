package routes

import (
	"net/http"

	"github.com/EmergencyBucket/pail/routes/api/auth"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() {
	router := gin.Default()
	router.GET("/api/auth/user/:id", auth.GetUser)
	router.POST("/api/auth/user", auth.CreateUser)
	router.GET("/api/auth/team/:id", auth.GetTeam)
	router.POST("/api/auth/team", auth.CreateTeam)
	router.GET("/api/auth/team/user/:id", auth.GetTeamByUser)
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	router.Run()
}
