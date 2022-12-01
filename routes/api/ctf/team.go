package ctf

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
		"members":  team.Members, // I will be surprised if this works
	})
}

func CreateTeam(context *gin.Context) {
	var request CreateTeamRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var team database.Team

	if database.DB.First(&team, "leader_id = ?", request.UserId) != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"error": "Leave your current team first",
		})
		return
	}

	database.DB.Create(&database.Team{
		Teamname: request.Teamname,
		LeaderId: request.UserId,
		Members: pq.Int32Array([]int32{int32(request.UserId)}),
	})

	context.JSON(http.StatusCreated, gin.H{
		"status": "created",
	})
}

func GetTeamByUser(context *gin.Context) {
	var team database.Team

	strId, _ := context.Params.Get("id")

	id, _ := strconv.Atoi(strId)

	database.DB.First(&team, "leader_id = ?", id)

	if &team == nil {
		context.JSON(http.StatusNotFound, gin.H{
			"error": "User is not part of a team",
		})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"teamname": team.Teamname,
		"leader_id": team.LeaderId,
		"members": team.Members,
	})
}