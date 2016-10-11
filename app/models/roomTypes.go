package models

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
)

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

func (rt *RoomTypes) IsAvailable() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("room_types").
		Filter("campus", rt.Campus).
		Filter("types_of_rooms", rt.TypesOfRooms).Exclude("id", rt.Id)
	n, _ := qs.Count()
	if n >= 1 {
		errMsg = "Type of room exist!"
	}
	return
}
