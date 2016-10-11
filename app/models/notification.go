package models

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
)

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

func (n *Notification) Update() (errMsg string) {
	o := orm.NewOrm()
	qs := o.QueryTable("notification").Filter("id", n.Id)
	_, err := qs.Update(orm.Params{
		"campus":       n.Campus,
		"date_receive": n.DateReceive,
		"title":        n.Title,
		"message":      n.Message,
	})
	if err != nil {
		errMsg = "Cannot update notification."
		beego.Debug()
	}
	return
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
