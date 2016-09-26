package controllers

import (
	"github.com/astaxie/beego"

	"akgo/app/common"
)

type FourZeroFourController struct {
	beego.Controller
}

func (self *FourZeroFourController) Get() {
	var (
		errType  string
		userInfo string
	)

	isUser := "TRUE"
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
			self.Abort("401")
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
	self.Data["Title"] = "Page Not Found -"
	self.TplName = "index.tpl"
}
