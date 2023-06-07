package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"runtime"
	"syscall"
	"time"

	flowyd "github.com/bioflowy/flowy-web/deamon/client"
)
func reportNodeStatus(client *flowyd.ClientWithResponses, hostname string, cxt context.Context) error {
	cpuNum := runtime.NumCPU()

	// メモリ量を取得
	var sysInfo syscall.Sysinfo_t
	err := syscall.Sysinfo(&sysInfo)
	if err != nil {
		return err
	}
	// メモリ量をバイト単位で計算
	totalMem := (int)(sysInfo.Totalram * uint64(sysInfo.Unit) / 1024 / 1024)
	for {
		_, err := client.PostNode(cxt, flowyd.PostNodeJSONRequestBody{
			Name:   hostname,
			Status: "idle",
			Cpu:    cpuNum,
			Memory: totalMem,
		})
		if err != nil {
			return err
		}
		//log.Print("report node status")
		time.Sleep(time.Duration(100) * time.Second)
	}
}

func main() {
	cxt := context.Background()
	client, err := flowyd.NewClientWithResponses("http://localhost:3000/api")
	if err != nil {
		fmt.Printf("error")
		return
	}
	hostname, err := os.Hostname()
	if err != nil {
		log.Fatal(err.Error())
		return
	}
	reportNodeStatus(client, hostname, cxt)
}
