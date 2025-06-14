ALTER TABLE `feeds` ADD IF NOT EXISTS `last_action_ts` TIMESTAMP NULL DEFAULT NULL AFTER `max_items_per_batch`;
ALTER TABLE `feed_actions` DROP IF EXISTS `last_action`;
