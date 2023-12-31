import ArticleItem from "./ArticleItem";

export default function ArticleList({ articles }) {
	return (
		<>
			{articles &&
				articles.articles.map((i) => (
					<ArticleItem
						item={i}
						key={i._id}
						callback={articles.feedItemCallback}
					/>
				))}
		</>
	);
}
