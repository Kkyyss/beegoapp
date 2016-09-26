FROM golang:alpine
RUN apk add --no-cache --virtual .build gcc alpine-sdk git \
    && go get github.com/tools/godep \
    && go get github.com/astaxie/beego \
    && go get github.com/beego/bee \
    && go get -u golang.org/x/crypto/bcrypt \
    && go get gopkg.in/gomail.v2 \
    && go get github.com/dgrijalva/jwt-go \
    && go get github.com/markbates/goth \
    && go get github.com/markbates/goth/gothic \
    && go get github.com/markbates/goth/providers/facebook \
    && go get github.com/markbates/goth/providers/gplus \
    && go get github.com/mattn/go-sqlite3 \
    && rm -rf /var/cache/apk/*

ENV AKGO_PATH /go/src/akgo 
RUN mkdir -p $AKGO_PATH/app
WORKDIR $AKGO_PATH/app

COPY ./entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]

