package common

import (
	"os"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	// _ "github.com/lib/pq"
	_ "github.com/mattn/go-sqlite3"
	// "golang.org/x/crypto/bcrypt"

	"akgo/app/models"
)

func initDB() {
	var dbConn string

	// orm.RegisterDriver("postgres", orm.DRPostgres)
	orm.RegisterDriver("sqlite3", orm.DRSqlite)
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
		// dbConn = "postgres://sqtthykhyavxrd:hzFNiXK-04hTkPPnsW0dbI3OlY@ec2-54-243-201-19.compute-1.amazonaws.com:5432/d5j0hpd61qruri"
		dbConn = "testing.db"
	}

	orm.RegisterDataBase(
		"default",
		// "postgres",
		"sqlite3",
		dbConn,
		20,
		20,
	)
	// register model here
	orm.RegisterModel(new(models.User), new(models.Request), new(models.RoomTypes), new(models.Room), new(models.Ip))

	// Database alias.
	name := "default"

	// Drop table and re-create.
	force := false

	// Print log.
	verbose := true

	// Admin account
	// byteHashPassword, _ := bcrypt.GenerateFromPassword([]byte("qwerty"), bcrypt.DefaultCost)
	// hpass := string(byteHashPassword)
	// u := models.User{
	// 	Name:          "Alpha",
	// 	Campus:        "ALL",
	// 	Email:         "ongkys1994@gmail.com",
	// 	AvatarUrl:     "../static/upload/default/pikachu.png",
	// 	Location:      "anything",
	// 	ContactNo:     "01121314799",
	// 	FillUpProfile: true,
	// 	Gender:        "Male",
	// 	HashPassword:  hpass,
	// 	Activated:     true,
	// 	IsAdmin:       true,
	// 	FullPermission: true,
	// }

	// u.Insert()

	// Error.
	err := orm.RunSyncdb(name, force, verbose)
	if err != nil {
		beego.Error(err)
	}
	o := orm.NewOrm()
	user := models.User{Id: 1}
	err = o.Read(&user)
	if err == orm.ErrNoRows {
		beego.Debug("No result found.")
	} else if err == orm.ErrMissPK {
		beego.Debug("No primary key found.")
	} else {
		beego.Debug(user.DateJoined, user.Name, user.Activated)
	}
}
