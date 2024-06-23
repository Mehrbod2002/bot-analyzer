package models

import (
	"time"

	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ProvidedData struct {
	Symbol         string
	High           float64
	Low            float64
	Close          float64
	Open           float64
	TradePrice     float64
	StopLimit      float64
	Tp             float64
	MagicNumber    float64
	NextTradePrice float64
	NextTradeType  string
	TradeType      string
}

type Trade struct {
	ValuesPercentage string `json:"values"`
	Index            string `json:"index"`
	Flag             string `json:"flag"`
	Signaler         string `json:"signaler"`
	Volume           string `json:"volume"`
	Condition        string `json:"condition"`
	Symbol           string `json:"symbol"`
	Time             string `json:"time"`
	Open             string `json:"open"`
	High             string `json:"high"`
	Low              string `json:"low"`
	Close            string `json:"close"`
	RSI              string `json:"rsi"`
	MACD             string `json:"macd"`
	Signal           string `json:"signal"`
	Histogram        string `json:"histogram"`
}

type User struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Email            string             `bson:"email" json:"email"`
	Password         string             `bson:"password" json:"password"`
	ResetToken       string             `bson:"reset_token" json:"reset_token"`
	ResetTokenValid  time.Time          `bson:"reset_token_valid" json:"reset_token_valid"`
	OtpValid         time.Time          `bson:"otp_valid" json:"otp_valid"`
	ReTryOtp         int                `bson:"retry_otp" json:"retry_otp"`
	CreatedAt        time.Time          `bson:"created_at" json:"created_at"`
	IsSupportOrAdmin bool               `bson:"support_or_admin" json:"support_or_admin"`
}

type Running struct {
	Active     bool    `bson:"active" json:"active"`
	SymbolName string  `bson:"symbol_name" json:"symbol_name"`
	TradeData  Trade   `bson:"trade_data" json:"trade_data"`
	Round      int     `bson:"round" json:"round"`
	History    []Trade `bson:"history" json:"history"`
}

type Condition struct {
	NumberCount int     `bson:"number_count" json:"number_count"`
	HasFlag     bool    `bson:"has_flag" json:"has_flag"`
	MinVolumn   float64 `bson:"min_volumn" json:"min_volumn"`
}

type GeneralData struct {
	ID                             primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	FirstType                      Condition          `bson:"first_type" json:"first_type"`
	SecondType                     Condition          `bson:"second_type" json:"second_type"`
	JustSendSignal                 bool               `bson:"just_send_signal" json:"just_send_signal"`
	SyncSymbols                    bool               `bson:"sync_symbols" json:"sync_symbols"`
	FirstTrade                     float64            `bson:"first_trade" json:"first_trade"`
	FirstTradeModeIsAmount         bool               `bson:"first_trade_mode_is_amount" json:"first_trade_mode_is_amount"`
	StopLimit                      float64            `bson:"stop_limit" json:"stop_limit"`
	Rounds                         int                `bson:"rounds" json:"rounds"`
	MagicNumber                    float64            `bson:"magic_number" json:"magic_number"`
	FromTime                       string             `bson:"from_time" json:"from_time"`
	ToTime                         string             `bson:"to_time" json:"to_time"`
	CompensateRounds               int                `bson:"compensate_rounds" json:"compensate_rounds"`
	MakePositionWhenNotRoundClosed bool               `bson:"make_position_when_not_round_closed" json:"make_position_when_not_round_closed"`
	MaxTradesVolumn                float64            `bson:"max_trade_volumn" json:"max_trade_volumn"`
	MaxLossToCloseAll              float64            `bson:"max_loss_to_close_all" json:"max_loss_to_close_all"`
	ValuesCandels                  string             `bson:"values_candels" json:"values_candels"`
	DiffPip                        string             `bson:"diff_pip" json:"diff_pip"`
}

type Claims struct {
	ID        string    `json:"_id"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	jwt.StandardClaims
}
