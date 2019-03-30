import React, { useEffect, useState } from 'react';
import Heading from '../../Common/Heading';
import TextInput from './TextInput/TextInput';
import SearchInputForm from './SearchInputForm';
import MoviesList from '../../Common/MoviesList/MoviesList';
import requestTheMovieDbApi from '../../utils/requestTheMovieDbApi';
import RouteWrapper from '../../Common/RouteWrapper';

const fetchDelay = 500;

const Find = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');

  const isSearchBoxEmpty = searchText.length <= 0;

  let timeout;

  useEffect(() => {
    if (!isSearchBoxEmpty) {
      timeout = setTimeout(() => {
        (async () => {
          setIsError(false);
          setIsLoading(true);
          try {
            const request = {
              endpoint: '/search/movie',
              queryParameters: {
                query: searchText,
                page,
              },
            };
            const response = await requestTheMovieDbApi(request);
            const parsedResponse = await response.json();
            if (!parsedResponse.results) {
              setIsError(true);
            }
            setResults(parsedResponse.results);
            setTotal(parsedResponse.total_pages);
          } catch (error) {
            setIsError(true);
          }
          setIsLoading(false);
        })();
      }, fetchDelay);
    }
  }, [searchText, page]);

  const onPageChange = (pageNumber) => {
    setIsLoading(true);
    setPage(pageNumber);
  };

  const onSearchInputChange = (event) => {
    clearTimeout(timeout);
    const newValue = event.target.value;
    if (newValue.length > 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
    setPage(1);
    setSearchText(newValue);
  };

  return (
    <>
      <Heading>
        {'Find movies'}
      </Heading>
      <SearchInputForm>
        <TextInput
          onChange={onSearchInputChange}
          placeholder="Search for a movie..."
          label="Search"
          value={searchText}
        />
      </SearchInputForm>
      <MoviesList
        totalPages={total}
        onPageChange={onPageChange}
        currentPage={page}
        isLoading={isLoading}
        isError={isError}
        movies={results}
      />
    </>
  );
};

export default Find;
