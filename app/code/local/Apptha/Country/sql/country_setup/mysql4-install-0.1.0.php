<?php

$installer = $this;

$installer->run("

DROP TABLE IF EXISTS {$this->getTable('directory_country_shipping')};
CREATE TABLE {$this->getTable('directory_country_shipping')} (
  `id` int(11) unsigned NOT NULL auto_increment,
  `group_product_id` int(11) unsigned NOT NULL,
  `ship_method` varchar(255) NOT NULL default '',
  `ship_cost` decimal(12,2) NOT NULL,
  `ship_eachadd` decimal(12,2) NOT NULL,
  `ship_listcountry` varchar(255) NOT NULL default '',
  `created_time` datetime NULL,
  `update_time` datetime NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    ");


$installer->endSetup(); 