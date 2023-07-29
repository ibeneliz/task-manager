const taskRoutes = require('express').Router();
const bodyParser = require('body-parser');
const taskData = require('../tasks.js');
const validator = require('../helpers/validator.js');
const path = require('path');
const fs = require('fs');
 
taskRoutes.use(bodyParser.json());

taskRoutes.get('/',(req,res) => {
    return res.status(200).json(taskData);
});

taskRoutes.get('/:id',(req,res) => {
    const airtribeTask = taskData;
    const taskId = req.params.id;
    const result = airtribeTask.filter(data => data.taskId === taskId);
    if(result.length == 0){
        return res.status(404).json({"message" : "Task that you requested does not exist."});
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
        const taskToUpdate = req.body;
        taskData.filter(task => {
            if(task.taskId == req.params.id){
                task.title = taskToUpdate.title;
                task.description = taskToUpdate.description;
                task.status = taskToUpdate.status;
            }
        });
        return res.status(200).json({"message" : "Task updated successfully!."});
    }catch{
        return res.status(500).json({"message" : "Updation has failed. Please try again later!"});
    }
});

taskRoutes.delete('/:id',(req,res) => {
    try{
        taskData.filter(task => {
            if(task.taskId == req.params.id){
                taskData.pop(task);
            }
        });
        return res.status(200).json({"message" : "Task deleted successfully!."});
    }catch{
        return res.status(500).json({"message" : "Deletion has failed. Please try again later!"});
    }
});

module.exports = taskRoutes;