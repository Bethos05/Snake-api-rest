package server

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Bethos05/Snake-api-rest/pkg/player"
	"github.com/Bethos05/Snake-api-rest/pkg/response"
	"github.com/go-chi/chi"
)

type PlayerRouter struct {
	Repository player.Repository
}

func (pl *PlayerRouter) CreateHandler(w http.ResponseWriter, r *http.Request) {
	var p player.Player
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		response.HTTPError(w, r, http.StatusBadRequest, err.Error())
		return
	}

	defer r.Body.Close()

	ctx := r.Context()
	err = pl.Repository.Create(ctx, &p)
	if err != nil {
		response.HTTPError(w, r, http.StatusBadRequest, err.Error())
		return
	}

	w.Header().Add("Location", fmt.Sprintf("%s%d", r.URL.String(), p.ID))
	response.JSON(w, r, http.StatusCreated, response.Map{"player": p})
}

func (pl *PlayerRouter) GetAllHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	players, err := pl.Repository.GetAll(ctx)
	if err != nil {
		response.HTTPError(w, r, http.StatusNotFound, err.Error())
		return
	}

	response.JSON(w, r, http.StatusOK, response.Map{"players": players})
}

func (pl *PlayerRouter) Routes() http.Handler {
	r := chi.NewRouter()

	r.Get("/", pl.GetAllHandler)
	r.Post("/", pl.CreateHandler)

	return r
}
