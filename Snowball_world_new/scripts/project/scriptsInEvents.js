


const scriptsInEvents = {

	async Events_home_Event70_Act1(runtime, localVars)
	{
		// Get the current URL path
		const path = window.location.pathname;
		
		// Split the path into segments
		const segments = path.split('/');
		
		// Extract the last segment, which should be the user ID
		const userId = segments[segments.length - 1];
		
		// Assign the user ID to the global variable
		if (userId) {
		    runtime.globalVars.UserGlobalVar = userId;
		} else {
		    runtime.globalVars.UserGlobalVar = "Unknown";
		}
		
		// Optional: Log the user ID for debugging
		console.log("User ID:", runtime.globalVars.UserGlobalVar);
		
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

