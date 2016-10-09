package models

import (
	"io"
	"os"
	"regexp"
	"strconv"
	"time"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/httplib"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
)

type (
	User struct {
		Id            int
		Name          string `orm:"size(255);"`
		Email         string `orm:"size(100)"`
		Campus        string `orm:"size(10)"`
		StudentId     string `orm:"size(25)"`
		Password      string `orm:"null"`
		HashPassword  string `orm:"null;size(128)"`
		AvatarUrl     string `orm:"null"`
		Gender        string `orm:"default(none);size(20)"`
		ContactNo     string `orm:"default(none)"`
		Balance       float64
		Activated     bool
		FillUpProfile bool
		Room          *Room      `orm:"null;rel(fk);"`
		Request       []*Request `orm:"null;reverse(many);"`
	}

	RecaptchaResponse struct {
		Success     bool      `json:"success"`
		ChallengeTS time.Time `json:"challenge_ts"`
		Hostname    string    `json:"hostname"`
		ErrorCodes  []string  `json:"error-codes"`
	}
)

func (u *User) TableName() string {
	return "users"
}

// multiple fields index
func (u *User) TableIndex() [][]string {
	return [][]string{
		[]string{"Id"},
	}
}

func (u *User) IsValidEmail() (errMsg string) {
	valid := validation.Validation{}
	if v := valid.Required(u.Email, "email").Message("Email is required"); !v.Ok {
		errMsg = v.Error.Message
	} else if v := valid.Match(u.Email, regexp.MustCompile(`^.+@.+$`), "email").Message("Invalid Email"); !v.Ok {
		errMsg = v.Error.Message
	}
	return
}

func (u *User) IsValidPassword() (errMsg string) {
	valid := validation.Validation{}
	if v := valid.Required(u.Password, "password").Message("Password is required"); !v.Ok {
		errMsg = v.Error.Message
	} else if v := valid.Match(u.Password, regexp.MustCompile(`[\w]{8,}$`), "password").Message("Invalid Password"); !v.Ok {
		errMsg = v.Error.Message
	}
	return
}

func (u *User) IsValidName() (errMsg string) {
	valid := validation.Validation{}
	if v := valid.Required(u.Name, "name").Message("Name is required"); !v.Ok {
		errMsg = v.Error.Message
	} else if v := valid.Match(u.Name, regexp.MustCompile(`^[a-zA-Z\s]{1,}$`), "name").Message("Please enter a valid name"); !v.Ok {
		errMsg = v.Error.Message
	}
	return
}

func (u *User) IsStudentEmail() (errMsg string) {
	valid := validation.Validation{}
	if v := valid.Match(u.Email, regexp.MustCompile(`^(i|j|p|l){1}[0-9]{5,}@student.newinti.edu.my$`), "email").Message("Invalid student email!"); !v.Ok {
		errMsg = v.Error.Message
	}
	return
}

func (u *User) IsUniqueDataDuplicated() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	num, _ := qs.Filter("email", u.Email).Count()
	if num >= 1 {
		errMsg = "User"
	}
	num, _ = qs.Filter("contact_no", u.ContactNo).Count()
	if num >= 1 {
		if errMsg != "" {
			errMsg += " and Contact No."
		} else {
			errMsg = "Contact No."
		}
	}
	if errMsg != "" {
		errMsg += " exist!"
	}
	return
}

func (u *User) UpdateIsUniqueDataDuplicated() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("users").Exclude("id", u.Id)
	num, _ := qs.Filter("email", u.Email).Count()
	if num >= 1 {
		errMsg = "User"
	}
	num, _ = qs.Filter("contact_no", u.ContactNo).Count()
	if num >= 1 {
		if errMsg != "" {
			errMsg += " and Contact No."
		} else {
			errMsg = "Contact No."
		}
	}
	if errMsg != "" {
		errMsg += " exist!"
	}
	return
}

func (u *User) Insert() error {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	i, err := qs.PrepareInsert()
	if err != nil {
		return err
	}
	defer i.Close()
	_, err = i.Insert(u)
	return err
}

// func (u *User) GetUserByEmailAndPassword(email, password string) (err error) {
// 	o := orm.NewOrm()
// 	qs := o.QueryTable("users")
// 	err = qs.Filter("provider", "").Filter("email", email).One(u)
// 	if err == orm.ErrNoRows {
// 		beego.Debug(err)
// 		return
// 	}
// 	// Validate password
// 	if err = isPasswordEqual(u.HashPassword, password); err != nil {
// 		u = nil
// 		return
// 	}
// 	return
// }

func (u *User) GetUserByEmail() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("users").Filter("email", u.Email)
	num, _ := qs.Count()
	if num == 1 {
		err := qs.One(u)
		if err != nil {
			errMsg = "Cannot get user data."
			beego.Debug()
		}
	} else {
		errMsg = "No such User"
	}
	return
}

func (u *User) GetUserById() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	r := qs.Filter("id", u.Id)
	num, _ := r.Count()
	if num < 1 {
		errMsg = "No data found."
		return errMsg
	}
	r.One(u)
	return
}

func (u *User) GetUserId() (id int, errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	r := qs.Filter("email", u.Email)
	num, _ := r.Count()
	if num < 1 {
		id = 0
		errMsg = "No data found."
		return id, errMsg
	}
	var userSec User
	r.One(&userSec)
	return userSec.Id, ""
}

// Auth users
func (u *User) GetAuthUser() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	// r := qs.Filter("provider", u.Provider).Filter("user_id", u.UserId)
	r := qs.Filter("email", u.Email)
	num, err := r.Count()
	if err != nil {
		beego.Debug(err)
	}
	if num <= 0 {
		err = u.InsertAuthUser()
		if err != nil {
			return
		}
	}
	err = r.One(u)
	return
}

func (u *User) InsertAuthUser() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	i, err := qs.PrepareInsert()
	if err != nil {
		return
	}
	defer i.Close()
	num, err := i.Insert(u)

	url := u.AvatarUrl
	r := httplib.NewBeegoRequest(url, "GET")

	response, err := r.DoRequest()
	if err != nil {
		beego.Debug(err)
	}
	defer response.Body.Close()

	url = "./static/upload/img/u/" + strconv.FormatInt(num, 10)
	err = CheckingPathExist(url)
	if err != nil {
		return
	}
	url += "/personal.jpg"
	file, err := os.Create(url)
	if err != nil {
		beego.Debug(err)
	}

	_, err = io.Copy(file, response.Body)
	if err != nil {
		beego.Debug(err)
	}
	file.Close()
	url = "." + url
	_, err = qs.Filter("id", num).Update(orm.Params{
		"avatar_url": url,
	})
	err = qs.Filter("id", num).One(u)
	return
}

// func (u *User) UpdateAuthUser() (err error) {
// 	o := orm.NewOrm()
// 	qs := o.QueryTable("users")
// 	_, err = qs.Filter("user_id", u.UserId).Update(orm.Params{
// 		"email": u.Email,
// 	})
// 	if err != nil {
// 		beego.Debug("Not update")
// 	}
// 	err = qs.Filter("provider", u.Provider).Filter("user_id", u.UserId).One(u)
// 	beego.Debug(err)
// 	return
// }

// User repo

func (u *User) UpdateAccount() string {
	var err error

	o := orm.NewOrm()
	qs := o.QueryTable("users")
	beego.Debug(u.Email)
	r := qs.Filter("email", u.Email)
	num, _ := r.Count()
	if num < 1 {
		return "Provider or Email issue"
	}

	_, err = r.Update(orm.Params{
		"gender":          u.Gender,
		"contact_no":      u.ContactNo,
		"fill_up_profile": u.FillUpProfile,
	})
	if err != nil {
		return "Something goes wrong when update data."
	}
	if u.AvatarUrl != "" {
		_, err = r.Update(orm.Params{
			"avatar_url": u.AvatarUrl,
		})
		if err != nil {
			return "Something goes wrong when update data."
		}
	}
	err = r.One(u)
	if err != nil {
		beego.Debug(err)
		return "Something goes wrong when get user data."
	}
	return ""
}

func (u *User) GetUserDataMap() map[string]interface{} {
	userData := make(map[string]interface{})

	userData["id"] = u.Id
	userData["activated"] = u.Activated
	userData["name"] = u.Name
	userData["email"] = u.Email
	userData["avatar"] = u.AvatarUrl
	userData["gender"] = u.Gender
	userData["contactNo"] = u.ContactNo
	userData["fillUpProfile"] = u.FillUpProfile
	userData["studentId"] = u.StudentId
	userData["campus"] = u.Campus
	return userData
}

type Ip struct {
	Id      int
	Address string `orm:"unique"`
	Tried   int
	Expired time.Time `orm:"null"`
}

// IP
// multiple fields index
func (ip *Ip) TableIndex() [][]string {
	return [][]string{
		[]string{"Id", "Address"},
	}
}

// multiple fields unique key
func (ip *Ip) TableUnique() [][]string {
	return [][]string{
		[]string{"Address"},
	}
}

func (ip *Ip) CheckingAvailable() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("ip")
	err = qs.Filter("address", ip.Address).One(ip)
	beego.Debug(ip.Tried)
	if err == orm.ErrNoRows {
		err = ip.Insert()
		return
	}
	return
}

func (ip *Ip) Insert() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("ip")
	i, err := qs.PrepareInsert()
	if err != nil {
		return
	}
	defer i.Close()
	_, err = i.Insert(ip)
	return
}

func (ip *Ip) Update() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("ip")
	_, err = qs.Filter("address", ip.Address).Update(orm.Params{
		"tried": ip.Tried + 1,
	})
	if err != nil {
		beego.Debug("Not update")
	}
	err = qs.Filter("address", ip.Address).One(ip)
	beego.Debug(err)
	return
}

func (ip *Ip) SetExpired() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("ip")
	_, err = qs.Filter("address", ip.Address).Update(orm.Params{
		// "expired": time.Now().Add(time.Hour * 12),
		"expired": time.Now().Add(time.Minute * 30),
	})
	if err != nil {
		beego.Debug("Expired update issue")
	}
	return
}

func (ip *Ip) ResetTried() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("ip")
	_, err = qs.Filter("address", ip.Address).Update(orm.Params{
		"tried": 0,
	})
	if err != nil {
		beego.Debug("Set tried issue")
	}
	return
}

type Room struct {
	Id             int
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

func (r *Room) InsertRoom() (err error) {
	var rt RoomTypes

	o := orm.NewOrm()
	qs := o.QueryTable("room_types").Filter("campus", r.Campus).Filter("types_of_rooms", r.TypesOfRooms)

	err = qs.One(&rt)
	beego.Debug(rt)
	if err != nil {
		beego.Debug(err)
	}
	r.Gender = rt.Gender
	r.Deposit = rt.Deposit
	r.Twin = rt.Twin
	r.RatesPerPerson = rt.RatesPerPerson

	qs = o.QueryTable("room")

	i, err := qs.PrepareInsert()
	if err != nil {
		return err
	}
	defer i.Close()
	_, err = i.Insert(r)
	return
}

func (r *Room) UpdateRoom() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("room")
	_, err = qs.Filter("id", r.Id).Update(orm.Params{
		"campus":         r.Campus,
		"room_no":        r.RoomNo,
		"types_of_rooms": r.TypesOfRooms,
		"is_available":   r.IsAvailable,
	})
	if err != nil {
		beego.Debug("Not update")
	}
	return
}

func (r *Room) RemoveRoom() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("room")
	_, err = qs.Filter("id", r.Id).Delete()
	if err != nil {
		beego.Debug(err)
	}
	return
}

func (r *Room) Available() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("room")
	rObj := qs.Filter("campus", r.Campus).Filter("types_of_rooms", r.TypesOfRooms).Filter("is_available", true)
	num, _ := rObj.Count()
	if num <= 0 {
		errMsg = "Room currently not available / full."
		return
	}
	err := rObj.One(r)
	if err != nil {
		errMsg = "Error occurs when getting room data."
		beego.Debug(err)
	}
	return
}

type Request struct {
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

func (r *Request) InsertRequest() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("request")
	i, err := qs.PrepareInsert()
	if err != nil {
		return err
	}
	defer i.Close()
	_, err = i.Insert(r)
	return
}

func (r *Request) RemoveRequest() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("request")
	_, err = qs.Filter("id", r.Id).Delete()
	if err != nil {
		beego.Debug(err)
	}
	return
}

func (r *Request) UpdateStatus(userId int, balance float64) (errMsg string) {
	var err error
	status := r.Status
	dmd := r.DicisionMadeDate
	o := orm.NewOrm()
	qs := o.QueryTable("request")
	rObj := qs.Filter("id", r.Id)

	switch status {
	case "Cancelled":
		qs2 := o.QueryTable("users").Filter("id", userId)
		qs3 := o.QueryTable("room")
		urObj := qs2.RelatedSel("room").Filter("room_id__isnull", false)

		err = rObj.One(r)

		if err != nil {
			errMsg = "Oops...Something goes wrong when getting request data."
			beego.Debug(err)
			return
		}

		if r.Status == "Paid Off" {
			balance += -1 * r.Payment
			beego.Debug(balance)
		}

		num, _ := urObj.Count()
		if num != 0 {
			var user User
			err = urObj.One(&user)

			_, err = qs2.Update(orm.Params{
				"balance": balance,
				"room":    nil,
			})

			if err != nil {
				beego.Debug(err)
			}

			rObj := qs3.Filter("id", user.Room.Id)

			_, err = rObj.Update(orm.Params{
				"is_available": true,
			})

			if err != nil {
				beego.Debug(err)
			}
		}
		_, err = rObj.Update(orm.Params{
			"status":             status,
			"dicision_made_date": dmd,
		})
		if err != nil {
			errMsg = "Oopps...Something goes wrong when update Cancelled status."
			beego.Debug(err)
			return
		}
	case "Denied":
		_, err = rObj.Update(orm.Params{
			"status":             status,
			"dicision_made_date": dmd,
		})
		if err != nil {
			errMsg = "Oopps...Something goes wrong when update DENIED status."
			beego.Debug(err)
			return
		}
	case "Approved":
		err = rObj.One(r)
		if err != nil {
			errMsg = "Oops...Something goes wrong when getting request data."
			beego.Debug(err)
			return
		}
		room := Room{
			Campus:       r.Campus,
			TypesOfRooms: r.TypesOfRooms,
		}
		errMsg = room.Available()
		beego.Debug(room)
		if errMsg != "" {
			return
		}
		user := User{
			Id: userId,
		}
		errMsg = user.BookedRoom(&room)
		if errMsg != "" {
			return
		}
		_, err = rObj.Update(orm.Params{
			"status":             status,
			"dicision_made_date": dmd,
		})
		if err != nil {
			errMsg = "Oopps...Something goes wrong when update APPROVED status."
			beego.Debug(err)
			return
		}
	case "Paid Off":

		uObj := o.QueryTable("users").Filter("id", userId)
		if balance > 0 {
			balance = 0
		}
		_, err = uObj.Update(orm.Params{
			"balance": balance,
		})

		if err != nil {
			errMsg = "Opss...Something goes wrong when update user balance."
			beego.Debug(err)
			return
		}

		_, err = rObj.Update(orm.Params{
			"status": status,
		})
		if err != nil {
			errMsg = "Oopss...Something goes wrong when udpate PAID OFF status."
			beego.Debug(err)
			return
		}

	default:
		errMsg = "Uncaught case: Neither Denied nor Approved."
		return
	}
	return
}

func (u *User) GetRequestStatus() (errMsg string) {
	o := orm.NewOrm()
	// cond := orm.NewCondition()
	// c1 := cond.AndNot("status", "Cancelled").AndNot("status", "Denied")
	qs := o.QueryTable("request")
	ux := qs.Filter("user__id", u.Id)

	num, _ := ux.Count()
	beego.Debug(num)

	if num >= 1 {
		num, _ = ux.Filter("status", "Processing").Count()
		if num >= 1 {
			errMsg = "Unable to request due to yours booking status was Processing."
			return
		}
		num, _ = ux.Filter("status", "Approved").Count()
		if num >= 1 {
			errMsg = "Unable to request due to yours booking status was Approved."
			return
		}
		num, _ = ux.Filter("status", "Paid Off").Count()
		if num >= 1 {
			errMsg = "Unable to request due to yours booking status was Paid Off."
			return
		}
	}

	// num, _ := ux.Count()
	// if num >= 1 {
	// 	errMsg = "Unable to request due to yours booking status was processing / Approved / Paid Off."
	// 	beego.Debug(num)
	// 	return
	// }

	return
}

func (u *User) BookedRoom(room *Room) (errMsg string) {
	var (
		err  error
		num  int64
		user User
	)

	o := orm.NewOrm()
	qs := o.QueryTable("users")
	uObj := qs.Filter("Id", u.Id)
	ruObj := qs.Filter("Room__Id", room.Id).RelatedSel()
	rObj := o.QueryTable("room").Filter("id", room.Id)

	if room.Twin {
		num, _ = ruObj.Count()
		if num == 1 {
			room.IsAvailable = false
		}
	} else {
		room.IsAvailable = false
	}

	err = uObj.One(&user)
	if err != nil {
		errMsg = "Something happened!"
		beego.Debug(err)
	}

	_, err = uObj.Update(orm.Params{
		// "balance": 0,
		"room": room.Id,
	})

	if err != nil {
		errMsg = "Cannot update user's data."
		beego.Debug(err)
		return
	}

	_, err = rObj.Update(orm.Params{
		"is_available": room.IsAvailable,
	})

	if err != nil {
		errMsg = "Cannot update room's data."
		beego.Debug(err)
		return
	}

	// var users []*User
	// _, err = ruObj.All(&users)
	// if err != nil {
	// 	errMsg = "Get users data issue."
	// 	beego.Debug(err)
	// 	return
	// }

	// beego.Debug(len(users))

	return
}

func (u *User) RemoveBooked(bookedRoomId int) (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	userId := u.Id
	uObj := qs.Filter("id", userId)
	// Clear Room Id
	_, err = uObj.Update(orm.Params{
		"room": nil,
	})

	if err != nil {
		beego.Debug(err)
	}

	qs = o.QueryTable("room")
	rObj := qs.Filter("id", bookedRoomId)

	_, err = rObj.Update(orm.Params{
		"is_available": true,
	})

	if err != nil {
		beego.Debug(err)
	}

	qs = o.QueryTable("request")
	reqObj := qs.Filter("status", "Approved").Filter("User__Id", userId).RelatedSel()

	_, err = reqObj.Update(orm.Params{
		"status":             "Cancelled",
		"dicision_made_date": time.Now(),
	})

	if err != nil {
		beego.Debug(err)
	}

	return
}

func (u *User) Remove() (errMsg string) {
	var err error
	o := orm.NewOrm()
	qs := o.QueryTable("room")
	// uObj := qs.Filter("id", u.Id)
	rObj := qs.Filter("User__Id", u.Id).RelatedSel()
	var room Room
	num, _ := rObj.Count()
	if num == 1 {
		err = rObj.One(&room)

		_, err = qs.Filter("id", room.Id).Update(orm.Params{
			"is_available": true,
		})
		if err != nil {
			beego.Debug(err)
			errMsg = "Cannot update room."
		}
	}

	qs = o.QueryTable("users")
	_, err = qs.Filter("id", u.Id).Delete()
	if err != nil {
		beego.Debug(err)
		errMsg = "Cannot remove User."
	}
	return
}

func (u *User) Update() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	uObj := qs.Filter("id", u.Id)

	_, err = uObj.Update(orm.Params{
		"name":            u.Name,
		"email":           u.Email,
		"campus":          u.Campus,
		"gender":          u.Gender,
		"contact_no":      u.ContactNo,
		"activated":       u.Activated,
		"fill_up_profile": u.FillUpProfile,
	})

	return
}

func (u *User) GetRoomList() (errMsg string, rooms []*Room) {
	o := orm.NewOrm()
	qs := o.QueryTable("room")

	if u.Campus != "ALL" {
		qs = qs.Filter("campus", u.Campus)
	}

	n, _ := qs.Count()
	if n == 0 {
		errMsg = "No Room Available."
		return errMsg, nil
	}
	_, err := qs.All(&rooms)

	if err != nil {
		errMsg = "Oops...Something happened when find the room list."
		return errMsg, nil
	}
	return
}

func (u *User) GetUsersList() (errMsg string, users []*User) {
	o := orm.NewOrm()
	cond := orm.NewCondition()
	c1 := cond.And("campus", u.Campus).Or("is_admin", true)
	qs := o.QueryTable("users")

	if u.Campus != "ALL" {
		qs = qs.SetCond(c1)
	}

	n, _ := qs.Count()
	beego.Debug(n)
	if n == 0 {
		errMsg = "No User Available."
		return errMsg, nil
	}
	_, err := qs.All(&users)
	if err != nil {
		errMsg = "Oops...Something happened when find the users list."
		return errMsg, nil
	}
	return
}

func (u *User) GetRequestList() (errMsg string, requests []*Request) {
	o := orm.NewOrm()
	qs := o.QueryTable("request")

	if u.Campus != "ALL" {
		qs = qs.Filter("campus", u.Campus)
	}

	n, _ := qs.Count()
	if n == 0 {
		errMsg = "No Request Available."
		return errMsg, nil
	}
	_, err := qs.RelatedSel().All(&requests)
	if err != nil {
		errMsg = "Oops...Something happened when find the request list."
		return errMsg, nil
	}
	return
}

func (u *User) GetBookedList() (errMsg string, users []*User) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	urObj := qs.RelatedSel("room").Filter("room_id__isnull", false)

	if u.Campus != "ALL" {
		qs = qs.Filter("campus", u.Campus)
	}

	n, _ := urObj.Count()
	if n == 0 {
		errMsg = "No Booked Room Available."
		return errMsg, nil
	}
	_, err := urObj.All(&users)
	if err != nil {
		errMsg = "Oops...Something happened when find the booked list."
		return errMsg, nil
	}
	return
}

func (u *User) GetUserRequestList() (errMsg string, requests []*Request) {
	o := orm.NewOrm()
	qs := o.QueryTable("request").Filter("User__Id", u.Id).RelatedSel()

	n, _ := qs.Count()
	if n == 0 {
		errMsg = "No Request Available."
		return errMsg, nil
	}

	_, err := qs.All(&requests)
	if err != nil {
		errMsg = "Oops...Something happened when find the request list."
		return errMsg, nil
	}
	return
}

type RoomTypes struct {
	Id             int
	Campus         string
	TypesOfRooms   string
	RatesPerPerson float64
	Deposit        float64
	Twin           bool
	Gender         string
}

func (rt *RoomTypes) Insert() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("room_types")
	i, err := qs.PrepareInsert()
	if err != nil {
		return err
	}
	defer i.Close()
	_, err = i.Insert(rt)
	return err
}

func (rt *RoomTypes) Update() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("room_types").Filter("id", rt.Id)
	_, err = qs.Update(orm.Params{
		"campus":           rt.Campus,
		"types_of_rooms":   rt.TypesOfRooms,
		"deposit":          rt.Deposit,
		"rates_per_person": rt.RatesPerPerson,
		"twin":             rt.Twin,
		"gender":           rt.Gender,
	})
	if err != nil {
		beego.Debug(err)
	}
	return
}

func (rt *RoomTypes) Remove() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("room_types").Filter("id", rt.Id)

	_, err = qs.Delete()
	if err != nil {
		beego.Debug(err)
	}
	return
}

type RoomTypeResults struct {
	Campus       string
	TypesOfRooms string
	Total        int
	Available    int
}

func (u *User) GetBookedRoom() (errMsg string, roommates User) {
	o := orm.NewOrm()
	qs := o.QueryTable("users").Filter("id", u.Id)

	urObj := qs.RelatedSel("room").Filter("room_id__isnull", false)

	n, _ := urObj.Count()
	if n == 0 {
		errMsg = "No Room is Booked."
		return
	}
	err := urObj.One(u)
	if err != nil {
		errMsg = "Oops...Something happened when find the booked list."
		return
	}

	// append(users, u)
	qs = o.QueryTable("users").
		RelatedSel("room").
		Filter("room__id", u.Room.Id).
		Exclude("id", u.Id)
	n, _ = qs.Count()
	beego.Debug(n)
	if n <= 0 {
		return
	}

	err = qs.One(&roommates)
	if err != nil {
		beego.Error(err)
		panic(err)
	}
	beego.Debug(roommates.Room)
	return
}

type Admin struct {
	Id             int
	Name           string `orm:"size(255);"`
	Email          string `orm:"size(100)"`
	AvatarUrl      string `orm:"null"`
	Campus         string `orm:"size(10)"`
	ContactNo      string `orm:"default(none)"`
	AdminId        string `orm:"size(100)"`
	Activated      bool
	FullPermission bool
}

func (a *Admin) Insert() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("admin")
	i, err := qs.PrepareInsert()
	if err != nil {
		return err
	}
	defer i.Close()
	_, err = i.Insert(a)
	return err
}

func (a *Admin) Update() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("admin").Filter("id", a.Id)
	_, err := qs.Update(orm.Params{
		"name":            a.Name,
		"email":           a.Email,
		"campus":          a.Campus,
		"contact_no":      a.ContactNo,
		"activated":       a.Activated,
		"full_permission": a.FullPermission,
	})
	if err != nil {
		errMsg = "Cannot update admin."
		beego.Debug(err)
	}
	return
}

func (a *Admin) Remove() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("admin").Filter("id", a.Id)
	_, err := qs.Delete()
	if err != nil {
		errMsg = "Cannot Remove admin."
		beego.Debug()
	}
	return
}

func (a *Admin) UpdateAccount() (errMsg string) {
	var err error

	o := orm.NewOrm()
	qs := o.QueryTable("admin")
	beego.Debug(a.Email)
	r := qs.Filter("email", a.Email)
	num, _ := r.Count()
	if num < 1 {
		return "Email issue"
	}

	_, err = r.Update(orm.Params{
		"contact_no": a.ContactNo,
	})
	if err != nil {
		return "Something goes wrong when update data."
	}
	if a.AvatarUrl != "" {
		_, err = r.Update(orm.Params{
			"avatar_url": a.AvatarUrl,
		})
		if err != nil {
			return "Something goes wrong when update data."
		}
	}
	err = r.One(a)
	if err != nil {
		beego.Debug(err)
		return "Something goes wrong when get user data."
	}
	return ""
}

func (a *Admin) GetAdminDataMap() map[string]interface{} {
	adminData := make(map[string]interface{})
	adminData["id"] = a.Id
	adminData["activated"] = a.Activated
	adminData["name"] = a.Name
	adminData["email"] = a.Email
	adminData["avatar"] = a.AvatarUrl
	adminData["contactNo"] = a.ContactNo
	adminData["adminId"] = a.AdminId
	adminData["campus"] = a.Campus
	adminData["fullPermission"] = a.FullPermission
	adminData["isAdmin"] = true
	return adminData
}

func (a *Admin) GetAdminByEmail() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("admin").Filter("email", a.Email)
	num, _ := qs.Count()
	if num == 1 {
		err := qs.One(a)
		if err != nil {
			errMsg = "Cannot get admin data."
			beego.Debug()
		}
	} else {
		errMsg = "No such Admin"
	}
	return
}

func (a *Admin) IsAdminEmail() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("admin")
	aObj := qs.Filter("email", a.Email)
	num, _ := aObj.Count()
	if num == 1 {
		errMsg = "Yessu"
	}
	return
}

func (a *Admin) GetAuthAdmin() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("admin").Filter("email", a.Email)
	num, _ := qs.Count()
	if num <= 0 {
		errMsg = "No such Admin"
	} else {
		err := qs.One(a)
		if err != nil {
			errMsg = "Cannot get admin data."
		}
	}
	return
}

func (a *Admin) GetAdminId() (id int, errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("admin")
	r := qs.Filter("email", a.Email)
	num, _ := r.Count()
	if num < 1 {
		id = 0
		errMsg = "No data found."
		return id, errMsg
	}
	var acp Admin
	r.One(&acp)
	return acp.Id, ""
}

type Notification struct {
	Id          int
	DateReceive time.Time `orm:"auto_now_add;type(datetime)"`
	Campus      string
	Title       string
	Message     string
}

func (n *Notification) Insert() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("notification")

	i, err := qs.PrepareInsert()
	if err != nil {
		return err
	}
	defer i.Close()
	_, err = i.Insert(n)
	return err
}

func (n *Notification) Remove() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("notification").Filter("id", n.Id)
	_, err := qs.Delete()
	if err != nil {
		errMsg = "Cannot Remove Notification."
		beego.Debug()
	}
	return
}

func (u *User) GetNotificationList() (errMsg string, notifications []*Notification) {
	o := orm.NewOrm()
	qs := o.QueryTable("notification")

	if u.Campus != "ALL" {
		qs = qs.Filter("campus", u.Campus)
	}

	n, _ := qs.Count()
	if n == 0 {
		errMsg = "No Notification Available."
		return errMsg, nil
	}
	_, err := qs.RelatedSel().All(&notifications)
	if err != nil {
		errMsg = "Oops...Something happened when find the notification list."
		return errMsg, nil
	}
	return
}
