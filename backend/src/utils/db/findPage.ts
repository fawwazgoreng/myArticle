
export const findPage = (req: { page: number, title: string , time:  'newest' | 'oldest'}) => {
  const limit = 30;
  const skip = (req.page - 1) * limit;
  const time = req.time ?? "newest";
  let title = null;
  if (req.title && req.title.length > 1) title = req.title;
  return {skip,title,time}
}
