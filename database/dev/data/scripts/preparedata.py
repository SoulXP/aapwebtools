#!/usr/bin/env python3

import os
import re
import postgresql.driver as pg

# TODO: User input
# TODO: Error handling for arguments parsing

# TODO: Error handling for bad tc string
def tc_to_float(tc, frame_rate):
    chunks = re.findall('\d+', tc)
    h = float(chunks[0]) * 60.0 * 60.0
    m = float(chunks[1]) * 60.0
    s = float(chunks[2])
    f = float(chunks[3]) / frame_rate

    return (h + m + s + f) * 10000000.0 # Create a precision constant for this

# Helper functions
def cuedata_from_file(path, production=''):
    # TODO: Error checking for path before opening
    entries = []
    prod_name = prod_id = ep = character = cue = ''
    age_lo = age_hi = tc_in = tc_out = 0

    with open(path, 'r') as f:
        lines = f.readlines()
        for line in lines:
            fields = [s.strip() for s in line.split(sep='\t')]

            # TODO: Error checking on anomalies/fault txt files
            for i in range(5):
                if i == 0:
                    prod_id, ep = [s.strip() for s in fields[0].split(sep=' ')]
                elif i == 1:
                    character, _, age_range = [s.strip() for s in fields[1].split(sep=' ')]
                    ages = age_range.split(sep='-')
                    age_lo = int(ages[0].strip()[2:])
                    age_hi = int(ages[1].strip()[:-1])
                elif i == 2:
                    _, _, tc_in_ = [s.strip() for s in fields[2].split(sep=' ')]
                    tc_in = tc_to_float(tc_in_, 25) # TODO: Accomodate for different frame rates
                elif i == 3:
                    _, _, tc_out_ = [s.strip() for s in fields[3].split(sep=' ')]
                    tc_out = tc_to_float(tc_out_, 25) # TODO: Accomodate for different frame rates
                elif i == 4:\
                    # TODO: Escape special characters
                    cue = fields[4].strip().replace("'", "''")


                entry = { 'prod': production, 'code': prod_id, 'ep': ep, 'character': character, 'line': cue, 'age': [age_lo, age_hi], 'tc': [tc_in, tc_out] }

            entries.append(entry)

    return entries

def prepare_insertion(data):
    entry = value = ''
    i = j = 0

    for d in data:
        value = '('

        for k in d:
            v = ''

            if k == 'prod' or k == 'code' or k == 'ep' or k == 'character' or k == 'line':
                v = '\'' + str(d[k]) + '\''

            elif k == 'age' or k == 'tc':
                tc_in = str(d[k][0])
                tc_out = str(d[k][1])
                v = f'ARRAY [{tc_in}, {tc_out}]'

            if j < len(d) - 1:
                value = value + v + ', '

            else:
                value = value + v + ')'
            j = j + 1

        if i < len(data) - 1: entry = entry + value + ','
        else: entry = entry + value

        i = i + 1
        j = 0
        
    return f'INSERT INTO tbl_dubbing_cues_monolithic(project_name, project_identifier, project_segment, character_name, prepared_cue, age_range, timeline_values) VALUES {entry}'

# Prepare database login
# TODO: Defaults if environment is not configured
try:
    db_env = {
        'database': os.getenv(key='AWTDBNAME_DEV'),
        'host': os.getenv(key='AWTDBHOST_DEV'),
        'port': os.getenv(key='AWTDBPORT_DEV'),
        'user': os.getenv(key='AWTDBUSER_DEV'),
        'password': os.getenv(key='AWTDBPASS_DEV')
    }
except Exception as e:
    print(e)

# Establish connection to database
db = pg.connect(
    database = db_env['database'],
    host = db_env['host'],
    port = db_env['port'],
    user = db_env['user'],
    password = db_env['password']
)

# Get cue data
path = '/Users/stefan/dev/projects/aapwebtools/database/dev/data/resources/oscar.txt'
data = cuedata_from_file(path, 'THE PIER')
query = prepare_insertion(data)
# print(query)

# Insert into database
ps = db.prepare(prepare_insertion(data))
results = ps()
print(results)