package repository

import (
	"interview-server/internal/db"
	"interview-server/internal/dto"
	"interview-server/internal/model"
	"time"

	"gorm.io/gorm"
)

type QuestionRepository struct{}

func (r *QuestionRepository) Create(q *model.Question) error {
	return db.DB.Create(q).Error
}

func (r *QuestionRepository) GetByID(id uint) (*model.Question, error) {
	var q model.Question
	err := db.DB.Preload("Category").First(&q, id).Error
	return &q, err
}

func (r *QuestionRepository) GetList(categoryID uint, categoryName string, page, pageSize int, sortOrder string) ([]dto.QuestionListItem, int64, error) {
	var questions []model.Question
	var dtos []dto.QuestionListItem
	var total int64

	query := db.DB.Model(&model.Question{})
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

	// Sorting Logic
	switch sortOrder {
	case "views":
		query = query.Order("views DESC")
	case "newest":
		query = query.Order("created_at DESC")
	case "smart":
		// Smart Review: Prioritize Null (Never reviewed) -> Overdue (Smallest NextReviewAt) -> Future
		// Using NextReviewAt ASC.
		// If NextReviewAt is NULL, it will come FIRST in standard SQL "ASC" if NULLS FIRST (or depends on DB).
		// In GORM/MySQL, NULLs usually come first in ASC.
		// Let's assume standard behavior: we want Overdue (Past) first.
		query = query.Order("next_review_at ASC")
	default:
		query = query.Order("id DESC")
	}

	offset := (page - 1) * pageSize
	err = query.Preload("Category").
		Select("id, title, category_id, difficulty, views, updated_at, next_review_at").
		Offset(offset).Limit(pageSize).Find(&questions).Error

	if err != nil {
		return nil, 0, err
	}

	// Convert to DTO
	for _, q := range questions {
		dtos = append(dtos, dto.QuestionListItem{
			ID:           q.ID,
			Title:        q.Title,
			CategoryName: q.Category.Name,
			Difficulty:   q.Difficulty,
			Views:        q.Views,
			UpdatedAt:    q.UpdatedAt,
			NextReviewAt: q.NextReviewAt,
		})
	}

	return dtos, total, nil
}

func (r *QuestionRepository) GetDetail(id uint) (*dto.QuestionDetail, error) {
	var q model.Question
	err := db.DB.Preload("Category").First(&q, id).Error
	if err != nil {
		return nil, err
	}

	return &dto.QuestionDetail{
		ID:           q.ID,
		Title:        q.Title,
		Content:      q.Content,
		Answer:       q.Answer,
		CategoryName: q.Category.Name,
		Difficulty:   q.Difficulty,
		Views:        q.Views,
		CreatedAt:    q.CreatedAt,
		UpdatedAt:    q.UpdatedAt,
		ReviewCount:  q.ReviewCount,
		MasteryLevel: q.MasteryLevel,
	}, nil
}

func (r *QuestionRepository) Update(q *model.Question) error {
	return db.DB.Model(&model.Question{}).Where("id = ?", q.ID).Updates(q).Error
}

func (r *QuestionRepository) IncrementViews(id uint) error {
	return db.DB.Model(&model.Question{}).Where("id = ?", id).UpdateColumn("views", gorm.Expr("views + ?", 1)).Error
}

type HomeStats struct {
	Total    int64 `json:"total"`
	TodayNew int64 `json:"today_new"`
	Mastered int64 `json:"mastered"`
}

func (r *QuestionRepository) GetHomeStats() (*HomeStats, error) {
	var stats HomeStats
	var err error

	// Total
	if err = db.DB.Model(&model.Question{}).Count(&stats.Total).Error; err != nil {
		return nil, err
	}

	// Today New
	startOfDay := time.Now().Truncate(24 * time.Hour)
	if err = db.DB.Model(&model.Question{}).Where("created_at >= ?", startOfDay).Count(&stats.TodayNew).Error; err != nil {
		return nil, err
	}

	// Mastered (Level 3)
	if err = db.DB.Model(&model.Question{}).Where("mastery_level = ?", 3).Count(&stats.Mastered).Error; err != nil {
		return nil, err
	}

	return &stats, nil
}

func (r *QuestionRepository) UpdateReviewStats(id uint, mastery int, incrementCount bool, now time.Time, nextReviewAt time.Time) error {
	updates := map[string]interface{}{
		"mastery_level": mastery,
	}
	if incrementCount {
		updates["review_count"] = gorm.Expr("review_count + ?", 1)
		updates["last_reviewed_at"] = now
		updates["next_review_at"] = nextReviewAt
	}
	return db.DB.Model(&model.Question{}).Where("id = ?", id).Updates(updates).Error
}
