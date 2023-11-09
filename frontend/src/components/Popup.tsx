import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import TextContent from './TextContent';

interface PopupProps {
  questionId?: string;
  title: string;
  children: string;
  openPopup: boolean;
  closePopup: () => void;
}

export default function Popup({ title, children, openPopup, closePopup }: PopupProps) {
  return (
    <Dialog open={openPopup} onClose={closePopup}>
      <div style={{ display: 'flex' }}>
        <DialogTitle style={{ justifyContent: 'space-between' }}>{title}</DialogTitle>
        <Button
          type="button"
          className="btn-close"
          onClick={closePopup}
          aria-label="Close"
          style={{ fontSize: '15px', marginLeft: 'auto', color: 'red' }}
          sx={{
            width: 0,
            height: 50,
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          X
        </Button>
      </div>
      <DialogContent sx={{ pb: 5 }}>
        <TextContent content={children} />
      </DialogContent>
    </Dialog>
  );
}
