package admin

import (
	"bot/models"
	"bot/utils"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func SetSetting(c *gin.Context) {
	db, err := utils.GetDB(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
		return
	}

	var generalData models.GeneralData
	if err := c.ShouldBindJSON(&generalData); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	update := bson.M{"$set": bson.M{}}

	if generalData.FirstType != (models.Condition{}) {
		update["$set"].(bson.M)["first_type"] = generalData.FirstType
	}
	if generalData.SecondType != (models.Condition{}) {
		update["$set"].(bson.M)["second_type"] = generalData.SecondType
	}
	if generalData.JustSendSignal {
		update["$set"].(bson.M)["just_send_signal"] = generalData.JustSendSignal
	}
	if generalData.SyncSymbols {
		update["$set"].(bson.M)["sync_symbols"] = generalData.SyncSymbols
	}
	if generalData.FirstTrade != 0 {
		update["$set"].(bson.M)["first_trade"] = generalData.FirstTrade
	}
	if generalData.FirstTradeModeIsAmount {
		update["$set"].(bson.M)["first_trade_mode_is_amount"] = generalData.FirstTradeModeIsAmount
	}
	if generalData.StopLimit != 0 {
		update["$set"].(bson.M)["stop_limit"] = generalData.StopLimit
	}
	if generalData.Rounds != 0 {
		update["$set"].(bson.M)["rounds"] = generalData.Rounds
	}
	if generalData.MagicNumber != 0 {
		update["$set"].(bson.M)["magic_number"] = generalData.MagicNumber
	}
	if generalData.FromTime != "" {
		update["$set"].(bson.M)["from_time"] = generalData.FromTime
	}
	if generalData.ToTime != "" {
		update["$set"].(bson.M)["to_time"] = generalData.ToTime
	}
	if generalData.CompensateRounds != 0 {
		update["$set"].(bson.M)["compensate_rounds"] = generalData.CompensateRounds
	}
	if generalData.MakePositionWhenNotRoundClosed {
		update["$set"].(bson.M)["make_position_when_not_round_closed"] = generalData.MakePositionWhenNotRoundClosed
	}
	if generalData.MaxTradesVolumn != 0 {
		update["$set"].(bson.M)["max_trade_volumn"] = generalData.MaxTradesVolumn
	}
	if generalData.MaxLossToCloseAll != 0 {
		update["$set"].(bson.M)["max_loss_to_close_all"] = generalData.MaxLossToCloseAll
	}

	if len(update["$set"].(bson.M)) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No valid fields to update"})
		return
	}

	if _, err := db.Collection("general_data").UpdateOne(context.Background(),
		bson.M{},
		bson.M{
			"$set": generalData,
		},
		options.Update().SetUpsert(true)); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update general data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "General data updated successfully"})
}

func TradeData(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	var data models.Trade
	if err := json.Unmarshal(body, &data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Received data:", data)
	c.JSON(http.StatusOK, gin.H{"message": "Successfully received data"})
}
