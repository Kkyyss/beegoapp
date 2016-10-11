package models

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
)

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
