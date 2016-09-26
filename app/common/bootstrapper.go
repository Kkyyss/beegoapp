package common

func StartUp() {
	// Initialize DB
	initDB()
	// Initialize private/public keys for JWT authentication
	initKeys()
}
