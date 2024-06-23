package admin

import (
	"bot/logger"
	"bot/models"
	"bot/utils"
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

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
	if generalData.DiffPip != "" {
		update["$set"].(bson.M)["diff_pip"] = generalData.DiffPip
	}
	if generalData.ValuesCandels != "" {
		update["$set"].(bson.M)["values_candels"] = generalData.ValuesCandels
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
	db, err := utils.GetDB(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
		return
	}

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

	var generalData models.GeneralData
	if err := db.Collection("general_data").FindOne(context.Background(),
		bson.M{},
		options.FindOne().SetSort(bson.D{{Key: "_id", Value: -1}})).Decode(&generalData); err != nil {
		utils.InternalError(c)
		return
	}

	inRange, _ := utils.IsValidTime(generalData.FromTime, generalData.ToTime)
	if !inRange {
		utils.InternalError(c)
		return
	}

	var matchedCondition = false
	volume, err := strconv.ParseFloat(data.Volume, 64)
	hasFlag, _ := utils.StringToBool(data.Flag)

	candelValues, _ := strconv.ParseFloat(generalData.ValuesCandels, 64)

	if candelValues != 0 {
		values, _ := strconv.ParseFloat(data.ValuesPercentage, 64)

		if values < (candelValues*-1) && candelValues < values {
			valid, computedData := models.ComputeTradeData(c, generalData, data, true)
			if valid {
				msg := computedData.String()
				logger.SendMessage(msg)
			}
		}
	}

	if generalData.FirstType.NumberCount >= 0 {
		countFlags := len(strings.Split(data.Signaler, "|")) - 2
		if !matchedCondition &&
			(generalData.FirstType.HasFlag == hasFlag || generalData.JustSendSignal) &&
			(generalData.FirstType.NumberCount == 0 || countFlags == generalData.FirstType.NumberCount) &&
			(generalData.FirstType.MinVolumn <= volume || generalData.JustSendSignal) {

			matched := false
			candelValues, _ := strconv.ParseFloat(generalData.ValuesCandels, 64)
			if candelValues != 0 {
				values, _ := strconv.ParseFloat(data.ValuesPercentage, 64)
				if values < (candelValues*-1) && candelValues < values {
					matched = true
				} else {
					matched = false
				}
			}

			if matched {
				matchedCondition = true
				valid, computedData := models.ComputeTradeData(c, generalData, data, true)
				if valid {
					msg := computedData.String()
					logger.SendMessage(msg)
				}
			}
		}
	}

	if generalData.SecondType.NumberCount >= 0 {
		countFlags := len(strings.Split(data.Signaler, "|")) - 2
		if !matchedCondition &&
			(generalData.SecondType.HasFlag == hasFlag || generalData.JustSendSignal) &&
			(generalData.SecondType.NumberCount == 0 || countFlags == generalData.SecondType.NumberCount) &&
			(generalData.SecondType.MinVolumn <= volume || generalData.JustSendSignal) {

			matched := false
			candelValues, _ := strconv.ParseFloat(generalData.ValuesCandels, 64)
			if candelValues != 0 {
				values, _ := strconv.ParseFloat(data.ValuesPercentage, 64)
				if (candelValues*-1) < values && values < candelValues {
					matched = true
				} else {
					matched = false
				}
			}

			if matched {
				matchedCondition = true
				valid, computedData := models.ComputeTradeData(c, generalData, data, false)
				if valid {
					msg := computedData.String()
					logger.SendMessage(msg)
				}
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully received data"})
}
