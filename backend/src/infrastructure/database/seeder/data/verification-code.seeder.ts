import { BaseSeeder } from "@infra/database/seeder/base.seeder";

export class VerificationCodeSeeder extends BaseSeeder {

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  async run(): Promise<void> {
    await this.truncate('VerificationCode')

    const unverifiedUsers = await this.prisma.user.findMany({
      where: { is_verify: false }
    })

    const codes = unverifiedUsers.map(user => ({
      code: this.generateCode(),
      user_id: user.id,
      created_at: new Date(),
      expired_at: new Date(Date.now() + 1000 * 60 * 60),
    }))

    if (codes.length > 0) {
      await this.prisma.verificationCode.createMany({ data: codes })
    }

    this.log(`Seeded ${codes.length} verification codes`)
  }
}