package controllers

import (
	"encoding/json"
	"strconv"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type AdminBookedRoomController struct {
	beego.Controller
}

func (self *AdminBookedRoomController) Prepare() {
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

func (self *AdminBookedRoomController) Get() {
	self.Data["Title"] = "Booked Room -"
	directory := make(map[string]bool)
	directory["IsAdmin"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

func (self *AdminBookedRoomController) Delete() {
	var (
		errMsg string
		ob     interface{}
	)

	json.Unmarshal(self.Ctx.Input.RequestBody, &ob)

	bookedId, _ := strconv.Atoi(ob.(map[string]interface{})["bookedId"].(string))
	bookedRoomId, _ := strconv.Atoi(ob.(map[string]interface{})["bookedRoomId"].(string))

	booked := models.User{
		Id: bookedId,
	}

	err := booked.RemoveBooked(bookedRoomId)
	if err != nil {
		errMsg = "Cannot update Room id from User."
		beego.Debug(err)
	}

	self.Data["json"] = errMsg
	self.ServeJSON()
}
