# Chirp [Basic Twitter clone]

# About

Chirp is a very rudimentary Twitter clone. Users are able to view other user's 'chirps.' If a user creates an account they can also create their own posts (max 240 character). Users can also update their display names, add a small bio, and update/delete their old chirps! <br/><br/>Chirp is arguably the best social media app due to the fact that you cannot interact with other user's postings- therefore you can never take time out of your precious day getting into arguments with random internet netizens!
<br/><br/>
On a serious note, this app was primarily an excuse to learn/test/implement tRPC and Zod. Both packages have been growing in popularity within the JS/TS world for their: (1)ease of use in building typesafe apis and (2)strong client-server relationship. I needed an excuse to explore both, which is why I created this basic app. Enjoy!

[Click here for a walkthrough.](#walkthrough)

Click the button below to view the app
<br/>
<br/>
[<img src="https://raw.githubusercontent.com/pfoo360/Chirp/main/screenshots/logo.png" width="163px" />](https://nepenthes.vercel.app/)

# Features

- Signups, signins, persistent signins and sessions
- Api built with tRPC
- Type safety using tRPC and Zod
- Users can perform CRUD operations on their own posts
- Infinite scroll pagination
- DB and UI are in sync at all times thanks to cache modifications
- Conditionally renders CSS (ex: buttons are 'greyed out' when submitting, red borders when errors) for better UX
- Context holds user state
- Mobile-first design
- and much more!

# Technologies

- NextJS
- Prisma
- PostgreSQL
- tRPC
- Zod
- Typescript
- TailwindCSS
- Vercel
- Railway

# Goals

- Learn about tRPC
- Implement tRPC in a project to perform CRUD operations
- Learn about zod
- Implement Zod in a project
- Familiarize myself with TypeScript
- Familiarize myself with Prisma's ORM
- Deploy an app

# Improvements

- Implement features that you would typically see in other social media apps (like/favorite system, share system, notifications, ability to follow other users, pinned posts, view count, search functionality, etc.)
- The homepage ("/" route) current just takes users to an "About the app" page. This page would be better used to display posts from users the current signed-in user is following
- Security
- Implement an incoming request logger and an error logger
- More error handling (can never go wrong with more error handling for edge cases)
- More media queries and responsive design (currently designed with small screens in mind, although it doesn't look bad on some larger screens)

# Walkthrough

This is the sign up page. As with all other aspect of the app, it takes heavy inspiration from Twitter. <br/>
![signup](/screenshots/1.png)
<br/>
<br/>

There is error handling and prevention for when users attempt to create an account with an already taken username and/or email. <br/>
![taken_username_and_or_email](/screenshots/2.png)
<br/>
<br/>

After successfully creating an account, users can now sign in! <br/>
![signin](/screenshots/3.png)
<br/>
<br/>

After signing in to a new account, a similar page to the one below will greet the user. Notice how we can update our display name and add a bio.<br/>
![home](/screenshots/4.png)
<br/>
<br/>

Clicking the 'update' next to the user's display name will open up a form for the user to edit their display name.<br/>
![edit_display_name](/screenshots/5.png)
<br/>
<br/>

If the user's desired display name exceeds the limit the UI will respond and the user will be unable to submit the new name.<br/>
![error_display_name](/screenshots/6.png)
<br/>
<br/>

On success, the form will close and the new display name will appear. The cache is updated to reflect the success so no page refresh occurs.<br/>
![success_display_name](/screenshots/7.png)
<br/>
<br/>

Users can also add/update their bio by clicking on the second 'update'. Again, a form will open up, allowing users to add/update their bio. Like before, if user exceeds the limit, the UI will reflect it. And like before, the cache is updated to maintain an up-to-date UI and prevent an unnecessary page refresh.<br/>
![add_bio](/screenshots/8.png)
![error_add_bio](/screenshots/9.png)
![success_add_bio](/screenshots/10.png)
<br/>
<br/>

Users can also create posts (or 'chirps'). If user exceeds the 240 character limit, the 'Chirp' button will be disabled!<br/>
![create_chirp](/screenshots/11.png)
![chirp_error](/screenshots/12.png)
<br/>
<br/>

Upon successful submission, the cache is updated to display the newly-created 'chirp.' Of note is that Chirp implements infinite-scroll pagination (and is made easier thanks to tRPC's built in infiniteQuery functionality).<br/>
![chirp_success](/screenshots/13.png)
<br/>
<br/>

Users will notice an ellipsis to the right of each of their own 'chirps.' Clicking on this will open a dropdown that will allow the user to delete their 'chirp' or update their 'chirp.'<br/>
![ellipsis](/screenshots/14.png)
<br/>
<br/>

Clicking on 'Update' will allow the user to update their old 'chirp.' Any errors will be reflected in the UI. Upon a successful submission the form will close and users will see their newly updated post. Notice that when a user updates a 'chirp' the UI will also display an 'updated...' message next to the created-at date.<br/>
![update_chirp](/screenshots/15.png)
![error_update_chirp](/screenshots/16.png)
![success_update_chirp](/screenshots/17.png)
<br/>
<br/>

Clicking on the ellipsis and clicking 'Delete' will delete a user's old 'chirp.'<br/>
![delete](/screenshots/18.png)
<br/>
<br/>

A user can also visit another user's page. Notice that since the current user is signed in as 'phillipfoo' and NOT 'anotherUser' they are unable to update display names/bios and cannot create 'chirps' here.
![anotherUser_page](/screenshots/19.png)
<br/>
<br/>

If user signs out, they can still visit another user's page. The only difference is that the 'sign out' button at the top will be replaced with other links.
![signed_out_view](/screenshots/20.png)
<br/>
<br/>

If a user visits a username that does not exist, he/she will be greeted with a custom 404 message (again, heavily inspired by Twitter's 404 message)
![missing_user](/screenshots/21.png)
<br/>
<br/>

# References

- [Zod homepage](https://zod.dev/)
- [Infinite data with tRPC (for infinite scroll )](https://trpc.io/docs/useInfiniteQuery)
- [Cursor-based pagination with Prisma (for infinite scroll)](https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination)
- [Update cache in tRPC](https://trpc.io/docs/useContext)
- [Forwarding refs with TypeScript](https://www.carlrippon.com/react-forwardref-typescript/)
- [Abort procedure calls in tRPC](https://trpc.io/docs/aborting-procedure-calls)
- [Web Dev Simplified's "Learn tRPC In 45 Minutes"](https://www.youtube.com/watch?v=UfUbBWIFdJs)
- [Web Dev Simplified's "Learn Zod In 30 Minutes"](https://www.youtube.com/watch?v=L6BE-U3oy80)
