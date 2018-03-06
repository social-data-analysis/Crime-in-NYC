import pandas as pd
import re
import csv


# Read csv file.
# data = pd.read_csv('./data/NYPD_Complaint_Data_Historic.csv')
data = pd.read_csv('./data/NYPD_Complaint_Data_Historic.csv')

# Drop rows where CMPLNT_FR_DT column has NaN values.
data = data.dropna(subset=['CMPLNT_FR_DT'], how='any')
# data = data.dropna(subset=['OFNS_DESC'], how='any')
data = data.dropna(subset=['Latitude'], how='any')
data = data.dropna(subset=['Longitude'], how='any')
data = data.dropna(subset=['CMPLNT_FR_TM'], how='any')

# Get crimes that happened in 2016.
data = data[data['CMPLNT_FR_DT'].str.contains('2016')]

data = data[data['OFNS_DESC'].str.split(' ').str[0] == 'MURDER']

# Keep only these columns
data = data[['OFNS_DESC', 'Latitude', 'Longitude', 'CMPLNT_FR_TM']]
print(data)
# Count number of entries in each location.

data.to_csv('murders.csv', index_label='INDEX')
