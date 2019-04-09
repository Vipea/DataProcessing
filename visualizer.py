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

all_ratings = []
with open('movies.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for movie in reader:
        data_dict[movie['Year']].append(float(movie['Rating']))
        all_ratings.append(float(movie['Rating']))
csvfile.close()

years = list(data_dict.keys())
ratings = list(data_dict.values())

moreyears=[]
all_averages = []

for c, rating in enumerate(ratings, 0):
    moreyears.append([years[c]] * len(rating))
    all_averages.append(sum(rating) / len(rating))

print(all_averages)

average = sum(all_ratings) / len(all_ratings)


plt.figure(1)
plt.scatter(years, all_averages, label = "Average rating per year")
plt.axhline(y=average, color='r', linestyle='-', label = "Average rating over all years")

plt.xlabel('Year')
plt.ylabel('Rating')
plt.title('Average of IMDB movie ratings')
plt.ylim(8,9)
plt.legend()

plt.show()



print("{:.2f}".format(sum(all_ratings) / len(all_ratings)))


if __name__ == "__main__":
    print(data_dict)
