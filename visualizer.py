#!/usr/bin/env python
# Name: Max Frings
# Student number: 10544429
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# Initalize empty lists to store all ratings and averages in
all_ratings = []
all_averages = []

# Read ratings from csv and append to list
with open('movies.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for movie in reader:
        data_dict[movie['Year']].append(float(movie['Rating']))
        all_ratings.append(float(movie['Rating']))
csvfile.close()

# Stores the years and corresponding ratings in lists
years = list(data_dict.keys())
ratings = list(data_dict.values())

# Finds the average rating
for rating in ratings:
    all_averages.append(sum(rating) / len(rating))
average = sum(all_ratings) / len(all_ratings)

# Style the plots in a more visually appealing way
plt.style.use('Solarize_Light2')

# Sets size of visualization window to be large enough to fit both plots elegantly
plt.rcParams["figure.figsize"] = [14, 6]

# Visualizes average movie score per year using a line
plt.subplot(1, 2, 1)
plt.plot(years, all_averages, label = "Average rating per year")
plt.xlabel('Year')
plt.ylabel('Rating')
plt.title('Average of IMDB movie ratings')
plt.ylim(1, 10)
plt.legend()

# Visualizes average per year using dots, and the average over all years using a line
plt.subplot(1, 2, 2)
plt.scatter(years, all_averages, label = "Average rating per year")
plt.axhline(y=average, color='r', linestyle='-', label = "Average rating over all years")
plt.xlabel('Year')
plt.ylabel('Rating')
plt.title('Average of IMDB movie ratings')
plt.ylim(8, 9)
plt.legend()
plt.show()

if __name__ == "__main__":
    print(data_dict)
