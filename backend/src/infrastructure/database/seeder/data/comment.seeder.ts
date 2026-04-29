import { BaseSeeder } from '../base.seeder';
import { PrismaClient } from '../../generated/prisma';

export class CommentSeeder extends BaseSeeder {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async run(): Promise<void> {
    await this.truncate('Comment')

    const users = await this.prisma.user.findMany()
    if (users.length === 0) throw new Error('No users found, run UserSeeder first')

    const comments = [
      {
        user_id: users[0].id,
        content: 'This is a very insightful article. Thanks for sharing!',
      },
      {
        user_id: users[1].id,
        content: 'I disagree with some points here, but overall a good read.',
      },
      {
        user_id: users[2]?.id ?? users[0].id,
        content: 'Can you elaborate more on the second section?',
      },
      {
        user_id: users[3]?.id ?? users[1].id,
        content: 'Sharing this with my colleagues. Very relevant!',
      },
      {
        user_id: users[0].id,
        content: 'Looking forward to more articles like this.',
      },
      {
        user_id: users[1].id,
        content: 'The data presented here is quite compelling.',
      },
    ]

    await this.prisma.comment.createMany({ data: comments })
    this.log(`Seeded ${comments.length} comments`)
  }
}