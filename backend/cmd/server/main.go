package main

import (
	"interview-server/internal/config"
	"interview-server/internal/db"
	"interview-server/internal/router"
)

func main() {
	config.Init()
	db.InitDB()

	r := router.SetupRouter()

	r.Run(config.Conf.App.Port)
}
