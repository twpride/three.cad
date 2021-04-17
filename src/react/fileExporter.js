const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

function save(blob, filename) {

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

}


function saveArrayBuffer( buffer, filename ) {

  // save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
  save( new Blob( [ buffer ], { type: 'model/stl' } ), filename );

}

function saveString( text, filename ) {

  // save( new Blob( [ text ], { type: 'text/plain' } ), filename );
  save( new Blob( [ text ], { type: 'application/json' } ), filename );

}

export function STLExport() {
  if (sc.selected[0] && sc.selected[0].userData.type == 'mesh') {
    const result = STLexp.parse( sc.selected[0], { binary: true } );
    saveArrayBuffer( result, 'box.stl' );
  }
}


export function savePart() {

  saveString( sc.saveString(), 'uncomp.json' );

}