package common

import (
	"os"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/lib/pq"
	// _ "github.com/mattn/go-sqlite3"

	"akgo/app/models"
)

func initDB() {
	var dbConn string

	orm.RegisterDriver("postgres", orm.DRPostgres)
	// orm.RegisterDriver("sqlite3", orm.DRSqlite)
	// Docker
	// if os.Getenv("DATABASE_URL") == "" {
	// 	dbConn = fmt.Sprintf(
	// 		"postgres://%s:%s@beegodb:5432/%s?sslmode=disable",
	// 		beego.AppConfig.String("DBUser"),
	// 		beego.AppConfig.String("DBPwd"),
	// 		beego.AppConfig.String("Database"),
	// 	)

	// } else {
	// 	dbConn = os.Getenv("DATABASE_URL")
	// }

	// Online
	dbConn = os.Getenv("DATABASE_URL")
	if dbConn == "" {
		dbConn = "postgres://sqtthykhyavxrd:hzFNiXK-04hTkPPnsW0dbI3OlY@ec2-54-243-201-19.compute-1.amazonaws.com:5432/d5j0hpd61qruri"
		// dbConn = "testing.db"
	}

	orm.RegisterDataBase(
		"default",
		"postgres",
		// "sqlite3",
		dbConn,
		20,
		20,
	)
	// register model here
	orm.RegisterModel(
		new(models.Admin),
		new(models.User),
		new(models.Request),
		new(models.RoomTypes),
		new(models.Room),
		new(models.Notification),
	)

	// Database alias.
	name := "default"

	// Drop table and re-create.
	force := false

	// Print log.
	verbose := true

	// Admin account
	// a := models.Admin{
	// 	Name:           "Alpha",
	// 	Campus:         "ALL",
	// 	Email:          "ongkys1994@gmail.com",
	// 	AvatarUrl:      "../static/upload/default/pikachu.png",
	// 	ContactNo:      "+601121314799",
	// 	Activated:      true,
	// 	FullPermission: true,
	// 	AdminId:        "xyz",
	// }

	// a.Insert()

	// Error.
	err := orm.RunSyncdb(name, force, verbose)
	if err != nil {
		beego.Error(err)
	}
	o := orm.NewOrm()
	admin := models.Admin{Id: 1}
	err = o.Read(&admin)
	if err == orm.ErrNoRows {
		beego.Debug("No result found.")
	} else if err == orm.ErrMissPK {
		beego.Debug("No primary key found.")
	} else {
		beego.Debug(admin.Name, admin.Activated)
	}
}
