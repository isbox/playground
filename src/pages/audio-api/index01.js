import React, { Component, Fragment } from 'react';

const VOICE_MAP = {
  0: [261.63, 293.67, 329.63, 349.23, 391.99, 440, 493.88],
  1: [523.25, 587.33, 659.26, 698.46, 783.99, 880, 987.77],
  2: [1046.5, 1174.66, 1318.51, 1396.92, 1567.98, 1760, 1975.52]
};

const KEY_TYPE = {
  0: '低',
  1: '中',
  2: '高'
};


const song = [
  {val: 1318.51}, {val: 1396.92}, {val: 1567.98}, {val: 1567.98}, {val: 1567.98}, {val: 1318.51}, {val: 1174.66},
  {val: 1174.66}, {val: 1567.98}, {delay: true}, {stop: 50}, {stop: 50}, {val: 1046.5}, {val: 1046.5},
  {val: 880}, {val: 1318.51}, {val: 1318.51}, {val: 1046.5}, {val: 880}, {delay: true}, {val: 1318.51},
  {delay: true}, {stop: 50}, {stop: true}, {val: 880}, {val: 1046.5}, {val: 1046.5}, {val: 880}, {val: 783.99},
  {val: 783.99}, {val: 1046.5}, {delay: true}, {stop: 50}, {stop: true}, {val: 1396.92},{val: 1318.51},
  {val: 1046.5}, {val: 1174.66}, {val: 1318.51}, {delay: true}, {val: 1174.66}, {stop: true}, {stop: true},
  {val: 1567.98}, {val: 1567.98}, {val: 1567.98},{val: 1318.51}, {val: 1318.51}, {delay: true}, {val: 1567.98},
  {val: 1567.98}, {val: 1174.66}, {stop: true}, {stop: true}, {val: 1046.5}, {val: 1318.51}, {val: 1318.51},
  {val: 1046.5}, {val: 987.77}, {delay: true}, {val: 1318.51}, {stop: true}, {stop: true}, {val: 880},
  {val: 1046.5}, {val: 1046.5}, {val: 1760}, {val: 1567.98}, {delay: true}, {val: 880}, {val: 1046.5},
  {val: 1174.66}, {val: 1318.51}, {stop: true}, {stop: true}, {val: 1396.92}, {val: 1318.51}, {val: 1046.5},
  {val: 1174.66}, {delay: true}, {delay: true}, {stop: true}
];

function sleep(delay = 80) {
  return new Promise(r =>
    setTimeout(() => {
      r();
    }, delay)
  );
}

export default class AudioDemo extends Component {
  constructor(props) {
    super(props);
    this.audioContext = new AudioContext();
    this.oscillatorNode = null;
    this.gainNode = null;
  }

  componentDidMount() {
  }

  voicePlayer(frequency) {
    const { audioContext } = this;
    this.gainNode && this.gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.1);
    this.oscillatorNode && this.oscillatorNode.stop(audioContext.currentTime + 0.1);
    this.oscillatorNode = audioContext.createOscillator();
    this.gainNode = audioContext.createGain();

    const { oscillatorNode, gainNode } = this;
    oscillatorNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    console.log(oscillatorNode.frequency);
    oscillatorNode.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.1);

    oscillatorNode.start(audioContext.currentTime);
  }

  voiceStop() {
    const { audioContext, oscillatorNode, gainNode } = this;
    gainNode && gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillatorNode && oscillatorNode.stop(audioContext.currentTime + 0.1);
    this.oscillatorNode = this.gainNode = null;
  }

  async sing() {
    while(song.length) {
      await sleep(300);
      const tone = song.shift();
      if (tone.delay) {
        continue;
      }
      if (tone.stop) {
        continue;
      }
      await sleep(50);
      this.voicePlayer(tone.val);
    }
    this.voiceStop();
  }

  render() {
    const categoryStyle = {display: 'flex', alignItems: 'center', justifyContent: 'center'};
    const playSoundBtnStyle = {padding: '10px 20px', margin: '10px', border: '1px solid lightblue', cursor: 'pointer'};
    return (
      <Fragment>
        {
          Object.entries(VOICE_MAP).map(([key, val]) => (
            <div key={key} style={categoryStyle}>
              {KEY_TYPE[key]}：
              {
                val.map((frequency, index) => (
                  <div
                    key={index}
                    style={playSoundBtnStyle}
                    onMouseDown={() => this.voicePlayer(frequency)}
                    onMouseUp={this.voiceStop.bind(this)}
                  >
                      {index + 1}
                  </div>
                ))
              }
            </div>
          ))
        }
        <div style={{marginTop: '40px'}}>
          <button
            style={{width: 100, height: 50, cursor: 'pointer', border: 'none', background: '#ccc', outline: 'none', borderRadius: 4}}
            onClick={this.sing.bind(this)}>
            <span role="img" aria-hidden="true">🎤</span>
          </button>
        </div>
      </Fragment>
    );
  }
};
