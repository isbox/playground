import React, { Component } from 'react';
import axios from 'axios';

export default class AudioDemo06 extends Component {
  constructor(props) {
    super(props);
    this.audioContext = new AudioContext();
    this.dynamicsCompressor = this.audioContext.createDynamicsCompressor();
    this.playNoMerge = this.playNoMerge.bind(this);
    this.playMerge = this.playMerge.bind(this);
  }

  async componentDidMount() {
    const { audioContext } = this;
    this.audio1 = audioContext.createBufferSource();
    this.audio2 = audioContext.createBufferSource();
    // this.audio3 = audioContext.createBufferSource();
    // this.audio4 = audioContext.createBufferSource();

    const buff1 = await this.getAudio('/audio/music/1.mp3')
    const buff2 = await this.getAudio('/audio/music/2.mp3')
    // const buff3 = await this.getAudio('/audio/mario/triangle.mp3')
    // const buff4 = await this.getAudio('/audio/mario/noise.mp3')

    this.audio1.buffer = await audioContext.decodeAudioData(buff1.data);
    this.audio2.buffer = await audioContext.decodeAudioData(buff2.data);
    // this.audio3.buffer = await audioContext.decodeAudioData(buff3.data);
    // this.audio4.buffer = await audioContext.decodeAudioData(buff4.data);
  }

  playNoMerge() {
    const { audioContext } = this;
    this.audio1.disconnect();
    this.audio2.disconnect();
    // this.audio3.disconnect();
    // this.audio4.disconnect();
    this.dynamicsCompressor.disconnect();

    this.audio1.connect(audioContext.destination);
    this.audio2.connect(audioContext.destination);
    // this.audio3.connect(audioContext.destination);
    // this.audio4.connect(audioContext.destination);

    if (!this.play) {
      this.audio1.start();
      this.audio2.start();
      // this.audio3.start();
      // this.audio4.start();
    }
    this.play = true;
  }

  playMerge() {
    this.audio1.disconnect();
    this.audio2.disconnect();
    // this.audio3.disconnect();
    // this.audio4.disconnect();
    this.audio1.connect(this.dynamicsCompressor);
    this.audio2.connect(this.dynamicsCompressor);
    // this.audio3.connect(this.dynamicsCompressor);
    // this.audio4.connect(this.dynamicsCompressor);
    this.dynamicsCompressor.connect(this.audioContext.destination);
  }

  getAudio(url) {
    return axios(url, {
      headers: {
        'Accept': 'aduio/wav'
      },
      responseType: 'arraybuffer'
    });
  }

  render() {
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
    return (
      <section>
        <h3>声音混合</h3>
        <audio controls="controls" src="/audio/mario/triangle.mp3"></audio>
        <audio controls="controls" src="/audio/mario/rectangle1.mp3"></audio>
        <audio controls="controls" src="/audio/mario/rectangle2.mp3"></audio>
        <audio controls="controls" src="/audio/mario/noise.mp3"></audio>

        <section>
          <button style={btnStyle} onClick={this.playNoMerge}>不混合</button>
          <button style={btnStyle} onClick={this.playMerge}>混合</button>
        </section>
      </section>
    );
  }
};
