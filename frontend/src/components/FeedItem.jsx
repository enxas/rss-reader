import { useEffect, useState } from "react";

export default function FeedItem({ item, selectedFeed, articles }) {
	// "item" is a feed here
	const onClicked = () => {
		selectedFeed(articleRead, myArticles);
	};

	const [myArticles] = useState(articles);
	const [unreadArticlesCount, setUnreadArticlesCount] = useState(0);

	useEffect(() => {
		// get unread count
		if (myArticles != undefined) {
			setUnreadArticlesCount(
				myArticles.filter((article) => article.is_read == false).length
			);
		}
	}, [item._id, myArticles]);

	const articleRead = () => {
		setUnreadArticlesCount((oldvalue) => oldvalue - 1);
	};

	return (
		<li
			className={`feed-item ${unreadArticlesCount != 0 && "bold"}`}
			onClick={onClicked}
		>
			<span>{item.name}</span>
			<span className={`${unreadArticlesCount == 0 && "hide"}`}>
				({unreadArticlesCount})
			</span>
		</li>
	);
}
