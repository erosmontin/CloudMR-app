# CloudMR-app

```bash
sam build --use-container

sam deploy --guided
```

in case deployment fails, 
```
cd ROISignedURL
npm update
cd ..

```
then repeat build and deployment

| api | info | route |
| -- | -- | -- |
|login API | post {'email':'x','password':'xx'}| /logout|
|logout API | post jwt auth| /logout|