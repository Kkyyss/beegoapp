package controllers

import (
	"github.com/astaxie/beego"

	"akgo/app/models"
)

type BookedListController struct {
	beego.Controller
}

func (self *BookedListController) Post() {
	resMap := make(map[string]interface{})

	var (
		booked []*models.User
		errMsg string
	)

	errMsg, booked = models.GetBookedList()
	if errMsg != "" {
		resMap["error"] = errMsg
	} else {
		resMap["data"] = booked
	}
	self.Data["json"] = resMap
	self.ServeJSON()
}
