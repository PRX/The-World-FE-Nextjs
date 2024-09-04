/**
 * @file Audio.tsx
 * Component for Episode.
 */

import type { RootState } from '@interfaces';
import React, { useContext, useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { Box, Container, Grid } from '@mui/material';
import { NoJsPlayer } from '@components/AudioPlayer/NoJsPlayer';
import { CtaRegion } from '@components/CtaRegion';
import { AppContext } from '@contexts/AppContext';
import { HtmlContent } from '@components/HtmlContent';
import { MetaTags } from '@components/MetaTags';
import { Plausible, PlausibleEventArgs } from '@components/Plausible';
import { parseDateParts } from '@lib/parse/date';
import { getDataByResource, getCtaRegionData } from '@store/reducers';
import { audioStyles } from './Audio.styles';
import { AudioHeader } from './components/AudioHeader';

export const Audio = () => {
  const {
    page: {
      resource: { type, id }
    }
  } = useContext(AppContext);
  const store = useStore<RootState>();
  const [state, setState] = useState(store.getState());
  const unsub = store.subscribe(() => {
    setState(store.getState());
  });
  const { classes } = audioStyles();
  const data = getDataByResource<any>(state, type, id);

  const {
    metatags: dataMetatags,
    title,
    url,
    audioAuthor,
    audioTitle,
    audioType,
    season,
    broadcastDate,
    description
  } = data || {};
  const metatags = {
    ...dataMetatags,
    ...(broadcastDate && {
      pubdate: broadcastDate
    })
  };

  // CTA data.
  const ctaInlineEnd = getCtaRegionData(
    state,
    'tw_cta_region_content_inline_end',
    type,
    id
  );

  // Plausible Events.
  const props = {
    Title: audioTitle,
    'Audio Type': audioType,
    'File Name': title,
    ...(season && {
      Season: season
    }),
    ...(broadcastDate &&
      (() => {
        const dt = parseDateParts(broadcastDate);
        return {
          'Broadcast Year': dt[0],
          'Broadcast Month': dt.slice(0, 2).join('-'),
          'Broadcast Date': dt.join('-')
        };
      })())
  };
  const plausibleEvents: PlausibleEventArgs[] = [['Audio', { props }]];

  [...(audioAuthor || [])].forEach((person) => {
    plausibleEvents.push([
      `Person: ${person.title}`,
      {
        props: { 'Page Type': 'Audio' }
      }
    ]);
  });

  useEffect(
    () => () => {
      unsub();
    },
    [unsub]
  );

  return (
    <>
      <MetaTags
        data={{
          ...metatags,
          description: metatags.description || description
        }}
      />
      <Plausible events={plausibleEvents} subject={{ type, id }} />
      <Container fixed className={classes.main}>
        <Grid container>
          <Grid item xs={12}>
            <AudioHeader data={data} />
            <Box className={classes.body} my={2}>
              <NoJsPlayer url={url} />
              <HtmlContent html={description} />
            </Box>
            {ctaInlineEnd && <CtaRegion data={ctaInlineEnd} />}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
