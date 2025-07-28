ultrathink through the process
dont write code yet

My goal is to build an AI chat system. like manus.im, genspark.ai, etc..,
I want to the AI to speak and write mainly Arabic Iraqi accent in both speech and writing, and secondly, English. It depends on the user whether they use Arabic or English.
I want it to be able to take PDF files, image files, text files, and Excel files, etc.
and create PDF, Word, Excel, etc.
and the AI agent keep learning from the user, and when the user keep use it and it'll get better and better. and learn to answer to that specific user. like chatGPT when the user keep talk to it it'll create memory for that user
and it should be able to read and understand the content of the files and answer the user based on the content of the files. or what the user asks it to do.
and I want it to be able to have access to the web and search for information and can answer today's events, etc, real-time data
I want the user to have the option to add their job, profession, etc., which is optional. This allows the agent to respond more effectively to the user based on their job, profession, etc.
I want to train the agent with real Iraq data like a lawyer or teacher, etc.
So if the user adds his job, and tells him to do something related to his job, the agent should be able to answer it based on the training data, like the teacher can ask the agent to create an exam for subject x, etc, endless possibilities.
I want to train the agent with the user data, but don't save the user data; it's just for training the agent. All the data is just for training the agent, and only the user can see the data.
i want to make the agent access different data sources and answer the user based on the data sources.
i want to make the agent to be able to access the different sites and do the tasks the user asks it to do. like file form online, etc.
or the user gives it a username and password for a specific site, or web app, and lets it do the tasks the user asks it to do.
and a lot more other features

For now, I won't build all of it in one go and leave room for future improvement;
We'll first start with an MVP. 
like claude.ai, chatgpt.com, etc.
I want to focus on chat and voicing the Iraqi accent, 
and train the agent with real Iraqi data, and add data like pdfs etc.., for the AI to use as a database 
and it can create PDF or Word, e.g., I did train it on Iraqi data, so I can ask it to create a form containing Iraqi law about the subject I want, so it can create it and give it to the user as a PDF or Word file as the user requested, or any other subject.
it can also create a CV or resume.
and the user can see the history of the chat, etc.
i also want to make it paid with multiple plans, and a free user can only chat at a high rate limit.
start from 10$ per month
and free users can only use it with high rate limit and low quality model a very cheap model like gpt-3.5

and well go with api key from a provider, not host it myself for now to keep costs low cus i we host it well pay even if we dont use it, but with the api keys well pay as we use it

So what do I need, like what tech stack? language, library, Framework, etc.
I think Next.js with Python for web and react native for mobile, what do you think?
And what should we use, like pydantic or langgraph or any other, or use multiple ones, what is the best for my use case?
But for the MVP will go with just a web app
but i think when we build the web app we need to make sure to include the mobile app in the structure, so we take note when creating the app and leave room for future improvements because we'll make the app using react native. cus next js and react native both js so they has shared components or do we create each one separately? what do you think what is the best for my use case? what is your recommendation?
Do I use one AI or multiple AIs?
For now, we'll go with api key from a provider, not host it myself for now
What model should I use?

Search the web
I need your help with some best practices or things to consider when prompting this agent into existence.
And I want to make sure I cover important primary categories to consider in the development of the system.
GOAL-FORMAT-WARNINGS-EXAMPLES-CONTEXT
So think through your response

p.s. I'm from Iraq and don't have a payment method outside Iraq, so I can't use services don't support Iraqi payment methods


i had this conversation with Claude and made three chats with claude

https://claude.ai/share/56e5b7a6-091a-4625-bb43-bbcdf9955485

https://claude.ai/share/1101bead-850e-48e6-87eb-1c17985411d6

can you see the chats and read the artifacts in the chat?

and this the third one i cant share the Chat it is using advanced research can't be shared

this is the artifact

iraqi-ai-chat-development-plan.md




and i want to use these repos when i build the app


context engineering which is a good method and itll set new standards for building with AI

https://github.com/coleam00/context-engineering-intro

so we make PRP for each feature

and i found this too

https://github.com/bmadcode/BMAD-METHOD


what do you think? are they good do we use both of them? or both do the same thing with different approach



and i found this 
https://github.com/Doriandarko/make-it-heavy

do we need it in the app? what do you think? i want your recommendation? in the mvp or after the mvp? or don't need it at all?


first for iraqi accent openAI chatgpt is got for both voice and writing i test it and its good for mvp
second for documents ill provide them as i we talked in iraqi-ai-chat-development-plan.md line 541
did you read all i give you and did you check the repos? you didnt do it write
and for the moblie app we wont make it in the mvp but i said "but i think when we build the web app we need to make sure to include the mobile app in the structure, so we take note when creating the app and leave room for future improvements because we'll make the app using react native. cus next js and react native both js so they has shared components or do we create each one separately? what do you think what is the best for my use case? what is your recommendation?"
and i asked for your opinion



good create two md files one what is the app what its features what well have in the mvp and what post mvp you know the app story make it as detiald as possible and inclaude all the features, make it into section so we can make prp for each feature, what do you think? i think creating prp for each feature is better than one 
and the second one is the app plan




i added the context engineering repo in the app check them we need to make some changes to make it work with our app

check https://github.com/coleam00/context-engineering-intro/tree/main/use-cases/mcp-server
he made more comperhensive method but its for mcp-server

this is the path in the app
use-cases\mcp-server

this is the video from the context engineering repo
it explain the method

https://www.youtube.com/watch?v=Egeuql3Lrzg


first we need to make some changes to the CLAUDE.md file to make it work for our app
you can check the use-cases\mcp-server\CLAUDE.md for reference its specific for mcp-server

and check the other files in the use-cases\mcp-server folder to make sure we cover all


check throughly and dont skip any step

search the web
re check the claud.md file to make sure now its good for the app
in the orginal CLAUDE.md file there was "Project Awareness & Context", "Code Structure & Modularity", "Testing & Reliability", "Task Completion", "Documentation & Explainability", "AI Behavior Rules" sections, dont we need any of them?
are they not needed? i think they are good, what do you think?
and i dont think we should add Checklist to claud.md i am not sure about it, what do you think?


the CLAUDE.md is a global rules file for the app which is constent rules for the app,
i dont think we should add Checklist to it

search the web for more info 

i did some searching 

cloud.md is where we add constant rules that
will very rarely change.
will be true forever in my codebase and
things that will be added to my codebase
So whenever you add like a new
principle like a new naming standard or
maybe a new uh function that is really
really core to your codebase also you
that will stay the same for a long time.
Uh but also append new things that keep
coming in. You can also put cloud MD
files in specific folders that
references specific things in that folder
module or folder. That's also really
powerful.



this is the original claud.md file

### 🔄 Project Awareness & Context
- **Always read `PLANNING.md`** at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
- **Check `TASK.md`** before starting a new task. If the task isn’t listed, add it with a brief description and today's date.
- **Use consistent naming conventions, file structure, and architecture patterns** as described in `PLANNING.md`.
- **Use venv_linux** (the virtual environment) whenever executing Python commands, including for unit tests.

### 🧱 Code Structure & Modularity
- **Never create a file longer than 500 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.
  For agents this looks like:
    - `agent.py` - Main agent definition and execution logic 
    - `tools.py` - Tool functions used by the agent 
    - `prompts.py` - System prompts
- **Use clear, consistent imports** (prefer relative imports within packages).
- **Use clear, consistent imports** (prefer relative imports within packages).
- **Use python_dotenv and load_env()** for environment variables.

### 🧪 Testing & Reliability
- **Always create Pytest unit tests for new features** (functions, classes, routes, etc).
- **After updating any logic**, check whether existing unit tests need to be updated. If so, do it.
- **Tests should live in a `/tests` folder** mirroring the main app structure.
  - Include at least:
    - 1 test for expected use
    - 1 edge case
    - 1 failure case

### ✅ Task Completion
- **Mark completed tasks in `TASK.md`** immediately after finishing them.
- Add new sub-tasks or TODOs discovered during development to `TASK.md` under a “Discovered During Work” section.

### 📎 Style & Conventions
- **Use Python** as the primary language.
- **Follow PEP8**, use type hints, and format with `black`.
- **Use `pydantic` for data validation**.
- Use `FastAPI` for APIs and `SQLAlchemy` or `SQLModel` for ORM if applicable.
- Write **docstrings for every function** using the Google style:
  ```python
  def example():
      """
      Brief summary.

      Args:
          param1 (type): Description.

      Returns:
          type: Description.
      """
  ```

### 📚 Documentation & Explainability
- **Update `README.md`** when new features are added, dependencies change, or setup steps are modified.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `# Reason:` comment** explaining the why, not just the what.

### 🧠 AI Behavior Rules
- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified Python packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a task from `TASK.md`.


search the web for more info about the claude.md file best practices

check the community for info

and also check anthropic docs

https://docs.anthropic.com/en/docs/claude-code/memory

https://www.anthropic.com/engineering/claude-code-best-practices

use sub agents to search

and check thoroughly

so do we create multiple claud.md for each directory and one in the root directory?

lets go with your recommendation

what about the referenced claud.md file from the mcp-server folder is it good? we used it when we created our claude.md file its from the prp repo

but the claude.md file we had before you said it was bad we created it using "use-cases\mcp-server\CLAUDE.md" as reference

so now what?


'/mnt/c/Users/Itokoro/aqlix-ai/INITIAL.md' so now we move to creating the first prp which is the foundation of the app right? lest use this as reference '/mnt/c/Users/Itokoro/aqlix-ai/INITIAL_EXAMPLE.md'

what do you think?

the first prp is the foundation of the app right? so i don't think we need to add "**Iraqi-Specific Resources:**" as it is not needed for the foundation of the app right? and we talked about it before to use multiple prps so each one for one feature so we dont get messy results on step at a time agile development start slow and simple so we dont make the app complex and hard to maintain i want the app to be simple and easy to maintain so what is the first prp? what do you think?
second as for the examples i want you to search the community and add examples files and best practices in the examples folder
and for DOCUMENTATION i thinks we should tell it to use the mcp to search for latest documentation
and i think we need to create folder to keep all the initial prps that well use to create prp and add them into the prp folder


now its good but we need to move '/mnt/c/Users/Itokoro/aqlix-ai/PRPs/initial' the folder to the root and change the name cus well create more files and from them well create prps and well add them in the prp folder what do you think?

i found there are a lot of libraries for ai chat 
i thinks why we recreate the rail we someone already created the rocket
do we have any the plan im not sure check it
in the plan "development-plan.md"
do we use them or not? what do you think?
if we used multiple libraries and they effect the app i don't think we should use them


for the ui components well use shadcn/ui, i found these ui components libraries some for tailwind and shadcn/ui components and they have a lot of components or use just tailwind and shadcn/ui components?
and can we customize the components to make them look like the app? so if we use components from different libraries can we customize them to make them consistent with the app?
and they have AI components too

https://www.kibo-ui.com/components/announcement

https://skiper-ui.com/docs

https://blocks.mvp-subha.me/docs/introduction

https://www.shsfui.com/primitives/switches/day-night-switch

https://www.langui.dev/components

https://21st.dev/s/ai-chat


so do we use them or not? what do you think?
and if we used multiple ui components libraries and they effect the app i dont think we should use them



you are right, so after the foundation we will create the prps for each feature right? and then in these prps we will use the libraries we need for each feature right?


so before we start with the foundation initial to create the foundation prp, do we create all the initials so we know what prps well create or we create them as we go? what do you think?

ultrathink

i want to leave the payment system for now leave it for the last step cus i didn't figure it out yet which payment system to use, and as for the mobile app we will create it after the MVP as we talked about it before


before we start i want you to create file in the app root is the app story



Phase 1: MVP Core Initials (Create Now)
  initial/
  ├── 01_chat_foundation.md        ✅ (Done)
  ├── 02_document_processing.md    🔄 (Create now)
  ├── 03_voice_features.md         🔄 (Create now)
  ├── 04_cultural_framework.md     🔄 (Create now)
  └── 05_professional_domains.md   🔄 (Create now)

  Phase 2: Post-MVP Expansion (Later)
  initial/
  ├── 06_payment_system.md         💰 (After MVP validation)
  └── 07_mobile_app.md            📱 (After web MVP success)

check both of them and compare them


lets create 02_document_processing.md 
this is the plan "plan.md" and app features "app-features.md"
and check the 01_chat_foundation.md for reference and to know what we did for the chat foundation
and as always use mcps to search for the best practices and examples as we did before in 01_chat_foundation.md


good lets create 03_voice_features.md and do the same as before

good lets create 04_cultural_framework.md and do the same as before

good lets create 05_professional_domains.md and do the same as before

ultrathink
for the ui components we talked about, well just use them as reference right? so in which initial we start using them? i think we should leave them for the last step or what do you think?

so we need to update the initials and the examples files right?

so we dont need the ui components?

but i think use already made components and customize them is better than creating them from the start, or im wrong what do you think?


in the future after we finish the mvp if want to change the ui components we can we do it without issues? will it be easy?


check the prp we generated 

PRPs\01_chat_foundation.md

from

initial\01_chat_foundation.md

initial\02_document_processing.md

initial\03_voice_features.md

initial\04_cultural_framework.md

initial\05_professional_domains.md


now we generated all 5 prps '/mnt/c/Users/Itokoro/aqlix-ai/PRPs', what do you think if we split the 5 initial files to more files? so when we create more than 5 prps, instead of now a very large prp file i want to know your opinion

so we delete the 5 initial and prp files, and create new initial files and then from them create the prp right?


📋 Proposed New Structure

Phase 1: Foundation (6 files)

initial/01_monorepo_setup.md
initial/02_basic_chat.md
initial/03_rtl_arabic.md
initial/04_streaming_responses.md
initial/05_type_safety.md
initial/06_dev_environment.md

Phase 2: Document Processing (4 files)

initial/07_file_upload.md
initial/08_pdf_processing.md
initial/09_rag_integration.md
initial/10_iraqi_templates.md

Phase 3: Voice Features (4 files)

initial/11_voice_recording.md
initial/12_voice_streaming.md
initial/13_arabic_tts.md
initial/14_voice_ui.md

Phase 4: Cultural & Advanced (3 files)

initial/15_cultural_framework.md
initial/16_professional_domains.md
initial/17_deployment.md



for now we just prepare



check the claude.md file in the use-case  '/mnt/c/Users/Itokoro/aqlix-ai/use-cases/pydantic-ai/CLAUDE.md',  '/mnt/c/Users/Itokoro/aqlix-ai/use-cases/template-generator/CLAUDE.md'     and compare them with what we have '/mnt/c/Users/Itokoro/aqlix-ai/CLAUDE.md' and check anthropic https://www.anthropic.com/engineering/claude-code-best-practices for best practices

i just found you have new feature called sub-agents
https://docs.anthropic.com/en/docs/claude-code/sub-agents

should we use sub-agents or not? what do you think?


so how many sub-agents we need? what do you think? what each sub-agent will do? and how we will use them? and you said we increase them as we go right? so in which prp do we add new agents and how many agents?


create the agents and add them in folder in the root name sub-agents and create md file to know which agent to add in the .claude folder and time to add them



when i creating the sub-agents using slash command, i can create it using the wizard, but i need to give it a description and claude code will generate the agent
i want to compare the agent you created and the ones using the wizard, so i need you to give me a description of the agent you created so i can add it in the wizard to know, is the agents you created align with the best practices?


good but before i create the sub-agents i found that you have hooks
https://docs.anthropic.com/en/docs/claude-code/hooks

and settings
https://docs.anthropic.com/en/docs/claude-code/settings


i created the agent through the wizard, i just created the first agent from the WIZARD_AGENT_DESCRIPTION.md file you created
i want you to compare them


now i create the 5 agents using the wizard, do in depth comparison between them and the one you created

1- do i leave the agents in the .claude folder?
2- how do i use the agents? manually or automatically?



you update the files in the .claude folder, now we need to update the files in 



i have a question
why do we need to add the agent incrementally? isnt claude well use the agents automatically, as it see fit?
and what about the hooks are they fire all of them automatically, or does claude fire them as see fit?


i have a question
we dont have any debugging, etc agent or hook, dont we need them? or not what do you think?

i saw a video own youtub about claude code sub-agents, he said we can create project manager, a scrum manager, a developer, a UI expert, QA engineer and much more so claude use them to create the app 

as it said in anthropic official docs
https://docs.anthropic.com/en/docs/claude-code/sub-agents
read the docs thoroughly dont skip any part, abd tell me your opinion


if we go with your suggestion we dont add agents now until prp 7 then add them incrementally, but i think we create specialized agents and leave the hooks, is better for less complexity cus i think if we use the hooks with the agents itll break or im overthinking it?

dont we need debugging agent?

now before we start generating the prps, i want you to check the whole app to clean it, like we should remove the unused files and folders and clean the app, and check the .gitignore file its empty


after you done give me a list of what you cleaned and removed
i asked you to clean the app, why did you create files and folders? 

roll back to what the app has when i asked you to clean it

the initial folder has the initial files and it core folder to create the prps you deleted and the examples folder to create the prps you deleted a lot of its content, why did you do it? why you went crazy?
we used use-case as a reference and we said well use the generate-prp and generate-pydantic-ai-prp to create the prps and we create a md file to know how to use each initial with 



when we first created the 17 initial you said we should take some of the examples from the pydantic-ai examples folder cus its align good with our app
you told me to use `/generate-prp` or `/generate-pydantic-ai-prp` based on feature type and then the execute command `/execute-pydantic-ai-prp` or `/execute-prp`
and create a md file to know how to use each initial with what when we create the prp and execute it
and update the DOCUMENTATION section for the other initial files


in the documentation section you said Next.js MCP Server but i dont have such mcp,
and for the payment as we agreed well leave it for now and create it after we finish all the mvp feature first itll be the last one
update all the initials




i remember you said before the first prp use generate-prp, i dont remember the rest

the initial isnt good
check all the initials in the use case as a reference to know what im talking about

and in the each initial in the examples section dont just add the whole folder, add files in the folder check the initial reference to understand

before we continue i have a question
do we break them into smaller initials?
before we continue did you create them based on the initial reference?

i mean when creating the initial files, did you create them based on the initial reference from the repo author of this new framework? or not?

the last one he created is 

you said
  And I should use:
  - INITIAL_PYDANTIC_AI.md structure for PydanticAI-related features (like 02_basic_chat.md)
  - INITIAL.md structure for general features (like 01_monorepo_setup.md, 03_rtl_arabic.md)

so we need to create them?

dont do anything
i have two questions
1- in the DOCUMENTATION section shouldn't we use mcp server for better performance and result instead of just add the doc url? the repo creator said to use mcp server not just add the doc url
2- in the initials we didn't use the examples folder to reference them use them for reference when creating the PRPs, i checked the INITIAL_PYDANTIC_AI.md it didn't add links to the examples folder, but it has examples files in the examples folder, why is that?


https://github.com/disler/claude-code-hooks-mastery

https://docs.anthropic.com/en/docs/claude-code/sub-agents

https://docs.anthropic.com/en/docs/claude-code/settings#tools-available-to-claude


https://github.com/disler/claude-code-hooks-mastery/blob/main/.claude/agents/work-completion-summary.md
https://github.com/disler/claude-code-hooks-mastery/blob/main/.claude/agents/meta-agent.md

https://github.com/ruvnet/claude-flow












































initial\01_monorepo_setup.md

initial\02_basic_chat.md

initial\03_rtl_arabic.md

initial\04_streaming_responses.md

initial\05_type_safety.md

initial\06_dev_environment.md

initial\07_file_upload.md

initial\08_pdf_processing.md

initial\09_rag_integration.md

initial\10_iraqi_templates.md

initial\11_voice_recording.md

initial\12_voice_streaming.md

initial\13_arabic_tts.md

initial\14_voice_ui.md

initial\15_cultural_framework.md

initial\16_professional_domains.md

initial\17_deployment.md

































and as for the payment well leave it for now and create it after we finish all the mvp feature first

but before you create anything check these "PRPs" for reference we create them as the mvp plan for the app using new frame work called PRPs (Product Requirements Prompts) and its core is Context Engineering
from this repo "https://github.com/coleam00/context-engineering-intro" and "https://www.philschmid.de/context-engineering" and it has more to make the app iraqi with its writing and voice

we created the PRPs from the "initial" directory and used "examples" when creating the RPPs
























