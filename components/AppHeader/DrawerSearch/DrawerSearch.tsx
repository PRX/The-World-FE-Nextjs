/**
 * @file DrawerSearch.tsx
 * Component for DrawerSearch.
 */

import type { RootState } from '@interfaces';
import React, { FormEvent, useRef } from 'react';
import { useStore } from 'react-redux';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { fetchSearchData } from '@store/actions/fetchSearchData';
import { getSearchQuery } from '@store/reducers';
import { appDrawerSearchStyles } from './DrawerSearch.styles';

export const DrawerSearch = () => {
  const queryRef = useRef<HTMLInputElement>(null);
  const store = useStore<RootState>();
  const state = store.getState();
  const query = getSearchQuery(state);
  const { classes } = appDrawerSearchStyles();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!queryRef.current?.value) return;

    store.dispatch({
      type: 'SEARCH_OPEN',
      payload: { query: queryRef.current?.value }
    });
    store.dispatch<any>(fetchSearchData(queryRef.current?.value, 'all'));
    store.dispatch({ type: 'UI_DRAWER_CLOSE' });
  };

  const handleClearQuery = () => {
    if (!queryRef.current) return;

    queryRef.current.value = '';
    queryRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Box className={classes.root}>
        <TextField
          variant="standard"
          inputRef={queryRef}
          id="standard-basic"
          label="I am looking for&hellip;"
          defaultValue={query}
          size="medium"
          color="secondary"
          fullWidth
          classes={{
            root: classes.inputRoot
          }}
          InputLabelProps={{
            classes: {
              root: classes.labelRoot
            }
          }}
          InputProps={{
            classes: {
              root: classes.inputRoot,
              underline: classes.inputUnderline
            },
            endAdornment: (
              <InputAdornment
                sx={{
                  color: 'inherit'
                }}
                position="end"
              >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClearQuery}
                  color="inherit"
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
    </form>
  );
};
