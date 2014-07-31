(function(win, $) {
    var items = [];
    var $el;
    var init = function() {
        $el = $('div[node-type="apps"]');
        appTodo();
    };
    var appTodo = function() {
        var numobj = $el.find('b[node-type="num"]');
        var partMash=$el.find('div[node-type="sm"]');
        var mask= $('.screen_mask');
        var group = new Group();
        group.callback(function(mistake,index,compound,result){
            if(!mistake){
                numobj.text(result[2]);
                renderNumArea(index,compound,result);
            }else{
                mask.show();
            }
        });

        group.setDefine(function(){
            partMash.hide();
            numobj.text(result[0]);
        });

        var renderNumArea=function(){
            var color='';
            return function(index,compound,result){
                color || (color=getColor());
                partMash.eq(index).show().css('background-color','#'+color);
                if(compound){
                    color=getColor();
                }
            };
        }();



        $el.find('a[node-type="btn-l"]').on('tap',function() {
            group.left();
            // numobj.text('L');
        })

        $el.find('a[node-type="btn-r"]').on('tap',function() {
            group.right();
            // numobj.text('R');
        });
        mask.find('a.errbtn').on('tap',function(){
            group.reset();
        });

    };
    var getColor=function(){
         var colors=["ff9800","e65100","795548","b0120a","c2185b","f57c00","#dd2c00","e91e63"];
         var colorLen=colors.length;
        var index=0;
        return function(){
            var color=colors[index];
            index = (index+1)%colorLen;
            console.log(index)
           return color;
        }
    }();

    var Group = function() {
        this.flag = [0, 0];
        this.result=[0,0,0];
        this._callback=null;
        this.mistake=false;//错误
    };
    $.extend(Group.prototype, {
        init: function() {

        },
        left: function() {
            var flag = this.flag;
            var result=this.result;
            if(this._check(0)){
                flag[0] = 1;
                result[0] = this.result[0]+1;
            }
            this._result(0);
        },
        right: function() {
            var flag = this.flag;
            var result=this.result;
            if(this._check(1)){
                flag[1] = 1;
                result[1] = this.result[1]+1;
            }
            this._result(1);
        },
        _check: function(inx) {
            var val=this.flag[inx];
            var flag;
            if(val>0){
                flag = false;
                this.mistake = true;
            }
            flag = true;
            return flag;
        },
        _result:function(inx){
            var flag=this.flag;
            var result=this.result;
            var compound=false;
            //一对成功
            if(!this.mistake && (flag[0] & flag[1])){
                this.flag=[0,0];
                result[2] = result[2]+1;
                compound=true;
            }
            this._callback(this.mistake,inx,compound,result);
        },
        //flag [true,false]
        callback: function(fn) {
            this._callback = fn;
        },
        reset: function(fn) {
           this.flag = [0, 0];
            this.result=[0,0,0];
            this._callback=null;
            this.mistake=false;//错误 
            this._defineFn();
        },
        setDefine:function(fn){
            this._defineFn= fn|| function(){};
        },
        getResult:function(){
            return this.result;
        }
    });



    init();

})(this, $);
