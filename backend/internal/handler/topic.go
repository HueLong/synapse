package handler

import (
	"interview-server/internal/db"
	"interview-server/internal/model"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetTopicCards 根据题单ID获取该题单下的所有卡片，按 Sequence 升序，然后难度升序
func GetTopicCards(c *gin.Context) {
	idStr := c.Param("id")
	topicID, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "无效的Topic ID"})
		return
	}

	var topic model.Topic
	if err := db.DB.First(&topic, topicID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "题单不存在"})
		return
	}

	var cards []model.Card
	err = db.DB.Preload("Category").
		Where("topic_id = ?", topicID).
		Order("sequence asc, difficulty asc").
		Find(&cards).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "查询卡片失败", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "获取成功",
		"data": gin.H{
			"topic": topic,
			"cards": cards,
		},
	})
}
