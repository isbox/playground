import React, { Component } from 'react';

export default class AudioDemo04 extends Component {
  constructor(props) {
    super(props);
    this.audioContext = new AudioContext();
    this.count = 0;
    this.counts = 0;
    // this.gainNode = null;
  }

  componentDidMount() {
    this.canvas = document.querySelector('#canvas');
    this.canvass = document.querySelector('#canvass');
    this.canvas.width = this.canvass.width = 702;
    this.canvas.height = this.canvass.height = 300;
    this.ctx = this.canvas.getContext('2d');
    this.ctxs = this.canvass.getContext('2d');
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
    gain.gain.setValueAtTime(1, 0.1);
    source.buffer = buffer;
    source.start();

    this.drawAnalyser(analyser);
  }

  audioAnalysis() {
    const analysis = this.audioContext.createAnalyser();
    analysis.smoothingTimeConstant = 0.4;
    return analysis;
  }

  drawAnalyser(analyser) {
    const draw = (analyser => {
      const blockWidth = 10;
      const frequencyArr = new Uint8Array(analyser.fftSize);
      const timeDomainArr = new Uint8Array(analyser.fftSize);
      const { canvas, ctx, canvass, ctxs } = this;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctxs.clearRect(0, 0, canvass.width, canvass.height);
      analyser.getByteFrequencyData(frequencyArr);
      analyser.getByteTimeDomainData(timeDomainArr);

      for (const frequency of frequencyArr) {
        ctx.fillRect(this.count * blockWidth + this.count, canvas.height, blockWidth, -frequency * .5);
        ctx.fillStyle = '#FFA500';
        this.count += 1;
      }

      ctxs.beginPath();
      ctxs.moveTo(0, canvass.height - timeDomainArr[0]);
      ctxs.lineWidth = 2;
      for (const timeDomain of timeDomainArr) {
        ctxs.lineTo(this.counts * blockWidth / 3, canvass.height - timeDomain);
        this.counts += 1;
      }
      ctxs.strokeStyle = '#FFA500';
      ctxs.stroke();
      ctxs.closePath();
      this.count = 0;
      this.counts = 0;
      requestAnimationFrame(draw);
    }).bind(this, analyser);
    draw();
  }

  render() {
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
    return (
      <section>
        <h3>选择一首音乐开始分析</h3>
        <canvas style={{margin: '20px auto'}} id="canvas"></canvas>
        <canvas style={{margin: '20px auto'}} id="canvass"></canvas>
        <div>
          <button style={btnStyle}>
            file upload
            <input
              accept="audio/*"
              onChange={this.musicReady.bind(this)}
              style={inputStyle} type="file"
            />
          </button>
        </div>
      </section>
    );
  }
};
