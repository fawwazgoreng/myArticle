import { BaseSeeder } from "@infra/database/seeder/base.seeder";

export class BlogScenarioSeeder extends BaseSeeder {
  async run(): Promise<void> {
    const tables = ["CategoryOnArticle", "Article", "Category"];
    await this.truncate(...tables);
    this.log("Cleanup finished.");

    const categoryData = [
      { name: 'Technology', slug: 'technology' },
      { name: 'Politics', slug: 'politics' },
      { name: 'Sports', slug: 'sports' },
      { name: 'Health', slug: 'health' },
      { name: 'Business', slug: 'business' },
      { name: 'Science', slug: 'science' },
    ];

    await this.prisma.category.createMany({ data: categoryData });
    const allCategories = await this.prisma.category.findMany();
    this.log(`Seeded ${allCategories.length} categories`);

    const editors = await this.prisma.user.findMany({
      where: { roles: { in: ['admin', 'editor'] } }
    });

    if (editors.length === 0) {
      throw new Error('❌ No editors found. Please run UserSeeder first!');
    }

    const articles = [
      {
        title: 'The Future of Artificial Intelligence',
        content: 'Artificial intelligence is rapidly transforming industries...',
        image: 'https://placeholder.com/ai-future.jpg',
        author_id: editors[0].id,
        base_views: 1200,
        createdAt: new Date('2024-01-15'),
        categories: ['Technology', 'Science']
      },
      {
        title: 'Global Economy Outlook 2024',
        content: 'The global economy faces unprecedented challenges...',
        image: 'https://placeholder.com/economy.jpg',
        author_id: editors[1]?.id ?? editors[0].id,
        base_views: 850,
        createdAt: new Date('2024-02-10'),
        categories: ['Business', 'Politics']
      },
      {
        title: 'Revolutionary Advances in Medical Science',
        content: 'Scientists have made groundbreaking discoveries...',
        image: 'https://placeholder.com/medical.jpg',
        author_id: editors[0].id,
        base_views: 2300,
        createdAt: new Date('2024-03-05'),
        categories: ['Health', 'Science']
      }
    ];

    for (const article of articles) {
      const { categories, ...articleData } = article;
      
      await this.prisma.article.create({
        data: {
          ...articleData,
          category: {
            create: categories.map(catName => ({
              category: {
                connect: { id: allCategories.find(c => c.name === catName)?.id }
              }
            }))
          }
        }
      });
    }

    this.log(`Seeded ${articles.length} articles with categories`);
  }
}

export class ArticleWithoutCategorySeeder extends BaseSeeder {
  async run(): Promise<void> {
    const editor = await this.prisma.user.findFirst({ where: { roles: "admin" } });

    await this.prisma.article.create({
      data: {
        title: 'Artikel Tanpa Kategori',
        content: 'Ini adalah tes untuk melihat apakah layout tetap stabil jika kategori kosong.',
        author_id: String(editor?.id ?? 1),
      }
    });
    this.log("Seeded article with no categories.");
  }
}

export class LongContentSeeder extends BaseSeeder {
  async run(): Promise<void> {
    const editor = await this.prisma.user.findFirst();
    
    const longText = new Array(50).fill(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
    ).join("\n\n");

    await this.prisma.article.create({
      data: {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.repeat(10),
        content: longText,
        author_id: String(editor?.id ?? 1),
        base_views: 0,
      }
    });
    this.log("Seeded long content article.");
  }
}

export class SpecialCharacterSeeder extends BaseSeeder {
  async run(): Promise<void> {
    const editor = await this.prisma.user.findFirst();

    const specialCases = [
      {
        title: 'Emoji Test 🚀🔥 Valid ✅',
        content: 'Testing emojis: 😅 💻 🌈 🍎 🛰️'
      },
      {
        title: 'XSS & Script Injection Test',
        content: '<script>alert("xss")</script><b>Bold Text</b> <img src="x" onerror="alert(1)">'
      },
      {
        title: 'Foreign Languages (Unicode)',
        content: 'Chinese: 你好, Japanese: こんにちは, Arabic: مرحبا, Russian: Здравствуйте'
      },
      {
        title: 'Mathematical & Symbols',
        content: 'Complex symbols: ∫ ∑ ∏ √ ∞ ≠ ≈ 100% & "quoted text" \'single\''
      }
    ];

    for (const item of specialCases) {
      await this.prisma.article.create({
        data: {
          ...item,
          author_id: String(editor?.id ?? 1),
        }
      });
    }
    this.log(`Seeded ${specialCases.length} special character articles.`);
  }
}