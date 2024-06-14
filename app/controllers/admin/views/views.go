package admin

import (
	"bot/models"
	"bot/utils"
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ViewGeneralData(c *gin.Context) {
	db, err := utils.GetDB(c)
	if err != nil {
		log.Println(err)
		return
	}

	var generalData models.GeneralData
	if err := db.Collection("general_data").FindOne(context.Background(),
		bson.M{},
		options.FindOne().SetSort(bson.D{{Key: "_id", Value: -1}})).Decode(&generalData); err != nil {
		log.Println(err)
		utils.InternalError(c)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"message":      "done",
		"general_data": generalData,
	})
}
