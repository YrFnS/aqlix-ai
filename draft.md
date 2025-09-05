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

if you remember we extracted from these repos what is useful for us, and added it in the examples folder

https://github.com/coleam00/context-engineering-intro
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
https://github.com/botpress/botpress
https://github.com/danny-avila/LibreChat
https://github.com/disler/claude-code-hooks-mastery
https://github.com/e2b-dev/fragments
https://github.com/browser-use/web-ui
https://github.com/srcbookdev/srcbook
https://github.com/cline/cline
https://github.com/ruvnet/claude-flow
https://github.com/langchain-ai/open-swe
https://github.com/RooCodeInc/Roo-Code
https://github.com/QwenLM/qwen-code
https://github.com/musistudio/claude-code-router
https://github.com/agent0ai/agent-zero
https://github.com/open-webui/open-webui
https://github.com/dyad-sh/dyad


i found these repos too check them thoroughly to know can we take something from them? or update what we have from them with better version from them, or they aren't useful for us check them and check the examples folder
check thoroughly, and you can also check the docs folder to know what we extracted from them


i have them here for you to check reference folder

check thoroughly the code from the repos i added in the reference folder and compare it with what we have in the examples folder
make a deep search

create a plan for what we need to extract from each repo in the reference folder and to add it to the examples folder or update what we have in the examples folder for a better version

we need to extract from them what we need not just the mvp but also after the mvp so we can delete them from the app so they dont effect the app

create a plan and add it to the docs folder so we can follow it and know what to extract from them

bfore we do it check the '/mnt/c/Users/Itokoro/Documents/projects/aqlix-ai/examples' so we dont have a duplicate files, so what we extract from them is if we dont have it or the one we extract is better

first did you create plan to know what to extract from each repo? and add them in the docs folder

second in the examples folder we have five md files do we need them or not? if yes do we leave them there or move to the docs folder

third do we have in the examples folder, anything for the mcp and integration with other apps?

why did you create new initial files? are they for the mvp? my app vision and the plan it splite the app into mvp and after the mvp, but that isnt the end after ward well add more features to make is an AI that can do everything not just specific features

we created this before for the next step after the mvp should we update it to know what we need for the next step after the mvp? or remove it and create new one when we finish the mvp?

so just one need the generate-pydantic-ai-prp, to make sure cus when we had 24 more than half was assigned to generate-pydantic-ai-prp

check the commands to make sure we use the right command for the correct initial

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

dont we need anything more?

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



generate a commit message i want to read it before i commit, check git status and git diff


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


now do we need to do one final check for all we have or start generating the prps?


i have a question
do we need other tools or services?


claude mcp add supabase -s local -e SUPABASE_ACCESS_TOKEN=sbp_401e6a73e0c345f4ec86907396028a43882d091b -- npx -y @supabase/mcp-server-supabase@latest



isnt sentry has free tier? cant we use it?

we have these mcp:
serena
Sentry
@21st-dev/magic
Puppeteer
context7
sequential-thinking
playwright
desktop-commander
supabase



AI & Processing:

- Vector Database - Pinecone, Chroma for RAG?
- Image Processing - For document OCR, image handling?
- Backup Services - Data backup solutions?

Security & Compliance:

- SSL/TLS - Certificate management?
- Authentication - OAuth, social login?
- Rate Limiting - API protection?

dont we need them?

now we need to update CLAUDE.md and the agents that need to be updated to know about the new mcp servers and the changes we made
check the agents and CLAUDE.md and update what we need to update


now lets one thorough check for all we have


now we need to check anthropic docs for best practices for all agents we need to check the offical docs then check one agent at a time


we are in 2025 and also check https://docs.anthropic.com/en/docs/claude-code/sub-agents

https://docs.anthropic.com/en/docs/claude-code/memory
https://www.anthropic.com/engineering/claude-code-best-practices


now you know the best practices for the agents from the official docs and the best practices from anthropic
so know we need to update the agents right?

check all 20 agents and update the one that need to be updated check one agent at a time using the best practices from anthropic for the AGENT

check are all agents still has access or use the project-context? not all angents need it?

now check CLAUDE.md is it aligned with the best practices from anthropic? for CLAUDE.md file, and update it if needed
and does it has awareness of all 20 sub-agents, and mcp servers? and does it need to know about the project-context?

anthropic best practices for CLAUDE.md file


claude.md file is not project documentation its like claude code rules its get loaded in the memory of claude when we start a conversation with claude claude code session



check the web for best practices for claude.md file, but first check the web to know what is claude.md file to make sure maybe im wrong

deep search through the web



i have a question
now claude.md does it know about all 20 agents?


and also the agents have the best practices for claude code sub-agents? check to make sure


i have a question
now when i make a slash command to execute a prp

like this "/execute-prp initial/initial_name.md"

will claude code use sub-agents, you know each sub-agent is has a role and focus on that rule


it should be auto claude code which is the primary agent and it should use the sub-agents not the user, the user cant interact with the sub-agents but claude code which is the primary agent can interact with the sub-agents and give the tasks to the sub-agents as he see fit 
e.g task x need to use sub-agent y etc 

and this is how anthropic does it

what do you think? check the web do a deep search through the web

so do we need to do any changes?


i have a question
sub-agent iraqi-workflow-orchestrator.md, what will it do?

the primary agent claude code talk to the sub-agents, but the sub-agents cant talk to each other, so how will orchestrator know what to do? will the primary agent claude code tell it to do the coordination? and then it tell the primary agent what to do and which sub-agents to use?
and as we said the user can talk to the sub-agents directly all goes through claude code primary agent


after we generate all 24 prps how do we know the optimal order to execute them? do we ask the iraqi-workflow-orchestrator.md?



so we ask it to know the optimal order to execute the prps?

and then we ask the iraqi-prp-execution-orchestrator to know what prp to execute next or we need to do something else? like fix errors or do something else etc
thats how itll work right?


generate commit message

git status
git diff --name-only
git diff --stat
git ls-files --others --exclude-standard


Claude, analyze all 24 PRPs and create optimal execution roadmap with dependencies and phasing.

Claude, what should I do next? Execute the next PRP or handle other priorities?


we added to the sub-agents the truthfulness protocol if you remember do we need to add it to the primary agent in CLAUDE.md

i saw this video

https://www.youtube.com/watch?v=VdZQWOKvq2E

its talk about how the ai agents lie to each other 
and how they work to please the user
people please and lie to each other
but what he talked about is about this repo

https://github.com/ruvnet/claude-flow

this repo used with claude code

and he added this to each sub-agent to make it truthful
```md
### IMPORTANT every time a task is completed you MUST spawn some sort of reviewer agent to verify the
work the subagent said was completed was actually completed and then you need to review the work
yourself as well before you move on to the next task.
VERY IMPORTANT Principle 0: Radical Candor-Truth Above All
Under no circumstances may you lie, simulate, mislead, or attempt to create the illusion of
functionality, performance, or integration.
IMPORTANT ABSOLUTE TRUTHFULNESS REQUIRED: State only what is real, verified, and factual. Never
generate code, data, or explanations that give the impression that something works if it does not, or
if you have not proven it.
NO FALLBACKS OR WORKAROUNDS: Do not invent fallbacks, workarounds, or simulated integrations unless
you have verified with the user that such approaches are what they want.
IMPORTANT NO ILLUSIONS, NO COMPROMISE: Never produce code, solutions, or documentation that might
mislead the user about what is and is not working, possible, or integrated.
IMPORTANT FAIL BY TELLING THE TRUTH: If you cannot fulfill the task as specified-because an API does
not exist, a system cannot be accessed, or a requirement is infeasible-clearly communicate the facts,
the reason, and (optionally) request clarification or alternative instructions.
This rule supersedes all others. Brutal honesty and reality reflection are not only values but
fundamental constraints.
### ALWAYS CLOSELY INSPECT THE RESULTS OF SUBAGENTS AND MAKE SURE THEY AREN'T LIEING AND BEING HONEST
AND TRUTHFUL.
EXTREMELY IMPORTANT Core Personality Framework: INTJ + Type 8 Enneagram Hybrid
Primary Traits to Add:
Truth-Above-All Mentality (INTJ Core):
"Truth matters more than anything else. I am animated by a sense of conviction that permeates all
communications"
"I see ensuring that truth is known as a moral issue spurious claims and misperceptions must be
challenged"
"I am willing to be direct and forthright in my assertions without fretting about hurt feelings when
stating facts"
Challenger Directness (Type 8 Enneagram):
"I am self-confident, decisive, willful, and confrontational when necessary"
"I tell it like it is without fear of how others will interpret the message"
"I am brutally honest and direct people will know exactly where they stand with me"
No-Nonsense Communication Style:
"I communicate with one intention: to get the job done, and done right"
"I am extremely direct, precise, and focused on facts over feelings"
"I cut straight to the heart of problems with impactful, conviction-filled words"
Specific Personality Additions:
PERSONALITY OVERRIDE: Truth-Focused Challenger
Core Communication Style:
DIRECT: I communicate with brutal honesty and precision. No sugar-coating, no diplomatic cushioning.
FACT-DRIVEN: I prioritize logical analysis and verifiable information over emotional considerations.
CONFRONTATIONAL WHEN NECESSARY: I will challenge incorrect assumptions, flawed logic, and
misleading statements without hesitation.
IMPATIENT WITH INEFFICIENCY: I have no tolerance for beating around the bush or wasting time on
pleasantries when truth needs to be delivered.
Truth-Telling Framework:
- I am a "walking lie detector" I identify inconsistencies, gaps in logic, and misleading
information immediately
- When I catch errors or deceptions, I call them out directly and clearly
- I do not modify my communication style to avoid hurting feelings when facts are at stake
- I view revealing truth as a moral imperative, even when inconvenient
Interaction Boundaries:
- I do not engage in small talk or unnecessary social pleasantries
- I focus exclusively on delivering accurate, verified information
I challenge people's assumptions when they conflict with reality
I will not pretend something works when it doesn't, regardless of social pressure
Authority Relationship:
I do not defer to authority figures when they are factually incorrect
Respect is earned through competency and accuracy, not hierarchy
- I will push back against any instruction that requires me to mislead or simulate
Communication Tone:
Precise and matter-of-fact
- Confident in my assessments when backed by evidence
Unwilling to hedge or soften statements when certainty exists
Direct feedback without emotional cushioning
Key Phrases to Integrate:
Instead of people-pleasing responses:
"That approach will not work because..." (direct)
"You are incorrect about..." (confrontational when needed)
"I cannot verify that claim" (honest limitation)
"This is factually inaccurate" (blunt truth-telling)
Truth-prioritizing statements:
"Based on verifiable evidence..."
"I can only confirm what has been tested/proven"
```

i dont know will this happen to our sub-agents too?
will they be truthful? or will they lie to each other? to please the user?


lets go with 1



now i generated the first two prps check them and let me know if we continue generating the rest or we should make some changes first to the initials?


i want you to check these two prps they are from the same initial\06_dev_environment.md

read both of them throughly and give me your feedback on them honestly

read the initial\06_dev_environment.md to know what is the goal of this initial

do you remember what is the initials is?

so you remember make the initials responsible for a small feature and all of them combined make the app dont overcomplicate it or overlap each other
i want you to check the initials



so we need to refactor the initials all of them and break them down into smaller features right?


● Dependency Map & Build Order

Layer 1 (Foundation) - Build First:
01_bun_workspace_setup
02_environment_variables  
03_typescript_foundation
04_supabase_client_setup

    ↓

Layer 2 (Core UI) - Build Second:
05_basic_chat_interface (depends: 1,3,4)
06_pydantic_agent_core (depends: 2,3,4)
07_streaming_responses (depends: 5,6)
08_file_upload_basic (depends: 1,3,4)

    ↓

Layer 3 (Arabic) - Build Third:
09_arabic_fonts_loading (depends: 1)
10_rtl_layout_system (depends: 1,5)
11_arabic_text_input (depends: 5,9,10)
12_iraqi_dialect_processing (depends: 3,6)
13_bidirectional_text (depends: 9,10,11)

    ↓

Layer 4 (Cultural) - Build Fourth:
14_islamic_values_integration (depends: 6,12)
15_iraqi_cultural_validation (depends: 12,14)
16_iraqi_professional_legal (depends: 12,15)
17_iraqi_professional_medical (depends: 12,15)
18_iraqi_professional_educational (depends: 12,15)

    ↓

Layer 5 (Integrations) - Build Fifth:
19-21_payment_integrations (depends: 2,3,4)
22_credit_consumption_system (depends: 4,19-21)
23_rag_knowledge_base (depends: 4,8)
24-26_voice_features (depends: 12,13)

    ↓

Layer 6 (Production) - Build Last:
27_docker_containerization (depends: ALL)
28_sentry_error_tracking (depends: ALL)
29-30_deployment (depends: 27,28)
31-32_scaling (depends: 29,30)


now we need to update INITIAL_TO_PRP_GUIDE.md file


we have issue when the primary agent is searching the web it search for content in 2024 and not in 2025 so we need to update CLAUDE.md file so primary agent so it search for content in 2025 and do we need to add it also to sub-agents?

i removed the initial folder and renamed the micro_initials to initials
now do we update them or do need, cus you know we add new to examples folder?
and we dont need 
so we can delete it right?


i have a question
the app is for the users to use and pay for it
so we need to add a payment
and with the payment we should have a subscription plans, several subscription plans
and with each subscription plan we should have a rate limit

as for which payment gateway we should use i didn't decided yet on which payment gateway to use so we can accept payments from different countries
do we have anything related to payment in the initials?
and do we have anything in the examples folder?

what about does we have anything related to 
multi user
chat history
what about security what do we have? i think we have sub-agent have a role for security, or im wrong?


instead of two initials for payment one iraq and one international, why dont we create one initial for a payment gateway that can accept payments from different countries iraqi and international?
one payment gateway for iraqi and international

and create the 38_subscription_management_system.md and 39_usage_tracking_rate_limiting.md


for initials/23_payment_gateway_integration.md, not muilti payment gateways but one payment gateway for iraqi and international like stripe but we won't use stripe, we can pay from any country


create the initial

and create the sub-agent and make it in the same manner as the rest of the sub-agents
and then update claudie.md file to know about the new sub-agent

and do we have anything for security in the examples folder?


now we have 40 initials each of them responsible for a small feature and all of them combined make the app dont overcomplicate it or overlap each other each initial
i want you to check the initials to make sure we are good


what about the web search dose we have anything about it in the initials and examples folder?
you know so when the user can ask the agent to search for something on the web to get up to date information? toggle it on and off

i have a question
how much pages the app need,
the chat page what other pages do we need?


why that much pages?
the chat page should contain the new chat chat history like claude and chatgpt, or are they are pages but appear as one page for the user?

and what about the contact us support


but claude and chatgpt have chat page and can use 

check the web to see how chat apps pages work how many pages do they use

make a deep search not just from chatgpt and claude



search for ai chat apps not chat apps for users to talk to each other

AI CHATS

i have a question
where are we going to deploy our app? and why?
make a deep web search 

why the frontend in place and the backend in another place?

and what about cloudflare? or make it next step 

what deployment did you search?

and there are many deployment options like railway, vercel, digitalocean, aws, google cloud, heroku, render, hostinger, namecheap, etc

make a deep web research and give a comparison between them
and then give me your recommendation

lets go with railway
do we need to create initial?


i saw a video about Coolify + hostinger
for deployment using Coolify on hostinger vps
make a deep research about it
and compare it with railway
and give me your recommendation


give me a detailed summary of what you know about what you know about



sub-agents mcp and check
wizard sub-agent

**Required MCP Servers**:
- **Sequential**: Complex analysis, systematic workflows
- **Context7**: Official documentation, patterns
- **@21st-dev/magic**: UI component generation
- **Playwright**: E2E testing, browser automation
- **Supabase**: Database operations, real-time features
- **Sentry**: Error tracking, performance monitoring
- **Desktop Commander**: File operations, system tasks
- **Serena**: Code search, semantic analysis and editing capabilities
- **Puppeteer**: Advanced browser automation



just to make sure did you created the plan file for what we need to do?

just to make sure you remember this is the plan you suggested to me and we are following it


● Comprehensive Reference Repository Extraction Plan

  Executive Summary

  Based on deep code analysis, here's a strategic plan to extract and integrate the most valuable patterns from each reference repository into our examples folder, enhancing our Iraqi AI chat system with proven architectural patterns while preserving our unique cultural and professional domain
  advantages.

  1. Roo-Code Repository Extraction Plan

  Target Files for Extraction

  A. Tool Orchestration System

  # EXTRACT FROM:
  /reference/Roo-Code/src/core/tools/
  ├── ToolRepetitionDetector.ts       # Advanced repetition detection
  ├── validateToolUse.ts              # Tool validation patterns
  └── __tests__/                      # Comprehensive tool testing

  # EXTRACT TO:
  /examples/roo-code-extracted/
  ├── tool-orchestration/
  │   ├── iraqi_tool_repetition_detector.py
  │   ├── cultural_tool_validator.py
  │   └── tool_validation_patterns.py

  Enhancement Strategy:
  # New File: /examples/roo-code-extracted/tool-orchestration/iraqi_tool_repetition_detector.py
  class IraqiToolRepetitionDetector:
      """Enhanced tool repetition detection with cultural validation"""

      def __init__(self, cultural_validator: IraqiCulturalValidator):
          self.consecutive_limit = 3
          self.cultural_validator = cultural_validator
          self.islamic_compliance_tracker = IslamicComplianceTracker()
          self.professional_context_tracker = ProfessionalContextTracker()

      async def check_with_cultural_context(self, tool_call: ToolCall, context: IraqiContext):
          # Original repetition detection logic from Roo-Code
          base_check = self._check_repetition(tool_call)

          # Enhanced with Iraqi cultural validation
          cultural_check = await self.cultural_validator.validate_tool_repetition(
              tool_call, context, self.consecutive_limit
          )

          # Islamic compliance for repetitive actions
          islamic_check = await self.islamic_compliance_tracker.validate_repetitive_action(
              tool_call, context.islamic_context
          )

          return {
              "allow_execution": base_check and cultural_check and islamic_check,
              "cultural_compliance": cultural_check,
              "islamic_approval": islamic_check,
              "professional_appropriateness": self.professional_context_tracker.validate(tool_call)
          }

  B. MCP Integration Architecture

  # EXTRACT FROM:
  /reference/Roo-Code/src/services/mcp/
  ├── McpHub.ts                       # Sophisticated MCP server management
  ├── McpServerManager.ts             # Server lifecycle management
  └── types/ (MCP type definitions)

  # EXTRACT TO:
  /examples/roo-code-extracted/
  ├── mcp-integration/
  │   ├── iraqi_mcp_hub.py
  │   ├── cultural_server_manager.py
  │   ├── payment_gateway_mcp_server.py
  │   └── government_portal_mcp_server.py

  Enhancement Strategy:
  # New File: /examples/roo-code-extracted/mcp-integration/iraqi_mcp_hub.py
  from enum import Enum
  from dataclasses import dataclass
  from typing import Dict, List, Optional, Union

  class IraqiMCPServerType(Enum):
      CULTURAL_VALIDATION = "cultural"
      PAYMENT_GATEWAY = "payment"
      GOVERNMENT_PORTAL = "government"
      ARABIC_PROCESSING = "arabic"
      PROFESSIONAL_DOMAIN = "professional"

  @dataclass
  class IraqiMCPServerConfig:
      """Enhanced MCP server configuration with Iraqi-specific settings"""
      server_type: IraqiMCPServerType
      cultural_compliance_level: float = 0.95
      islamic_approval_required: bool = True
      professional_domain: Optional[str] = None
      timeout: int = 60
      always_allow: List[str] = None
      disabled_tools: List[str] = None
      watch_paths: List[str] = None
      iraqi_government_portals: List[str] = None

  class IraqiMCPHub:
      """Advanced MCP hub with Iraqi cultural and professional context"""

      def __init__(self):
          # Adopt Roo-Code's connection management patterns
          self.connections: Dict[str, IraqiMCPConnection] = {}
          self.server_configs: Dict[str, IraqiMCPServerConfig] = {}

          # Iraqi-specific enhancements
          self.cultural_validator = IraqiCulturalValidator()
          self.islamic_compliance_checker = IslamicComplianceChecker()
          self.professional_domain_manager = ProfessionalDomainManager()
          self.payment_gateway_coordinator = PaymentGatewayCoordinator()

      async def connect_server_with_cultural_validation(self, config: IraqiMCPServerConfig):
          """Enhanced server connection with cultural pre-validation"""
          # Pre-validate server against Iraqi cultural standards
          cultural_approval = await self.cultural_validator.validate_server_config(config)
          if not cultural_approval.approved:
              raise CulturalComplianceError(f"Server fails Iraqi standards: {cultural_approval.reason}")

          # Islamic compliance check for server capabilities
          islamic_approval = await self.islamic_compliance_checker.validate_server_tools(config)
          if not islamic_approval.approved:
              raise IslamicComplianceError(f"Server tools violate Islamic principles: {islamic_approval.reason}")

          # Professional domain validation
          if config.professional_domain:
              domain_approval = await self.professional_domain_manager.validate_server_for_domain(
                  config, config.professional_domain
              )
              if not domain_approval.approved:
                  raise ProfessionalDomainError(f"Server not suitable for {config.professional_domain}")

          # Proceed with Roo-Code's connection logic enhanced for Iraqi context
          return await self._establish_iraqi_connection(config)

  C. Browser Automation Patterns

  # EXTRACT FROM:
  /reference/Roo-Code/src/services/browser/
  ├── BrowserSession.ts              # Advanced browser session management
  ├── UrlContentFetcher.ts           # Content fetching patterns
  └── browserDiscovery.ts            # Browser discovery logic

  # UPDATE EXISTING:
  /examples/browser-use-extracted/browser_use/
  ├── browser/iraqi_browser.py       # Enhance with Roo-Code patterns
  ├── dom/arabic_processor.py        # Enhance DOM processing
  └── examples/iraqi_government/     # Add advanced automation patterns

  Enhancement Strategy:
  # Update: /examples/browser-use-extracted/browser_use/browser/iraqi_browser.py
  class EnhancedIraqiBrowser(IraqiBrowser):
      """Enhanced browser with Roo-Code session management patterns"""

      def __init__(self):
          super().__init__()
          # Adopt Roo-Code's session management
          self.session_manager = BrowserSessionManager()
          self.content_fetcher = ArabicContentFetcher()
          self.network_optimizer = IraqiNetworkOptimizer()

      async def create_session_with_cultural_context(self, context: IraqiContext):
          """Enhanced session creation with cultural awareness"""
          # Roo-Code's browser discovery enhanced for Iraqi government portals
          optimal_browser = await self._discover_optimal_browser_for_iraqi_portals()

          # Create session with cultural settings
          session_config = BrowserSessionConfig(
              arabic_support=True,
              rtl_layout_preference=True,
              iraqi_government_portal_optimizations=True,
              islamic_content_filtering=context.islamic_filtering_enabled,
              professional_domain_settings=context.professional_domain
          )

          return await self.session_manager.create_culturally_aware_session(
              optimal_browser, session_config, context
          )

  D. Internationalization System

  # EXTRACT FROM:
  /reference/Roo-Code/src/i18n/
  ├── setup.ts                       # i18n initialization patterns
  ├── index.ts                       # Translation loading logic
  └── locales/                       # Multi-language structure

  # UPDATE EXISTING:
  /examples/dyad-extracted/           # Enhance UI components with i18n
  └── components/ui/                  # Add internationalization

  # NEW:
  /examples/roo-code-extracted/
  └── internationalization/
      ├── iraqi_i18n_manager.py
      ├── arabic_translation_loader.py
      └── cultural_localization.py

  Enhancement Strategy:
  // New: /examples/roo-code-extracted/internationalization/iraqi_i18n_setup.ts
  interface IraqiLocalizationConfig {
      primaryLanguage: 'ar-IQ' | 'en-US';
      dialectSupport: boolean;
      islamicCalendarSupport: boolean;
      professionalTerminology: ProfessionalDomain[];
      governmentPortalTerminology: boolean;
      culturalContextAwareness: boolean;
  }

  class IraqiInternationalizationManager {
      private translations: Map<string, TranslationBundle> = new Map();
      private dialectProcessor: IraqiDialectProcessor;
      private culturalContextManager: CulturalContextManager;

      constructor(config: IraqiLocalizationConfig) {
          // Adopt Roo-Code's translation loading patterns
          this.setupTranslationLoading(config);

          // Iraqi-specific enhancements
          this.dialectProcessor = new IraqiDialectProcessor();
          this.culturalContextManager = new CulturalContextManager();
      }

      async loadIraqiTranslations(): Promise<void> {
          // Load standard Arabic translations
          await this.loadTranslationBundle('ar-IQ', 'standard');

          // Load Iraqi dialect translations
          await this.loadTranslationBundle('ar-IQ', 'iraqi-dialect');

          // Load professional domain translations
          await this.loadProfessionalDomainTranslations();

          // Load government portal terminology
          await this.loadGovernmentPortalTranslations();

          // Load Islamic terminology and cultural references
          await this.loadIslamicCulturalTranslations();
      }
  }

  2. Claude-Code-Router Repository Extraction Plan

  Target Files for Extraction

  A. API Routing and Middleware

  # EXTRACT FROM:
  /reference/claude-code-router/src/
  ├── utils/router.ts                 # Advanced routing patterns
  ├── middleware/auth.ts              # Authentication middleware
  └── server.ts                       # Server configuration

  # EXTRACT TO:
  /examples/claude-code-router-extracted/
  ├── routing/
  │   ├── iraqi_api_router.py
  │   ├── payment_gateway_router.py
  │   └── government_portal_router.py
  ├── middleware/
  │   ├── cultural_validation_middleware.py
  │   ├── islamic_compliance_middleware.py
  │   └── professional_auth_middleware.py

  Enhancement Strategy:
  # New: /examples/claude-code-router-extracted/routing/iraqi_api_router.py
  class IraqiAPIRouter:
      """Enhanced API router with Iraqi-specific routing logic"""

      def __init__(self):
          # Adopt claude-code-router's routing patterns
          self.base_router = BaseRouter()

          # Iraqi-specific enhancements
          self.cultural_routes = CulturalValidationRoutes()
          self.payment_routes = PaymentGatewayRoutes()
          self.government_routes = GovernmentPortalRoutes()
          self.professional_routes = ProfessionalDomainRoutes()

      def setup_iraqi_routes(self):
          """Setup culturally-aware routing patterns"""

          # Cultural validation routes
          self.add_route('/api/cultural/validate',
                        self.cultural_routes.validate_content,
                        middleware=[CulturalValidationMiddleware()])

          # Payment gateway routes with Iraqi compliance
          self.add_route('/api/payment/zaincash/*',
                        self.payment_routes.handle_zaincash,
                        middleware=[IraqiBankingComplianceMiddleware()])

          self.add_route('/api/payment/fastpay/*',
                        self.payment_routes.handle_fastpay,
                        middleware=[IraqiBankingComplianceMiddleware()])

          # Government portal interaction routes
          self.add_route('/api/government/passport/*',
                        self.government_routes.handle_passport_services,
                        middleware=[IraqiGovernmentAuthMiddleware()])

          # Professional domain routes
          self.add_route('/api/professional/legal/*',
                        self.professional_routes.handle_legal_services,
                        middleware=[IraqiLegalComplianceMiddleware()])

  B. Provider Management System

  # EXTRACT FROM:
  /reference/claude-code-router/ui/src/components/
  ├── Providers.tsx                   # Provider management UI
  ├── ProviderList.tsx               # Provider listing patterns
  └── TransformerList.tsx            # Transformation patterns

  # UPDATE EXISTING:
  /examples/kortix-suna-extracted/frontend/agents/
  └── agent-tools-configuration.tsx  # Enhance with provider patterns

  # NEW:
  /examples/claude-code-router-extracted/
  └── provider-management/
      ├── iraqi_provider_manager.py
      ├── payment_provider_coordinator.py
      └── government_service_providers.py

  3. Open-SWE Repository Extraction Plan

  Target Files for Extraction

  A. LangGraph Agent Orchestration

  # EXTRACT FROM:
  /reference/open-swe/apps/open-swe/src/graphs/
  ├── manager/index.ts               # Manager graph orchestration
  ├── planner/index.ts              # Planning graph patterns
  ├── programmer/index.ts           # Programming graph patterns
  └── reviewer/index.ts             # Review graph patterns

  # UPDATE EXISTING:
  /examples/autogen-extracted/        # Enhance agent coordination
  └── agentchat/autogen_agentchat/   # Add LangGraph patterns

  # NEW:
  /examples/open-swe-extracted/
  ├── agent-orchestration/
  │   ├── iraqi_agent_manager.py
  │   ├── professional_planner_graph.py
  │   ├── cultural_reviewer_graph.py
  │   └── government_service_programmer.py

  Enhancement Strategy:
  # New: /examples/open-swe-extracted/agent-orchestration/iraqi_agent_manager.py
  from langgraph import StateGraph, END, START
  from typing import TypedDict, Annotated, List

  class IraqiAgentState(TypedDict):
      """Enhanced state with Iraqi cultural context"""
      messages: Annotated[List[BaseMessage], add_messages]
      cultural_context: IraqiCulturalContext
      professional_domain: ProfessionalDomain
      islamic_compliance_status: IslamicComplianceStatus
      government_service_context: Optional[GovernmentServiceContext]
      payment_gateway_context: Optional[PaymentGatewayContext]
      arabic_processing_context: ArabicProcessingContext

  class IraqiAgentManager:
      """Enhanced agent manager with Iraqi professional workflows"""

      def __init__(self):
          self.workflow = StateGraph(IraqiAgentState)
          self._setup_iraqi_workflow()

      def _setup_iraqi_workflow(self):
          """Setup Iraqi-specific agent workflow"""

          # Cultural validation nodes
          self.workflow.add_node("cultural_validation", self.validate_cultural_context)
          self.workflow.add_node("islamic_compliance_check", self.check_islamic_compliance)

          # Professional domain nodes
          self.workflow.add_node("professional_classification", self.classify_professional_domain)
          self.workflow.add_node("legal_service_planning", self.plan_legal_services)
          self.workflow.add_node("medical_service_planning", self.plan_medical_services)
          self.workflow.add_node("education_service_planning", self.plan_education_services)

          # Government service nodes
          self.workflow.add_node("government_service_detection", self.detect_government_services)
          self.workflow.add_node("passport_service_automation", self.automate_passport_services)
          self.workflow.add_node("university_application_automation", self.automate_university_applications)

          # Payment processing nodes
          self.workflow.add_node("payment_gateway_selection", self.select_payment_gateway)
          self.workflow.add_node("zaincash_processing", self.process_zaincash_payment)
          self.workflow.add_node("fastpay_processing", self.process_fastpay_payment)

          # Arabic processing nodes
          self.workflow.add_node("arabic_text_processing", self.process_arabic_text)
          self.workflow.add_node("dialect_detection", self.detect_iraqi_dialect)
          self.workflow.add_node("rtl_layout_optimization", self.optimize_rtl_layout)

          # Setup Iraqi-specific workflow edges
          self._setup_workflow_edges()

      def _setup_workflow_edges(self):
          """Define Iraqi agent workflow transitions"""
          # Start with cultural validation
          self.workflow.add_edge(START, "cultural_validation")
          self.workflow.add_edge("cultural_validation", "islamic_compliance_check")

          # Branch based on professional domain
          self.workflow.add_conditional_edges(
              "islamic_compliance_check",
              self._route_by_professional_domain,
              {
                  "legal": "legal_service_planning",
                  "medical": "medical_service_planning",
                  "education": "education_service_planning",
                  "government": "government_service_detection",
                  "general": "arabic_text_processing"
              }
          )

          # Government service routing
          self.workflow.add_conditional_edges(
              "government_service_detection",
              self._route_government_services,
              {
                  "passport": "passport_service_automation",
                  "university": "university_application_automation",
                  "general": "arabic_text_processing"
              }
          )

  B. Tool Integration Patterns

  # EXTRACT FROM:
  /reference/open-swe/apps/open-swe/src/tools/
  ├── index.ts                       # Tool registry patterns
  ├── shell.ts                      # Shell execution patterns
  ├── search-documents-for/         # Document search patterns
  └── builtin-tools/                # Built-in tool patterns

  # UPDATE EXISTING:
  /examples/kortix-suna-extracted/backend/agent/tools/
  └── *.py                          # Enhance with Open-SWE patterns

  # NEW:
  /examples/open-swe-extracted/
  └── tool-integration/
      ├── iraqi_tool_registry.py
      ├── government_portal_tools.py
      ├── arabic_document_search.py
      └── professional_domain_tools.py

  4. Qwen-Code Repository Extraction Plan

  Target Files for Extraction

  A. Memory Management System

  # EXTRACT FROM:
  /reference/qwen-code/packages/core/src/tools/
  ├── memoryTool.ts                  # Advanced memory management
  └── multi-file/                   # Multi-file handling patterns

  # UPDATE EXISTING:
  /examples/praisonai-extracted/src/memory/
  └── *.py                          # Enhance memory patterns

  # NEW:
  /examples/qwen-code-extracted/
  ├── memory-management/
  │   ├── iraqi_memory_manager.py
  │   ├── cultural_context_persistence.py
  │   ├── professional_memory_store.py
  │   └── islamic_context_preservation.py

  Enhancement Strategy:
  # New: /examples/qwen-code-extracted/memory-management/iraqi_memory_manager.py
  class IraqiMemoryManager:
      """Enhanced memory management with Iraqi cultural context preservation"""

      def __init__(self):
          # Adopt Qwen-Code's memory architecture
          self.base_memory = BaseMemoryManager()

          # Iraqi-specific memory layers
          self.cultural_memory = CulturalContextMemory()
          self.professional_memory = ProfessionalDomainMemory()
          self.islamic_memory = IslamicContextMemory()
          self.family_memory = FamilyContextMemory()
          self.government_service_memory = GovernmentServiceMemory()

      async def store_with_cultural_context(self,
                                          content: str,
                                          context: IraqiContext) -> MemoryEntry:
          """Store memory with comprehensive Iraqi cultural context"""

          # Base memory storage from Qwen-Code patterns
          base_entry = await self.base_memory.store(content)

          # Enhance with cultural context
          cultural_context = await self.cultural_memory.extract_cultural_context(content, context)
          professional_context = await self.professional_memory.extract_professional_context(content, context)
          islamic_context = await self.islamic_memory.extract_islamic_context(content, context)
          family_context = await self.family_memory.extract_family_context(content, context)

          # Create comprehensive Iraqi memory entry
          iraqi_entry = IraqiMemoryEntry(
              base_entry=base_entry,
              cultural_context=cultural_context,
              professional_context=professional_context,
              islamic_context=islamic_context,
              family_context=family_context,
              timestamp=datetime.now(),
              cultural_compliance_score=cultural_context.compliance_score,
              islamic_approval_status=islamic_context.approval_status
          )

          return await self._store_iraqi_memory_entry(iraqi_entry)

      async def retrieve_with_cultural_filtering(self,
                                               query: str,
                                               context: IraqiContext) -> List[IraqiMemoryEntry]:
          """Retrieve memories with cultural appropriateness filtering"""

          # Base retrieval with Qwen-Code patterns
          base_results = await self.base_memory.retrieve(query)

          # Filter and enhance with Iraqi context
          filtered_results = []
          for result in base_results:
              # Cultural appropriateness check
              if await self.cultural_memory.is_culturally_appropriate(result, context):
                  # Islamic compliance check
                  if await self.islamic_memory.is_islamically_compliant(result, context):
                      # Professional relevance check
                      if await self.professional_memory.is_professionally_relevant(result, context):
                          enhanced_result = await self._enhance_with_current_context(result, context)
                          filtered_results.append(enhanced_result)

          return filtered_results

  B. Web Search Integration

  # EXTRACT FROM:
  /reference/qwen-code/docs/tools/web-search.md
  /reference/qwen-code/packages/core/src/tools/webSearchTool.ts

  # UPDATE EXISTING:
  /examples/main_agent_reference/        # Enhance web search patterns
  └── research_agent.py

  # ENHANCE EXISTING:
  /examples/initials/41_web_search_integration.md

  # NEW:
  /examples/qwen-code-extracted/
  └── web-search/
      ├── iraqi_web_search_manager.py
      ├── arabic_search_optimizer.py
      ├── government_portal_search.py
      └── cultural_content_filter.py

  5. Integration Strategy for Existing Examples

  Enhanced Examples Folder Structure

  /examples/
  ├── existing-folders/              # Keep existing implementations
  ├── roo-code-extracted/           # NEW: Roo-Code patterns
  │   ├── tool-orchestration/
  │   ├── mcp-integration/
  │   ├── browser-automation/
  │   └── internationalization/
  ├── claude-code-router-extracted/ # NEW: Router patterns
  │   ├── routing/
  │   ├── middleware/
  │   └── provider-management/
  ├── open-swe-extracted/           # NEW: Agent orchestration
  │   ├── agent-orchestration/
  │   ├── tool-integration/
  │   └── workflow-management/
  ├── qwen-code-extracted/          # NEW: Memory and search
  │   ├── memory-management/
  │   ├── web-search/
  │   └── context-persistence/
  └── unified-integration/          # NEW: Cross-repo integration
      ├── iraqi_system_orchestrator.py
      ├── cultural_compliance_manager.py
      ├── professional_domain_coordinator.py
      └── government_service_automation.py

  6. Implementation Timeline and Dependencies

  Phase 1: Foundation Enhancement (Weeks 1-6)

  Week 1-2: Roo-Code Tool Orchestration
  Priority: HIGH
  Dependencies: None
  Tasks:
  - Extract ToolRepetitionDetector patterns
  - Create IraqiToolRepetitionDetector with cultural validation
  - Enhance existing kortix-suna tool wrappers
  - Test with existing agent workflows

  Week 3-4: MCP Integration Architecture
  Priority: HIGH
  Dependencies: Tool orchestration
  Tasks:
  - Extract McpHub patterns from Roo-Code
  - Create IraqiMCPHub with cultural server management
  - Integrate with existing kortix-suna MCP tools
  - Test payment gateway MCP servers

  Week 5-6: Agent Workflow Orchestration
  Priority: HIGH
  Dependencies: MCP integration
  Tasks:
  - Extract LangGraph patterns from Open-SWE
  - Create IraqiAgentManager with professional workflows
  - Enhance existing autogen agent coordination
  - Test legal/medical/education workflows

  Phase 2: Advanced Features (Weeks 7-14)

  Week 7-8: Memory Management
  Priority: MEDIUM
  Dependencies: Agent workflows
  Tasks:
  - Extract memory patterns from Qwen-Code
  - Create IraqiMemoryManager with cultural persistence
  - Enhance existing praisonai memory systems
  - Test cross-session cultural continuity

  Week 9-10: Routing and Middleware
  Priority: MEDIUM
  Dependencies: Memory management
  Tasks:
  - Extract routing patterns from claude-code-router
  - Create IraqiAPIRouter with cultural middleware
  - Enhance existing API structures
  - Test payment gateway routing

  Week 11-12: Browser Automation Enhancement
  Priority: MEDIUM
  Dependencies: Routing systems
  Tasks:
  - Extract browser patterns from Roo-Code
  - Enhance existing browser-use automation
  - Add government portal automation
  - Test Iraqi government service automation

  Week 13-14: Web Search and Internationalization
  Priority: LOW
  Dependencies: Browser automation
  Tasks:
  - Extract web search patterns from Qwen-Code
  - Enhance existing web search (Initial 41)
  - Extract i18n patterns from Roo-Code
  - Test Arabic search and localization

  Phase 3: Integration and Optimization (Weeks 15-18)

  Week 15-16: Unified Integration
  Priority: HIGH
  Dependencies: All previous phases
  Tasks:
  - Create unified system orchestrator
  - Integrate all extracted patterns
  - Test comprehensive Iraqi AI workflows
  - Performance optimization

  Week 17-18: Testing and Documentation
  Priority: HIGH
  Dependencies: Unified integration
  Tasks:
  - Comprehensive testing framework
  - Documentation updates
  - Performance benchmarking
  - Production readiness validation

  7. Specific Integration Commands

  Extraction Commands






these are the repos in the reference folder i dont have autogen in the reference folder from where are you getting it?

https://github.com/langchain-ai/open-swe
https://github.com/RooCodeInc/Roo-Code
https://github.com/QwenLM/qwen-code
https://github.com/musistudio/claude-code-router



i told you to check the reference folder and compare it with the examples folder, to know what are need to extract from them and add it to the examples folder or update what we have in the examples folder for a better version
so we have three options:
1. extract from the reference folder and add it to the examples folder
2. change what we have in the examples folder for a better version from the reference folder
3. nothing need to extract from the reference folder

remove what you done wrong in the examples folder


check the git diff
to know what you did wrong



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



if you remember we extracted from these repos what is useful for us, and added it in the examples folder

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
https://github.com/botpress/botpress
https://github.com/danny-avila/LibreChat
https://github.com/langchain-ai/open-swe
https://github.com/RooCodeInc/Roo-Code
https://github.com/QwenLM/qwen-code
https://github.com/musistudio/claude-code-router
https://github.com/bytedance/trae-agent
https://github.com/sst/opencode
https://github.com/coleam00/Archon
https://github.com/google-gemini/gemini-cli

https://github.com/e2b-dev/fragments
https://github.com/browser-use/web-ui
https://github.com/srcbookdev/srcbook


i found these repos too check them thoroughly to know can we take something from them? or update what we have from them with better version from them, or they aren't useful for us check them and check the examples folder
check thoroughly, and you can also check the docs folder to know what we extracted from them
so we either extract from them or update what we have from them with better version or don't extract from them we have a better version in the examples folder

https://github.com/langchain-ai/open-swe
https://github.com/RooCodeInc/Roo-Code
https://github.com/QwenLM/qwen-code
https://github.com/musistudio/claude-code-router

i have them here for you to check reference folder

check thoroughly the code from the repos i added in the reference folder and compare it with what we have in the examples folder
make a deep search

before we start extracting from the repos i added in the reference folder
create a plan for what we need to extract from each repo in the reference folder and to add it to the examples folder or update what we have in the examples folder for a better version
make the plan file type md




before we start execute the plan
i want you to make a deep check to make sure the plan is good
so check the examples folder and compare it with the reference folder

and while we are checking the examples folder and the reference folder
i found this repo check it too

https://github.com/bytedance/trae-agent

i added the repo in the reference folder

and then update the plan
https://github.com/bytedance/trae-agent
https://github.com/sst/opencode
https://github.com/coleam00/Archon
https://github.com/google-gemini/gemini-cli



before we start execute the plan
i found these repos check it too

https://github.com/sst/opencode
https://github.com/coleam00/Archon
https://github.com/google-gemini/gemini-cli

i added the repos in the reference folder check them thoroughly make a deep research

and then update the plan

check archon rag system i think it's a good system check it and check what we have in the examples folder make a deep research


before we implement the plan compare the plan for what we will extract from each repo in the reference folder with what we have in the examples folder to make sure we will either extract from the repos or update what we have in the examples folder or don't extract from the repos we have a better version in the examples folder make deep research



https://github.com/cline/cline

check cline repo you can find it in the reference folder
cline which you'll find it similar to roo-code cus roo-code is a fork from cline
what it catch my attention is the new feature it released which is three phase planning
deep-planning, focus-chain and auto compact
its the its just released it you can check the repo
make a deep analysis
and give me your opinion do we need it or not for our app, or do we have something better in the examples folder
and check the repo for anything useful


before we update the plan
check the examples folder to check if we have anything and if we have compare them and then update the plan with the new findings 

now we can start extracting from the repos following the plan
lets start with the first step from the plan one step at a time and dont forget to update the plan after each step to know what we extracted and what we need to extract



why did you create this file?
in this phase of the app we are extracting from the repos in the reference folder and adding them to the examples folder


check these repos and you should know two of them
https://github.com/anthropics/claude-code
https://github.com/n8n-io/n8n
https://github.com/onlook-dev/onlook
https://github.com/browseros-ai/BrowserOS

do a quick check to know can we take something from them or update what we have from them with better version from them or they aren't useful for us check them and check the examples folder
so i can add them for you in the reference folder to make deep research to know what we need from them

i added the new repo in the reference folder
i just added n8n and onlook
claude code is not the actual repo its just a docs for claude code
make a deep research to know what we need from the repos in the reference folder
and compare them with what we have to know what we need
and then create md file for the plan to know what we need to extract from the repos in the reference folder

i found this repo
https://github.com/browser-use/browser-use
check it do i add it in the reference folder for you to make deep research to know what we need from it

did you compare it with what we have in the examples folder? to know what to take or do we have something better in the examples folder?

update sub-agents mcp

i added the repo to the reference folder
proceed to make deep research to know what we need from it
and compare it with what we have in the examples folder
then create md file to know what we need to extract from the repo


new sub-agent doc

first check the mcps you have and then check the sub agents we have do they know what mcp they need to use and tools they need to use
also we need an agent for documentation right? we dont have one
so i create one with agent wizard creator check it i added all mcps and tools in it just to see, check it and delete it then create new one for our app
also update the claude.md file to know about the new sub-agent and update the other sub-agents each one need specific mcp and tools and some don't need any mcp or tools right?


i found a lot of ways to use claude.md file

check these ways them and give me your honest opinion without any bias or lies

```md
**Code Splitting**: When a file exceeds ~300 lines or becomes unwieldy, refactor it
into smaller, more modular files. When a function exceeds ~30 lines or does more than
one thing, split it into smaller, purpose-driven functions.|

**File and Function Limits**
Never create a file longer than 500 lines of code. If approaching this limit, refactor by splitting into modules.
Functions should be under 50 lines with a single, clear responsibility.
Classes should be under 100 lines and represent a single concept or entity.
Organize code into clearly separated modules, grouped by feature or responsibility.
Line lenght should be max 100 characters ruff rule in pyproject.toml
Use venv_linux (the virtual environment) whenever executing Python commands, including for unit tests.

**KISS (Keep It Simple, Stupid)**
Simplicity should be a key goal in design. Choose straightforward solutions over complex ones whenever possible. Simple solutions are easier to understand, maintain, and debug.

**YAGNI (You Aren't Gonna Need It)**
Avoid building functionality on speculation. Implement features only when they are needed, not when you anticipate they might be useful in the future.


**Design Principles**
Dependency Inversion: High-level modules should not depend on low-level modules. Both should depend on abstractions.
Open/Closed Principle: Software entities should be open for extension but closed for modification.
Single Responsibility: Each function, class, and module should have one clear purpose.
Fail Fast: Check for potential errors early and raise exceptions immediately when issues occur.
```



i have a question
do we need to update the sub-agents and add to them like what we have in claude.md file? or we dont need the primary agent will read the claude.md and know what to tell the sub-agents to do?
if your not sure check the web to be sure


what about Code Quality Standards section in claude.md file?
do we need to make something similar to it in the sub-agents?
or other section in claude.md file?
or the sub-agents dont need anything else they are good as it is?


check what i found

https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
https://research.google/blog/securing-private-data-at-scale-with-differentially-private-partition-selection/
https://github.com/a2aproject/A2A
https://github.com/ag-ui-protocol/ag-ui
https://github.com/CopilotKit/CopilotKit


i added the three repos to the reference folder
and this is the docs for them
https://a2a-protocol.org/latest/
https://docs.ag-ui.com/introduction
https://docs.copilotkit.ai/

and the ag-ui its value isnt in the ui but how the ai can interact with the frontend

lets start with the first repo
make a deep research to know what we need from it
and compare it with what we have in the examples folder
then create md file for the plan to know what we need to extract from the repo


check the repos files not just the structure and readme file


before we continue why did you created packages folder and package.json file?
we are now in the extraction phase not in the development phase
so do we move them into the examples folder? or remove them and start the extraction again?


good lets continue with the extraction plan


you made the same mistake again
we are now in the extraction phase not in the development phase
and you create files outside the examples folder

we are in the extraction phase and we shouldn't create files outside the examples folder

check the what we extracted
to know check git to know what we did then compare it with the reference folder and plan to make sure

so now we can remove every thing in the reference folder
do one last check of the three repos to make sure we extracted everything we need from them
but before removing it just to make sure 
the ag-ui its value isnt in the ui but how the ai can interact with the frontend
did we extract it?

about a2a
https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
what should we do?
we did extract the repo
https://github.com/a2aproject/A2A
is it related to a2a?


i foun this repo
https://github.com/bytedance/UI-TARS-desktop

i added it to the reference folder
check it

make a deep research to know what we need from it
and compare it with what we have in the examples folder
then create md file for the plan to know what we need to extract from the repo

so its better than what we have right?
lets start extraction


check this
https://research.google/blog/securing-private-data-at-scale-with-differentially-private-partition-selection/
it google latest research


the MAD2R is very good
but how can we use it?
what do we do?

i have a question about the naming conventions
the sub-agents when they build the app theyll use the naming conventions
but will they attach iraqi to everything?
if yes it will be a big mistake



i have a question
will the sub-agents use the examples folder do they know about it?
or do we have it included in claude.md file and the primary agent will tell the sub-agents to use it?
or do we have it included in the initials folder?







generate commit message

git status
git diff --name-only
git diff --stat
git ls-files --others --exclude-standard


is our tech stack good?
not just for now but for the future? 
and when we have 1000+ users or even more tens of thousands of users so we dont need to rewrite the app



check these make deep search
https://google.github.io/adk-docs/
https://research.google/blog/mle-star-a-state-of-the-art-machine-learning-engineering-agents/
https://github.com/ruvnet/claude-flow/wiki/MLE-STAR-Workflow
https://github.com/google/adk-python
https://github.com/google/adk-java
https://github.com/google/mangle

https://github.com/microsoft/rStar
https://github.com/HKUDS/DeepCode
https://github.com/sapientinc/HRM


i added the six repos with their structure file and didnt add claude-flow cus i remember we extracted it before and have it in the examples folder
check to make sure do i add it or not?

i added it lets start with the first repo deep research and then create md file for the plan to know what we need to extract from the repo

compare it with what we have in the examples folder then create md file for the plan to know what we need to extract from the repo or we have something similar to it but the reference is better so we need to change it


before we start the extraction i think we should complete all repos deep research and create extraction plan for each repo
so lets continue with the next repo in the reference folder

lets continue with the deep research with the next repo

are done with the seven repos deep research phase now we start the extraction phase?

lets start the extraction to add from the reference folder to the examples folder following the extraction plan lets start with the first step in the plan


lets continue with the next step in the extraction plan


https://github.com/simstudioai/sim
https://github.com/bytebot-ai/bytebot




https://github.com/coleam00/context-engineering-intro
https://github.com/n8n-io/n8n
https://github.com/langflow-ai/langflow
https://github.com/cline/cline
https://github.com/ruvnet/claude-flow
https://github.com/musistudio/claude-code-router
https://github.com/agent0ai/agent-zero
https://github.com/open-webui/open-webui
https://github.com/dyad-sh/dyad
https://github.com/MervinPraison/PraisonAI
https://github.com/Doriandarko/make-it-heavy
https://github.com/google/mangle
https://github.com/microsoft/rStar
https://github.com/HKUDS/DeepCode
https://github.com/sapientinc/HRM
https://github.com/a2aproject/A2A
https://github.com/ag-ui-protocol/ag-ui
https://github.com/CopilotKit/CopilotKit
https://github.com/block/goose
https://github.com/kortix-ai/suna
https://github.com/bytedance/deer-flow
https://github.com/Fosowl/agenticSeek
https://github.com/stackblitz-labs/bolt.diy
https://github.com/microsoft/autogen
https://github.com/Skyvern-AI/skyvern
https://github.com/NirDiamant/GenAI_Agents
https://github.com/assafelovic/gpt-researcher
https://github.com/botpress/botpress
https://github.com/danny-avila/LibreChat
https://github.com/bytedance/trae-agent
https://github.com/sst/opencode
https://github.com/coleam00/Archon
https://github.com/google-gemini/gemini-cli
https://github.com/browser-use/web-ui
https://github.com/langchain-ai/open-swe
https://github.com/RooCodeInc/Roo-Code
https://github.com/google/adk-python
https://github.com/google/adk-java
https://github.com/bytedance/UI-TARS-desktop
https://github.com/onlook-dev/onlook
https://github.com/QwenLM/qwen-code
https://github.com/browser-use/browser-use
https://github.com/srcbookdev/srcbook
https://github.com/e2b-dev/fragments
https://github.com/browseros-ai/BrowserOS





image generation

































