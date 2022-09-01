define(['./lib/pandl'],

		
function(pandl) {
	
	getPandL = function(option){
		return pandl.get(option);
	};
	
    return {
    	getPandL: getPandL
    };
    
});

