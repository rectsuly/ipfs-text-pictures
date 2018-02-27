ipfs-text-pictures
========================

> A simple way to upload text and pictures on IPFS.

![mark](http://ox90kdrp0.bkt.clouddn.com/pic/180227/HAIHL6i2jE.gif)

## Table of Content

- [Features](#features)
- [Install](#install)
- [Run](#run)
- [License](#license)

## Features
* Add text to ipfs via the "提交到IPFS" button
* Read the text from ipfs that added before
* Add pictures files to ipfs via the "选择文件"  and Submit button
* Show the picture and its ipfs url below the button

## Install

* Make sure you have installed the newest node.js version.
* Install react through npm:

```bash
> npm install -g create-react-app
```

To interact with the API, you need to have a local daemon running. It needs to be open on the right port. `5001` is the default, and is used in the examples below, but it can be set to whatever you need.

```sh
# Show the ipfs config API port to check it is corret
> ipfs config Addresses.API
/ip4/127.0.0.1/tcp/5001
# Set it if it does not match the above output
> ipfs config Addresses.API /ip4/127.0.0.1/tcp/5001
# Restart the daemon after changing the config

# Run the daemon
> ipfs daemon
```

* Importing the module and usage

```javascript
var ipfsAPI = require('ipfs-api')

// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'}) // leaving out the arguments will default to these values

// or connect with multiaddr
var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')

// or using options
var ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'})
```

* CORS

In a web browser IPFS API (either browserified or CDN-based) might encounter an error saying that the origin is not allowed. This would be a CORS ("Cross Origin Resource Sharing") failure: IPFS servers are designed to reject requests from unknown domains by default. You can whitelist the domain that you are calling from by changing your ipfs config like this:

```bash
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"http://example.com\"]"
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"
```

* Create react app

```bash
> create-react-app ipfs-demo
```

* Install js-ipfs-api

```bash
> npm install --save ipfs-api
```

* edit src/App.js , you can copy the codes at this project directly

## Run

```bash
npm start
```

You can see the features as above.

## License

MIT © rectsuly


