import React, { Component } from 'react';
import {
  AxisHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  DirectionalLight,
  CubeGeometry,
  LineBasicMaterial,
  Geometry,
  Vector3,
  Line,
  BoxGeometry,
  Material
} from 'three';

export default class ThreeDemo extends Component {

  componentDidMount() {
    const axisHelper = new AxisHelper(500);
    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    const scene = new Scene();
    const renderer = new WebGLRenderer({antialias: true});

    scene.add(axisHelper);

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(50, 50, 100);
    camera.lookAt(0, 0, 0);
    document.body.appendChild(renderer.domElement);

    // const material = new LineBasicMaterial({color: 0x0000ff});
    // const geometry = new Geometry();
    // geometry.vertices.push(new Vector3(-10, 0, 0));
    // geometry.vertices.push(new Vector3(0, 10, 0));
    // geometry.vertices.push(new Vector3(10, 0, 0));
    // const line = new Line(geometry, material);
    // scene.add(line);

    // const box = new CubeGeometry(2, 1, 1);
    // const meterialBox = new BoxGeometry(new Material({
    //   color: 0xffff00,
    //   opacity: 0.75
    // }), box);
    // scene.add(meterialBox)

    // 创建平行光
    const light = new DirectionalLight(0xffffff, 1.5);
    // 设置照射方向
    light.position.set(0, 0, 1);
    scene.add(light);

    renderer.render(scene, camera);
  }

  render() {
    return null;
  }
}
