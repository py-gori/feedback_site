import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, SelectChangeEvent, Typography } from '@mui/material';

import SelectField from '@/module/elements/SelectField';

const CategoryFilter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.pathname.indexOf('feedbacks') !== -1 ? 'feedbacks' : 'bugs';

  const handleCategorize = (event: SelectChangeEvent<string>) => {
    navigate(`/posts/${event.target.value}`);
  };

  const categoryOption = {
    className: '',
    type: 'select',
    value: category,
    label: 'カテゴリ',
    handleChange: handleCategorize,
  };

  const categories = [
    { key: 'feedbacks', value: 'FeedBacks' },
    { key: 'bugs', value: 'Bugs' },
  ];

  const categoryFormStyle = {
    m: 1,
    width: { xs: '100%', sm: '100%', md: 200 },
    bgcolor: 'background.default',
  } as const;

  return (
    <Box className="l-inner">
      <Box
        sx={{ display: { xs: 'flex' }, width: { xs: '100%' } }}
        className="roadmap-link"
      >
        <Link to="/posts">
          <Typography
            sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}
          >
            ロードマップ
          </Typography>
        </Link>
        <SelectField<string>
          option={categoryOption}
          selectItems={categories}
          formStyle={categoryFormStyle}
        />
      </Box>
    </Box>
  );
};

export default CategoryFilter;
