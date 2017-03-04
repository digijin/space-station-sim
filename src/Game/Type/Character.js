// @flow

import type Point from 'Game/Point';
import {defaults, keys} from 'lodash';
import uniqid from 'Util/uniqid';
import namegen from 'Util/namegen'


import type {CharacterType} from 'Game/Data/Character'
import type {Skill} from 'Game/Data/Character/Skill'
import type Obj from 'Game/Type/Object'
import Skills from 'Game/Data/Character/Skill'

import state from 'Game/state'

import CharacterData from 'Game/Data/Character'

import type Task from 'Game/Type/Task'
import type Item from 'Game/Type/Item'

import type {TaskType} from 'Game/Data/Task'

import config from 'Game/config'

import type Block from 'Game/Block'

import type {RecipeType} from 'Game/Data/Recipe'

import RecipeData from 'Game/Data/Recipe';

export default class Character{
	id: string;
	type:CharacterType;
	position: Point;
	firstname: string;
	lastname: string;
	action: ?Generator<*,*,*>;
	skills: {[id:Skill]:number}
	salary: number;
	status: string;
	path: Array<Block>; //set by actions for use by renderer
	constructor(params:{type:CharacterType, position:Point}){
		defaults(this, params);
		if(!this.id) this.id = uniqid();
		if(!this.item) this.item = []
		if(!this.firstname) defaults(this, namegen())
		this.randomiseSkills()
		if(!this.salary) this.calculateSalary();
		this.status = "initialising"

		this.taskTypes = []
		this.path = []

		this.recipes = {}
		RecipeData.each((key, val) => {
			this.recipes[key] = {level:0, experience:0}
			
		})

		//HACK dummy Data
		// this.assignTaskType('PREP')
		// this.assignTaskType('COOK')
		// this.assignTaskType('SERVEFOOD')
		// this.assignTaskType('SERVEDRINK')
	}
	setPath(path:Array<Block>){
		this.path = path;
	}
	getPath():Array<Block> {
		return this.path;
	}
	getData(){
		return CharacterData.get(this.type)
	}
	calculateSalary(){
		this.salary = 500 + Math.floor(Math.random()*500)
	}
	randomiseSkills(){
		this.skills = {}
		keys(Skills).forEach((s:Skill) => {
			this.skills[s] = Math.floor(Math.random()*config.character.skill.max);
		})
	}
	recipes: {[id:RecipeType]: {level:number, experience: number}}
	getRecipe(recipeType:RecipeType): {level:number, experience: number}{
		return this.recipes[recipeType];
	}
	hasRecipe(recipeType:RecipeType):boolean{
		return (this.recipes[recipeType].level > 0)
	}
	addRecipe(recipeType:RecipeType){
		//todo: add checking
		this.recipes[recipeType].level = 1;
	}
	addRecipeExperience(recipeType:RecipeType, exp:number){
		let rec = this.recipes[recipeType]
		rec.experience += exp;

		let recipeLevel = config.character.recipe.level[rec.level]
		if(recipeLevel){

			let reqExp = recipeLevel.experience
			
			if(rec.experience >= reqExp){
				//level up;
				rec.level ++;
				rec.experience -= reqExp;
			}
		}
	}


	object:?Obj; //used for giving directions
	setObject(obj:Obj){
		this.object = obj.getKey();

	}
	clearObject(){
		this.object = null;
	}
	getObject():?Obj{
		if(this.object)
			return state.object.getObject(this.object)

			// return this.object;
	}

	// ITEM
	item: Array<Item>;
	addItem(item:Item){
		this.item.push(item)
	}
	hasItem(item:Item):boolean{
		return this.item.indexOf(item) >-1
	}
	removeItem(item:Item){
		this.item.splice(this.item.indexOf(item), 1);
	}
	getItems():Array<Item>{
		return this.item
	}

	setStatus(status:string){
		this.status = status;
	}


	task: ?string;
	setTask(task:Task){
		this.task = task.id;
	}
	removeTask(){
		this.task = null;
	}
	getTask():?Task{
		if(this.task)
			return state.task.getTask(this.task);
	}

	taskTypes: Array<TaskType>;
	assignTaskType(type:TaskType){
		this.taskTypes.push(type);
	}
	unassignTaskType(type:TaskType){
		let id = this.taskTypes.indexOf(type);
		if(id > -1)
			this.taskTypes.splice(id, 1);
	}
	hasTaskType(type:TaskType):boolean{
		return this.taskTypes.indexOf(type) > -1
	}
	toggleTaskType(type:TaskType){
		if(this.hasTaskType(type)){
			this.unassignTaskType(type);
		}else{
			this.assignTaskType(type);
		}
	}


	toString():string{
		return this.firstname + ' ' + this.lastname
	}

}
