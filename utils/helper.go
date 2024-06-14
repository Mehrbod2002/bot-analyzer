package utils

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func BadBinding(c *gin.Context) {
	c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
		"success": false,
		"message": Cap("invalid request parameters"),
		"data":    "invalid_parameters",
	})
}

func Unauthorized(c *gin.Context) {
	c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
		"success": false,
		"message": Cap("unauthorized"),
		"data":    "unauthorized",
	})
}

func InternalErrorMsg(c *gin.Context, message string) {
	c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
		"success": false,
		"message": Cap(message),
		"data":    "internal_error",
	})
}

func InternalError(c *gin.Context) {
	c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
		"success": false,
		"message": Cap("internal server connection"),
		"data":    "internal_error",
	})
}

func AdminError(c *gin.Context) {
	c.AbortWithStatusJSON(http.StatusNotAcceptable, gin.H{
		"success": false,
		"message": Cap("Currenctly we don't get new payments"),
		"data":    "internal_error",
	})
}

func Method(c *gin.Context, message string) {
	c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
		"success": false,
		"message": Cap(message),
		"data":    "invalid_parameters",
	})
}

func Cap(s string) string {
	if len(s) == 0 {
		return s
	}

	firstLetter := string(s[0])
	firstLetter = strings.ToUpper(firstLetter)

	return firstLetter + s[1:]
}

func ValidateID(Id string, c *gin.Context) (primitive.ObjectID, bool) {
	userID, err := primitive.ObjectIDFromHex(Id)
	if err != nil {
		BadBinding(c)
		return primitive.ObjectID{}, false
	}
	return userID, true
}

func ValidateAdmin(token string) bool {
	jwtSecret := os.Getenv("SESSION_SECRET")
	if jwtSecret == "" {
		return false
	}

	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil || !parsedToken.Valid {
		return false
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)

	if ok && claims["_id"] != nil {
		userID, ok := claims["_id"].(string)
		if !ok {
			return false
		}
		if _, err := primitive.ObjectIDFromHex(userID); err == nil {
			return true
		}
		return false
	}

	return false
}

func AdminAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		token := session.Get("token_admins")
		tokenString := c.GetHeader("Authorization")

		if token == nil && tokenString == "" {
			Unauthorized(c)
			c.Abort()
			return
		}

		if token == nil {
			token = session.Get("token_supports")
			if token == nil {
				token = tokenString
			}
		}

		jwtSecret := os.Getenv("SESSION_SECRET")
		if jwtSecret == "" {
			Unauthorized(c)
			c.Abort()
			return
		}

		parsedToken, err := jwt.Parse(token.(string), func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		})

		if err != nil || !parsedToken.Valid {
			log.Println(err)
			Unauthorized(c)
			c.Abort()
			return
		}

		if claims, ok := parsedToken.Claims.(jwt.MapClaims); ok {
			if claims["email"] == os.Getenv("ADMIN_USERNAME") {
				c.Next()
				return
			}
		}

		c.Abort()
	}
}
