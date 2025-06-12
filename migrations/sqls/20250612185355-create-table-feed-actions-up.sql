CREATE TABLE IF NOT EXISTS `feed_actions` (
  `uuid` UUID NOT NULL DEFAULT uuid (),
  `feed_uuid` UUID NOT NULL,
  `action` VARCHAR(32) NOT NULL,
  `target` VARCHAR(256) NULL DEFAULT NULL,
  `last_action` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uuid`)
) ENGINE = InnoDB;

ALTER TABLE `feed_actions` ADD UNIQUE IF NOT EXISTS `feed_action` (`feed_uuid`, `action`);

ALTER TABLE `feed_actions` 
  ADD CONSTRAINT `feed_actions_fk_feed_uuid`
    FOREIGN KEY IF NOT EXISTS (`feed_uuid`)
    REFERENCES `feeds`(`uuid`) 
    ON DELETE CASCADE ON UPDATE CASCADE;
