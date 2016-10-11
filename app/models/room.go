package models

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
)

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

func (r *Room) IsRoomNoAvailable() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("room").
		Filter("campus", r.Campus).
		Filter("types_of_rooms", r.TypesOfRooms).
		Filter("room_no", r.RoomNo).Exclude("id", r.Id)
	n, _ := qs.Count()
	if n >= 1 {
		errMsg = "Room No Exist!"
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
