-- Start fresh if trigger exist
DROP TRIGGER IF EXISTS tg_timestamp_update ON tbl_dubbing_cues_monolithic CASCADE;

-- Update timestamps for entries
CREATE TRIGGER tg_timestamp_update BEFORE UPDATE
ON tbl_dubbing_cues_monolithic FOR EACH ROW
EXECUTE PROCEDURE fnc_timestamp_update();