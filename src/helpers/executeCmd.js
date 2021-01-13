const { spawnSync } = require("child_process");
/**
 * Executes command synchronously,
 * keeps command output colors
 * @param {string} cmd
 * @param {string[]} args
 * @param {string | undefined} cwd
 */
export const executeCmd = (cmd, args, cwd) =>
  spawnSync(cmd, args, { stdio: "inherit", cwd });
