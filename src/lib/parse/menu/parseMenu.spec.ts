import { MenuItem } from '@interfaces';
import { parseMenu } from './index';

describe('lib/parse/menu', () => {
  describe('parseMenu', () => {
    const data: MenuItem[] = [
      {
        id: '1234',
        databaseId: 1234,
        label: 'Foo',
        url: 'https://www.example.com/alias/path/foo'
      },
      {
        id: '5678',
        databaseId: 5678,
        label: 'Bar',
        url: 'https://www.example.com/alias/path/bar'
      },
      {
        id: '8765',
        databaseId: 8765,
        parentId: '5678',
        label: 'Baz',
        url: 'https://www.example.com/alias/path/bar'
      }
    ];
    /* @ts-ignore */
    const result = parseMenu(data);

    test('should return empty array.', () => {
      /* @ts-ignore */
      expect(parseMenu(null)).toStrictEqual([]);
    });

    test('should have `key` property with `id` value.', () => {
      expect(result[0]).toHaveProperty('key');
      expect(result[0].key).toEqual(data[0].id);
    });

    test('should have `name` property.', () => {
      expect(result[0]).toHaveProperty('name');
      expect(result[0].name).toEqual(data[0].label);
      expect(result[1]).toHaveProperty('name');
      expect(result[1].name).toEqual(data[1].label);
    });

    xtest('should have a `color` value.', () => {
      expect(result[0]).toHaveProperty('color');
      expect(result[0].color).toEqual('secondary');
    });

    xtest('should have a `icon` value.', () => {
      expect(result[0]).toHaveProperty('icon');
      expect(result[0].icon).toEqual('success');
    });

    xtest('should not have a `title` value.', () => {
      expect(result[1].title).toBeUndefined();
    });

    xtest('should not have a `color` value.', () => {
      expect(result[1].color).toBeNull();
    });

    xtest('should not have a `icon` value.', () => {
      expect(result[1].icon).toBeNull();
    });

    xtest('should have `children`.', () => {
      expect(result[1]).toHaveProperty('children');
      expect(result[1].children).not.toHaveLength(0);
      expect(result[1].children?.[0]).toHaveProperty('key');
      expect(result[1].children?.[0].key).toEqual(data[2].id);
      expect(result[1].children?.[0]).toHaveProperty('name');
      expect(result[1].children?.[0].name).toEqual(data[2].label);
      expect(result[1].children?.[0]).toHaveProperty('url');
      expect(result[1].children?.[0].url).toEqual(data[2].url);
    });
  });
});
