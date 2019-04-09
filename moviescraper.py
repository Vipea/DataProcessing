#!/usr/bin/env python
# Name: Max Frings
# Student number: 10544429
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
    Each movie entry contains the following fields:
    - Title
    - Rating
    - Year of release
    - Actors/actresses
    - Runtime
    """

    # Initialize empty list to store all movie data in
    movies = []

    # Find all movies in the webpage
    all_movies = dom.find_all('div', {"class": "lister-item-content"})

    # Loop over all movies and extract relevant data using BeautifulSoup
    for movie in all_movies:

        # Find movie title
        title = movie.find('h3')
        try:
            this_title = title.a.text
        except AttributeError:
            print("You are trying to extract the title, but no attribute \
                  'a.text' was found")
            break

        # Find production years of movie
        this_year = movie.find('span',
                               class_="lister-item-year text-muted unbold")
        try:
            this_year = this_year.text
            this_year = int(re.sub(r"\D", "", this_year))
        except AttributeError:
            print("You are trying to extract the production year, but no \
                  attribute 'text' was found")
            break

        # Find rating
        this_rating = float(movie.find(
                      class_="inline-block ratings-imdb-rating")['data-value'])

        # Find runtime
        runtime = movie.find(class_="runtime")
        try:
            this_runtime = runtime.text

            # Remove non-numeric characters and cast to integer
            this_runtime = int(re.sub('[^0-9]','', this_runtime))
        except AttributeError:
            print("You are trying to exract the runtime, but no attribute \
                  'text' was found")
            break

        # Find stars
        stars = ""
        star = movie.find(text=re.compile('Stars'))

        # Append an empty string if the movie has no stars listed
        if star == None:
            print("no stars")

        # Otherwise, loop over the stars in the movie and add them
        else:
            nextstar = star.next_sibling
            while True:
                try:
                    tag = nextstar.name
                except AttributeError:
                    stars = stars[:-2]
                    print("No more stars could be found, attribute 'name' \
                          was not found")
                    break
                if (tag == 'a'):
                    stars += f"{nextstar.text}, "
                    nextstar = nextstar.next_sibling.next_sibling
                else:
                    break

        movies.append({'title':this_title, 'rating':this_rating,
                       'year':this_year, 'stars':stars, 'runtime':this_runtime})

    return movies


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    for movie in movies:
        print("write")
        row = [movie['title'], movie['rating'], movie['year'], movie['stars'],
               movie['runtime']]
        print(row)
        writer.writerow(row)


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
        print('The following error occurred during HTTP GET request to\
               {0} : {1}'.format(url, str(e)))
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
