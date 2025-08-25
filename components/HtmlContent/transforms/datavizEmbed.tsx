/**
 * @file datavizEmbed.tsx
 *
 * Converts a Dataviz iframe embed to a DatavizEmbed component.
 */

import type { DomElement } from 'htmlparser2';
import { findDescendant } from '@lib/parse/html';
import { Box } from '@mui/material';
import { DatavizEmbed } from '@components/DatavizEmbed';

export const datavizEmbed = (node: DomElement) => {
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
        n.attribs.src?.includes('interactive.pri.org')
      ) {
        return n;
      }
      return false;
    });

    if (dwEmbedIframe) {
      // Return DatavizEmbed wrapped in basic wrapper.
      const { attribs } = dwEmbedIframe;

      return (
        <Box sx={{ my: 6 }}>
          <DatavizEmbed {...attribs} />
        </Box>
      );
    }
  }

  // Render Iframe in WordPress generated markup.
  if (isIframeNode && node.attribs.src?.includes('interactive.pri.org')) {
    const { attribs } = node;

    return <DatavizEmbed {...attribs} />;
  }

  return undefined;
};
