import { BaseSeeder } from "../base.seeder"
import { PrismaClient } from "../../generated/prisma"

export class SessionAuditSeeder extends BaseSeeder {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async run(): Promise<void> {
    await this.truncate('Session_audit_trail')

    const users = await this.prisma.user.findMany()
    if (users.length === 0) throw new Error('Run UserSeeder first')

    const devices = ['desktop', 'mobile', 'tablet']
    const events = ['LOGIN', 'LOGOUT', 'REFRESH_TOKEN', 'PASSWORD_CHANGE']

    const audits = users.flatMap(user => [
      {
        admin_id: user.id,
        event_type: 'LOGIN',
        device_type: devices[0],
        ip_address: '192.168.1.1',
        success: true,
        failure_session: null,
        created_at: new Date('2024-01-01T08:00:00'),
        updated_at: new Date('2024-01-01T08:00:00'),
      },
      {
        admin_id: user.id,
        event_type: 'LOGIN',
        device_type: devices[1],
        ip_address: '10.0.0.1',
        success: false,
        failure_session: 'Invalid password attempt',
        created_at: new Date('2024-01-02T09:00:00'),
        updated_at: new Date('2024-01-02T09:00:00'),
      },
      {
        admin_id: user.id,
        event_type: events[Math.floor(Math.random() * events.length)],
        device_type: devices[Math.floor(Math.random() * devices.length)],
        ip_address: '172.16.0.1',
        success: true,
        failure_session: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    await this.prisma.session_audit_trail.createMany({ data: audits })
    this.log(`Seeded ${audits.length} session audit trails`)
  }
}