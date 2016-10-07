package controllers

import (
	"strings"

	"github.com/astaxie/beego"
	"github.com/markbates/goth/gothic"

	"akgo/app/common"
	"akgo/app/models"
)

type AuthProviderCallbackController struct {
	beego.Controller
}

func (self *AuthProviderCallbackController) Prepare() {
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
}

func (self *AuthProviderCallbackController) Get() {
	user, err := gothic.CompleteUserAuth(self.Ctx.ResponseWriter, self.Ctx.Request)
	if err != nil {
		beego.Debug(err)
	}

	var (
		u        models.User
		userData map[string]interface{}
		jwtToken string
	)

	a := models.Admin{
		Email: user.Email,
	}

	errMsg := a.IsAdminEmail()
	if errMsg != "" {
		errMsg = a.GetAuthAdmin()
		if errMsg != "" {
			self.Data["json"] = errMsg
			self.ServeJSON()
		}

		userData = a.GetAdminDataMap()
		jwtToken, err = common.GenerateAdminJWT(userData)
		if err != nil {
			self.Abort("500")
		}
		goto Login
	}

	u = models.User{
		Name:      user.Name,
		Email:     user.Email,
		AvatarUrl: user.AvatarURL,
		Activated: true,
	}

	errMsg = u.IsStudentEmail()
	if errMsg != "" {
		self.Ctx.SetCookie("LOGIN_ERROR", errMsg)
		self.Redirect("/", 302)
		return
	}

	switch strings.Split(u.Email, "")[0] {
	case "i":
		u.Campus = "IU"
	case "j":
		u.Campus = "IICS"
	case "l":
		u.Campus = "IICKL"
	case "p":
		u.Campus = "IICP"
	default:
		errMsg = "Who are u?"
		return
	}

	u.StudentId = strings.Replace(u.Email, "@student.newinti.edu.my", "", -1)

	err = u.GetAuthUser()
	if err != nil {
		self.Data["json"] = err.Error()
		self.ServeJSON()
	}

	userData = u.GetUserDataMap()

	jwtToken, err = common.GenerateUserJWT(userData)
	if err != nil {
		self.Abort("500")
	}

Login:
	self.Ctx.SetSecureCookie(beego.AppConfig.String("COOKIE_SECRET"), "_AUTH", jwtToken)
	self.Redirect("/user", 302)
}
