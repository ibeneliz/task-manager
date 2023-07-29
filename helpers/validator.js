class validator{
    static validatorTaskInfo(taskDetails, taskData){
        if(taskDetails.hasOwnProperty("taskId") &&
            taskDetails.hasOwnProperty("title") &&
            taskDetails.hasOwnProperty("description") &&
            taskDetails.hasOwnProperty("status") && 
            this.validateUniqueTaskId(taskDetails, taskData)){
                let errorMsg = "";
                if(taskDetails.title === '' || taskDetails.title === null){
                    errorMsg += "Title cannot be empty. ";
                } 
                if(taskDetails.description === '' || taskDetails.description === null){
                    errorMsg += "Description cannot be empty. ";
                } 
                if(errorMsg.length !== 0){
                    return {
                        "status": false,
                        "message": errorMsg
                      };
                } else {
                    return {
                        "status": true,
                        "message": "Task has been added."
                    };
                }
        }
        if(!this.validateUniqueTaskId(taskDetails, taskData)){
            return {
              "status": false,
              "message": "Task Id has to be unique."
            };
        }
        return {
            "status": false,
            "message": "Task Info is malformed. Please provide all the properties."
          }
    }

    static validateUniqueTaskId(taskDetails, taskData) {
        let valueFound = taskData.some(el => el.taskId === taskDetails.taskId);
        if(valueFound) return false;
        return true;
      }
}

module.exports = validator;
