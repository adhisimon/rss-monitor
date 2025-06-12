ALTER TABLE `feed_items` ADD UNIQUE IF NOT EXISTS `feed_url_and_guid` (`feed_url`, `guid`);
