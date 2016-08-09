<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/12
 * Time: 10:42
 */

class Apptha_Country_IndexController extends Mage_Core_Controller_Front_Action{

    //根据字符返回国家，html格式
    public function getCountryAction(){
       $this->loadLayout();
        $this->renderLayout();

    }

    //加载运费设置界面
    public function indexAction(){

        $this->loadLayout();
        $this->renderLayout();


    }
    //获取countryList json
    public function getCountryListAction(){
        $id =$this->getRequest()->getParam('id');
        $countryCollection=Mage::getResourceModel('directory/country_collection')
            ->addFieldToFilter('country_id',array('like'=>$id.'%'))
            ->loadData()
            ->toOptionArray(false);
        echo json_encode($countryCollection);
    }

    //获取运费信息
    public function getShipInfoAction(){
        $id =$this->getRequest()->getParam('id');
        $collection=Mage::getResourceModel('country/country_collection')
            ->addFieldToFilter('id',array('id'=>$id));
        $data=array();

        foreach($collection as $ship){
            $data['shippingid']=$ship->getId();
            $data['shipping']['method']=$ship->getShipMethod();
            $data['shipping']['cost']=$ship->getShipCost();
            $data['shipping']['eachAdd']=$ship->getShipEachadd();
            $arrCountry=json_decode($ship->getShipListcountry());
            if(is_array($arrCountry)){
                foreach($arrCountry as $key=>$country){
                    $data['countryList'][$key]=$country;
                }
            }else{
                $data['countryList']=$arrCountry;
            }

        }
        echo json_encode($data);


    }
    //获取用户提交过来的信息
    public function saveAction(){

        $data =$this->getRequest()->getPost();

        $countryModel=Mage::getModel('country/country');
        $countryModel->setShipMethod($data['shipping']['method']);
        $countryModel->setShipCost((float)$data['shipping']['cost']);
        $countryModel->setShipEachadd((float)$data['shipping']['eachAdd']);
        if(isset($data['countryList'])){
            $countryModel->setShipListcountry(json_encode($data['countryList']));
        }else{
            $countryModel->setShipListcountry("All Country");
            $data['countryList']="All Country";
        }
        if ($countryModel->getCreatedTime() == NULL || $countryModel->getUpdateTime() == NULL) {
            $countryModel->setCreatedTime(now())
                ->setUpdateTime(now());
        } else {
            $countryModel->setUpdateTime(now());
        }
        if(isset($data['shippingid'])){
            $countryModel->setId($data['shippingid'])->save();
        }else{
            $countryModel->save();
        }

        $data['shippingid']=$countryModel->getId();

        echo json_encode($data);

    }


    public function showAction(){
        $block=$this->getLayout()->createBlock('country/showcountry');
        $countryList=$block->getCountry("A");
        var_dump($countryList);
    }

}