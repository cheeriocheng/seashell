"use strict";

class Seashell {


  constructor(){
    //default: boat ear mooon 
    this.A = 0.25 ; //0.1
    this.turns =  5;  //6; // how many turns in the shell
    this.deltaTheta = degToRad(15) ; //degrees per new session
    this.minStep = 4 ;  //1

    this.D = 1 ; 
    this.steps = 60; //how many ellipses C to draw; 
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
    this._spiral = null;
    this._shell = null; 
  }

  loadZcorp(){
      this.A =   0.25 ; //0.1
      // this.turns = 6.7; // how many turns in the shell
      this.deltaTheta = degToRad(18) ; //degrees per new session //18 23
  

      this.minStep =  4;  //4
      this.D = 1 ;  //1
      this.steps = 30; //how many ellipses C to draw; to be calculated
      this.cSteps = 14; //12, 10 how many straight lines makes an ellipse C
      this.alpha= degToRad(83);  //83
      this.beta=degToRad(80);  //how steep the cone of spiral is 
      this.phi=degToRad(70);  //70
      this.mu=degToRad(30);  //10,30 how twisty the spiral is 
      this.omega=degToRad(30);  
      
      //opening of the tube 
      this.a=0.12; 
      this.b=0.2; 

      this.L=1.4; 
      this.P=4; 
      this.W1=18; 
      this.W2=0.4; 
      this.N=18;
  }


  loadHorseConch(){
      
      this.turns = 6; // how many turns in the shell
      this.deltaTheta = degToRad(10) ; //degrees per new session

      this.D = 1 ; 
      this.steps = 30; //how many ellipses C to draw; to be calculated
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
    this.steps = 30; //how many ellipses C to draw
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



  updateParams( p )
  {
    //// get data from UI 
    // this.A = p["A"];
    // this.turns = p["turns"];
    // this.deltaTheta = degToRad(p["deltaTheta"]);
    // this.D = p["D"];
    // this.steps = p["steps"];
    // this.cSteps = p["cSteps"];
    // this.alpha = degToRad(p["alpha"]);
    // this.beta = degToRad(p["beta"]);
    // this.phi = degToRad(p["phi"]);
    // this.mu = degToRad(p["mu"]);
    // this.omega = degToRad(p["omega"]);
    
    this.loadZcorp(); //glitch: disks flip..



    //generates this._spiral
    this.calcSpiral();
  }

  //equal angular steps means many small steps at the center of the shell,
  //which is a lot of triangles wasted on small area
  //this also jams support material inside model
 //while distance is smaller than step, keep adding to theta 
  getNextVertexOnSpiral(theta , lastVertex ){
    
    theta += this.deltaTheta;
    var newVertex = this.getVertexAtTheta(theta);
    var dist = newVertex.distanceTo(lastVertex); 

    while(dist< this.minStep ) {
     theta += this.deltaTheta;
     newVertex = this.getVertexAtTheta(theta);
     dist = newVertex.distanceTo(lastVertex); 
    }

    return [theta , newVertex] ;
  }

  getRadAtTheta(theta){
    return  Math.exp( theta * Math.cos(this.alpha) / Math.sin(this.alpha) );
  }

  getVertexAtTheta(theta){
      
    var rad = this.getRadAtTheta(theta);
    
    var x =  this.A * rad * Math.sin(this.beta) * Math.cos(theta) * this.D;
    var y =  this.A * rad * Math.sin(this.beta) * Math.sin(theta);
    var z = -this.A * rad * Math.cos(this.beta);    

    return new THREE.Vector3(x,y,z);

  }

  calcSpiral(){
      var spiralPointArray = [];
      var shellEllipseArray = [];
    
    
      console.log ("generating spiral. total steps in spiral: ", this.steps); 


      var theta = 0 ;  
      var rad; 
      var lastVertex = this.getVertexAtTheta(theta ); 
      

      for ( var i = 0; i < this.steps; i ++ ) {
                   
          //V1 equal angualar increments ----
          // theta +=  this.deltaTheta ; // maplinear (i, 0, n, 0, turns);
          // rad = Math.exp( theta * Math.cos(this.alpha) / Math.sin(this.alpha) );     
          // var newVertex = this.getVertexAtTheta (theta) ;

          //V2 minimal space between steps ---
           var newVertex; 
          [theta, newVertex] = this.getNextVertexOnSpiral(theta, lastVertex ); 
          // console.log(i, newVertex);
          rad = this.getRadAtTheta (theta);
         
          //Qtip : keep newVertex at (0,0,0) to make a furball

          spiralPointArray.push(newVertex);
          lastVertex = newVertex; 

          // Generate ellipse around each point of spiral
          shellEllipseArray[i] = [];
          var r2 =  Math.pow( Math.pow(Math.cos(s)/this.a,2) + Math.pow(Math.sin(s)/this.b,2), -0.5 ); //radius at this given angle           
          for (var j = 0; j < this.cSteps ; j++) 
          {
            
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
          

            var ellipseX = lastVertex.x + Math.cos(s + this.phi) * Math.cos(theta + this.omega) * r2 * rad * this.D;   // here  rad - 1 closes the opening of the curve at the origin
            var ellipseY = lastVertex.y + Math.cos(s + this.phi) * Math.sin(theta + this.omega) * r2 * rad;
            var ellipseZ = lastVertex.z + Math.sin(s + this.phi) * r2 * rad;
            
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

// render spiral spine 
  renderSpine(scene, ifRenderSpine){
    
  

    if (ifRenderSpine) { 
      console.log("rendering spine");
      var geometrySpiral = new THREE.Geometry();
      
      for (var i = 0 ; i<this._spiral.length; i++){
        geometrySpiral.vertices.push(this._spiral[i]);  
      }
      var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xee00ee
      });
      var spineLine = new THREE.Line( geometrySpiral, lineMaterial );
      scene.add( spineLine );
    }
  }

  buildTube( scene, ifRenderTube ) {

    // console.log("building tube");
    // console.log(this);
    var extrudeShapePoints = [], count = 30;
    //section 
    var a = 4;  //ellipse size 4.3
    var b = .8;//1
    var t =0;

    var c = 0.2 ; //0.2 
    var k = 5 ; //5
    var tempX;
    var tempY;

    for ( var i = 0; i < count; i ++ ) {
        
      t = 2 * i / count * Math.PI;
      tempX = Math.cos( t ) * b; 
      tempY = Math.sin( t ) * a; 

      // tempX += -c*Math.cos(t*k) ;
      // tempY += c*Math.sin(t*k) ;

      extrudeShapePoints.push( new THREE.Vector2 ( tempX, tempY));
    }

    var extrudeShape = new THREE.Shape( extrudeShapePoints );

    var extrudeMaterial = new THREE.MeshLambertMaterial( { color: 0xeeeeee, wireframe: false } );

    // add tube mesh for each point on the spiral 
    var l = this._spiral.length ;  
    for (var i = 5; i<l; i++){

      // geometrySpiral.vertices.push(this._spiral[i]);  
      var oneEllipse = new THREE.Geometry(); 
       
      // var c = 0x011000 + 0x0000e0* i;

      for (var j = 0 ; j < this._shell[i].length; j++){
      // for (var j = this._shell[i].length-1; j >=0  ; j--){
        // oneEllipse= new THREE.Geometry(); 
        oneEllipse.vertices.push(this._shell[i][j]);  
      }
      oneEllipse.vertices.push(this._shell[i][0]);  //completes full loop

   

      var extrusionSpline =  new THREE.CatmullRomCurve3( oneEllipse.vertices );
      extrusionSpline.type = 'catmullrom';
      extrusionSpline.closed = true;
      var extrudeSettings = {
        steps           : this.cSteps*3, //int. number of points used for subdividing segements of extrude spline 
        bevelEnabled    : false,
        extrudePath     : extrusionSpline
      };
      

      var extrudeGeometry = new THREE.ExtrudeGeometry( extrudeShape, extrudeSettings );

      if(ifRenderTube){
         var mesh = new THREE.Mesh( extrudeGeometry, extrudeMaterial );
        scene.add( mesh );  
      } 
    }
  }



  // buildDots( scene ) {
  //   var sphere; 
  //   var pos; 
  //   var radius = 0.5; //— sphere radius. Default is 50.
  //   var widthSegments = 10; //— number of horizontal segments
  //   var heightSegments = 10; 

  //   var material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide,  color: 0xFFFFFF, shading: THREE.SmoothShading}); //FlatShading:SmoothShading

  //   for (var i = 40 ; i< this._spiral.length; i++){
  //     for (var j = 0 ; j < this._shell[i].length; j++){
  //       // oneEllipse= new THREE.Geometry(); 
  //       // oneEllipse.vertices.push(this._shell[i][j]);  

      
  //       if (j> 12 && j% 8 == 4) {
  //         radius = 1 ;//0.3;
  //       } else {
  //       radius = 0.5; //0.5 //0.1 = one drop 
  //       }
  //       sphere = new THREE.Mesh( new THREE.SphereGeometry( radius, widthSegments, heightSegments ), material );
  //       pos = this._shell[i][j]; 

  //       sphere.position.set( pos.x, pos.y, pos.z );
  //       scene.add( sphere );
  //     }
  //   }
  // }
}


function degToRad (deg){
    return deg*Math.PI/180.0; 
}