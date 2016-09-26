package controllers

import (
	"github.com/astaxie/beego"

	"akgo/app/common"
)

type MainController struct {
	beego.Controller
}

func (self *MainController) Prepare() {
	// Session + JWT : Default page
	// Check whether is logged in
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
	// self.Ctx.Output.ContentType("application/json")
	// self.Ctx.Output.Header("Authorization", "Bearer "+v.(string))
}

func (self *MainController) Get() {
	self.Ctx.Output.Header("IsLogined", "FALSE")
	self.Data["Title"] = "Home"
	self.TplName = "index.tpl"
}

// func (this *MainController) Post() {
// 	this.Ctx.Redirect(302, "/")
// }
