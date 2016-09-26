package controllers

import (
	// "strconv"
	"time"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
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
		ip := models.Ip{
			Address: self.Ctx.Input.IP(),
		}
		err := ip.CheckingAvailable()
		if err != nil {
			beego.Debug(err)
		}
		if ip.Tried > 1 {
			if time.Now().Before(ip.Expired) {
				self.Ctx.Output.Header("recap", "TRUE")
			} else {
				err = ip.ResetTried()
				if err != nil {
					beego.Debug("Issue on set tried")
				}
			}
		}
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
