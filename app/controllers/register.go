package controllers

import (
	"strconv"

	"github.com/astaxie/beego"

	"akgo/app/models"
)

type RegisterController struct {
	beego.Controller
}

func (self *RegisterController) Post() {
	var (
		res string
		u   models.User
		err error
	)

	resMap := make(map[string]string)

	// ReCaptcha verfication
	ok := models.ReCaptchaVerification(
		self.Ctx.Input.IP(),
		self.GetString("g-recaptcha-response"),
	)
	// If not empty string then reject.
	if !ok {
		self.Data["json"] = "Invalid reCaptcha"
		goto Response
	}

	u = models.User{
		Name:      models.NameSpace(self.GetString("reg-username")),
		Email:     self.GetString("reg-email"),
		Password:  self.GetString("reg-password"),
		AvatarUrl: "../static/upload/default/pikachu.png",
	}

	resMap = u.IsValid()
	if len(resMap) != 0 {
		self.Data["json"] = resMap
		goto Response
	}
	res, err = u.Create(self.Ctx.Input.Site() + ":" + strconv.Itoa(self.Ctx.Input.Port()))
	// res, err = u.Create(self.Ctx.Input.Site())
	if err != nil {
		beego.Debug(res)
		self.Data["json"] = err.Error()
	}

Response:
	self.ServeJSON()
}
