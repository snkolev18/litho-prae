function checkUserRegistrationData(data) {
	const errors = new Array();

	if (!/^\w{3,25}$/.test(data.usr)) {
		errors.push({ message: "Invalid username!" });
	}

	if (!/^\w+@\w+\.\w+$/.test(data.email)) {
		errors.push({ message: "Invalid email!" });
	}

	// What have I done
	if (!/^[\w !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/.test(data.psw)) {
		errors.push({ message: "Invalid password!" });
	}

	return errors;
}

module.exports.checkUserRegistrationData = checkUserRegistrationData;
