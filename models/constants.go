package models

import "net"

var MetaTraderSocket *net.Conn

var SecretMetaTrader = "MysticalDragon$7392&WhisperingWinds&SunsetHaven$AuroraBorealis"

const (
	CryptoType   SymbolType = "CRYPTO"
	CurrencyType SymbolType = "CURRENCY"
	StockType    SymbolType = "STOCK"
)

const (
	ActionWrite    Action = "edit"
	ActionReadOnly Action = "read"
	ActionContent  Action = "media"
)

const (
	TextType TypeMessage = "text"
	FileType TypeMessage = "file"
)

const (
	PaymentSymbolType    SymbolSide = "payment"
	MetaTraderSymbolType SymbolSide = "metatrader"
)

const (
	RemoveOrder = "TRADE_ACTION_REMOVE"
	DealOrder   = "TRADE_ACTION_DEAL"
)

var AllActions = []Action{
	ActionContent, ActionWrite, ActionReadOnly,
}
