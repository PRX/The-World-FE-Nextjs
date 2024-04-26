/**
 * Placeholder for preview pages to be should when awaiting data.
 */

import { Box, CircularProgress, Typography } from '@mui/material';

export const PreviewPlaceholder = () => (
  <Box
    sx={{
      display: 'grid',
      justifyItems: 'center',
      alignContent: 'center',
      rowGap: '2rem',
      minHeight: '90vh'
    }}
  >
    <CircularProgress />
    <Typography variant="h4">Loading Preview Content...</Typography>
  </Box>
);

export default PreviewPlaceholder;
