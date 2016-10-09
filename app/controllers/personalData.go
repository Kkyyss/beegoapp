package controllers

import (
	"encoding/json"

	"github.com/astaxie/beego"

	"akgo/app/models"
)

type PersonalDataController struct {
	beego.Controller
}

func (self *PersonalDataController) Post() {
	resMap := make(map[string]interface{})

	var (
		errMsg string
		ob     interface{}
	)

	json.Unmarshal(self.Ctx.Input.RequestBody, &ob)

	userId := int(ob.(map[string]interface{})["userId"].(float64))
	user := models.User{
		Id: userId,
	}
	errMsg = user.GetUserById()
	if errMsg != "" {
		resMap["error"] = errMsg
	} else {
		resMap["data"] = user
	}
	self.Data["json"] = resMap
	self.ServeJSON()
}
