import { Button } from '@mui/material';

interface FunctionalityButtonProps {
  children: string;
  handleOnClick: () => void;
}

export default function FunctionalityButton({ children, handleOnClick }: FunctionalityButtonProps) {
  return (
    <Button
      variant={'contained'}
      onClick={handleOnClick}
      style={{ fontSize: '15px' }}
      sx={{
        width: 180,
        height: 50,
      }}
    >
      {children}
    </Button>
  );
}
