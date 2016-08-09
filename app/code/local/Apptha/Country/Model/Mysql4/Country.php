<?php

class Apptha_Country_Model_Mysql4_Country extends Mage_Core_Model_Mysql4_Abstract
{
    public function _construct()
    {    
        // Note that the homeplace_id refers to the key field in your database table.
        $this->_init('country/country', 'id');
    }
}