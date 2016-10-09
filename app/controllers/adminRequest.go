package controllers

import (
	"encoding/json"
	"strconv"
	"time"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type AdminRequestController struct {
	beego.Controller
}

func (self *AdminRequestController) Prepare() {
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

func (self *AdminRequestController) Get() {
	self.Data["Title"] = "Request -"
	directory := make(map[string]bool)
	directory["IsAdmin"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

func (self *AdminRequestController) Delete() {
	var (
		errMsg string
		ob     interface{}
	)

	json.Unmarshal(self.Ctx.Input.RequestBody, &ob)
	requestId, _ := strconv.Atoi(ob.(map[string]interface{})["requestId"].(string))
	request := models.Request{
		Id: requestId,
	}

	err := request.RemoveRequest()
	if err != nil {
		beego.Debug(err)
	}

	self.Data["json"] = errMsg
	self.ServeJSON()
}

func (self *AdminRequestController) Put() {
	var (
		errMsg string
		ob     interface{}
	)

	json.Unmarshal(self.Ctx.Input.RequestBody, &ob)
	requestId, _ := strconv.Atoi(ob.(map[string]interface{})["requestId"].(string))
	userId, _ := strconv.Atoi(ob.(map[string]interface{})["userId"].(string))

	request := models.Request{
		Id:               requestId,
		Status:           ob.(map[string]interface{})["status"].(string),
		DicisionMadeDate: time.Now(),
	}

	errMsg = request.UpdateStatus(userId, 0)
	if errMsg != "" {
		beego.Debug(errMsg)
	}

	self.Data["json"] = errMsg
	self.ServeJSON()
}
