package controllers

import (
	"github.com/astaxie/beego"

	"akgo/app/common"
)

type FourZeroOneController struct {
	beego.Controller
}

func (self *FourZeroOneController) Get() {
	var (
		errType  string
		isUser   string
		userInfo string
	)
	v, _ := self.Ctx.GetSecureCookie(beego.AppConfig.String("COOKIE_SECRET"), "_AUTH")

	switch v {
	case "": // Haven't logged in
		isUser = "FALSE"
	default: // Logged in, checking the Jwt token
		userInfo, errType = common.Authorize(v)

		switch errType {
		case "EXPIRED":
			isUser = "FALSE"
		case "ERROR":
			// Internal server error
			self.Abort("500")
		case "INVALID":
			// Unauthorized
		}
	}

	directory := make(map[string]bool)
	if isUser == "TRUE" {
		directory["IsUser"] = true
		self.Ctx.Output.Header("IsUser", "TRUE")
		self.Ctx.Output.Header("User", userInfo)
	} else {
		self.Ctx.Output.Header("IsLogined", "FALSE")
	}
	self.Data["Directory"] = directory
	self.Data["Title"] = "Unauthorized -"
	self.TplName = "index.tpl"
}
