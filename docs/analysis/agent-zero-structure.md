Directory structure:
└── agent0ai-agent-zero/
├── README.md
├── agent.py
├── DockerfileLocal
├── initialize.py
├── jsconfig.json
├── LICENSE
├── models.py
├── preload.py
├── prepare.py
├── requirements.txt
├── run_cli.py
├── run_tunnel.py
├── run_ui.py
├── update_reqs.py
├── .dockerignore
├── docker/
│ ├── base/
│ │ ├── build.txt
│ │ ├── Dockerfile
│ │ └── fs/
│ │ ├── etc/
│ │ │ └── searxng/
│ │ │ ├── limiter.toml
│ │ │ └── settings.yml
│ │ └── ins/
│ │ ├── after_install.sh
│ │ ├── configure_ssh.sh
│ │ ├── install_base_packages1.sh
│ │ ├── install_base_packages2.sh
│ │ ├── install_base_packages3.sh
│ │ ├── install_base_packages4.sh
│ │ ├── install_python.sh
│ │ ├── install_searxng.sh
│ │ └── install_searxng2.sh
│ └── run/
│ ├── build.txt
│ ├── docker-compose.yml
│ ├── Dockerfile
│ └── fs/
│ ├── etc/
│ │ ├── nginx/
│ │ │ └── nginx.conf
│ │ ├── searxng/
│ │ │ ├── limiter.toml
│ │ │ └── settings.yml
│ │ └── supervisor/
│ │ └── conf.d/
│ │ └── supervisord.conf
│ ├── exe/
│ │ ├── initialize.sh
│ │ ├── node_eval.js
│ │ ├── run_A0.sh
│ │ ├── run_searxng.sh
│ │ ├── run_tunnel_api.sh
│ │ └── supervisor_event_listener.py
│ ├── ins/
│ │ ├── copy_A0.sh
│ │ ├── install_A0.sh
│ │ ├── install_A02.sh
│ │ ├── install_additional.sh
│ │ ├── install_playwright.sh
│ │ ├── post_install.sh
│ │ ├── pre_install.sh
│ │ ├── setup_ssh.sh
│ │ └── setup_venv.sh
│ └── per/
│ └── root/
│ ├── .bashrc
│ └── .profile
├── docs/
│ ├── README.md
│ ├── architecture.md
│ ├── contribution.md
│ ├── development.md
│ ├── extensibility.md
│ ├── installation.md
│ ├── mcp_setup.md
│ ├── quickstart.md
│ ├── troubleshooting.md
│ ├── tunnel.md
│ ├── usage.md
│ ├── designs/
│ │ ├── backup-specification-backend.md
│ │ └── backup-specification-frontend.md
│ └── res/
│ ├── splash.webp
│ └── a0-vector-graphics/
│ └── a0LogoVector.ai
├── instruments/
│ ├── custom/
│ │ └── .gitkeep
│ └── default/
│ ├── .gitkeep
│ └── yt_download/
│ ├── download_video.py
│ ├── yt_download.md
│ └── yt_download.sh
├── knowledge/
│ ├── .gitkeep
│ ├── custom/
│ │ ├── .gitkeep
│ │ ├── main/
│ │ │ └── .gitkeep
│ │ └── solutions/
│ │ └── .gitkeep
│ └── default/
│ ├── .gitkeep
│ ├── main/
│ │ ├── .gitkeep
│ │ └── about/
│ │ ├── github_readme.md
│ │ └── installation.md
│ └── solutions/
│ └── .gitkeep
├── lib/
│ └── browser/
│ ├── click.js
│ ├── extract_dom.js
│ └── init_override.js
├── logs/
│ └── .gitkeep
├── memory/
│ └── .gitkeep
├── prompts/
│ ├── agent0/
│ │ ├── \_context.md
│ │ ├── agent.system.main.role.md
│ │ └── agent.system.tool.response.md
│ ├── default/
│ │ ├── \_context.md
│ │ ├── agent.context.extras.md
│ │ ├── agent.system.behaviour.md
│ │ ├── agent.system.behaviour_default.md
│ │ ├── agent.system.datetime.md
│ │ ├── agent.system.instruments.md
│ │ ├── agent.system.main.communication.md
│ │ ├── agent.system.main.environment.md
│ │ ├── agent.system.main.md
│ │ ├── agent.system.main.role.md
│ │ ├── agent.system.main.solving.md
│ │ ├── agent.system.main.tips.md
│ │ ├── agent.system.mcp_tools.md
│ │ ├── agent.system.memories.md
│ │ ├── agent.system.solutions.md
│ │ ├── agent.system.tool.behaviour.md
│ │ ├── agent.system.tool.browser.md
│ │ ├── agent.system.tool.call_sub.md
│ │ ├── agent.system.tool.call_sub.py
│ │ ├── agent.system.tool.code_exe.md
│ │ ├── agent.system.tool.document_query.md
│ │ ├── agent.system.tool.input.md
│ │ ├── agent.system.tool.memory.md
│ │ ├── agent.system.tool.response.md
│ │ ├── agent.system.tool.scheduler.md
│ │ ├── agent.system.tool.search_engine.md
│ │ ├── agent.system.tools.md
│ │ ├── agent.system.tools_vision.md
│ │ ├── behaviour.merge.msg.md
│ │ ├── behaviour.merge.sys.md
│ │ ├── behaviour.search.sys.md
│ │ ├── behaviour.updated.md
│ │ ├── browser_agent.system.md
│ │ ├── fw.ai_response.md
│ │ ├── fw.bulk_summary.msg.md
│ │ ├── fw.bulk_summary.sys.md
│ │ ├── fw.code.info.md
│ │ ├── fw.code.max_time.md
│ │ ├── fw.code.no_out_time.md
│ │ ├── fw.code.no_output.md
│ │ ├── fw.code.pause_dialog.md
│ │ ├── fw.code.pause_time.md
│ │ ├── fw.code.reset.md
│ │ ├── fw.code.runtime_wrong.md
│ │ ├── fw.document_query.optmimize_query.md
│ │ ├── fw.document_query.system_prompt.md
│ │ ├── fw.error.md
│ │ ├── fw.intervention.md
│ │ ├── fw.knowledge_tool.response.md
│ │ ├── fw.memories_deleted.md
│ │ ├── fw.memories_not_found.md
│ │ ├── fw.memory.hist_suc.sys.md
│ │ ├── fw.memory.hist_sum.sys.md
│ │ ├── fw.memory_saved.md
│ │ ├── fw.msg_cleanup.md
│ │ ├── fw.msg_from_subordinate.md
│ │ ├── fw.msg_misformat.md
│ │ ├── fw.msg_repeat.md
│ │ ├── fw.msg_summary.md
│ │ ├── fw.msg_timeout.md
│ │ ├── fw.msg_truncated.md
│ │ ├── fw.rename_chat.msg.md
│ │ ├── fw.rename_chat.sys.md
│ │ ├── fw.tool_not_found.md
│ │ ├── fw.tool_result.md
│ │ ├── fw.topic_summary.msg.md
│ │ ├── fw.topic_summary.sys.md
│ │ ├── fw.user_message.md
│ │ ├── fw.warning.md
│ │ ├── memory.memories_query.sys.md
│ │ ├── memory.memories_sum.sys.md
│ │ ├── memory.solutions_query.sys.md
│ │ └── memory.solutions_sum.sys.md
│ ├── developer/
│ │ ├── \_context.md
│ │ ├── agent.system.main.communication.md
│ │ └── agent.system.main.role.md
│ ├── hacker/
│ │ ├── \_context.md
│ │ ├── agent.system.main.environment.md
│ │ └── agent.system.main.role.md
│ └── researcher/
│ ├── \_context.md
│ ├── agent.system.main.communication.md
│ └── agent.system.main.role.md
├── python/
│ ├── **init**.py
│ ├── api/
│ │ ├── backup_create.py
│ │ ├── backup_get_defaults.py
│ │ ├── backup_inspect.py
│ │ ├── backup_preview_grouped.py
│ │ ├── backup_restore.py
│ │ ├── backup_restore_preview.py
│ │ ├── backup_test.py
│ │ ├── chat_export.py
│ │ ├── chat_load.py
│ │ ├── chat_remove.py
│ │ ├── chat_reset.py
│ │ ├── csrf_token.py
│ │ ├── ctx_window_get.py
│ │ ├── delete_work_dir_file.py
│ │ ├── download_work_dir_file.py
│ │ ├── file_info.py
│ │ ├── get_work_dir_files.py
│ │ ├── health.py
│ │ ├── history_get.py
│ │ ├── image_get.py
│ │ ├── import_knowledge.py
│ │ ├── mcp_server_get_detail.py
│ │ ├── mcp_server_get_log.py
│ │ ├── mcp_servers_apply.py
│ │ ├── mcp_servers_status.py
│ │ ├── message.py
│ │ ├── message_async.py
│ │ ├── nudge.py
│ │ ├── pause.py
│ │ ├── poll.py
│ │ ├── restart.py
│ │ ├── rfc.py
│ │ ├── scheduler_task_create.py
│ │ ├── scheduler_task_delete.py
│ │ ├── scheduler_task_run.py
│ │ ├── scheduler_task_update.py
│ │ ├── scheduler_tasks_list.py
│ │ ├── scheduler_tick.py
│ │ ├── settings_get.py
│ │ ├── settings_set.py
│ │ ├── synthesize.py
│ │ ├── transcribe.py
│ │ ├── tunnel.py
│ │ ├── tunnel_proxy.py
│ │ ├── upload.py
│ │ └── upload_work_dir_files.py
│ ├── extensions/
│ │ ├── before_main_llm_call/
│ │ │ ├── \_10_log_for_stream.py
│ │ │ └── .gitkeep
│ │ ├── message_loop_end/
│ │ │ ├── \_10_organize_history.py
│ │ │ ├── \_90_save_chat.py
│ │ │ └── .gitkeep
│ │ ├── message_loop_prompts_after/
│ │ │ ├── \_50_recall_memories.py
│ │ │ ├── \_51_recall_solutions.py
│ │ │ ├── \_60_include_current_datetime.py
│ │ │ ├── \_91_recall_wait.py
│ │ │ └── .gitkeep
│ │ ├── message_loop_prompts_before/
│ │ │ ├── \_90_organize_history_wait.py
│ │ │ └── .gitkeep
│ │ ├── message_loop_start/
│ │ │ ├── \_10_iteration_no.py
│ │ │ └── .gitkeep
│ │ ├── monologue_end/
│ │ │ ├── \_50_memorize_fragments.py
│ │ │ ├── \_51_memorize_solutions.py
│ │ │ ├── \_90_waiting_for_input_msg.py
│ │ │ └── .gitkeep
│ │ ├── monologue_start/
│ │ │ ├── \_60_rename_chat.py
│ │ │ └── .gitkeep
│ │ ├── reasoning_stream/
│ │ │ ├── \_10_log_from_stream.py
│ │ │ └── .gitkeep
│ │ ├── response_stream/
│ │ │ ├── \_10_log_from_stream.py
│ │ │ ├── \_20_live_response.py
│ │ │ └── .gitkeep
│ │ └── system_prompt/
│ │ ├── \_10_system_prompt.py
│ │ ├── \_20_behaviour_prompt.py
│ │ └── .gitkeep
│ ├── helpers/
│ │ ├── api.py
│ │ ├── attachment_manager.py
│ │ ├── backup.py
│ │ ├── browser.py
│ │ ├── browser_use.py
│ │ ├── call_llm.py
│ │ ├── cloudflare_tunnel.\_py
│ │ ├── crypto.py
│ │ ├── defer.py
│ │ ├── dirty_json.py
│ │ ├── docker.py
│ │ ├── document_query.py
│ │ ├── dotenv.py
│ │ ├── duckduckgo_search.py
│ │ ├── errors.py
│ │ ├── extension.py
│ │ ├── extract_tools.py
│ │ ├── faiss_monkey_patch.py
│ │ ├── file_browser.py
│ │ ├── files.py
│ │ ├── git.py
│ │ ├── history.py
│ │ ├── images.py
│ │ ├── job_loop.py
│ │ ├── knowledge_import.py
│ │ ├── kokoro_tts.py
│ │ ├── localization.py
│ │ ├── log.py
│ │ ├── mcp_handler.py
│ │ ├── mcp_server.py
│ │ ├── memory.py
│ │ ├── messages.py
│ │ ├── perplexity_search.py
│ │ ├── persist_chat.py
│ │ ├── playwright.py
│ │ ├── print_catch.py
│ │ ├── print_style.py
│ │ ├── process.py
│ │ ├── rate_limiter.py
│ │ ├── rfc.py
│ │ ├── rfc_exchange.py
│ │ ├── rfc_files.py
│ │ ├── runtime.py
│ │ ├── searxng.py
│ │ ├── settings.py
│ │ ├── shell_local.py
│ │ ├── shell_ssh.py
│ │ ├── strings.py
│ │ ├── task_scheduler.py
│ │ ├── timed_input.py
│ │ ├── tokens.py
│ │ ├── tool.py
│ │ ├── tunnel_manager.py
│ │ ├── vector_db.py
│ │ └── whisper.py
│ └── tools/
│ ├── behaviour_adjustment.py
│ ├── browser.\_py
│ ├── browser_agent.py
│ ├── browser_do.\_py
│ ├── browser_open.\_py
│ ├── call_subordinate.py
│ ├── code_execution_tool.py
│ ├── document_query.py
│ ├── input.py
│ ├── knowledge_tool.\_py
│ ├── memory_delete.py
│ ├── memory_forget.py
│ ├── memory_load.py
│ ├── memory_save.py
│ ├── response.py
│ ├── scheduler.py
│ ├── search_engine.py
│ ├── unknown.py
│ └── vision_load.py
├── tests/
│ └── mcp/
│ ├── stream_http_mcp_server.py
│ ├── stream_http_mcp_server_README.md
│ └── stream_http_mcp_server_requirements.txt
├── tmp/
│ └── .gitkeep
├── webui/
│ ├── index.css
│ ├── index.html
│ ├── index.js
│ ├── components/
│ │ ├── \_examples/
│ │ │ ├── \_example-component.html
│ │ │ └── \_example-store.js
│ │ ├── chat/
│ │ │ ├── attachments/
│ │ │ │ ├── attachmentsStore.js
│ │ │ │ ├── dragDropOverlay.html
│ │ │ │ ├── imageModal.html
│ │ │ │ └── inputPreview.html
│ │ │ └── speech/
│ │ │ └── speech-store.js
│ │ ├── messages/
│ │ │ └── resize/
│ │ │ └── message-resize-store.js
│ │ └── settings/
│ │ ├── backup/
│ │ │ ├── backup-store.js
│ │ │ ├── backup.html
│ │ │ └── restore.html
│ │ ├── mcp/
│ │ │ ├── client/
│ │ │ │ ├── example.html
│ │ │ │ ├── mcp-server-tools.html
│ │ │ │ ├── mcp-servers-log.html
│ │ │ │ ├── mcp-servers-store.js
│ │ │ │ └── mcp-servers.html
│ │ │ └── server/
│ │ │ └── example.html
│ │ └── speech/
│ │ ├── microphone-setting-store.js
│ │ └── microphone.html
│ ├── css/
│ │ ├── file_browser.css
│ │ ├── history.css
│ │ ├── messages.css
│ │ ├── modals.css
│ │ ├── modals2.css
│ │ ├── scheduler-datepicker.css
│ │ ├── settings.css
│ │ ├── speech.css
│ │ ├── toast.css
│ │ └── tunnel.css
│ └── js/
│ ├── AlpineStore.js
│ ├── api.js
│ ├── components.js
│ ├── css.js
│ ├── device.js
│ ├── file_browser.js
│ ├── history.js
│ ├── image_modal.js
│ ├── initFw.js
│ ├── initializer.js
│ ├── messages.js
│ ├── modal.js
│ ├── modals.js
│ ├── scheduler.js
│ ├── settings.js
│ ├── sleep.js
│ ├── speech_browser.js
│ ├── time-utils.js
│ ├── timeout.js
│ ├── transformers@3.0.2.js
│ └── tunnel.js
└── .github/
└── FUNDING.yml
