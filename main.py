import os
import subprocess
import re
import decky_plugin

class Plugin:
    async def get_tdp(self):
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

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        pass

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        pass
