package data

import (
	"database/sql"
	"os"

	_ "github.com/lib/pq"
)

func getConnectionDB() (*sql.DB, error) {
	uri := os.Getenv("DATABASE_URI")
	db, err := sql.Open("postgres", uri)

	return db, err
}
