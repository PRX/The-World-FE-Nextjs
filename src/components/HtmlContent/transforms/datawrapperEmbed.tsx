/**
 * @file datawrapperEmbed.tsx
 *
 * Converts a Datawrapper iframe embed to a DatawrapperEmbed component.
 */

import type { DomElement } from 'htmlparser2';
import { findDescendant } from '@lib/parse/html';
import { Box } from '@mui/material';
import { DatawrapperEmbed } from '@components/DatawrapperEmbed';

export const datawrapperEmbed = (node: DomElement) => {
  const isFigureNode = node.type === 'tag' && node.name === 'figure';
  const isEmbedWrapper =
    node.type === 'tag' && node.attribs.class?.includes('embed__wrapper');
  const isIframeNode = node.type === 'tag' && node.name === 'iframe';

  // Render legacy markup.
  if (!isFigureNode && !isEmbedWrapper && !isIframeNode) {
    const dwEmbedIframe = findDescendant(node, (n: DomElement) => {
      if (
        n.type === 'tag' &&
        n.name === 'iframe' &&
        n.attribs.src?.includes('datawrapper')
      ) {
        return n;
      }
      return false;
    });

    if (dwEmbedIframe) {
      // Return DatawrapperEmbed wrapped in basic wrapper.
      const { attribs } = dwEmbedIframe;

      return (
        <Box sx={{ my: 6 }}>
          <DatawrapperEmbed {...attribs} />
        </Box>
      );
    }
  }

  // Render Iframe in WordPress generated markup.
  if (isIframeNode && node.attribs.src?.includes('datawrapper')) {
    const { attribs } = node;

    return <DatawrapperEmbed {...attribs} />;
  }

  return undefined;
};
