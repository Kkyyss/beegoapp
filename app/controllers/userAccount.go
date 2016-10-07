package controllers

import (
	"encoding/json"
	"strconv"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type UserAccountController struct {
	beego.Controller
}

func (self *UserAccountController) Prepare() {
	var (
		errType  string
		userInfo string
	)
	v, _ := self.Ctx.GetSecureCookie(beego.AppConfig.String("COOKIE_SECRET"), "_AUTH")

	switch v {
	case "": // Haven't logged in
		self.Redirect("/", 301)
		return
	default: // Logged in, checking the Jwt token
		userInfo, errType = common.Authorize(v)

		switch errType {
		case "EXPIRED":
			self.Redirect("/", 302)
			return
		case "ERROR":
			// Internal server error
			self.Abort("500")
		case "INVALID":
			// Unauthorized
			self.Abort("401")
		}
	}
	self.Ctx.Output.Header("IsUser", "TRUE")
	self.Ctx.Output.Header("IsAccount", "TRUE")
	self.Ctx.Output.Header("User", userInfo)
}

func (self *UserAccountController) Get() {
	self.Data["Title"] = "Account -"
	directory := make(map[string]bool)
	directory["IsUser"] = true
	directory["IsUserAccount"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

func (self *UserAccountController) Put() {
	var (
		u        models.User
		a        models.Admin
		errMsg   string
		url      string
		jwtToken string
		jsonfy   []byte
		err      error
	)

	userData := make(map[string]interface{})

	errMsg = models.IsValidContactNo(
		self.GetString("reg-email"),
		self.GetString("user-contact-no"),
	)
	if errMsg != "" {
		goto Response
	}

	a = models.Admin{
		Email:     self.GetString("reg-email"),
		ContactNo: self.GetString("user-contact-no"),
	}

	errMsg = a.IsAdminEmail()
	if errMsg != "" {
		errMsg = ""
		_, _, err = self.GetFile("user-upload-img")
		beego.Debug(err)
		if err == nil {
			id, errMsg := a.GetAdminId()
			if errMsg != "" {
				goto Response
			}
			url = "./static/upload/img/a/" + strconv.Itoa(id)
			err = models.CheckingPathExist(url)
			if err != nil {
				self.Data["json"] = err.Error()
				self.ServeJSON()
			}
			url += "/personal.jpg"
			err = self.SaveToFile("user-upload-img", url)
			if err != nil {
				beego.Debug(err)
				errMsg = "Cannot save file."
				goto Response
			}
			a.AvatarUrl = "." + url
		}

		errMsg = a.UpdateAccount()
		if errMsg != "" {
			goto Response
			return
		}

		userData["user"] = a.GetAdminDataMap()
		jwtToken, err = common.GenerateAdminJWT(userData["user"].(map[string]interface{}))
		if err != nil {
			self.Abort("500")
		}
		goto Update
	}

	u = models.User{
		Email:         self.GetString("reg-email"),
		Gender:        self.GetString("user-gender"),
		ContactNo:     self.GetString("user-contact-no"),
		FillUpProfile: true,
	}

	_, _, err = self.GetFile("user-upload-img")
	if err == nil {
		id, errMsg := u.GetUserId()
		if errMsg != "" {
			goto Response
		}
		url = "./static/upload/img/u/" + strconv.Itoa(id)
		err = models.CheckingPathExist(url)
		if err != nil {
			self.Data["json"] = err.Error()
			self.ServeJSON()
		}
		url += "/personal.jpg"
		err = self.SaveToFile("user-upload-img", url)
		if err != nil {
			beego.Debug(err)
			errMsg = "Cannot save file."
			goto Response
		}
		u.AvatarUrl = "." + url
	}

	errMsg = u.UpdateAccount()
	if errMsg != "" {
		goto Response
		return
	}

	userData["user"] = u.GetUserDataMap()

	jwtToken, err = common.GenerateUserJWT(userData["user"].(map[string]interface{}))
	if err != nil {
		self.Abort("500")
	}

Update:
	jsonfy, _ = json.Marshal(userData)

	self.Ctx.Output.Header("User", string(jsonfy))
	self.Ctx.SetSecureCookie(beego.AppConfig.String("COOKIE_SECRET"), "_AUTH", jwtToken)

Response:
	self.Data["json"] = errMsg
	self.ServeJSON()
}
