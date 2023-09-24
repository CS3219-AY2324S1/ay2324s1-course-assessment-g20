import { 
  Button, 
  Dialog, 
  DialogContent, 
  DialogTitle 
} from '@mui/material';

interface PopupProps {
  title: string;
  children: string;
  openPopup: boolean;
  setOpenPopup: () => void;
}

export default function Popup({ title, children, openPopup, setOpenPopup }: PopupProps) {
  return (
    <Dialog open={openPopup}>
      <DialogTitle style={{ justifyContent: 'space-between' }}>
        {title}
        <Button 
          type="button" 
          className="btn-close" 
          onClick={setOpenPopup} 
          aria-label="Close"
          style={{ fontSize: '20px', padding: "0px 0px" }}
          sx={{
            width: 10,
            height: 25,
            backgroundColor: 'white',
          }}
        >
          X
        </Button>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
