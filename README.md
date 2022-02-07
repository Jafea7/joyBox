# JoyBox
## Features
+ Stream recording
+ Built-in player
+ Push notifications
+ Web interface
## Providers
+ bongacams
+ chaturbate
+ camsoda
## How to run
`docker build -t joybox .`

`docker run --name joybox --rm -d -p 8080:80 -p 8081:443 -v $(pwd):/app/data joybox`

Or with docker-compose:
```
version: '3.3'
services:
  joybox:
    image: joybox
    container_name: joybox
    ports:
      - '8080:80'
      - '8081:443'
    volumes:
      - './archive:/app/data'
```

Open `http://host:8080` or `https://host:8081`

## Settings
All files should be in the mounted folder
### SSL

`server.cer` & `server.key`

### Push notifications

`vapid.json`
```json
{
    "subject": "mailto:service@example.com",
    "privateKey": "",
    "publicKey": ""
}
```
