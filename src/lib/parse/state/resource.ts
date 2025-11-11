/**
 * @file resource.ts
 *
 * Helper functions for managing resource state.
 */

export const makeResourceSignature = ({
  type,
  id
}: {
  type?: string;
  id?: string | number;
}) => [type, id].filter((v) => !!v).join(':');
