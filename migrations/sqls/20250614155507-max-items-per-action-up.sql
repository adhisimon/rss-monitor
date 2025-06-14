ALTER TABLE `feeds` ADD IF NOT EXISTS `max_items_per_actions` INT NOT NULL DEFAULT '0' AFTER `interval`;
