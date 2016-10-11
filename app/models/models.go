package models

import (
	"time"
)

type (
	User struct {
		Id            int
		TimeStamp     time.Time `orm:"auto_now_add;type(datetime)"`
		Name          string    `orm:"size(255);"`
		Email         string    `orm:"size(100)"`
		Campus        string    `orm:"size(10)"`
		StudentId     string    `orm:"size(25)"`
		AvatarUrl     string    `orm:"null"`
		Gender        string    `orm:"default(none);size(20)"`
		ContactNo     string    `orm:"default(none)"`
		Balance       float64
		Activated     bool
		FillUpProfile bool
		Room          *Room      `orm:"null;rel(fk);"`
		Request       []*Request `orm:"null;reverse(many);"`
	}
	Room struct {
		Id             int
		TimeStamp      time.Time `orm:"auto_now_add;type(datetime)"`
		Campus         string
		RoomNo         string
		TypesOfRooms   string
		RatesPerPerson float64
		Deposit        float64
		Gender         string
		Twin           bool
		IsAvailable    bool
		User           []*User `orm:"null;reverse(many);"`
	}
	Request struct {
		Id               int
		DateRequest      time.Time `orm:"auto_now_add;type(datetime)"`
		Session          string
		Campus           string
		TypesOfRooms     string
		Status           string `orm:"null"`
		Payment          float64
		Deposit          float64
		RatesPerPerson   float64
		DicisionMadeDate time.Time `orm:"null;type(datetime)"`
		User             *User     `orm:"rel(fk);"`
	}
	RoomTypes struct {
		Id             int
		TimeStamp      time.Time `orm:"auto_now_add;type(datetime)"`
		Campus         string
		TypesOfRooms   string
		RatesPerPerson float64
		Deposit        float64
		Twin           bool
		Gender         string
	}
	RoomTypeResults struct {
		Campus       string
		TypesOfRooms string
		Total        int
		Available    int
	}
	Admin struct {
		Id             int
		TimeStamp      time.Time `orm:"auto_now_add;type(datetime)"`
		Name           string    `orm:"size(255);"`
		Email          string    `orm:"size(100)"`
		AvatarUrl      string    `orm:"null"`
		Campus         string    `orm:"size(10)"`
		ContactNo      string    `orm:"default(none)"`
		AdminId        string    `orm:"size(100)"`
		Activated      bool
		FullPermission bool
	}
	Notification struct {
		Id          int
		DateReceive time.Time `orm:"auto_now_add;type(datetime)"`
		Campus      string
		Title       string
		Message     string
	}
)
