package controllers

import (
	"encoding/json"
	"strconv"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type AdminRoomController struct {
	beego.Controller
}

func (self *AdminRoomController) Prepare() {
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

func (self *AdminRoomController) Get() {
	self.Data["Title"] = "Room -"
	directory := make(map[string]bool)
	directory["IsAdmin"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

func (self *AdminRoomController) Post() {
	var (
		available bool
		errMsg    string
	)
	if self.GetString("available") == "on" {
		available = true
	}

	beego.Debug(self.GetString("types-of-rooms"))
	room := models.Room{
		Campus:       self.GetString("campus"),
		RoomNo:       self.GetString("room-no"),
		TypesOfRooms: self.GetString("types-of-rooms"),
		IsAvailable:  available,
	}

	err := room.InsertRoom()
	if err != nil {
		beego.Debug(err)
		errMsg = err.Error()
	}

	self.Data["json"] = errMsg
	self.ServeJSON()
}

func (self *AdminRoomController) Delete() {
	var errMsg string
	var ob interface{}
	// roomId, _ := strconv.Atoi(self.GetString("jsoninfo"))
	json.Unmarshal(self.Ctx.Input.RequestBody, &ob)
	roomId, _ := strconv.Atoi(ob.(map[string]interface{})["roomId"].(string))
	room := models.Room{
		Id: roomId,
	}

	err := room.RemoveRoom()
	if err != nil {
		beego.Debug(err)
	}

	self.Data["json"] = errMsg
	self.ServeJSON()
}

func (self *AdminRoomController) Put() {
	var (
		errMsg    string
		available bool
	)

	if self.GetString("edit-available") == "on" {
		available = true
	}

	roomId, _ := strconv.Atoi(self.GetString("edit-room-id"))

	room := models.Room{
		Id:           roomId,
		Campus:       self.GetString("edit-campus"),
		RoomNo:       self.GetString("edit-room-no"),
		TypesOfRooms: self.GetString("edit-types-of-rooms"),
		IsAvailable:  available,
	}

	err := room.UpdateRoom()
	if err != nil {
		errMsg = "Not Update"
		beego.Debug(err)
	}

	self.Data["json"] = errMsg
	self.ServeJSON()
}
