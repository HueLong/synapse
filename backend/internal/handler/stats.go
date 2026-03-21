package handler

import (
	"interview-server/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type StatsHandler struct {
	svc *service.CardService
}

func NewStatsHandler() *StatsHandler {
	return &StatsHandler{
		svc: &service.CardService{},
	}
}

func (h *StatsHandler) GetHomeStats(c *gin.Context) {
	stats, err := h.svc.GetHomeStats()
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"code": 500, "message": "获取统计失败", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "data": stats, "message": "success"})
}
