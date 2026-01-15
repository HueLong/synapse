package handler

import (
	"interview-server/internal/model"
	"interview-server/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

var categoryService = &service.CategoryService{}

func GetCategories(c *gin.Context) {
	categories, err := categoryService.GetCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取分类失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "获取成功",
		"data":    categories,
	})
}

// AddCategory 处理添加分类请求
func AddCategory(c *gin.Context) {
	var category model.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "参数错误: " + err.Error()})
		return
	}

	if err := categoryService.AddCategory(&category); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "添加分类失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "分类已添加",
		"data":    category,
	})
}
