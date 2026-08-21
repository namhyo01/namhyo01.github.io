import { getCollection } from 'astro:content';

// 개발 서버에서는 draft 글도 보이고, 프로덕션 빌드에서만 제외됩니다.
const isVisible = (entry: { data: { draft: boolean } }) => import.meta.env.DEV || !entry.data.draft;

/** 최신 발행일 순으로 정렬된 블로그 글 목록 */
export async function getPosts() {
	const posts = await getCollection('blog', isVisible);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** featured 우선, 그다음 order, 그다음 최신 시작일 순으로 정렬된 프로젝트 목록 */
export async function getProjects() {
	const projects = await getCollection('projects', isVisible);
	return projects.sort((a, b) => {
		if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
		if (a.data.order !== b.data.order) return a.data.order - b.data.order;
		return b.data.startDate.valueOf() - a.data.startDate.valueOf();
	});
}

/** '알고리즘/dp' -> '알고리즘' */
export const topCategory = (category: string) => category.split('/')[0];

/** 대분류별 글 개수를 많은 순으로 반환합니다. */
export async function getCategories() {
	const posts = await getPosts();
	const counts = new Map<string, number>();
	for (const post of posts) {
		const top = topCategory(post.data.category);
		if (top) counts.set(top, (counts.get(top) ?? 0) + 1);
	}
	return [...counts].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
}
