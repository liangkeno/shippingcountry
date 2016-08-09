<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/20
 * Time: 10:31
 */

class Apptha_Country_Block_Showcountry extends Mage_Core_Block_Template{


    protected $headCss = 'country/country.css';
    protected $headJs = 'country/country.js';

    /**
     * Prepare layout
     */
    protected function _prepareLayout() {
        /**
         * Seting js and css file
         */
        if (($headBlock = $this->getLayout ()->getBlock ( 'head' )) !== false) {

            $headBlock->addCss ( $this->headCss );
        }
    }

    public function getCountry($id){
        $countryCollection=null;
        if($id){
            $countryCollection=Mage::getResourceModel('directory/country_collection')
                ->addFieldToFilter('country_id',array('like'=>$id.'%'))
                ->loadData()
                ->toOptionArray(false);
        }else{
            $countryCollection=Mage::getResourceModel('directory/country_collection')
                ->loadData()
                ->toOptionArray(false);
        }
        return $countryCollection;
    }

}