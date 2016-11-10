var user = false;

var camera, scene, renderer;
var effect;
var mobile = false;
var globe;
var group;

var ss ;//seashell instance




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
    camera.position.set(0, 0, 25);
    camera.focalLength = camera.position.distanceTo(scene.position);
    camera.lookAt(scene.position);

    // controls = new THREE.OrbitControls(camera);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.autoRotate = false; //true;
    controls.enablePan = false;

    //coordinate sys
    // X axis is red. The Y axis is green. The Z axis is blue.
    // object = new THREE.AxisHelper( 1 );             
    // scene.add( object );
    
    // light
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-1, 1.5, 0.5);
    scene.add(light);
    
    var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( ambientLight );

    // events
    window.addEventListener('deviceorientation', setOrientationControls, true);
    window.addEventListener('resize', onWindowResize, false);

    ss = new Seashell(scene);

    //DRAW IN DOTS ----
    // ss.buildDots();

    //DRAW IN TUBE -------
    ss.buildTube( false ); // buildSpine -> true/false
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