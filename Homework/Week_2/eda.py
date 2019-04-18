# Name: Max Frings
# Student number: 10544429
"""
This script reads data from a csv file and performs and visualizes different calculations such as the mean and the five number summary.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


def import_data():
    '''
    Reads country data from a csv file and imports it into a pandas DataFrame,
    replaces 'unknown' with NaN and returns the DataFrame
    '''
    country_data = pd.read_csv('input.csv',
                               usecols=['Country', 'Region',
                                        'Pop. Density (per sq. mi.)',
                                        'Infant mortality (per 1000 births)',
                                        'GDP ($ per capita) dollars'])

    # Replace 'unknown' with NaN, this is convention and allows for operations
    country_data.replace('unknown', np.nan)

    # Set index of dataset to 'Country'
    country_data.set_index('Country', inplace=True)

    return country_data


def mean_median_mode_std(data):
    '''
    Calculates the mean, median, mode and standard deviation of a dataset and
    returns the dataset with outliers more than 3 std's removed
    '''
    # Make 'GDP ($ per capita) dollars' column numeric and remove strings
    data = data.str.replace(r"[a-zA-Z]", '')
    data = pd.to_numeric(data, errors='coerce')

    # Remove outliers that are more than 3 standard deviations away
    data = data.mask((data - data.mean()) > 3 * data.std())

    # Calculate mean, median, mode and standard deviation
    data_mean = round(data.mean(), 2)
    data_median = int(data.median())
    data_mode = int(data.mode()[0])
    data_std = round(data.std(), 2)

    # Print results
    print('\n' +
          'Mean, median, mode and standard deviation of GDP / capita in USD' +
          f'\nThe mean is {data_mean}\n' +
          f'The median {data_median}\n' +
          f'The mode is {data_mode}\n' +
          f'The standard deviation is {data_std}\n\n')

    return data


def visualize_distribution(data):
    '''
    Plots the distribution of GDP data
    '''
    # Style the plots in a more visually appealing way
    plt.style.use('Solarize_Light2')

    # Sets size of visualization window to fit plots elegantly
    plt.rcParams["figure.figsize"] = [10, 6]

    # Create a histogram of GDP data
    data.hist(bins=40, rwidth=0.9)
    plt.title('Histogram of GDP per capita in USD')
    plt.xlabel('GDP in USD', weight='bold')
    plt.ylabel('Frequency', weight='bold')
    plt.show()

    return


def five_number_summary(data):
    '''
    Calculates the five number summary of a dataset
    '''
    # Converts the infant mortality data to numeric format for calculations
    data.replace(regex=True, inplace=True, to_replace=r',', value=r'.')
    data = pd.to_numeric(data, errors='coerce')

    # Five Number Summary for infant mortality
    five_numsum = data.describe()
    data_min = round(five_numsum['min'], 2)
    data_q1 = round(five_numsum['25%'], 2)
    data_median = round(five_numsum['50%'], 2)
    data_q3 = round(five_numsum['75%'], 2)
    data_max = round(five_numsum['max'], 2)

    # Print results
    print('Five Number Summary for infant mortality (per 1000 births)\n' +
          f'The minimum rate {data_min}\n' +
          f'The first quartile is {data_q1}\n' +
          f'The median is {data_median}\n' +
          f'The third quartile is {data_q3}\n' +
          f'The maximum rate is {data_max}')


def visualize_boxplot(data):
    '''
    Shows a boxplot of the data
    '''
    # Converts the infant mortality data to numeric format for calculations
    data['Infant mortality (per 1000 births)'] = pd.to_numeric(
                                                 data['Infant mortality ' +
                                                      '(per 1000 births)'],
                                                 errors='coerce')

    # Show a boxplot of the data
    data.boxplot(column='Infant mortality (per 1000 births)', notch=True)
    plt.yticks(np.arange(0, 200.1, 10))
    plt.ylabel('Infant mortality (per 1000 births)', weight='bold')
    plt.title('Boxplot of infant mortality')

    # Remove panda's auto-generated subtitle
    x_axis = plt.axes().axes.get_xaxis()
    x_axis.set_visible(False)

    plt.show()


def write_to_json(data):
    '''
    Converts a pandas DataFrame to a JSON object and writes it to a new file
    '''
    # Write data to a JSON file with Country as the index
    data.to_json(r'country_data.json', orient='index')


if __name__ == '__main__':
    country_data = import_data()
    GDP_data = mean_median_mode_std(country_data['GDP ($ per capita) dollars'])
    visualize_distribution(GDP_data)
    five_number_summary(country_data['Infant mortality (per 1000 births)'])
    visualize_boxplot(country_data)
    write_to_json(country_data)
