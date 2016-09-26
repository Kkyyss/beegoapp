package controllers

import (
	"github.com/astaxie/beego"

	"akgo/app/models"
)

type UserResetPasswordController struct {
	beego.Controller
}

func (self *UserResetPasswordController) Put() {
	u := models.User{
		Provider: "",
		Email:    self.GetString("password-email"),
		Password: self.GetString("new-password"),
	}
	oldPassword := self.GetString("old-password")
	errMsg := models.IsOldPassword(u.Provider, u.Email, oldPassword)
	if errMsg != "" {
		goto Response
	}
	errMsg = u.IsValidPassword()
	if errMsg != "" {
		goto Response
	}
	errMsg = u.UpdateNewPassword()

Response:
	self.Data["json"] = errMsg
	self.ServeJSON()
}
