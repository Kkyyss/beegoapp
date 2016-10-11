package controllers

import (
	"encoding/json"
	"strconv"
	"time"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type AdminNotificationController struct {
	beego.Controller
}

func (self *AdminNotificationController) Prepare() {
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

func (self *AdminNotificationController) Get() {
	self.Data["Title"] = "Notification -"
	directory := make(map[string]bool)
	directory["IsAdmin"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

func (self *AdminNotificationController) Post() {
	var errMsg string

	notification := models.Notification{
		Campus:  self.GetString("nf-campus"),
		Title:   self.GetString("nf-title"),
		Message: self.GetString("nf-message"),
	}

	err := notification.Insert()
	if err != nil {
		errMsg = "Oopss...Something goes wrong when insert notification."
		beego.Debug(err)
	}

	self.Data["json"] = errMsg
	self.ServeJSON()
}

func (self *AdminNotificationController) Delete() {
	var (
		errMsg string
		ob     interface{}
	)

	json.Unmarshal(self.Ctx.Input.RequestBody, &ob)
	notificationId, _ := strconv.Atoi(ob.(map[string]interface{})["notificationId"].(string))
	notification := models.Notification{
		Id: notificationId,
	}

	errMsg = notification.Remove()

	self.Data["json"] = errMsg
	self.ServeJSON()
}

func (self *AdminNotificationController) Put() {
	var (
		errMsg string
	)

	nfId, _ := strconv.Atoi(self.GetString("edit-nf-id"))
	notification := models.Notification{
		Id:          nfId,
		Campus:      self.GetString("edit-nf-campus"),
		DateReceive: time.Now(),
		Title:       self.GetString("edit-nf-title"),
		Message:     self.GetString("edit-nf-message"),
	}

	errMsg = notification.Update()
	if errMsg != "" {
		beego.Debug(errMsg)
	}

	self.Data["json"] = errMsg
	self.ServeJSON()
}
