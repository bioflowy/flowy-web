package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"syscall"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go/aws"
	flowyd "github.com/bioflowy/flowy-web/deamon/client"
	"github.com/google/uuid"
)

func execJobs(client *flowyd.ClientWithResponses, hostname string, cxt context.Context, s3client *s3.Client) {
	param := flowyd.GetJobsJSONRequestBody{
		 NodeName: hostname}
	res, err := client.GetJobsWithResponse(cxt, param)
	if err != nil {
		fmt.Printf(err.Error())
		return
	}
	jobs := res.JSON200
	if jobs == nil {
		return
	}
	for _, job := range *jobs {
			// コマンド
	reqbody := flowyd.PostJobsJobIdJSONRequestBody{
		Status: "running",
	}
	_, err = client.PostJobsJobId(cxt,job.Id,reqbody)
	if err != nil {
		log.Fatal(err.Error())
	}

		go execJob(client, cxt, job.Id, s3client)
	}
}
func downloadResource(client *flowyd.ClientWithResponses,name string,resourceId int, ctx context.Context, s3client *s3.Client) error {
	resource, err := client.GetResourcesResourceIdWithResponse(ctx,resourceId)
	if err != nil {
		return fmt.Errorf("Failed to open file: %v", err)
	}
	downloadFileToS3(ctx,s3client,*resource.JSON200.Path,name)
	return nil
}

func uploadResource(client *flowyd.ClientWithResponses,name string,resourceId int, workdirPath string,ctx context.Context, s3client *s3.Client) error {
	basename := filepath.Base(name)
	key := fmt.Sprintf("%s/%s", workdirPath, basename)
	uploadFileToS3(s3client, "cira-aws-galaxy-files", name , key)
	log.Printf("uploaded2 %s to cira-aws-galaxy-files", name)
	file, err := os.Open(name)
	if err != nil {
		return fmt.Errorf("failed to open file: %v", err)
	}
	defer file.Close()

	stat, err := file.Stat()
	p := fmt.Sprintf("s3://%s/%s", "cira-aws-galaxy-files", key)
	log.Printf("uploaded %s to %s", name, p)
	size := stat.Size()
	reqbody := flowyd.PostResourcesResourceIdJSONRequestBody{
		Status:   "finished",
		Path: &p,
		Size: &size,
	}

	_, err = client.PostResourcesResourceIdWithResponse(ctx, resourceId, reqbody)
	if err != nil {
		log.Fatal(err.Error())
	}
	return nil
}
func execJob(client *flowyd.ClientWithResponses, ctx context.Context, jobId int, s3client *s3.Client) {
	newUUID, err := uuid.NewRandom()
	if err != nil {
		fmt.Printf("Error generating UUID: %v\n", err)
		return
	}
	wd,err := os.Getwd()
	if err != nil {
		log.Fatal(err.Error())
	}
	jobWorkDir := filepath.Join(wd,"workdirs",newUUID.String())

	log.Printf("exec job %d at %s", jobId,jobWorkDir)
	os.MkdirAll(jobWorkDir,0775)
	res ,err := client.GetJobsJobIdWithResponse(ctx,jobId)
	if err != nil {
		log.Fatal(err.Error())
	}
	job := res.JSON200
	fmt.Printf("id=%d,name=%s,cmd=%s\n", job.Id, job.Name, strings.Join(job.Command, " "))
	
	for _,input := range job.Inputs {
		res, err := client.GetResourcesResourceIdWithResponse(ctx,input.ResourceId)
		if err != nil {
			log.Fatal(err.Error())
		}
		resource := res.JSON200
		downloadFilePath := filepath.Join(jobWorkDir,input.Name)
		downloadFileToS3(ctx,s3client,*resource.Path,downloadFilePath)
	}
	cmd := exec.Command(job.Command[0], job.Command[1:]...)
	cmd.Dir = jobWorkDir

	err = cmd.Run()
	if err != nil {
		if exitError, ok := err.(*exec.ExitError); ok {
			waitStatus := exitError.Sys().(syscall.WaitStatus)
			exitCode := waitStatus.ExitStatus()
			reqbody := flowyd.PostJobsJobIdJSONRequestBody{
				Status:   "finished",
				ExitCode: exitCode,
			}
			client.PostJobsJobId(ctx,job.Id,  reqbody)
		}
	} else {
		reqbody := flowyd.PostJobsJobIdJSONRequestBody{
			Status:   "finished",
			ExitCode: 0,
		}
		client.PostJobsJobId(ctx,job.Id, reqbody)
		for _, output := range job.Outputs {
			outputFilePath := filepath.Join(jobWorkDir,output.Name)
			uploadResource(client, outputFilePath,output.ResourceId,newUUID.String(), ctx, s3client)
		}
	}
//	os.RemoveAll(jobWorkDir)
}
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
func uploadFileToS3(client *s3.Client, bucket, filePath string,key string) error {
	log.Printf("uploading %s to %s", filePath, bucket)

	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("Failed to open file: %v", err)
	}
	defer file.Close()

	_, err = file.Stat()
	if err != nil {
		return fmt.Errorf("Failed to get file info: %v", err)
	}

	input := &s3.PutObjectInput{
		Bucket:      aws.String(bucket),
		Key:         aws.String(key),
		Body:        file,
		ContentType: aws.String("application/octet-stream"),
	}

	_, err = client.PutObject(context.Background(), input)
	if err != nil {
		return fmt.Errorf("Failed to put object: %v", err)
	}

	log.Printf("uploaded %s to %s", filePath, bucket)
	return nil
}
func parseS3Url(url string)( string,string) {
	noScheme := strings.TrimPrefix(url, "s3://")

	// 最初のスラッシュ(/)の位置を検索します
	slashIndex := strings.Index(noScheme, "/")

	// バケット名を抽出します
	bucketName := noScheme[:slashIndex]

	// キーを抽出します
	key := noScheme[slashIndex+1:]
	return bucketName,key
}
func downloadFileToS3(ctx context.Context,client *s3.Client, s3url string, localFilePath string) error {
	log.Printf("downloading %s to %s", s3url, localFilePath)
	bucket, key := parseS3Url(s3url)
	result,err := client.GetObject(ctx,&s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return err
		
	}
	defer result.Body.Close()
	file, err := os.Create(localFilePath)
	if err != nil {
		return err
	}
	defer file.Close()

	// S3からのデータをローカルファイルに書き込みます
	numBytes, err := io.Copy(file, result.Body)
	if err != nil {
	return err
	}

	log.Printf("downloaded %s to %s(%d)", s3url, localFilePath,numBytes)
	return nil
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
	cfg, err := config.LoadDefaultConfig(cxt)
	if err != nil {
		fmt.Printf("Failed to load SDK configuration: %v\n", err)
		os.Exit(1)
	}

	s3Client := s3.NewFromConfig(cfg)
	go reportNodeStatus(client, hostname, cxt)
	for {
		execJobs(client, hostname, cxt, s3Client)
		time.Sleep(time.Duration(1) * time.Second)

	}
}
