package router

import (
	"interview-server/internal/handler"
	"interview-server/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// 路由分组，方便以后加版本号或权限校验
	// Public Routes
	v1 := r.Group("/api/v1")
	{
		v1.POST("/login", handler.Login)
		v1.POST("/cards", handler.GetCards)
		v1.POST("/card/detail", handler.GetCardDetail)
		v1.GET("/categories", handler.GetCategories)
		v1.GET("/tree", handler.GetStudioTree)
		v1.GET("/stats", handler.NewStatsHandler().GetHomeStats)
		v1.GET("/topics/:id/cards", handler.GetTopicCards)
	}

	// Protected Routes
	protected := r.Group("/api/v1")
	protected.Use(middleware.JWTAuth())
	{
		protected.POST("/category/add", middleware.AdminAuth(), handler.AddCategory)
		protected.POST("/review", handler.NewReviewHandler().ReviewCard)

		// --- Creator Studio API 创造者工作室路由 ---
		studio := protected.Group("/studio")
		studio.Use(middleware.AdminAuth())
		{
			studio.GET("/tree", handler.GetStudioTree)
			studio.POST("/categories", handler.CreateCategory)
			studio.POST("/topics", handler.CreateTopic)
			studio.POST("/cards", handler.CreateCard)
			studio.PUT("/cards/:id", handler.UpdateCard)
		}
	}

	return r
}
