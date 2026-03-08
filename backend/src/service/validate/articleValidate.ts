import * as z from "zod";

const writeValidate = z.object({
  title : z.string().min(3).max(150),
  content: z.string().min(3).max(400),
  image: z.file().mime(['image/jpeg' , 'image/png']).max(2000).nullable(),
  category: z.array(z.string())
});

export class articleValidate {
  create = async (req : any) : Promise<any> => {
    try {
      return writeValidate.parse(req);
    } catch (error) {
      throw error;
    }
  }
  update = async(req : any) => {
    try {
    return writeValidate.parse(req);
    } catch (error) {
      throw error;
    }
  }
}
