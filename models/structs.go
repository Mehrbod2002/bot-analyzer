package models

import (
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Avatar           string             `bson:"avatar" json:"avatar"`
	FirstName        string             `bson:"first_name" json:"first_name"`
	LastName         string             `bson:"last_name" json:"last_name"`
	Email            string             `bson:"email" json:"email"`
	PhoneNumber      string             `bson:"phone" json:"phone"`
	Password         string             `bson:"password" json:"password"`
	PhoneVerified    bool               `bson:"phone_verified" json:"phone_verified"`
	OtpCode          *int               `bson:"otp_code" json:"otp_code"`
	ResetToken       string             `bson:"reset_token" json:"reset_token"`
	ResetTokenValid  time.Time          `bson:"reset_token_valid" json:"reset_token_valid"`
	ChangePhone      bool               `bson:"change_phone" json:"change_phone"`
	ExchangeMobile   string             `bson:"exchange_phone" json:"exchange_phone"`
	Freeze           bool               `bson:"freeze" json:"freeze"`
	Currency         string             `bson:"currency" json:"currency"`
	ChatList         []string           `bson:"chat_list" json:"chat_list"`
	Permissions      Permission         `bson:"permissions" json:"permissions"`
	OtpValid         time.Time          `bson:"otp_valid" json:"otp_valid"`
	ReTryOtp         int                `bson:"retry_otp" json:"retry_otp"`
	CreatedAt        time.Time          `bson:"created_at" json:"created_at"`
	UserVerified     bool               `bson:"user_verified" json:"user_verified"`
	Reason           string             `bson:"reason" json:"reason"`
	IsSupportOrAdmin bool               `bson:"support_or_admin" json:"support_or_admin"`
	FcmToken         string             `bson:"fcm_token" json:"fcm_token"`
	RefreshToken     string             `bson:"refresh_token" json:"-"`
}

type GeneralData struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
}

type Permission struct {
	Actions []Action `bson:"actions"`
}

type Socket struct {
	ResponseTo    User      `json:"user"`
	Trigger       string    `json:"trigger"`
	Validate      bool      `json:"validate"`
	Message       string    `json:"message"`
	Messages      []Message `json:"messages"`
	SingleMessage Message   `json:"single_message"`
}

type Client struct {
	Conn *websocket.Conn
	User *User
}

type NotificationAdmin struct {
	Type    string   `json:"notification"`
	Subject string   `json:"subject"`
	Message string   `json:"message"`
	Names   []string `json:"names"`
}

type Claims struct {
	ID          string    `json:"_id"`
	Name        string    `json:"name"`
	PhoneNumber string    `json:"phone"`
	Email       string    `json:"email"`
	CreatedAt   time.Time `json:"created_at"`
	jwt.StandardClaims
}

type Message struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Sender           primitive.ObjectID `json:"sender" bson:"sender"`
	Receiver         primitive.ObjectID `json:"receiver" bson:"receiver"`
	SenderUsername   string             `json:"sender_username" bson:"sender_username"`
	ReceiverUsername string             `json:"receiver_username" bson:"receiver_username"`
	Content          string             `json:"content" bson:"content"`
	Seen             bool               `json:"seen" bson:"seen"`
	MessageType      TypeMessage        `json:"message_type" bson:"message_type"`
	CreatedAt        time.Time          `json:"created_at" bson:"created_at"`
}

type UserMessage struct {
	ID          string      `json:"id"`
	Type        string      `json:"type"`
	Content     string      `json:"message"`
	TypeMessage TypeMessage `json:"message_type"`
}

type LoginDataStep1 struct {
	Phone string `json:"phone"`
}

type LoginDataStep2 struct {
	Phone string `json:"phone"`
	Otp   *int   `json:"otp"`
}

type SendOTP struct {
	PhoneNumber string `json:"phone" binding:"required"`
}

type RegisterRequest struct {
	PhoneNumber string `json:"phone" binding:"required"`
	OtpCode     *int   `json:"otp_code" binding:"required"`
}
