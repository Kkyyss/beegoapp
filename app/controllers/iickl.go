package controllers

import (
	"github.com/astaxie/beego"

	"akgo/app/common"
)

type IICKLController struct {
	beego.Controller
}

func (self *IICKLController) Prepare() {
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

func (self *IICKLController) Get() {
	self.Data["Title"] = "IICKL -"
	directory := make(map[string]bool)
	directory["IsUser"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}
