package ctf

import (
	"net/http"
	"strconv"

	"github.com/EmergencyBucket/pail/database"
	"github.com/gin-gonic/gin"
)

type CreateInviteRequest struct {
	TeamId   uint   `json:"team_id"`
	Username string `json:"username"`
}

func GetInvites(context *gin.Context) {
	var invites []database.Invite

	strId, _ := context.Params.Get("id")

	id, _ := strconv.Atoi(strId)

	database.DB.Where("user_id = ?", id).Find(&invites)

	context.JSON(http.StatusOK, gin.H{
		"invites": invites,
	})
}