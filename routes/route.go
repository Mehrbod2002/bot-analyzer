package routes

import (
	adminAuth "bot/app/controllers/admin"
	adminSetter "bot/app/controllers/admin/setter"
	adminView "bot/app/controllers/admin/views"
	"bot/utils"

	"bot/models"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var (
	OnlineClients = make(map[*websocket.Conn]*models.Client)
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.MaxMultipartMemory = 8 << 20

	store := cookie.NewStore([]byte("session-secret"))
	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   int(time.Hour) * 365 * 24,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Secure:   true,
	})

	r.Use(sessions.Sessions("token", store))
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://0.0.0.0:3001", "http://ali-asgari.com", "https://ali-asgari.com", "http://localhost:3001", "http://127.0.0.1:5173", "https://admin.goldshop24.co", "https://goldshop24.co", "https://server.goldshop24.co"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "HEAD", "DELETE"},
		AllowHeaders:     []string{"Origin", "Set-Cookie", "Cookie", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length", "Set-Cookie", "Cookie"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://0.0.0.0:3001" || origin == "http://localhost:3001" ||
				origin == "http://127.0.0.1:5173" || origin == "https://goldshop24.co"
		},
	}))

	apis := r.Group("/api")
	apis.POST("/trade_data", adminSetter.TradeData)
	authRoutes := apis.Group("/auth")
	{
		authRoutes.POST("/admin/login", adminAuth.AdminLogin)
	}

	adminRoutes := apis.Group("/admin")
	adminRoutes.Use(utils.AdminAuthMiddleware())
	{
		adminRoutes.POST("/metric", adminView.ViewMetric)
		adminRoutes.GET("/get_users", adminView.ViewAllUsers)
		adminRoutes.POST("/delete_user", adminSetter.SetDeleteUser)
		adminRoutes.POST("/logout", adminAuth.AdminLogout)
		adminRoutes.POST("/freeze_user", adminSetter.SetFreezeUser)
		adminRoutes.POST("/unfreeze_user", adminSetter.SetUnFreezeUser)
		adminRoutes.POST("/set_user_permissions", adminSetter.SetUserPermissions)
		adminRoutes.POST("/get_users", adminView.ViewAllUsers)
		adminRoutes.GET("/get_general_data", adminView.ViewGeneralData)
		adminRoutes.POST("/get_user", adminView.ViewUser)
	}

	return r
}
