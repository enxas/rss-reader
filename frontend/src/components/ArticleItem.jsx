import { useEffect, useState } from "react";

export default function ArticleItem({ item, callback }) {
	const [isRead, setIsRead] = useState();

	useEffect(() => {
		setIsRead(item.is_read);
	}, [item.is_read]);

	const markArticleRead = async () => {
		try {
			const response = await fetch(
				`http://127.0.0.1:3500/mark_article_read/${item._id}`
			);

			if (!response.ok) {
				throw new Error(
					`This is an HTTP error: The status is ${response.status}`
				);
			}

			setIsRead(true);
			callback();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div onClick={markArticleRead} className={!isRead ? "bold" : ""}>
			{item.title} - {item.published}
		</div>
	);
}
