class Seashell {


    constructor(A){
        this.A =  undefined !== A ? A : 0.25 ; //0.1
        this.turns = 6; // how many turns in the shell
        this.deltaTheta = degToRad(10) ; //degrees per new session

        this.D = 1 ; 
        this.steps = 0; //how many ellipses C to draw; to be calculated
        this.cSteps = 36; //how many straight lines makes an ellipse C
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


       // this.loadHorseConch() ; 

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

            for (var j = 0; j < this.cSteps ; j++) 
            {
              var s = j * Math.PI * 2 /this.cSteps;  //angular step around the ellipse 
              var r2 = Math.pow( Math.pow(Math.cos(s)/this.a,2) + Math.pow(Math.sin(s)/this.b,2), -0.5 ); //radius at this given angle s
              
              // add surface manipulations
              var surfrad = 0;
              // if (this.W1==0 || this.W2==0 || this.N==0) surfrad = 0;
              // else {
              //   float lt = (Math.PI * 2 / this.N) * ( this.N*this.theta / Math.PI / 2 - int(this.N* theta / Math.PI / 2) );
              //   surfrad = L * exp( -( pow(2*(s-P)/W1, 2) + pow(2*lt/W2, 2) ) );          
              // }
              r2 += surfrad;
            

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

}


function degToRad (deg){
    return deg*Math.PI/180.0; 
}