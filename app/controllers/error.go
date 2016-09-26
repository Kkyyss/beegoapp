package controllers

import (
	"github.com/astaxie/beego"
)

type ErrorController struct {
	beego.Controller
}

func (self *ErrorController) Error404() {
	self.Redirect("/404", 301)
}

func (self *ErrorController) Error500() {
	self.Redirect("/500", 301)
}

func (self *ErrorController) Error401() {
	self.Redirect("/401", 301)
}
