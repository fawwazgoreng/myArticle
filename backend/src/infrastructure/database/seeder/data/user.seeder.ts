import { BaseSeeder } from "@infra/database/seeder/base.seeder";

export class UserSeeder extends BaseSeeder {

  async run(): Promise<void> {
    await this.truncate('User')

    const hash = async (plain: string) => await Bun.password.hash(plain)

    const users = [
      {
        email: 'admin@myarticle.com',
        username: 'admin',
        password: await hash('Admin@123'),
        roles: 'admin',
        is_verify: true,
        verified_at: new Date(),
      },
      {
        email: 'editor@myarticle.com',
        username: 'editor_one',
        password: await hash('Editor@123'),
        roles: 'editor',
        is_verify: true,
        verified_at: new Date(),
      },
      {
        email: 'editor2@myarticle.com',
        username: 'editor_two',
        password: await hash('Editor@123'),
        roles: 'editor',
        is_verify: true,
        verified_at: new Date(),
      },
      {
        email: 'user@myarticle.com',
        username: 'regular_user',
        password: await hash('User@123'),
        roles: 'user',
        is_verify: false,
        verified_at: null,
      },
      {
        email: 'guest@myarticle.com',
        username: 'guest_user',
        password: null, // oauth user
        roles: 'user',
        is_verify: true,
        verified_at: new Date(),
      },
    ]

    await this.prisma.user.createMany({ data: users })
    this.log(`Seeded ${users.length} users`)
  }
}