package models

import (
	// "crypto/rand"
	"crypto/tls"
	// "encoding/base64"
	"encoding/json"
	// "golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
	// "io"
	"io/ioutil"
	"os"
	"strconv"
	"strings"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/httplib"
	"github.com/astaxie/beego/orm"
)

const (
	EmailLength    int = 64
	PasswordLength int = 64
)

func activationMailBody(token, host, name string) (body string) {
	body =
		`<div style="` +
			"font-size:2em;" +
			"border:15px solid #E8EAF6;" +
			"border-radius:5px;" +
			"text-align: justify;" +
			`">` +
			`<div style="border:25px solid transparent;">` +
			"Dear <b>" + name + "</b>,<br/><br/>" +
			"Please click on the link below to process the verification." +
			`<p><b><a href="` + host + "/verify/" + token + `">` +
			host + "/verify/" + token +
			"</a></b></p>" +
			"<br/><br/>" +
			"Regards & Thanks,<br/>" +
			"kysakgo<br/>" +
			"</div></div>"
	return
}

func forgotPasswordMailBody(token, host, name string) (body string) {
	body =
		`<div style="` +
			"font-size:2em;" +
			"border:15px solid #E8EAF6;" +
			"border-radius:5px;" +
			"text-align: justify;" +
			`">` +
			`<div style="border:25px solid transparent;">` +
			"Dear <b>" + name + "</b>,<br/><br/>" +
			"Please click on the link below to process the reset password." +
			`<p><b><a href="` + host + "/reset_password/" + token + `">` +
			host + "/reset_password/" + token +
			"</a></b></p>" +
			"<br/><br/>" +
			"Regards & Thanks,<br/>" +
			"robota1bookingsys<br/>" +
			"</div></div>"
	return
}

// Email
func goSendMail(recipient, subject, body string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", beego.AppConfig.String("GMAIL_SENDER_NAME"))
	m.SetHeader("To", recipient)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	port, err := strconv.Atoi(beego.AppConfig.String("GMAIL_PORT"))
	if err != nil {
		return err
	}

	d := gomail.NewDialer(
		beego.AppConfig.String("GMAIL_HOST"),
		port,
		beego.AppConfig.String("GMAIL_SENDER_NAME"),
		beego.AppConfig.String("GMAIL_SENDER_PASS"),
	)
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}
	err = d.DialAndSend(m)
	return err
}

// Do verification of ReCaptcha
func ReCaptchaVerification(remoteip, gRecaptchaResponse string) bool {
	var r RecaptchaResponse
	postURL := beego.AppConfig.String("reCAPTCHA_URL")

	req := httplib.NewBeegoRequest(postURL, "POST")
	req.Param("secret", beego.AppConfig.String("reCAPTCHA_SECRET_KEY"))
	req.Param("response", gRecaptchaResponse)
	req.Param("remoteip", remoteip)

	// Get response
	resp, err := req.DoRequest()
	if err != nil {
		beego.Debug("POST error:%s", err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		beego.Debug("Read error:%s", err)
	}
	err = json.Unmarshal(body, &r)
	if err != nil {
		beego.Debug("Read error:%s", err)
	}
	return r.Success
}

func CheckingPathExist(url string) error {
	if _, err := os.Stat(url); os.IsNotExist(err) {
		err = os.MkdirAll(url, 0777)
		if err != nil {
			return err
		}
	}
	return nil
}

func NameSpace(name string) (namespaced string) {
	ss := strings.Fields(name)

	for i, v := range ss {
		namespaced += v
		if i != len(ss)-1 {
			namespaced += " "
		}
	}

	return namespaced
}

func IsValidContactNo(email, contactNo string) (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("users")
	num, _ := qs.Filter("contact_no", contactNo).Exclude("email", email).Count()
	if num >= 1 {
		errMsg = "Contact No. exist!"
		return
	}
	qs = o.QueryTable("admin")
	num, _ = qs.Filter("contact_no", contactNo).Exclude("email", email).Count()
	if num >= 1 {
		errMsg = "Contact No. exist!"
	}
	return
}

func GetAdminList() (errMsg string, users []*Admin) {
	o := orm.NewOrm()
	qs := o.QueryTable("admin")

	n, _ := qs.Count()
	beego.Debug(n)
	if n == 0 {
		errMsg = "No Admin Available."
		return errMsg, nil
	}
	_, err := qs.All(&users)
	if err != nil {
		errMsg = "Oops...Something happened when find the admin list."
		return errMsg, nil
	}
	return
}

func GetRoomTypeList(isAdmin bool, campus, gender string) (errMsg string, roomTypes []*RoomTypes) {
	o := orm.NewOrm()
	qs := o.QueryTable("room_types")

	switch campus {
	case "ALL":
	default:
		qs = qs.Filter("campus", campus)
		if !isAdmin {
			qs = qs.Filter("gender", gender)
		}
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

func GetRoomStatusList(isAdmin bool, campus, gender string) (errMsg string, roomTypeResults []*RoomTypeResults) {
	o := orm.NewOrm()
	qry := "SELECT campus, types_of_rooms, COUNT(types_of_rooms) AS total, SUM(is_available) AS available FROM room GROUP BY types_of_rooms"
	rs := o.Raw(qry)

	switch campus {
	case "ALL":
	default:
		if isAdmin {
			rs = o.Raw(qry+" HAVING campus = ?", campus)
		} else {
			rs = o.Raw(qry+" HAVING (campus = ? AND gender = ?)", campus, gender)
		}
	}

	n, _ := rs.QueryRows(&roomTypeResults)
	beego.Debug(len(roomTypeResults))
	if n == 0 {
		errMsg = "No Room Available."
		return errMsg, nil
	}
	return
}
