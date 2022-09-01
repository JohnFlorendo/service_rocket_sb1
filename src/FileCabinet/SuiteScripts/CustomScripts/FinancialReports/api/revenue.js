define(['./lib/project'],

		
function(project) {
	
	getProject = function(option){
		return project.get(option);
	};

	getRevContriByProject = function (option) {
		return project.getByProject(option);
	}
	
    return {
    	getProject: getProject,
		getRevContriByProject: getRevContriByProject
    };
    
});

