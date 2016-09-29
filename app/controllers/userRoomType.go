package controllers

import (
	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type AdminRoomTypeController struct {
	beego.Controller
}

func (self *AdminRoomTypeController) Prepare() {
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

func (self *AdminRoomTypeController) Get() {
	self.Data["Title"] = "Room Type Console -"
	directory := make(map[string]bool)
	directory["IsAdmin"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

func (self *AdminRoomTypeController) Post() {
	var errMsg string

	roomTypes := models.RoomTypes{
		Campus:       self.GetString("campus"),
		TypesOfRooms: self.GetString("types-of-rooms"),
	}

	err := roomTypes.Insert()
	if err != nil {
		beego.Debug(err)
		errMsg = "Ooops...something goes wrong when insert room types."
	}
	self.Data["json"] = errMsg
	self.ServeJSON()
}
