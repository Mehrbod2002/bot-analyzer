package logger

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

const (
	botToken    = "6529444046:AAH7PGeys_nL4GXSJ5N8BhjKY1WgRaNYkHs"
	chatIDsFile = "chat_ids.json"
)

type sendMessageRequest struct {
	ChatID    string `json:"chat_id,omitempty"`
	Text      string `json:"text"`
	ParseMode string `json:"parse_mode"`
}

func SendMessage(message string) error {
	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", botToken)

	chatIDs, err := loadChatIDs()
	if err != nil {
		log.Println("Error loading chat IDs:", err)
	}
	for _, chatID := range chatIDs {

		requestBody, err := json.Marshal(sendMessageRequest{
			ChatID:    fmt.Sprintf("%d", chatID),
			Text:      message,
			ParseMode: "HTML",
		})
		if err != nil {
			return err
		}

		response, err := http.Post(apiURL, "application/json", bytes.NewBuffer(requestBody))
		if err != nil {
			return err
		}
		defer response.Body.Close()

		if response.StatusCode != http.StatusOK {
			return fmt.Errorf("telegram API request failed with status: %d", response.StatusCode)
		}
	}
	return nil
}

func Telegram() {
	chatIDs, err := loadChatIDs()
	if err != nil {
		log.Println("Error loading chat IDs:", err)
	}

	bot, err := tgbotapi.NewBotAPI(botToken)
	if err != nil {
		log.Fatal(err)
	}

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates, err := bot.GetUpdatesChan(u)
	if err != nil {
		log.Fatal(err)
	}

	for update := range updates {
		if update.Message == nil {
			continue
		}

		if update.Message.IsCommand() && update.Message.Command() == "start" {
			handleStartCommand(bot, update.Message)

			chatID := update.Message.Chat.ID
			chatIDs = appendUniqueChatID(chatIDs, chatID)
			saveChatIDs(chatIDs)
		}
	}
}

func handleStartCommand(bot *tgbotapi.BotAPI, message *tgbotapi.Message) {
	chatID := message.Chat.ID
	msg := tgbotapi.NewMessage(chatID, "Welcome to LF.")
	_, err := bot.Send(msg)
	if err != nil {
		log.Println(err)
	}
}

func loadChatIDs() ([]int64, error) {
	var chatIDs []int64

	file, err := os.Open(chatIDsFile)
	if err != nil {
		return chatIDs, err
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	err = decoder.Decode(&chatIDs)
	if err != nil && err != io.EOF {
		return chatIDs, err
	}

	return chatIDs, nil
}

func saveChatIDs(chatIDs []int64) error {
	file, err := os.Create(chatIDsFile)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	err = encoder.Encode(chatIDs)
	if err != nil {
		return err
	}

	return nil
}

func appendUniqueChatID(chatIDs []int64, chatID int64) []int64 {
	for _, id := range chatIDs {
		if id == chatID {
			return chatIDs
		}
	}
	return append(chatIDs, chatID)
}
