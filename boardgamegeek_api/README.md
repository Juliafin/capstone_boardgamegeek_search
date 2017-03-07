##FEWD Capstone Project: Board game search powered by BoardgameGeek and Youtube Apis

#What motivated me with this project:

Board games have always been my most favorite hobby. Also, it has been the way that I've kept up with my friends. Every sunday (which I would look forward to all week), I would organize a game night at my place and teach my friends the newest boardgame that I just got from kickstarter. And I would discover these games from the BoardgameGeek website. But I was very surprised to find that the interface left much to be desired. I wanted to design a clean usable interface that also provided quite a bit of the information from the BoardgameGeek Api, the largest database of boardgames in the world, while also wishing to see youtube playthroughs and reviews of each boardgame without having to do a separate search.

#The process:

When I started this Capstone project, I never imagined the difficulties I would face. The very first one, was a CORS error, and I had no idea what CORS even was at that point. And so I started researching. I found a way to use a proxy to get past the CORS error and implemented that code. The second biggest obstacle, and the one that required the most time, was the fact that the BoardgameGeek API was in XML format. XML led to many problems due to the fact that various bits of data were either missing (in general), or were formatted differently (arrays and objects) for various elements in each top level object. To make this even more difficult, the API actually used different end points for different data, and I had to find ways of chaining together my Ajax calls so that I was able to get the correct data.

A great deal of time was spent compensating for the uneven data, which I found to be valuable experience in dealing with these issues. Once I had finished sorting through the data and aggregating it in a state object, the work on the css and html began. I created an initial wireframe with a basic layout while I proceeded to implement rendering of the data I collected. Considering that there were so many statistics, and that each specific board game had different levels of detail in the data, I decided that the best way to display all of the details was not to do it on a main page (the way the BoardgameGeek website had done it), but to have each boardgame article expand into a lightbox that would contain that info. To complete the look of the page, I decided to look at modern designs and use them for inspiration. The main title image I used, was actually a photo that I took with my Nikon D90 (edited with photoshop), and I was quite happy with the results. The final bit of coding was implementation of error handling, the Hotlist (handled by a different api endpoint), and general clean up of the code.


#What this app does

Displays a hotlist of the top rated board games. Allows the user to search for a board game of their choice. When the user clicks on one of the search results, they are shown additional statistics for that board game as well as a youtube video related to that game.

#Technology used:
-html
-css
-javascript
-jquery-3
-canvas api
-ajax
-boardgameGeek api
-youtube api
