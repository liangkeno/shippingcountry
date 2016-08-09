<?php

class Apptha_Country_Model_Mysql4_Country_Collection extends Mage_Core_Model_Mysql4_Collection_Abstract
{
    public function _construct()
    {
        parent::_construct();
        $this->_init('country/country');
    }
}