import React, { Component } from 'react';
const TYPE = ['lowpass', 'highpass', 'lowshelf', 'highshelf'];
const PARAMS = [{
  type: 'frequency',
  max: 9000,
  min: 0
}, {
  type: 'Q',
  max: 30,
  min: -30
}, {
  type: 'gain',
  max: 30,
  min: -30
}, {
  type: 'detune',
  max: 100,
  min: -100
}];

export default class AudioDemo05 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterType: {
        frequency: 0,
        Q: 0,
        gain: 0
      }
    };
    this.audioContext = new AudioContext();
  }

  componentDidMount() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');
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

  canvasRender = (analyser) => {
    const blockWidth = 5;
    const { canvas, ctx } = this;
    const arr = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(arr);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFA500';
    for (let i = 0; i < arr.length; i++) {
      ctx.fillRect(i * blockWidth + 1, canvas.height, blockWidth, -arr[i]);
    }

    requestAnimationFrame(this.canvasRender.bind(this, analyser));
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
    const analyser = audioContext.createAnalyser();
    const biquadFilter = audioContext.createBiquadFilter()
    biquadFilter.type = 'peaking';
    analyser.fftSize = 512;
    source.connect(analyser);
    analyser.connect(biquadFilter);
    biquadFilter.connect(gain);
    gain.connect(audioContext.destination);
    gain.gain.value = 1;
    source.buffer = buffer;
    source.start();

    this.canvasRender(analyser);
    this.biquadFilter = biquadFilter;
  }

  typeChange = (e) => {
    this.biquadFilter.type = e.target.innerText;
  }

  valueChange = type => {
    return e => {
      const { filterType } = this.state;
      const val = Number(e.target.value);
      this.biquadFilter[type].value = val;
      this.setState({
        filterType: { ...filterType, [type]: val }
      });
    }
  }

  render() {
    const { filterType } = this.state;
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
    console.log(filterType);
    return (
      <section>
        <h3>均衡器</h3>
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
        <section>
          <canvas id="canvas" width="700" height="300" />
        </section>
        <div>
          {TYPE.map(tp => <button style={btnStyle} onClick={this.typeChange}>{tp}</button>)}
        </div>
        <div>
          {PARAMS.map(pm => (
            <section style={{margin: 20}}>
              <input
                style={{width: 400}}
                defaultValue={0}
                type="range"
                min={pm.min}
                max={pm.max}
                onChange={this.valueChange(pm.type)}
              />
              <span style={{width: 120, display: 'inline-block'}}>{pm.type} [{filterType[pm.type]}]</span>
            </section>
          ))}
        </div>
      </section>
    );
  }
};
