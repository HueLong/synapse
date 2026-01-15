package service

import (
	"interview-server/internal/model"
	"interview-server/internal/repository"
)

type CategoryService struct {
	repo repository.CategoryRepository
}

func (s *CategoryService) GetCategories() ([]model.Category, error) {
	return s.repo.List()
}

func (s *CategoryService) AddCategory(c *model.Category) error {
	return s.repo.Create(c)
}
