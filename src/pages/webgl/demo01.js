import React, { useEffect, useCallback } from "react";

export default function () {
	const drawPoint = useCallback(() => {
		const vertexShaderSource = `
			void main() {
				// 申明顶点位置
				gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
				// 申明待绘制的点大小
				gl_PointSize = 10.0;
			}
		`;

		const fragmentShaderSource = `
			void main() {
				// 设置像素填充颜色为红色
				gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
			}
		`;
		
		const canvas = document.querySelector('#canvas');
		canvas.style.width = '100vw';
		canvas.style.height = '100vh';

		const gl = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");
		// 创建顶点着色器对象
		const vertexShader = gl.createShader(gl.VERTEX_SHADER);
		// 将源码分配给顶点着色器对象
		gl.shaderSource(vertexShader, vertexShaderSource);
		// 编译顶点着色器程序
		gl.compileShader(vertexShader);

		// 创建片元着色器程序
		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		// 将源码分配给片元着色器对象
		gl.shaderSource(fragmentShader, fragmentShaderSource);
		// 编译片元着色器
		gl.compileShader(fragmentShader);

		// 创建着色器程序
		const program = gl.createProgram();
		// 将顶点着色器挂载在着色器程序上
		gl.attachShader(program, vertexShader);
		// 将片元着色器挂载在着色器程序上。
		gl.attachShader(program, fragmentShader);
		// 链接着色器程序
		gl.linkProgram(program);

		// 使用刚创建好的着色器程序。
		gl.useProgram(program);

		// 设置清除颜色为黑色
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		// 使用上一步设置的清空画布颜色清空画布
		gl.clear(gl.COLOR_BUFFER_BIT);
		/** 
		 * 绘制点
		 * @param {mode} 代表图元类型
		 * @param {first} 代表要绘制的顶点的起始位置
		 * @param {count} 代表绘制的点的数量
		*/
		gl.drawArrays(gl.POINTS, 0, 1);
	}, []);

	useEffect(() => {
		drawPoint();
	}, []);

	return <canvas id="canvas" />;
}
