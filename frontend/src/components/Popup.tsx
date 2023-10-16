import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import TextContent from './TextContent';

interface PopupProps {
  title: string;
  children: string;
  openPopup: boolean;
  setOpenPopup: () => void;
}

export default function Popup({ title, children, openPopup, setOpenPopup }: PopupProps) {
  return (
    <Dialog open={openPopup}>
      <div style={{ display: 'flex' }}>
        <DialogTitle style={{ justifyContent: 'space-between' }}>{title}</DialogTitle>
        <Button
          type="button"
          className="btn-close"
          onClick={setOpenPopup}
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
      <DialogContent>
        <TextContent content={children} />
      </DialogContent>
    </Dialog>
  );
}
