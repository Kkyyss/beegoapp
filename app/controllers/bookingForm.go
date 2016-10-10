package controllers

import (
	"strconv"

	"github.com/astaxie/beego"

	"akgo/app/models"
)

type BookingFormController struct {
	beego.Controller
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
