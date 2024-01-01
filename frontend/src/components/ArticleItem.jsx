import { useState } from "react";

export default function ArticleItem({ item, callback }) {
	const [isRead, setIsRead] = useState(item.is_read);

	const handleDoubleClick = () => {
		clearSelection();

		window.open(item.url, "_blank");
	};

	function clearSelection() {
		if (document.selection && document.selection.empty) {
			document.selection.empty();
		} else if (window.getSelection) {
			var sel = window.getSelection();
			sel.removeAllRanges();
		}
	}

	const markArticleRead = async () => {
		console.log("marked read");
		try {
			const response = await fetch(
				`http://127.0.0.1:35000/mark_article_read/${item._id}`
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
		<div
			onDoubleClick={handleDoubleClick}
			onClick={!isRead ? markArticleRead : undefined}
			className={`flex justify-between cursor-pointer ${!isRead && "bold"}`}
		>
			<span>{item.title}</span>
			<span>{item.published.split("T", 1)[0]}</span>
		</div>
	);
}
