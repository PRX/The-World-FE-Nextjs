/**
 * @file Episode.tsx
 * Component for Episode.
 */

import type {
  Episode as EpisodeType,
  Episode_Episodeaudio as EpisodeEpisodeAudio,
  Episode_Episodedates as EpisodeEpisodeDates,
  Episode_Episodecontributors as EpisodeEpisodeContributors,
  IContentComponentProps,
  MediaItem,
  MediaItem_Audiofields as MediaItemAudioFields,
  Episode_Episodecontent as EpisodeEpisodeContent,
  PostStory,
  RootState
} from '@interfaces';
import type { DomElement } from 'htmlparser2';
import { useRef } from 'react';
import { useStore } from 'react-redux';
import {
  Box,
  Container,
  Divider,
  Grid,
  Hidden,
  Typography
} from '@mui/material';
import { EqualizerRounded } from '@mui/icons-material';
import { NoJsPlayer } from '@components/AudioPlayer/NoJsPlayer';
import { CtaRegion } from '@components/CtaRegion';
import { HtmlContent } from '@components/HtmlContent';
import { MetaTags } from '@components/MetaTags';
import { Plausible, PlausibleEventArgs } from '@components/Plausible';
import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarList,
  SidebarLatestStories,
  SidebarCta
} from '@components/Sidebar';
import { SpotifyPlayer } from '@components/SpotifyPlayer';
import { StoryCard } from '@components/StoryCard';
import { parseDateParts } from '@lib/parse/date';
import { findDescendant, findDescendants } from '@lib/parse/html';
import { getCtaRegionData } from '@store/reducers';
import { episodeStyles } from './Episode.styles';
import { EpisodeLede } from './components/EpisodeLede';
import { EpisodeHeader } from './components/EpisodeHeader';

export const Episode = ({
  data,
  isPreview
}: IContentComponentProps<EpisodeType>) => {
  const store = useStore<RootState>();
  const state = store.getState();
  const type = 'post--episode';
  const { classes } = episodeStyles();

  const {
    id,
    seo: dataMetatags,
    title,
    content,
    date,
    episodeDates,
    episodeAudio,
    episodeContributors,
    episodeContent
  } = data || ({} as typeof data);
  const { broadcastDate } = episodeDates as EpisodeEpisodeDates;
  const metatags = {
    ...dataMetatags,
    ...((broadcastDate || date) && {
      pubdate: broadcastDate || date
    })
  };
  const { audio } = episodeAudio || ({} as EpisodeEpisodeAudio);
  const { audioFields } = (audio || {}) as MediaItem;
  const { segmentsList } = (audioFields || {}) as MediaItemAudioFields;
  const { hosts, producers, guests, reporters } =
    episodeContributors as EpisodeEpisodeContributors;
  const { spotifyPlaylists, relatedStories } =
    episodeContent as EpisodeEpisodeContent;
  const spotifyPlaylist = spotifyPlaylists
    ?.map(
      (fieldGroup) => fieldGroup?.spotifyPlaylist && fieldGroup.spotifyPlaylist
    )
    .filter((v): v is string => !!v);
  const musicHeardOnAir = useRef(new Set(spotifyPlaylist));
  const stories = relatedStories?.filter(
    (story): story is PostStory => !!story
  );

  const isSpotifyLinkNode = (node: DomElement) =>
    node.type === 'tag' &&
    node.name === 'a' &&
    node.attribs.href?.match(/open\.spotify\.com/i);

  const removeMhoaHeading = (node: DomElement) => {
    const mhoaTextNode =
      !node.parent &&
      findDescendant(
        node,
        (n) =>
          n.type === 'text' && n.data?.match(/music\s+heard\s+on\s+air/i) && n
      ) &&
      !findDescendants(node, isSpotifyLinkNode);

    if (mhoaTextNode) {
      return null;
    }

    return undefined;
  };

  const extractSpotifyLinks = (node: DomElement) => {
    const keepNode = node.type === 'tag' && ['p'].includes(node.name);
    const spotifyLinks =
      !node.parent && findDescendants(node, isSpotifyLinkNode);

    console.log(spotifyLinks, keepNode, node);

    if (spotifyLinks) {
      spotifyLinks.forEach((n) => {
        const url = new URL(n.attribs.href);
        const uri = `spotify:${url.pathname.replace('/', ':')}`;

        musicHeardOnAir.current.add(uri);
      });

      if (!keepNode) return null;
    }

    return undefined;
  };

  const contentTransforms = [removeMhoaHeading, extractSpotifyLinks];

  // CTA data.
  const ctaInlineEnd = getCtaRegionData(state, 'content-inline-end', type, id);
  const ctaSidebarTop = getCtaRegionData(state, 'content-sidebar-1', type, id);
  const ctaSidebarBottom = getCtaRegionData(
    state,
    'content-sidebar-2',
    type,
    id
  );

  // Plausible Events.
  const props = {
    Title: title,
    ...(broadcastDate &&
      (() => {
        const dt = parseDateParts(broadcastDate);
        return {
          'Broadcast Year': dt[0],
          'Broadcast Month': dt.slice(0, 2).join('-'),
          'Broadcast Date': dt.join('-')
        };
      })()),
    ...(date &&
      (() => {
        const dt = parseDateParts(date);
        return {
          'Published Year': dt[0],
          'Published Month': dt.slice(0, 2).join('-'),
          'Published Date': dt.join('-')
        };
      })())
  };
  const plausibleEvents: PlausibleEventArgs[] = [['Episode', { props }]];

  [
    ...(hosts || []),
    ...(producers || []),
    ...(guests || []),
    ...(reporters || [])
  ].forEach((person) => {
    if (person?.name) {
      plausibleEvents.push([
        `Person: ${person.name}`,
        {
          props: { 'Page Type': 'Episode' }
        }
      ]);
    }
  });

  console.log(musicHeardOnAir.current);

  return (
    <>
      <MetaTags data={metatags} />
      {!isPreview && (
        <Plausible events={plausibleEvents} subject={{ type, id }} />
      )}
      <Container fixed>
        <Grid container>
          <Grid item xs={12}>
            <EpisodeHeader data={data} />
            {audio?.sourceUrl ? <NoJsPlayer url={audio.sourceUrl} /> : null}
          </Grid>
          <Grid item xs={12}>
            <Box className={classes.main}>
              <Box className={classes.content}>
                <EpisodeLede data={data} />
                {content && (
                  <Box className={classes.body} my={2}>
                    <HtmlContent
                      html={content}
                      transforms={contentTransforms}
                    />
                  </Box>
                )}
                {!!musicHeardOnAir.current.size && (
                  <Box my={3}>
                    <Divider classes={{ root: classes.MuiDividerRoot }} />
                    <Typography
                      variant="h4"
                      component="h2"
                      className={classes.heading}
                    >
                      Music heard on air
                    </Typography>
                    <Grid container spacing={2}>
                      {[...musicHeardOnAir.current].map((uri, _i, all) => {
                        const itemProps = {
                          key: uri,
                          xs: 12,
                          ...(all.length > 1 && {
                            sm: 6,
                            lg: 4
                          })
                        };
                        return (
                          <Grid item {...itemProps}>
                            <SpotifyPlayer uri={uri} size="large" stretch />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}
                {stories && (
                  <Box my={3}>
                    <Divider />
                    <Typography
                      variant="h4"
                      component="h2"
                      className={classes.heading}
                    >
                      Stories from this episode
                    </Typography>
                    {stories.map((item) => (
                      <Box mt={2} key={item.id}>
                        <StoryCard
                          data={item}
                          feature={item.presentation?.format !== 'standard'}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
                {ctaInlineEnd && <CtaRegion data={ctaInlineEnd} />}
              </Box>
              <Sidebar container className={classes.sidebar}>
                {segmentsList && (
                  <Sidebar item elevated>
                    <SidebarHeader>
                      <EqualizerRounded />
                      <Typography variant="h2">In this episode:</Typography>
                    </SidebarHeader>
                    <SidebarList
                      disablePadding
                      data={segmentsList.map((segment) => ({
                        data:
                          segment?.segmentContent?.audio?.parent?.node ||
                          segment,
                        audio: segment?.segmentContent?.audio
                      }))}
                    />
                    <SidebarFooter />
                  </Sidebar>
                )}
                {hosts && !!hosts.length && (
                  <Sidebar item elevated>
                    <SidebarList
                      data={hosts.map((item) => ({
                        data: item,
                        avatar: item?.contributorDetails?.image
                      }))}
                      subheaderText="Hosts"
                    />
                  </Sidebar>
                )}
                {producers && !!producers.length && (
                  <Sidebar item elevated>
                    <SidebarList
                      data={producers.map((item) => ({
                        data: item,
                        avatar: item?.contributorDetails?.image
                      }))}
                      subheaderText="Producers"
                    />
                  </Sidebar>
                )}
                {guests && !!guests.length && (
                  <Sidebar item elevated>
                    <SidebarList
                      data={guests.map((item) => ({
                        data: item,
                        avatar: item?.contributorDetails?.image
                      }))}
                      subheaderText="Guests"
                    />
                  </Sidebar>
                )}
                {reporters && !!reporters.length && (
                  <Sidebar item elevated>
                    <SidebarList
                      data={reporters.map((item) => ({
                        data: item,
                        avatar: item?.contributorDetails?.image
                      }))}
                      subheaderText="Reporters"
                    />
                  </Sidebar>
                )}
                {ctaSidebarTop && (
                  <Hidden smDown>
                    <Sidebar item>
                      <SidebarCta data={ctaSidebarTop} />
                    </Sidebar>
                  </Hidden>
                )}
                <SidebarLatestStories />
                {ctaSidebarBottom && (
                  <Hidden smDown>
                    <Sidebar item>
                      <SidebarCta data={ctaSidebarBottom} />
                    </Sidebar>
                  </Hidden>
                )}
              </Sidebar>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
