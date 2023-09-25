import {
  Box, 
  FormControl, 
  InputLabel,
  MenuItem, 
  Paper, 
  Select, 
  SelectChangeEvent, 
  Typography 
} from '@mui/material';
// import { useAuth } from '../utils/hooks';
import { 
  // Suspense, 
  useState 
} from 'react';
import { 
  // Await, 
  useLoaderData 
} from "react-router-dom";

export default function Profile() {
  const userProfileData = useLoaderData();
  console.log(userProfileData);
  const [preferredLanguage, setPreferredLanguage] = useState('');

  const handlePreferredLanguageChange = (event: SelectChangeEvent) => {
    setPreferredLanguage(event.target.value as string);
    // @TODO: API call to patch user's preferred language
  };

  return (
    // <Suspense fallback={<p>Loading data...</p>}>
    //   <Await
    //     resolve={userProfileData}
    //     errorElement={
    //       <p>Error loading data</p>
    //     }>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
          }}
        >
          <Paper elevation={3} sx={{ padding: '2rem', width: '50%' }}>
          {/* <Typography fontSize={20} variant='h1' fontWeight={20} paddingBottom={3} align='center'>{userProfileData.name}</Typography> */}
          <Typography fontSize={20} variant='h1' fontWeight={20} paddingBottom={3} align='center'>{"User Name's Profile"}</Typography>
            <FormControl fullWidth>
              <InputLabel id="preferred-language-label">Preferred Language</InputLabel>
              <Select
                labelId="preferred-language-label"
                id="preferred-language-select"
                value={preferredLanguage}
                label="Preferred Language"
                onChange={handlePreferredLanguageChange}
                // defaultValue={userProfileData.preferredLanguage}
                
              >
                <MenuItem value={10}>JavaScript</MenuItem>
                <MenuItem value={20}>TypeScript</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Box>
    //   </Await>
    // </Suspense>
  );
}