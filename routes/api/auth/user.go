package auth

import (
	"net/http"
	"strconv"

	"github.com/EmergencyBucket/pail/database"
	"github.com/gin-gonic/gin"
)

type CreateUserRequest struct {
	Id       uint   `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

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
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
		"admin":    user.Admin,
	})
}

func CreateUser(context *gin.Context) {
	var user CreateUserRequest
	if err := context.ShouldBindJSON(&user); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Create(&database.User{
		Email: user.Email,
		Username: user.Username,
		Admin: false,
		Id: user.Id,
	})

	context.JSON(http.StatusCreated, gin.H{
		"status": "created",
	})
}
