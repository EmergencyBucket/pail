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

func CreateInvite(context *gin.Context) {
	var invite CreateInviteRequest
	if err := context.ShouldBindJSON(&invite); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user database.User

	database.DB.Where("username = ?", invite.Username).First(&user)

	if &user == nil {
		context.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	var database_invite database.Invite

	database.DB.FirstOrCreate(&database_invite, &database.Invite{
		TeamId: invite.TeamId,
		UserId: user.Id,
	})

	context.JSON(http.StatusCreated, gin.H{
		"id":       database_invite.ID,
		"team_id":  database_invite.TeamId,
		"username": database_invite.User.Username,
	})
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

type AcceptInviteRequest struct {
	UserId   uint `json:"id"`
	InviteId uint `json:"invite_id"`
}

func AcceptInvite(context *gin.Context) {
	var invite AcceptInviteRequest
	if err := context.ShouldBindJSON(&invite); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var team database.Team

	if database.DB.First(&team, "leader_id = ?", invite.UserId) != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"error": "Leave your current team first",
		})
		return
	}

	
}
