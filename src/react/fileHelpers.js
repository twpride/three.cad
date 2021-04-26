

// import {
//   fileOpen,
//   fileSave,
// } from '../../extlib/fs/index';

import {
  fileOpen,
  fileSave,
} from 'browser-fs-access';

import { sce } from './app'

// https://web.dev/file-system-access/

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
  const result = STLexp.parse(sce.selected[0], { binary: true });
  const time = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -5).replace(/:/g, '-');
  saveLegacy(new Blob([result], { type: 'model/stl' }), `${filename}_${time}.stl`);
}


export async function saveFile(fileHandle, file, dispatch, suggestedName) {
  try {
    if (!fileHandle) {
      return await saveFileAs(file, dispatch, suggestedName);
    }

    const blob = new Blob([file], { type: 'application/json' })
    await fileSave(blob, undefined, fileHandle, true)

    dispatch({ type: 'set-modified', status: false })
  } catch (ex) {
    const msg = 'Unable to save file';
    console.error(msg, ex);
    alert(msg);
  }
};

const options = {
  mimeTypes: ['application/json'],
  extensions: ['.json'],
  multiple: false,
  description: 'Part files',
};

export async function saveFileAs(file, dispatch, suggestedName) {

  try {

    const blob = new Blob([file], { type: 'application/json' })

    options.fileName = suggestedName + options.extensions[0]

    const fileHandle = await fileSave(blob, options)

    dispatch({ type: 'set-file-handle', fileHandle, modified: false })

  } catch (ex) {

    const msg = 'Unable to save file.';
    console.error(msg, ex);
    alert(msg);
    return;
  }
};



export async function openFile(dispatch) {
  let file

  try {


    file = await fileOpen(options);

  } catch (ex) {
    if (ex.name === 'AbortError') {
      return;
    }
    const msg = 'An error occured trying to open the file.';
    console.error(msg, ex);
    alert(msg);
  }

  try {
    const text = await file.text();
    console.log(file, file.handle)

    dispatch({ type: 'restore-state', state: sce.loadState(text), fileName: file.name })
    if (file.handle) {
      dispatch({ type: 'set-file-handle', fileHandle: file.handle })
    }

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