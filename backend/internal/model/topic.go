package model

import "gorm.io/gorm"

type Topic struct {
	gorm.Model
	Name        string     `gorm:"type:varchar(255);not null" json:"name"`
	Description string     `gorm:"type:text" json:"description"`
	CategoryID  uint       `gorm:"not null" json:"category_id"`
	Questions   []Question `gorm:"foreignKey:TopicID" json:"questions"`
}
