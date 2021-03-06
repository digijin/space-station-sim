
import { extend, keys, assign } from 'lodash';
import ReactTestUtils from 'react-addons-test-utils';
import sizzle from 'sizzle'
import Block from 'Game/Block'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let gap = 10

let mouseEvent = function(target, eventName, params){
  var event = document.createEvent('Event');
  extend(event, params);
  event.initEvent(eventName, true, true);
  if(!target){
	  debugger;
	  throw new Error('no target')
  }
  target.dispatchEvent(event); //was document
};

let clickSelector = function(selector:string):boolean{
	let elements = sizzle(selector);
	if(elements.length>0){
		ReactTestUtils.Simulate.click(elements[0])
		return true;
	}
	return false;
}
let canvas

function setCanvas(c){
	canvas = c;
}

function clickCheckbox(selector:string){
	let el = sizzle(selector)[0]
	ReactTestUtils.Simulate.change(el, {"target": el})
}

function canvasMouseMove(pos:{x:number, y:number}){
	mouseEvent(canvas, 'mousemove', {button:0, pageX:pos.x, pageY:pos.y});	
}

function canvasClickBlock(block:Block){
	// mouseEvent(canvas, 'mousemove', {button:0, pageX:block.center.x, pageY:block.center.y});	
	let point = block.center.screen;
	mouseEvent(canvas, 'mousedown', {button:0, pageX:point.x, pageY:point.y});	
	mouseEvent(canvas, 'mouseup', {button:0, pageX:point.x, pageY:point.y});
}
function canvasClick(pos:{x:number, y:number}, param){
	// debugger;
	// mouseEvent(canvas, 'mousemove', {button:0, pageX:block.center.x, pageY:block.center.y});	
	
	let params = assign({button:0, pageX:pos.x, pageY:pos.y}, param)
	
	mouseEvent(canvas, 'mousedown', params);	
	mouseEvent(canvas, 'mouseup', params);
}
function canvasMouseDown(pos:{x:number, y:number}, param){
	let params = assign({button:0, pageX:pos.x, pageY:pos.y}, param)
	mouseEvent(canvas, 'mousedown', params);
}
function canvasMouseUp(pos:{x:number, y:number}, param){
	let params = assign({button:0, pageX:pos.x, pageY:pos.y}, param)
	mouseEvent(canvas, 'mouseup', params);
}


//TODO REFACTOR
function* canvasDragRect(from:{x:number, y:number}, to:{x:number, y:number}):Generator<*,*,*>{
	let fromBlock = new Block(from)
	let toBlock = new Block(to)
	mouseEvent(canvas, 'mousemove', {button:0, pageX:fromBlock.center.screen.x, pageY:fromBlock.center.screen.y});	
	mouseEvent(canvas, 'mousedown', {button:0, pageX:fromBlock.center.screen.x, pageY:fromBlock.center.screen.y});	
	let diff = {
		x: toBlock.center.x-fromBlock.center.x, 
		y: toBlock.center.y-fromBlock.center.y
	}
	for(let i = 0; i<1; i+=0.2){ //percentages
		let pos = {
			x: fromBlock.center.x + (diff.x*i),
			y: fromBlock.center.y + (diff.y*i)
		}
		mouseEvent(canvas, 'mousemove', {button:0, pageX:pos.x, pageY:pos.y});	
		yield sleep(gap)
	}
	mouseEvent(canvas, 'mouseup', {button:0, pageX:toBlock.center.screen.x, pageY:toBlock.center.screen.y});
}

const mouse = {
	mouseEvent,
	clickSelector,
	clickCheckbox,
	canvasMouseMove,
	canvasClickBlock,
	canvasClick,
	canvasDragRect,
	setCanvas,
	canvasMouseDown,
	canvasMouseUp
}

export default mouse