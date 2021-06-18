const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Database } = require("../utils/database");
const User = new Database("litho-prae-db", ".\\SQLExpress", true, false);

