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
i created the initials and then created the prps from them 
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

and i created the agents, and have the claude.md file
check the official docs
https://docs.anthropic.com/en/docs/claude-code/sub-agents

https://docs.anthropic.com/en/docs/claude-code/memory

https://www.anthropic.com/engineering/claude-code-best-practices

check the official docs

what i want is to make some changes to agents and claude.md file

i want to add to claude.md file to make it know its the primary agent and he should use the sub-agents to do the work as each sub-agent has its own role and responsibility and if we dont have sub-agents for a specific task then he can do it himself other wise he should use the sub-agents to do the work, i added it to claude.md file in line 5 check it but i dont think its good check the official docs i provided
and check the agents i found a repo that use the agents in a different way i took a look at it and i think its better i add some to here '/mnt/c/Users/Itokoro/aqlix-ai/agents' we have one agent ui/ux agent but he made it into six agents check it 


https://docs.anthropic.com/en/docs/claude-code/settings#tools-available-to-claude


https://github.com/disler/claude-code-hooks-mastery/blob/main/.claude/agents/work-completion-summary.md
https://github.com/disler/claude-code-hooks-mastery/blob/main/.claude/agents/meta-agent.md

https://github.com/ruvnet/claude-flow



now i generated all the prps check them, but before we implement them i have a several questions

the payment well leave it for now and create it after we finish all the mvp feature first after we finish all the PRPs we will create the payment prp right? we dont have anything related to payment yet?
well use the api key for the AI from openai, my concern is if i have tens of users using the app, at the same time, will it be able to handle it?

when we execute one prp, i we need agent to check the app to know what to do, do we need continue with the next prp or the app need fix etc and it what do you think? check the current agents to know do we have it or need it?

you'll do most of the work, what i want to know is the app on windows and you are on wsl ubuntu, do i move the app to wsl or keep it on windows?

you created the agent and its good, but i want also to use the agent wizard to create the agent to compare them so we know which one to use, give me the description i need to give to the wizard to create the agent, add it here '/mnt/c/Users/Itokoro/aqlix-ai/WIZARD_AGENT_DESCRIPTIONS.md'


do i execute the prps in the same order as the initial files?
I want to start implementing PRPs. What's the optimal order?

before we implement any prp i want know, now well use api key to power the app, but in the future i want to host the ai on my own server, what will happen to the app?

i have another question, after we build the frontend and after the mvp if i want to change the whole frontend ui/ux, is it easy to do it? you know after i get the feedback from the users



🚀 Recommended Implementation Sequence

  PHASE 1 - FOUNDATION (Start Here)

  1. dev_environment_setup.md - Development environment
  2. monorepo_setup.md - Project structure
  3. type_safety_iraqi_ai.md - Type system
  4. arabic_rtl_text_handling.md - Arabic RTL support

  PHASE 2 - CORE AI SYSTEM

  5. iraqi_cultural_framework_agent.md - Cultural validation
  6. iraqi_basic_chat_agent.md - Basic chat AI
  7. streaming-responses-iraqi-ai.md - Real-time responses

  PHASE 3 - PROFESSIONAL FEATURES

  8. iraqi-professional-domains-agent.md - Professional context
  9. iraqi_rag_integration_agent.md - Knowledge retrieval
  10. iraqi-template-generation-agent.md - Document templates

  PHASE 4 & 5 - PARALLEL DEVELOPMENT

  Document Processing:
  11. secure_file_upload_iraqi_ai.md
  12. pdf_processing_agent.md

  Voice Features:
  13. voice_recording_iraqi_ai.md
  14. voice_streaming_iraqi_ai.md
  15. voice-ui-components-iraqi-ai.md
  16. arabic-tts-integration.md

  PHASE 6 - PRODUCTION

  17. scalability-performance-management.md
  18. production-deployment.md

  🎯 Key Benefits of This Order

  - Foundation-first: Infrastructure established before features
  - Iraqi-centric: Cultural framework and Arabic RTL support early
  - Incremental validation: Each phase builds on previous success
  - Risk minimization: Complex features isolated from core functionality
  - Parallel opportunities: Phases 4 & 5 can run simultaneously

Recommended start: Begin with Phase 1 (dev_environment_setup.md) to establish your development foundation.


what to do next implement the next prp or we need to do something else before we implement the next prp?


@agent-iraqi-prp-execution-orchestrator what to do next implement the next prp or we need to do something else before we implement the next prp?




can you generate commit message and push to github?


duplicate agents or am i wrong?


ill make this app using the new context engineering which is a good method and itll set new standards for building with AI,
the repo https://github.com/coleam00/context-engineering-intro
i created the initials and then created the prps from them,
and i created the agents, and have the claude.md file

what i want is to make some changes to agents

check the agents i found a repo that use the agents in a different way i took a look at it and i think its better i add some to here '/mnt/c/Users/Itokoro/aqlix-ai/lab' check them throughly, they are good espeically ux-researcher.md and whimsy-injector.md
but we cant use them like this we can use them as a reference the idea is good
we have one agent ui/ux agent but he made it into six agents check it
the agents i created using the claude code wizard

check the official docs
https://docs.anthropic.com/en/docs/claude-code/sub-agents

and we need a agents workflow
Chaining subagents
this is an example of agent to agent communication fron anthropic official docs
> First use the code-analyzer subagent to find performance issues, then use the optimizer subagent to fix them
check the official docs for more info

i generated the agents using these prompt '/mnt/c/Users/Itokoro/Documents/projects/aqlix-ai/WIZARD_AGENT_DESCRIPTIONS.md' and there's a problem in this. The context each agent generates or requires is often too large and cannot be passed on. Context must be recorded somewhere ideally in MD files
check every thing throughly dont skip any thing
and give me your opinion?


'/mnt/c/Users/Itokoro/Documents/projects/aqlix-ai/CLAUDE.md',

i want to add to claude.md file to make it know its the primary agent and he should use the sub-agents to do the work as each sub-agent has its own role and responsibility and if we dont have sub-agents for a specific task then he can do it himself other wise he should use the sub-agents to do the work, i added it to claude.md file in line 5 check it and not just line five the whole section "# Rules Must Follow",
i dont think its good check the official docs i provided,
https://docs.anthropic.com/en/docs/claude-code/memory
https://www.anthropic.com/engineering/claude-code-best-practices

is CLAUDE.md file is it aligned with the best practices from anthropic? check the official docs thoroughly for more info

https://docs.anthropic.com/en/docs/claude-code/memory
https://www.anthropic.com/engineering/claude-code-best-practices



after we finish one prp i need to know if we need to do something else before we implement the next prp or we can implement the next prp?
cus when i implement a prp i do slash command like this {/execute-prp PRPs/prp-name.md} so do i ask the primary agent to run the orchestrator to tell me what we do next?


Use iraqi-prp-execution-orchestrator to assess system health and determine next PRP sequence


in the previous claude.md we had this section

## Project Structure

do we need it or not?


before we implement any prp i want to know did we have these points in the prps or not? did we include them or exclude them or didnt mention them
can the user see their chat history and can use it to continue the conversation?
and the AI agent keep learning from the user, and when the user keep use it and it'll get better and better. and learn to answer to that specific user. like chatGPT when the user keep talk to it it'll create memory for that user check the web to know what i mean
I want the user to have the option to add their job, profession, and how the agent should respond to the user etc., which is optional. This allows the agent to respond more effectively to the user based on their job, profession, etc. how the user want the agent to respond to the user like chatGPT check the web to know what i mean

check the prps thoroughly to know if we have these points or not


check this repo
https://github.com/open-webui/open-webui

the repo structure 

can we use it for our app use it as a reference or use some of its components? why reinvent the wheel when someone already invented the rocket
what do you think?

i also found this repo
https://github.com/agent0ai/agent-zero

the repo structure


i still didnt start with the app yet, i just laid the prp which well use to create the app, if i clone the repo and use it, i want know anything about it, and it doesnt have what i want to create which is
check the app plan

i think if i download both repos and use them as al ready made templates and components take what i need from them and use it in our app is the best way to create the app
what do you think? i want your recommendation

read throughly


i add both of them in the app root, where do i add them? so we can use them as we talked to extract what we need from them and use it in our app

do we we move them ot a new folder or we keep them in the root? i think we need to move them to a new folder or to examples folder


first do we need this references\extraction-plan-old.md file?

secound why did added the extracted files in the app we should add them to the examples folder or another folder and add them as we need or use them as a reference rigt?

we shouldnt create anything now well create them as we progress when we start creating the app using the prps so we should remove 


just to let you know the current prps isnt the app final version, they are the mvp

the final app versino you can find it in the app-plan


now what did you extarct from both repos and added them in the examples folder and what we need more to extract from them?


before we continue i found these repos check them thoroughly to know can we take something from them?

https://github.com/langflow-ai/langflow
https://github.com/MervinPraison/PraisonAI
https://github.com/browser-use/browser-use
https://github.com/Doriandarko/make-it-heavy
https://github.com/block/goose
https://github.com/kortix-ai/suna
https://github.com/bytedance/deer-flow
https://github.com/Fosowl/agenticSeek
https://github.com/stackblitz-labs/bolt.diy
https://github.com/microsoft/autogen
https://github.com/Skyvern-AI/skyvern
https://github.com/NirDiamant/GenAI_Agents
https://github.com/assafelovic/gpt-researcher

these are older repos

https://github.com/e2b-dev/fragments
https://github.com/browser-use/web-ui
https://github.com/srcbookdev/srcbook


check the one at a time create a todo list, and lets check the first one


do you want me to extract the repos structure and save them so you can check the repo easily?


i added the structure of the repos in the repo-structure folder
do you want me to add the repo too?




did you realy check all the repos to know can we take something from them? not just look at them surfecly, check them thoroughly use the structure file to know what where to look

did you check all of them for real?

so now we know what to take from all of them? first we need plan to know what to take from each repo including the previous ones agent-zero and open-webui, and any repe we dont need we should remove it


so now from the 18 repo we know what to take from them and add it in the examples folder right? not just for the mvp but for the final app right?

i need you to re check agent-zero and open-webui and check what we extracted from them and add it in the examples folder to make sure do we need them or take something from them and what we took from them well take it from another repo cus its better

now we have a comprehensive plan to know what to take from each repo including the previous ones agent-zero and open-webui?
but before we take any thing from them we need to clean the examples folder so we dont have duplicate files or not needed files cus we found a better one
so clean the examples folder



so now we can start the extraction process and add to the examples folder right? we have the plan to know what to do and we cleaned the examples folder


did you extract everything we need from the repos? 
so i can remove all of them

just to remind you my app vision
is to build an AI chat system. like manus.im, genspark.ai, etc..,
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


before we remove anything i found this repo can we take anything from it?
or it has a better components than the ones we extracted from the other repos?
check it thoroughly

https://github.com/dyad-sh/dyad

i have it here for you

so we dont need anything new but we need to replace the ones we have with the new better components right?
lets create a plan to do it


first lets extract all we need them remove all the repos, we dont need them anymore we have all we need from them in the examples folder, after word we can start with our app, i think this is better, what do you think?

ask me before you start removing the repos



i want you to do a thorough check to know did we extract everything we need from the repos including the new one we found and added it to the examples folder


do we need repo-structure folder or not? is there anything in it we need?

what about references folder?


check our tech stack are they good for our use case? or we need to make some changes to them?

organize the app


now before we start with our app i want you to check the current sub-agents do we need to make some changes to them?

also i found these two repos they are for claude code, i think they work in smillar way to claude code sub-agents can we get something useful from them?

https://github.com/bmadcode/BMAD-METHOD

https://github.com/ruvnet/claude-flow

check anthropic official docs for sub-agents

https://docs.anthropic.com/en/docs/claude-code/sub-agents

check anthropic official docs for best practices
https://www.anthropic.com/engineering/claude-code-best-practices

i have them here locally for you if you want to check them instead of using the url



what anthropic official docs for sub-agents says?

and dont we have a context manager for sub-agents here


so the sub-agents we have are good, and they know how to use the context manager? check them



check CLAUDE.md file is it good does it align with the best practices from anthropic? and is it good for our app?

this is the memory section CLAUDE.md file which 
https://docs.anthropic.com/en/docs/claude-code/memory

https://www.anthropic.com/engineering/claude-code-best-practices

i have them here locally for you if you want to check them instead of using the url




do we need hooks? of for code formatting and one for code linting

https://docs.anthropic.com/en/docs/claude-code/settings

https://docs.anthropic.com/en/docs/claude-code/hooks


i think what you did is wrong we need one code formatting for python and one formatting for JavaScript cus there arent one for all languages or am i wrong? what languages are we going to use for our app?


we have sub-agents and hooks are they overlapping each other?



i have another question
i found this website check it
https://www.better-t-stack.dev/new



before anything else check the app plan to know what tech stack we are using

so what should we do?

we still didnt start with the app 

t-stack has sections

Web Frontend
Native Frontend
Backend
Runtime
Api
Database
Orm
Db Setup
Web Deploy
Auth
Package Manager
Addons


what is your recommendation for our app what is the best for our use case?
for ORM and Package Manager
what do you think?
i think for package manager bun cus we can use it with npm its not replacement for npm, its Compatible with npm or im worng, i want your opinion
dont take my word for granted check the web for more info



lets go with bun and Drizzle ORM and SQLAlchemy 2.0

but i want you to check the whole tech stack with all well use for our app is there anything isn't compatible with each other so we dont have any compatibility issues


arent we gonna drop shadcn/ui cus well use the components from the examples folder or use them as a refernce to create our own components or customize them for our app?

so now we need to update the plan and claude.md file with the new tech stack

now we need to update the sub-agents also while we are at it i want you to check also check anthropic docs for sub-agents some sub-agents have some code snippets is that allowed is it algin with best practices from anthropic?

https://docs.anthropic.com/en/docs/claude-code/sub-agents

or check it here


1- fix all sub-agents that have code snippets
2- update the sub-agents
3- the custom fields are you talking about the project context?




so now we wont use shadcn/ui cus we have the components from the examples folder or use them as a refernce to create our own components or customize them for our app?
but is the components we extracted from the examples folder are they use shadcn/ui or dont depend on any ui components library?


now we need to update the initials and prps with minimal changes to them
lets start with the initial files first

now lets update the prps files with minimal changes to them


do i proceed with PRPs which is the new Context Engineering which is the new standard for working with AI? i used this repo when i created the prps "https://github.com/coleam00/context-engineering-intro" as a reference

or do i generate a phases folder and breack each into smaller tasks to implement them one by one?

i think prps is better

what do you think? don't take my word for granted check the web for more info


do you remember my app vision?

this is my app vision if you forgot it
is to build an AI chat system. like manus.im, genspark.ai, etc..,
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


i had a conversation with you before about the app vision and we created the plan "app-plan.md"

check the initials, what more initials do we need?
each initial is responsible for a small feature like we did with the first 21 initials

ultrathink and give me a list of the initials we need for my app vision, and do we need to change any initials we have?
the initials we have they for the mvp, we need to list all the initials we need for the app vision, so we can develop the app step by step and know what we need to do



my app vision not just to match manus.im and genspark.ai, but to surpass them i just use them to know where to start and to take inspiration from them
create a md file to list all the initials we need to create and the ones we need to update


lets update the existing 3 initials

i have a question
initial 02 you created new one and and for the other two you updated them why is that?

and in the 02 you added a lot of features, and that isnt good, the beauty of the prps we have is that each initial is responsible for a small feature and all of combined make the app dont overcomplicate it or overlap each other



you check the prps, i generated the first 18 prps using this guide "INITIAL_TO_PRP_GUIDE.md"
which is using slash commands to generate the prps
like this "/generate-prp initial/02_basic_chat.md" or "/generate-pydantic-ai-prp initial/02_basic_chat.md"

now i need to generate the prps 19, 20, 21
but which slash command should i use?
update the INITIAL_TO_PRP_GUIDE.md file

these are the slash commands

i want you to check the intials are each of them responsible for a small feature?

and then check the generated prps for the first 18 initials are they good and each of them is responsible for a small feature from the initial?


now i need to regenerate prp right?
PRPs\voice-ui-components-iraqi-ai.md we generated it using initial/14_voice_ui.md
PRPs\scalability-performance.md we generated it using initial/18_scalability_performance.md

what do you think?



i have a question
do we regenerate all the prps not just the two we made changes to?
if you remember we updated the examples folder, when we generate the prps we had the old examples folder before we extracted the components from the repos, or it doesn't matter?
when we use the slash commands execute-prp or execute-pydantic-ai-prp it will use the examples folder we have now?


do i use the INITIAL_TO_PRP_GUIDE.md to regenerate the prps?

before we generate the prps

do we create all the new initials from COMPREHENSIVE_INITIALS_ROADMAP.md?

or we do it later after the MVP?



generate a commit message i want to read it before i commit


my team is just you and me no one else
and the code is in english not arabic? there is no arabic code and english code, is the standard right?

in the future after the mvp we will consider adding more team members
but for now i just you and me i dont need anyone else other than you
you are my best team member and i trust you





hooks do we need all these hooks?

i think we just need two hooks one for formatting and one for linting
what do you think?


lets remove the cultural validation hook

and now we have two hooks format-by-language.sh and format.sh
but will they work?
from what i know there isnt any unified formatting and linting tool for all languages


i have a question
how will they handle tool calling? 
check anthropic docs
and check the web for more info


in the youtube i saw a video where they have a file called tools.md and in he said it used with the hooks
if you can check the video

this is the video link
https://www.youtube.com/watch?v=ytn0aXK2gzE

do a thorough research through the web and check anthropic docs for more info


lets keep our hooks simple
now i have a question
for the hooks to work we need the tools installed in the app right?
so when well we install them? with which prp? after we generate the prps from the initials

will they auto install the tools? or we need to add them in the initial?










