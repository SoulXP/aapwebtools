-- Dev script to populate init tables
-------------------------------------

-- Populate raw EDL files
INSERT INTO tbl_dubbing_raw_ptxedl ( 
    vers,
    size,
    file_path,
    file_name,
    file_hash_sha512,
    timestamp_file_creation,
    timestamp_file_modified
) VALUES (
    'v1',
    100,
    '/path/to/edl/file',
    'edlfile.txt',
    '6b66423c335c1fcb10f216c29ba9d6787a8a14a84ca593daf9c2952960bb175b4eb5aaa4e259edadd1c1a1c3776efd34eb26969e04464461c41daefbded9a1b6',
    NOW(),
    NOW()
);

-- Populate raw EdiCue summary files
INSERT INTO tbl_dubbing_raw_edicuesummary (
    ptxedl_id,
    vers,
    size,
    file_path,
    file_name,
    file_hash_sha512,
    timestamp_file_creation,
    timestamp_file_modified
) VALUES (
    1,
    'v1',
    100,
    '/path/to/edl/file',
    'edlfile.txt',
    '6b66423c335c1fcb10f216c29ba9d6787a8a14a84ca593daf9c2952960bb175b4eb5aaa4e259edadd1c1a1c3776efd34eb26969e04464461c41daefbded9a1b6',
    NOW(),
    NOW()
);

-- Populate projects
INSERT INTO tbl_dubbing_projects (
    adrsummary_ids,
    project_type,
    identifier_internal,
    title_internal,
    title_external
) VALUES (
    ARRAY [1],
    'serial',
    'DEVPROJECT',
    'INTERNAL NAME',
    'EXTERNAL NAME'
);

-- Populate project segments (episodes)
INSERT INTO tbl_dubbing_project_segments (
    project_id,
    adrsummary_id,
    segment_id_internal,
    segment_id_external,
    content_document_name,
    content_document_hash_sha512
) VALUES (
    1,
    1,
    'EP01',
    'EP200',
    'file01.mov',
    '6b66423c335c1fcb10f216c29ba9d6787a8a14a84ca593daf9c2952960bb175b4eb5aaa4e259edadd1c1a1c3776efd34eb26969e04464461c41daefbded9a1b6'
);

-- Populate an episode with characters
INSERT INTO tbl_dubbing_characters ( project_id, adrsummary_id, internal_name, gender, age_range )
VALUES
( 1, 1, 'character 1', 'male', ARRAY[10, 20] ),
( 1, 1, 'character 2', 'male', ARRAY[10, 20] ),
( 1, 1, 'character 3', 'male', ARRAY[10, 20] ),
( 1, 1, 'character 4', 'male', ARRAY[10, 20] ),
( 1, 1, 'character 5', 'male', ARRAY[10, 20] ),
( 1, 1, 'character 6', 'female', ARRAY[10, 20] ),
( 1, 1, 'character 7', 'female', ARRAY[10, 20] ),
( 1, 1, 'character 8', 'female', ARRAY[10, 20] ),
( 1, 1, 'character 9', 'female', ARRAY[10, 20] ),
( 1, 1, 'character 10', 'female', ARRAY[10, 20] );

-- Populate all characters with cues
INSERT INTO tbl_dubbing_cues ( project_id, project_segment_id, adrsummary_id, character_id, prepared_cue, timeline_values )
VALUES
( 1, 1, 1, 1, 'this is a line 1', ARRAY[1000,2000] ),
( 1, 1, 1, 1, 'this is a line 2', ARRAY[1000,2000] ),
( 1, 1, 1, 1, 'this is a line 3', ARRAY[1000,2000] ),
( 1, 1, 1, 2, 'this is a line 4', ARRAY[1000,2000] ),
( 1, 1, 1, 2, 'this is a line 5', ARRAY[1000,2000] ),
( 1, 1, 1, 2, 'this is a line 6', ARRAY[1000,2000] ),
( 1, 1, 1, 3, 'this is a line 7', ARRAY[1000,2000] ),
( 1, 1, 1, 3, 'this is a line 8', ARRAY[1000,2000] ),
( 1, 1, 1, 3, 'this is a line 9', ARRAY[1000,2000] ),
( 1, 1, 1, 4, 'this is a line 10', ARRAY[1000,2000] ),
( 1, 1, 1, 4, 'this is a line 11', ARRAY[1000,2000] ),
( 1, 1, 1, 4, 'this is a line 12', ARRAY[1000,2000] ),
( 1, 1, 1, 5, 'this is a line 13', ARRAY[1000,2000] ),
( 1, 1, 1, 5, 'this is a line 14', ARRAY[1000,2000] ),
( 1, 1, 1, 5, 'this is a line 15', ARRAY[1000,2000] ),
( 1, 1, 1, 6, 'this is a line 16', ARRAY[1000,2000] ),
( 1, 1, 1, 6, 'this is a line 17', ARRAY[1000,2000] ),
( 1, 1, 1, 6, 'this is a line 18', ARRAY[1000,2000] ),
( 1, 1, 1, 7, 'this is a line 19', ARRAY[1000,2000] ),
( 1, 1, 1, 7, 'this is a line 20', ARRAY[1000,2000] ),
( 1, 1, 1, 7, 'this is a line 21', ARRAY[1000,2000] ),
( 1, 1, 1, 8, 'this is a line 22', ARRAY[1000,2000] ),
( 1, 1, 1, 8, 'this is a line 23', ARRAY[1000,2000] ),
( 1, 1, 1, 8, 'this is a line 24', ARRAY[1000,2000] ),
( 1, 1, 1, 9, 'this is a line 25', ARRAY[1000,2000] ),
( 1, 1, 1, 9, 'this is a line 26', ARRAY[1000,2000] ),
( 1, 1, 1, 9, 'this is a line 27', ARRAY[1000,2000] ),
( 1, 1, 1, 10, 'this is a line 28', ARRAY[1000,2000] ),
( 1, 1, 1, 10, 'this is a line 29', ARRAY[1000,2000] ),
( 1, 1, 1, 10, 'this is a line 30', ARRAY[1000,2000] );