
import csv


FILENAME = 'live.csv'
countBreak = 1000000

with open(FILENAME, "r") as csvfile:
    datareader = csv.reader(csvfile)
    count = 0
    
    for row in datareader:
        if row[1] != 'ranked' and row[1] != 'Ranked':
            print(row)
        if row[12] != 'Standard' and row[12] != 'Wild':
            print(row)
        count += 1

        if count > countBreak:
            break