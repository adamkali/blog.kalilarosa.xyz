---
title: Introducing Egg.
description: Egg is a backend framework for Golang. 
leader: Dont you just hate reinventing the wheel? Don't worry I did it for you! 
author: adamkali
categories: 
  - Egg
  - Golang
  - CLI
created: 2025-05-05T10:14:54-0500
updated: 2025-09-12T16:32:16-0500
version: 1.1.1
---

# Because I can.

Everyone always tells you "don't reinvent the wheel." Use existing frameworks. Don't waste time building what already exists. And they're probably right—for most people, most of the time. You aren't going to do it any better than x engineers. 

But sometimes you need to prove to yourself (and any future potential employers) that you can actually build the wheel. Sometimes the best way to understand production-ready software is to build it yourself, exactly the way you want it to work. Sometimes problem-solving IS the point.

One day, I was doom-scrolling on YouTube and came across a video on deploying to a VPS without Netlify or Vercel, by the one: [Dreams of Code](https://www.youtube.com/watch?v=F-9KWQByeU0&t=10s). And like any good developer with a chronic case of "I bet I could build that," I wanted to copy the project and try the "tutorial" for myself and deploy a service to my newly installed homelab. But more importantly, I saw an opportunity to solve my real problem: I wasn't shipping enough projects.
At this time, I was trying out [Loco-rs](https://github.com/loco-rs/loco) and fell in love with the cool features it offered that I genuinely cared about.
So, if I was going to create a service using the Loco framework, I wanted to make it as simple as possible. 
Or, more accurately: to be as simple as Vercel or Netlify.
So I laid out a few requirements that I felt, if not satisfied, would be a dealbreaker. 

## Requirements.txt 

1. I wanted to stop bootstrapping the same project structure over and over. You know that feeling when you have a brilliant project idea at 11 PM, but you remember you'll need to spend 3 hours setting up Docker, configuring the database, and getting auth working? Database, cache, object storage, and Auth needs to be set up from the start
2. I wanted the Ruby on Rails experience but in a language I already knew and could iterate on quickly. The **opinions**. The "this is how we do things" structure that lets you jump straight to business logic. So lets focus on having rock solid opinions. (Foreshadowing)
3. I wanted to deploy by pushing to main. The Vercel experience: commit, push, see your changes live. But on my homelab, because I have this perfectly good server sitting there and I want to actually use it for development and prototyping.
4. I wanted all deployments automated with CI/CD, because manually deploying things in 2025 is just embarrassing.
5. I want my stack to be deployed locally. If I have to end up storing this off location. Fine. I need to be able to integrat on hardware that I own.
I don't want to build the plane while I'm flying it. I want the plane already built from the factory. The factory that I made myself, on the land that I built. 

With all of this in mind, I started using Loco to first make sure that I could deploy a Loco-rs application to my server using the same pattern that [Dreams of Code] did in their video.
   I started by creating a new Loco-rs project and setting up the database (Postgres), cache (Redis), and S3 (MinIO) through docker-compose.
   I then used that docker-compose file to deploy these services to my home server and verify that everything was reachable from outside the network.
   And they were! Great so far...
   Now that I tested everything was working separately, I decided to create a docker-swarm.yaml to get the resilience that was talked about in the video.
   I was sure that there would be nothing an operating system container would do to make my Docker environment unable to use Docker Swarm, right?

## Suprise! Canonical wants to chat

When I was setting up my server for homelab deployment, I just added the Docker package during the installation of Ubuntu 24.04 Server OS. Seemed reasonable, right? Wrong.
   
   Turns out using Docker Swarm on the Snap version of Docker is like trying to write to a read-only filesystem... because that's literally what happens. The Snap sandboxing makes `swarm mode` throw [ro filesystem errors](https://forum.snapcraft.io/t/docker-docker-compose-in-swarm-mode-give-ro-filesystem/11561), and even when you work around those, the containers couldn't discover each other on the Docker network in my case. The Loco server couldn't talk to Postgres, Postgres couldn't talk to Redis, nothing worked.
   
   Eventually (an entire weekend), I realized I was focusing on the wrong problem entirely. I wanted to build software, not spend weekends debugging containerization. So I nuked the Snap Docker, installed Docker properly, and gave up on Swarm altogether. Sometimes the best solution is admitting you were overengineering from the start.
   
   Reinventing the wheel is fine, but over-engineering the axle before getting the wheel started is kind of nuts. Luckily, I wasn't giving up on creating my personal development stack .

## Coolify 

After icing the Docker Swarm idea, as someone in the 99th percentile of having Neanderthal DNA, I can be sure that the feeling of discovering fire was similar to discovering Coolify. I didn't want to spend another weekend debugging infrastructure. I wanted to get a framework up and running in one night and be able to iterate that same night. Back to Google I went, this time searching for "self-hosted Vercel" because apparently I'm a glutton for punishment.
   
   That's when I discovered [Coolify](https://coolify.io/), and it seemed like a match made in heaven. Here was a tool that promised the Vercel experience but on my own hardware. I dove into the documentation and found everything I didn't know I needed: a REST API to control deployments, preview deployments for different branches, and their magic DNS tool that handled all the subdomain routing I would have otherwise fought with nginx for hours to configure.
   
   But the real kicker? It embodied the spirit of free as in libre. Complete control over my deployments, the ability to dictate environments, and I could swap out services with a simple click. No vendor lock-in, no usage limits, just my server doing exactly what I wanted it to do.
   
   This solved multiple problems at once: the CI/CD pipeline I needed, the one-click deployment experience I craved, and it let me focus on building the actual framework instead of fighting with container orchestration. Perfect. Now to test if my bet with Loco-rs would pay off. 

## Let's get Rusty

It did not. Look, I have massive respect for what Rust does and the problems it solves. But my grug brain wanted to write more code, not smarter code. I wanted to jam out features, not spend hours satisfying the borrow checker for simple changes.
   After about a month of giving Loco-rs a good college try, I found that I was hitting a roadblock every time I opened Neovim. Not because I had no motivation or didn't understand the language. Development velocity in Rust felt like trying to improvise jazz. Specifically for anyone who read the Silmarillion, I was Eru Iluvatar, while rust and the borrow checker was Melkor standing in the back playing death metal at -9000 dB.
   The adage "You fight the borrow checker, not the compiler" really is true. I could implement traits for data transformation just fine. The problem came whenever I wanted to make simple changes—change a model field, update a response type, or any sort of editing of buisness logic required satisfying lifetimes and ownership three levels deep up the call stack up the call stack up the call stack. 
   Want to change a `String` field to `&str`? Sure, seems simple enough. But that innocent change cascades into 40 compiler errors because now you need lifetimes, and those lifetimes need to satisfy Sync + Send traits somewhere up the framework chain. What should be a 30-second change becomes an hour-long archaeological dig through the type system.
   And the real kicker? You don't find out until after the compile finishes. For my use case, that was the final nail in the coffin. I timed it against my company's production Create React App build to see what I was subjecting myself to:
```bash
Rust clean builds: 71 seconds
eFileMadeEasy's Create React App: 58 seconds
```

   Building became such a knee cap that if I did not swallow my pride and weigh the pros and cons of using a different language, I would not only be adding the mental cost of implementing everything in rust.
   I would also be taking the mental overhead of always needing to add the extra 10 seconds locally to every build.
   When you add CI/CD into the mix—pushing changes to GitHub, waiting for Docker builds, discovering you set the server to `localhost` instead of `0.0.0.0`—a simple mistake could exponentially increase deployment time. The whole point of this experiment was high-velocity development and shipping fast. Instead, I was spending more time fighting the borrow checker than writing business logic. 
   And at the end of the day, all of that would be fine if the build times and deployment did not get exacerbated by being slowed down if I wanted to push a new Docker Image to github, and build it remotely through ci/cd.

## I Just Wanted to Be Louis Armstrong

Here's the thing: I wanted to improvise, jam out features, and iterate quickly. I didn't necessarily want to write the most correct code. I wanted to mess up and see what did not work. I wanted to learn from those mistakes. 
   Rust is incredible at what it does, but what it does well (memory safety, performance, correctness) wasn't solving my problem (development velocity for web apps). Really it was hindering me. I needed something that let me play jazz, not death metal. Something that prioritized iteration speed over compile-time guarantees. Something where changing a struct field didn't require an hour-long archaeological dig through the type system.
   So I decided to go back to the drawing board and really take a look at my options.
   To do this, I thought, well why not Go? 
   Go holds a special place in my heart, it's a language that prided itself for simplicity.
   Especially when you are developing a web app.
   So my goal was to create a web app, but I decided to do something that in hindsight was risky given the amount of time I wanted to spend developing.
   Go famously does not have a "ruby on rails" equivalent.
   So, since i made so many concesions at this point...
   Why not write my own template/framework that I could reuse anytime.
   I could make it **EXACTLY** how I wanted, I could make tailored to my needs, and make it so that I could just focus on being my own customer first.

### Requirements.txt: Electric Boogaloo

- I want to be able to configure my server with a configuration file in a config directory that I could exclude from builds, but also be able to change environments based on deployments.
- I want to be able to just pull down the parent repo, fork it or whatever and have auth, database access, caching, and S3 all ready for me to start developing on the actual business logic and hit the ground running.
- I want to be able to have git repo functionality and have the CI/CD to deploy to the server and see the changes live. Like what was shown in the Dreams of Code video.
- And anything else from the [Requirements.txt](#requirementstxt) that wasn't covered here.

## Satisfying My Needs

First thing I decided to do was plan out the project structure to organize as I dumped out my garbage code:
```bash
 .
├──  cmd
│  ├──  configuration
├──  config
├──  controllers
├──  db
│  ├──  migrations
│  ├──  queries
│  └──  repository
├──  Dockerfile
├──  docs
├──  go.mod
├──  go.sum
├──  middlewares
│  └──  configs
├──  models
│  ├──  handlers
│  ├──  requests
│  └──  responses
├──  openapitools.json
├──  README.md
├──  services
├──  sqlc.yml
├──  tmp
│  └──  executable!
└──  web
└──  dist
└──  index.html
```
  The thought process for this was that I understand how pretty much any REST framework should be structured at this point, so just getting this laid out so that I can jump in with the knowledge of how the codebase actually is laid out makes it very easy for me to pinpoint where a bug is occurring intuitively. 
  This why there would always be a seperation of concerns.
  It would be really easy to diagnose where something was going wrong by just looking at the structure and server logs.
Next, I wanted to create a structure where my configuration could live and ensure that I could hot-swap environments as I please. So I created a small web server using [Echo](https://echo.labstack.com/) as a starting point. Here is what I started with:
```go
type Configuration struct {
    Name      string `yaml:"name"`
    Semver    string `yaml:"semver"`
    License   string `yaml:"license"`
    Copyright struct {
        Year   int    `yaml:"year"`
        Author string `yaml:"author"`
    } `yaml:"copyright"`
    Server struct {
        JWT      string `yaml:"jwt"`
        Port     int    `yaml:"port"`
        Frontend struct {
            Dir string `yaml:"dir"`
            Api string `yaml:"api"`
        } `yaml:"frontend"`
    } `yaml:"server"`
    Database struct {
        URL       string `yaml:"url"`
        Sqlc      string `yaml:"sqlc"`
        Migration struct {
            Protocol    string `yaml:"protocol"`
            Destination string `yaml:"destination"`
        } `yaml:"migration"`
    } `yaml:"database"`
    Cache struct {
        URL string `yaml:"url"`
    } `yaml:"cache"`
    S3 struct {
        URL    string `yaml:"url"`
        Access string `yaml:"access"`
        Secret string `yaml:"secret"`
    } `yaml:"s3"`
}

```
With that done, I could later create commands that could be called by other parts of the built executable. And change the behavior of the service through the configuration.
I then made an endpoint that would return the configuration I had created as a JSON response.
```js
// curl http://localhost:5000/configuration | jq '.'
{
    'name': 'fullstack_app',
    'semver': '0.0.1',
    'server': {
        'jwt': 'abc123',
        'port': 5000,
        'frontend': {
            'dir': 'frontend/dist'
            'api': 'frontend/api'
        }
    },
    'database': {
        'url': 'postgres://localhost:5432/default',
        'sqlc': 'sql',
        'migration': {
            'protocol': 'postgres',
            'destination': 'internal/migrations'
        }
    },
    'cache': {
        'url': 'redis://localhost:6379/0'
    },
    's3': {
        'url': 'localhost:9000',
        'access': 'abc123',
        'secret': 'def456'
    }
}
```
With that done, I was able to confirm that my Go configuration could read from the config file and operate as it was supposed to. Now I could then implement a form of an ORM with SQLC and Goose to have dead simple database migrations and model generation from table definitions.
So after using the [Cobra CLI](https://github.com/spf13/cobra) to create a command-line interface for my project, I was able to create a series of commands to develop a really nice tool for being able to do database migrations, bump versions of the server itself, and also generate Swagger documentation so I could quickly interact with my database, or use to do code gen for a javascript frontend really quickly.
```bash
 v1.24.5 ॐ   go run main.go --help

*** Help Text
Serve the application.
The default environment used with this is development,
So configured the application is opend at 

http://localhost:60000

This can be altered in the 

host: 0.0.0.0
port: 60000

section of the config file. use -e environment when 
calling this command to run serve using the configured 
values.

*** Command 
**** Default 
--- bash
go build main.go -o mindscape
./mindscape 
---

**** with -e passed
If one had some configuration file really-sick-config.yaml
--- bash
go build main.go -o egg_app
./egg_app -e really-sick-config
---

Usage:
mindscape [flags]
mindscape [command]

Available Commands:
bump        Bumps the semantic version of the server
completion  Generate the autocompletion script for the specified shell
db          Database interactions
down         This command uses goose to run down migrations in the `int
ernal/migrations` folder
help        Help about any command
swag        A brief description of your command
version     Gets the semantic version of the server 

Flags:
-e, --environment string   Choose what environment that should be used 
when running. Default is development (default "development")
-h, --help                 help for mindscape

Use "mindscape [command] --help" for more information about a command.


```
Now let me show you how I created a dependency injection pattern for my services, to interact with the with the databse. 
```go 
/* Generated by egg v0.0.1 */

package services

import (
	"context"
	"errors"
	"fmt"

	"github.com/adamkali/mindscape/db/repository"
	"github.com/adamkali/mindscape/models/requests"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func verifyPassword(storedHash, providedPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(providedPassword))
	if err != nil {
		return false
	}
	return true
}

type UserService struct {
	ctx  context.Context
	pool *pgxpool.Pool
}


// Returns a refrence to a new UserService to be used in the controller
func CreateUserService(ctx context.Context, pool *pgxpool.Pool) *UserService {
	return &UserService{ctx, pool }
}

// Creates a new user
//
// params: *requests.NewUserRequest
// returns: (*repository.User, error)
//
// This function takes a NewUserRequest object and returns a User object.
// Both the username and email must be unique. If not an error is returned.
func (UserService *UserService) Create(params *requests.NewUserRequest) (*repository.User, error) {
	BCryptHash, err := hashPassword(params.Password)
	if err != nil {
		return nil, err
	}
	if params.IsAdmin {
		return UserService.addNewUserAdmin(repository.CreateUserAdminParams{
			BCryptHash: BCryptHash,
			Username:   params.Username,
			Email:      params.Email,
		})
	} else {
		return UserService.addNewUser(repository.CreateUserParams{
			BCryptHash: BCryptHash,
			Username:   params.Username,
			Email:      params.Email,
		})
	}
}

func (UserService *UserService) addNewUser(
	params repository.CreateUserParams,
) (*repository.User, error) {
	var user repository.User
	fmt.Println("Starting Connection")
	tx, err := UserService.pool.Begin(UserService.ctx)
	fmt.Println(err.Error())
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(UserService.ctx)
	println("adding")
	repo := repository.New(tx)
	user, err = repo.CreateUser(UserService.ctx, params)
	if err != nil {
		return nil, err
	}
	tx.Commit(UserService.ctx)
	fmt.Println(user)
	return &user, nil
}

func (UserService *UserService) addNewUserAdmin(
	params repository.CreateUserAdminParams,
) (*repository.User, error) {
	var user repository.User
	tx, err := UserService.pool.Begin(UserService.ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(UserService.ctx)
	repo := repository.New(tx)
	user, err = repo.CreateUserAdmin(UserService.ctx, params)
	if err != nil {
		return nil, err
	}
	tx.Commit(UserService.ctx)
	return &user, nil
}

// Login a user
//
// params: *requests.LoginRequest
// returns: (*repository.User, error)
//
// This function takes a requests.LoginRequest object and returns a repository.User object.
// This can be used with either a username or email address to log in a user.
// 
// If the user is not found, an error is returned.
// If the password is incorrect, an error is returned.
func (UserService *UserService) Login(params *requests.LoginRequest) (*repository.User, error) {
	var user repository.User
	tx, err := UserService.pool.Begin(UserService.ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(UserService.ctx)
	var BCryptHash string
	repo := repository.New(tx)
	if params.Email != "" {
		BCryptHash, err = repo.FindBCryptHashByEmail(UserService.ctx, params.Email)
		if err != nil {
			return nil, err
		}
		fmt.Println(BCryptHash)
		if verifyPassword(BCryptHash, params.Password) {
			fmt.Println("Verified")
			user, err = repo.FindUserByEmail(UserService.ctx, params.Email)
			if err != nil {
				return nil, err
			}
			fmt.Println(user)
		} else {
			return nil, errors.New("Could not verify password")
		}
	} else if params.Username != "" {
		BCryptHash, err = repo.FindBCryptHashByUsername(UserService.ctx, params.Username)
		if err != nil {
			return nil, err
		}
		if verifyPassword(BCryptHash, params.Password) {
			user, err = repo.FindUserByUsername(UserService.ctx, params.Username)
			if err != nil {
				return nil, err
			}
		} else {
			return nil, errors.New("Could not verify password")
		}
	}
	tx.Commit(UserService.ctx)
	return &user, nil
}

// Removes a user by id
//
// params: uuid.UUID
// returns: error
//
// This function takes a uuid.UUID object and returns an error if the user does not exist.
// 
// If the user does not exist, an error is returned.
// If the user is not deleted, an error is returned.
func (UserService *UserService) Remove(user_id uuid.UUID) error {
	tx, err := UserService.pool.Begin(UserService.ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(UserService.ctx)
	repo := repository.New(tx)
	if err := repo.DeleteUserByID(UserService.ctx, user_id); err != nil {
		return err
	}
	tx.Commit(UserService.ctx)
	return nil
}

// Get a user by id
//
// params: uuid.UUID
// returns: (*repository.User, error)
//
// This function takes a uuid.UUID object and returns a repository.User object.
// If the user does not exist, an error is returned.
func (UserService *UserService) Get(user_id uuid.UUID) (*repository.User, error) {
	tx, err := UserService.pool.Begin(UserService.ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(UserService.ctx)
	var user repository.User
	repo := repository.New(tx)
	if user, err = repo.FindUserByID(UserService.ctx, user_id); err != nil {
		return nil, err
	}
	tx.Commit(UserService.ctx)
	return &user, nil
}

// Get all users
//
// returns: ([]repository.User, error)
//
// This function returns a slice of repository.User objects.
// If there are no users, an error is returned.
//
// If there is an error on the database side, an error is returned.
// 
// [WARN] Should only be used for debugging.
func (UserService *UserService) GetAll() ([]repository.User, error) {
	tx, err := UserService.pool.Begin(UserService.ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(UserService.ctx)
	var users []repository.User
	repo := repository.New(tx)
	if users, err = repo.FindUsers(UserService.ctx); err != nil {
		return nil, err
	}
	tx.Commit(UserService.ctx)
	return users, nil
}

// Update a user by id
//
// params:
//    user_id: uuid.UUID,
//    profile_name: string
// returns: (*repository.User, error)
//
// This function takes a uuid.UUID object and a string object and returns a repository.User object.
// If the user does not exist, an error is returned.
func (UserService *UserService) Update(user_id uuid.UUID, profile_name string) (*repository.User, error) {
	tx, err := UserService.pool.Begin(UserService.ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(UserService.ctx)
	repo := repository.New(tx)
	var user repository.User
	if err = repo.UpdateUserProfile(
		UserService.ctx,
		repository.UpdateUserProfileParams{
			ProfilePicUrl: &profile_name,
			ID:            user_id,
		},
	); err != nil {
		return nil, err
	}
	user, err = repo.FindUserByID(UserService.ctx, user_id)
	if err != nil {
		return nil, err
	}
	tx.Commit(UserService.ctx)
	return &user, nil
}

// UpdateUserCredentials
// params: *repository.UpdateUserCredentialsParams
// returns: (*repository.User, error)
//
// This function takes a UpdateUserCredentialsParams object and returns a User object.
// If the user does not exist, an error is returned.
func (UserService *UserService) UpdateUserCredentials(params *requests.UpdateCredentialsRequest) (*repository.User, error) {
	tx, err := UserService.pool.Begin(UserService.ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(UserService.ctx)
	repo := repository.New(tx)
	var user repository.User

	user, err = repo.FindUserByID(UserService.ctx, params.ID)
	if err != nil {
		return nil, err
	}

	updateParams, err := params.Into(hashPassword)
	// if OldPassword is empty then we do not need to update the password
	if params.OldPassword == "" {
		updateParams.BCryptHash = user.BCryptHash
		updateParams.BCryptHash_2 = user.BCryptHash
	} else if verifyPassword(user.BCryptHash, params.OldPassword) {
		updateParams.BCryptHash_2 = user.BCryptHash
	}

	if err = repo.UpdateUserCredentials(UserService.ctx, updateParams); err != nil {
		return nil, err
	}
	// at this point we can assume that the user was updated, so now lets the 
	// update the user inplace
	user.BCryptHash = updateParams.BCryptHash
	user.Email = updateParams.Email
	user.Username = updateParams.Username

	tx.Commit(UserService.ctx)
	return &user, nil
}
```
Why would I want to do this. Well, let me explain. 
First of all, I really only needed to implement the interface that the UserService implemented in order to register it. This meant that I could realistically switch out the pgx pakage with turso, with neon, with any database provider in the future. 
It also meant when I realized later that if someone pointed out that I was doing something completely wrong, the problem could be isolated to the service.
I could change it and the rest of the application would not notice. 
So using this design pattern allowed me to do that. 
I created a new file called `controller.go`

```go
type Registrar struct {
    Config           *configuration.Configuration
    ValidatorService *services.ValidatorService
    UserService      services.IUserService
    AuthService      services.IAuthService
    MinioService     services.IMinioService
    RedisService     services.IRedisService
}

type IController interface {
    Attatch(e *echo.Echo, authMiddleware echo.MiddlewareFunc)
}

func createControllerParams(config *configuration.Configuration) (*Registrar, error) {
    ctx := context.Background()
    db, err := pgxpool.New(ctx, config.Database.URL)
    if err != nil {
        return nil, err
    }

    return &Registrar{
        Config:           config,
        ValidatorService: &services.ValidatorService{},
        AuthService:      services.CreateAuthService(ctx, db, config), // here I register
        UserService:      services.CreateUserService(ctx, db),
        MinioService:     services.CreateMinioService(ctx, config),
        RedisService:     services.CreateRedisService(ctx, config),
     }, nil
}
```
Now I have an extremely flexible interface for being able to register whatever services I need along with a way to register controllers as well: 
```go
func AttatchControllers(e *echo.Echo, config *configuration.Configuration, conts ...IController) {
    // configure middlewares here right now it is just an authentication
    for _, v := range conts {
        v.Attatch(e, echojwt.WithConfig(configs.AuthMiddlewareConfig(config)))
    }
}
```
Where all I really need to do in order to create a new controller is implement the Attach function for the controller. Here is how I implemented it for my user_controller: 
```go
// ./controllers/user_controller.go
func BuildUserController(p *Registrar) UserController {
    return UserController{
        Name:             "/users",
        Config:           p.Config,
        AuthService:      p.AuthService,
        MinioService:     p.MinioService,
        UserService:      p.UserService,
        RedisService:     p.RedisService,
        ValidatorService: p.ValidatorService,
    }
}
// ./controllers/routes.go
AttatchControllers(e, config, BuildUserController(params))
```
Now that I have accomplished this, it is now extremely easy to add whatever service to the server as needed.
An added benifit is that I would be able to change this implementation details of this registration, and the rest of the application would not be affected. See the pattern? 

Now that I have an easy way to build a web server, I added in some CI/CD and confirmed that GitHub would pick up the server, build the Docker container, and then deploy it to GitLab.
Which pretty much leaves me with job complete.
But that is not the end of the story. Because if I already had all of this composability.
I could see all the parts of the application that could be swapped out.
I could see all the parts of the project that was just a template that had strings that I could swap out...
I am already making this into a "template" app along with the rest of the tech stack as well..., so why not make a full-fledged framework for myself?

# Egg
Introducing my own backend framework for Go: [egg](https://github.com/adamkali/egg_cli.git). But this isn't just another "opinionated framework". It is a CLI that embodies my philosophy of convention over configuration. 

Here's what I actually built: a Cobra-based CLI with a Bubbletea TUI wizard that generates complete Go web applications from 40+ embedded templates. When you run `egg_cli init`, you get a beautiful interactive terminal interface that walks you through project setup—database choice, authentication, frontend framework, the works. It's like having a conversation with your computer about what you want to build.

The magic happens through a pluggable module system with seven different modules (`egg::initialize`, `egg::bootstrap_directories`, `egg::generate_configuration`, etc.) that handle everything from directory structure to CI/CD pipeline generation. Each module implements the `IModule` interface, making the whole system extensible and testable.

Convention over configuration taken to its logical extreme. Instead of spending hours setting up the same boilerplate every time I have a brilliant 11 PM idea, I run one command and get a complete project with:
- REST API controllers with Echo routing
- Type-safe database queries with SQLC
- Database migrations with Goose
- JWT authentication services with interfaces for easy testing
- Redis caching integration
- S3/MinIO storage services
- Docker setup for deployment
- Swagger documentation generation
- Complete CI/CD pipeline for GitHub Actions
  
  And it's not just generation—the CLI includes development utilities too. Need to convert your config to a `.env` file? `egg_cli generate dotenv`. Want to generate config from environment variables? `egg_cli env`. Need to bump versions? The generated project includes its own CLI with database migration commands, version management, and Swagger generation.

## What Really Made Me Happy

The velocity is intoxicating. I can go from idea to working API with authentication, database, and deployment pipeline in under 10 minutes. When I built my current project Mindscape using Egg, the development experience was exactly what I wanted: I spent my time on business logic, not fighting with boilerplate.
And sure even if I bounced off a project. I did not have to reinvent the wheel, again. I made the wheel. 
Just put it on a different wagon. 
  The framework generated a clean project structure that followed my mental model from .NET development—services with interfaces, proper dependency injection, organized controllers—but in Go's fast, simple ecosystem. When I needed to add a new feature, I wasn't hunting through documentation or trying to remember how I set up JWT middleware last time. 
  I did not need to fight the language to get something working. 
  I just needed to run `egg_cli init` and answer a few questions, or `egg_cli generate` to get what I needed.
  It was already there, already working, already tested.
  Want to swap Auth0 or AWS Cognito? Just implement the `IAuthService` interface and update the dependency injection. Want to add a new storage provider? Implement `IMinioService` and plug it in. The interfaces make everything swappable without touching the business logic.
  I could change how anything works as I found better solutions and as long as the wires were still conneted.
  I was mint.
  Every Egg project comes with its own command-line tool for database migrations (`go run main.go db migrate`), version bumping (`go run main.go bump minor`), and Swagger doc generation (`go run main.go swag`). No more googling "how do I run migrations in this project"—it's all right there in the help text. All right there in a way i was familiar with. 
  I could even just do all of that with a Makefile if I did not want to use the CLI.
# Conclusion 
At the end of this nearly year-long journey, I'm genuinely proud of what I built. Not because Egg is revolutionary—it's not. But because I actually finished a personal project that solves my specific problems, and I'm using it every day for real work.
  
  The learning was deeper than I expected. Building dependency injection from scratch in Go gave me an intimate understanding of the pattern that transcends any single language. Now when I look at .NET's DI container at work, or Spring's in Java, or any other framework's approach, I understand not just **what** they're doing but **why** they made those specific design decisions. There's something powerful about implementing a concept yourself that no amount of documentation can teach you.
  
  But what makes me happiest is this: I built something for myself, exactly how I wanted it to work. When I start my next project—a bookmark manager/homepage/dashboard for home servers—I won't spend a weekend setting up auth and database connections and Docker configs. I'll run `egg_cli init`, answer some questions in a nice TUI, and be writing business logic in 10 minutes.
  
  That's the real victory. Not building the next Rails or Django, but building the tool that lets me ship ideas faster. Sometimes reinventing the wheel is exactly the right choice, especially when you need a wheel that fits your cart perfectly.
  I did it. 
  I did not need to shoe horn myself into a new way of thinking.

## Should You Use Egg?

Probably not, and that's perfectly fine. Egg was built to solve my specific workflow problems and embody my preferences about how web development should feel. Sure It probably isn't the best for you. And that's ok. 

Infact, don't use it. I am not your dad! I encourage you to make your own and make fun of me on my repo for it. Just do it yourself. Learn to reinvent the wheel so you can understand why people are doing the things that they do. I used to think that any sort of Interfaces are bad. Now I know that C# and Java interfaces are bad.

But, seriously. Take the time to build something. Not just the next netflix. Not just the next whatever. Build something for you. Take a look at the two most recent configs I posted at the time of writing: [Glaze Me](/configs/glaze-me/) and [Norbsidian](/configs/norbsidian/). They really aren't meant for anyone but myself, and thats the beauty of them! You will always be a customer for yourself. So make things for yourself.

But if you're tired of rewriting the same authentication boilerplate, if you want structure and organization, if you believe development velocity matters more than using the "approved" tools... then maybe we're kindred spirits. Give it a try, and if you like how I think about these problems, drop a star on the repo. You want to use it but you dont like how I did something: fork it and send a pull request. Because I am proud of my self.

## Thanks for Reading

I want to give a huge shout out:
- Sierra LaRosa the love of my life.
- My parents for the support they have given me and Sierra. 
- eFileMadeEasy for all the resources i have had to learn from.
- The immense amount of resources from the Golang community.
    - [echo](https://echo.labstack.com/)
    - [sqlc](https://sqlc.dev/)
    - [pgx](https://github.com/jackc/pgx)
    - [goose](https://github.com/pressly/goose)
- [loco-rs](https://github.com/loco-rs/loco) for lots of the inspiration and motivation.
- [Dreams Of Code](https://www.youtube.com/watch?v=F-9KWQByeU0&t=10s) for the inspiration to make this project.
- Andho from discord for allowing him to spam him in discord.
- [BigJay](https://github.com/BigJayToDaIzo) for lots of moral support and allowing me to learn some Go tips from him.

And before you go: I want to provide you with a quote that i heard, literally as I finished the project from [A typecraft video interviewing DHH on Omarchy](https://www.youtube.com/watch?v=zikJTpJgzzo):
> I have come to the conclusion that we have been going about [trying to get people to use linux] a bit of the back way.
> I can feel the excitement that there is for hyprland and Arch. And it is a different kind of exicement... 
> Commit to being earnest about liking computers.
> And if you like computers, commit to being earnest about learning about computers, learn new things about computers, running new operating systems on them.

What I will only add to that is that is what I want you to take away from this project.
Be authentic about your excitement. 
And be earnest that you learned something. 
Build something for yourself. 

See you around!
  Adam Kalinowski


