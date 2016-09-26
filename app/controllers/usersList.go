package controllers

import (
	"encoding/json"

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
		ob     interface{}
	)

	// roomId, _ := strconv.Atoi(self.GetString("jsoninfo"))
	json.Unmarshal(self.Ctx.Input.RequestBody, &ob)
	// userId, _ := strconv.Atoi(ob.(map[string]interface{})["userId"].(string))
	// isAdmin, _ := strconv.ParseBool(ob.(map[string]interface{})["isAdmin"].(string))
	user := models.User{
		// Id:      userId,
		Campus: ob.(map[string]interface{})["userCampus"].(string),
		// IsAdmin: isAdmin,
	}

	errMsg, users = user.GetUsersList()
	if errMsg != "" {
		resMap["error"] = errMsg
	} else {
		resMap["data"] = users
	}
	self.Data["json"] = resMap
	self.ServeJSON()
}
