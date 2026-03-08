import path from "path";
import fs from "fs";

export class writeFile {
  constructor(public direct : string) {}
  write = async (file: File) => {
    try {
      const fileDir = path.join(process.cwd(), `src/public/image/${this.direct}`);
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      const url = path.join(
        fileDir,
        Math.random().toString(15).substring(2, 7) + file.name,
      );
      Bun.write(url, file);
      const finalUrl = url.split(process.cwd());
      return finalUrl[1];
    } catch (error: any) {
      throw {
        message: error.message || "internal server erorr",
        error: error,
      };
    }
  };
  update = (lastFile: string, file?: File) => {
    try {
      const fileDir = path.join(process.cwd(), `src/public/image/${this.direct}`);
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      const lastImage = path.join(process.cwd() , lastFile);
      if (fs.existsSync(lastImage)) {
        fs.rmdirSync(lastImage);
      }
      if (!file) return;
      const url = path.join(
        fileDir,
        Math.random().toString(15).substring(2, 7) + file.name,
      );
      Bun.write(url, file);
      const finalUrl = url.split(process.cwd());
      return finalUrl[1];
    } catch (error: any) {
      throw {
        message: error.message || "internal server erorr",
        error: error,
      };
    }
  };
}
