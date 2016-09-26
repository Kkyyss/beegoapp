package controllers

import (
	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type ResetPasswordController struct {
	beego.Controller
}

func (self *ResetPasswordController) Prepare() {
	var (
		errType string
	)
	v, _ := self.Ctx.GetSecureCookie(beego.AppConfig.String("COOKIE_SECRET"), "_AUTH")

	switch v {
	case "": // Haven't logged in
		token := self.Ctx.Input.Param(":token")
		// var u models.User
		beego.Debug(token)
		if ok := models.IsForgotPasswordUser(token); !ok {
			self.Abort("401")
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

func (self *ResetPasswordController) Get() {
	self.Ctx.Output.Header("IsLogined", "FALSE")
	self.Data["Title"] = "Reset Password"
	directory := make(map[string]bool)
	directory["IsResetPassword"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

func (self *ResetPasswordController) Post() {
	u := models.User{
		Password:            self.GetString("user-password"),
		ForgotPasswordToken: self.Ctx.Input.Param(":token"),
	}
	beego.Debug("Token ::=> ", u.ForgotPasswordToken)
	errMsg := u.IsValidPassword()
	if errMsg != "" {
		goto Response
	}

	errMsg = u.UpdateForgotPassword()
	if errMsg != "" {
		goto Response
	}

Response:
	self.Data["json"] = errMsg
	self.ServeJSON()
}
