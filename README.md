How to use this tool:
------------------------------------
Save the files in your system
Then open Command promt inside the project folder
Run these commands in the given seq: 
1.npm init -y
2.npm install express body-parser cors
npm start

That's it your Time toolbox is ready to use in:
http://localhost:5001/
-------------------------------------
How To setup in your project:
-------------------------------------
A)Server side setup:

1.Set the below configuration in .env:

TIME_TRAVEL_ENABLED=true
TIME_TOOLBOX_URL=http://localhost:5001/api/fake-time?key="Your_Secret_Key"

2.Create Server/Util/time.js file. You can find the time.js code inside project_setup/

3.Now import this time.js file inside server/src/index.js(Or whatever your server start point) and call the function:
// Time travel utility
import { enableTimeTravel } from "./utils/time.js"; 

// Enable time travel if configured
await enableTimeTravel();
console.log(new Date().toString());
console.log(Date.now().toString());
-------------------------------------
B)Client side setup:
-------------------------------------
1.Set the below configuration in .env:
EXPO_PUBLIC_TIME_TRAVEL_ENABLED=true
EXPO_PUBLIC_TIME_TOOLBOX_URL=http://your-local-ip:5001/api/fake-time?key="Your_Secret_Key"

2.Create Server/Util/time.ts file. You can find the time.ts code inside project_setup/

3.Now import this time.ts file inside client/app/index.ts(Or whatever your client code entry point):
import { enableTimeTravel, getCurrentTime } from "../utils/time";

  useEffect(() => {
    // 🕰️ Initialize fake time system
    (async () => {
      await enableTimeTravel();
      console.log("Client current time:", getCurrentTime().toString());
    })();
-----------------------------------------
C)Now you can set any date in the toolbox web UI and after restarting the server and client your backend and forntend will bypass the system date/time and will return your new test date.

Note: Everytime you set a new date you neet to restart your server and client to reflect the new 
date.
-------------------------------------------