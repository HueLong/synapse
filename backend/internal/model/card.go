package model

import (
	"time"

	"gorm.io/gorm"
)

type Card struct {
	gorm.Model
	Title          string     `gorm:"type:varchar(255);not null;default:''" json:"title"`
	CardType       string     `gorm:"type:enum('concept','qa','algo');not null;default:'concept'" json:"card_type"`
	Content        string     `gorm:"type:text;not null" json:"content"` // Markdown内容 (Concept正文或Algo题干或QA提问)
	Answer         string     `gorm:"type:text;not null" json:"answer"`  // 答案 Markdown (主要供QA使用)
	Category       Category   `gorm:"foreignKey:CategoryID" json:"category"`
	CategoryID     uint       `gorm:"not null;default:0" json:"category_id"`
	Topic          *Topic     `gorm:"foreignKey:TopicID" json:"topic,omitempty"`
	TopicID        *uint      `gorm:"index;default:null" json:"topic_id"`                // 可以为NULL，支持独立散装卡片
	Sequence       int        `gorm:"not null;default:0" json:"sequence"`                // 题目在题单中的建议顺序
	Difficulty     int8       `gorm:"type:tinyint;not null;default:1" json:"difficulty"` // 1-简单 2-中等 3-困难
	Status         int8       `gorm:"type:tinyint;not null;default:1" json:"status"`     // 1-正常 2-禁用
	Views          int        `gorm:"not null;default:0" json:"views"`                   // 阅读量
	MasteryLevel   int        `gorm:"type:int;not null;default:0" json:"mastery_level"`  // 掌握程度 0-3
	ReviewCount    int        `gorm:"type:int;not null;default:0" json:"review_count"`   // 复习次数
	LastReviewedAt *time.Time `gorm:"default:null" json:"last_reviewed_at"`              // 上次复习时间
	NextReviewAt   *time.Time `gorm:"default:null" json:"next_review_at"`                // 下次复习时间
}
