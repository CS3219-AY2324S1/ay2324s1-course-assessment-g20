import { Button, Stack, Typography, Box, useTheme } from '@mui/material';
import SearchingScreen from '../components/SearchingScreen';
import { useEffect, useState } from 'react';
import { IDifficulty } from '../@types/question';
import { getDifficulties } from '../api/questionBankApi';
import { PaletteKey } from '../theme/palette';

export default function Matching() {
  const { palette } = useTheme();
  // Usestate to handle the difficulty selected
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
        {difficultyLevel && (
          <SearchingScreen
            difficulty={difficultyLevel}
            openScreen={searchingVisibility}
            setCloseScreen={handlePopupOnClose}
          ></SearchingScreen>
        )}
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          {difficulties.map((difficulty) => (
            <Button
              key={difficulty.name}
              variant="contained"
              onClick={() => handleSearchingOnClick(difficulty)}
              style={{ fontSize: '40px' }}
              sx={{
                backgroundColor: palette[difficulty.name.toLowerCase() as PaletteKey].main,
                '&:hover': {
                  backgroundColor: palette[difficulty.name.toLowerCase() as PaletteKey].dark,
                },
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
