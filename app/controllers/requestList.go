package controllers

import (
	"github.com/astaxie/beego"

	"akgo/app/models"
)

type RequestListController struct {
	beego.Controller
}

func (self *RequestListController) Post() {
	resMap := make(map[string]interface{})

	var (
		requests []*models.Request
		errMsg   string
	)

	errMsg, requests = models.GetRequestList()
	if errMsg != "" {
		resMap["error"] = errMsg
	} else {
		resMap["data"] = requests
	}
	self.Data["json"] = resMap
	self.ServeJSON()
}
