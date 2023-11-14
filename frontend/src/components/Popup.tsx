import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import TextContent from './TextContent';
import CodeContent from './CodeContent';
import { DEFAULT_LANGUAGE } from '../utils/languageUtils';
import palette from '../theme/palette';

interface PopupProps {
  TitleIcon?: React.ReactNode;
  title: string;
  children: string;
  isCode?: boolean;
  language?: string;
  openPopup: boolean;
  closePopup: () => void;
  // Button props
  showButton?: boolean;
  buttonBackgroundColor?: string;
  buttonHoverColor?: string;
  buttonFontColor?: string;
  buttonText?: string;
  buttonOnClick?: () => void;
}

export default function Popup({
  TitleIcon,
  title,
  children,
  isCode = false,
  language = DEFAULT_LANGUAGE, // Default language is javascript
  openPopup,
  closePopup,
  showButton = false,
  buttonBackgroundColor = palette.primary.main,
  buttonHoverColor = palette.primary.main,
  buttonFontColor = 'white',
  buttonText = 'Submit',
  buttonOnClick = () => {},
}: PopupProps) {
  return (
    <Dialog open={openPopup} onClose={closePopup}>
      <div style={{ display: 'flex' }}>
        <DialogTitle style={{ justifyContent: 'space-between' }}>
          {TitleIcon}
          <b> {title}</b>
        </DialogTitle>
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
          <>
            Your attempt:
            <CodeContent content={children} language={language.toLowerCase()} />
          </>
        ) : (
          <TextContent content={children} />
        )}
      </DialogContent>
      {showButton && (
        <Button
          variant={'contained'}
          onClick={buttonOnClick}
          style={{ fontSize: '15px', textAlign: 'center', margin: '-24px 24px 24px 24px' }}
          sx={{
            backgroundColor: buttonBackgroundColor,
            '&:hover': {
              backgroundColor: buttonHoverColor,
            },
            color: buttonFontColor,
          }}
        >
          {buttonText}
        </Button>
      )}
    </Dialog>
  );
}
