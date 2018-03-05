import pandas as pd
import re

def get_crime_occurrences(crime_type, month):
  print('Crime type:', crime_type, 'Month:', month, 'Occurrences:',
    len(manhattan_data[(manhattan_data['PD_DESC'] == crime_type) & (manhattan_data['CMPLNT_FR_DT'] == month)])
    )

# Read csv file.
data = pd.read_csv('NYPD_Complaint_Data_Historic.csv')

# Drop rows where CMPLNT_FR_DT column has NaN values.
data = data.dropna(subset=['CMPLNT_FR_DT'], how='any')

# Drop rows where PD_DESC has NaN values.
data = data.dropna(subset=['PD_DESC'], how='any')

# Get crimes that happened in 2016.
data = data[data['CMPLNT_FR_DT'].str.contains('2015')]

data['PD_DESC'] = data['PD_DESC'].astype(str)
data = data[['PD_DESC', 'BORO_NM', 'CMPLNT_FR_DT']]

months = data['CMPLNT_FR_DT']

# Some string processing operations
data = data.applymap(lambda x: x.split(',')[0])
# data['PD_DESC'] = data['PD_DESC'].map(lambda x: re.sub("\d+", "", x))
data['PD_DESC'] = data['PD_DESC'].map(lambda x: re.sub('[^A-Za-z]+', ' ', x))

# data['PD_DESC'] = data['PD_DESC'].map(lambda x: x if x.isalpha() else '')
data['CMPLNT_FR_DT'] = data['CMPLNT_FR_DT'].map(lambda x: x.split('/')[0])
# data = data[data['PD_DESC'] != '']

# print(data)
# Most common 5 crimes in Manhattan
manhattan_data = data[data['BORO_NM'] == 'MANHATTAN']
print(manhattan_data['PD_DESC'].value_counts())

data = data.drop_duplicates('PD_DESC')
crime_types = []

for row in data.iterrows():
    index, item = row
    crime_types.append(item.tolist())

# print(crime_types)

# Calculate the total number of occurrences for each of these 5 types in each month of 2016.
types = ['LARCENY', 'HARASSMENT', 'ASSAULT', 'AGGRAVATED HARASSMENT', 'ROBBERY']
months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

for type in types:
  for month in months:
    get_crime_occurrences(type, month);

# print(manhattan_data[(manhattan_data['PD_DESC'] == 'LARCENY') & (manhattan_data['CMPLNT_FR_DT'] == '12')])