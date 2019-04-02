![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# Authentication With PassportJS

## SETUP!!!!
No se me ocurrio mejor manera que poner en el README.md los comentarios de como estan armados los labs para que sean más faciles de revisar:
El index principal te lleva a una pagina sencilla donde tienes dos links a seleccionar, cada uno te lleva al lab correspondiente:

- Welcome to Lab Authentication with Passport
- Welcome to Lab Passport Roles

Sobre el segundo... lo mejor es eliminar la coleccion de users antes de revisarlo. La pagina principal te manda a dos logins, el del administrador (a.k.a el BOSS) y el empleado comun y corriente. 

En el login/signup del administrador, se crea la cuenta con privilegios de BOSS y puede crear otros usuarios dandoles la contraseña y el rol de una vez. Ya en el login del usuario normal, dependiendo de tu rol te manda a lo que debes ver nada mas. Aunque falta la ultima iteracion con la parte de alumnos... 

## Introduction

In previous lessons, we learned how important it is to have your user managed (saved and retrieved) successfully. In this lab, you will do it one more time, just to make sure we are ready to move forward into new knowledge conquers :wink:
Overall, the goal is to understand how authentication and authorization work in a web applications, why these features are useful and to be able to implement signup and login features using Passport.

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

The starter-code provides the basic layout and organization for this assignment.

### Iteration 0 | Initialize the project

After forking and cloning the project, you will have to add a `starter_code/.env` file:

```
PORT=3000
```

And you have to install all the dependencies:


```sh
$ cd starter_code
$ npm install
```

Now you are ready to start 🚀

## Iteration #1: The Signup Feature

The repo you cloned comes with a `User` model and a `router` file already made for you. It also has all the views you need, although some are empty :smile:

Add a new route to your `passportRouter.js` file with the path `/signup` and point it to your `views/passport/signup.hbs` file.

Now, in that .hbs file, add a form that makes a POST request to `/signup`, with a field for `username` and `password`.

Finally, add a POST route to your `passportRouter.js` to receive the data from the signup form and create a new user with the data.

Make sure you install **bcrypt** (or **bcryptjs**) and **passport** npm packages and require it in `passportRouter.js`.

## Iteration #2: The Login Feature

In order to add the login feature, let's add one GET route to our router to display the login page. `views/passport/login.hbs` is empty so let's fill it with some login form. Once we have the form, let's add another route to the router to receive that data and log the user in. The form should make a POST request to `/login`. 

**But Wait**

In order to do that, we need to configure Sessions and initialize a session with passport in our `app.js` file. We also need to add the `passport.serializeUser` functions as well as defining the Passport Local Strategy.

## Private Page

In the repo you forked, there is a file called `private.hbs`. This page is referenced in the `passportRouter.js` with the path `/private-page`. We use the `ensureLogin.ensureLoggedIn()` function to make sure that the user is logged in before viewing this page.

If everything worked correctly, the user should be able to sign up, login, and then visit the page, where they will receive a personalized greeting.

Happy coding! :heart:
