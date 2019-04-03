#!/usr/bin/env python
# Name:
# Student number:
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
import re
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    movies = []

    all_titles = []
    all_years = []
    all_ratings = []
    all_runtimes = []
    all_stars = []

    titles = dom.find_all('h3')
    for title in titles:
        try:
            this_title = title.a.text
        except AttributeError:
            break
        print(title.a.text)
        all_titles.append(title.a.text)

    all_years = []
    hthree = dom.find_all('h3')

    for years in hthree:
        this_year = years.find(class_="lister-item-year text-muted unbold")
        try:
            year = this_year.text
            year = year.strip('(')
            year = year.strip(')')
        except AttributeError:
            break
        all_years.append(year)

    ratings = dom.find_all(class_="inline-block ratings-imdb-rating")
    for rating in ratings:
        print(rating['data-value'])
        all_ratings.append(rating['data-value'])

    runtimes = dom.find_all(class_="runtime")
    for runtime in runtimes:
        print(runtime.text)
        all_runtimes.append(runtime.text)

    stars = dom.find_all(text=re.compile('Stars')) # stars

    actors = []
    for star in stars:
        nextstar = star.next_sibling
        while True:
            try:
                tag = nextstar.name
            except AttributeError:
                tag = ""
            if (tag == 'a'):
                actors.append(nextstar.text)
                nextstar = nextstar.next_sibling.next_sibling
            else:
                break
        all_stars.append(actors)
        actors = []




    print(len(all_titles))
    print(len(all_years))
    print(len(all_ratings))
    print(len(all_runtimes))
    print(len(all_stars))





    all_movies = dom.find_all('div', {"class": "lister-item-content"})
    print(len(all_movies))

    actors = []
    all_stars = []
    counter = 0
    for movie in all_movies:
        star = movie.find(text=re.compile('Stars'))
        if star == None:
            print("no stars")
            all_stars.append("")
            counter += 1
        else:
            counter += 1
            nextstar = star.next_sibling
            while True:
                try:
                    tag = nextstar.name
                except AttributeError:
                    tag = ""
                if (tag == 'a'):
                    actors.append(nextstar.text)
                    nextstar = nextstar.next_sibling.next_sibling
                else:
                    break
            all_stars.append(actors)
            actors = []


    print(len(all_stars))
    print(counter)
    print(all_stars)

    for title, year, rating, runtime, stars in zip(all_titles, all_years, all_ratings, all_runtimes, all_stars):
        movies.append({'title':title, 'rating':rating, 'year':year, 'stars':stars, 'runtime':runtime,})

    print(len(movies))

    for movie in movies:
        # write to csv

        import csv






    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED MOVIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    return movies   # REPLACE THIS LINE AS WELL IF APPROPRIATE


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    for movie in movies:
        print("write")
        row = [movie['title'], movie['rating'], movie['year'], movie['stars'], movie['runtime']]
        print(row)
        writer.writerow(row)

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE MOVIES TO DISK


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
