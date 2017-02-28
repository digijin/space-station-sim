
import actions from './index'
import state from 'Game/state'
import { Tasks } from 'Game/Data/Task'
export default function* worker(char: Character): Generator<*,*,*>{

	if(char.hasTaskType(Tasks.MAKE)) {
		yield * actions.make(char);
	}
	if(char.hasTaskType(Tasks.COOK)) {
		yield * actions.cook(char);
	}
	if(char.hasTaskType(Tasks.SERVEDRINK)) {
		yield * actions.serveDrink(char);
	}

	if(char.hasTaskType(Tasks.SERVEFOOD)) {
		yield * actions.serveFood(char);
	}
	
	char.setStatus('waiting for something to do')
	if(Math.random()< 0.01)
		yield *actions.wandertoAdjacentTile(char);
	return;
}