import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host:'localhost', port:'5001', protocal:'http'});

function Utf8ArrayToStr(array) {
  var out, i, len, c;
  var char2, char3;
  out = "";
  len = array.length;
  i = 0;
  while(i < len) {
    c = array[i++];
    switch(c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx 10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx 10xx xxxx 10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
        break;
      default:
        break;
    }
  }
  return out;
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      strHash: null,
      strContent: null,
      imgSrc: null
    }
  }

  saveTextBlobOnIpfs = (blob) => {
    return new Promise(function(resolve, reject) {
      const descBuffer = Buffer.from(blob, 'utf-8');
      ipfs.add(descBuffer).then((response) => {
        console.log(response)
        resolve(response[0].hash);
      }).catch((err) => {
        console.error(err)
        reject(err);
      })
    })
  }

  saveImageOnIpfs = (reader) => {
    return new Promise(function(resolve, reject) {
      const buffer = Buffer.from(reader.result);
      ipfs.add(buffer).then((response) => {
        console.log(response)
        resolve(response[0].hash);
      }).catch((err) => {
        console.error(err)
        reject(err);
      })
    })
  }

  render() {
    return (
      <div className="App">
        <input
          ref="ipfsContent"
          style={{width:200,height:30}}/>
        <button onClick={() => {
          let ipfsContent = this.refs.ipfsContent.value;
          console.log(ipfsContent);
          this.saveTextBlobOnIpfs(ipfsContent).then((hash) => {
            console.log(hash);
            this.setState({strHash: hash});
          });
        }}>提交到IPFS</button>

        <p>{this.state.strHash}</p>

        <button onClick={() => {
          console.log('从ipfs读取数据')
          ipfs.cat(this.state.strHash).then((stream) => {
            console.log(stream);
            let strContent = Utf8ArrayToStr(stream);
            console.log(strContent);
            this.setState({strContent: strContent});
          });
        }}>读取数据</button>
        <h1>{this.state.strContent}</h1>

        <h2>上传图片到IPFS: </h2>
        <div>
          <label id="file">Choss file to upload</label>
          <input type="file" ref="file" id="file" name="file" nultiple="multiple"/>
        </div>
        <div>
          <button onClick={() => {
            var file = this.refs.file.files[0];
            var reader = new FileReader();
            // reader.readAsDataURL(file);
            reader.readAsArrayBuffer(file)
            reader.onloadend = (e) => {
              console.log(reader);
              // 上传数据到IPFS
              this.saveImageOnIpfs(reader).then((hash) => {
                console.log(hash);
                this.setState({imgSrc: hash})
              });
            }
          }}>Submit</button>
        </div>
        {
          this.state.imgSrc
            ? <div>
                <h2>{"http://localhost:8080/ipfs/" + this.state.imgSrc}</h2>
                <img alt="Sily" style={{width:80,height:80}} src={"http://localhost:8080/ipfs/" + this.state.imgSrc}/>
              </div>
            : <img alt=""/>
        }

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
