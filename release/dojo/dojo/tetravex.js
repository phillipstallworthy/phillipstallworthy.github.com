/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

if(!dojo._hasResource["dojox.gfx.matrix"]){dojo._hasResource["dojox.gfx.matrix"]=true;dojo.provide("dojox.gfx.matrix");(function(){var m=dojox.gfx.matrix;var _1={};m._degToRad=function(_2){return _1[_2]||(_1[_2]=(Math.PI*_2/180));};m._radToDeg=function(_3){return _3/Math.PI*180;};m.Matrix2D=function(_4){if(_4){if(typeof _4=="number"){this.xx=this.yy=_4;}else{if(_4 instanceof Array){if(_4.length>0){var _5=m.normalize(_4[0]);for(var i=1;i<_4.length;++i){var l=_5,r=dojox.gfx.matrix.normalize(_4[i]);_5=new m.Matrix2D();_5.xx=l.xx*r.xx+l.xy*r.yx;_5.xy=l.xx*r.xy+l.xy*r.yy;_5.yx=l.yx*r.xx+l.yy*r.yx;_5.yy=l.yx*r.xy+l.yy*r.yy;_5.dx=l.xx*r.dx+l.xy*r.dy+l.dx;_5.dy=l.yx*r.dx+l.yy*r.dy+l.dy;}dojo.mixin(this,_5);}}else{dojo.mixin(this,_4);}}}};dojo.extend(m.Matrix2D,{xx:1,xy:0,yx:0,yy:1,dx:0,dy:0});dojo.mixin(m,{identity:new m.Matrix2D(),flipX:new m.Matrix2D({xx:-1}),flipY:new m.Matrix2D({yy:-1}),flipXY:new m.Matrix2D({xx:-1,yy:-1}),translate:function(a,b){if(arguments.length>1){return new m.Matrix2D({dx:a,dy:b});}return new m.Matrix2D({dx:a.x,dy:a.y});},scale:function(a,b){if(arguments.length>1){return new m.Matrix2D({xx:a,yy:b});}if(typeof a=="number"){return new m.Matrix2D({xx:a,yy:a});}return new m.Matrix2D({xx:a.x,yy:a.y});},rotate:function(_6){var c=Math.cos(_6);var s=Math.sin(_6);return new m.Matrix2D({xx:c,xy:-s,yx:s,yy:c});},rotateg:function(_7){return m.rotate(m._degToRad(_7));},skewX:function(_8){return new m.Matrix2D({xy:Math.tan(_8)});},skewXg:function(_9){return m.skewX(m._degToRad(_9));},skewY:function(_a){return new m.Matrix2D({yx:Math.tan(_a)});},skewYg:function(_b){return m.skewY(m._degToRad(_b));},reflect:function(a,b){if(arguments.length==1){b=a.y;a=a.x;}var a2=a*a,b2=b*b,n2=a2+b2,xy=2*a*b/n2;return new m.Matrix2D({xx:2*a2/n2-1,xy:xy,yx:xy,yy:2*b2/n2-1});},project:function(a,b){if(arguments.length==1){b=a.y;a=a.x;}var a2=a*a,b2=b*b,n2=a2+b2,xy=a*b/n2;return new m.Matrix2D({xx:a2/n2,xy:xy,yx:xy,yy:b2/n2});},normalize:function(_c){return (_c instanceof m.Matrix2D)?_c:new m.Matrix2D(_c);},clone:function(_d){var _e=new m.Matrix2D();for(var i in _d){if(typeof (_d[i])=="number"&&typeof (_e[i])=="number"&&_e[i]!=_d[i]){_e[i]=_d[i];}}return _e;},invert:function(_f){var M=m.normalize(_f),D=M.xx*M.yy-M.xy*M.yx,M=new m.Matrix2D({xx:M.yy/D,xy:-M.xy/D,yx:-M.yx/D,yy:M.xx/D,dx:(M.xy*M.dy-M.yy*M.dx)/D,dy:(M.yx*M.dx-M.xx*M.dy)/D});return M;},_multiplyPoint:function(_10,x,y){return {x:_10.xx*x+_10.xy*y+_10.dx,y:_10.yx*x+_10.yy*y+_10.dy};},multiplyPoint:function(_11,a,b){var M=m.normalize(_11);if(typeof a=="number"&&typeof b=="number"){return m._multiplyPoint(M,a,b);}return m._multiplyPoint(M,a.x,a.y);},multiply:function(_12){var M=m.normalize(_12);for(var i=1;i<arguments.length;++i){var l=M,r=m.normalize(arguments[i]);M=new m.Matrix2D();M.xx=l.xx*r.xx+l.xy*r.yx;M.xy=l.xx*r.xy+l.xy*r.yy;M.yx=l.yx*r.xx+l.yy*r.yx;M.yy=l.yx*r.xy+l.yy*r.yy;M.dx=l.xx*r.dx+l.xy*r.dy+l.dx;M.dy=l.yx*r.dx+l.yy*r.dy+l.dy;}return M;},_sandwich:function(_13,x,y){return m.multiply(m.translate(x,y),_13,m.translate(-x,-y));},scaleAt:function(a,b,c,d){switch(arguments.length){case 4:return m._sandwich(m.scale(a,b),c,d);case 3:if(typeof c=="number"){return m._sandwich(m.scale(a),b,c);}return m._sandwich(m.scale(a,b),c.x,c.y);}return m._sandwich(m.scale(a),b.x,b.y);},rotateAt:function(_14,a,b){if(arguments.length>2){return m._sandwich(m.rotate(_14),a,b);}return m._sandwich(m.rotate(_14),a.x,a.y);},rotategAt:function(_15,a,b){if(arguments.length>2){return m._sandwich(m.rotateg(_15),a,b);}return m._sandwich(m.rotateg(_15),a.x,a.y);},skewXAt:function(_16,a,b){if(arguments.length>2){return m._sandwich(m.skewX(_16),a,b);}return m._sandwich(m.skewX(_16),a.x,a.y);},skewXgAt:function(_17,a,b){if(arguments.length>2){return m._sandwich(m.skewXg(_17),a,b);}return m._sandwich(m.skewXg(_17),a.x,a.y);},skewYAt:function(_18,a,b){if(arguments.length>2){return m._sandwich(m.skewY(_18),a,b);}return m._sandwich(m.skewY(_18),a.x,a.y);},skewYgAt:function(_19,a,b){if(arguments.length>2){return m._sandwich(m.skewYg(_19),a,b);}return m._sandwich(m.skewYg(_19),a.x,a.y);}});})();dojox.gfx.Matrix2D=dojox.gfx.matrix.Matrix2D;}if(!dojo._hasResource["dojox.gfx._base"]){dojo._hasResource["dojox.gfx._base"]=true;dojo.provide("dojox.gfx._base");(function(){var g=dojox.gfx,b=g._base;g._hasClass=function(_1a,_1b){var cls=_1a.getAttribute("className");return cls&&(" "+cls+" ").indexOf(" "+_1b+" ")>=0;};g._addClass=function(_1c,_1d){var cls=_1c.getAttribute("className")||"";if(!cls||(" "+cls+" ").indexOf(" "+_1d+" ")<0){_1c.setAttribute("className",cls+(cls?" ":"")+_1d);}};g._removeClass=function(_1e,_1f){var cls=_1e.getAttribute("className");if(cls){_1e.setAttribute("className",cls.replace(new RegExp("(^|\\s+)"+_1f+"(\\s+|$)"),"$1$2"));}};b._getFontMeasurements=function(){var _20={"1em":0,"1ex":0,"100%":0,"12pt":0,"16px":0,"xx-small":0,"x-small":0,"small":0,"medium":0,"large":0,"x-large":0,"xx-large":0};if(dojo.isIE){dojo.doc.documentElement.style.fontSize="100%";}var div=dojo.create("div",{style:{position:"absolute",left:"0",top:"-100px",width:"30px",height:"1000em",borderWidth:"0",margin:"0",padding:"0",outline:"none",lineHeight:"1",overflow:"hidden"}},dojo.body());for(var p in _20){div.style.fontSize=p;_20[p]=Math.round(div.offsetHeight*12/16)*16/12/1000;}dojo.body().removeChild(div);return _20;};var _21=null;b._getCachedFontMeasurements=function(_22){if(_22||!_21){_21=b._getFontMeasurements();}return _21;};var _23=null,_24={};b._getTextBox=function(_25,_26,_27){var m,s,al=arguments.length;if(!_23){_23=dojo.create("div",{style:{position:"absolute",top:"-10000px",left:"0"}},dojo.body());}m=_23;m.className="";s=m.style;s.borderWidth="0";s.margin="0";s.padding="0";s.outline="0";if(al>1&&_26){for(var i in _26){if(i in _24){continue;}s[i]=_26[i];}}if(al>2&&_27){m.className=_27;}m.innerHTML=_25;if(m["getBoundingClientRect"]){var bcr=m.getBoundingClientRect();return {l:bcr.left,t:bcr.top,w:bcr.width||(bcr.right-bcr.left),h:bcr.height||(bcr.bottom-bcr.top)};}else{return dojo.marginBox(m);}};var _28=0;b._getUniqueId=function(){var id;do{id=dojo._scopeName+"Unique"+(++_28);}while(dojo.byId(id));return id;};})();dojo.mixin(dojox.gfx,{defaultPath:{type:"path",path:""},defaultPolyline:{type:"polyline",points:[]},defaultRect:{type:"rect",x:0,y:0,width:100,height:100,r:0},defaultEllipse:{type:"ellipse",cx:0,cy:0,rx:200,ry:100},defaultCircle:{type:"circle",cx:0,cy:0,r:100},defaultLine:{type:"line",x1:0,y1:0,x2:100,y2:100},defaultImage:{type:"image",x:0,y:0,width:0,height:0,src:""},defaultText:{type:"text",x:0,y:0,text:"",align:"start",decoration:"none",rotated:false,kerning:true},defaultTextPath:{type:"textpath",text:"",align:"start",decoration:"none",rotated:false,kerning:true},defaultStroke:{type:"stroke",color:"black",style:"solid",width:1,cap:"butt",join:4},defaultLinearGradient:{type:"linear",x1:0,y1:0,x2:100,y2:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultRadialGradient:{type:"radial",cx:0,cy:0,r:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultPattern:{type:"pattern",x:0,y:0,width:0,height:0,src:""},defaultFont:{type:"font",style:"normal",variant:"normal",weight:"normal",size:"10pt",family:"serif"},getDefault:(function(){var _29={};return function(_2a){var t=_29[_2a];if(t){return new t();}t=_29[_2a]=new Function;t.prototype=dojox.gfx["default"+_2a];return new t();};})(),normalizeColor:function(_2b){return (_2b instanceof dojo.Color)?_2b:new dojo.Color(_2b);},normalizeParameters:function(_2c,_2d){if(_2d){var _2e={};for(var x in _2c){if(x in _2d&&!(x in _2e)){_2c[x]=_2d[x];}}}return _2c;},makeParameters:function(_2f,_30){if(!_30){return dojo.delegate(_2f);}var _31={};for(var i in _2f){if(!(i in _31)){_31[i]=dojo.clone((i in _30)?_30[i]:_2f[i]);}}return _31;},formatNumber:function(x,_32){var val=x.toString();if(val.indexOf("e")>=0){val=x.toFixed(4);}else{var _33=val.indexOf(".");if(_33>=0&&val.length-_33>5){val=x.toFixed(4);}}if(x<0){return val;}return _32?" "+val:val;},makeFontString:function(_34){return _34.style+" "+_34.variant+" "+_34.weight+" "+_34.size+" "+_34.family;},splitFontString:function(str){var _35=dojox.gfx.getDefault("Font");var t=str.split(/\s+/);do{if(t.length<5){break;}_35.style=t[0];_35.variant=t[1];_35.weight=t[2];var i=t[3].indexOf("/");_35.size=i<0?t[3]:t[3].substring(0,i);var j=4;if(i<0){if(t[4]=="/"){j=6;}else{if(t[4].charAt(0)=="/"){j=5;}}}if(j<t.length){_35.family=t.slice(j).join(" ");}}while(false);return _35;},cm_in_pt:72/2.54,mm_in_pt:7.2/2.54,px_in_pt:function(){return dojox.gfx._base._getCachedFontMeasurements()["12pt"]/12;},pt2px:function(len){return len*dojox.gfx.px_in_pt();},px2pt:function(len){return len/dojox.gfx.px_in_pt();},normalizedLength:function(len){if(len.length==0){return 0;}if(len.length>2){var _36=dojox.gfx.px_in_pt();var val=parseFloat(len);switch(len.slice(-2)){case "px":return val;case "pt":return val*_36;case "in":return val*72*_36;case "pc":return val*12*_36;case "mm":return val*dojox.gfx.mm_in_pt*_36;case "cm":return val*dojox.gfx.cm_in_pt*_36;}}return parseFloat(len);},pathVmlRegExp:/([A-Za-z]+)|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,pathSvgRegExp:/([A-Za-z])|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,equalSources:function(a,b){return a&&b&&a==b;},switchTo:function(_37){var ns=dojox.gfx[_37];if(ns){dojo.forEach(["Group","Rect","Ellipse","Circle","Line","Polyline","Image","Text","Path","TextPath","Surface","createSurface"],function(_38){dojox.gfx[_38]=ns[_38];});}}});}if(!dojo._hasResource["dojox.gfx"]){dojo._hasResource["dojox.gfx"]=true;dojo.provide("dojox.gfx");dojo.loadInit(function(){var gfx=dojo.getObject("dojox.gfx",true),sl,_39,_3a;while(!gfx.renderer){if(dojo.config.forceGfxRenderer){dojox.gfx.renderer=dojo.config.forceGfxRenderer;break;}var _3b=(typeof dojo.config.gfxRenderer=="string"?dojo.config.gfxRenderer:"svg,vml,canvas,silverlight").split(",");for(var i=0;i<_3b.length;++i){switch(_3b[i]){case "svg":if("SVGAngle" in dojo.global){dojox.gfx.renderer="svg";}break;case "vml":if(dojo.isIE){dojox.gfx.renderer="vml";}break;case "silverlight":try{if(dojo.isIE){sl=new ActiveXObject("AgControl.AgControl");if(sl&&sl.IsVersionSupported("1.0")){_39=true;}}else{if(navigator.plugins["Silverlight Plug-In"]){_39=true;}}}catch(e){_39=false;}finally{sl=null;}if(_39){dojox.gfx.renderer="silverlight";}break;case "canvas":if(dojo.global.CanvasRenderingContext2D){dojox.gfx.renderer="canvas";}break;}if(gfx.renderer){break;}}break;}if(dojo.config.isDebug){console.log("gfx renderer = "+gfx.renderer);}if(gfx[gfx.renderer]){gfx.switchTo(gfx.renderer);}else{gfx.loadAndSwitch=gfx.renderer;dojo["require"]("dojox.gfx."+gfx.renderer);}});}if(!dojo._hasResource["dojox.gfx.Mover"]){dojo._hasResource["dojox.gfx.Mover"]=true;dojo.provide("dojox.gfx.Mover");dojo.declare("dojox.gfx.Mover",null,{constructor:function(_3c,e,_3d){this.shape=_3c;this.lastX=e.clientX;this.lastY=e.clientY;var h=this.host=_3d,d=document,_3e=dojo.connect(d,"onmousemove",this,"onFirstMove");this.events=[dojo.connect(d,"onmousemove",this,"onMouseMove"),dojo.connect(d,"onmouseup",this,"destroy"),dojo.connect(d,"ondragstart",dojo,"stopEvent"),dojo.connect(d,"onselectstart",dojo,"stopEvent"),_3e];if(h&&h.onMoveStart){h.onMoveStart(this);}},onMouseMove:function(e){var x=e.clientX;var y=e.clientY;this.host.onMove(this,{dx:x-this.lastX,dy:y-this.lastY});this.lastX=x;this.lastY=y;dojo.stopEvent(e);},onFirstMove:function(){this.host.onFirstMove(this);dojo.disconnect(this.events.pop());},destroy:function(){dojo.forEach(this.events,dojo.disconnect);var h=this.host;if(h&&h.onMoveStop){h.onMoveStop(this);}this.events=this.shape=null;}});}if(!dojo._hasResource["dojox.gfx.Moveable"]){dojo._hasResource["dojox.gfx.Moveable"]=true;dojo.provide("dojox.gfx.Moveable");dojo.declare("dojox.gfx.Moveable",null,{constructor:function(_3f,_40){this.shape=_3f;this.delay=(_40&&_40.delay>0)?_40.delay:0;this.mover=(_40&&_40.mover)?_40.mover:dojox.gfx.Mover;this.events=[this.shape.connect("onmousedown",this,"onMouseDown")];},destroy:function(){dojo.forEach(this.events,this.shape.disconnect,this.shape);this.events=this.shape=null;},onMouseDown:function(e){if(this.delay){this.events.push(this.shape.connect("onmousemove",this,"onMouseMove"),this.shape.connect("onmouseup",this,"onMouseUp"));this._lastX=e.clientX;this._lastY=e.clientY;}else{new this.mover(this.shape,e,this);}dojo.stopEvent(e);},onMouseMove:function(e){if(Math.abs(e.clientX-this._lastX)>this.delay||Math.abs(e.clientY-this._lastY)>this.delay){this.onMouseUp(e);new this.mover(this.shape,e,this);}dojo.stopEvent(e);},onMouseUp:function(e){this.shape.disconnect(this.events.pop());this.shape.disconnect(this.events.pop());},onMoveStart:function(_41){dojo.publish("/gfx/move/start",[_41]);dojo.addClass(dojo.body(),"dojoMove");},onMoveStop:function(_42){dojo.publish("/gfx/move/stop",[_42]);dojo.removeClass(dojo.body(),"dojoMove");},onFirstMove:function(_43){},onMove:function(_44,_45){this.onMoving(_44,_45);this.shape.applyLeftTransform(_45);this.onMoved(_44,_45);},onMoving:function(_46,_47){},onMoved:function(_48,_49){}});}if(!dojo._hasResource["dojox.gfx.move"]){dojo._hasResource["dojox.gfx.move"]=true;dojo.provide("dojox.gfx.move");}dojo.provide("games.Tetravex",null,{});games.Tetravex=function(){};games.Tetravex._props={suface_width:400,suface_height:200,padding:0};games.Tetravex._boardX=[];games.Tetravex._boardY=[];games.Tetravex._half_square=0;games.Tetravex._tileSize=0;games.Tetravex._boardSize=3;games.Tetravex._surface=null;games.Tetravex.squares=[];games.Tetravex._tile=[];games.Tetravex._origin={x:0,y:0};games.Tetravex.setPadding=function(_4a){games.Tetravex._props.padding=_4a;};games.Tetravex.setTileSize=function(_4b){games.Tetravex._tileSize=_4b;};games.Tetravex.initialize=function(){var _4c=dojo.byId("tetravex");games.Tetravex._surface=dojox.gfx.createSurface(_4c,games.Tetravex._props.suface_width,games.Tetravex._props.suface_height);games.Tetravex._surface.whenLoaded(function(){games.Tetravex._drawBoard();games.Tetravex._extendOnMoving();games.Tetravex._createTiles();});return;};games.Tetravex.reset=function(){for(var f=0;f<games.Tetravex._tile.length;f++){games.Tetravex._tile[f].removeShape();}games.Tetravex._createTiles();};games.Tetravex.resetPlus=function(){if(games.Tetravex._boardSize<5){games.Tetravex._boardSize++;games.Tetravex._surface.clear();games.Tetravex._drawBoard();games.Tetravex._createTiles();}};games.Tetravex.resetMinus=function(){if(games.Tetravex._boardSize>2){games.Tetravex._boardSize--;games.Tetravex._surface.clear();games.Tetravex._drawBoard();games.Tetravex._createTiles();}};games.Tetravex._drawBoard=function(){games.Tetravex._initGameSize();var _4d=games.Tetravex._surface.createPath().setStroke("black");var i;for(i=0;i<=games.Tetravex._boardSize;i++){var x=games.Tetravex._boardX[0];var y=games.Tetravex._boardY[i];var h=games.Tetravex._boardX[games.Tetravex._boardSize];_4d.moveTo(x,y);_4d.hLineTo(h);_4d.closePath();}for(i=0;i<=games.Tetravex._boardSize;i++){_4d.moveTo(games.Tetravex._boardX[i],games.Tetravex._boardY[0]).vLineTo(games.Tetravex._boardY[games.Tetravex._boardSize]).closePath();}for(i=0;i<=games.Tetravex._boardSize;i++){_4d.moveTo(games.Tetravex._boardX[games.Tetravex._boardSize+1],games.Tetravex._boardY[i]).hLineTo(games.Tetravex._boardX[(games.Tetravex._boardSize*2)+1]).closePath();}for(i=games.Tetravex._boardSize+1;i<=(games.Tetravex._boardSize*2)+1;i++){_4d.moveTo(games.Tetravex._boardX[i],games.Tetravex._boardY[0]).vLineTo(games.Tetravex._boardY[games.Tetravex._boardSize]).closePath();}};games.Tetravex._initGameSize=function(){games.Tetravex._tileSize=games.Tetravex._props.suface_width/((2*games.Tetravex._boardSize)+2);games.Tetravex._half_square=(games.Tetravex._tileSize/2)+(games.Tetravex._props.padding);games.Tetravex._boardX=[];games.Tetravex._boardY=[];games.Tetravex._boardX[0]=games.Tetravex._tileSize/2;for(var f=1;f<(2*games.Tetravex._boardSize)+2;f++){games.Tetravex._boardX[f]=(games.Tetravex._tileSize/2)+((games.Tetravex._tileSize+games.Tetravex._props.padding*2)*(f));}for(var y=0;y<=games.Tetravex._boardSize;y++){games.Tetravex._boardY[y]=games.Tetravex._boardX[y];}};games.Tetravex._extendOnMoving=function(){dojo.extend(dojox.gfx.Moveable,{onMoving:function(_4e,_4f){if(_4e.shape.matrix){if((_4f.dx>0&&_4e.shape.matrix.dx>(games.Tetravex._props.suface_width-games.Tetravex._tileSize-2))||(_4f.dx<0&&_4e.shape.matrix.dx<2)){_4f.dx=0;}if((_4f.dy<0&&_4e.shape.matrix.dy<2)||(_4f.dy>0&&_4e.shape.matrix.dy>(games.Tetravex._props.suface_height-games.Tetravex._tileSize-2))){_4f.dy=0;}}}});};games.Tetravex._createTiles=function(){var t=0;for(var y=0;y<games.Tetravex._boardSize;y++){for(var x=1;x<=games.Tetravex._boardSize;x++){games.Tetravex._tile[t]=_50(Math.ceil(Math.random()*9),Math.ceil(Math.random()*9),Math.ceil(Math.random()*9),Math.ceil(Math.random()*9));games.Tetravex._tile[t].applyLeftTransform({dx:games.Tetravex._boardX[games.Tetravex._boardSize+x]+(games.Tetravex._props.padding),dy:games.Tetravex._boardY[y]+(games.Tetravex._props.padding)});t++;}}for(var t=0;t<games.Tetravex._tile.length;t++){var _51=[];_51[t]=new dojox.gfx.Moveable(games.Tetravex._tile[t]);dojo.subscribe("/gfx/move/stop",this,function(_52){moveToNearestSquare(_52);});dojo.subscribe("/gfx/move/start",this,function(_53){_53.shape.moveToFront();});dojo.connect(_51[t],"onMouseDown",null,(function(_54){return function(evt){games.Tetravex._origin.x=_54.shape.matrix.dx;games.Tetravex._origin.y=_54.shape.matrix.dy;};})(_51[t]));}function _50(_55,_56,_57,_58){var _59=games.Tetravex._tileSize;var _5a=games.Tetravex._tileSize/2;var _5b=games.Tetravex._surface.createGroup();var _5c=["black","#C17D11","#CC0000","#F57900","#EDD400","#73D216","#3465A4","#75507B","#BABDB6","white"];var _5d=["white","white","white","black","black","black","white","white","black","black"];var top=_5b.createPolyline([0,0,_59,0,_5a,_5a,0,0]);var _5e=_5b.createPolyline([0,0,_5a,_5a,0,_59,0,0]);var _5f=_5b.createPolyline([0,_59,_5a,_5a,_59,_59,0,_59]);var _60=_5b.createPolyline([_59,_59,_5a,_5a,_59,0,_59,_59]);top.setFill(_5c[_55]).setStroke("black");_5e.setFill(_5c[_56]).setStroke("black");_5f.setFill(_5c[_57]).setStroke("black");_60.setFill(_5c[_58]).setStroke("black");var _61=_5b.createText({x:(games.Tetravex._tileSize/2)-(0.4*games.Tetravex._tileSize/4),y:(games.Tetravex._tileSize/4)+(0.3*games.Tetravex._tileSize/4),text:_55}).setStroke(_5d[_55]).setFill(_5d[_55]).setFont({family:"sans-serif",size:games.Tetravex._tileSize/4+"pt"});var _62=_5b.createText({x:(games.Tetravex._tileSize/4)-(0.7*games.Tetravex._tileSize/4),y:(games.Tetravex._tileSize/2)+(0.5*games.Tetravex._tileSize/4),text:_56}).setStroke(_5d[_56]).setFill(_5d[_56]).setFont({family:"sans-serif",size:games.Tetravex._tileSize/4+"pt"});var _63=_5b.createText({x:(games.Tetravex._tileSize/2)-(0.4*games.Tetravex._tileSize/4),y:((games.Tetravex._tileSize/4)*3)+(0.7*games.Tetravex._tileSize/4),text:_57}).setStroke(_5d[_57]).setFill(_5d[_57]).setFont({family:"sans-serif",size:games.Tetravex._tileSize/4+"pt"});var _64=_5b.createText({x:((games.Tetravex._tileSize/4)*3)-(0.1*games.Tetravex._tileSize/4),y:(games.Tetravex._tileSize/2)+(0.5*games.Tetravex._tileSize/4),text:_58}).setStroke(_5d[_58]).setFill(_5d[_58]).setFont({family:"sans-serif",size:games.Tetravex._tileSize/4+"pt"});return _5b;};};var moveToNearestSquare=function(_65){var _66=games.Tetravex._findNearestX(_65.shape.matrix.dx)-_65.shape.matrix.dx+(games.Tetravex._props.padding);var _67=games.Tetravex._findNearestY(_65.shape.matrix.dy)-_65.shape.matrix.dy+(games.Tetravex._props.padding);_65.shape.applyLeftTransform({dx:_66,dy:_67});};games.Tetravex._findNearestY=function findNearestY(_68){if(_68<(games.Tetravex._boardY[0]+games.Tetravex._half_square)){return games.Tetravex._boardY[0];}for(var i=1;i<=games.Tetravex._boardSize-2;i++){var _69=games.Tetravex._boardY[i]-games.Tetravex._half_square;var _6a=games.Tetravex._boardY[i]+games.Tetravex._half_square;if(_6a>=_68&&_68>_69){return games.Tetravex._boardY[i];}}return games.Tetravex._boardY[games.Tetravex._boardSize-1];};games.Tetravex._findNearestX=function(_6b){if(_6b<=games.Tetravex._boardX[0]+games.Tetravex._half_square){return games.Tetravex._boardX[0];}for(var p=1;p<=(games.Tetravex._boardSize*2)-1;p++){var f=0;var _6c=games.Tetravex._boardX[p]+games.Tetravex._half_square;var _6d=games.Tetravex._boardX[p]-games.Tetravex._half_square;if(p==games.Tetravex._boardSize){_6c=games.Tetravex._boardX[p]+(games.Tetravex._props.padding);f=1;}if(p==games.Tetravex._boardSize+1){_6d=games.Tetravex._boardX[p]-games.Tetravex._half_square-games.Tetravex._tileSize-(games.Tetravex._props.padding);}if((_6c>=_6b)&&(_6b>_6d)){return games.Tetravex._boardX[p-f];}}return games.Tetravex._boardX[games.Tetravex._boardSize*2];};
