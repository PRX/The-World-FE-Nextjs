/**
 * @file SidebarList.tsx
 * Component for link lists in sidebar.
 */

import type React from 'react';
import type { IAudioData } from '@components/Player/types';
import type {
  ContentNode,
  Episode,
  Maybe,
  MediaItem,
  Node,
  NodeWithTitle,
  PostStory,
  Segment,
  TermNode
} from '@interfaces';
import { useState } from 'react';
import Image from 'next/image';
import {
  List,
  ListProps,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListSubheader,
  ListItemSecondaryAction,
  ListItemButton,
  ListItemTextProps,
  PaginationProps,
  Pagination,
  TextField,
  Alert,
  IconButton
} from '@mui/material';
import { Close, Person, Search } from '@mui/icons-material';
import { ContentLink } from '@components/ContentLink';
import { AudioControls } from '@components/Player/components';
import { sidebarListStyles, styleOptions } from './SidebarList.styles';
import { SidebarFooter } from '../SidebarFooter';

export type SidebarListItem = {
  title?: Maybe<string>;
  url?: Maybe<string>;
  avatar?: Maybe<MediaItem>;
} & (
  | {
      audio?: Maybe<MediaItem>;
      audioProps?: Partial<IAudioData>;
      data?:
        | (ContentNode & NodeWithTitle & Node)
        | PostStory
        | Episode
        | Segment
        | null;
    }
  | {
      audio?: undefined;
      data?: PostStory | Episode | Segment | TermNode | null;
    }
);

export interface ISidebarListProps extends ListProps {
  data: SidebarListItem[];
  subheaderText?: string;
  bulleted?: boolean;
  paginationProps?: Partial<PaginationProps & { pageSize?: number }>;
}

export const SidebarList = ({
  className,
  data,
  subheader,
  subheaderText,
  bulleted = false,
  paginationProps,
  ...other
}: ISidebarListProps) => {
  const hasData = !!data?.length;
  const [searchText, setSearchText] = useState<string>();
  const filteredItems = !searchText
    ? data
    : data.filter((item) => {
        const text =
          item.title ||
          (item.data &&
            (('title' in item.data && item.data?.title) ||
              ('name' in item.data && item.data?.name)));

        return (
          !!text &&
          text.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
        );
      });
  const [page, setPage] = useState(1);
  const { pageSize = 10 } = paginationProps || {};
  const itemCount = filteredItems?.length || 0;
  const pageCount = Math.ceil(itemCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageItems = filteredItems?.slice(startIndex, endIndex);
  const showSearch = hasData && data.length > pageSize;
  const showPagination = pageCount > 1;
  const { classes, cx } = sidebarListStyles();
  const listClasses = cx(classes.root, className);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleSearchClear = () => {
    setSearchText(undefined);
  };

  const listProps = {
    component: 'nav',
    className: listClasses,
    ...other,
    subheader: (
      <ListSubheader
        classes={{ root: classes.MuiListSubheaderRoot }}
        component="header"
        disableSticky
      >
        {subheader || subheaderText}

        {showSearch && (
          <TextField
            aria-label="List Search"
            value={searchText || ''}
            placeholder="Search"
            color="primary"
            size="small"
            variant="outlined"
            fullWidth
            sx={{
              marginBlock: '0.5rem',
              '--_border-color': '#eee',
              '.MuiOutlinedInput-root': {
                borderRadius: '2rem',
                paddingRight: 0,
                overflow: 'hidden',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--_border-color)'
                },
                '&:hover': {
                  '.MuiOutlinedInput-notchedOutline': {
                    borderWidth: '3px',
                    borderColor: 'var(--_border-color)'
                  }
                },
                '&.Mui-focused': {
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--_border-color)'
                  }
                }
              }
            }}
            InputProps={{
              endAdornment: !searchText ? (
                <IconButton disabled sx={{ paddingInlineEnd: '0.75rem' }}>
                  <Search />
                </IconButton>
              ) : (
                <IconButton
                  onClick={handleSearchClear}
                  sx={{ paddingInlineEnd: '0.75rem' }}
                  disableRipple
                >
                  <Close />
                </IconButton>
              )
            }}
            onChange={handleSearchChange}
          />
        )}
        {!filteredItems.length && (
          <Alert severity="info">{`No results for "${searchText}".`}</Alert>
        )}
      </ListSubheader>
    )
  } as ListProps;
  const listItemTextProps = {
    className: cx({ noBullet: !bulleted })
  } as ListItemTextProps;

  const handleSegmentsPageChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  if (!hasData) return null;

  return (
    <>
      <List {...listProps}>
        {pageItems.map((item) => {
          const text =
            item.title ||
            (item.data &&
              (('title' in item.data && item.data?.title) ||
                ('name' in item.data && item.data?.name)));
          const url = item.url || item.data?.link;
          const avatarSrc = item.avatar?.sourceUrl || item.avatar?.mediaItemUrl;

          return item.data ? (
            <ListItemButton
              component={ContentLink}
              url={url}
              key={item.data.id}
            >
              {item.avatar && (
                <ListItemAvatar>
                  {avatarSrc ? (
                    <Avatar aria-hidden>
                      <Image
                        src={avatarSrc}
                        alt={`Avatar of ${text}`}
                        fill
                        sizes={`${styleOptions.avatar.size * 2}px`}
                        style={{ objectFit: 'cover' }}
                      />
                    </Avatar>
                  ) : (
                    <Avatar className={classes.noAvatarImage} aria-hidden>
                      {text ? (
                        [...text.matchAll(/\b[A-Z]/g)].join('')
                      ) : (
                        <Person />
                      )}
                    </Avatar>
                  )}
                </ListItemAvatar>
              )}
              <ListItemText {...listItemTextProps}>{text}</ListItemText>
              {item.audio && (
                <ListItemSecondaryAction>
                  <AudioControls
                    id={item.audio.id}
                    fallbackProps={
                      item.audioProps || { linkResource: item.data }
                    }
                    variant="minimal"
                  />
                </ListItemSecondaryAction>
              )}
            </ListItemButton>
          ) : (
            (url && (
              <ListItemButton component="a" href={url} key={url}>
                <ListItemText {...listItemTextProps}>{text}</ListItemText>
              </ListItemButton>
            )) || <ListItemText {...listItemTextProps}>{text}</ListItemText>
          );
        })}
      </List>
      {showPagination && (
        <SidebarFooter>
          <Pagination
            size="small"
            count={pageCount}
            page={page}
            color="primary"
            onChange={handleSegmentsPageChange}
          />
        </SidebarFooter>
      )}
    </>
  );
};
