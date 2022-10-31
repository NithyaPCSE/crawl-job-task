# Crawl Job Task

## Installation

```bash
  git clone https://github.com/NithyaPCSE/crawl-job-task.git
```

Go to the project directory

```bash
  cd crawl-job-task
```

Start Docker Desktop and build docker containers

```bash
  docker-composer up --build
```

## Import database

open http://localhost:5050/ to access pgAdmin

Run the query from database/db.sql

Then open http://localhost:3000/

## API Reference

#### Create Job

```http
  POST /api/job/create
```
Payload
```
{
    "job_name":"job 2",
    "job_url" : "Job url"
}

```

#### Update Job

```http
  POST /api/job/update
```
Payload
```
{
    "job_id":"7e1fb8d8-1f79-4fc4-bcde-b4d0f9e96984",
    "job_status" : "completed"
}

```

#### Get All Job

```http
  GET /api/job/
```

#### Get Job By Status

```http
  GET /api/job/${status} 
```
Example 
```
localhost:3001/api/job/completed
```


#### Web Crawling with product url

```http
  POST /api/crawling
```

Payload
```
{
    "url":"https://www.flaconi.de/make-up/lancome/lash-idole/lancome-lash-idole-mascara.html#sku=80056266-9-1"
}
```
