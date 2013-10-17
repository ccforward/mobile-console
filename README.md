## 综述

KMobileConsole是用在移动端的小工具,可以模拟PC浏览器的console进行debug.

* 版本：1.0
* 作者：chenchen
* 标签：console
* demo：[http://gallery.kissyui.com/KMobileConsole/1.0/demo/index.html](http://gallery.kissyui.com/KMobileConsole/1.0/demo/index.html)

## 初始化组件

    S.use('gallery/KMobileConsole/1.0/index', function (S, KMobileConsole) {
         var KMobileConsole = new KMobileConsole();
    })



## 使用说明
    S.use('gallery/KMobileConsole/1.0/index', function (S, KMobileConsole) {
        var mConsole = new KMobileConsole();
        //可以输出各种形式的数据
		mConsole.log("Array",[11,22,'javascript is a good language']);

        mConsole.log("Object",{dept:'taobao UED', year:2013, 
        			array:[1111, 1212, '呵呵',{maomao:'一师是个好学校', huanhuan:'这真真是极好的'}]});

        mConsole.log({str:'a String',arr:[100, 500, {num:2046,strs:'another String'}]})

        mConsole.log("DOM Element", document.getElementById("J_test"));	

        //可以输出系统出错信息 (未定义的函数) 相当于断点,之后的信息不能输出
        whatTheFuck();

    })
## 在pc上开启console 
    //添加参数 'pc'
    var mConsole = new KMobileConsole('pc')

## 查看debug信息
* 把移动设备设置为可旋转模式,然后设备向右旋转90度即可查看debug信息
![开始状态](http://pic.yupoo.com/ccking/DeCLt3ei/medish.jpg)
![旋转之后](http://pic.yupoo.com/ccking/DeCLtt8p/RGjC6.png)

* 在debug信息区最下方输入框中可以运行js代码(比较鸡肋)
![运行代码](http://pic.yupoo.com/ccking/DeCLXx7R/yCEiu.png)



## 兼容
* iOS 6
* iOS 7
* Android 4+