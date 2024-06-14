package main

import (
	"bot/logger"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"
)

func main() {
	errors := make(chan error)
	var wg sync.WaitGroup

	stop := make(chan struct{})
	go func() {
		sig := make(chan os.Signal, 1)
		signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
		<-sig
		close(stop)
		close(errors)
	}()
	logger.SendMessage("initialing code at " + time.Now().String())
	wg.Add(2)
	go Server()
	go logger.Telegram()

	<-stop
	close(errors)
	wg.Wait()
}
