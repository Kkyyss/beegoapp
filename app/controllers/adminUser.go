package controllers

import (
	"encoding/json"
	"strconv"
	"strings"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type AdminUserController struct {
	beego.Controller
}

func (self *AdminUserController) Prepare() {
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

func (self *AdminUserController) Get() {
	self.Data["Title"] = "User -"
	directory := make(map[string]bool)
	directory["IsAdmin"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

func (self *AdminUserController) Post() {
	var (
		errMsg    string
		activated bool
		isAdmin   bool
		profiled  bool
		err       error
	)

	if self.GetString("user-activated") == "on" {
		activated = true
	}
	if self.GetString("user-profiled") == "on" {
		profiled = true
	}
	if self.GetString("user-admin") == "on" {
		isAdmin = true
	}

	namespaced := models.NameSpace(self.GetString("user-name"))
	user := models.User{
		Name:          namespaced,
		Email:         self.GetString("user-email"),
		Campus:        self.GetString("user-c"),
		AvatarUrl:     "../static/upload/default/pikachu.png",
		ContactNo:     self.GetString("user-contact-no"),
		Location:      self.GetString("user-location"),
		Gender:        self.GetString("user-gender"),
		Activated:     activated,
		IsAdmin:       isAdmin,
		FillUpProfile: profiled,
		Provider:      "gplus",
	}

	errMsg = user.IsUniqueDataDuplicated()
	if errMsg != "" {
		goto Response
	}

	errMsg = user.IsStudentEmail()
	if errMsg != "" {
		errMsg = ""
		goto InsertSection
	}

	user.StudentId = strings.Replace(user.Email, "@student.newinti.edu.my", "", -1)

InsertSection:
	err = user.Insert()
	if err != nil {
		beego.Debug(err)
		errMsg = "Cannot add User."
	}

Response:
	self.Data["json"] = errMsg
	self.ServeJSON()
}

func (self *AdminUserController) Delete() {
	var errMsg string
	var ob interface{}

	json.Unmarshal(self.Ctx.Input.RequestBody, &ob)
	userId, _ := strconv.Atoi(ob.(map[string]interface{})["userId"].(string))
	user := models.User{
		Id: userId,
	}
	beego.Debug(userId)
	errMsg = user.Remove()
	self.Data["json"] = errMsg
	self.ServeJSON()
}

func (self *AdminUserController) Put() {
	var (
		errMsg    string
		activated bool
		isAdmin   bool
		profiled  bool
		err       error
	)

	if self.GetString("edit-user-activated") == "on" {
		activated = true
	}
	if self.GetString("edit-user-profiled") == "on" {
		profiled = true
	}
	if self.GetString("edit-user-admin") == "on" {
		isAdmin = true
	}

	namespaced := models.NameSpace(self.GetString("edit-user-name"))
	studentId, _ := strconv.Atoi(self.GetString("edit-user-id"))

	user := models.User{
		Id:     studentId,
		Name:   namespaced,
		Email:  self.GetString("edit-user-email"),
		Campus: self.GetString("edit-user-campus"),
		// AvatarUrl:     "../static/upload/default/pikachu.png",
		ContactNo:     self.GetString("edit-user-contact-no"),
		Location:      self.GetString("edit-user-location"),
		Gender:        self.GetString("edit-user-gender"),
		Activated:     activated,
		IsAdmin:       isAdmin,
		FillUpProfile: profiled,
	}

	errMsg = user.UpdateIsUniqueDataDuplicated()
	if errMsg != "" {
		goto Response
	}

	errMsg = user.IsStudentEmail()
	if errMsg != "" {
		errMsg = ""
		goto InsertSection
	}

	user.StudentId = strings.Replace(user.Email, "@student.newinti.edu.my", "", -1)

InsertSection:
	err = user.Update()
	if err != nil {
		beego.Debug(err)
		errMsg = "Cannot add User."
	}

Response:
	self.Data["json"] = errMsg
	self.ServeJSON()
}
