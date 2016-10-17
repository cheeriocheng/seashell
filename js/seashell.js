var user = false;

var camera, scene, renderer;
var effect;
var mobile = false;
var globe;
var group;

var ss ;//seashell instance

var exportButton//, floatingDiv;


init();
animate();

function exportToObj() {

    var exporter = new THREE.OBJExporter();
    var result = exporter.parse( scene );
    // floatingDiv.style.display = 'block';
    // floatingDiv.innerHTML = result.split( '\n' ).join ( '<br />' );
    exportToFile("seashell.obj",result );

}


//reza
function exportToFile( filename, data ) {
  var pom = document.createElement( 'a' );
  pom.href = URL.createObjectURL( new Blob( [ data ], { type : 'text/plain'} ) );
  pom.download = filename;
  document.body.appendChild( pom );

  if( document.createEvent ) {
    var event = document.createEvent( 'MouseEvents' );
    event.initEvent( 'click', true, true );
    pom.dispatchEvent( event );
  }
  else {
    pom.click();
  }
};


function init() {

    // setup
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0)
    //var mainContainer = document.getElementById('threeJS-location');
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 6); //008
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
    var spiral = ss.spiral; 
    
   


    // // //DRAW IN DOTS ----
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

          
    //        // if(j> 12 && j% 8 == 4){
    //        //  radius = 0.2 ;//0.3;
    //        // }else{
    //        //  radius = 0.5; //0.5 //0.1 = one drop 
    //        // }
    //        if (j == 0){
    //        sphere = new THREE.Mesh( new THREE.SphereGeometry( radius, widthSegments, heightSegments ), material );
    //        pos = ss._shell[i][j]; 

    //         sphere.position.set( pos.x, pos.y, pos.z );
    //         scene.add( sphere );
    //       }
    //     }
    // }

    // // // ---- DRAW IN DOTS 

    //DRAW IN HELIX -------
    
    var geometrySpiral = new THREE.Geometry();

    var helix = new THREE.Geometry(); //the helix to store all points  
    var rotationCounter = 0 ;

    //for each point on the spiral 
    for (var i = ss.startingStep ; i< ss.spiral.length; i++){

      // console.log("point", i, "/" , ss.spiral.length, "in spiral.");
       geometrySpiral.vertices.push(ss.spiral[i]);  

       // var oneEllipse = new THREE.Geometry(); 
       
 
       // for (var j = 0 ; j < ss._shell[i].length; j++){
       //     // oneEllipse= new THREE.Geometry(); 
       //     oneEllipse.vertices.push(ss._shell[i][j]);  

       // }
       // oneEllipse.vertices.push(ss._shell[i][0]);  //completes full loop
      
       // helix.vertices.push(ss._shell[i][0]); // add the starting point of each ellipse 

       helix.vertices.push(ss._shell[i][rotationCounter]); // add the starting point of each ellipse 
      
        rotationCounter ++ ; 
        
        // console.log("rotationCounter", rotationCounter, 'cSteps', ss.cSteps);
       if (rotationCounter>= ss.cSteps){

        rotationCounter = 0 ;
       }


    ////move the shell to center if necessary 
    // var T = new THREE.Matrix4(); 
    //  T.makeTranslation(0, 0, 10); //move to where the point on ellipse is 
    //  // mesh.translateZ(10);
    //  mesh.geometry.applyMatrix(T)

        ////render the ellipse in single lines   
       // scene.add( new THREE.Line(oneEllipse, 
       //                  new THREE.LineBasicMaterial({
       //                      color: 0xffff00,
       //                      linewidth: 1
       //                  }))
       //  );
       
    }

    //render helix 
    scene.add( new THREE.Line(helix, 
                        new THREE.LineBasicMaterial({
                            color: 0xffff00,
                            linewidth: 2
                        }))
    );
 
    //render spiral spine
    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xeeeeee
    });
    var spineLine = new THREE.Line( geometrySpiral, lineMaterial );
    scene.add( spineLine );


///---------- draw in HELIX


//     //DRAW IN TUBE -------
    
//     var geometrySpiral = new THREE.Geometry();
  

//     var extrudeShapePoints = [], count = 10;
//     for ( var i = 0; i < count; i ++ ) {
//         var l = .15; //radius of shape
//         var a = 2 * i / count * Math.PI;
//         extrudeShapePoints.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );
//     }

//     var extrudeShape = new THREE.Shape( extrudeShapePoints );

//      var extrudeMaterial = new THREE.MeshLambertMaterial( { color: 0xeeeeee, wireframe: false } );


//     //for each point on the spiral 
//     for (var i = ss.startingStep ; i< ss.spiral.length; i++){

//       // console.log("point", i, "/" , ss.spiral.length, "in spiral.");
//       geometrySpiral.vertices.push(ss.spiral[i]);  

//        var oneEllipse = new THREE.Geometry(); 
       
 
//        for (var j = 0 ; j < ss._shell[i].length; j++){
//            // oneEllipse= new THREE.Geometry(); 
//            oneEllipse.vertices.push(ss._shell[i][j]);  

//        }
//        oneEllipse.vertices.push(ss._shell[i][0]);  //completes full loop
      

//        var extusionSpline =  new THREE.CatmullRomCurve3( oneEllipse.vertices );
//        extusionSpline.closed = true;
//         var extrudeSettings = {
//         steps           : 30, //int. number of points used for subdividing segements of extrude spline //10
//         bevelEnabled    : false,
//         extrudePath     : extusionSpline
//     };
//     var extrudeGeometry = new THREE.ExtrudeGeometry( extrudeShape, extrudeSettings );

//     var mesh = new THREE.Mesh( extrudeGeometry, extrudeMaterial );

//     ////move the shell to center if necessary 
//     // var T = new THREE.Matrix4(); 
//     //  T.makeTranslation(0, 0, 10); //move to where the point on ellipse is 
//     //  // mesh.translateZ(10);
//     //  mesh.geometry.applyMatrix(T)
    
//     // scene.add( mesh );
   

//         ////render the ellipse in single lines   
//        // scene.add( new THREE.Line(oneEllipse, 
//        //                  new THREE.LineBasicMaterial({
//        //                      color: 0xffff00,
//        //                      linewidth: 1
//        //                  }))
//        //  );
       
//     }
 
//     //render spiral spine
//     var lineMaterial = new THREE.LineBasicMaterial({
//         color: 0xeeeeee
//     });
//     var spineLine = new THREE.Line( geometrySpiral, lineMaterial );
//     scene.add( spineLine );
// ///---------- draw in tube


    // light

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-1, 1.5, 0.5);
    scene.add(light);
    
    var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( ambientLight );

    // events

    window.addEventListener('deviceorientation', setOrientationControls, true);
    window.addEventListener('resize', onWindowResize, false);

    exportButton = document.getElementById( 'export' );
    exportButton.addEventListener( 'click', function() { exportToObj(); });

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