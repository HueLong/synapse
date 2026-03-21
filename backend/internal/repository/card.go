package repository

import (
	"interview-server/internal/db"
	"interview-server/internal/dto"
	"interview-server/internal/model"
	"time"

	"gorm.io/gorm"
)

type CardRepository struct{}

func (r *CardRepository) Create(c *model.Card) error {
	return db.DB.Create(c).Error
}

func (r *CardRepository) GetByID(id uint) (*model.Card, error) {
	var c model.Card
	err := db.DB.Preload("Category").First(&c, id).Error
	return &c, err
}

func (r *CardRepository) GetList(categoryID uint, categoryName string, page, pageSize int, sortOrder string) ([]dto.CardListItem, int64, error) {
	var cards []model.Card
	var dtos []dto.CardListItem
	var total int64

	query := db.DB.Model(&model.Card{})
	if categoryID > 0 {
		query = query.Where("category_id = ?", categoryID)
	}
	if categoryName != "" {
		query = query.Joins("Category").Where("Category.name = ?", categoryName)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	switch sortOrder {
	case "views":
		query = query.Order("views DESC")
	case "newest":
		query = query.Order("created_at DESC")
	case "smart":
		query = query.Order("next_review_at ASC")
	default:
		query = query.Order("id DESC")
	}

	offset := (page - 1) * pageSize
	err = query.Preload("Category").
		Select("id, title, card_type, category_id, difficulty, views, updated_at, next_review_at").
		Offset(offset).Limit(pageSize).Find(&cards).Error

	if err != nil {
		return nil, 0, err
	}

	for _, c := range cards {
		dtos = append(dtos, dto.CardListItem{
			ID:           c.ID,
			Title:        c.Title,
			CardType:     c.CardType,
			CategoryName: c.Category.Name,
			Difficulty:   c.Difficulty,
			Views:        c.Views,
			UpdatedAt:    c.UpdatedAt,
			NextReviewAt: c.NextReviewAt,
		})
	}

	return dtos, total, nil
}

func (r *CardRepository) GetDetail(id uint) (*dto.CardDetail, error) {
	var c model.Card
	err := db.DB.Preload("Category").First(&c, id).Error
	if err != nil {
		return nil, err
	}

	return &dto.CardDetail{
		ID:           c.ID,
		Title:        c.Title,
		CardType:     c.CardType,
		Content:      c.Content,
		Answer:       c.Answer,
		CategoryName: c.Category.Name,
		TopicID:      c.TopicID,
		Difficulty:   c.Difficulty,
		Views:        c.Views,
		CreatedAt:    c.CreatedAt,
		UpdatedAt:    c.UpdatedAt,
		ReviewCount:  c.ReviewCount,
		MasteryLevel: c.MasteryLevel,
	}, nil
}

func (r *CardRepository) Update(c *model.Card) error {
	return db.DB.Model(&model.Card{}).Where("id = ?", c.ID).Updates(c).Error
}

func (r *CardRepository) IncrementViews(id uint) error {
	return db.DB.Model(&model.Card{}).Where("id = ?", id).UpdateColumn("views", gorm.Expr("views + ?", 1)).Error
}

type HomeStats struct {
	Total    int64 `json:"total"`
	TodayNew int64 `json:"today_new"`
	Mastered int64 `json:"mastered"`
}

func (r *CardRepository) GetHomeStats() (*HomeStats, error) {
	var stats HomeStats
	var err error

	if err = db.DB.Model(&model.Card{}).Count(&stats.Total).Error; err != nil {
		return nil, err
	}

	startOfDay := time.Now().Truncate(24 * time.Hour)
	if err = db.DB.Model(&model.Card{}).Where("created_at >= ?", startOfDay).Count(&stats.TodayNew).Error; err != nil {
		return nil, err
	}

	if err = db.DB.Model(&model.Card{}).Where("mastery_level = ?", 3).Count(&stats.Mastered).Error; err != nil {
		return nil, err
	}

	return &stats, nil
}

func (r *CardRepository) UpdateReviewStats(id uint, mastery int, incrementCount bool, now time.Time, nextReviewAt time.Time) error {
	updates := map[string]interface{}{
		"mastery_level": mastery,
	}
	if incrementCount {
		updates["review_count"] = gorm.Expr("review_count + ?", 1)
		updates["last_reviewed_at"] = now
		updates["next_review_at"] = nextReviewAt
	}
	return db.DB.Model(&model.Card{}).Where("id = ?", id).Updates(updates).Error
}
