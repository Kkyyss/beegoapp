package controllers

import (
	"strconv"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type ForgotPasswordController struct {
	beego.Controller
}

func (self *ForgotPasswordController) Prepare() {
	var (
		errType string
	)
	v, _ := self.Ctx.GetSecureCookie(
		beego.AppConfig.String("COOKIE_SECRET"),
		"_AUTH",
	)

	switch v {
	case "": // Haven't logged in
		return
	default: // Logged in, checking the Jwt token
		_, errType = common.Authorize(v)

		switch errType {
		case "EXPIRED":
			return
		case "ERROR":
			// Internal server error
			self.Abort("500")
		case "INVALID":
			// Unauthorized
			self.Abort("401")
		}
		self.Redirect("/user", 302)
	}
}

func (self *ForgotPasswordController) Get() {
	self.Ctx.Output.Header("IsLogined", "FALSE")
	self.Data["Title"] = "Forgot Password"
	directory := make(map[string]bool)
	directory["IsForgotPassword"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

func (self *ForgotPasswordController) Post() {
	u := models.User{
		Email: self.GetString("user-email"),
	}
	errMsg := u.IsValidEmail()
	if errMsg != "" {
		goto Response
	}
	errMsg = u.GenerateLink(self.Ctx.Input.Site() + ":" + strconv.Itoa(self.Ctx.Input.Port()))

Response:
	self.Data["json"] = errMsg
	self.ServeJSON()
}
