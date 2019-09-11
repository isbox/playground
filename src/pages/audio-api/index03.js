import React, { Component } from 'react';
import './index03.scss';

export default class AudioDemo02 extends Component {
  constructor(props) {
    super(props);
    this.audioContext = new AudioContext();
    this.gainNode = null;
    this.r = 100;
    this.state = {
      x: 0,
      y: 0,
      z: 0
    };
  }

  componentDidMount() {
    
  }

  fileToBuffer(file) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return new Promise(resolve => {
      reader.onload = () => {
        resolve(reader.result);
      }
    });
  }

  musicReady(e) {
    this.musicPlayer(e.target.files[0]);
  }

  async musicPlayer(file) {
    const { audioContext } = this;
    const fileBuffer = await this.fileToBuffer(file)
    const buffer = await audioContext.decodeAudioData(fileBuffer);
    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();
    const panner = audioContext.createPanner();
    this.panner = panner;
    this.panner.setPosition(0, 0, 0);
    this.gain = gain;
    this.gain.gain.setValueAtTime(1, 0.1);
    source.buffer = buffer;
    source.connect(this.panner);
    this.panner.connect(this.gain)
    this.gain.connect(audioContext.destination);
    source.start();
    this.threeDMove();
  }

  threeDMove() {
    const speed = 2;
    const r = 1;
    let deg = 0;
    setInterval(() => {
      deg = deg += speed;
      if (deg >= 360) {
        deg = 0;
      }
      const x = Math.sin(r * Math.PI / 180 * deg);
      const y = Math.cos(r * Math.PI / 180 * deg);
      this.panner.setPosition(x * .5, y * .5, y * 2);
      this.setState({
        x,
        y
      });
    }, 30);
  }

  // positionChange(position, e) {
  //   const { velocity = {} } = this.state;
  //   velocity[position] = e.target.value;
  //   this.panner.setPosition(velocity[position] || 0, vel.y || 0, vel.z || 0);
  // }

  render() {
    const { x, y } = this.state;
    const btnStyle = {
      width: '120px',
      height: '40px',
      lineHeight: '40px',
      fontSize: '18px',
      cursor: 'pointer',
      border: '1px solid lightblue',
      position: 'relative',
      overflow: 'hidden'
    }
    const inputStyle = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      position: 'absolute',
      opacity: 0
    };
    const rangeStyle = {
      width: '300px',
      margin: '20px 0',
      color: 'lightblue'
    };
    const roundStyle = {
      top: y * this.r,
      left: x * this.r
    }
    return (
      <div>
        <h3>选择一首音乐开始演奏</h3>
        {/* <section>
          X: <input style={rangeStyle} defaultValue="0" onChange={this.positionChange.bind(this, 'x')} type="range" max="10" min="-10" />
        </section>
        <section>
          Y: <input style={rangeStyle} defaultValue="0" type="range" onChange={this.positionChange.bind(this, 'y')} max="10" min="-10" />
        </section>
        <section>
          Z: <input style={rangeStyle} defaultValue="0" type="range" onChange={this.positionChange.bind(this, 'z')} max="10" min="-10" />
        </section> */}
        <button style={btnStyle}>
          file upload
          <input
            accept="audio/*"
            onChange={this.musicReady.bind(this)}
            style={inputStyle} type="file"
          />
        </button>
        <div className="wrapper">
          <div className="boll">
            <div style={roundStyle} className="round"></div>
          </div>
        </div>
      </div>
    );
  }
};
