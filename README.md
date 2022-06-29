# WebDownload

## Usage
WebDownload is an nodejs app to download a website for offline usage. 

### Disclaimer! 
The application does only provide a static version of a website. It is not able to execute the code from the original website.

## Example



## Dependencies
- Client
  - react 
  - react-bootstrap (Frontend-CSS-Library)
  - socket.io-client (Communication)
  - ...
- Server
  - socket.io (Communication)
  - jszip (Zip-Management)
  - ...

## Deployment

Website is on https://web-down-load.herokuapp.com/ deployed.
Commands:
  - heroku login
  - heroku git:remote -a "web-down-load"     
  - git subtree push --prefix app heroku main
  - git push heroku master
  - heroku open
  





