# Roadmap

-   [ ] Descriptive landing page
-   [ ] Supabase authentication with username and password
-   [ ] Page structure: Dashboard, Recipe Explorer
-   [ ] Dashboard page: Add recipe, get recommendation, analytics
    -   [ ] Add recipe button with pop-out. Component should be re-used in Recipe Explorer
    -   [ ] Recommendation engine: 1 random suggestion, optional filtering.
-   [ ] Recipe structure: description, ingredients, cuisine, meal type, image, comments
    -   [ ] Create writable and type
    -   [ ] Create Supabase database
    -   [ ] Integrate cloud image hosting provider
    -   [ ] Checklist for buying ingredients
-   [ ] Recipe Explorer page
    -   [ ] Search bar
    -   [ ] List of recipes
    -   [ ] Sort & filter
        -   [ ] Sort by: date created, meal type, cuisine.
        -   [ ] Filter by: meal type,
-   [ ] Analytics: # of recipies, most popular ingredients, most cooked

# Recipe database

-   name: text
-   description: text
-   ingredients: [ingredient: text, quantity: text, acquired: boolean]
-   instructions: text
-   rating: 1-5

# Progress report

## 2023-10-21

Studied Supabase authentication and Sveltekit Routing today.

I want to experiment with routing using /login, /signup and /logout pages.

Separately going to set up a Svelte store for the Supabase client so that I can more easily use it inside components. This will be the easiest way to maximize Svelte's composability.

## 2023-10-20

Struggling to understand the difference between the server- and client-side loading functions and how to access the data. I have experimented with creating a writable User store, which doesn't appear to be working even though I'm successfully logged in. Reason may be that it's not initiating properly and only triggering on a re-load. Need to investigate.

Additionally I need to reference Huntabyte's approach and see what he's doing differently. I can already see that the supabase-js package is imported differently as it's updated.

I've also purchased CoPilot but it's mostly annoying. I'm not sure if it's worth the money.

## 2023-10-17

Working on configuring Supabase server-side auth. I'm watching a Huntabyte tutorial for it too. Needed to continue with integrating on `/src/routes/+layout.svelte` for client-side calls. I need to better understand this server<>client routing infrastructure, should watch tutorials about it.

Need to think about how to architect my log-in component. Can I use a smooth component, like (this)[https://flowbite.com/blocks/marketing/login/]?
