import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


# Import data into a pandas DataFrame
country_data = pd.read_csv('input.csv')

# Drop unnecessary data to save space and potentially also runtime
columns_to_drop = ['Population', 'Area (sq. mi.)',
                   'Coastline (coast/area ratio)',
                   'Net migration', 'Literacy (%)', 'Phones (per 1000)',
                   'Arable (%)', 'Crops (%)', 'Other (%)', 'Climate',
                   'Birthrate', 'Deathrate', 'Agriculture', 'Industry',
                   'Service']

country_data.drop(columns_to_drop, inplace=True, axis=1)

# Replace 'unknown' with NaN, this is convention and it allows for operations
country_data.replace('unknown', np.nan)

# Make 'GDP ($ per capita) dollars' column numeric and remove strings
GDP_data = country_data['GDP ($ per capita) dollars']
GDP_data = GDP_data.str.replace(r"[a-zA-Z]", '')
GDP_data = pd.to_numeric(GDP_data, errors='coerce')

# Calculate mean, median, mode and standard deviation
GDP_mean = round(GDP_data.mean(), 2)
GDP_median = int(GDP_data.median())
GDP_mode = int(GDP_data.mode()[0])
GDP_std = round(GDP_data.std(), 2)

# Print results
print('\n' +
      'Mean, median, mode and standard deviation of GDP per capita in USD' +
      f'\nThe mean is ${GDP_mean}\n' +
      f'The median ${GDP_median}\n' +
      f'The mode is ${GDP_mode}\n' +
      f'The standard deviation is {GDP_std}\n\n')

# Remove outliers from GDP data that are more than 3 standard deviations away
GDP_data = GDP_data.mask((GDP_data - GDP_mean) > 3 * GDP_std)

# Style the plots in a more visually appealing way
plt.style.use('Solarize_Light2')

# Sets size of visualization window to be large enough to fit plots elegantly
plt.rcParams["figure.figsize"] = [10, 6]

# Create a histogram of GDP data
GDP_data.plot.hist()
plt.title('Distribution of GDP per capita in USD')
plt.xlabel('GDP of a country in USD')
plt.ylabel('Frequency')
plt.show()

# Converts the infant mortality data to numeric format for calculations
infant_mortality = country_data['Infant mortality (per 1000 births)']
infant_mortality = pd.to_numeric(infant_mortality, errors='coerce')

# Five Number Summary for infant mortality
infant_mortality_min = infant_mortality.min()
infant_mortality_q1 = infant_mortality.quantile(0.25)
infant_mortality_q3 = infant_mortality.quantile(0.75)
infant_mortality_max = infant_mortality.max()

# Print results
print('Five Number Summary for infant mortality (per 1000 births)\n' +
      f'The minimum rate {infant_mortality_min}\n' +
      f'The first quartile is {infant_mortality_q1}\n' +
      f'The third quartile is {infant_mortality_q3}\n' +
      f'The maximum rate is {infant_mortality_max}')

# Plot infant mortality results
infant_mortality.plot.box()
plt.ylabel('Infant deaths')
plt.title('Boxplot of infant mortality worldwide')
plt.show()

# Write data to a JSON file with Country as the index
country_data.set_index('Country', inplace=True)
country_data.to_json(r'country_data.json', orient='index')
