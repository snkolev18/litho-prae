const marked = require("marked");
const sanitizeHTML = require("sanitize-html");

function renderContentToHTML(content) {
	content = marked(content);
	content = sanitizeHTML(content);

	return content;
}

module.exports.renderContentToHTML = renderContentToHTML;
