<?php

class Apptha_Country_Model_Country extends Mage_Core_Model_Abstract
{
    public function _construct()
    {
        parent::_construct();
        $this->_init('country/country');
    }
}