import * as fs from "fs";

export function getText(filePath: string) {
  try {
    let buff = fs.readFileSync(filePath, "utf8");
    try {
      let text = JSON.parse(buff);
      return text;
    } catch (error) {
      return buff;
    }
  } catch (error) {
    return undefined;
  }
}

export function listFiles(dirPath: string) {
  try {
    let result = fs.readdirSync(dirPath);
    return result;
  } catch (error) {
    return undefined;
  }
}

export function checkIfDirExists(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    return true;
  } else {
    return false;
  }
}
