package controllers

import (
	"time"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type LoginController struct {
	beego.Controller
}

func (self *LoginController) Post() {
	// IP for checking how many tried user excceed, then apply reCAPTCHA.
	var (
		u        models.User
		email    string
		password string
		jwtToken string
		userData map[string]interface{}
	)

	resMap := make(map[string]string)

	ip := models.Ip{
		Address: self.Ctx.Input.IP(),
		Expired: time.Now(),
	}
	err := ip.CheckingAvailable()
	if err != nil {
		resMap["error"] = "Error: checking IP"
	}
	if ip.Tried > 1 && time.Now().Before(ip.Expired) {
		ok := models.ReCaptchaVerification(ip.Address, self.GetString("g-recaptcha-response"))
		if !ok {
			resMap["capres"] = "Invalid reCaptcha"
			goto Response
		}
	}

	email = self.GetString("log-email")
	password = self.GetString("log-password")
	err = u.GetUserByEmailAndPassword(email, password)
	if err != nil {
		err = ip.Update()
		if err != nil {
			resMap["error"] = "Error: Updating IP."
		} else {
			if ip.Tried > 1 {
				resMap["excceed"] = "TRUE"
				if time.Now().After(ip.Expired) || time.Now().Equal(ip.Expired) {
					err = ip.SetExpired()
					if err != nil {
						resMap["error"] = "Error: Setting Expired time."
					}
				}
			}
			resMap["error"] = "Invalid email or password"
		}
		goto Response
	}
	// Success verify credential
	userData = u.GetUserDataMap()
	jwtToken, err = common.GenerateJWT(userData)
	if err != nil {
		beego.Debug(err)
		self.Abort("500")
	}

	self.Ctx.SetSecureCookie(beego.AppConfig.String("COOKIE_SECRET"), "_AUTH", jwtToken)

Response:
	self.Data["json"] = resMap
	self.ServeJSON()
}
