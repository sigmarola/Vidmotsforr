//source kóði fyrir vertex shader skrifað í GSLS tungumáli
var vertexShaderText = 
`precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;

void main()
{
  fragColor = vertColor;
  gl_Position = vec4(vertPosition, 0.0, 1.0);
}`
//source kóði fyrir fragment shader(í GSLS tungumáli)
var fragmentShaderText =
`precision mediump float;

varying vec3 fragColor;
void main()
{
  gl_FragColor = vec4(fragColor, 1.0);
}`



var canvas = document.getElementById('glcanvas');
var gl = canvas.getContext('webgl');

if (!gl) {
	console.log('WebGL not supported, falling back on experimental-webgl');
	gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
	alert('Your browser does not support WebGL');
}


//
// Create shaders
// 
//Býr til shader fyrir vertex(staðsetning hnita), og fragment shader(litur hnita)
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//shader-ar fá source kóða
gl.shaderSource(vertexShader, vertexShaderText);
gl.shaderSource(fragmentShader, fragmentShaderText);

gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);

//býr til webgl "program" og bætir við það vertex shader og fragment shader
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);



//
// Create buffer
//
//hnit Þríhyrnings skilgreind og litir hvers hnits
var triangleVertices = 
[ // X, Y,       R, G, B
	0.0, 0.5,    1.0, 1.0, 0.0,
	-0.5, -0.5,  0.7, 0.0, 1.0,
	0.5, -0.5,   0.1, 1.0, 0.6
];

var triangleVertexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
gl.vertexAttribPointer(
	positionAttribLocation, // Attribute location
	2, // Number of elements per attribute
	gl.FLOAT, // Type of elements
	gl.FALSE,
	5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	0 // Offset from the beginning of a single vertex to this attribute
);
gl.vertexAttribPointer(
	colorAttribLocation, // Attribute location
	3, // Number of elements per attribute
	gl.FLOAT, // Type of elements
	gl.FALSE,
	5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
);

gl.enableVertexAttribArray(positionAttribLocation);
gl.enableVertexAttribArray(colorAttribLocation);

//
// Main render loop
//
gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);
