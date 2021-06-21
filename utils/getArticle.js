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
		CreatedAt: "2021-06-13T00:00:00.000Z { nanosecondsDelta: 0 }",
		AuthorId: 2,
		First_name: "Stoyan",
		Last_name: "Kolev",
		Email: "SNK@snkolev.cb"
	},
	{
		Id: 3,
		Title: "Невиждано досега",
		Content: "Нова костенурка беше намерена край българското Черноморие",
		CreatedAt: "2021-06-20T09:34:32.000Z { nanosecondsDelta: 0 }",
		AuthorId: 22,
		First_name: "sadno",
		Last_name: "asdion",
		Email: "sandokan@sandokan.com"
	},
	{
		Id: 4,
		Title: "Софи Маринова",
		Content: "Нов концерт на Софи Маринова",
		CreatedAt: "2021-06-20T11:33:53.000Z { nanosecondsDelta: 0 }",
		AuthorId: 27,
		First_name: "r",
		Last_name: "t",
		Email: "rootcheto@rootcheto123.com"
	}
];

const rObj = {
	articlesList: articles
};

// console.log(getArticleById(1, articles));


[...rObj.articlesList].map(article => {
	console.log(article.Title);
});
