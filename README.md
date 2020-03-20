![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# LAB | Authentication with PassportJS

## Introduction

In previous lessons, we learned how important it is to manage your users (have them saved and retrieved) successfully. In this lab, you will do it one more time, just to make sure we are ready to move forward into new knowledge conquers. :wink:
Overall, the goal is to understand how authentication and authorization work in web applications, why these features are useful, and to be able to implement signup and login features using Passport.

## Requirements

- Fork this repo
- Clone this repo

## Submission

- Upon completion, run the following commands:

```bash
git add .
git commit -m "done"
git push origin master
```

- Create Pull Request so your TAs can check up your work.

## Introductions

The provided code gives you the basic layout and organization for this assignment.

### Iteration 0 | Initialize the project

After forking and cloning the project, you have to install all the dependencies:

```sh
$ cd lab-authentication-with-passport
$ npm install
```

Now you are ready to start. 🚀

## Iteration #1: The `signup` feature

The repo you cloned comes with a `User` model and a `router` file already made for you. It also has all the views you need, although some of them are empty. :smile:

Add a new `GET` route to your `routes/auth.routes.js` file with the path `/signup` and point it to your `views/auth/signup.hbs` file. This route needs to render the signup form.
Since you still haven't created the signup form, go ahead and add a form that makes a POST request to `/signup`, with a field for `username` and `password`.

Finally, add a POST route to your `routes/auth.routes.js` to receive the data from the signup form and create a new user with the data.

Make sure you install **bcryptjs** npm package and require it in `routes/auth.routes.js` file.

## Iteration #2: The `login` feature

Follow the same logic as for the signup. Inside the `routes/auth.routes.js` file, create a `GET` route that will display the login form. Create a login form in the `views/auth/login.hbs`. The form should make a POST request to `/login`.
Once you have the form, add another route to the router. This route needs to receive the data from the form and log the user in.

**But wait...**

To do that, we need to **configure the session** and **initialize a session with passport** in our `app.js` file. We also need to add the `passport.serializeUser()` and `passport.deserializeUser()` methods as well as define the Passport Local Strategy. The same as you were guided in the lesson, start with installing `passport`, `passport-local` and `express-session`.
:bulb: Don't forget to add `SECRET` to the `.env` when creating a session.

## Iteration #3: Private page

In the repo you forked, there is a file `views/auth/private.hbs`. This page is referenced in the `routes/auth.routes.js` with the path `/private-page`. We use the `ensureLogin.ensureLoggedIn()` method to make sure that the user is logged in before viewing this page.

If everything worked correctly, the user should be able to sign up, login, and then visit the page, where they will receive a personalized greeting.

Happy coding! :heart:
