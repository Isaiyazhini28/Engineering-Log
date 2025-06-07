import { z } from 'zod';

const CommentSchema = z.object({
  remark: z.string().min(1, { message: "Comment text is mandatory." }),
});

export default CommentSchema; 



