import React, { Component } from 'react';

export default class AudioDemo extends Component {

  constructor(props) {
    super(props);
    this.audioContext = new AudioContext();
  }

  componentDidMount() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  voiceCreate(e) {
    this.voiceGenerate(e.target.value);
  }

  voiceGenerate(type) {
    if (this.audioContext.state === 'running') {
      this.audioContext.close();
      this.audioContext = new AudioContext(); 
    }
    const { audioContext } = this;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const analyser = audioContext.createAnalyser();

    oscillator.connect(analyser);
    analyser.connect(gain);
    gain.connect(audioContext.destination);

    analyser.fftSize = 1024;
    gain.gain.setValueAtTime(1, 0.01);
    oscillator.type = type;
    oscillator.frequency.value = 440;
    oscillator.start();
    
    this.canvasRender(analyser);
  }

  canvasRender(analyser) {
    const { canvas, ctx } = this;
    const arr = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteTimeDomainData(arr);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    for (let i = 0; i < arr.length; i++) {
      ctx.lineTo(i, arr[i]);
    }
    ctx.strokeStyle = '#FFA500';
    ctx.stroke();
    ctx.closePath();
    requestAnimationFrame(this.canvasRender.bind(this, analyser));
  }

  render() {
    const inputStyle = {
      margin: '20px 10px 0 20px'
    };
    return (
      <div style={{textAlign: 'left'}}>
        <section>
          <input style={inputStyle} type="radio" value="sine" name="audio" onClick={this.voiceCreate.bind(this)} />正弦
        </section>
        <section>
          <input style={inputStyle} type="radio" value="square" name="audio" onClick={this.voiceCreate.bind(this)} />方形
        <section>
        </section>
          <input style={inputStyle} type="radio" value="sawtooth" name="audio" onClick={this.voiceCreate.bind(this)} />锯齿
        </section>
        <section>
          <input style={inputStyle} type="radio" value="triangle" name="audio" onClick={this.voiceCreate.bind(this)} />三角
        </section>

        <canvas id='canvas' width='500' height='300'></canvas>
      </div>
    );
  }
};
