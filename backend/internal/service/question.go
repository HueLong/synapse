package service

import (
	"interview-server/internal/dto"
	"interview-server/internal/model"
	"interview-server/internal/repository"
	"time"
)

type QuestionService struct {
	repo repository.QuestionRepository
}

func (s *QuestionService) CreateQuestion(q *model.Question) error {
	// 这里可以添加业务逻辑，比如校验分类是否存在等
	return s.repo.Create(q)
}

func (s *QuestionService) GetQuestions(categoryID uint, categoryName string, page, pageSize int, sortOrder string) ([]dto.QuestionListItem, int64, error) {
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}
	return s.repo.GetList(categoryID, categoryName, page, pageSize, sortOrder)
}

func (s *QuestionService) UpdateQuestion(q *model.Question) error {
	return s.repo.Update(q)
}

func (s *QuestionService) GetQuestionDetail(id uint) (*dto.QuestionDetail, error) {
	// Async increment views
	go func() {
		_ = s.repo.IncrementViews(id)
	}()
	return s.repo.GetDetail(id)
}

func (s *QuestionService) GetHomeStats() (*repository.HomeStats, error) {
	return s.repo.GetHomeStats()
}

func (s *QuestionService) ReviewQuestion(id uint, masteryLevel int) error {
	// 1. Get current question to check LastReviewedAt
	q, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	// 2. Cooldown check (1 minute)
	now := time.Now()
	incrementCount := true
	if q.LastReviewedAt != nil && now.Sub(*q.LastReviewedAt) < time.Minute {
		incrementCount = false
	}

	// 3. Update
	// 3. Calculate NextReviewAt
	var nextReview time.Time
	switch masteryLevel {
	case 1: // Forgot
		nextReview = now.Add(12 * time.Hour)
	case 2: // Vague
		nextReview = now.Add(3 * 24 * time.Hour)
	case 3: // Mastered
		nextReview = now.Add(7 * 24 * time.Hour)
	default:
		nextReview = now.Add(24 * time.Hour) // Fallback
	}

	// 4. Update
	return s.repo.UpdateReviewStats(id, masteryLevel, incrementCount, now, nextReview)
}
