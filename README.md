# DataProcessing
This repository includes all projects made for the Data Processing course at the University of Amsterdam

Link to GitHub pages: https://vipea.github.io/DataProcessing/

# Week 1
This program scrapes the top 50 movies from IMDB between 2008 and 2017, writes
them to a CSV file and visualizes the average movie scores per year.

Usage:

  First: run moviescraper.py

  Second: run visualizer.py

# Week 2
This program reads data from a CSV file and converts it to a Pandas DataFrame,
then calculates the mean, median, mode and standard deviation of GDP per capita
data and calculates the five number summary of infant mortality data. Lastly it
converts the DataFrame to a JSON file.

Usage: run eda.py

# Week 3
This program visualizes maximum wind gust in JSON format data using canvas. First the wind gust dataset in CSV format must be converted to a JSON file using convertCSV2JSON.py

Usage: convertCSV2JSON.py

Then the program reads the data and draws the graph using canvas, as shown when going to the index.html file in this folder.
