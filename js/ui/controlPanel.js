
//add control panel 
var controlDiv = document.createElement("div"); 
controlDiv.setAttribute("id",'controlPanel')
// var newContent = document.createTextNode("Hi there and greetings!"); 
//   newDiv.appendChild(newContent); //add the text node to the newly created div.
document.body.appendChild(controlDiv); 

//add slider

//<input type="range" min="0" max="50" value="25" />
var slider = document.createElement("input");
slider.setAttribute("type",'range');
slider.setAttribute("min",'0');
slider.setAttribute("max",'50');
slider.setAttribute("value",'10');
slider.setAttribute("step",'5');
controlDiv.appendChild(slider);

slider.addEventListener("oninput", function(){
    console.log("on input ");
    showValue(this.value);
});


//add export button 
// 1. Create the button
var button = document.createElement("button");
button.innerHTML = "export obj";
// 2. Append somewhere
controlDiv.appendChild(button);

// 3. Add event handler
button.addEventListener ("click", function() {
  exportToObj();
});

function showValue(newValue)
{
    // document.getElementById("range").innerHTML=newValue;
    console.log(newValue);
}

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
