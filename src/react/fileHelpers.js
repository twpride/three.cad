const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);

function saveLegacy(blob, filename) {

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

}


var tzoffset = (new Date()).getTimezoneOffset() * 60000;


export function STLExport(filename) {

  const result = STLexp.parse(sc.selected[0], { binary: true });

  const time = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -5).replace(/:/g, '-');

  saveLegacy(new Blob([result], { type: 'model/stl' }), `${filename}_${time}.stl`);
}


export async function saveFile(fileHandle, file, dispatch) {
  try {
    if (!fileHandle) {
      return await saveFileAs(file, dispatch);
    }
    await writeFile(fileHandle, file);

    dispatch({ type: 'set-modified', status: false })
  } catch (ex) {
    const msg = 'Unable to save file';
    console.error(msg, ex);
    alert(msg);
  }
};

export async function saveFileAs(file, dispatch) {
  let fileHandle;
  try {

    const opts = {
      types: [{
        description: 'Text file',
        accept: { 'application/json': ['.json'] },
      }],
    };
    fileHandle = await showSaveFilePicker(opts)


  } catch (ex) {
    if (ex.name === 'AbortError') {
      return;
    }
    const msg = 'An error occured trying to open the file.';
    console.error(msg, ex);
    alert(msg);
    return;
  }

  try {
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(file);
    // Close the file and write the contents to disk.
    await writable.close()

    dispatch({ type: 'set-file-handle', fileHandle, modified: false })

  } catch (ex) {

    const msg = 'Unable to save file.';
    console.error(msg, ex);
    alert(msg);
    return;
  }
};



export async function openFile(dispatch) {
  let fileHandle

  // If a fileHandle is provided, verify we have permission to read/write it,
  // otherwise, show the file open prompt and allow the user to select the file.
  try {
    fileHandle = await getFileHandle();
  } catch (ex) {
    if (ex.name === 'AbortError') {
      return;
    }
    const msg = 'An error occured trying to open the file.';
    console.error(msg, ex);
    alert(msg);
  }

  if (!fileHandle) {
    return;
  }


  try {
    const file = await fileHandle.getFile();
    const text = await file.text();;

    dispatch({ type: 'restore-state', state: sc.loadState(text) })
    dispatch({ type: 'set-file-handle', fileHandle })

    // app.setFocus(true);

  } catch (ex) {
    const msg = `An error occured reading ${fileHandle}`;
    console.error(msg, ex);
    alert(msg);
  }


};


export function confirmDiscard(modified) {
  if (!modified) {
    return true;
  }
  const confirmMsg = 'Discard changes? All changes will be lost.';
  return confirm(confirmMsg);
};


export async function verifyPermission(fileHandle) {
  const opts = {
    mode: 'readwrite'
  };

  // Check if we already have permission, if so, return true.
  if (await fileHandle.queryPermission(opts) === 'granted') {
    return true;
  }
  // Request permission to the file, if the user grants permission, return true.
  if (await fileHandle.requestPermission(opts) === 'granted') {
    return true;
  }
  // The user did nt grant permission, return false.
  return false;
}