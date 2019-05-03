import pandas as pd
import sys

def get_name():

   # Check if user provides 2 command line arguments
   if len(sys.argv) != 2:
       print("Usage: python convertCSV2JSON.py filename.csv")
       sys.exit()

   input_csv = sys.argv[1]

   return input_csv

def csv_to_json(csv_file, headerlines, index):
    '''
    Imports data from a csv file to a DataFrame using the pandas library and
    converts it to a JSON object
    '''
    data = pd.read_csv(csv_file)

    data.set_index(index, inplace=True)

    data.to_json(r'data.json', orient='index')
    return data


if __name__ == '__main__':
    data = csv_to_json(get_name(), 0, "Year")
