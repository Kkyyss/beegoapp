package controllers

import (
	"github.com/astaxie/beego"

	"akgo/app/models"
)

type RoomListController struct {
	beego.Controller
}

func (self *RoomListController) Post() {
	resMap := make(map[string]interface{})

	var (
		rooms  []*models.Room
		errMsg string
	)

	errMsg, rooms = models.GetRoomList()
	if errMsg != "" {
		resMap["error"] = errMsg
	} else {
		resMap["data"] = rooms
	}
	self.Data["json"] = resMap
	self.ServeJSON()
}
