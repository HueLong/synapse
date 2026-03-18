package db

import (
	"fmt"
	"interview-server/internal/config"
	"interview-server/internal/model"
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	m := config.Conf.MySQL
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		m.User, m.Password, m.Host, m.Port, m.DBName)
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 自动迁移
	err = database.AutoMigrate(&model.Topic{}, &model.Question{}, &model.Category{}, &model.User{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// 初始化种子数据
	seedData(database)

	DB = database
	fmt.Println("Database initialized and migrated.")
}

func seedData(db *gorm.DB) {
	var count int64
	db.Model(&model.Category{}).Count(&count)
	if count == 0 {
		categories := []model.Category{
			{Name: "Go核心"},
			{Name: "Redis"},
			{Name: "MySQL"},
			{Name: "计算机网络"},
			{Name: "系统设计"},
		}
		if err := db.Create(&categories).Error; err != nil {
			log.Printf("Failed to seed categories: %v", err)
		} else {
			fmt.Println("Initial categories seeded.")
		}
	}

	// Seed Admin
	var userCount int64
	db.Model(&model.User{}).Count(&userCount)
	if userCount == 0 {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
		admin := model.User{
			Username: "admin",
			Password: string(hashedPassword),
			Role:     "admin",
		}
		if err := db.Create(&admin).Error; err != nil {
			log.Printf("Failed to seed admin: %v", err)
		} else {
			fmt.Println("Default admin account created (admin/123456)")
		}
	}
}
