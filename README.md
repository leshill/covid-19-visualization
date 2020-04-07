# Visualizing Covid-19 case counts by county in the US

The New York Times is providing data files with the cumulative counts of Covid-19 cases in the United States, at the state and county level. [Covid-19 Map](https://covid-19-map.leshill.org) is a visualization of that data over time.

"On day one, no one you know is sick. It feels like a normal day. It may stay like this for a long time until, one day, a few people you know are sick. And suddenly a few days later it will seem like everyone is sick, and it will feel like it happened instantly. Everything looks fine until it isn't fine. This is the paradox of pandemics."

&mdash; Dr. Joe Hanson [@DrJoeHanson](https://twitter.com/DrJoeHanson) on the **You Are Not So Smart** podcast, [episode 177](https://youarenotsosmart.com/2020/04/05/yanss-177-why-people-waited-so-long-to-take-precautions-against-covid-19-how-to-better-persuade-those-who-still-refuse-and-how-to-take-bettercare-of-your-mental-health-during-isolation/) by David McRaney [@davidmcraney](https://twitter.com/davidmcraney)

Made with :heart: in Seattle by [@leshill](https://twitter.com/leshill)

## FAQ

### Why is the scale for the colors `logN`?

Epidemiologists point out that the numbers reported for the US are known to be
problematic due to very limited testing of the population (still true as of this
commit). Once testing is happening on a wide scale across the US, case counts
(and even death counts) will be more representative of the actual spread. The
choice of `logN` seems a reasonable compromise to show incremental jumps as the
numbers increase, particularly at the smaller end of the scale.

Disclaimer: I am not a data scientist or an epidemiologist.

### What about the data for Kansas City and New York City?

The NYT data has handled these two cities differently than other data. Check the
NYT repo for more details, the app does the following:

In the case of NYC, the data is reported for the entire city (and not for each
of the five boroughs). Unfortunately, the map shows the five boroughs. Rather
than attempt to split the count into 5, each borough is shown with the total
for NYC. NYC should be considered equivalent to other counties.

In the case of KC, the data is reported for the entire city across four
counties, and for each of the four counties _excluding_ the city. Not ideal. For
now, the data from the city is added to the count for each county. An alternative
would be to sum up the counties and the city and use that total across the four
counties and consider KC equivalent to other counties.

Hmmm, I should probably do that :upside\_down\_face:

## Colophon

**Covid-19 Map** is an example of a JAM-stack app&mdash; **J**avaScript **A**PI and **M**arkup.

The app is built with React, Redux, and Redux Sagas. The source code is TypeScript.

The data is pulled from the GitHub API.

The HTML is styled with Bootstrap.

There are no tests :scream_cat: !?!

## Acknowledgment

Thank you [@nytimes](https://twitter.com/nytimes) for making [covid-19-data](https://github.com/nytimes/covid-19-data) available.

This code is licensed as [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
