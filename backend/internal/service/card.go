package service

import (
	"interview-server/internal/dto"
	"interview-server/internal/model"
	"interview-server/internal/repository"
	"time"
)

type CardService struct {
	repo repository.CardRepository
}

func (s *CardService) CreateCard(c *model.Card) error {
	return s.repo.Create(c)
}

func (s *CardService) GetCards(categoryID uint, categoryName string, page, pageSize int, sortOrder string) ([]dto.CardListItem, int64, error) {
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 10
	}
	return s.repo.GetList(categoryID, categoryName, page, pageSize, sortOrder)
}

func (s *CardService) UpdateCard(c *model.Card) error {
	return s.repo.Update(c)
}

func (s *CardService) GetCardDetail(id uint) (*dto.CardDetail, error) {
	go func() {
		_ = s.repo.IncrementViews(id)
	}()
	return s.repo.GetDetail(id)
}

func (s *CardService) GetHomeStats() (*repository.HomeStats, error) {
	return s.repo.GetHomeStats()
}

func (s *CardService) ReviewCard(id uint, masteryLevel int) error {
	c, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	now := time.Now()
	incrementCount := true
	if c.LastReviewedAt != nil && now.Sub(*c.LastReviewedAt) < time.Minute {
		incrementCount = false
	}

	var nextReview time.Time
	switch masteryLevel {
	case 1:
		nextReview = now.Add(12 * time.Hour)
	case 2:
		nextReview = now.Add(3 * 24 * time.Hour)
	case 3:
		nextReview = now.Add(7 * 24 * time.Hour)
	default:
		nextReview = now.Add(24 * time.Hour)
	}

	return s.repo.UpdateReviewStats(id, masteryLevel, incrementCount, now, nextReview)
}
