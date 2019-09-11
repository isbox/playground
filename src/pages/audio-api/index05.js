import React, { Component } from 'react';

export default class AudioDemo05 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gain: 0,
      start: false,
      deg: 0
    };
    this.audioContext = new AudioContext();
    this.gainValueChange = this.gainValueChange.bind(this);
    this.center = {
      x: 450,
      y: 136
    }
  }

  componentDidMount() {
    document.addEventListener('mouseup', () => {
      this.setState({ start: false });
      document.removeEventListener('mousemove', this.gainValueChange);
    });
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
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 128;
    source.connect(analyser);
    analyser.connect(gain);
    gain.connect(audioContext.destination);
    gain.gain.value = 0;
    source.buffer = buffer;
    source.start();
    this.gain = gain;
  }

  gainContrl() {
    this.setState({ start: true }, () => {
      document.addEventListener('mousemove', this.gainValueChange);
    });
  }

  gainValueChange(e) {
    const { x, y } = this.center;
    let { gain } = this.state;
    if (this.state.start) {
      let deg = Math.atan((e.pageY - y) / (e.pageX - x)) * 180;
      deg >= 35 && (deg = 35);
      deg <= -35 && (deg = -35);
      gain += deg * 0.05;
      gain >= 100 && (gain = 100);
      gain <= 0 && (gain = 0);
      this.setState({ deg, gain });
    }
  }

  render() {
    const { deg, gain } = this.state;
    const btnStyle = {
      width: '200px',
      height: '40px',
      lineHeight: '40px',
      fontSize: '18px',
      cursor: 'pointer',
      border: '1px solid lightblue',
      position: 'relative',
      overflow: 'hidden',
      margin: 20
    }
    const inputStyle = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      position: 'absolute',
      opacity: 0
    };
    const gainStyle = {
      width: 300,
      margin: '50px auto',
      background: '#dbdbdb',
      padding: '20px 0',
      transform: `rotate(${deg}deg)`
    };
    this.gain && (this.gain.gain.value = gain / 100);
    return (
      <section>
        <h3>音量调节</h3>
        <div id="control" style={gainStyle}>
          <div
            onMouseDown={this.gainContrl.bind(this, 'left')}
            id="left"
            style={{width: 30, height: 30, display: 'inline-block', cursor: 'pointer'}}>
          </div>
          <input style={{width: '70%'}} type="range" value={gain} max={100} />
          <div
            onMouseDown={this.gainContrl.bind(this, 'right')}
            id="right"
            style={{width: 30, height: 30, display: 'inline-block', cursor: 'pointer'}}>
          </div>
        </div>
        <p>当前音量{Math.ceil(gain)}</p>
        <div style={{marginTop: 50}}>
          <button style={btnStyle}>
            file upload
            <input
              accept="audio/*"
              onChange={this.musicReady.bind(this)}
              style={inputStyle} type="file"
            />
          </button>
        </div>
        <div>
          <button style={btnStyle} onClick={() => {this.gain.gain.value = 1;}}>直接变为最大</button>
          <button style={btnStyle} onClick={() => {this.gain.gain.setValueAtTime(1, this.audioContext.currentTime + 5);}}>5s后变为最大</button>
          <button style={btnStyle} onClick={() => {this.gain.gain.linearRampToValueAtTime(2, this.audioContext.currentTime + 5);}}>5s内线性变化</button>
          <button style={btnStyle} onClick={() => {this.gain.gain.value = 0.1; this.gain.gain.exponentialRampToValueAtTime(2.0, this.audioContext.currentTime + 5);}}>5s内指数变化</button>
          <button style={btnStyle} onClick={() => {this.gain.gain.setValueCurveAtTime([0.1, 0.5, 1, 2, 1, 0, 1.5], this.audioContext.currentTime + 0, this.audioContext.currentTime + 20);}}>20s内平滑曲线变化</button>
        </div>
      </section>
    );
  }
};
