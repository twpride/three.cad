import ReactDOM from 'react-dom'
import React from 'react'
const modalRoot = document.getElementById('react');


export class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.setModal = props.setModal
    this.id = props.id

    this.handleClickout = this.handleClickout.bind(this)

  }

  handleClickout(e) {
    if (modalRoot.lastChild != this.el ) return

    console.log(this.id, e.composedPath())


    if (!e.composedPath().includes(this.el)) {
      this.setModal(false)
      e.stopPropagation()
    }
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);

    document.addEventListener( // handles click outside buttona & dropdown
      'click', this.handleClickout
      ,
      { capture: true } // capture phase to allow for stopPropogation on others
    )
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickout, { capture: true })
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}