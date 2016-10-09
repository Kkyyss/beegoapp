package controllers

import (
	"encoding/json"

	"github.com/astaxie/beego"

	"akgo/app/models"
)

type RoomStatusListController struct {
	beego.Controller
}

func (self *RoomStatusListController) Post() {
	resMap := make(map[string]interface{})

	var (
		rooms  []*models.RoomTypeResults
		errMsg string
		ob     interface{}
		gender string
	)

	json.Unmarshal(self.Ctx.Input.RequestBody, &ob)

	isAdmin := ob.(map[string]interface{})["userIsAdmin"].(bool)
	if !isAdmin {
		gender = ob.(map[string]interface{})["userGender"].(string)
	}
	campus := ob.(map[string]interface{})["userCampus"].(string)

	errMsg, rooms = models.GetRoomStatusList(isAdmin, campus, gender)
	if errMsg != "" {
		resMap["error"] = errMsg
	} else {
		resMap["data"] = rooms
	}
	self.Data["json"] = resMap
	self.ServeJSON()
}
