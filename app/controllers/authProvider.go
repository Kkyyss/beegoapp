package controllers

import (
	"github.com/astaxie/beego"
	"github.com/markbates/goth/gothic"

	"akgo/app/common"
)

type AuthProviderController struct {
	beego.Controller
}

func (self *AuthProviderController) Prepare() {
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
		self.Redirect("/user", 301)
	}
}

func (self *AuthProviderController) Get() {
	gothic.BeginAuthHandler(self.Ctx.ResponseWriter, self.Ctx.Request)
}
