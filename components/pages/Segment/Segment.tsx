/**
 * @file Segment.tsx
 * Component for Episode.
 */

import type {
  IContentComponentProps,
  RootState,
  Segment as SegmentType
} from '@interfaces';
import { useStore } from 'react-redux';
import { Box, Container, Grid } from '@mui/material';
import { NoJsPlayer } from '@components/AudioPlayer/NoJsPlayer';
import { CtaRegion } from '@components/CtaRegion';
import { HtmlContent } from '@components/HtmlContent';
import { MetaTags } from '@components/MetaTags';
import { Plausible, PlausibleEventArgs } from '@components/Plausible';
import { parseDateParts } from '@lib/parse/date';
import { getCtaRegionData } from '@store/reducers';
import { segmentStyles } from './Segment.styles';
import { AudioHeader } from './components/SegmentHeader';

export const Segment = ({
  data,
  isPreview
}: IContentComponentProps<SegmentType>) => {
  const store = useStore<RootState>();
  const state = store.getState();
  const type = 'post--segment';
  const { classes } = segmentStyles();

  const {
    seo,
    id,
    title,
    content,
    resourceDevelopmentTags,
    segmentContent,
    segmentDates
  } = data;
  const { audio } = segmentContent || {};
  const {
    title: fileName,
    mediaItemUrl,
    audioFields,
    contributors
  } = audio || {};
  const { audioType } = audioFields || {};
  const { broadcastDate } = segmentDates || {};
  const metatags = {
    ...seo,
    ...(broadcastDate && {
      pubdate: broadcastDate
    })
  };

  const ctaInlineEnd = getCtaRegionData(
    state,
    'content-inline-end',
    type,
    id as string
  );

  // Plausible Events.
  const props = {
    Title: title,
    'Audio Type': audioType,
    'File Name': fileName,
    ...(!!resourceDevelopmentTags?.nodes.length && {
      'Resource Development': resourceDevelopmentTags.nodes[0].name
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

  [...(contributors?.nodes || [])].forEach((person) => {
    plausibleEvents.push([
      `Person: ${person.name}`,
      {
        props: { 'Page Type': 'Audio' }
      }
    ]);
  });

  return (
    <>
      <MetaTags
        data={{
          ...metatags
        }}
      />
      {!isPreview && (
        <Plausible
          events={plausibleEvents}
          subject={{ type: 'post--segment', id }}
        />
      )}
      <Container fixed className={classes.main}>
        <Grid container>
          <Grid item xs={12}>
            <AudioHeader data={data} />
            <Box className={classes.body} my={2}>
              {mediaItemUrl && <NoJsPlayer url={mediaItemUrl} />}
              {content && <HtmlContent html={content} />}
            </Box>
            {ctaInlineEnd && <CtaRegion data={ctaInlineEnd} />}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
