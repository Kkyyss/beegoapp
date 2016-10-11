package controllers

import (
	"github.com/astaxie/beego"

	"akgo/app/common"
)

type LoginRegisterController struct {
	beego.Controller
}

func (self *LoginRegisterController) Prepare() {
	var (
		errType string
	)
	v, _ := self.Ctx.GetSecureCookie(beego.AppConfig.String("COOKIE_SECRET"), "_AUTH")

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

func (self *LoginRegisterController) Get() {
	self.Ctx.Output.Header("IsLogined", "FALSE")
	self.Data["Title"] = "Log In / Sign Up"
	directory := make(map[string]bool)
	directory["IsLoginRegister"] = true
	self.Data["Directory"] = directory
	self.Data["reCAPTCHA_SK"] = beego.AppConfig.String("reCAPTCHA_SITE_KEY")
	self.TplName = "index.tpl"
}
