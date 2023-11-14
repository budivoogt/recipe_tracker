# Roadmap

-   [ ] Descriptive landing page
-   [x] Supabase authentication with username and password
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

### Bugs

-   [x] When adding a recipe, the push to the Supabase database is giving a 400 Bad Request error.
-   [x] newRecipes isn't clearing after successful submission of recipes.

I suspect the issue is that currentRecipes isn't being updated with the latest recipes.

-   [x] When refreshing the page it's not loading the stored data?
-   [x] It's also calling the deletedRecipes and updatedRecipes logs, while it shouldn't.
-   [x] Resolve the ingredients having unnecessary parentheses in the stingified JSON.
-   [x] When successfully adding a recipe, field values aren't reset.
-   [ ] When on the /recipes page, logging out doesn't redirect you.
-   [ ] Make serialized ingredients JSONB instead of JSON.
-   [ ] Figure out how to avoid instantiating an empty ingredient for each recipe. Currently this is necessary to have Svelte's conditional rendering to display the different ingredients.

# Progress report

## 2023-11-14

### Edit functionality

## 2023-11-13

-   [ ] Need to add servingSize to each recipe, inc. the Supabase item and the types.
-   [ ] Have to add edit and delete buttons to the recipes.
-   [ ] Need to think about the easiest way to edit the recipes.
-   [ ] Clear all feature for ingredients after you cooked the recipe.
-   [ ] Confirmation modal for delete recipe.

## 2023-11-4

### RecipeDetailsModal

-   [x] Need to make it possible to update `acquired` status of an ingredient.

## 2023-11-3

I had overcomplicated the Supabase logic. I should have instead _first_ built the basic logic for adding, updating and removing recipes using Svelte stores.

I haven't stuck to the Single Responsibility Principle and created recursiveness in a few places:

-   The default value for a form submission wasn't properly reset.
-   The store subscription had recursiveness, where each function that updated the store triggered the original subscription again.
-   I hadn't separated the different functions: adding, updating, removing and synching local stores <> Supabase.

It was helpful to build UI tools that allowed me to easily reset the local stores and experiment with different isolated parts of the app. Therefore, it's smart to build things slowly and from the ground up moving forward. Instead when building this app I had built much of the logic without building the front-end and that resulted in issues.

I also updated the Supabase package from auth-helpers to their new -ssr package.

Modularized the Svelte components, where I separated the NewRecipeModal from the RecipeTable.svelte.

Tomorrow I should continue with creating a modal that displays the properties of every recipe and making those fields editable.

## 2023-10-26

Browse page should show a list of recipes. Each recipe should be clickable and redirect to a recipe page.

Each recipe card should have: NAME | MEAL TYPE | CUISINE | RATING | (Optional images).

First thing I should solve is that the adding of tasks works, and that they display correctly in the table.

-   Clicking 'add recipe' should open a modal where you can input the relevant information.
-   Recipes will then appear in the list and will be dynamically searchable. You should be able to open a pop-over which opens a bigger version of the recipe upon click. From there, you can edit the fields too.
-   There should be sorting based on NAME, MEAL TYPE, CUISINE and RATING.

## 2023-10-24

### How to structure app

On the browse page, users should be able to add recipes.

On the recommendation page, users should see recommendations for recipes and be able to filter accordingly.

On the browse page, a user should be able to add a recipe. On the home page, a user should too. I need to create a component for adding recipes.

The recipe add flow should be:

-   Add recipe button which opens modal.
-   Modal has form with fields for name, description, ingredients, instructions, image.
-   On submit, recipe is added to database and user is redirected to recipe page.
-   List of recipes on home page should be clickable and redirect to recipe page, has seamless editing.

Architecturally I need to:

-   [x] Create a writable store for recipes
-   [x] Create a Supabase database for recipes
-   [x] Initialize the Supabase database and set the recipe store to it
-   [x] Subscribe to Supabase updates and update the store accordingly

With respect to Supabase updates:

If the primary database I work with is the Svelte store, then I can update the Supabase db with any local changes. That way I don't need the real-time listener as the first place to input will be the local store. And I'll initialize that local store upon mount and then set up a subscribe to it which will update the Supabase db.

## 2023-10-23

-   [x] Standardize form styling across Auth, /login, /reset, /register.
-   [x] Add redirects after form submission and/or success messages.
-   [x] Get modal functional on /login and /register.
-   [ ] Study fetch methods more. Understand client-side logic.

Today I better learned the difference between server and client-side functions and rendering, as well as about how objects can be returned -- and how you can call an internal API using a fetch method.

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
