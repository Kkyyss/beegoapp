package controllers

import (
	"github.com/astaxie/beego"

	"akgo/app/models"
)

type UsersListController struct {
	beego.Controller
}

func (self *UsersListController) Post() {
	resMap := make(map[string]interface{})

	var (
		users  []*models.User
		errMsg string
	)

	errMsg, users = models.GetUsersList()
	if errMsg != "" {
		resMap["error"] = errMsg
	} else {
		resMap["data"] = users
	}
	self.Data["json"] = resMap
	self.ServeJSON()
}
