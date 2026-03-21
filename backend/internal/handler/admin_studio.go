package handler

import (
	"interview-server/internal/db"
	"interview-server/internal/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

// === 1. 结构树聚合接口 ===
// GET /api/v1/studio/tree
func GetStudioTree(c *gin.Context) {
	var categories []model.Category

	// 使用 GORM Preload 极简加载：
	// 1. Topics.Cards 加载带有路线图的卡片
	// 2. Cards (带有 condition) 加载散装卡片
	if err := db.DB.Preload("Topics.Cards").
		Preload("Cards", "topic_id IS NULL").
		Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取架构树失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "data": categories})
}

// === 2. 节点创建接口 ===

type CreateCategoryReq struct {
	Name string `json:"name" binding:"required"`
}

// POST /api/v1/categories
func CreateCategory(c *gin.Context) {
	var req CreateCategoryReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "入参校验失败: " + err.Error()})
		return
	}

	category := model.Category{Name: req.Name}
	if err := db.DB.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建大类失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "data": category})
}

type CreateTopicReq struct {
	Name       string `json:"name" binding:"required"`
	CategoryID uint   `json:"category_id" binding:"required"`
}

// POST /api/v1/topics
func CreateTopic(c *gin.Context) {
	var req CreateTopicReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "入参校验失败: " + err.Error()})
		return
	}

	topic := model.Topic{Name: req.Name, CategoryID: req.CategoryID}
	if err := db.DB.Create(&topic).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建路线图失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "data": topic})
}

type CreateCardReq struct {
	Title      string `json:"title" binding:"required"`
	CardType   string `json:"card_type" binding:"required,oneof=concept qa algo"`
	CategoryID uint   `json:"category_id" binding:"required"`
	TopicID    *uint  `json:"topic_id"` // 可选指针，为 nil 就是散装卡片
}

// POST /api/v1/cards
func CreateCard(c *gin.Context) {
	var req CreateCardReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "入参校验失败: " + err.Error()})
		return
	}

	card := model.Card{
		Title:      req.Title,
		CardType:   req.CardType,
		CategoryID: req.CategoryID,
		TopicID:    req.TopicID,
	}
	if err := db.DB.Create(&card).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建卡片失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "data": card})
}

// === 3. 卡片更新接口 ===

type UpdateCardReq struct {
	Title      *string `json:"title"`
	CardType   *string `json:"card_type" binding:"omitempty,oneof=concept qa algo"`
	Content    *string `json:"content"`
	Answer     *string `json:"answer"`
	Difficulty *int8   `json:"difficulty" binding:"omitempty,oneof=1 2 3"`
}

// PUT /api/v1/cards/:id
func UpdateCard(c *gin.Context) {
	id := c.Param("id")
	var req UpdateCardReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "入参校验失败: " + err.Error()})
		return
	}

	var card model.Card
	if err := db.DB.First(&card, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "要更新的卡片不存在"})
		return
	}

	// 动态构建更新字段，防止覆盖已有其他数据
	updates := map[string]interface{}{}
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.CardType != nil {
		updates["card_type"] = *req.CardType
	}
	if req.Content != nil {
		updates["content"] = *req.Content
	}
	if req.Answer != nil {
		updates["answer"] = *req.Answer
	}
	if req.Difficulty != nil {
		updates["difficulty"] = *req.Difficulty
	}

	if len(updates) > 0 {
		if err := db.DB.Model(&card).Updates(updates).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "更新卡片数据失败"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "卡片保存成功"})
}
