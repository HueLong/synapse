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
		v1.POST("/questions", handler.GetQuestions)
		v1.POST("/question/detail", handler.GetQuestionDetail)
		v1.POST("/categories", handler.GetCategories)
		v1.GET("/stats", handler.NewStatsHandler().GetHomeStats)
		v1.GET("/topics/:id/questions", handler.GetTopicQuestions)
	}

	// Protected Routes
	protected := r.Group("/api/v1")
	protected.Use(middleware.JWTAuth())
	{
		protected.POST("/create-question", middleware.AdminAuth(), handler.CreateQuestion)
		protected.POST("/update-question", middleware.AdminAuth(), handler.UpdateQuestion)
		protected.POST("/category/add", middleware.AdminAuth(), handler.AddCategory)
		protected.POST("/review", handler.NewReviewHandler().ReviewQuestion)
	}

	return r
}
