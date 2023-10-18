import { Box, Button, Stack, Typography } from '@mui/material';
import SearchingScreen from '../components/SearchingScreen';
import { useEffect, useState } from 'react';
import { IDifficulty } from '../@types/question';
import { getDifficulties } from '../api/questionBankApi';

export default function Matching() {
  // Usestate to handle the difficulty selected
  const [difficultyLevel, setDifficultyLevel] = useState<IDifficulty>();

  const backgroundColors = {
    Easy: 'green',
    Medium: 'orange',
    Hard: 'red',
  };

  // Usestate and functions to handle the loading screen visibility
  const [searchingVisibility, setSearchingVisibility] = useState(false);
  const handleSearchingOnClick = (difficulty: IDifficulty) => {
    setDifficultyLevel(difficulty);
    setSearchingVisibility(true);
  };
  const handlePopupOnClose = () => setSearchingVisibility(false);

  const [difficulties, setDifficulties] = useState<IDifficulty[]>([]);

  useEffect(() => {
    // Fetch difficulties from API
    getDifficulties()
      .then((response) => {
        setDifficulties(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

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
          {searchingVisibility && difficultyLevel && (
            <SearchingScreen
              title="SEARCHING FOR PARTNER - "
              difficulty={difficultyLevel}
              openScreen={true}
              setCloseScreen={handlePopupOnClose}
            ></SearchingScreen>
          )}

          {difficulties.map((difficulty) => (
            <Button
              key={difficulty._id}
              variant={'contained'}
              onClick={() => handleSearchingOnClick(difficulty)}
              style={{ fontSize: '50px' }}
              sx={{
                height: 75,
                backgroundColor: backgroundColors[difficulty.name as keyof typeof backgroundColors],
              }}
            >
              {difficulty.name}
            </Button>
          ))}
        </Stack>
      </Typography>
    </Box>
  );
}
