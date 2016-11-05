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
    
  
    
    ss = new Seashell();
    //spine of seashell 
    // var spiral = ss.spiral; 
    
   


     //DRAW IN DOTS ----
    // var sphere; 
    // var pos; 
    // var radius = 0.5; //— sphere radius. Default is 50.
    // var widthSegments = 10; //— number of horizontal segments
    // var heightSegments = 10; 

    // var material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide,  color: 0xFFFFFF, shading: THREE.SmoothShading}); //FlatShading:SmoothShading

    // for (var i = 40 ; i< ss.spiral.length; i++){
    //     for (var j = 0 ; j < ss._shell[i].length; j++){
    //        // oneEllipse= new THREE.Geometry(); 
    //        // oneEllipse.vertices.push(ss._shell[i][j]);  

          
    //        if(j> 12 && j% 8 == 4){
    //         radius = 1 ;//0.3;
    //        }else{
    //         radius = 0.5; //0.5 //0.1 = one drop 
    //        }
    //        sphere = new THREE.Mesh( new THREE.SphereGeometry( radius, widthSegments, heightSegments ), material );
    //        pos = ss._shell[i][j]; 

    //         sphere.position.set( pos.x, pos.y, pos.z );
    //         scene.add( sphere );



    //     }
    // }

    //---- DRAW IN DOTS 



    //DRAW IN TUBE -------
    
    var geometrySpiral = new THREE.Geometry();
  

    var extrudeShapePoints = [], count = 50;
    var a = 4.3; 
    var b = 1;
    var t =0;

    var c = 0.2 ; //0.2 
    var k = 5 ; //5
    var tempX;
    var tempY;

    for ( var i = 0; i < count; i ++ ) {
        
        t = 2 * i / count * Math.PI;
        tempX = Math.cos( t ) * b; 
        tempY = Math.sin( t ) * a; 

        tempX += -c*Math.cos(t*k) ;
        tempY += c*Math.sin(t*k) ;
 
        extrudeShapePoints.push( new THREE.Vector2 ( tempX, tempY));
    }

    var extrudeShape = new THREE.Shape( extrudeShapePoints );

     var extrudeMaterial = new THREE.MeshLambertMaterial( { color: 0xeeeeee, wireframe: false } );


    //for each point on the spiral 
    // starting with -36
    var l = ss.spiral.length ;  
    for (var i = l- 32 ; i<l; i++){

        geometrySpiral.vertices.push(ss.spiral[i]);  

       var oneEllipse = new THREE.Geometry(); 
       
     //  var c = 0x011000 + 0x0000e0* i ;



       for (var j = 0 ; j < ss._shell[i].length; j++){
           // oneEllipse= new THREE.Geometry(); 
           oneEllipse.vertices.push(ss._shell[i][j]);  

       }
       oneEllipse.vertices.push(ss._shell[i][0]);  //completes full loop
        // oneEllipse.vertices.push(ss._shell[i][1]);  //completes full loop
       //cx

       var extusionSpline =  new THREE.CatmullRomCurve3( oneEllipse.vertices );
       extusionSpline.closed = true;
        var extrudeSettings = {
        steps           : 60, //int. number of points used for subdividing segements of extrude spline //10
        bevelEnabled    : false,
        extrudePath     : extusionSpline
    };
    var extrudeGeometry = new THREE.ExtrudeGeometry( extrudeShape, extrudeSettings );

    var mesh = new THREE.Mesh( extrudeGeometry, extrudeMaterial );
    var scale = i/l; 
    // console.log(scale);
    mesh.scale.set (scale,scale,scale);
    scene.add( mesh );
    ///----------

        ////render the ellipse in single lines
        
       // console.log(c)
       // scene.add( new THREE.Line(oneEllipse, 
       //                  new THREE.LineBasicMaterial({
       //                      color: 0xffff00,
       //                      linewidth: 1
       //                  }))
       //  );
       
    }

    //render spiral spine
    // var lineMaterial = new THREE.LineBasicMaterial({
    //     color: 0xeeeeee
    // });
    // var spineLine = new THREE.Line( geometrySpiral, lineMaterial );
    // scene.add( spineLine );



    // light

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-1, 1.5, 0.5);
    scene.add(light);
    
    var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( ambientLight );

    // events

    window.addEventListener('deviceorientation', setOrientationControls, true);
    window.addEventListener('resize', onWindowResize, false);

     // floatingDiv = document.createElement( 'div' );
     //            floatingDiv.className = 'floating';
     //            document.body.appendChild( floatingDiv );

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