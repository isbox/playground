import React, { Component } from 'react';
import axios from 'axios';

const convolutionInfo = [
  {
      name: '电话',
      mainGain: 0.0,
      sendGain: 3.0,
      url: '/audio/filter-telephone.wav'
  },
  {
      name: '室内',
      mainGain: 1.0,
      sendGain: 2.5,
      url: '/audio/spreader50-65ms.wav'
  },
  {
      name: '山洞',
      mainGain: 0.0,
      sendGain: 2.4,
      url: '/audio/feedback-spring.wav'
  },
  {
      name: '教堂',
      mainGain: 1.8,
      sendGain: 0.9,
      url: '/audio/s2_r4_bd.wav'
  },
  {
      name: '厨房',
      mainGain: 0.6,
      sendGain: 3.0,
      url: '/audio/kitchen-true-stereo.wav'
  },
  {
      name: '洗手间',
      mainGain: 0.6,
      sendGain: 2.1,
      url: '/audio/living-bedroom-leveled.wav'
  }
];

export default class AudioDemo02 extends Component {
  constructor(props) {
    super(props);
    this.audioContext = new AudioContext();
    this.gainNode = null;
  }

  componentDidMount() {
  }

  musicReady(e) {
    this.musicPlayer(e.target.files[0]);
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

  async musicPlayer(file) {
    const { audioContext } = this;
    const fileBuffer = await this.fileToBuffer(file)
    const buffer = await audioContext.decodeAudioData(fileBuffer);
    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();
    const convolver = audioContext.createConvolver();
    this.gain = gain;
    this.convolver = convolver;
    source.buffer = buffer;
    source.connect(convolver);
    source.connect(this.gain);
    this.gain.connect(audioContext.destination);
    source.start();
  }

  async musicTurning(convolut) {
    const res = await axios.get(convolut.url, {
      headers: {
        'Accept': 'aduio/wav'
      },
      responseType: 'blob'
    });
    this.conGain && (this.conGain.gain.value = 0);
    const fileBuffer = await this.fileToBuffer(res.data);
    const buffer = await this.audioContext.decodeAudioData(fileBuffer);
    const conGain = this.audioContext.createGain();
    this.conGain = conGain;
    this.convolver.buffer = buffer;
    this.convolver.connect(conGain);
    conGain.connect(this.audioContext.destination);
    conGain.gain.value = convolut.sendGain;
    this.gain.value = convolut.mainGain;
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
    }
    return (
      <div>
        {
          convolutionInfo.map((convolut, index) => (
            <div style={{textAlign: 'left', margin: '10px 30px'}} key={index}>
              <label htmlFor={`r-${index}`}>
                <input id={`r-${index}`} onChange={() => this.musicTurning(convolut)} type="radio" name="music" />
                <span style={{padding: '5px 5px'}}>{convolut.name}</span>
              </label>
            </div>
          ))
        }
        <h3>选择一首音乐开始演奏</h3>
        <button style={btnStyle}>
          file upload
          <input
            accept="audio/*"
            onChange={this.musicReady.bind(this)}
            style={inputStyle} type="file"
          />
        </button>
      </div>
    );
  }
};
