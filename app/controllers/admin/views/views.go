package admin

import (
	"bot/models"
	"bot/utils"
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func ViewAllUsers(c *gin.Context) {
	if !models.AllowedAction(c, models.ActionReadOnly) {
		return
	}
	db, err := utils.GetDB(c)
	if err != nil {
		log.Println(err)
		return
	}
	var users []models.User
	cursor, err := db.Collection("users").Find(context.Background(), bson.M{})
	if err != nil && err != mongo.ErrNoDocuments {
		log.Println(err)
		utils.InternalError(c)
		return
	}
	defer cursor.Close(context.Background())
	if err := cursor.All(context.Background(), &users); err != nil {
		log.Println(err)
		utils.InternalError(c)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "done",
		"users":   users,
	})
}

func ViewGeneralData(c *gin.Context) {
	if !models.AllowedAction(c, models.ActionReadOnly) {
		return
	}
	db, err := utils.GetDB(c)
	if err != nil {
		log.Println(err)
		return
	}
	var generalData []models.GeneralData
	cursor, err := db.Collection("general_data").Find(context.Background(), bson.M{})
	if err != nil && err != mongo.ErrNoDocuments {
		log.Println(err)
		utils.InternalError(c)
		return
	}
	defer cursor.Close(context.Background())
	if err := cursor.All(context.Background(), &generalData); err != nil {
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

func ViewMetric(c *gin.Context) {
	if !models.AllowedAction(c, models.ActionReadOnly) {
		return
	}

	var request struct {
		RangeTime int `json:"time"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		log.Println(err)
		utils.BadBinding(c)
		return
	}

	db, err := utils.GetDB(c)
	if err != nil {
		log.Println(err)
		return
	}

	if request.RangeTime <= 0 {
		utils.BadBinding(c)
		return
	}

	var generalData models.GeneralData
	if err := db.Collection("general_data").FindOne(context.Background(), bson.M{}).Decode(&generalData); err != nil {
		log.Println(err)
		utils.InternalError(c)
		return
	}

	var users []models.User
	cursor, err := db.Collection("users").Find(context.Background(), bson.M{})
	if err != nil && err != mongo.ErrNoDocuments {
		utils.InternalError(c)
		return
	}
	defer cursor.Close(context.Background())
	if err := cursor.All(context.Background(), &users); err != nil {
		utils.InternalError(c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "done",
		"users":   users,
	})
}

func ViewUser(c *gin.Context) {
	if !models.AllowedAction(c, models.ActionReadOnly) {
		return
	}

	var request struct {
		ID string `json:"id"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		log.Println(err)
		utils.BadBinding(c)
		return
	}

	userID, err := primitive.ObjectIDFromHex(request.ID)
	if err != nil {
		log.Println(err)
		utils.BadBinding(c)
		return
	}

	db, err := utils.GetDB(c)
	if err != nil {
		log.Println(err)
		return
	}

	var user models.User
	if err := db.Collection("users").FindOne(context.Background(),
		bson.M{"_id": userID}).Decode(&user); err != nil && err != mongo.ErrNoDocuments {
		log.Println(err)
		utils.InternalError(c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "done",
		"user":    user,
	})
}
