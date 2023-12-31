import FeedItem from "./FeedItem";

export default function FeedList({ articles, feeds, selectedFeed }) {

	return (
		<>
			{feeds && (
				<ul>
					{feeds.map((feed) => {
						let articlesList = null;

						for (const article of articles) {
							if (article._id == feed._id) {
								articlesList = article.articles;
								break;
							}
						}

						return (
							<FeedItem
								item={feed}
								key={feed._id}
								selectedFeed={selectedFeed}
								articles={articlesList}
							/>
						);
					})}
				</ul>
			)}
		</>
	);
}
