/**
 * @file Page.tsx
 * Component for Pages.
 */

import type { IContentComponentProps, Page as PageType } from '@interfaces';
import { Box, Container, Grid } from '@mui/material';
import { HtmlContent } from '@components/HtmlContent';
import { MetaTags } from '@components/MetaTags';
import { Plausible, PlausibleEventArgs } from '@components/Plausible';
import { pageStyles } from './Page.styles';
import { PageHeader } from './components/PageHeader';

export const Page = ({ data, isPreview }: IContentComponentProps<PageType>) => {
  const { id, seo, title, content } = data || {};
  const { classes } = pageStyles();

  // Plausible Events.
  const props = {
    Title: title
  };
  const plausibleEvents: PlausibleEventArgs[] = [['Page', { props }]];

  return (
    <>
      {seo && <MetaTags data={seo} />}
      {!isPreview && (
        <Plausible
          events={plausibleEvents}
          subject={{ type: 'post--page', id }}
        />
      )}
      <Container fixed>
        <Grid container>
          <Grid item xs={12}>
            <PageHeader data={data} />
            {content && (
              <Box className={classes.body} my={4}>
                <HtmlContent html={content} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
