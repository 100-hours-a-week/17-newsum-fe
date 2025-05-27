import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DefaultAxios from '../api/DefaultAxios';
import ArticleCard from '../components/article/ArticleCard';
import SearchBar from '../components/search/SearchBar';
import useDebounce from '../hooks/useDebounce';
import styled from '@emotion/styled';

const Container = styled(Box)`
  margin-top: 16px;
  margin-bottom: 16px;
  background-color: white;
  max-width: 1200px;
  min-width: 350px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  padding: 0 16px;

  @media (max-width: 350px) {
    min-width: 350px;
    margin: 0;
  }
`;

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 16px 0;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`;

const SearchResultMessage = styled(Typography)`
  text-align: center;
  margin-top: 4rem;
  color: ${props => props.theme.palette.text.secondary};
`;

function SearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // 디바운스된 검색어
  const debouncedSearchQuery = useDebounce(searchQuery, 100);

  // 검색 API 호출 함수
  const searchWebtoons = useCallback(async (query, cursor = null) => {
    if (query.length < 3) return;

    try {
      setLoading(true);
      const params = {
        q: query,
        size: 10
      };
      if (cursor) {
        params.cursor = cursor;
      }
      
      const res = await DefaultAxios.get('/api/v1/webtoons/search', { params });
      const responseData = res.data?.data;
      const newResults = responseData?.webtoons || [];
      const newPageInfo = responseData?.pageInfo || null;

      if (cursor) {
        setSearchResults(prev => [...prev, ...newResults]);
      } else {
        setSearchResults(newResults);
      }
      setPageInfo(newPageInfo);
      setHasSearched(true);
    } catch (err) {
      console.error('검색 중 오류 발생:', err);
      setSearchResults([]);
      setPageInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (loading || !pageInfo?.hasNext || debouncedSearchQuery.length < 3) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < 100) {
      searchWebtoons(debouncedSearchQuery, pageInfo.nextCursor);
    }
  }, [loading, pageInfo, debouncedSearchQuery, searchWebtoons]);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 디바운스된 검색어가 변경될 때 검색 실행
  useEffect(() => {
    if (debouncedSearchQuery.length >= 3) {
      searchWebtoons(debouncedSearchQuery);
    } else {
      setSearchResults([]);
      setPageInfo(null);
      setHasSearched(false);
    }
  }, [debouncedSearchQuery, searchWebtoons]);

  // 검색어 변경 핸들러
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // 검색 결과 렌더링
  const renderSearchResults = () => {
    if (loading && !hasSearched) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (searchQuery.length < 3) {
      return (
        <SearchResultMessage>
          3자 이상의 검색어를 입력해주세요
        </SearchResultMessage>
      );
    }

    if (hasSearched && searchResults.length === 0) {
      return (
        <SearchResultMessage>
          검색 결과가 없습니다.
        </SearchResultMessage>
      );
    }

    return (
      <ArticlesGrid>
        {searchResults.map((webtoon) => (
          <ArticleCard key={webtoon.id} article={webtoon} />
        ))}
      </ArticlesGrid>
    );
  };

  return (
    <Box sx={{ pb: 7 }}>
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <Container>
        {renderSearchResults()}
        {loading && hasSearched && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default SearchPage; 