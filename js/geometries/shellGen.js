// function spiral( center, size, steps ) {

//     // Default Vars
//     var center     = undefined !== center ? center : new THREE.Vector3( 0, 0, 0 ),
//         size       = undefined !== size ? size : 1,
//         half       = size / 2,
//         steps = undefined !== steps ? steps : 64
//     ;

//     var v3array = [];
//     var A = 1 ; 
//     var beta = 40.0* Math.PI /180.0;
//     var alpha= 1.1 ; //Math.degToRad(83); 
//     var D = size ;

//     for ( var i = 0; i < steps; i ++ ) {
        
//         var theta = 0.5* i ; // Math.degToRad ( i * 30 ) ; // maplinear (i, 0, n, 0, turns);
//         var rad = Math.exp( theta * Math.cos(alpha) / Math.sin(alpha) );


//         var x =  A * rad * Math.sin(beta) * Math.cos(theta) * D;
//         var y =  A * rad * Math.sin(beta) * Math.sin(theta);
//         var z = -A * rad * Math.cos(beta);        

//         v3array.push(new THREE.Vector3(x,y,z));
//      }

//     // Return complete curve.
//     return v3array;

// }

class Seashell {


    constructor(A){
        this.A =  undefined !== A ? A : 1; 

    }

    get spiral (){
         return this.calcSpiral ();
    }

    calcSpiral(){
        var v3array = [];
        var beta = 40.0* Math.PI /180.0;
        var alpha= 1.1 ; //Math.degToRad(83); 
        var D = 1 ;
        var steps = 16; 
        for ( var i = 0; i < steps; i ++ ) {
            
            var theta = 0.5* i ; // Math.degToRad ( i * 30 ) ; // maplinear (i, 0, n, 0, turns);
            var rad = Math.exp( theta * Math.cos(alpha) / Math.sin(alpha) );


            var x =  this.A * rad * Math.sin(beta) * Math.cos(theta) * D;
            var y =  this.A * rad * Math.sin(beta) * Math.sin(theta);
            var z = -this.A * rad * Math.cos(beta);        

            v3array.push(new THREE.Vector3(x,y,z));
         }

        // Return complete curve.
        return v3array;


    }


}