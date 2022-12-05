import React from 'react';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';

type ModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  label: string;
  children: React.ReactNode;
  customStyles?: {content: React.CSSProperties | SxProps, overlay: React.CSSProperties};
}

const ModalElement: React.FC<ModalProps> = ({
  isOpen,
  handleClose,
  label,
  children,
  customStyles,
}) => {
  return (
    <Modal
      sx={customStyles?.overlay}
      aria-labelledby={label}
      open={isOpen}
      onClose={() => handleClose()}
    >
      <Box
        sx={customStyles?.content}
      >
        {children}
      </Box>
    </Modal>
  );
};

ModalElement.defaultProps = {
  customStyles: {
    content: {
      position: 'absolute',
      width: '50%',
      height: '50%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      background: 'white',
      bgcolor: 'background.paper',
      padding: '0em',
      borderRadius: '3px',
      transform: 'translate(-50%, -50%)',
    },
    overlay: {
      position: 'fixed',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
};

export default ModalElement;
