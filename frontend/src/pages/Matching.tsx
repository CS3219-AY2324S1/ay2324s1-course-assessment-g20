import { Button, Stack, Typography, Box } from '@mui/material';
import SearchingScreen from '../components/SearchingScreen';
import { useEffect, useState } from 'react';
import { IDifficulty } from '../@types/question';
import { getDifficulties } from '../api/questionBankApi';

export default function Matching() {
  const backgroundColors = {
    Easy: 'green',
    Medium: 'orange',
    Hard: 'red',
  };

  const [difficultyLevel, setDifficultyLevel] = useState<IDifficulty>();

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
    <Box py={2}>
      <Typography variant="h4" align="center" mb={2}>
        Prep with others
      </Typography>
      <Typography align="center" variant="subtitle2">
        Choose a question difficulty level and start practicing with a stranger.
      </Typography>
      <br />
      <Box display="flex" justifyContent="center">
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
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
              style={{ fontSize: '40px' }}
              sx={{
                backgroundColor: backgroundColors[difficulty.name as keyof typeof backgroundColors],
              }}
            >
              {difficulty.name}
            </Button>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
