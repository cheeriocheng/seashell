var exportButton//, floatingDiv;


var newDiv = document.createElement("div"); 
newDiv.setAttribute("id",'controlPanel')
var newContent = document.createTextNode("Hi there and greetings!"); 
  newDiv.appendChild(newContent); //add the text node to the newly created div. 

document.body.appendChild(newDiv); 


    exportButton = document.getElementById( 'export' );
    exportButton.addEventListener( 'click', function() { exportToObj(); });




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
