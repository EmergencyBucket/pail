package auth

import (
	"net/http"
	"strconv"

	"github.com/EmergencyBucket/pail/database"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type CreateTeamRequest struct {
	UserId   uint   `json:"userId"`
	Teamname string `json:"teamname"`
}

func GetTeam(context *gin.Context) {
	var team database.Team

	strId, _ := context.Params.Get("id")

	id, _ := strconv.Atoi(strId)

	database.DB.First(&team, id)

	if &team == nil {
		context.JSON(http.StatusNotFound, gin.H{
			"error": "Team not found",
		})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"id":       team.ID,
		"teamname": team.Teamname,
		"leaderId": team.Leader.Id,
		"members":  team.Members, // I wiill be surprised if this works
	})
}

func CreateTeam(context *gin.Context) {
	var team CreateTeamRequest
	if err := context.ShouldBindJSON(&team); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	database.DB.Create(&database.Team{
		Teamname: team.Teamname,
		LeaderId: team.UserId,
		Members: pq.Int32Array([]int32{int32(team.UserId)}),
	})

	context.JSON(http.StatusCreated, gin.H{
		"status": "created",
	})
}