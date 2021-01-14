package server

import (
	"net/http"

	"github.com/Bethos05/Snake-api-rest/Api/internal/data"
	"github.com/go-chi/chi"
)

func NewApi() http.Handler {
	r := chi.NewRouter()

	pr := &PlayerRouter{
		Repository: &data.PlayerRepository{
			Data: data.New(),
		},
	}

	r.Mount("/players", pr.Routes())

	return r
}
