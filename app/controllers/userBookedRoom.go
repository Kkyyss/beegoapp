package controllers

import (
	"encoding/json"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type UserBookedRoomController struct {
	beego.Controller
}

func (self *UserBookedRoomController) Prepare() {
	var (
		errType  string
		userInfo string
	)

	v, _ := self.Ctx.GetSecureCookie(beego.AppConfig.String("COOKIE_SECRET"), "_AUTH")

	switch v {
	case "": // Haven't logged in
		self.Redirect("/", 301)
		return
	default: // Logged in, checking the Jwt token
		userInfo, errType = common.Authorize(v)

		switch errType {
		case "EXPIRED":
			self.Redirect("/login_register", 301)
			return
		case "ERROR":
			// Internal server error
			self.Abort("500")
		case "INVALID":
			// Unauthorized
			self.Abort("401")
		}
	}
	self.Ctx.Output.Header("IsUser", "TRUE")
	self.Ctx.Output.Header("User", userInfo)
}

func (self *UserBookedRoomController) Get() {
	self.Data["Title"] = "User Booked Room -"
	directory := make(map[string]bool)
	directory["IsAdmin"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

func (self *UserBookedRoomController) Post() {
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

	errMsg, roommates := user.GetBookedRoom()
	if errMsg != "" {
		resMap["error"] = errMsg
	} else {
		resMap["data"] = user
		if roommates.Id != 0 {
			resMap["roommate"] = roommates
		}
	}
	self.Data["json"] = resMap
	self.ServeJSON()
}
