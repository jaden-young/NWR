const { spawn } = require("child_process");
const path = require("path");
const { getAddonName, getDotaPath } = require("./utils");

(async () => {
    const dotaPath = await getDotaPath();
    const win64 = path.join(dotaPath, "game", "bin", "win64");

    const args = ["-x", "0", "-y", "0", "-novid", "-console", "-tools", "-addon", getAddonName(), "+dota_launch_custom_game", getAddonName(), "dota"];
    spawn(path.join(win64, "dota2.exe"), args, { detached: true, cwd: win64 });
})().catch(error => {
    console.error(error);
    process.exit(1);
});
