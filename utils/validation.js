function checkUserRegistrationData(data) {
	const errors = new Array();

	if (!/^\w{3,25}$/.test(data.usr)) {
		errors.push({ message: "Invalid username!" });
	}

	if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(data.email)) {
		errors.push({ message: "Invalid email!" });
	}

	// What have I done
	if (!/^[\w !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/.test(data.psw)) {
		errors.push({ message: "Invalid password!" });
	}

	return errors;
}

function checkTagData(tag) {
	const errors = new Array();

	if (!/[a-zA-Z-]{3,20}$/.test(tag)) {
		errors.push({ message: "Invalid tag name or length" });
	}

	return errors;
}

module.exports.checkUserRegistrationData = checkUserRegistrationData;
module.exports.checkTagData = checkTagData;
