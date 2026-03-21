package handler

import (
	"interview-server/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ReviewHandler struct {
	svc *service.CardService
}

func NewReviewHandler() *ReviewHandler {
	return &ReviewHandler{
		svc: &service.CardService{},
	}
}

type ReviewRequest struct {
	ID           uint `json:"id" binding:"required"`
	MasteryLevel int  `json:"mastery_level" binding:"required"`
}

func (h *ReviewHandler) ReviewCard(c *gin.Context) {
	var req ReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusOK, gin.H{"code": 400, "message": "参数错误", "error": err.Error()})
		return
	}

	if err := h.svc.ReviewCard(req.ID, req.MasteryLevel); err != nil {
		c.JSON(http.StatusOK, gin.H{"code": 500, "message": "复习打卡失败", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "复习打卡成功"})
}
