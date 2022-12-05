import React,
{
  useState,
  useEffect,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Box, SelectChangeEvent } from '@mui/material';

import { postCategoryFilter } from '@/recoil/posts/selectors';
import SearchBox from '@/module/elements/SearchBox';
import SelectField from '@/module/elements/SelectField';
import compareValues from '@/utils/compareValues';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import CategoryFilter from './components/CategoryFilter';

const Posts: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.indexOf('feedbacks') !== -1 ? 'feedbacks' : 'bugs';
  const categorizedPosts = useRecoilValue(postCategoryFilter(path));

  const [keyword, setKeyword] = useState('');
  const [displayPosts, setDisplayPosts] = useState(categorizedPosts);
  const [sortValue, setSortValue] = useState<string>('');
  const [statusValue, setStatusValue] = useState<number[]>([]);

  useEffect(() => {
    setDisplayPosts(categorizedPosts);
  }, [categorizedPosts]);

  useEffect(() => {
    if (keyword === '') {
      setDisplayPosts(categorizedPosts);
      return;
    }

    const searchKeywords = keyword.trim().toLowerCase().match(/[^\s]+/g);
    if (searchKeywords === null) {
      setDisplayPosts(categorizedPosts);
      return;
    }

    const result = categorizedPosts.filter((post) => (
      searchKeywords.every((kw) => post.title.toLowerCase().indexOf(kw) !== -1)));
    setDisplayPosts(result);
  }, [keyword, categorizedPosts]);

  const sortPosts = (target: string) => {
    setDisplayPosts(displayPosts.slice().sort(compareValues(target, 'desc')));
  };

  const filterPosts = (target: number[]) => {
    if (target.length === 0) {
      setDisplayPosts(categorizedPosts);
      return true;
    }
    setDisplayPosts(categorizedPosts.filter((post) => target.indexOf(post.status) !== -1));
    return true;
  };

  const handleSort = (event: SelectChangeEvent<string>) => {
    setSortValue(event.target.value);
    sortPosts(event.target.value);
  };

  const handleFilter = (event: SelectChangeEvent<typeof statusValue>) => {
    setStatusValue(event.target.value as number[]);
    filterPosts(event.target.value as number[]);
  };

  const sortOption = {
    type: 'select',
    value: sortValue,
    label: 'ソート',
    handleChange: handleSort,
  };

  const filterOption = {
    type: 'multiple',
    value: statusValue,
    label: 'フィルタ',
    handleChange: handleFilter,
  };

  const sorts = [
    { key: 'vote_count', value: '投票数が多い順' },
    { key: 'comment_count', value: 'コメントが多い順' },
    { key: 'created_at', value: '投稿順' },
  ];

  const statuses = [
    { key: 0, value: 'レビュー中' },
    { key: 1, value: '対応中' },
    { key: 2, value: '完了' },
    { key: 3, value: '見送り' },
  ];

  return (
    <Box bgcolor="background.paper" className="posts">
      <CategoryFilter />
      <section className="detail-list-section">
        <Box
          sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row-reverse' } }}
          bgcolor="background.paper"
          className="l-inner"
          // className="l-inner detail-list-content"
        >
          <CreatePost />
          <Box
            sx={{ width: { xs: '100%', sm: '70%' } }}
            // className="detail-list"
          >
            <div className="detail-list-filter">
              <SearchBox setKeyword={setKeyword} />
              <SelectField<string> option={sortOption} selectItems={sorts} />
              <SelectField<number[]> option={filterOption} selectItems={statuses} />
            </div>

            <PostList posts={displayPosts} />
          </Box>
        </Box>
      </section>
    </Box>
  );
};

export default Posts;
