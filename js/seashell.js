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


  buildScene();
}

function buildScene() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 25);
  camera.focalLength = camera.position.distanceTo(scene.position);
  camera.lookAt(scene.position);

  // controls = new THREE.OrbitControls(camera);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = false; //true;
  controls.enablePan = false;

  // coordinate sys
  // X axis is red. The Y axis is green. The Z axis is blue.
  object = new THREE.AxisHelper( 1 );             
  scene.add( object );
  
  // light
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(-1, 1.5, 0.5);
  scene.add(light);
  
  var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( ambientLight );

  // events
  window.addEventListener('deviceorientation', setOrientationControls, true);
  window.addEventListener('resize', onWindowResize, false);


  ss = new Seashell();

  p = getControlParams();
  // console.log(p);

  ss.updateParams( p );


  //DRAW IN DOTS ----
  // ss.buildDots( scene );
  //DRAW THE SPIEN 
  ss.renderSpine(scene, false); 
  //DRAW IN TUBE -------
  ss.buildTube( scene, true  ); // renderSpine, 
}


function getControlParams() {
  return {
    "A": parseFloat(document.getElementById("A").value),
    "turns": parseFloat(document.getElementById("turns").value),
    "deltaTheta": parseFloat(document.getElementById("deltaTheta").value),
    "D": parseFloat(document.getElementById("D").value),
    "steps": parseFloat(document.getElementById("steps").value),
    "cSteps": parseFloat(document.getElementById("cSteps").value),
    "alpha": parseFloat(document.getElementById("alpha").value),
    "beta": parseFloat(document.getElementById("beta").value),
    "phi": parseFloat(document.getElementById("phi").value),
    "mu": parseFloat(document.getElementById("mu").value),
    "omega": parseFloat(document.getElementById("omega").value)
  }
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