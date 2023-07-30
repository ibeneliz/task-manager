const taskRoutes = require('express').Router();
const bodyParser = require('body-parser');
let taskData = require('../tasks.js');
const validator = require('../helpers/validator.js');
const path = require('path');
const fs = require('fs');
 
taskRoutes.use(bodyParser.json());

taskRoutes.get('/',(req,res) => {
    const creationDate = req.query.order || "desc";
    let sortedArray = [];
    let filteredData = [];
    if(req.query.status !== undefined){
        filteredData = taskData.filter(data =>String(data.status).toLowerCase() === req.query.status);
    }else{
        filteredData = taskData;
    }
    if(req.query.sort !== undefined){
        const updatedTaskData = filteredData.map(obj => {
            return {...obj, creationDate: new Date(obj.creationDate)};
        });
        if(creationDate === "asc"){
            sortedArray = updatedTaskData.sort(
                (objA, objB) => Number(objA.creationDate) - Number(objB.creationDate),
            );
        }else{
            sortedArray = updatedTaskData.sort(
                (objA, objB) => Number(objB.creationDate) - Number(objA.creationDate),
            );
        }   
    }else{
        sortedArray = filteredData !== [] ? filteredData : taskData;
    }
    return res.status(200).json(sortedArray);
});

taskRoutes.get('/:id',(req,res) => {
    const taskId = req.params.id;
    if(!validator.isTaskFound(taskId,taskData)){
        return res.status(404).json({"message" : "Task that you requested does not exist."});
    }
    const result = taskData.filter(data => data.taskId === taskId);
    return res.status(200).json(result);
});

taskRoutes.get('/priority/:level',(req,res) => {
    const airtribeTask = taskData;
    const level = req.params.level;
    const result = airtribeTask.filter(data => data.priorityLevel === level);
    if(result.length == 0){
        return res.status(404).json({"message" : "Priority level that you requested does not exist."});
    }
    return res.status(200).json(result);
});

taskRoutes.post('/',(req,res) => {
    try{
        const taskDetails = req.body;
        const isValid = validator.validatorTaskInfo(taskDetails, taskData);
        if(isValid.status){
            taskData.push(taskDetails);
            return res.status(200).json(isValid);
        }else{
            return res.status(400).json(isValid);
        }
    }catch(e){
        return res.status(500).json({"message" : "Task creation failed. Please try again later!"});
    }
});

taskRoutes.put('/:id',(req,res) => {
    try{
        const taskId = req.params.id;
        if(!validator.isTaskFound(taskId,taskData)){
            return res.status(404).json({"message" : "Task that you requested does not exist."});
        }
        const taskToUpdate = req.body;
        taskData.filter(task => {
            if(task.taskId == taskId){
                task.title = taskToUpdate.title !== undefined ? taskToUpdate.title : task.title;
                task.description = taskToUpdate.description !== undefined ? taskToUpdate.taskToUpdate.description : task.description;
                task.creationDate = taskToUpdate.creationDate !== undefined ? taskToUpdate.creationDate : task.creationDate;
                task.priorityLevel = taskToUpdate.priorityLevel !== undefined ? taskToUpdate.priorityLevel : task.priorityLevel;
                task.status = taskToUpdate.status !== undefined ? taskToUpdate.status : task.status;
            }
        });
        return res.status(200).json({"message" : "Task updated successfully!."});
    }catch{
        return res.status(500).json({"message" : "Updation has failed. Please try again later!"});
    }
});

taskRoutes.delete('/:id',(req,res) => {
    try{
        const taskId = req.params.id;
        if(!validator.isTaskFound(taskId,taskData)){
            return res.status(404).json({"message" : "Task that you requested does not exist."});
        }
        const updatedData = taskData.filter(data => data.taskId != taskId);
        taskData = updatedData;
        return res.status(200).json({"message" : "Task deleted successfully!."});
    }catch{
        return res.status(500).json({"message" : "Deletion has failed. Please try again later!"});
    }
});

module.exports = taskRoutes;