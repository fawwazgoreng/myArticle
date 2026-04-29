export const findPage = (req: { page: number,time:  'newest' | 'oldest' ,  title?: string}) => {
  const limit = 30;
  const skip = (req.page - 1) * limit;
  const time = req.time ?? "newest";
  let title = null;
  if (req.title && req.title.length > 1) title = req.title;
  return {skip,title,time}
}
