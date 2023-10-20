# CloudMR-app

```bash
sam build --use-container
sam deploy --guided
```

| api | reuwst | route |
| -- | -- | -- |
|login API | post {'email':'x','password':'xx'}| /logout|
|logout API | post jwt auth| /logout|