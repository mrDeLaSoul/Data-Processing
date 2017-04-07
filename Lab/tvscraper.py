#!/usr/bin/env python
# Name:
# Student number:
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # Initialize list that stores all tv-shows
    imdb = []

    # Loop through tv-shows in the target url
    for tvshows in dom("div.lister-item-content")[:50]: # Top 50 IMDB tv-shows.

        # Initialize list to store the film information
        tv_shows = []

        # Initialize list to store the lead actors/actresses
        stars = []

        # Store lead actors/actresses in list
        for cast in tvshows("p a"):
            stars.append(cast.content.encode(encoding='UTF-8', errors='stricts'))
        # Convert the elements in list stars to a single string and seperate with a comma
        strstars = ', '.join(stars)

        # Add TV title, Rating, Genre, Lead Actor/Actresses, Runtime to the list tv_shows.
        tv_shows.extend(((tvshows("h3 a").content.encode(encoding='UTF-8', errors='stricts')),
                    (tvshows("div.ratings-bar strong").content.encode(encoding='UTF-8', errors='stricts')),
                    (tvshows("p span.genre").content.encode(encoding='UTF-8', errors='stricts').lstrip('\n').rstrip()),
                    (strstars),
                    (tvshows("span.runtime").content.encode(encoding='UTF-8', errors='stricts').rstrip(' min'))))

        # Store list containing tv-shows information in list imdb
        imdb.append(tv_shows)

    return imdb


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # Loop through lists in tvseries and write the lists to the csv file
    for series in tvseries:
        writer.writerow(series)


if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)