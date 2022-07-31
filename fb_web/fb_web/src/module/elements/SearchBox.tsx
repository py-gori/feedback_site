import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

import TextField from '@mui/material/TextField';
import { SearchIcon } from '@heroicons/react/outline';

type KeyWordProps = {
  setKeyword: React.Dispatch<string>;
}

const SearchTextField = styled(TextField)(() => ({
  '& fieldset': {
    borderRadius: '10px',
  },
}));

const SearchBox: React.FC<KeyWordProps> = ({ setKeyword }) => {
  const inputChangedHandler = (event: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <Box
      sx={{
        pl: { xs: 0 },
        pr: { xs: 1 },
      }}
      bgcolor="background.paper"
      className="l-inner"
    >
      <Box className="search-box">
        <SearchIcon className="h-5 w-6" />
        <SearchTextField
          sx={{
            width: { xs: '100%' },
            bgcolor: 'background.default',
          }}
          id="outlined-search"
          label="探す..."
          type="search"
          onChange={(event) => inputChangedHandler(event)}
        />
      </Box>
    </Box>
  );
};

export default SearchBox;
