"use strict";

class Seashell {


  constructor( scene ){
    this._scene = scene
    //default: boat ear mooon 
    this.A = 0.25 ; //0.1
    this.turns =  5;  //6; // how many turns in the shell
    this.deltaTheta = degToRad(15) ; //degrees per new session

    this.D = 1 ; 
    this.steps = 0; //how many ellipses C to draw; to be calculated
    this.cSteps = 30; //how many straight lines makes an ellipse C  //30
    this.alpha= degToRad(83); 
    this.beta=degToRad(42); 
    this.phi=degToRad(70); 
    this.mu=degToRad(10); 
    this.omega=degToRad(30); 
    
    this.a=0.12; //1.2; 
    this.b=.2 ; // 2.0; 
    this.L=0; 
    this.P=0; 
    this.W1=0; 
    this.W2=0; 
    this.N=0;

    /* works for tube export
     this.A =  undefined !== A ? A : 0.25 ; //0.1
    this.turns = 5; // how many turns in the shell
    this.deltaTheta = degToRad(18) ; //degrees per new session

    this.D = 1 ; 
    this.steps = 0; //how many ellipses C to draw; to be calculated
    this.cSteps = 10; //how many straight lines makes an ellipse C
    this.alpha= degToRad(83); 
    this.beta=degToRad(42); 
    this.phi=degToRad(70); 
    this.mu=degToRad(10); 
    this.omega=degToRad(30); 
    
    this.a=0.12; //1.2; 
    this.b=.2 ; // 2.0; 
    this.L=0; 
    this.P=0; 
    this.W1=0; 
    this.W2=0; 
    this.N=0;
    */

    this.loadZcorp() ;
    // this.loadHorseConch() ; 
    // this.loadWentletrap() ; 

    this._spiral = null;
    this._shell = null; 
  }

  loadZcorp(){
      this.A =   0.25 ; //0.1
      this.turns = 6.4; // how many turns in the shell
      this.deltaTheta = degToRad(18) ; //degrees per new session //18 23
  

      this.D = 1 ; 
      this.steps = 0; //how many ellipses C to draw; to be calculated
      this.cSteps = 14; //12, 10 how many straight lines makes an ellipse C
      this.alpha= degToRad(83);  //83
      this.beta=degToRad(80);  //how steep the cone of spiral is 
      this.phi=degToRad(70); 
      this.mu=degToRad(30);  //10 how twisty the spiral is 
      this.omega=degToRad(30);  
      
      // this.a=0.12; //1.2; 
      // this.b=.2 ; // 2.0; 
      // this.L=1.4; 
      // this.P=4; 
      // this.W1=18; 
      // this.W2=0.4; 
      // this.N=18;
  }

  updateParams(A, turns, deltaTheta, D, steps, cSteps, alpha, beta, phi, mu, omega)
  {
    this.A = A;
    this.turns = turns;
    this.deltaTheta = degToRad(deltaTheta);
    this.D = D;
    this.steps = steps;
    this.cSteps = cSteps;
    this.alpha = degToRad(alpha);
    this.beta = degToRad(beta);
    this.phi = degToRad(phi);
    this.mu = degToRad(mu);
    this.omega = degToRad(omega);
  }

  calcSpiral(){
      var spiralPointArray = [];
      var shellEllipseArray = [];
      this.steps = Math.round ( this.turns * Math.PI *2 / this.deltaTheta );
       // console.log (this.steps); 

   
      for ( var i = 0; i < this.steps; i ++ ) {
          
          var theta =  i * this.deltaTheta ; // maplinear (i, 0, n, 0, turns);
          var rad = Math.exp( theta * Math.cos(this.alpha) / Math.sin(this.alpha) );

          //helix 
          var x =  this.A * rad * Math.sin(this.beta) * Math.cos(theta) * this.D;
          var y =  this.A * rad * Math.sin(this.beta) * Math.sin(theta);
          var z = -this.A * rad * Math.cos(this.beta);        

          spiralPointArray.push(new THREE.Vector3(x,y,z));

          // Generate ellipse around each point of spiral
          shellEllipseArray[i] = [];


          var r2 = Math.pow( Math.pow(Math.cos(s)/this.a,2) + Math.pow(Math.sin(s)/this.b,2), -0.5 ); //radius at this given angle 

          //cx
          // this.cSteps = 0.2* this.steps;
          
          // var tempCsteps = Math.round( this.cSteps * i / this.steps)+1; 
          
      //    console.log ( tempCsteps, this.steps); 
          for (var j = 0; j < this.cSteps ; j++) 
          // for (var j = 0; j < tempCsteps ; j++) 
          {
            
            // var s = j * Math.PI * 2 / tempCsteps; 
            var s= j * Math.PI * 2.0 / this.cSteps;  //angular step around the ellipse 

           //   console.log (s); 
           //  var r2 = Math.pow( Math.pow(Math.cos(s)/this.a,2) + Math.pow(Math.sin(s)/this.b,2), -0.5 ); //radius at this given angle s
            
           //  // add surface manipulations
           // var surfrad = 0;
           //  if (this.W1==0 || this.W2==0 || this.N==0) surfrad = 0;
           //  else {
           //    var lt = (Math.PI * 2 / this.N) * ( this.N*this.theta / Math.PI / 2 - Math.round(this.N* theta / Math.PI / 2) );
           //    surfrad = this.L * Math.exp( -( Math.pow(2*(s-this.P)/this.W1, 2) + Math.pow(2*lt/this.W2, 2) ) );          
           //  }
           // r2 += surfrad;
          

            var ellipseX = x + Math.cos(s + this.phi) * Math.cos(theta + this.omega) * r2 * rad * this.D;   // here  rad - 1 closes the opening of the curve at the origin
            var ellipseY = y + Math.cos(s + this.phi) * Math.sin(theta + this.omega) * r2 * rad;
            var ellipseZ = z + Math.sin(s + this.phi) * r2 * rad;
            
            // adjust orientation of the 
            // x -= Math.sin(this.mu) * Math.sin(s + this.phi) * Math.sin(theta + this.omega) * r2;
            ellipseX -= Math.sin(this.mu) * Math.sin(s + this.phi) * Math.sin(theta + this.omega) * r2 * rad ;

            // y += Math.sin(this.mu) * Math.sin(s + this.phi) * Math.cos(theta + this.omega) * r2 ;
            ellipseY += Math.sin(this.mu) * Math.sin(s + this.phi) * Math.cos(theta + this.omega) * r2 * rad;
            
            shellEllipseArray[i].push(new THREE.Vector3(ellipseX,ellipseY,ellipseZ));
            
          }
       }

      // Return complete curve.
      this._spiral = spiralPointArray;
      //and 
      this._shell = shellEllipseArray; 

     

  }


  loadHorseConch(){
      
      this.turns = 6; // how many turns in the shell
      this.deltaTheta = degToRad(10) ; //degrees per new session

      this.D = 1 ; 
      this.steps = 0; //how many ellipses C to draw; to be calculated
      this.cSteps = 36; //how many straight lines makes an ellipse C
      this.alpha= degToRad(84); 
      this.beta=degToRad(-19); 
      this.phi=degToRad(45); 
      this.mu=degToRad(1); 
      this.omega=degToRad(-2); 
      
      this.A =  0.5;
      this.a=0.4; //1.2; 
      this.b=.14 ; // 2.0; 
      this.L=8; 
      this.P=0; 
      this.W1=6; 
      this.W2=27; 
      this.N=8;

  }
  loadWentletrap(){
    this.turns = 10; // how many turns in the shell
    this.deltaTheta = degToRad(30) ; //degrees per new session

    this.D = 1 ; 
    this.steps = 0; //how many ellipses C to draw; to be calculated
    this.cSteps = 36; //how many straight lines makes an ellipse C
    this.alpha= degToRad(86); 
    this.beta=degToRad(10); 
    this.phi=degToRad(-45); 
    this.mu=degToRad(5 ); 
    this.omega=degToRad(1); 
    
    this.A =  0.9;
    this.a=0.2;
    this.b=.2 ; 
    this.L=0.14; 
    this.P=40; 
    this.W1=180; 
    this.W2=0.4; 
    this.N=180;
  }

  buildTube( buildSpine ) {

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

    // call method that generates this._spiral
    this.calcSpiral();

    // add tube mesh for each point on the spiral 
    // starting with -36
    var l = this._spiral.length ;  
    for (var i = l- 32 ; i<l; i++){

      geometrySpiral.vertices.push(this._spiral[i]);  
      var oneEllipse = new THREE.Geometry(); 
       
      // var c = 0x011000 + 0x0000e0* i;

      for (var j = 0 ; j < this._shell[i].length; j++){
        // oneEllipse= new THREE.Geometry(); 
        oneEllipse.vertices.push(this._shell[i][j]);  
      }
      oneEllipse.vertices.push(this._shell[i][0]);  //completes full loop
      // oneEllipse.vertices.push(this._shell[i][1]);  //completes full loop
      // cx

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
      this._scene.add( mesh );
    }
    if (buildSpine) { // render spiral spine
      var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xeeeeee
      });
      var spineLine = new THREE.Line( geometrySpiral, lineMaterial );
      this._scene.add( spineLine );
    }
  }

  buildDots() {
    var sphere; 
    var pos; 
    var radius = 0.5; //— sphere radius. Default is 50.
    var widthSegments = 10; //— number of horizontal segments
    var heightSegments = 10; 

    var material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide,  color: 0xFFFFFF, shading: THREE.SmoothShading}); //FlatShading:SmoothShading

    // call method that generates this._spiral
    this.calcSpiral();

    for (var i = 40 ; i< this._spiral.length; i++){
      for (var j = 0 ; j < this._shell[i].length; j++){
        // oneEllipse= new THREE.Geometry(); 
        // oneEllipse.vertices.push(this._shell[i][j]);  

      
        if (j> 12 && j% 8 == 4) {
          radius = 1 ;//0.3;
        } else {
        radius = 0.5; //0.5 //0.1 = one drop 
        }
        sphere = new THREE.Mesh( new THREE.SphereGeometry( radius, widthSegments, heightSegments ), material );
        pos = this._shell[i][j]; 

        sphere.position.set( pos.x, pos.y, pos.z );
        this._scene.add( sphere );
      }
    }
  }
}


function degToRad (deg){
    return deg*Math.PI/180.0; 
}