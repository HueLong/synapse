package model

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name        string `gorm:"type:varchar(100);unique;not null;default:''" json:"name"`
	Description string `gorm:"type:varchar(255);not null;default:''" json:"description"`
}
