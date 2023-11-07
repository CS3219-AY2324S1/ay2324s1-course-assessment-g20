import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import TextContent from './TextContent';
import CodeContent from './CodeContent';
import { DEFAULT_LANGUAGE } from '../utils/languageUtils';

interface PopupProps {
  questionId?: string;
  title: string;
  children: string;
  isCode?: boolean;
  language?: string;
  openPopup: boolean;
  closePopup: () => void;
}

export default function Popup({
  title,
  children,
  isCode = false,
  language = DEFAULT_LANGUAGE, // Default language is javascript
  openPopup,
  closePopup,
}: PopupProps) {
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
      <DialogContent
        sx={{ pb: 5 }}
        style={{
          whiteSpace: 'pre-line', // This property preserves newline characters
        }}
      >
        {isCode ? (
          <CodeContent
            content={children}
            language={language.toLowerCase() ?? DEFAULT_LANGUAGE.toLowerCase()}
          />
        ) : (
          <TextContent content={children} />
        )}
      </DialogContent>
    </Dialog>
  );
}
