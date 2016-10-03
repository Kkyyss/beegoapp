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
	// Own's user
	User struct {
		Id                  int
		DateJoined          time.Time `orm:"auto_now_add;type(date)"`
		Provider            string    `orm:"null;size(25);"`
		UserId              string    `orm:"null"`
		Name                string    `orm:"size(255);"`
		Email               string    `orm:"size(100)"`
		Campus              string    `orm:"size(10)"`
		StudentId           string    `orm:"size(25)"`
		Password            string    `orm:"null"`
		HashPassword        string    `orm:"null;size(128)"`
		AvatarUrl           string    `orm:"null"`
		Location            string    `orm:"default(none)"`
		Gender              string    `orm:"default(none);size(20)"`
		ContactNo           string    `orm:"default(none)"`
		ActivationToken     string    `orm:"null;size(156)"`
		ForgotPasswordToken string    `orm:"null;size(156)"`
		Balance             float64
		Activated           bool
		// DepositIsPaid       bools
		IsAdmin        bool
		FillUpProfile  bool
		FullPermission bool
		Room           *Room      `orm:"null;rel(fk);"`
		Request        []*Request `orm:"null;reverse(many);"`
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

// multiple fields unique key
// func (u *User) TableUnique() [][]string {
// 	return [][]string{
// 		[]string{"Username"},
// 	}
// }

// Form verification
func (u *User) IsValid() map[string]string {
	o := orm.NewOrm()
	resMap := make(map[string]string)
	valid := validation.Validation{}

	qs := o.QueryTable("users")

	// Name
	if v := valid.Required(u.Name, "name").Message("Name is required"); !v.Ok {
		resMap[v.Error.Key] = v.Error.Message
	} else if v := valid.Match(u.Name, regexp.MustCompile(`^[a-zA-Z\s]{1,}$`), "name").Message("Please enter a valid name"); !v.Ok {
		resMap[v.Error.Key] = v.Error.Message
	}

	// Email
	if v := valid.Required(u.Email, "email").Message("Email is required"); !v.Ok {
		resMap[v.Error.Key] = v.Error.Message
	} else if v := valid.Match(u.Email, regexp.MustCompile(`^.+@.+$`), "email").Message("Invalid Email"); !v.Ok {
		resMap[v.Error.Key] = v.Error.Message
	}
	num, _ := qs.Filter("email", u.Email).Filter("provider", u.Provider).Count()
	if num > 0 {
		resMap["email"] = "Email already Exist"
	}

	// Password
	if v := valid.Required(u.Password, "password").Message("Password is required"); !v.Ok {
		resMap[v.Error.Key] = v.Error.Message
	} else if v := valid.Match(u.Password, regexp.MustCompile(`[\w]{8,}$`), "password").Message("Invalid Password"); !v.Ok {
		resMap[v.Error.Key] = v.Error.Message
	}

	return resMap
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
	if v := valid.Match(u.Provider, regexp.MustCompile(`^gplus$`), "provider"); !v.Ok {
		errMsg = v.Error.Message
	} else if v := valid.Match(u.Email, regexp.MustCompile(`^(i|j|p|l){1}[0-9]{5,}@student.newinti.edu.my$`), "email").Message("Invalid student email!"); !v.Ok {
		errMsg = v.Error.Message
	}
	return
}

func (u *User) IsAdminEmail() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	aObj := qs.Filter("email", u.Email)
	num, _ := aObj.Count()
	if num == 1 {
		errMsg = "Yessu"
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

func (u *User) IsValidContactNo() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	num, _ := qs.Filter("contact_no", u.ContactNo).Exclude("email", u.Email).Count()
	if num >= 1 {
		errMsg = "Contact No. exist!"
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

func (u *User) GetUserByToken(token string) (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	err = qs.Filter("activation_token", token).One(u)
	beego.Debug("Get token")
	if err == orm.ErrNoRows {
		beego.Debug(err)
		u = nil
		beego.Debug("Not get user by token")
		return
	}
	beego.Debug("Get user by token")
	return
}

func (u *User) GetUserByEmailAndPassword(email, password string) (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	err = qs.Filter("provider", "").Filter("email", email).One(u)
	if err == orm.ErrNoRows {
		beego.Debug(err)
		return
	}
	// Validate password
	if err = isPasswordEqual(u.HashPassword, password); err != nil {
		u = nil
		return
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
	r := qs.Filter("provider", u.Provider).Filter("email", u.Email)
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

	url = "./static/upload/img/" + strconv.FormatInt(num, 10)
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

func (u *User) UpdateAuthUser() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	_, err = qs.Filter("provider", u.Provider).Filter("user_id", u.UserId).Update(orm.Params{
		"email": u.Email,
	})
	if err != nil {
		beego.Debug("Not update")
	}
	err = qs.Filter("provider", u.Provider).Filter("user_id", u.UserId).One(u)
	beego.Debug(err)
	return
}

// User repo
func (u *User) Create(host string) (errMsg string, err error) {
	// Hash password
	hpass, err := hashingPassword(u.Password)
	if err != nil {
		return "Something goes wrong when creating password.", err
	}
	u.HashPassword = hpass
	//clear the incoming text password
	u.Password = ""

	// Generate Token
	u.ActivationToken, err = generateEmailActivationToken()
	if err != nil {
		return "Something goes wrong when creating verification token", err
	}

	// Insert User
	err = u.Insert()
	if err != nil {
		return "Something goes wrong when adding user to database.", err
	}

	// Send verification email
	recipient := u.Email
	subject := "Account Verification"
	body := activationMailBody(u.ActivationToken, host, u.Name)

	if err = goSendMail(recipient, subject, body); err != nil {
		return "Something goes wrong when sending the email.", err
	}
	return
}

func (u *User) ResendActivationMail(host string) string {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	r := qs.Filter("provider", u.Provider).Filter("email", u.Email)
	num, _ := r.Count()
	if num < 1 {
		return "No email found."
	}
	err := r.One(u)
	// Send verification email
	recipient := u.Email
	subject := "Account Verification"
	body := activationMailBody(u.ActivationToken, host, u.Name)

	if err = goSendMail(recipient, subject, body); err != nil {
		return "Something goes wrong when sending the email."
	}
	return ""
}

func (u *User) ActivateUser() (err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	_, err = qs.Filter("activation_token", u.ActivationToken).Update(orm.Params{
		"activation_token": "",
		"activated":        true,
	})
	if err != nil {
		beego.Debug("Not update")
	}
	err = qs.Filter("provider", u.Provider).Filter("email", u.Email).One(u)
	return err
}

func (u *User) GenerateLink(host string) string {
	var err error
	u.ForgotPasswordToken, err = generateForgotPasswordToken()
	if err != nil {
		beego.Debug(err)
		return "Something goes wrong when creating token"
	}
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	r := qs.Filter("provider", "").Filter("email", u.Email)
	num, err := r.Count()
	if err != nil {
		beego.Debug(err)
	}
	if num < 1 {
		return "No such email."
	}
	_, err = r.Update(orm.Params{
		"forgot_password_token": u.ForgotPasswordToken,
	})
	if err != nil {
		beego.Debug(err)
		return "Something goes wrong when update token"
	}

	err = r.One(u)

	// Send forgot password email
	recipient := u.Email
	subject := "Forgot Password"
	body := forgotPasswordMailBody(u.ForgotPasswordToken, host, u.Name)

	if err = goSendMail(recipient, subject, body); err != nil {
		beego.Debug(err)
		return "Something goes wrong when sending the email."
	}
	return ""
}

func (u *User) UpdateForgotPassword() string {
	var err error
	u.HashPassword, err = hashingPassword(u.Password)
	if err != nil {
		return "Something goes wrong when creating new password."
	}
	u.Password = ""

	o := orm.NewOrm()
	qs := o.QueryTable("users")

	_, err = qs.Filter(
		"forgot_password_token",
		u.ForgotPasswordToken,
	).Update(orm.Params{
		"forgot_password_token": "",
		"hash_password":         u.HashPassword,
	})
	if err != nil {
		beego.Debug(err)
		return "Something goes wrong when updating password on database."
	}
	return ""
}

func (u *User) UpdateNewPassword() string {
	var err error
	u.HashPassword, err = hashingPassword(u.Password)
	if err != nil {
		return "Something goes wrong when creating new password."
	}
	u.Password = ""

	o := orm.NewOrm()
	qs := o.QueryTable("users")
	r := qs.Filter("provider", u.Provider).Filter("email", u.Email)
	num, _ := r.Count()
	if num < 1 {
		return "Provider or Email issue"
	}
	_, err = r.Update(orm.Params{
		"hash_password": u.HashPassword,
	})
	if err != nil {
		beego.Debug(err)
		return "Something goes wrong when updating password on database."
	}
	return ""
}

func (u *User) UpdateAccount() string {
	var err error

	o := orm.NewOrm()
	qs := o.QueryTable("users")
	beego.Debug(u.Provider)
	beego.Debug(u.Email)
	r := qs.Filter("provider", u.Provider).Filter("email", u.Email)
	num, _ := r.Count()
	if num < 1 {
		return "Provider or Email issue"
	}

	_, err = r.Update(orm.Params{
		// "name":            u.Name,
		"location":        u.Location,
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
	// var requests []*Request

	// beego.Debug(users[0])

	// requests, _ = u.GetUserRequest()

	userData["id"] = u.Id
	userData["isAdmin"] = u.IsAdmin
	userData["activated"] = u.Activated
	userData["dateJoined"] = u.DateJoined.String()
	userData["provider"] = u.Provider
	userData["name"] = u.Name
	userData["email"] = u.Email
	userData["location"] = u.Location
	userData["avatar"] = u.AvatarUrl
	userData["gender"] = u.Gender
	userData["contactNo"] = u.ContactNo
	userData["fillUpProfile"] = u.FillUpProfile
	userData["studentId"] = u.StudentId
	userData["campus"] = u.Campus
	userData["fullPermission"] = u.FullPermission
	userData["balance"] = u.Balance
	// userData["request"] = requests
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
	DateRequest      time.Time `orm:"auto_now_add;type(date)"`
	SessionMonth     string
	SessionYear      string
	Campus           string
	TypesOfRooms     string
	Status           string `orm:"null"`
	Payment          float64
	Deposit          float64
	RatesPerPerson   float64
	DicisionMadeDate time.Time `orm:"null;type(date)"`
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

func (r *Request) UpdateStatus(userId int) (errMsg string) {
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

		// err = rObj.one(r)

		// if err != nil {
		// 	errMsg = "Oops...Something goes wrong when getting request data."
		// 	beego.Debug(err)
		// 	return
		// }

		// if r.Status == "Payment Made" {

		// }

		num, _ := urObj.Count()
		if num != 0 {
			var user User
			err = urObj.One(&user)

			_, err = qs2.Update(orm.Params{
				"room": nil,
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
	default:
		errMsg = "Uncaught case: Neither Denied nor Approved."
		return
	}
	return
}

func (u *User) GetRequestStatus() (errMsg string) {
	o := orm.NewOrm()
	cond := orm.NewCondition()
	c1 := cond.And("status", "Processing").Or("status", "Approved")
	qs := o.QueryTable("request")
	ux := qs.SetCond(c1).Filter("User__Id", u.Id).RelatedSel()

	// num, _ := ux.Count()

	// if num >= 1 {
	// 	num, _ = ux.SetCond(c1).Count()
	// 	if num >= 1 {
	// 		errMsg = "Unable to request due to yours booking status was processing / Approved."
	// 		beego.Debug(num)
	// 		return
	// 	}
	// }

	num, _ := ux.Count()
	if num >= 1 {
		errMsg = "Unable to request due to yours booking status was processing / Approved."
		beego.Debug(num)
		return
	}

	beego.Debug(num)

	return
}

func (u *User) BookedRoom(room *Room) (errMsg string) {
	var (
		err error
		num int64
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

	_, err = uObj.Update(orm.Params{
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
		"location":        u.Location,
		"activated":       u.Activated,
		"is_admin":        u.IsAdmin,
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

func (u *User) GetRoomStatusList() (errMsg string, roomTypeResults []*RoomTypeResults) {
	o := orm.NewOrm()
	qry := "SELECT campus, types_of_rooms, COUNT(types_of_rooms) AS total, SUM(is_available) AS available FROM room GROUP BY types_of_rooms"
	rs := o.Raw(qry)
	if u.Campus != "ALL" {
		rs = o.Raw(qry+" HAVING campus = ?", u.Campus)
	}

	n, _ := rs.QueryRows(&roomTypeResults)
	beego.Debug(len(roomTypeResults))
	if n == 0 {
		errMsg = "No Room Type Available."
		return errMsg, nil
	}
	return
}

func (u *User) GetRoomTypeList() (errMsg string, roomTypes []*RoomTypes) {
	o := orm.NewOrm()
	qs := o.QueryTable("room_types")

	if u.Campus != "ALL" {
		qs = qs.Filter("campus", u.Campus)
	}

	num, _ := qs.Count()
	if num == 0 {
		errMsg = "No Room Type Available."
		return errMsg, nil
	}

	_, err := qs.All(&roomTypes)
	if err != nil {
		beego.Debug(err)
		errMsg = "Ooops...Something goes wrong when get the room type data."
		return errMsg, nil
	}
	return
}
