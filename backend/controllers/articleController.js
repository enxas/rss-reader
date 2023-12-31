import XmlParser from "../libraries/xml-parser.js";
import Article from "../model/Article.js";
import Feed from "../model/Feed.js";
import { get_init_data } from "./initController.js";

async function get_articles() {
	let articles = await Article.aggregate(
		[
			{
				$group: {
					_id: "$feed_id",
					articles: {
						$push: "$$ROOT",
					},
				},
			},
		],
		{ allowDiskUse: true }
	);

	return articles;
}

async function mark_article_read(req, res) {
	const result = await Article.findOneAndUpdate({ _id: req.params.article_id }, { is_read: true });
	if (!result) {
		res.status(404).send({ error: "Article is not found !" });
	}

	res.sendStatus(200);
}

async function mark_all_read(req, res)
{
	const result = await Article.updateMany({}, { is_read: true });

	res.sendStatus(200);
}

let fetch_article_from_host = {
	"www.youtube.com": (articlesList) => {
		let articles = [];

		for (const entry of articlesList) {
			if (entry.name == "entry") {
				let videoData = {};

				for (const video of entry.children) {
					if (video.name == "title") {
						videoData.title = video.text;
					} else if (video.name == "link") {
						videoData.url = video.attributes.href;
					} else if (video.name == "published") {
						videoData.published = video.text;
					} else if (video.name == "media:group") {
						for (const videoDetails of video.children) {
							if (videoDetails.name == "media:thumbnail") {
								videoData.illustration = videoDetails.attributes.url;
							}
						}
					}
				}

				articles.push(videoData);
			}
		}

		return articles;
	},
	"godotengine.org": (articlesList) => {
		let articles = [];
		for (const entry of articlesList) {
			if (entry.name == "channel") {
				for (const start of entry.children) {
					if (start.name == "item") {
						let videoData = {};

						for (const item of start.children) {
							if (item.name == "title") {
								videoData.title = item.text;
							} else if (item.name == "link") {
								videoData.url = item.text;
							} else if (item.name == "pubDate") {
								videoData.published = item.text;
							} else if (item.name == "image") {
								videoData.illustration = item.text;
							}
						}
						articles.push(videoData);
					}
				}
			}
		}

		return articles;
	},
};

const fetch_articles = async (feed) => {
	try {
		const response = await fetch(feed.url);
		let data = await response.text();

		const parser = new XmlParser();

		let jsonArticles = await parser.parse(data);

		const { host } = new URL(feed.url);

		if (!(host in fetch_article_from_host)) {
			console.error(
				`No registered function that knows how to parse "${host}" articles`
			);
			return;
		}

		// map associated host string to a function
		let articles = fetch_article_from_host[host](jsonArticles.root.children);

		for (const article of articles) {
			let existing_artcle = await Article.exists({ url: article.url });

			if (existing_artcle === null) {
				const result = await Article.create({
					title: article.title,
					url: article.url,
					published: article.published,
					illustration: article.illustration,
					feed_id: feed._id,
				});

				console.log(`New article created`);
			}
		}
	} catch (err) {
		console.error(err);
	}
};

async function fetch_new_articles(req, res) {
	let feeds = await Feed.find();

	for (const feed of feeds) {
		await fetch_articles(feed);
	}

	console.log("Finished fetching articles");

	res.json(await get_init_data());
}


export { mark_article_read, fetch_new_articles, get_articles, mark_all_read };