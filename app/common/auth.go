package common

import (
	"crypto/rsa"
	"encoding/json"
	"io/ioutil"
	"time"

	"github.com/astaxie/beego"
	jwt "github.com/dgrijalva/jwt-go"
)

// using asymmetric crypto/RSA keys
const (
	// openssl genrsa -out app.rsa 2048
	privKeyPath = "keys/app.rsa"
	// openssl rsa -in app.rsa -pubout > app.rsa.pub
	pubKeyPath = "keys/app.rsa.pub"
)

// Private key for signing and public key for verification
var (
	signKey   *rsa.PrivateKey
	verifyKey *rsa.PublicKey
)

// Read the key files before starting http handlers
func initKeys() {
	var (
		signBytes   []byte
		verifyBytes []byte
		err         error
	)

	signBytes, err = ioutil.ReadFile(privKeyPath)
	if err != nil {
		beego.Debug(err)
	}
	signKey, err = jwt.ParseRSAPrivateKeyFromPEM(signBytes)
	if err != nil {
		beego.Debug(err)
	}
	verifyBytes, err = ioutil.ReadFile(pubKeyPath)
	if err != nil {
		beego.Debug(err)
	}
	verifyKey, err = jwt.ParseRSAPublicKeyFromPEM(verifyBytes)
	if err != nil {
		beego.Debug(err)
	}
}

// Generate JWT token
func GenerateJWT(userData map[string]interface{}) (tokenString string, err error) {
	// create a signer for rsa 256
	t := jwt.New(jwt.SigningMethodRS256)
	// set claims for JWT token
	// t.Claims["iss"] = "admin"
	claims := t.Claims.(jwt.MapClaims)
	claims["user"] = map[string]interface{}{
		"id":             userData["id"].(int),
		"isAdmin":        userData["isAdmin"].(bool),
		"activated":      userData["activated"].(bool),
		"dateJoined":     userData["dateJoined"].(string),
		"provider":       userData["provider"].(string),
		"name":           userData["name"].(string),
		"email":          userData["email"].(string),
		"location":       userData["location"].(string),
		"avatar":         userData["avatar"].(string),
		"gender":         userData["gender"].(string),
		"contactNo":      userData["contactNo"].(string),
		"fillUpProfile":  userData["fillUpProfile"].(bool),
		"studentId":      userData["studentId"].(string),
		"campus":         userData["campus"].(string),
		"fullPermission": userData["fullPermission"].(bool),
	}

	claims["exp"] = time.Now().Add(time.Hour * 12).Unix()

	tokenString, err = t.SignedString(signKey)
	return
}

func Authorize(tokenString string) (string, string) {
	var errType string

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Verify the token with public key, which is the counter part of private key
		return verifyKey, nil
	})

	if err != nil {
		switch err.(type) {
		case *jwt.ValidationError: // JWT validation Error
			vErr := err.(*jwt.ValidationError)

			switch vErr.Errors {
			case jwt.ValidationErrorExpired:
				// Access Token is expired, get a new Token
				errType = "EXPIRED"
				return "", errType
			default:
				// Error while passing the Access Token
				errType = "ERROR"
				return "", errType
			}
		default:
			// Error while passing the Access Token
			errType = "ERROR"
			return "", errType
		}
	}

	if token.Valid {
		jsonfy, _ := json.Marshal(token.Claims)
		jsonStringify := string(jsonfy)
		// beego.Debug(jsonStringify)
		return jsonStringify, errType
	} else {
		// Invalid Access Token
		errType = "INVALID"
		return "", errType
	}
}
