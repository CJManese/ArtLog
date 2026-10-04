# AI usage

This project was built with AI assistance. This file is the record of it.

## 1. How I used AI

### 2026-09-22 - Making the ArtLog project Structure

- **Tool:**
  ChatGPT
- **What I asked for:**
  I asked ChatGPT to look at my mockup and explain what each part of the project would be used for
- **What it gave back:**
  It explained how React, API, databases, and config files works. It also helped me identify which files can be safely edited or removed (which are the demo codes)
- **What I kept, what I changed, and why:**
  I used the explanation to understand how to work with the existing demo codes before making changes. I did not keep all of the suggested changes because I need to make the structure fit my mockup.


### 2026-09-23 - Building the Front End

- **Tool:**
  ChatGPT
- **What I asked for:**
  I asked ChatGPT to help me build the React parts for my ArtLog based on the mockup
- **What it gave back:**
  It provided React component code and explained the parts such as the Dashboard, Commission List, Client List, and etc.
- **What I kept, what I changed, and why:**
  I kept the part of the Reach Structure and code that matched my app. I changed some parts that did not match my mockup. I specifically made sure that the Dashboard represented my comm board instead of adding unrelated features.


### 2026-09-24 - Creating the database

- **Tool:**
  ChatGPT
- **What I asked for:**
  I asked to help me create the database structure for Artlog
- **What it gave back:**
  It helped me create the SQL for clients, commissions, and refererences.
- **What I kept, what I changed, and why:**
  I kept the structure because it matched my ArtLog very well, but I removed multiple features that didn't fit my mockup because it would've delayed my project more for such a minimal addition.


### 2026-09-25 - API 1

- **Tool:**
  ChatGPT
- **What I asked for:**
  I asked to help me understand and implement the API
- **What it gave back:**
  It gave me explanations and helped code the API more
- **What I kept, what I changed, and why:**
  I used the generated code as a structure and fixed the problems for later.


  ### 2026-09-26 - API 2

- **Tool:**
  ChatGPT
- **What I asked for:**
  I asked to connect my React to the backend API
- **What it gave back:**
  It provided functions for retrieving comms nad references and showed how the compontents could import and use them.
- **What I kept, what I changed, and why:**
  I kept the API approach because it separated API requests from the UI components. I changed the import paths and file locations to match my actual ArtLog project structure.


    ### 2026-09-27 - Debbugging the Vite

- **Tool:**
  ChatGPT
- **What I asked for:**
  I asked to help me find the errors with my Vite
- **What it gave back:**
  It helped me identify and fix the errors
- **What I kept, what I changed, and why:**
  I followed the debugging process and fixed the errors


  ### 2026-10-03 - Making sure everything works

- **Tool:**
  ChatGPT
- **What I asked for:**
 I asked to finish the main functions of the project
- **What it gave back:**
 It finally let my database connect with my project, giving functions to my sidebars and project
- **What I kept, what I changed, and why:**
  I mostly kept everything, but I had to remove multiple random features the AI added, such as subtitles and two edit buttons on the dashboard

  ### 2026-10-04 - Making sure everything looks good

- **Tool:**
  ChatGPT and Claude
- **What I asked for:**
 I asked both AI to clean up the code and make the project look cleaner and look like the mockup
- **What it gave back:**
  It gave multiple ways to make the code still functional and look better, while closely following the mockup 
- **What I kept, what I changed, and why:**
  I kept what is close to the mockup, and changed those that looked terrible, or didn't fit the mockup. Overall, I mostly changed the titles and css.

## 2. Where the AI got it wrong

  1. Incorrect API debugging
     I had to ask the AI why my Render wasn't deploying, and it kept giving me a code to fix my API. The "fix" was just the same version as my current code, so I thought the problem shouldn't be because of the code. A few Google search gave me the answer that it was just me adding a port environment variable on my Render.

  2. Multiple additional features that weren't asked on my original instructions
     The AI had added multiple features that were not part of my mockup or instructions. I just let them stay in my code for a while until it was time to remove them. From the features I remember, it added subtitles, double edit buttons, client email, commission log starting date (when the log was created, which is tedious and not useful for comms.)

  3. UI did not match my mockup
     The AI created it's own style and a topbar instead of a sidebar. I let it finish the functions first before editing the style.css and some of the structures. I also had to remove some weird additions by the AI, and add some additions that the AI missed. Some of those additions include the logo, the icon, and colors.

## Who wrote what 

  The AI coded most of the frameworks and functions and guided me on making the database with Render and Neon. I did work on the database structure and added/remove some features on both the frontend and backend. I also worked on adjusting the styles and looks of the app. I also worked on both Client List and Commission Logs, correcting some of the codes, the database structures, and their titles. For the SQL, while the AI gave me a tutorial on starting it, I still had to adjust some of the misinputs that the AI couldn't have seen, such as the port as environment variable. 
