package controllers

import (
	"github.com/astaxie/beego"
	"strconv"

	"akgo/app/models"
)

type ResendActivationMailController struct {
	beego.Controller
}

func (self *ResendActivationMailController) Post() {
	u := models.User{
		Provider: "",
		Email:    self.GetString("reg-email"),
	}
	errMsg := u.ResendActivationMail(self.Ctx.Input.Site() + ":" + strconv.Itoa(self.Ctx.Input.Port()))
	// errMsg := u.ResendActivationMail(self.Ctx.Input.Site())
	self.Data["json"] = errMsg
	self.ServeJSON()
}
