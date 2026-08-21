import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// '알고리즘/dp' 처럼 '대분류/소분류' 형태를 씁니다.
			category: z.string().default(''),
			tags: z.array(z.string()).default([]),
			// 티스토리에서 옮겨온 글의 원본 글 번호 (namhyo00.tistory.com/{id})
			tistoryId: z.number().optional(),
			// true면 빌드 결과물에서 제외됩니다.
			draft: z.boolean().default(false),
		}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// 진행 기간 표시에 사용됩니다.
			startDate: z.coerce.date(),
			endDate: z.coerce.date().optional(),
			// 사용 기술 스택
			stack: z.array(z.string()).default([]),
			role: z.string().optional(),
			repo: z.string().url().optional(),
			demo: z.string().url().optional(),
			heroImage: z.optional(image()),
			// 목록 상단 고정 및 홈 노출 여부
			featured: z.boolean().default(false),
			draft: z.boolean().default(false),
			// 목록 정렬 우선순위(작을수록 앞)
			order: z.number().default(999),
		}),
});

export const collections = { blog, projects };
