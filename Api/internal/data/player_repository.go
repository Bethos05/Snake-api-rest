package data

import (
	"context"

	"github.com/Bethos05/Snake-api-rest/Api/pkg/player"
)

type PlayerRepository struct {
	Data *Data
}

func (pl *PlayerRepository) GetAll(ctx context.Context) ([]player.Player, error) {
	q := `SELECT * FROM players;`

	rows, err := pl.Data.DB.QueryContext(ctx, q)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var players []player.Player
	for rows.Next() {
		var p player.Player
		rows.Scan(&p.ID, &p.Nickname, &p.Score)
		players = append(players, p)
	}

	return players, nil
}

func (pl *PlayerRepository) Create(ctx context.Context, p *player.Player) error {
	q := `
    INSERT INTO players (nickname, score)
        VALUES ($1, $2)
        RETURNING id;
    `
	row := pl.Data.DB.QueryRowContext(
		ctx, q, p.Nickname, p.Score,
	)

	err := row.Scan(&p.ID)
	if err != nil {
		return err
	}

	return nil
}
