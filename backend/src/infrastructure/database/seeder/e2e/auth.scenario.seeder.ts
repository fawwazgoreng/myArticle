import { BaseSeeder } from "@infra/database/seeder/base.seeder";

export class UnverifiedUserScenarioSeeder extends BaseSeeder {
    async run(): Promise<void> {
      await this.truncate('User')
  
      const hash = async (plain: string) => await Bun.password.hash(plain)
  
      const users = [
        {
          email: 'unverifieduser@myarticle.com',
          username: 'regular_user',
          password: await hash('User@123'),
          roles: 'user',
          is_verify: false,
          verified_at: null,
        }
      ]
  
      await this.prisma.user.createMany({ data: users })
      this.log(`Seeded ${users.length} users`)
    }
}

export class VerifiedUserScenarioSeeder extends BaseSeeder {
    async run(): Promise<void> {
      await this.truncate('User')
  
      const hash = async (plain: string) => await Bun.password.hash(plain)
  
      const users = [
        {
          email: 'verifieduser@myarticle.com',
          username: 'regular_user',
          password: await hash('User@123'),
          roles: 'user',
          is_verify: true,
          verified_at: new Date(),
        }
      ]
  
      await this.prisma.user.createMany({ data: users })
      this.log(`Seeded ${users.length} users`)
    }
}

export class ExpiredVerificationScenarioSeeder extends BaseSeeder {
  async run(): Promise<void> {
    const hash = await Bun.password.hash('User@123');

    const user = await this.prisma.user.create({
      data: {
        email: 'expired-code@myarticle.com',
        username: 'waiting_user',
        password: hash,
        roles: 'user',
        is_verify: false,
      }
    });

    await this.prisma.verificationCode.create({
      data: {
        code: '123456',
        user_id: user.id,
        expired_at: new Date(Date.now() - 2 * 60 * 60 * 1000), 
      }
    });

    this.log("Seeded user with expired verification code.");
  }
}

export class LoginBruteForceScenarioSeeder extends BaseSeeder {
  async run(): Promise<void> {
    const user = await this.prisma.user.findFirst();
    if (!user) return;

    const attempts = [
      { type: 'LOGIN', success: false, fail: 'Wrong password' },
      { type: 'LOGIN', success: false, fail: 'Wrong password' },
      { type: 'LOGIN', success: false, fail: 'Too many attempts' },
    ];

    for (const attempt of attempts) {
      await this.prisma.session_audit_trail.create({
        data: {
          admin_id: user.id,
          event_type: attempt.type,
          device_type: 'Desktop/Chrome',
          ip_address: '192.168.1.1',
          success: attempt.success,
          failure_session: attempt.fail,
        }
      });
    }

    this.log(`Seeded ${attempts.length} failed login audit trails.`);
  }
}