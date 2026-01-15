package dto

import "time"

// QuestionListItem 列表项DTO，不包含内容和答案
type QuestionListItem struct {
	ID           uint       `json:"id"`
	Title        string     `json:"title"`
	CategoryName string     `json:"category"`
	Difficulty   int8       `json:"difficulty"`
	Views        int        `json:"views"`
	UpdatedAt    time.Time  `json:"updated_at"`
	NextReviewAt *time.Time `json:"next_review_at"`
}

// QuestionDetail 详情DTO，包含所有信息
type QuestionDetail struct {
	ID           uint      `json:"id"`
	Title        string    `json:"title"`
	Content      string    `json:"content"`
	Answer       string    `json:"answer"`
	CategoryName string    `json:"category"`
	Difficulty   int8      `json:"difficulty"`
	Views        int       `json:"views"`
	ReviewCount  int       `json:"review_count"`
	MasteryLevel int       `json:"mastery_level"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
