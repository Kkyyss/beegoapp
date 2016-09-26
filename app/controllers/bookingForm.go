package controllers

import (
	"strconv"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type BookingFormController struct {
	beego.Controller
}

func (self *BookingFormController) Prepare() {
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
	self.Ctx.Output.Header("IsForm", "TRUE")
	self.Ctx.Output.Header("User", userInfo)
}

func (self *BookingFormController) Get() {
	self.Data["Title"] = "IU Form -"
	directory := make(map[string]bool)
	directory["IsUser"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

func (self *BookingFormController) Post() {
	var (
		errMsg  string
		request models.Request
		room    models.Room
		user    models.User
		err     error
		userId  int
	)

	room = models.Room{
		Campus:       self.GetString("campus"),
		TypesOfRooms: self.GetString("types-of-rooms"),
	}

	errMsg = room.Available()
	if errMsg != "" {
		goto Response
	}

	userId, _ = strconv.Atoi(self.GetString("form-user-id"))
	beego.Debug(userId)
	user = models.User{
		Id: userId,
	}

	errMsg = user.GetRequestStatus()
	if errMsg != "" {
		goto Response
	}

	errMsg = user.GetUserById()

	if errMsg != "" {
		goto Response
	}

	request = models.Request{
		Campus:       self.GetString("campus"),
		SessionMonth: self.GetString("session-month"),
		SessionYear:  self.GetString("session-year"),
		TypesOfRooms: self.GetString("types-of-rooms"),
		Status:       "Processing",
		User:         &user,
	}
	beego.Debug(request)
	err = request.InsertRequest()
	if err != nil {
		errMsg = "Oopss...Something goes wrong when insert request."
		beego.Debug(err)
	}

Response:
	self.Data["json"] = errMsg
	self.ServeJSON()
}
