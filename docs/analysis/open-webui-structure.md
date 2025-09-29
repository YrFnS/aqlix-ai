Directory structure:
└── open-webui-open-webui/
├── README.md
├── CODE_OF_CONDUCT.md
├── confirm_remove.sh
├── contribution_stats.py
├── CONTRIBUTOR_LICENSE_AGREEMENT
├── cypress.config.ts
├── docker-compose.a1111-test.yaml
├── docker-compose.amdgpu.yaml
├── docker-compose.api.yaml
├── docker-compose.data.yaml
├── docker-compose.gpu.yaml
├── docker-compose.otel.yaml
├── docker-compose.playwright.yaml
├── docker-compose.yaml
├── Dockerfile
├── hatch_build.py
├── i18next-parser.config.ts
├── INSTALLATION.md
├── LICENSE
├── LICENSE_HISTORY
├── Makefile
├── package.json
├── postcss.config.js
├── pyproject.toml
├── run-compose.sh
├── run-ollama-docker.sh
├── run.sh
├── svelte.config.js
├── tailwind.config.js
├── TROUBLESHOOTING.md
├── tsconfig.json
├── update_ollama_models.sh
├── vite.config.ts
├── .dockerignore
├── .env.example
├── .eslintignore
├── .eslintrc.cjs
├── .npmrc
├── .prettierignore
├── .prettierrc
├── backend/
│ ├── dev.sh
│ ├── requirements.txt
│ ├── start.sh
│ ├── start_windows.bat
│ ├── .dockerignore
│ ├── data/
│ │ └── readme.txt
│ └── open_webui/
│ ├── **init**.py
│ ├── alembic.ini
│ ├── constants.py
│ ├── env.py
│ ├── functions.py
│ ├── tasks.py
│ ├── data/
│ │ └── readme.txt
│ ├── internal/
│ │ ├── db.py
│ │ ├── wrappers.py
│ │ └── migrations/
│ │ ├── 001_initial_schema.py
│ │ ├── 002_add_local_sharing.py
│ │ ├── 003_add_auth_api_key.py
│ │ ├── 004_add_archived.py
│ │ ├── 005_add_updated_at.py
│ │ ├── 006_migrate_timestamps_and_charfields.py
│ │ ├── 007_add_user_last_active_at.py
│ │ ├── 008_add_memory.py
│ │ ├── 009_add_models.py
│ │ ├── 010_migrate_modelfiles_to_models.py
│ │ ├── 011_add_user_settings.py
│ │ ├── 012_add_tools.py
│ │ ├── 013_add_user_info.py
│ │ ├── 014_add_files.py
│ │ ├── 015_add_functions.py
│ │ ├── 016_add_valves_and_is_active.py
│ │ ├── 017_add_user_oauth_sub.py
│ │ └── 018_add_function_is_global.py
│ ├── migrations/
│ │ ├── README
│ │ ├── env.py
│ │ ├── script.py.mako
│ │ ├── util.py
│ │ └── versions/
│ │ ├── 1af9b942657b_migrate_tags.py
│ │ ├── 242a2047eae0_update_chat_table.py
│ │ ├── 3781e22d8b01_update_message_table.py
│ │ ├── 3ab32c4b8f59_update_tags.py
│ │ ├── 4ace53fd72c8_update_folder_table_datetime.py
│ │ ├── 57c599a3cb57_add_channel_table.py
│ │ ├── 6a39f3d8e55c_add_knowledge_table.py
│ │ ├── 7826ab40b532_update_file_table.py
│ │ ├── 7e5b5dc7342b_init.py
│ │ ├── 922e7a387820_add_group_table.py
│ │ ├── 9f0c9cd09105_add_note_table.py
│ │ ├── af906e964978_add_feedback_table.py
│ │ ├── c0fbf31ca0db_update_file_table.py
│ │ ├── c29facfe716b_update_file_table_path.py
│ │ ├── c69f45358db4_add_folder_table.py
│ │ ├── ca81bd47c050_add_config_table.py
│ │ └── d31026856c01_update_folder_table_data.py
│ ├── models/
│ │ ├── auths.py
│ │ ├── channels.py
│ │ ├── chats.py
│ │ ├── feedbacks.py
│ │ ├── files.py
│ │ ├── folders.py
│ │ ├── functions.py
│ │ ├── groups.py
│ │ ├── knowledge.py
│ │ ├── memories.py
│ │ ├── messages.py
│ │ ├── models.py
│ │ ├── notes.py
│ │ ├── prompts.py
│ │ ├── tags.py
│ │ ├── tools.py
│ │ └── users.py
│ ├── retrieval/
│ │ ├── utils.py
│ │ ├── loaders/
│ │ │ ├── datalab_marker.py
│ │ │ ├── external_document.py
│ │ │ ├── external_web.py
│ │ │ ├── main.py
│ │ │ ├── mistral.py
│ │ │ ├── tavily.py
│ │ │ └── youtube.py
│ │ ├── models/
│ │ │ ├── base_reranker.py
│ │ │ ├── colbert.py
│ │ │ └── external.py
│ │ ├── vector/
│ │ │ ├── factory.py
│ │ │ ├── main.py
│ │ │ ├── type.py
│ │ │ └── dbs/
│ │ │ ├── chroma.py
│ │ │ ├── elasticsearch.py
│ │ │ ├── milvus.py
│ │ │ ├── opensearch.py
│ │ │ ├── pgvector.py
│ │ │ ├── pinecone.py
│ │ │ ├── qdrant.py
│ │ │ └── qdrant_multitenancy.py
│ │ └── web/
│ │ ├── bing.py
│ │ ├── bocha.py
│ │ ├── brave.py
│ │ ├── duckduckgo.py
│ │ ├── exa.py
│ │ ├── external.py
│ │ ├── firecrawl.py
│ │ ├── google_pse.py
│ │ ├── jina_search.py
│ │ ├── kagi.py
│ │ ├── main.py
│ │ ├── mojeek.py
│ │ ├── perplexity.py
│ │ ├── searchapi.py
│ │ ├── searxng.py
│ │ ├── serpapi.py
│ │ ├── serper.py
│ │ ├── serply.py
│ │ ├── serpstack.py
│ │ ├── sougou.py
│ │ ├── tavily.py
│ │ ├── utils.py
│ │ ├── yacy.py
│ │ └── testdata/
│ │ ├── bing.json
│ │ ├── google_pse.json
│ │ ├── searxng.json
│ │ ├── serper.json
│ │ ├── serply.json
│ │ └── serpstack.json
│ ├── routers/
│ │ ├── audio.py
│ │ ├── auths.py
│ │ ├── channels.py
│ │ ├── chats.py
│ │ ├── configs.py
│ │ ├── evaluations.py
│ │ ├── files.py
│ │ ├── folders.py
│ │ ├── functions.py
│ │ ├── groups.py
│ │ ├── images.py
│ │ ├── knowledge.py
│ │ ├── memories.py
│ │ ├── models.py
│ │ ├── notes.py
│ │ ├── openai.py
│ │ ├── pipelines.py
│ │ ├── prompts.py
│ │ ├── tasks.py
│ │ ├── tools.py
│ │ ├── users.py
│ │ └── utils.py
│ ├── socket/
│ │ ├── main.py
│ │ └── utils.py
│ ├── static/
│ │ ├── custom.css
│ │ ├── loader.js
│ │ ├── site.webmanifest
│ │ ├── user-import.csv
│ │ └── assets/
│ │ └── pdf-style.css
│ ├── storage/
│ │ └── provider.py
│ ├── test/
│ │ ├── **init**.py
│ │ ├── apps/
│ │ │ └── webui/
│ │ │ ├── routers/
│ │ │ │ ├── test_auths.py
│ │ │ │ ├── test_chats.py
│ │ │ │ ├── test_models.py
│ │ │ │ ├── test_prompts.py
│ │ │ │ └── test_users.py
│ │ │ └── storage/
│ │ │ └── test_provider.py
│ │ └── util/
│ │ ├── abstract_integration_test.py
│ │ ├── mock_user.py
│ │ └── test_redis.py
│ └── utils/
│ ├── access_control.py
│ ├── audit.py
│ ├── auth.py
│ ├── chat.py
│ ├── code_interpreter.py
│ ├── embeddings.py
│ ├── filter.py
│ ├── logger.py
│ ├── misc.py
│ ├── models.py
│ ├── oauth.py
│ ├── payload.py
│ ├── pdf_generator.py
│ ├── plugin.py
│ ├── redis.py
│ ├── response.py
│ ├── security_headers.py
│ ├── task.py
│ ├── tools.py
│ ├── webhook.py
│ ├── images/
│ │ └── comfyui.py
│ └── telemetry/
│ ├── **init**.py
│ ├── constants.py
│ ├── exporters.py
│ ├── instrumentors.py
│ ├── metrics.py
│ └── setup.py
├── cypress/
│ ├── tsconfig.json
│ ├── data/
│ │ └── example-doc.txt
│ ├── e2e/
│ │ ├── chat.cy.ts
│ │ ├── documents.cy.ts
│ │ ├── registration.cy.ts
│ │ └── settings.cy.ts
│ └── support/
│ ├── e2e.ts
│ └── index.d.ts
├── docs/
│ ├── README.md
│ ├── apache.md
│ ├── CONTRIBUTING.md
│ └── SECURITY.md
├── kubernetes/
│ ├── helm/
│ │ └── README.md
│ └── manifest/
│ ├── base/
│ │ ├── kustomization.yaml
│ │ ├── ollama-service.yaml
│ │ ├── ollama-statefulset.yaml
│ │ ├── open-webui.yaml
│ │ ├── webui-deployment.yaml
│ │ ├── webui-ingress.yaml
│ │ ├── webui-pvc.yaml
│ │ └── webui-service.yaml
│ └── gpu/
│ ├── kustomization.yaml
│ └── ollama-statefulset-gpu.yaml
├── scripts/
│ └── prepare-pyodide.js
├── src/
│ ├── app.css
│ ├── app.d.ts
│ ├── app.html
│ ├── tailwind.css
│ ├── lib/
│ │ ├── constants.ts
│ │ ├── dayjs.js
│ │ ├── index.ts
│ │ ├── apis/
│ │ │ ├── index.ts
│ │ │ ├── audio/
│ │ │ │ └── index.ts
│ │ │ ├── auths/
│ │ │ │ └── index.ts
│ │ │ ├── channels/
│ │ │ │ └── index.ts
│ │ │ ├── chats/
│ │ │ │ └── index.ts
│ │ │ ├── configs/
│ │ │ │ └── index.ts
│ │ │ ├── evaluations/
│ │ │ │ └── index.ts
│ │ │ ├── files/
│ │ │ │ └── index.ts
│ │ │ ├── folders/
│ │ │ │ └── index.ts
│ │ │ ├── functions/
│ │ │ │ └── index.ts
│ │ │ ├── groups/
│ │ │ │ └── index.ts
│ │ │ ├── images/
│ │ │ │ └── index.ts
│ │ │ ├── knowledge/
│ │ │ │ └── index.ts
│ │ │ ├── memories/
│ │ │ │ └── index.ts
│ │ │ ├── models/
│ │ │ │ └── index.ts
│ │ │ ├── notes/
│ │ │ │ └── index.ts
│ │ │ ├── ollama/
│ │ │ │ └── index.ts
│ │ │ ├── openai/
│ │ │ │ └── index.ts
│ │ │ ├── prompts/
│ │ │ │ └── index.ts
│ │ │ ├── retrieval/
│ │ │ │ └── index.ts
│ │ │ ├── streaming/
│ │ │ │ └── index.ts
│ │ │ ├── tools/
│ │ │ │ └── index.ts
│ │ │ ├── users/
│ │ │ │ └── index.ts
│ │ │ └── utils/
│ │ │ └── index.ts
│ │ ├── components/
│ │ │ ├── AddConnectionModal.svelte
│ │ │ ├── AddFilesPlaceholder.svelte
│ │ │ ├── AddServerModal.svelte
│ │ │ ├── ChangelogModal.svelte
│ │ │ ├── ImportModal.svelte
│ │ │ ├── NotificationToast.svelte
│ │ │ ├── OnBoarding.svelte
│ │ │ ├── admin/
│ │ │ │ ├── Evaluations.svelte
│ │ │ │ ├── Functions.svelte
│ │ │ │ ├── Settings.svelte
│ │ │ │ ├── Users.svelte
│ │ │ │ ├── Evaluations/
│ │ │ │ │ ├── FeedbackMenu.svelte
│ │ │ │ │ ├── FeedbackModal.svelte
│ │ │ │ │ ├── Feedbacks.svelte
│ │ │ │ │ ├── Leaderboard.svelte
│ │ │ │ │ └── LeaderboardModal.svelte
│ │ │ │ ├── Functions/
│ │ │ │ │ ├── AddFunctionMenu.svelte
│ │ │ │ │ ├── FunctionEditor.svelte
│ │ │ │ │ └── FunctionMenu.svelte
│ │ │ │ ├── Settings/
│ │ │ │ │ ├── Audio.svelte
│ │ │ │ │ ├── CodeExecution.svelte
│ │ │ │ │ ├── Connections.svelte
│ │ │ │ │ ├── Database.svelte
│ │ │ │ │ ├── Documents.svelte
│ │ │ │ │ ├── Evaluations.svelte
│ │ │ │ │ ├── General.svelte
│ │ │ │ │ ├── Images.svelte
│ │ │ │ │ ├── Interface.svelte
│ │ │ │ │ ├── Models.svelte
│ │ │ │ │ ├── Pipelines.svelte
│ │ │ │ │ ├── Tools.svelte
│ │ │ │ │ ├── WebSearch.svelte
│ │ │ │ │ ├── Connections/
│ │ │ │ │ │ ├── ManageOllamaModal.svelte
│ │ │ │ │ │ ├── OllamaConnection.svelte
│ │ │ │ │ │ └── OpenAIConnection.svelte
│ │ │ │ │ ├── Evaluations/
│ │ │ │ │ │ ├── ArenaModelModal.svelte
│ │ │ │ │ │ └── Model.svelte
│ │ │ │ │ ├── Interface/
│ │ │ │ │ │ └── Banners.svelte
│ │ │ │ │ └── Models/
│ │ │ │ │ ├── ConfigureModelsModal.svelte
│ │ │ │ │ ├── ManageModelsModal.svelte
│ │ │ │ │ ├── ModelList.svelte
│ │ │ │ │ ├── ModelMenu.svelte
│ │ │ │ │ └── Manage/
│ │ │ │ │ ├── ManageMultipleOllama.svelte
│ │ │ │ │ └── ManageOllama.svelte
│ │ │ │ └── Users/
│ │ │ │ ├── Groups.svelte
│ │ │ │ ├── UserList.svelte
│ │ │ │ ├── Groups/
│ │ │ │ │ ├── AddGroupModal.svelte
│ │ │ │ │ ├── Display.svelte
│ │ │ │ │ ├── EditGroupModal.svelte
│ │ │ │ │ ├── GroupItem.svelte
│ │ │ │ │ ├── Permissions.svelte
│ │ │ │ │ └── Users.svelte
│ │ │ │ └── UserList/
│ │ │ │ ├── AddUserModal.svelte
│ │ │ │ ├── EditUserModal.svelte
│ │ │ │ └── UserChatsModal.svelte
│ │ │ ├── app/
│ │ │ │ └── AppSidebar.svelte
│ │ │ ├── channel/
│ │ │ │ ├── Channel.svelte
│ │ │ │ ├── MessageInput.svelte
│ │ │ │ ├── Messages.svelte
│ │ │ │ ├── Navbar.svelte
│ │ │ │ ├── Thread.svelte
│ │ │ │ ├── MessageInput/
│ │ │ │ │ └── InputMenu.svelte
│ │ │ │ └── Messages/
│ │ │ │ ├── Message.svelte
│ │ │ │ └── Message/
│ │ │ │ ├── ProfilePreview.svelte
│ │ │ │ └── ReactionPicker.svelte
│ │ │ ├── chat/
│ │ │ │ ├── Artifacts.svelte
│ │ │ │ ├── ChatControls.svelte
│ │ │ │ ├── ChatPlaceholder.svelte
│ │ │ │ ├── Messages.svelte
│ │ │ │ ├── ModelSelector.svelte
│ │ │ │ ├── Navbar.svelte
│ │ │ │ ├── Overview.svelte
│ │ │ │ ├── Placeholder.svelte
│ │ │ │ ├── SettingsModal.svelte
│ │ │ │ ├── ShareChatModal.svelte
│ │ │ │ ├── ShortcutsModal.svelte
│ │ │ │ ├── Suggestions.svelte
│ │ │ │ ├── TagChatModal.svelte
│ │ │ │ ├── Tags.svelte
│ │ │ │ ├── ToolServersModal.svelte
│ │ │ │ ├── ContentRenderer/
│ │ │ │ │ └── FloatingButtons.svelte
│ │ │ │ ├── Controls/
│ │ │ │ │ ├── Controls.svelte
│ │ │ │ │ └── Valves.svelte
│ │ │ │ ├── MessageInput/
│ │ │ │ │ ├── CallOverlay.svelte
│ │ │ │ │ ├── Commands.svelte
│ │ │ │ │ ├── FilesOverlay.svelte
│ │ │ │ │ ├── InputMenu.svelte
│ │ │ │ │ ├── InputVariablesModal.svelte
│ │ │ │ │ ├── VoiceRecording.svelte
│ │ │ │ │ ├── CallOverlay/
│ │ │ │ │ │ └── VideoInputMenu.svelte
│ │ │ │ │ └── Commands/
│ │ │ │ │ ├── Knowledge.svelte
│ │ │ │ │ ├── Models.svelte
│ │ │ │ │ └── Prompts.svelte
│ │ │ │ ├── Messages/
│ │ │ │ │ ├── Citations.svelte
│ │ │ │ │ ├── CitationsModal.svelte
│ │ │ │ │ ├── CodeBlock.svelte
│ │ │ │ │ ├── CodeExecutionModal.svelte
│ │ │ │ │ ├── CodeExecutions.svelte
│ │ │ │ │ ├── ContentRenderer.svelte
│ │ │ │ │ ├── Error.svelte
│ │ │ │ │ ├── Markdown.svelte
│ │ │ │ │ ├── Message.svelte
│ │ │ │ │ ├── MultiResponseMessages.svelte
│ │ │ │ │ ├── Name.svelte
│ │ │ │ │ ├── ProfileImage.svelte
│ │ │ │ │ ├── RateComment.svelte
│ │ │ │ │ ├── ResponseMessage.svelte
│ │ │ │ │ ├── Skeleton.svelte
│ │ │ │ │ ├── UserMessage.svelte
│ │ │ │ │ ├── Markdown/
│ │ │ │ │ │ ├── AlertRenderer.svelte
│ │ │ │ │ │ ├── HTMLToken.svelte
│ │ │ │ │ │ ├── KatexRenderer.svelte
│ │ │ │ │ │ ├── MarkdownInlineTokens.svelte
│ │ │ │ │ │ ├── MarkdownTokens.svelte
│ │ │ │ │ │ ├── Source.svelte
│ │ │ │ │ │ └── MarkdownInlineTokens/
│ │ │ │ │ │ ├── CodespanToken.svelte
│ │ │ │ │ │ └── TextToken.svelte
│ │ │ │ │ └── ResponseMessage/
│ │ │ │ │ ├── FollowUps.svelte
│ │ │ │ │ └── WebSearchResults.svelte
│ │ │ │ ├── ModelSelector/
│ │ │ │ │ ├── ModelItem.svelte
│ │ │ │ │ ├── ModelItemMenu.svelte
│ │ │ │ │ └── Selector.svelte
│ │ │ │ ├── Overview/
│ │ │ │ │ ├── Flow.svelte
│ │ │ │ │ └── Node.svelte
│ │ │ │ ├── Placeholder/
│ │ │ │ │ ├── ChatList.svelte
│ │ │ │ │ ├── FolderKnowledge.svelte
│ │ │ │ │ ├── FolderPlaceholder.svelte
│ │ │ │ │ └── FolderTitle.svelte
│ │ │ │ └── Settings/
│ │ │ │ ├── About.svelte
│ │ │ │ ├── Account.svelte
│ │ │ │ ├── Audio.svelte
│ │ │ │ ├── Chats.svelte
│ │ │ │ ├── Connections.svelte
│ │ │ │ ├── General.svelte
│ │ │ │ ├── Interface.svelte
│ │ │ │ ├── Personalization.svelte
│ │ │ │ ├── Tools.svelte
│ │ │ │ ├── Account/
│ │ │ │ │ └── UpdatePassword.svelte
│ │ │ │ ├── Advanced/
│ │ │ │ │ └── AdvancedParams.svelte
│ │ │ │ ├── Connections/
│ │ │ │ │ └── Connection.svelte
│ │ │ │ ├── Personalization/
│ │ │ │ │ ├── AddMemoryModal.svelte
│ │ │ │ │ ├── EditMemoryModal.svelte
│ │ │ │ │ └── ManageModal.svelte
│ │ │ │ └── Tools/
│ │ │ │ └── Connection.svelte
│ │ │ ├── common/
│ │ │ │ ├── Badge.svelte
│ │ │ │ ├── Banner.svelte
│ │ │ │ ├── Checkbox.svelte
│ │ │ │ ├── CodeEditor.svelte
│ │ │ │ ├── Collapsible.svelte
│ │ │ │ ├── ConfirmDialog.svelte
│ │ │ │ ├── DragGhost.svelte
│ │ │ │ ├── Drawer.svelte
│ │ │ │ ├── Dropdown.svelte
│ │ │ │ ├── FileItem.svelte
│ │ │ │ ├── FileItemModal.svelte
│ │ │ │ ├── Folder.svelte
│ │ │ │ ├── Image.svelte
│ │ │ │ ├── ImagePreview.svelte
│ │ │ │ ├── Loader.svelte
│ │ │ │ ├── Marquee.svelte
│ │ │ │ ├── Modal.svelte
│ │ │ │ ├── Overlay.svelte
│ │ │ │ ├── Pagination.svelte
│ │ │ │ ├── RichTextInput.svelte
│ │ │ │ ├── Selector.svelte
│ │ │ │ ├── SensitiveInput.svelte
│ │ │ │ ├── Sidebar.svelte
│ │ │ │ ├── SlideShow.svelte
│ │ │ │ ├── Spinner.svelte
│ │ │ │ ├── SVGPanZoom.svelte
│ │ │ │ ├── Switch.svelte
│ │ │ │ ├── Tags.svelte
│ │ │ │ ├── Textarea.svelte
│ │ │ │ ├── Tooltip.svelte
│ │ │ │ ├── Valves.svelte
│ │ │ │ ├── RichTextInput/
│ │ │ │ │ ├── AutoCompletion.js
│ │ │ │ │ ├── FormattingButtons.svelte
│ │ │ │ │ └── Image/
│ │ │ │ │ ├── image.ts
│ │ │ │ │ └── index.ts
│ │ │ │ ├── Tags/
│ │ │ │ │ ├── TagInput.svelte
│ │ │ │ │ └── TagList.svelte
│ │ │ │ └── Valves/
│ │ │ │ └── MapSelector.svelte
│ │ │ ├── icons/
│ │ │ │ ├── AdjustmentsHorizontal.svelte
│ │ │ │ ├── AdjustmentsHorizontalOutline.svelte
│ │ │ │ ├── ArchiveBox.svelte
│ │ │ │ ├── ArrowDownTray.svelte
│ │ │ │ ├── ArrowLeft.svelte
│ │ │ │ ├── ArrowLeftTag.svelte
│ │ │ │ ├── ArrowPath.svelte
│ │ │ │ ├── ArrowRight.svelte
│ │ │ │ ├── ArrowRightCircle.svelte
│ │ │ │ ├── ArrowRightTag.svelte
│ │ │ │ ├── ArrowsPointingOut.svelte
│ │ │ │ ├── ArrowTurnDownRight.svelte
│ │ │ │ ├── ArrowUpCircle.svelte
│ │ │ │ ├── ArrowUpLeft.svelte
│ │ │ │ ├── ArrowUpTray.svelte
│ │ │ │ ├── ArrowUturnLeft.svelte
│ │ │ │ ├── ArrowUturnRight.svelte
│ │ │ │ ├── Bars3BottomLeft.svelte
│ │ │ │ ├── BarsArrowUp.svelte
│ │ │ │ ├── Bold.svelte
│ │ │ │ ├── Bolt.svelte
│ │ │ │ ├── Bookmark.svelte
│ │ │ │ ├── BookmarkSlash.svelte
│ │ │ │ ├── BookOpen.svelte
│ │ │ │ ├── Calendar.svelte
│ │ │ │ ├── CalendarSolid.svelte
│ │ │ │ ├── CameraSolid.svelte
│ │ │ │ ├── ChartBar.svelte
│ │ │ │ ├── ChatBubble.svelte
│ │ │ │ ├── ChatBubbleOval.svelte
│ │ │ │ ├── ChatBubbleOvalEllipsis.svelte
│ │ │ │ ├── ChatBubbles.svelte
│ │ │ │ ├── Check.svelte
│ │ │ │ ├── CheckBox.svelte
│ │ │ │ ├── CheckCircle.svelte
│ │ │ │ ├── ChevronDown.svelte
│ │ │ │ ├── ChevronLeft.svelte
│ │ │ │ ├── ChevronRight.svelte
│ │ │ │ ├── ChevronUp.svelte
│ │ │ │ ├── ChevronUpDown.svelte
│ │ │ │ ├── Clipboard.svelte
│ │ │ │ ├── CloudArrowUp.svelte
│ │ │ │ ├── Code.svelte
│ │ │ │ ├── CodeBracket.svelte
│ │ │ │ ├── Cog6.svelte
│ │ │ │ ├── Cog6Solid.svelte
│ │ │ │ ├── CommandLine.svelte
│ │ │ │ ├── CommandLineSolid.svelte
│ │ │ │ ├── Cube.svelte
│ │ │ │ ├── CursorArrowRays.svelte
│ │ │ │ ├── Document.svelte
│ │ │ │ ├── DocumentArrowDown.svelte
│ │ │ │ ├── DocumentArrowUp.svelte
│ │ │ │ ├── DocumentArrowUpSolid.svelte
│ │ │ │ ├── DocumentChartBar.svelte
│ │ │ │ ├── DocumentCheck.svelte
│ │ │ │ ├── DocumentDuplicate.svelte
│ │ │ │ ├── Download.svelte
│ │ │ │ ├── EllipsisHorizontal.svelte
│ │ │ │ ├── EllipsisVertical.svelte
│ │ │ │ ├── Eye.svelte
│ │ │ │ ├── EyeSlash.svelte
│ │ │ │ ├── FaceSmile.svelte
│ │ │ │ ├── FloppyDisk.svelte
│ │ │ │ ├── Folder.svelte
│ │ │ │ ├── FolderOpen.svelte
│ │ │ │ ├── GarbageBin.svelte
│ │ │ │ ├── Github.svelte
│ │ │ │ ├── GlobeAlt.svelte
│ │ │ │ ├── GlobeAltSolid.svelte
│ │ │ │ ├── H1.svelte
│ │ │ │ ├── H2.svelte
│ │ │ │ ├── H3.svelte
│ │ │ │ ├── Headphone.svelte
│ │ │ │ ├── Heart.svelte
│ │ │ │ ├── Home.svelte
│ │ │ │ ├── Info.svelte
│ │ │ │ ├── Italic.svelte
│ │ │ │ ├── Keyboard.svelte
│ │ │ │ ├── Lifebuoy.svelte
│ │ │ │ ├── LightBulb.svelte
│ │ │ │ ├── Link.svelte
│ │ │ │ ├── ListBullet.svelte
│ │ │ │ ├── LockClosed.svelte
│ │ │ │ ├── Map.svelte
│ │ │ │ ├── MenuLines.svelte
│ │ │ │ ├── Merge.svelte
│ │ │ │ ├── Mic.svelte
│ │ │ │ ├── MicSolid.svelte
│ │ │ │ ├── Minus.svelte
│ │ │ │ ├── NumberedList.svelte
│ │ │ │ ├── Pencil.svelte
│ │ │ │ ├── PencilSolid.svelte
│ │ │ │ ├── PencilSquare.svelte
│ │ │ │ ├── Photo.svelte
│ │ │ │ ├── PhotoSolid.svelte
│ │ │ │ ├── Plus.svelte
│ │ │ │ ├── QuestionMarkCircle.svelte
│ │ │ │ ├── QueueList.svelte
│ │ │ │ ├── Reset.svelte
│ │ │ │ ├── Search.svelte
│ │ │ │ ├── Settings.svelte
│ │ │ │ ├── Share.svelte
│ │ │ │ ├── SignOut.svelte
│ │ │ │ ├── Sparkles.svelte
│ │ │ │ ├── SparklesSolid.svelte
│ │ │ │ ├── Star.svelte
│ │ │ │ ├── Strikethrough.svelte
│ │ │ │ ├── Underline.svelte
│ │ │ │ ├── User.svelte
│ │ │ │ ├── UserCircleSolid.svelte
│ │ │ │ ├── UserGroup.svelte
│ │ │ │ ├── UserPlusSolid.svelte
│ │ │ │ ├── Users.svelte
│ │ │ │ ├── UsersSolid.svelte
│ │ │ │ ├── Wrench.svelte
│ │ │ │ ├── WrenchSolid.svelte
│ │ │ │ └── XMark.svelte
│ │ │ ├── layout/
│ │ │ │ ├── ArchivedChatsModal.svelte
│ │ │ │ ├── ChatsModal.svelte
│ │ │ │ ├── Navbar.svelte
│ │ │ │ ├── SearchModal.svelte
│ │ │ │ ├── Sidebar.svelte
│ │ │ │ ├── UpdateInfoToast.svelte
│ │ │ │ ├── Navbar/
│ │ │ │ │ └── Menu.svelte
│ │ │ │ ├── Overlay/
│ │ │ │ │ └── AccountPending.svelte
│ │ │ │ └── Sidebar/
│ │ │ │ ├── ChannelItem.svelte
│ │ │ │ ├── ChannelModal.svelte
│ │ │ │ ├── ChatItem.svelte
│ │ │ │ ├── ChatMenu.svelte
│ │ │ │ ├── Folders.svelte
│ │ │ │ ├── RecursiveFolder.svelte
│ │ │ │ ├── SearchInput.svelte
│ │ │ │ ├── UserMenu.svelte
│ │ │ │ └── Folders/
│ │ │ │ ├── FolderMenu.svelte
│ │ │ │ └── FolderModal.svelte
│ │ │ ├── notes/
│ │ │ │ ├── AIMenu.svelte
│ │ │ │ ├── NoteEditor.svelte
│ │ │ │ ├── NotePanel.svelte
│ │ │ │ ├── Notes.svelte
│ │ │ │ ├── RecordMenu.svelte
│ │ │ │ ├── NoteEditor/
│ │ │ │ │ ├── Chat.svelte
│ │ │ │ │ ├── Controls.svelte
│ │ │ │ │ └── Chat/
│ │ │ │ │ ├── Message.svelte
│ │ │ │ │ └── Messages.svelte
│ │ │ │ └── Notes/
│ │ │ │ └── NoteMenu.svelte
│ │ │ ├── playground/
│ │ │ │ ├── Chat.svelte
│ │ │ │ ├── Completions.svelte
│ │ │ │ └── Chat/
│ │ │ │ ├── Message.svelte
│ │ │ │ └── Messages.svelte
│ │ │ └── workspace/
│ │ │ ├── Knowledge.svelte
│ │ │ ├── Models.svelte
│ │ │ ├── Prompts.svelte
│ │ │ ├── Tools.svelte
│ │ │ ├── common/
│ │ │ │ ├── AccessControl.svelte
│ │ │ │ ├── AccessControlModal.svelte
│ │ │ │ ├── ManifestModal.svelte
│ │ │ │ └── ValvesModal.svelte
│ │ │ ├── Knowledge/
│ │ │ │ ├── CreateKnowledgeBase.svelte
│ │ │ │ ├── ItemMenu.svelte
│ │ │ │ ├── KnowledgeBase.svelte
│ │ │ │ └── KnowledgeBase/
│ │ │ │ ├── AddContentMenu.svelte
│ │ │ │ ├── AddTextContentModal.svelte
│ │ │ │ └── Files.svelte
│ │ │ ├── Models/
│ │ │ │ ├── ActionsSelector.svelte
│ │ │ │ ├── Capabilities.svelte
│ │ │ │ ├── FiltersSelector.svelte
│ │ │ │ ├── Knowledge.svelte
│ │ │ │ ├── ModelEditor.svelte
│ │ │ │ ├── ModelMenu.svelte
│ │ │ │ ├── ToolsSelector.svelte
│ │ │ │ └── Knowledge/
│ │ │ │ └── Selector.svelte
│ │ │ ├── Prompts/
│ │ │ │ ├── PromptEditor.svelte
│ │ │ │ └── PromptMenu.svelte
│ │ │ └── Tools/
│ │ │ ├── AddToolMenu.svelte
│ │ │ ├── ToolkitEditor.svelte
│ │ │ └── ToolMenu.svelte
│ │ ├── i18n/
│ │ │ ├── index.ts
│ │ │ └── locales/
│ │ │ └── languages.json
│ │ ├── pyodide/
│ │ │ ├── pyodideKernel.ts
│ │ │ └── pyodideKernel.worker.ts
│ │ ├── stores/
│ │ │ └── index.ts
│ │ ├── types/
│ │ │ └── index.ts
│ │ ├── utils/
│ │ │ ├── \_template_old.ts
│ │ │ ├── google-drive-picker.ts
│ │ │ ├── index.ts
│ │ │ ├── onedrive-file-picker.ts
│ │ │ ├── characters/
│ │ │ │ └── index.ts
│ │ │ ├── marked/
│ │ │ │ ├── extension.ts
│ │ │ │ └── katex-extension.ts
│ │ │ └── transitions/
│ │ │ └── index.ts
│ │ └── workers/
│ │ ├── kokoro.worker.ts
│ │ ├── KokoroWorker.ts
│ │ └── pyodide.worker.ts
│ └── routes/
│ ├── +error.svelte
│ ├── +layout.js
│ ├── +layout.svelte
│ ├── (app)/
│ │ ├── +layout.svelte
│ │ ├── +page.svelte
│ │ ├── admin/
│ │ │ ├── +layout.svelte
│ │ │ ├── +page.svelte
│ │ │ ├── evaluations/
│ │ │ │ ├── +page.svelte
│ │ │ │ └── [tab]/
│ │ │ │ └── +page.svelte
│ │ │ ├── functions/
│ │ │ │ ├── +page.svelte
│ │ │ │ ├── create/
│ │ │ │ │ └── +page.svelte
│ │ │ │ └── edit/
│ │ │ │ └── +page.svelte
│ │ │ ├── settings/
│ │ │ │ ├── +page.svelte
│ │ │ │ └── [tab]/
│ │ │ │ └── +page.svelte
│ │ │ └── users/
│ │ │ ├── +page.svelte
│ │ │ └── [tab]/
│ │ │ └── +page.svelte
│ │ ├── c/
│ │ │ └── [id]/
│ │ │ └── +page.svelte
│ │ ├── channels/
│ │ │ └── [id]/
│ │ │ └── +page.svelte
│ │ ├── home/
│ │ │ ├── +layout.svelte
│ │ │ └── +page.svelte
│ │ ├── notes/
│ │ │ ├── +layout.svelte
│ │ │ ├── +page.svelte
│ │ │ └── [id]/
│ │ │ └── +page.svelte
│ │ ├── playground/
│ │ │ ├── +layout.svelte
│ │ │ ├── +page.svelte
│ │ │ └── completions/
│ │ │ └── +page.svelte
│ │ └── workspace/
│ │ ├── +layout.svelte
│ │ ├── +page.svelte
│ │ ├── functions/
│ │ │ └── create/
│ │ │ └── +page.svelte
│ │ ├── knowledge/
│ │ │ ├── +page.svelte
│ │ │ ├── [id]/
│ │ │ │ └── +page.svelte
│ │ │ └── create/
│ │ │ └── +page.svelte
│ │ ├── models/
│ │ │ ├── +page.svelte
│ │ │ ├── create/
│ │ │ │ └── +page.svelte
│ │ │ └── edit/
│ │ │ └── +page.svelte
│ │ ├── prompts/
│ │ │ ├── +page.svelte
│ │ │ ├── create/
│ │ │ │ └── +page.svelte
│ │ │ └── edit/
│ │ │ └── +page.svelte
│ │ └── tools/
│ │ ├── +page.svelte
│ │ ├── create/
│ │ │ └── +page.svelte
│ │ └── edit/
│ │ └── +page.svelte
│ ├── auth/
│ │ └── +page.svelte
│ ├── error/
│ │ └── +page.svelte
│ ├── s/
│ │ └── [id]/
│ │ └── +page.svelte
│ └── watch/
│ └── +page.svelte
├── static/
│ ├── manifest.json
│ ├── opensearch.xml
│ ├── robots.txt
│ ├── static/
│ │ ├── custom.css
│ │ ├── loader.js
│ │ ├── site.webmanifest
│ │ └── user-import.csv
│ └── themes/
│ ├── rosepine-dawn.css
│ └── rosepine.css
├── test/
│ └── test_files/
│ └── image_gen/
│ └── sd-empty.pt
└── .github/
├── dependabot.yml
├── FUNDING.yml
├── pull_request_template.md
├── ISSUE_TEMPLATE/
│ ├── bug_report.yaml
│ ├── config.yml
│ └── feature_request.yaml
└── workflows/
├── build-release.yml
├── codespell.disabled
├── deploy-to-hf-spaces.yml
├── docker-build.yaml
├── format-backend.yaml
├── format-build-frontend.yaml
├── integration-test.disabled
├── lint-backend.disabled
├── lint-frontend.disabled
└── release-pypi.yml
