import React from "react";
import { Dialog, DialogTitle } from "@material-ui/core";

const MyDialog = props => {
  const {
    isOpen = false,
    onClose = () => {},
    title = "",
    assetid = "",
    children,
    ...rest
  } = props;

  const handleClose = event => {
    onClose(event);
  };

  return (
    
    <div className="status-model">,   
    <Dialog className="paperDialoge" onClose={handleClose} open={isOpen}>
      <DialogTitle style={{"padding": "16px 24px 0 21px"}}>{assetid}</DialogTitle>
      <h4 style={{"font-size": "12px","word-break": "break-word","padding": "0 20px","width": "300px"}}>{title}</h4>
      {children}
    </Dialog>
    </div>
    
  );
};

export default MyDialog;
