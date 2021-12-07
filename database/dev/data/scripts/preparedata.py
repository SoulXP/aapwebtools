#!/usr/bin/env python3

import os
import re
import argparse
import datetime
import postgresql.driver as pg

# TODO: Error handling for arguments parsing
# Input arguments
parser = argparse.ArgumentParser(description='prepares EDL data for database insertion')
parser.add_argument('--path', '-p', required=True, help='path containing EDL data files', nargs='+', dest='path', metavar='<path>')
args = vars(parser.parse_args())

# TODO: Error handling for bad tc string
def tc_to_float(tc, frame_rate):
    chunks = re.findall('\d+', tc)
    h = float(chunks[0]) * 60.0 * 60.0
    m = float(chunks[1]) * 60.0
    s = float(chunks[2])
    f = float(chunks[3]) / frame_rate

    return (h + m + s + f) * 10000000.0 # Create a precision constant for this

# Helper functions
def cuedata_from_file(path, format='db', production=''):
    # TODO: Error checking for path before opening
    entries = []
    prod_name = prod_id = catalgoue = ep = character = cue = ''
    age_lo = age_hi = tc_in = tc_out = 0
    frame_rate = 25 # TODO: Default to 0 and handle if not found in EDL
    tick_rate = 0.0


    with open(path, 'r') as f:
        lines = f.readlines()

        if format == 'table':
            for line in lines:
                fields = [s.strip() for s in line.split(sep='\t')]

                # TODO: Error checking on anomalies/fault txt files
                for i in range(5):
                    if i == 0:
                        prod_id, ep = [s.strip() for s in fields[0].split(sep=' ')]
                    elif i == 1:
                        character, _, age_range = [s.strip().replace("'", "''") for s in fields[1].split(sep=' ')]
                        ages = age_range.split(sep='-')
                        age_lo = int(ages[0].strip()[2:])
                        age_hi = int(ages[1].strip()[:-1])
                    elif i == 2:
                        _, _, tc_in_ = [s.strip() for s in fields[2].split(sep=' ')]
                        tc_in = tc_to_float(tc_in_, frame_rate) # TODO: Accomodate for different frame rates
                    elif i == 3:
                        _, _, tc_out_ = [s.strip() for s in fields[3].split(sep=' ')]
                        tc_out = tc_to_float(tc_out_, frame_rate) # TODO: Accomodate for different frame rates
                    elif i == 4:\
                        # TODO: Escape special characters
                        cue = fields[4].strip().replace("'", "''")


                    entry = { 'prod': production, 'code': prod_id, 'catalogue': 'MONOLITH', 'ep': ep, 'character': character, 'line': cue, 'age': [age_lo, age_hi], 'tc': [tc_in, tc_out], 'framerate': frame_rate, 'tickrate': tick_rate }

                entries.append(entry)

        elif format == 'db':
            for line in lines:
                fields = [s for s in line.split(sep='&&')]
                
                prod_name = fields[0].strip()
                prod_id = fields[1].strip()
                catalogue = fields[2]
                ep = fields[3].strip()
                character = fields[4].strip().replace("'", "''")
                frame_rate = float(fields[7].strip())
                tick_rate = float(fields[8].strip())
                tc_in = tc_to_float(fields[5].strip(), frame_rate)
                tc_out = tc_to_float(fields[6].strip(), frame_rate)
                age_lo = int(fields[9].strip())
                age_hi = int(fields[10].strip())
                cue = fields[11].strip().replace("'", "''")

                entry = { 'prod': prod_name, 'code': prod_id, 'catalogue': catalogue, 'ep': ep, 'character': character, 'line': cue, 'age': [age_lo, age_hi], 'tc': [tc_in, tc_out], 'framerate': frame_rate, 'tickrate': tick_rate }
                entries.append(entry)
        else:
            raise Exception('please pass a valid format type to parse cue data')


    return entries

def prepare_insertion(data):
    entry = value = ''
    i = j = 0

    for d in data:
        value = '('

        for k in d:
            v = ''

            if k == 'prod' or k == 'code' or k == 'ep' or k == 'character' or k == 'line' or k == 'catalogue':
                v = '\'' + str(d[k]) + '\''

            elif k == 'age' or k == 'tc':
                lo = str(d[k][0])
                hi = str(d[k][1])
                v = f'ARRAY [{lo}, {hi}]'

            elif k == 'framerate' or k == 'tickrate':
                v = str(d[k])

            if j < len(d) - 1:
                value = value + v + ', '

            else:
                value = value + v + ')'
            j = j + 1

        if i < len(data) - 1: entry = entry + value + ','
        else: entry = entry + value

        i = i + 1
        j = 0
        
    return f'INSERT INTO tbl_dubbing_cues_monolithic(project_name, project_identifier, project_catalogue, project_segment, character_name, prepared_cue, age_range, timeline_values, frame_rate, tick_rate) VALUES {entry}'


def main():
    # TODO: Defaults if environment is not configured
    try:
        # Fetch environment variables
        enable_logging = True
        log_path = os.getenv(key='AWTLOGPATH_DEV')
        if log_path == '': enable_logging = False

        db_env = {
            'database': os.getenv(key='AWTDBNAME_DEV'),
            'host': os.getenv(key='AWTDBHOST_DEV'),
            'port': os.getenv(key='AWTDBPORT_DEV'),
            'user': os.getenv(key='AWTDBUSER_DEV'),
            'password': os.getenv(key='AWTDBPASS_DEV')
        }

        # Establish connection to database
        db = pg.connect(
            database = db_env['database'],
            host = db_env['host'],
            port = db_env['port'],
            user = db_env['user'],
            password = db_env['password']
        )

        # Prepare data and insert into database
        for p in args['path']:
            # Handle single files
            if os.path.isfile(p):
                data = cuedata_from_file(p, format='db')
                ps = db.prepare(prepare_insertion(data))
                results = ps()
            # Handle directory
            elif os.path.isdir(p):
                files = os.listdir(p)
                for f in files:
                    data = cuedata_from_file(f'{p}/{f}', format='db')
                    ps = db.prepare(prepare_insertion(data))
                    results = ps()

            else:
                raise Exception('options specified in path variable is neither a file nor directory')

    except Exception as e:
        if enable_logging:
            t = datetime.datetime.now().strftime('%m%d%Y_%H%M%S')

            log_file = f'{log_path}/preparedata_{t}.log'
            with open(f'{log_file}', 'w') as f:
                print (e)
                print(f'[ERROR] a log has been saved to: {log_file}')
                f.write(str(e))
                f.close()

if __name__ == '__main__': main()