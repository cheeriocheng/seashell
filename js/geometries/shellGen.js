class Seashell {


    constructor(A){
        this.A =  undefined !== A ? A : 0.1;  //2.5
      
        this.turns = 6 * Math.PI;

        this.D = 1 ;
        this.steps = 36; 
        this.cSteps = 24; //for each ellipse C
        this.alpha= degToRad(83); 
        this.beta=degToRad(42); 
        this.phi=degToRad(70); 
        this.mu=degToRad(10); 
        this.omega=degToRad(30); 
        
        this.a=0.6; //1.2; 
        this.b=1.0 ; // 2.0; 
        this.L=0; 
        this.P=0; 
        this.W1=0; 
        this.W2=0; 
        this.N=0;


        this._spiral = null;
        this._shell = null; 
    }

    get spiral (){
        if (this._spiral === null) {
            // this._spiral = this.calcSpiral();
            this.calcSpiral();
        }
        return this._spiral;
    }

    calcSpiral(){
        var spiralPointArray = [];
        var shellEllipseArray = [];
        this.steps = Math.floor ( this.steps * this.turns / 10.0);

     
        for ( var i = 0; i < this.steps; i ++ ) {
            
            var theta = degToRad ( i * 10 ) ; // maplinear (i, 0, n, 0, turns);
            var rad = Math.exp( theta * Math.cos(this.alpha) / Math.sin(this.alpha) );


            var x =  this.A * rad * Math.sin(this.beta) * Math.cos(theta) * this.D;
            var y =  this.A * rad * Math.sin(this.beta) * Math.sin(theta);
            var z = -this.A * rad * Math.cos(this.beta);        

            spiralPointArray.push(new THREE.Vector3(x,y,z));

            // Generate ellipse around each point of spiral
            shellEllipseArray[i] = [];

            for (var j = 0; j < this.cSteps ; j++) 
            {
              // var s = Math.map(j, 0, this.cSteps, 0, Math.PI*2);  
              var s = j* Math.PI * 2 /this.cSteps;
              var r2 = Math.pow( Math.pow(Math.cos(s)/this.a,2) + Math.pow(Math.sin(s)/this.b,2), -0.5 );
              
              // add surface manipulations
              var surfrad = 0;
              // if (W1==0 || W2==0 || N==0) surfrad = 0;
              // else {
              //   float lt = (TWO_PI / N) * ( N*theta / TWO_PI - int(N*theta / TWO_PI) );
              //   surfrad = L * exp( -( pow(2*(s-P)/W1, 2) + pow(2*lt/W2, 2) ) );          
              // }
              r2 += surfrad;
              
              x = Math.cos(s + this.phi) * Math.cos(theta + this.omega) * r2 * rad * this.D;   // here  rad - 1 closes the opening of the curve at the origin
              y = Math.cos(s + this.phi) * Math.sin(theta + this.omega) * r2 * rad;
              z = Math.sin(s + this.phi)                      * r2 * rad;
              
              // adjust orientation of the 
              x -= Math.sin(this.mu) * Math.sin(s + this.phi) * Math.sin(theta + this.omega) * r2;
              y += Math.sin(this.mu) * Math.sin(s + this.phi) * Math.cos(theta + this.omega) * r2;
              z *= Math.cos(this.mu);
              
              shellEllipseArray[i].push(new THREE.Vector3(x,y,z));
              
            }
         }

        // Return complete curve.
        this._spiral = spiralPointArray;
        //and 
        this._shell = shellEllipseArray; 

       

    }




}


function degToRad (deg){
    return deg*Math.PI/180.0; 
}