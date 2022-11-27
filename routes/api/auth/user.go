package auth

import (
	"net/http"
	"strconv"

	"github.com/EmergencyBucket/pail/database"
	"github.com/gin-gonic/gin"
)

func GetUser(context *gin.Context) {
	var user database.User

	strId, _ := context.Params.Get("id")

	id, _ := strconv.Atoi(strId)

	database.DB.First(&user, id)

	if &user == nil {
		context.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"id": user.ID,
		"username": user.Username,
		"email": user.Email,
		"admin": user.Admin,
	})
}
