import pandas as pd
import re
import csv

csv_file = open('types.csv', 'w')
fieldnames = ['MONTH', 'LARCENY', 'HARASSMENT', 'ASSAULT', 'AGGRAVATED HARASSMENT', 'MARIJUANA']

writer = csv.writer(csv_file)
writer.writerow(fieldnames)

def get_crime_occurrences(crime_type, month):
  print('Crime type:', crime_type, 'Month:', month, 'Occurrences:',
    len(manhattan_data[(manhattan_data['PD_DESC'].str.contains(crime_type)) & (manhattan_data['CMPLNT_FR_DT'] == month)])
    )
  return len(manhattan_data[(manhattan_data['PD_DESC'].str.contains(crime_type)) & (manhattan_data['CMPLNT_FR_DT'] == month)])

def write_row(crime_type, month, nr):
  writer.writerow([month, crime_type, nr])

# Read csv file.
data = pd.read_csv('NYPD_Complaint_Data_Historic.csv')

# Drop rows where CMPLNT_FR_DT column has NaN values.
data = data.dropna(subset=['CMPLNT_FR_DT'], how='any')

# Drop rows where PD_DESC has NaN values.
data = data.dropna(subset=['PD_DESC'], how='any')

# Get crimes that happened in 2016.
data = data[data['CMPLNT_FR_DT'].str.contains('2016')]

data['PD_DESC'] = data['PD_DESC'].astype(str)
data = data[['PD_DESC', 'BORO_NM', 'CMPLNT_FR_DT']]

months = data['CMPLNT_FR_DT']

# Some string processing operations
data = data.applymap(lambda x: x.split(',')[0])
data['PD_DESC'] = data['PD_DESC'].map(lambda x: re.sub('[^A-Za-z]+', ' ', x))
data['CMPLNT_FR_DT'] = data['CMPLNT_FR_DT'].map(lambda x: x.split('/')[0])

# print(data)
# Most common 5 crimes in Manhattan
manhattan_data = data[data['BORO_NM'] == 'MANHATTAN']
print(manhattan_data['PD_DESC'].value_counts())

data = data.drop_duplicates('PD_DESC')
crime_types = []

for row in data.iterrows():
    index, item = row
    crime_types.append(item.tolist())

print(crime_types)

# Calculate the total number of occurrences for each of these 5 types in each month of 2016.
types = ['LARCENY', 'HARASSMENT', 'ASSAULT', 'AGGRAVATED HARASSMENT', 'MARIJUANA']
months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

larcenies = [];
harassments = [];
assaults = [];
aggr_harassments = [];
marijuana = [];

for type in types:
  for month in months:
    nr = get_crime_occurrences(type, month)
    if (type is 'MARIJUANA'):
      marijuana.append(nr);
    if (type is 'HARASSMENT'):
      harassments.append(nr);
    if (type is 'ASSAULT'):
      assaults.append(nr);
    if (type is 'AGGRAVATED HARASSMENT'):
      aggr_harassments.append(nr);
    if (type is 'LARCENY'):
      larcenies.append(nr);

list = [('MONTH', 'LARCENY', 'HARASSMENT', 'ASSAULT', 'AGGRAVATED HARASSMENT', 'MARIJUANA'),
        tuple(months),
        tuple(larcenies),
        tuple(harassments),
        tuple(assaults),
        tuple(aggr_harassments),
        tuple(marijuana)]


for m in months:
  print(writer)
  writer.writerow([m])

for i in larcenies:
  writer.writerow([i])