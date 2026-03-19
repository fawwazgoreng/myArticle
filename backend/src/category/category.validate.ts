import * as z from "zod";

const writeCategory = z.object({
  name : z.string().min(3).max(150)
});

export class CategoryValidate {
  create = async (req : any) => {
    return writeCategory.parse(req);
  }
  update = async(req : any) => {
    return writeCategory.parse(req);
  }
}