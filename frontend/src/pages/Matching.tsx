import { Box, Button, Stack, Typography } from '@mui/material';
import SearchingScreen from '../components/SearchingScreen';
import { useState } from 'react';

export default function Matching() {
  // Usestate to handle the difficulty selected
  const [difficultyLevel, setDifficultyLevel] = useState('');

  // Usestate and functions to handle the loading screen visibility
  const [searchingVisibility, setSearchingVisibility] = useState(false);
  const handleSearchingOnClick = (diff: string) => {
    setDifficultyLevel(diff);
    setSearchingVisibility(true);
  };
  const handlePopupOnClose = () => setSearchingVisibility(false);

  return (
    <Box>
      <Typography
        variant="h2"
        align="center"
        color="white"
        sx={{
          backgroundColor: 'grey',
        }}
      >
        MATCH WITH SOMEONE
      </Typography>
      <br />
      <Typography align="center" component={'span'}>
        <Stack display={'block'} spacing={2} direction={'row'}>
          {searchingVisibility && (
            <SearchingScreen
              title="SEARCHING FOR PARTNER - "
              difficulty={difficultyLevel}
              openScreen={true}
              setCloseScreen={handlePopupOnClose}
            ></SearchingScreen>
          )}
          <Button
            variant={'contained'}
            onClick={() => handleSearchingOnClick('EASY')}
            style={{ fontSize: '50px' }}
            sx={{
              width: 170,
              height: 75,
              backgroundColor: 'green',
            }}
          >
            EASY
          </Button>
          <Button
            variant={'contained'}
            onClick={() => handleSearchingOnClick('MEDIUM')}
            style={{ fontSize: '50px' }}
            sx={{
              width: 230,
              height: 75,
              backgroundColor: 'orange',
            }}
          >
            MEDIUM
          </Button>
          <Button
            variant={'contained'}
            onClick={() => handleSearchingOnClick('HARD')}
            style={{ fontSize: '50px' }}
            sx={{
              width: 170,
              height: 75,
              backgroundColor: 'red',
            }}
          >
            HARD
          </Button>
        </Stack>
      </Typography>
    </Box>
  );
}
