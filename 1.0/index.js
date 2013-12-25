KISSY.add(function(S){
    var D = S.DOM,
        E = S.Event,
        debugEle, 
        aDebugVars=[]; //存放所有debug的数组

    function KMobileConsole(degree, pc) {
        this.init(degree, pc);
    }

    KMobileConsole.prototype = {
        init: function(degree, pc){
            var self = this,
                orientation = 0;
            debugEle = D.create('<div>');
            D.addClass(debugEle, 'KMC-debug');

            D.css(debugEle, {
                position: 'absolute', top:'0px', left:'0px',width: '100%',
                fontSize: '12px', cursor: 'default', backgroundColor: '#fff',
                minHeight: '300%', letterSpacing: '0px', zIndex: '99999'
            });

            var orientEvent = ("onorientationchange" in window) ? "orientationchange" : "resize";

            E.on(window, orientEvent, function() {
                    // 移动设备上使用
                    if(window.orientation != orientation && window.orientation == degree){
                        window.scrollTo(1,1);   
                        self.showDebugInfo();
                    }else{
                        if(window.orientation != degree){
                            if(debugEle.parentNode){
                                document.body.removeChild(debugEle); 
                            }
                        }
                    }

                    //PC上测试
                    if(pc === 'pc'){
                        window.scrollTo(1,1);
                        self.showDebugInfo();
                    }

                    horientation = window.orientation;
            });

            // window.onerror=function(msg, url, linenumber){
            E.on(window, 'error', function(error) {
                // error.message 
                // error.filename 
                // error.lineno
                
                aDebugVars.push({type:"error", message: error.originalEvent});
            });
        },
        log: function(name,value){
            this.pushLogs(arguments);
        },
        //直接显示所有log信息 (error不会显示)
        show: function(){
            this.showDebugInfo();
        },
        showDebugInfo: function(){
            var self = this;
            // 先删除所有的内容 重新生成
            while(debugEle.firstChild){
                debugEle.removeChild(debugEle.firstChild)
            }
            D.append(debugEle, S.one('body'));
            D.css(debugEle, 'display', 'block');
            //所有的debug信息
            for(var i=0; i<aDebugVars.length; i++){
                var msg = D.create('<div>');
                switch(aDebugVars[i].type){
                    case "log":
                        //单条详细信息
                        for(var j=0; j<aDebugVars[i].message.length; j++){
                            var item = self.showMsg(aDebugVars[i].message[j]);
                            D.css(item, {verticalAlign: 'top', padding: '2px'});
                            D.append(item, msg)
                        }
                        D.append(msg, debugEle);
                        break;
                    case "error":
                        self.insertEle(msg, aDebugVars[i].message.message, '#f00');
                        self.insertEle(msg, '&nbsp;'+aDebugVars[i].message.filename+'  line: '+aDebugVars[i].message.lineno, "#808080");
                        D.append(msg, debugEle);
                        break;
                }
                D.css(msg, 'border-bottom', '1px solid #eee');
            }

            // 使用eval 模拟console的代码执行  (console.log的信息不会显示 米有返回值)
            var exeEle = D.create('<div>'),
                exeInput = D.create('<input>');
            D.css(exeEle,'width','100%');
            D.css(exeInput, {border: 'none', width:'95%', borderBottom:'1px solid #ccc'});

            D.attr(exeInput, {placeholder:'js代码可以在这来一发 alert("fire")',
                            autocorrect:'off', autocapitalize:'none'});

            E.on(exeInput, 'keyup', function(evt){
                if(evt.keyCode==13){
                    try{
                        var obj = eval(this.value);
                        aDebugVars.push({type:"log",message:[obj]});
                    }catch(e){
                        
                        //存放出错信息
                        aDebugVars.push({type:"error",message:[e]});
                    }
                    self.showDebugInfo();
                }
            });

            //输入框左边箭头
            var arrow = D.create('<span>');
            D.append(D.create('>'), arrow);
            D.css(arrow, {color:'#239CD5', fontWeight:'bold', fontSize:'16px'});
            D.append(arrow, exeEle);
            D.append(exeInput, exeEle);
            D.append(exeEle, debugEle);
        },

        showMsg: function(val){
            var self = this;
            switch(typeof(val)){
                case 'number': return self.showNum(val);
                    break;
                case 'string': return self.showStr(val);
                    break; 
                case 'object': return self.showObj(val);
                    break;
                default:
                    return D.create(typeof(val));
            }
        },

        showNum: function(value){
            var node = D.create('<div>');
            // node.appendChild(document.createTextNode(value));
            // D.create(数字)  不可用.....  KISSY的bug????
            // D.append(D.create(123), node);
            D.append(D.create(value.toString()), node);
            D.css(node, {color:'#00f', display:'inline', verticalAlign:'top'});

            return node;
        },

        showStr: function (value){
            var node  = D.create('<div>');
            D.append(D.create(value), node);
            D.css(node, {color:'#000', display:'inline', verticalAlign:'top'});

            return node;
        },

        showHtm: function (value){
            var self = this;
            // nodeType {元素:1, 属性:2, 文本:3, 注释:8, 文档:9}
            if(value.nodeType == 3){  //textnode
                var nodeSpan = D.create("<span>");
                self.insertEle(nodeSpan, value.nodeValue);
                return nodeSpan;
            }
            var node = D.create('<div>');
            if(value.nodeType == 1){  //element
                self.insertEle(node, "<");
                self.insertEle(node, value.tagName.toLowerCase(), '#800080');
                self.insertEle(node, " ");
                for(var i=0;i<value.attributes.length;i++){
                    self.insertEle(node, '&nbsp;');
                    self.insertEle(node, value.attributes[i].nodeName,'#00f');
                    self.insertEle(node, '="');
                    self.insertEle(node, value.attributes[i].nodeValue,'#00f');
                    self.insertEle(node, '"');
                }
                self.insertEle(node,">");
                // for(var i=0; i<value.childNodes.length; i++){
                //     node.appendChild(self.showHtm(value.childNodes[i])); //to be continued
                // }   
                self.insertEle(node, '&nbsp;....&nbsp;');
                self.insertEle(node, '<');
                self.insertEle(node, value.tagName.toLowerCase(), '#800080');
                self.insertEle(node, '/>');
            }
            D.css(node, {color:'#000', display:'inline', verticalAlign:'top'});

            return node;
        },

        insertEle: function (node, text, color){
            var span = D.create("<span>");
            D.append(D.create(text), span);
            color && D.css(span, 'color', color); 
            D.append(span, node);
        },

        showObj: function (value){
            var self = this,
                node = D.create('<div>');
            if(!value) return node;
            D.css(node, 'display', 'inline');
            if(value && value.nodeType){
                return self.showHtm(value);
            //  return node;
            }
            if(value.length){
                // 数组
                D.append(D.create('['), node);
                for(var i=0;i<value.length;i++){
                    D.append(self.showMsg(value[i]), node);
                    if(i<value.length -1){
                        D.append(D.create(','), node);
                    }

                }
                D.css(node, 'vertical-align', 'top');
                D.append(D.create(']'), node);
            }else{
                // 对象
                var objNode = D.create('<div>'),
                    arrow = D.create('<span>');
                D.append(D.create('>>  Object'), arrow);
                D.css(arrow, {color:'#808080', fontSize:'12px'});
                D.append(arrow, objNode);
                D.css(objNode, 'display', 'inline');
                objNode.objVal = value;
                objNode.expanded = false;
                // 点击展开
                E.on(objNode, 'click', function(evt){
                    if(this.expanded){
                        // TODO
                        this.firstChild.textContent = ">>  Object";
                        while(this.childNodes.length > 1){
                            this.removeChild(this.lastChild);
                        }
                        this.expanded = false;
                    }else{
                        D.append(self.expandObject(this.objVal), this);
                        this.firstChild.textContent="▼  Object";
                        this.expanded = true;
                    }
                    evt.stopPropagation();
                });
                D.append(objNode, node);
                D.css(node, 'display', 'inline-block');
            }
            return node;
        },

        // 对象展开
        expandObject: function (obj){
            var self = this,
                node = D.create('<div>');
            for(var i in obj){
                var objWrap = D.create('<div>'),
                    objInstance = D.create('<span>');
                D.append(D.create(i+':'), objInstance);
                D.append(objInstance, objWrap);
                D.append(self.showMsg(obj[i]), objWrap);

                D.css(objWrap, 'vertical-align', 'top');
                D.css(objInstance, {color:'#800080', verticalAlign:'top'});
                D.append(objWrap, node);
            }
            D.css(node, 'margin-left', '14px')
            return node;
        },

        pushLogs: function (obj){
            if(debugEle.parentNode) return; //console open 不在记录信息
            aDebugVars.push({type:"log",message:obj});
        }
    }

    return KMobileConsole;
})