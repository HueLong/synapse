package handler

import (
	"interview-server/internal/model"
	"interview-server/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

var questionService = &service.QuestionService{}

// CreateQuestion 处理创建面试题请求
func CreateQuestion(c *gin.Context) {
	var q model.Question
	if err := c.ShouldBindJSON(&q); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := questionService.CreateQuestion(&q); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "题目已保存",
		"data":    q,
	})
}

// UpdateQuestion 处理更新面试题请求
func UpdateQuestion(c *gin.Context) {
	var q model.Question
	if err := c.ShouldBindJSON(&q); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "参数错误: " + err.Error()})
		return
	}

	if q.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "ID不能为空"})
		return
	}

	if err := questionService.UpdateQuestion(&q); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "更新失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "题目已更新",
		"data":    q,
	})
}

// GetQuestions 获取题目列表（支持分页和分类过滤）
// GetQuestions 获取题目列表（支持分页和分类过滤）
func GetQuestions(c *gin.Context) {
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

	questions, total, err := questionService.GetQuestions(req.CategoryID, req.CategoryName, req.Page, req.PageSize, req.Sort)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "获取题目列表失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "获取成功",
		"data": gin.H{
			"list":      questions,
			"total":     total,
			"page":      req.Page,
			"page_size": req.PageSize,
		},
	})
}

// GetQuestionDetail 获取题目详情
func GetQuestionDetail(c *gin.Context) {
	var req struct {
		ID uint `json:"id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "参数错误"})
		return
	}

	q, err := questionService.GetQuestionDetail(req.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "获取详情失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "获取成功",
		"data":    q,
	})
}
