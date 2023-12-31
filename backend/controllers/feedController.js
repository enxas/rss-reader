import Feed from "../model/Feed.js";

async function get_feeds() {
	let feeds = await Feed.aggregate(
		[
			{
				$group: {
					_id: "$category",
					feeds: {
						$push: "$$ROOT",
					},
				},
			},
		],
		{ allowDiskUse: true }
	);

	return feeds;
}

const add_feed = async (feed) => {
	try {
		const result = await Feed.create({
			name: feed.name,
			url: feed.url,
			category: feed.category,
		});

		return result;
	} catch (err) {
		console.error(err);
	}
};

async function create_feed(req, res) {
	const result = await add_feed({ name: req.body.name, url: req.body.url, category: req.body.categoryId });

	res.status(200).send(result);
}

export { get_feeds, add_feed, create_feed };