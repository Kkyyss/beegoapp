package main

import (
	"os"

	"github.com/astaxie/beego"
	// "github.com/astaxie/beego/orm"

	"akgo/app/common"
	_ "akgo/app/routers"
)

func init() {
	// Start up logic
	common.StartUp()
}

func main() {
	// orm.Debug = true
	// Checking port
	port := os.Getenv("PORT")
	// For hosting purpose
	if port != "" {
		port = ":" + port
	}

	beego.Run(port)
}
