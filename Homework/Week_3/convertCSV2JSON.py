import pandas as pd


def csv_to_json(csv_file, headerlines, columns, index):
    '''
    Imports data from a csv file to a DataFrame using the pandas library and
    converts it to a JSON object
    '''
    data = pd.read_csv(csv_file, header=headerlines, usecols=columns)

    data.set_index(index, inplace=True)
    data.to_json(r'data.json', orient='index')
    return data


if __name__ == '__main__':
    data = csv_to_json('windstootdata.csv', 9, ['YYYYMMDD', 'FXX'], 'YYYYMMDD')
