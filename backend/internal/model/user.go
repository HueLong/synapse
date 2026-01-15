package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string `gorm:"uniqueIndex;size:191;not null" json:"username"`
	Password string `gorm:"not null" json:"-"`          // Don't return password in JSON
	Role     string `gorm:"default:'user'" json:"role"` // admin, user
}
