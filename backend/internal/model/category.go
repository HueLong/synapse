package model

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name        string  `gorm:"type:varchar(100);unique;not null;default:''" json:"name"`
	Description string  `gorm:"type:varchar(255);not null;default:''" json:"description"`
	Topics      []Topic `gorm:"foreignKey:CategoryID" json:"topics"`
	Cards       []Card  `gorm:"foreignKey:CategoryID" json:"cards"` // 支持直接挂载散装卡片
}
