package controllers

import (
	// "encoding/json"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type EmailVerifyController struct {
	beego.Controller
}

// Prepare METHOD
func (self *EmailVerifyController) Prepare() {

	token := self.Ctx.Input.Param(":token")
	var u models.User
	err := u.GetUserByToken(token)
	if err != nil || u.Activated {
		self.Redirect("/", 301)
	}

	err = u.ActivateUser()
	if err != nil {
		self.Abort("401")
	}

	// userData := make(map[string]interface{})
	userData := u.GetUserDataMap()

	jwtToken, err := common.GenerateJWT(userData)
	if err != nil {
		self.Abort("500")
	}

	// jsonfy, _ := json.Marshal(userData)

	// self.Ctx.Output.Header("IsUser", "TRUE")
	// self.Ctx.Output.Header("User", string(jsonfy))
	self.Ctx.SetSecureCookie(beego.AppConfig.String("COOKIE_SECRET"), "_AUTH", jwtToken)
	self.Redirect("/user/account", 301)
}

// func (self *EmailVerifyController) Get() {
// 	self.Data["Title"] = "Account Activation"
// 	directory := make(map[string]bool)
// 	directory["IsUser"] = true
// 	self.Data["Directory"] = directory
// 	self.TplName = "index.tpl"
// }
