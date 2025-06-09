/* global describe, it */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import should from 'should';
import Parser from 'rss-parser';

describe('#RssFetcher', () => {
  const parser = new Parser();

  it('should behave correctly', async () => {
    const feedString = await readFile(join(import.meta.dirname, '../test-data/rss-sample.xml'));
    const feed = await parser.parseString(feedString);

    should.exists(feed, 'feed should exists [3FE7DE4F]');
    should.exists(feed.items, 'feed.items should exists [6B8901FA]');
    should.ok(feed.items.length, 'feed.items should has more than 1 item [946CF833]');
  });
});
