var user = false;

var camera, scene, renderer;
var effect;
var mobile = false;
var globe
var group
var spiral
var shell 

init();
animate();

function init() {

    // setup

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0)
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);
    camera.focalLength = camera.position.distanceTo(scene.position);
    camera.lookAt(scene.position);

    controls = new THREE.OrbitControls(camera);
    controls.autoRotate = false; //true;
    controls.enablePan = false;

    //coordinate sys
    // X axis is red. The Y axis is green. The Z axis is blue.
    object = new THREE.AxisHelper( 1 );             
    scene.add( object );
    
  
    
    var ss = new Seashell();
    //spine of seashell 
    spiral = ss.spiral; 
    
    var material = new THREE.LineBasicMaterial({
        color: 0xcc0000
    });

    var geometry = new THREE.Geometry();
    // spine  = spiral() ; 
    // console.log(spine);

    for (var i = 0 ; i< spiral.length; i++){
        geometry.vertices.push(spiral[i]);    
    }
    var line = new THREE.Line( geometry, material );
    scene.add( line );
    


    // var material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, envMap: getCubeMap(1), color: 0xFFFFFF, shading: THREE.FlatShading});
    // var geometry = new THREE.SphereGeometry(2.6, 50, 50)//  30, 30)

    // var mod = .3;
    // for (var i = 0; i < geometry.vertices.length; i++) {
    //     var v = geometry.vertices[i]
    //     var ran = Math.random()
    //     v.x *= ran;
    //     v.y *= ran;
    //     v.z *= ran;
    // }
    // globe = new THREE.Mesh(geometry, material);
    // scene.add(globe);


    // Background
    var cubeMap = getCubeMap(1)
    var cubeShader = THREE.ShaderLib['cube'];
    cubeShader.uniforms['tCube'].value = cubeMap;

    var skyBoxMaterial = new THREE.ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });

    var skyBox = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), skyBoxMaterial);
    scene.add(skyBox);


    // light

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-1, 1.5, 0.5);
    scene.add(light);

    // events

    window.addEventListener('deviceorientation', setOrientationControls, true);
    window.addEventListener('resize', onWindowResize, false);

}

function animate() {

    requestAnimationFrame(animate);
    render();

}

function render() {

    controls.update();

    // if (mobile) {
    //     camera.position.set(0, 0, 0)
    //     camera.translateZ(5);
    // }
    renderer.render(scene, camera);

}