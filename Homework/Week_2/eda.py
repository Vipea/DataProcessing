import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from scipy import stats

# Set pandas options to print all rows and columns # !!!
pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)


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

# Replace 'unknown' with NaN, as this is convention and it allows for operations
country_data.replace('unknown', np.nan)

# Make 'GDP ($ per capita) dollars' column numeric and remove strings
GDP_data = country_data['GDP ($ per capita) dollars']
country_data['GDP ($ per capita) dollars'] = GDP_data.str.replace(
                                             r"[a-zA-Z]",'')

country_data['GDP ($ per capita) dollars'] = pd.to_numeric(
                                             GDP_data, errors='coerce')

print(country_data.head())



# Calculate mean, median, mode and standard deviation
GDP_mean = country_data['GDP ($ per capita) dollars'].mean()
GDP_median = country_data['GDP ($ per capita) dollars'].median()
GDP_mode = country_data['GDP ($ per capita) dollars'].mode()
GDP_std = country_data['GDP ($ per capita) dollars'].std()

print(f'GDP_mean {GDP_mean}')
print(f'GDP_median {GDP_median}')
print(f'GDP_mode {GDP_mode}')
print(f'GDP_std {GDP_std}')

# Remove outliers from GDP data
country_data['GDP ($ per capita) dollars'] = country_data[
                                             'GDP ($ per capita) dollars'].mask(
                                             (country_data[
                                             'GDP ($ per capita) dollars'] -
                                             GDP_mean) > 2 * GDP_std)

# Create a histogram of GDP data
country_data['GDP ($ per capita) dollars'].plot.hist()
plt.show()

# Five Number Summary for infant mortality
country_data['Infant mortality (per 1000 births)'] = pd.to_numeric(
                                             country_data['Infant mortality (per 1000 births)'], errors='coerce')

infant_mortality_min = country_data['Infant mortality (per 1000 births)'].min()
infant_mortality_q1 = country_data[
                      'Infant mortality (per 1000 births)'].quantile(0.25)
infant_mortality_q3 = country_data[
                      'Infant mortality (per 1000 births)'].quantile(0.75)
infant_mortality_max = country_data['Infant mortality (per 1000 births)'].max()

country_data['Infant mortality (per 1000 births)'].plot.box()
plt.show()

country_data.to_json(r'country_data.json')
# ??? how and what to clean

# ??? first read and then drop or only read necessary tables?

# ??? convert away from dtype?

# ??? what to do with unknown data field !: convert to Nan ?

# ??? why two modes

# !!! add titles etc to graphs

# add text to
