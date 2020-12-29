package player

import "context"

// Repository handle the CRUD operations with Player.
type Repository interface {
	GetAll(ctx context.Context) ([]Player, error)
	GetOne(ctx context.Context, id uint) (Player, error)
	GetByUser(ctx context.Context, userID uint) ([]Player, error)
	Create(ctx context.Context, player *Player) error
	Update(ctx context.Context, id uint, player Player) error
	Delete(ctx context.Context, id uint) error
}
