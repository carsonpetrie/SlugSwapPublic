# CSE 187 - Group 5 Project Directory (Winter 2023)

This is the Wiki directory.
Our team consists of Betsy Brady, Vince Dinh, Carson Petrie, Liam Rooney, and Seth Stone. Here we will document our system design and features of our app.

## Design

Users will be able to buy, post, and sell listings.

Unauthenticated users will have the ability to view listings, but will have to sign up to buy, post, and communicate with sellers. 

## Home Page

The home page will consist of the main app bar, category listing bar, and show listings by most recently added.

The page visitor will be able to login and sign up through the respective buttons on the main app bar, and view listings filtered by categories through the category listing bar. 

Users can search, filter by category and subcategory, and share posts and user pages through links (supported by dynamic routing). 

## Authenticated Users

Authenticated users are able to create listings through the main app bar. 

Admins can log in through the admin app to create, update, and delete categories/subcategories, and suspend users. Moderators can log in through the moderator app to approve and flag listings. Moderators are also able to view listings on the web app through their account, regardless of the listing's flagged status. 

## Microservices

Images - (3011)
Account - (3012)
Categories - (3013)
Listings - (3014)
