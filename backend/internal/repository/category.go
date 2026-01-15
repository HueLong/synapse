package repository

import (
	"interview-server/internal/db"
	"interview-server/internal/model"
)

type CategoryRepository struct{}

func (r *CategoryRepository) List() ([]model.Category, error) {
	var categories []model.Category
	err := db.DB.Find(&categories).Error
	return categories, err
}

func (r *CategoryRepository) Create(c *model.Category) error {
	return db.DB.Create(c).Error
}
