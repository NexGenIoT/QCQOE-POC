import React from "react";
import { Dialog, DialogTitle } from "@material-ui/core";

const GlobalSettingDialog = props => {
  const {
    isOpen = false,
    onClose = () => {},
    title = "",
    children,
    ...rest
  } = props;

  const handleClose = event => {
    onClose(event);
  };

  return (
    
    <div className="status-model">  
    <Dialog className="paperDialoge" onClose={handleClose} open={isOpen}>
      <DialogTitle style={{"padding": "16px 24px 0 21px"}}>{title}</DialogTitle>
      {children}
    </Dialog>
    </div>
    
  );
};

export default GlobalSettingDialog;
