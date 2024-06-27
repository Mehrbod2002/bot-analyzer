package models

import (
	"bot/utils"
	"context"
	"fmt"
	"log"
	"math"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CalculateDiff(value, open, high, close, low, diff float64) bool {
	precision := GetPrecision(value)
	pip := (math.Pow10(-precision) * diff) * -1
	matched := false

	if (high-open)*-1 >= pip {
		matched = true
	}

	if -1*(open-low) >= pip {
		matched = true
	}

	if -1*(high-close) >= pip {
		matched = true
	}

	if -1*(close*low) >= pip {
		matched = true
	}

	return matched
}

func CalculateIncrement(value float64) float64 {
	precision := GetPrecision(value)
	return math.Pow10(-precision)
}

func formatFloat(value float64) float64 {
	str := fmt.Sprintf("%.15f", value)
	str = strings.TrimRight(str, "0")
	str = strings.TrimRight(str, ".")
	result, err := strconv.ParseFloat(str, 64)
	if err != nil {
		return value
	}

	return result
}

func FormatFloatPrecisionFloat(value float64) float64 {
	precision := GetPrecision(value)
	if precision < 0 {
		precision = 0
	} else if precision > 10 {
		precision = 10
	}
	format := fmt.Sprintf("%%.%df", precision)
	floatVal, _ := strconv.ParseFloat(format, 64)
	return floatVal
}

func FormatFloatPrecision(value float64, precision int) string {
	if precision < 0 {
		precision = 0
	} else if precision > 10 {
		precision = 10
	}
	format := fmt.Sprintf("%%.%df", precision)
	return fmt.Sprintf(format, value)
}

func FormatFloat(value float64) string {
	precision := GetPrecision(value)
	if precision < 0 {
		precision = 0
	} else if precision > 10 {
		precision = 10
	}
	format := fmt.Sprintf("%%.%df", precision)
	return fmt.Sprintf(format, value)
}

func GetPrecision(value float64) int {
	str := strconv.FormatFloat(value, 'f', -1, 64)
	idx := strings.IndexByte(str, '.')
	if idx == -1 {
		return 0
	}
	return len(str) - idx - 1
}

func IsValidEmail(email string) bool {
	emailRegex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	re := regexp.MustCompile(emailRegex)

	return re.MatchString(email)
}

func IsValidPhoneNumber(phoneNumber string) bool {
	phoneRegex := `^\+\d{1,4}\d{6,14}$`
	re := regexp.MustCompile(phoneRegex)

	return re.MatchString("+" + phoneNumber)
}

func IsValidPassowrd(password string, c *gin.Context) bool {
	if len(password) > 36 || len(password) < 6 {
		utils.Method(c, "invalid password length")
		return false
	}
	if strings.Contains(password, ".") {
		utils.Method(c, "password not allowed to includes '.'")
		return false
	}
	return true
}

func UserExists(c *gin.Context, id primitive.ObjectID) bool {
	db, DBerr := utils.GetDB(c)
	if DBerr != nil {
		log.Println(DBerr)
		return false
	}
	var currentUser User
	err := db.Collection("users").
		FindOne(context.Background(), bson.M{
			"_id": id,
		}).Decode(&currentUser)
	return err == nil
}

func ValidateSession(c *gin.Context) (*User, bool) {
	session := sessions.Default(c)
	token := session.Get("token")
	tokenString := c.GetHeader("Authorization")
	tokenAdmins := session.Get("token_admins")
	tokenSupports := session.Get("token_supports")
	cookie_token, err := c.Request.Cookie("token")
	if token == nil && tokenString == "" && err != nil {
		log.Println(err)
		utils.Unauthorized(c)
		return nil, false
	}
	if tokenAdmins != "" {
		token = tokenAdmins
	}
	if token == "" && tokenSupports != "" {
		token = tokenSupports
	}
	if token == nil {
		token = tokenString
	}
	if token == "" {
		token = cookie_token.Value
	}
	jwtSecret := os.Getenv("SESSION_SECRET")
	if jwtSecret == "" {
		utils.Unauthorized(c)
		return nil, false
	}

	parsedToken, err := jwt.Parse(token.(string), func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil || !parsedToken.Valid {
		log.Println(err)
		utils.Unauthorized(c)
		return nil, false
	}

	if claims, ok := parsedToken.Claims.(jwt.MapClaims); ok {
		if claims["email"] == os.Getenv("ADMIN_USERNAME") {
			createdStr := claims["created_at"].(string)
			email := claims["email"].(string)
			createdAt, err := time.Parse(time.RFC3339, createdStr)
			if err != nil {
				log.Println(err)
				return nil, false
			}
			userID, ok := claims["_id"].(string)
			if !ok {
				return nil, false
			}
			if userID, err := primitive.ObjectIDFromHex(userID); err == nil {
				user := &User{
					ID:        userID,
					Email:     email,
					CreatedAt: createdAt,
				}

				exists := UserExists(c, userID)
				if !exists {
					session.Delete("token")
					err = session.Save()
					if err != nil {
						log.Println(err)
						return nil, false
					}
					return nil, false
				}
				return user, true
			}
			return nil, false
		}
		if claims["_id"] != nil {
			userID, ok := claims["_id"].(string)
			if !ok {
				return nil, false
			}

			if userID, err := primitive.ObjectIDFromHex(userID); err == nil {
				createdStr := claims["created_at"].(string)
				email := claims["email"].(string)
				createdAt, err := time.Parse(time.RFC3339, createdStr)
				if err != nil {
					log.Println(err)
					return nil, false
				}
				user := &User{
					ID:        userID,
					Email:     email,
					CreatedAt: createdAt,
				}

				exists := UserExists(c, userID)
				if !exists {
					session.Delete("token")
					err = session.Save()
					if err != nil {
						return nil, false
					}
					return nil, false
				}
				return user, true
			}
		}
		return nil, false
	}
	return nil, false
}

func ReceiveSession(c *gin.Context) *User {
	session := sessions.Default(c)
	token := session.Get("token")
	cookie_token, err := c.Request.Cookie("token")
	tokenString := c.GetHeader("Authorization")
	if token == nil && tokenString == "" && err != nil {
		return nil
	}
	if token == nil {
		token = tokenString
	}
	if token == "" {
		token = cookie_token.Value
	}
	jwtSecret := os.Getenv("SESSION_SECRET")
	if jwtSecret == "" {
		return nil
	}

	parsedToken, err := jwt.Parse(token.(string), func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil || !parsedToken.Valid {
		log.Println(err)
		return nil
	}

	if claims, ok := parsedToken.Claims.(jwt.MapClaims); ok && claims["_id"] != nil {
		userID, ok := claims["_id"].(string)
		if !ok {
			return nil
		}
		if userID, err := primitive.ObjectIDFromHex(userID); err == nil {
			createdStr := claims["created_at"].(string)
			email := claims["email"].(string)
			createdAt, errs := time.Parse(time.RFC3339, createdStr)
			if errs != nil {
				log.Println(errs)
				return nil
			}
			user := &User{
				ID:        userID,
				Email:     email,
				CreatedAt: createdAt,
			}

			return user
		}
		return nil
	}
	return nil
}

func (user *User) GenerateToken() (string, error) {
	claims := &Claims{
		ID:        user.ID.Hex(),
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24 * 30).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(os.Getenv("SESSION_SECRET")))
	if err != nil {
		log.Println(err)
		return "", err
	}

	return signedToken, nil
}

func (p ProvidedData) String() string {
	var sb strings.Builder

	sb.WriteString(fmt.Sprintf("Symbol: %s\n", p.Symbol))
	sb.WriteString(fmt.Sprintf("High: %s\n", FormatFloat(p.High)))
	sb.WriteString(fmt.Sprintf("Low: %s\n", FormatFloat(p.Low)))
	sb.WriteString(fmt.Sprintf("Close: %s\n", FormatFloat(p.Close)))
	sb.WriteString(fmt.Sprintf("Open: %s\n", FormatFloat(p.Open)))
	sb.WriteString(fmt.Sprintf("Trade Price: %s\n", FormatFloat(p.TradePrice)))
	sb.WriteString(fmt.Sprintf("Stop Limit: %s\n", FormatFloat(FormatFloatPrecisionFloat(p.StopLimit))))
	sb.WriteString(fmt.Sprintf("TP: %s\n", FormatFloat(FormatFloatPrecisionFloat(p.Tp))))
	sb.WriteString(fmt.Sprintf("Magic Number: %s\n", FormatFloat(p.MagicNumber)))
	sb.WriteString(fmt.Sprintf("Next Trade Price: %s\n", FormatFloat(p.NextTradePrice)))
	sb.WriteString(fmt.Sprintf("Next Trade Type: %s\n", p.NextTradeType))
	sb.WriteString(fmt.Sprintf("Trade Type: %s\n", p.TradeType))

	return sb.String()
}

func ComputeTradeData(c *gin.Context,
	generalData GeneralData,
	data Trade,
	firstCondition bool,
) (bool, *ProvidedData) {
	db, DBerr := utils.GetDB(c)
	if DBerr != nil {
		log.Println(DBerr)
		return false, nil
	}

	var runningTrades []Running
	cursor, err := db.Collection("running_trades").Find(context.Background(), bson.M{})
	if err != nil && err != mongo.ErrNoDocuments {
		utils.InternalError(c)
		return false, nil
	}
	err = cursor.All(context.Background(), &runningTrades)
	if err != nil {
		utils.InternalError(c)
		return false, nil
	}

	hasActive := false
	lastTrade := Running{}
	Rounds := 0
	for _, runningTrade := range runningTrades {
		if runningTrade.Active {
			hasActive = true
			lastTrade = runningTrade
			Rounds = lastTrade.Round
		}
	}

	if !generalData.SyncSymbols && hasActive {
		return false, nil
	}

	high, _ := strconv.ParseFloat(data.High, 64)
	low, _ := strconv.ParseFloat(data.Low, 64)
	close, _ := strconv.ParseFloat(data.Close, 64)
	open, _ := strconv.ParseFloat(data.Open, 64)

	diffPip, _ := strconv.ParseFloat(generalData.DiffPip, 64)
	if !CalculateDiff(close, open, high, close, low, diffPip) {
		return false, nil
	}

	TradePrice := 0.0
	StopLimit := 0.0
	Tp := 0.0
	MagicNumber := generalData.MagicNumber
	NextTypeTrade := "Buy Stop"
	NextTradePrice := 0.0
	TradeType := data.Condition
	if TradeType == "long" {
		Tp = formatFloat((high - low) + high)
		StopLimit = low - (CalculateIncrement(close) * generalData.StopLimit)
		StopLimit = formatFloat(StopLimit)
		NextTypeTrade = "Sell Stop"
		NextTradePrice = StopLimit
	} else if TradeType == "short" {
		Tp = formatFloat(low - (high - low))
		StopLimit = high + (CalculateIncrement(close) * generalData.StopLimit)
		StopLimit = formatFloat(StopLimit)
		NextTradePrice = StopLimit
	}

	if Rounds == 0 {
		if generalData.FirstTradeModeIsAmount {
			TradePrice = float64(generalData.FirstTrade)
		} else {
			// Get Balance : now assume 100$ Balance total
			TradePrice = (generalData.FirstTrade / 100) * 100
		}
	}

	ProvidedData := ProvidedData{
		High:           high,
		Close:          close,
		Open:           open,
		Low:            low,
		Tp:             Tp,
		NextTradePrice: NextTradePrice,
		NextTradeType:  NextTypeTrade,
		TradeType:      TradeType,
		MagicNumber:    MagicNumber,
		TradePrice:     TradePrice,
		StopLimit:      StopLimit,
		Symbol:         data.Symbol,
	}
	return true, &ProvidedData
}

// Rounds                         int                `bson:"rounds" json:"rounds"`
// CompensateRounds               int                `bson:"compensate_rounds" json:"compensate_rounds"`
// MakePositionWhenNotRoundClosed bool               `bson:"make_position_when_not_round_closed" json:"make_position_when_not_round_closed"`
// MaxTradesVolumn                float64            `bson:"max_trade_volumn" json:"max_trade_volumn"`
// MaxLossToCloseAll              float64            `bson:"max_loss_to_close_all" json:"max_loss_to_close_all"`
