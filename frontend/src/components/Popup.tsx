import { Button, Dialog, DialogContent, DialogTitle, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextContent from './TextContent';

interface PopupProps {
  questionId?: string;
  title: string;
  children: string;
  openPopup: boolean;
  setOpenPopup: () => void;
}

export default function Popup({
  questionId,
  title,
  children,
  openPopup,
  setOpenPopup,
}: PopupProps) {
  const { palette } = useTheme();
  const navigate = useNavigate();

  return (
    <Dialog open={openPopup} onClose={setOpenPopup}>
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
      <DialogContent sx={{ pb: 5 }}>
        <TextContent content={children} />
        <Button
          onClick={() => navigate(`/question/${questionId}`)}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderRadius: 0,
            width: '100%',
            color: 'white',
            backgroundColor: palette.primary.main,
            '&:hover': { backgroundColor: palette.primary.light },
          }}
        >
          Solve with a peer
        </Button>
      </DialogContent>
    </Dialog>
  );
}
