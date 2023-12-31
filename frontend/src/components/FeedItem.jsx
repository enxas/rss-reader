import { useEffect, useState } from "react";

export default function FeedItem({ item, selectedFeed, articles }) {
	// "item" is a feed here
	const onClicked = () => {
		console.log("clicked");
		selectedFeed(articleRead, myArticles);
	};

	const [myArticles] = useState(articles);
	const [unread_articles_count, setUnread_articles_count] = useState(0);

	useEffect(() => {
		// let aaa;
		// for (const article of myArticles) {
		// 	if (article.is_read == false)
		// 	{
		// 		setUnread_articles_count(oldvalue => oldvalue + 1)
		// 	}
		// }

		// get unread count
		if (myArticles != undefined)
		{
			setUnread_articles_count(
				myArticles.filter((article) => article.is_read == false).length
			);
		}
		
	}, [item._id, myArticles]);

	const articleRead = () => {
		setUnread_articles_count((oldvalue) => oldvalue - 1);
	};

	return (
		<li onClick={onClicked}>
			{item.name} {unread_articles_count}
		</li>
	);
}
