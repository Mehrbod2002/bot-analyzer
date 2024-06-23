package routes

import (
	adminAuth "bot/app/controllers/admin"
	adminSetter "bot/app/controllers/admin/setter"
	adminView "bot/app/controllers/admin/views"
	"bot/utils"

	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
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
		AllowOrigins: []string{
			"http://0.0.0.0:3001",
			"http://localhost:3001",
			"http://127.0.0.1:5173",
			"https://bot.londonfinancial.com",
		},
		AllowMethods: []string{"PUT", "PATCH", "GET", "POST", "HEAD", "DELETE"},
		AllowHeaders: []string{
			"Origin", "Set-Cookie",
			"Cookie", "Authorization",
			"Content-Type"},
		ExposeHeaders:    []string{"Content-Length", "Set-Cookie", "Cookie"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://0.0.0.0:3001" ||
				origin == "http://localhost:3001" ||
				origin == "http://127.0.0.1:5173" ||
				origin == "https://bot.londonfinancial.com"

		},
	}))

	apis := r.Group("/bot")
	apis.POST("/trade_data", adminSetter.TradeData)
	authRoutes := apis.Group("/auth")
	{
		authRoutes.POST("/admin/login", adminAuth.AdminLogin)
	}

	adminRoutes := apis.Group("/admin")
	adminRoutes.Use(utils.AdminAuthMiddleware())
	{
		adminRoutes.POST("/logout", adminAuth.AdminLogout)
		adminRoutes.POST("/set_general", adminSetter.SetSetting)
		adminRoutes.GET("/get_general_data", adminView.ViewGeneralData)
	}

	return r
}
