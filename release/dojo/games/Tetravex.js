/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["games.Tetravex"]){dojo._hasResource["games.Tetravex"]=true;dojo.provide("games.Tetravex");dojo.require("dojox.gfx");dojo.require("dojox.gfx.move");games.Tetravex=function(){};games.Tetravex._props={suface_width:420,suface_height:200,tile_size:40,indent:20,padding:10};games.Tetravex._half_square=function(){return (this._props.tile_size/2)+(this._props.padding/2);};games.Tetravex._boardX=[games.Tetravex._props.indent,games.Tetravex._props.indent+games.Tetravex._props.tile_size+games.Tetravex._props.padding,games.Tetravex._props.indent+((games.Tetravex._props.tile_size+games.Tetravex._props.padding)*2),games.Tetravex._props.indent+((games.Tetravex._props.tile_size+games.Tetravex._props.padding)*3),games.Tetravex._props.indent+((games.Tetravex._props.tile_size+games.Tetravex._props.padding)*4),games.Tetravex._props.indent+((games.Tetravex._props.tile_size+games.Tetravex._props.padding)*5),games.Tetravex._props.indent+((games.Tetravex._props.tile_size+games.Tetravex._props.padding)*6),games.Tetravex._props.indent+((games.Tetravex._props.tile_size+games.Tetravex._props.padding)*7)];var y;games.Tetravex._boardY=[];for(y=0;y<4;y++){games.Tetravex._boardY[y]=games.Tetravex._boardX[y];}games.Tetravex.initialize=function(){var _1=dojo.byId("tetravex");var _2=dojox.gfx.createSurface(_1,this._props.suface_width,this._props.suface_height);_2.whenLoaded(function(){games.Tetravex._initSurface(_2);});return;};games.Tetravex._drawBoard=function(_3){var _4=_3.createPath().setStroke("black");var i;for(i=0;i<4;i++){var x=this._boardX[0];var y=this._boardY[i];var h=this._boardX[3];_4.moveTo(x,y);_4.hLineTo(h);_4.closePath();}for(i=0;i<4;i++){_4.moveTo(this._boardX[i],this._boardY[0]).vLineTo(this._boardY[3]).closePath();}for(i=0;i<4;i++){_4.moveTo(this._boardX[4],this._boardY[i]).hLineTo(this._boardX[7]).closePath();}for(i=4;i<8;i++){_4.moveTo(this._boardX[i],this._boardY[0]).vLineTo(this._boardY[3]).closePath();}};games.Tetravex._tile=[3];games.Tetravex._initSurface=function(_5){games.Tetravex._drawBoard(_5);dojo.extend(dojox.gfx.Moveable,{onMoving:function(_6,_7){if(_6.shape.matrix){if((_7.dx>0&&_6.shape.matrix.dx>(games.Tetravex._props.suface_width-games.Tetravex._props.tile_size-2))||(_7.dx<0&&_6.shape.matrix.dx<2)){_7.dx=0;}if((_7.dy<0&&_6.shape.matrix.dy<2)||(_7.dy>0&&_6.shape.matrix.dy>(games.Tetravex._props.suface_height-games.Tetravex._props.tile_size-2))){_7.dy=0;}}}});games.Tetravex._tile[0]=_8("green",games.Tetravex._boardX[4],games.Tetravex._boardY[0]);games.Tetravex._tile[1]=_8("red",games.Tetravex._boardX[5],games.Tetravex._boardY[0]);games.Tetravex._tile[2]=_8("yellow",games.Tetravex._boardX[6],games.Tetravex._boardY[0]);var t;for(t=0;t<games.Tetravex._tile.length;t++){moveMe=new dojox.gfx.Moveable(games.Tetravex._tile[t]);dojo.subscribe("/gfx/move/stop",this,function(_9){moveToNearestSquare(_9);});}function _8(_a,_b,_c){return _5.createRect({x:0,y:0,width:games.Tetravex._props.tile_size,height:games.Tetravex._props.tile_size,r:3}).setFill(_a).setStroke("blue").applyLeftTransform({dx:_b+(games.Tetravex._props.padding/2),dy:_c+(games.Tetravex._props.padding/2)});};};var moveToNearestSquare=function(_d){var _e=games.Tetravex._findNearestX(_d.shape.matrix.dx)-_d.shape.matrix.dx+(games.Tetravex._props.padding/2);var _f=games.Tetravex._findNearestY(_d.shape.matrix.dy)-_d.shape.matrix.dy+(games.Tetravex._props.padding/2);_d.shape.applyLeftTransform({dx:_e,dy:_f});};games.Tetravex._findNearestY=function findNearestY(_10){if(_10<(games.Tetravex._boardY[0]+games.Tetravex._half_square())){return games.Tetravex._boardY[0];}var i;for(i=1;i<=1;i++){var _11=games.Tetravex._boardY[i]-games.Tetravex._half_square();var _12=games.Tetravex._boardY[i]+games.Tetravex._half_square();if(_12>=_10&&_10>_11){return games.Tetravex._boardY[i];}}return games.Tetravex._boardY[2];};games.Tetravex._findNearestX=function(_13){if(_13<=games.Tetravex._boardX[0]+games.Tetravex._half_square()){return games.Tetravex._boardX[0];}var p;for(p=1;p<=5;p++){var f=0;var _14=games.Tetravex._boardX[p]+games.Tetravex._half_square();var _15=games.Tetravex._boardX[p]-games.Tetravex._half_square();if(p==3){_14=games.Tetravex._boardX[p]+(games.Tetravex._props.padding/2);f=1;}if(p==4){_15=games.Tetravex._boardX[p]-games.Tetravex._half_square()-games.Tetravex._props.tile_size-(games.Tetravex._props.padding/2);}if((_14>=_13)&&(_13>_15)){return games.Tetravex._boardX[p-f];}}return games.Tetravex._boardX[6];};}