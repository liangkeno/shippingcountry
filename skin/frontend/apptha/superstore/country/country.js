/**
 * Created by Administrator on 2016/5/27.
 */

/*function shipForCountry(codeUrl,saveUrl,editUrl){

}*/

var kown=(function(){
    //视图，负责外观
    var kownV=(function(){
        var viewSet={};
        var vLayer={
            disabledBtn:function(domList){
                for(var j=0;j<domList.length;j++){
                    domList[j].setAttribute("disabled",true)
                }
            },
            abledBtn:function(domList){
                for(var j=0;j<domList.length;j++){
                    domList[j].removeAttribute("disabled")
                }
            },
            doInput:function (data){
                var op=document.createElement('option');
                var optx=document.createTextNode(data['method']);
                op.appendChild(optx);
                kownC.triggerEvent('isAble',true);
                var sel=document.getElementById("shipMethod");
                sel.appendChild(op);
                sel.value=data['method'];
                document.getElementById("shipCost").value=data['cost'];
                document.getElementById("shipAdditional").value=data['eachAdd'];
            },
            afterDoForView:function(shipSelect,method,countryOption,options,shipCost,eachAdd){
                //添加成功后重置视图与数据
                vLayer.removeThisOption(shipSelect,method);
                if(shipSelect.value=="free"){
                    kownC.triggerEvent('isAble',false);
                }else{
                    kownC.triggerEvent('isAble',true);
                }
                //检查select是否还有option,
                countryOption.innerHTML="";
                kownC.triggerEvent('isHide',false);
                var optionsAll=document.querySelectorAll(options);
                for(var i=0;i<optionsAll.length;i++){
                    optionsAll[i].checked=false;
                }
                kownM.setEmpty('countryList');
                shipCost.value="";
                eachAdd.value="";
                //运输方式不为免费，表单可用
                kownC.gotoFirst(shipSelect.value);
            },
            createLoading:function(param){
                var oneShip=vLayer.createView(param);
                vLayer.showLoadGif(oneShip,40);
                return oneShip;
            },
            removeThisOption:function(select,value){
                var options=select.childNodes;
                for(var i=0;i<options.length;i++){
                    if(options[i].value==value){
                        select.removeChild(options[i]);
                    }
                }
            },
            resetCheckBox:function(boxList){
                for(var i=0;i<boxList.length;i++){
                    boxList[i].checked=false;
                }
            },
            //显示loading图片
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
            createCharCode:function(){
                var html='';
                for(var i=65;i<91;i++){
                    html+='<span>'+String.fromCharCode(i)+'</span>'
                }
                return html;
            },
            creatEachView:function(){
                var i;
                for(i in arguments){
                    vLayer.createView(arguments[i]);
                }
            },
            generateView:function(param){
                var newDom=param.wrapTag?document.createElement(param.wrapTag):document.createElement('div');
                if(param.wrapAttr){
                    var attr=param.wrapAttr;
                    if(attr.indexOf('.')>-1){
                        newDom.setAttribute('class',attr.replace(/\./g,""));
                    }else if(attr.indexOf('#')>-1){
                        newDom.setAttribute('id',attr.substring(1));
                    }
                }
                newDom.innerHTML=param.htmlStr;
                return newDom;
            },
            createView:function(param){
                //生成一个存放html的容器，字符串转dom
                var newDom= vLayer.generateView(param);
                if(!param.wrapTag){
                    //使用for出现问题，因为length在childNodes被搬走时会变化
                    var backDom=newDom.cloneNode(true);
                    while(newDom.childNodes.length){
                        param.parent.appendChild(newDom.childNodes[0]);
                    }
                    return backDom.childNodes;
                }else{
                    return param.parent.appendChild(newDom);
                }

            },
            updateView:function(param){
                //生成一个存放html的容器，字符串转dom
                var newDom= vLayer.generateView(param);
                param.parent.innerHTML=newDom.outerHTML;
            },
            storgeView:function(viewName,value){
                viewSet[viewName]=value;
            },
            getView:function(viewName){
                return viewSet[viewName]
            }
        };

        return vLayer;
    })();
    //控制，负责事件
    var kownC=(function(){
        var cLayer={
            // -----------事件
            triggerEvent:function(eventName,condition){
                var eventData=kownM.getData(eventName);
                if(condition){
                    eventData[0]();
                }else{
                    eventData[1]();
                }
            },
            //绑定一个事件
            oneEvent:function(oneDom,eventName,callBack){
                oneDom.addEventListener(eventName,callBack,false);
            },
            //绑定多个事件
            listEvent:function(listDom,eventName,callBack){
                var i,len;
                for(i=0,len=listDom.length;i<len;i++){
                    cLayer.oneEvent(listDom[i],eventName,callBack);
                }
            },
            //设置多个或者一个绑定
            oneOrListEvent:function(whichDom,eventName,callBack){
                if(whichDom.length>1){
                    cLayer.listEvent(whichDom,eventName,callBack);
                }else{
                    cLayer.oneEvent(whichDom,eventName,callBack);
                }
            },
            clickAction:function(whichDom,callBack){
                cLayer.oneOrListEvent(whichDom,'click',callBack);
            },
            changeAction:function(whichDom,callBack){
                cLayer.oneOrListEvent(whichDom,'change',callBack);
            },
            // ----------------数据与视图控制
            mergeViewData:function(dataValue,viewObj){
                //合并数据到视图
                var lastStr;
                if(typeof dataValue =='string'){
                    lastStr=viewObj.htmlStr.replace(/(k\$)/ig,dataValue);
                }
                if(typeof dataValue =='object'){
                    var tempStr=viewObj.htmlStr;
                    for(var i in dataValue){
                        tempStr=tempStr.replace(/(k\$)/i,dataValue[i]);
                    }
                    lastStr=tempStr;
                }
                return lastStr;
            },
            //合并过程
            mergeProcess:function(dataName,modelObj,viewObj,isStorge,parentObj){
                var dataValue;
                if(parentObj){
                    parentObj[dataName]=modelObj.value;
                    dataValue= modelObj;
                }else{
                    //初始化模型数据
                    dataValue= kownM.createData(dataName,modelObj);
                }
                if(!isStorge){
                    //移除不存储的模型
                    kownM.removeData(dataName);
                }else{
                    //存储视图参数
                    kown.V.storgeView(dataName,kown.M.copyObject(viewObj));
                }
                viewObj.htmlStr=cLayer.mergeViewData(dataValue,viewObj);
            },
            mergeVAndD:function(modelObj,viewObj,dataName,isStorge){
                //不存视图与数据对象就创建，否则就更新
                if(!kownM.getData(dataName) && !kownV.getView(dataName)){
                    kownC.mergeProcess(dataName,modelObj,viewObj,isStorge);
                    //如果存在视图就更新，否则创建
                    kownV.createView(viewObj);
                    viewObj=null;

                }else{
                    //console.log("更新");
                    kownC.mergeProcess(dataName,modelObj,viewObj,isStorge);
                    kownV.updateView(viewObj);
                    viewObj=null;
                }
            },
            mergeOption:function(modelObj,viewObj,dataName,isStorge,parentObj){
                kownC.mergeProcess(dataName,modelObj,viewObj,isStorge,parentObj);
                var optionDom= kownV.createView(viewObj);
                viewObj=null;
                return optionDom;
            },
            isPass:function(obj,value){
                if(obj.nodeName=='SELECT'){
                    return true;
                }
                if((/^[0-9]+\.\d{2}$||^[0-9]$/g).test(value)){
                    return true;
                }else{
                    obj.value="";
                    obj.focus();
                    return false;
                }
            },
            //处理表单输入的
            formChange:function(dom,name,attr){
                kown.C.oneEvent(dom,'change',inputChange);
                function inputChange(){
                    if(!cLayer.isPass(dom,this.value)){
                        return false;
                    }
                    if(dom.value!=='free'){
                        kown.C.triggerEvent('isAble',true);
                    }else{
                        kown.C.triggerEvent('isAble',false);
                        //恢复到初始值
                        kownC.gotoFirst();
                        return false;
                    }
                    kown.M.getData(name)[attr]=this.value;
                    //获取存储的数据与视图重新渲染
                    kown.C.mergeVAndD(kownM.getData(name),kownV.getView(name),name,true);
                }
            },
            //恢复初始状态
            gotoFirst:function(value){
                if(value){
                    var obj={
                        method:value,
                        cost:0,
                        eachAdd:0
                    };
                }else{
                    var obj={
                        method:'free',
                        cost:0,
                        eachAdd:0
                    };
                }
                kownC.mergeVAndD(obj,{
                    parent:document.querySelector('#shipCostContent'),
                    htmlStr:'<li class="shipInfoMethod">Services:<span class="shipFee">k$</span></li><li class="shipCost">Cost:<span class="shipFee">k$</span></li><li class="shipAddCost">Each additional:<span class="shipFee">k$</span></li>',
                    wrapTag:'ul',
                    wrapAttr:'#shipInfo'},'shipCost',true);
            },
            preventSubmit:function(e,check){
                e=e||window.event;
                if(check){
                    if(document.all){
                        e.returnValue=false;
                    }else{
                        e.preventDefault();
                    }
                }
            }

        };
        return cLayer;
    })();
    //模型，负责数据
    var kownM=(function(){
        var dataSet={};
        var mLayer={
            unique:function(obj){
                var newObj={};
                var isExit={};
                for(var i in obj){
                    if(!isExit[i]){
                        newObj[i]=obj[i];
                        isExit[i]=1;
                    }
                }
                return newObj
            },
            returnAll:function(){
                return dataSet;
            },
            registerEventData:function(eventName,condition,callbackOne,callbackTow){
                return this.createData(eventName,Array.prototype.slice.call(arguments,1));
            },
            unRegisterEventData:function(eventName){
                delete dataSet[eventName];
            },
            createData:function(name,value){
                dataSet[name]=value;
                return dataSet[name];
            },
            createOptionData:function(name,value){
                dataSet[name]=value;
                return dataSet[name];
            },
            getData:function(name){
                return dataSet[name];
            },
            removeData:function(name){
                delete dataSet[name];
            },
            setEmpty:function(name){
                dataSet[name]={};
            },
            deleteData:function(obj,name){
                delete obj[name];
            },
            copyObject:function(source){
                var result={};
                for(var key in source){
                    result[key]=source[key];
                }
                return result;
            },
            //兼容的创建异步对象
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
            //发送请求，及处理结果
            asyncData:function(param,callBack){
                var xhr=mLayer.createXHR();
                if(param.method=="GET"){
                    xhr.open('GET',param.url+param.sendData);
                    xhr.send();
                }else{
                    xhr.open('post',param.url,true);
                    xhr.setRequestHeader("Content-Type","application/x-www-from-urlencoded;charset=UTF-8");
                    // xhr.setRequestHeader("Accept","application/json, text/javascript, */*; q=0.01");
                    xhr.send(param.sendData);
                }
                xhr.onreadystatechange=function(){
                    if(xhr.readyState==4 && xhr.status==200){
                        callBack(JSON.parse(xhr.responseText));
                    }
                };

            }

        };
        return mLayer;
    })();
    //返回mvc对象
    return {
        V:kownV,
        C:kownC,
        M:kownM
    };
})();
//初始化块
var initBlock=(function(){
    var countryWrapId=document.querySelector('#countryWrap');
    var charCode=document.querySelector('#charCode');
    //运费信息
    kown.C.mergeVAndD('ship cost info',{
        parent:countryWrapId,
        htmlStr:'<h4>k$</h4><div id="shipCostContent"></div>',
        wrapTag:'div',
        wrapAttr:'#shipCostInfo'
    },'costTitle',false);

    kown.C.mergeVAndD({
        method:'free',
        cost:0,
        eachAdd:0
    },{
        parent:document.querySelector('#shipCostContent'),
        htmlStr:'<li class="shipInfoMethod">Services:<span class="shipFee">k$</span></li><li class="shipCost">Cost:<span class="shipFee">k$</span></li><li class="shipAddCost">Each additional:<span class="shipFee">k$</span></li>',
        wrapTag:'ul',
        wrapAttr:'#shipInfo'},'shipCost',true);
    //国家信息
    kown.V.createView({
        parent:countryWrapId,
        htmlStr:'<h4>Selected Country</h4><div id="countryListContent"></div>',
        wrapTag:'div',
        wrapAttr:'#countryList'});
    kown.V.createView({
        parent:document.querySelector('#countryListContent'),
        htmlStr:'<span style="display: block;">Not add country</span><div id="countryOptions"></div>'});
    //字母表
    kown.V.createView({
        parent:charCode,
        htmlStr:kown.V.createCharCode()
    });
    var countryTip=document.querySelector('#countryListContent span');
    var shipCost=document.querySelector('#shipCost');
    var shipAdditional=document.querySelector('#shipAdditional');
    //注册一个定义事件，提示消息的显示隐藏
    kown.M.registerEventData('isHide',function(){countryTip.style.display='none';},function(){countryTip.style.display='block';});
    kown.M.registerEventData('isAble',function(){
            shipCost.removeAttribute("disabled");
            shipAdditional.removeAttribute("disabled");},
        function(){
            shipCost.value="";
            shipAdditional.value="";
            shipCost.setAttribute("disabled",true);
            shipAdditional.setAttribute("disabled",true);
        });
})();

//触发块
var trigger=(function(codeUrl,saveUrl,editUrl){
    //运费信息
    var shipSelect=document.querySelector('#shipMethod');
    var cost=document.querySelector('#shipCost');
    var resultforShip=document.querySelector('#resultforShip');
    var eachAdd=document.querySelector('#shipAdditional');
    //为输入表单设置监听，及根据数据渲染视图
    kown.C.formChange(shipSelect,'shipCost','method');
    kown.C.formChange(cost,'shipCost','cost');
    kown.C.formChange(eachAdd,'shipCost','eachAdd');

    //发货国家
    var options=document.querySelectorAll('#checkboxContent input');
    var countryOption=document.querySelector('#countryOptions');
    //监听国家列表的多选按钮
    kown.M.createOptionData('countryList',{});
    //checkBox块
    var checkBoxBlock=(function(){
        //为checkbox绑定click事件
        kown.C.clickAction(options,doBoxCheck);
        function doBoxCheck(){
            var countryObj=kown.M.getData('countryList');
            var id=this.parentNode.getAttribute('id');
            if(this.checked){
                var span =document.querySelector('#countryListContent span');
                //把视图与数据绑定并插入到右边容器中
                var optionDom= kown.C.mergeOption({
                    id:id+"_clone",
                    value:this.value,
                    label:this.value
                },{parent:countryOption,
                    htmlStr:'<label for="" class="checkbox-inline" id="k$"><input type="checkbox" value="k$" checked="true">k$</label>'
                },this.parentNode.getAttribute('id'),false,countryObj);
                //容器被添加时的初始提示被隐藏
                if(countryOption.childNodes.length>0){
                    kown.C.triggerEvent('isHide',this.checked);
                }
                document.querySelector('#'+id+"_clone input").addEventListener('change',doRightBox,false)
            }else{
                countryOption.removeChild(document.getElementById(id+"_clone"));
                kown.M.deleteData(countryObj,id);
                //容器内容为空时初始提示显示
                if(countryOption.childNodes.length<=0){
                    kown.C.triggerEvent('isHide',false);
                }
            }
        }
        function doRightBox(){
            var countryObj=kown.M.getData('countryList');
            var dataId=this.parentNode.getAttribute('id').replace(/_clone/,'');
            this.parentNode.parentNode.removeChild(this.parentNode);
            var isExitDom=document.querySelector('#'+dataId+" input");
            if(isExitDom){
                isExitDom.checked=false;
            }
            //容器内容为空时初始提示显示
            if(countryOption.childNodes.length<=0){
                kown.C.triggerEvent('isHide',false);
            }
            kown.M.deleteData(countryObj,dataId);
        }
        return{
            doBoxCheck:doBoxCheck,
            doRightBox:doRightBox
        };
    })();
    //字母表块
    var charCodelist=document.querySelectorAll('#charCode span');
    var checkboxContent= document.querySelector('#checkboxContent');
    var codeBlock=(function(charCodelist,checkboxContent){
        //字母表事件监听
        kown.C.clickAction(charCodelist,loadOptions);
        //响应字母表被单击的处理函数
        function loadOptions(){
            //添加选中
            for(var i=0;i<charCodelist.length;i++){
                charCodelist[i].removeAttribute('class');
            }
            this.setAttribute('class',"active");
            kown.V.showLoadGif(checkboxContent);
            //异步传输的参数
            var param={
                url:codeUrl,
                method:"GET",
                sendData:this.firstChild.nodeValue
            };
            //异步回调函数
            function backJson(dataSet){
                var html="";
                var viewObj={
                    htmlStr:'<label for="" class="checkbox-inline" id="k$"> <input type="checkbox" value="k$">k$</label>'
                };
                for(var i=0;i<dataSet.length;i++){
                    var item={
                        id:dataSet[i]['value'],
                        label:dataSet[i]['label'],
                        label2:dataSet[i]['label']
                    };
                    html+= kown.C.mergeViewData(item,viewObj);
                }
                checkboxContent.innerHTML=html;
                var backOptions=document.querySelectorAll('#checkboxContent input');
                kown.C.clickAction(backOptions,checkBoxBlock.doBoxCheck);
            }
            //调用异步请求
            kown.M.asyncData(param,backJson);

        }
    })(charCodelist,checkboxContent);

    //提交存储数据
    var saveBtn=document.getElementById('showData');
    kown.C.clickAction(saveBtn,submitData);
    function submitData(){
        kown.C.preventSubmit(event,true);
        var shipCostObj=kown.M.getData('shipCost');
        var sendData;

        //检查select是否还有option,
        if(shipSelect.options.length==0){
            return false;
        }
        if(shipSelect.value !=="free" && shipCostObj['cost']==0 && shipCostObj['eachAdd']==0){
            return false;
        }
        //显示加载图标
        resultforShip.style.display='block';
        var oneShip;
        var className=this.getAttribute("class");
        if(className.indexOf("Container")>-1){
            var containerName=className.substring(className.indexOf("Container"));
            kown.V.showLoadGif(document.getElementById(containerName),50);
            kown.M.createData('countryList',kown.M.unique(kown.M.getData('countryList')));
            sendData={shippingid:this.getAttribute("class").replace(/[^0-9]/g,""),shipping:shipCostObj,countryList:kown.M.getData('countryList')};
            document.getElementById("showData").setAttribute("class","button");
            oneShip=containerName;
        }else{
            kown.M.createData('countryList',kown.M.unique(kown.M.getData('countryList')));
            sendData={shipping:shipCostObj,countryList:kown.M.getData('countryList')};
            /////////////////////////////////////////////////////////////////////////////
            console.log(sendData);
            //生成一个空的容器，数据加载完成，可以更新视图
            oneShip=kown.V.createLoading({
                parent:resultforShip,
                htmlStr:"",
                wrapTag:'div',
                wrapAttr:'.oneOfship .clearFix'});
        }
        jQuery.ajax({
            url:saveUrl,
            data:sendData,
            type:'post',
            dataType:'json',
            success:function(result){
                createHtml(result,oneShip);
            }
        });

    }

    function createHtml(dataSet,container){
        //合并运费视图
        var shippingHtml=kown.C.mergeViewData({
            method:dataSet.shipping['method'],
            cost:dataSet.shipping['cost'],
            eachAdd:dataSet.shipping['eachAdd']
        },{
            htmlStr:"<ul> <li>Services:<strong>k$</strong></li> <li>Cost:<strong>k$</strong></li> <li>Each additional:<strong>k$</strong></li></ul>"
        });
        //合并国家视图
        var spanHtml="";
        if(typeof dataSet.countryList=='object'){
            var arr =Object.keys(dataSet.countryList);
            for(var i=0;i<arr.length;i++){
                spanHtml+="<span>k$</span> |";
            }
        }else{
            spanHtml+="<span>k$</span> |";
        }
        var CountryHtml=kown.C.mergeViewData(dataSet.countryList,{
            htmlStr:"<div class='resultCountry'>"+spanHtml.substring(0,spanHtml.length-1)+"</div>"
        });

        //生成编辑按钮
        var btnHtml=kown.C.mergeViewData({shippingid:dataSet.shippingid,name:'edit'},{
            htmlStr:"<div class='editShip'><button class='button' id='edit_k$'>k$</button></div>"
        });
        //隐藏Id
        var hideInput=' <input type="hidden" value="'+dataSet.shippingid+'" name="shippingid[]">';
        //更新结果视图到容器
        if(typeof container !=="object"){
            container=document.getElementById(container);
        }
        kown.V.updateView({
            parent:container,
            htmlStr:hideInput+shippingHtml+CountryHtml+btnHtml
        });
        //添加成功后重置视图与数据
        kown.V.afterDoForView(shipSelect,dataSet.shipping['method'],countryOption,'#checkboxContent input',shipCost,eachAdd);
        container.setAttribute('id',"Container_"+dataSet.shippingid);
        // 为当前编辑按钮设置监听事件
        var editBtn=document.getElementById("edit_"+dataSet.shippingid);
        kown.C.clickAction(editBtn,doEdit);
        kown.V.abledBtn(document.querySelectorAll(".oneOfship button"));
    }

    //为编辑按钮设置监听函数
    function doEdit(){
        kown.V.disabledBtn(document.querySelectorAll(".oneOfship button"));
        kown.V.showLoadGif(document.querySelector('#shipCostContent'),50);
        kown.V.showLoadGif(document.querySelector('#countryOptions'),50);
        kown.C.triggerEvent('isHide',true);
        var id=this.getAttribute('id').replace(/[^0-9]/g,"");
        var param={
            url:editUrl,
            method:"GET",
            sendData:id
        };
        kown.M.asyncData(param,editBack);
    }
    //编辑异步回调函数
    function editBack(data){
        //给按钮设置Class，用于判断数据是否更新，还是新建
        document.getElementById("showData").setAttribute("class","button Container_"+data['shippingid']);
        //更新结果表单视图
        kown.C.mergeVAndD(data['shipping'], kown.V.getView('shipCost'),'shipCost',true);
        countryOption.removeChild(document.querySelector('#countryOptions #loadingGif'));
        //更新结果国家视图
        if(typeof data['countryList']=='object'){
            for(var i in data['countryList']){
                kown.C.mergeOption({
                    id:i+"_clone",
                    value:data['countryList'][i],
                    label:data['countryList'][i]
                },{parent:countryOption,
                    htmlStr:'<label for="" class="checkbox-inline" id="k$"><input type="checkbox" value="k$" checked="true">k$</label>'
                },i,false,kown.M.getData('countryList'));
                document.querySelector('#'+i+"_clone input").addEventListener('change',checkBoxBlock.doRightBox,false);
            }
            //把数据更新到countryList对象中，因为之前empty过，方便提交时从dataSet中获取
            kown.M.createOptionData('countryList',kown.M.getData('countryList'));
        }else{
            countryOption.innerHTML=data['countryList'];
        }
        kown.V.doInput(data['shipping']);
        if(shipSelect.value=="free"){
            kown.C.triggerEvent('isAble',false);
        }
    }

    //对于编辑页面中的编辑按钮绑定事件
    var btnList= document.querySelectorAll('.editPageShip button');
    if(btnList.length>=1){
        kown.C.clickAction(btnList,doEdit);
    }

})('http://web.yokir.com/index.php/country/index/getCountryList/id/',"http://web.yokir.com/index.php/country/index/save","http://web.yokir.com/index.php/country/index/getShipInfo/id/");


