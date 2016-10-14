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
	if u.ContactNo != "" {
		num, _ = qs.Filter("contact_no", u.ContactNo).Count()
		if num >= 1 {
			if errMsg != "" {
				errMsg += " and Contact No."
			} else {
				errMsg = "Contact No."
			}
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
	if u.ContactNo != "" {
		num, _ = qs.Filter("contact_no", u.ContactNo).Count()
		if num >= 1 {
			if errMsg != "" {
				errMsg += " and Contact No."
			} else {
				errMsg = "Contact No."
			}
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
func (u *User) GetAuthUser(accessToken string) (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	// r := qs.Filter("provider", u.Provider).Filter("user_id", u.UserId)
	r := qs.Filter("email", u.Email)
	num, err := r.Count()
	if err != nil {
		beego.Debug(err)
	}
	if num <= 0 {
		err = u.InsertAuthUser(accessToken)
		if err != nil {
			return
		}
	}
	err = r.One(u)
	return
}

func (u *User) InsertAuthUser(accessToken string) (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")

	var ob interface{}
	req := httplib.NewBeegoRequest("https://www.googleapis.com/oauth2/v1/userinfo", "GET")
	req.Param("alt", "json")
	req.Param("access_token", accessToken)
	err = req.ToJSON(&ob)
	if err != nil {
		beego.Debug(err)
	}
	u.Gender = ob.(map[string]interface{})["gender"].(string)
	beego.Debug(u.Gender)
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
	c1 := cond.And("campus", u.Campus)
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
