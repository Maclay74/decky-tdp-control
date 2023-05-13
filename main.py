import os
import subprocess
import re

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky_plugin




class Plugin:

    async def get_tdp(self):

        decky_plugin.logger.info("Getting TDP")

        command = ["ryzenadj", "--info"]
        output = await self.run_command(self, command)

        tdp = re.search(r"STAPM LIMIT\s+\|\s+([\d]+)", output).group(1)
        decky_plugin.logger.info("Done!")
        return tdp
    
    async def set_tdp(self, tdp):
        decky_plugin.logger.info("Setting TDP")

        target_tdp = int(tdp) * 1000
        boost_tdp = target_tdp + 2000

        # Call ryzenadj with the new TDP values
        command = ["ryzenadj", f"--stapm-limit={target_tdp}", f"--fast-limit={boost_tdp}", f"--slow-limit={target_tdp}"]
        await self.run_command(self, command)
        return await self.get_tdp(self)


    async def run_command(self, command):
        full_command = ["sudo", "-S"] + command
        completed_process = subprocess.run(full_command, input="gamer\n", stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        output = completed_process.stdout.strip()
        return output



    # A normal method. It can be called from JavaScript using call_plugin_function("method_1", argument1, argument2)
    async def add(self, left, right):
        return left + right

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        decky_plugin.logger.info("Hello World!")

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        decky_plugin.logger.info("Goodbye World!")
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky_plugin.logger.info("Migrating")
        # Here's a migration example for logs:
        # - `~/.config/decky-template/template.log` will be migrated to `decky_plugin.DECKY_PLUGIN_LOG_DIR/template.log`
        decky_plugin.migrate_logs(os.path.join(decky_plugin.DECKY_USER_HOME,
                                               ".config", "decky-template", "template.log"))
        # Here's a migration example for settings:
        # - `~/homebrew/settings/template.json` is migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/template.json`
        # - `~/.config/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/`
        decky_plugin.migrate_settings(
            os.path.join(decky_plugin.DECKY_HOME, "settings", "template.json"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".config", "decky-template"))
        # Here's a migration example for runtime data:
        # - `~/homebrew/template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        # - `~/.local/share/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        decky_plugin.migrate_runtime(
            os.path.join(decky_plugin.DECKY_HOME, "template"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".local", "share", "decky-template"))
