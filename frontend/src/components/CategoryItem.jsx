import FeedList from "./FeedList";

export default function CategoryItem({ item, selectedFeed, articles, categoryOptions }) {
	let children = null;

	if (item.sub_categories && item.sub_categories.length) {
		children = (
			<ul>
				{item.sub_categories.map((i) => (
					<CategoryItem
						item={i}
						key={i._id}
						selectedFeed={selectedFeed}
						articles={articles}
						categoryOptions={categoryOptions}
					/>
				))}
			</ul>
		);
	}

	const handleCategoryClicked = () => {
		categoryOptions(item._id)
	}

	return (
		<li>
			<div onClick={handleCategoryClicked}>{item.name}</div>
			{children}

			<FeedList
				articles={articles}
				feeds={item.feeds}
				selectedFeed={selectedFeed}
			/>
		</li>
	);
}
