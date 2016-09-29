package routers

import (
	"github.com/astaxie/beego"
	"github.com/markbates/goth"
	// "github.com/markbates/goth/providers/facebook"
	"github.com/markbates/goth/providers/gplus"
	// "github.com/markbates/goth/providers/slack"
	// "github.com/markbates/goth/providers/twitter"

	"akgo/app/controllers"
)

func init() {
	beego.ErrorController(&controllers.ErrorController{})
	beego.Router("/", &controllers.MainController{})
	beego.Router("/login_register", &controllers.LoginRegisterController{})
	beego.Router("/login", &controllers.LoginController{})
	beego.Router("/register", &controllers.RegisterController{})
	beego.Router("/resend_activation_mail", &controllers.ResendActivationMailController{})
	beego.Router("/user", &controllers.UserController{})
	beego.Router("/user/inti-iu", &controllers.IUController{})
	beego.Router("/user/inti-iics", &controllers.IICSController{})
	beego.Router("/user/inti-iickl", &controllers.IICKLController{})
	beego.Router("/user/inti-iicp", &controllers.IICPController{})
	beego.Router("/user/booking-form", &controllers.BookingFormController{})
	beego.Router("/user/account", &controllers.UserAccountController{})
	beego.Router("/user/reset_password", &controllers.UserResetPasswordController{})
	beego.Router("/user/room-console", &controllers.AdminRoomController{})
	beego.Router("/user/request-console", &controllers.AdminRequestController{})
	beego.Router("/user/booked-room-console", &controllers.AdminBookedRoomController{})
	beego.Router("/user/request", &controllers.UserRequestController{})
	beego.Router("/user/booked-room", &controllers.UserBookedRoomController{})
	beego.Router("/user/user-console", &controllers.AdminUserController{})
	beego.Router("/user/room-status", &controllers.RoomStatusController{})
	beego.Router("/user/room-type", &controllers.RoomTypeController{})
	beego.Router("/user/room-type-console", &controllers.AdminRoomTypeController{})
	beego.Router("/api/view-room-list", &controllers.RoomListController{})
	beego.Router("/api/view-room-type-list", &controllers.RoomTypeListController{})
	beego.Router("/api/view-room-status-list", &controllers.RoomStatusListController{})
	beego.Router("/api/view-request-list", &controllers.RequestListController{})
	beego.Router("/api/view-booked-list", &controllers.BookedListController{})
	beego.Router("/api/view-users-list", &controllers.UsersListController{})
	beego.Router("/api/user-request-list", &controllers.UserRequestListController{})
	beego.Router("/api/user-booked-list", &controllers.UserBookedListController{})
	beego.Router("/verify/:token", &controllers.EmailVerifyController{})
	beego.Router("/forgot_password", &controllers.ForgotPasswordController{})
	beego.Router("/reset_password/:token", &controllers.ResetPasswordController{})
	beego.Router("/404", &controllers.FourZeroFourController{})
	beego.Router("/500", &controllers.FiveZeroZeroController{})
	beego.Router("/401", &controllers.FourZeroOneController{})

	// Provider
	goth.UseProviders(
		gplus.New(
			beego.AppConfig.String("GAPP_CLIENT_ID"),
			beego.AppConfig.String("GAPP_CLIENT_SECRET"),
			// beego.AppConfig.String("GAPP_ONLINE"),
			beego.AppConfig.String("GAPP_LOCALHOST"),
		),
		// facebook.New(
		// beego.AppConfig.String("FBAPP_ONLINE_CLIENT_ID"),
		// beego.AppConfig.String("FBAPP_ONLINE_CLIENT_SECRET"),
		// beego.AppConfig.String("FBAPP_ONLINE"),
		// 	beego.AppConfig.String("FBAPP_CLIENT_ID"),
		// 	beego.AppConfig.String("FBAPP_CLIENT_SECRET"),
		// 	beego.AppConfig.String("FBAPP_LOCALHOST"),
		// ),
		// twitter.NewAuthenticate(
		// 	beego.AppConfig.String("TWITTER_CLIENT_ID"),
		// 	beego.AppConfig.String("TWITTER_CLIENT_SECRET"),
		// 	"http://localhost:8080/auth/twitter/callback?provider=twitter",
		// ),
		// slack.New(
		// 	beego.AppConfig.String("SLACK_CLIENT_ID"),
		// 	beego.AppConfig.String("SLACK_CLIENT_SECRET"),
		// 	"http://localhost:8080/auth/slack/callback?provider=slack",
		// ),
	)
	beego.Router("/auth/:provider/callback", &controllers.AuthProviderCallbackController{})
	beego.Router("/auth/:provider", &controllers.AuthProviderController{})
}
