/**
 * Created by Administrator on 2016/5/20.
 */

//��ͼģ��
var shipView=(function(domName,ulId){
    var parentDom=document.getElementById(domName);
    var shipUl=document.createElement("ul");
    var containerDom;
    shipUl.setAttribute('id',ulId);

    var viewLayer={
        removeThisOption:function(select,value){
            var options=select.childNodes;
            for(var i=0;i<options.length;i++){
                if(options[i].value==value){
                    select.removeChild(options[i]);
                }
            }
        },
        initSpanTip:function(id){
            var initSpanTip= document.querySelector('#'+id+' span');
            if(initSpanTip && initSpanTip.style.display=="block"){
                initSpanTip.style.display="none";
            }
        },
        resetCheckBox:function(boxList){
            for(var i=0;i<boxList.length;i++){
                boxList[i].checked=false;
            }
        },
        //��ʾloadingͼƬ
        showLoadGif:function(id,heigth){
        var loadingDiv=document.createElement('div');
        loadingDiv.setAttribute('id',"loadingGif");
        if(id.childNodes.length>=1){
            id.innerHTML='';
        }
        if(heigth){
            loadingDiv.style.height=heigth+"px";
        }else{
            loadingDiv.style.height=id.offsetHeight+"px";
        }
        loadingDiv.style.width=id.offsetWidth+"px";
        id.appendChild(loadingDiv);
        },
        setContainerDom:function(domName){
            containerDom=domName;
        },
        getContainerDom:function(){
            return containerDom;
        },
        createCharCode:function(parentId){
            var html='';
            for(var i=65;i<91;i++){
                html+='<a href="#">'+String.fromCharCode(i)+'</a>'
            }
            document.getElementById(parentId).innerHTML=html;
        },
        createViewElement:function(tagName){
            var newDom=document.createElement(tagName);
            return newDom;
        },
        createViewText:function(text){
            var newText=document.createTextNode(text);
            return newText;
        },
        appendElement:function(){
            //ʹ��argument�������Ĳ�������β��һֱ��ӵ�0������һ��dom����
            var backDom;
            var resultDom;
            function appendArguments(arr,len){
                if(len ==0){
                    return resultDom;
                }else{
                    resultDom=arr[len];
                    resultDom=arr[len-1].appendChild(resultDom);
                    var next=len-1;
                    return appendArguments(arr,next);
                }
            }
            backDom=appendArguments(arguments,arguments.length-1);
            return backDom;
        },
        //ɾ����Ԫ���µĿ��ı�
        delSpace:function (elem){
            var elem_child = elem.childNodes;//�õ�����Ԫ�ص�������Ԫ��
            for(var i=0;i<elem_child.length;i++){ //������Ԫ��
                if(elem_child[i].nodeName == "#text" && !/\S/.test(elem_child[i].nodeValue)) {
                    elem.removeChild(elem_child[i])
                }
            }
        },
        removeDisabled:function(domIdName,domIdName2){
            document.getElementById(domIdName).removeAttribute("disabled");
            document.getElementById(domIdName2).removeAttribute("disabled");
        },
        setDisable:function(domIdName,domIdName2){
            document.getElementById(domIdName).setAttribute("disabled",true);
            document.getElementById(domIdName2).setAttribute("disabled",true);
        },
        asFreeClear:function(){
            document.getElementById('shipCost').value="";
            document.getElementById('shipAdditional').value="";
            document.querySelector('.shipInfoMethod span').innerHTML='free';
            document.querySelector('.shipCost span').innerHTML=0;
            document.querySelector('.shipAddCost span').innerHTML=0;
        },
        setInputView:function(selectValue,costValue,eachValue){
            document.getElementById('shipCost').value=costValue;
            document.getElementById('shipAdditional').value=eachValue;
            var shipMethod=document.getElementById('shipMethod');
            var op=document.createElement('option');
            var tx=document.createTextNode(selectValue);
            op.appendChild(tx);
            shipMethod.appendChild(op);
            shipMethod.value=selectValue;
        },
        doEventChange:function(obj,exitDom,className,blockDom){
            //����˷���Ϣ���ھ͸���
            if(exitDom){
                if(document.getElementById('shipMethod').options.length==1){
                    var formDom=document.querySelector('.shipTop .wrapforCreatShip');
                    if(obj.value !=='free'){
                        viewLayer.removeDisabled('shipCost','shipAdditional');
                        shipModel.upDataShipCost(obj.getAttribute('id'),obj.value);
                    }else{
                        viewLayer.setDisable('shipCost','shipAdditional');
                        viewLayer.asFreeClear();
                        shipModel.upDataShipCost(obj.getAttribute('id'),obj.value);
                        shipModel.getShipCost().shipMethod="Free";
                    }
                    //formDom.parentNode.removeChild(formDom);
                }else{
                    if(obj.value !=='free'){
                        viewLayer.removeDisabled('shipCost','shipAdditional');
                        exitDom.lastChild.innerHTML=obj.value;
                        shipModel.upDataShipCost(obj.getAttribute('id'),obj.value);
                    }else{
                        //���˷�ʱ����ռ۸�
                        viewLayer.setDisable('shipCost','shipAdditional');
                        viewLayer.asFreeClear();
                        shipModel.upDataShipCost(obj.getAttribute('id'),obj.value);
                        shipModel.getShipCost().shipMethod="free";
                    }
                }
                //����˷���Ϣ�����ڴ���
            }else{
                //��������ļ��㷽ʽ
                shipView.delSpace(obj.parentNode);
                var liDom=shipView.createViewElement('li');
                liDom.setAttribute('class',className);
                var spanDom=shipView.createViewElement('span');
                spanDom.setAttribute('class','shipFee');
                var textDom=shipView.createViewText(obj.value);
                var textLabel=shipView.createViewText(obj.previousSibling.firstChild.cloneNode(true).nodeValue+":");
                liDom.appendChild(textLabel);
                var liw=shipView.appendElement(shipUl,liDom,spanDom,textDom);
                var shipMethod=shipView.appendElement(blockDom,shipUl,liw);
                shipModel.addShipCost(obj.getAttribute('id'),obj.value);
            }

        },
        doForBlock:function(wrapId,bindId,liClassName,blockDom){
            //Ϊ�˷�ģ��󶨼����¼�
            var shipCostId=document.getElementById(bindId);
            shipController.bindEvent(shipCostId,'change',doChange);
            function doChange(){
                var exitDom=document.querySelector(wrapId+" ."+liClassName);
                shipView.doEventChange(this,exitDom,liClassName,blockDom);
            }
        },
        createContainer:function(containerTitle,setIdName,contentName,firstText){
            //�����Ҳ��б�����
            var containerDiv=viewLayer.createViewElement('div');
            containerDiv.setAttribute('id',setIdName);
            var backDmo;
            //��������
            var h4Title=viewLayer.createViewElement('h4');
            var h4Text=viewLayer.createViewText(containerTitle);
            viewLayer.appendElement(parentDom,containerDiv,h4Title,h4Text);
            //��������
            var contentDiv=viewLayer.createViewElement('div');
            var firstTextSpan=viewLayer.createViewElement('span');
            firstTextSpan.style.display="block";
            var defaultText=viewLayer.createViewText(firstText);
            contentDiv.setAttribute('id',contentName);
            viewLayer.appendElement(parentDom,containerDiv,contentDiv,firstTextSpan,defaultText);
            //���ص�����
            backDmo=contentDiv;
            return backDmo;
        },
        forCheckBoxInit:function(){
            var obj=this;
            viewLayer.doCheckBox(obj,containerDom);
        },
        doCheckBox:function(obj,containerDom){

            var idName=obj.parentNode.getAttribute("id");
            if(obj.checked){
                //ѡ�У������ұ��������checkbox
                var cloneDom=obj.parentNode.cloneNode(true);
                cloneDom.setAttribute("id",idName+"_clone");
                //��ʼ���
                containerDom.appendChild(cloneDom);
                //Ϊ��ӵ�checkbox��change�¼�
                var queryName='#'+idName+"_clone"+" input";
                //��ģ���������
                shipModel.addCheckBox(idName,obj.value);
                shipController.bindEvent(document.querySelector(queryName),'change',viewLayer.forCheckBoxInit);
            }else{
                //δѡ�У����ұ������Ƴ�checkbox
                var removeDom;
                var dataName;
                if(idName.indexOf('_clone') < 0){
                    //�������checkbox����ȡ�ұ����Ƴ���checkbox
                    removeDom=document.getElementById(idName+"_clone");
                    dataName=idName+"_clone";
                }else{
                    //�����ұ�checkbox,��ȡԴ������Ƴ���checkbox
                    removeDom=document.getElementById(idName);
                    dataName=idName;
                    var clearCheckId=idName.replace(/_clone/i,"");
                    var  exitId=document.querySelector('#'+clearCheckId+' input');
                    if(exitId){
                        document.querySelector('#'+clearCheckId+' input').checked=false;
                    }

                }
                //��ʼ�Ƴ�
                containerDom.removeChild(removeDom);
                //��ģ���Ƴ�����
                shipModel.deleteCheckBox(dataName);
            }
        }

    };

    return viewLayer;
})('countryWrap','shipInfo');
//����ģ��
var shipController=(function(){
    var controllerLayer={
        bindEvent:function(whichDom,eventName,callback){
            whichDom.addEventListener(eventName,callback,false);
        },
        bindEachDom:function(domList,eventName,callback){
            for(var i=0;i<domList.length;i++){
                this.bindEvent(domList[i],eventName,callback);
            }
        }

    };
    return controllerLayer;
})();
//ģ��ģ��
var shipModel=(function(){
    var checkBoxs={},shipCost={};
    var modelLayer={
        checkCost:function(sibling,selectId){

            if(modelLayer.isEmptyObj(shipCost)){
                return false;
            }
            if(!shipCost.shipCost || !shipCost.shipAdditional){
                if(!shipCost.shipCost){
                    document.getElementById('shipCost').focus();
                }else{
                    document.getElementById('shipAdditional').focus();
                }
/*                var tipText=document.createTextNode("Cost or Each additional is empty");
                checkTip.appendChild(tipText);
                sibling.parentNode.insertBefore(checkTip,sibling);*/
                return false;
            }else{
                if(selectId.options[selectId.selectedIndex].value!='free'){
                    if(modelLayer.isNum(shipCost.shipCost) && modelLayer.isNum(shipCost.shipAdditional)){
                        return true;
                    }
                }else{
                    shipCost={
                        shipMethod:'free',
                        shipCost:'0',
                        shipAdditional:'0'
                    };
                    return true;
                }
            }

            if(modelLayer.isEmptyObj(checkBoxs)){
                return false;
                /*                if(selectId.options[selectId.selectedIndex].value!='free'){
                 return false;
                 }else{
                 checkBoxs={
                 countryList:"all country"
                 }
                 }*/
            }

        },
        isNum:function(s){
            if (s!=null && s!="")
            {
                return !isNaN(s);
            }
            return false;
        },
        isEmptyObj:function(obj){
            var i;
            for( i in obj){
                return false
            }
            return true;
        },
        clearAllData:function(){
            checkBoxs={};
            shipCost={};
        },
        addData:function(obj,name,value){
            obj[name]=value;
        },
        deleteData:function(obj,name){
            delete obj[name];
        },
        updateData:function(obj,name,value){
            obj[name]=value;
        },
        addCheckBox:function(name,value){
            modelLayer.addData(checkBoxs,name,value);
        },
        deleteCheckBox:function(name){
            modelLayer.deleteData(checkBoxs,name);
        },
        addShipCost:function(name,value){
            modelLayer.addData(shipCost,name,value);
        },
        upDataShipCost:function(name,value){
            modelLayer.updateData(shipCost,name,value);
        },
        deleteShipCost:function(name){
            shipCost={};
        },
        getCheckBoxs:function(){
            return checkBoxs;
        },
        setShipCost:function(obj){
            shipCost=obj;
        },
        setCheckBoxs:function(obj){
            checkBoxs=obj;
        },
        getShipCost:function(){
            return shipCost;
        },
        //���ݵĴ����첽����
        createXHR:function(){
            if(typeof XMLHttpRequest!="undefined"){
                return new XMLHttpRequest();
            }else if(typeof ActiveXObject!="undefined"){
                if(typeof arguments.callee.activeXString!="string"){
                    var versions=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],
                        i,len;
                    for(i=0,len=versions.length;i<len;i++){
                        try{
                            new ActiveXObject(versions[i]);
                            arguments.callee.activeXString=versions[i];
                            break;
                        }catch(ex){

                        }
                    }
                }
                return new ActiveXObject(arguments.callee.activeXString);
            }else{
                throw new Error("NO XHR object available");
            }
        },
        //��ʼ��Ҫ�޸ĵ�ID,�����غ���
        updateThisId:function(id){
            var thatDom =document.getElementById(id);
            thatDom.innerHTML="";
            shipView.showLoadGif(thatDom);
            return function(data){
                thatDom.innerHTML=data;
            }
        },
        //�������󣬼�������
        loadCountry:function(param,callback,callback2){
            var xhr=modelLayer.createXHR();
            if(param.method=="GET"){
                xhr.open('GET',param.url+param.sendData);
                xhr.send();
            }else{
                xhr.open('POST',param.url);
                xhr.setRequestHeader("Content-Type","application/x-www-from-urlencoded;charset=UTF-8");
               // xhr.setRequestHeader("Accept","application/json, text/javascript, */*; q=0.01");
                xhr.send(param.sendData);
            }
            xhr.onreadystatechange=function(){
                if(xhr.readyState==4 && xhr.status==200){
                    callback(xhr.responseText);
                    if(callback2){
                        callback2();
                    }

                }
            };

        }

    };

    return modelLayer;
})();

//�˷�ģ��
var shipCostInfoBlock=(function(){
    var containerDom=shipView.createContainer('ship cost info','shipCostInfo','shipCostContent',"Not add cost info");
    var htmlForCost='<ul id="shipInfo"><li class="shipInfoMethod">Services:<span class="shipFee">Free</span></li><li class="shipCost">Cost:<span class="shipFee">0</span></li><li class="shipAddCost">Each additional:<span class="shipFee">0</span></li></ul>';
    document.getElementById('shipCostContent').innerHTML=htmlForCost;
    //���䷽ʽģ��
    var shipMethodBlock=shipView.doForBlock('#shipInfo','shipMethod','shipInfoMethod',containerDom);
    //�˷�ģ��
    var shipCostBlock=shipView.doForBlock('#shipInfo','shipCost','shipCost',containerDom);
    //�˷�����ģ��
    var shipAddCostBlock=shipView.doForBlock('#shipInfo','shipAdditional','shipAddCost',containerDom);
})();
//���Ҷ�ѡ��ģ��
var checkBoxBlock=(function(){
    var domList=document.querySelectorAll('#checkboxContent input');
    //������ѡ����
    var containerDom=shipView.createContainer('Selected Country','countryList','countryListContent',"Not add country");

    shipView.setContainerDom(containerDom);
    function emiteBox(){
        shipView.initSpanTip('countryListContent');
        shipView.doCheckBox(this,containerDom);
    }
    //Ϊÿ��checkbox��change�¼�
    shipController.bindEachDom(domList,'change',emiteBox);
})();
//��ĸ��
var fromcharCodeBlock=(function(parentId){

    //��ĸ�б�����¼�
    shipView.createCharCode(parentId);
    var aList=document.querySelectorAll("#"+parentId+" a");
    shipController.bindEachDom(aList,'click',emite);

    //�첽��ѯ�����б�
    function emite(){
        var url="http://web.yokir.com/index.php/country/index/getcountry/id/";
        //���ѡ��
        var data=this.firstChild.nodeValue;
        for(var i=0;i<aList.length;i++){
            aList[i].removeAttribute('class');
        }
        this.setAttribute('class',"active");
        var param={
            url:url,
            method:"GET",
            sendData:data
        };
        shipModel.loadCountry(param,shipModel.updateThisId("checkboxContent"),reBindAfterAjax);
    }

    //Ϊ��Ӧ������domlist��Ӽ����¼�
    function reBindAfterAjax(){
        var domList=document.querySelectorAll('#checkboxContent input');
        function emiteBox(){
            shipView.initSpanTip('countryListContent');
            shipView.doCheckBox(this,shipView.getContainerDom());
        }
        //Ϊÿ��checkbox��change�¼�
        shipController.bindEachDom(domList,'change',emiteBox);
    }

})('charCode');

//�ύ��ť
var submitFor=(function(){
    var showdd=document.getElementById('showData');
    var parentId=document.getElementById('resultforShip');
    var exitShipResult=document.querySelector('#resultforShip .oneOfship');
    var shipMethodIdDom=document.getElementById('shipMethod');

    //���ύ��ť
    shipController.bindEvent(showdd,'click',doShowCheckBox);

    //�첽�ύ��������
    function doShowCheckBox(){
        if(!shipModel.checkCost(showdd,shipMethodIdDom)){
            return false;
        }
        parentId.style.display="block";
        if(!exitShipResult){
            shipView.showLoadGif(parentId);
        }
        var url="http://web.yokir.com/index.php/country/index/save";
        var sendData={countryList:shipModel.getCheckBoxs(),shipmethod:shipModel.getShipCost()};
        console.log(sendData);
        jQuery.ajax({
            url:url,
            data:sendData,
            type:'post',
            dataType:'json',
            success:function(result){
                console.log(result);
                createHtml(result);

            }
        });
    }
    //���ɴ洢�����ͼ
    function createHtml(jsonResult){
        //�����ͼ
        var shipMethod="<ul> <li><strong>Services:</strong>"+jsonResult.shipmethod['shipMethod']+"</li> <li><strong>Cost:</strong>"+jsonResult.shipmethod['shipCost']+"</li> <li><strong>Each additional:</strong>"+jsonResult.shipmethod['shipAdditional']+"</li> </ul>";
        var countryList='<div class="resultCountry">';
        var spanHtml='';
        var idHtml='<input type="hidden" id="shippingid" value="'+jsonResult['shippingid']+'" >';
        for(var i in jsonResult.countryList){
            spanHtml+="<span>"+jsonResult.countryList[i]+"</span> |";
        }
        var removeLastLine=spanHtml.slice(0,spanHtml.length-1);
        countryList+=removeLastLine+'</div>';
        //��һ��������ͼ��div
        var wrapDiv=document.createElement('div');
        var wrapBtn=document.createElement('div');
        var Btn=document.createElement('button');
        var text=document.createTextNode('Edit');
        wrapDiv.setAttribute('class','oneOfship clearFix');
        Btn.setAttribute('class','button');
        Btn.setAttribute('id','edit'+jsonResult['shippingid']);
        shipController.bindEvent(Btn,'click',ctreatEidtView);

        wrapBtn.setAttribute('id','editShip');
        Btn.appendChild(text);
        wrapBtn.appendChild(Btn);
        wrapDiv.innerHTML=shipMethod+countryList+idHtml;
        //�Ƴ�loading
        parentId.removeChild(document.getElementById("loadingGif"));
        parentId.appendChild(wrapDiv);
        wrapDiv.appendChild(wrapBtn);
        parentId.style.minHeight="auto";
        //ɾ���Ѿ�������˷ѷ�ʽ
        var select=document.getElementById('shipMethod');
        shipView.removeThisOption(select,jsonResult.shipmethod['shipMethod']);
        clearData();
    }
    //���ɱ༭�����б���ͼ
    function ctreatEidtView(){
        var shipDiv=document.getElementById('shipCostContent');
        var copyDiv=document.getElementById('countryListContent');
        shipView.showLoadGif(shipDiv,40);
        shipView.showLoadGif(copyDiv,40);
        var idName=this.getAttribute('id');
        var id=idName.replace(/[^\d]/ig,'');
        var url="http://web.yokir.com/index.php/country/index/getShipInfo/id/";
        var param={
            url:url,
            method:"GET",
            sendData:id
        };
        shipModel.loadCountry(param,resEidt(shipDiv,copyDiv));

    }

    function resEidt(shipDiv,copyDiv){
        return function(jsonData){
            //country
            var jsonData=JSON.parse(jsonData);
            var option='',shipList='';
            var shipList='<ul id="shipInfo"><li class="shipInfoMethod">Services:<span class="shipFee">'+jsonData.shipmethod['shipMethod']+'</span></li><li class="shipCost">Cost:<span class="shipFee">'+jsonData.shipmethod['shipCost']+'</span></li><li class="shipAddCost">Each additional:<span class="shipFee">'+jsonData.shipmethod['shipAdditional']+'</span></li></ul>';
            for(var i in jsonData.countryList){
                option+='<label for="" class="checkbox-inline" id="'+i+'_clone"> <input type="checkbox" value="'+jsonData['countryList'][i]+'">'+jsonData['countryList'][i]+'</label>';
            }
            copyDiv.innerHTML=option;
            shipDiv.innerHTML=shipList;
            shipView.setInputView(jsonData.shipmethod['shipMethod'],jsonData.shipmethod['shipCost'],jsonData.shipmethod['shipAdditional']);
            var inputList= document.querySelectorAll('#countryListContent input');
            for(var i=0;i<inputList.length;i++){
                inputList[i].checked=true;
            }
            //Ϊÿ��checkbox��change�¼�
            shipController.bindEachDom(inputList,'change',emiteBox);
            function emiteBox(){
               // shipView.initSpanTip('countryListContent');
                shipView.doCheckBox(this,copyDiv);
            }
            shipModel.setShipCost(jsonData.shipmethod);
            shipModel.setCheckBoxs(jsonData.countryList);

        }
    }


    //�����������
    function clearData(){
        var checkList=document.querySelectorAll("#checkboxContent input");
        var labelCheckList=document.querySelectorAll("#countryListContent label");
        var spanCheck=document.querySelector("#countryListContent span");
        //������ݶ���
        shipModel.clearAllData();
        //����в�chenkboxΪ��ѡ��
        shipView.resetCheckBox(checkList);
        //����ұ߹����б�
        for(var i=0;i<labelCheckList.length;i++){
            labelCheckList[i].parentNode.removeChild(labelCheckList[i]);
        }
        if(spanCheck){
            spanCheck.style.display="block";
        }
        //�����˷ѷ�ʽΪ���
        document.getElementById('shipMethod').options[0].selected=true;
        document.querySelector(".shipInfoMethod .shipFee").innerHTML="free";
        shipView.asFreeClear();

    }

})();






