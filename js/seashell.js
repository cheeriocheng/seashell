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
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);
    camera.focalLength = camera.position.distanceTo(scene.position);
    camera.lookAt(scene.position);

    controls = new THREE.OrbitControls(camera);
    controls.autoRotate = false; //true;
    controls.enablePan = false;

    // coordinate sys
    // X axis is red. The Y axis is green. The Z axis is blue.
    object = new THREE.AxisHelper( 2 );             
    scene.add( object );
    
  
    
    ss = new Seashell();
    //spine of seashell 
    var spiral = ss.spiral; 
    
   
     //DRAW IN DOTS ----
   //  var sphere; 
   //  var pos; 
   //  var radius = 0.5; //— sphere radius. Default is 50.
   //  var widthSegments = 10; //— number of horizontal segments
   //  var heightSegments = 10; 

   //  var material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide,  color: 0xFFFFFF, shading: THREE.SmoothShading}); //FlatShading:SmoothShading
   // console.log("spiral length" , ss.spiral.length);
   // console.log("circle length" , ss._shell[80].length);
   
   //  for (var i = 80 ; i< ss.spiral.length; i++){
   //      for (var j = 0 ; j < ss._shell[i].length; j++){
   //         // oneEllipse= new THREE.Geometry(); 
   //         // oneEllipse.vertices.push(ss._shell[i][j]);  

   //        if (j ==0 ){
   //            radius = .2;
   //          }
   //         else if(j%10==0){
   //          radius = 0.1 ;//0.3;
   //         }else{
   //          radius = 0.05; //0.5 //0.1 = one drop 
   //         }
   //         sphere = new THREE.Mesh( new THREE.SphereGeometry( radius, widthSegments, heightSegments ), material );
   //         pos = ss._shell[i][j]; 

   //          sphere.position.set( pos.x, pos.y, pos.z );
   //          scene.add( sphere );



   //      }
   //  }
       //---- DRAW IN DOTS 


    //DRAW PLANES ---

    var startingIndex = 118 ;//70; //reduce calculation
   
    var surfaceMaterial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide,  color: 0xFFFFFF, shading: THREE.FlatShading}); 
    for (var tempInd = ss.spiral.length-2 ; tempInd >=startingIndex ; tempInd--){
      
       var surfaceGeom = new THREE.Geometry(); 
       // console.log("tempInd ", tempInd);
      var nexti = 0 ;
      //counter clockwise triangle band
      for (var i = 0; i < ss.cSteps ; i++){
        // D-B
        // |/|
        // C-A

        nexti = i+1; 

        if(i == ss.cSteps-1) {nexti = 0 ;}//loop back to first dot in ring

        surfaceGeom.vertices.push( ss._shell[tempInd][i]  )  //A
        surfaceGeom.vertices.push( ss._shell[tempInd+1][i] ) //B
        surfaceGeom.vertices.push(  ss._shell[tempInd][nexti]) //C
        
        surfaceGeom.faces.push( new THREE.Face3( i*6, i*6+1, i*6+2 ) ); //ABC

        surfaceGeom.vertices.push(  ss._shell[tempInd][nexti]) //C
        surfaceGeom.vertices.push( ss._shell[tempInd+1][i] ) //B
        surfaceGeom.vertices.push(  ss._shell[tempInd+1][nexti]) //D

        surfaceGeom.faces.push( new THREE.Face3( i*6+3, i*6+4, i*6+5 ) ); //CBD

      }

       var surfaceMesh = new THREE.Mesh( surfaceGeom, surfaceMaterial );
        scene.add(surfaceMesh);

    }

    // //adding end caps 
    // //ending
    // var capGeom = new THREE.Geometry(); 
    // var endInd = ss.spiral.length - 1; 
    // //center 
    // var center = ss.spiral[endInd] ; //
    // // console.log(ellipseCenter)
    // for(var i = 0 ; i <ss.cSteps; i++){
    //     capGeom.vertices.push(center);
    //     capGeom.vertices.push(ss._shell[endInd][(i+1)%ss.cSteps]); //wrap around 
    //     capGeom.vertices.push(ss._shell[endInd][i]); 
    //     capGeom.faces.push( new THREE.Face3( i*3, i*3+1, i*3+2 ) ); //ABC
    // } 

    // var capMesh = new THREE.Mesh( capGeom, surfaceMaterial );
    // scene.add(capMesh);

    // //starting //REVERSE! 
    // var bCapGeom = new THREE.Geometry(); 
    // var bEndInd = startingIndex; 
    // //center 
    // var bCenter = ss.spiral[bEndInd] ; //
    // console.log(bCenter)
    // for(var i = 0 ; i <ss.cSteps; i++){
    //     bCapGeom.vertices.push(bCenter);
    //     bCapGeom.vertices.push(ss._shell[bEndInd][i]); 
    //     bCapGeom.vertices.push(ss._shell[bEndInd][(i+1)%ss.cSteps]); //wrap around 
      
    //     bCapGeom.faces.push( new THREE.Face3( i*3, i*3+1, i*3+2 ) ); //ABC
    // } 

    // var bCapMesh = new THREE.Mesh( bCapGeom, surfaceMaterial );
    // scene.add(bCapMesh);



    // ----- DRAW PLANES




    //DRAW IN TUBE -------
    
    // var geometrySpiral = new THREE.Geometry();
  

    // var extrudeShapePoints = [], count = 10;
    // for ( var i = 0; i < count; i ++ ) {
    //     var l = 0.5;
    //     var a = 2 * i / count * Math.PI;
    //     extrudeShapePoints.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );
    // }

    // var extrudeShape = new THREE.Shape( extrudeShapePoints );

    //  var extrudeMaterial = new THREE.MeshLambertMaterial( { color: 0xeeeeee, wireframe: false } );


    // //for each point on the spiral 
    // for (var i = 0 ; i< ss.spiral.length; i++){
    //     geometrySpiral.vertices.push(ss.spiral[i]);  

    //    var oneEllipse = new THREE.Geometry(); 
       
    //  //  var c = 0x011000 + 0x0000e0* i ;



    //    for (var j = 0 ; j < ss._shell[i].length; j++){
    //        // oneEllipse= new THREE.Geometry(); 
    //        oneEllipse.vertices.push(ss._shell[i][j]);  

    //    }
    //    oneEllipse.vertices.push(ss._shell[i][0]);  //completes full loop
    //    //cx

    //    var extusionSpline =  new THREE.CatmullRomCurve3( oneEllipse.vertices );
    //    extusionSpline.closed = true;
    //     var extrudeSettings = {
    //     steps           : 30, //int. number of points used for subdividing segements of extrude spline //10
    //     bevelEnabled    : false,
    //     extrudePath     : extusionSpline
    // };
    // var extrudeGeometry = new THREE.ExtrudeGeometry( extrudeShape, extrudeSettings );

    // var mesh = new THREE.Mesh( extrudeGeometry, extrudeMaterial );

    // scene.add( mesh );
    ///----------

        ////render the ellipse in single lines
        
       // console.log(c)
       // scene.add( new THREE.Line(oneEllipse, 
       //                  new THREE.LineBasicMaterial({
       //                      color: 0xffff00,
       //                      linewidth: 1
       //                  }))
       //  );
       
    // }

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