function getArticleById(id, articles) {
	let articleOut = undefined;
	articles.map(article => {
		console.log(`Current id: ${article.Id} ${typeof (article.Id)}`);
		console.log(`Searching for id: ${id} ${typeof (id)}`);
		if (id === article.Id) {
			articleOut = article;
		}
	});

	if (articleOut) {
		return articleOut;
	}
	return "Article not found";
}

const articles = [
	{
		Id: 1,
		Title: "Chicho",
		Content: "Turciq ne specheli",
		CreatedAt: "2021-06-13T00:00:00.000Z",
		AuthorId: 2,
		First_name: "Stoyan",
		Last_name: "Kolev",
		Email: "SNK@snkolev.cb"
	}
];


console.log(getArticleById(1, articles));
