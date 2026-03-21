package dto

import "time"

// CardListItem 列表项DTO
type CardListItem struct {
	ID           uint       `json:"id"`
	Title        string     `json:"title"`
	CardType     string     `json:"card_type"`
	CategoryName string     `json:"category"`
	Difficulty   int8       `json:"difficulty"`
	Views        int        `json:"views"`
	UpdatedAt    time.Time  `json:"updated_at"`
	NextReviewAt *time.Time `json:"next_review_at"`
}

// CardDetail 详情DTO
type CardDetail struct {
	ID           uint      `json:"id"`
	Title        string    `json:"title"`
	CardType     string    `json:"card_type"`
	Content      string    `json:"content"`
	Answer       string    `json:"answer"`
	TopicID      *uint     `json:"topic_id"`
	CategoryName string    `json:"category"`
	Difficulty   int8      `json:"difficulty"`
	Views        int       `json:"views"`
	ReviewCount  int       `json:"review_count"`
	MasteryLevel int       `json:"mastery_level"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
