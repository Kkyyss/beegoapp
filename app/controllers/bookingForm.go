package controllers

import (
	"strconv"

	"github.com/astaxie/beego"

	"akgo/app/common"
	"akgo/app/models"
)

type BookingFormController struct {
	beego.Controller
}

func (self *BookingFormController) Prepare() {
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
	self.Ctx.Output.Header("IsForm", "TRUE")
	self.Ctx.Output.Header("User", userInfo)
}

func (self *BookingFormController) Get() {
	self.Data["Title"] = "Booking Form -"
	directory := make(map[string]bool)
	directory["IsUser"] = true
	self.Data["Directory"] = directory
	self.TplName = "index.tpl"
}

func (self *BookingFormController) Post() {
	var (
		errMsg  string
		request models.Request
		room    models.Room
		user    models.User
		err     error
		userId  int
		payment float64
		deposit float64
		ratespp float64
	)

	userId, _ = strconv.Atoi(self.GetString("form-user-id"))
	beego.Debug(userId)
	user = models.User{
		Id: userId,
	}

	errMsg = user.GetRequestStatus()
	if errMsg != "" {
		goto Response
	}

	room = models.Room{
		Campus:       self.GetString("campus"),
		TypesOfRooms: self.GetString("types-of-rooms"),
	}

	errMsg = room.Available()
	if errMsg != "" {
		goto Response
	}

	errMsg = user.GetUserById()

	if errMsg != "" {
		goto Response
	}

	deposit, _ = strconv.ParseFloat(self.GetString("deposit"), 64)
	ratespp, _ = strconv.ParseFloat(self.GetString("rates_per_person"), 64)
	payment, _ = strconv.ParseFloat(self.GetString("payment"), 64)

	request = models.Request{
		Campus:         self.GetString("campus"),
		Session:        self.GetString("session-date"),
		TypesOfRooms:   self.GetString("types-of-rooms"),
		Status:         "Processing",
		Payment:        payment,
		Deposit:        deposit,
		RatesPerPerson: ratespp,
		User:           &user,
	}
	beego.Debug(request)
	err = request.InsertRequest()
	if err != nil {
		errMsg = "Oopss...Something goes wrong when insert request."
		beego.Debug(err)
	}

Response:
	self.Data["json"] = errMsg
	self.ServeJSON()
}
