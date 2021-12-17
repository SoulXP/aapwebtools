#!/usr/bin/env python3

import os
import argparse

# TODO: Error handling for arguments parsing
# Input arguments
parser = argparse.ArgumentParser(description='prepares EDL data for database insertion')
parser.add_argument('--out', '-o', required=True, help='output path for generated file', nargs=1, dest='out', metavar='<out>')
args = vars(parser.parse_args())


def main():
    t = 'tbl_development_monolithic'

    c1 = 'project_name'
    c2 = 'project_identifier'
    c3 = 'project_catalogue'
    c4 = 'project_segment'
    c5 = 'character_name'
    c6 = 'prepared_cue'

    v1 = 'PROJECT'
    v2 = 'PID'
    v3 = 'CAT'
    v4 = 'SEG'
    v5 = 'NAME'
    v6 = 'CUE'

    list = []
    with open(args['out'][0], 'w') as f:
        for i in range(1000):
            list.append(f'INSERT INTO {t} ({c1}, {c2}, {c3}, {c4}, {c5}, {c6}) VALUES (\'{v1}\', \'{v2}\', \'{v3}\', \'{v4}\', \'{v5}\', \'{v6} {i}\');\n')
        
        f.writelines(list)

if __name__ == '__main__': main()