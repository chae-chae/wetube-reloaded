import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "join" });

export const postJoin = async (req, res) => {
  console.log(req.body);
  const { name, username, email, password, password2, location } = req.body;
  if (password !== password2) {
    return res.status(400).res.render("join", {
      pageTitle: "join",
      errorMsg: "password is not same",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).res.render("join", {
      pageTitle: "join",
      errorMsg: "this username/email is already taken",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      password2,
      location,
    });
    res.redirect("/login");
  } catch (error) {
    return res.status(400).res.render("join", {
      pageTitle: "join",
      errorMsg: error._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "login",
      errorMsg: "an account with this username doesn't exist",
    });
  }
  console.log(user.password);
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle: "login",
      errorMsg: "wrong password",
    });
  }
  console.log("user logged in");
  req.session.loggedIn = true;
  req.session.user = user; // adding info in the session
  return res.redirect("/");
};
export const edit = (req, res) => res.send("edit");
export const remove = (req, res) => res.send("remove");
export const logout = (req, res) => res.send("log out");
export const see = (req, res) => res.send("see");
