import pandas as pd

# Read csv file.
data = pd.read_csv('NYPD_Complaint_Data_Historic.csv')

# Drop rows where CMPLNT_FR_DT column has NaN values.
data = data.dropna(subset=['CMPLNT_FR_DT'], how='any')

# Get crimes that happened in 2016.
data = data[data['CMPLNT_FR_DT'].str.contains('2016')]

# Keep only the column which shows the location of the crime.
data = data[['BORO_NM']]

# Count number of entries in each location.
print(data['BORO_NM'].value_counts())

# Calculate fraction (%) for each location.
BOROUGH_NAMES = {'BRONX':round(103750 / 468290, 2), 'QUEENS':round(92392 / 468290, 2), 'MANHATTAN':round(112919 / 468290, 2),
                  'BROOKLYN':round(137851 / 468290, 2), 'STATEN ISLAND':round(21378 / 468290, 2)}

# Print calculated result.
print(BOROUGH_NAMES)