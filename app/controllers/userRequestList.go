package controllers

import (
	"encoding/json"
	// "strconv"

	"github.com/astaxie/beego"

	"akgo/app/models"
)

type UserRequestListController struct {
	beego.Controller
}

func (self *UserRequestListController) Post() {
	resMap := make(map[string]interface{})

	var (
		requests []*models.Request
		errMsg   string
		ob       interface{}
	)

	// roomId, _ := strconv.Atoi(self.GetString("jsoninfo"))
	json.Unmarshal(self.Ctx.Input.RequestBody, &ob)
	beego.Debug(ob.(map[string]interface{})["userId"].(float64))
	userId := int(ob.(map[string]interface{})["userId"].(float64))
	// isAdmin, _ := strconv.ParseBool(ob.(map[string]interface{})["isAdmin"].(string))
	user := models.User{
		Id: userId,
		// Campus: ob.(map[string]interface{})["userCampus"].(string),
		// IsAdmin: isAdmin,
	}

	errMsg, requests = user.GetUserRequestList()
	if errMsg != "" {
		resMap["error"] = errMsg
	} else {
		resMap["data"] = requests
	}
	self.Data["json"] = resMap
	self.ServeJSON()
}
