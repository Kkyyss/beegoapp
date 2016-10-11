package models

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
)

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
