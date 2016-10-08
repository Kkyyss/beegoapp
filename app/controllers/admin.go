package controllers

import (
	"encoding/json"
	"strconv"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type AdminController struct {
	beego.Controller
}

func (self *AdminController) Prepare() {
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
			self.Redirect("/login_register", 301)
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
	self.Ctx.Output.Header("User", userInfo)
}

func (self *AdminController) Get() {
	self.Data["Title"] = "Admin -"
	directory := make(map[string]bool)
	directory["IsAdmin"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

func (self *AdminController) Post() {
	var (
		errMsg         string
		activated      bool
		fullPermission bool
		err            error
	)

	if self.GetString("admin-activated") == "on" {
		activated = true
	}
	if self.GetString("admin-permission") == "on" {
		fullPermission = true
	}

	namespaced := models.NameSpace(self.GetString("admin-name"))
	user := models.Admin{
		Name:           namespaced,
		Email:          self.GetString("admin-email"),
		Campus:         self.GetString("admin-c"),
		AvatarUrl:      "../static/upload/default/pikachu.png",
		ContactNo:      self.GetString("admin-contact-no"),
		AdminId:        self.GetString("admin-uid"),
		Activated:      activated,
		FullPermission: fullPermission,
	}

	err = user.Insert()
	if err != nil {
		beego.Debug(err)
		errMsg = "Cannot add User."
		goto Response
	}

Response:
	self.Data["json"] = errMsg
	self.ServeJSON()
}

func (self *AdminController) Delete() {
	var errMsg string
	var ob interface{}

	json.Unmarshal(self.Ctx.Input.RequestBody, &ob)
	userId, _ := strconv.Atoi(ob.(map[string]interface{})["userId"].(string))
	user := models.Admin{
		Id: userId,
	}
	beego.Debug(userId)
	errMsg = user.Remove()
	self.Data["json"] = errMsg
	self.ServeJSON()
}

func (self *AdminController) Put() {
	var (
		errMsg         string
		activated      bool
		fullPermission bool
		// err            error
	)

	if self.GetString("edit-admin-activated") == "on" {
		activated = true
	}
	if self.GetString("edit-admin-permission") == "on" {
		fullPermission = true
	}

	namespaced := models.NameSpace(self.GetString("edit-admin-name"))
	adminId, _ := strconv.Atoi(self.GetString("edit-admin-id"))

	user := models.Admin{
		Id:     adminId,
		Name:   namespaced,
		Email:  self.GetString("edit-admin-email"),
		Campus: self.GetString("edit-admin-campus"),
		// AvatarUrl:     "../static/upload/default/pikachu.png",
		ContactNo:      self.GetString("edit-admin-contact-no"),
		Activated:      activated,
		FullPermission: fullPermission,
	}

	errMsg = user.Update()
	if errMsg != "" {
		errMsg = "Cannot add User."
		goto Response
	}

Response:
	self.Data["json"] = errMsg
	self.ServeJSON()
}
