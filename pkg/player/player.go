package player

type Player struct {
	ID       uint   `json:"id,"`
	Nickname string `json:"nickname"`
	Score    int    `json:"score"`
}
