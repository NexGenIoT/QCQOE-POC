import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
class RctModel extends Component{
  render() {
    const { heading, isOpen, footer, closeModal, isBackDropEnabled, istrue,popUpButtonsEnd } =
      this.props;
    return (
      <Modal
        className={`custom-model modal-dialog-centered`}
        isOpen={isOpen}
        toggle={() => {
          isBackDropEnabled && closeModal();
        }}
      >
        <ModalHeader className={`border-bottom-0 ${istrue?'p-0':''}`}>{heading}</ModalHeader>
        <ModalBody className={`text-center ${istrue?'p-0':''}`}>{this.props.children}</ModalBody>
        {!!footer && !!Object.keys(footer).length && (
          <ModalFooter className={`${popUpButtonsEnd?'blocked-primary':'justify-content-center'} border-top-0 py-0 modal-popup`}>
            <div className="pop-btns modal-popup">
              {footer?.primaryButton && (
                <button
                  variant="contained"
                  color="primary"
                  className={`${footer?.primaryButton?.addClass}`}
                  onClick={footer?.primaryButton?.action}
                >
                  {footer?.primaryButton?.name}
                </button>
              )}

              {footer?.secondaryButton && (
                <button
                  variant="contained"
                  className={`text-white ml-3 ${footer?.secondaryButton?.addClass}`}
                  onClick={footer?.secondaryButton?.action}
                >
                  {footer?.secondaryButton?.name}
                </button>
              )}
              
               {footer?.thirdButton && (
               <button
                 variant="contained"
                 className={`${footer?.thirdButton?.addClass}`}
                 onClick={footer?.thirdButton?.action}
               >
                 {footer?.thirdButton?.name}
               </button>
             )}           
            </div>
          </ModalFooter>
        )}
      </Modal>
    );
  }
}

RctModel.defaultProps = {
  isBackDropEnabled: false,
};

export default RctModel;