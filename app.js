'use strict'

var gl;

var appInput = new Input();
var time = new Time();
var camera = new OrbitCamera(appInput);

// var sphereGeometry = null; // this will be created after loading from a file
var sunGeometry = null;
var mercuryGeometry = null;
var venusGeometry = null;
var earthGeometry = null;
var moonGeometry = null;
var marsGeometry = null;
var jupiterGeometry = null;
var saturnGeometry = null;
var uranusGeometry = null;
var neptuneGeometry = null;
var negXPlane = null;
var posXPlane = null;
var negYPlane = null;
var posYPlane = null;
var negZPlane = null;
var posZPlane = null;
var earthAtmoGeometry = null;

var projectionMatrix = new Matrix4();
var lightPosition = new Vector4(0, 0, 0, 0);

// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
var phongShaderProgram;
var flatShaderProgram;
var emissionShaderProgram;
var cloudShaderProgram;

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// we need to asynchronously fetch files from the "server" (your local hard drive)
var loadedAssets = {
    phongTextVS: null, phongTextFS: null,
    sphereJSON: null,
    earthImage: null,
    moonImage: null,
    sunImage: null,
    flatfs: null, flatvs: null,
    emissionfs: null, emissionvs: null,
    mercuryImage : null,
    venusImage: null,
    marsImage: null,
    jupiterImage: null,
    saturnImage: null,
    uranusImage: null,
    neptuneImage: null,
    galaxyNegXImage: null, galaxyPosXImage: null,
    galaxyNegYImage: null, galaxyPosYImage: null,
    galaxyNegZImage: null, galaxyPosZImage: null,
    cloudfs: null, cloudvs: null,
    cloudImage: null
};

// -------------------------------------------------------------------------
function initializeAndStartRendering() {
    initGL();
    loadAssets(function() {
        createShaders(loadedAssets);
        createScene();

        updateAndRender();
    });
}

// -------------------------------------------------------------------------
function initGL(canvas) {
    var canvas = document.getElementById("webgl-canvas");

    try {
        gl = canvas.getContext("webgl");
        gl.canvasWidth = canvas.width;
        gl.canvasHeight = canvas.height;

        gl.enable(gl.DEPTH_TEST);

        //Enable blending
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    } catch (e) {}

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

// -------------------------------------------------------------------------
function loadAssets(onLoadedCB) {
    var filePromises = [
        fetch('./shaders/phong.vs.glsl').then((response) => { return response.text(); }), //0
        fetch('./shaders/phong.pointlit.fs.glsl').then((response) => { return response.text(); }), //1
        fetch('./data/sphere.json').then((response) => { return response.json(); }), //2
        loadImage('./data/earth.jpg'), //3
        loadImage('./data/moon.png'), //4
        loadImage('./data/sun.jpg'), //5
        fetch('./shaders/flat.color.fs.glsl').then((response) => { return response.text(); }), //6
        fetch('./shaders/flat.color.vs.glsl').then((response) => { return response.text(); }), //7
        fetch('./shaders/emission.fs.glsl').then((response) => { return response.text(); }), //8
        fetch('./shaders/emission.vs.glsl').then((response) => { return response.text(); }), //9
        loadImage('./data/Additional Planets-20231206T225031Z-001/Additional Planets/mercury.jpg'), //10
        loadImage('./data/Additional Planets-20231206T225031Z-001/Additional Planets/venus.jpg'), //11
        loadImage('./data/Additional Planets-20231206T225031Z-001/Additional Planets/mars.jpg'), //12
        loadImage('./data/Additional Planets-20231206T225031Z-001/Additional Planets/jupiter.jpg'), //13
        loadImage('./data/Additional Planets-20231206T225031Z-001/Additional Planets/saturn.jpg'), //14
        loadImage('./data/Additional Planets-20231206T225031Z-001/Additional Planets/uranus.jpg'), //15
        loadImage('./data/Additional Planets-20231206T225031Z-001/Additional Planets/neptune.jpg'), //16
        loadImage('./data/Skybox Faces-20231206T225022Z-001/Skybox Faces/GalaxyTex_NegativeX.png'), //17
        loadImage('./data/Skybox Faces-20231206T225022Z-001/Skybox Faces/GalaxyTex_PositiveX.png'), //18
        loadImage('./data/Skybox Faces-20231206T225022Z-001/Skybox Faces/GalaxyTex_NegativeY.png'), //19
        loadImage('./data/Skybox Faces-20231206T225022Z-001/Skybox Faces/GalaxyTex_PositiveY.png'), //20
        loadImage('./data/Skybox Faces-20231206T225022Z-001/Skybox Faces/GalaxyTex_NegativeZ.png'), //21
        loadImage('./data/Skybox Faces-20231206T225022Z-001/Skybox Faces/GalaxyTex_PositiveZ.png'), //22
        fetch('./shaders/cloud.fs.glsl').then((response) => { return response.text(); }), //23
        fetch('./shaders/cloud.vs.glsl').then((response) => { return response.text(); }), //24
        loadImage('./data/Earth Day-Night-Clouds-20231206T225025Z-001/Earth Day-Night-Clouds/2k_earth_clouds.jpg') //25
        
    ];

    Promise.all(filePromises).then(function(values) {
        // Assign loaded data to our named variables
        loadedAssets.phongTextVS = values[0];
        loadedAssets.phongTextFS = values[1];
        loadedAssets.sphereJSON = values[2];
        loadedAssets.earthImage = values[3];
        loadedAssets.moonImage = values[4];
        loadedAssets.sunImage = values[5];
        loadedAssets.flatfs = values[6];
        loadedAssets.flatvs = values[7];
        loadedAssets.emissionfs = values[8];
        loadedAssets.emissionvs = values[9];
        loadedAssets.mercuryImage = values[10];
        loadedAssets.venusImage = values[11];
        loadedAssets.marsImage = values[12];
        loadedAssets.jupiterImage = values[13];
        loadedAssets.saturnImage = values[14];
        loadedAssets.uranusImage = values[15];
        loadedAssets.neptuneImage = values[16];
        loadedAssets.galaxyNegXImage = values[17];
        loadedAssets.galaxyPosXImage = values[18];
        loadedAssets.galaxyNegYImage = values[19];
        loadedAssets.galaxyPosYImage = values[20];
        loadedAssets.galaxyNegZImage = values[21];
        loadedAssets.galaxyPosZImage = values[22];
        loadedAssets.cloudfs = values[23];
        loadedAssets.cloudvs = values[24];
        loadedAssets.cloudImage = values[25];
        
    }).catch(function(error) {
        console.error(error.message);
    }).finally(function() {
        onLoadedCB();
    });
}

// -------------------------------------------------------------------------
function createShaders(loadedAssets) {
    phongShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.phongTextVS, loadedAssets.phongTextFS);
    flatShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.flatvs, loadedAssets.flatfs);
    emissionShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.emissionvs, loadedAssets.emissionfs);
    cloudShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.cloudvs, loadedAssets.cloudfs);

    phongShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(phongShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(phongShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(phongShaderProgram, "aTexcoords")
    };

    phongShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uProjectionMatrix"),
        lightPositionUniform: gl.getUniformLocation(phongShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(phongShaderProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(phongShaderProgram, "uTexture"),
    };

    flatShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(flatShaderProgram, "aVertexPosition")
    };

    flatShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(flatShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(flatShaderProgram, "uViewMatrix"),
        lightPositionUniform: gl.getUniformLocation(flatShaderProgram, "uProjectionMatrix")
        
    };

    emissionShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(emissionShaderProgram, "aVertexPosition"),
        vertexTexcoordsAttribute: gl.getAttribLocation(emissionShaderProgram, "aTexcoords")
    };
    
    emissionShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(emissionShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(emissionShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(emissionShaderProgram, "uProjectionMatrix"),
        lightPositionUniform: gl.getUniformLocation(emissionShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(emissionShaderProgram, "uCameraPosition"),
    };


    cloudShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(cloudShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(cloudShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(cloudShaderProgram, "aTexcoords")
    };

    cloudShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(cloudShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(cloudShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(cloudShaderProgram, "uProjectionMatrix"),
        lightPositionUniform: gl.getUniformLocation(cloudShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(cloudShaderProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(cloudShaderProgram, "uTexture"),
    };

    
}

// -------------------------------------------------------------------------
function createScene() {
    negXPlane = new WebGLGeometryQuad(gl, phongShaderProgram);
    posXPlane = new WebGLGeometryQuad(gl, phongShaderProgram);
    negYPlane = new WebGLGeometryQuad(gl, phongShaderProgram);
    posYPlane = new WebGLGeometryQuad(gl, phongShaderProgram);
    negZPlane = new WebGLGeometryQuad(gl, phongShaderProgram);
    posZPlane = new WebGLGeometryQuad(gl, phongShaderProgram);

    negXPlane.create(loadedAssets.galaxyNegXImage);
    posXPlane.create(loadedAssets.galaxyPosXImage);
    negYPlane.create(loadedAssets.galaxyNegYImage);
    posYPlane.create(loadedAssets.galaxyPosYImage);
    negZPlane.create(loadedAssets.galaxyNegZImage);
    posZPlane.create(loadedAssets.galaxyPosZImage);
    
    var galaxyScale = new Matrix4().makeScale(100.0, 100.0, 100.0);

    // compensate for the model being flipped on its side
    var rotation = new Matrix4().makeRotationY(-90);
    var translation = new Matrix4().makeTranslation(-100, 0, 0);

    negXPlane.worldMatrix.makeIdentity();
    negXPlane.worldMatrix.multiply(translation).multiply(rotation).multiply(galaxyScale);


    translation = new Matrix4().makeTranslation(100, 0, 0);
    posXPlane.worldMatrix.makeIdentity();
    posXPlane.worldMatrix.multiply(translation).multiply(rotation).multiply(galaxyScale);



    rotation.makeRotationX(90);
    translation.makeTranslation(0, -100, 0);

    negYPlane.worldMatrix.makeIdentity();
    negYPlane.worldMatrix.multiply(translation).multiply(rotation).multiply(galaxyScale);


    translation = new Matrix4().makeTranslation(0, 100, 0);
    posYPlane.worldMatrix.makeIdentity();
    posYPlane.worldMatrix.multiply(translation).multiply(rotation).multiply(galaxyScale);




    rotation.makeRotationZ(-90);
    translation.makeTranslation(0, 0, -100);

    negZPlane.worldMatrix.makeIdentity();
    negZPlane.worldMatrix.multiply(translation).multiply(rotation).multiply(galaxyScale);


    translation = new Matrix4().makeTranslation(0, 0, 100);
    posZPlane.worldMatrix.makeIdentity();
    posZPlane.worldMatrix.multiply(translation).multiply(rotation).multiply(galaxyScale);







    // groundGeometry.worldMatrix.makeIdentity();
    // groundGeometry.worldMatrix.multiply(rotation).multiply(scale);

    sunGeometry = new WebGLGeometryJSON(gl, emissionShaderProgram);//phongShaderProgram);
    sunGeometry.create(loadedAssets.sphereJSON, loadedAssets.sunImage);

    // Scaled it down so that the diameter is 3
    var sunScale = new Matrix4().makeScale(0.03, 0.03, 0.03);

    sunGeometry.worldMatrix.makeIdentity();
    sunGeometry.worldMatrix.multiply(sunScale);


    mercuryGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    mercuryGeometry.create(loadedAssets.sphereJSON, loadedAssets.mercuryImage);


    venusGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    venusGeometry.create(loadedAssets.sphereJSON, loadedAssets.venusImage);
   

    earthGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    earthGeometry.create(loadedAssets.sphereJSON, loadedAssets.earthImage);

    earthAtmoGeometry = new WebGLGeometryJSON(gl, cloudShaderProgram);
    earthAtmoGeometry.create(loadedAssets.sphereJSON, loadedAssets.cloudImage);

    moonGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    var moonScale = new Matrix4().makeScale(0.005, 0.005, 0.005);
    var moonTraslation = new Matrix4().makeTranslation(-1, 0, -1);
    moonGeometry.worldMatrix.multiply(moonTraslation).multiply(moonScale);
    moonGeometry.create(loadedAssets.sphereJSON, loadedAssets.moonImage);

    
    marsGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    marsGeometry.create(loadedAssets.sphereJSON, loadedAssets.marsImage);

    jupiterGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    jupiterGeometry.create(loadedAssets.sphereJSON, loadedAssets.jupiterImage);

    saturnGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    saturnGeometry.create(loadedAssets.sphereJSON, loadedAssets.saturnImage);

    uranusGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    uranusGeometry.create(loadedAssets.sphereJSON, loadedAssets.uranusImage);

    neptuneGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    neptuneGeometry.create(loadedAssets.sphereJSON, loadedAssets.neptuneImage);

}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);

    var aspectRatio = gl.canvasWidth / gl.canvasHeight;

    var yawMatrix = new Matrix4().makeRotationY(45.0 * time.deltaTime);
    var rotationMatrix = yawMatrix.clone();

    lightPosition = rotationMatrix.multiplyVector(lightPosition);

    time.update();
    camera.update(time.deltaTime);

    // specify what portion of the canvas we want to draw to (all of it, full width and height)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

    // this is a new frame so let's clear out whatever happened last frame
    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    projectionMatrix.makePerspective(45, aspectRatio, 0.1, 1000);
    var sunRotation = new Matrix4().makeRotationY(12.0 * time.deltaTime);

    var mercuryRotation = new Matrix4().makeRotationY(20.6 * time.secondsElapsedSinceStart);
    var mercuryScale = new Matrix4().makeScale(0.004, 0.004, 0.004);
    var mercuryTranslation = new Matrix4().makeTranslation(-2, 0, -2);
    var mercuryOrbit = new Matrix4().makeRotationY(20.7 * time.secondsElapsedSinceStart);

    var venusRotation = new Matrix4().makeRotationY(12.0 * time.secondsElapsedSinceStart);
    var venusScale = new Matrix4().makeScale(0.01, 0.01, 0.01);
    var venusTranslation = new Matrix4().makeTranslation(-3, 0, -3);
    var venusOrbit = new Matrix4().makeRotationY(15.4 * time.secondsElapsedSinceStart);

    var earthRotation = new Matrix4().makeRotationY(12.0 * time.secondsElapsedSinceStart);
    var earthScale = new Matrix4().makeScale(0.01, 0.01, 0.01);
    var earthAtmoScale = new Matrix4().makeScale(0.011, 0.011, 0.011);
    var earthTranslation = new Matrix4().makeTranslation(-5, 0, -5);
    var earthOrbit = new Matrix4().makeRotationY(12.53 * time.secondsElapsedSinceStart);

    var moonRotation = new Matrix4().makeRotationY(60.0 * time.secondsElapsedSinceStart);
    var moonScale = new Matrix4().makeScale(0.005, 0.005, 0.005);
    var moonTraslation = new Matrix4().makeTranslation(-1, 0, -1);

    var marsRotation = new Matrix4().makeRotationY(13.0 * time.secondsElapsedSinceStart);
    var marsScale = new Matrix4().makeScale(0.006, 0.006, 0.006);
    var marsTraslation = new Matrix4().makeTranslation(-7, 0, -7);
    var marsOrbit = new Matrix4().makeRotationY(10.123 * time.secondsElapsedSinceStart);

    var jupiterRotation = new Matrix4().makeRotationY(11.0 * time.secondsElapsedSinceStart);
    var jupiterScale = new Matrix4().makeScale(0.02, 0.02, 0.02);
    var jupiterTraslation = new Matrix4().makeTranslation(-9, 0, -9);
    var jupiterOrbit = new Matrix4().makeRotationY(8.762 * time.secondsElapsedSinceStart);

    var saturnRotation = new Matrix4().makeRotationY(10.0 * time.secondsElapsedSinceStart);
    var saturnScale = new Matrix4().makeScale(0.02, 0.02, 0.02);
    var saturnTraslation = new Matrix4().makeTranslation(-12, 0, -12);
    var saturnOrbit = new Matrix4().makeRotationY(6.991 * time.secondsElapsedSinceStart);

    var uranusRotation = new Matrix4().makeRotationY(9.0 * time.secondsElapsedSinceStart);
    var uranusScale = new Matrix4().makeScale(0.01, 0.01, 0.01);
    var uranusTraslation = new Matrix4().makeTranslation(-14, 0, -14);
    var uranusOrbit = new Matrix4().makeRotationY(5.132 * time.secondsElapsedSinceStart);

    var neptuneRotation = new Matrix4().makeRotationY(8.0 * time.secondsElapsedSinceStart);
    var neptuneScale = new Matrix4().makeScale(0.01, 0.01, 0.01);
    var neptuneTraslation = new Matrix4().makeTranslation(-16, 0, -16);
    var neptuneOrbit = new Matrix4().makeRotationY(3.647 * time.secondsElapsedSinceStart);

    //----------------------------SUN------------------------------------//
    gl.useProgram(emissionShaderProgram);
    var uniforms = emissionShaderProgram.uniforms;
    var cameraPosition = camera.getPosition();
    gl.uniform3f(uniforms.lightPositionUniform, lightPosition.x, lightPosition.y, lightPosition.z);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);
    sunGeometry.worldMatrix.multiply(sunRotation);//.multiply(scale);
    sunGeometry.render(camera, projectionMatrix, emissionShaderProgram);

    //----------------------------PLANETS------------------------------------//
    gl.useProgram(phongShaderProgram);
    var uniforms = phongShaderProgram.uniforms;
    var cameraPosition = camera.getPosition();
    gl.uniform3f(uniforms.lightPositionUniform, lightPosition.x, lightPosition.y, lightPosition.z);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);

    //----------------------------MERCURY------------------------------------//
    mercuryGeometry.worldMatrix.makeIdentity();
    mercuryGeometry.worldMatrix.multiply(mercuryOrbit).multiply(mercuryTranslation).multiply(mercuryRotation).multiply(mercuryScale);
    mercuryGeometry.render(camera, projectionMatrix, phongShaderProgram);

    //----------------------------VENUS------------------------------------//
    venusGeometry.worldMatrix.makeIdentity();
    venusGeometry.worldMatrix.multiply(venusOrbit).multiply(venusTranslation).multiply(venusScale).multiply(venusRotation);
    venusGeometry.render(camera, projectionMatrix, phongShaderProgram);
    
    //----------------------------EARTH------------------------------------//
    earthGeometry.worldMatrix.makeIdentity();
    earthGeometry.worldMatrix.multiply(earthOrbit).multiply(earthTranslation).multiply(earthRotation).multiply(earthScale);
    earthGeometry.render(camera, projectionMatrix, phongShaderProgram);

    earthAtmoGeometry.worldMatrix.makeIdentity();
    earthAtmoGeometry.worldMatrix.multiply(earthOrbit).multiply(earthTranslation).multiply(earthRotation).multiply(earthAtmoScale);
    earthAtmoGeometry.render(camera, projectionMatrix, cloudShaderProgram);

    //----------------------------MOON------------------------------------//
    moonGeometry.worldMatrix.makeIdentity();
    moonGeometry.worldMatrix.multiply(earthOrbit).multiply(earthTranslation).multiply(moonRotation).multiply(moonTraslation).multiply(moonScale);
    moonGeometry.render(camera, projectionMatrix, phongShaderProgram);

    //----------------------------MARS------------------------------------//
    marsGeometry.worldMatrix.makeIdentity();
    marsGeometry.worldMatrix.multiply(marsOrbit).multiply(marsTraslation).multiply(marsRotation).multiply(marsScale);
    marsGeometry.render(camera, projectionMatrix, phongShaderProgram);

    //----------------------------JUPITER------------------------------------//
    jupiterGeometry.worldMatrix.makeIdentity();
    jupiterGeometry.worldMatrix.multiply(jupiterOrbit).multiply(jupiterTraslation).multiply(jupiterRotation).multiply(jupiterScale);
    jupiterGeometry.render(camera, projectionMatrix, phongShaderProgram);

    //----------------------------SATURN------------------------------------//
    saturnGeometry.worldMatrix.makeIdentity();
    saturnGeometry.worldMatrix.multiply(saturnOrbit).multiply(saturnTraslation).multiply(saturnRotation).multiply(saturnScale);
    saturnGeometry.render(camera, projectionMatrix, phongShaderProgram);

    //----------------------------URANUS------------------------------------//
    uranusGeometry.worldMatrix.makeIdentity();
    uranusGeometry.worldMatrix.multiply(uranusOrbit).multiply(uranusTraslation).multiply(uranusRotation).multiply(uranusScale);
    uranusGeometry.render(camera, projectionMatrix, phongShaderProgram);

    //----------------------------NEPTUNE------------------------------------//
    neptuneGeometry.worldMatrix.makeIdentity();
    neptuneGeometry.worldMatrix.multiply(neptuneOrbit).multiply(neptuneTraslation).multiply(neptuneRotation).multiply(neptuneScale);
    neptuneGeometry.render(camera, projectionMatrix, phongShaderProgram);

    negXPlane.render(camera, projectionMatrix, emissionShaderProgram);
    posXPlane.render(camera, projectionMatrix, emissionShaderProgram);

    negYPlane.render(camera, projectionMatrix, emissionShaderProgram);
    posYPlane.render(camera, projectionMatrix, emissionShaderProgram);

    negZPlane.render(camera, projectionMatrix, emissionShaderProgram);
    posZPlane.render(camera, projectionMatrix, emissionShaderProgram);

}