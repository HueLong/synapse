package handler

import (
	"interview-server/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

var cardService = &service.CardService{}

// GetCards 获取卡片列表（支持分页和分类过滤）
func GetCards(c *gin.Context) {
	var req struct {
		CategoryID   uint   `json:"category_id"`
		CategoryName string `json:"category_name"`
		Page         int    `json:"page"`
		PageSize     int    `json:"page_size"`
		Sort         string `json:"sort"` // smart, views, newest
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		// allow empty body
	}

	cards, total, err := cardService.GetCards(req.CategoryID, req.CategoryName, req.Page, req.PageSize, req.Sort)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "获取卡片列表失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "获取成功",
		"data": gin.H{
			"list":      cards,
			"total":     total,
			"page":      req.Page,
			"page_size": req.PageSize,
		},
	})
}

// GetCardDetail 获取卡片详情
func GetCardDetail(c *gin.Context) {
	var req struct {
		ID uint `json:"id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "参数错误"})
		return
	}

	card, err := cardService.GetCardDetail(req.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "获取详情失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "获取成功",
		"data":    card,
	})
}
