/**
 * @file embed/audio[id].tsx
 * Exports the audio embed page component.
 */

import React from 'react';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import {
  fetchGqlAudio,
  fetchGqlEpisode,
  fetchGqlSegment,
  fetchGqlStory,
  fetchTwApi
} from '@lib/fetch';
import { AudioPlayer } from '@components/AudioPlayer';
import { IAudioPlayerProps } from '@components/AudioPlayer/AudioPlayer.interfaces';
import { MediaItem } from '@interfaces';
import { encode } from 'base-64';

export interface IEmbedAudioPageProps {
  data: MediaItem;
  message?: string;
  embeddedPlayerUrl?: string;
}

const ContentProxy = ({
  data,
  message,
  embeddedPlayerUrl
}: IEmbedAudioPageProps) => {
  const props: IAudioPlayerProps = {
    data,
    message,
    embeddedPlayerUrl
  };

  return (
    data && <AudioPlayer {...props} style={{ margin: 0, boxShadow: 'none' }} />
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params
}): Promise<GetServerSidePropsResult<any>> => {
  const { id } = params || {};
  let resourceId = Array.isArray(id) ? id[0] : id;

  if (!resourceId) {
    return { notFound: true };
  }

  const isNumeric = /^\d+$/.test(resourceId);

  if (isNumeric) {
    // TODO: Request is for an old embed using a Drupal nid. Try to get the WP ID and post type of the migrated post.
    const aliasData = await fetchTwApi<{
      id: number;
      type?: string;
    }>(`tw/v2/alias`, {
      _fields: 'id,type',
      ...params,
      slug: resourceId
    }).then((resp) => resp && resp.data);

    resourceId = aliasData && encode(`${aliasData.type}:${aliasData.id}`);

    if (resourceId) {
      return {
        redirect: {
          permanent: true,
          destination: `/embed/audio/${resourceId}`
        }
      };
    }
  }

  if (resourceId) {
    const embeddedPlayerUrl = `https://theworld.org/embed/audio/${resourceId}`;
    let data: MediaItem | undefined;
    let message: string | undefined;

    // Attempt to fetch story data.
    const story = await fetchGqlStory(resourceId);

    if (story?.additionalMedia?.audio) {
      message = [story.title, story.programs?.[0]?.name]
        .filter((v) => !!v)
        .join(' - ');
      data = await fetchGqlAudio(story.additionalMedia.audio.id);
      return {
        props: {
          contentOnly: true,
          embeddedPlayerUrl,
          message,
          data
        }
      };
    }

    // Attempt to fetch segment data.
    const segment = await fetchGqlSegment(resourceId);

    if (segment?.segmentContent?.audio) {
      message = [segment.title, segment.programs?.[0]?.name]
        .filter((v) => !!v)
        .join(' - ');
      data = await fetchGqlAudio(segment.segmentContent.audio.id);
      return {
        props: {
          contentOnly: true,
          embeddedPlayerUrl,
          message,
          data
        }
      };
    }

    // Attempt to fetch episode data.
    const episode = await fetchGqlEpisode(resourceId);

    if (episode?.episodeAudio?.audio) {
      message = [episode.title, episode.programs?.[0]?.name]
        .filter((v) => !!v)
        .join(' - ');
      data = await fetchGqlAudio(episode.episodeAudio.audio.id);
      return {
        props: {
          contentOnly: true,
          embeddedPlayerUrl,
          message,
          data
        }
      };
    }

    // Attempt to get audio data.
    data = await fetchGqlAudio(resourceId);

    if (data) {
      message = [
        data.audioFields?.audioTitle || data.title,
        data.audioFields?.program?.[0]?.name
      ]
        .filter((v) => !!v)
        .join(' - ');
      return {
        props: {
          contentOnly: true,
          embeddedPlayerUrl,
          message,
          data
        }
      };
    }
  }

  return { notFound: true };
};

export default ContentProxy;
