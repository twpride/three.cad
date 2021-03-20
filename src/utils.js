export function KeyboardController() {
  this.state="";
  window.addEventListener('keydown', (e)=> {
    if (e.key == "Escape"){
      this.state = ""
    } else {
      this.state = e.key
    }
  })
}