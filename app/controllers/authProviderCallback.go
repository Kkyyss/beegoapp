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
		userData map[string]interface{}
		jwtToken string
	)

	u := models.User{
		Provider:  user.Provider,
		Name:      user.Name,
		UserId:    user.UserID,
		Email:     user.Email,
		Location:  user.Location,
		AvatarUrl: user.AvatarURL,
		Activated: true,
	}

	errMsg := u.IsAdminEmail()
	if errMsg != "" {
		goto Login
	}

	errMsg = u.IsStudentEmail()
	beego.Debug(errMsg)
	if errMsg != "" {
		self.Ctx.SetCookie("LOGIN_ERROR", errMsg)
		self.Redirect("/login_register", 302)
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

Login:
	err = u.GetAuthUser()
	if err != nil {
		self.Data["json"] = err.Error()
		self.ServeJSON()
	}

	userData = u.GetUserDataMap()

	jwtToken, err = common.GenerateJWT(userData)
	if err != nil {
		self.Abort("500")
	}
	self.Ctx.SetSecureCookie(beego.AppConfig.String("COOKIE_SECRET"), "_AUTH", jwtToken)
	self.Redirect("/user", 302)
}
