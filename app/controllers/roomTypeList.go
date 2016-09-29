package controllers

import (
	"encoding/json"

	"github.com/astaxie/beego"

	"akgo/app/models"
)

type RoomTypeListController struct {
	beego.Controller
}

func (self *RoomTypeListController) Post() {
	resMap := make(map[string]interface{})

	var (
		rooms  []*models.RoomTypes
		errMsg string
		ob     interface{}
	)

	json.Unmarshal(self.Ctx.Input.RequestBody, &ob)
	user := models.User{
		Campus: ob.(map[string]interface{})["userCampus"].(string),
	}

	errMsg, rooms = user.GetRoomTypeList()
	if errMsg != "" {
		resMap["error"] = errMsg
	} else {
		resMap["data"] = rooms
	}
	self.Data["json"] = resMap
	self.ServeJSON()
}
