var user = false;

var camera, scene, renderer;
var effect;
var mobile = false;
var globe
var group

var ss 

var exportButton, floatingDiv;


init();
animate();

function exportToObj() {

    var exporter = new THREE.OBJExporter();
    var result = exporter.parse( scene );
    floatingDiv.style.display = 'block';
    floatingDiv.innerHTML = result.split( '\n' ).join ( '<br />' );

}

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
    
  
    
    ss = new Seashell();
    //spine of seashell 
    // var spiral = ss.spiral; 
    
    var material = new THREE.LineBasicMaterial({
        color: 0xeeeeee
    });

    var geometrySpiral = new THREE.Geometry();
  



    for (var i = 0 ; i< ss.spiral.length; i++){
        geometrySpiral.vertices.push(ss.spiral[i]);  

       var oneEllipse = new THREE.Geometry(); 
       
       var c = 0x011000 + 0x0000e0* i ;
      
       for (var j = 0 ; j < ss._shell[i].length; j++){
           // oneEllipse= new THREE.Geometry(); 
           oneEllipse.vertices.push(ss._shell[i][j]);  

       }
       oneEllipse.vertices.push(ss._shell[i][0]);  //completes full loop

       // console.log(c)
       scene.add( new THREE.Line(oneEllipse, 
                        new THREE.LineBasicMaterial({
                            color: c,
                            linewidth: 1
                        }))
        );
    }
    //render spiral spine
    var spineLine = new THREE.Line( geometrySpiral, material );
    scene.add( spineLine );


    // // // extrusion 
    // var geometrySpiralTest = new THREE.Geometry();

    //  for (var i = 0 ; i< ss.spiral.length; i++){
    //     geometrySpiralTest.vertices.push(ss.spiral[i]);  
    // }
    // var extrudeSettings = {
    //     steps           : 200,
    //     bevelEnabled    : false,
    //     extrudePath     : geometrySpiralTest
    // };

    //  var pts = [], numPts = 5;

    //             for ( var i = 0; i < numPts * 2; i ++ ) {

    //                 var l = i % 2 == 1 ? 10 : 20;

    //                 var a = i / numPts * Math.PI;

    //                 pts.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );

    //             }

    // var shape = new THREE.Shape( pts );
    // var material2 = new THREE.MeshLambertMaterial( { color: 0xff8000, wireframe: false } );


    // var geometryExtrusion = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    //     var mesh = new THREE.Mesh( geometry, material2 );

    //             scene.add( mesh );


    var randomPoints = [];

    for ( var i = 0; i <  ss.spiral.length ; i ++ ) {

        randomPoints.push( ss.spiral[i] );

    }

    var randomSpline =  new THREE.CatmullRomCurve3( randomPoints );

    

    var extrudeSettings = {
        steps           : 200,
        bevelEnabled    : false,
        extrudePath     : randomSpline
          // extrudePath     : closedSpline
    };




    var pts = [], count = 10;

    for ( var i = 0; i < count; i ++ ) {

        var l = 0.3;

        var a = 2 * i / count * Math.PI;

        pts.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );

    }


    var shape = new THREE.Shape( pts );

    var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

    var material2 = new THREE.MeshLambertMaterial( { color: 0xff8000, wireframe: false } );

    var mesh = new THREE.Mesh( geometry, material2 );

    scene.add( mesh );




    // // Background
    // var cubeMap = getCubeMap(1)
    // var cubeShader = THREE.ShaderLib['cube'];
    // cubeShader.uniforms['tCube'].value = cubeMap;

    // var skyBoxMaterial = new THREE.ShaderMaterial({
    //     fragmentShader: cubeShader.fragmentShader,
    //     vertexShader: cubeShader.vertexShader,
    //     uniforms: cubeShader.uniforms,
    //     depthWrite: false,
    //     side: THREE.BackSide
    // });

    // var skyBox = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), skyBoxMaterial);
    // scene.add(skyBox);


    // light

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-1, 1.5, 0.5);
    scene.add(light);

    // events

    window.addEventListener('deviceorientation', setOrientationControls, true);
    window.addEventListener('resize', onWindowResize, false);

    exportButton = document.getElementById( 'export' );
    exportButton.addEventListener( 'click', function() { exportToObj(); });

     floatingDiv = document.createElement( 'div' );
                floatingDiv.className = 'floating';
                document.body.appendChild( floatingDiv );

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