package controllers

import (
	"github.com/astaxie/beego"

	"akgo/app/common"
)

type UserNotificationController struct {
	beego.Controller
}

func (self *UserNotificationController) Prepare() {
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

func (self *UserNotificationController) Get() {
	self.Data["Title"] = "User Notification -"
	directory := make(map[string]bool)
	directory["IsAdmin"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

// func (self *UserNotificationController) Post() {
// 	var errMsg string

// 	userId, _ := strconv.Atoi(self.GetString("usr-id"))
// 	requestId, _ := strconv.Atoi(self.GetString("req-id"))
// 	request := models.Request{
// 		Id:     requestId,
// 		Status: "Paid Off",
// 	}

// 	balance, _ := strconv.ParseFloat(self.GetString("nap"), 64)

// 	errMsg = request.UpdateStatus(userId, balance)

// 	if errMsg != "" {
// 		self.Data["json"] = errMsg
// 		self.ServeJSON()
// 	}

// 	self.Data["json"] = errMsg
// 	self.ServeJSON()
// }

// func (self *UserRequestController) Put() {
// 	var errMsg string
// 	var ob interface{}

// 	json.Unmarshal(self.Ctx.Input.RequestBody, &ob)
// 	requestId, _ := strconv.Atoi(ob.(map[string]interface{})["requestId"].(string))
// 	userId := int(ob.(map[string]interface{})["userId"].(float64))
// 	balance, _ := strconv.ParseFloat(ob.(map[string]interface{})["balance"].(string), 64)
// 	request := models.Request{
// 		Id:               requestId,
// 		DicisionMadeDate: time.Now(),
// 		Status:           ob.(map[string]interface{})["status"].(string),
// 	}

// 	errMsg = request.UpdateStatus(userId, balance)
// 	self.Data["json"] = errMsg
// 	self.ServeJSON()
// }
